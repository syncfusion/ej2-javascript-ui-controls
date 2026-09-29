import { ComplexBase } from '@syncfusion/ej2-react-base';
import { ItemModel } from '@syncfusion/ej2-splitbuttons';



export class SplitButtonItemDirective extends ComplexBase<ItemModel & { children?: React.ReactNode }, ItemModel> {
    public static moduleName: string = 'splitButtonItem';
}

export class SplitButtonItemsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'items';
    public static moduleName: string = 'splitButtonItems';
}
