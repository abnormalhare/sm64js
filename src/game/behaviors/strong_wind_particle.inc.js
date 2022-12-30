// Spawn particles that blow Mario away and knock his cap off from the current object.

import { MODEL_MIST, MODEL_NONE, MODEL_WHITE_PARTICLE_DL } from "../../include/model_ids"
import { spawn_object_relative_with_scale } from "../ObjectHelpers"

// Used for the Snowman in SL and Fwoosh.
export const cur_obj_spawn_strong_wind_particles = (windSpread, scale, relPosX, relPosY, relPosZ) => {
    const o = gLinker.ObjectListProcessor.gCurrentObject

    // Alternate between tiny particles and regular particles each frame.
    if (window.gGlobalTimer & 1) {
        // Because the tiny particles are unimportant objects, invisible wind particles are spawned to provide collision.
        // There was absolutely no reason to make the smaller particles unimportant, though...
        spawn_object_relative_with_scale(windSpread, relPosX, relPosY, relPosZ, 0.5, o, MODEL_WHITE_PARTICLE_DL, gLinker.behaviors.bhvTinyStrongWindParticle)
        spawn_object_relative_with_scale(windSpread, relPosX, relPosY, relPosZ, scale, o, MODEL_NONE, gLinker.behaviors.bhvStrongWindParticle);
    } else {
        spawn_object_relative_with_scale(windSpread, relPosX, relPosY, relPosZ, scale, o, MODEL_MIST, gLinker.behaviors.bhvStrongWindParticle);
    }
    // There is also no need to spawn additional invisible wind particles here.
    // If the devs were worried about object overload when making small particles unimportant, why spawn these?
    // It isn't to ensure collision, as even 1 particle every 2 frames is enough to ensure this reliably.
    spawn_object_relative_with_scale(windSpread, relPosX, relPosY, relPosZ, scale, o, MODEL_NONE, gLinker.behaviors.bhvStrongWindParticle);
}