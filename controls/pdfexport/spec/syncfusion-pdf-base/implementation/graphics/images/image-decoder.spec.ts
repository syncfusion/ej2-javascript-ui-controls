/**
 * spec document for ImageDecoder.ts class
 */

import { ByteArray } from "../../../../../src/implementation/graphics/images/byte-array";
import { ImageDecoder, ImageFormat } from "../../../../../src/implementation/graphics/images/image-decoder";

describe('ImageDecoder.ts', () => {
    describe('Constructor initializing',()=> {
        let value : string = 'test';
        let byteArray : ByteArray = new ByteArray(value.length);
        let t1 : ImageDecoder = new ImageDecoder(byteArray);
        it('-height == undefined', () => {
            expect(t1.height).toBeUndefined();
        })
        it('-width == undefined', () => {
            expect(t1.width).toBeUndefined();
        })
        it('-bitsPerComponent == 8', () => {
            expect(t1.bitsPerComponent).toEqual(8);
        })
        it('-size == 4', () => {
            expect(t1.size).toEqual(4);
        })
        it('-imageData != undefined', () => {
            expect(t1.imageData).not.toBeUndefined();
        })
        it('-imageDataAsNumberArray != undefined', () => {
            expect(t1.imageDataAsNumberArray).not.toBeUndefined();
        })
        it('-format != undefined', () => {
            expect(t1.format).not.toBeUndefined();
        })
    })
})