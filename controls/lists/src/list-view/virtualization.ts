import { ListView, ItemCreatedArgs, classNames, Fields, UISelectedItem } from './list-view';
import { EventHandler, append, isNullOrUndefined, detach } from '@syncfusion/ej2-base';
import { ListBase } from '../common/list-base';

/**
 * ElementContext
 */
export interface ElementContext extends HTMLElement {
    context: { [key: string]: string | Object };
}

export class Virtualization {
    constructor(instance: ListView) {
        this.listViewInstance = instance;
    }

    /* tslint:disable-next-line:no-any */
    private listViewInstance: any;
    private headerData: { [key: string]: Object };
    private templateData: { [key: string]: Object };
    private topElementHeight: number;
    private bottomElementHeight: number;
    public listItemHeight: number;
    private startingHeight: number;
    private domItemCount: number;
    private expectedDomItemCount: number;
    private scrollPosition: number;
    private onVirtualScroll: EventListener;
    private checkListWrapper: Node;
    private iconCssWrapper: Node;
    public uiFirstIndex: number;
    private uiLastIndex: number;
    private totalHeight: number;
    private topElement: HTMLElement;
    private bottomElement: HTMLElement;
    private activeIndex: number;
    private uiIndices: { [key: string]: number[] };
    private listDiff: number;
    public isNgTemplate(): boolean {
        return !isNullOrUndefined(this.listViewInstance.templateRef) && typeof this.listViewInstance.templateRef !== 'string'
            && isNullOrUndefined(this.listViewInstance.fields.groupBy);
    }
    public uiVirtualization(): void {
        let curViewDS: { [key: string]: Object; }[] = this.listViewInstance.curViewDS as { [key: string]: Object; }[];
        let firstDs: { [key: string]: Object; }[] = curViewDS.slice(0, 1);
        this.listViewInstance.ulElement = this.listViewInstance.curUL = ListBase.createList(
            this.listViewInstance.createElement, firstDs, this.listViewInstance.listBaseOption);
        this.listViewInstance.contentContainer = this.listViewInstance.createElement('div', { className: classNames.content });
        this.listViewInstance.element.appendChild(this.listViewInstance.contentContainer);
        this.listViewInstance.contentContainer.appendChild(this.listViewInstance.ulElement);
        this.listItemHeight = this.listViewInstance.ulElement.firstElementChild.getBoundingClientRect().height;
        this.expectedDomItemCount = this.ValidateItemCount(10000);
        this.domItemCount = this.ValidateItemCount(Object.keys(this.listViewInstance.curViewDS).length);
        this.uiFirstIndex = 0;
        this.uiLastIndex = this.domItemCount - 1;
        this.wireScrollEvent(false);
        let otherDs: { [key: string]: Object; }[] = curViewDS.slice(1, this.domItemCount);
        let listItems: HTMLElement[] = ListBase.createListItemFromJson(
            this.listViewInstance.createElement, otherDs, this.listViewInstance.listBaseOption);
        append(listItems, this.listViewInstance.ulElement);
        this.listViewInstance.liCollection = <HTMLElement[] & NodeListOf<HTMLLIElement>>this.listViewInstance.curUL.querySelectorAll('li');
        this.topElement = this.listViewInstance.createElement('div');
        this.listViewInstance.ulElement.insertBefore(this.topElement, this.listViewInstance.ulElement.firstElementChild);
        this.bottomElement = this.listViewInstance.createElement('div');
        this.listViewInstance.ulElement.insertBefore(this.bottomElement, null);
        this.totalHeight = (Object.keys(curViewDS).length * this.listItemHeight) - (this.domItemCount * this.listItemHeight);
        this.topElement.style.height = 0 + 'px';
        this.bottomElement.style.height = this.totalHeight + 'px';
        this.topElementHeight = 0;
        this.bottomElementHeight = this.totalHeight;
        this.listDiff = 0;
        this.uiIndicesInitialization();
    }

    public wireScrollEvent(destroy: boolean): void {
        if (!destroy) {
            if (this.listViewInstance.isWindow) {
                this.onVirtualScroll = this.onVirtualUiScroll.bind(this);
                window.addEventListener('scroll', this.onVirtualScroll);
            } else {
                EventHandler.add(this.listViewInstance.element, 'scroll', this.onVirtualUiScroll, this);
            }
        } else {
            this.listViewInstance.isWindow ? window.removeEventListener('scroll', this.onVirtualScroll) :
                EventHandler.remove(this.listViewInstance.element, 'scroll', this.onVirtualUiScroll);
        }

    }

    private ValidateItemCount(dataSourceLength: number): number {
        let itemCount: number = this.listViewInstance.isWindow ? Math.round((window.innerHeight / this.listItemHeight) * 3) :
            Math.round((this.listViewInstance.height as number / this.listItemHeight) * 1.5);
        if (itemCount > dataSourceLength) {
            itemCount = dataSourceLength;
        }
        return itemCount;
    }

    private uiIndicesInitialization(): void {
        this.uiIndices = { 'activeIndices': [], 'disabledItemIndices': [], 'hiddenItemIndices': [] };
        (this.listViewInstance.curViewDS as { [key: string]: Object }[]).forEach((ds: { [key: string]: Object }, index: number) => {
            if (this.listViewInstance.showCheckBox && ds[this.listViewInstance.fields.isChecked]) {
                this.uiIndices.activeIndices.push(index);
            }
            if (!isNullOrUndefined(ds[this.listViewInstance.fields.enabled]) && !ds[this.listViewInstance.fields.enabled]) {
                this.uiIndices.disabledItemIndices.push(index);
            }
        });
        if (this.isNgTemplate()) {
            Array.prototype.forEach.call(
                this.listViewInstance.element.querySelectorAll('.' + classNames.listItem), (item: ElementContext, index: number) => {
                    item.context = this.listViewInstance.viewContainerRef._embeddedViews[index].context;
                });
        }
    }

    public refreshItemHeight(): void {
        if (this.listViewInstance.curViewDS.length) {
            let curViewDS: { [key: string]: Object; }[] = this.listViewInstance.curViewDS as { [key: string]: Object; }[];
            this.listItemHeight = (this.topElement.nextSibling as HTMLElement).getBoundingClientRect().height;
            this.totalHeight = (Object.keys(curViewDS).length * this.listItemHeight) - (this.domItemCount * this.listItemHeight);
            this.bottomElementHeight = this.totalHeight;
            this.bottomElement.style.height = this.totalHeight + 'px';
        }
    }

    private getscrollerHeight(): number {
        return this.listViewInstance.isWindow ? (((pageYOffset - this.startingHeight) <= 0) ? 0 :
            (pageYOffset - this.startingHeight)) : ((this.listViewInstance.element.scrollTop - this.startingHeight) <= 0) ? 0 :
                (this.listViewInstance.element.scrollTop - this.startingHeight);
    }

    private onVirtualUiScroll(): void {
        if (isNullOrUndefined(this.startingHeight)) {
            if (this.listViewInstance.isWindow) {
                this.startingHeight = document.documentElement.getBoundingClientRect().height -
                    this.listViewInstance.ulElement.getBoundingClientRect().height;
            } else {
                this.startingHeight = this.listViewInstance.headerEle ? this.listViewInstance.headerEle.getBoundingClientRect().height : 0;
            }
            this.scrollPosition = 0;
        }
        let scroll: number = this.getscrollerHeight();
        this.topElementHeight = this.listItemHeight * Math.floor(scroll / this.listItemHeight);
        this.bottomElementHeight = this.totalHeight - this.topElementHeight;
        [this.topElementHeight, this.bottomElementHeight] = scroll <= this.totalHeight ?
            [this.topElementHeight, this.bottomElementHeight] : [this.totalHeight, 0];
        if (this.topElementHeight !== parseFloat(this.topElement.style.height)) {
            this.topElement.style.height = this.topElementHeight + 'px';
            this.bottomElement.style.height = this.bottomElementHeight + 'px';
            if (scroll > this.scrollPosition) {
                let listDiff: number = ((this.topElementHeight / this.listItemHeight) - this.listDiff);
                if (listDiff > (this.expectedDomItemCount + 5)) {
                    this.onLongScroll(listDiff, true);
                } else {
                    this.onNormalScroll(listDiff, true);
                }
            } else {
                let listDiff: number = (this.listDiff - (this.topElementHeight / this.listItemHeight));
                if (listDiff > (this.expectedDomItemCount + 5)) {
                    this.onLongScroll(listDiff, false);
                } else {
                    this.onNormalScroll(listDiff, false);
                }
            }
            this.listDiff = this.topElementHeight / this.listItemHeight;
            if (typeof this.listViewInstance.onUIScrolled === 'function') {
                this.listViewInstance.onUIScrolled();
            }
        }
        this.scrollPosition = scroll;
    }

    private onLongScroll(listDiff: number, isScrollingDown: boolean): void {
        let index: number = isScrollingDown ? (this.uiFirstIndex + listDiff) : (this.uiFirstIndex - listDiff);
        Array.prototype.forEach.call(this.listViewInstance.ulElement.querySelectorAll('li'), (element: HTMLElement) => {
            this.updateUI(element, index);
            index++;
        });
        this.uiLastIndex = isScrollingDown ? (this.uiLastIndex + listDiff) : (this.uiLastIndex - listDiff);
        this.uiFirstIndex = isScrollingDown ? (this.uiFirstIndex + listDiff) : (this.uiFirstIndex - listDiff);
    }

    private onNormalScroll(listDiff: number, isScrollingDown: boolean): void {
        if (isScrollingDown) {
            for (let i: number = 0; i < listDiff; i++) {
                let index: number = ++this.uiLastIndex;
                this.updateUI(this.topElement.nextElementSibling as HTMLElement, index, this.bottomElement);
                this.uiFirstIndex++;
            }
        } else {
            for (let i: number = 0; i < listDiff; i++) {
                let index: number = --this.uiFirstIndex;
                let target: HTMLElement = this.topElement.nextSibling as HTMLElement;
                this.updateUI(this.bottomElement.previousElementSibling as HTMLElement, index, target);
                this.uiLastIndex--;
            }
        }
    }

    private updateUiContent(element: HTMLElement, index: number): void {
        let curViewDs: { [key: string]: Object; }[] = this.listViewInstance.curViewDS as { [key: string]: Object }[];
        if (typeof (this.listViewInstance.dataSource as string[])[0] === 'string' ||
            typeof (this.listViewInstance.dataSource as number[])[0] === 'number') {
            element.dataset.uid = ListBase.generateId();
            element.getElementsByClassName(classNames.listItemText)[0].innerHTML =
                (this.listViewInstance.curViewDS as string[] | number[])[index].toString();
        } else {
            element.dataset.uid = curViewDs[index][this.listViewInstance.fields.id] ?
                curViewDs[index][this.listViewInstance.fields.id].toString() : ListBase.generateId();
            element.getElementsByClassName(classNames.listItemText)[0].innerHTML =
                curViewDs[index][this.listViewInstance.fields.text].toString();
        }
        if (this.listViewInstance.showIcon) {
            if (element.querySelector('.' + classNames.listIcon)) {
                detach(element.querySelector('.' + classNames.listIcon));
            }
            if ((this.listViewInstance.curViewDS[index] as { [key: string]: Object; })[this.listViewInstance.fields.iconCss]) {
                let textContent: Element = element.querySelector('.' + classNames.textContent);
                let target: Element = this.listViewInstance.createElement('div', {
                    className: classNames.listIcon + ' ' +
                        (this.listViewInstance.curViewDS[index] as { [key: string]: Object; })[this.listViewInstance.fields.iconCss]
                });
                textContent.insertBefore(target, element.querySelector('.' + classNames.listItemText));
            }
        }
        if (this.listViewInstance.showCheckBox && this.listViewInstance.fields.groupBy) {
            if (!this.checkListWrapper) {
                this.checkListWrapper = this.listViewInstance.curUL.querySelector('.' + classNames.checkboxWrapper).cloneNode(true);
            }
            let textContent: Element = element.querySelector('.' + classNames.textContent);
            if ((this.listViewInstance.curViewDS[index] as { [key: string]: Object; }).isHeader) {
                if (element.querySelector('.' + classNames.checkboxWrapper)) {
                    element.classList.remove(classNames.checklist);
                    textContent.classList.remove(classNames.checkbox);
                    detach(element.querySelector('.' + classNames.checkboxWrapper));
                }
            } else {
                if (!element.querySelector('.' + classNames.checkboxWrapper)) {
                    element.classList.add(classNames.checklist);
                    textContent.classList.add(classNames.checkbox);
                    textContent.insertBefore(this.checkListWrapper.cloneNode(true), element.querySelector('.' + classNames.listItemText));
                }
            }
        }
    }
    private changeElementAttributes(element: Element, index: number): void {
        element.classList.remove(classNames.disable);
        if (this.uiIndices.disabledItemIndices.length && this.uiIndices.disabledItemIndices.indexOf(index) !== -1) {
            element.classList.add(classNames.disable);
        }
        (element as HTMLElement).style.display = '';
        if (this.uiIndices.hiddenItemIndices.length && this.uiIndices.hiddenItemIndices.indexOf(index) !== -1) {
            (element as HTMLElement).style.display = 'none';
        }
        if (this.listViewInstance.showCheckBox) {
            let checklistElement: Element = element.querySelector('.' + classNames.checkboxWrapper);
            element.classList.remove(classNames.selected);
            element.classList.remove(classNames.focused);
            if (checklistElement) {
                checklistElement.removeAttribute('aria-checked');
                checklistElement.firstElementChild.classList.remove(classNames.checked);
            }
            if (this.uiIndices.activeIndices.length && this.uiIndices.activeIndices.indexOf(index) !== -1 &&
                !this.listViewInstance.curUL.querySelector(classNames.selected)) {
                element.classList.add(classNames.selected);
                checklistElement.firstElementChild.classList.add(classNames.checked);
                checklistElement.setAttribute('aria-checked', 'true');
                if (this.activeIndex === index) {
                    element.classList.add(classNames.focused);
                }
            }
        } else {
            element.classList.remove(classNames.selected);
            element.removeAttribute('aria-selected');
            if (!isNullOrUndefined(this.activeIndex) && this.activeIndex === index &&
                !this.listViewInstance.curUL.querySelector(classNames.selected)) {
                element.classList.add(classNames.selected);
                element.setAttribute('aria-selected', 'true');
            }
        }
        if (this.listViewInstance.fields.groupBy) {
            if ((this.listViewInstance.curViewDS as { [key: string]: Object; }[])[index].isHeader) {
                if (element.classList.contains(classNames.listItem)) {
                    element.classList.remove(classNames.listItem);
                    element.setAttribute('role', 'group');
                    element.classList.add(classNames.groupListItem);
                }
            } else {
                if (element.classList.contains(classNames.groupListItem)) {
                    element.classList.remove(classNames.groupListItem);
                    element.setAttribute('role', 'listitem');
                    element.classList.add(classNames.listItem);
                }
            }
        }
    }

    private findDSAndIndexFromId(
        ds: { [key: string]: Object }[] | string[] | number[], fields: Fields | Element): { [key: string]: Object } {
        let resultJSON: { [key: string]: Object | number } = {};
        fields = this.listViewInstance.getElementUID(fields);
        if (!isNullOrUndefined(fields)) {
            (ds as { [key: string]: Object; }[]).some((data: { [key: string]: Object; }, index: number) => {
                if (((fields as { [key: string]: Object; })[this.listViewInstance.fields.id] &&
                    (fields as { [key: string]: Object; })[this.listViewInstance.fields.id].toString()
                    === (data[this.listViewInstance.fields.id] && data[this.listViewInstance.fields.id].toString())) || fields === data) {
                    resultJSON.index = index;
                    resultJSON.data = data;
                    return true;
                } else {
                    return false;
                }
            });
        }

        return resultJSON;
    }

    public getSelectedItems(): UISelectedItem {
        if (!isNullOrUndefined(this.activeIndex) || (this.listViewInstance.showCheckBox && this.uiIndices.activeIndices.length)) {
            let dataCollection: string[] | { [key: string]: Object; }[] = [];
            let textCollection: string[] = [];
            if (typeof (this.listViewInstance.dataSource as string[])[0] === 'string' ||
                typeof (this.listViewInstance.dataSource as number[])[0] === 'number') {
                let curViewDS: string[] | number[] = this.listViewInstance.curViewDS as string[] | number[];
                if (this.listViewInstance.showCheckBox) {
                    this.uiIndices.activeIndices.forEach((index: number) => {
                        (dataCollection as string[]).push((curViewDS as string[])[index]);
                    });
                    return {
                        text: dataCollection as string[],
                        data: dataCollection,
                        index: this.uiIndices.activeIndices.map((index: number) =>
                            (this.listViewInstance.dataSource as string[]).indexOf((curViewDS as string[])[index]))
                    };
                } else {
                    return {
                        text: curViewDS[this.activeIndex],
                        data: curViewDS[this.activeIndex],
                        index: (this.listViewInstance.dataSource as string[]).indexOf((curViewDS as string[])[this.activeIndex])
                    };
                }
            } else {
                let curViewDS: { [key: string]: Object | string }[] = this.listViewInstance.curViewDS as { [key: string]: Object; }[];
                let text: string = this.listViewInstance.fields.text;
                if (this.listViewInstance.showCheckBox) {
                    this.uiIndices.activeIndices.forEach((index: number) => {
                        textCollection.push((curViewDS[index] as { [key: string]: string; })[text]);
                        (dataCollection as { [key: string]: Object; }[]).push(curViewDS[index] as { [key: string]: Object });
                    });
                    return {
                        text: textCollection,
                        data: dataCollection,
                        index: this.uiIndices.activeIndices.map((index: number) =>
                            (this.listViewInstance.dataSource).indexOf(curViewDS[index] as { [key: string]: Object }))
                    };
                } else {
                    return {
                        text: curViewDS[this.activeIndex][this.listViewInstance.fields.text] as string,
                        data: curViewDS[this.activeIndex],
                        index: (this.listViewInstance.dataSource as { [key: string]: Object; }[]).indexOf(curViewDS[this.activeIndex])
                    };
                }
            }
        } else {
            return undefined;
        }
    }

    public selectItem(obj: Fields | HTMLElement | Element): void {
        let resutJSON: { [key: string]: Object | number } = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
        if (Object.keys(resutJSON).length) {
            let isSelected: boolean = this.activeIndex === resutJSON.index;
            let isChecked: boolean;
            this.activeIndex = resutJSON.index as number;
            if (this.listViewInstance.showCheckBox) {
                if (this.uiIndices.activeIndices.indexOf(resutJSON.index as number) === -1) {
                    isChecked = true;
                    this.uiIndices.activeIndices.push(resutJSON.index as number);
                } else {
                    isChecked = false;
                    this.uiIndices.activeIndices.splice(this.uiIndices.activeIndices.indexOf(resutJSON.index as number), 1);
                }
                if (this.listViewInstance.curUL.querySelector('.' + classNames.focused)) {
                    this.listViewInstance.curUL.querySelector('.' + classNames.focused).classList.remove(classNames.focused);
                }
            }
            if (this.listViewInstance.getLiFromObjOrElement(obj)) {
                if (this.listViewInstance.showCheckBox) {
                    this.listViewInstance.setCheckboxLI(this.listViewInstance.getLiFromObjOrElement(obj));
                } else {
                    this.listViewInstance.setSelectLI(this.listViewInstance.getLiFromObjOrElement(obj));
                }
            } else {
                let eventArgs: { [key: string]: Object; };
                if (typeof (this.listViewInstance.dataSource as string[])[0] === 'string' ||
                    typeof (this.listViewInstance.dataSource as number[])[0] === 'number') {
                    eventArgs = {
                        text: (this.listViewInstance.curViewDS as number[] | string[])[this.activeIndex],
                        data: (this.listViewInstance.curViewDS as number[] | string[])[this.activeIndex],
                        index: this.activeIndex
                    };
                } else {
                    let curViewDS: { [key: string]: Object; }[] = this.listViewInstance.curViewDS as { [key: string]: Object; }[];
                    eventArgs = {
                        text: curViewDS[this.activeIndex][this.listViewInstance.fields.text],
                        data: curViewDS[this.activeIndex],
                        index: this.activeIndex
                    };
                }
                if (this.listViewInstance.showCheckBox) {
                    eventArgs.isChecked = isChecked;
                    this.listViewInstance.trigger('select', eventArgs);
                } else if (!isSelected) {
                    this.listViewInstance.trigger('select', eventArgs);
                }
            }
        } else if (isNullOrUndefined(obj) && !this.listViewInstance.showCheckBox) {
            this.listViewInstance.removeSelect();
            this.activeIndex = undefined;
        }
    }

    public enableItem(obj: Fields | HTMLElement | Element): void {
        let resutJSON: { [key: string]: Object | number } = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
        if (Object.keys(resutJSON).length) {
            this.uiIndices.disabledItemIndices.splice(this.uiIndices.disabledItemIndices.indexOf(resutJSON.index as number), 1);
        }
    }

    public disableItem(obj: Fields | HTMLElement | Element): void {
        let resutJSON: { [key: string]: Object | number } = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
        if (Object.keys(resutJSON).length && this.uiIndices.disabledItemIndices.indexOf(resutJSON.index as number) === -1) {
            this.uiIndices.disabledItemIndices.push(resutJSON.index as number);
        }
    }

    public showItem(obj: Fields | HTMLElement | Element): void {
        let resutJSON: { [key: string]: Object | number } = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
        if (Object.keys(resutJSON).length) {
            this.uiIndices.hiddenItemIndices.splice(this.uiIndices.hiddenItemIndices.indexOf(resutJSON.index as number), 1);
        }
    }

    public hideItem(obj: Fields | HTMLElement | Element): void {
        let resutJSON: { [key: string]: Object | number } = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
        if (Object.keys(resutJSON).length && this.uiIndices.hiddenItemIndices.indexOf(resutJSON.index as number) === -1) {
            this.uiIndices.hiddenItemIndices.push(resutJSON.index as number);
        }
    }

    public removeItem(obj: HTMLElement | Element | Fields): void {
        let dataSource: { [key: string]: Object };
        let resutJSON: { [key: string]: Object | number } = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
        if (Object.keys(resutJSON).length) {
            dataSource = resutJSON.data as { [key: string]: Object };
            if (this.listViewInstance.curViewDS[(resutJSON.index as number) - 1] &&
                (this.listViewInstance.curViewDS as { [key: string]: Object; }[])[(resutJSON.index as number) - 1].isHeader &&
                (((this.listViewInstance.curViewDS as { [key: string]: Object; }[])[(resutJSON.index as number) - 1])
                    .items as { [key: string]: Object; }[]).length === 1) {
                this.removeUiItem((resutJSON.index as number) - 1);
                this.removeUiItem((resutJSON.index as number) - 1);
            } else {
                this.removeUiItem((resutJSON.index as number));
            }
        }
        let index: number = (this.listViewInstance.dataSource as { [key: string]: Object }[]).indexOf(dataSource);
        if (index !== -1) {
            (this.listViewInstance.dataSource as { [key: string]: Object }[]).splice(index, 1);
            this.listViewInstance.setViewDataSource(this.listViewInstance.dataSource as { [key: string]: Object }[]);
        }
    }
    public setCheckboxLI(li: HTMLElement | Element, e?: MouseEvent | KeyboardEvent | FocusEvent): void {
        let index: number = Array.prototype.indexOf.call(this.listViewInstance.curUL.querySelectorAll('li'), li) + this.uiFirstIndex;
        this.activeIndex = Array.prototype.indexOf.call(this.listViewInstance.curUL.querySelectorAll('li'), li) + this.uiFirstIndex;
        if (li.classList.contains(classNames.selected)) {
            if (this.uiIndices.activeIndices.indexOf(index) === -1) {
                this.uiIndices.activeIndices.push(index);
            }
        } else {
            this.uiIndices.activeIndices.splice(this.uiIndices.activeIndices.indexOf(index), 1);
        }
    }

    public setSelectLI(li: HTMLElement | Element, e?: MouseEvent | KeyboardEvent | FocusEvent): void {
        this.activeIndex = Array.prototype.indexOf.call(this.listViewInstance.curUL.querySelectorAll('li'), li) + this.uiFirstIndex;
    }
    public checkedItem(checked: boolean): void {
        if (checked) {
            this.uiIndices.activeIndices = [];
            this.activeIndex = undefined;
            (this.listViewInstance.curViewDS as { [key: string]: Object }[]).forEach((ds: { [key: string]: Object }, index: number) => {
                if (!ds.isHeader) {
                    this.uiIndices.activeIndices.push(index);
                }
            });

        } else {
            this.activeIndex = undefined;
            this.uiIndices.activeIndices = [];
        }

    }
    private addUiItem(index: number): void {
        let curViewDs: { [key: string]: Object }[] = this.listViewInstance.curViewDS as { [key: string]: Object }[];
        this.changeUiIndices(index, true);
        if (this.activeIndex && this.activeIndex >= index) {
            this.activeIndex++;
        }
        if (this.listViewInstance.showCheckBox &&
            (curViewDs[index] as { [key: string]: Object; })[this.listViewInstance.fields.isChecked]) {
            this.uiIndices.activeIndices.push(index);
        }
        if (!parseFloat(this.bottomElement.style.height) && !parseFloat(this.topElement.style.height)) {
            this.bottomElement.style.height = parseFloat(this.bottomElement.style.height) + this.listItemHeight + 'px';
        }
        if (parseFloat(this.bottomElement.style.height)) {
            let liItem: HTMLElement = this.listViewInstance.curUL.lastElementChild.previousSibling as HTMLElement;
            let target: HTMLElement = this.listViewInstance.getLiFromObjOrElement(curViewDs[index + 1]) ||
                this.listViewInstance.getLiFromObjOrElement(curViewDs[index + 2]);
            if (target) {
                this.bottomElement.style.height = parseFloat(this.bottomElement.style.height) + this.listItemHeight + 'px';
                this.updateUI(liItem, index, target);
            }
        } else {
            let liItem: HTMLElement = this.listViewInstance.curUL.firstElementChild.nextSibling as HTMLElement;
            let target: HTMLElement;
            if ((Object.keys(this.listViewInstance.curViewDS).length - 1) === index) {
                target = this.listViewInstance.curUL.lastElementChild as HTMLElement;
            } else {
                target = this.listViewInstance.getLiFromObjOrElement(curViewDs[index + 1]) ||
                    this.listViewInstance.getLiFromObjOrElement(curViewDs[index + 2]);
            }
            this.topElement.style.height = parseFloat(this.topElement.style.height) + this.listItemHeight + 'px';
            this.uiFirstIndex++;
            this.uiLastIndex++;
            if (target) {
                this.updateUI(liItem, index, target);
                this.listViewInstance.isWindow ? window.scrollTo(0, (pageYOffset + this.listItemHeight)) :
                    this.listViewInstance.element.scrollTop += this.listItemHeight;
            }
        }
        this.totalHeight += this.listItemHeight;
        this.listDiff = parseFloat(this.topElement.style.height) / this.listItemHeight;
    }

    private removeUiItem(index: number): void {
        this.totalHeight -= this.listItemHeight;
        let curViewDS: { [key: string]: Object } = (this.listViewInstance.curViewDS as { [key: string]: Object; }[])[index];
        let liItem: HTMLElement = this.listViewInstance.getLiFromObjOrElement(curViewDS);
        (this.listViewInstance.curViewDS as { [key: string]: Object; }[]).splice(index, 1);
        if (this.activeIndex && this.activeIndex >= index) {
            this.activeIndex--;
        }
        if (liItem) {
            if (this.domItemCount > Object.keys(this.listViewInstance.curViewDS).length) {
                detach(liItem);
                this.domItemCount--;
                this.uiLastIndex--;
                this.totalHeight = 0;
            } else {
                if (liItem.classList.contains(classNames.disable)) {
                    liItem.classList.remove(classNames.disable);
                    this.uiIndices.disabledItemIndices.splice(this.uiIndices.disabledItemIndices.indexOf(index), 1);
                }
                if (liItem.style.display === 'none') {
                    liItem.style.display = '';
                    this.uiIndices.hiddenItemIndices.splice(this.uiIndices.hiddenItemIndices.indexOf(index), 1);
                }
                if (this.listViewInstance.showCheckBox && liItem.classList.contains(classNames.selected)) {
                    this.listViewInstance.removeSelect();
                    this.uiIndices.activeIndices.splice(this.uiIndices.activeIndices.indexOf(index), 1);
                    let checklistElement: Element = liItem.querySelector('.' + classNames.checkboxWrapper);
                    checklistElement.removeAttribute('aria-checked');
                    checklistElement.firstElementChild.classList.remove(classNames.checked);
                    if (liItem.classList.contains(classNames.focused)) {
                        liItem.classList.remove(classNames.focused);
                        this.activeIndex = undefined;
                    }
                } else if (liItem.classList.contains(classNames.selected)) {
                    this.listViewInstance.removeSelect();
                    this.activeIndex = undefined;
                }
                if (!parseFloat(this.bottomElement.style.height) && !parseFloat(this.topElement.style.height)) {
                    this.updateUI(liItem, this.uiLastIndex, this.bottomElement);
                } else if (parseFloat(this.bottomElement.style.height)) {
                    this.bottomElement.style.height = parseFloat(this.bottomElement.style.height) - this.listItemHeight + 'px';
                    this.updateUI(liItem, this.uiLastIndex, this.bottomElement);
                } else {
                    this.topElement.style.height = parseFloat(this.topElement.style.height) - this.listItemHeight + 'px';
                    this.updateUI(liItem, (this.uiFirstIndex - 1), this.topElement.nextSibling as HTMLElement);
                    this.uiLastIndex--;
                    this.uiFirstIndex--;
                }
            }
        }
        this.changeUiIndices(index, false);
        this.listDiff = parseFloat(this.topElement.style.height) / this.listItemHeight;
    }

    private changeUiIndices(index: number, increment: boolean): void {
        Object.keys(this.uiIndices).forEach((key: string) => {
            this.uiIndices[key] = this.uiIndices[key].map((i: number) => {
                if (i >= index) {
                    return increment ? ++i : --i;
                } else {
                    return i;
                }
            });
        });
    }

    public addItem(data: { [key: string]: Object }[], fields: Fields): void {
        data.forEach((dataSource: { [key: string]: Object; }) => {
            (this.listViewInstance.dataSource as { [key: string]: Object; }[]).push(dataSource);
            this.listViewInstance.setViewDataSource(this.listViewInstance.dataSource as { [key: string]: Object; }[]);
            if (!this.domItemCount) {
                this.uiVirtualization();
            } else if (this.domItemCount < this.expectedDomItemCount) {
                this.wireScrollEvent(true);
                detach(this.listViewInstance.contentContainer);
                this.uiVirtualization();
            } else {
                let index: number = (this.listViewInstance.curViewDS as { [key: string]: Object; }[]).indexOf(dataSource);
                this.addUiItem(index);
                let curViewDS: { [key: string]: Object; } = (this.listViewInstance.curViewDS as { [key: string]: Object; }[])[index - 1];
                if (curViewDS && curViewDS.isHeader && (curViewDS.items as { [key: string]: Object; }[]).length === 1) {
                    this.addUiItem(index - 1);
                }
            }
        });
    }
    public createUIItem(args: ItemCreatedArgs): void {
        let template: HTMLElement = this.listViewInstance.createElement('div');
        let commonTemplate: string = '<div class="e-text-content" role="presentation"> ' +
            '<span class="e-list-text"> ${' + this.listViewInstance.fields.text + '} </span></div>';
        template.innerHTML = this.listViewInstance.template || commonTemplate;
        let templateElements: NodeList = template.getElementsByTagName('*');
        let groupTemplate: HTMLElement = this.listViewInstance.createElement('div');
        if (this.listViewInstance.fields.groupBy) {
            groupTemplate.innerHTML = this.listViewInstance.groupTemplate || commonTemplate;
        }
        let groupTemplateElements: NodeList = groupTemplate.getElementsByTagName('*');
        if (args.curData.isHeader) {
            this.headerData = args.curData;
        }
        this.templateData = args.curData.isHeader ? (args.curData as { [key: string]: Object[]; }).items[0] as { [key: string]: Object } :
            args.curData;
        args.item.innerHTML = '';
        (<ElementContext>args.item).context = { data: args.curData, nodes: { flatTemplateNodes: [], groupTemplateNodes: [] } };
        for (let i: number = 0; i < templateElements.length; i++) {
            this.compileTemplate(templateElements[i] as HTMLElement, args.item, false);
        }
        for (let i: number = 0; i < groupTemplateElements.length; i++) {
            this.compileTemplate(groupTemplateElements[i] as HTMLElement, args.item, true);
        }
        (<ElementContext>args.item).context.template = args.curData.isHeader ? template.firstElementChild :
            groupTemplate.firstElementChild;
        (<ElementContext>args.item).context.type = args.curData.isHeader ? 'flatList' : 'groupList';
        let element: HTMLElement = args.curData.isHeader ? groupTemplate : template;
        args.item.insertBefore(element.firstElementChild, null);
    }

    private compileTemplate(element: HTMLElement, item: HTMLElement, isHeader: boolean): void {
        this.textProperty(element, item, isHeader);
        this.classProperty(element, item, isHeader);
        this.attributeProperty(element, item, isHeader);
    }

    private onChange(newData: { [key: string]: Object }, listElement: HTMLElement): void {
        (<ElementContext>listElement).context.data = newData;
        let groupTemplateNodes: Object[] = ((<ElementContext>listElement).context.nodes as { [key: string]: Object[] }).groupTemplateNodes;
        let flatTemplateNodes: Object[] = ((<ElementContext>listElement).context.nodes as { [key: string]: Object[] }).flatTemplateNodes;
        if (!isNullOrUndefined(newData.isHeader) && newData.isHeader && (<ElementContext>listElement).context.type === 'groupList') {
            let element: HTMLElement = listElement.firstElementChild as HTMLElement;
            detach(listElement.firstElementChild);
            listElement.insertBefore((<ElementContext>listElement).context.template as HTMLElement, null);
            (<ElementContext>listElement).context.template = element;
            (<ElementContext>listElement).context.type = 'flatList';
            groupTemplateNodes.forEach((node: { [key: string]: Function }) => node.onChange(newData));
        } else if (!newData.isHeader && (<ElementContext>listElement).context.type === 'flatList') {
            let element: HTMLElement = listElement.firstElementChild as HTMLElement;
            detach(listElement.firstElementChild);
            listElement.insertBefore((<ElementContext>listElement).context.template as HTMLElement, null);
            (<ElementContext>listElement).context.template = element;
            (<ElementContext>listElement).context.type = 'groupList';
            flatTemplateNodes.forEach((node: { [key: string]: Function }) => node.onChange(newData));
        } else if (!newData.isHeader) {
            flatTemplateNodes.forEach((node: { [key: string]: Function }) => node.onChange(newData));
        } else {
            groupTemplateNodes.forEach((node: { [key: string]: Function }) => node.onChange(newData));
        }
    }

    private updateContextData(listElement: HTMLElement, node: { [key: string]: string | Function | string[] }, isHeader: Boolean): void {
        if (isHeader) {
            ((<ElementContext>listElement).context.nodes as { [key: string]: Object[] }).groupTemplateNodes.push(node);
        } else {
            ((<ElementContext>listElement).context.nodes as { [key: string]: Object[] }).flatTemplateNodes.push(node);
        }
    }
    private classProperty(element: HTMLElement, listElement: HTMLElement, isHeader: Boolean): void {
        let regex: RegExp = new RegExp('\\${([^}]*)}', 'g');
        let resultantOutput: RegExpExecArray[] = [];
        let regexMatch: RegExpExecArray;
        while (regexMatch !== null) {
            let match: RegExpExecArray = regex.exec(element.className);
            resultantOutput.push(match);
            regexMatch = match;
            if (regexMatch === null) {
                resultantOutput.pop();
            }
        }
        if (resultantOutput && resultantOutput.length) {
            resultantOutput.forEach((classNameMatch: RegExpExecArray) => {
                let classFunction: Function;
                if (classNameMatch[1].indexOf('?') !== -1 && classNameMatch[1].indexOf(':') !== -1) {
                    // tslint:disable-next-line:no-function-constructor-with-string-args
                    classFunction = new Function('data', 'return ' + classNameMatch[1].replace(/\$/g, 'data.'));
                } else {
                    // tslint:disable-next-line:no-function-constructor-with-string-args
                    classFunction = new Function('data', 'return ' + 'data.' + classNameMatch[1]);
                }
                let subNode: { [key: string]: string | Function } = {};
                if (isHeader) {
                    subNode.bindedvalue = classFunction(this.headerData);
                } else {
                    subNode.bindedvalue = classFunction(this.templateData);
                }
                subNode.onChange = (value: { [key: string]: Object }) => {
                    element.classList.remove(subNode.bindedvalue as string);
                    element.classList.add(classFunction(value));
                    subNode.bindedvalue = classFunction(value);
                };
                classNameMatch[0].split(' ').forEach((className: string) => {
                    element.classList.remove(className);
                });
                element.classList.add(subNode.bindedvalue as string);
                this.updateContextData(listElement, subNode, isHeader);
            });
        }
    }
    private attributeProperty(element: HTMLElement, listElement: HTMLElement, isHeader: Boolean): void {
        let attributeNames: string[] = [];
        for (let i: number = 0; i < element.attributes.length; i++) {
            attributeNames.push(element.attributes[i].nodeName);
        }
        if (attributeNames.indexOf('class') !== -1) {
            attributeNames.splice(attributeNames.indexOf('class'), 1);
        }
        attributeNames.forEach((attributeName: string) => {
            let attrNameMatch: RegExpExecArray | string[] = new RegExp('\\${([^}]*)}', 'g').exec(attributeName) || [];
            let attrValueMatch: RegExpExecArray | string[] = new RegExp('\\${([^}]*)}', 'g').exec(element.getAttribute(attributeName))
                || [];
            let attributeNameFunction: Function;
            let attributeValueFunction: Function;
            if (attrNameMatch.length || attrValueMatch.length) {
                if (attrNameMatch[1]) {
                    // tslint:disable-next-line:no-function-constructor-with-string-args
                    attributeNameFunction = new Function('data', 'return ' + 'data.' + attrNameMatch[1]);
                }
                if (attrValueMatch[1]) {
                    if (attrValueMatch[1].indexOf('?') !== -1 && attrValueMatch[1].indexOf(':') !== -1) {
                        // tslint:disable-next-line:no-function-constructor-with-string-args
                        attributeValueFunction = new Function('data', 'return ' + attrValueMatch[1].replace(/\$/g, 'data.'));
                    } else {
                        // tslint:disable-next-line:no-function-constructor-with-string-args
                        attributeValueFunction = new Function('data', 'return ' + 'data.' + attrValueMatch[1]);
                    }
                }
                let subNode: { [key: string]: string[] | Function | string } = {};
                if (isHeader) {
                    subNode.bindedvalue = [attrNameMatch[1] === undefined ? undefined : attributeNameFunction(this.headerData),
                    attrValueMatch[1] === undefined ? undefined : attributeValueFunction(this.headerData)];
                } else {
                    subNode.bindedvalue = [attrNameMatch[1] === undefined ? undefined : attributeNameFunction(this.templateData),
                    attrValueMatch[1] === undefined ? undefined : attributeValueFunction(this.templateData)];
                }
                subNode.attrName = (subNode.bindedvalue as string[])[0] === undefined ?
                    attributeName : (subNode.bindedvalue as string[])[0];
                subNode.onChange = (value: { [key: string]: Object }) => {
                    let bindedvalue: string = (subNode.bindedvalue as string[])[1] === undefined ?
                        element.getAttribute(subNode.attrName as string) : attributeValueFunction(value);
                    element.removeAttribute(subNode.attrName as string);
                    subNode.attrName = (subNode.bindedvalue as string[])[0] === undefined ? subNode.attrName : attributeNameFunction(value);
                    element.setAttribute(subNode.attrName as string, bindedvalue);
                    subNode.bindedvalue = [(subNode.bindedvalue as string[])[0] === undefined ? undefined : attributeNameFunction(value),
                    (subNode.bindedvalue as string[])[1] === undefined ? undefined : attributeValueFunction(value)];
                };
                let attributeValue: string = (subNode.bindedvalue as string[])[1] === undefined ? element.getAttribute(attributeName) :
                    (subNode.bindedvalue as string[])[1];
                element.removeAttribute(attributeName as string);
                element.setAttribute(subNode.attrName as string, attributeValue as string);
                this.updateContextData(listElement, subNode, isHeader);
            }
        });

    }

    private textProperty(element: HTMLElement, listElement: HTMLElement, isHeader: Boolean): void {
        let regex: RegExp = new RegExp('\\${([^}]*)}', 'g');
        let resultantOutput: RegExpExecArray[] = [];
        let regexMatch: RegExpExecArray;
        while (regexMatch !== null) {
            let match: RegExpExecArray = regex.exec(element.innerText);
            resultantOutput.push(match);
            regexMatch = match;
            if (regexMatch === null) {
                resultantOutput.pop();
            }
        }
        let isChildHasTextContent: boolean = Array.prototype.some.call(element.children, (element: HTMLElement) => {
            if (new RegExp('\\${([^}]*)}', 'g').exec(element.innerText)) {
                return true;

            } else {
                return false;
            }
        });
        if (resultantOutput && resultantOutput.length && !isChildHasTextContent) {
            resultantOutput.forEach((textPropertyMatch: RegExpExecArray) => {
                let subNode: { [key: string]: string | Function } = {};
                let textFunction: Function;
                if (textPropertyMatch[1].indexOf('?') !== -1 && textPropertyMatch[1].indexOf(':') !== -1) {
                    // tslint:disable-next-line:no-function-constructor-with-string-args
                    textFunction = new Function('data', 'return ' + textPropertyMatch[1].replace(/\$/g, 'data.'));
                } else {
                    // tslint:disable-next-line:no-function-constructor-with-string-args
                    textFunction = new Function('data', 'return ' + 'data.' + textPropertyMatch[1]);
                }
                if (isHeader) {
                    subNode.bindedvalue = textFunction(this.headerData);
                } else {
                    subNode.bindedvalue = textFunction(this.templateData);
                }
                subNode.onChange = (value: { [key: string]: Object }) => {
                    element.innerText = element.innerText.replace(subNode.bindedvalue as string, textFunction(value));
                    subNode.bindedvalue = textFunction(value);
                };
                element.innerText = element.innerText.replace(textPropertyMatch[0], subNode.bindedvalue as string);
                this.updateContextData(listElement, subNode, isHeader);
            });
        }
    }

    public reRenderUiVirtualization(): void {
        this.wireScrollEvent(true);
        if (this.listViewInstance.contentContainer) {
            detach(this.listViewInstance.contentContainer);
        }
        this.listViewInstance.preRender();
        this.listViewInstance.localData = this.listViewInstance.dataSource;
        this.listViewInstance.renderList();
    }

    private updateUI(element: HTMLElement, index: number, targetElement?: HTMLElement): void {
        let onChange: Function = this.isNgTemplate() ? this.onNgChange : this.onChange;
        if (this.listViewInstance.template || this.listViewInstance.groupTemplate) {
            let curViewDS: { [key: string]: Object } = (this.listViewInstance.curViewDS as { [key: string]: Object }[])[index];
            element.dataset.uid = curViewDS[this.listViewInstance.fields.id] ?
                curViewDS[this.listViewInstance.fields.id].toString() : ListBase.generateId();
            onChange(curViewDS, element);
        } else {
            this.updateUiContent(element, index);
        }
        this.changeElementAttributes(element, index);
        if (targetElement) {
            this.listViewInstance.ulElement.insertBefore(element, targetElement);
        }
    }

    private onNgChange(newData: { [key: string]: Object }, listElement: ElementContext): void {
        listElement.context.$implicit = newData;
    }
    public getModuleName(): string {
        return 'virtualization';
    }

    public destroy(): void {
        this.wireScrollEvent(true);
    }

}
