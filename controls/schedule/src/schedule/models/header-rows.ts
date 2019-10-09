import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { HeaderRowType } from '../base/type';

/**  
 * A class that represents the header rows related configurations on timeline views.
 */
export class HeaderRows extends ChildProperty<HeaderRows> {
    /** 
     * It defines the header row type, which accepts either of the following values.
     * * Year
     * * Month
     * * Week
     * * Date
     * * Hour
     * @default null
     */
    @Property()
    public option: HeaderRowType;

    /** 
     * Template option to customize the individual header rows. It accepts either the string or HTMLElement as template design
     *  content and parse it appropriately before displaying it onto the header cells. The field that
     *  can be accessed via this template is `date`.
     * @default null
     */
    @Property()
    public template: string;
}
