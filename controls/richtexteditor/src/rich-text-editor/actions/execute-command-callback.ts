import * as events from '../base/constant';
import { isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { IRichTextEditor } from '../base/interface';
import { IHtmlFormatterCallBack } from '../../common/interface';
/**
 * `ExecCommandCallBack` module is used to run the editor manager command
 */
export class ExecCommandCallBack {
    protected parent: IRichTextEditor;
    public constructor(parent?: IRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.on(events.execCommandCallBack, this.commandCallBack, this);
        this.parent.on(events.destroy, this.removeEventListener, this);
    }

    private commandCallBack(args: IHtmlFormatterCallBack): void {
        const formatPainterCopy: boolean = !isNOU(args.requestType) && args.requestType === 'FormatPainter' && args.action === 'format-copy';
        if (!isNOU(args) && !isNOU(args.requestType) && args.requestType !== 'Undo' && args.requestType !== 'Redo' && !formatPainterCopy) {
            this.parent.formatter.saveData();
        }
        this.parent.notify(events.toolbarRefresh, { args: args });
        this.parent.notify(events.count, {});
    }

    private removeEventListener(): void {
        this.parent.off(events.execCommandCallBack, this.commandCallBack);
        this.parent.off(events.destroy, this.removeEventListener);
    }
}
