import * as events from '../constant';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { ActionBeginEventArgs } from '../../src/common/interface';
import { isNullOrUndefined as isNOU } from '../../../base'; /*externalscript*/

/**
 * `ExecCommandCallBack` module is used to run the editor manager command
 */
export class ExecCommandCallBack {
    protected parent: SfRichTextEditor;

    constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.observer.on(events.execCommandCallBack, this.commandCallBack, this);
        this.parent.observer.on(events.destroy, this.removeEventListener, this);
    }
    private commandCallBack(args: ActionBeginEventArgs): void {
        const formatPainterCopy: boolean = !isNOU(args.requestType) && args.requestType === 'FormatPainter' && args.name === 'format-copy';
        if (args.requestType !== 'Undo' && args.requestType !== 'Redo' && !formatPainterCopy) {
            this.parent.formatter.saveData();
        }
        this.parent.observer.notify(events.toolbarRefresh, { args: args });
        this.parent.observer.notify(events.count, {});
    }
    private removeEventListener(): void {
        this.parent.observer.off(events.execCommandCallBack, this.commandCallBack);
        this.parent.observer.off(events.destroy, this.removeEventListener);
    }
}
