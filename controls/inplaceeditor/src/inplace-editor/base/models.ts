import { ChildProperty, Property } from '@syncfusion/ej2-base';
import { TooltipModel } from '@syncfusion/ej2-popups';

/**
 * Configures the popup settings of the In-place editor.
 */
export class PopupSettings extends ChildProperty<PopupSettings> {
    /**
     * Specifies title for the editor popup.
     * 
     * @default ''
     */
    @Property('')
    public title: string;
    /**
     * Specifies model for editor popup customization like position, animation,etc.
     * 
     * @default null
     */
    @Property(null)
    public model: TooltipModel;
}
/**
 * @hidden
 */
export let modulesList: { [key: string]: string } = {
     /* eslint-disable */
    'AutoComplete': 'auto-complete',
    'Color': 'color-picker',
    'ComboBox': 'combo-box',
    'DateRange': 'date-range-picker',
    'MultiSelect': 'multi-select',
    'RTE': 'rte',
    'Slider': 'slider',
    'Time': 'time-picker'
    /* eslint-enable */
};

/**
 * @hidden
 */
// eslint-disable-next-line
export let localeConstant: { [key: string]: object } = {
    /* eslint-disable */
    'Click': { 'editAreaClick': 'Click to edit' },
    'DblClick': { 'editAreaDoubleClick': 'Double click to edit' },
    'EditIconClick': { 'editAreaClick': 'Click to edit' }
    /* eslint-enable */
};