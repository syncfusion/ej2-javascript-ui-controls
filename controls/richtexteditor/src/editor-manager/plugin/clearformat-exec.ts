import { EditorManager } from './../base/editor-manager';
import * as CONSTANT from './../base/constant';
import { ClearFormat } from './clearformat';
import { IHtmlSubCommands } from './../base/interface';
import { IHtmlKeyboardEvent } from './../../editor-manager/base/interface';
import { KeyboardEventArgs } from '@syncfusion/ej2-base';
import * as EVENTS from './../../common/constant';

/**
 * Clear Format EXEC internal component
 * @hidden
 */
export class ClearFormatExec {
    private parent: EditorManager;
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     */
    constructor(parent: EditorManager) {
        this.parent = parent;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(CONSTANT.CLEAR_TYPE, this.applyClear, this);
        this.parent.observer.on(EVENTS.KEY_DOWN_HANDLER, this.onKeyDown, this);
    }
    private onKeyDown(e: IHtmlKeyboardEvent): void {
        switch ((e.event as KeyboardEventArgs).action) {
            case 'clear-format':
                this.applyClear({ subCommand: 'ClearFormat', callBack: e.callBack });
                e.event.preventDefault();
                break;
        }
    }
    private applyClear(e: IHtmlSubCommands): void {
        if (e.subCommand === 'ClearFormat') {
            ClearFormat.clear(this.parent.currentDocument, this.parent.editableElement);
            if (e.callBack) {
                e.callBack({
                    requestType: e.subCommand,
                    event: e.event,
                    editorMode: 'HTML',
                    range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                    elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[]
                });
            }
        }
    }
}