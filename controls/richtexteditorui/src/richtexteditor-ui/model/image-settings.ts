import { ChildProperty, Property } from '@syncfusion/ej2-base';

/**
 * Default and permitted dimensions of an image.
 *
 * String values may contain CSS units such as `px`, `%`, `em`, or `auto`.
 * Numeric values are interpreted as pixels. `null` for `maxWidth` /
 * `maxHeight` means "no upper bound".
 *
 * Because `dimension` is a plain object rather than a nested `ChildProperty`,
 * runtime updates must replace the object instead of mutating one field
 * directly:
 *
 * ```ts
 * editor.imageSettings.dimension = {
 *     ...editor.imageSettings.dimension,
 *     maxWidth: '100%'
 * };
 * ```
 */
export interface ImageDimensionOptions {
    width?: string | number;
    height?: string | number;
    minWidth?: string | number;
    maxWidth?: string | number | null;
    minHeight?: string | number;
    maxHeight?: string | number | null;
}

/**
 * Local representation chosen for the next image insertion when the editor
 * uses a local proxy source (no `uploadUrl`).
 */
export type ImageSaveFormat = 'Blob' | 'Base64';

/**
 * Default display mode for inserted images.
 *
 * - `'inline'`  — Places the image within the current text flow.
 * - `'break'`   — Places the image on a separate line.
 */
export type ImageDisplayMode = 'inline' | 'break';

const DEFAULT_IMAGE_DIMENSION: ImageDimensionOptions = {
    width: 'auto',
    height: 'auto',
    minWidth: 0,
    maxWidth: null,
    minHeight: 0,
    maxHeight: null
};

/**
 * Configures image upload, validation, storage, display, dimensions, and
 * resize behavior in the Rich Text Editor.
 *
 * Mirrors the public contract declared in
 * `docs/spec/06.image-settings.md`.
 */
export class ImageSettings extends ChildProperty<ImageSettings> {

    /**
     * Specifies the image file extensions that can be selected, dropped,
     * pasted, or uploaded.
     *
     * API names use TypeScript camel casing.
     *
     * @default ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
     */
    @Property(['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'])
    public allowedTypes: string[];

    /**
     * Specifies the maximum permitted image file size, in bytes.
     *
     * @default 30000000
     */
    @Property(30000000)
    public maxFileSize: number;

    /**
     * Specifies the server endpoint used to upload image files.
     *
     * When this property is not configured, the editor uses `saveFormat` to
     * create a local image source.
     *
     * @default null
     */
    @Property(null)
    public uploadUrl: string | null;

    /**
     * Specifies the server endpoint used to remove an uploaded image.
     *
     * @default null
     */
    @Property(null)
    public removeUrl: string | null;

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
    @Property(null)
    public imageUrl: string | null;

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
    @Property('Blob')
    public saveFormat: ImageSaveFormat;

    /**
     * Specifies how an image is positioned in the editor content.
     *
     * Possible values are:
     * - `inline`: Places the image within the current text flow.
     * - `break`: Places the image on a separate line.
     *
     * @default 'inline'
     */
    @Property('inline')
    public display: ImageDisplayMode;

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
    @Property(DEFAULT_IMAGE_DIMENSION)
    public dimension: ImageDimensionOptions;

    /**
     * Specifies whether users can resize images in the editor.
     *
     * @default true
     */
    @Property(true)
    public resize: boolean;
}
