import * as events from '../constant';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { IToolbarStatus } from '../../src/common/interface';
import { IDropDownItemModel } from '../../src/rich-text-editor/base/interface';
import { ToolbarStatus } from '../../src/editor-manager/plugin/toolbar-status';

/**
 * HtmlToolbarStatus module for refresh the toolbar status
 */
export class HtmlToolbarStatus {
    public parent: SfRichTextEditor;
    public toolbarStatus: IToolbarStatus;
    constructor(parent: SfRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(events.toolbarRefresh, this.onRefreshHandler, this);
        this.parent.observer.on(events.destroy, this.removeEventListener, this);
    }
    private removeEventListener(): void {
        this.parent.observer.off(events.toolbarRefresh, this.onRefreshHandler);
        this.parent.observer.off(events.destroy, this.removeEventListener);
    }
    private onRefreshHandler(args: { [key: string]: Node | Object }): void {
        if (this.parent.readonly) { return; }
        let fontsize: string[] = [];
        let fontName: string[] = [];
        let formats: string[] = [];
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
        this.parent.observer.notify(events.toolbarUpdated, this.toolbarStatus);
    }
}