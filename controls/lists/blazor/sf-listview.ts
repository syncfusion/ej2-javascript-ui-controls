import { EventHandler, BlazorDotnetObject, isNullOrUndefined, MouseEventArgs, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { closest, Animation, AnimationOptions, Effect, Touch, SwipeEventArgs } from '@syncfusion/ej2-base';
import { AnimationSettings, ClickEventArgs } from './interface';

const effectsConfig: { [key: string]: Effect[] } = {
    'None': [],
    'SlideLeft': ['SlideRightOut', 'SlideLeftOut', 'SlideLeftIn', 'SlideRightIn'],
    'SlideDown': ['SlideTopOut', 'SlideBottomOut', 'SlideBottomIn', 'SlideTopIn'],
    'Zoom': ['FadeOut', 'FadeZoomOut', 'FadeZoomIn', 'FadeIn'],
    'Fade': ['FadeOut', 'FadeOut', 'FadeIn', 'FadeIn']
};

const effectsRTLConfig: { [key: string]: Effect[] } = {
    'None': [],
    'SlideLeft': ['SlideLeftOut', 'SlideRightOut', 'SlideRightIn', 'SlideLeftIn'],
    'SlideDown': ['SlideBottomOut', 'SlideTopOut', 'SlideTopIn', 'SlideBottomIn'],
    'Zoom': ['FadeZoomOut', 'FadeOut', 'FadeIn', 'FadeZoomIn'],
    'Fade': ['FadeOut', 'FadeOut', 'FadeIn', 'FadeIn']
};

const SWIPEVELOCITY: number = 0.5;
const DATASOURCEKEY: string = 'defaultData_Key';
const HOVER: string = 'e-hover';
const FOCUSED: string = 'e-focused';
const LISTITEM: string = 'e-list-item';
const GROUPLISTITEM: string = 'e-list-group-item';
const HASCHILD: string = 'e-has-child';
const HEADER: string = 'e-list-header';
const HEADERTEXT: string = 'e-headertext';
const DISABLE: string = 'e-disabled';
const BACKICON: string = 'e-icon-back';
const CHECKBOXWRAPPER: string = 'e-checkbox-wrapper';
const CHECKED: string = 'e-check';
const CHECKBOXICON: string = 'e-frame';
const NONE: string = 'none';
const VIRTUALULCONTAINER: string = 'e-list-virtualcontainer';

class SfListView {
    private element: BlazorListViewElement;
    private dotNetRef: BlazorDotnetObject;
    private curUlElement: HTMLElement;
    private headerElement: HTMLElement;
    private showCheckBox: boolean;
    private showHeader: boolean;
    private enable: boolean;
    private dataSourceLevel: string[] = [DATASOURCEKEY];
    private curDSKey: string = DATASOURCEKEY;
    private enableVirtualization: boolean;
    private isWindow: boolean = false;
    private liDifference: number = 0;
    private liHeight: number = 0;
    private enableSelectEvent: boolean;
    private focusedElementId: string;
    private virtualListDifference: number = 0;
    private height: string;
    private selectedItems: { [key: string]: string[] };
    private headerTitleInfo: string[];
    private animation: AnimationSettings;
    private animateOptions: AnimationOptions;
    private animationObject: Animation;
    private enableRtl: boolean;
    private isTemplate: boolean;
    private touchModule: Touch;
    // tslint:disable
    constructor(element: BlazorListViewElement, dotnetRef: BlazorDotnetObject, properties: any, enableSelectEvent: boolean) {
        // tslint:enable
        this.element = element;
        this.dotNetRef = dotnetRef;
        this.showCheckBox = properties.ShowCheckBox;
        this.showHeader = properties.ShowHeader;
        this.enable = properties.Enabled;
        this.curUlElement = element.querySelector('ul');
        this.enableVirtualization = properties.EnableVirtualization;
        this.isWindow = properties.Height ? false : true;
        this.enableSelectEvent = enableSelectEvent;
        this.height = properties.Height;
        this.headerTitleInfo = [properties.HeaderTitle];
        this.selectedItems = { defaultData_Key: properties.SelectedElementIdInfo };
        this.enableRtl = properties.EnableRtl;
        this.animation = properties.Animation;
        this.isTemplate = properties.Template;
        this.element.blazor__instance = this;
    }
    public initialize(): void {
        if (this.enableVirtualization) {
            if (this.isWindow) {
                this.dotNetRef.invokeMethodAsync('GetComponenetHeight', window.innerHeight);
            } else if (this.height.indexOf('%') !== -1) {
                let parentContainerHeight: number = this.element.parentElement.getBoundingClientRect().height;
                this.dotNetRef.invokeMethodAsync('GetComponenetHeight', ((parentContainerHeight / 100) * parseFloat(this.height)));
            }
            this.updateLiElementHeight();
        }
        this.headerElement = this.element.querySelector('.' + HEADERTEXT);
        this.animationObject = new Animation(this.animateOptions);
        this.wireEvents();
    }
    private wireEvents(): void {
        EventHandler.add(this.element, 'keydown', this.keyActionHandler, this);
        EventHandler.add(this.element, 'click', this.clickHandler, this);
        EventHandler.add(this.element, 'focusout', this.removeFocus, this);
        this.touchModule = new Touch(this.element, { swipe: this.swipeActionHandler.bind(this) });
        if (this.enableVirtualization) {
            EventHandler.add(this.element, 'scroll', this.scrollHandler, this);
            if (this.isWindow) { window.addEventListener('scroll', this.scrollHandler.bind(this)); }
        } else {
            EventHandler.add(this.element, 'mouseover', this.mouseHoverHandler, this);
            EventHandler.add(this.element, 'mouseout', this.mouseOutHandler, this);
        }
    }
    private unWireEvents(): void {
        EventHandler.remove(this.element, 'keydown', this.keyActionHandler);
        EventHandler.remove(this.element, 'click', this.clickHandler);
        EventHandler.remove(this.element, 'focusout', this.removeFocus);
        if (this.enableVirtualization) {
            EventHandler.remove(this.element, 'scroll', this.scrollHandler);
            if (this.isWindow) { window.removeEventListener('scroll', this.scrollHandler.bind(this)); }
        } else {
            EventHandler.remove(this.element, 'mouseover', this.mouseHoverHandler);
            EventHandler.remove(this.element, 'mouseout', this.mouseOutHandler);
        }
        this.touchModule.destroy();
    }

    private swipeActionHandler(e: SwipeEventArgs): void {
        if (e.swipeDirection === 'Right' && e.velocity > SWIPEVELOCITY && e.originalEvent.type === 'touchend') {
            if (this.showCheckBox && this.dataSourceLevel[this.dataSourceLevel.length - 1]) {
                this.uncheckAllItems();
            }
            this.back();
        }
    }

    public showHideItem(item: HTMLElement | Element, display: string): void {
        let li: HTMLElement = this.getLi(item);
        if (li) { li.style.display = display; }
    }

    public enableState(item: HTMLElement | Element, isEnable: boolean): void {
        let li: HTMLElement = this.getLi(item);
        if (li) {
            isEnable ? li.classList.remove('e-disabled') : li.classList.add('e-disabled');
        }
    }

    private getLi(item: HTMLElement | Element): HTMLElement {
        let li: HTMLElement;
        if (this.element) { li = <HTMLElement>this.element.querySelector('[data-uid="' + item.id + '"]'); }
        return li;
    }

    private scrollHandler(e: Event): void {
        let listDiff: number;
        // tslint:disable
        let scrollTop: number = this.isWindow ? (e.target as any).documentElement.scrollTop : (e.target as Element).scrollTop;
        // tslint:enable
        if (!this.liHeight) { this.updateLiElementHeight(); }
        listDiff = Math.round(scrollTop / this.liHeight);
        if (listDiff - this.liDifference >= this.virtualListDifference || listDiff - this.liDifference <= (-1)) {
            let focuseElement: Element = this.curUlElement.querySelector('.' + FOCUSED);
            if (focuseElement) { this.focusedElementId = focuseElement.getAttribute('data-uid'); }
            let virtualElementContainer: HTMLElement = this.element.querySelector('.' + VIRTUALULCONTAINER);
            if (virtualElementContainer) {
                virtualElementContainer.style.top = (((listDiff - 1) * this.liHeight) < 0) ? '0px' : (listDiff - 2) * this.liHeight + 'px';
                this.liDifference = listDiff;
                this.dotNetRef.invokeMethodAsync('VirtualScrolling', (listDiff - 2));
            }
        }
    }

    public updateLiElementHeight(): void {
        let virtualElementContainer: Element = this.element.querySelector('.' + VIRTUALULCONTAINER);
        if (virtualElementContainer) {
            if (!this.curUlElement) { this.curUlElement = this.element.querySelector('ul'); }
            let liElement: Element = virtualElementContainer.children[0];
            if (liElement) {
                this.liHeight = liElement.getBoundingClientRect().height;
                this.dotNetRef.invokeMethodAsync('UpdateLiElementHeight', this.liHeight);
            }
        }
    }

    public updateElementDifference(listDifference: number): void {
        this.virtualListDifference = listDifference;
    }

    public selectItem(item: HTMLElement | Element): void {
        let liItem: Element = this.getLi(item);
        if (this.showCheckBox) {
            this.setChecked(liItem, liItem.querySelector('.' + CHECKBOXWRAPPER));
        } else {
            isNullOrUndefined(liItem) ? this.removeFocus() : this.setSelectLI(liItem, null);
            this.selectedItems[this.curDSKey][0] = liItem.getAttribute('data-uid');
        }
    }
    private clickHandler(e: MouseEventArgs): void {
        if (this.curUlElement) {
            let target: Element = <Element>e.target;
            let classList: DOMTokenList = target.classList;
            if (classList.contains(BACKICON) || classList.contains(HEADERTEXT)) {
                this.back();
            } else {
                let li: HTMLElement = <HTMLElement>closest(target.parentNode, '.' + LISTITEM);
                if (li === null) { li = <HTMLElement>target; }
                if (!li.classList.contains(DISABLE) && this.enable) {
                    this.removeFocus();
                    if (!this.showCheckBox) {
                        if (this.curUlElement.querySelector('.' + FOCUSED)) {
                            this.curUlElement.querySelector('.' + FOCUSED).classList.remove(FOCUSED);
                        }
                        if (li.classList.contains(HASCHILD)) {
                            this.setSelectLI(li, e);
                        } else {
                            li.classList.add(FOCUSED);
                            this.selectedItems[this.curDSKey][0] = li.getAttribute('data-uid');
                        }
                    } else if ((e.target as Element).classList.contains(CHECKBOXICON)) {
                        this.checkUncheckItem(li);
                    } else if (li.classList.contains(HASCHILD)) {
                        this.removeHover();
                        this.removeFocus();
                        this.setSelectLI(li, e);
                    } else {
                        this.checkUncheckItem(li);
                    }
                    if (this.enableSelectEvent) {
                        this.getSelectEventData(li, e);
                    }
                }
            }
        }
    }

    private checkUncheckItem(item: Element): void {
        item.classList.add(FOCUSED);
        (!item.querySelector('.' + CHECKED)) ? this.setChecked(item, item.querySelector('.' + CHECKBOXWRAPPER)) : this.uncheckItem(item);
    }

    public back(): void {
        if (this.dataSourceLevel.length > 1) {
            let ulElement: NodeListOf<HTMLUListElement> = this.element.querySelectorAll('ul');
            let headerElement: HTMLElement = this.element.querySelector('.' + HEADER);
            for (let i: number = 0; i < ulElement.length; i++) {
                if (this.dataSourceLevel.length > 2) {
                    if (ulElement[i].getAttribute('pid') === this.dataSourceLevel[this.dataSourceLevel.length - 2]) {
                        this.switchView(this.curUlElement, ulElement[i], true);
                        this.curUlElement = ulElement[i];
                    } else { ulElement[i].style.display = NONE; }
                } else if (ulElement[i].getAttribute('pid') === null) {
                    this.switchView(this.curUlElement, ulElement[i], true);
                    this.curUlElement = ulElement[i];
                } else { ulElement[i].style.display = NONE; }
            }
            this.dataSourceLevel.pop();
            if (!this.isTemplate) {
                this.headerTitleInfo.pop();
                if (this.headerElement) { this.headerElement.innerText = this.headerTitleInfo[this.headerTitleInfo.length - 1]; }
            }
            this.curDSKey = this.dataSourceLevel[this.dataSourceLevel.length - 1];
            if (this.dataSourceLevel.length === 1 && headerElement) { (headerElement.children[0] as HTMLElement).style.display = NONE; }
        }
    }
    private setHoverLI(li: Element): void {
        if (!this.element.classList.contains(DISABLE) && !li.classList.contains(DISABLE)) { (li as Element).classList.add(HOVER); }
    }

    private mouseHoverHandler(e: MouseEvent): void {
        let currentLiElemet: HTMLElement = <HTMLElement>closest((<Element>e.target).parentNode, '.' + LISTITEM);
        if (currentLiElemet) { this.setHoverLI(currentLiElemet); }
    }

    private mouseOutHandler(e: MouseEvent): void {
        this.removeHover();
    }

    private removeHover(): void {
        let hoverLI: Element = this.element.querySelector('.' + HOVER);
        if (hoverLI) { hoverLI.classList.remove(HOVER); }
    }

    private removeFocus(): void {
        if (!this.curUlElement) { this.curUlElement = this.element.querySelector('ul'); }
        let focusedLI: Element[] = <NodeListOf<Element> & Element[]>this.curUlElement.querySelectorAll('.' + FOCUSED);
        for (let element of focusedLI) {
            element.classList.remove(FOCUSED);
        }
    }

    private isValidLI(li: Element | HTMLElement): boolean {
        return (li && li.classList.contains(LISTITEM)
            && !li.classList.contains(GROUPLISTITEM)
            && !li.classList.contains(DISABLE));
    }

    private setSelectLI(li: Element, e?: MouseEvent | KeyboardEvent | FocusEvent): void {
        if (this.enable && this.isValidLI(li) && !li.classList.contains(FOCUSED)) {
            this.removeFocus();
            this.addAriaAttribute(true, li);
            this.removeHover();
            if (li.classList.contains(HASCHILD)) { this.renderSubList(li); }
            if (this.enableSelectEvent) { this.getSelectEventData(li as HTMLElement, e); }
        }
    }

    private addAriaAttribute(isSelected: boolean, element: Element): void {
        if (isSelected) {
            element.classList.add(FOCUSED);
        } else if (!this.showCheckBox) {
            element.classList.remove(FOCUSED);
        }
        element.setAttribute('aria-selected', isSelected.toString());
    }

    private renderSubList(li: Element): void {
        let liElement: Element = li;
        let uID: string = li.getAttribute('data-uid');
        let headerElement: HTMLElement = this.element.querySelector('.' + HEADER);
        li.classList.remove(FOCUSED);
        li.classList.add(FOCUSED);
        if (this.showHeader && headerElement) { (headerElement.children[0] as HTMLElement).style.display = null; }
        if (liElement.classList.contains(HASCHILD) && uID) {
            let ulElement: Element = this.element.querySelector('[pid=\'' + uID + '\']');
            if (!ulElement) {
                let args: { [key: string]: string } = { ElementId: uID, Key: this.curDSKey };
                // tslint:disable
                this.dotNetRef.invokeMethodAsync('ListChildDataSource', args);
                // tslint:enable   
            } else { this.renderChildList(uID); }
            if (!this.isTemplate) {
                this.headerTitleInfo.push((liElement as HTMLElement).innerText.trim());
                if (this.headerElement) { this.headerElement.innerText = this.headerTitleInfo[this.headerTitleInfo.length - 1]; }
            }
            this.dataSourceLevel.push(uID);
            this.curDSKey = uID;
        }
    }

    public renderChildList(id: string, selectedItems?: string[]): void {
        let ulElement: NodeListOf<HTMLUListElement> = this.element.querySelectorAll('ul');
        if (!ulElement[ulElement.length - 1].getAttribute('pid')) { ulElement[ulElement.length - 1].setAttribute('pid', id); }
        for (let i: number = 0; i < ulElement.length; i++) {
            if (ulElement[i].getAttribute('pid') === id) {
                this.switchView(this.curUlElement, ulElement[i], false);
                this.curUlElement = ulElement[i];
                if (selectedItems) { this.selectedItems[id] = selectedItems; }
            }
        }
    }
    private keyActionHandler(e: KeyboardEventArgs): void {
        switch (e.keyCode) {
            case 36:
                this.homeKeyHandler(e);
                break;
            case 35:
                this.homeKeyHandler(e, true);
                break;
            case 40:
                this.arrowKeyHandler(e);
                break;
            case 38:
                this.arrowKeyHandler(e, true);
                break;
            case 13:
                this.enterKeyHandler(e);
                break;
            case 8:
                if (this.showCheckBox && this.curDSKey) {
                    this.uncheckAllItems();
                }
                this.back();
                break;
            case 32:
                this.spaceKeyHandler(e);
                break;
        }
    }

    private homeKeyHandler(e: KeyboardEventArgs, end?: boolean): void {
        let focusedElement: Element = this.curUlElement.querySelector('.' + FOCUSED);
        if (focusedElement) {
            focusedElement.classList.remove(FOCUSED);
        }
        let index: number = !end ? 0 : this.curUlElement.children.length - 1;
        let liElement: Element = this.curUlElement.children[index];
        this.addAriaAttribute(true, liElement);
        liElement.classList.add(FOCUSED);
        if (this.curUlElement.children[index]) {
            this.element.setAttribute('aria-activedescendant', this.curUlElement.children[index].id.toString());
        } else { this.element.removeAttribute('aria-activedescendant'); }
        if (this.enableSelectEvent) { this.getSelectEventData(liElement as HTMLElement, e); }
    }
    private onArrowKeyDown(e: KeyboardEventArgs, previouse: boolean): Element {
        let siblingLI: Element;
        let liElement: Element;
        let hasChildElement: boolean = !isNullOrUndefined(this.curUlElement.querySelector('.' + HASCHILD)) ? true : false;
        if (hasChildElement || this.showCheckBox) {
            liElement = this.curUlElement.querySelector('.' + FOCUSED) || this.curUlElement.querySelector('.' + FOCUSED);
            siblingLI = this.getSiblingLI(this.curUlElement.querySelectorAll('.' + LISTITEM), liElement, previouse);
            if (!isNullOrUndefined(siblingLI)) {
                if (liElement) {
                    liElement.classList.remove(FOCUSED);
                    if (!this.showCheckBox) { liElement.classList.remove(FOCUSED); }
                }
                if (siblingLI.classList.contains(HASCHILD) || this.showCheckBox) {
                    siblingLI.classList.add(FOCUSED);
                } else { this.setSelectLI(siblingLI, e); }
            }
        } else {
            liElement = this.curUlElement.querySelector('.' + FOCUSED);
            siblingLI = this.getSiblingLI(this.curUlElement.querySelectorAll('.' + LISTITEM), liElement, previouse);
            this.setSelectLI(siblingLI, e);
        }
        if (siblingLI) {
            this.element.setAttribute('aria-activedescendant', (<HTMLElement>siblingLI).id.toString());
        } else { this.element.removeAttribute('aria-activedescendant'); }
        return siblingLI;
    }
    private getSiblingLI(elementArray: Element[] | NodeList, element: Element, isPrevious?: boolean): Element {
        let licollection: Element[] = Array.prototype.slice.call(elementArray);
        let curIndex: number = licollection.indexOf(element);
        return isPrevious ? licollection[curIndex - 1] : licollection[curIndex + 1];
    }
    private arrowKeyHandler(e: KeyboardEventArgs, prev?: boolean): void {
        e.preventDefault();
        if (this.curUlElement) {
            let siblingLI: Element = this.onArrowKeyDown(e, prev);
            let elementTop: number = this.element.getBoundingClientRect().top;
            let elementHeight: number = this.element.getBoundingClientRect().height;
            let heightDiff: number;
            if (siblingLI) {
                let siblingTop: number = siblingLI.getBoundingClientRect().top;
                let siblingHeight: number = siblingLI.getBoundingClientRect().height;
                if (!prev) {
                    let height: number = this.isWindow ? window.innerHeight : elementHeight;
                    heightDiff = this.isWindow ? (siblingTop + siblingHeight) :
                        ((siblingTop - elementTop) + siblingHeight);
                    if (heightDiff > height) {
                        this.isWindow ? window.scroll(0, pageYOffset + (heightDiff - height)) :
                            this.element.scrollTop = this.element.scrollTop + (heightDiff - height);
                    }
                } else {
                    heightDiff = this.isWindow ? siblingTop : (siblingTop - elementTop);
                    if (heightDiff < 0) {
                        this.isWindow ? window.scroll(0, pageYOffset + heightDiff) :
                            this.element.scrollTop = this.element.scrollTop + heightDiff;
                    }
                }
            }
        }
    }
    private enterKeyHandler(e: KeyboardEventArgs): void {
        if (this.curUlElement) {
            let li: HTMLElement = this.curUlElement.querySelector('.' + FOCUSED);
            if ((this.curUlElement.querySelector('.' + HASCHILD)) && li) {
                li.classList.remove(FOCUSED);
                if (this.showCheckBox) {
                    this.removeFocus();
                    this.removeHover();
                }
                this.setSelectLI(li, e);
            }
        }
    }

    public checkAllItems(): void {
        this.updateCheckBoxState(true);
    }

    public uncheckAllItems(): void {
        this.updateCheckBoxState(false);
    }

    private updateCheckBoxState(isChecked: boolean): void {
        if (this.showCheckBox) {
            let liCollection: NodeListOf<HTMLLIElement> = this.curUlElement.querySelectorAll('li');
            let liElementCount: number = !this.enableVirtualization ?
                this.curUlElement.childElementCount : this.curUlElement.querySelector('.' + VIRTUALULCONTAINER).childElementCount;
            for (let i: number = 0; i < liElementCount; i++) {
                let checkIcon: Element = liCollection[i].querySelector('.' + CHECKBOXICON);
                if (checkIcon) {
                    if (isChecked && !checkIcon.classList.contains(CHECKED)) {
                        this.checkItem(liCollection[i]);
                    } else if (checkIcon.classList.contains(CHECKED)) { this.uncheckItem(liCollection[i]); }
                }
            }
        }
    }
    public checkItem(item: HTMLElement | Element): void {
        this.toggleCheckBox(item, true);
    }

    public getCheckData(item: HTMLElement | Element, isCheck: boolean): void {
        let liItem: HTMLElement = <HTMLElement>this.curUlElement.querySelector('[data-uid=\'' + item.id + '\']');
        isCheck ? this.checkItem(liItem) : this.uncheckItem(liItem);
    }

    private spaceKeyHandler(e: KeyboardEventArgs): void {
        e.preventDefault();
        if (this.enable && this.showCheckBox && this.curUlElement) {
            let li: Element = this.curUlElement.querySelector('.' + FOCUSED);
            if (!isNullOrUndefined(li) && isNullOrUndefined(li.querySelector('.' + CHECKED))) {
                this.setChecked(li, li.querySelector('.' + CHECKBOXWRAPPER));
            } else { this.uncheckItem(li); }
            if (this.enableSelectEvent) { this.getSelectEventData(li as HTMLElement, e); }
        }
    }

    private setChecked(item: Element, checkboxElement: Element): void {
        this.removeFocus();
        item.classList.add(FOCUSED);
        this.addAriaAttribute(true, item);
        if (checkboxElement) {
            checkboxElement.querySelector('.' + CHECKBOXICON).classList.add(CHECKED);
            checkboxElement.setAttribute('aria-checked', 'true');
        }
        if (this.selectedItems[this.curDSKey] && this.selectedItems[this.curDSKey].indexOf(item.getAttribute('data-uid')) === -1) {
            this.selectedItems[this.curDSKey].push(item.getAttribute('data-uid'));
        }
    }

    private toggleCheckBox(item: Element | HTMLElement, isChecked: boolean): void {
        if (this.showCheckBox) {
            let liElement: Element = item as Element;
            if (!isNullOrUndefined(liElement)) {
                let checkboxIconElement: Element = liElement.querySelector('.' + CHECKBOXICON);
                this.addAriaAttribute(isChecked, liElement);
                isChecked ? checkboxIconElement.classList.add(CHECKED) : checkboxIconElement.classList.remove(CHECKED);
                checkboxIconElement.parentElement.setAttribute('aria-checked', isChecked ? 'true' : 'false');
            }
        }
    }

    public uncheckItem(item: HTMLElement | Element): void {
        if (this.selectedItems[this.curDSKey] && this.selectedItems[this.curDSKey].indexOf(item.getAttribute('data-uid')) !== -1) {
            this.selectedItems[this.curDSKey].splice(this.selectedItems[this.curDSKey].indexOf(item.getAttribute('data-uid')), 1);
        }
        this.toggleCheckBox(item, false);
    }

    public addCheckClass(): void {
        if (!this.curUlElement) { this.curUlElement = this.element.querySelector('ul'); }
        let liCollection: HTMLCollection = this.enableVirtualization ?
            this.curUlElement.querySelector('.' + VIRTUALULCONTAINER).children : this.curUlElement.children;
        let selectedItemsId: string[] = this.selectedItems[this.curDSKey];
        for (let i: number = 0; i < liCollection.length; i++) {
            if (!this.showCheckBox) {
                if (selectedItemsId[0] === liCollection[i].getAttribute('data-uid')) {
                    liCollection[i].classList.add(FOCUSED);
                } else {
                    liCollection[i].classList.remove(FOCUSED);
                }
            } else {
                if (this.focusedElementId) {
                    this.focusedElementId === liCollection[i].getAttribute('data-uid') ?
                        liCollection[i].classList.add(FOCUSED) : liCollection[i].classList.remove(FOCUSED);
                }
                if (selectedItemsId.length > 0) {
                    if (selectedItemsId.indexOf(liCollection[i].getAttribute('data-uid')) !== -1) {
                        this.toggleCheckBox(liCollection[i], true);
                    } else {
                        this.toggleCheckBox(liCollection[i], false);
                    }
                }
            }
        }
        for (let i: number = 0; i < liCollection.length; i++) {
            if (!this.showCheckBox) {
                if (selectedItemsId && selectedItemsId[0] === liCollection[i].getAttribute('data-uid')) {
                    liCollection[i].classList.add(FOCUSED);
                } else { liCollection[i].classList.remove(FOCUSED); }
            } else {
                if (this.focusedElementId) {
                    this.focusedElementId === liCollection[i].getAttribute('data-uid') ?
                        liCollection[i].classList.add(FOCUSED) : liCollection[i].classList.remove(FOCUSED);
                }
                if (selectedItemsId.length > 0) {
                    if (selectedItemsId.indexOf(liCollection[i].getAttribute('data-uid')) !== -1) {
                        this.toggleCheckBox(liCollection[i], true);
                    } else {
                        this.toggleCheckBox(liCollection[i], false);
                    }
                }
            }
        }
    };

    public getSelectedItems(): { [key: string]: string | string[] } {
        return { ElementId: this.selectedItems[this.curDSKey], Key: this.curDSKey };
    };

    private getSelectEventData(liElement: HTMLElement, event?: MouseEvent | KeyboardEvent | FocusEvent): void {
        let checked: boolean = (liElement).querySelector('.' + CHECKED) ? true : false;
        let clickEventArgs: ClickEventArgs = {
            ElementId: liElement.getAttribute('data-uid'), IsChecked: checked,
            Key: liElement.classList.contains(HASCHILD) ? this.dataSourceLevel[this.dataSourceLevel.length - 2] :
                this.curDSKey, IsInteracted: event ? true : false
        };
        this.dotNetRef.invokeMethodAsync('TriggerClickEvent', clickEventArgs);
    }
    // Animation Related Functions
    private switchView(fromView: HTMLElement, toView: HTMLElement, reverse?: boolean): void {
        if (fromView && toView) {
            let fromViewPos: string = fromView.style.position;
            let overflow: string = (this.element.style.overflow !== 'hidden') ? this.element.style.overflow : '';
            let animationEffect: Effect[];
            let duration: number = this.animation.duration;
            fromView.style.position = 'absolute';
            fromView.classList.add('e-view');
            if (this.animation.effect) {
                animationEffect = (this.enableRtl ? effectsRTLConfig[this.animation.effect] : effectsConfig[this.animation.effect]);
            } else {
                let slideLeft: string = 'SlideLeft';
                animationEffect = effectsConfig[slideLeft];
                reverse = this.enableRtl;
                duration = 0;
            }
            this.element.style.overflow = 'hidden';
            this.animationObject.animate(fromView, {
                name: (reverse ? animationEffect[0] : animationEffect[1]),
                duration: duration,
                timingFunction: this.animation.easing,
                end: (model: AnimationOptions): void => {
                    fromView.style.display = NONE;
                    this.element.style.overflow = overflow;
                    fromView.style.position = fromViewPos;
                    fromView.classList.remove('e-view');
                }
            });
            toView.style.display = '';
            this.animationObject.animate(toView, {
                name: (reverse ? animationEffect[2] : animationEffect[3]),
                duration: duration,
                timingFunction: this.animation.easing,
                end: (): void => {
                    this.dotNetRef.invokeMethodAsync('TriggerActionComplete');
                }
            });
            this.curUlElement = toView;
        }
    }

    public setAnimation(animation: AnimationSettings): void {
        this.animation = animation;
    }

    public setSelectedItems(selectedElementIdInfo: string[]): void {
        let headerElement: HTMLElement = this.element.querySelector('.' + HEADER);
        this.selectedItems = { defaultData_Key: selectedElementIdInfo };
        this.dataSourceLevel = [DATASOURCEKEY];
        this.curDSKey = DATASOURCEKEY;
        this.curUlElement = this.element.querySelector('ul');
        this.curUlElement.style.removeProperty('display');
        this.addCheckClass();
        this.removeFocus();
        this.headerTitleInfo = this.headerTitleInfo.splice(0, 1);
        if (this.headerElement) { this.headerElement.innerText = this.headerTitleInfo[this.headerTitleInfo.length - 1]; }
        if (this.dataSourceLevel.length === 1 && headerElement) {
            (headerElement.children[0] as HTMLElement).style.display = NONE;
        }
    }
    public updateHeaderTitle(title: string): void {
        this.headerTitleInfo[0] = title;
        if (this.headerElement) { this.headerElement.innerText = title; }
    }
    public destroy(): void {
        this.element.style.display = NONE;
        this.unWireEvents();
    }
}
let listView: object = {
    // tslint:disable
    initialize(element: BlazorListViewElement, dotnetRef: BlazorDotnetObject, properties: any, isSelect: boolean, liDiff: number): void {
        // tslint:enable
        if (this.isValid(element)) {
            new SfListView(element, dotnetRef, properties, isSelect);
            element.blazor__instance.initialize();
            element.blazor__instance.updateElementDifference(liDiff);
        }
    },
    renderChildList(element: BlazorListViewElement, parentId: string, selectedItems: string[]): void {
        if (this.isValid(element)) { element.blazor__instance.renderChildList(parentId, selectedItems); }
    },
    addActiveClass(element: BlazorListViewElement): void {
        if (this.isValid(element)) { element.blazor__instance.addCheckClass(); }
    },
    // tslint:disable
    showHideItem(element: BlazorListViewElement, item: any, display: string): void {
        // tslint:enable
        if (this.isValid(element)) { element.blazor__instance.showHideItem(item, display); }
    },
    // tslint:disable
    enableState(element: BlazorListViewElement, item: any, isEnable: boolean): void {
        // tslint:enable
        if (this.isValid(element)) { element.blazor__instance.enableState(item, isEnable); }
    },
    back(element: BlazorListViewElement): void {
        if (this.isValid(element)) { element.blazor__instance.back(); }
    },
    checkAllItems(element: BlazorListViewElement): void {
        if (this.isValid(element)) { element.blazor__instance.checkAllItems(); }
    },
    uncheckAllItems(element: BlazorListViewElement): void {
        if (this.isValid(element)) { element.blazor__instance.uncheckAllItems(); }
    },
    // tslint:disable
    getCheckData(element: BlazorListViewElement, item: any, isCheck: boolean): void {
        // tslint:enable
        if (this.isValid(element) && item != null) {
            for (let i: number = 0; i < item.length; i++) {
                element.blazor__instance.getCheckData(item[i], isCheck);
            }
        }
    },
    // tslint:disable
    selectItem(element: BlazorListViewElement, item: any): void {
        // tslint:enable
        if (element && item != null) {
            for (let i: number = 0; i < item.length; i++) {
                element.blazor__instance.selectItem(item[i]);
            }
        }
    },
    updateLiElementHeight(element: BlazorListViewElement): void {
        if (this.isValid(element)) { element.blazor__instance.updateLiElementHeight(); }
    },
    getCheckedItems: function getCheckedItems(element: BlazorListViewElement): { [key: string]: string | string[] } {
        return this.isValid(element) ? element.blazor__instance.getSelectedItems() : {};
    },
    setAnimation: function setAnimation(element: BlazorListViewElement, animaton: AnimationSettings): void {
        if (this.isValid(element)) { element.blazor__instance.setAnimation(animaton); }
    },
    setCheckedItems: function setCheckedItems(element: BlazorListViewElement, selectedElementIdInfo: string[]): void {
        if (this.isValid(element)) { element.blazor__instance.setSelectedItems(selectedElementIdInfo); }
    },
    updateHeaderTitle: function updateHeaderTitle(element: BlazorListViewElement, title: string): void {
        if (this.isValid(element)) { element.blazor__instance.updateHeaderTitle(title); }
    },
    destroy: function destroy(element: BlazorListViewElement): void {
        if (this.isValid(element)) { element.blazor__instance.destroy(); }
    },
    updateElementDifference: function updateElementDifference(element: BlazorListViewElement, listDiff: number): void {
        if (this.isValid(element)) { element.blazor__instance.updateElementDifference(listDiff); }
    },
    isValid(element: BlazorListViewElement): boolean {
        return (element) ? true : false;
    }
};

interface BlazorListViewElement extends HTMLElement {
    blazor__instance: SfListView;
}
export default listView;