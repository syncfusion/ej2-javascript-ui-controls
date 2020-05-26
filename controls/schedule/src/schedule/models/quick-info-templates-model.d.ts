import { Property, ChildProperty } from '@syncfusion/ej2-base';import { TemplateType } from '../base/type';

/**
 * Interface for a class QuickInfoTemplates
 */
export interface QuickInfoTemplatesModel {

    /**
     * Template option to customize the header section of quick popup.
     * The applicable template types are,
     * * Both
     * * Cell
     * * Event
     *  @default 'Both'
     */
    templateType?: TemplateType;

    /**
     * Template option to customize the header section of quick popup.
     *  @default null
     */
    header?: string;

    /**
     * Template option to customize the content area of the quick popup.
     *  @default null
     */
    content?: string;

    /**
     * Template option to customize the footer section of quick popup.
     *  @default null
     */
    footer?: string;

}