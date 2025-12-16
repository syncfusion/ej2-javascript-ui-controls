import { ChildProperty, Property } from '@syncfusion/ej2-base';
import { SaveFormat } from '../types';

/**
 * Configures settings related to image block in the editor.
 */
export class ImageBlockSettings extends ChildProperty<ImageBlockSettings> {

    /**
     * Specifies the format to save the image.
     * Accepts either 'base64' for inline image encoding or 'blob' for binary object representation.
     *
     * @default 'Base64'
     */
    @Property('Base64')
    public saveFormat: SaveFormat;

    /**
     * Specifies the allowed image file types that can be uploaded.
     * Common types include '.jpg', '.jpeg', and '.png'.
     *
     * @default ['.jpg', '.jpeg', '.png']
     */
    @Property(['.jpg', '.jpeg', '.png'])
    public allowedTypes: string[];

    /**
     * Specifies the display height of the image.
     * Can be defined in pixels or percentage.
     *
     * @default 'auto'
     */
    @Property('auto')
    public height: string | number;

    /**
     * Specifies the display width of the image.
     * Can be defined in pixels or percentage.
     *
     * @default 'auto'
     */
    @Property('auto')
    public width: string | number;

    /**
     * Specifies whether to enable resize for image.
     *
     * @default true
     */
    @Property(true)
    public enableResize: boolean;

    /**
     * Specifies the minimum height of the image in pixels or as a string unit.
     * Prevents the image from being resized below this value.
     *
     * @default ''
     */
    @Property('')
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
     * Specifies the minimum width of the image in pixels or as a string unit.
     * Prevents the image from being resized below this value.
     *
     * @default ''
     */
    @Property('')
    public minWidth: string | number;

    /**
     * Specifies the maximum width of the image in pixels or as a string unit.
     * Prevents the image from being resized beyond this value.
     *
     * @default ''
     */
    @Property('')
    public maxWidth: string | number;
}
