import { EditorManager } from './../base/editor-manager';
import * as CONSTANT from './../base/constant';
import { ClearFormat } from './clearformat';
import { IHtmlSubCommands } from './../base/interface';
import { IHtmlKeyboardEvent } from './../../editor-manager/base/interface';
import { KeyboardEventArgs } from '../../../../base'; /*externalscript*/
import * as EVENTS from './../../common/constant';
/**
 * Clear Format EXEC internal component
 *
 * @hidden
 * @deprecated
 */
export class ClearFormatExec {
    private parent: EditorManager;
    /**
     * Constructor for creating the Formats plugin
     *
     * @param {EditorManager} parent - specifies the parent element.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public constructor(parent: EditorManager) {
        this.parent = parent;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(CONSTANT.CLEAR_TYPE, this.applyClear, this);
        this.parent.observer.on(EVENTS.KEY_DOWN_HANDLER, this.onKeyDown, this);
        this.parent.observer.on(EVENTS.INTERNAL_DESTROY, this.destroy, this);
    }
    private removeEventListener(): void {
        this.parent.observer.off(CONSTANT.CLEAR_TYPE, this.applyClear);
        this.parent.observer.off(EVENTS.KEY_DOWN_HANDLER, this.onKeyDown);
        this.parent.observer.off(EVENTS.INTERNAL_DESTROY, this.destroy);
    }
    private onKeyDown(e: IHtmlKeyboardEvent): void {
        switch ((e.event as KeyboardEventArgs).action) {
        case 'clear-format':
            this.applyClear({ subCommand: 'ClearFormat', callBack: e.callBack, enterAction: e.enterAction });
            e.event.preventDefault();
            break;
        }
    }
    private applyClear(e: IHtmlSubCommands): void {
        if (e.subCommand === 'ClearFormat') {
            ClearFormat.clear(this.parent.currentDocument, this.parent.editableElement, e.enterAction, e.selector, e.subCommand);
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

    public destroy(): void {
        this.removeEventListener();
    }
}
