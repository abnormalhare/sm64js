// Mr I (Iris)
import * as Gbi from "../../include/gbi"
export const mr_i_iris_seg6_texture_06002170 = []
export const mr_i_iris_seg6_texture_06002970 = []
export const mr_i_iris_seg6_texture_06003170 = []
export const mr_i_iris_seg6_texture_06003970 = []

const mr_i_iris_seg6_vertex_06002130 = [
    [[   -50,    -50,      0], 0, [     0,    992], [0xff, 0xff, 0xff, 0xff]],
    [[    50,    -50,      0], 0, [   992,    992], [0xff, 0xff, 0xff, 0xff]],
    [[    50,     50,      0], 0, [   992,      0], [0xff, 0xff, 0xff, 0xff]],
    [[   -50,     50,      0], 0, [     0,      0], [0xff, 0xff, 0xff, 0xff]],
]

export const mr_i_iris_seg6_dl_06004170 = [
    Gbi.gsDPSetCombineMode(Gbi.G_CC_DECALRGBA, Gbi.G_CC_DECALRGBA),
    Gbi.gsSPTexture(0xFFFF, 0xFFFF, 0, Gbi.G_TX_RENDERTILE, Gbi.G_ON),
    Gbi.gsDPSetTile(Gbi.G_IM_FMT_RGBA, Gbi.G_IM_SIZ_16b, 0, 0, Gbi.G_TX_LOADTILE, 0, Gbi.G_TX_CLAMP, 5, Gbi.G_TX_NOLOD, Gbi.G_TX_CLAMP, 5, Gbi.G_TX_NOLOD),
    Gbi.gsDPLoadSync(),
    Gbi.gsDPLoadBlock(Gbi.G_TX_LOADTILE, 0, 0, 32 * 32 - 1, Gbi.CALC_DXT(32, Gbi.G_IM_SIZ_16b_BYTES)),
    Gbi.gsDPSetTile(Gbi.G_IM_FMT_RGBA, Gbi.G_IM_SIZ_16b, 8, 0, Gbi.G_TX_RENDERTILE, 0, Gbi.G_TX_CLAMP, 5, Gbi.G_TX_NOLOD, Gbi.G_TX_CLAMP, 5, Gbi.G_TX_NOLOD),
    Gbi.gsDPSetTileSize(0, 0, 0, (32 - 1) << Gbi.G_TEXTURE_IMAGE_FRAC, (32 - 1) << Gbi.G_TEXTURE_IMAGE_FRAC),
    Gbi.gsSPVertex(mr_i_iris_seg6_vertex_06002130, 4, 0),
    Gbi.gsSP2Triangles( 0,  1,  2, 0x0,  0,  2,  3, 0x0),
    Gbi.gsSPTexture(0xFFFF, 0xFFFF, 0, Gbi.G_TX_RENDERTILE, Gbi.G_OFF),
    Gbi.gsDPSetCombineMode(Gbi.G_CC_SHADE, Gbi.G_CC_SHADE),
    Gbi.gsSPEndDisplayList(),
].flat()

export const mr_i_iris_seg6_dl_060041D8 = [
    Gbi.gsDPPipeSync(),
    Gbi.gsDPSetTextureImage(Gbi.G_IM_FMT_RGBA, Gbi.G_IM_SIZ_16b, 1, mr_i_iris_seg6_texture_06002170),
    Gbi.gsSPBranchList(mr_i_iris_seg6_dl_06004170),
].flat()

export const mr_i_iris_seg6_dl_060041F0 = [
    Gbi.gsDPPipeSync(),
    Gbi.gsDPSetTextureImage(Gbi.G_IM_FMT_RGBA, Gbi.G_IM_SIZ_16b, 1, mr_i_iris_seg6_texture_06002970),
    Gbi.gsSPBranchList(mr_i_iris_seg6_dl_06004170),
].flat()

export const mr_i_iris_seg6_dl_06004208 = [
    Gbi.gsDPPipeSync(),
    Gbi.gsDPSetTextureImage(Gbi.G_IM_FMT_RGBA, Gbi.G_IM_SIZ_16b, 1, mr_i_iris_seg6_texture_06003170),
    Gbi.gsSPBranchList(mr_i_iris_seg6_dl_06004170),
].flat()

export const mr_i_iris_seg6_dl_06004220 = [
    Gbi.gsDPPipeSync(),
    Gbi.gsDPSetTextureImage(Gbi.G_IM_FMT_RGBA, Gbi.G_IM_SIZ_16b, 1, mr_i_iris_seg6_texture_06003970),
    Gbi.gsSPBranchList(mr_i_iris_seg6_dl_06004170),
].flat()