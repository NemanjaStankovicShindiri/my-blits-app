import { type CompressedData, type TextureData } from '../textures/Texture.js';
import type { WebGlContextWrapper } from './WebGlContextWrapper.js';
export type UploadCompressedTextureFunction = (glw: WebGlContextWrapper, texture: WebGLTexture, data: CompressedData) => void;
/**
 * Tests if the given location is a compressed texture container
 * @param url
 * @remarks
 * This function is used to determine if the given image url is a compressed
 * and only supports the following extensions: .ktx and .pvr
 * @returns
 */
export declare function isCompressedTextureContainer(src: string): boolean;
/**
 * Loads a compressed texture container
 * @param url
 * @returns
 */
export declare const loadCompressedTexture: (url: string) => Promise<TextureData>;
type BlockInfo = {
    width: number;
    height: number;
    bytes: number;
};
export declare const blockInfoMap: {
    [key: number]: BlockInfo;
};
export declare const uploadCompressedTexture: Record<string, UploadCompressedTextureFunction>;
export {};
