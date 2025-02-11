import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';import { MetaTag } from '../base/interface';

/**
 * Interface for a class Resources
 */
export interface ResourcesModel {

    /**
     * Specifies the styles to be injected into the iframe.
     *
     * @default []
     */
    styles?: string[];

    /**
     * Specifies the scripts to be injected into the iframe.
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
     * Determines whether to render the Rich Text Editor with an iframe-based editable element.
     *
     * @default false
     */
    enable?: boolean;

    /**
     * Defines additional attributes for rendering the iframe.
     *
     * @default null
     */
    attributes?: { [key: string]: string };

    /**
     * Object used to inject styles and scripts into the iframe.
     *
     * @default {}
     */
    resources?: ResourcesModel;

    /**
     * Specifies the meta tags to be applied to the <head> element of the iframe.
     *
     * @default []
     */
    metaTags?: Array<MetaTag>;

    /**
     * Represents the sandbox attribute for the Rich Text Editor's iframe,
     * defining the security restrictions applied to the embedded content.
     * Configure this property using a string array (e.g., ["allow-scripts", "allow-forms"]).
     * If set to an empty array, all restrictions are applied except "allow-same-origin".
     * By default, "allow-same-origin" is included in the Rich Text Editor's iframe sandbox.
     *
     * @default null
     */
    sandbox?: string[];

}