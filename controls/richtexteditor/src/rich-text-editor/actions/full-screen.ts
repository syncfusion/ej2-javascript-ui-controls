import { Browser, KeyboardEventArgs, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { getScrollableParent } from '@syncfusion/ej2-popups';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { addClass, removeClass } from '@syncfusion/ej2-base';
import { IRichTextEditor, NotifyArgs } from '../base/interface';

/**
 * `FullScreen` module is used to maximize and minimize screen
 */
export class FullScreen {
    protected parent: IRichTextEditor;
    private scrollableParent: HTMLElement[];

    public constructor(parent?: IRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * showFullScreen method
     *
     * @param {MouseEvent} event - specifies the mouse event
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public showFullScreen(event?: MouseEvent | KeyboardEventArgs): void {
        if (this.parent.toolbarSettings.enable === true && this.parent.editorMode !== 'Markdown'
            && !isNOU(this.parent.quickToolbarModule)) {
            this.parent.quickToolbarModule.hideQuickToolbars();
        }
        this.scrollableParent = getScrollableParent(this.parent.element);
        if (!this.parent.element.classList.contains(classes.CLS_FULL_SCREEN)) {
            const evenArgs: { [key: string]: Object } = {
                cancel: false,
                requestType: 'Maximize',
                targetItem: 'Maximize',
                args: event
            };
            this.parent.trigger(events.actionBegin, evenArgs, (beginEventArgs: { [key: string]: Object }) => {
                if (!beginEventArgs.cancel) {
                    if (this.parent.toolbarSettings.enableFloating &&
                        !this.parent.inlineMode.enable && this.parent.toolbarSettings.enable) {
                        (this.parent.getToolbarElement() as HTMLElement).style.width = '100%';
                        (this.parent.getToolbarElement() as HTMLElement).style.top = '0px';
                    }
                    this.parent.element.classList.add(classes.CLS_FULL_SCREEN);
                    this.toggleParentOverflow(true);
                    let isExpand: boolean = this.parent.element.querySelectorAll('.e-toolbar-extended.e-popup-open').length > 0 ? true: false;
                    this.parent.setContentHeight(null, isExpand);
                    if (this.parent.toolbarModule) {
                        if (!(this.parent.getBaseToolbarObject().toolbarObj.items[0] as { [key: string]: string }).properties) {
                            this.parent.getBaseToolbarObject().toolbarObj.removeItems(0);
                        }
                        if (Browser.isDevice) {
                            this.parent.toolbarModule.removeFixedTBarClass();
                        }
                        this.parent.toolbarModule.updateItem({
                            targetItem: 'Maximize',
                            updateItem: 'Minimize',
                            baseToolbar: this.parent.getBaseToolbarObject()
                        });
                    }
                    this.parent.refreshUI();
                    this.parent.trigger(events.actionComplete, { requestType: 'Maximize', targetItem: 'Maximize', args: event });
                }
            });
        }
    }

    /**
     * hideFullScreen method
     *
     * @param {MouseEvent} event - specifies the mouse event
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public hideFullScreen(event?: MouseEvent | KeyboardEventArgs): void {
        if (this.parent.toolbarSettings.enable === true && this.parent.editorMode !== 'Markdown'
            && !isNOU(this.parent.quickToolbarModule)) {
            this.parent.quickToolbarModule.hideQuickToolbars();
        }
        if (this.parent.element.classList.contains(classes.CLS_FULL_SCREEN)) {
            const evenArgs: { [key: string]: Object } = {
                cancel: false,
                requestType: 'Minimize',
                targetItem: 'Minimize',
                args: event
            };
            this.parent.trigger(events.actionBegin, evenArgs, (beginEventArgs: { [key: string]: Object }) => {
                if (!beginEventArgs.cancel) {
                    this.parent.element.classList.remove(classes.CLS_FULL_SCREEN);
                    const elem: NodeListOf<Element> = document.querySelectorAll('.e-rte-overflow');
                    for (let i: number = 0; i < elem.length; i++) {
                        removeClass([elem[i]], ['e-rte-overflow']);
                    }
                    let isExpand: boolean = this.parent.element.querySelectorAll('.e-toolbar-extended.e-popup-open').length > 0 ? true: false;
                    this.parent.setContentHeight(null, isExpand);
                    if (this.parent.toolbarModule) {
                        if (!(this.parent.getBaseToolbarObject().toolbarObj.items[0] as { [key: string]: string }).properties) {
                            this.parent.getBaseToolbarObject().toolbarObj.removeItems(0);
                        }
                        this.parent.toolbarModule.updateItem({
                            targetItem: 'Minimize',
                            updateItem: 'Maximize',
                            baseToolbar: this.parent.getBaseToolbarObject()
                        });
                        if (Browser.isDevice && this.parent.inlineMode.enable) {
                            this.parent.toolbarModule.addFixedTBarClass();
                        }
                    }
                    this.parent.trigger(events.actionComplete, { requestType: 'Minimize', targetItem: 'Minimize', args: event });
                }
            });
        }
    }

    // eslint-disable-next-line
    private toggleParentOverflow(isAdd: boolean): void {
        if (isNOU(this.scrollableParent)) {
            return;
        }
        for (let i: number = 0; i < this.scrollableParent.length; i++) {
            if (this.scrollableParent[i].nodeName === '#document') {
                const elem: HTMLElement = document.querySelector('body');
                addClass([elem], ['e-rte-overflow']);
            } else {
                const elem: HTMLElement = this.scrollableParent[i];
                addClass([elem], ['e-rte-overflow']);
            }
        }
    }

    private onKeyDown(event: NotifyArgs): void {
        const originalEvent: KeyboardEventArgs = event.args as KeyboardEventArgs;
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
        this.parent.on(events.moduleDestroy, this.moduleDestroy, this);
    }

    protected removeEventListener(): void {
        this.parent.off(events.keyDown, this.onKeyDown);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.moduleDestroy, this.moduleDestroy);
    }

    /**
     * destroy method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public destroy(): void {
        if (this.parent.element.classList.contains(classes.CLS_FULL_SCREEN)) {
            this.toggleParentOverflow(false);
        }
        const elem: NodeListOf<Element> = document.querySelectorAll('.e-rte-overflow');
        for (let i: number = 0; i < elem.length; i++) {
            removeClass([elem[i]], ['e-rte-overflow']);
        }
        this.removeEventListener();
    }

    private moduleDestroy(): void {
        this.parent = null;
    }
}
