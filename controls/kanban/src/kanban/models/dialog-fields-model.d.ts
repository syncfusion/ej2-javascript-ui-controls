import { Property, ChildProperty } from '@syncfusion/ej2-base';import { DialogFieldType } from '../base/type';

/**
 * Interface for a class DialogFields
 */
export interface DialogFieldsModel {

    /**
     * Defines the field text
     *
     * @default null
     */
    text?: string;

    /**
     * Defines the field key
     *
     * @default null
     */
    key?: string;

    /**
     * It defines the field type, which accepts either of the following values.
     * * TextBox
     * * DropDown
     * * Numeric
     * * TextArea
     *
     * @default null
     */
    type?: DialogFieldType;

    /**
     * Defines the validationRules for fields
     *
     * @default {}
     */
    validationRules?: Record<string, any>;

}