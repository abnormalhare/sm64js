import { oAction, oBehParams2ndByte, oFaceAngleYaw, oForwardVel, oHomeX, oMoveAngleYaw, oPosX, oTimer, oWFSlidBrickPtfmMovVel, WF_SLID_BRICK_PTFM_ACT_EXTEND, WF_SLID_BRICK_PTFM_ACT_RETRACT, WF_SLID_BRICK_PTFM_ACT_WAIT, WF_SLID_BRICK_PTFM_BP_MOV_VEL_10, WF_SLID_BRICK_PTFM_BP_MOV_VEL_15, WF_SLID_BRICK_PTFM_BP_MOV_VEL_20 } from "../../include/object_constants"
import { random_float } from "../../utils";

export const bhv_wf_sliding_platform_init = () => {
    const o = gLinker.ObjectListProcessor.gCurrentObject;
    o.rawData[oFaceAngleYaw] -= 0x4000;
    o.rawData[oPosX] += 2.0;
    o.rawData[oHomeX] = o.rawData[oPosX];
    
    switch (o.rawData[oBehParams2ndByte]) {
        case WF_SLID_BRICK_PTFM_BP_MOV_VEL_10:
            o.rawData[oWFSlidBrickPtfmMovVel] = 10.0;
            break;
        
        case WF_SLID_BRICK_PTFM_BP_MOV_VEL_15:
            o.rawData[oWFSlidBrickPtfmMovVel] = 15.0;
            break;

        case WF_SLID_BRICK_PTFM_BP_MOV_VEL_20:
            o.rawData[oWFSlidBrickPtfmMovVel] = 20.0;
            break;
    }

    o.rawData[oTimer] = random_float() * 100.0;
}

export const bhv_wf_sliding_platform_loop = () => {
    const o = gLinker.ObjectListProcessor.gCurrentObject;
    
    switch (o.rawData[oAction]) {
        case WF_SLID_BRICK_PTFM_ACT_WAIT:
            if (o.rawData[oTimer] >= 101) {
                o.rawData[oAction] = WF_SLID_BRICK_PTFM_ACT_EXTEND;
                o.rawData[oForwardVel] = o.rawData[oWFSlidBrickPtfmMovVel];
            }
            break;

        case WF_SLID_BRICK_PTFM_ACT_EXTEND:
            if (o.rawData[oTimer] >= 500.0 / o.rawData[oWFSlidBrickPtfmMovVel]) {
                o.rawData[oForwardVel] = 0;
                o.rawData[oPosX] = o.rawData[oHomeX] + 510.0;
            }

            if (o.rawData[oTimer] == 60) {
                o.rawData[oAction] = WF_SLID_BRICK_PTFM_ACT_RETRACT;
                o.rawData[oForwardVel] = o.rawData[oWFSlidBrickPtfmMovVel];
                o.rawData[oMoveAngleYaw] -= 0x8000;
            }
            break;

        case WF_SLID_BRICK_PTFM_ACT_RETRACT:
            if (o.rawData[oTimer] >= 500.0 / o.rawData[oWFSlidBrickPtfmMovVel]) {
                o.rawData[oForwardVel] = 0;
                o.rawData[oPosX] = o.rawData[oHomeX];
            }

            if (o.rawData[oTimer] == 90) {
                o.rawData[oAction] = WF_SLID_BRICK_PTFM_ACT_EXTEND;
                o.rawData[oForwardVel] = o.rawData[oWFSlidBrickPtfmMovVel];
                o.rawData[oMoveAngleYaw] += 0x8000;
            }

    }
}

gLinker.bhv_wf_sliding_platform_init = bhv_wf_sliding_platform_init;
gLinker.bhv_wf_sliding_platform_loop = bhv_wf_sliding_platform_loop;