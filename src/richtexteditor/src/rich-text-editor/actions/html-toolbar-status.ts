import { IRichTextEditor } from '../base/interface';
import * as events from '../base/constant';
import { ToolbarStatus } from '../../editor-manager/plugin/toolbar-status';
import { IToolbarStatus } from '../../common/interface';
import { IDropDownItemModel } from '../base/interface';
import { getDefaultHtmlTbStatus } from '../../common/util';
/**
 * HtmlToolbarStatus module for refresh the toolbar status
 */
export class HtmlToolbarStatus {
    public parent: IRichTextEditor;
    public toolbarStatus: IToolbarStatus;
    private prevToolbarStatus: IToolbarStatus;

    public constructor(parent: IRichTextEditor) {
        this.parent = parent;
        this.toolbarStatus = this.prevToolbarStatus = getDefaultHtmlTbStatus();
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.on(events.toolbarRefresh, this.onRefreshHandler, this);
        this.parent.on(events.destroy, this.removeEventListener, this);
    }
    private removeEventListener(): void {
        this.toolbarStatus = null;
        this.prevToolbarStatus = null;
        this.parent.off(events.toolbarRefresh, this.onRefreshHandler);
        this.parent.off(events.destroy, this.removeEventListener);
    }
    private onRefreshHandler(args: { [key: string]: Node | Object }): void {
        if (this.parent.readonly) {
            return;
        }
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
