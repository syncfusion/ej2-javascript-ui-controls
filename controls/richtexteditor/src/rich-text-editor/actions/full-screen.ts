import { Browser, KeyboardEventArgs, isNullOrUndefined } from '@syncfusion/ej2-base';
import { getScrollableParent } from '@syncfusion/ej2-popups';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { addClass, removeClass } from '@syncfusion/ej2-base';
import { IRichTextEditor, NotifyArgs } from '../base/interface';

/**
 * `FullScreen` module is used to maximize and minimize screen
 */
export class FullScreen {
    private overflowData: string[];
    protected parent: IRichTextEditor;
    private scrollableParent: HTMLElement[];

    constructor(parent?: IRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * showFullScreen method
     * @hidden
     * @deprecated
     */
    public showFullScreen(event?: MouseEvent | KeyboardEventArgs): void {
        if (this.parent.toolbarSettings.enable === true && this.parent.editorMode !== 'Markdown') {
            this.parent.quickToolbarModule.hideQuickToolbars();
        }
        this.scrollableParent = getScrollableParent(this.parent.element);
        if (!this.parent.element.classList.contains(classes.CLS_FULL_SCREEN)) {
            this.parent.trigger(events.actionBegin, { requestType: 'Maximize', targetItem: 'Maximize', args: event });
            if (this.parent.toolbarSettings.enableFloating &&
                !this.parent.inlineMode.enable && this.parent.toolbarSettings.enable) {
                (this.parent.getToolbarElement() as HTMLElement).style.width = '100%';
                (this.parent.getToolbarElement() as HTMLElement).style.top = '0px';
            }
            this.parent.element.classList.add(classes.CLS_FULL_SCREEN);
            this.toggleParentOverflow(true);
            this.parent.setContentHeight();
            if (this.parent.toolbarModule) {
                if (!(this.parent.getBaseToolbarObject().toolbarObj.items[0] as { [key: string]: string }).properties) {
                    this.parent.getBaseToolbarObject().toolbarObj.removeItems(0);
                }
                if (Browser.isDevice) { this.parent.toolbarModule.removeFixedTBarClass(); }
                this.parent.toolbarModule.updateItem({
                    targetItem: 'Maximize',
                    updateItem: 'Minimize',
                    baseToolbar: this.parent.getBaseToolbarObject()
                });
            }
            this.parent.trigger(events.actionComplete, { requestType: 'Maximize', targetItem: 'Maximize', args: event });
        }
    }

    /**
     * hideFullScreen method
     * @hidden
     * @deprecated
     */
    public hideFullScreen(event?: MouseEvent | KeyboardEventArgs): void {
        if (this.parent.toolbarSettings.enable === true && this.parent.editorMode !== 'Markdown') {
            this.parent.quickToolbarModule.hideQuickToolbars();
        }
        if (this.parent.element.classList.contains(classes.CLS_FULL_SCREEN)) {
            this.parent.element.classList.remove(classes.CLS_FULL_SCREEN);
            let elem: NodeListOf<Element> = document.querySelectorAll('.e-rte-overflow');
            for (let i: number = 0; i < elem.length; i++) {
                removeClass([elem[i]], ['e-rte-overflow']);
            }
            this.parent.trigger(events.actionBegin, { requestType: 'Minimize', targetItem: 'Minimize', args: event });
            this.parent.setContentHeight();
            if (this.parent.toolbarModule) {
                if (!(this.parent.getBaseToolbarObject().toolbarObj.items[0] as { [key: string]: string }).properties) {
                    this.parent.getBaseToolbarObject().toolbarObj.removeItems(0);
                }
                this.parent.toolbarModule.updateItem({
                    targetItem: 'Minimize',
                    updateItem: 'Maximize',
                    baseToolbar: this.parent.getBaseToolbarObject()
                });
                if (Browser.isDevice && this.parent.inlineMode.enable) { this.parent.toolbarModule.addFixedTBarClass(); }
            }
            this.parent.trigger(events.actionComplete, { requestType: 'Minimize', targetItem: 'Minimize', args: event });
        }
    }

    private toggleParentOverflow(isAdd: boolean): void {
        if (isNullOrUndefined(this.scrollableParent)) { return; }
        for (let i: number = 0; i < this.scrollableParent.length; i++) {
            if (this.scrollableParent[i].nodeName === '#document') {
                let elem: HTMLElement = document.querySelector('body');
                addClass([elem], ['e-rte-overflow']);
            } else {
                let elem: HTMLElement = this.scrollableParent[i];
                addClass([elem], ['e-rte-overflow']);
            }
        }
    }

    private onKeyDown(event: NotifyArgs): void {
        let originalEvent: KeyboardEventArgs = event.args as KeyboardEventArgs;
        switch (originalEvent.action) {
            case 'full-screen':
                this.showFullScreen(event.args as KeyboardEventArgs);
                originalEvent.preventDefault();
                break;
            case 'escape':
                this.hideFullScreen(event.args as KeyboardEventArgs);
                originalEvent.preventDefault();
                break;
        }
    }

    protected addEventListener(): void {
        this.parent.on(events.keyDown, this.onKeyDown, this);
        this.parent.on(events.destroy, this.destroy, this);
    }

    protected removeEventListener(): void {
        this.parent.off(events.keyDown, this.onKeyDown);
        this.parent.off(events.destroy, this.destroy);
    }

    /**
     * destroy method
     * @hidden
     * @deprecated
     */
    public destroy(): void {
        if (this.parent.element.classList.contains(classes.CLS_FULL_SCREEN)) {
            this.toggleParentOverflow(false);
        }
        let elem: NodeListOf<Element> = document.querySelectorAll('.e-rte-overflow');
        for (let i: number = 0; i < elem.length; i++) {
            removeClass([elem[i]], ['e-rte-overflow']);
        }
        this.removeEventListener();
    }
}