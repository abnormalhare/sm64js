import { dl_draw_text_bg_box, dl_draw_triangle, dl_ia_text_begin, dl_ia_text_end, dl_ia_text_tex_settings, dl_rgba16_load_tex_block, dl_rgba16_text_begin, dl_rgba16_text_end, main_credits_font_lut, main_font_lut, main_hud_lut } from "../common_gfx/segment2"
import * as MathUtil from "../engine/math_util"
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../include/config"
import * as Gbi from "../include/gbi"
import { menu_font_lut, menu_hud_lut } from "../levels/menu/leveldata"
import { AreaInstance as Area} from "./Area"
import { GameInstance as Game } from "./Game"
import { LevelUpdateInstance as LevelUpdate } from "./LevelUpdate"
import { gGlobalSoundSource, play_sound, SEQUENCE_ARGS, SEQ_PLAYER_LEVEL } from "../audio/external"
import { SOUND_MENU_CHANGE_SELECT, SOUND_MENU_MESSAGE_APPEAR, SOUND_MENU_MESSAGE_DISAPPEAR, SOUND_MENU_MESSAGE_NEXT_PAGE, SOUND_MENU_PAUSE, SOUND_MENU_PAUSE_2, SOUND_MENU_STAR_SOUND } from "../include/sounds"
import { COURSE_BONUS_STAGES, COURSE_MAX, COURSE_MIN, COURSE_NONE, COURSE_NUM_TO_INDEX, COURSE_STAGES_COUNT, COURSE_STAGES_MAX } from "../levels/course_defines"
import { ACT_FLAG_PAUSE_EXIT } from "./Mario"
import { gLastCompletedCourseNum, save_file_get_course_coin_score, save_file_get_course_star_count, save_file_get_max_coin_score, save_file_get_star_flags, save_file_get_total_star_count } from "./SaveFile"
import { GFX_DIMENSIONS_ASPECT_RATIO, GFX_DIMENSIONS_FROM_LEFT_EDGE, GFX_DIMENSIONS_FROM_RIGHT_EDGE } from "../include/gfx_dimensions"
import { TEXT_CAMERA_ANGLE_R, TEXT_COIN_X, TEXT_CONTINUE, TEXT_COURSE, TEXT_EXIT_COURSE, TEXT_LAKITU_MARIO, TEXT_LAKITU_STOP, TEXT_MY_SCORE, TEXT_NORMAL_FIXED, TEXT_NORMAL_UPCLOSE, TEXT_PAUSE, TEXT_STAR, TEXT_STAR_X, TEXT_UNFILLED_STAR } from "../include/text_strings"
import { PrintInstance as Print } from "./Print"
import { coin_seg3_dl_03007940, coin_seg3_dl_03007968, coin_seg3_dl_03007990, coin_seg3_dl_030079B8 } from "../actors/coin/model.inc"
import { DIALOG_005, DIALOG_009, DIALOG_010, DIALOG_011, DIALOG_012, DIALOG_013, DIALOG_014, DIALOG_017, DIALOG_020, DIALOG_055, DIALOG_114, DIALOG_115, DIALOG_116, DIALOG_117, DIALOG_118, DIALOG_128, DIALOG_150, DIALOG_152, DIALOG_164, DIALOG_NONE } from "../text/us/dialogs"
import { SEQ_EVENT_BOSS } from "../include/seq_ids"
import { gSineTable } from "../include/trig_tables.inc"

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

export const DIALOG_STATE_OPENING = 0
export const DIALOG_STATE_VERTICAL = 1
export const DIALOG_STATE_HORIZONTAL = 2
export const DIALOG_STATE_CLOSING = 3

export const DEFAULT_DIALOG_BOX_ANGLE = 90.0
export const DEFAULT_DIALOG_BOX_SCALE = 19.0

export const MENU_MTX_PUSH = 1
export const MENU_MTX_NOPUSH = 2

export const MENU_SCROLL_VERTICAL = 1
export const MENU_SCROLL_HORIZONTAL = 2

export const TEXT_THE_RAW = [ASCII_TO_DIALOG('t'), ASCII_TO_DIALOG('h'), ASCII_TO_DIALOG('e'), 0x00]
export const TEXT_YOU_RAW = [ASCII_TO_DIALOG('y'), ASCII_TO_DIALOG('o'), ASCII_TO_DIALOG('u'), 0x00]

export const MAX_STRING_WIDTH = 16

export const HUD_LUT_JPMENU = 1
export const HUD_LUT_GLOBAL = 1

export const X_VAL1 = -7.0
export const Y_VAL1 = 5.0
export const Y_VAL2 = 5.0
export const X_VAL3 = 0.0
export const Y_VAL3 = 16
export const X_VAL4_1 = 56
export const X_VAL4_2 = 47
export const Y_VAL4_1 = 2
export const Y_VAL4_2 = 16
export const X_VAL5 = 118.0
export const Y_VAL5_1 = -16
export const Y_VAL5_2 = 3
export const X_Y_VAL6 = 0.8
export const Y_VAL7 = 2
export const X_VAL8 = 4
export const Y_VAL8 = 2

export const CAM_SELECTION_MARIO = 1
export const CAM_SELECTION_FIXED = 2

export const TXT_COURSE_X      = 63
export const TXT_STAR_X        = 98
export const ACT_NAME_X        = 116
export const LVL_NAME_X        = 117
export const SECRET_LVL_NAME_X = 94
export const MYSCORE_X         = 62
export const TXT1_X            = 3
export const TXT2_X            = 119
export const PAUSE_X           = 123

export const DIAG_VAL1 = 16
export const DIAG_VAL2 = 238
export const DIAG_VAL3 = 132
export const DIAG_VAL4 = 5

export const CRS_NUM_X1 = 100

export const ARRAY_COUNT = (arr) => {return arr.length / arr[0].length}
export const LANGUAGE_ARRAY = (cmd) => { return cmd }

// move these to a seperate file if needed
export const seg2_course_name_table = new Array(0)
export const seg2_act_name_table = new Array(0)
export const seg2_dialog_table = new Array(0)

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

        this.DIALOG_MARK_NONE = 0
        this.DIALOG_MARK_DAKUTEN = 1,
        this.DIALOG_MARK_HANDAKUTEN = 2
        this.DIALOG_CHAR_SLASH                 = 0xD0
        this.DIALOG_CHAR_MULTI_THE             = 0xD1 // 'the'
        this.DIALOG_CHAR_MULTI_YOU             = 0xD2 // 'you'
        this.DIALOG_CHAR_PERIOD                = 0x6E
        this.DIALOG_CHAR_COMMA                 = 0x6F
        this.DIALOG_CHAR_SPACE                 = 0x9E
        this.DIALOG_CHAR_STAR_COUNT            = 0xE0 // number of stars
        this.DIALOG_CHAR_UMLAUT                = 0xE9
        this.DIALOG_CHAR_MARK_START            = 0xEF
        this.DIALOG_CHAR_DAKUTEN               = 0xEF + this.DIALOG_MARK_DAKUTEN
        this.DIALOG_CHAR_PERIOD_OR_HANDAKUTEN  = 0xEF + this.DIALOG_MARK_HANDAKUTEN
        this.DIALOG_CHAR_STAR_FILLED           = 0xFA
        this.DIALOG_CHAR_STAR_OPEN             = 0xFD
        this.DIALOG_CHAR_NEWLINE               = 0xFE
        this.DIALOG_CHAR_TERMINATOR            = 0xFF
        this.GLOBAL_CHAR_SPACE                 = 0x9E
        this.GLOBAL_CHAR_TERMINATOR            = 0xFF

        this.strPos = 0
        this.lineNum = 1

        this.MultiStringIDs = {
            STRING_THE: 0,
            STRING_YOU: 1
        }

        this.MultiTextEntry = {
            length,
            str: new Array(4)
        }

        this.CHAR_WIDTH_SPACE   = this.gDialogCharWidths[this.DIALOG_CHAR_SPACE]
        this.CHAR_WIDTH_DEFAULT = this.gDialogCharWidths[this.MultiTextEntry.str[this.strPos]]

        this.gDialogColorFadeTimer = 0
        this.gLastDialogLineNum
        this.gDialogVariable
        this.gDialogTextAlpha

        this.gDialogID = -1
        this.gDialogVariable = 0
        this.gDialogBoxType = 0
        this.gDialogBoxState = DIALOG_STATE_OPENING
        this.gDialogBoxScale = DEFAULT_DIALOG_BOX_SCALE
        this.gDialogBoxOpenTimer = DEFAULT_DIALOG_BOX_ANGLE
        this.gDialogLineNum = 1
        this.gDialogCourseActNum = 1
        this.gHudSymCoin = [ Print.GLYPH_COIN, Print.GLYPH_SPACE ]
        this.gHudSymX = [ Print.GLYPH_MULTIPLY, Print.GLYPH_SPACE ]
        this.gRedCoinsCollected
        this.gMenuHoldKeyIndex = 0
        this.gMenuHoldKeyTimer = 0
        this.gLastDialogPageStrPos = 0
        this.gDialogScrollOffsetY = 0
        this.gDialogTextPos = 0
        this.gDialogResponse = DIALOG_RESPONSE_NONE
        this.gLastDialogResponse = 0

        this.gDialogCameraAngleIndex = CAM_SELECTION_MARIO

        this.MENU_MODE_NONE = -1
        this.MENU_MODE_UNUSED_0 = 0
        this.MENU_MODE_RENDER_PAUSE_SCREEN = 1
        this.MENU_MODE_RENDER_COURSE_COMPLETE_SCREEN = 2
        this.MENU_MODE_UNUSED_3 = 3

        this.DIALOG_PAGE_STATE_NONE = 0
        this.DIALOG_PAGE_STATE_SCROLL = 1
        this.DIALOG_PAGE_STATE_END = 2

        this.gMenuMode = this.MENU_MODE_NONE
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

        // Should produce G_RDPHALF_1 in Fast3D
        Gbi.gSPPerspNormalize(Game.gDisplayList, 0xFFFF);

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
        this.mark = DIALOG_RESPONSE_NONE

        while (str[this.strPos] != this.DIALOG_CHAR_TERMINATOR) {
            switch (str[this.strPos]) {
                case this.DIALOG_CHAR_DAKUTEN:
                    this.mark = this.DIALOG_CHAR_DAKUTEN
                    break
                case this.DIALOG_CHAR_PERIOD_OR_HANDAKUTEN:
                    this.mark = DIALOG_MARK_HANDAKUTEN
                    break
                case this.DIALOG_CHAR_NEWLINE:
                    Gbi.gSPPopMatrix(Game.gDisplayList, Gbi.G_MTX_MODELVIEW);
                    this.create_dl_translation_matrix(MENU_MTX_PUSH, x, y - (this.lineNum * MAX_STRING_WIDTH), 0.0)
                    lineNum++
                    break
                case this.DIALOG_CHAR_PERIOD:
                    this.create_dl_translation_matrix(MENU_MTX_PUSH, -2.0, -5.0, 0.0)
                    this.render_generic_char(this.DIALOG_CHAR_PERIOD_OR_HANDAKUTEN)
                    Gbi.gSPPopMatrix(Game.gDisplayList, Gbi.G_MTX_MODELVIEW)
                    break
                case this.DIALOG_CHAR_SLASH:
                    this.create_dl_translation_matrix(MENU_MTX_NOPUSH, this.gDialogCharWidths[this.DIALOG_CHAR_SPACE] * 2, 0.0, 0.0)
                    break
                case this.DIALOG_CHAR_MULTI_THE:
                    this.render_multi_text_string(STRING_THE)
                    break
                case this.DIALOG_CHAR_MULTI_YOU:
                    this.render_multi_text_string(STRING_YOU)
                    break
                case this.DIALOG_CHAR_SPACE:
                    this.create_dl_translation_matrix(MENU_MTX_NOPUSH, this.CHAR_WIDTH_SPACE, 0.0, 0.0)
                    break
                default:
                    this.render_generic_char(str[this.strPos])
                    if (this.mark != DIALOG_MARK_NONE) {
                        this.create_dl_translation_matrix(MENU_MTX_PUSH, 5.0, 5.0, 0.0)
                        this.render_generic_char(this.DIALOG_CHAR_MARK_START + this.mark)
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
        this.strPos = 0
        this.hudLUT1 = menu_hud_lut
        this.hudLUT2 = main_hud_lut
        this.curX = x
        this.curY = y
        hudLUT == HUD_LUT_JPMENU ? this.xStride = 16 : this.xStride = 12

        while (str[this.strPos] != this.GLOBAL_CHAR_TERMINATOR) {
            switch (str[this.strPos]) {
                case this.GLOBAL_CHAR_SPACE:
                    this.curX += 8
                    break
                default:
                    Gbi.gDPPipeSync(Game.gDisplayList)

                    hudLUT == HUD_LUT_JPMENU ? Gbi.gDPSetTextureImage(Game.gDisplayList, Gbi.G_IM_FMT_RGBA, Gbi.G_IM_SIZ_16b, 1, this.hudLUT1[str[this.strPos]])
                        : Gbi.gDPSetTextureImage(Game.gDisplayList, Gbi.G_IM_FMT_RGBA, Gbi.G_IM_SIZ_16b, 1, this.hudLUT2[str[this.strPos]])
                    
                        Gbi.gSPDisplayList(Game.gDisplayList, dl_rgba16_load_tex_block)
                        Gbi.gSPTextureRectangle(Game.gDisplayList, this.curX << 2, this.curY << 2, (this.curX + 16) << 2, (this.curY + 16) << 2, Gbi.G_TX_RENDERTILE, 0, 0, 1 << 10, 1 << 10)

                        this.curX += this.xStride
            }

            this.strPos++
        }
    }

    print_menu_generic_string(x, y, str) {
        this.mark = DIALOG_MARK_NONE
        this.strPos = 0
        this.curX = x
        this.curY = y
        this.fontLUT = menu_font_lut

        while (str[this.strPos] != this.DIALOG_CHAR_TERMINATOR) {
            switch (str[this.strPos]) {
                case this.DIALOG_CHAR_DAKUTEN:
                    this.mark = DIALOG_MARK_DAKUTEN;
                    break;
                case this.DIALOG_CHAR_PERIOD_OR_HANDAKUTEN:
                    mark = DIALOG_MARK_HANDAKUTEN;
                    break;
                case this.DIALOG_CHAR_SPACE:
                    this.curX += 4;
                    break;
                default:
                    if (mark != this.DIALOG_MARK_NONE) {
                    Gbi.gDPSetTextureImage(Game.gDisplayList, Gbi.G_IM_FMT_IA, Gbi.G_IM_SIZ_8b, 1, this.fontLUT[this.DIALOG_CHAR_MARK_START + this.mark])
                    Gbi.gDPLoadSync(Game.gDisplayList)
                    Gbi.gDPLoadBlock(Game.gDisplayList, Gbi.G_TX_LOADTILE, 0, 0, 8 * 8 - 1, Gbi.CALC_DXT(8, Gbi.G_IM_SIZ_8b_BYTES))
                    Gbi.gSPTextureRectangle(Game.gDisplayList, (this.curX + 6) << 2, (this.curY - 7) << 2, (this.curX + 6 + 8) << 2, (this.curY - 7 + 8) << 2, Gbi.G_TX_RENDERTILE, 0, 0, 1 << 10, 1 << 10)

                    this.mark = this.DIALOG_MARK_NONE
                    }

                    this.curX += this.gDialogCharWidths[str[this.strPos]]
            }
            this.strPos++
        }
    }

    print_credits_string(x, y, str) {
        this.strPos = 0
        this.fontLUT = main_credits_font_lut
        this.curX = x
        this.curY = y

        Gbi.gDPSetTile(Game.gDisplayList, Gbi.G_IM_FMT_RGBA, Gbi.G_IM_SIZ_16b, 0, 0, Gbi.G_TX_LOADTILE, 0, Gbi.G_TX_WRAP | Gbi.G_TX_NOMIRROR, Gbi.G_TX_NOMASK, Gbi.G_TX_NOLOD, Gbi.G_TX_WRAP | Gbi.G_TX_NOMIRROR, Gbi.G_TX_NOMASK, Gbi.G_TX_NOLOD)
        Gbi.gDPTileSync(Game.gDisplayList)
        Gbi.gDPSetTile(Game.gDisplayList, Gbi.G_IM_FMT_RGBA, Gbi.G_IM_SIZ_16b, 2, 0, Gbi.G_TX_RENDERTILE, 0, Gbi.G_TX_CLAMP, 3, Gbi.G_TX_NOLOD, Gbi.G_TX_CLAMP, 3, Gbi.G_TX_NOLOD)
        Gbi.gDPSetTileSize(Game.gDisplayList, Gbi.G_TX_RENDERTILE, 0, 0, (8 - 1) << Gbi.G_TEXTURE_IMAGE_FRAC, (8 - 1) << Gbi.G_TEXTURE_IMAGE_FRAC)

        while (str[this.strPos] != this.GLOBAL_CHAR_TERMINATOR) {
            switch (str[this.strPos]) {
                case this.GLOBAL_CHAR_SPACE:
                    this.curX += 4
                    break
                default:
                    Gbi.gDPPipeSync(Game.gDisplayList)
                    Gbi.gDPSetTextureImage(Game.gDisplayList, Gbi.G_IM_FMT_RGBA, Gbi.G_IM_SIZ_16b, 1, this.fontLUT[str[this.strPos]])
                    Gbi.gDPLoadSync(Game.gDisplayList)
                    Gbi.gDPLoadBlock(Game.gDisplayList, Gbi.G_TX_LOADTILE, 0, 0, 8 * 8 - 1, Gbi.CALC_DXT(8, Gbi.G_IM_SIZ_16b_BYTES))
                    Gbi.gSPTextureRectangle(Game.gDisplayList, this.curX << 2, this.curY << 2, (this.curX + 8) << 2, (this.curY) << 2, Gbi.G_TX_RENDERTILE, 0, 0, 1 << 10, 1 << 10)
                    this.curX += 7
                    break
            }
            this.strPos++
        }
    }

    handle_menu_scrolling(scrollDirection, currentIndex, minIndex, maxIndex) {
        let index = 0
        if (scrollDirection == MENU_SCROLL_VERTICAL) {
            if (Game.gPlayer3Controller.rawStickY > 60) {
                index++
            } else if (Game.gPlayer3Controller.rawStickY < -60) {
                index += 2
            }
        } else if (scrollDirection == MENU_SCROLL_HORIZONTAL) {
            if (Game.gPlayer3Controller.rawStickX > 60) {
                index += 2
            } else if (Game.gPlayer3Controller.rawStickX < -60) {
                index++
            }
        }

        if (((index ^ this.gMenuHoldKeyIndex) & index) == 2) {
            if (currentIndex == maxIndex) {
                //! Probably originally a >=, but later replaced with an == and an else statement.
                currentIndex = maxIndex
            } else {
                play_sound(SOUND_MENU_CHANGE_SELECT, gGlobalSoundSource)
                currentIndex++
            }
        }

        if (((index ^ this.gMenuHoldKeyIndex) & index) == 1) {
            if (currentIndex == minIndex) {
                //  applies to here as above
            } else {
                play_sound(SOUND_MENU_CHANGE_SELECT, gGlobalSoundSource)
                currentIndex--
            }
        }
        
        if (this.gMenuHoldKeyTimer == 10) {
            this.gMenuHoldKeyTimer = 8
            this.gMenuHoldKeyIndex = 0
        } else {
            this.gMenuHoldKeyTimer++
            this.gMenuHoldKeyIndex = index
        }

        if ((index & 3) == 0) {
            this.gMenuHoldKeyTimer = 0
        }
    }

    print_hud_my_score_coins(useCourseCoinScore, fileIndex, courseIndex, x, y) {
        this.strNumCoins = new Array(4)
        !useCourseCoinScore ? this.numCoins = save_file_get_max_coin_score(courseIndex) & 0xFFFF : this.numCoins = save_file_get_course_coin_score(fileIndex, courseIndex)


        if (this.numCoins != 0) {
            this.print_hud_lut_string(HUD_LUT_GLOBAL, x, y, this.gHudSymCoin)
            this.print_hud_lut_string(HUD_LUT_GLOBAL, x + 16, y, this.gHudSymX)
            this.int_to_str(this.numCoins, this.strNumCoins)
            this.print_hud_lut_string(HUD_LUT_GLOBAL, x + 32, y, this.strNumCoins)
        }
    }

    print_hud_my_score_stars(fileIndex, courseIndex, x, y) {
        let strStarCount = new Array(4)
        let starCount = save_file_get_course_star_count(fileIndex, courseIndex)
        let textSymStar = [ Print.GLYPH_STAR, Print.GLYPH_SPACE ]
        let textSymX = [ Print.GLYPH_MULTIPLY, Print.GLYPH_SPACE ]

        if (starCount != 0) {
            this.print_hud_lut_string(HUD_LUT_GLOBAL, x, y, textSymStar)
            this.print_hud_lut_string(HUD_LUT_GLOBAL, x + 16, y, textSymX)
            this.int_to_str(starCount, strStarCount)
            this.print_hud_lut_string(HUD_LUT_GLOBAL, x + 32, y, strStarCount)
        }
    }

    int_to_str(num, dst) {
        let digit1 = num / 100
        let digit2 = (num - digit1 * 100) / 10
        let digit3 = (num - digit2 * 100) - (digit2 * 10)
        let pos = 0

        if (num > 999) {
            dst[0] = 0x00
            dst[1] = this.DIALOG_CHAR_TERMINATOR
            return
        }

        if (digit1 != 0) {
            dst[pos++] = digit1
        }

        if (digit2 != 0 || digit1 != 0) {
            dst[pos++] = digit2
        }

        dst[pos++] = digit3
        dst[pos] = this.DIALOG_CHAR_TERMINATOR
    }

    render_dialog_box_type(dialog, linesPerBox) {
        this.create_dl_translation_matrix(MENU_MTX_NOPUSH, dialog.leftOffset, dialog.width, 0)

        switch (this.gDialogBoxType) {
            case DIALOG_TYPE_ROTATE: // Renders a dialog black box with zoom and rotation
                if (this.gDialogBoxState == DIALOG_STATE_OPENING || this.gDialogBoxState == DIALOG_STATE_CLOSING) {
                    this.create_dl_scale_matrix(MENU_MTX_NOPUSH, 1.0 / this.gDialogBoxScale, 1.0 / this.gDialogBoxScale, 1.0)
                    // speed -> angle
                    this.create_dl_rotation_matrix(MENU_MTX_NOPUSH, this.gDialogBoxOpenTimer * 4.0, 0, 0, 1.0)
                }
                Gbi.gDPSetEnvColor(Game.gDisplayList, 255, 255, 255, 150)
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
        this.create_dl_scale_matrix(MENU_MTX_NOPUSH, 1.1, (linesPerBox / Y_VAL2) + 0.1, 1.0)

        Gbi.gSPDisplayList(Game.gDisplayList, dl_draw_text_bg_box)
        Gbi.gSPPopMatrix(Game.gDisplayList, 255, 255, 255, 150)
    }

    change_and_flash_dialog_text_color_lines(colorMode, lineNum) {
        let colorFade
        if (colorMode == 1) {
            if (lineNum == 1) {
                Gbi.gDPSetEnvColor(gDisplayList, 255, 255, 255, 255)
            } else {
                if (lineNum == this.gDialogLineNum) {
                    colorFade = (gSineTable[this.gDialogColorFadeTimer >> 4] * 50.0) + 200.0
                    Gbi.gDPSetEnvColor(gDisplayList, colorFade, colorFade, colorFade, 255)
                } else {
                    Gbi.gDPSetEnvColor(gDisplayList, 200, 200, 200, 255)
                }
            }
        } else {
            switch (this.gDialogBoxType) {
                case DIALOG_TYPE_ROTATE:
                    break
                case DIALOG_TYPE_ZOOM:
                    Gbi.gDPSetEnvColor(gDisplayList, 0, 0, 0, 255)
                    break
            }
        }
    }

    handle_dialog_scroll_page_state(lineNum, totalLines, pageState, xMatrix, linePos) {
        Gbi.gSPPopMatrix(gDisplayList, Gbi.G_MTX_MODELVIEW)

        if (lineNum == totalLines) {
            pageState = this.DIALOG_PAGE_STATE_SCROLL
            return
        }
        this.create_dl_translation_matrix(MENU_MTX_PUSH, X_VAL3, 2 - (lineNum * Y_VAL3), 0)

        linePos = 0
        xMatrix = 1
    }

    render_star_count_dialog_text(xMatrix, linePos) {
        let tensDigit = this.gDialogVariable / 10
        let onesDigit = this.gDialogVariable - (tensDigit * 10) // remainder

        if (tensDigit != 0) {
            if (xMatrix != 1) {
                this.create_dl_translation_matrix(MENU_MTX_NOPUSH, (this.gDialogCharWidths[this.DIALOG_CHAR_SPACE] * xMatrix), 0, 0)
            }

            this.render_generic_char(tensDigit)
            this.create_dl_translation_matrix(MENU_MTX_NOPUSH, this.gDialogCharWidths[tensDigit], 0, 0)
            xMatrix = 1
            linePos++
        }

        if (xMatrix != 1) {
            this.create_dl_translation_matrix(MENU_MTX_NOPUSH, (this.gDialogCharWidths[this.DIALOG_CHAR_SPACE] * (xMatrix - 1)), 0, 0)
        }

        this.render_generic_char(onesDigit)
        this.create_dl_translation_matrix(MENU_MTX_NOPUSH, this.gDialogCharWidths[onesDigit], 0, 0)
        linePos++
        xMatrix = 1
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

    render_multi_text_string_lines(multiTextId, lineNum, linePos, linesPerBox, xMatrix, lowerBound) {
        let textLengths = [
            {length: 3, str: [ TEXT_THE_RAW ]},
            {length: 3, str: [ TEXT_YOU_RAW ]},
        ]

        if (lineNum >= lowerBound && lineNum <= (lowerBound + linesPerBox)) {
            if (linePos != 0 || xMatrix != 1) {
                this.create_dl_translation_matrix(MENU_MTX_NOPUSH, (this.gDialogCharWidths[this.DIALOG_CHAR_SPACE] * (xMatrix - 1)), 0, 0)
            }

            for (let i = 0; i < textLengths[multiTextId].length; i++) {
                this.render_generic_char(textLengths[multiTextId].str[i])
                this.create_dl_translation_matrix(MENU_MTX_NOPUSH, (this.gDialogCharWidths[textLengths[multiTextId].str[i]]), 0, 0)
            }
        }

        linePos += textLengths[multiTextId].length
    }

    ensure_nonnegative(value) {
        if (value < 0) {
            value = 0
        }

        return value
    }

    handle_dialog_text_and_pages(colorMode, dialog, lowerBound) {
        let strChar
        let str = dialog.str
        let lineNum = 1
        let totalLines
        let pageState = this.DIALOG_PAGE_STATE_NONE
        let mark = this.DIALOG_MARK_NONE
        let xMatrix = 1
        let linesPerBox = dialog.linesPerBox
        let strIdx
        let linePos = 0

        if (this.gDialogBoxState == DIALOG_STATE_HORIZONTAL) {
            // If scrolling, consider the number of lines for both
            // the current page and the page being scrolled to.
            totalLines = linesPerBox * 2 + 1
        } else {
            totalLines = linesPerBox + 1
        }

        Gbi.gSPDisplayList(gDisplayList, dl_ia_text_begin)
        strIdx = this.gDialogTextPos

        if (this.gDialogBoxState == DIALOG_STATE_HORIZONTAL) {
            this.create_dl_translation_matrix(MENU_MTX_NOPUSH, 0, this.gDialogScrollOffsetY, 0)
        }

        this.create_dl_translation_matrix(MENU_MTX_PUSH, X_VAL3, 2 - (lineNum * Y_VAL3), 0)

        while (pageState == this.DIALOG_PAGE_STATE_NONE) {
            this.change_and_flash_dialog_text_color_lines(colorMode, lineNum)
            strChar = str[strIdx]

            switch (strChar) {
                case this.DIALOG_CHAR_TERMINATOR:
                    pageState = this.DIALOG_PAGE_STATE_END
                    Gbi.gSPPopMatrix(gDisplayList, Gbi.G_MTX_MODELVIEW)
                    break
                case this.DIALOG_CHAR_NEWLINE:
                    lineNum++
                    this.handle_dialog_scroll_page_state(lineNum, totalLines, pageState, xMatrix, linePos)
                    break
                case this.DIALOG_MARK_DAKUTEN:
                    mark = this.DIALOG_MARK_DAKUTEN
                    break
                case this.DIALOG_CHAR_PERIOD_OR_HANDAKUTEN:
                    mark = this.DIALOG_MARK_HANDAKUTEN
                    break
                case this.DIALOG_CHAR_SPACE:
                    xMatrix++
                    linePos++
                    break
                case this.DIALOG_CHAR_SLASH:
                    xMatrix += 2
                    linePos += 2
                    break
                case this.DIALOG_CHAR_MULTI_THE:
                    this.render_multi_text_string_lines(STRING_THE, lineNum, linePos, linesPerBox, xMatrix, lowerBound)
                    xMatrix = 1
                    break
                case this.DIALOG_CHAR_MULTI_YOU:
                    this.render_multi_text_string_lines(STRING_YOU, lineNum, linePos, linesPerBox, xMatrix, lowerBound)
                    xMatrix = 1
                    break
                case this.DIALOG_CHAR_STAR_COUNT:
                    this.render_star_count_dialog_text(xMatrix, linePos)
                    break
                default: // any other character
                    if (lineNum >= lowerBound && lineNum <= (lowerBound + linesPerBox)) {
                        if (linePos != 0 || xMatrix != 1) {
                            this.create_dl_translation_matrix(MENU_MTX_NOPUSH, this.gDialogCharWidths[this.DIALOG_CHAR_SPACE] * (xMatrix - 1), 0, 0)
                        }

                        this.render_generic_char(strChar)
                        this.create_dl_translation_matrix(MENU_MTX_NOPUSH, this.gDialogCharWidths[strChar], 0, 0)
                        xMatrix = 1
                        linePos++
                    }
            }

            strIdx++
        }

        Gbi.gSPDisplayList(gDisplayList, dl_ia_text_end)

        if (this.gDialogBoxState == DIALOG_STATE_VERTICAL) {
            if (pageState == this.DIALOG_PAGE_STATE_END) {
                this.gLastDialogPageStrPos = -1
            } else {
                this.gLastDialogPageStrPos = strIdx
            }
        }

        gLastDialogLineNum = lineNum
    }

    render_dialog_triangle_choice() {
        if (this.gDialogBoxState == DIALOG_STATE_VERTICAL) {
            this.handle_menu_scrolling(MENU_SCROLL_HORIZONTAL, this.gDialogLineNum, 1, 2)
        }

        this.create_dl_translation_matrix(MENU_MTX_NOPUSH, (this.gDialogLineNum * X_VAL4_1) - X_VAL4_2, Y_VAL4_1 - (gLastDialogLineNum * Y_VAL4_2), 0)

        if (this.gDialogBoxType == DIALOG_TYPE_ROTATE) {
            Gbi.gDPSetEnvColor(gDisplayList, 255, 255, 255, 255)
        } else {
            Gbi.gDPSetEnvColor(gDisplayList, 0, 0, 0, 255)
        }

        Gbi.gSPDisplayList(gDisplayList, dl_draw_triangle)
    }

    render_dialog_triangle_next(linesPerBox) {
        let globalTimer = window.globalTimer

        if (globalTimer & 8) {
            return
        }

        this.create_dl_translation_matrix(MENU_MTX_PUSH, X_VAL5, (linesPerBox * Y_VAL5_1) + Y_VAL5_2, 0)
        this.create_dl_scale_matrix(MENU_MTX_NOPUSH, X_Y_VAL6, X_Y_VAL6, 1.0)
        this.create_dl_rotation_matrix(MENU_MTX_NOPUSH, -DEFAULT_DIALOG_BOX_ANGLE, 0, 0, 1.0)

        if (this.gDialogBoxType == DIALOG_TYPE_ROTATE) { // White Text
            Gbi.gDPSetEnvColor(gDisplayList, 255, 255, 255, 255)
        } else { // Black Text
            Gbi.gDPSetEnvColor(0, 0, 0, 255)
        }

        Gbi.gSPDisplayList(gDisplayList, dl_draw_triangle)
        Gbi.gSPPopMatrix(gDisplayList, Gbi.G_MTX_MODELVIEW)
    }

    change_dialog_camera_angle() {
        // waiting on Agent X
        //
        // if (cam_select_alt_mode(0) == CAM_SELECTION_MARIO) {
            this.gDialogCameraAngleIndex = CAM_SELECTION_MARIO
        // } else {
        //     gDialogCameraAngleIndex = CAM_SELECTION_FIXED;
        // }
    }

    handle_special_dialog_text(dialogID) { // dialog ID tables, in order
        // King Bob-omb (Start), Whomp (Start), King Bob-omb (throw him out), Eyerock (Start), Wiggler (Start)
        let dialogBossStart = [ DIALOG_017, DIALOG_114, DIALOG_128, DIALOG_117, DIALOG_150 ]
        // Koopa the Quick (BoB), Koopa the Quick (THI), Penguin Race, Fat Penguin Race (120 stars)
        let dialogRaceSound = [ DIALOG_005, DIALOG_009, DIALOG_055, DIALOG_164 ]
        // Red Switch, Green Switch, Blue Switch, 100 coins star, Bowser Red Coin Star
        let dialogStarSound = [ DIALOG_010, DIALOG_011, DIALOG_012, DIALOG_013, DIALOG_014 ]
        // King Bob-omb (Start), Whomp (Defeated), King Bob-omb (Defeated, missing in JP), Eyerock (Defeated), Wiggler (Defeated)
        // NOTE: I'm fixing the King Bob-omb sound bug (fixed in PAL)
        let dialogBossStop = [ DIALOG_017, DIALOG_115, DIALOG_116, DIALOG_118, DIALOG_152 ]

        for (let i = 0; i < ARRAY_COUNT(dialogBossStart); i++) {
            if (dialogBossStart[i] == dialogID) {
                // seq_player_unlower_volume(SEQ_PLAYER_LEVEL, 60)
                // play_music(SEQ_PLAYER_LEVEL, SEQUENCE_ARGS(4, SEQ_EVENT_BOSS), 0)
                return
            }
        }

        for (let i = 0; i < ARRAY_COUNT(dialogRaceSound); i++) {
            if (dialogRaceSound[i] == dialogID && this.gDialogLineNum == 1) {
                // play_race_fanfare()
                return
            }
        }

        for (let i = 0; i < ARRAY_COUNT(dialogStarSound); i++) {
            if (dialogStarSound[i] == dialogID && this.gDialogLineNum == 1) {
                play_sound(SOUND_MENU_STAR_SOUND, gGlobalSoundSource)
                return
            }
        }

        for (let i = 0; i < ARRAY_COUNT(dialogBossStop); i++) {
            if (dialogBossStop[i] == dialogID) {
                // seq_player_fade_out(SEQ_PLAYER_LEVEL, 1)
                return
            }
        }
    }

    render_dialog_entries() {
        let dialogTable = seg2_dialog_table
        let dialog = dialogTable[this.gDialogID]
        let lowerBound

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
                    this.gDialogBoxScale -= 2.0
                }

                if (this.gDialogBoxOpenTimer == 0.0) {
                    this.gDialogBoxState = DIALOG_STATE_VERTICAL
                    this.gDialogLineNum = 1
                }
                lowerBound = 1
                break
            case DIALOG_STATE_VERTICAL:
                this.gDialogBoxOpenTimer = 0.0
                if ((Game.gPlayer3Controller.buttonPressed & A_BUTTON) || (Game.gPlayer3Controller.buttonPressed & B_BUTTON)) {
                    if (this.gLastDialogPageStrPos == -1) {
                        this.handle_special_dialog_text(this.gDialogID)
                        this.gDialogBoxState = DIALOG_STATE_CLOSING
                    } else {
                        this.gDialogBoxState = DIALOG_STATE_HORIZONTAL
                        play_sound(SOUND_MENU_MESSAGE_NEXT_PAGE, gGlobalSoundSource)
                    }
                }
                lowerBound = 1
                break
            case DIALOG_STATE_HORIZONTAL:
                this.gDialogScrollOffsetY += dialog.linesPerBox * 2

                if (this.gDialogScrollOffsetY >= dialog.linesPerBox * DIAG_VAL1) {
                    this.gDialogTextPos = this.gLastDialogPageStrPos
                    this.gDialogBoxState = DIALOG_STATE_VERTICAL
                    this.gDialogScrollOffsetY = 0
                }
                lowerBound = (this.gDialogScrollOffsetY / DIAG_VAL1) + 1
                break
            case DIALOG_STATE_CLOSING:
                if (this.gDialogBoxOpenTimer == 20.0) {
                    level_set_transition(0, null)
                    play_sound(SOUND_MENU_MESSAGE_DISAPPEAR, gGlobalSoundSource)

                    if (this.gDialogBoxType == DIALOG_TYPE_ZOOM) {
                        // trigger_cutscene_dialog(2)
                    }

                    this.gDialogResponse = this.gDialogLineNum
                }

                this.gDialogBoxOpenTimer += 10.0
                this.gDialogBoxScale += 2.0

                if (this.gDialogBoxOpenTimer == DEFAULT_DIALOG_BOX_ANGLE) {
                    this.gDialogBoxState = DIALOG_STATE_OPENING
                    this.gDialogID = DIALOG_NONE
                    this.gDialogTextPos = 0
                    this.gLastDialogResponse = 0
                    this.gLastDialogPageStrPos = 0
                    this.gDialogResponse = DIALOG_RESPONSE_NONE
                }
                lowerBound = 1
                break
        }

        this.render_dialog_box_type(dialog, dialog.linesPerBox)

        Gbi.gDPSetScissor(gDisplayList, Gbi.G_SC_NON_INTERLACE,
            this.ensure_nonnegative(dialog.leftOffset), this.ensure_nonnegative(DIAG_VAL2 - dialog.width),
            this.ensure_nonnegative(dialog.leftOffset + DIAG_VAL3),
            this.ensure_nonnegative((240 - dialog.width) + dialog.linesPerBox * 80 / DIAG_VAL4))

        this.handle_dialog_text_and_pages(0, dialog, lowerBound)

        if (this.gLastDialogPageStrPos == -1 && this.gLastDialogResponse == 1) {
            this.render_dialog_triangle_choice()
        }

        Gbi.gDPSetScissor(gDisplayList, Gbi.G_SC_NON_INTERLACE, 2, 2, SCREEN_WIDTH, SCREEN_HEIGHT)

        if (this.gLastDialogPageStrPos != -1 && this.gDialogBoxState == DIALOG_STATE_VERTICAL) {
            this.render_dialog_triangle_next(dialog.linesPerBox)
        }
    }

    set_menu_mode(mode) {
        if (this.gMenuMode == this.MENU_MODE_NONE) {
            this.gMenuMode = mode
        }
    }

    shade_screen() {
        this.create_dl_translation_matrix(MENU_MTX_PUSH, GFX_DIMENSIONS_FROM_LEFT_EDGE(0), SCREEN_HEIGHT, 0)

        // This is a bit weird. It reuses the dialog text box (width 130, height -80),
        // so scale to at least fit the screen. (WIDESCREEN OPTION)
        // this.create_dl_scale_matrix(MENU_MTX_NOPUSH, GFX_DIMENSIONS_ASPECT_RATIO * SCREEN_HEIGHT / 130.0, 3.0, 1.0)
        this.create_dl_scale_matrix(MENU_MTX_NOPUSH, 2.6, 3.4, 1.0)

        Gbi.gDPSetEnvColor(Game.gDisplayList, 0, 0, 0, 110)
        Gbi.gSPDisplayList(Game.gDisplayList, dl_draw_text_bg_box)
        Gbi.gSPPopMatrix(Game.gDisplayList, Gbi.G_MTX_MODELVIEW)
    }

    render_pause_red_coins() {
        for (let x = 0; x < this.gRedCoinsCollected; x++) {
            this.print_animated_red_coin(GFX_DIMENSIONS_FROM_RIGHT_EDGE(30) - x * 20, 16)
        }
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

    render_pause_my_score_coins() {
        this.textCourse = [ TEXT_COURSE ]
        this.textMyScore = [ TEXT_MY_SCORE ]
        this.textStar = [ TEXT_STAR ]
        this.textUnfilledStar = [ TEXT_UNFILLED_STAR ]
        this.strCourseNum = new Array(4)
        this.courseNameTbl = seg2_course_name_table
        this.courseName = seg2_act_name_table
        this.actNameTbl
        this.actName
        this.courseIndex = COURSE_NUM_TO_INDEX(Area.gCurrCourseNum)
        this.starFlags = save_file_get_star_flags(Area.gCurrSaveFileNum - 1, COURSE_NUM_TO_INDEX(Area.gCurrCourseNum))

        Gbi.gSPDisplayList(Game.gDisplayList, dl_rgba16_text_begin)
        Gbi.gDPSetEnvColor(Game.gDisplayList, 255, 255, 255, this.gDialogTextAlpha)

        if (this.courseIndex <= COURSE_NUM_TO_INDEX(COURSE_STAGES_MAX)) {
            this.print_hud_my_score_coins(1, Area.gCurrSaveFileNum - 1, this.courseIndex, 178, 103)
            this.print_hud_my_score_stars(Area.gCurrSaveFileNum - 1, this.courseIndex, 118, 103)
        }

        Gbi.gSPDisplayList(Game.gDisplayList, dl_rgba16_text_end)
        Gbi.gSPDisplayList(Game.gDisplayList, dl_ia_text_begin)
        Gbi.gDPSetEnvColor(Game.gDisplayList, 255, 255, 255, this.gDialogTextAlpha)

        if (this.courseIndex <= COURSE_NUM_TO_INDEX(COURSE_STAGES_MAX) && save_file_get_course_star_count(Area.gCurrSaveFileNum - 1, this.courseIndex) != 0) {
            this.print_generic_string(MYSCORE_X, 121, LANGUAGE_ARRAY(this.textMyScore))
        }

        this.courseName = this.courseNameTbl[this.courseIndex]

        if (this.courseIndex <= COURSE_NUM_TO_INDEX(COURSE_STAGES_MAX)) {
            this.print_generic_string(TXT_COURSE_X, 157, LANGUAGE_ARRAY(this.textMyScore))
            int_to_str(gCurrCourseNum, this.strCourseNum)
            this.print_generic_string(CRS_NUM_X1, 157, this.strCourseNum)

            this.actName = actNameTbl[COURSE_NUM_TO_INDEX(gCurrCourseNum) * 6 + this.gDialogCourseActNum - 1]

            if (this.starFlags & (1 << (this.gDialogCourseActNum - 1))) {
                this.print_generic_string(TXT_STAR_X, 140, this.textStar)
            } else {
                this.print_generic_string(TXT_STAR_X, 140, this.textUnfilledStar)
            }

            this.print_generic_string(ACT_NAME_X, 140, this.actName)
            this.print_generic_string(LVL_NAME_X, 157, this.courseName[3])
        } else {
            this.print_generic_string(SECRET_LVL_NAME_X, 157, this.courseName[3])
        }
        
        Gbi.gSPDisplayList(Game.gDisplayList, dl_ia_text_end)
    }

    render_pause_camera_options(x, y, index, xIndex) {
        this.textLakituMario = [ TEXT_LAKITU_MARIO ]
        this.textLakituStop = [ TEXT_LAKITU_STOP ]
        this.textNormalUpClose = [ TEXT_NORMAL_UPCLOSE ]
        this.textNormalFixed = [ TEXT_NORMAL_FIXED ]

        this.handle_menu_scrolling(MENU_SCROLL_HORIZONTAL, index, 1, 2)

        Gbi.gSPDisplayList(Game.gDisplayList, dl_ia_text_begin)
        Gbi.gDPSetEnvColor(Game.gDisplayList, 255, 255, 255, this.gDialogTextAlpha)

        this.print_generic_string(x + 14, y + 2, this.textLakituMario)
        this.print_generic_string(x + TXT1_X, y - 13, LANGUAGE_ARRAY(this.textNormalUpClose))
        this.print_generic_string(x + 124, y + 2, this.textLakituStop)
        this.print_generic_string(x + TXT2_X, y - 13, LANGUAGE_ARRAY(this.textNormalFixed))

        Gbi.gSPDisplayList(Game.gDisplayList, dl_ia_text_end)
        this.create_dl_translation_matrix(MENU_MTX_PUSH, ((index - 1) * xIndex) + x, y + Y_VAL7, 0)
        Gbi.gDPSetEnvColor(Game.gDisplayList, this.gDialogTextAlpha)
        Gbi.gSPDisplayList(Game.gDisplayList, dl_draw_triangle)
        Gbi.gSPPopMatrix(Game.gDisplayList, Gbi.G_MTX_MODELVIEW)

        switch (index) {
            case CAM_SELECTION_MARIO:
                // cam_select_alt_mode(CAM_SELECTION_MARIO)
                break
            case CAM_SELECTION_FIXED:
                // cam_select_alt_mode(CAM_SELECTION_FIXED)
                break
        }
    }

    render_pause_course_options(x, y, index, yIndex) {
        this.textContinue = [ TEXT_CONTINUE ]
        this.textExitCourse = [ TEXT_EXIT_COURSE ]
        this.textCameraAngleR = [ TEXT_CAMERA_ANGLE_R ]

        this.handle_menu_scrolling(MENU_SCROLL_VERTICAL, index, 1, 3)

        Gbi.gSPDisplayList(Game.gDisplayList, dl_ia_text_begin)
        Gbi.gDPSetEnvColor(Game.gDisplayList, 255, 255, 255, this.gDialogTextAlpha)

        this.print_generic_string(x + 10, y - 2, LANGUAGE_ARRAY(this.textContinue))
        this.print_generic_string(x + 10, y - 17, LANGUAGE_ARRAY(this.textExitCourse))

        if (index != Area.MENU_OPT_CAMERA_ANGLE_R) {
            this.print_generic_string(x + 10, y - 33, LANGUAGE_ARRAY(this.textCameraAngleR))
            Gbi.gSPDisplayList(Game.gDisplayList, dl_ia_text_end)

            this.create_dl_translation_matrix(MENU_MTX_PUSH, x - X_VAL8, (y - ((index - 1) * yIndex)) - Y_VAL8, 0)

            Gbi.gDPSetEnvColor(Game.gDisplayList, 255, 255, 255, this.gDialogTextAlpha)
            Gbi.gSPDisplayList(Game.gDisplayList, dl_draw_triangle)
            Gbi.gSPPopMatrix(Game.gDisplayList, Gbi.G_MTX_MODELVIEW)
        } else {
            this.render_pause_camera_options(x - 42, y - 42, this.gDialogCameraAngleIndex, 110)
        }
    }

    render_pause_castle_menu_box(x, y) {
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
        this.create_dl_rotation_matrix(MENU_MTX_NOPUSH, DEFAULT_DIALOG_BOX_ANGLE, 0, 0, 1.0)
        Gbi.gSPDisplayList(Game.gDisplayList, dl_draw_triangle)
        Gbi.gSPPopMatrix(Game.gDisplayList, Gbi.G_MTX_MODELVIEW)
    }

    highlight_last_course_complete_stars() {
        this.doneCourseIndex

        if (gLastCompletedCourseNum == COURSE_NONE) {
            this.doneCourseIndex = 0
        } else {
            this.doneCourseIndex = COURSE_NUM_TO_INDEX(gLastCompletedCourseNum)

            if (this.doneCourseIndex >= COURSE_NUM_TO_INDEX(COURSE_BONUS_STAGES)) {
                this.doneCourseIndex = COURSE_NUM_TO_INDEX(COURSE_BONUS_STAGES)
            }
        }

        this.gDialogLineNum = this.doneCourseIndex
    }

    print_hud_pause_colorful_str() {
        this.textPause = [ TEXT_PAUSE ]

        Gbi.gSPDisplayList(Game.gDisplayList, dl_rgba16_text_begin)
        Gbi.gDPSetEnvColor(Game.gDisplayList, 255, 255, 255, this.gDialogTextAlpha)

        this.print_hud_lut_string(HUD_LUT_GLOBAL, PAUSE_X, 81, this.textPause)

        Gbi.gSPDisplayList(Game.gDisplayList, dl_rgba16_text_end)
    }

    render_pause_castle_course_stars(x, y, fileIndex, courseIndex) {
        let hasStar = 0
        let str = new Array(COURSE_STAGES_COUNT * 2)
        this.textStar = [ TEXT_STAR ]

        this.starFlags = save_file_get_star_flags(fileIndex, courseIndex)
        this.starCount = save_file_get_course_star_count(fileIndex, courseIndex)
        this.nextStar = 0

        if (this.starFlags & (1 << 6)) {
            this.starCount--
            this.print_generic_string(x + 89, y - 5, this.textStar)
        }

        while (hasStar != this.starCount) {
            if (this.starFlags & (1 << this.nextStar)) {
                str[this.nextStar * 2] = this.DIALOG_CHAR_STAR_FILLED
                hasStar++
            } else {
                str[this.nextStar * 2] = this.DIALOG_CHAR_STAR_OPEN
            }

            str[this.nextStar * 2 + 1] = this.DIALOG_CHAR_SPACE
            this.nextStar++
        }

        if (this.starCount == this.nextStar && this.starCount != 6) {
            str[this.nextStar * 2] = this.DIALOG_CHAR_STAR_OPEN
            str[this.nextStar * 2 + 1] = this.DIALOG_CHAR_SPACE
            this.nextStar++
        }

        str[this.nextStar * 2] = this.DIALOG_CHAR_TERMINATOR

        this.print_generic_string(x + 14, y + 13, str)
    }

    render_pause_castle_main_strings(x, y) {
        this.courseNameTbl = seg2_course_name_table
        this.textCoin = [ TEXT_COIN_X ]
        this.courseName
        let strVal = new Array(8)
        let prevCourseIndex = this.gDialogLineNum

        this.handle_menu_scrolling(MENU_SCROLL_VERTICAL, this.gDialogLineNum, COURSE_NUM_TO_INDEX(COURSE_MIN) - 1, COURSE_NUM_TO_INDEX(COURSE_BONUS_STAGES) + 1)

        if (this.gDialogLineNum == COURSE_NUM_TO_INDEX(COURSE_BONUS_STAGES) + 1) {
            this.gDialogLineNum = COURSE_NUM_TO_INDEX(COURSE_MIN) // Exceeded max, set to min
        }

        if (this.gDialogLineNum == COURSE_NUM_TO_INDEX(COURSE_MIN) - 1) {
            this.gDialogLineNum = COURSE_NUM_TO_INDEX(COURSE_BONUS_STAGES) // Exceeded min, set to max
        }

        if (this.gDialogLineNum != COURSE_NUM_TO_INDEX(COURSE_BONUS_STAGES)) {
            while (save_file_get_course_star_count(Area.gCurrSaveFileNum - 1, this.gDialogLineNum) == 0) {
                if (this.gDialogLineNum >= prevCourseIndex) {
                    this.gDialogLineNum++
                } else {
                    this.gDialogLineNum--
                }

                if (this.gDialogLineNum == COURSE_NUM_TO_INDEX(COURSE_STAGES_MAX) + 1 || this.gDialogLineNum == COURSE_NUM_TO_INDEX(COURSE_MIN) - 1) {
                    this.gDialogLineNum = COURSE_NUM_TO_INDEX(COURSE_BONUS_STAGES)
                    break
                }
            }
        }

        Gbi.gSPDisplayList(Game.gDisplayList, dl_ia_text_begin)
        Gbi.gDPSetEnvColor(Game.gDisplayList, 255, 255, 255, this.gDialogTextAlpha)

        if (this.gDialogLineNum <= COURSE_NUM_TO_INDEX(COURSE_STAGES_MAX)) { // Main courses
            this.courseName = this.courseNameTbl[this.gDialogLineNum]
            this.render_pause_castle_course_stars(x, y, Area.gCurrSaveFileNum - 1, this.gDialogLineNum)
            this.print_generic_string(x + 34, y - 5, this.textCoin)
            this.int_to_str(save_file_get_course_coin_score(Area.gCurrSaveFileNum - 1, this.gDialogLineNum), strVal)
            this.print_generic_string(x + 54, y - 5, strVal)
        } else { // Castle secret stars
            let textStarX = [ TEXT_STAR_X ]
            this.courseName = this.courseNameTbl[COURSE_MAX]
            this.print_generic_string(x + 40, y + 13, textStarX)
            this.int_to_str(save_file_get_total_star_count(Area.gCurrSaveFileNum - 1, COURSE_BONUS_STAGES - 1, COURSE_MAX - 1), strVal)
            this.print_generic_string(x + 60, y + 13, strVal)
        }

        this.print_generic_string(x - 9, y + 30, this.courseName)

        Gbi.gSPDisplayList(Game.gDisplayList, dl_ia_text_end)
    }

    render_pause_courses_and_castle() {
        const gMarioStates = [ gLinker.LevelUpdate.gMarioState ]
        let index

        switch (this.gDialogBoxState) {
            case DIALOG_STATE_OPENING:
                this.gDialogLineNum = Area.MENU_OPT_DEFAULT
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
                this.shade_screen()
                this.render_pause_my_score_coins()
                this.render_pause_red_coins()

                if (gMarioStates[0].action & ACT_FLAG_PAUSE_EXIT) {
                    this.render_pause_course_options(99, 93, this.gDialogLineNum, 15)
                }

                if (Game.gPlayer3Controller.buttonPressed & A_BUTTON || Game.gPlayer3Controller.buttonPressed & START_BUTTON) {
                    LevelUpdate.level_set_transition(0, null)
                    play_sound(SOUND_MENU_PAUSE_2, gGlobalSoundSource)
                    this.gDialogBoxState = DIALOG_STATE_OPENING
                    this.gMenuMode = this.MENU_MODE_NONE

                    if (this.gDialogLineNum == Area.MENU_OPT_EXIT_COURSE) {
                        index = this.gDialogLineNum
                    } else {
                        index = MENU_OPT_DEFAULT
                    }

                    return index
                }
            
                break
            case DIALOG_STATE_HORIZONTAL:
                this.shade_screen()
                this.print_hud_pause_colorful_str()
                this.render_pause_castle_menu_box(160, 143)
                this.render_pause_castle_main_strings(104, 60)

                if (Game.gPlayer3Controller.buttonPressed & A_BUTTON || Game.gPlayer3Controller.buttonPressed & START_BUTTON) {
                    LevelUpdate.level_set_transition(0, null)
                    play_sound(SOUND_MENU_PAUSE_2, gGlobalSoundSource)
                    this.gDialogBoxState = DIALOG_STATE_OPENING
                    this.gMenuMode = this.MENU_MODE_NONE

                    return MENU_OPT_DEFAULT
                }
                break
        }

        if (this.gDialogTextAlpha < 250) {
            this.gDialogTextAlpha += 25
        }

        return this.MENU_OPT_NONE
    }

    // END GOAL!
    render_menus_and_dialogs() {
        let index = Area.MENU_OPT_NONE

        this.create_dl_ortho_matrix()

        if (this.gMenuMode != this.MENU_MODE_NONE) {
            switch (this.gMenuMode) {
                case this.MENU_MODE_UNUSED_0:
                    index = this.render_pause_courses_and_castle();
                    break;
                case this.MENU_MODE_RENDER_PAUSE_SCREEN:
                    index = this.render_pause_courses_and_castle();
                    break;
                case this.MENU_MODE_RENDER_COURSE_COMPLETE_SCREEN:
                    // index = render_course_complete_screen();
                    break;
                case this.MENU_MODE_UNUSED_3:
                    // index = render_course_complete_screen();
                    break;
            }

            this.gDialogColorFadeTimer += 0x1000
        } else if (this.gDialogID != DIALOG_NONE) {
            // The Peach "Dear Mario" message needs to be repositioned separately
            if (this.gDialogID == DIALOG_020) {
                // print_peach_letter_message();
                return index;
            }

            this.render_dialog_entries()
            this.gDialogColorFadeTimer += 0x1000
        }

        return index
    }
}

export const IngameMenuInstance = new IngameMenu()