import { ClickEventArgs } from '@syncfusion/ej2-buttons';
import { MinMaxRangeItem } from '../../common/minmax-rule-engine';
import { LayoutNode, FieldProperties } from '../../common/json-converter';
import { GridColumn } from '@syncfusion/ej2-grids';
import { FieldDataType } from '../form-renderer';

/**
 * @private
 */
export interface RuleModel {
    condition?: 'And' | 'Or' | 'and' | 'or';
    rules?: RuleModel[] | QueryRule[];
    field?: string;
    label?: string;
    operator?: string;
    type?: string;
    value?: string | number | boolean | Date | (string | number | boolean | Date)[];
    isGroup?: boolean;
}

/**
 * @private
 */
export interface QueryRule {
    field: string;
    operator: string;
    value: string | number | boolean | Date | (string | number | boolean | Date)[];
    label?: string;
    type?: string;
}

/**
 * Provides the visual modes of the dropdown component.
 */
export type visualMode = 'Default' | 'Delimiters' | 'Box' | 'CheckBox';

/**
 * Represents the JSON schema format used for data exchange and storage.
 * Contains a flat key-value map of properties, a layout tree, and optional global settings.
 */
export interface Schema {
  /** Specifies the version of the schema (e.g., '0.1.0') */
  version: string;

  /** Specifies the key-value map of all field definitions in the form */
  properties: Record<string, FieldProperties>;

  /** Specifies the hierarchical layout nodes mapping properties to UI positions */
  layout: LayoutNode[];

  /** Specifies the optional global form settings (form name, size, floatLabelType, etc.) */
  settings?: FormSettings;
}


/**
 * @private
 */
export interface HeaderPair {
    key: string;
    value: string;
}

/**
 * @private
 */
export interface SearchConfig {
    enabled: boolean;
    fields: string[];     // Fields to search in (e.g., 'name', 'email')
    key?: string;         // Optional: query parameter name (default: 'search')
}

/**
 * @private
 */
export interface SortConfig {
    enabled: boolean;
    field: string;        // Field to sort by
    direction: 'ascending' | 'descending';
}

/**
 * @private
 */
export interface FilterConfig {
    field: string;
    operator: string;     // 'equal', 'notequal', 'contains', 'greaterthan', etc.
    value: any;
}


/**
 * @private
 */
export interface DataSourceCollectorProps {
    value: string[] | {
        type: 'url' | 'raw' | 'options';
        url?: string;
        headers?: HeaderPair[];
        data?: string[];
        search?: SearchConfig;
        sort?: SortConfig;
        filters?: FilterConfig[];
        adaptorType?: string;
        take?: number;
        skip?: number;
        dataPath?: string;
        formName?: any;
    };
    onChange: (data: string[] | any) => void;
    type?: string;
    datakey?: string
    isAccordion?: boolean;
}

/**
 * @private
 */
export interface ConditionalDataRule {
  condition: ConditionType;
  dataSource: DataSourceCollectorProps['value'];
  columns?: GridColumn[];
  includeColumns?: boolean;
}

/**
 * Defines the operators that can be used to define a condition.
 */
export type ConditionalOperator =
  | 'equal'
  | 'notEqual'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'in'
  | 'notIn'
  | 'contains'
  | 'notContains'
  | 'isempty'
  | 'isnotempty';

/**
 * Specifies the rule for the condition by defining the operator, value and labels.
 */
export interface ConditionalRule {
  label?: string;
  field: string;
  operator: ConditionalOperator;
  type?: string;
  value: object | string | number | boolean | null;
}

/**
 * This class is used to define the condition and rules.
 */
export interface CompositeConditionalRule {
  condition: 'and' | 'or';
  rules: (ConditionalRule | CompositeConditionalRule)[];
}

/**
 * Defines the types for the conditions such as rules and composite condtional rule.
 */
export type ConditionType = ConditionalRule | CompositeConditionalRule;

/**
 * @private
 */
export interface LookupConfig {
  formName: string;
  field: string;
}

/**
 * @private
 */
export interface ChoiceBasedFieldRule {
  primaryFieldId: string;
  choiceMapping: Record<string, string[]>;
  showAllWhenNotMapped?: boolean;
}

/**
 * @private
 */
export interface CustomValidationRule {
  condition?: RuleModel;
  expression: string;
}

/**
 * Specifies the rules configurations for the condtions.
 */
export interface ConditionRule {
  /**
   * When this is set, the form field can be visible based on a condition.
   */
  visibleWhen?: ConditionType;
  /**
   * When this is set, the form field can be made hidden based on a condition.
   */
  hideWhen?: ConditionType;
  /**
   * When this is set, the form field can be read only based on a condition.
   */
  readOnlyWhen?: ConditionType;
  /**
   * When this is set, the form field can be disabled based on a condition.
   */
  disabledWhen?: ConditionType;
  /**
   * When this is set, the form field can be required based on a condition.
   */
  requiredWhen?: ConditionType;
  /**
   * When this is set, the form field's value can be set based on a condition.
   */
  setValueWhen?: { condition: ConditionType; value: unknown };
  /**
   * This property is used to handle the dependent dropdowns.
   */
  choiceBasedField?: ChoiceBasedFieldRule;
  /**
   * This property is used to handle data source of Grid based on a condition.
   */
  conditionalData?: ConditionalDataRule[];
}

/**
 * @private
 */
export interface FormSchema {
  version: string;
  components: FormNode[];
  settings?: {
    [key: string]: any;
  };
}


/**
 * These enum values define the layouts available to render forms.
 */
export enum FormLayout {
  /**
   * SingleColumn - Represents the single column layout and renders forms in a vertical layout.
   */
  SingleColumn = 'SingleColumn',
  /**
   * TwoColumn - Represents the two column layout and renders forms in a two column grid layout.
   */
  TwoColumn = 'TwoColumn',
  /**
   * ThreeColumn - Represents the three column layout which renders forms in a three column grid layout.
   */
  ThreeColumn = 'ThreeColumn',
  /**
   * FourColumn - Represents the four column layout which renders forms in a four column grid layout.
   */
  FourColumn = 'FourColumn'
}

/**
 * Specifies the component types supported in the Form Renderer.
 */
export const FORM_COMPONENT_TYPES: ReadonlyArray<
  'textbox' | 'textarea' | 'number' | 'checkbox' | 'checkboxGroup' | 'radio' |
  'dropdown' | 'multiselect' | 'button' | 'date' | 'dateTime' | 'time' | 'dateRange' |
  'switch' | 'signature' | 'rating' | 'imageEditor' | 'fileUpload' | 'rangeSlider' |
  'colorPicker' | 'inputMask' | 'message' | 'panel' | 'table' | 'tabs' | 'dataGrid' |
  'staticHtml' | 'card' | 'splitButton' | 'richTextEditor'
> = [
  'textbox', 'textarea', 'number', 'checkbox', 'checkboxGroup', 'radio',
  'dropdown', 'multiselect', 'button', 'date', 'dateTime', 'time', 'dateRange',
  'switch', 'signature', 'rating', 'imageEditor', 'fileUpload', 'rangeSlider',
  'colorPicker', 'inputMask', 'message', 'panel', 'table', 'tabs', 'dataGrid',
  'staticHtml', 'card', 'splitButton', 'richTextEditor'
];

/**
 * @private
 */
export type FormComponentType =
  'textbox' | 'textarea' | 'number' | 'checkbox' | 'checkboxGroup' | 'radio' |
  'dropdown' | 'multiselect' | 'button' | 'date' | 'dateTime' | 'time' | 'dateRange' |
  'switch' | 'signature' | 'rating' | 'imageEditor' | 'fileUpload' | 'rangeSlider' |
  'colorPicker' | 'inputMask' | 'message' | 'panel' | 'table' | 'tabs' | 'dataGrid' |
  'staticHtml' | 'card' | 'splitButton' | 'richTextEditor';

/**
 * @private
 */
export interface FormNode {
  id: string;
  type: FormComponentType;
  textboxType?: 'text' | 'password' | 'email' | 'number' | 'url';
  label: string;
  name: string;
  description?: string | undefined;
  prefix?: string | undefined;
  suffix?:string | undefined;
  placeholder?: string;
  defaultValue?: FieldDataType;
  disabled?: boolean;
  visible?: boolean;
  tooltip?: string;
  hideBorders?: boolean;
  hideLabel?: boolean;
  cssClass?: string;
  multiline?: boolean;
  showClearButton?: boolean;
  showCloseIcon?: boolean;
  showIcon?: boolean;
  variant?: 'standard' | 'filled' | 'outlined';
  severity?: 'information' | 'success' | 'warning' | 'error';
  content?: string;
  showTodayButton?: boolean;
  htmlAttributes?: Record<string, any>;
  labelPosition?: 'Top' | 'Bottom' | 'Left' | 'Right';
  position?: 'center' | 'left' | 'right';
  fieldLabelPosition?: 'After' | 'Before';
  labelWidth?: string;
  // Component-specific properties (used by rendering layer)
  floatLabelType?: 'Never' | 'Always' | 'Auto';
  readOnly?: boolean;
  autocomplete?: boolean;
  cols?: number;
  textareaRows?: number;
  checked?: boolean;
  indeterminate?: boolean;
  offLabel?: string;
  onLabel?: string;
  buttonType?: 'button' | 'submit' | 'reset';
  iconCss?: string;
  iconPosition?: 'Left' | 'Right';
  style?: 'primary' | 'flat' | 'information' | 'error' | 'success' | 'warning';
  // Button group specific
  buttonsGroups?: ButtonDefinition[];
  gap?: string;
  onClick?: (event: ClickEventArgs) => void;
  // Numeric-specific properties
  decimals?: number;
  currency?: string;
  format?: string;
  numberFormat?: string;
  // Rating-specific properties
  allowReset?: boolean;
  itemsCount?: number;
  precision?: number | string;
  showRatingTooltip?: boolean;
  showRatingLabel?: boolean;
  ratingLabelPosition?: 'Top' | 'Bottom' | 'Left' | 'Right';
  // imageEditor-specific properties
  height?: number | null;
  width?: number | null;
  // Signature-specific properties
  backgroundColor?: string;
  strokeColor?: string;
  maximumStrokeWidth?: number;
  minimumStrokeWidth?: number;
  velocity?: number;
  // colorPicker-specific properties
  enableOpacity?: boolean;
  showNoColor?: boolean;
  showButtons?: boolean;
  showRecentColors?: boolean;
  orientation?: 'Horizontal' | 'Vertical';
  // Uploader-specific properties
  allowExtensions?: string;
  saveUrl?: string;
  removeUrl?: string;
  buttons?: object;
  dataSource?: [];
  minMaxRange?: MinMaxRangeItem[];
  minMaxTimeRange?: MinMaxRangeItem[];
  allowMultiple?: boolean;
  showFileList?: boolean;
  // DatePicker-specific properties
  calendarMode?: 'gregorian' | 'islamic';
  dayHeaderFormat?: 'short' | 'narrow' | 'abbreviated' | 'wide';
  depth?: 'month' | 'year' | 'decade';
  firstDayOfWeek?: number;
  start?: 'month' | 'year' | 'decade';
  // dateTime-specific properties
  allowEdit?: boolean;
  enabled?: boolean;
  timeFormat?: string;
  step?: number;
  // DateRangePicker-specific properties
  startDate?: string;
  endDate?: string;
  separator?: string;
  // MaskedTextBox-specific properties
  mask?: string;
  customCharacters?: Record<string, string>;
  promptChar?: string;
  // MultiSelect-specific properties
  allowCustomValue?: boolean;
  addTagOnBlur?: boolean;
  delimiterChar?: string;
  visualMode?: visualMode;
  showSelectAll?: boolean;
  selectAllText?: string;
  unSelectAllText?:string;
  showDropDownIcon?: boolean;
  validateOn?: 'Change' | 'Blur';
  pageSize?: number;
  size?: string;
  allowPaging?: boolean;
  allowAdding?: boolean;
  allowEditing?: boolean;
  allowDeleting?: boolean;
  required?: boolean;
  minLength?: number | null;
  maxLength?: number | null;
  min?: number | null;
  minimum?: number | null;
  max?: number | null;
  minDate?: string;
  maxDate?: string;
  minValue?: number | null;
  maxValue?: number | null;
  minTime?: string;
  maxTime?: string;
  regex?: string;
  validationMessage?: string;
  options?: string[];
  checkboxLabelPosition?: 'Before' | 'After';
  layoutDirection?: 'row' | 'column';
  enableHtmlSanitizer?: boolean;
  fields?: Record<string, any>;
  enableVirtualization?: boolean;
  popupHeight?: string;
  popupWidth?: string;
  // Layout-specific properties
  children?: FormNode[];
  rows?: number;
  columns?: number;
  messageType?: 'info' | 'success' | 'warning' | 'error';
  messageContent?: string;
  legend?: string;
  cardTitle?: string;
  cardSubtitle?: string;
  // Table column width configuration: percentages for each column [20, 30, 50]
  columnWidths?: {
    columns: number;      // Total number of columns
    widths: number[];     // Percentage widths per column
  };
  tabItems?: Array<{ header: string; content?: FormNode[] }>;
  // Table cell data: [rowIndex][columnIndex] -> FormComponent[]
  tableCells?: FormNode[][][];
  tabOptions?: string[];
  lookUpConfig?: LookupConfig;
  enableImportFromWord?: {
    enabled: boolean;
    serviceUrl: string;
  };
  enableExportToWord?: {
    enabled: boolean;
    serviceUrl: string;
  };
  enableExportToPdf?: {
    enabled: boolean;
    serviceUrl: string;
  };
  // Parent path for nested components (e.g., "panel_123" or "panel_123.table_456.cell-0-1")
  parentPath?: string;
  // Dynamic properties from property dialog
  properties?: Record<string, any>;
  // Expression-based value computation
  expressionValue?: string;
  conditions?: ConditionRule;
  customValidation?: CustomValidationRule[];
  _configured?: boolean; // Indicates if the component has been configured in the builder
}

/**
 * @private
 */
export interface ValidationRules {
  [fieldName: string]: {
    required?: [boolean, string];
    minLength?: [number, string];
    maxLength?: [number, string];
    min?: [number, string];
    max?: [number, string];
    regex?: [string, string];
    date?: [string, string];
    [key: string]: any | undefined;
  };
}

/**
 * Specifies the optional global settings that control form rendering behavior.
 */
export interface FormSettings {
  /** Specifies the title or name of the form. */
  name?: string;
  /** Specifies the width of the form container, such as '100%' or '600px'. */
  width?: string;
  /** Specifies whether labels are hidden for form fields. */
  hideLabel?: boolean;
  /**
   * Specifies the overall UI size variant for form controls.
   * Takes values such as `Small`, `Medium`, or `Large`.
   */
  size?: string;
  /**
   * Specifies the float label display mode for input fields.
   * Takes values such as `Never`, `Always`, or `Auto`.
   */
  floatLabelType?: string;
}

/**
 * @private
 */
export interface ButtonDefinition {
  label: string;
  type?: 'submit' | 'reset' | 'button';
  style?: 'primary' | 'flat' | 'information' | 'error' | 'success' | 'warning';
  iconCss?: string;
  iconPosition?: 'Left' | 'Right';
  disabled?: boolean;
}
