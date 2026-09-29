import { ChildProperty, Property } from '@syncfusion/ej2-base';import { BulletListType, NumberListType } from '../../controller/interface';
import {NumberFormatList,NumberFormatListItem,BulletFormatList,BulletFormatListItem} from "./list-settings";

/**
 * Interface for a class ListSettings
 */
export interface ListSettingsModel {

    /**
     * Defines the items displayed in the `NumberFormatList` dropdown.
     *
     * @default NumberFormatLists
     */
    numberFormatListItems?: NumberFormatListItem[];

    /**
     * Defines the items displayed in the `BulletFormatList` dropdown.
     *
     * @default BulletFormatLists
     */
    bulletFormatListItems?: BulletFormatListItem[];

}