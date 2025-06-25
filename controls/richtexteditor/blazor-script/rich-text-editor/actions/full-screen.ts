import { isNullOrUndefined } from '../../../base'; /*externalscript*/
import { getScrollableParent } from '../../../popups/src'; /*externalscript*/
import * as events from '../constant';
import { KeyboardEventArgs } from '../actions/keyboard';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { addClass, removeClass } from '../../../base'; /*externalscript*/
import { CLS_FULL_SCREEN, CLS_RTE_OVERFLOW } from '../classes';
import { NotifyArgs } from '../../src/common/interface';
import { ActionBeginEventArgs } from '../../src/common/interface';


/**
 * `FullScreen` module is used to maximize and minimize screen
 */
export class FullScreen {
    private parent: SfRichTextEditor;
    private scrollableParent: HTMLElement[];

    constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }
    public showFullScreen(event?: MouseEvent | KeyboardEventArgs): void {
        if (this.parent.toolbarSettings.enable === true && this.parent.editorMode !== 'Markdown') {
            this.parent.quickToolbarModule.hideQuickToolbars();
        }
        this.scrollableParent = getScrollableParent(this.parent.element);
        if (this.parent.actionBeginEnabled) {
            (this.parent.dotNetRef.invokeMethodAsync(
                events.actionBeginEvent, { requestType: 'Maximize', cancel: false }) as unknown as Promise<ActionBeginEventArgs>).then((fullScreenArgs: ActionBeginEventArgs) => {
                if (!fullScreenArgs.cancel) {
                    this.showActionBeginCallback();
                }
            });
        } else { this.showActionBeginCallback(); }
        setTimeout(() => {
            this.parent.inputElement.focus();
        }, 100);
    }
    private showActionBeginCallback(): void {
        this.toggleParentOverflow(true);
        this.invokeActionComplete('Maximize');
    }
    public hideFullScreen(event?: MouseEvent | KeyboardEventArgs): void {
        if (this.parent.toolbarSettings.enable === true && this.parent.editorMode !== 'Markdown') {
            this.parent.quickToolbarModule.hideQuickToolbars();
        }
        const elem: NodeListOf<Element> = document.querySelectorAll('.' + CLS_RTE_OVERFLOW);
        for (let i: number = 0; i < elem.length; i++) {
            removeClass([elem[i as number]], [CLS_RTE_OVERFLOW]);
        }
        if (this.parent.actionBeginEnabled) {
            (this.parent.dotNetRef.invokeMethodAsync(
                events.actionBeginEvent, { requestType: 'Minimize', cancel: false }) as unknown as Promise<ActionBeginEventArgs>).then((fullScreenArgs: ActionBeginEventArgs) => {
                if (!fullScreenArgs.cancel) { this.hideActionBeginCallback(); }
            });
        } else { this.hideActionBeginCallback(); }
        setTimeout(() => {
            this.parent.inputElement.focus();
        }, 100);
    }
    private hideActionBeginCallback(): void {
        this.invokeActionComplete('Minimize');
    }
    private invokeActionComplete(type: string): void {
        if (this.parent.actionCompleteEnabled) {
            this.parent.dotNetRef.invokeMethodAsync(events.actionCompleteEvent, { requestType: type });
        }
    }
    private toggleParentOverflow(isAdd: boolean): void {
        if (isNullOrUndefined(this.scrollableParent)) { return; }
        for (let i: number = 0; i < this.scrollableParent.length; i++) {
            if (this.scrollableParent[i as number].nodeName === '#document') {
                const elem: HTMLElement = document.querySelector('body');
                addClass([elem], [CLS_RTE_OVERFLOW]);
            } else {
                const elem: HTMLElement = this.scrollableParent[i as number];
                addClass([elem], [CLS_RTE_OVERFLOW]);
            }
        }
    }
    private onKeyDown(event: NotifyArgs): void {
        const originalEvent: KeyboardEventArgs = event.args as KeyboardEventArgs;
        switch (originalEvent.action) {
        case 'full-screen':
            this.parent.dotNetRef.invokeMethodAsync(events.showFullScreenClient);
            this.showFullScreen(event.args as KeyboardEventArgs);
            originalEvent.preventDefault();
            break;
        case 'escape':
            this.parent.dotNetRef.invokeMethodAsync(events.hideFullScreenClient);
            this.hideFullScreen(event.args as KeyboardEventArgs);
            originalEvent.preventDefault();
            break;
        }
    }
    protected addEventListener(): void {
        this.parent.observer.on(events.enableFullScreen, this.showFullScreen, this);
        this.parent.observer.on(events.disableFullScreen, this.hideFullScreen, this);
        this.parent.observer.on(events.keyDown, this.onKeyDown, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
    }
    protected removeEventListener(): void {
        this.parent.observer.off(events.enableFullScreen, this.showFullScreen);
        this.parent.observer.off(events.disableFullScreen, this.hideFullScreen);
        this.parent.observer.off(events.keyDown, this.onKeyDown);
        this.parent.observer.off(events.destroy, this.destroy);
    }
    public destroy(): void {
        if (this.parent.element.classList.contains(CLS_FULL_SCREEN)) {
            this.toggleParentOverflow(false);
        }
        const elem: NodeListOf<Element> = document.querySelectorAll('.' + CLS_RTE_OVERFLOW);
        for (let i: number = 0; i < elem.length; i++) {
            removeClass([elem[i as number]], [CLS_RTE_OVERFLOW]);
        }
        this.removeEventListener();
    }
}
