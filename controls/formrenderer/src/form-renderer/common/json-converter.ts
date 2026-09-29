import { FieldDataType } from '../form-renderer';
import { FormSchema, FormNode, ConditionalDataRule, ConditionRule, ButtonDefinition, visualMode, CustomValidationRule } from '../form-renderer/types/form-schema';
import { sanitizeId } from './utils';

/**
 * @private
 */
export const generateId = (type: string): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${type}_${timestamp}_${random}`;
};

/**
 * @private
 */
export const generateName = (type: string): string => {
  const random = Math.floor(Math.random() * 1000);
  return `${type}_${random}`;
};

/**
 * @private
 */
export interface UnifiedSchema {
  version: string;
  properties: Record<string, FieldProperties>;
  theme?: string;
  layout: LayoutNode[];
  settings?: any;
}

/**
 * @private
 */
export interface DataSchema {
  version: string;
  properties: Record<string, DataField>;
  settings?: any;
}

/**
 * Represents the properties provided to the form fields in the JSON schema.
 */
export interface FieldProperties {
  /**
   * Specifies the id of the form field.
   * @private
   */
  id?: string;
  /**
   * Specifies the type of the form field. The values are `string`, `number`, `boolean`, `array`, and so on.
   */
  type?: 'string' | 'number' | 'boolean' | 'array' | 'any' | 'button' | 'message' | 'sign' | 'image' | 'file' | 'color' | 'grid';
  /**
   * Specifies the name assigned to the form field, which is used in expressions and other form operations.
   */
  name?: string;
  /**
   * Specifies the label assigned to the form field for identification in the form UI.
   */
  label?: string;
  /**
   * Specifies an identifier for inputs such as Date Picker, DateTime Picker, TimePicker, and TextBox.
   * Takes values such as `date` for Date Picker, `date-time` for DateTime Picker, `time` for TimePicker, and `email` and `url` for TextBox.
   */
  format?: 'date' | 'date-time' | 'time' | 'email' | 'url';
  /**
   * Specifies the default value of the form field.
   */
  defaultValue?: FieldDataType;
  /**
   * Specifies the expression assigned to the form field.
   */
  expressionValue?: string;
  /**
   * Specifies the text content used for message fields.
   */
  content?: string;
  /**
   * Specifies the type of the button set on the button field.
   */
  buttonType?: string;
  /**
   * Specifies the type of the text box set on the text box field.
   * Takes values such as `text`, `password`, `email`, `number`, and `url`.
   */
  textboxType?: string;
  /**
   * Specifies the multiple choice options set on the form field.
   * This property applies to Radio Button, Dropdown List, MultiSelect, and Checkbox Group.
   */
  options?: string[] | unknown[];
  /**
   * Specifies whether the current field is mandatory.
   */
  required?: boolean;
  /**
   * Specifies the minimum length of input allowed for the text box and text area.
   */
  minLength?: number;
  /**
   * Specifies the maximum length of input allowed for the text box and text area.
   */
  maxLength?: number;
  /**
   * Specifies the minimum value that can be set to the rating and range slider components.
   */
  minValue?: number;
  /**
   * Specifies the maximum value that can be set to the range slider component.
   */
  maxValue?: number;
  /**
   * Specifies the minimum date value that can be set to the DateRange Picker.
   */
  minDate?: string;
  /**
   * Specifies the maximum date value that can be set to the DateRange Picker.
   */
  maxDate?: string;
  /**
   * @private
   */
  minTime?: string;
  /**
   * @private
   */
  maxTime?: string;
  /**
   * Specifies the regular expression pattern used to validate the text box and text area form fields.
   */
  pattern?: string;
  /**
   * Specifies the widget used for the current component.
   */
  widget?: 'textbox' | 'textarea' | 'number' | 'checkbox' | 'checkboxGroup' | 'radio' | 'dropdown' | 'multiselect' | 'button' | 'date' | 'dateTime' | 'time' | 'dateRange' | 'switch' | 'signature' | 'rating' | 'imageEditor' | 'fileUpload' | 'rangeSlider' | 'colorPicker' | 'inputMask' | 'message' | 'panel' | 'table' | 'tabs' | 'dataGrid' | 'staticHtml' | 'card' | 'splitButton' | 'richTextEditor';
  /**
   * @private
   */
  _configured?: boolean;
  /**
   * Specifies the description text displayed beneath the field for additional guidance across supported components.
   */
  description?: string | undefined;
  /**
   * Specifies the prefix content displayed before the input for textbox, textarea, number, and input mask fields.
   */
  prefix?: string | undefined;
  /**
   * Specifies the suffix content displayed after the input for textbox, textarea, number, and input mask fields.
   */
  suffix?: string | undefined;
  /**
   * Specifies the placeholder text displayed inside textbox, textarea, number, input mask, dropdown, and multiselect fields.
   */
  placeholder?: string;
  /**
   * Specifies whether the component is disabled in the form UI for all supported components.
   */
  disabled?: boolean;
  /**
   * Specifies whether the component is visible or hidden in the form UI for all supported components.
   */
  visible?: boolean;
  /**
   * Specifies the tooltip text displayed for the component label for all supported components.
   */
  tooltip?: string;
  /**
   * Specifies whether the border and padding of a table or panel component are hidden.
   */
  hideBorders?: boolean;
  /**
   * Specifies whether the form field label is hidden for all supported components.
   */
  hideLabel?: boolean;
  /**
   * Specifies the CSS class name applied to the component for styling.
   */
  cssClass?: string;
  /**
   * Specifies whether the textbox component is rendered as a multi-line input.
   */
  multiline?: boolean;
  /**
   * Specifies whether the input component shows a clear button to reset the current field value.
   */
  showClearButton?: boolean;
  /**
   * Specifies whether the message component shows a close button.
   */
  showCloseIcon?: boolean;
  /**
   * Specifies whether the message component shows its severity icon.
   */
  showIcon?: boolean;
  /**
   * Specifies the visual variant of the message component.
   */
  variant?: 'Standard' | 'Filled' | 'Outlined';
  /**
   * Specifies the severity of the message component.
   */
  severity?: 'Information' | 'Success' | 'Warning' | 'Error';
  /**
   * Specifies whether the calendar component shows a today button.
   */
  showTodayButton?: boolean;
  /**
   * Specifies additional HTML attributes applied to input-like components such as textbox, textarea, and file fields.
   */
  htmlAttributes?: Record<string, FieldDataType>;
  /**
   * Specifies the position of the field label for input components, such as top, bottom, left, or right.
   */
  labelPosition?: string;
  /**
   * Specifies the alignment of button and split button components.
   */
  position?: string;
  /**
   * Specifies the label position for radio button components, such as before or after the option.
   */
  fieldLabelPosition?: 'After' | 'Before';
  /**
   * Specifies the width of the field label for aligning labels when using left or right placement.
   */
  labelWidth?: string;
  /**
   * Specifies the float label behavior for input fields that support placeholder positioning when focused.
   */
  floatLabelType?: 'Never' | 'Always' | 'Auto';
  /**
   * Specifies whether the input component is read-only.
   */
  readOnly?: boolean;
  /**
   * Specifies whether the input component allows browser autocomplete.
   */
  autocomplete?: boolean;
  /**
  * Specifies the number of columns displayed by the textarea component.
  */
  cols?: number;
  /**
   * Specifies the number of rows displayed by the textarea component.
   */
  textareaRows?: number;
  /**
   * Specifies the checked state of checkbox and switch components.
   */
  checked?: boolean;
  /**
   * Specifies the indeterminate state of checkbox components.
   */
  indeterminate?: boolean;
  /**
   * Specifies the off label text displayed by switch components.
   */
  offLabel?: string;
  /**
   * Specifies the on label text displayed by switch components.
   */
  onLabel?: string;
  /**
   * Specifies the icon CSS class applied to button components.
   */
  iconCss?: string;
  /**
   * Specifies the icon position for button components.
   */
  iconPosition?: 'Left' | 'Right';
  /**
   * Specifies the visual style applied to button and split button components.
   */
  style?: 'primary' | 'flat' | 'information' | 'error' | 'success' | 'warning';
  /**
   * Specifies the collection of buttons for a button group component.
   */
  buttonsGroups?: ButtonDefinition[];
  /**
   * Specifies the spacing between buttons in button group and checkbox group components.
   */
  gap?: string;
  // Numeric-specific properties
  /**
   * Specifies the number of decimal places for numeric textbox components.
   */
  decimals?: number;
  /**
   * Specifies the currency format for numeric textbox components.
   */
  currency?: string;
  /**
   * Specifies the number format for numeric textbox components.
   */
  numberFormat?: string;
  /**
   * Specifies whether the rating component allows reset.
   */
  allowReset?: boolean;
  /**
   * Specifies the number of items displayed by the rating component.
   */
  itemsCount?: number;
  /**
   * Specifies the precision of the rating component.
   */
  precision?: number | string;
  /**
   * Specifies whether the rating component shows a tooltip.
   */
  showRatingTooltip?: boolean;
  /**
   * Specifies whether the rating component shows a label.
   */
  showRatingLabel?: boolean;
  /**
   * Specifies the position of the rating label.
   */
  ratingLabelPosition?: 'Top' | 'Bottom' | 'Left' | 'Right';
  /**
   * Specifies the height of the image editor component.
   */
  height?: number | null;
  /**
   * Specifies the width of the image editor component.
   */
  width?: number | null;
  /**
   * Specifies the background color of the signature component.
   */
  backgroundColor?: string;
  /**
   * Specifies the stroke color of the signature component.
   */
  strokeColor?: string;
  /**
   * Specifies the maximum stroke width of the signature component.
   */
  maximumStrokeWidth?: number;
  /**
   * Specifies the minimum stroke width of the signature component.
   */
  minimumStrokeWidth?: number;
  /**
   * Specifies the velocity of the signature component.
   */
  velocity?: number;
  /**
   * Specifies whether the color picker component enables opacity.
   */
  enableOpacity?: boolean;
  /**
   * Specifies whether the color picker shows a no-color option.
   */
  showNoColor?: boolean;
  /**
   * Specifies whether the color picker shows buttons.
   */
  showButtons?: boolean;
  /**
   * Specifies whether the color picker shows recent colors.
   */
  showRecentColors?: boolean;
  /**
   * Specifies the allowed file extensions for the uploader component.
   */
  allowExtensions?: string;
  /**
   * Specifies the save URL for the uploader component.
   */
  saveUrl?: string;
  /**
   * Specifies the remove URL for the uploader component.
   */
  removeUrl?: string;
  /**
   * Specifies the button configuration for the uploader component.
   */
  buttons?: object;
  /**
   * Specifies whether the uploader component allows multiple files.
   */
  allowMultiple?: boolean;
  /**
   * Specifies whether the uploader component shows a file list.
   */
  showFileList?: boolean;
  /**
   * Specifies the data source used by the data grid component.
   */
  dataSource?: [] | unknown;
  /**
   * Specifies the calendar system used by the DatePicker, DateTimePicker, or DateRangePicker component.
   */
  calendarMode?: 'Gregorian' | 'Islamic';
  /**
   * Specifies the format of the day names displayed in the calendar header of the DatePicker, DateTimePicker, or DateRangePicker component.
   */
  dayHeaderFormat?: 'Short' | 'Narrow' | 'Abbreviated' | 'Wide';
  /**
   * Specifies the maximum navigation depth available in the calendar view of the DatePicker, DateTimePicker, or DateRangePicker component.
   */
  depth?: 'Month' | 'Year' | 'Decade';
  /**
   * Specifies the first day of the week displayed in the calendar of the DatePicker, DateTimePicker, or DateRangePicker component.
   */
  firstDayOfWeek?: number;
  /**
   * Specifies the initial calendar view displayed when opening the DatePicker, DateTimePicker, or DateRangePicker component.
   */
  start?: 'Month' | 'Year' | 'Decade';
  /**
   * Specifies whether users can manually enter or edit values in the DateTimePicker input field.
   */
  allowEdit?: boolean;
  /**
   * Specifies whether the DateTimePicker component is enabled for user interaction.
   */
  enabled?: boolean;
  /**
   * Specifies the display format used for the time portion in the DateTimePicker component.
   */
  timeFormat?: string;
  /**
   * Specifies the interval, in minutes, between selectable time values in the DateTimePicker component.
   */
  step?: number;
  /**
   * Specifies the initial start date value of the DateRangePicker component.
   */
  startDate?: string;
  /**
   * Specifies the initial end date value of the DateRangePicker component.
   */
  endDate?: string;
  /**
   * Specifies the separator text displayed between the start and end dates in the DateRangePicker component.
   */
  separator?: string;
  /**
   * Specifies the input mask pattern used in the MaskedTextBox component.
   */
  mask?: string;
  /**
   * Specifies custom character definitions that can be used within the mask pattern of the MaskedTextBox component.
   */
  customCharacters?: Record<string, string>;
  /**
   * Specifies the placeholder character displayed for unfilled positions in the MaskedTextBox component.
   */
  promptChar?: string;
  /**
   * Specifies whether users can add custom values that are not present in the predefined list of the MultiSelect component.
   */
  allowCustomValue?: boolean;
  /**
   * Specifies whether a selected value is added as a tag when the MultiSelect component loses focus.
   */
  addTagOnBlur?: boolean;
  /**
   * Specifies the character used to separate selected values in the MultiSelect component.
   */
  delimiterChar?: string;
  /**
   * Specifies how selected values are visually displayed in the MultiSelect component.
   */
  visualMode?: visualMode;
  /**
   * Specifies whether the Select All option is displayed in the MultiSelect component.
   */
  showSelectAll?: boolean;
  /**
   * Specifies the text displayed for the Select All option in the MultiSelect component.
   */
  selectAllText?: string;
  /**
   * Specifies the text displayed for the Unselect All option in the MultiSelect component.
   */
  unSelectAllText?: string;
  /**
   * Specifies whether to display the dropdown icon in the MultiSelect component.
   */
  showDropDownIcon?: boolean;
  /****
   * Specifies the number of records displayed per page in the DataGrid component.
   */
  pageSize?: number;
  /**
   * Specifies the visual size of the component and is applicable to all input components.
   */
  size?: 'Default' | 'Small' | 'Bigger';
  /**
   * Specifies whether paging is enabled in the DataGrid component.
   */
  allowPaging?: boolean;
  /**
   * Specifies whether new records can be added in the DataGrid component.
   */
  allowAdding?: boolean;
  /**
   * Specifies whether existing records can be edited in the DataGrid component.
   */
  allowEditing?: boolean;
  /**
   * Specifies whether records can be deleted in the DataGrid component.
   */
  allowDeleting?: boolean;
  /**
   * Specifies the position of the label relative to the checkbox. Applicable to CheckBox and CheckBoxGroup components.
   */
  checkboxLabelPosition?: 'Before' | 'After';
  /**
   * Specifies the layout direction used to arrange checkboxes in the CheckBoxGroup component.
   */
  layoutDirection?: 'row' | 'column';
  /**
   * Specifies whether HTML content is sanitized before rendering in the Static HTML component.
   */
  enableHtmlSanitizer?: boolean;
  /**
   * Specifies whether virtualization is enabled to efficiently render large data sets in the DropDownList and MultiSelect components.
   */
  enableVirtualization?: boolean;
  /**
   * Specifies the height of the popup displayed by the DropDownList and MultiSelect components.
   */
  popupHeight?: string;
  /**
   * Specifies the width of the popup displayed by the DropDownList and MultiSelect components.
   */
  popupWidth?: string;
  /**
  * Specifies the visual style of the message displayed in the Message component.
  */
  messageType?: 'info' | 'success' | 'warning' | 'error';
  /**
   * Specifies the child form nodes contained within the Panel or Card layout component.
   */
  children?: FormNode[];
  /**
   * Specifies the number of rows in the Table layout component.
   */
  rows?: number;
  /**
   * Specifies the number of columns in the Table layout component.
   */
  columns?: number | FieldDataType;
  /**
   * Specifies the legend text displayed in the Panel layout component.
   */
  legend?: string;

  /**
   * Specifies the title displayed in the Card layout component.
   */
  cardTitle?: string;
  /**
   * Specifies the subtitle displayed in the Card layout component.
   */
  cardSubtitle?: string;
  /**
   * Specifies the width configuration for columns in the Table layout component.
   */
  columnWidths?: {
    /**
     * Specifies the total number of columns in the table.
     */
    columns: number;

    /**
     * Specifies the percentage width for each column in the table.
     */
    widths: number[];
  };
  /**
   * Specifies the tab items and their associated content in the Tab layout component.
   */
  tabItems?: Array<{
    header: string;
    content?: FormNode[];
  }>;
  /**
   * Specifies the table cell content used to render form nodes within the Table layout component.
   */
  tableCells?: FormNode[][][];
  /**
   * Specifies the header text for each tab in the Tab layout component.
   */
  tabOptions?: string[];
  /**
   * Specifies the settings to enable importing Word documents in the Rich Text Editor component.
   */
  enableImportFromWord?: {
    /**
     * Specifies whether the import from Word feature is enabled.
     */
    enabled: boolean;

    /**
     * Specifies the service endpoint used to process Word document imports in Rich Text Editor.
     */
    serviceUrl: string;
  };
  /**
   * Specifies the settings to enable exporting content as a Word document in the Rich Text Editor component.
   */
  enableExportToWord?: {
    /**
     * Specifies whether the export to Word feature is enabled.
     */
    enabled: boolean;

    /**
     * Specifies the service endpoint used to process Word document exports.
     */
    serviceUrl: string;
  };
  /**
   * Specifies the settings to enable exporting content as a PDF document in the Rich Text Editor component.
   */
  enableExportToPdf?: {
    /**
     * Specifies whether the export to PDF feature is enabled.
     */
    enabled: boolean;

    /**
     * Specifies the service endpoint used to process PDF exports.
     */
    serviceUrl: string;
  };
  /**
   * Specifies the conditional rules for the component, such as visibility, enablement, or other behavior based on form field values.
   * Applicable to all form components.
   */
  conditions?: ConditionRule | FieldDataType;
  /**
   * Specifies custom validation rules and validation messages for the component.
   * Applicable to all input form field components.
   */
  customValidation?: CustomValidationRule[] | FieldDataType;
  /**
   * Specifies the id name of the template which can be added using the `customWidgetSettings`.
   */
  templateId?: string;
  /**
   * Additional UI properties supported by the rendered component.
   */
  [key: string]: unknown;
}

/**
 * @private
 */
export interface DataField {
  id: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'any' | 'button' | 'message' | 'sign' | 'image' | 'file' | 'color' | 'grid';
  name: string;

  label?: string;
  format?: 'date' | 'date-time' | 'time' | 'email' | 'url';
  defaultValue?: any;
  expressionValue?: string;

  content?: string;
  buttonType?: string;
  textboxType?: string;

  options?: string[] | any[] | string | any;

  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  minDate?: string;
  maxDate?: string;
  minTime?: string;
  maxTime?: string;
  pattern?: string;
}

/**
 * @private
 */
export interface UISchema {
  properties: Record<string, UIField>;
  layout: LayoutNode[];
}

/**
 * @private
 */
export interface UIField {
  widget: string;
  _configured?: boolean;
  [key: string]: any;
}

/**
 * Specifies the layouts available in the form.
 */
export type LayoutNode = FieldNode | TableNode | PanelNode | TabsNode | CardNode;

/**
 * Provides the properties to signify a field node.
 */
export interface FieldNode {
  /**
   * Specifies the type identifier of the layout node, set to `field`.
   */
  type: 'field';
  /**
   * Specifies the field id in the properties key, which is provided as a reference to the layout.
   */
  propertyId: string;
}

/**
 * Provides the properties to signify a table.
 */
export interface TableNode {
  /**
   * Specifies the type identifier of the layout node, set to `table`.
   */
  type: 'table';
  /**
   * Specifies the id of the table.
   */
  id: string;
  /**
   * Specifies the name assigned to the table, which is used in expressions and other form operations.
   */
  name: string;
  /**
   * Specifies the label assigned to the table for identification in the form UI.
   */
  label?: string;
  /**
   * Specifies the class name that can be added to the table for CSS styling.
   */
  cssClass?: string;
  /**
   * Specifies whether the border of the table is hidden.
   */
  hideBorders?: boolean;
  /**
   * Specifies the row count in the table.
   */
  rows: number;
  /**
   * Specifies the column count in the table.
   */
  cols: number;
  /**
   * Specifies the configuration set on the table cells.
   */
  cells: TableCell[][];
  /**
   * Specifies the configuration of the column widths.
   */
  columnWidths?: {
    widths: (number | null)[];
  };
  /**
   * Specifies the condition rules that are set on the table element.
   */
  conditions?: ConditionRule; 
}

/**
 * Provides the properties to signify a table cell.
 */
export interface TableCell {
  /**
   * Specifies the row index of the table cell.
   */
  row: number;
  /**
   * Specifies the column index of the table cell.
   */
  col: number;
  /**
   * Specifies the fields or layouts that are available in the current cell.
   */
  children: LayoutNode[];
}

/**
 * Provides the properties to signify a panel.
 */
export interface PanelNode {
  /**
   * Specifies the type identifier of the layout node, set to `panel`.
   */
  type: 'panel';
  /**
   * Specifies the id of the panel.
   */
  id: string;
  /**
   * Specifies the name assigned to the panel, which is used in expressions and other form operations.
   */
  name: string;
  /**
   * Specifies the label assigned to the panel for identification in the form UI.
   */
  label?: string;
  /**
   * Specifies the class name that can be added to the panel for CSS styling.
   */
  cssClass?: string;
  /**
   * Specifies whether the border of the panel is hidden.
   */
  hideBorders?: boolean;
  /**
   * Specifies whether the label of the panel is hidden.
   */
  hideLabel?: boolean;
  /**
   * Specifies the fields or layouts that are available in the current panel.
   */
  children: LayoutNode[];
  /**
   * Specifies the condition rules that are set on the panel element.
   */
  conditions?: ConditionRule; 
}

/**
 * Provides the properties to signify a tab.
 */
export interface TabsNode {
  /**
   * Specifies the type identifier of the layout node, set to `tabs`.
   */
  type: 'tabs';
  /**
   * Specifies the id of the tabs.
   */
  id: string;
  /**
   * Specifies the name assigned to the tabs, which is used in expressions and other form operations.
   */
  name: string;
  /**
   * Specifies the class name that can be added to the tabs for CSS styling.
   */
  cssClass?: string;
  /**
   * Specifies the label assigned to the tabs for identification in the form UI.
   */
  label?: string;
  /**
   * Specifies the name of each tab item.
   */
  tabOptions?: string[];
  /**
   * Specifies the configuration that has been set on each tab item.
   */
  tabs: TabItem[];
  /**
   * Specifies the condition rules that are set on the tabs element.
   */
  conditions?: ConditionRule; 
}

/**
 * Provides the properties to signify a tab item.
 */
export interface TabItem {
  /**
   * Specifies the header name of the tab.
   */
  header: string;
  /**
   * Specifies the fields or layouts that are available in the current tab item.
   */
  children: LayoutNode[];
}

/**
 * Provides the properties to signify a card.
 */
export interface CardNode {
  /**
   * Specifies the type identifier of the layout node, set to `card`.
   */
  type: 'card';
  /**
   * Specifies the id of the card.
   */
  id: string;
  /**
   * Specifies the name assigned to the card, which is used in expressions and other form operations.
   */
  name: string;
  /**
   * Specifies the label assigned to the card for identification in the form UI.
   */
  label?: string;
  /**
   * Specifies the class name that can be added to the card for CSS styling.
   */
  cssClass?: string;
  /**
   * Specifies whether the label of the card is hidden.
   */
  hideLabel?: boolean;
  /**
   * Specifies the title of the card.
   */
  cardTitle?: string;
  /**
   * Specifies the subtitle of the card.
   */
  cardSubtitle?: string;
  /**
   * Specifies the fields or layouts that are available in the current card.
   */
  children: LayoutNode[];
  /**
   * Specifies the condition rules that are set on the card element.
   */
  conditions?: ConditionRule; 
}

/**
 * @private
 */
export function labelToFieldKey(label: string, fallbackId?: string): string {
  if (!label || label.trim() === '') {
    return fallbackId || 'field';
  }

  // Remove special characters, keep letters, numbers, and spaces
  const cleaned = label
    .replace(/[^\w\s]/g, '') // Remove special chars
    .trim();

  if (cleaned === '') {
    return fallbackId || 'field';
  }

  // Split by spaces/underscores and convert to camelCase
  const words = cleaned.split(/[\s_]+/);

  if (words.length === 0) {
    return fallbackId || 'field';
  }

  // First word lowercase, rest title case
  const camelCase = words
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');

  return camelCase || fallbackId || 'field';
}

/**
 * @private
 */
export function makeUniqueFieldKey(
  baseKey: string,
  existingKeys: Set<string>,
  originalId?: string
): string {
  if (!existingKeys.has(baseKey)) {
    return baseKey;
  }

  // Try with original ID suffix first
  if (originalId) {
    const withId = `${baseKey}_${originalId.split('_').pop()}`;
    if (!existingKeys.has(withId)) {
      return withId;
    }
  }

  // Fall back to numeric suffix
  let counter = 2;
  while (existingKeys.has(`${baseKey}${counter}`)) {
    counter++;
  }

  return `${baseKey}${counter}`;
}

/**
 * @private
 */
export const UI_TYPE_TO_SEMANTIC_TYPE: Record<string, { type: DataField['type']; format?: string } | null> = {
  // String types
  'textbox': { type: 'string' },
  'textarea': { type: 'string' },
  'email': { type: 'string', format: 'email' },
  'url': { type: 'string', format: 'url' },
  'phone': { type: 'string' },
  'password': { type: 'string' },
  'inputMask': { type: 'string' },

  // Numeric types
  'number': { type: 'number' },
  'rangeSlider': { type: 'number' },
  'rating': { type: 'number' },

  // Boolean types
  'checkbox': { type: 'boolean' },
  'switch': { type: 'boolean' },

  // Date/Time types
  'date': { type: 'string', format: 'date' },
  'dateTime': { type: 'string', format: 'date-time' },
  'time': { type: 'string', format: 'time' },
  'dateRange': { type: 'string', format: 'date' },

  // Array types
  'multiselect': { type: 'array' },
  'checkboxGroup': { type: 'array' },

  // Single-value selection (stored as string)
  'dropdown': { type: 'string' },
  'radio': { type: 'string' },
  'splitButton': { type: 'string' },

  // Special types (excluded from data schema)
  'button': { type: 'button' },
  'message': { type: 'message' },
  'signature': { type: 'sign' },
  'imageEditor': { type: 'image' },
  'fileUpload': { type: 'file' },
  'colorPicker': { type: 'color' },
  'dataGrid' : {type: 'grid'},

  // Layout types (excluded from data schema)
  'staticHtml': { type: 'string' },
  'table': null,
  'panel': null,
  'tabs': null,
  'card': null
};

/**
 * @private
 */
function stripConfiguredFlag(properties: Record<string, UIField>): Record<string, FieldProperties> {
  const out: Record<string, FieldProperties> = {};
  const keys: string[] = Object.keys(properties || {});
  for (const key of keys) {
    const val: UIField = (properties as Record<string, UIField>)[key as string];
    const copy: any = { ...val };
    if (copy && copy._configured !== undefined) {
      delete copy._configured;
    }
    out[key as string] = copy;
  }
  return out;
}

/**
 * @private
 */
function cleanConditionRules(condition: any, validFieldIds: Set<string>): any | undefined {
  if (!condition || !condition.rules || !Array.isArray(condition.rules)) {
    return undefined;
  }

  const cleanedRules = condition.rules
    .map((rule: any) => {
      // If rule has nested rules (group), recursively clean
      if (rule.rules && Array.isArray(rule.rules)) {
        return cleanConditionRules(rule, validFieldIds);
      }

      // If rule references non-existent field, exclude it
      if (rule.field && !validFieldIds.has(rule.field)) {
        return null;
      }

      return rule;
    })
    .filter((rule: any) => rule !== null && rule !== undefined);

  // If no rules remain, return undefined
  if (cleanedRules.length === 0) {
    return undefined;
  }

  return {
    ...condition,
    rules: cleanedRules
  };
}

/**
 * @private
 */
function getAllComponentIds(components: FormNode[]): Set<string> {
  const ids = new Set<string>();
  const stack = [...components];

  while (stack.length) {
    const comp = stack.pop()!;
    ids.add(comp.id);

    if (comp.children) stack.push(...comp.children);
    if (comp.tabItems) {
      comp.tabItems.forEach(tab => {
        if (tab.content) stack.push(...tab.content);
      });
    }
    if (comp.tableCells) {
      comp.tableCells.forEach(row => {
        row.forEach(cell => stack.push(...cell));
      });
    }
  }

  return ids;
}

/**
 * @private
 */
export function splitSchema(heartSchema: FormSchema): UnifiedSchema {
  const dataFields: Record<string, DataField> = {};
  const uiFields: Record<string, UIField> = {};
  const layout: LayoutNode[] = [];
  const usedFieldKeys = new Set<string>(); // Track unique field keys
  const seenComponentIds = new Set<string>(); // Track component IDs to prevent duplicates

  // ✅ Get all valid field IDs for condition validation
  const validFieldIds = getAllComponentIds(heartSchema.components);

  // Stack for iterative traversal (avoid recursion)
  const stack: Array<{
    component: FormNode;
    layoutParent: LayoutNode[];
  }> = heartSchema.components.map(c => ({
    component: c,
    layoutParent: layout
  }));

  while (stack.length > 0) {
    // Use shift() instead of pop() to maintain order (FIFO instead of LIFO)
    const { component, layoutParent } = stack.shift()!;
    // ✅ Clean conditions before processing
    if (component.conditions) {
      const cleanedConditions: any = {};
      let hasValidConditions = false;

      if (component.conditions.visibleWhen) {
        const cleaned = cleanConditionRules(component.conditions.visibleWhen, validFieldIds);
        if (cleaned) {
          cleanedConditions.visibleWhen = cleaned;
          hasValidConditions = true;
        }
      }

      if (component.conditions.hideWhen) {
        const cleaned = cleanConditionRules(component.conditions.hideWhen, validFieldIds);
        if (cleaned) {
          cleanedConditions.hideWhen = cleaned;
          hasValidConditions = true;
        }
      }

      if (component.conditions.readOnlyWhen) {
        const cleaned = cleanConditionRules(component.conditions.readOnlyWhen, validFieldIds);
        if (cleaned) {
          cleanedConditions.readOnlyWhen = cleaned;
          hasValidConditions = true;
        }
      }

      if (component.conditions.disabledWhen) {
        const cleaned = cleanConditionRules(component.conditions.disabledWhen, validFieldIds);
        if (cleaned) {
          cleanedConditions.disabledWhen = cleaned;
          hasValidConditions = true;
        }
      }

      if (component.conditions.requiredWhen) {
        const cleaned = cleanConditionRules(component.conditions.requiredWhen, validFieldIds);
        if (cleaned) {
          cleanedConditions.requiredWhen = cleaned;
          hasValidConditions = true;
        }
      }

      if (component.conditions.setValueWhen) {
        const cleaned = cleanConditionRules(component.conditions.setValueWhen.condition, validFieldIds);
        if (cleaned && component.conditions.setValueWhen.value !== undefined && component.conditions.setValueWhen.value !== '') {
          cleanedConditions.setValueWhen = {
            condition: cleaned,
            value: component.conditions.setValueWhen.value
          };
          hasValidConditions = true;
        }
      }

      if ((component as any).conditions && (component as any).conditions.choiceBasedField) {
        const rule = (component as any).conditions.choiceBasedField;
        // Validate that primary field exists
        if (rule.primaryFieldId && validFieldIds.has(rule.primaryFieldId)) {
          cleanedConditions.choiceBasedField = rule;
          hasValidConditions = true;
        }
      }

      if (component.conditions.conditionalData && Array.isArray(component.conditions.conditionalData)) {
        const cleanedDataRules = component.conditions.conditionalData
          .map((rule: ConditionalDataRule) => {
            const cleaned = cleanConditionRules(rule.condition, validFieldIds);
            if (cleaned && rule.dataSource) {
              return {
                condition: cleaned,
                dataSource: rule.dataSource,
                columns: rule.columns,
                includeColumns: rule.includeColumns
              };
            }
            return null;
          })
          .filter((rule: any) => rule !== null && rule !== undefined);

        if (cleanedDataRules.length > 0) {
          cleanedConditions.conditionalData = cleanedDataRules as ConditionalDataRule[];
          hasValidConditions = true;
        }
      }

      // Update component conditions (or remove if empty)
      component.conditions = hasValidConditions ? cleanedConditions : undefined;
    }

    // Get semantic type mapping (may be null for presentation-only widgets)
    const semanticType = UI_TYPE_TO_SEMANTIC_TYPE[component.type];

    // Handle layout containers
    if (component.type === 'table') {
      const safeId = sanitizeId(component.id, generateId('table'));
      const tableNode: TableNode = {
        type: 'table',
        id: safeId,
        name: component.name,
        label: component.label,
        cssClass: component.cssClass,
        hideBorders: component.hideBorders,
        rows: (component.tableCells && component.tableCells.length) || 0,
        cols: (component.tableCells && component.tableCells[0] && component.tableCells[0].length) || 0,
        cells: [],
        columnWidths: component.columnWidths,
        ...(component.conditions ? { conditions: component.conditions } : {})
      };

      // Process table cells
      if (component.tableCells) {
        component.tableCells.forEach((row: any, rowIndex: number) => {
        const cellRow: TableCell[] = [];
        row.forEach((cellComponents: any, colIndex: number) => {
          const cellChildren: LayoutNode[] = [];
          // Reverse children and use unshift() to maintain order with depth-first processing
          [...cellComponents].reverse().forEach((comp: FormNode) => {
            stack.unshift({ component: comp, layoutParent: cellChildren });
          });
          cellRow.push({ row: rowIndex, col: colIndex, children: cellChildren });
        });
        tableNode.cells.push(cellRow);
      });
      }

      layoutParent.push(tableNode);
      continue;
    }

    if (component.type === 'panel') {
      const safeId = sanitizeId(component.id, generateId('panel'));
      const panelNode: PanelNode = {
        type: 'panel',
        id: safeId,
        name: component.name,
        label: component.label,
        cssClass: component.cssClass,
        hideBorders: component.hideBorders,
        hideLabel: component.hideLabel,
        children: [],
        ...(component.conditions ? { conditions: component.conditions } : {})
      };

      // Process panel children
      // Reverse children and use unshift() to maintain order with depth-first processing
      [...(component.children || [])].reverse().forEach((child: FormNode) => {
        stack.unshift({ component: child, layoutParent: panelNode.children });
      });

      layoutParent.push(panelNode);
      continue;
    }

    if (component.type === 'tabs') {
      const safeId = sanitizeId(component.id, generateId('tabs'));
      const tabsNode: TabsNode = {
        type: 'tabs',
        name: component.name,
        id: safeId,
        label: component.label,
        cssClass: component.cssClass,
        tabOptions: component.tabOptions,
        tabs: [],
        ...(component.conditions ? { conditions: component.conditions } : {})
      };

      // Process tabs
      if (component.tabItems) {
        component.tabItems.forEach((tab: any) => {
          const tabChildren: LayoutNode[] = [];
          // Reverse children and use unshift() to maintain order with depth-first processing
          [...(tab.content || [])].reverse().forEach((comp: FormNode) => {
            stack.unshift({ component: comp, layoutParent: tabChildren });
          });
          tabsNode.tabs.push({ header: tab.header, children: tabChildren });
        });
      }

      layoutParent.push(tabsNode);
      continue;
    }

    if (component.type === 'card') {
      const safeId = sanitizeId(component.id, generateId('card'));
      const cardNode: CardNode = {
        type: 'card',
        id: safeId,
        name: component.name,
        label: component.label,
        cssClass: component.cssClass,
        hideLabel: component.hideLabel,
        cardTitle: (component as any).cardTitle,
        cardSubtitle: (component as any).cardSubtitle,
        children: [],
        ...(component.conditions ? { conditions: component.conditions } : {})
      };

      // Process card children
      // Reverse children and use unshift() to maintain order with depth-first processing
      [...(component.children || [])].reverse().forEach((child: FormNode) => {
        stack.unshift({ component: child, layoutParent: cardNode.children });
      });

      layoutParent.push(cardNode);
      continue;
    }

    // ✅ DEDUPLICATION: Skip if we've already processed this component ID
    if (seenComponentIds.has(component.id)) {
      //console.log(`⚠️ [splitSchema] Skipping duplicate component: ${component.id} (${component.label})`);
      continue;
    }
    
    seenComponentIds.add(component.id);

    // Generate semantic field key from label
    const baseFieldKey = labelToFieldKey(component.label || component.id, component.id);
    const fieldKey = makeUniqueFieldKey(baseFieldKey, usedFieldKeys, component.id);
    usedFieldKeys.add(fieldKey);

    // Extract data field properties (all components, no skipping)
    // If no semantic type mapping exists, use 'any' as the type
    const dataField = extractDataField(component, semanticType || { type: 'any' });
    dataFields[fieldKey as string] = dataField;

    // Extract UI field properties (all components)
    uiFields[fieldKey as string] = extractUIField(component);

    // Add property reference to layout (use fieldKey instead of component ID)
    layoutParent.push({ type: 'field', propertyId: fieldKey } as FieldNode);
  }

  // ✅ Merge data and UI fields into unified properties
  const unifiedProperties: Record<string, FieldProperties> = {};
  Object.keys(dataFields).forEach(fieldKey => {
    const dataField = dataFields[fieldKey as string];
    const uiField = uiFields[fieldKey as string];
    
    unifiedProperties[fieldKey as string] = {
      ...dataField,
      ...uiField,
      // Ensure widget is always set
      widget: (uiField && uiField.widget) || inferWidgetFromType(dataField.type, dataField.format, dataField.options !== undefined)
    } as FieldProperties;
  });

  const settings = heartSchema.settings ? { ...heartSchema.settings } : {};
 
  return {
    version: heartSchema.version,
    properties: stripConfiguredFlag(unifiedProperties as Record<string, UIField>),
    layout,
    ...(Object.keys(settings).length > 0 ? { settings } : {})
  };
}

/**
 * @private
 */
function extractDataField(
  component: FormNode,
  semanticType: { type: string; format?: string }
): DataField {
  const safeId = sanitizeId(component.id, generateId(semanticType.type));
  const dataField: DataField = {
    id: safeId,
    name: component.name,
    type: semanticType.type as any,
  };

  // Add format if present
  if (semanticType.format) {
    dataField.format = semanticType.format as any;
  }

  // Extract allowed properties only
  if (component.label !== undefined) dataField.label = component.label;
  if (component.defaultValue !== undefined) dataField.defaultValue = component.defaultValue;
  if ((component as any).expressionValue !== undefined) dataField.expressionValue = (component as any).expressionValue;
  if ((component as any).content !== undefined) dataField.content = (component as any).content;
  if ((component as any).buttonType !== undefined) dataField.buttonType = (component as any).buttonType;
  if ((component as any).textboxType !== undefined) dataField.textboxType = (component as any).textboxType;
  if (component.required !== undefined) dataField.required = component.required;

  // Extract options for selection fields (dropdown, radio, multiselect)
  if ((component as any).options !== undefined) dataField.options = (component as any).options;

  if (component.minLength !== undefined) dataField.minLength = component.minLength as number;
  if (component.maxLength !== undefined) dataField.maxLength = component.maxLength as number;

  // Handle numeric validation (use canonical names)
  if ((component as any).minValue !== undefined) dataField.minValue = (component as any).minValue;
  if ((component as any).maxValue !== undefined) dataField.maxValue = (component as any).maxValue;

  // Date/time validation
  if ((component as any).minDate !== undefined) dataField.minDate = (component as any).minDate;
  if ((component as any).maxDate !== undefined) dataField.maxDate = (component as any).maxDate;
  if ((component as any).minTime !== undefined) dataField.minTime = (component as any).minTime;
  if ((component as any).maxTime !== undefined) dataField.maxTime = (component as any).maxTime;

  // Pattern validation (rename from regex, convert RegExp to string)
  if ((component as any).regex !== undefined) {
    const regex = (component as any).regex;
    dataField.pattern = regex instanceof RegExp ? regex.source : regex;
  }
  if ((component as any).pattern !== undefined) {
    const pattern = (component as any).pattern;
    dataField.pattern = pattern instanceof RegExp ? pattern.source : pattern;
  }

  return dataField;
}

/**
 * @private
 */
function extractUIField(component: FormNode): UIField {
  const uiField: UIField = {
    widget: component.type,
  };

  // Copy all properties EXCEPT those in data schema allowed list
  const dataSchemaProps = new Set([
    'id', 'type', 'label', 'format', 'defaultValue', 'required', 'options', 'name', 'expressionValue',
    'minLength', 'maxLength', 'minimum', 'maximum', 'minValue', 'maxValue',
    'minDate', 'maxDate', 'minTime', 'maxTime', 'regex', 'pattern', 'content', 'buttonType', 'textboxType'
  ]);

  Object.keys(component).forEach(key => {
    if (!dataSchemaProps.has(key) && key !== 'id' && key !== 'type') {
      (uiField as any)[key as string] = (component as any)[key as string];
    }
  });

  // Special handling: Filter dataGrid columns to keep only required properties
  if (component.type === 'dataGrid' && uiField.columns && Array.isArray(uiField.columns)) {
    const requiredColumnProps = [
      'field',
      'headerText',
      'type',
      'width',
      'format',
      'editType',
      'validationRules',
      'allowEditing',
      'expression',
      'isPrimaryKey',
      'customValidation'
    ];
    
    uiField.columns = uiField.columns.map((col: any) => {
      const filteredCol: any = {};
      requiredColumnProps.forEach(prop => {
        if (col[prop as string] !== undefined) {
          filteredCol[prop as string] = col[prop as string];
        }
      });
      return filteredCol;
    });
  }

  return uiField;
}

/**
 * @private
 */
export function mergeSchema(
  unified: UnifiedSchema,
  dataModel?: Record<string, FieldDataType>
): FormSchema {
  // Create lookup map for O(1) access to unified properties
  const propertyMap: Map<string, FieldProperties> = new Map<string, FieldProperties>();
  const unifiedPropKeys: string[] = Object.keys(unified.properties);
  for (const id of unifiedPropKeys) {
    propertyMap.set(id, (unified.properties as Record<string, FieldProperties>)[id as string]);
  }

  // Track processed field IDs to prevent duplicates
  const processedFieldIds = new Set<string>();

  // Recursive function to process layout nodes
  const processLayoutNodes = (layoutNodes: LayoutNode[]): FormNode[] => {
    const components: FormNode[] = [];
   
    for (const node of layoutNodes) {
      if (node.type === 'field') {
        const fieldNode = node as FieldNode;
        
        // ✅ DEDUPLICATION: Skip if we've already processed this field
        if (processedFieldIds.has(fieldNode.propertyId)) {
          continue;
        }
        
        processedFieldIds.add(fieldNode.propertyId);
        
        const unifiedField = propertyMap.get(fieldNode.propertyId);

        if (!unifiedField) {
          // console.warn(`Field ${fieldNode.propertyId} in layout not found in schema`);
          // Generate fallback component
          const fallbackComponent: FormNode = {
            id: fieldNode.propertyId || generateId('textbox'),
            name: generateName(''),
            type: 'textbox',
            label: 'Unknown Field',
            _configured: true
          };
          components.push(fallbackComponent);
        } else {
          components.push(mergeUnifiedField(unifiedField, dataModel));
        }
      }
      else if (node.type === 'table') {
        const tableNode = node as TableNode;
        const tableComponent: FormNode = {
          id: tableNode.id || generateId('table'),
          name: tableNode.name,
          type: 'table',
          label: tableNode.label || 'Table',
          cssClass: tableNode.cssClass,
          hideBorders: tableNode.hideBorders,
          rows: tableNode.rows,
          columns: tableNode.cols,
          columnWidths: tableNode.columnWidths as any,
          tableCells: [],
          _configured: true,
          ...(tableNode.conditions ? { conditions: tableNode.conditions } : {})
        };

        // Process table cells recursively
        tableNode.cells.forEach((row) => {
          const cellRow: FormNode[][] = [];
          row.forEach((cell) => {
            const cellComponents = processLayoutNodes(cell.children);
            cellRow.push(cellComponents);
          });
          tableComponent.tableCells!.push(cellRow);
        });

        components.push(tableComponent);
      }
      else if (node.type === 'panel') {
        const panelNode = node as PanelNode;
        const panelComponent: FormNode = {
          id: panelNode.id || generateId('panel'),
          type: 'panel',
          name: panelNode.name,
          cssClass: panelNode.cssClass,
          hideBorders: panelNode.hideBorders,
          hideLabel: panelNode.hideLabel,
          label: panelNode.label || 'Panel',
          children: processLayoutNodes(panelNode.children),
          _configured: true,
          ...(panelNode.conditions ? { conditions: panelNode.conditions } : {})
        };

        components.push(panelComponent);
      }
      else if (node.type === 'tabs') {
        const tabsNode = node as TabsNode;
        const tabsComponent: FormNode = {
          id: tabsNode.id || generateId('tabs'),
          type: 'tabs',
          name: tabsNode.name,
          label: tabsNode.label || 'Tabs',
          cssClass: tabsNode.cssClass,
          tabOptions: tabsNode.tabOptions,
          tabItems: [],
          _configured: true,
          ...(tabsNode.conditions ? { conditions: tabsNode.conditions } : {})
        };

        // Process tabs recursively
        tabsNode.tabs.forEach((tab) => {
          tabsComponent.tabItems!.push({
            header: tab.header,
            content: processLayoutNodes(tab.children)
          });
        });

        components.push(tabsComponent);
      }
      else if (node.type === 'card') {
        const cardNode = node as CardNode;
        const cardComponent: FormNode = {
          id: cardNode.id || generateId('card'),
          type: 'card',
          name: cardNode.name,
          label: cardNode.label || 'Card',
          cssClass: cardNode.cssClass,
          hideLabel: cardNode.hideLabel,
          children: processLayoutNodes(cardNode.children),
          _configured: true,
          ...(cardNode.conditions ? { conditions: cardNode.conditions } : {})
        };

        // Add card-specific properties
        if (cardNode.cardTitle !== undefined) (cardComponent as any).cardTitle = cardNode.cardTitle;
        if (cardNode.cardSubtitle !== undefined) (cardComponent as any).cardSubtitle = cardNode.cardSubtitle;

        components.push(cardComponent);
      }
    }

    return components;
  };

  // Process root layout nodes
  let components: FormNode[];
  
  if (!unified.layout || unified.layout.length === 0) {
    // If layout is undefined or empty, generate a flat layout from properties
    const flatPropKeys: string[] = Object.keys(unified.properties);
    components = flatPropKeys.map((key: string) => {
      return mergeUnifiedField(
        (unified.properties as Record<string, any>)[key as string],
        dataModel
      );
    });
  } else {
    components = processLayoutNodes(unified.layout);
  }

  return {
    version: unified.version,
    components,
    ...(unified.settings ? { settings: unified.settings } : {})
  };
}

/**
 * @private
 */
function mergeUnifiedField(
  unifiedField: FieldProperties,
  dataModel?: Record<string, FieldDataType>
): FormNode {
  const hasOptions = unifiedField.options !== undefined && unifiedField.options.length > 0;

  const component: FormNode = {
    id: unifiedField.id || generateId(unifiedField.widget || inferWidgetFromType(unifiedField.type, unifiedField.format, hasOptions)),
    name: unifiedField.name,
    type: (unifiedField.widget || inferWidgetFromType(unifiedField.type, unifiedField.format, hasOptions)) as any,
    label: unifiedField.label || unifiedField.id,
  };

  // Copy all data and UI properties from unified field
  const dataSchemaProps = new Set([
    'id', 'type', 'name', 'label', 'format', 'widget', 'defaultValue', 'required', 'options', 'expressionValue',
    'minLength', 'maxLength', 'minimum', 'maximum', 'minValue', 'maxValue',
    'minDate', 'maxDate', 'minTime', 'maxTime', 'regex', 'pattern', 'content', 'buttonType', 'textboxType'
  ]);

  Object.keys(unifiedField).forEach(key => {
    if (!dataSchemaProps.has(key) && key !== 'id' && key !== 'name' && key !== 'type' && key !== 'label') {
      (component as any)[key as string] = (unifiedField as any)[key as string];
    }
  });

  // Copy specific data properties
  if (unifiedField.defaultValue !== undefined) (component as any).defaultValue = unifiedField.defaultValue;
  if (unifiedField.expressionValue !== undefined) (component as any).expressionValue = unifiedField.expressionValue;
  if (unifiedField.required !== undefined) component.required = unifiedField.required;
  if (unifiedField.content !== undefined) (component as any).content = unifiedField.content;
  if (unifiedField.buttonType !== undefined) (component as any).buttonType = unifiedField.buttonType;
  if (unifiedField.textboxType !== undefined) (component as any).textboxType = unifiedField.textboxType;
  if (unifiedField.options !== undefined) (component as any).options = unifiedField.options;
  if (unifiedField.minLength !== undefined) (component as any).minLength = unifiedField.minLength;
  if (unifiedField.maxLength !== undefined) (component as any).maxLength = unifiedField.maxLength;
  if (unifiedField.minValue !== undefined) (component as any).minValue = unifiedField.minValue;
  if (unifiedField.maxValue !== undefined) (component as any).maxValue = unifiedField.maxValue;
  if (unifiedField.minDate !== undefined) (component as any).minDate = unifiedField.minDate;
  if (unifiedField.maxDate !== undefined) (component as any).maxDate = unifiedField.maxDate;
  if (unifiedField.minTime !== undefined) (component as any).minTime = unifiedField.minTime;
  if (unifiedField.maxTime !== undefined) (component as any).maxTime = unifiedField.maxTime;
  if (unifiedField.pattern !== undefined) (component as any).regex = unifiedField.pattern;
  if (unifiedField.name && dataModel && Object.prototype.hasOwnProperty.call(dataModel, unifiedField.name)) { 
    if(component.type === 'checkbox' || component.type === 'switch') {
      (component as any).checked = dataModel[unifiedField.name];
    }
    if(component.type === 'dataGrid') {
      (component as any).dataSource = dataModel[unifiedField.name];
    }
    else{
      component.defaultValue = dataModel[unifiedField.name];
    }
  }
  return component as FormNode;
}

/**
 * @private
 */
export function inferWidgetFromType(type: string, format?: string, hasOptions?: boolean): string {
  if (type === 'string') {
    if (format === 'date') return 'date';
    if (format === 'date-time') return 'dateTime';
    if (format === 'time') return 'time';
    if (format === 'email') return 'email';
    if (format === 'url') return 'url';
    // If options are present, default to dropdown for string types
    if (hasOptions) return 'dropdown';
    return 'textbox';
  }
  if (type === 'number') return 'number';
  if (type === 'boolean') return 'checkbox';
  if (type === 'array') {
    // For array type with options, use multiselect
    return 'multiselect';
  }
  if (type === 'button') return 'button';
  if (type === 'message') return 'message';
  if (type === 'sign') return 'signature';
  if (type === 'image') return 'imageEditor';
  if (type === 'file') return 'fileUpload';
  if (type === 'color') return 'colorPicker';
  if (type === 'grid') return 'dataGrid';
  if (type === 'any') return 'textbox';
  return 'textbox';
}

/**
 * @private
 */
export interface FieldMatchResult {
  existingId: string;
  newDataId: string;
  confidence: 'exact' | 'high' | 'medium' | 'low';
  method: 'id' | 'label-exact' | 'label-fuzzy' | 'new';
  similarity?: number;
}

/**
 * @private
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i as number] = [i as number];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j as number] = j;
  }

  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i as number][j as number] = Math.min(
        matrix[i - 1][j as number] + 1,      // deletion
        matrix[i as number][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1 as number][len2 as number];
}

/**
 * @private
 */
function calculateSimilarity(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 100;
  return Math.round(((maxLen - distance) / maxLen) * 100);
}

/**
 * @private
 */
export function matchFieldWithIDPreservation(
  newDataField: DataField,
  existingUISchema: UISchema
): FieldMatchResult {
  // 1. Try exact ID match first
  if (existingUISchema.properties[newDataField.id]) {
    return {
      existingId: newDataField.id,
      newDataId: newDataField.id,
      confidence: 'exact',
      method: 'id',
      similarity: 100
    };
  }

  // 2. Try fuzzy match by ID (check if existing ID starts with new ID or vice versa)
  let bestIdMatch: FieldMatchResult | null = null;

  const idMatchKeys: string[] = Object.keys(existingUISchema.properties);
  for (const existingId of idMatchKeys) {
    const existingUIField: UIField = (existingUISchema.properties as Record<string, UIField>)[existingId as string];

    // Skip if this is a layout container
    if (existingUIField.widget === 'table' || existingUIField.widget === 'panel' || existingUIField.widget === 'tabs') {
      continue;
    }

    // Check if one ID is a prefix of the other (common case: radio_123 vs radio_123_456)
    const newId: string = newDataField.id || '';
    const isPrefix: boolean = existingId.indexOf(newId + '_') === 0 || newId.indexOf(existingId + '_') === 0;

    if (isPrefix) {
      const similarity = Math.round((Math.min(newId.length, existingId.length) / Math.max(newId.length, existingId.length)) * 100);

      if (!bestIdMatch || (bestIdMatch.similarity && similarity > bestIdMatch.similarity)) {
        bestIdMatch = {
          existingId: existingId,  // PRESERVE EXISTING ID
          newDataId: newDataField.id,
          confidence: similarity >= 90 ? 'high' : similarity >= 70 ? 'medium' : 'low',
          method: 'id',
          similarity
        };
      }
    } else {
      // Try Levenshtein distance for ID similarity
      const idSimilarity = calculateSimilarity(existingId, newId);

      // Only consider as potential match if very similar (≥85%)
      if (idSimilarity >= 85) {
        if (!bestIdMatch || (bestIdMatch.similarity && idSimilarity > bestIdMatch.similarity)) {
          bestIdMatch = {
            existingId: existingId,
            newDataId: newDataField.id,
            confidence: idSimilarity >= 90 ? 'high' : 'medium',
            method: 'id',
            similarity: idSimilarity
          };
        }
      }
    }
  }

  // If we found a good ID match, use it
  if (bestIdMatch && bestIdMatch.similarity && bestIdMatch.similarity >= 70) {
    //console.log(`ID fuzzy match: "${newDataField.id}" → "${bestIdMatch.existingId}" (${bestIdMatch.similarity}% similar)`);
    return bestIdMatch;
  }

  // 3. Try fuzzy match by label
  let bestLabelMatch: FieldMatchResult | null = null;

  const labelMatchKeys: string[] = Object.keys(existingUISchema.properties);
  for (const existingId of labelMatchKeys) {
    const existingUIField: UIField = (existingUISchema.properties as Record<string, UIField>)[existingId as string];

    // Skip if this is a layout container
    if (existingUIField.widget === 'table' || existingUIField.widget === 'panel' || existingUIField.widget === 'tabs') {
      continue;
    }

    // Get label from UI field or try to extract from ID
    const existingLabel: string = (existingUIField as any).label || existingId;
    const newLabel = newDataField.label || newDataField.id;

    if (!existingLabel || !newLabel) continue;

    const similarity = calculateSimilarity(existingLabel, newLabel);

    // Update best match if this is better
    if (!bestLabelMatch || (bestLabelMatch.similarity && similarity > bestLabelMatch.similarity)) {
      bestLabelMatch = {
        existingId: existingId,  // PRESERVE EXISTING ID
        newDataId: newDataField.id,
        confidence: similarity >= 90 ? 'high' : similarity >= 70 ? 'medium' : 'low',
        method: similarity === 100 ? 'label-exact' : 'label-fuzzy',
        similarity
      };
    }
  }

  // 4. Return best label match if similarity is good enough (≥70%)
  if (bestLabelMatch && bestLabelMatch.similarity && bestLabelMatch.similarity >= 70) {
    //console.log(`Label fuzzy match: "${newDataField.label}" → "${bestLabelMatch.existingId}" (${bestLabelMatch.similarity}% similar)`);
    return bestLabelMatch;
  }

  // 5. No match found - use new ID
  return {
    existingId: newDataField.id,
    newDataId: newDataField.id,
    confidence: 'exact',
    method: 'new',
    similarity: 100
  };
}

/**
 * @private
 */
export function mergeWithIDRemapping(
  newDataSchema: DataSchema,
  existingUISchema: UISchema
): FormSchema {
  const idMap = new Map<string, string>(); // newId → canonicalId
  const matchResults: FieldMatchResult[] = [];

  // Build ID mapping table
  const newDataPropKeys: string[] = Object.keys(newDataSchema.properties);
  for (const newId of newDataPropKeys) {
    const dataField: DataField = (newDataSchema.properties as Record<string, DataField>)[newId as string];
    const match: FieldMatchResult = matchFieldWithIDPreservation(dataField, existingUISchema);
    matchResults.push(match);
    idMap.set(newId, match.existingId || generateId(labelToFieldKey(dataField.label || '')));

    // Log remapping if IDs differ
    if (match.newDataId !== match.existingId) {
      //console.log(`ID remapped: ${match.newDataId} → ${match.existingId} (${match.method}, ${match.similarity}% similar)`);
    }
  }

  // Remap all data field IDs to canonical IDs
  const remappedDataFields: Record<string, DataField> = {};
  const newDataPropKeys2: string[] = Object.keys(newDataSchema.properties);
  for (const newId of newDataPropKeys2) {
    const dataField: DataField = (newDataSchema.properties as Record<string, DataField>)[newId as string];
    const canonicalId: string = idMap.get(newId) || newId;
    remappedDataFields[canonicalId as string] = {
      ...dataField,
      id: canonicalId  // Use canonical ID
    };
  }

  // Get existing field IDs from the layout
  const existingFieldIds = extractFieldIdsFromLayout(existingUISchema.layout);
  const newFieldIds = Object.keys(remappedDataFields).filter(id => !existingFieldIds.has(id));

  //console.log(`📋 Existing fields in layout: ${existingFieldIds.size}, New fields: ${newFieldIds.length}`);
  
  // ✅ CHECK IF SUBMIT BUTTON EXISTS: Prevent duplicate submit buttons
  const existingUIValues: UIField[] = Object.keys(existingUISchema.properties).map(
    (k: string) => (existingUISchema.properties as Record<string, UIField>)[k as string]
  );
  const hasExistingSubmitButton: boolean = existingUIValues.some(
    (uiField: UIField) => uiField.widget === 'button'
  );

  // Filter out new submit buttons if one already exists
  const filteredNewFieldIds: string[] = newFieldIds.filter((id: string) => {
    const dataField: DataField = remappedDataFields[id as string];
    if ((dataField.type === 'button' && dataField.buttonType === 'submit') && hasExistingSubmitButton) {
      //console.log(`⚠️ Skipping new button "${dataField.label}" - submit button already exists in layout`);
      return false;
    }
    return true;
  });

  //console.log(`📋 New fields after filtering: ${filteredNewFieldIds.length}`);

  // Update layout references to use canonical IDs
  let remappedLayout: LayoutNode[] = remapLayoutIds(existingUISchema.layout, idMap);

  // Create UI properties for new fields that don't have them yet
  // ✅ Ensure all existing UI properties have _configured flag (add if missing from imported JSON)
  const enhancedUIProperties: Record<string, UIField> = {};
  const existingUIKeys: string[] = Object.keys(existingUISchema.properties);
  for (const key of existingUIKeys) {
    const uiField: UIField = (existingUISchema.properties as Record<string, UIField>)[key as string];
    enhancedUIProperties[key as string] = {
      ...uiField,
      _configured: uiField._configured !== undefined ? uiField._configured : true
    };
  }

  if (filteredNewFieldIds.length > 0) {
    //console.log(`➕ Adding ${filteredNewFieldIds.length} new fields to layout`);

    // Check if submit button exists and is at the last position (not moved by user)
    const lastNode = remappedLayout[remappedLayout.length - 1];
    const isSubmitAtEnd = lastNode && lastNode.type === 'field' &&
      enhancedUIProperties[(lastNode as FieldNode).propertyId] && enhancedUIProperties[(lastNode as FieldNode).propertyId].widget === 'button';

    const newFieldNodes: FieldNode[] = [];

    // Generate default UI properties for new fields
    filteredNewFieldIds.forEach(id => {
      const dataField = remappedDataFields[id as string];
      const hasOptions = dataField.options !== undefined && dataField.options.length > 0;
      const widget = inferWidgetFromType(dataField.type, dataField.format, hasOptions);
      
      // ✅ Add default button styling
      const uiProperties: any = {
        widget,
        label: dataField.label,
        _configured: true
      };
      
      // Add primary styling for buttons
      if (widget === 'button') {
        uiProperties.isPrimary = true;
        uiProperties.name= 'defaultFormSubmit'
        uiProperties.cssClass = 'e-primary';
      }
      
      enhancedUIProperties[id as string] = uiProperties;

      newFieldNodes.push({
        type: 'field' as 'field',
        propertyId: id
      });
    });

    // Apply same logic as App.tsx: insert before submit if it's at the end
    if (isSubmitAtEnd) {
      // Insert new fields BEFORE the submit button
      remappedLayout = [...remappedLayout.slice(0, -1), ...newFieldNodes, remappedLayout[remappedLayout.length - 1]];
      //console.log(`📐 Layout rebuilt: new fields inserted before submit button at end`);
    } else {
      // Submit moved or doesn't exist - add new fields at end
      remappedLayout = [...remappedLayout, ...newFieldNodes];
      //console.log(`📐 Layout rebuilt: new fields added at end`);
    }
  }

  // Merge to FormSchema using unified schema
  const unifiedProperties: Record<string, FieldProperties> = {};
  Object.keys(remappedDataFields).forEach(fieldKey => {
    const dataField = remappedDataFields[fieldKey as string];
    const uiField = enhancedUIProperties[fieldKey as string];
    
    unifiedProperties[fieldKey as string] = {
      ...dataField,
      ...uiField,
      widget: (uiField && uiField.widget) || inferWidgetFromType(dataField.type, dataField.format, dataField.options !== undefined)
    } as FieldProperties;
  });

  const mergedSchema = mergeSchema({
    version: newDataSchema.version,
    properties: unifiedProperties,
    layout: remappedLayout,
    ...(newDataSchema.settings ? { settings: newDataSchema.settings } : {})
  });

  return mergedSchema;
}

/**
 * @private
 */
function remapLayoutIds(layout: LayoutNode[], idMap: Map<string, string>): LayoutNode[] {
  return layout.map(node => {
    if (node.type === 'field') {
      const fieldNode = node as FieldNode;
      const canonicalId = idMap.get(fieldNode.propertyId) || fieldNode.propertyId;
      return {
        ...fieldNode,
        propertyId: canonicalId
      };
    }
    else if (node.type === 'table') {
      const tableNode = node as TableNode;
      return {
        ...tableNode,
        cells: tableNode.cells.map(row =>
          row.map(cell => ({
            ...cell,
            children: remapLayoutIds(cell.children, idMap)
          }))
        )
      };
    }
    else if (node.type === 'panel') {
      const panelNode = node as PanelNode;
      return {
        ...panelNode,
        children: remapLayoutIds(panelNode.children, idMap)
      };
    }
    else if (node.type === 'tabs') {
      const tabsNode = node as TabsNode;
      return {
        ...tabsNode,
        tabs: tabsNode.tabs.map(tab => ({
          ...tab,
          children: remapLayoutIds(tab.children, idMap)
        }))
      };
    }
    else if (node.type === 'card') {
      const cardNode = node as CardNode;
      return {
        ...cardNode,
        children: remapLayoutIds(cardNode.children, idMap)
      };
    }
    return node;
  });
}

/**
 * @private
 */
export function extractFieldIdsFromLayout(layout: LayoutNode[]): Set<string> {
  const fieldIds = new Set<string>();

  const stack: LayoutNode[] = [...layout];
  while (stack.length > 0) {
    const node = stack.shift()!;

    if (node.type === 'field') {
      fieldIds.add((node as FieldNode).propertyId);
    }
    else if (node.type === 'table') {
      (node as TableNode).cells.forEach(row =>
        row.forEach(cell => stack.push(...cell.children))
      );
    }
    else if (node.type === 'panel') {
      stack.push(...(node as PanelNode).children);
    }
    else if (node.type === 'tabs') {
      (node as TabsNode).tabs.forEach(tab => stack.push(...tab.children));
    }
    else if (node.type === 'card') {
      stack.push(...(node as CardNode).children);
    }
  }

  return fieldIds;
}

/**
 * @private
 */
export function convertComponentsToDataSchema(components: FormNode[]): DataSchema {
  const properties: Record<string, DataField> = {};
  const seenComponentIds = new Set<string>(); // Track component IDs to prevent duplicates
  
  // Flatten all components (including nested ones)
  const stack: FormNode[] = [...components];

  while (stack.length > 0) {
    const comp = stack.shift()!;

    // Infer semantic type from component
    const semanticType = UI_TYPE_TO_SEMANTIC_TYPE[comp.type];

    // Skip presentation-only widgets (button, message, etc.) - they have null semantic type
    if (semanticType === null) {
      // Still process nested children for layout containers
      if (comp.children && comp.children.length) {
        stack.unshift(...comp.children);
      }
      if (comp.tabItems && comp.tabItems.length) {
        for (const tab of comp.tabItems) {
          if (tab.content && tab.content.length) {
            stack.unshift(...tab.content);
          }
        }
      }
      if (comp.tableCells && comp.tableCells.length) {
        for (const row of comp.tableCells) {
          for (const cell of row) {
            if (cell.length) {
              stack.unshift(...cell);
            }
          }
        }
      }
      continue; // Skip adding to data schema
    }

    // ✅ DEDUPLICATION: Skip if we've already processed this component ID
    if (seenComponentIds.has(comp.id)) {
      //console.log(`⚠️ Skipping duplicate component: ${comp.id} (${comp.label})`);
      // Still process nested children
      if (comp.children && comp.children.length) {
        stack.unshift(...comp.children);
      }
      if (comp.tabItems && comp.tabItems.length) {
        for (const tab of comp.tabItems) {
          if (tab.content && tab.content.length) {
            stack.unshift(...tab.content);
          }
        }
      }
      if (comp.tableCells && comp.tableCells.length) {
        for (const row of comp.tableCells) {
          for (const cell of row) {
            if (cell.length) {
              stack.unshift(...cell);
            }
          }
        }
      }
      continue;
    }

    seenComponentIds.add(comp.id);
    // Generate fieldKey from label or ID
    const baseFieldKey = labelToFieldKey(comp.label || comp.id, comp.id);
    const fieldKey = makeUniqueFieldKey(baseFieldKey, new Set(Object.keys(properties)), comp.id);
    const dataField = extractDataField(comp, semanticType || { type: 'any' });
    properties[fieldKey as string] = dataField;

    // Process nested children
    if (comp.children && comp.children.length) {
      stack.unshift(...comp.children);
    }

    // Process tab items
    if (comp.tabItems && comp.tabItems.length) {
      for (const tab of comp.tabItems) {
        if (tab.content && tab.content.length) {
          stack.unshift(...tab.content);
        }
      }
    }

    // Process table cells
    if (comp.tableCells && comp.tableCells.length) {
      for (const row of comp.tableCells) {
        for (const cell of row) {
          // cell is FormNode[], not an object with .components
          if (cell.length) {
            stack.unshift(...cell);
          }
        }
      }
    }
  }

  return {
    version: '1.0',
    properties
  };
}
