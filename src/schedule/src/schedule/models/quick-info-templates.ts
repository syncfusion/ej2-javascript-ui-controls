import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { TemplateType } from '../base/type';

/**
 * A class that defines the template options available to customize the quick popup of scheduler.
 */
export class QuickInfoTemplates extends ChildProperty<QuickInfoTemplates> {
    /**
     * Template option to customize the header section of quick popup.
     * The applicable template types are,
     * * `Both`: Denotes the template applies both to the event and cell.
     * * `Cell`: Denotes the template applies only to the cell.
     * * `Event`: Denotes the template applies to the event alone.
     *
     *  @default 'Both'
     */
    @Property('Both')
    public templateType: TemplateType;

    /**
     * Template option to customize the header section of quick popup.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public header: string | Function;

    /**
     * Template option to customize the content area of the quick popup.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public content: string | Function;

    /**
     * Template option to customize the footer section of quick popup.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public footer: string | Function;

}
