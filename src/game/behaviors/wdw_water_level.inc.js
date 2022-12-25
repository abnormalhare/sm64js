// wdw_water_level.inc.c

import { oAction, oAngleVelYaw, oFaceAngleYaw, oPosY, oTimer, oWaterLevelTriggerTargetWaterLevel, oWaterLevelTriggerUnkF4, WATER_LEVEL_DIAMOND_ACT_CHANGE_WATER_LEVEL, WATER_LEVEL_DIAMOND_ACT_IDLE, WATER_LEVEL_DIAMOND_ACT_IDLE_SPINNING, WATER_LEVEL_DIAMOND_ACT_INIT } from "../../include/object_constants"
import { SOUND_ENV_WATER_DRAIN, SOUND_GENERAL_WATER_LEVEL_TRIG } from "../../include/sounds"
import { sins } from "../../utils"
import { approach_s16_symmetric, obj_check_if_collided_with_object } from "../ObjectHelpers"
import { cur_obj_play_sound_1, cur_obj_play_sound_2 } from "../SpawnSound"

// called when WDW is loaded.
export const bhv_init_changing_water_level_loop = () => {
    const OLP = gLinker.ObjectListProcessor
    const o = OLP.gCurrentObject
    if (o.rawData[oAction] == 0) {
        if (OLP.gEnvironmentRegions != null) o.rawData[oAction]++
    } else if (o.rawData[oTimer] < 10) {
        OLP.gEnvironmentLevels[0] = OLP.gEnvironmentRegions[6]
    } else {
        OLP.gEnvironmentRegions[6] = OLP.gEnvironmentLevels[0] + sins(o.rawData[oWaterLevelTriggerUnkF4]) * 20.0
        o.rawData[oWaterLevelTriggerUnkF4] += 0x200
    }
}

export const bhv_water_level_diamond_loop = () => {
    const OLP = gLinker.ObjectListProcessor
    const o = OLP.gCurrentObject
    const gMarioObject = OLP.gMarioObject
    if (OLP.gEnvironmentRegions != null) {
        switch (o.rawData[oAction]) {
            case WATER_LEVEL_DIAMOND_ACT_INIT:
                o.rawData[oFaceAngleYaw] = 0;
                o.rawData[oWaterLevelTriggerTargetWaterLevel] = o.rawData[oPosY]
                if (o.rawData[oTimer] > 10) o.rawData[oAction]++ // Sets to WATER_LEVEL_DIAMOND_ACT_IDLE
                break
            
            case WATER_LEVEL_DIAMOND_ACT_IDLE:
                if (obj_check_if_collided_with_object(o, gMarioObject) && !OLP.gWDWWaterLevelChanging) {
                    o.rawData[oAction]++
                    OLP.gWDWWaterLevelChanging = true
                }
                break
            
            case WATER_LEVEL_DIAMOND_ACT_CHANGE_WATER_LEVEL:
                o.rawData[oAngleVelYaw] = 0
                OLP.gEnvironmentLevels[0] = approach_s16_symmetric(OLP.gEnvironmentLevels[0], o.rawData[oWaterLevelTriggerTargetWaterLevel], 10.0)
                if (OLP.gEnvironmentLevels[0] == o.rawData[oWaterLevelTriggerTargetWaterLevel]) {
                    if (o.rawData[oFaceAngleYaw] == 0) o.rawData[oAction]++ // Sets to WATER_LEVEL_DIAMOND_ACT_IDLE_SPINNING
                    else o.rawData[oAngleVelYaw] = 0x800
                } else if (o.rawData[oTimer] == 0) cur_obj_play_sound_2(SOUND_GENERAL_WATER_LEVEL_TRIG)
                else cur_obj_play_sound_1(SOUND_ENV_WATER_DRAIN)
                o.rawData[oAngleVelYaw] = 0x800
                break;
            
            case WATER_LEVEL_DIAMOND_ACT_IDLE_SPINNING:
                if (!obj_check_if_collided_with_object(o, gMarioObject)) {
                    OLP.gWDWWaterLevelChanging = false
                    o.rawData[oAction] = WATER_LEVEL_DIAMOND_ACT_IDLE
                    o.rawData[oAngleVelYaw] = 0
                }
                break
        }
        o.rawData[oFaceAngleYaw] += o.rawData[oAngleVelYaw]
    }
}

gLinker.bhv_init_changing_water_level_loop = bhv_init_changing_water_level_loop
gLinker.bhv_water_level_diamond_loop = bhv_water_level_diamond_loop