import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class FieldOptions
 */
export interface FieldOptionsModel {

    /**
     * Denotes the field name to be mapped from the dataSource for every event fields.
     *
     * @default null
     */
    name?: string;

    /**
     * Assigns the specific default value to the fields, when no values are provided to those fields from dataSource.
     *
     * @default null
     */
    default?: string;

    /**
     * Assigns the label values to be displayed for the event editor fields.
     *
     * @default null
     */
    title?: string;

    /**
     * Defines the validation rules to be applied on the event fields within the event editor.
     * {% codeBlock src="schedule/validation-api/index.ts" %}{% endcodeBlock %}
     *
     * @default {}
     */
    validation?: Record<string, any>;

}