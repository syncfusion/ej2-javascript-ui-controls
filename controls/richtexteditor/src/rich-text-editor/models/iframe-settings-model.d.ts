import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';

/**
 * Interface for a class Resources
 */
export interface ResourcesModel {

    /**
     * Specifies styles that inject into iframe.
     * @default []
     */
    styles?: string[];

    /**
     * Specifies scripts that inject into iframe.
     * @default []
     */
    scripts?: string[];

}

/**
 * Interface for a class IFrameSettings
 */
export interface IFrameSettingsModel {

    /**
     * Specifies whether to render iframe based editable element in RTE.
     * @default false
     */
    enable?: boolean;

    /**
     * Defines additional attributes to render iframe.
     * @default 'null'
     */
    attributes?: { [key: string]: string; };

    /**
     * The object used for inject styles and scripts.
     * @default {}
     */
    resources?: ResourcesModel;

}