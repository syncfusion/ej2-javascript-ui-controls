import { attributes, getUniqueID, Collection, NotifyPropertyChanges, INotifyPropertyChanged, Property } from '@syncfusion/ej2-base';import { getZindexPartial } from '@syncfusion/ej2-popups';import { MenuBase, MenuItem } from '../common/menu-base';import { MenuItemModel } from './../common/menu-base-model';
import {MenuBaseModel} from "../common/menu-base-model";

/**
 * Interface for a class ContextMenu
 */
export interface ContextMenuModel extends MenuBaseModel{

    /**
     * Specifies target element selector in which the ContextMenu should be opened.
     * @default ''  
     */
    target?: string;

    /**
     * Specifies the filter selector for elements inside the target in that the context menu will be opened.
     * @default ''    
     */
    filter?: string;

    /**
     * Specifies menu items with its properties which will be rendered as ContextMenu.
     * @default []
     * @aspType object
     * @blazorType object
     */
    items?: MenuItemModel[];

}