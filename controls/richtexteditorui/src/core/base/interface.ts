import { Observer } from '@syncfusion/ej2-base';
import { DocumentRoot, HeadlessEditor , ExtensionDefinition } from '@syncfusion/ej2-headless-editor';
import { ValueFormat } from '../../richtexteditor-ui/interface';

export interface IEditorCoreOptions {
    hostElement?: HTMLElement;
    placeholder?: string;
    value?: string;
    content?: string | null;
    valueFormat?: ValueFormat;
    enableRtl?: boolean
    enableAutoFormat?: boolean
    enableTabKeyIndent?: boolean
    undoRedoSteps?: number
    undoRedoTimer?: number
    extensions?: ExtensionDefinition<Object>[]
    documentRoot?: DocumentRoot | null
    executeCommand?: Function
    observer? : Observer
    editor?: HeadlessEditor
    readonly?: boolean
}

export interface UpdateEventArgs{
    content?: string
}

/**
 * Toolbar entrypoint for the Table insertion feature. Defined here so
 * callers (e.g. `EditorController.process`) can talk to the optional
 * `tableModule` field on `RichTextEditorUI` without reaching into
 * editor-level classes.
 */
export interface ITableModule {
    onTableClick(anchor: HTMLElement): void;
}
