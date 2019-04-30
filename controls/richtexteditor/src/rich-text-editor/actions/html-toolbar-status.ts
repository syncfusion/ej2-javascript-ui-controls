import { IRichTextEditor } from '../base/interface';
import * as events from '../base/constant';
import { ToolbarStatus } from '../../editor-manager/plugin/toolbar-status';
import { IToolbarStatus } from '../../common/interface';
import { IDropDownItemModel } from '../base/interface';
/**
 * HtmlToolbarStatus module for refresh the toolbar status
 */
export class HtmlToolbarStatus {
    public parent: IRichTextEditor;
    public toolbarStatus: IToolbarStatus;
    constructor(parent: IRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.on(events.toolbarRefresh, this.onRefreshHandler, this);
        this.parent.on(events.destroy, this.removeEventListener, this);
    }
    private removeEventListener(): void {
        this.parent.off(events.toolbarRefresh, this.onRefreshHandler);
    }
    private onRefreshHandler(args: { [key: string]: Node | Object }): void {
        let fontsize: string[] = [];
        let fontName: string[] = [];
        let formats: string[] = [];
        this.parent.fontSize.items.forEach((item: IDropDownItemModel): void => { fontsize.push(item.value); });
        this.parent.fontFamily.items.forEach((item: IDropDownItemModel): void => { fontName.push(item.value); });
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
        this.parent.notify(events.toolbarUpdated, this.toolbarStatus);
    }
}