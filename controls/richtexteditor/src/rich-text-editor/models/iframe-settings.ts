import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';
import { ResourcesModel } from './iframe-settings-model';

/**
 * Objects used for configuring the iframe resources properties.
 */
export class Resources extends ChildProperty<Resources> {
    /**
     * Specifies styles that inject into iframe.
     * @default []
     */
    @Property([])
    public styles: string[];
    /**
     * Specifies scripts that inject into iframe.
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
     * @default false
     */
    @Property(false)
    public enable: boolean;

    /**
     * Defines additional attributes to render iframe.
     * @default 'null'
     */
    @Property(null)
    public attributes: { [key: string]: string; };

    /**
     * The object used for inject styles and scripts.
     * @default {}
     */
    @Complex<ResourcesModel>({}, Resources)
    public resources: ResourcesModel;
}