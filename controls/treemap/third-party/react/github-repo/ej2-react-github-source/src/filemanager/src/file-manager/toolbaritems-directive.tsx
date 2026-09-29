import { ComplexBase } from '@syncfusion/ej2-react-base';
import { ToolbarItemModel } from '@syncfusion/ej2-filemanager';

export interface ToolbarItemDirTypecast {
    template?: string | Function | any;
    largeIconsTemplate?: string | Function | any;
    navigationPaneTemplate?: string | Function | any;
}

export class ToolbarItemDirective extends ComplexBase<ToolbarItemModel| ToolbarItemDirTypecast & { children?: React.ReactNode }, ToolbarItemModel| ToolbarItemDirTypecast> {
    public static moduleName: string = 'toolbarItem';
}

export class ToolbarItemsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'toolbarItems';
    public static moduleName: string = 'toolbarItems';
}
