import { ChildProperty, Complex, Property } from '@syncfusion/ej2-base';
import { StyleModel, LinkSettingsModel } from './index';
import { LinkSettings } from './link-settings';
import { Style } from './style';
import { ContentType } from '../../base/enums';

/**
 * Defines the properties of block.
 */
export class Content extends ChildProperty<Content> {

    /**
     * Specifies the unique identifier for the block.
     *
     * For standard types, this acts as the unique identifier of the content.
     * For special types like `Label` or `Mention`, this should be set to the corresponding item ID
     * from the datasource to render the resolved content.
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Defines the type of content for the block.
     * It can be text, link, code, mention, or label.
     *
     * @default 'Text'
     */
    @Property('Text')
    public type: ContentType;

    /**
     * Specifies the actual content of the block.
     *
     * @default ''
     */
    @Property('')
    public content: string;

    /**
     * Specifies style attributes for the block.
     * This property is an object of StyleModel instances defining text formatting options.
     *
     * @default {}
     */
    @Complex<StyleModel>({}, Style)
    public styles: StyleModel;

    /**
     * Specifies a hyperlink associated with the block.
     * If the block represents a link, this property holds the URL.
     *
     * @default {}
     */
    @Complex<LinkSettingsModel>({}, LinkSettings)
    public linkSettings: LinkSettingsModel;

    /**
     * @hidden
     * Tracks the order of styles applied to the content.
     *
     * @default []
     */
    @Property([])
    public stylesApplied: string[];

    /**
     * @hidden
     * Internal data identifier for label or mention type.
     *
     * @default ''
     */
    @Property('')
    public dataId: string;
}
