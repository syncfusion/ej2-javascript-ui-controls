import { ItemModel } from '@syncfusion/ej2-navigations';
import { BlockType, CommandName } from './enums';

/**
 * Represents the configuration of inline toolbar items.
 */
export interface IToolbarItemModel extends ItemModel {
    command: CommandName;
    iconCss?: string;
}

/**
 * Represents the configuration of transform blocks
 */
export interface TransformItemModel {
    type: BlockType;
    id: string;
    disabled?: boolean;
    iconCss: string;
    label: string;
    shortcut: string;
    tooltip: string;
}
