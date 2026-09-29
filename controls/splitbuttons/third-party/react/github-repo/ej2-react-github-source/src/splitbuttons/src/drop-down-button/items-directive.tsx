import { ComplexBase } from '@syncfusion/ej2-react-base';
import { ItemModel } from '@syncfusion/ej2-splitbuttons';



export class DropDownButtonItemDirective extends ComplexBase<ItemModel & { children?: React.ReactNode }, ItemModel> {
    public static moduleName: string = 'dropDownButtonItem';
}

export class DropDownButtonItemsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'items';
    public static moduleName: string = 'dropDownButtonItems';
}
