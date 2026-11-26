import { ChildProperty, Collection, Complex, Property } from '@syncfusion/ej2-base';import { WorkflowCustomFieldType } from './workflow-enums';import { WorkflowSize } from './workflow-size';import { WorkflowStepAppearance } from './workflow-appearance';

/**
 * Interface for a class WorkflowCustomFieldValidation
 */
export interface WorkflowCustomFieldValidationModel {

    /**
     * Defines the minimum number of characters of a text value.
     *
     * @default null
     */
    minLength?: number;

    /**
     * Defines the maximum number of characters of a text value.
     *
     * @default null
     */
    maxLength?: number;

    /**
     * Defines the minimum value of a numeric field.
     *
     * @default null
     */
    min?: number;

    /**
     * Defines the maximum value of a numeric field.
     *
     * @default null
     */
    max?: number;

    /**
     * Defines a regular expression that a text value must match.
     *
     * @default ''
     */
    pattern?: string;

}

/**
 * Interface for a class WorkflowCustomFieldOption
 */
export interface WorkflowCustomFieldOptionModel {

    /**
     * Defines the text displayed for the option.
     *
     * @default ''
     */
    text?: string;

    /**
     * Defines the value stored when the option is chosen.
     *
     * @default ''
     */
    value?: string | number | boolean;

}

/**
 * Interface for a class WorkflowCustomFieldDefinition
 */
export interface WorkflowCustomFieldDefinitionModel {

    /**
     * Defines the name under which the value is stored in the step's `props`. It must be unique within
     * the custom step. Nested keys are not supported.
     *
     * @default ''
     */
    key?: string;

    /**
     * Defines the caption displayed for the field.
     *
     * @default ''
     */
    label?: string;

    /**
     * Defines the input displayed for the field.
     *
     * @default 'TextBox'
     */
    type?: WorkflowCustomFieldType;

    /**
     * Defines the initial value of the field in a new step. The value is copied for every new step.
     *
     * @default null
     */
    defaultValue?: Object;

    /**
     * Defines whether the field must have a value.
     *
     * @default false
     */
    required?: boolean;

    /**
     * Defines whether the field is disabled.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Defines whether the field can be read but not changed.
     *
     * @default false
     */
    readOnly?: boolean;

    /**
     * Defines the hint displayed in an empty field.
     *
     * @default ''
     */
    placeholder?: string;

    /**
     * Defines the help text displayed below the field.
     *
     * @default ''
     */
    description?: string;

    /**
     * Defines the choices of a `DropDownList`, `MultiSelect` or `RadioButton` field.
     *
     * @default []
     */
    options?: WorkflowCustomFieldOption[];

    /**
     * Defines the validation rules of the field.
     *
     * @default {}
     */
    validation?: WorkflowCustomFieldValidation;

}

/**
 * Interface for a class WorkflowCustomStepDefinition
 */
export interface WorkflowCustomStepDefinitionModel {

    /**
     * Defines the stable identifier of the custom step. It must be unique within `custom` and is
     * stored in the `customStepId` of every step created from it.
     *
     * @default ''
     */
    id?: string;

    /**
     * Defines the name displayed in the step collection and used as the name of new steps.
     *
     * @default ''
     */
    name?: string;

    /**
     * Defines the description displayed as the tooltip of the step in the step collection.
     *
     * @default ''
     */
    description?: string;

    /**
     * Defines the icon CSS class displayed for the step.
     *
     * @default ''
     */
    iconCss?: string;

    /**
     * Defines the fields displayed in the property panel of the step.
     *
     * @default []
     */
    fields?: WorkflowCustomFieldDefinition[];

    /**
     * Defines the size of new steps. When not set, the default size is used.
     *
     * @default {}
     */
    size?: WorkflowSize;

    /**
     * Defines the appearance of new steps.
     *
     * @default {}
     */
    appearance?: WorkflowStepAppearance;

}