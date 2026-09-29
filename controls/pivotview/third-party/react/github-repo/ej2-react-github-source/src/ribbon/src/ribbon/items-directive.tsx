import { ComplexBase } from '@syncfusion/ej2-react-base';
import { RibbonItemModel } from '@syncfusion/ej2-ribbon';

export interface RibbonItemDirTypecast {
    itemTemplate?: string | Function | any;
}

export class RibbonItemDirective extends ComplexBase<RibbonItemModel| RibbonItemDirTypecast & { children?: React.ReactNode }, RibbonItemModel| RibbonItemDirTypecast> {
    public static moduleName: string = 'ribbonItem';
}

export class RibbonItemsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'items';
    public static moduleName: string = 'ribbonItems';
}
