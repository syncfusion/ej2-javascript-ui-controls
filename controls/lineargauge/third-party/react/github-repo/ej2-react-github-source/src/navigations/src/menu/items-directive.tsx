import { ComplexBase } from '@syncfusion/ej2-react-base';
import { MenuItemModel } from '@syncfusion/ej2-navigations';



export class MenuItemDirective extends ComplexBase<MenuItemModel & { children?: React.ReactNode }, MenuItemModel> {
    public static moduleName: string = 'menuItem';
}

export class MenuItemsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'items';
    public static moduleName: string = 'menuItems';
}
