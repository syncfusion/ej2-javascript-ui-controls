import { Property, ChildProperty } from '@syncfusion/ej2-base';import { DialogFieldType } from '../base/enum';import { TreeGridModel } from '@syncfusion/ej2-treegrid';import { GridModel } from '@syncfusion/ej2-grids';import { RichTextEditorModel } from '@syncfusion/ej2-richtexteditor';

/**
 * Interface for a class EditDialogFieldSettings
 */
export interface EditDialogFieldSettingsModel {

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
    type?: DialogFieldType;

    /**
     * Defines header text of tab item.
     *
     * @default null
     */
    headerText?: string;

    /**
     * Defines edited column fields placed inside the tab.
     *
     * @default null
     */
    fields?: string[];

    /**
     * Defines the properties of Grid or RTE or TreeGrid controls in Gantt edit dialog.
     *
     * @default null
     */
    additionalParams?: TreeGridModel | GridModel | RichTextEditorModel;

}