import * as _Linker from "../../game/Linker"
import { MODEL_FWOOSH, MODEL_MIST } from "../../include/model_ids"
import { ACTIVE_FLAG_DEACTIVATED, CLOUD_ACT_FWOOSH_HIDDEN, CLOUD_ACT_MAIN, CLOUD_ACT_SPAWN_PARTS, CLOUD_ACT_UNLOAD, CLOUD_BP_FWOOSH, oAction, oBehParams2ndByte, oCloudBlowing, oCloudCenterX, oCloudCenterY, oCloudFwooshMovementRadius, oCloudGrowSpeed, oDistanceToMario, oFaceAngleYaw, oHomeY, oMoveAngleYaw, oPosX, oPosY, oPosZ, oTimer } from "../../include/object_constants"
import { SOUND_AIR_BLOW_WIND, SOUND_ENV_WIND1 } from "../../include/sounds"
import { coss, sins } from "../../utils"
import { approach_f32_ptr } from "../ObjBehaviors2"
import { cur_obj_scale, cur_obj_set_pos_to_home, cur_obj_unhide, obj_mark_for_deletion, obj_set_billboard, spawn_object_relative } from "../ObjectHelpers"
import { cur_obj_play_sound_1 } from "../SpawnSound"
import { cur_obj_spawn_strong_wind_particles } from "./strong_wind_particle.inc"

/**
 * Behavior for bhvCloud and bhvCloudPart.
 * bhvCloud includes both fwoosh and the cloud that lakitu rides (both nice and
 * evil).
 * bhvCloudPart is spawned by bhvCloud and is either a "chunk" of cloud, or fwoosh's
 * face. It is purely visual.
 * If spawned by a lakitu, its parent will be the lakitu.
 * Processing order is lakitu -> cloud -> its cloud parts.
 */

/**
 * The relative heights of each cloud part.
 */
const sCloudPartHeights = [11, 8, 12, 8, 9, 9]

/**
 * Spawn the visual parts of the cloud, including fwoosh's face.
 */
const cloud_act_spawn_parts = () => {
    const o = gLinker.ObjectListProcessor.gCurrentObject

    let cloudPart = []

    // Spawn the pieces of the cloud itself
    for (let i = 0; i < 5; i++) {
        cloudPart = spawn_object_relative(i, 0, 0, 0, o, MODEL_MIST, gLinker.behaviors.bhvCloudPart)

        if (cloudPart != null) {
            obj_set_billboard(cloudPart)
        }
    }

    if (o.rawData[oBehParams2ndByte] == CLOUD_BP_FWOOSH) {
        // Spawn fwoosh's face
        spawn_object_relative(5, 0, 0, 0, o, MODEL_FWOOSH, gLinker.behaviors.bhvCloudPart)

        cur_obj_scale(3.0)

        o.rawData[oCloudCenterX] = o.rawData[oPosX]
        o.rawData[oCloudCenterY] = o.rawData[oPosY]
    }

    o.rawData[oAction] = CLOUD_ACT_MAIN
}

/**
 * Wait for mario to approach, then unhide and enter the spawn parts action.
 */
const cloud_act_fwoosh_hidden = () => {
    const o = gLinker.ObjectListProcessor.gCurrentObject

    if (o.rawData[oDistanceToMario] < 2000.0) {
        cur_obj_unhide()
        o.rawData[oAction] = CLOUD_ACT_SPAWN_PARTS
    }
}

/**
 * Move in a circle. Unload if mario moves far away. If mario stays close for
 * long enough, blow wind at him.
 */
const cloud_fwoosh_update = () => {
    const o = gLinker.ObjectListProcessor.gCurrentObject

    if (o.rawData[oDistanceToMario] > 2500.0) {
        o.rawData[oAction] = CLOUD_ACT_UNLOAD
    } else {
        if (o.rawData[oCloudBlowing]) {
            o.gfx.scale[0] += o.rawData[oCloudGrowSpeed]
            o.rawData[oCloudGrowSpeed] -= 0.005

            if (o.rawData[oCloudGrowSpeed] < -0.16) {
                // Stop blowing once we are shrinking faster than -0.16
                o.rawData[oCloudBlowing] = o.rawData[oTimer] = 0
            } else if (o.rawData[oCloudGrowSpeed] < -0.1) {
                // Start blowing once we start shrinking faster than -0.1
                cur_obj_play_sound_1(SOUND_AIR_BLOW_WIND)
                cur_obj_spawn_strong_wind_particles(12, 3.0, 0.0, -50.0, 120.0)
            } else {
                cur_obj_play_sound_1(SOUND_ENV_WIND1)
            }
        } else {
            // Return to normal size
            const wrapper = { px: o.gfx.scale[0] }
            approach_f32_ptr(wrapper, 3.0, 0.012)
            o.gfx.scale[0] = wrapper.px

            o.rawData[oCloudFwooshMovementRadius] += 0xC8

            // If mario stays nearby for 100 frames, begin blowing
            if (o.rawData[oDistanceToMario] < 1000.0) {
                if (o.rawData[oTimer] > 100) {
                    o.rawData[oCloudBlowing] = true
                    o.rawData[oCloudGrowSpeed] = 0.14
                }
            } else
                o.rawData[oTimer] = 0
            
            o.rawData[oCloudCenterX] = o.rawData[oPosX] + 100.0 * coss(o.rawData[oCloudFwooshMovementRadius])
            o.rawData[oCloudCenterY] = o.rawData[oHomeY]
            o.rawData[oPosZ] = o.rawData[oHomeZ] + 100.0 * sins(o.rawData[oCloudFwooshMovementRadius])
        }

        cur_obj_scale(o.gfx.scale[0])
    }
}

const cloud_act_main = () => {
    const o = gLinker.ObjectListProcessor.gCurrentObject

    let localOffsetPhase = 0x800 * window.gGlobalTimer
    if (o.parentObj != o) {
        if (o.parentObj.activeFlags == ACTIVE_FLAG_DEACTIVATED) {
            o.rawData[oAction] = CLOUD_ACT_UNLOAD
        } else {
            o.rawData[oCloudCenterX] = o.parentObj.rawData[oPosX]
            o.rawData[oCloudCenterY] = o.parentObj.rawData[oPosY]
            o.rawData[oPosZ] = o.parentObj.rawData[oPosZ]
            o.rawData[oMoveAngleYaw] = o.parentObj.rawData[oFaceAngleYaw]
        }
    } else if (o.rawData[oBehParams2ndByte] != CLOUD_BP_FWOOSH) {
        // This code should never run, since a lakitu cloud should always have
        // a parent
        if (o.rawData[oDistanceToMario] > 1500.0) {
            o.rawData[oAction] = CLOUD_ACT_UNLOAD
        }
    } else {
        cloud_fwoosh_update()
    }

    let localOffset = 2 * coss(localOffsetPhase) * o.gfx.scale[0]

    o.rawData[oPosX] = o.rawData[oCloudCenterX] + localOffset
    o.rawData[oPosY] = o.rawData[oCloudCenterY] + 12.0 * o.gfx.scale[0]
}

const cloud_act_unload = () => {
    const o = gLinker.ObjectListProcessor.gCurrentObject

    if (o.rawData[oBehParams2ndByte] != CLOUD_BP_FWOOSH) {
        obj_mark_for_deletion(o)
    } else {
        o.rawData[oAction] = CLOUD_ACT_FWOOSH_HIDDEN
        cur_obj_hide()
        cur_obj_set_pos_to_home()
    }
}

/**
 * Update function for bhvCloud.
 */
export const bhv_cloud_update = () => {
    const o = gLinker.ObjectListProcessor.gCurrentObject

    switch (o.rawData[oAction]) {
        case CLOUD_ACT_SPAWN_PARTS:
            cloud_act_spawn_parts();
            break;
        case CLOUD_ACT_MAIN:
            cloud_act_main();
            break;
        case CLOUD_ACT_UNLOAD:
            cloud_act_unload();
            break;
        case CLOUD_ACT_FWOOSH_HIDDEN:
            cloud_act_fwoosh_hidden();
            break;
    }
}

export const bhv_cloud_part_update = () => {
    const o = gLinker.ObjectListProcessor.gCurrentObject

    if (o.parentObj.rawData[oAction] == CLOUD_ACT_UNLOAD) {
        obj_mark_for_deletion(o)
    } else {
        let scale = 2.0 / 3.0 * o.parentObj.gfx.scale[0]
        let angleFromCenter = o.parentObj.rawData[oFaceAngleYaw] + 0x10000 / 5 * o.rawData[oBehParams2ndByte]

        // Takes 32 frames to cycle
        let localOffsetPhase = 0x800 * window.gGlobalTimer + 0x4000 * o.rawData[oBehParams2ndByte]

        cur_obj_scale(scale)

        // Cap fwoosh's face size
        if (o.rawData[oBehParams2ndByte] == 5 && scale > 2.0)
            scale = o.gfx.scale[1] = 2.0
        
        // Move back and forth along (1, 1, 1)
        let localOffset = 2 * coss(localOffsetPhase) * scale
        let cloudRadius = 25.0 * scale

        o.rawData[oPosX] = o.parentObj.rawData[oCloudCenterX] + cloudRadius * sins(angleFromCenter) + localOffset
        o.rawData[oPosY] = o.parentObj.rawData[oCloudCenterY] + localOffset + scale * sCloudPartHeights[o.rawData[oBehParams2ndByte]]
        o.rawData[oPosZ] = o.parentObj.rawData[oPosZ] + cloudRadius * sins(angleFromCenter) + localOffset
        o.rawData[oFaceAngleYaw] = o.parentObj.rawData[oFaceAngleYaw]
    }
}

gLinker.bhv_cloud_update = bhv_cloud_update
gLinker.bhv_cloud_part_update = bhv_cloud_part_update