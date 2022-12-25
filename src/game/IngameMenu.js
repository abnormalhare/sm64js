import { coin_seg3_dl_03007940, coin_seg3_dl_03007968, coin_seg3_dl_03007990, coin_seg3_dl_030079B8 } from "../actors/coin/model.inc"
import { gGlobalSoundSource, play_sound } from "../audio/external"
import { dl_draw_text_bg_box, dl_draw_triangle, dl_ia_text_begin, dl_ia_text_end, dl_ia_text_tex_settings, dl_rgba16_load_tex_block, dl_rgba16_text_begin, dl_rgba16_text_end, main_font_lut, main_hud_lut } from "../bin/segment2"
import * as MathUtil from "../engine/math_util"
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../include/config"
import { COURSE_MAX, COURSE_MIN, COURSE_NONE } from "../include/course_table"
import * as Gbi from "../include/gbi"
import { GFX_DIMENSIONS_FROM_LEFT_EDGE, GFX_DIMENSIONS_FROM_RIGHT_EDGE } from "../include/gfx_dimensions"
import { SOUND_MENU_MESSAGE_APPEAR, SOUND_MENU_PAUSE } from "../include/sounds"
import { TEXT_CAMERA_ANGLE_R, TEXT_COIN_X, TEXT_CONTINUE, TEXT_COURSE, TEXT_EXIT_COURSE, TEXT_FILE_MARIO_EXCLAMATION, TEXT_FILE_MARIO_QUESTION, TEXT_FOR_MARIO, TEXT_LETS_HAVE_CAKE, TEXT_LISTEN_EVERYBODY, TEXT_MY_SCORE, TEXT_PAUSE, TEXT_POWER_STARS_RESTORED, TEXT_SOMETHING_SPECIAL, TEXT_THANKS_TO_YOU, TEXT_THANK_YOU_MARIO, TEXT_UNFILLED_STAR } from "../include/text_strings"
import { COURSE_BONUS_STAGES, COURSE_NUM_TO_INDEX, COURSE_STAGES_MAX } from "../levels/course_defines"
import { menu_hud_lut } from "../levels/menu/leveldata"
import { seg2_act_name_table, seg2_course_name_table } from "../text/us/courses"
import { DIALOG_020, DIALOG_NONE, seg2_dialog_table } from "../text/us/dialogs"
import { AreaInstance as Area, MENU_OPT_CAMERA_ANGLE_R, MENU_OPT_DEFAULT, MENU_OPT_NONE } from "./Area"
import { CameraInstance as Camera } from "./Camera"
import { GameInstance as Game } from "./Game"
import { LevelUpdateInstance as LevelUpdate } from "./LevelUpdate"
import { ACT_FLAG_PAUSE_EXIT } from "./Mario"
import { gLastCompletedCourseNum, save_file_get_course_star_count, save_file_get_star_flags } from "./SaveFile"

export const ASCII_TO_DIALOG = (asc) => {
    return (((asc) >= '0' && (asc) <= '9') ? ((asc) - '0') :
     ((asc) >= 'A' && (asc) <= 'Z') ? ((asc) - 'A' + 0x0A) :
     ((asc) >= 'a' && (asc) <= 'z') ? ((asc) - 'a' + 0x24) : 0x00)
}

export const DIALOG_TYPE_ROTATE = 0  // used in NPCs and level messages
export const DIALOG_TYPE_ZOOM = 1    // used in signposts and wall signs and etc

export const DIALOG_RESPONSE_NONE = 0
export const DIALOG_RESPONSE_YES = 1
export const DIALOG_RESPONSE_NO = 2
export const DIALOG_RESPONSE_NOT_DEFINED = 3

export const MENU_MTX_PUSH = 1
export const MENU_MTX_NOPUSH = 2

export const MENU_SCROLL_VERTICAL = 1
export const MENU_SCROLL_HORIZONTAL = 2

export const TEXT_THE_RAW = [ASCII_TO_DIALOG('t'), ASCII_TO_DIALOG('h'), ASCII_TO_DIALOG('e'), 0x00]
export const TEXT_YOU_RAW = [ASCII_TO_DIALOG('y'), ASCII_TO_DIALOG('o'), ASCII_TO_DIALOG('u'), 0x00]

export const MAX_STRING_WIDTH = 16

export const HUD_LUT_JPMENU = 1
export const HUD_LUT_GLOBAL = 1

export const CAM_SELECTION_MARIO = 1
export const CAM_SELECTION_FIXED = 2

export const MENU_MODE_NONE = -1
export const MENU_MODE_UNUSED_0 = 0
export const MENU_MODE_RENDER_PAUSE_SCREEN = 1
export const MENU_MODE_RENDER_COURSE_COMPLETE_SCREEN = 2
export const MENU_MODE_UNUSED_3 = 3

export const DIALOG_STATE_OPENING = 0
export const DIALOG_STATE_VERTICAL = 1
export const DIALOG_STATE_HORIZONTAL = 2
export const DIALOG_STATE_CLOSING = 3

export const DIALOG_PAGE_STATE_NONE = 0
export const DIALOG_PAGE_STATE_SCROLL = 1
export const DIALOG_PAGE_STATE_END = 2

export const DEFAULT_DIALOG_BOX_ANGLE = 90.0
export const DEFAULT_DIALOG_BOX_SCALE = 19.0

export const CRS_NUM_X1 = 100

export const TXT_COURSE_X = 63
export const TXT_STAR_X = 98
export const ACT_NAME_X = 116
export const LVL_NAME_X = 117
export const SECRET_LVL_NAME_X = 94
export const MYSCORE_X = 62

export const DIAG_VAL1 = 16
export const DIAG_VAL2 = 240
export const DIAG_VAL3 = 132
export const DIAG_VAL4 = 5

export const TXT_HISCORE_X  = 109
export const TXT_HISCORE_Y  = 36
export const TXT_CONGRATS_X = 70

export const PAUSE_X = 123

export const X_VAL1 = -7.0
export const Y_VAL1 = 5.0
export const Y_VAL2 = 5.0
export const X_VAL8 = 4
export const Y_VAL8 = 2

class IngameMenu {
    constructor() {
        this.gDialogCharWidths = [
            7,  7,  7,  7,  7,  7,  7,  7,  7,  7,  6,  6,  6,  6,  6,  6,
            6,  6,  5,  6,  6,  5,  8,  8,  6,  6,  6,  6,  6,  5,  6,  6,
            8,  7,  6,  6,  6,  5,  5,  6,  5,  5,  6,  5,  4,  5,  5,  3,
            7,  5,  5,  5,  6,  5,  5,  5,  5,  5,  7,  7,  5,  5,  4,  4,
            8,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            8,  8,  8,  8,  7,  7,  6,  7,  7,  0,  0,  0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  5,  6,
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            7,  5, 10,  5,  9,  8,  4,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            0,  0,  5,  7,  7,  6,  6,  8,  0,  8, 10,  6,  4, 10,  0,  0
        ]

        this.DialogMark = {
            DIALOG_MARK_NONE: 0,
            DIALOG_MARK_DAKUTEN: 1,
            DIALOG_MARK_HANDAKUTEN: 2
        }

        this.DialogSpecialChars = {
            DIALOG_CHAR_SLASH: 0xD0,
            DIALOG_CHAR_MULTI_THE: 0xD1, // 'the'
            DIALOG_CHAR_MULTI_YOU: 0xD2, // 'you'
            DIALOG_CHAR_PERIOD:               0x6E,
            DIALOG_CHAR_COMMA:                0x6F,
            DIALOG_CHAR_SPACE:                0x9E,
            DIALOG_CHAR_STAR_COUNT:           0xE0, // number of stars
            DIALOG_CHAR_UMLAUT:               0xE9,
            DIALOG_CHAR_MARK_START:           0xEF,
            DIALOG_CHAR_DAKUTEN:              0xEF + this.DialogMark.DIALOG_MARK_DAKUTEN,
            DIALOG_CHAR_PERIOD_OR_HANDAKUTEN: 0xEF + this.DialogMark.DIALOG_MARK_HANDAKUTEN,
            DIALOG_CHAR_STAR_FILLED:          0xFA,
            DIALOG_CHAR_STAR_OPEN:            0xFD,
            DIALOG_CHAR_NEWLINE:              0xFE,
            DIALOG_CHAR_TERMINATOR:           0xFF
        }

        this.SpecialFontChars = {
            GLOBAL_CHAR_SPACE: 0x9E,
            GLOBAL_CHAR_TERMINATOR: 0xFF
        }

        this.strPos = 0
        this.lineNum = 1

        this.MultiTextEntry = {
            length,
            str: new Array(4)
        }

        this.MultiStringIDs = {
            STRING_THE: 0,
            STRING_YOU: 1
        }

        this.gEndCutsceneStringsEn = [
            TEXT_FILE_MARIO_EXCLAMATION, // gEndCutsceneStrEn0
            TEXT_POWER_STARS_RESTORED,   // gEndCutsceneStrEn1
            TEXT_THANKS_TO_YOU,          // gEndCutsceneStrEn2
            TEXT_THANK_YOU_MARIO,        // gEndCutsceneStrEn3
            TEXT_SOMETHING_SPECIAL,      // gEndCutsceneStrEn4
            TEXT_LISTEN_EVERYBODY,       // gEndCutsceneStrEn5
            TEXT_LETS_HAVE_CAKE,         // gEndCutsceneStrEn6
            TEXT_FOR_MARIO,              // gEndCutsceneStrEn7
            TEXT_FILE_MARIO_QUESTION,    // gEndCutsceneStrEn8
            null
        ]

        this.CHAR_WIDTH_SPACE   = this.gDialogCharWidths[this.DialogSpecialChars.DIALOG_CHAR_SPACE]
        this.CHAR_WIDTH_DEFAULT = this.gDialogCharWidths[this.MultiTextEntry.str[this.strPos]]

        this.gDialogColorFadeTimer = 0
        this.gLastDialogLineNum = 0
        this.gDialogVariable = 0
        this.gDialogTextAlpha = 0
        this.gCutsceneMsgXOffset = 0
        this.gCutsceneMsgYOffset = 0
        this.gRedCoinsCollected = 0

        this.gCutsceneMsgFade = 0
        this.gCutsceneMsgIndex = -1
        this.gCutsceneMsgDuration = -1
        this.gCutsceneMsgTimer = 0
        this.gDialogCameraAngleIndex = CAM_SELECTION_MARIO
        this.gDialogCourseActNum = 1

        this.gMenuMode = MENU_MODE_NONE

        this.gDialogVariable = 0
<<<<<<< Updated upstream
        this.gDialogBoxType = 0
=======
        this.gDialogBoxState = DIALOG_STATE_OPENING
        this.gDialogBoxOpenTimer = DEFAULT_DIALOG_BOX_ANGLE
        this.gDialogBoxScale = DEFAULT_DIALOG_BOX_SCALE
        this.gDialogScrollOffsetY = 0
        this.gDialogBoxType = DIALOG_TYPE_ROTATE
        this.gDialogID = DIALOG_NONE
        this.gLastDialogPageStrPos = 0
        this.gDialogTextPos = 0
        this.gDialogLineNum = 1
        this.gLastDialogResponse = 0
        this.gMenuHoldKeyIndex = 0
        this.gMenuHoldKeyTimer = 0
        this.gDialogResponse = DIALOG_RESPONSE_NONE
>>>>>>> Stashed changes
    }

    // This is probably incorrect. I'm not sure what kind of identity matrix should be created here

    create_dl_identity_matrix() {
        const matrix = new Array(4).fill(0).map(() => new Array(4).fill(0))

        MathUtil.mtxf_identity(matrix)

        Gbi.gSPMatrix(Game.gDisplayList, matrix, Gbi.G_MTX_MODELVIEW | Gbi.G_MTX_LOAD | Gbi.G_MTX_NOPUSH)
        Gbi.gSPMatrix(Game.gDisplayList, matrix, Gbi.G_MTX_PROJECTION | Gbi.G_MTX_LOAD | Gbi.G_MTX_NOPUSH)

    }

    create_dl_translation_matrix(pushOp, x, y, z) {
        const matrix = new Array(4).fill(0).map(() => new Array(4).fill(0))

        MathUtil.guTranslate(matrix, x, y, z)

        if (pushOp == MENU_MTX_PUSH) {
            Gbi.gSPMatrix(Game.gDisplayList, matrix, Gbi.G_MTX_MODELVIEW | Gbi.G_MTX_MUL | Gbi.G_MTX_PUSH)
        } else if (pushOp == MENU_MTX_NOPUSH) {
            Gbi.gSPMatrix(Game.gDisplayList, matrix, Gbi.G_MTX_MODELVIEW | Gbi.G_MTX_MUL | Gbi.G_MTX_NOPUSH)
        }
    }

    create_dl_rotation_matrix(pushOp, a, x, y, z) {
        const matrix = new Array(4).fill(0).map(() => new Array(4).fill(0))

        MathUtil.guTranslate(matrix, a, x, y, z)

        if (pushOp == MENU_MTX_PUSH) {
            Gbi.gSPMatrix(Game.gDisplayList, matrix, Gbi.G_MTX_MODELVIEW | Gbi.G_MTX_MUL | Gbi.G_MTX_PUSH)
        } else if (pushOp == MENU_MTX_NOPUSH) {
            Gbi.gSPMatrix(Game.gDisplayList, matrix, Gbi.G_MTX_MODELVIEW | Gbi.G_MTX_MUL | Gbi.G_MTX_NOPUSH)
        }
    }

    create_dl_scale_matrix(pushOp, x, y, z) {
        const matrix = new Array(4).fill(0).map(() => new Array(4).fill(0))

        MathUtil.guScale(matrix, x, y, z)

        if (pushOp == MENU_MTX_PUSH) {
            Gbi.gSPMatrix(Game.gDisplayList, matrix, Gbi.G_MTX_MODELVIEW | Gbi.G_MTX_MUL | Gbi.G_MTX_PUSH)
        } else if (pushOp == MENU_MTX_NOPUSH) {
            Gbi.gSPMatrix(Game.gDisplayList, matrix, Gbi.G_MTX_MODELVIEW | Gbi.G_MTX_MUL | Gbi.G_MTX_NOPUSH)
        }
    }

    create_dl_ortho_matrix() {
        const matrix = new Array(4).fill(0).map(() => new Array(4).fill(0))

        this.create_dl_identity_matrix()

        MathUtil.guOrtho(matrix, 0.0, SCREEN_WIDTH, 0.0, SCREEN_HEIGHT, -10.0, 10.0, 1.0)

        // // Should produce G_RDPHALF_1 in Fast3D
        // gSPPerspNormalize(Game.gDisplayListHead++, 0xFFFF);

        Gbi.gSPMatrix(Game.gDisplayList, matrix, Gbi.G_MTX_PROJECTION | Gbi.G_MTX_MUL | Gbi.G_MTX_NOPUSH)
    }

    render_generic_char(c) {
        this.fontLUT = main_font_lut
        this.packedTexture = this.fontLUT[c]

        Gbi.gDPPipeSync(Game.gDisplayList)
        Gbi.gDPSetTextureImage(Game.gDisplayList, Gbi.G_IM_FMT_IA, Gbi.G_IM_SIZ_16b, 1, this.packedTexture)
        Gbi.gSPDisplayList(Game.gDisplayList, dl_ia_text_tex_settings)
    }

    render_multi_text_string(multiTextID) {
        this.textLengths = [
            {length: 3, str: [TEXT_THE_RAW]},
            {length: 3, str: [TEXT_YOU_RAW]}
        ]

        for (let i = 0; i < this.textLengths[multiTextID].length; i++) {
            this.render_generic_char(this.textLengths[multiTextID].str[i])
            this.create_dl_translation_matrix(MENU_MTX_NOPUSH, this.gDialogCharWidths[this.textLengths[multiTextID].str[i]], 0.0, 0.0)
        }
    }

    /**
     * Prints a generic white string.
     * In JP/EU a IA1 texture is used but in US a IA4 texture is used.
     */
    print_generic_string(x, y, str) {
        this.create_dl_translation_matrix(MENU_MTX_PUSH, x, y, 0.0)
        let mark = DIALOG_RESPONSE_NONE
        let strPos = 0
        let lineNum = 1

        while (str[strPos] != DIALOG_CHAR_TERMINATOR) {
            switch (str[strPos]) {
                case DIALOG_CHAR_DAKUTEN:
                    mark = DIALOG_CHAR_DAKUTEN
                    break
                case DIALOG_CHAR_PERIOD_OR_HANDAKUTEN:
                    mark = DIALOG_MARK_HANDAKUTEN
                    break
                case DIALOG_CHAR_NEWLINE:
                    Gbi.gSPPopMatrix(Game.gDisplayList, Gbi.G_MTX_MODELVIEW);
                    this.create_dl_translation_matrix(MENU_MTX_PUSH, x, y - (lineNum * MAX_STRING_WIDTH), 0.0)
                    lineNum++
                    break
                case DIALOG_CHAR_PERIOD:
                    this.create_dl_translation_matrix(MENU_MTX_PUSH, -2.0, -5.0, 0.0)
                    this.render_generic_char(DIALOG_CHAR_PERIOD_OR_HANDAKUTEN)
                    Gbi.gSPPopMatrix(Game.gDisplayList, Gbi.G_MTX_MODELVIEW)
                    break
                case DIALOG_CHAR_SLASH:
                    this.create_dl_translation_matrix(MENU_MTX_NOPUSH, this.gDialogCharWidths[DIALOG_CHAR_SPACE] * 2, 0.0, 0.0)
                    break
                case DIALOG_CHAR_MULTI_THE:
                    this.render_multi_text_string(STRING_THE)
                    break
                case DIALOG_CHAR_MULTI_YOU:
                    this.render_multi_text_string(STRING_YOU)
                    break
                case DIALOG_CHAR_SPACE:
                    this.create_dl_translation_matrix(MENU_MTX_NOPUSH, this.CHAR_WIDTH_SPACE, 0.0, 0.0)
                    break
                default:
                    this.render_generic_char(str[strPos])
                    if (mark != DIALOG_MARK_NONE) {
                        this.create_dl_translation_matrix(MENU_MTX_PUSH, 5.0, 5.0, 0.0)
                        this.render_generic_char(DIALOG_CHAR_MARK_START + mark)
                        Gbi.gSPPopMatrix(Game.gDisplayList, Gbi.G_MTX_MODELVIEW)
                        mark = DIALOG_MARK_NONE
                    }

                    this.create_dl_translation_matrix(MENU_MTX_NOPUSH, this.CHAR_WIDTH_DEFAULT, 0.0, 0.0)
                    break
            }

            this.strPos++
        }

        Gbi.gSPPopMatrix(Game.gDisplayList, Gbi.G_MTX_MODELVIEW)
    }
    
    print_hud_lut_string(hudLUT, x, y, str) {
        console.log("------------------------")
        console.log("| PRINT HUD LUT STRING |")
        let strPos = 0
        let hudLUT1 = menu_hud_lut
        let hudLUT2 = main_hud_lut
        let curX = x
        let curY = y
        let xStride;
        hudLUT == HUD_LUT_JPMENU ? xStride = 16 : xStride = 12
        console.log("| VARIABLES ASSIGNED  |")
        while (str[strPos] != this.SpecialFontChars.GLOBAL_CHAR_TERMINATOR || str[strPos] == null) {
            switch (str[strPos]) {
                case this.SpecialFontChars.GLOBAL_CHAR_SPACE:
                    curX += 8
                    break
                default:
                    Gbi.gDPPipeSync(Game.gDisplayList)

                    hudLUT == HUD_LUT_JPMENU ? Gbi.gDPSetTextureImage(Game.gDisplayList, Gbi.G_IM_FMT_RGBA, Gbi.G_IM_SIZ_16b, 1, hudLUT1[str[strPos]])
                        : Gbi.gDPSetTextureImage(Game.gDisplayList, Gbi.G_IM_FMT_RGBA, Gbi.G_IM_SIZ_16b, 1, hudLUT2[str[strPos]])
                    
                        Gbi.gSPDisplayList(Game.gDisplayList, dl_rgba16_load_tex_block)
                        Gbi.gSPTextureRectangle(Game.gDisplayList, curX << 2, curY << 2, (curX + 16) << 2, (curY + 16) << 2, Gbi.G_TX_RENDERTILE, 0, 0, 1 << 10, 1 << 10)

                        curX += xStride
            }

            strPos++
        }
    }

    change_dialog_camera_angle() {
        if (Camera.cam_select_alt_mode(0) == CAM_SELECTION_MARIO)
            this.gDialogCameraAngleIndex = CAM_SELECTION_MARIO
        else this.gDialogCameraAngleIndex = CAM_SELECTION_FIXED
    }

    highlight_last_course_complete_stars() {
        let doneCourseIndex;

        if (gLastCompletedCourseNum == COURSE_NONE) doneCourseIndex = 0
        else {
            doneCourseIndex = COURSE_NUM_TO_INDEX(gLastCompletedCourseNum)
            if (doneCourseIndex >= COURSE_NUM_TO_INDEX(COURSE_BONUS_STAGES))
                doneCourseIndex = COURSE_NUM_TO_INDEX(COURSE_BONUS_STAGES)
        }

        this.gDialogLineNum = doneCourseIndex
    }

    print_hud_pause_colorful_str() {
        let textPause = [ TEXT_PAUSE ]
        Gbi.gSPDisplayList(Game.gDisplayList, dl_rgba16_text_begin)
        Gbi.gDPSetEnvColor(Game.gDisplayList, 255, 255, 255, this.gDialogTextAlpha)
        this.print_hud_lut_string(HUD_LUT_GLOBAL, PAUSE_X, 81, textPause)
        Gbi.gSPDisplayList(Game.gDisplayList, dl_rgba16_text_end)
    }

    shade_screen() {
        this.create_dl_translation_matrix(MENU_MTX_PUSH, GFX_DIMENSIONS_FROM_LEFT_EDGE(0), SCREEN_HEIGHT, 0)

        // This is a bit weird. It reuses the dialog text box (width 130, height -80),
        // so scale to at least fit the screen.
        this.create_dl_scale_matrix(MENU_MTX_NOPUSH, 2.6, 3.4, 1.0)

        Gbi.gDPSetEnvColor(Game.gDisplayList, 0, 0, 0, 110)
        Gbi.gSPDisplayList(Game.gDisplayList, dl_draw_text_bg_box)
        Gbi.gSPPopMatrix(Game.gDisplayList, Gbi.G_MTX_MODELVIEW)
    }

    print_animated_red_coin(x, y) {
        let globalTimer = window.gGlobalTimer

        this.create_dl_translation_matrix(MENU_MTX_PUSH, x, y, 0)
        this.create_dl_scale_matrix(MENU_MTX_NOPUSH, 0.2, 0.2, 1.0)
        Gbi.gDPSetRenderMode(Game.gDisplayList, Gbi.G_RM_TEX_EDGE, Gbi.G_RM_TEX_EDGE2)

        switch (globalTimer & 6) {
            case 0:
                Gbi.gSPDisplayList(Game.gDisplayList, coin_seg3_dl_03007940)
                break
            case 2:
                Gbi.gSPDisplayList(Game.gDisplayList, coin_seg3_dl_03007968)
                break
            case 4:
                Gbi.gSPDisplayList(Game.gDisplayList, coin_seg3_dl_03007990)
                break
            case 6:
                Gbi.gSPDisplayList(Game.gDisplayList, coin_seg3_dl_030079B8)
                break
        }

        Gbi.gDPSetRenderMode(Game.gDisplayList, Gbi.G_RM_AA_ZB_OPA_SURF, Gbi.G_RM_AA_ZB_OPA_SURF2)
        Gbi.gSPPopMatrix(Game.gDisplayList, Gbi.G_MTX_MODELVIEW)
    }

    render_pause_red_coins() {
        for (let x = 0; x < this.gRedCoinsCollected; x++) 
            print_animated_red_coin(GFX_DIMENSIONS_FROM_RIGHT_EDGE(30) - x * 20, 16)
    }

    render_pause_my_score_coins() {
        let textCourse = [ TEXT_COURSE ]
        let textMyScore = [ TEXT_MY_SCORE ]
        let textStar = [ TEXT_STAR ]
        let textUnfilledStar = [ TEXT_UNFILLED_STAR ]

        let strCourseNum = ""
        let courseNameTbl = seg2_course_name_table
        let actNameTbl = seg2_act_name_table

        let courseIndex = COURSE_NUM_TO_INDEX(Area.gCurrCourseNum)
        let starFlags = save_file_get_star_flags(Area.gCurrSaveFileNum - 1, COURSE_NUM_TO_INDEX(Area.gCurrSaveFileNum))

        Gbi.gSPDisplayList(Game.gDisplayList, dl_rgba16_text_begin)
        Gbi.gDPSetEnvColor(Game.gDisplayList, 255, 255, 255, this.gDialogTextAlpha)

        if (courseIndex <= COURSE_NUM_TO_INDEX(COURSE_STAGES_MAX)) {
            this.print_hud_my_score_coins(1, Area.gCurrSaveFileNum - 1, courseIndex, 178, 103)
            this.print_hud_my_score_stars(Area.gCurrSaveFileNum - 1, courseIndex, 118, 103)
        }

        Gbi.gSPDisplayList(Game.gDisplayList, dl_rgba16_text_end)
        Gbi.gSPDisplayList(Game.gDisplayList, dl_ia_text_begin)

        Gbi.gDPSetEnvColor(Game.gDisplayList, 255, 255, 255, this.gDialogTextAlpha)

        if (courseIndex <= COURSE_NUM_TO_INDEX(COURSE_STAGES_MAX) &&
            save_file_get_course_star_count(Area.gCurrSaveFileNum - 1, courseIndex) != 0) {
            this.print_generic_string(MYSCORE_X, 121, textMyScore)
        }

        let courseName = courseNameTbl[courseIndex]

        if (courseIndex <= COURSE_NUM_TO_INDEX(COURSE_STAGES_MAX)) {
            this.print_generic_string(TXT_COURSE_X, 157, textCourse)
            this.int_to_str(Area.gCurrCourseNum, strCourseNum)
            this.print_generic_string(CRS_NUM_X1)

            let actName = actNameTbl[COURSE_NUM_TO_INDEX(Area.gCurrCourseNum)]

            if (starFlags & (1 << (this.gDialogCourseActNum - 1)))
                this.print_generic_string(TXT_STAR_X, 140, textStar)
            else this.print_generic_string(TXT_STAR_X, 140, textUnfilledStar)

            this.print_generic_string(ACT_NAME_X, 140, actName)
            this.print_generic_string(LVL_NAME_X, 157, courseName.substring(3))
        } else this.print_generic_string(SECRET_LVL_NAME_X, 157, courseName.substring(3))

        Gbi.gSPDisplayList(Game.gDisplayList, dl_ia_text_end)
    }

    render_pause_course_options(x, y, indexWrapper, yIndex) {
        let textContinue = [ TEXT_CONTINUE ]
        let textExitCourse = [ TEXT_EXIT_COURSE ]
        let textCameraAngleR = [ TEXT_CAMERA_ANGLE_R ]

        this.handle_menu_scrolling(MENU_SCROLL_VERTICAL, indexWrapper.index, 1, 3)

        Gbi.gSPDisplayList(Game.gDisplayList, dl_ia_text_begin)
        Gbi.gDPSetEnvColor(Game.gDisplayList, 255, 255, 255, this.gDialogTextAlpha)

        this.print_generic_string(x + 10, y - 33, textContinue)
        this.print_generic_string(x + 10, y - 17, textExitCourse)

        if (indexWrapper.index != MENU_OPT_CAMERA_ANGLE_R) {
            this.print_generic_string(x + 10, y - 33, textCameraAngleR)
            Gbi.gSPDisplayList(Game.gDisplayList, dl_ia_text_end)

            this.create_dl_translation_matrix(MENU_MTX_PUSH, x - X_VAL8, (y - ((indexWrapper.index - 1) * yIndex)) - Y_VAL8, 0)

            Gbi.gDPSetEnvColor(Game.gDisplayList, 255, 255, 255, this.gDialogTextAlpha)
            Gbi.gSPDisplayList(Game.gDisplayList, dl_draw_triangle)
            Gbi.gSPPopMatrix(Game.gDisplayList, Gbi.G_MTX_MODELVIEW)
        }

        const wrapper = {index: this.gDialogCameraAngleIndex}
        if (indexWrapper.index == MENU_OPT_CAMERA_ANGLE_R)
            this.render_pause_camera_options(x - 42, y - 42, wrapper, 110)
    }

    render_pause_castle_menu_box(x, y) {
        console.log("- RENDER CASTLE PAUSE MENU")
        this.create_dl_translation_matrix(MENU_MTX_PUSH, x - 78, y - 32, 0)
        this.create_dl_scale_matrix(MENU_MTX_NOPUSH, 1.2, 0.8, 1.0)
        Gbi.gDPSetEnvColor(Game.gDisplayList, 0, 0, 0, 105)
        Gbi.gSPDisplayList(Game.gDisplayList, dl_draw_text_bg_box)
        Gbi.gSPPopMatrix(Game.gDisplayList, Gbi.G_MTX_MODELVIEW)

        this.create_dl_translation_matrix(MENU_MTX_PUSH, x + 6, y - 28, 0)
        this.create_dl_rotation_matrix(MENU_MTX_NOPUSH, DEFAULT_DIALOG_BOX_ANGLE, 0, 0, 1.0)
        Gbi.gDPSetEnvColor(Game.gDisplayList, 255, 255, 255, this.gDialogTextAlpha)
        Gbi.gSPDisplayList(Game.gDisplayList, dl_draw_triangle)
        Gbi.gSPPopMatrix(Game.gDisplayList, Gbi.G_MTX_MODELVIEW)

        this.create_dl_translation_matrix(MENU_MTX_PUSH, x - 9, y - 101, 0)
        this.create_dl_rotation_matrix(MENU_MTX_NOPUSH, 270.0, 0, 0, 1.0)
        Gbi.gSPDisplayList(Game.gDisplayList, dl_draw_triangle)
        Gbi.gSPPopMatrix(Game.gDisplayList, Gbi.G_MTX_MODELVIEW)
        console.log("COMPLETE -")
    }

    render_pause_castle_main_strings(x, y) {
        console.log("- RENDER PAUSE TEXT")
        let courseNameTbl = seg2_course_name_table
        let textCoin = [ TEXT_COIN_X ]
        let prevCourseIndex = this.gDialogLineNum

        const wrapper = { index: this.gDialogLineNum }
        this.handle_menu_scrolling(
            MENU_SCROLL_VERTICAL, wrapper, COURSE_NUM_TO_INDEX(COURSE_MIN) - 1,
            COURSE_NUM_TO_INDEX(COURSE_BONUS_STAGES) + 1
        )
        
        if (this.gDialogLineNum == COURSE_NUM_TO_INDEX(COURSE_BONUS_STAGES) + 1)
            this.gDialogLineNum = COURSE_NUM_TO_INDEX(COURSE_MIN) // Exceeded max, set to min
        if (this.gDialogLineNum == COURSE_NUM_TO_INDEX(COURSE_MIN) - 1)
            this.gDialogLineNum = COURSE_NUM_TO_INDEX(COURSE_BONUS_STAGES) // Exceeded min, set to max
        
        if (this.gDialogLineNum != COURSE_NUM_TO_INDEX(COURSE_BONUS_STAGES)) {
            while (save_file_get_course_star_count(Area.gCurrSaveFileNum - 1, this.gDialogLineNum) == 0) {
                if (this.gDialogLineNum >= prevCourseIndex) this.gDialogLineNum++
                else this.gDialogLineNum--

                if (this.gDialogLineNum == COURSE_NUM_TO_INDEX(COURSE_STAGES_MAX) + 1 ||
                    this.gDialogLineNum == COURSE_NUM_TO_INDEX(COURSE_BONUS_STAGES) - 1) {
                    this.gDialogLineNum = COURSE_NUM_TO_INDEX(COURSE_BONUS_STAGES)
                    break
                }
            }
        }

        Gbi.gSPDisplayList(Game.gDisplayList, dl_ia_text_begin)
        Gbi.gDPSetEnvColor(Game.gDisplayList, 255, 255, 255, this.gDialogTextAlpha)

        let courseName;
        if (this.gDialogLineNum <= COURSE_NUM_TO_INDEX(COURSE_STAGES_MAX)) { // Main courses
            courseName = courseNameTbl[this.gDialogLineNum]
            this.render_pause_castle_course_stars(x, y, Area.gCurrSaveFileNum - 1, this.gDialogLineNum)
        }
        console.log("COMPLETE -")
        // TODO
    }

    render_pause_courses_and_castle() {
        let index;
        const gMarioStates = [ gLinker.LevelUpdate.gMarioStates ]

        switch (this.gDialogBoxState) {
            case DIALOG_STATE_OPENING:
                this.gDialogLineNum = MENU_OPT_DEFAULT
                this.gDialogTextAlpha = 0
                LevelUpdate.level_set_transition(-1, null)
                play_sound(SOUND_MENU_PAUSE, gGlobalSoundSource)

                if (Area.gCurrCourseNum >= COURSE_MIN && Area.gCurrCourseNum <= COURSE_MAX) {
                    this.change_dialog_camera_angle()
                    this.gDialogBoxState = DIALOG_STATE_VERTICAL
                } else {
                    this.highlight_last_course_complete_stars()
                    this.gDialogBoxState = DIALOG_STATE_HORIZONTAL
                }
                break

            case DIALOG_STATE_VERTICAL:
                this.shade_screen();
                this.render_pause_my_score_coins();
                this.render_pause_red_coins()

                const wrapper = { index: this.gDialogLineNum }
                if (gMarioStates[0].action & ACT_FLAG_PAUSE_EXIT) 
                    this.render_pause_course_options(99, 93, wrapper, 15)
                break;
            
            case DIALOG_STATE_HORIZONTAL:
                this.shade_screen()
                this.print_hud_pause_colorful_str()
                this.render_pause_castle_menu_box(160, 143)
                this.render_pause_castle_main_strings(104, 60)
                break
        }

        if (this.gDialogTextAlpha < 250) this.gDialogTextAlpha == 25

        return MENU_OPT_NONE
    }

    render_dialog_box_type(dialog, linesPerBox) {
        this.create_dl_translation_matrix(MENU_MTX_NOPUSH, dialog.leftOffset, dialog.width, 0)

        switch (this.gDialogBoxType) {
            case DIALOG_TYPE_ROTATE: // Renders a dialog black box with zoom and rotation
                if (this.gDialogBoxState == DIALOG_STATE_OPENING || this.gDialogBoxState == DIALOG_STATE_CLOSING) {
                    this.create_dl_scale_matrix(MENU_MTX_NOPUSH, 1.0 / this.gDialogBoxScale, 1.0 / this.gDialogBoxScale, 1.0)
                    // convert the speed into angle
                    this.create_dl_rotation_matrix(MENU_MTX_NOPUSH, this.gDialogBoxOpenTimer * 4.0, 0, 0, 1.0)
                }
                Gbi.gDPSetEnvColor(Game.gDisplayList, 0, 0, 0, 150)
                break
            
            case DIALOG_TYPE_ZOOM: // Renders a dialog white box with zoom
                if (this.gDialogBoxState == DIALOG_STATE_OPENING || this.gDialogBoxState == DIALOG_STATE_CLOSING) {
                    this.create_dl_translation_matrix(MENU_MTX_NOPUSH, 65.0 - (65.0 / this.gDialogBoxScale), (40.0 / this.gDialogBoxScale) - 40, 0)
                    this.create_dl_scale_matrix(MENU_MTX_NOPUSH, 1.0 / this.gDialogBoxScale, 1.0 / this.gDialogBoxScale, 1.0)
                }
                Gbi.gDPSetEnvColor(Game.gDisplayList, 255, 255, 255, 150)
                break
        }

        this.create_dl_translation_matrix(MENU_MTX_PUSH, X_VAL1, Y_VAL1, 0)
        this.create_dl_scale_matrix(MENU_MTX_NOPUSH, 1.1, linesPerBox / Y_VAL2 + 0.1, 1.0)

        Gbi.gSPDisplayList(Game.gDisplayList, dl_draw_text_bg_box)
        Gbi.gSPPopMatrix(Game.gDisplayList, Gbi.G_MTX_MODELVIEW)
    }

    render_dialog_entries() {
        let dialogTable = seg2_dialog_table
        let dialog = dialogTable[this.gDialogID]

        // if the dialog entry is invalid, set the ID to DIALOG_NONE.
        if (dialog == null) {
            this.gDialogID = DIALOG_NONE
            return
        }

        switch (this.gDialogBoxState) {
            case DIALOG_STATE_OPENING:
                if (this.gDialogBoxOpenTimer == DEFAULT_DIALOG_BOX_ANGLE) {
                    // play_dialog_sound(this.gDialogID)
                    play_sound(SOUND_MENU_MESSAGE_APPEAR, gGlobalSoundSource)
                }

                if (this.gDialogBoxType == DIALOG_TYPE_ROTATE) {
                    this.gDialogBoxOpenTimer -= 7.5
                    this.gDialogBoxScale -= 1.5
                } else {
                    this.gDialogBoxOpenTimer -= 10.0
                    this.gDialogBoxScale -= 20
                }

                if (this.gDialogBoxOpenTimer == 0.0) {
                    this.gDialogBoxState = DIALOG_STATE_VERTICAL
                    this.gDialogLineNum = 1
                }
                break

            case DIALOG_STATE_VERTICAL:
                this.gDialogBoxOpenTimer = 0.0
                break

            case DIALOG_STATE_HORIZONTAL:
                this.gDialogScrollOffsetY += dialog.linesPerBox * 2

                if (this.gDialogScrollOffsetY >= dialog.linesPerBox * DIAG_VAL1) {
                    this.gDialogTextPos = this.gLastDialogPageStrPos
                    this.gDialogBoxState = DIALOG_STATE_VERTICAL
                    this.gDialogScrollOffsetY = 0
                }
                break

            case DIALOG_STATE_CLOSING:
                if (this.gDialogBoxOpenTimer == 20.0) {
                    this.gDialogBoxState = DIALOG_STATE_OPENING
                    this.gDialogID = DIALOG_NONE
                    this.gDialogTextPos = 0
                    this.gLastDialogResponse = 0
                    this.gLastDialogPageStrPos = 0
                    this.gDialogResponse = DIALOG_RESPONSE_NONE
                }
                break
        }

        this.render_dialog_box_type(dialog, dialog.linesPerBox)
    }

    do_cutscene_handler() {
        // is a cutscene playing? do not perform this handler's actions if so.
        if (this.gCutsceneMsgIndex == -1) return;

        this.create_dl_ortho_matrix();

        Gbi.gsSPDisplayList(dl_ia_text_begin)
        Gbi.gDPSetEnvColor(Game.gDisplayList, 255, 255, 255, this.gCutsceneMsgFade)

        let x = get_str_x_pos_from_center(this.gCutsceneMsgXOffset, this.gEndCutsceneStringsEn[this.gCutsceneMsgIndex], 10.0)
        this.print_generic_string(this.gCutsceneMsgYOffset, this.gEndCutsceneStringsEn[this.gCutsceneMsgIndex])

        Gbi.gSPDisplayList(dl_ia_text_end);

        // if the timing variable is less than 5, increment
        // the fade until we are at full opacity.
        if (this.gCutsceneMsgTimer < 5) this.gCutsceneMsgFade += 50;

        // if the cutscene frame length + the fade-in counter is
        // less than the timer, it means we have exceeded the
        // time that the message is supposed to remain on
        // screen. if (message_duration = 50) and (msg_timer = 55)
        // then after the first 5 frames, the message will remain
        // on screen for another 50 frames until it starts fading.
        if (this.gCutsceneMsgDuration + 5 < this.gCutsceneMsgTimer) this.gCutsceneMsgFade -= 50

        // like the first check, it takes 5 frames to fade out, so
        // perform a + 10 to account for the earlier check (10-5=5).
        if (this.gCutsceneMsgDuration + 10 < this.gCutsceneMsgTimer) {
            this.gCutsceneMsgIndex = -1
            this.gCutsceneMsgFade = 0
            this.gCutsceneMsgTimer = 0
            return
        }

        this.gCutsceneMsgTimer++
    }

    set_menu_mode(mode) {
        if (this.gMenuMode == MENU_MODE_NONE) this.gMenuMode = mode
    }

    get_dialog_id() {
        return this.gDialogID
    }

    create_dialog_box(dialog) {
        if (this.gDialogID == -1) {
            this.gDialogID = dialog
            this.gDialogBoxType = DIALOG_TYPE_ROTATE
        }
    }

    create_dialog_box_with_var(dialog, dialogVar) {
        if (this.gDialogID == -1) {
            this.gDialogID = dialog;
            this.gDialogVariable = dialogVar
            this.gDialogBoxType = DIALOG_TYPE_ROTATE
        }
    }

    create_dialog_inverted_box(dialog) {
        if (this.gDialogID == -1) {
            this.gDialogID = dialog
            this.gDialogBoxType = DIALOG_TYPE_ZOOM
        }
    }

    create_dialog_box_with_response(dialog) {
        if (this.gDialogID == DIALOG_NONE) {
            this.gDialogID = dialog
            this.gDialogBoxType = DIALOG_TYPE_ZOOM
        }
    }

    render_menus_and_dialogs() {
        let index = MENU_OPT_NONE

        this.create_dl_ortho_matrix();

        if (this.gMenuMode != MENU_MODE_NONE) {
            switch (this.gMenuMode) {
                case MENU_MODE_UNUSED_0:
                case MENU_MODE_RENDER_PAUSE_SCREEN:
                    index = this.render_pause_courses_and_castle()
                    break
                case MENU_MODE_RENDER_COURSE_COMPLETE_SCREEN:
                case MENU_MODE_UNUSED_3:
                    index = this.render_course_complete_screen()
                    break
            }

            this.gDialogColorFadeTimer += 0x1000
        } else if (this.gDialogID != DIALOG_NONE) {
            // The Peach "Dear Mario" message needs to be repositioned separately
            if (this.gDialogID == DIALOG_020) {
                this.print_peach_letter_message()
                return index
            }

            this.render_dialog_entries()
            this.gDialogColorFadeTimer += 0x1000
        }

        return index
    }
}

export const IngameMenuInstance = new IngameMenu()