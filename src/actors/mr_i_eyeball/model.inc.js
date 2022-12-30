// Mr I (white eyeball)
import * as Gbi from "../../include/gbi"

export const mr_i_eyeball_seg6_texture_06000080 = []
export const mr_i_eyeball_seg6_texture_06001080 = []

const mr_i_eyeball_seg6_vertex_06000000 = [
    [[  -100,      0,      0], 0, [     0,   2016], [0xff, 0xff, 0xff, 0xff]],
    [[     0,      0,      0], 0, [   992,   2016], [0xff, 0xff, 0xff, 0xff]],
    [[     0,    200,      0], 0, [   992,      0], [0xff, 0xff, 0xff, 0xff]],
    [[  -100,    200,      0], 0, [     0,      0], [0xff, 0xff, 0xff, 0xff]],
    [[     0,      0,      0], 0, [     0,   2016], [0xff, 0xff, 0xff, 0xff]],
    [[   100,      0,      0], 0, [   992,   2016], [0xff, 0xff, 0xff, 0xff]],
    [[   100,    200,      0], 0, [   992,      0], [0xff, 0xff, 0xff, 0xff]],
    [[     0,    200,      0], 0, [     0,      0], [0xff, 0xff, 0xff, 0xff]],
]

export const mr_i_eyeball_seg6_dl_06002080 = [
    Gbi.gsDPPipeSync(),
    Gbi.gsDPSetCombineMode(Gbi.G_CC_DECALRGBA, Gbi.G_CC_DECALRGBA),
    Gbi.gsDPSetTile(Gbi.G_IM_FMT_RGBA, Gbi.G_IM_SIZ_16b, 0, 0, Gbi.G_TX_LOADTILE, 0, Gbi.G_TX_WRAP | Gbi.G_TX_NOMIRROR, Gbi.G_TX_NOMASK, Gbi.G_TX_NOLOD, Gbi.G_TX_WRAP | Gbi.G_TX_NOMIRROR, Gbi.G_TX_NOMASK, Gbi.G_TX_NOLOD),
    Gbi.gsSPTexture(0xFFFF, 0xFFFF, 0, Gbi.G_TX_RENDERTILE, Gbi.G_ON),
    Gbi.gsSPVertex(mr_i_eyeball_seg6_vertex_06000000, 8, 0),
    Gbi.gsDPTileSync(),
    Gbi.gsDPSetTile(Gbi.G_IM_FMT_RGBA, Gbi.G_IM_SIZ_16b, 8, 0, Gbi.G_TX_RENDERTILE, 0, Gbi.G_TX_CLAMP, 6, Gbi.G_TX_NOLOD, Gbi.G_TX_CLAMP, 5, Gbi.G_TX_NOLOD),
    Gbi.gsDPSetTileSize(0, 0, 0, (32 - 1) << Gbi.G_TEXTURE_IMAGE_FRAC, (64 - 1) << Gbi.G_TEXTURE_IMAGE_FRAC),
    Gbi.gsDPSetTextureImage(Gbi.G_IM_FMT_RGBA, Gbi.G_IM_SIZ_16b, 1, mr_i_eyeball_seg6_texture_06000080),
    Gbi.gsDPLoadSync(),
    Gbi.gsDPLoadBlock(Gbi.G_TX_LOADTILE, 0, 0, 32 * 64 - 1, Gbi.CALC_DXT(32, Gbi.G_IM_SIZ_16b_BYTES)),
    Gbi.gsSP2Triangles( 0,  1,  2, 0x0,  0,  2,  3, 0x0),
    Gbi.gsDPSetTextureImage(Gbi.G_IM_FMT_RGBA, Gbi.G_IM_SIZ_16b, 1, mr_i_eyeball_seg6_texture_06001080),
    Gbi.gsDPLoadSync(),
    Gbi.gsDPLoadBlock(Gbi.G_TX_LOADTILE, 0, 0, 32 * 64 - 1, Gbi.CALC_DXT(32, Gbi.G_IM_SIZ_16b_BYTES)),
    Gbi.gsSP2Triangles( 4,  5,  6, 0x0,  4,  6,  7, 0x0),
    Gbi.gsSPTexture(0xFFFF, 0xFFFF, 0, Gbi.G_TX_RENDERTILE, Gbi.G_OFF),
    Gbi.gsDPSetCombineMode(Gbi.G_CC_SHADE, Gbi.G_CC_SHADE),
    Gbi.gsSPEndDisplayList(),
].flat()