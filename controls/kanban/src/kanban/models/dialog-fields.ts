import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { DialogFieldType } from '../base/type';

/**  
 * Holds the configuration of editor fields.
 */
export class DialogFields extends ChildProperty<DialogFields>  {
    /**
     * Defines the field text
     * @default null
     */
    @Property()
    public text: string;

    /**
     * Defines the field key
     * @default null
     */
    @Property()
    public key: string;

    /**
     * It defines the field type, which accepts either of the following values.
     * * TextBox
     * * DropDown
     * * Numeric
     * * TextArea
     * @default null
     */
    @Property()
    public type: DialogFieldType;

    /**
     * Defines the validationRules for fields
     * @deprecated
     * @default {}
     */
    @Property()
    public validationRules: Object;

}
