export const main_hud_cmp = [
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", //0x
    "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", //1x
    "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", //2x
    "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "'", ".", //3x
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   //4x
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   //5x
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   ",", //6x
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   //7x
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   //8x
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   " ", "/", //9x
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   //Ax
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   //Bx
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   //Cx
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   //Dx
    0,   "(", "",  ")", "",  "&", "...",0,  0,   0,   0,   0,   0,   0,   0,   0,   //Ex
    0,   0,   "!", "%", "?", "“", "”", "~", 0,   "$", "★", "×", "!", "☆"           //Fx
]


export const t = (str) => {
    let i = 0
    let newStr = ""
    while (i < str.length) {
        if (str[i] == "y" && str[i+1] == "o" && str[i+2] == "u") newStr += "\xD1"
        else if (str[i] == "t" && str[i+1] == "h" && str[i+2] == "e") newStr += "\xD2"
        else if (str[i] == "." && str[i+1] == "." && str[i+2] == ".") newStr += "\xE6"
        else if (str[i] == "\n") newStr += "\xFE"
        else {
            newStr += String.fromCharCode(main_hud_cmp.indexOf(str[i]))
        }
        i++;
    }
    newStr += "\xFF"
    return newStr
}

export const m = (str) => {
    let i = 0
    let newStr = ""
    while (i < str.length) {
        if (str[i] == "×") newStr += "\x32"
        else if (str[i] == "$") newStr += "\x33"
        else if (str[i] == "☺") newStr += "\x34"
        else if (str[i] == "★") newStr += "\x35"
        else if (str[i] == "'") newStr += "\x38"
        else if (str[i] == '"') newStr += "\x39"
        else {
            newStr += String.fromCharCode(main_hud_cmp.indexOf(str[i]))
        }
        i++;
    }
    newStr += "\xFF"
    return newStr
}

export const unt = (str) => {
    let i = 0
    let newStr = ""
    while (i < str.length) {
        if (str[i] == "\xD1") newStr += "you"
        else if (str[i] == "\xD2") newStr += "the"
        else if (str[i] == "\xE6") newStr += "..."
        else if (str[i] == "\xFE") newStr += "\n"
        else if (str[i] == "\xFF") break;
        else {
            newStr += main_hud_cmp[str[i].charCodeAt(0)]
        }
        i++;
    }
    return newStr
}

export const unm = (str) => {
    let i = 0
    let newStr = ""
    while (i < str.length) {
        if (str[i] == "\x32") newStr += "×"
        else if (str[i] == "\x33") newStr += "$"
        else if (str[i] == "\x34") newStr += "☺"
        else if (str[i] == "\x35") newStr += "★"
        else if (str[i] == "\x38") newStr += "'"
        else if (str[i] == "\x39") newStr += '"'
        else if (str[i] == "\xFF") break;
        else {
            newStr += main_hud_cmp[str[i].charCodeAt(0)]
        }
        i++;
    }
    return newStr
}

/**
 * Global Symbols
 */
export const TEXT_ZERO = t("0")
export const TEXT_COIN = t("$")
export const TEXT_STAR = t("★")
export const TEXT_COIN_X = t("$×")
export const TEXT_STAR_X = m("★×")
export const TEXT_VARIABLE_X = t("×")
export const TEXT_UNFILLED_STAR = t("☆")

/**
 * Global Text
 */
// File Select
export const TEXT_NEW = t("NEW") // New File Text
export const TEXT_4DASHES = t("----") // Used in Score File Menu

// Ingame Menu
export const TEXT_PAUSE = m("PAUSE") // Pause text, Castle Courses
export const TEXT_HUD_CONGRATULATIONS = t("CONGRATULATIONS") // Course Complete Text, Bowser Courses

/**
 * File Select Text
 */
// Main Screens
export const TEXT_MARIO = t("MARIO") // View Score Menu
export const TEXT_SELECT_FILE = t("SELECT FILE")
export const TEXT_CHECK_FILE = t("CHECK FILE")
export const TEXT_COPY_FILE = t("COPY FILE")
export const TEXT_ERASE_FILE = t("ERASE FILE")
export const TEXT_SOUND_SELECT = t("SOUND SELECT")
export const TEXT_FILE_MARIO_A = t("MARIO A")
export const TEXT_FILE_MARIO_B = t("MARIO B")
export const TEXT_FILE_MARIO_C = t("MARIO C")
export const TEXT_FILE_MARIO_D = t("MARIO D")

// Menu Options
export const TEXT_SCORE = t("SCORE")
export const TEXT_COPY = t("COPY")
export const TEXT_ERASE = t("ERASE")

// Sound Options
export const TEXT_STEREO = t("STEREO")
export const TEXT_MONO = t("MONO")
export const TEXT_HEADSET = t("HEADSET")

// Misc Menu Text
export const TEXT_SAVED_DATA_EXISTS = t("SAVED DATA EXITS") // Misspell
export const TEXT_NO_SAVED_DATA_EXISTS = t("NO SAVED DATA EXISTS")

// Inside a Menu
export const TEXT_RETURN = t("RETURN")
export const TEXT_CHECK_SCORE = t("CHECK SCORE")
export const TEXT_COPY_FILE_BUTTON = t("COPY FILE")
export const TEXT_ERASE_FILE_BUTTON = t("ERASE FILE")

// Score Menu
export const TEXT_HI_SCORE = t("HI SCORE")
export const TEXT_MY_SCORE = t("MY SCORE")
// Score Mario Text ("☺" is the Mario face defined in the US/EU menu char table
export const TEXT_SCORE_MARIO_A = t("☺A")
export const TEXT_SCORE_MARIO_B = t("☺B")
export const TEXT_SCORE_MARIO_C = t("☺C")
export const TEXT_SCORE_MARIO_D = t("☺D")

// Copy Menu
export const TEXT_COPY_IT_TO_WHERE = t("COPY IT TO WHERE?")
export const TEXT_COPYING_COMPLETED = t("COPYING COMPLETED")
export const TEXT_NO_FILE_TO_COPY_FROM = t("NO EMPTY FILE")

// Erase Menu
export const TEXT_SURE = t("SURE?")
export const TEXT_YES = t("YES")
export const TEXT_NO = t("NO")
export const TEXT_FILE_MARIO_A_JUST_ERASED = t("MARIO A JUST ERASED")

/**
 * Menus Text (Pause, Course Completed
 */
// Main Courses
export const TEXT_COURSE = t("COURSE")
export const TEXT_MYSCORE = t("MYSCORE")
export const TEXT_CONTINUE = t("CONTINUE")
export const TEXT_EXIT_COURSE = t("EXIT COURSE")
export const TEXT_CAMERA_ANGLE_R = t("SET CAMERA ANGLE WITH R")

// Camera Options
export const TEXT_LAKITU_MARIO = t("LAKITU + MARIO")
export const TEXT_LAKITU_STOP = t("LAKITU + STOP")
export const TEXT_NORMAL_UPCLOSE = t("(NORMAL(UP-CLOSE")
export const TEXT_NORMAL_FIXED = t("(NORMAL(FIXED")

// Course Completed Misc Text
export const TEXT_CATCH = t("CATCH")
export const TEXT_CLEAR = t("CLEAR")
export const TEXT_HUD_HI_SCORE = t("HI SCORE")

// Save Options
export const TEXT_SAVE_AND_CONTINUE = t("SAVE & CONTINUE")
export const TEXT_SAVE_AND_QUIT = t("SAVE & QUIT")
export const TEXT_CONTINUE_WITHOUT_SAVING = t("CONTINUE, DON'T SAVE")

/**
 * Ending Peach cutscene text.
 */
export const TEXT_FILE_MARIO_EXCLAMATION = t("Mario!")
export const TEXT_POWER_STARS_RESTORED = t("The power of the Stars is restored to the castle...")
export const TEXT_THANKS_TO_YOU = t("...and it's all thanks to you!")
export const TEXT_THANK_YOU_MARIO = t("Thank you, Mario!")
export const TEXT_SOMETHING_SPECIAL = t("We have to do something special for you...")
export const TEXT_LISTEN_EVERYBODY = t("Listen, everybody,")
export const TEXT_LETS_HAVE_CAKE = t("let's bake a delicious cake...")
export const TEXT_FOR_MARIO = t("...for Mario...")
export const TEXT_FILE_MARIO_QUESTION = t("Mario!")