import { IRichTextEditor } from '../base/interface';
import * as events from '../base/constant';
import { ToolbarStatus } from '../../editor-manager/plugin/toolbar-status';
import { IToolbarStatus } from '../../common/interface';
import { getDefaultHtmlTbStatus } from '../../common/util';
import { IHtmlFormatterCallBack, IDropDownItemModel } from '../../common/interface';
/**
 * HtmlToolbarStatus module for refresh the toolbar status
 */
export class HtmlToolbarStatus {
    public parent: IRichTextEditor;
    public toolbarStatus: IToolbarStatus;
    private prevToolbarStatus: IToolbarStatus;
    private debounceTimer: number;
    private debounceDelay: number = 100;

    public constructor(parent: IRichTextEditor) {
        this.parent = parent;
        this.toolbarStatus = this.prevToolbarStatus = getDefaultHtmlTbStatus();
        this.debounceDelay = this.debounceDelay !== undefined ? this.debounceDelay : 100;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.on(events.toolbarRefresh, this.onRefreshHandler, this);
        this.parent.on(events.destroy, this.removeEventListener, this);
    }
    private removeEventListener(): void {
        this.toolbarStatus = null;
        this.prevToolbarStatus = null;
        this.debounceTimer = null;
        this.parent.off(events.toolbarRefresh, this.onRefreshHandler);
        this.parent.off(events.destroy, this.removeEventListener);
    }
    private onRefreshHandler(args: { [key: string]: Node | Object | IHtmlFormatterCallBack }): void {
        if (this.parent.readonly) {
            return;
        }
        // extract the 'event' property from args only if it exists and is an instance of Event
        const event: boolean = !!(args['args'] && (args['args'] as IHtmlFormatterCallBack).isKeyboardEvent);
        // If KeyboardEvent, debounce; else process immediately
        if (event && !(this.parent.element &&
            this.parent.element.dataset &&
            this.parent.element.dataset.rteUnitTesting === 'true')) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = window.setTimeout(() => {
                this.getToolbarStatus(args);
            }, this.debounceDelay);
        } else {
            clearTimeout(this.debounceTimer);
            this.getToolbarStatus(args);
        }
    }

    // method for getting toolbar status:
    private  getToolbarStatus(args: { [key: string]: Node | Object }): void {
        const fontsize: string[] = [];
        const fontName: string[] = [];
        const formats: string[] = [];
        this.parent.fontSize.items.forEach((item: IDropDownItemModel): void => {
            fontsize.push(item.value);
        });
        this.parent.fontFamily.items.forEach((item: IDropDownItemModel): void => {
            fontName.push(item.value);
        });
        this.parent.format.types.forEach((item: IDropDownItemModel): void => {
            formats.push(item.value.toLocaleLowerCase());
        });
        this.toolbarStatus = ToolbarStatus.get(
            this.parent.contentModule.getDocument(),
            this.parent.contentModule.getEditPanel(),
            formats,
            fontsize,
            fontName,
            args.documentNode as Node
        );
        const tbStatusString: string = JSON.stringify(this.toolbarStatus);
        this.parent.notify(events.toolbarUpdated, this.toolbarStatus);
        if (JSON.stringify(this.prevToolbarStatus) !== tbStatusString) {
            this.parent.notify(events.updateTbItemsStatus, { html: JSON.parse(tbStatusString), markdown: null });
            this.prevToolbarStatus = JSON.parse(tbStatusString);
        }
    }
}
