import { ClipBoardCleanupAction } from '../../editor-manager/plugin/clipboard-cleanup-action';
import { IRichTextEditor } from '../base';
import * as events from '../base/constant';
import { isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { ClipboardWriteEventArgs } from '../../common/interface';
import { NotifyArgs } from '../../common/interface';
import { sanitizeHelper } from '../base/util';

/**
 * ClipBoardCleanup module called when copy or cut event is triggered in RichTextEditor
 */
export class ClipBoardCleanup {
    private parent: IRichTextEditor;
    private clipBoardCleanupObj: ClipBoardCleanupAction;
    private isDestroyed: boolean;

    public constructor(parent?: IRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
        this.isDestroyed = false;
    }

    private addEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.on(events.clipBoardCleanup, this.clipBoardCleanup, this);
            this.parent.on(events.bindOnEnd, this.bindOnEnd, this);
            this.parent.on(events.destroy, this.destroy, this);
        }
    }

    private destroy(): void {
        if (this.isDestroyed) { return; }
        this.removeEventListener();
        this.isDestroyed = true;
    }

    private removeEventListener(): void {
        this.parent.off(events.clipBoardCleanup, this.clipBoardCleanup);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.bindOnEnd, this.bindOnEnd);
    }

    private bindOnEnd(): void {
        if (this.parent.editorMode === 'HTML' && this.parent.formatter && this.parent.formatter.editorManager
            && this.parent.contentModule) {
            this.clipBoardCleanupObj =
                new ClipBoardCleanupAction(this.parent.formatter.editorManager);
        }
    }

    /* Handles the copy and cut cleanup operation when copy or cut event is triggered in editor */
    private clipBoardCleanup(e?: NotifyArgs): void {
        if (!isNOU((e.args as ClipboardEvent))) {
            const range: Range = this.parent.getRange();
            const editableElement: Element = this.parent.contentModule.getEditPanel();
            const operation: string = (e.args as ClipboardEvent).type;
            const clipboardDataArgs: ClipboardWriteEventArgs =
                this.clipBoardCleanupObj.handleClipboardProcessing(range, editableElement, operation);
            this.parent.trigger(events.beforeClipboardWrite, clipboardDataArgs, (clipboardWriteArgs: ClipboardWriteEventArgs) => {
                const htmlText: string = sanitizeHelper(clipboardWriteArgs.htmlContent, this.parent);
                const plainText: string = sanitizeHelper(clipboardWriteArgs.plainTextContent, this.parent);
                (e.args as ClipboardEvent).clipboardData.setData('text/html', htmlText);
                (e.args as ClipboardEvent).clipboardData.setData('text/plain', plainText);
            });
        }
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {void}
     * @hidden
     */
    private getModuleName(): string {
        return 'clipBoardCleanup';
    }
}
