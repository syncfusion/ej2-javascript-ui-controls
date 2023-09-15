import { ChildProperty, Complex, Property } from '@syncfusion/ej2-base';
import { RibbonItemType, RibbonItemSize, DisplayMode } from '../base/interface';
import { RibbonButtonSettings } from './ribbon-button-settings';
import { RibbonButtonSettingsModel } from './ribbon-button-settings-model';
import { RibbonCheckBoxSettings } from './ribbon-checkbox-settings';
import { RibbonCheckBoxSettingsModel } from './ribbon-checkbox-settings-model';
import { RibbonColorPickerSettings } from './ribbon-colorpicker-settings';
import { RibbonColorPickerSettingsModel } from './ribbon-colorpicker-settings-model';
import { RibbonComboBoxSettings } from './ribbon-combobox-settings';
import { RibbonComboBoxSettingsModel } from './ribbon-combobox-settings-model';
import { RibbonDropDownSettings } from './ribbon-dropdown-settings';
import { RibbonDropDownSettingsModel } from './ribbon-dropdown-settings-model';
import { RibbonSplitButtonSettings } from './ribbon-splitbutton-settings';
import { RibbonSplitButtonSettingsModel } from './ribbon-splitbutton-settings-model';
import { RibbonTooltip } from './ribbon-tooltip';
import { RibbonTooltipModel } from './ribbon-tooltip-model';
import { RibbonGroupButtonSettingsModel } from './ribbon-group-button-settings-model';
import { RibbonGroupButtonSettings } from './ribbon-group-button-settings';

/**
 * Defines the ribbon item.
 */
export class RibbonItem extends ChildProperty<RibbonItem>  {
    /**
     * Defines the active size of the ribbon item.
     *
     * @default 'Medium'
     * @aspNumberEnum
     */
    @Property(RibbonItemSize.Medium)
    public activeSize : RibbonItemSize;

    /**
     * Defines the sizes that are allowed for the ribbon item on ribbon resize.
     *
     * @default null
     * @aspNumberEnum
     */
    @Property(RibbonItemSize.Small | RibbonItemSize.Medium | RibbonItemSize.Large)
    public allowedSizes: RibbonItemSize;

    /**
     * Defines a unique identifier for the item.
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Defines one or more CSS classes to customize the appearance of item.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Defines whether the item is disabled or not.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Defines the template content for the ribbon item.
     * `ActiveSize` property is passed as string in template context.
     *
     * @default ''
     * @angularType string | object | HTMLElement
     * @reactType string | function | JSX.Element | HTMLElement
     * @vueType string | function | HTMLElement
     * @aspType string
     */
    @Property('')
    public itemTemplate: string | HTMLElement | Function;

    /**
     * Defines the type of control to be added as the Ribbon Item.
     *
     * @isenumeration true
     * @default RibbonItemType.Button
     * @asptype RibbonItemType
     */
    @Property('Button')
    public type: RibbonItemType | string;

    /**
     * Defines the display options for the ribbon item.
     *
     * @default 'Auto'
     * @aspNumberEnum
     */
    @Property(DisplayMode.Auto)
    public displayOptions: DisplayMode;

    /**
     * Defines the settings for the tooltip of the item.
     *
     * @default {}
     */
    @Complex<RibbonTooltipModel>({}, RibbonTooltip)
    public ribbonTooltipSettings: RibbonTooltipModel;

    /**
     * Defines the settings for the ribbon button.
     *
     * @default {}
     */
    @Complex<RibbonButtonSettingsModel>({}, RibbonButtonSettings)
    public buttonSettings: RibbonButtonSettingsModel;

    /**
     * Defines the settings for the ribbon dropdown button.
     *
     * @default {}
     */
    @Complex<RibbonDropDownSettingsModel>({}, RibbonDropDownSettings)
    public dropDownSettings: RibbonDropDownSettingsModel;

    /**
     * Defines the settings for the ribbon checkbox.
     *
     * @default {}
     */
    @Complex<RibbonCheckBoxSettingsModel>({}, RibbonCheckBoxSettings)
    public checkBoxSettings: RibbonCheckBoxSettingsModel;

    /**
     * Defines the settings for the ribbon color picker.
     *
     * @default {}
     */
    @Complex<RibbonColorPickerSettingsModel>({}, RibbonColorPickerSettings)
    public colorPickerSettings: RibbonColorPickerSettingsModel;

    /**
     * Defines the settings for the ribbon combobox.
     *
     * @default {}
     */
    @Complex<RibbonComboBoxSettingsModel>({}, RibbonComboBoxSettings)
    public comboBoxSettings: RibbonComboBoxSettingsModel;

    /**
     * Defines the settings for the ribbon split button.
     *
     * @default {}
     */
    @Complex<RibbonSplitButtonSettingsModel>({}, RibbonSplitButtonSettings)
    public splitButtonSettings: RibbonSplitButtonSettingsModel;

    /**
     * Defines the properties for group button in Ribbon
     *
     * @default {}
     */
    @Complex<RibbonGroupButtonSettingsModel>({}, RibbonGroupButtonSettings)
    public groupButtonSettings: RibbonGroupButtonSettingsModel;

    /**
     * @param {Object} prop - Gets the property of item.
     * @param {boolean} muteOnChange - Gets the boolean value of muteOnChange.
     * @returns {void}
     * @private
     */
    public setProperties(prop: Object, muteOnChange: boolean): void {
        super.setProperties(prop, muteOnChange);
    }
}
