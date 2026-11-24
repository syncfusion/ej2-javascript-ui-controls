import { Paragraph } from '../document/paragraph';
import { DocxError } from '../../core/errors/docx-error';
import { CaptionNumberingFormat, CaptionPosition } from './caption-enums';
import { Picture } from './index';
/**
 * Defines the function that adds a caption to a picture.
 */
export type AddCaptionToPicture = (
    picture: Picture,
    captionName: string,
    numberingFormat: CaptionNumberingFormat,
    position: CaptionPosition
) => Paragraph;
let addCaptionToPictureImpl: AddCaptionToPicture | undefined;
/**
 * @param {AddCaptionToPicture} impl - The impl.
 * @returns {void} Nothing is returned.
 * @private
 * Installed by the captions authoring module on load.
 */
export function providePictureCaptionAuthoring(impl: AddCaptionToPicture): void {
    addCaptionToPictureImpl = impl;
}
/**
 * @returns {AddCaptionToPicture} The result.
 * @private
 * Resolve the installed caption authoring implementation.
 * @throws DocxError when captions authoring was not loaded (fields/styles path).
 */
export function requirePictureCaptionAuthoring(): AddCaptionToPicture {
    if (addCaptionToPictureImpl === undefined) {
        throw new DocxError('feature/not-registered', 'Picture caption authoring is not loaded; import @syncfusion/ej2-docx/images (or load captions authoring with fields and styles) before addCaption');
    }
    return addCaptionToPictureImpl;
}
/**
 * @deprecated Use {@link AddCaptionToPicture} instead.
 */
export type AddCaptionToImage = AddCaptionToPicture;
/**
 * @param {AddCaptionToPicture} impl - The impl.
 * @returns {void} Nothing is returned.
 * @private
 * @deprecated Use {@link providePictureCaptionAuthoring} instead.
 */
export function provideImageCaptionAuthoring(impl: AddCaptionToPicture): void {
    providePictureCaptionAuthoring(impl);
}
/**
 * @returns {AddCaptionToPicture} The result.
 * @private
 * @deprecated Use {@link requirePictureCaptionAuthoring} instead.
 */
export function requireImageCaptionAuthoring(): AddCaptionToPicture {
    return requirePictureCaptionAuthoring();
}
