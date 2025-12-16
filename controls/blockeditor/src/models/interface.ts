import { ItemModel } from '@syncfusion/ej2-navigations';
import { CommandName } from './enums';

/**
 * Represents the configuration of inline toolbar items.
 */
export interface IToolbarItemModel extends ItemModel {
    command: CommandName;
    iconCss?: string;
}
