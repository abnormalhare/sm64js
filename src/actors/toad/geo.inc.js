// // 0x0D000114
// const GeoLayout toad_geo_000114[] = {
//     GEO_NODE_START(),
//     GEO_OPEN_NODE(),
//         GEO_ANIMATED_PART(LAYER_OPAQUE, 0, 0, 0, NULL),
//         GEO_OPEN_NODE(),
//             GEO_ANIMATED_PART(LAYER_OPAQUE, 0, 0, 0, NULL),
//             GEO_OPEN_NODE(),
//                 GEO_ANIMATED_PART(LAYER_OPAQUE, 83, 0, 0, NULL),
//                 GEO_OPEN_NODE(),
//                     GEO_ANIMATED_PART(LAYER_OPAQUE, 126, -37, 0, toad_seg6_dl_06007710),
//                 GEO_CLOSE_NODE(),
//                 GEO_ANIMATED_PART(LAYER_OPAQUE, 25, 8, 0, toad_seg6_dl_06007A48),
//                 GEO_ANIMATED_PART(LAYER_OPAQUE, 34, 8, 0, toad_seg6_dl_06007EB0),
//                 GEO_ANIMATED_PART(LAYER_OPAQUE, 4, 7, 38, NULL),
//                 GEO_OPEN_NODE(),
//                     GEO_ANIMATED_PART(LAYER_OPAQUE, 0, 0, 0, NULL),
//                     GEO_OPEN_NODE(),
//                         GEO_ANIMATED_PART(LAYER_OPAQUE, 37, 0, 0, NULL),
//                         GEO_OPEN_NODE(),
//                             GEO_ANIMATED_PART(LAYER_OPAQUE, 9, -25, 3, toad_seg6_dl_06008890),
//                         GEO_CLOSE_NODE(),
//                     GEO_CLOSE_NODE(),
//                 GEO_CLOSE_NODE(),
//                 GEO_ANIMATED_PART(LAYER_OPAQUE, 4, 7, -38, NULL),
//                 GEO_OPEN_NODE(),
//                     GEO_ANIMATED_PART(LAYER_OPAQUE, 0, 0, 0, NULL),
//                     GEO_OPEN_NODE(),
//                         GEO_ANIMATED_PART(LAYER_OPAQUE, 37, 0, 0, NULL),
//                         GEO_OPEN_NODE(),
//                             GEO_ANIMATED_PART(LAYER_OPAQUE, 9, -25, -3, toad_seg6_dl_06008BD8),
//                         GEO_CLOSE_NODE(),
//                     GEO_CLOSE_NODE(),
//                 GEO_CLOSE_NODE(),
//                 GEO_ANIMATED_PART(LAYER_OPAQUE, 61, -3, 52, NULL),
//                 GEO_OPEN_NODE(),
//                     GEO_ANIMATED_PART(LAYER_OPAQUE, 0, 0, 0, NULL),
//                     GEO_OPEN_NODE(),
//                         GEO_ANIMATED_PART(LAYER_OPAQUE, 17, 0, 4, toad_seg6_dl_060081F8),
//                     GEO_CLOSE_NODE(),
//                 GEO_CLOSE_NODE(),
//                 GEO_ANIMATED_PART(LAYER_OPAQUE, 61, -3, -52, NULL),
//                 GEO_OPEN_NODE(),
//                     GEO_ANIMATED_PART(LAYER_OPAQUE, 0, 0, 0, NULL),
//                     GEO_OPEN_NODE(),
//                         GEO_ANIMATED_PART(LAYER_OPAQUE, 17, 0, -4, toad_seg6_dl_06008520),
//                     GEO_CLOSE_NODE(),
//                 GEO_CLOSE_NODE(),
//             GEO_CLOSE_NODE(),
//         GEO_CLOSE_NODE(),
//     GEO_CLOSE_NODE(),
//     GEO_RETURN(),
// };

import { GEO_ANIMATED_PART, GEO_ASM, GEO_BRANCH, GEO_CLOSE_NODE, GEO_CULLING_RADIUS, GEO_END, GEO_NODE_START, GEO_OPEN_NODE, GEO_SCALE, GEO_SHADOW, GEO_SWITCH_CASE, LAYER_OPAQUE, LAYER_TRANSPARENT } from "../../engine/GeoLayout"
import { geo_switch_anim_state, geo_update_layer_transparency } from "../../game/ObjectHelpers"
import { SHADOW_CIRCLE_9_VERTS } from "../../game/Shadow"
import { toad_seg6_dl_06007710, toad_seg6_dl_06007A48, toad_seg6_dl_06007EB0, toad_seg6_dl_060081F8, toad_seg6_dl_06008520, toad_seg6_dl_06008890, toad_seg6_dl_06008BD8, toad_seg6_us_dl_06007788, toad_seg6_us_dl_06007B00, toad_seg6_us_dl_06008608 } from "./model.inc"

// // 0x0D00027C
// const GeoLayout toad_geo_00027C[] = {
//     GEO_NODE_START(),
//     GEO_OPEN_NODE(),
//         GEO_ANIMATED_PART(LAYER_TRANSPARENT, 0, 0, 0, NULL),
//         GEO_OPEN_NODE(),
//             GEO_ANIMATED_PART(LAYER_TRANSPARENT, 0, 0, 0, NULL),
//             GEO_OPEN_NODE(),
//                 GEO_ANIMATED_PART(LAYER_TRANSPARENT, 83, 0, 0, NULL),
//                 GEO_OPEN_NODE(),
// #ifdef VERSION_JP
//                     GEO_ANIMATED_PART(LAYER_TRANSPARENT, 126, -37, 0, toad_seg6_dl_06007710),
// #else
//                     GEO_ANIMATED_PART(LAYER_TRANSPARENT, 126, -37, 0, toad_seg6_us_dl_06007788),
// #endif
//                 GEO_CLOSE_NODE(),
// #ifdef VERSION_JP
//                 GEO_ANIMATED_PART(LAYER_TRANSPARENT, 25, 8, 0, toad_seg6_dl_06007A48),
// #else
//                 GEO_ANIMATED_PART(LAYER_TRANSPARENT, 25, 8, 0, toad_seg6_us_dl_06007B00),
// #endif
//                 GEO_ANIMATED_PART(LAYER_TRANSPARENT, 34, 8, 0, toad_seg6_dl_06007EB0),
//                 GEO_ANIMATED_PART(LAYER_TRANSPARENT, 4, 7, 38, NULL),
//                 GEO_OPEN_NODE(),
//                     GEO_ANIMATED_PART(LAYER_TRANSPARENT, 0, 0, 0, NULL),
//                     GEO_OPEN_NODE(),
//                         GEO_ANIMATED_PART(LAYER_TRANSPARENT, 37, 0, 0, NULL),
//                         GEO_OPEN_NODE(),
//                             GEO_ANIMATED_PART(LAYER_TRANSPARENT, 9, -25, 3, toad_seg6_dl_06008890),
//                         GEO_CLOSE_NODE(),
//                     GEO_CLOSE_NODE(),
//                 GEO_CLOSE_NODE(),
//                 GEO_ANIMATED_PART(LAYER_TRANSPARENT, 4, 7, -38, NULL),
//                 GEO_OPEN_NODE(),
//                     GEO_ANIMATED_PART(LAYER_TRANSPARENT, 0, 0, 0, NULL),
//                     GEO_OPEN_NODE(),
//                         GEO_ANIMATED_PART(LAYER_TRANSPARENT, 37, 0, 0, NULL),
//                         GEO_OPEN_NODE(),
//                             GEO_ANIMATED_PART(LAYER_TRANSPARENT, 9, -25, -3, toad_seg6_dl_06008BD8),
//                         GEO_CLOSE_NODE(),
//                     GEO_CLOSE_NODE(),
//                 GEO_CLOSE_NODE(),
//                 GEO_ANIMATED_PART(LAYER_TRANSPARENT, 61, -3, 52, NULL),
//                 GEO_OPEN_NODE(),
//                     GEO_ANIMATED_PART(LAYER_TRANSPARENT, 0, 0, 0, NULL),
//                     GEO_OPEN_NODE(),
//                         GEO_ANIMATED_PART(LAYER_TRANSPARENT, 17, 0, 4, toad_seg6_dl_060081F8),
//                     GEO_CLOSE_NODE(),
//                 GEO_CLOSE_NODE(),
//                 GEO_ANIMATED_PART(LAYER_TRANSPARENT, 61, -3, -52, NULL),
//                 GEO_OPEN_NODE(),
//                     GEO_ANIMATED_PART(LAYER_TRANSPARENT, 0, 0, 0, NULL),
//                     GEO_OPEN_NODE(),
// #ifdef VERSION_JP
//                         GEO_ANIMATED_PART(LAYER_TRANSPARENT, 17, 0, -4, toad_seg6_dl_06008520),
// #else
//                         GEO_ANIMATED_PART(LAYER_TRANSPARENT, 17, 0, -4, toad_seg6_us_dl_06008608),
// #endif
//                     GEO_CLOSE_NODE(),
//                 GEO_CLOSE_NODE(),
//             GEO_CLOSE_NODE(),
//         GEO_CLOSE_NODE(),
//     GEO_CLOSE_NODE(),
//     GEO_RETURN(),
// };

// // 0x0D0003E4
// const GeoLayout toad_geo[] = {
//     GEO_CULLING_RADIUS(1000),
//     GEO_OPEN_NODE(),
//         GEO_SHADOW(SHADOW_CIRCLE_9_VERTS, 0x96, 100),
//         GEO_OPEN_NODE(),
//             GEO_SCALE(0x00, 16384),
//             GEO_OPEN_NODE(),
//                 GEO_ASM(10, geo_update_layer_transparency),
//                 GEO_SWITCH_CASE(2, geo_switch_anim_state),
//                 GEO_OPEN_NODE(),
//                     GEO_BRANCH(1, toad_geo_000114),
//                     GEO_BRANCH(1, toad_geo_00027C),
//                 GEO_CLOSE_NODE(),
//             GEO_CLOSE_NODE(),
//         GEO_CLOSE_NODE(),
//     GEO_CLOSE_NODE(),
//     GEO_END(),
// };

// UNUSED static const u64 toad_unused_1 = 0;

export const toad_geo_000114 = () => {return [
    GEO_NODE_START(),
    GEO_OPEN_NODE(),
        GEO_ANIMATED_PART(LAYER_OPAQUE, 0, 0, 0, null),
        GEO_OPEN_NODE(),
            GEO_ANIMATED_PART(LAYER_OPAQUE, 0, 0, 0, null),
            GEO_OPEN_NODE(),
                GEO_ANIMATED_PART(LAYER_OPAQUE, 83, 0, 0, null),
                GEO_OPEN_NODE(),
                    GEO_ANIMATED_PART(LAYER_OPAQUE, 126, -37, 0, toad_seg6_dl_06007710),
                GEO_CLOSE_NODE(),
                GEO_ANIMATED_PART(LAYER_OPAQUE, 25, 8, 0, toad_seg6_dl_06007A48),
                GEO_ANIMATED_PART(LAYER_OPAQUE, 34, 8, 0, toad_seg6_dl_06007EB0),
                GEO_ANIMATED_PART(LAYER_OPAQUE, 4, 7, 38, null),
                GEO_OPEN_NODE(),
                    GEO_ANIMATED_PART(LAYER_OPAQUE, 0, 0, 0, null),
                    GEO_OPEN_NODE(),
                        GEO_ANIMATED_PART(LAYER_OPAQUE, 37, 0, 0, null),
                        GEO_OPEN_NODE(),
                            GEO_ANIMATED_PART(LAYER_OPAQUE, 9, -25, 3, toad_seg6_dl_06008890),
                        GEO_CLOSE_NODE(),
                    GEO_CLOSE_NODE(),
                GEO_CLOSE_NODE(),
                GEO_ANIMATED_PART(LAYER_OPAQUE, 4, 7, -38, null),
                GEO_OPEN_NODE(),
                    GEO_ANIMATED_PART(LAYER_OPAQUE, 0, 0, 0, null),
                    GEO_OPEN_NODE(),
                        GEO_ANIMATED_PART(LAYER_OPAQUE, 37, 0, 0, null),
                        GEO_OPEN_NODE(),
                            GEO_ANIMATED_PART(LAYER_OPAQUE, 9, -25, -3, toad_seg6_dl_06008BD8),
                        GEO_CLOSE_NODE(),
                    GEO_CLOSE_NODE(),
                GEO_CLOSE_NODE(),
                GEO_ANIMATED_PART(LAYER_OPAQUE, 61, -3, 52, null),
                GEO_OPEN_NODE(),
                    GEO_ANIMATED_PART(LAYER_OPAQUE, 0, 0, 0, null),
                    GEO_OPEN_NODE(),
                        GEO_ANIMATED_PART(LAYER_OPAQUE, 17, 0, 4, toad_seg6_dl_060081F8),
                    GEO_CLOSE_NODE(),
                GEO_CLOSE_NODE(),
                GEO_ANIMATED_PART(LAYER_OPAQUE, 61, -3, -52, null),
                GEO_OPEN_NODE(),
                    GEO_ANIMATED_PART(LAYER_OPAQUE, 0, 0, 0, null),
                    GEO_OPEN_NODE(),
                        GEO_ANIMATED_PART(LAYER_OPAQUE, 17, 0, -4, toad_seg6_dl_06008520),
                    GEO_CLOSE_NODE(),
                GEO_CLOSE_NODE(),
            GEO_CLOSE_NODE(),
        GEO_CLOSE_NODE(),
    GEO_CLOSE_NODE(),
    GEO_RETURN(),
]}

export const toad_geo_00027C = () => {return [
    GEO_NODE_START(),
    GEO_OPEN_NODE(),
        GEO_ANIMATED_PART(LAYER_TRANSPARENT, 0, 0, 0, null),
        GEO_OPEN_NODE(),
            GEO_ANIMATED_PART(LAYER_TRANSPARENT, 0, 0, 0, null),
            GEO_OPEN_NODE(),
                GEO_ANIMATED_PART(LAYER_TRANSPARENT, 83, 0, 0, null),
                GEO_OPEN_NODE(),
                    GEO_ANIMATED_PART(LAYER_TRANSPARENT, 126, -37, 0, toad_seg6_us_dl_06007788),
                GEO_CLOSE_NODE(),
                GEO_ANIMATED_PART(LAYER_TRANSPARENT, 25, 8, 0, toad_seg6_us_dl_06007B00),
                GEO_ANIMATED_PART(LAYER_TRANSPARENT, 34, 8, 0, toad_seg6_dl_06007EB0),
                GEO_ANIMATED_PART(LAYER_TRANSPARENT, 4, 7, 38, null),
                GEO_OPEN_NODE(),
                    GEO_ANIMATED_PART(LAYER_TRANSPARENT, 0, 0, 0, null),
                    GEO_OPEN_NODE(),
                        GEO_ANIMATED_PART(LAYER_TRANSPARENT, 37, 0, 0, null),
                        GEO_OPEN_NODE(),
                            GEO_ANIMATED_PART(LAYER_TRANSPARENT, 9, -25, 3, toad_seg6_dl_06008890),
                        GEO_CLOSE_NODE(),
                    GEO_CLOSE_NODE(),
                GEO_CLOSE_NODE(),
                GEO_ANIMATED_PART(LAYER_TRANSPARENT, 4, 7, -38, null),
                GEO_OPEN_NODE(),
                    GEO_ANIMATED_PART(LAYER_TRANSPARENT, 0, 0, 0, null),
                    GEO_OPEN_NODE(),
                        GEO_ANIMATED_PART(LAYER_TRANSPARENT, 37, 0, 0, null),
                        GEO_OPEN_NODE(),
                            GEO_ANIMATED_PART(LAYER_TRANSPARENT, 9, -25, -3, toad_seg6_dl_06008BD8),
                        GEO_CLOSE_NODE(),
                    GEO_CLOSE_NODE(),
                GEO_CLOSE_NODE(),
                GEO_ANIMATED_PART(LAYER_TRANSPARENT, 61, -3, 52, null),
                GEO_OPEN_NODE(),
                    GEO_ANIMATED_PART(LAYER_TRANSPARENT, 0, 0, 0, null),
                    GEO_OPEN_NODE(),
                        GEO_ANIMATED_PART(LAYER_TRANSPARENT, 17, 0, 4, toad_seg6_dl_060081F8),
                    GEO_CLOSE_NODE(),
                GEO_CLOSE_NODE(),
                GEO_ANIMATED_PART(LAYER_TRANSPARENT, 61, -3, -52, null),
                GEO_OPEN_NODE(),
                    GEO_ANIMATED_PART(LAYER_TRANSPARENT, 0, 0, 0, null),
                    GEO_OPEN_NODE(),
                        GEO_ANIMATED_PART(LAYER_TRANSPARENT, 17, 0, -4, toad_seg6_us_dl_06008608),
                    GEO_CLOSE_NODE(),
                GEO_CLOSE_NODE(),
            GEO_CLOSE_NODE(),
        GEO_CLOSE_NODE(),
    GEO_CLOSE_NODE(),
    GEO_RETURN(),
]}

export const toad_geo = () => {return [
    GEO_CULLING_RADIUS(1000),
    GEO_OPEN_NODE(),
        GEO_SHADOW(SHADOW_CIRCLE_9_VERTS, 0x96, 100),
        GEO_OPEN_NODE(),
            GEO_SCALE(0x00, 16384),
            GEO_OPEN_NODE(),
                GEO_ASM(10, geo_update_layer_transparency),
                GEO_SWITCH_CASE(2, geo_switch_anim_state),
                GEO_OPEN_NODE(),
                    GEO_BRANCH(1, toad_geo_000114),
                    GEO_BRANCH(1, toad_geo_00027C),
                GEO_CLOSE_NODE(),
            GEO_CLOSE_NODE(),
        GEO_CLOSE_NODE(),
    GEO_CLOSE_NODE(),
    GEO_END(),
]}