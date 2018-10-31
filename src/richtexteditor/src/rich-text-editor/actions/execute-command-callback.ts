import * as events from '../base/constant';
import { IRichTextEditor, ActionBeginEventArgs } from '../base/interface';
/**
 * `ExecCommandCallBack` module is used to run the editor manager command
 */
export class ExecCommandCallBack {
    protected parent: IRichTextEditor;
    constructor(parent?: IRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.on(events.execCommandCallBack, this.commandCallBack, this);
        this.parent.on(events.destroy, this.removeEventListener, this);
    }

    private commandCallBack(args: ActionBeginEventArgs): void {
        if (args.requestType !== 'Undo' && args.requestType !== 'Redo') {
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