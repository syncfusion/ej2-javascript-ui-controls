import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { DialogFieldType } from '../base/enum';
/**
 * Defines dialog fields of edit dialog.
 */
export class EditDialogFieldSettings extends ChildProperty<EditDialogFieldSettings> {
    /**
     * Defines types of tab which contains editor for columns.
     * * `General` - Defines tab container type as general.
     * * `Dependency` - Defines tab as dependency editor.
     * * `Resources` - Defines tab as resources editor.
     * * `Notes` - Defines tab as notes editor.
     * * `Custom` - Defines tab as custom column editor.
     *
     * @default null
     */
    @Property(null)
    public type: DialogFieldType;
    /**
     * Defines header text of tab item.
     *
     * @default null
     */
    @Property(null)
    public headerText: string;
    /**
     * Defines edited column fields placed inside the tab.
     *
     * @default null
     */
    @Property([])
    public fields: string[];
}
