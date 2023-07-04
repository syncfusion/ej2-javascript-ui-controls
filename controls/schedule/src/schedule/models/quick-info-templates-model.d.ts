import { Property, ChildProperty } from '@syncfusion/ej2-base';import { TemplateType } from '../base/type';

/**
 * Interface for a class QuickInfoTemplates
 */
export interface QuickInfoTemplatesModel {

    /**
     * Template option to customize the header section of quick popup.
     * The applicable template types are,
     * * `Both`: Denotes the template applies both to the event and cell.
     * * `Cell`: Denotes the template applies only to the cell.
     * * `Event`: Denotes the template applies to the event alone.
     *
     *  @default 'Both'
     */
    templateType?: TemplateType;

    /**
     * Template option to customize the header section of quick popup.
     *
     *  @default null
     *  @aspType string
     */
    header?: string | Function;

    /**
     * Template option to customize the content area of the quick popup.
     *
     *  @default null
     *  @aspType string
     */
    content?: string | Function;

    /**
     * Template option to customize the footer section of quick popup.
     *
     *  @default null
     *  @aspType string
     */
    footer?: string | Function;

}