import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';import { MetaTag } from '../base/interface';

/**
 * Interface for a class Resources
 */
export interface ResourcesModel {

    /**
     * Specifies styles that inject into iframe.
     *
     * @default []
     */
    styles?: string[];

    /**
     * Specifies scripts that inject into iframe.
     *
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
     *
     * @default false
     */
    enable?: boolean;

    /**
     * Defines additional attributes to render iframe.
     *
     * @default 'null'
     */
    attributes?: { [key: string]: string };

    /**
     * The object used for inject styles and scripts.
     *
     * @default {}
     */
    resources?: ResourcesModel;

    /**
     * Specifies the meta tags to be applied to the iframe's <head> element.
     *
     * @default []
     */
    metaTags?: Array<MetaTag>;

    /**
     * Represents the sandbox attribute for the Rich Text Editor's iframe, defining the security restrictions applied to the embedded content.
     * Configure this property using a string array (e.g., ["allow-scripts", "allow-forms"]). If set to an empty array, all restrictions are applied except "allow-same-origin".
     * By default, "allow-same-origin" is included in the Rich Text Editor's iframe sandbox.
     *
     * @default 'null'
     */
    sandbox?: string[];

}