import * as events from '../constant';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { IToolbarStatus } from '../../src/common/interface';
import { getDefaultHtmlTbStatus } from '../../src/common/util';
import { IDropDownItemModel } from '../../src/common/interface';
import { ToolbarStatus } from '../../src/editor-manager/plugin/toolbar-status';
import { IHtmlFormatterCallBack} from '../../src/common/interface';


/**
 * HtmlToolbarStatus module for refresh the toolbar status
 */
export class HtmlToolbarStatus {
    public parent: SfRichTextEditor;
    public toolbarStatus: IToolbarStatus;
    private prevToolbarStatus: IToolbarStatus;
    private debounceTimer: number;

    constructor(parent: SfRichTextEditor) {
        this.parent = parent;
        this.toolbarStatus = this.prevToolbarStatus = getDefaultHtmlTbStatus();
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(events.toolbarRefresh, this.onRefreshHandler, this);
        this.parent.observer.on(events.destroy, this.removeEventListener, this);
    }
    private removeEventListener(): void {
        this.parent.observer.off(events.toolbarRefresh, this.onRefreshHandler);
        this.parent.observer.off(events.destroy, this.removeEventListener);
        this.debounceTimer = null;
    }
    private onRefreshHandler(args: { [key: string]: Node | Object| IHtmlFormatterCallBack}): void {
        if (this.parent.readonly) { return; }
        // extract the 'event' property from args only if it exists and is an instance of Event
        const event: boolean = !!(args['args'] && (args['args'] as IHtmlFormatterCallBack).isKeyboardEvent);
        // If KeyboardEvent, debounce; else process immediately
        if (event) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = window.setTimeout(() => {
                this.getToolbarStatus(args);
            }, 100);
        } else {
            clearTimeout(this.debounceTimer);
            this.getToolbarStatus(args);
        }
    }
    // getting toolbar status
    private getToolbarStatus(args: { [key: string]: Node | Object }): void {
        if (this.parent.readonly) { return; }
        const fontsize: string[] = [];
        const fontName: string[] = [];
        const formats: string[] = [];
        this.parent.fontSize.items.forEach((item: IDropDownItemModel): void => { fontsize.push(item.value); });
        this.parent.fontFamily.items.forEach((item: IDropDownItemModel): void => { fontName.push(item.value); });
        this.parent.format.items.forEach((item: IDropDownItemModel): void => {
            formats.push(item.value.toLocaleLowerCase());
        });
        this.toolbarStatus = ToolbarStatus.get(
            this.parent.getDocument(),
            this.parent.getEditPanel(),
            formats,
            fontsize,
            fontName,
            args.documentNode as Node
        );
        const tbStatusString: string = JSON.stringify(this.toolbarStatus);
        this.parent.observer.notify(events.toolbarUpdated, this.toolbarStatus);
        if (JSON.stringify(this.prevToolbarStatus) !== tbStatusString) {
            this.parent.observer.notify(events.updateTbItemsStatus, { html: JSON.parse(tbStatusString), markdown: null });
            this.prevToolbarStatus = JSON.parse(tbStatusString);
        }
    }
}
