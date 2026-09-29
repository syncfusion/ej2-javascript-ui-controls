import { ChildProperty, Property } from '@syncfusion/ej2-base';
import {ImageSaveFormat,ImageDisplayMode,ImageDimensionOptions} from "./image-settings";

/**
 * Interface for a class ImageSettings
 */
export interface ImageSettingsModel {

    /**
     * Specifies the image file extensions that can be selected, dropped,
     * pasted, or uploaded.
     *
     * API names use TypeScript camel casing.
     *
     * @default ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
     */
    allowedTypes?: string[];

    /**
     * Specifies the maximum permitted image file size, in bytes.
     *
     * @default 30000000
     */
    maxFileSize?: number;

    /**
     * Specifies the server endpoint used to upload image files.
     *
     * When this property is not configured, the editor uses `saveFormat` to
     * create a local image source.
     *
     * @default null
     */
    uploadUrl?: string | null;

    /**
     * Specifies the server endpoint used to remove an uploaded image.
     *
     * @default null
     */
    removeUrl?: string | null;

    /**
     * Specifies the public base URL used to resolve uploaded image names
     * returned by the server.
     *
     * For example, when `imageUrl` is `/uploads/images/` and the server
     * returns `sample.png`, the resulting source is
     * `/uploads/images/sample.png`.
     *
     * @default null
     */
    imageUrl?: string | null;

    /**
     * Specifies how local images are represented when an upload endpoint
     * is not configured.
     *
     * Possible values are:
     * - `Blob`: Creates a temporary object URL for the image.
     * - `Base64`: Embeds the image as a Base64 data URL.
     *
     * @default 'Blob'
     */
    saveFormat?: ImageSaveFormat;

    /**
     * Specifies how an image is positioned in the editor content.
     *
     * Possible values are:
     * - `inline`: Places the image within the current text flow.
     * - `break`: Places the image on a separate line.
     *
     * @default 'inline'
     */
    display?: ImageDisplayMode;

    /**
     * Specifies the default and permitted dimensions of an image.
     *
     * @default {
     *   width: 'auto',
     *   height: 'auto',
     *   minWidth: 0,
     *   maxWidth: null,
     *   minHeight: 0,
     *   maxHeight: null
     * }
     */
    dimension?: ImageDimensionOptions;

    /**
     * Specifies whether users can resize images in the editor.
     *
     * @default true
     */
    resize?: boolean;

}