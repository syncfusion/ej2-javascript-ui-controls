import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { PaletteItem } from '../types/form-schema';
import { FieldProperties, FormSettings, LayoutNode } from '@syncfusion/ej2-form-renderer';

/**
 * Defines a custom toolbox entry for the Form Builder component palette.
 * Each entry replaces the default rendering of a component type with a custom template.
 */
export class ToolboxItemSetting extends ChildProperty<ToolboxItemSetting> {
    /**
     * Specifies the template content to be used.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property(null)
    public template: string | HTMLElement | Function;
    /**
     * Specifies the Form Builder component type that this toolbox entry customizes.
     *
     * @default ''
     */
    @Property('' as FormWidgetType)
    public type: FormWidgetType;

    /**
     * Specifies a stable identifier that is persisted in the field schema,
     * allowing a downstream Form Renderer to resolve the matching custom-template
     * implementation when the schema is re-imported.
     *
     * @default ''
     */
    @Property('')
    public templateId: string;
}

/**
 * Defines the configuration of a component property in the Form Builder property panel.
 * Each definition describes how a property is displayed, edited, and validated.
 */
export interface PropertyDefinition {
    /** Specifies the name of the property. */
    name?: string;
    /** Specifies the unique key that identifies the property within the component. */
    key?: string;
    /** Specifies the label displayed for the property in the property panel. */
    label?: string;
    /** Specifies the editor type used to render the property in the property panel. */
    type?:
        | 'text' | 'number' | 'boolean' | 'dropdown' | 'object'
        | 'conditionBuilder' | 'expression' | 'customValidation' | 'multiselect'
        | 'radio' | 'minMaxEditor' | 'options' | 'day' | 'time' | 'datetime'
        | 'attributes' | 'array' | 'daterange' | 'color' | 'datagridcolumns'
        | 'json' | 'buttonGroup' | 'html' | 'columnspaneditor' | 'switch'
        | 'URLImport' | 'conditions' | 'visible';
    /** Specifies the default value of the property. */
    default?: any;
    /** Indicates whether the property requires a value. */
    required?: boolean;
    /** Specifies the placeholder text shown when the property input is empty. */
    placeholder?: string;
    /** Specifies the editor mode applied when the property type supports multiple modes. */
    editorMode?: 'date' | 'number' | 'time';
    /** Specifies the maximum character length allowed for the property value. */
    length?: number;
    /** Specifies the description of the property. */
    description?: string;
    /** Specifies the list of predefined options available for the property. */
    options?: string[];
    /** Specifies the minimum value allowed for the property. */
    min?: number;
    /** Specifies the maximum value allowed for the property. */
    max?: number;
    /** Specifies the increment step between allowed values. */
    step?: number;
    /** Specifies the component type to which the property applies. */
    componentType?: string;
    /** Specifies the builder mode in which the property is available. */
    mode?: 'simple' | 'developer';
    /** @private */
    supportedConditions?: string[];
    /** Indicates whether the property is visible in the property panel. */
    visible?: boolean;
}

/**
 * Represents a pre-defined form template that can be loaded into the Form Builder.
 * Templates can be used to create custom components and reusable structures
 * for frequently used form elements.
 */
export interface CustomFormTemplate {
  /** Specifies the unique identifier of the template. */
  id: string;

  /** Specifies the display title shown in the template palette. */
  title: string;

  /** Specifies the JSON schema payload of the template. */
  schema?: any;
}

/**
 * Represents the categories of components in the Form Builder.
 */
export enum ComponentCategory {
  /**
   * Specifies the basic set of form components in the Form Builder.
   */
  Basic = 'basic',
  /**
   * Specifies the advanced set of form components in the Form Builder.
   */
  Advanced = 'advanced',
  /**
   * Specifies the layout components in the Form Builder.
   */
  Layout = 'layout',
}

/**
 * Represents the components supported in the Form Builder.
 */
export enum FormWidgetType {
  /**
   * Specifies the text box component.
   */
  Textbox = 'textbox',
  /**
   * Specifies the text area component.
   */
  Textarea = 'textarea',
  /**
   * Specifies the check box component.
   */
  Checkbox = 'checkbox',
  /**
   * Specifies the radio button component.
   */
  Radio = 'radio',
  /**
   * Specifies the numeric text box component.
   */
  Number = 'number',
  /**
   * Specifies the masked text box component.
   */
  InputMask = 'inputMask',
  /**
   * Specifies the dropdown list component.
   */
  Dropdown = 'dropdown',
  /**
   * Specifies the date picker component.
   */
  Date = 'date',
  /**
   * Specifies the button component.
   */
  Button = 'button',
  /**
   * Specifies the check box group component, which allows multiple choice selection.
   */
  CheckboxGroup = 'checkboxGroup',
  /**
   * Specifies the multiselect component for multiple choice selection.
   */
  MultiSelect = 'multiselect',
  /**
   * Specifies the date time picker component.
   */
  DateTime = 'dateTime',
  /**
   * Specifies the time picker component.
   */
  Time = 'time',
  /**
   * Specifies the date range picker component.
   */
  DateRange = 'dateRange',
  /**
   * Specifies the switch component.
   */
  Switch = 'switch',
  /**
   * Specifies the rating component.
   */
  Rating = 'rating',
  /**
   * Specifies the splitbutton component.
   */
  SplitButton = 'splitButton',
  /**
   * Specifies the range slider component.
   */
  RangeSlider = 'rangeSlider',
  /**
   * Specifies the signature component.
   */
  Signature = 'signature',
  /**
   * Specifies the image editor component.
   */
  ImageEditor = 'imageEditor',
  /**
   * Specifies the file upload component.
   */
  FileUpload = 'fileUpload',
  /**
   * Specifies the color picker component.
   */
  ColorPicker = 'colorPicker',
  /**
   * Specifies the rich text editor component.
   */
  RichTextEditor = 'richTextEditor',
  /**
   * Specifies the data grid component.
   */
  DataGrid = 'dataGrid',
  /**
   * Specifies the message component.
   */
  Message = 'message',
  /**
   * Specifies the panel component used for form layout.
   */
  Panel = 'panel',
  /**
   * Specifies the table component used for form layout.
   */
  Table = 'table',
  /**
   * Specifies the tab component used for form layout.
   */
  Tabs = 'tabs',
  /**
   * Specifies the card component used for form layout.
   */
  Card = 'card',
  /**
   * Specifies a static HTML element that can be rendered in the form.
   */
  StaticHtml = 'staticHtml'
}

/**
 * Specifies the palette configuration, which controls which components
 * appear in each category of the Form Builder toolbox.
 */
export interface ToolboxCategory {
  /** Specifies the category of components to display in the palette. */
  category: ComponentCategory;

  /** Specifies the components to display in the category. */
  items: FormWidgetType[];
}

/** @private */
export type ToolboxCategoryConfig = ToolboxCategory[] | Record<string, PaletteItem[]>;

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
