import { ChildProperty, Collection, Complex, Property } from '@syncfusion/ej2-base';
import { WorkflowCustomFieldType } from './workflow-enums';
import { WorkflowSize } from './workflow-size';
import { WorkflowStepAppearance } from './workflow-appearance';
import { WorkflowCustomFieldOptionModel, WorkflowCustomFieldValidationModel, WorkflowCustomFieldDefinitionModel } from './workflow-custom-step-model';

/**
 * Defines the validation rules of a custom step field. Only the rules that apply to the field type are used.
 */
export class WorkflowCustomFieldValidation extends ChildProperty<WorkflowCustomFieldValidation> {
    /**
     * Defines the minimum number of characters of a text value.
     *
     * @default null
     */
    @Property(null)
    public minLength: number;

    /**
     * Defines the maximum number of characters of a text value.
     *
     * @default null
     */
    @Property(null)
    public maxLength: number;

    /**
     * Defines the minimum value of a numeric field.
     *
     * @default null
     */
    @Property(null)
    public min: number;

    /**
     * Defines the maximum value of a numeric field.
     *
     * @default null
     */
    @Property(null)
    public max: number;

    /**
     * Defines a regular expression that a text value must match.
     *
     * @default ''
     */
    @Property('')
    public pattern: string;
}

/**
 * Defines one choice of a custom step field such as a drop-down list, multi-select or radio button.
 */
export class WorkflowCustomFieldOption extends ChildProperty<WorkflowCustomFieldOption> {
    /**
     * Defines the text displayed for the option.
     *
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Defines the value stored when the option is chosen.
     *
     * @default ''
     */
    @Property('')
    public value: string | number | boolean;
}

/**
 * Defines one field in the property panel of a custom step.
 */
export class WorkflowCustomFieldDefinition extends ChildProperty<WorkflowCustomFieldDefinition> {
    /**
     * Defines the name under which the value is stored in the step's `props`. It must be unique within
     * the custom step. Nested keys are not supported.
     *
     * @default ''
     */
    @Property('')
    public key: string;

    /**
     * Defines the caption displayed for the field.
     *
     * @default ''
     */
    @Property('')
    public label: string;

    /**
     * Defines the input displayed for the field.
     *
     * @default 'TextBox'
     */
    @Property('TextBox')
    public type: WorkflowCustomFieldType;

    /**
     * Defines the initial value of the field in a new step. The value is copied for every new step.
     *
     * @default null
     */
    @Property(null)
    public defaultValue: Object;

    /**
     * Defines whether the field must have a value.
     *
     * @default false
     */
    @Property(false)
    public required: boolean;

    /**
     * Defines whether the field is disabled.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Defines whether the field can be read but not changed.
     *
     * @default false
     */
    @Property(false)
    public readOnly: boolean;

    /**
     * Defines the hint displayed in an empty field.
     *
     * @default ''
     */
    @Property('')
    public placeholder: string;

    /**
     * Defines the help text displayed below the field.
     *
     * @default ''
     */
    @Property('')
    public description: string;

    /**
     * Defines the choices of a `DropDownList`, `MultiSelect` or `RadioButton` field.
     *
     * @default []
     */
    @Collection<WorkflowCustomFieldOptionModel>([], WorkflowCustomFieldOption)
    public options: WorkflowCustomFieldOption[];

    /**
     * Defines the validation rules of the field.
     *
     * @default {}
     */
    @Complex<WorkflowCustomFieldValidationModel>({}, WorkflowCustomFieldValidation)
    public validation: WorkflowCustomFieldValidation;
}

/**
 * Defines a reusable custom step that appears in the Custom category of the step collection.
 */
export class WorkflowCustomStepDefinition extends ChildProperty<WorkflowCustomStepDefinition> {
    /**
     * Defines the stable identifier of the custom step. It must be unique within `custom` and is
     * stored in the `customStepId` of every step created from it.
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Defines the name displayed in the step collection and used as the name of new steps.
     *
     * @default ''
     */
    @Property('')
    public name: string;

    /**
     * Defines the description displayed as the tooltip of the step in the step collection.
     *
     * @default ''
     */
    @Property('')
    public description: string;

    /**
     * Defines the icon CSS class displayed for the step.
     *
     * @default ''
     */
    @Property('')
    public iconCss: string;

    /**
     * Defines the fields displayed in the property panel of the step.
     *
     * @default []
     */
    @Collection<WorkflowCustomFieldDefinitionModel>([], WorkflowCustomFieldDefinition)
    public fields: WorkflowCustomFieldDefinition[];

    /**
     * Defines the size of new steps. When not set, the default size is used.
     *
     * @default {}
     */
    @Property({})
    public size: WorkflowSize;

    /**
     * Defines the appearance of new steps.
     *
     * @default {}
     */
    @Property({})
    public appearance: WorkflowStepAppearance;
}
