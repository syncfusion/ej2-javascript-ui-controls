import { Property, ChildProperty } from '@syncfusion/ej2-base';import { DialogFieldType } from '../base/type';

/**
 * Interface for a class DialogFields
 */
export interface DialogFieldsModel {

    /**
     * Defines the field text
     * @default null
     */
    text?: string;

    /**
     * Defines the field key
     * @default null
     */
    key?: string;

    /**
     * Defines the field type
     * @default null
     */
    type?: DialogFieldType;

    /**
     * Defines the validationRules for fields
     * @default {}
     */
    validationRules?: Object;

}