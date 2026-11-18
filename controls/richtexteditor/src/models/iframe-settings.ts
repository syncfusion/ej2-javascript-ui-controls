import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';
import { ResourcesModel } from './iframe-settings-model';
import { MetaTag } from '../common/interface';

/**
 * Objects used to configure the properties of iframe resources.
 */
export class Resources extends ChildProperty<Resources> {
    /**
     * Specifies the styles to be injected into the iframe.
     *
     * @default []
     */
    @Property([])
    public styles: string[];

    /**
     * Specifies the scripts to be injected into the iframe.
     *
     * @default []
     */
    @Property([])
    public scripts: string[];
}

/**
 * Configures the iframe settings for the Rich Text Editor.
 */
export class IFrameSettings extends ChildProperty<IFrameSettings> {
    /**
     * Determines whether to render the Rich Text Editor with an iframe-based editable element.
     *
     * @default false
     */
    @Property(false)
    public enable: boolean;

    /**
     * Defines additional attributes for rendering the iframe.
     *
     * @default null
     */
    @Property(null)
    public attributes: { [key: string]: string };

    /**
     * Object used to inject styles and scripts into the iframe.
     *
     * @default {}
     */
    @Complex<ResourcesModel>({}, Resources)
    public resources: ResourcesModel;

    /**
     * Specifies the meta tags to be applied to the <head> element of the iframe.
     *
     * @default []
     */
    @Property([])
    public metaTags: Array<MetaTag>;

    /**
     * Represents the sandbox attribute for the Rich Text Editor's iframe,
     * defining the security restrictions applied to the embedded content.
     * Configure this property using a string array (e.g., ["allow-scripts", "allow-forms"]).
     * If set to an empty array, all restrictions are applied except "allow-same-origin".
     * By default, "allow-same-origin" is included in the Rich Text Editor's iframe sandbox.
     *
     * @default null
     */
    @Property(null)
    public sandbox: string[];
}
