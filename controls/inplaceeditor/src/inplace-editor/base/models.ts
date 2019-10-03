import { ChildProperty, Property } from '@syncfusion/ej2-base';
import { TooltipModel } from '@syncfusion/ej2-popups';

/**
 * Configures the popup settings of the In-place editor.
 */
export class PopupSettings extends ChildProperty<PopupSettings> {
    /**
     * Specifies title for the editor popup.

     */
    @Property('')
    public title: string;
    /**
     * Specifies model for editor popup customization like position, animation,etc.

     */
    @Property(null)
    public model: TooltipModel;
}

/**

 */
export let modulesList: { [key: string]: string } = {
    'AutoComplete': 'auto-complete',
    'Color': 'color-picker',
    'ComboBox': 'combo-box',
    'DateRange': 'date-range-picker',
    'MultiSelect': 'multi-select',
    'RTE': 'rte',
    'Slider': 'slider',
    'Time': 'time-picker'
};

/**

 */
export let localeConstant: { [key: string]: object } = {
    'Click': { 'editAreaClick': 'Click to edit' },
    'DblClick': { 'editAreaDoubleClick': 'Double click to edit' }
};