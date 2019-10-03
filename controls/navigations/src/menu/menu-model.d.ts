import { attributes, NotifyPropertyChanges, INotifyPropertyChanged, Property } from '@syncfusion/ej2-base';import { Browser, Complex, getUniqueID } from '@syncfusion/ej2-base';import { MenuBase, FieldSettings } from '../common/menu-base';import { MenuItemModel, FieldSettingsModel } from '../common/menu-base-model';
import {Orientation} from "./menu";
import {MenuBaseModel} from "../common/menu-base-model";

/**
 * Interface for a class Menu
 */
export interface MenuModel extends MenuBaseModel{

    /**
     * Specified the orientation of Menu whether it can be horizontal or vertical.

     */
    orientation?: Orientation;

    /**
     * Specifies target element to open/close Menu while click in Hamburger mode.

     */
    target?: string;

    /**
     * Specifies the template for Menu item.

     */
    template?: string;

    /**
     * Specifies whether to enable / disable the scrollable option in Menu.

     */
    enableScrolling?: boolean;

    /**
     * Specifies whether to enable / disable the hamburger mode in Menu.

     */
    hamburgerMode?: boolean;

    /**
     * Specifies the title text for hamburger mode in Menu.

     */
    title?: string;

    /**
     * Specifies mapping fields from the dataSource.

     * children: "items" }
     */
    fields?: FieldSettingsModel;

}