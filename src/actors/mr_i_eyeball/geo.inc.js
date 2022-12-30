import { GEO_CLOSE_NODE, GEO_DISPLAY_LIST, GEO_END, GEO_OPEN_NODE, GEO_SHADOW, LAYER_ALPHA } from "../../engine/GeoLayout";
import { SHADOW_CIRCLE_4_VERTS } from "../../game/Shadow";
import { mr_i_eyeball_seg6_dl_06002080 } from "./model.inc";

export const mr_i_geo = () => {return [
    GEO_SHADOW(SHADOW_CIRCLE_4_VERTS, 0x9B, 200),
    GEO_OPEN_NODE(),
        GEO_DISPLAY_LIST(LAYER_ALPHA, mr_i_eyeball_seg6_dl_06002080),
    GEO_CLOSE_NODE(),
    GEO_END(),
]}