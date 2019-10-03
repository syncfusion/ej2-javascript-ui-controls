import { Property, ChildProperty } from '@syncfusion/ej2-base';

export const toolbarItems: string[] = ['NewFolder', 'Upload', 'Cut', 'Copy', 'Paste', 'Delete', 'Download', 'Rename',
    'SortBy', 'Refresh', 'Selection', 'View', 'Details'];

/**
 * Specifies the Toolbar settings of the FileManager.
 */
export class ToolbarSettings extends ChildProperty<ToolbarSettings> {
    /**
     * An array of string or object that is used to configure the toolbar items.

     */
    @Property(toolbarItems)
    public items: string[];

    /**
     * Enables or disables the toolbar rendering in the file manager component.

     */
    @Property(true)
    public visible: boolean;
}
