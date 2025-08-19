import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { DialogFieldType } from '../base/enum';
import { TreeGridModel } from '@syncfusion/ej2-treegrid';
import { GridModel } from '@syncfusion/ej2-grids';
import { RichTextEditorModel } from '@syncfusion/ej2-richtexteditor';
/**
 * Defines dialog fields of edit dialog.
 */
export class EditDialogFieldSettings extends ChildProperty<EditDialogFieldSettings> {
    /**
     * Specifies the types of tabs that contain editors for columns.
     * Available tab types:
     * * `General` - Represents the general information editor tab.
     * * `Dependency` - Represents the dependency editor tab.
     * * `Resources` - Represents the resource editor tab.
     * * `Notes` - Represents the notes editor tab.
     * * `Segments` - Represents the segments editor tab.
     * * `Custom` - Represents the custom column editor tab.
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
     * Specifies the edited column fields to be placed inside the tab.
     *
     * @default null
     */
    @Property([])
    public fields: string[];
    /**
     * Specifies the configuration properties for Grid, Rich Text Editor (RTE), or TreeGrid controls within the Gantt edit dialog.
     *
     * @default null
     */
    @Property({})
    public additionalParams: TreeGridModel | GridModel | RichTextEditorModel;
}
