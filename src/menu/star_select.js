import { dl_ia_text_begin, dl_ia_text_end, dl_rgba16_text_begin, dl_rgba16_text_end } from "../bin/segment2"
import { GEO_CONTEXT_RENDER } from "../engine/graph_node"
import { AreaInstance as Area } from "../game/Area"
import { GameInstance as Game } from "../game/Game"
import { HUD_LUT_GLOBAL, IngameMenuInstance as IngameMenu, MENU_MTX_PUSH, MENU_SCROLL_HORIZONTAL } from "../game/IngameMenu"
import { cur_obj_scale, spawn_object_abs_with_rot } from "../game/ObjectHelpers"
import { save_file_get_star_flags, save_file_get_course_star_count, save_file_get_course_coin_score } from "../game/SaveFile"
import { G_MTX_MODELVIEW, gDPSetEnvColor, gSPDisplayList, gSPPopMatrix } from "../include/gbi"
import { MODEL_STAR, MODEL_TRANSPARENT_STAR } from "../include/model_ids"
import { oFaceAngleYaw, oStarSelectorSize, oStarSelectorTimer, oStarSelectorType } from "../include/object_constants"
import { TEXT_MYSCORE, TEXT_ZERO } from "../include/text_strings"
import { COURSE_NUM_TO_INDEX } from "../levels/course_defines"
import { dl_menu_ia8_text_begin, dl_menu_ia8_text_end, dl_menu_rgba16_wood_course } from "../levels/menu/leveldata"
import { seg2_act_name_table, seg2_course_name_table } from "../text/us/courses"

let sStarSelectorModels = [null, null, null, null, null, null, null, null]
let sLoadedActNum = 0
let sObtainedStars = 0
let sVisibleStars = 0
let sInitSelectedActNum = 0
let sSelectedActIndex = 0
let sSelectableStarIndex = 0
let sActSelectorMenuTimer = 0

const STAR_SELECTOR_NOT_SELECTED = 0
const STAR_SELECTOR_SELECTED = 1
const STAR_SELECTOR_100_COINS = 2

export const bhv_act_selector_star_type_loop = () => {
    const gCurrentObject = gLinker.ObjectListProcessor.gCurrentObject;

    switch (gCurrentObject.rawData[oStarSelectorType]) {
        case STAR_SELECTOR_NOT_SELECTED:
            gCurrentObject.rawData[oStarSelectorSize] -= 0.1;
            if (gCurrentObject.rawData[oStarSelectorSize] < 1.0) {
                gCurrentObject.rawData[oStarSelectorSize] = 1.0;
            }
            gCurrentObject.rawData[oFaceAngleYaw] = 0;
            break

        case STAR_SELECTOR_SELECTED:
            gCurrentObject.rawData[oStarSelectorSize] += 0.1;
            if (gCurrentObject.rawData[oStarSelectorSize] >= 1.3) {
                gCurrentObject.rawData[oStarSelectorSize] = 1.3;
            }
            gCurrentObject.rawData[oFaceAngleYaw] += 0x800;
            break

        case STAR_SELECTOR_100_COINS:
            gCurrentObject.rawData[oFaceAngleYaw] += 0x800;
            break
    }

    cur_obj_scale(gCurrentObject.rawData[oStarSelectorSize]);
    gCurrentObject.rawData[oStarSelectorTimer]++;
}

const render_100_coin_star = (stars) => {
    const gCurrentObject = gLinker.ObjectListProcessor.gCurrentObject;

    if (stars & (1 << 6)) {
        sStarSelectorModels[6] = spawn_object_abs_with_rot(
            gCurrentObject, MODEL_STAR, gLinker.behaviors.bhvActSelectorStarType, 370, 24, -300, 0, 0, 0
        );
        sStarSelectorModels[6].rawData[oStarSelectorSize] = 0.8;
        sStarSelectorModels[6].rawData[oStarSelectorType] = STAR_SELECTOR_100_COINS;
    }
}

export const bhv_act_selector_init = () => {
    const gCurrentObject = gLinker.ObjectListProcessor.gCurrentObject;

    let selectorModelIDs = new Array(10);
    let stars = save_file_get_star_flags(Area.gCurrSaveFileNum - 1, COURSE_NUM_TO_INDEX(Area.gCurrCourseNum));

    sVisibleStars = 0;
    
    let i = 0;
    while (i != sObtainedStars) {
        if (stars & (1 << sVisibleStars)) { // Star has been collected
            selectorModelIDs[sVisibleStars] = MODEL_STAR;
            i++;
        } else { // Star has not been collected
            selectorModelIDs[sVisibleStars] = MODEL_TRANSPARENT_STAR;
            // If this is the first star that has not been collected, set
            // the default selection to this star.
            if (sInitSelectedActNum == 0) {
                sInitSelectedActNum = sVisibleStars + 1;
                sSelectableStarIndex = sVisibleStars;
            }
        }
        sVisibleStars++;
    }

    // If the stars have been collected in order so far, show the next star.
    if (sVisibleStars == sObtainedStars && sVisibleStars != 6) {
        selectorModelIDs[sVisibleStars] = MODEL_TRANSPARENT_STAR;
        sVisibleStars++;
    }

    // If all stars have been collected, set the default selection to the last star.
    if (sObtainedStars == 6) {
        sInitSelectedActNum = sVisibleStars;
    }

    //! Useless, since sInitSelectedActNum has already been set in this
    //! scenario by the code that shows the next uncollected star.
    if (sObtainedStars == 0) {
        sInitSelectedActNum = 1;
    }
    
    // Render star selector objects
    for (i = 0; i < sVisibleStars; i++) {
        sStarSelectorModels[i] = spawn_object_abs_with_rot(
            gCurrentObject, selectorModelIDs[i],
            gLinker.behaviors.bhvActSelectorStarType,
            75 + sVisibleStars * -75 + i * 152, 248, -300, 0, 0, 0
        );

        sStarSelectorModels[i].rawData[oStarSelectorSize] = 1.0;
    }

    render_100_coin_star(stars);
}

export const bhv_act_selector_loop = () => {
    let stars = save_file_get_star_flags(Area.gCurrSaveFileNum - 1, COURSE_NUM_TO_INDEX(Area.gCurrCourseNum));

    if (sObtainedStars != 6) {
        // Sometimes, stars are not selectable even if they appear on the screen.
        // This code filters selectable and non-selectable stars.
        sSelectedActIndex = 0;
        IngameMenu.handle_menu_scrolling(MENU_SCROLL_HORIZONTAL, sSelectableStarIndex, 0, sObtainedStars);
        let starIndexCounter = sSelectableStarIndex;

        for (i = 0; i < sVisibleStars; i++) {
            // Can the star be selected (is it either already completed or the first non-completed mission)
            if ((stars & (1 << i)) || i + 1 == sInitSelectedActNum) {
                if (sSelectedActIndex == 0) { // We have reached the sSelectableStarIndex-th selectable star.
                    sSelectedActIndex = i;
                    break;
                }
                starIndexCounter--;
            }
        }
    } else {
        // If all stars are collected then they are all selectable.
        handle_menu_scrolling(MENU_SCROLL_HORIZONTAL, sSelectableStarIndex, 0, sVisibleStars - 1);
        sSelectedActIndex = sSelectableStarIndex;
    }

    // Star selector type handler
    for (let i = 0; i < sVisibleStars; i++) {
        if (i == sSelectedActIndex) {
            sStarSelectorModels[i].rawData[oStarSelectorType] = STAR_SELECTOR_SELECTED;
        } else {
            sStarSelectorModels[i].rawData[oStarSelectorType] = STAR_SELECTOR_NOT_SELECTED;
        }
    }
}

const print_course_number = () => {
    let courseNum = new Array(4);

    create_dl_translation_matrix(MENU_MTX_PUSH, 158.0, 81.0, 0.0);

    gSPDisplayList(Game.gDisplayList, dl_menu_rgba16_wood_course);

    gSPPopMatrix(Game.gDisplayList, G_MTX_MODELVIEW);
    gSPDisplayList(Game.gDisplayList, dl_rgba16_text_begin);
    gDPSetEnvColor(Game.gDisplayList, 255, 255, 255, 255);

    IngameMenu.int_to_str(gCurrCourseNum, courseNum);

    if (gCurrCourseNum < 10) { // 1 digit number
        IngameMenu.print_hud_lut_string(152, 158, courseNum);
    } else { // 2 digit number
        IngameMenu.print_hud_lut_string(143, 158, courseNum);
    }

    gSPDisplayList(Game.gDisplayList, dl_rgba16_text_end);
}

const print_act_selector_strings = () => {
    let myScore = [ TEXT_MYSCORE ];
    let starNumbers = [ TEXT_ZERO ];

    const levelNameTbl = seg2_course_name_table;
    const currLevelName = levelNameTbl[COURSE_NUM_TO_INDEX(Area.gCurrCourseNum)];
    const actNameTbl = seg2_act_name_table;

    IngameMenu.create_dl_ortho_matrix();

    // Print the coin highscore.
    gSPDisplayList(Game.gDisplayList, dl_rgba16_text_begin);
    gDPSetEnvColor(Game.gDisplayList, 255, 255, 255, 255);
    IngameMenu.print_hud_my_score_coins(1, Area.gCurrSaveFileNum - 1, COURSE_NUM_TO_INDEX(Area.gCurrCourseNum), 155, 106);
    gSPDisplayList(Game.gDisplayList, dl_rgba16_text_end);

    gSPDisplayList(Game.gDisplayList, dl_ia_text_begin);
    gDPSetEnvColor(Game.gDisplayList, 0, 0, 0, 255);
    // Print the "MY SCORE" text if the coin score is more than 0
    if (save_file_get_course_coin_score(Area.gCurrSaveFileNum - 1, COURSE_NUM_TO_INDEX(Area.gCurrCourseNum)) != 0) {
        IngameMenu.print_generic_string(102, 118, myScore);
    }

    let lvlNameX = IngameMenu.get_str_x_pos_from_center(160, currLevelName + 3, 10.0);
    IngameMenu.print_generic_string(lvlNameX, 33, currLevelName + 3);

    gSPDisplayList(Game.gDisplayList, dl_ia_text_end);

    print_course_number();

    gSPDisplayList(Game.gDisplayList, dl_menu_ia8_text_begin);
    gDPSetEnvColor(Game.gDisplayList, 0, 0, 0, 255);
    // Print the name of the selected act.
    if (sVisibleStars != 0) {
        let selectedActName = actNameTbl[COURSE_NUM_TO_INDEX(gCurrCourseNum) * 6 + sSelectedActIndex];
        let actNameX = IngameMenu.get_str_x_pos_from_center(163, selectedActName, 8.0);
        IngameMenu.print_menu_generic_string(actNameX, 81, selectedActName);
    }
    
    // Print the numbers above each star.
    for (let i = 1; i <= sVisibleStars; i++) {
        starNumbers[0] = i;
        IngameMenu.print_menu_generic_string(139 - sVisibleStars * 17 + i * 34, 38, starNumbers);
    }

    gSPDisplayList(Game.gDisplayList, dl_menu_ia8_text_end);
}

export const geo_act_selector_strings = (callContext, node, mtx) => {
    if (callContext == GEO_CONTEXT_RENDER) {
        print_act_selector_strings();
    }
    return null;
}


/**
 * Initiates act selector values before entering a main course.
 * Also load how much stars a course has, without counting the 100 coin star.
 */
export const lvl_init_act_selector_values_and_stars = () => {
    let /*u8*/ stars = save_file_get_star_flags(Area.gCurrSaveFileNum - 1, Area.gCurrCourseNum - 1)

    sLoadedActNum = 0
    sInitSelectedActNum = 0
    sVisibleStars = 0
    sActSelectorMenuTimer = 0
    sObtainedStars = save_file_get_course_star_count(Area.gCurrSaveFileNum - 1, Area.gCurrCourseNum - 1)

    // Don't count 100 coin star
    if (stars & (1 << 6)) {
        sObtainedStars--
    }

    return false
}

/**
 * Loads act selector button actions with selected act value checks.
 * Also updates objects and returns act number selected after is chosen.
 */
export const lvl_update_obj_and_load_act_button_actions = () => {
    if (sActSelectorMenuTimer >= 11) {
          // If any of these buttons are pressed, play sound and go to course act
        if ((gPlayer3Controller.buttonPressed & (A_BUTTON | START_BUTTON | B_BUTTON | Z_TRIG))) {
            // play_sound(SOUND_MENU_STAR_SOUND_LETS_A_GO, gGlobalSoundSource)
            if (sInitSelectedActNum >= sSelectedActIndex + 1) {
                sLoadedActNum = sSelectedActIndex + 1
            } else {
                sLoadedActNum = sInitSelectedActNum
            }
            gDialogCourseActNum = sSelectedActIndex + 1
        }
    }

    Area.area_update_objects()
    sActSelectorMenuTimer++
    return sLoadedActNum
}

gLinker.bhv_act_selector_star_type_loop = bhv_act_selector_star_type_loop
gLinker.bhv_act_selector_init = bhv_act_selector_init
gLinker.bhv_act_selector_loop = bhv_act_selector_loop

gLinker.lvl_init_act_selector_values_and_stars = lvl_init_act_selector_values_and_stars
gLinker.lvl_update_obj_and_load_act_button_actions = lvl_update_obj_and_load_act_button_actions