import { Property, ChildProperty } from '@syncfusion/ej2-base';

export const fileItems: string[] = ['Open', '|', 'Delete', 'Download', 'Rename', '|', 'Details'];
export const folderItems: string[] = ['Open', '|', 'Delete', 'Rename', 'Download', '|', 'Details'];
export const layoutItems: string[] = ['SortBy', 'View', 'Refresh', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll'];

/**
 * Specifies the ContextMenu settings of the File Manager.
 */
export class ContextMenuSettings extends ChildProperty<ContextMenuSettings> {
    /**
     * Specifies the array of string or object that is used to configure file items.
     * @default fileItems
     */
    @Property(fileItems)
    public file: string[];

    /**
     * An array of string or object that is used to configure folder items.
     * @default folderItems
     */
    @Property(folderItems)
    public folder: string[];

    /**
     * An array of string or object that is used to configure layout items.
     * @default layoutItems
     */
    @Property(layoutItems)
    public layout: string[];

    /**
     * Enable or disable the ContextMenu.
     * @default true
     */
    @Property(true)
    public visible: boolean;
}
