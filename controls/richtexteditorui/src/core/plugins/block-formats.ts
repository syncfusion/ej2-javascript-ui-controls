import { ToggleCollapsiblePayload } from '@syncfusion/ej2-headless-editor/src/extensions/collapsible';
import { CalloutCommand, CodeBlockCommand, EditorAction, EditorCommandName } from '../../controller/interface';
import { EditorCore } from '../base';
import * as events from '../constants';

interface BlockExecutionPayload {
    command: EditorCommandName;
    args: Object;
    callBack: Function
}

export class BlockFormats {
    public parent: EditorCore;

    constructor(parent?: EditorCore) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.observer.on(events.blockExecution, this.applyBlockFormats, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off(events.blockExecution, this.applyBlockFormats);
    }

    private applyBlockFormats(args: BlockExecutionPayload): void {
        const action: EditorCommandName | EditorAction = args.command;
        // this.parent.focusEditorView();
        // eslint-disable-next-line @typescript-eslint/tslint/config
        // const selection = this.parent.saveSelection();
        switch (action) {
        case 'heading1':
            this.parent.editor.commands.setHeading({ level: 1 });
            break;
        case 'heading2':
            this.parent.editor.commands.setHeading({ level: 2 });
            break;
        case 'heading3':
            this.parent.editor.commands.setHeading({ level: 3 });
            break;
        case 'heading4':
            this.parent.editor.commands.setHeading({ level: 4 });
            break;
        case 'paragraph':
            this.parent.editor.commands.setParagraph();
            break;
        case 'blockQuote':
            this.parent.editor.commands.toggleBlockQuote();
            break;
        case 'collapsible':
            this.parent.editor.commands.toggleCollapsible(args.args as ToggleCollapsiblePayload);
            break;
        case 'codeBlock':
            this.parent.editor.commands.setCodeBlock( {language: (args.args as CodeBlockCommand).language});
            break;
        case 'horizontalRule':
            this.parent.editor.commands.setHorizontalRule();
            break;
        case 'callout':
            this.parent.editor.commands.toggleCallout( {
                variant: typeof args.args === 'string' ? args.args
                    : (args.args as CalloutCommand).callout } );
            break;
        }
        // this.parent.restoreSelection(selection);
    }

    /**
     * Clean up block formats plugin resources
     *
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListener();
    }

}
