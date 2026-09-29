import { isNullOrUndefined } from '@syncfusion/ej2-base';

import {
    EditorAction,
    EditorCommandArguments,
    EditorCommandName,
    ColorCommand,
    FontSizeCommand,
    FontFamilyCommand
} from '../../controller/interface';
import { IEditorCoreOptions } from '../base/interface';
import * as events from '../constants';

interface InlineExecutionPayload {
    command: EditorCommandName;
    args: Object;
    callBack: Function
}

export class InlineFormats {
    public parent: IEditorCoreOptions;

    constructor(parent?: IEditorCoreOptions) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.observer.on(events.inlineExecution, this.applyInlineFormats, this);
        this.parent.observer.on(events.undoRedoExecution, this.applyUndoRedo, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off(events.inlineExecution, this.applyInlineFormats);
        this.parent.observer?.on(events.undoRedoExecution, this.applyUndoRedo);
    }

    private applyUndoRedo(args: InlineExecutionPayload): void {
        const action: EditorCommandName | EditorAction = args.command;
        switch (action) {
        case 'undo':
            this.parent.editor.commands.undo();
            break;
        case 'redo':
            this.parent.editor.commands.redo();
            break;
        }
    }

    private applyInlineFormats(args: InlineExecutionPayload): void {
        const action: EditorCommandName | EditorAction = args.command;
        switch (action) {
        case 'bold':
            this.parent.editor.commands.toggleBold();
            break;
        case 'italic':
            this.parent.editor.commands.toggleItalic();
            break;
        case 'underline':
            this.parent.editor.commands.toggleUnderline();
            break;
        case 'strikethrough':
            this.parent.editor.commands.toggleStrikethrough();
            break;
        case 'indent':
            this.parent.editor.commands.indent();
            break;
        case 'outdent':
            this.parent.editor.commands.outdent();
            break;
        case 'lowercase':
            this.parent.editor.commands.toLowerCase();
            break;
        case 'uppercase':
            this.parent.editor.commands.toUpperCase();
            break;
        case 'subscript':
            this.parent.editor.commands.toggleSubscript();
            break;
        case 'superscript':
            this.parent.editor.commands.toggleSuperscript();
            break;
        case 'fontColor':
            this.parent.editor.commands.setColor({color: (args.args as ColorCommand).color});
            break;
        case 'backgroundColor':
            this.parent.editor.commands.setHighlight( {color: (args.args as ColorCommand).color});
            break;
        case 'setFontSize':
            if (!(args.args as FontSizeCommand).size) {
                this.parent.editor.commands.unsetFontSize();
            } else {
                this.parent.editor.commands.setFontSize({ size: (args.args as FontSizeCommand).size });
            }
            break;
        case 'setFontFamily':
            if (!(args.args as FontFamilyCommand).family) {
                this.parent.editor.commands.unsetFontFamily();
            } else {
                this.parent.editor.commands.setFontFamily({ family: (args.args as FontFamilyCommand).family });
            }
            break;
        case 'inlineCode':
            this.parent.editor.commands.toggleCodeMark();
            break;
        case 'clearFormat':
            this.parent.editor.commands.clearFormatting();
            break;
        }
        if (args.callBack) { // Skip call back for public commands
            args.callBack({
                commmand: args.command
            });
        }
    }

    /**
     * Clean up inline formats plugin resources
     *
     * @returns {void}
     */
    private destroy(): void {
        this.removeEventListener();
    }

}
