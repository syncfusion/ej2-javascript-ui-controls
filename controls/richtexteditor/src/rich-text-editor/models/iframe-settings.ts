import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';
import { ResourcesModel } from './iframe-settings-model';
import { MetaTag } from '../base/interface';

/**
 * Objects used for configuring the iframe resources properties.
 */
export class Resources extends ChildProperty<Resources> {
    /**
     * Specifies styles that inject into iframe.
     *
     * @default []
     */
    @Property([])
    public styles: string[];
    /**
     * Specifies scripts that inject into iframe.
     *
     * @default []
     */
    @Property([])
    public scripts: string[];
}

/**
 * Configures the iframe settings of the RTE.
 */
export class IFrameSettings extends ChildProperty<IFrameSettings> {
    /**
     * Specifies whether to render iframe based editable element in RTE.
     *
     * @default false
     */
    @Property(false)
    public enable: boolean;

    /**
     * Defines additional attributes to render iframe.
     *
     * @default 'null'
     */
    @Property(null)
    public attributes: { [key: string]: string };

    /**
     * The object used for inject styles and scripts.
     *
     * @default {}
     */
    @Complex<ResourcesModel>({}, Resources)
    public resources: ResourcesModel;

    /**
     * Specifies the meta tags to be applied to the iframe's <head> element.
     *
     * @default []
     */
    @Property([])
    public metaTags: Array<MetaTag>;

    /**
     * Represents the sandbox attribute for the Rich Text Editor's iframe, defining the security restrictions applied to the embedded content.
     * Configure this property using a string array (e.g., ["allow-scripts", "allow-forms"]). If set to an empty array, all restrictions are applied except "allow-same-origin".
     * By default, "allow-same-origin" is included in the Rich Text Editor's iframe sandbox.
     *
     * @default 'null'
     */
    @Property(null)
    public sandbox: string[];
}
