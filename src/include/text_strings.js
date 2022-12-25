/**
 * Global Symbols
 */
export const TEXT_ZERO = t("0")
export const TEXT_COIN = t("$")
export const TEXT_STAR = t("★")
export const TEXT_COIN_X = t("$×")
export const TEXT_STAR_X = t("★×")
export const TEXT_VARIABLE_X = t("×")
export const TEXT_UNFILLED_STAR = t("☆")

/**
 * Global Text
 */
// File Select
export const TEXT_NEW = t("NEW") // New File Text
export const TEXT_4DASHES = t("----") // Used in Score File Menu

// Ingame Menu
export const TEXT_PAUSE = t("PAUSE") // Pause text, Castle Courses
export const TEXT_HUD_CONGRATULATIONS = t("CONGRATULATIONS") // Course Complete Text, Bowser Courses

/**
 * File Select Text
 */
// Main Screens
export const TEXT_MARIO = "MARIO" // View Score Menu
export const TEXT_SELECT_FILE = "SELECT FILE"
export const TEXT_CHECK_FILE = "CHECK FILE"
export const TEXT_COPY_FILE = "COPY FILE"
export const TEXT_ERASE_FILE = "ERASE FILE"
export const TEXT_SOUND_SELECT = "SOUND SELECT"
export const TEXT_FILE_MARIO_A = "MARIO A"
export const TEXT_FILE_MARIO_B = "MARIO B"
export const TEXT_FILE_MARIO_C = "MARIO C"
export const TEXT_FILE_MARIO_D = "MARIO D"

// Menu Options
export const TEXT_SCORE = "SCORE"
export const TEXT_COPY = "COPY"
export const TEXT_ERASE = "ERASE"

// Sound Options
export const TEXT_STEREO = "STEREO"
export const TEXT_MONO = "MONO"
export const TEXT_HEADSET = "HEADSET"

// Misc Menu Text
export const TEXT_SAVED_DATA_EXISTS = "SAVED DATA EXITS" // Misspell
export const TEXT_NO_SAVED_DATA_EXISTS = "NO SAVED DATA EXISTS"

// Inside a Menu
export const TEXT_RETURN = "RETURN"
export const TEXT_CHECK_SCORE = "CHECK SCORE"
export const TEXT_COPY_FILE_BUTTON = "COPY FILE"
export const TEXT_ERASE_FILE_BUTTON = "ERASE FILE"

// Score Menu
export const TEXT_HI_SCORE = "HI SCORE"
export const TEXT_MY_SCORE = "MY SCORE"
// Score Mario Text ("☺" is the Mario face defined in the US/EU menu char table
export const TEXT_SCORE_MARIO_A = "☺A"
export const TEXT_SCORE_MARIO_B = "☺B"
export const TEXT_SCORE_MARIO_C = "☺C"
export const TEXT_SCORE_MARIO_D = "☺D"

// Copy Menu
export const TEXT_COPY_IT_TO_WHERE = "COPY IT TO WHERE?"
export const TEXT_COPYING_COMPLETED = "COPYING COMPLETED"
export const TEXT_NO_FILE_TO_COPY_FROM = "NO EMPTY FILE"

// Erase Menu
export const TEXT_SURE = "SURE?"
export const TEXT_YES = "YES"
export const TEXT_NO = "NO"
export const TEXT_FILE_MARIO_A_JUST_ERASED = "MARIO A JUST ERASED"

/**
 * Menus Text (Pause, Course Completed
 */
// Main Courses
export const TEXT_COURSE = "COURSE"
export const TEXT_MYSCORE = "MYSCORE"
export const TEXT_CONTINUE = "CONTINUE"
export const TEXT_EXIT_COURSE = "EXIT COURSE"
export const TEXT_CAMERA_ANGLE_R = "SET CAMERA ANGLE WITH R"

// Camera Options
export const TEXT_LAKITU_MARIO = "LAKITU + MARIO"
export const TEXT_LAKITU_STOP = "LAKITU + STOP"
export const TEXT_NORMAL_UPCLOSE = "(NORMAL(UP-CLOSE"
export const TEXT_NORMAL_FIXED = "(NORMAL(FIXED"

// Course Completed Misc Text
export const TEXT_CATCH = "CATCH"
export const TEXT_CLEAR = "CLEAR"
export const TEXT_HUD_HI_SCORE = "HI SCORE"

// Save Options
export const TEXT_SAVE_AND_CONTINUE = "SAVE & CONTINUE"
export const TEXT_SAVE_AND_QUIT = "SAVE & QUIT"
export const TEXT_CONTINUE_WITHOUT_SAVING = "CONTINUE, DON'T SAVE"

/**
 * Ending Peach cutscene text.
 */
export const TEXT_FILE_MARIO_EXCLAMATION = "Mario!"
export const TEXT_POWER_STARS_RESTORED = "The power of the Stars is restored to the castle..."
export const TEXT_THANKS_TO_YOU = "...and it's all thanks to you!"
export const TEXT_THANK_YOU_MARIO = "Thank you, Mario!"
export const TEXT_SOMETHING_SPECIAL = "We have to do something special for you..."
export const TEXT_LISTEN_EVERYBODY = "Listen, everybody,"
export const TEXT_LETS_HAVE_CAKE = "let's bake a delicious cake..."
export const TEXT_FOR_MARIO = "...for Mario..."
export const TEXT_FILE_MARIO_QUESTION = "Mario!"

const main_hud_cmp = [
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
    "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y", "Z"
]

export const t = (str) => {
    let i = 0
    let newStr = ""
    while (i < str.length) {
        if (str[i] == "$" && str[i+1] == "×") {
            newStr += "\x50"
            continue
        } else {
            for (let j = 0; j < main_hud_cmp.length; j++) {
                if (str[i] == main_hud_cmp[j]) newStr += j
            }
        }
        i++;
    }
}