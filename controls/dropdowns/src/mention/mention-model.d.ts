import { compile, Property, EventHandler, Animation, AnimationModel, KeyboardEventArgs, formatUnit, append, attributes } from '@syncfusion/ej2-base';import { isNullOrUndefined, detach, Event, EmitType, Complex, addClass, removeClass, closest, isUndefined, getValue, NotifyPropertyChanges, Browser } from '@syncfusion/ej2-base';import { FieldSettingsModel } from '../drop-down-base/drop-down-base-model';import { FieldSettings, FilteringEventArgs, FilterType } from '../drop-down-base/drop-down-base';import { DropDownBase, PopupEventArgs, SelectEventArgs, BeforeOpenEventArgs, dropDownBaseClasses } from '../drop-down-base/drop-down-base';import { DataManager, Query } from '@syncfusion/ej2-data';import { SortOrder } from '@syncfusion/ej2-lists';import { Popup, isCollide, createSpinner, showSpinner, hideSpinner, getZindexPartial } from '@syncfusion/ej2-popups';import { highlightSearch, revertHighlightSearch } from '../common/highlight-search';
import {MentionChangeEventArgs} from "./mention";

/**
 * Interface for a class Mention
 */
export interface MentionModel {

    /**
     * Defines class/multiple classes separated by a space for the mention component.
     *
     * @default null
     */
    cssClass?: string;

    /**
     * Specifies the symbol or single character which triggers the search action in the mention component.
     *
     * @default '@'
     * @aspType char
     */
    mentionChar?: string;

    /**
     * Specifies whether to show the configured mentionChar with the text.
     *
     * @default false
     */
    showMentionChar?: boolean;

    /**
     * Defines whether to allow the space in the middle of mention while searching.
     * When disabled, the space ends the mention component search.
     *
     * @default false
     */
    allowSpaces?: boolean;

    /**
     * Specifies the custom suffix to append along with the mention component selected item while inserting.
     * You can append space or new line character as suffix.
     *
     * @default null
     */
    suffixText?: string;

    /**
     * Specifies the number of items in the suggestion list.
     *
     * @default 25
     * @aspType int
     */
    suggestionCount?: number;

    /**
     * Specifies the minimum length of user input to initiate the search action.
     * The default value is zero, where suggestion the list opened as soon as the user inputs the mention character.
     *
     * @default 0
     * @aspType int
     */
    minLength?: number;

    /**
     * Specifies the order to sort the data source. The possible sort orders are,
     * * `None` - The data source is not sorted.
     * * `Ascending` - The data source is sorted in ascending order.
     * * `Descending` - The data source is sorted in descending order.
     *
     * @default 'None'
     */
    sortOrder?: SortOrder;

    /**
     * Specifies whether the searches are case sensitive to find suggestions.
     *
     * @default true
     */
    ignoreCase?: boolean;

    /**
     * Specifies whether a space is required before the mention character to trigger the suggestion list.
     * When set to false, the suggestion list will be triggered even without a space before the mention character.
     *
     * @default true
     */
    requireLeadingSpace?: boolean;

    /**
     * Specifies whether to highlight the searched characters on suggestion list items.
     *
     * @default false
     */
    highlight?: boolean;

    /**
     * Overrides the global culture and localization value for this component. Default global culture is ‘en-US’.
     *
     * @default 'en-US'
     */
    locale?: string;

    /**
     * Specifies the width of the popup in pixels/number/percentage. The number value is considered as pixels.
     *
     * @default 'auto'
     * @aspType string
     */
    popupWidth?: string | number;

    /**
     * Specifies the height of the popup in pixels/number/percentage. The number value is considered as pixels.
     *
     * @default '300px'
     * @aspType string
     */
    popupHeight?: string | number;

    /**
     * Specifies the delay time in milliseconds for filtering operations.
     *
     * @default 300
     */
    debounceDelay?: number;

    /**
     * Specifies the template for the selected value from the suggestion list.
     *
     * @default null
     * @aspType string
     */
    displayTemplate?: string | Function;

    /**
     * Specifies the template for the suggestion list.
     *
     * @default null
     */
    itemTemplate?: string;

    /**
     * Specifies the template for no matched item which is displayed when there are no items to display in the suggestion list.
     *
     * @default 'No records found'
     */
    noRecordsTemplate?: string;

    /**
     * Specifies the template for showing until data is loaded in the popup.
     *
     * @default null
     * @aspType string
     */
    spinnerTemplate?: string | Function;

    /**
     * Specifies the target selector where the mention component needs to be displayed.
     * The mention component listens to the target's user input and displays suggestions as soon as the user inputs the mention character.
     *
     */
    target?: HTMLElement | string;

    /**
     * Accepts the list items either through local or remote service and binds it to the component.
     * It can be an array of JSON Objects or an instance of `DataManager`.
     *
     * @default []
     */
    dataSource?: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[];

    /**
     * Specifies the external query, which can be customized and filtered against the data source.
     *
     * @default null
     */
    query?: Query;

    /**
     * Determines on which filter type, the component needs to be considered on search action.
     * and its supported data types are
     *
     * <table>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * FilterType<br/></td><td colSpan=1 rowSpan=1>
     * Description<br/></td><td colSpan=1 rowSpan=1>
     * Supported Types<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * StartsWith<br/></td><td colSpan=1 rowSpan=1>
     * Checks whether a value begins with the specified value.<br/></td><td colSpan=1 rowSpan=1>
     * String<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * EndsWith<br/></td><td colSpan=1 rowSpan=1>
     * Checks whether a value ends with a specified value.<br/><br/></td><td colSpan=1 rowSpan=1>
     * <br/>String<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * Contains<br/></td><td colSpan=1 rowSpan=1>
     * Checks whether a value contains with a specified value.<br/><br/></td><td colSpan=1 rowSpan=1>
     * <br/>String<br/></td></tr>
     * </table>
     *
     * The default value set to `Contains`, all the suggestion items which contain typed characters to listed in the suggestion popup.
     *
     * @default 'Contains'
     */
    filterType?: FilterType;

    /**
     * Defines the fields of the Mention to map with the data source and binds the data to the component.
     * * text - Specifies the text that maps the text filed from the data source for each list item.
     * * value - Specifies the value that maps the value filed from the data source for each list item.
     * * iconCss - Specifies the iconCss that map the icon class filed from the data source for each list item.
     * * groupBy - Specifies the groupBy that groups the list items with its related items by mapping groupBy field.
     *
     * @default
     * {
     *  text: null, value: null, iconCss: null, groupBy: null
     * }
     */
    fields?: FieldSettingsModel;

    /**
     * Triggers before fetching data from the remote server.
     *
     * @event actionBegin
     */
    actionBegin?: EmitType<Object>;

    /**
     * Triggers after data is fetched successfully from the remote server.
     *
     * @event actionComplete
     */
    actionComplete?: EmitType<Object>;

    /**
     * Triggers when the data fetch request from the remote server fails.
     *
     * @event actionFailure
     */
    actionFailure?: EmitType<Object>;

    /**
     * Triggers when an item in a popup is selected and updated in an editor.
     *
     * @event change
     */
    change?: EmitType<MentionChangeEventArgs>;

    /**
     * Triggers before the popup is opened.
     *
     * @event beforeOpen
     */
    beforeOpen?: EmitType<PopupEventArgs>;

    /**
     * Triggers after the popup opens.
     *
     * @event opened
     */
    opened?: EmitType<PopupEventArgs>;

    /**
     * Triggers after the popup is closed.
     *
     * @event closed
     */
    closed?: EmitType<PopupEventArgs>;

    /**
     * Triggers when an item in the popup is selected by the user either with the mouse/tap or with keyboard navigation.
     *
     * @event select
     */
    select?: EmitType<SelectEventArgs>;

    /**
     * Triggers on typing a character in the component.
     *
     * @event filtering
     */
    filtering?: EmitType<FilteringEventArgs>;

    /**
     * Triggers when the component is created.
     *
     * @event created
     */
    created?: EmitType<Object>;

    /**
     * Triggers when the component is destroyed.
     *
     * @event destroyed
     */
    destroyed?: EmitType<Object>;

}