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
     */
    @Property()
    public template: string;

    /**    
     * Defines the card selection type.
     * @default 'Single'
     */
    @Property('Single')
    public selectionType: SelectionType;

}
