import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**  
 * Configures the column chooser behavior of the Grid.  
 */
export class ColumnChooserSettings extends ChildProperty<ColumnChooserSettings> {
    /**    
     * Defines the search operator for Column Chooser.
     * 
     * @default 'startsWith'
     * @blazorType Syncfusion.Blazor.Operator
     * @blazorDefaultValue Syncfusion.Blazor.Operator.StartsWith
     */
    @Property('startsWith')
    public operator: string;
}