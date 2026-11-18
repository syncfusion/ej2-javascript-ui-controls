/**
 * Picture blip read / preserve / insert (core).
 *
 * @packageDocumentation
 */
export { addPictureToSlide, DEFAULT_PICTURE_BOUNDS, DEFAULT_PICTURE_NAME, PICTURE_INSERT_CONTENT_TYPES,
    isAllowedPictureContentType, AddPictureOptions, AddPictureToSlideArgs, PictureBounds, PictureDataInput } from './add-picture';
export { Picture } from './picture';
export { PictureMediaAccess, PictureMediaWriteAccess } from './media-access';
export { createPictureMediaAccess } from './media-access';
export { removePictureFromSlide, countOfficeRelationshipAttributeReferences, RemovePictureFromSlideArgs } from './remove-picture';
export { replaceImageDataInternal, ReplaceImageDataOptions, ReplaceImageDataArgs } from './retarget-embedded';
export { PictureMutationContext } from './picture';
