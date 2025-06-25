import { ChildProperty, Complex, Property } from '@syncfusion/ej2-base';import { StyleModel, LinkSettingsModel } from './index';import { LinkSettings } from './link-settings';import { Style } from './style';import { ContentType } from '../../base/enums';

/**
 * Interface for a class Content
 */
export interface ContentModel {

    /**
     * Specifies the unique identifier for the block.
     *
     * For standard types, this acts as the unique identifier of the content.
     * For special types like `Label` or `Mention`, this should be set to the corresponding item ID
     * from the datasource to render the resolved content.
     *
     * @default ''
     */
    id?: string;

    /**
     * Defines the type of content for the block.
     * It can be text, link, code, mention, or label.
     *
     * @default 'Text'
     */
    type?: ContentType;

    /**
     * Specifies the actual content of the block.
     *
     * @default ''
     */
    content?: string;

    /**
     * Specifies style attributes for the block.
     * This property is an object of StyleModel instances defining text formatting options.
     *
     * @default {}
     */
    styles?: StyleModel;

    /**
     * Specifies a hyperlink associated with the block.
     * If the block represents a link, this property holds the URL.
     *
     * @default {}
     */
    linkSettings?: LinkSettingsModel;

    /**
     * @hidden
     * Tracks the order of styles applied to the content.
     *
     * @default []
     */
    stylesApplied?: string[];

    /**
     * @hidden
     * Internal data identifier for label or mention type.
     *
     * @default ''
     */
    dataId?: string;

}