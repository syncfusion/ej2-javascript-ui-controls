import { ChildProperty, Property } from '@syncfusion/ej2-base';import { SaveFormat } from '../types';

/**
 * Interface for a class ImageBlockSettings
 */
export interface ImageBlockSettingsModel {

    /**
     * Specifies the server endpoint URL for uploading images.
     * If empty, server upload functionality is disabled.
     *
     * @default ''
     */
    saveUrl?: string;

    /**
     * Specifies the maximum file size allowed for image uploads in bytes.
     * Files exceeding this size will be rejected during validation.
     * Default is 30000000 bytes.
     *
     * @default 30000000
     */
    maxFileSize?: number;

    /**
     * Specifies the base path for storing and displaying images on the server.
     * This path is appended to the server URL for image storage organization.
     *
     * @default ''
     */
    path?: string;

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