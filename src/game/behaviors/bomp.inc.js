import { BOMP_ACT_EXTEND, BOMP_ACT_POKE_OUT, BOMP_ACT_RETRACT, BOMP_ACT_WAIT, oAction, oFaceAngleYaw, oForwardVel, oMoveAngleYaw, oPosX, oSmallBompInitX, oTimer } from "../../include/object_constants";
import { SOUND_OBJ_UNKNOWN2 } from "../../include/sounds";
import { random_float } from "../../utils";
import { cur_obj_play_sound_2 } from "../SpawnSound";

export const bhv_small_bomp_init = () => {
    const o = gLinker.ObjectListProcessor.gCurrentObject;

    o.rawData[oFaceAngleYaw] -= 0x4000;
    o.rawData[oSmallBompInitX] = o.rawData[oPosX];
    o.rawData[oTimer] = random_float() * 100.0;
}

export const bhv_small_bomp_loop = () => {
    const o = gLinker.ObjectListProcessor.gCurrentObject;

    switch (o.rawData[oAction]) {
        case BOMP_ACT_WAIT:
            if (o.rawData[oTimer] >= 101) {
                o.rawData[oAction] = BOMP_ACT_POKE_OUT;
                o.rawData[oForwardVel] = 30.0;
            }
            break;

        case BOMP_ACT_POKE_OUT:
            if (o.rawData[oPosX] > 3450.0) {
                o.rawData[oPosX] = 3450.0;
                o.rawData[oForwardVel] = 0;
            }

            if (o.rawData[oTimer] == 15.0) {
                o.rawData[oAction] = BOMP_ACT_EXTEND;
                o.rawData[oForwardVel] = 40.0;
                cur_obj_play_sound_2(SOUND_OBJ_UNKNOWN2);
            }
            break;

        case BOMP_ACT_EXTEND:
            if (o.rawData[oPosX] > 3830.0) {
                o.rawData[oPosX] = 3830.0;
                o.rawData[oForwardVel] = 0;
            }

            if (o.rawData[oTimer] == 60) {
                o.rawData[oAction] = BOMP_ACT_RETRACT;
                o.rawData[oForwardVel] = 10.0
                o.rawData[oMoveAngleYaw] -= 0x8000;
                cur_obj_play_sound_2(SOUND_OBJ_UNKNOWN2);
            }
            break;

        case BOMP_ACT_RETRACT:
            if (o.rawData[oPosX] < 3330.0) {
                o.rawData[oPosX] = 3330.0;
                o.rawData[oForwardVel] = 0;
            }

            if (o.rawData[oTimer] == 90) {
                o.rawData[oAction] = BOMP_ACT_POKE_OUT;
                o.rawData[oForwardVel] = 25.0;
                o.rawData[oMoveAngleYaw] += 0x8000;
            }
            break;
    }
}

export const bhv_large_bomp_init = () => {
    const o = gLinker.ObjectListProcessor.gCurrentObject;
    o.rawData[oMoveAngleYaw] += 0x4000;
    o.rawData[oTimer] = random_float() * 100.0;
}

export const bhv_large_bomp_loop = () => {
    const o = gLinker.ObjectListProcessor.gCurrentObject;

    switch (o.rawData[oAction]) {
        case BOMP_ACT_WAIT:
            if (o.rawData[oTimer] >= 101) {
                o.rawData[oAction] = BOMP_ACT_POKE_OUT;
                o.rawData[oForwardVel] = 30.0;
            }
            break;

        case BOMP_ACT_POKE_OUT:
            if (o.rawData[oPosX] > 3450.0) {
                o.rawData[oPosX] = 3450.0;
                o.rawData[oForwardVel] = 0;
            }

            if (o.rawData[oTimer] == 15.0) {
                o.rawData[oAction] = BOMP_ACT_EXTEND;
                o.rawData[oForwardVel] = 10.0;
                cur_obj_play_sound_2(SOUND_OBJ_UNKNOWN2);
            }
            break;

        case BOMP_ACT_EXTEND:
            if (o.rawData[oPosX] > 3830.0) {
                o.rawData[oPosX] = 3830.0;
                o.rawData[oForwardVel] = 0;
            }

            if (o.rawData[oTimer] == 60) {
                o.rawData[oAction] = BOMP_ACT_RETRACT;
                o.rawData[oForwardVel] = 10.0;
                o.rawData[oMoveAngleYaw] -= 0x8000;
                cur_obj_play_sound_2(SOUND_OBJ_UNKNOWN2);
            }
            break;

        case BOMP_ACT_RETRACT:
            if (o.rawData[oPosX] < 3330.0) {
                o.rawData[oPosX] = 3330.0;
                o.rawData[oForwardVel] = 0;
            }

            if (o.rawData[oTimer] == 90) {
                o.rawData[oAction] = BOMP_ACT_POKE_OUT;
                o.rawData[oForwardVel] = 25.0;
                o.rawData[oMoveAngleYaw] += 0x8000;
            }
            break;
    }
}

gLinker.bhv_small_bomp_init = bhv_small_bomp_init;
gLinker.bhv_small_bomp_loop = bhv_small_bomp_loop;
gLinker.bhv_large_bomp_init = bhv_large_bomp_init;
gLinker.bhv_large_bomp_loop = bhv_large_bomp_loop;