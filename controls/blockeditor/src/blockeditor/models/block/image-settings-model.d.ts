import { Property, ChildProperty } from '@syncfusion/ej2-base';
import {SaveFormat} from "./image-settings";

/**
 * Interface for a class ImageSettings
 */
export interface ImageSettingsModel {

    /**
     * Specifies the format to save the image.
     * Accepts either 'base64' for inline image encoding or 'blob' for binary object representation.
     *
     * @default 'base64'
     */
    saveFormat?: SaveFormat;

    /**
     * Specifies the image path.
     *
     * @default ''
     */
    src?: string;

    /**
     * Specifies the allowed image file types that can be uploaded.
     * Common types include '.jpg', '.jpeg', and '.png'.
     *
     * @default ['.jpg', '.jpeg', '.png']
     */
    allowedTypes?: string[];

    /**
     * Specifies the display width of the image.
     * Can be defined in pixels or percentage.
     *
     * @default ''
     */

    width?: string;

    /**
     * Specifies the display height of the image.
     * Can be defined in pixels or percentage.
     *
     * @default ''
     */
    height?: string;

    /**
     * Specifies the minimum width of the image in pixels or as a string unit.
     * Prevents the image from being resized below this value.
     *
     * @default 40
     */

    minWidth?: string | number;

    /**
     * Specifies the maximum width of the image in pixels or as a string unit.
     * Prevents the image from being resized beyond this value.
     *
     * @default ''
     */
    maxWidth?: string | number;

    /**
     * Specifies the minimum height of the image in pixels or as a string unit.
     * Prevents the image from being resized below this value.
     *
     * @default 40
     */
    minHeight?: string | number;

    /**
     * Specifies the maximum height of the image in pixels or as a string unit.
     * Prevents the image from being resized beyond this value.
     *
     * @default ''
     */
    maxHeight?: string | number;

    /**
     * Specifies the alternative text to be displayed when the image cannot be loaded.
     *
     * @default ''
     */
    altText?: string;

    /**
     * Specifies one or more CSS classes to be applied to the image element.
     * Useful for applying custom styles or themes.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies whether the image is in read-only mode.
     * In read-only mode, editing or removing the image is not allowed.
     *
     * @default false
     */
    readOnly?: boolean;

}