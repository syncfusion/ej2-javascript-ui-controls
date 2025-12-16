import { ChildProperty, Property } from '@syncfusion/ej2-base';import { SaveFormat } from '../types';

/**
 * Interface for a class ImageBlockSettings
 */
export interface ImageBlockSettingsModel {

    /**
     * Specifies the format to save the image.
     * Accepts either 'base64' for inline image encoding or 'blob' for binary object representation.
     *
     * @default 'Base64'
     */
    saveFormat?: SaveFormat;

    /**
     * Specifies the allowed image file types that can be uploaded.
     * Common types include '.jpg', '.jpeg', and '.png'.
     *
     * @default ['.jpg', '.jpeg', '.png']
     */
    allowedTypes?: string[];

    /**
     * Specifies the display height of the image.
     * Can be defined in pixels or percentage.
     *
     * @default 'auto'
     */
    height?: string | number;

    /**
     * Specifies the display width of the image.
     * Can be defined in pixels or percentage.
     *
     * @default 'auto'
     */
    width?: string | number;

    /**
     * Specifies whether to enable resize for image.
     *
     * @default true
     */
    enableResize?: boolean;

    /**
     * Specifies the minimum height of the image in pixels or as a string unit.
     * Prevents the image from being resized below this value.
     *
     * @default ''
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
     * Specifies the minimum width of the image in pixels or as a string unit.
     * Prevents the image from being resized below this value.
     *
     * @default ''
     */
    minWidth?: string | number;

    /**
     * Specifies the maximum width of the image in pixels or as a string unit.
     * Prevents the image from being resized beyond this value.
     *
     * @default ''
     */
    maxWidth?: string | number;

}