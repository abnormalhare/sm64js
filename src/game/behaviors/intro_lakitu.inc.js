import { atan2s, vec3f_add, vec3f_get_dist_and_angle, vec3f_set, vec3f_set_dist_and_angle } from "../../engine/math_util"
import { MODEL_MIST } from "../../include/model_ids"
import { oAction, oAnimState, oFaceAnglePitch, oFaceAngleYaw, oForwardVel, oIntroLakituCloud, oIntroLakituSplineSegment, oIntroLakituSplineSegmentProgress, oIntroLakituUnk100, oIntroLakituUnk104, oIntroLakituUnk108, oIntroLakituUnk10C, oMoveAnglePitch, oMoveAngleYaw, oPosX, oPosY, oPosZ, oTimer } from "../../include/object_constants"
import { SOUND_ACTION_FLYING_FAST, SOUND_ACTION_INTRO_UNK45E, SOUND_ACTION_INTRO_UNK45F, SOUND_AIR_LAKITU_FLY_HIGHPRIO } from "../../include/sounds"
import { coss } from "../../utils"
import { CameraInstance as Camera, CUTSCENE_END_WAVING } from "../Camera"
import { cur_obj_disable_rendering, cur_obj_enable_rendering, cur_obj_set_pos_via_transform, obj_mark_for_deletion, spawn_object_relative_with_scale } from "../ObjectHelpers"
import { cur_obj_play_sound_1, cur_obj_play_sound_2 } from "../SpawnSound"
import { spawn_mist_from_global } from "./ground_particles.inc"

export const TIMER1 = 720
export const TIMER2 = 98

/**
 * @file intro_lakitu.inc.c
 * This file implements lakitu's behvaior during the intro cutscene.
 * It's also used during the ending cutscene.
 */

/**
 * Add the camera's position to `offset`, rotate the point to be relative to the camera's focus, then
 * set lakitu's location.
 */

const intro_lakitu_set_offset_from_camera = (obj, offset) => {
    let dist
    let focusAngles = []
    let offsetPitch
    let offsetYaw
    const wrapper = {}
    vec3f_add(offset, Camera.gCamera.pos)
    vec3f_get_dist_and_angle(Camera.gCamera.pos, Camera.gCamera.focus, wrapper)
    dist = wrapper.dist; focusAngles[0] = wrapper.pitch; focusAngles[1] = wrapper.yaw
    vec3f_get_dist_and_angle(Camera.gCamera.pos, offset, wrapper)
    dist = wrapper.dist; offsetPitch = wrapper.pitch; offsetYaw = wrapper.yaw
    vec3f_set_dist_and_angle(Camera.gCamera.pos, offset, dist, focusAngles[0] + offsetPitch, focusAngles[1] + offsetYaw)
    Camera.vec3f_to_object_pos(obj, offset)
}

const intro_lakitu_set_focus = (obj, newFocus) => {
    // newFocus is an offset from lakitu's origin, not a point in the world.
    const wrapper = {}

    let origin = [0.0, 0.0, 0.0]
    vec3f_get_dist_and_angle(origin, newFocus, wrapper)

    obj.rawData[oFaceAnglePitch] = wrapper.pitch
    obj.rawData[oFaceAngleYaw] = wrapper.yaw
}

/**
 * Move lakitu along the spline `offset`, relative to the camera, and face him towards the corresponding
 * location along the spline `focus`.
 */
const intro_lakitu_set_pos_and_focus = (obj, offset, focus) => {
    let newOffset = [0.0, 0.0, 0.0]
    let newFocus = [0.0, 0.0, 0.0]
    let splineFinished = 0
    let splineSegment = obj.rawData[oIntroLakituSplineSegment]
    const wrapper = {splineSegment: splineSegment, progress: obj.rawData[oIntroLakituSplineSegmentProgress]}

    if (Camera.move_point_along_spline(newFocus, offset, wrapper) == 1
        || Camera.move_point_along_spline(newOffset, focus, wrapper) == 1) {
        splineFinished++;
    }

    obj.rawData[oIntroLakituSplineSegment] = wrapper.splineSegment
    obj.rawData[oIntroLakituSplineSegmentProgress] = wrapper.progress

    intro_lakitu_set_offset_from_camera(obj, newOffset)
    intro_lakitu_set_focus(obj, newFocus)

    return splineFinished
}

export const bhv_intro_lakitu_loop = () => {
    const o = gLinker.ObjectListProcessor.gCurrentObject

    let sp58 = []
    let sp4C = []
    let sp64 = []

    switch (o.rawData[oAction]) {
        case 0:
            cur_obj_disable_rendering()

            o.rawData[oIntroLakituSplineSegment] = 0
            o.rawData[oIntroLakituSplineSegmentProgress] = 0
            o.rawData[oIntroLakituCloud] = spawn_object_relative_with_scale(1, 0, 0, 0, 2.0, o, MODEL_MIST, gLinker.behaviors.bhvCloud)

            if (Camera.cutscene == CUTSCENE_END_WAVING) o.rawData[oAction] = 100
            else o.rawData[oAction]++
            break

        case 1:
            cur_obj_enable_rendering()

            if (Camera.gCutsceneTimer > 350 && Camera.gCutsceneTimer < 458) {
                o.rawData[oPosX] = Camera.gCamera.pos[0]
                o.rawData[oPosY] = Camera.gCamera.pos[1] + 500.0
                o.rawData[oPosZ] = Camera.gCamera.pos[2]
            }

            if (Camera.gCutscene > 52) cur_obj_play_sound_1(SOUND_AIR_LAKITU_FLY_HIGHPRIO)

            if (intro_lakitu_set_pos_and_focus(o, Camera.gIntroLakituStartToPipeOffsetFromCamera, Camera.gIntroLakituStartToPipeFocus) == 1)
                o.rawData[oAction]++
            
            switch (o.rawData[oTimer]) {
                case 534:
                    cur_obj_play_sound_2(SOUND_ACTION_FLYING_FAST);
                    break;
                case 581:
                    cur_obj_play_sound_2(SOUND_ACTION_INTRO_UNK45E);
                    break;
                case 73:
                    o.rawData[oAnimState]++
                    break
                case 74:
                    o.rawData[oAnimState]--
                    break
                case 82:
                    o.rawData[oAnimState]++
                    break
                case 84:
                    o.rawData[oAnimState]--
                    break
            }
        
        case 2: 
            if (Camera.gCutsceneTimer > TIMER1) {
                o.rawData[oAction]++
                o.rawData[oIntroLakituUnk100] = 1400.0
                o.rawData[oIntroLakituUnk104] = -4096.0
                o.rawData[oIntroLakituUnk108] = 2048.0
                o.rawData[oIntroLakituUnk10C] = -200.0

                o.rawData[oMoveAngleYaw] = 0x8000
                o.rawData[oFaceAngleYaw] = o.rawData[oMoveAngleYaw] + 0x4000
                o.rawData[oMoveAnglePitch] = 0x800
            }

            cur_obj_play_sound_1(SOUND_AIR_LAKITU_FLY_HIGHPRIO)
            break

        case 3:
            cur_obj_play_sound_1(SOUND_AIR_LAKITU_FLY_HIGHPRIO)

            vec3f_set(sp58, -1128.0, 560.0, 4664.0)
            o.rawData[oMoveAngleYaw] += 0x200
            o.rawData[oIntroLakituUnk100] = Camera.approach_f32_asymptotic(o.rawData[oIntroLakituUnk100], 100.0, 0.03)
            o.rawData[oFaceAnglePitch] = atan2s(200.0, o.rawData[oPosY] - 400.0)
            o.rawData[oFaceAngleYaw] = Camera.approach_s16_asymptotic(o.rawData[oFaceAngleYaw], o.rawData[oMoveAngleYaw] + 0x8000, 4)
            vec3f_set_dist_and_angle(sp58, sp4C, o.rawData[oIntroLakituUnk100], 0, o.rawData[oMoveAngleYaw])
            sp4C[1] += 150.0 * coss(o.rawData[oIntroLakituUnk104])
            o.rawData[oIntroLakituUnk104] += o.rawData[oIntroLakituUnk108]
            o.rawData[oIntroLakituUnk108] = Camera.approach_f32_asymptotic(o.rawData[oIntroLakituUnk108], 512.0, 0.05)
            sp4C[0] += o.rawData[oIntroLakituUnk10C]
            o.rawData[oIntroLakituUnk10C] = Camera.approach_f32_asymptotic(o.rawData[oIntroLakituUnk10C], 0.0, 0.05)
            Camera.vec3f_to_object_pos(o, sp4C)

            if (o.rawData[oTimer] == 31) {
                o.rawData[oPosY] -= 158.0
                // Spawn white ground particles
                spawn_mist_from_global()
                o.rawData[oPosY] += 158.0
            }

            if (o.rawData[oTimer] == TIMER2) {
                obj_mark_for_deletion(o)
                obj_mark_for_deletion(o.rawData[oIntroLakituCloud])
            }

            if (o.rawData[oTimer] == 14)
                cur_obj_play_sound_2(SOUND_ACTION_INTRO_UNK45F)
            
            break

        case 100:
            cur_obj_enable_rendering()

            vec3f_set(sp64, -100.0, 100.0, 300.0)
            Camera.offset_rotated(sp4C, Camera.gCamera.pos, sp64, Camera.gPlayerCameraState.faceAngle)
            Camera.vec3f_to_object_pos(o, sp4C)

            o.rawData[oMoveAnglePitch] = 0x1000
            o.rawData[oMoveAngleYaw] = 0x9000
            o.rawData[oFaceAnglePitch] = o.rawData[oMoveAnglePitch] / 2
            o.rawData[oFaceAngleYaw] = o.rawData[oMoveAngleYaw]
            o.rawData[oAction]++
            break

        case 101:
            Camera.object_pos_to_vec3f(sp4C, o)

            if (o.rawData[oTimer] > 60) {
                o.rawData[oForwardVel] = Camera.approach_f32_asymptotic(o.rawData[oForwardVel], -10.0, 0.05)
                o.rawData[oMoveAngleYaw] += 0x78
                o.rawData[oMoveAnglePitch] == 0x40
                o.rawData[oFaceAngleYaw] = Camera.camera_approach_s16_symmetric(o.rawData[oFaceAngleYaw], Camera.calculate_yaw(sp4C, Camera.gCamera.pos), 0x200)
            }

            if (o.rawData[oTimer] > 105) {
                o.rawData[oAction]++
                o.rawData[oMoveAnglePitch] = 0xE00
            }

            o.rawData[oFaceAnglePitch] = 0

            cur_obj_set_pos_via_transform()
            break

        case 102: 
            Camera.object_pos_to_vec3f(sp4C, o)

            o.rawData[oForwardVel] = Camera.approach_f32_asymptotic(o.rawData[oForwardVel], 60.0, 0.05)
            o.rawData[oFaceAngleYaw] = Camera.camera_approach_s16_symmetric(o.rawData[oFaceAngleYaw], Camera.calculate_yaw(sp4C, Camera.gCamera.pos), 0x200)

            if (o.rawData[oTimer] < 62)
                o.rawData[oMoveAngleYaw] = Camera.approach_s16_asymptotic(o.rawData[oMoveAngleYaw], 0x8000, 0x1E)

            o.rawData[oMoveAnglePitch] = Camera.approach_s16_asymptotic(o.rawData[oMoveAnglePitch], -0x2000, 0x5A)
            o.rawData[oFaceAnglePitch] = 0

            cur_obj_set_pos_via_transform()
            break
    }
}

gLinker.bhv_intro_lakitu_loop = bhv_intro_lakitu_loop