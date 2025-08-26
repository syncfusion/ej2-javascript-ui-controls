import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Specifies the formats available for saving images.
 * Options include saving as Base64 or Blob.
 *
 */
export type SaveFormat = 'Base64' | 'Blob';

/**
 * Defines the settings available for rendering an Image block.
 */
export class ImageSettings extends ChildProperty<ImageSettings> {
    /**
     * Specifies the format to save the image.
     * Accepts either 'base64' for inline image encoding or 'blob' for binary object representation.
     *
     * @default 'base64'
     */
    @Property('base64')
    public saveFormat: SaveFormat;

    /**
     * Specifies the image path.
     *
     * @default ''
     */
    @Property('')
    public src: string;

    /**
     * Specifies the allowed image file types that can be uploaded.
     * Common types include '.jpg', '.jpeg', and '.png'.
     *
     * @default ['.jpg', '.jpeg', '.png']
     */
    @Property(['.jpg', '.jpeg', '.png'])
    public allowedTypes: string[];

    /**
     * Specifies the display width of the image.
     * Can be defined in pixels or percentage.
     *
     * @default ''
     */

    @Property('')
    public width: string;

    /**
     * Specifies the display height of the image.
     * Can be defined in pixels or percentage.
     *
     * @default ''
     */
    @Property('')
    public height: string;

    /**
     * Specifies the minimum width of the image in pixels or as a string unit.
     * Prevents the image from being resized below this value.
     *
     * @default 40
     */

    @Property(40)
    public minWidth: string | number;

    /**
     * Specifies the maximum width of the image in pixels or as a string unit.
     * Prevents the image from being resized beyond this value.
     *
     * @default ''
     */
    @Property('')
    public maxWidth: string | number;

    /**
     * Specifies the minimum height of the image in pixels or as a string unit.
     * Prevents the image from being resized below this value.
     *
     * @default 40
     */
    @Property(40)
    public minHeight: string | number;

    /**
     * Specifies the maximum height of the image in pixels or as a string unit.
     * Prevents the image from being resized beyond this value.
     *
     * @default ''
     */
    @Property('')
    public maxHeight: string | number;

    /**
     * Specifies the alternative text to be displayed when the image cannot be loaded.
     *
     * @default ''
     */
    @Property('')
    public altText: string;

    /**
     * Specifies one or more CSS classes to be applied to the image element.
     * Useful for applying custom styles or themes.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies whether the image is in read-only mode.
     * In read-only mode, editing or removing the image is not allowed.
     *
     * @default false
     */
    @Property(false)
    public readOnly: boolean;
}
