import { Browser, KeyboardEventArgs, isNullOrUndefined, select, setStyleAttribute } from '@syncfusion/ej2-base';
import { getScrollableParent } from '@syncfusion/ej2-popups';
import * as events from '../base/constant';
import * as classes from '../base/classes';
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

    public showFullScreen(event?: MouseEvent | KeyboardEventArgs): void {
        this.scrollableParent = getScrollableParent(this.parent.element);
        if (!this.parent.element.classList.contains(classes.CLS_FULL_SCREEN)) {
            this.parent.trigger(events.actionBegin, { requestType: 'Maximize', targetItem: 'Maximize', args: event });
            if (this.parent.toolbarSettings.enableFloating && this.parent.toolbarSettings.enable) {
                (this.parent.getToolbarElement() as HTMLElement).style.width = '100%';
                (this.parent.getToolbarElement() as HTMLElement).style.top = '0px';
            }
            this.parent.element.classList.add(classes.CLS_FULL_SCREEN);
            this.toggleParentOverflow(true);
            this.parent.setContentHeight();
            if (this.parent.toolbarModule) {
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

    public hideFullScreen(event?: MouseEvent | KeyboardEventArgs): void {
        if (this.parent.element.classList.contains(classes.CLS_FULL_SCREEN)) {
            this.parent.element.classList.remove(classes.CLS_FULL_SCREEN);
            this.parent.trigger(events.actionBegin, { requestType: 'Minimize', targetItem: 'Minimize', args: event });
            this.toggleParentOverflow(false);
            this.parent.setContentHeight();
            if (this.parent.toolbarModule) {
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
        let overflow: string = (isAdd) ? 'hidden' : '';
        for (let i: number = 0; i < this.scrollableParent.length; i++) {
            if (this.scrollableParent[i].nodeName === '#document') {
                setStyleAttribute((<HTMLElement>select('body', this.scrollableParent[i])), {
                    overflow: overflow
                });
            } else {
                setStyleAttribute(this.scrollableParent[i], {
                    overflow: overflow
                });
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
        this.parent.on(events.keyDown, this.onKeyDown, this);
        this.parent.off(events.destroy, this.removeEventListener);
    }

    public destroy(): void {
        if (this.parent.element.classList.contains(classes.CLS_FULL_SCREEN)) {
            this.toggleParentOverflow(false);
        }
        this.removeEventListener();
    }
}