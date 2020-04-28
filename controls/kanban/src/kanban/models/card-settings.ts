import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { SelectionType } from '../base/type';


/**  
 * Holds the configuration of card settings in kanban board.
 */
export class CardSettings extends ChildProperty<CardSettings> {

    /**
     * Show or hide the card header
     * @default true
     */
    @Property(true)
    public showHeader: boolean;

    /**
     * Defines the card header text
     * @default null
     */
    @Property()
    public headerField: string;

    /**
     * Defines the card content text
     * @default null
     */
    @Property()
    public contentField: string;

    /**
     * Defines the card template
     * @default null
     * @deprecated
     */
    @Property()
    public template: string;

    /**
     * Defines the card order
     * @default null
     */
    @Property()
    public priority: string;

    /**
     * It defines the card selection type, which accepts either of the following values.
     * * Single
     * * Multiple
     * * None
     * @default 'Single'
     */
    @Property('Single')
    public selectionType: SelectionType;

}
