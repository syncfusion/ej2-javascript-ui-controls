import { attributes, NotifyPropertyChanges, INotifyPropertyChanged, Property } from '@syncfusion/ej2-base';import { Browser, Complex } from '@syncfusion/ej2-base';import { MenuBase, FieldSettings } from '../common/menu-base';import { MenuItemModel, FieldSettingsModel } from '../common/menu-base-model';
import {Orientation} from "./menu";
import {MenuBaseModel} from "../common/menu-base-model";

/**
 * Interface for a class Menu
 */
export interface MenuModel extends MenuBaseModel{

    /**
     * Specified the orientation of Menu whether it can be horizontal or vertical.
     * @default 'Horizontal'
     */
    orientation?: Orientation;

    /**
     * Specifies the template for Menu item.
     * @default null
     */
    template?: string;

    /**
     * Specifies whether to enable / disable the scrollable option in Menu.
     * @default false
     */
    enableScrolling?: boolean;

    /**
     * Specifies mapping fields from the dataSource.
     * @default { itemId: "id", text: "text", parentId: "parentId", iconCss: "iconCss", url: "url", separator: "separator",
     * children: "items" }
     */
    fields?: FieldSettingsModel;

}