import { EmojiIconsSet, IRichTextEditor, NotifyArgs } from '../base/interface';
import * as events from '../base/constant';
import { detach, addClass, isNullOrUndefined as isNOU, KeyboardEventArgs, removeClass, closest, createElement, EventHandler, L10n, getComponent } from '@syncfusion/ej2-base';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { Popup } from '@syncfusion/ej2-popups';
import { ClickEventArgs, Toolbar } from '@syncfusion/ej2-navigations';
import { ItemModel } from '@syncfusion/ej2-navigations/src/toolbar/toolbar-model';
import { TextBox } from '@syncfusion/ej2-inputs';
import { NodeSelection } from '../../selection';
import { isSafari } from '../../common/util';

export class EmojiPicker {
    protected parent: IRichTextEditor;
    protected locator: ServiceLocator;
    protected renderFactory: RendererFactory;
    public popupObj: Popup;
    private popDiv: HTMLElement;
    private save: NodeSelection;
    private clickEvent: ClickEventArgs;
    private divElement: HTMLElement;
    private i10n: L10n;
    private isDestroyed: boolean;
    public isPopupDestroyed: boolean;
    public noResultsFoundCount: number = 0;


    public constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.locator = serviceLocator;
        this.i10n = serviceLocator.getService<L10n>('rteLocale');
        this.renderFactory = this.locator.getService<RendererFactory>('rendererFactory');
        this.addEventListener();
        this.isDestroyed = false;
        this.isPopupDestroyed = false;
    }

    /**
     * Destroys the Count.
     *
     * @function destroy
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public destroy(): void {
        if (this.isDestroyed) { return; }
        this.removeEventListener();
        this.isDestroyed = true;
    }

    public childDestroy(): void {
        if (this.isPopupDestroyed) { return; }
        if (this.popupObj && !this.popupObj.isDestroyed) {
            if (this.popupObj.element && this.popupObj.element.querySelector('.e-rte-emoji-search') ) {
                const textBox: TextBox = getComponent(this.popupObj.element.querySelector('.e-rte-emoji-search') as HTMLElement, 'textbox') as TextBox;
                if (textBox && !textBox.isDestroyed) {
                    textBox.destroy();
                }
            }
            if (this.popupObj.element && this.popupObj.element.querySelector('.e-rte-emojipicker-toolbar')) {
                const toolbar: Toolbar = getComponent(this.popupObj.element.querySelector('.e-rte-emojipicker-toolbar') as HTMLElement, 'toolbar') as Toolbar;
                if (toolbar && !toolbar.isDestroyed) {
                    toolbar.destroy();
                }
            }
            const closeIcon: HTMLElement = this.popupObj.element.querySelector('.e-clear-icon');
            if (!isNOU(closeIcon)) {
                EventHandler.remove(closeIcon, 'mousedown', this.searchFilter);
            }
            this.popupObj.destroy();
            this.isPopupDestroyed = true;
        }
        if (this.popDiv) {
            EventHandler.remove(this.popDiv, 'keydown', this.onKeyDown);
            EventHandler.remove(this.popDiv, 'keyup', this.searchFilter);
            if (this.popDiv.querySelector('.e-rte-emojipicker-btn')) {
                const btn: HTMLElement = this.popDiv.querySelector('.e-rte-emojipicker-btn');
                EventHandler.remove(btn, 'scroll', this.scrollEvent);
                EventHandler.remove(btn, 'click', this.emojiBtnClick);
            }
        }
    }

    protected addEventListener(): void {
        this.parent.on(events.emojiPicker, this.toolbarClick, this);
        this.parent.on(events.docClick, this.docClick, this);
        this.parent.on(events.iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.on(events.keyDown, this.onkeyPress, this);
        this.parent.on(events.keyUp, this.onkeyUp, this);
        this.parent.on(events.contentscroll, this.contentscroll, this);
        this.parent.on(events.scroll, this.contentscroll, this);
        this.parent.on(events.destroy, this.destroy, this);
    }

    // eslint-disable-next-line
    private toolbarClick(args: NotifyArgs | any): void {
        this.noResultsFoundCount = 0;
        let spanElement : HTMLElement;
        if (!isNOU(this.parent.element.querySelector('.e-emoji'))){
            spanElement = this.parent.element.querySelector('.e-emoji');
        } else if (this.parent.inlineMode.enable) {
            spanElement = this.parent.element.ownerDocument.querySelector('.e-emoji');
        }
        this.divElement = spanElement.closest('div');
        if (!(this.parent.inputElement.contains(this.parent.formatter.editorManager.nodeSelection.
            getRange(this.parent.contentModule.getDocument()).startContainer))) {
            (this.parent.contentModule.getEditPanel() as HTMLElement).focus();
        }
        const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
        this.save = this.parent.formatter.editorManager.nodeSelection.save(
            range, this.parent.contentModule.getDocument());
        this.clickEvent = (args as NotifyArgs).args as ClickEventArgs;
        const emojiPicker: EmojiIconsSet[] = this.parent.emojiPickerSettings.iconsSet;
        if (this.popupObj) {
            removeClass([this.divElement], 'e-active');
            if (this.popupObj.element.querySelector('.e-rte-emoji-search') || !this.parent.emojiPickerSettings.showSearchBox) {
                this.popupObj.hide();
                return;
            }
            this.popupObj.hide();
        }
        this.popDiv = this.parent.createElement('div', { className: 'e-rte-emojipicker-popup', id: this.parent.getID() + '_emojiPicker' });
        if (!isNOU(this.parent.getToolbar()) && !this.parent.inlineMode.enable){
            this.parent.getToolbar().parentElement.appendChild(this.popDiv);
        } else if (this.parent.inlineMode.enable) {
            this.parent.rootContainer.appendChild(this.popDiv);
        }
        EventHandler.add(this.popDiv, 'keydown', this.onKeyDown, this);
        EventHandler.add(this.popDiv, 'keyup', this.searchFilter, this);
        const extendEle: HTMLElement = this.parent.element.querySelector('.e-toolbar-extended');
        let zIndex: string;
        if (!isNOU(extendEle)) {
            const computedStyle: CSSStyleDeclaration = window.getComputedStyle(extendEle);
            zIndex = computedStyle.getPropertyValue('z-index');
        }
        else{
            zIndex = '10001';
        }
        let target: HTMLElement;
        let xValue: string | number;
        let yValue: string | number;
        if (!isNOU((args as NotifyArgs).args as ClickEventArgs) && !this.parent.inlineMode.enable &&
         isNOU(this.parent.quickToolbarSettings.text)) {
            target = (((args as NotifyArgs).args as ClickEventArgs).originalEvent.target as HTMLElement);
            target = target.classList.contains('e-toolbar-item') ? target.firstChild as HTMLElement : target.parentElement;
            xValue = 'left';
            yValue = 'bottom';
        }
        else if (isNOU(args.x) && isNOU(args.y) && !this.parent.inlineMode.enable && isNOU(this.parent.quickToolbarSettings.text)) {
            target = this.parent.inputElement;
            if (this.parent.contentModule.getDocument().getSelection().rangeCount > 0) {
                const coordinates: { [key: string]: number } = this.getCoordinates();
                xValue = coordinates.left;
                yValue = coordinates.top;
            }
        } else if (isNOU(args.x) && isNOU(args.y) && (this.parent.inlineMode.enable || !isNOU(this.parent.quickToolbarSettings.text))) {
            this.parent.notify(events.hidePopup, {});
            if (this.parent.contentModule.getDocument().getSelection().rangeCount > 0) {
                const coordinates: { [key: string]: number } = this.getCoordinates();
                xValue = coordinates.left;
                yValue = coordinates.top;
            }
        } else {
            target = this.parent.inputElement;
            xValue = args.x;
            yValue = args.y;
        }
        this.popupObj = new Popup(this.popDiv, {
            targetType: 'relative',
            relateTo: target,
            collision: { X: 'fit', Y: 'none' },
            offsetY: 8,
            viewPortElement: this.parent.element,
            position: { X: xValue, Y: yValue },
            enableRtl: this.parent.enableRtl,
            zIndex: parseInt(zIndex, 10) + 1,
            actionOnScroll: 'hide',
            close: () => {
                this.parent.isBlur = false;
                this.childDestroy();
                detach(this.popupObj.element);
                this.popupObj = null;
                const activeElement: HTMLElement = this.divElement.firstChild as HTMLElement;
                activeElement.focus();
            }
        });
        this.isPopupDestroyed = false;
        addClass([this.popupObj.element], 'e-popup-open');
        this.popupObj.refreshPosition(target);
        // header search element
        if ((!isNOU((args as NotifyArgs).args as ClickEventArgs) || (isNOU(args.x) && isNOU(args.y))) &&
            this.parent.emojiPickerSettings.showSearchBox) {
            const inputEle: HTMLElement = createElement('input', { id: 'e-rte-emoji-search', className: 'e-rte-emoji-search' });
            this.popDiv.append(inputEle);
            const inputobj: TextBox = new TextBox({
                placeholder: this.i10n.getConstant('emojiPickerTypeToFind'),
                showClearButton: true
            });
            inputobj.appendTo(inputEle);
            inputEle.focus();
        }
        const closeIcon: HTMLElement = this.popupObj.element.querySelector('.e-clear-icon');
        if (!isNOU(closeIcon)) {
            EventHandler.add(closeIcon, 'mousedown', this.searchFilter, this);
        }
        // Header emoji toolbar div
        const emojiToolBar: HTMLElement = this.parent.createElement('div', { className: 'e-rte-emojipicker-toolbar' });
        this.popDiv.appendChild(emojiToolBar);
        const pushToolBar: ItemModel[] = [];
        for (let i: number = 0; i < this.parent.emojiPickerSettings.iconsSet.length; i++) {
            if (!isNOU(this.parent.emojiPickerSettings.iconsSet[i as number].iconCss)) {
                pushToolBar.push({ prefixIcon: this.parent.emojiPickerSettings.iconsSet[i as number].iconCss, htmlAttributes: { ['title']: this.parent.emojiPickerSettings.iconsSet[i as number].name } });
            }
            else {
                pushToolBar.push({ text: '&#x' + this.parent.emojiPickerSettings.iconsSet[i as number].code + ';', htmlAttributes: { ['title']: this.parent.emojiPickerSettings.iconsSet[i as number].name } });
            }
        }
        const toolbarObj: Toolbar = new Toolbar({
            items: pushToolBar,
            clicked: this.emojiToolbarClick.bind(this)
        });
        toolbarObj.appendTo(emojiToolBar);
        // emoji btn div
        const emojiBtnDiv: HTMLElement = this.parent.createElement('div', { className: 'e-rte-emojipicker-btn' });
        this.popDiv.appendChild(emojiBtnDiv);
        let height: string;
        const popupBorder: CSSStyleDeclaration = window.getComputedStyle(this.popDiv);
        if ((isNOU((args as NotifyArgs).args as ClickEventArgs) && !(isNOU(args.x) && isNOU(args.y))) ||
            !this.parent.emojiPickerSettings.showSearchBox) {
            height = (this.popDiv.getBoundingClientRect().height - emojiToolBar.getBoundingClientRect().height - (2 * parseFloat(popupBorder.borderWidth))) + 'px';
            emojiBtnDiv.style.setProperty('height', height, 'important');
        }
        else {
            const inputELe: HTMLElement = this.parent.element.querySelector('.e-rte-emoji-search').parentElement;
            const getComputedStyle: CSSStyleDeclaration = window.getComputedStyle(inputELe);
            height = (this.popDiv.getBoundingClientRect().height - emojiToolBar.getBoundingClientRect().height
                - inputELe.getBoundingClientRect().height
                - parseFloat(getComputedStyle.marginTop) - parseFloat(getComputedStyle.marginBottom)
                - (2 * parseFloat(popupBorder.borderWidth))) + 'px';
            emojiBtnDiv.style.setProperty('height', height, 'important');
        }
        for (let i: number = 0; i < emojiPicker.length; i++) {
            const emojiGroupDiv: HTMLElement = this.parent.createElement('div', { className: 'e-rte-emojipicker-group' });
            emojiBtnDiv.appendChild(emojiGroupDiv);
            const emojiName: HTMLElement = this.parent.createElement('div', { className: 'e-rte-emojipicker-name' });
            emojiName.innerText = this.parent.emojiPickerSettings.iconsSet[i as number].name;
            emojiName.setAttribute('aria-label', this.parent.emojiPickerSettings.iconsSet[i as number].name);
            emojiGroupDiv.appendChild(emojiName);
            const emojiBtn: HTMLElement = this.parent.createElement('div', { className: 'e-rte-emojipickerbtn-group' });
            emojiGroupDiv.appendChild(emojiBtn);
            for (let j: number = 0; j < emojiPicker[i as number].icons.length; j++) {
                const button: HTMLElement = this.parent.createElement('button', { className: 'e-btn ' + ' ' + 'e-control' });
                button.innerHTML = this.buttoncode(this.parent.emojiPickerSettings.iconsSet[i as number].icons[j as number].code);
                button.setAttribute('aria-label', (this.parent.emojiPickerSettings.iconsSet[i as number].icons[j as number].desc));
                button.setAttribute('title', (this.parent.emojiPickerSettings.iconsSet[i as number].icons[j as number].desc));
                emojiBtn.appendChild(button);
                if (button.innerHTML.length > 2) {
                    button.style.fontSize = '17px';
                }
            }
        }
        EventHandler.add(emojiBtnDiv, 'scroll', this.scrollEvent, this);
        EventHandler.add(emojiBtnDiv, 'click', this.emojiBtnClick, this);
        const emojiButtons: NodeListOf<HTMLButtonElement> = this.parent.element.querySelectorAll('.e-rte-emojipicker-btn button');
        if (isNOU(this.parent.element.querySelector('.e-rte-emoji-search')) && !isNOU((args as NotifyArgs).args as ClickEventArgs)) {
            emojiButtons[0].focus();
            addClass([emojiButtons[0]], 'e-focus');
        }
        const popup: HTMLElement = this.parent.element.querySelector('.e-rte-emojipicker-btn');
        const toolbarName: NodeListOf<HTMLElement> = this.parent.element.querySelectorAll('.e-rte-emojipicker-toolbar button');
        let scrollTop: number;
        if (!isNOU(popup)) {
            scrollTop = Math.round(popup.scrollTop);
        }
        if (scrollTop < toolbarName[0].offsetHeight) {
            addClass([toolbarName[0]], 'e-selected');
        }
        if (this.popupObj){
            addClass([this.divElement], 'e-active');
        }
    }
    private onIframeMouseDown(e: { [key: string]: object }): void {
        if (this.popupObj) {
            removeClass([this.divElement], 'e-active');
            this.popupObj.hide();
        }
    }
    private buttoncode(value: string): string {
        const valueLength: string[] = value.split('-');
        // eslint-disable-next-line
        const joinedEmoji: string = valueLength.map(cp => String.fromCodePoint(parseInt(cp, 16))).join('\u200D');
        return joinedEmoji;
    }
    private docClick(e: { [key: string]: object }): void {
        const target: HTMLElement = <HTMLElement>(e.args as MouseEvent).target;
        if (target && target.classList && ((this.popupObj && !closest(target, '[id=' + '\'' + this.popupObj.element.id + '\'' + ']')))
            && (!target.classList.contains('e-emoji') && !target.classList.contains('e-toolbar-item'))) {
            if (this.popupObj) {
                removeClass([this.divElement], 'e-active');
                this.popupObj.hide();
            }
        }
    }

    private scrollEvent(): void {
        const popup: HTMLElement = this.parent.element.querySelector('.e-rte-emojipicker-btn');
        const emojiSet: NodeListOf<HTMLElement> = this.parent.element.querySelectorAll('.e-rte-emojipicker-group');
        const toolbarName: NodeListOf<HTMLElement> = this.parent.element.querySelectorAll('.e-rte-emojipicker-toolbar button');
        let scrollTop: number;
        if (!isNOU(popup)) {
            scrollTop = Math.round(popup.scrollTop);
        }
        let firstSetWidth: number = 0;
        for (let j: number = 0; j < toolbarName.length; j++) {
            if (scrollTop < toolbarName[0].offsetHeight) {
                if (!isNOU(toolbarName[j + 1])) {
                    removeClass([toolbarName[j + 1]], 'e-selected');
                }
                addClass([toolbarName[0]], 'e-selected');
            }
        }
        for (let i: number = 0; i < emojiSet.length; i++) {
            firstSetWidth += Math.round(emojiSet[i as number].offsetHeight);
            if (scrollTop >= firstSetWidth) {
                for (let k: number = 0; k < toolbarName.length; k++) {
                    if (toolbarName[k as number].classList.contains('e-selected')) {
                        removeClass([toolbarName[k as number]], 'e-selected');
                    }
                    /* eslint-enable */
                }
                if (!isNOU(toolbarName[i + 1])) {
                    addClass([toolbarName[i + 1]], 'e-selected');
                }
            }
        }
    }

    private contentscroll(): void {
        if (isNOU(this.clickEvent) && this.popupObj) {
            removeClass([this.divElement], 'e-active');
            this.popupObj.hide();
            return;
        }
    }
    private emojiToolbarClick(e: ClickEventArgs): void {
        const args: NotifyArgs = {
            // eslint-disable-next-line
            text: e.item.htmlAttributes.title,
        };
        const currentEleName: string = args.text;
        const emojiGroups: NodeListOf<Element> = this.parent.element.querySelectorAll('.e-rte-emojipicker-group');
        const emojiButtons: NodeListOf<HTMLButtonElement> = this.parent.element.querySelectorAll('.e-rte-emojipicker-btn button');
        const toolbarName: NodeListOf<HTMLElement> = this.parent.element.querySelectorAll('.e-rte-emojipicker-toolbar button');
        for (let i: number = 0; i < toolbarName.length; i++) {
            if (toolbarName[i as number].classList.contains('e-selected')) {
                removeClass([toolbarName[i as number]], 'e-selected');
            }
            /* eslint-enable */
        }
        for (let i: number = 0; i < emojiButtons.length; i++) {
            if (emojiButtons[i as number].classList.contains('e-focus')) {
                removeClass([emojiButtons[i as number]], 'e-focus');
            }
        }
        // Loop through the selected elements and perform the same operation on each element
        const emojiGroupsheight: HTMLElement = this.parent.element.querySelector('.e-rte-emojipicker-btn');
        let emojiHeight: number = 0;
        // eslint-disable-next-line
        emojiGroups.forEach(group => {
            const childNodes: HTMLElement = group.childNodes[0] as HTMLElement | null;
            const focusBtn: HTMLElement = group.childNodes[1].childNodes[0] as HTMLElement | null;
            const ariaLabel: string = childNodes.getAttribute('aria-label');
            if (currentEleName === ariaLabel) {
                if (childNodes) {
                    emojiGroupsheight.scrollTop = emojiHeight + 10;
                    addClass([focusBtn], 'e-focus');
                    focusBtn.focus();
                }
            }
            else {
                emojiHeight += group.scrollHeight;
                removeClass([focusBtn], 'e-focus');
            }
        });
    }

    private onKeyDown(e: KeyboardEvent): void {
        // Select all emoji buttons
        const emojiButtons: NodeListOf<HTMLButtonElement> = this.parent.element.querySelectorAll('.e-rte-emojipicker-btn button');
        const emojiGroups: NodeListOf<Element> = this.parent.element.querySelectorAll('.e-rte-emojipickerbtn-group');
        const searchKeyHandler: HTMLElement = this.parent.element.querySelector('.e-rte-emojisearch-btn button');
        if (e.keyCode === 27) {
            if (this.popupObj) {
                removeClass([this.divElement], 'e-active');
                this.popupObj.hide();
            }
        }
        if (e.keyCode === 13) {
            const activeEle: HTMLElement = document.activeElement as HTMLElement;
            if (activeEle.classList.contains('e-btn')) {
                this.emojiBtnClick(e);
                e.preventDefault();
            }
        }
        const srcElement: HTMLElement = e.srcElement as HTMLElement;
        if (!isNOU(srcElement)) {
            if (srcElement.classList.contains('e-rte-emoji-search') && e.keyCode === 40) {
                for (let i: number = 0; i < emojiButtons.length; i++) {
                    if (emojiButtons[i as number].classList.contains('e-focus')) {
                        removeClass([emojiButtons[i as number]], 'e-focus');
                    }
                }
            }
        }
        if (!isNOU(searchKeyHandler)) {
            this.filterKeyHandler(e);
        }
        else {
            for (let i: number = 0; i < emojiButtons.length; i++) {
                let focusIndex: number = i;
                if (emojiButtons[i as number].classList.contains('e-focus')) {
                    if (e.keyCode === 40) {
                        // Move focus to next row if there is one
                        if (emojiButtons.length - 4 > i) {
                            let count: number = 0;
                            for (let j: number = 0; j < emojiGroups.length; j++) {
                                for (let k: number = 0; k < emojiGroups[j as number].childNodes.length; k++) {
                                    // eslint-disable-next-line
                                    const childNodes: any = emojiGroups[j as number].childNodes[k as number] as HTMLElement;
                                    if (childNodes.classList.contains('e-focus') && count !== 1) {
                                        const currentIndex: number = k;
                                        const lastChild: HTMLElement = emojiGroups[j as number].lastChild as HTMLElement;
                                        const lastRowIndex: number = Math.floor((k) % 6);
                                        const lastEleLength: number = emojiGroups[j as number].childNodes.length - 1;
                                        const lastEleIndex: number = Math.floor((lastEleLength) % 6);
                                        if (currentIndex !== -1) {
                                            const nextRowIndex: number = currentIndex + 6;
                                            if (!isNOU(emojiGroups[j as number].childNodes[nextRowIndex as number])) {
                                                // next row has six buttons
                                                // handle focus change here
                                                const firstFocusEle: HTMLElement = emojiButtons[i as number] as HTMLElement | null;
                                                removeClass([firstFocusEle], 'e-focus');
                                                const focusEle: HTMLElement = emojiButtons[focusIndex += 6] as HTMLElement | null;
                                                addClass([focusEle], 'e-focus');
                                                focusEle.focus();
                                                break;
                                            }
                                            else if (isNOU(emojiGroups[j as number].childNodes[nextRowIndex as number]) && !lastChild.classList.contains('e-focus') && lastEleIndex < lastRowIndex) {
                                                const firstFocusEle: HTMLElement = emojiButtons[i as number] as HTMLElement | null;
                                                removeClass([firstFocusEle], 'e-focus');
                                                const focusEle: HTMLElement = emojiGroups[j as number].lastChild as HTMLElement | null;
                                                addClass([focusEle], 'e-focus');
                                                focusEle.focus();
                                                count = 1;
                                                break;
                                            }
                                            else {
                                                const firstFocusEle: HTMLElement = emojiButtons[i as number] as HTMLElement | null;
                                                removeClass([firstFocusEle], 'e-focus');
                                                const focusEle: HTMLElement = emojiGroups[j as number + 1]
                                                    .childNodes[lastRowIndex as number] as HTMLElement | null;
                                                addClass([focusEle], 'e-focus');
                                                focusEle.focus();
                                                count = 1;
                                                break;
                                            }

                                        }
                                    }
                                }
                            }
                            break;
                        }
                    } else if (e.keyCode === 38) {
                        // Move focus to previous row if there is one
                        if (i >= 6) {
                            let count: number = 0;
                            for (let j: number = 0; j < emojiGroups.length; j++) {
                                for (let k: number = 0; k < emojiGroups[j as number].childNodes.length; k++) {
                                    const childNodes: HTMLElement = emojiGroups[j as number].childNodes[k as number] as HTMLElement;
                                    if (childNodes.classList.contains('e-focus') && count !== 1) {
                                        // eslint-disable-next-line
                                        const currentIndex: any = k;
                                        const previousRowLength: number = isNOU(emojiGroups[j - 1]) ? null :
                                            emojiGroups[j - 1].childNodes.length % 6 || 6;
                                        if (currentIndex !== -1) {
                                            const previousRowIndex: number = currentIndex - 6;
                                            if (!isNOU(emojiGroups[j as number].childNodes[previousRowIndex as number])) {
                                                // previous row has six buttons
                                                // handle focus change here
                                                const firstFocusEle: HTMLElement = emojiButtons[i as number] as HTMLElement | null;
                                                removeClass([firstFocusEle], 'e-focus');
                                                const focusEle: HTMLElement = emojiButtons[focusIndex -= 6] as HTMLElement | null;
                                                addClass([focusEle], 'e-focus');
                                                focusEle.focus();
                                                break;
                                            } else if (isNOU(emojiGroups[j - 1].childNodes[emojiGroups[j - 1]
                                                .childNodes.length - (previousRowLength - k)])) {
                                                const firstFocusEle: HTMLElement = emojiButtons[i as number] as HTMLElement | null;
                                                removeClass([firstFocusEle], 'e-focus');
                                                const focusEle: HTMLElement = emojiGroups[j - 1].lastChild as HTMLElement | null;
                                                addClass([focusEle], 'e-focus');
                                                focusEle.focus();
                                                count = 1;
                                                break;
                                            }
                                            else {
                                                // previous row has less than six buttons
                                                // handle focus change here
                                                const firstFocusEle: HTMLElement = emojiButtons[i as number] as HTMLElement | null;
                                                removeClass([firstFocusEle], 'e-focus');
                                                const focusEle: HTMLElement = emojiGroups[j - 1].childNodes[emojiGroups[j - 1].
                                                    childNodes.length - (previousRowLength - k)] as HTMLElement | null;
                                                addClass([focusEle], 'e-focus');
                                                focusEle.focus();
                                                count = 1;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            const firstFocusEle: HTMLElement = emojiButtons[i as number] as HTMLElement | null;
                            removeClass([firstFocusEle], 'e-focus');
                            const focusEle: HTMLElement = emojiButtons[focusIndex -= 1] as HTMLElement | null;
                            const inputELe: HTMLElement = this.popupObj.element.querySelector('.e-rte-emoji-search');
                            if (isNOU(focusEle) && !isNOU(inputELe)) {
                                inputELe.focus();
                                break;
                            }
                            addClass([focusEle], 'e-focus');
                            focusEle.focus();
                        }
                        break;
                    } else if (e.keyCode === 39) {
                        // Move focus to next button in current row
                        if (emojiButtons.length !== i + 1) {
                            const firstFocusEle: HTMLElement = emojiButtons[i as number] as HTMLElement | null;
                            removeClass([firstFocusEle], 'e-focus');
                            const focusEle: HTMLElement = emojiButtons[focusIndex += 1] as HTMLElement | null;
                            addClass([focusEle], 'e-focus');
                            emojiButtons[focusIndex as number].focus();
                        }
                        break;
                    } else if (e.keyCode === 37) {
                        // Move focus to previous button in current row
                        if (i > 0) {
                            const firstFocusEle: HTMLElement = emojiButtons[i as number] as HTMLElement | null;
                            removeClass([firstFocusEle], 'e-focus');
                            const focusEle: HTMLElement = emojiButtons[focusIndex -= 1] as HTMLElement | null;
                            addClass([focusEle], 'e-focus');
                            emojiButtons[focusIndex as number].focus();
                        }
                        break;
                    }
                }
            }
        }
        if (e.keyCode === 40) {
            const firstFocusEle: HTMLElement = this.parent.element.querySelector('.e-focus');
            if (isNOU(firstFocusEle)) {
                const focusEle: HTMLElement = emojiButtons[0] as HTMLElement | null;
                addClass([focusEle], 'e-focus');
                if (isSafari()) {
                    this.parent.notify(events.selectionSave, {});
                }
                emojiButtons[0].focus();
            }
        }
    }

    private filterKeyHandler(e?: KeyboardEvent): void {
        const emojiButtons: NodeListOf<HTMLButtonElement> = this.parent.element.querySelectorAll('.e-rte-emojisearch-btn button');
        const firstFocusEle: HTMLElement = this.parent.element.querySelector('.e-focus');
        if (isNOU(firstFocusEle) && e.keyCode === 40) {
            const focusEle: HTMLElement = emojiButtons[0] as HTMLElement | null;
            addClass([focusEle], 'e-focus');
            if (isSafari()) {
                this.parent.notify(events.selectionSave, {});
            }
            emojiButtons[0].focus();
        } else {
            for (let i: number = 0; i < emojiButtons.length; i++) {
                let focusIndex: number = i;
                const childNodes: HTMLElement = emojiButtons[i as number] as HTMLElement;
                if (childNodes.classList.contains('e-focus')) {
                    if (e.keyCode === 38) {
                        if (i >= 6) {
                            const firstFocusEle: HTMLElement = emojiButtons[i as number] as HTMLElement | null;
                            removeClass([firstFocusEle], 'e-focus');
                            const focusEle: HTMLElement = emojiButtons[focusIndex -= 6] as HTMLElement | null;
                            addClass([focusEle], 'e-focus');
                            focusEle.focus();
                            break;
                        }
                        else{
                            const firstFocusEle: HTMLElement = emojiButtons[i as number] as HTMLElement | null;
                            removeClass([firstFocusEle], 'e-focus');
                            const focusEle: HTMLElement = emojiButtons[focusIndex -= 1] as HTMLElement | null;
                            const inputELe: HTMLElement = this.popupObj.element.querySelector('.e-rte-emoji-search');
                            if (isNOU(focusEle) && !isNOU(inputELe)) {
                                inputELe.focus();
                                break;
                            }
                            addClass([focusEle], 'e-focus');
                            focusEle.focus();
                        }
                    }
                    else if (e.keyCode === 40) {
                        if (emojiButtons.length - 6 > i) {
                            const firstFocusEle: HTMLElement = emojiButtons[i as number] as HTMLElement | null;
                            removeClass([firstFocusEle], 'e-focus');
                            const focusEle: HTMLElement = emojiButtons[focusIndex += 6] as HTMLElement | null;
                            addClass([focusEle], 'e-focus');
                            focusEle.focus();
                            break;
                        }
                    }
                    else if (e.keyCode === 39) {
                        if (emojiButtons.length !== i + 1) {
                            const firstFocusEle: HTMLElement = emojiButtons[i as number] as HTMLElement | null;
                            removeClass([firstFocusEle], 'e-focus');
                            const focusEle: HTMLElement = emojiButtons[focusIndex += 1] as HTMLElement | null;
                            addClass([focusEle], 'e-focus');
                            emojiButtons[focusIndex as number].focus();
                        }
                        break;
                    }
                    else if (e.keyCode === 37) {
                        if (i > 0) {
                            const firstFocusEle: HTMLElement = emojiButtons[i as number] as HTMLElement | null;
                            removeClass([firstFocusEle], 'e-focus');
                            const focusEle: HTMLElement = emojiButtons[focusIndex -= 1] as HTMLElement | null;
                            addClass([focusEle], 'e-focus');
                            emojiButtons[focusIndex as number].focus();
                            break;
                        }
                    }
                }
            }
        }
    }
    private searchFilter(e?: KeyboardEvent, value?: string, hasInternalCall: boolean = false): void {
        const inputElement: HTMLInputElement = this.parent.element.querySelector('.e-rte-emoji-search') as HTMLInputElement;
        const contentELe: HTMLElement = this.parent.iframeSettings.enable ? this.parent.contentModule.getPanel() as HTMLElement :
            this.parent.element.querySelector('.e-content');
        if (document.activeElement === inputElement || document.activeElement === contentELe) {
            let trimmedStr: string;
            if (value !== ':' && !isNOU(value)) {
                trimmedStr = value.replace(/^:/, '');
            }
            else if (!isNOU(value)) {
                trimmedStr = value;
            }
            const inputValue: string = isNOU(inputElement) ? trimmedStr : inputElement.value;
            const emojiButtons: NodeListOf<HTMLButtonElement> = this.parent.element.querySelectorAll('.e-rte-emojipicker-btn button');
            const emojipickerAll: HTMLElement = this.parent.element.querySelector('.e-rte-emojipicker-btn');
            const emojiGroups: NodeListOf<HTMLElement> = this.parent.element.querySelectorAll('.e-rte-emojipicker-group');
            const toolbarGroup: HTMLElement = this.parent.element.querySelector('.e-rte-emojipicker-toolbar') as HTMLElement;
            const excludedDiv: HTMLElement = this.parent.element.querySelector('.e-rte-emojisearch-btn');
            const firstChild: HTMLElement = this.popDiv.childNodes[0] as HTMLElement;
            const getComputedStyle: CSSStyleDeclaration = window.getComputedStyle(firstChild);
            const inputHeight: number = firstChild.nodeName === 'SPAN' ? (firstChild.getBoundingClientRect().height + parseFloat(getComputedStyle.marginTop) +
                parseFloat(getComputedStyle.marginBottom)) : 0;
            const popupBorder: CSSStyleDeclaration = window.getComputedStyle(this.popDiv);
            // eslint-disable-next-line @typescript-eslint/tslint/config
            const filteredButtons = isNOU(excludedDiv) ? emojiButtons :
                // eslint-disable-next-line @typescript-eslint/tslint/config
                Array.from(emojiButtons).filter(button => !excludedDiv.contains(button));
            if (!isNOU(toolbarGroup) && !isNOU(emojipickerAll) && !isNOU(inputValue)) {
                if (inputValue === '' || value === ':') {
                    toolbarGroup.style.display = '';
                    emojipickerAll.style.height = (this.popDiv.getBoundingClientRect().height - toolbarGroup.getBoundingClientRect().height - inputHeight - (2 * parseFloat(popupBorder.borderWidth))) + 'px';
                    // eslint-disable-next-line @typescript-eslint/tslint/config
                    emojiGroups.forEach(element => {
                        element.style.display = '';
                    });
                }
                else {
                    // eslint-disable-next-line @typescript-eslint/tslint/config
                    emojiGroups.forEach(element => {
                        element.style.display = 'none';
                    });
                    toolbarGroup.style.display = 'none';
                    emojipickerAll.style.height = (this.popDiv.getBoundingClientRect().height - inputHeight - (2 * parseFloat(popupBorder.borderWidth))) + 'px';
                }
                const emojiBtnDiv: HTMLElement = this.parent.createElement('div', { className: 'e-rte-emojisearch-btn' });
                const emojis: HTMLElement = this.parent.element.querySelector('.e-rte-emojisearch-btn') as HTMLElement;
                if (emojis) {
                    emojis.remove();
                }
                let noEMoji: boolean = true;
                for (let i: number = 0; i < filteredButtons.length; i++) {
                    if (!isNOU(filteredButtons[i as number].getAttribute('title'))) {
                        const title: string = filteredButtons[i as number].getAttribute('title').toLowerCase();
                        const titleLength: string[] = title.split(' ');
                        for (let j: number = 0; j < titleLength.length; j++) {
                            if (titleLength[j as number].startsWith(inputValue.toLowerCase()) && inputValue !== '') {
                                const emoji: Node = filteredButtons[i as number].cloneNode(true);
                                emojiBtnDiv.appendChild(emoji);
                                noEMoji = false;
                                break;
                            }
                        }
                    }
                }
                const noEmojiObj: HTMLElement = this.parent.createElement('div', { className: 'e-rte-emojiSearch-noEmoji' });
                if (noEMoji && !this.parent.element.querySelector('.e-rte-emojiSearch-noEmoji') && (inputValue !== '' && value !== ':' && value !== ': :')) {
                    if (!isNOU(noEmojiObj)) {
                        noEmojiObj.innerHTML = '<span style="color: rgba(0, 0, 0, 0.75); font-weight: 500; font-size: 16px;">' + this.i10n.getConstant('emojiPickerNoResultFound') + ' 😥 </span>' + '<br>' + '<span style="color: rgba(0, 0, 0, 0.75);"> ' + this.i10n.getConstant('emojiPickerTrySomethingElse') + ' ? </span>';
                        noEmojiObj.style.margin = '55px';
                        emojipickerAll.appendChild(noEmojiObj);
                    }
                }
                else if (!noEMoji && this.parent.element.querySelector('.e-rte-emojiSearch-noEmoji') || (inputValue === '' && value === ':') || (inputValue === '' && this.parent.element.querySelector('.e-rte-emojiSearch-noEmoji'))) {
                    emojipickerAll.removeChild(this.parent.element.querySelector('.e-rte-emojiSearch-noEmoji'));
                }
                emojipickerAll.appendChild(emojiBtnDiv);
                if (hasInternalCall) {
                    if (noEMoji && value !== ':') {
                        this.noResultsFoundCount += 1;
                    } else {
                        this.noResultsFoundCount = 0;
                    }
                    if (this.noResultsFoundCount >= 9) {
                        if (!isNOU(this.popupObj)) {
                            removeClass([this.divElement], 'e-active');
                            this.popupObj.hide();
                            this.noResultsFoundCount = 0;
                            return;
                        }
                    }
                }
            }
            else {
                return;
            }
        }
        else {
            return;
        }
    }

    private emojiBtnClick(e: Event | KeyboardEvent): void {
        const event: MouseEvent = new MouseEvent('mouseleave', {bubbles: true, cancelable: true});
        // Includes the emote button element tooltip and toolbar tooltip
        const emotePickerTooltips: NodeList = this.parent.element.querySelectorAll('.e-rte-emojipicker-popup [data-tooltip-id]');
        for (let i: number = 0; i < emotePickerTooltips.length; i++) {
            emotePickerTooltips[i as number].dispatchEvent(event);
        }
        const targetEle: HTMLElement = e.target as HTMLElement;
        if (targetEle.tagName !== 'BUTTON') {
            return;
        }
        targetEle.focus();
        const startOffset: number = this.save.startOffset;
        const textContent: string = this.save.range.startContainer.textContent;
        const previousText: string = textContent.substring(startOffset, startOffset + 1);
        // When toolbar action is clicked then only restore the range.
        if (!isNOU(this.clickEvent) || previousText !== ':') {
            this.save.restore();
        }
        if (this.popupObj) {
            removeClass([this.divElement], 'e-active');
            this.popupObj.hide();
        }
        if (isSafari() && e.type === 'keydown') {
            this.parent.notify(events.selectionRestore, {});
        }
        const originalEvent: MouseEvent | KeyboardEvent | PointerEvent = e as MouseEvent | KeyboardEvent | PointerEvent;
        this.parent.formatter.process(
            this.parent, {
                item: {
                    'command': 'EmojiPicker',
                    'subCommand': 'EmojiPicker',
                    value: targetEle.innerHTML
                },
                originalEvent: originalEvent
            },
            e, originalEvent);
    }

    private onkeyPress(e: NotifyArgs): void {
        const originalEvent: KeyboardEventArgs = e.args as KeyboardEventArgs;
        const selection: Selection = (this.parent.iframeSettings.enable) ?
            (this.parent.contentModule.getPanel() as HTMLIFrameElement).contentWindow.getSelection() :
            this.parent.contentModule.getDocument().getSelection();
        if (selection.rangeCount <= 0) { return; }
        const range: Range = selection.getRangeAt(0);
        const cursorPos: number = range.startOffset;
        const prevChar: string = selection.focusNode.textContent.substring(cursorPos - 1, cursorPos);
        const isPrevSpace: boolean = /\s/.test(prevChar);
        const isPrevColon: boolean = selection.focusNode.textContent.substring(cursorPos - 1, cursorPos) === ':';
        const colon: boolean = selection.focusNode.textContent.charAt(cursorPos - 1) === ':';
        if (originalEvent.keyCode === 186 && originalEvent.shiftKey && (isPrevSpace || selection.focusOffset === 0)) {
            const coordinates: { [key: string]: number } = this.getCoordinates();
            this.parent.showEmojiPicker(coordinates.left, coordinates.top);
        }
        if (originalEvent.keyCode === 8 && colon && this.popupObj) {
            removeClass([this.divElement], 'e-active');
            this.popupObj.hide();
        }
        if (originalEvent.keyCode === 32 && isPrevColon && this.popupObj) {
            removeClass([this.divElement], 'e-active');
            const currentDocument: Document = this.parent.iframeSettings.enable ? this.parent.contentModule.getPanel().ownerDocument :
                this.parent.contentModule.getDocument();
            if (this.parent.showTooltip && !isNOU(currentDocument.querySelector('.e-tooltip-wrap'))) {
                this.parent.notify(events.destroyTooltip, {args: event});
            }
            this.popupObj.hide();
        }
        if (this.popupObj && (originalEvent.keyCode === 37 || originalEvent.keyCode === 38 || originalEvent.keyCode === 39
            || originalEvent.keyCode === 27 || originalEvent.keyCode === 40)) {
            this.onKeyDown(originalEvent);
            originalEvent.preventDefault();
        }
    }

    private onkeyUp(e: NotifyArgs): void {
        const originalEvent: KeyboardEventArgs = e.args as KeyboardEventArgs;
        const selection: Selection = (this.parent.iframeSettings.enable) ?
            (this.parent.contentModule.getPanel() as HTMLIFrameElement).contentWindow.getSelection() :
            this.parent.contentModule.getDocument().getSelection();
        if (selection.rangeCount <= 0) { return; }
        const range: Range = selection.getRangeAt(0);
        const cursorPos: number = range.startOffset;
        // eslint-disable-next-line
        let selectedValue;
        let count: number = 0;
        for (let i: number = cursorPos - 1; i >= (cursorPos - selection.focusNode.textContent.length); i--) {
            const prevChar: string = selection.focusNode.textContent.substring(i - 1, i);
            const isPrevSpace: boolean = /:$/.test(prevChar);
            if (isPrevSpace && !isNOU(this.popDiv) && count === 0) {
                selectedValue = range.startContainer.textContent.substring(i - 1, cursorPos);
                this.searchFilter(originalEvent, selectedValue, true);
                count = 1;
            }
        }
        const colon: string = selection.focusNode.textContent.substring(cursorPos - 1, cursorPos);
        if (colon === ':' && !isNOU(this.popupObj)) {
            selectedValue = colon;
            this.searchFilter(originalEvent, selectedValue, true);
        }
    }

    private getCoordinates(): { [key: string]: number } {
        let coordinates: { [key: string]: number };
        const selection: Selection = (this.parent.iframeSettings.enable) ?
            (this.parent.contentModule.getPanel() as HTMLIFrameElement).contentWindow.getSelection() : window.getSelection();
        const range: Range = selection.getRangeAt(0);
        let firstChild: HTMLElement;
        if (range.startContainer.nodeName === 'P' || range.startContainer.nodeName === 'DIV') {
            if (range.startContainer.childNodes[0].nodeName !== '#text' ){
                firstChild = range.startContainer.childNodes[0] as HTMLElement;
            }
        }
        // eslint-disable-next-line
        const rect: any = isNOU(firstChild) ? range.getBoundingClientRect() : firstChild.getBoundingClientRect();
        const rteContent: HTMLElement = this.parent.element.querySelector('.e-rte-content');
        const rteEle: HTMLElement = this.parent.element;
        const toolbarHeight: number = rteEle.offsetHeight - rteContent.offsetHeight;
        const cursorTop: number = rect.top - this.parent.inputElement.getBoundingClientRect().top;
        const cursorLeft: number = rect.left - this.parent.inputElement.getBoundingClientRect().left;
        const screenHeight: number = window.innerHeight;
        const popupHeight: number = 330;
        let popupTop: number = cursorTop;
        const popupLeft: number = cursorLeft + rect.width;
        if (rteEle.getBoundingClientRect().top < 0 && !this.parent.inlineMode.enable) {
            popupTop = popupTop + rteContent.getBoundingClientRect().top - toolbarHeight;
        }
        if (rect.top < popupHeight) {
            // eslint-disable-next-line
            popupTop = popupTop;
        }
        else if (rect.top + popupHeight > screenHeight) {
            popupTop -= popupHeight + 20;
        }
        if (this.parent.inputElement) {
            coordinates = {
                top: popupTop + 60,
                left: popupLeft + 8
            };
        }
        return coordinates;
    }

    protected removeEventListener(): void {
        this.parent.off(events.emojiPicker, this.toolbarClick);
        this.parent.off(events.docClick, this.docClick);
        this.parent.off(events.iframeMouseDown, this.onIframeMouseDown);
        this.parent.off(events.keyDown, this.onkeyPress);
        this.parent.off(events.keyUp, this.onkeyUp);
        this.parent.off(events.contentscroll, this.contentscroll);
        this.parent.off(events.scroll, this.contentscroll);
        this.parent.off(events.destroy, this.destroy);
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} - returns the string value
     */
    private getModuleName(): string {
        return 'emojiPicker';
    }

}
