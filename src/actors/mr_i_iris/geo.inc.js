import { GEO_CLOSE_NODE, GEO_DISPLAY_LIST, GEO_END, GEO_NODE_START, GEO_OPEN_NODE, GEO_SWITCH_CASE, LAYER_ALPHA } from "../../engine/GeoLayout";
import { geo_switch_anim_state } from "../../game/ObjectHelpers";
import { mr_i_iris_seg6_dl_060041D8, mr_i_iris_seg6_dl_060041F0, mr_i_iris_seg6_dl_06004208, mr_i_iris_seg6_dl_06004220 } from "./model.inc";

export const mr_i_iris_geo = () => {return [
    GEO_NODE_START(),
    GEO_OPEN_NODE(),
       GEO_SWITCH_CASE(20, geo_switch_anim_state),
       GEO_OPEN_NODE(),
          GEO_DISPLAY_LIST(LAYER_ALPHA, mr_i_iris_seg6_dl_060041D8),
          GEO_DISPLAY_LIST(LAYER_ALPHA, mr_i_iris_seg6_dl_060041F0),
          GEO_DISPLAY_LIST(LAYER_ALPHA, mr_i_iris_seg6_dl_06004208),
          GEO_DISPLAY_LIST(LAYER_ALPHA, mr_i_iris_seg6_dl_06004220),
          GEO_DISPLAY_LIST(LAYER_ALPHA, mr_i_iris_seg6_dl_06004208),
          GEO_DISPLAY_LIST(LAYER_ALPHA, mr_i_iris_seg6_dl_060041F0),
          GEO_DISPLAY_LIST(LAYER_ALPHA, mr_i_iris_seg6_dl_060041D8),
          GEO_DISPLAY_LIST(LAYER_ALPHA, mr_i_iris_seg6_dl_060041D8),
          GEO_DISPLAY_LIST(LAYER_ALPHA, mr_i_iris_seg6_dl_060041D8),
          GEO_DISPLAY_LIST(LAYER_ALPHA, mr_i_iris_seg6_dl_060041F0),
          GEO_DISPLAY_LIST(LAYER_ALPHA, mr_i_iris_seg6_dl_06004208),
          GEO_DISPLAY_LIST(LAYER_ALPHA, mr_i_iris_seg6_dl_06004220),
          GEO_DISPLAY_LIST(LAYER_ALPHA, mr_i_iris_seg6_dl_06004208),
          GEO_DISPLAY_LIST(LAYER_ALPHA, mr_i_iris_seg6_dl_060041F0),
          GEO_DISPLAY_LIST(LAYER_ALPHA, mr_i_iris_seg6_dl_060041D8),
          GEO_DISPLAY_LIST(LAYER_ALPHA, mr_i_iris_seg6_dl_060041D8),
          GEO_DISPLAY_LIST(LAYER_ALPHA, mr_i_iris_seg6_dl_060041D8),
          GEO_DISPLAY_LIST(LAYER_ALPHA, mr_i_iris_seg6_dl_060041D8),
          GEO_DISPLAY_LIST(LAYER_ALPHA, mr_i_iris_seg6_dl_060041D8),
          GEO_DISPLAY_LIST(LAYER_ALPHA, mr_i_iris_seg6_dl_060041D8),
       GEO_CLOSE_NODE(),
    GEO_CLOSE_NODE(),
    GEO_END(),
]}