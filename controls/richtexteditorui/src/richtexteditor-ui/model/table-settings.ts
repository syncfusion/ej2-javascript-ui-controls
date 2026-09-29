import { ChildProperty, Property } from '@syncfusion/ej2-base';

/**
 * Configures the table insertion behavior of the Rich Text Editor.
 */
export class TableSettings extends ChildProperty<TableSettings> {
    /**
     * Enables table resize drag handles when new tables are inserted into
     * the editor.
     *
     * @default true
     */
    @Property(true)
    public resize: boolean;
}
