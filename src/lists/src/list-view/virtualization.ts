import { ListView, ItemCreatedArgs, classNames, Fields, UISelectedItem, SelectEventArgs } from './list-view';
import { EventHandler, append, isNullOrUndefined, detach, compile, formatUnit, select } from '@syncfusion/ej2-base';
import { ListBase } from '../common/list-base';
import { DataManager } from '@syncfusion/ej2-data';

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * ElementContext
 */
export interface ElementContext extends HTMLElement {
    context: { [key: string]: string | object };
}

const listElementCount: number = 1.5;
const windowElementCount: number = 3;

export class Virtualization {
    constructor(instance: ListView) {
        this.listViewInstance = instance;
    }

    private listViewInstance: any;
    private templateData: DataSource;
    private topElementHeight: number;
    private bottomElementHeight: number;
    public listItemHeight: number;
    private domItemCount: number;
    private expectedDomItemCount: number;
    private scrollPosition: number;
    private onVirtualScroll: EventListener;
    private updateUl: EventListener;
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
    private elementDifference: number = 0;

    /**
     * For internal use only.
     *
     * @private
     */

    public isNgTemplate(): boolean {
        return !isNullOrUndefined(this.listViewInstance.templateRef) && typeof this.listViewInstance.templateRef !== 'string';
    }

    /**
     * Checks if the platform is a Vue and its template property is a function type.
     *
     * @returns {boolean} indicating the result of the check
     */

    private isVueFunctionTemplate(): boolean {
        return this.listViewInstance.isVue && typeof this.listViewInstance.template === 'function';
    }

    /**
     * For internal use only.
     *
     * @private
     */

    public uiVirtualization(): void {
        this.wireScrollEvent(false);
        const curViewDS: { [key: string]: object; }[] = this.listViewInstance.curViewDS as { [key: string]: object; }[];
        const isRendered: boolean = this.listViewInstance.isRendered;
        const firstIndex: number = isRendered && !isNullOrUndefined(this.uiFirstIndex) && this.uiLastIndex <= Object.keys(curViewDS).length
            ? this.uiFirstIndex : 0;
        const firstDs: { [key: string]: object }[] = curViewDS.slice(firstIndex, firstIndex + 1);
        this.listViewInstance.ulElement = this.listViewInstance.curUL = ListBase.createList(
            this.listViewInstance.createElement, firstDs as { [key: string]: object; }[],
            this.listViewInstance.listBaseOption, null, this.listViewInstance);
        this.listViewInstance.contentContainer = this.listViewInstance.createElement('div', { className: classNames.container });
        this.listViewInstance.element.appendChild(this.listViewInstance.contentContainer);
        this.listViewInstance.contentContainer.appendChild(this.listViewInstance.ulElement);
        this.listItemHeight = this.listViewInstance.ulElement.firstElementChild.getBoundingClientRect().height;
        this.expectedDomItemCount = this.ValidateItemCount(10000);
        this.updateDOMItemCount();
        const lastIndex: number = isRendered && !isNullOrUndefined(this.uiLastIndex) && this.listDiff !== 0
            ? this.uiLastIndex : this.domItemCount - 1;
        this.uiFirstIndex = firstIndex;
        this.uiLastIndex = lastIndex;
        const otherDs: { [key: string]: object; }[] = curViewDS.slice(firstIndex + 1, lastIndex + 1);
        const listItems: HTMLElement[] = ListBase.createListItemFromJson(
            this.listViewInstance.createElement, otherDs as { [key: string]: object; }[],
            this.listViewInstance.listBaseOption, null, null, this.listViewInstance);
        append(listItems, this.listViewInstance.ulElement);
        this.listViewInstance.liCollection = <HTMLElement[] & NodeListOf<HTMLLIElement>>
            this.listViewInstance.curUL.querySelectorAll('li');
        this.topElement = this.listViewInstance.createElement('div');
        this.listViewInstance.ulElement.insertBefore(this.topElement, this.listViewInstance.ulElement.firstElementChild);
        this.bottomElement = this.listViewInstance.createElement('div');
        this.listViewInstance.ulElement.insertBefore(this.bottomElement, null);
        this.totalHeight = (Object.keys(curViewDS).length * this.listItemHeight) - (this.domItemCount * this.listItemHeight);
        this.topElement.style.height = isRendered ? this.topElementHeight + 'px' : '0px';
        this.bottomElement.style.height = isRendered ? (this.totalHeight - this.topElementHeight) + 'px' : this.totalHeight + 'px';
        this.topElementHeight = isRendered ? this.topElementHeight : 0;
        this.bottomElementHeight = isRendered ? (this.totalHeight - this.topElementHeight) : this.totalHeight;
        this.listDiff = isRendered && Object.keys(curViewDS).length !== this.domItemCount ? this.listDiff : 0;
        if (isRendered) {
            this.listViewInstance.element.scrollTop = this.listViewInstance.previousScrollTop;
        }
        this.uiIndicesInitialization();
    }

    private wireScrollEvent(destroy: boolean): void {
        if (!destroy) {
            if (this.listViewInstance.isWindow) {
                this.onVirtualScroll = this.onVirtualUiScroll.bind(this);
                window.addEventListener('scroll', this.onVirtualScroll);
            } else {
                EventHandler.add(this.listViewInstance.element, 'scroll', this.onVirtualUiScroll, this);
            }
        } else {
            if (this.listViewInstance.isWindow === true) {
                window.removeEventListener('scroll', this.onVirtualScroll);
                window.removeEventListener('scroll', this.updateUl);
            }
            else {
                EventHandler.remove(this.listViewInstance.element, 'scroll', this.onVirtualUiScroll);
            }
        }
    }

    private ValidateItemCount(dataSourceLength: number): number {
        const height: number = parseFloat(formatUnit(this.listViewInstance.height));
        let itemCount: number;
        if (this.listViewInstance.isWindow) {
            itemCount = Math.round((window.innerHeight / this.listItemHeight) * windowElementCount);
        } else {
            if (typeof this.listViewInstance.height === 'string' && this.listViewInstance.height.indexOf('%') !== -1) {
                itemCount = Math.round(
                    (this.listViewInstance.element.getBoundingClientRect().height / this.listItemHeight) * listElementCount);
            } else {
                itemCount = Math.round((height / this.listItemHeight) * listElementCount);
            }
        }
        if (itemCount > dataSourceLength) {
            itemCount = dataSourceLength;
        }
        return itemCount;
    }

    public updateDOMItemCount(): void {
        this.domItemCount = this.ValidateItemCount(Object.keys(this.listViewInstance.curViewDS).length);
    }

    private uiIndicesInitialization(): void {
        this.uiIndices = { 'activeIndices': [], 'disabledItemIndices': [], 'hiddenItemIndices': [] };
        const data: DataSource[] = this.listViewInstance.curViewDS as DataSource[];
        for (let i: number = 0; i < data.length; i++) {
            if (this.listViewInstance.showCheckBox && data[i as number][this.listViewInstance.fields.isChecked]) {
                this.uiIndices.activeIndices.push(i);
            }
            if (!isNullOrUndefined((data[parseInt(i.toString(), 10)] as {[key: string]: object; })[this.listViewInstance.fields.enabled]) &&
                !data[i as number][this.listViewInstance.fields.enabled]) {
                (this.uiIndices.disabledItemIndices.push(i)) as number;
            }
        }
        if (this.isNgTemplate()) {
            const items: ElementContext[] = this.listViewInstance.element.querySelectorAll('.' + classNames.listItem);
            for (let index: number = 0; index < items.length; index++) {
                items[index as number].context = this.listViewInstance.viewContainerRef.get(index).context;
            }
        }
    }

    public refreshItemHeight(): void {
        if (this.listViewInstance.curViewDS.length) {
            const curViewDS: { [key: string]: object; }[] = this.listViewInstance.curViewDS as { [key: string]: object; }[];
            this.listItemHeight = (this.topElement.nextSibling as HTMLElement).getBoundingClientRect().height;
            this.totalHeight = (Object.keys(curViewDS).length * this.listItemHeight) - (this.domItemCount * this.listItemHeight);
            this.bottomElementHeight = this.totalHeight;
            this.bottomElement.style.height = this.totalHeight + 'px';
        }
    }

    private getscrollerHeight(startingHeight: number): number {
        return this.listViewInstance.isWindow ? (((pageYOffset - startingHeight) <= 0) ? 0 :
            (pageYOffset - startingHeight)) : ((this.listViewInstance.element.scrollTop - startingHeight) <= 0) ? 0 :
            (this.listViewInstance.element.scrollTop - startingHeight);
    }

    private onVirtualUiScroll(): void {
        let startingHeight: number;
        const curViewDS: { [key: string]: object; }[] = this.listViewInstance.curViewDS as { [key: string]: object; }[];
        this.listItemHeight = select('.e-list-item', this.listViewInstance.element).getBoundingClientRect().height;
        this.totalHeight = (Object.keys(curViewDS).length * this.listItemHeight) - (this.domItemCount * this.listItemHeight);
        if (this.listViewInstance.isWindow) {
            startingHeight = this.listViewInstance.ulElement.getBoundingClientRect().top -
                document.documentElement.getBoundingClientRect().top;
        } else {
            startingHeight = this.listViewInstance.headerEle ? this.listViewInstance.headerEle.getBoundingClientRect().height : 0;
        }
        this.scrollPosition = isNullOrUndefined(this.scrollPosition) ? 0 : this.scrollPosition;
        const scroll: number = this.getscrollerHeight(startingHeight);
        this.topElementHeight = this.listItemHeight * Math.floor(scroll / this.listItemHeight);
        this.bottomElementHeight = this.totalHeight - this.topElementHeight;
        [this.topElementHeight, this.bottomElementHeight] = scroll <= this.totalHeight ?
            [this.topElementHeight, this.bottomElementHeight] : [this.totalHeight, 0];
        if (this.topElementHeight !== parseFloat(this.topElement.style.height)) {
            this.topElement.style.height = this.topElementHeight + 'px';
            this.bottomElement.style.height = this.bottomElementHeight + 'px';
            if (scroll > this.scrollPosition) {
                const listDiff: number = Math.round(((this.topElementHeight / this.listItemHeight) - this.listDiff));
                if (listDiff > (this.expectedDomItemCount + 5)) {
                    this.onLongScroll(listDiff, true);
                } else {
                    this.onNormalScroll(listDiff, true);
                }
            } else {
                const listDiff: number = Math.round((this.listDiff - (this.topElementHeight / this.listItemHeight)));
                if (listDiff > (this.expectedDomItemCount + 5)) {
                    this.onLongScroll(listDiff, false);
                } else {
                    this.onNormalScroll(listDiff, false);
                }
            }
        }
        this.listDiff = Math.round(this.topElementHeight / this.listItemHeight);
        if (typeof this.listViewInstance.onUIScrolled === 'function') {
            this.listViewInstance.onUIScrolled();
        }
        this.scrollPosition = scroll;
    }

    private onLongScroll(listDiff: number, isScrollingDown: boolean): void {
        let index: number = isScrollingDown ? (this.uiFirstIndex + listDiff) : (this.uiFirstIndex - listDiff);
        const elements: HTMLElement[] = this.listViewInstance.ulElement.querySelectorAll('li');
        for (let i: number = 0; i < elements.length; i++) {
            this.updateUI(elements[i as number], index);
            index++;
        }
        this.uiLastIndex = isScrollingDown ? (this.uiLastIndex + listDiff) : (this.uiLastIndex - listDiff);
        this.uiFirstIndex = isScrollingDown ? (this.uiFirstIndex + listDiff) : (this.uiFirstIndex - listDiff);
    }

    private onNormalScroll(listDiff: number, isScrollingDown: boolean): void {
        if (isScrollingDown) {
            for (let i: number = 0; i < listDiff; i++) {
                const index: number = ++this.uiLastIndex;
                this.updateUI(this.topElement.nextElementSibling as HTMLElement, index, this.bottomElement);
                this.uiFirstIndex++;
            }
        } else {
            for (let i: number = 0; i < listDiff; i++) {
                const index: number = --this.uiFirstIndex;
                const target: HTMLElement = this.topElement.nextSibling as HTMLElement;
                this.updateUI(this.bottomElement.previousElementSibling as HTMLElement, index, target);
                this.uiLastIndex--;
            }
        }
    }

    private updateUiContent(element: HTMLElement, index: number): void {
        const curViewDs: { [key: string]: Object; }[] = this.listViewInstance.curViewDS as DataSource[];
        if (typeof (this.listViewInstance.dataSource as string[])[0] === 'string' ||
            typeof (this.listViewInstance.dataSource as number[])[0] === 'number') {
            element.dataset.uid = ListBase.generateId();
            element.getElementsByClassName(classNames.listItemText)[0].innerHTML =
                (this.listViewInstance.curViewDS as string[] | number[])[index as number].toString();
        } else {
            element.dataset.uid = (curViewDs[parseInt(index.toString(), 10)][this.listViewInstance.fields.id]) as string ?
                (curViewDs[parseInt(index.toString(), 10)][this.listViewInstance.fields.id]) as string : (ListBase.generateId() as string);
            element.getElementsByClassName(classNames.listItemText)[0].innerHTML =
                (curViewDs[parseInt(index.toString(), 10)][this.listViewInstance.fields.text]) as string;
        }
        if (this.listViewInstance.showIcon) {
            if (element.querySelector('.' + classNames.listIcon)) {
                detach(element.querySelector('.' + classNames.listIcon));
            }
            if ((this.listViewInstance.curViewDS[index as number] as { [key: string]: object; })[this.listViewInstance.fields.iconCss]) {
                const textContent: Element = element.querySelector('.' + classNames.textContent);
                const curViewDS: { [key: string]: object; } =
                    this.listViewInstance.curViewDS[index as number] as { [key: string]: object; };
                const iconCss: string = curViewDS[this.listViewInstance.fields.iconCss].toString();
                const target: Element = this.listViewInstance.createElement('div', {
                    className: classNames.listIcon + ' ' + iconCss
                });
                textContent.insertBefore(target, element.querySelector('.' + classNames.listItemText));
            }
        }
        if (this.listViewInstance.showCheckBox && this.listViewInstance.fields.groupBy) {
            if (!this.checkListWrapper) {
                this.checkListWrapper = this.listViewInstance.curUL.querySelector('.' + classNames.checkboxWrapper).cloneNode(true);
            }
            const textContent: Element = element.querySelector('.' + classNames.textContent);
            if ((this.listViewInstance.curViewDS[index as number] as { [key: string]: object; }).isHeader) {
                if (element.querySelector('.' + classNames.checkboxWrapper)) {
                    element.classList.remove(classNames.checklist);
                    textContent.classList.remove(classNames.checkbox);
                    detach(element.querySelector('.' + classNames.checkboxWrapper));
                }
            } else {
                if (!element.querySelector('.' + classNames.checkboxWrapper)) {
                    element.classList.add(classNames.checklist);
                    textContent.classList.add(classNames.checkbox);
                    if (this.listViewInstance.checkBoxPosition === 'Left') {
                        textContent.classList.add('e-checkbox-left');
                    }
                    else {
                        textContent.classList.add('e-checkbox-right');
                    }
                    textContent.append(this.checkListWrapper.cloneNode(true));
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
            const checklistElement: Element = element.querySelector('.' + classNames.checkboxWrapper);
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
            if ((this.listViewInstance.curViewDS as { [key: string]: object; }[])[index as number].isHeader) {
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
        ds: DataSource[] | string[] | number[], fields: Fields | Element): DataSource {
        const resultJSON: { [key: string]: object | number } = {};
        fields = this.listViewInstance.getElementUID(fields);
        if (!isNullOrUndefined(fields)) {
            (ds as { [key: string]: object; }[]).some((data: { [key: string]: object; }, index: number) => {
                if (((fields as { [key: string]: object; })[this.listViewInstance.fields.id] &&
                    (fields as { [key: string]: object; })[this.listViewInstance.fields.id]
                    === (data[this.listViewInstance.fields.id] && data[this.listViewInstance.fields.id] as object) || fields === data)) {
                    resultJSON.index = index;
                    resultJSON.data = data;
                    return true;
                } else {
                    return false;
                }
            });
        }

        return resultJSON as DataSource;
    }

    public getSelectedItems(): UISelectedItem {
        if (!isNullOrUndefined(this.activeIndex) || (this.listViewInstance.showCheckBox && this.uiIndices.activeIndices.length)) {
            const dataCollection: string[] | { [key: string]: object; }[] = [];
            const textCollection: string[] = [];
            if (typeof (this.listViewInstance.dataSource as string[])[0] === 'string' ||
                typeof (this.listViewInstance.dataSource as number[])[0] === 'number') {
                const curViewDS: string[] | number[] = this.listViewInstance.curViewDS as string[] | number[];
                if (this.listViewInstance.showCheckBox) {
                    const indices: number[] = this.uiIndices.activeIndices;
                    for (let i: number = 0; i < indices.length; i++) {
                        (dataCollection as string[]).push((curViewDS as string[])[indices[i as number]]);
                    }
                    return {
                        text: dataCollection as string[],
                        data: dataCollection as string | number | string[] | number[] | {
                            [key: string]: object;
                        } | {
                            [key: string]: object;
                        }[],
                        index: this.uiIndices.activeIndices.map((index: number) =>
                            (this.listViewInstance.dataSource as string[]).indexOf((curViewDS as string[])[index as number]))
                    };
                } else {
                    return {
                        text: curViewDS[this.activeIndex],
                        data: curViewDS[this.activeIndex],
                        index: (this.listViewInstance.dataSource as string[]).indexOf((curViewDS as string[])[this.activeIndex])
                    };
                }
            } else {
                const curViewDS: { [key: string]: object | string }[] = this.listViewInstance.curViewDS as { [key: string]: object; }[];
                const text: string = this.listViewInstance.fields.text;
                if (this.listViewInstance.showCheckBox) {
                    const indexArray: number[] = this.uiIndices.activeIndices;
                    for (let i: number = 0; i < indexArray.length; i++) {
                        textCollection.push((curViewDS[indexArray[i as number]] as { [key: string]: string; })[`${text}`]);
                        (dataCollection as { [key: string]: Object; }[]).push(
                            curViewDS[indexArray[parseInt(i.toString(), 10)]] as DataSource);
                    }
                    const dataSource: { [key: string]: Object; }[] =
                        this.listViewInstance.dataSource instanceof DataManager
                            ? curViewDS : this.listViewInstance.dataSource;
                    return {
                        text: textCollection,
                        data: dataCollection as string | number | number[] | string[] | { [key: string]: object; } |
                        { [key: string]: object; }[],
                        index: this.uiIndices.activeIndices.map((index: number) =>
                            dataSource.indexOf(curViewDS[index as number] as DataSource))
                    };
                } else {
                    const dataSource: { [key: string]: Object; }[] =
                        this.listViewInstance.dataSource instanceof DataManager
                            ? curViewDS : this.listViewInstance.dataSource;
                    return {
                        text: curViewDS[this.activeIndex][this.listViewInstance.fields.text] as string,
                        data: curViewDS[this.activeIndex] as string | number | number[] | string[] | { [key: string]: object; } |
                        { [key: string]: object; }[],
                        index: dataSource.indexOf(curViewDS[this.activeIndex])
                    };
                }
            }
        } else {
            return undefined;
        }
    }

    public selectItem(obj: Fields | HTMLElement | Element): void {
        const resutJSON: { [key: string]: object | number } = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
        if (Object.keys(resutJSON).length) {
            const isSelected: boolean = this.activeIndex === resutJSON.index;
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
                    const curViewDS: { [key: string]: object; }[] = this.listViewInstance.curViewDS as { [key: string]: object; }[];
                    eventArgs = {
                        text: curViewDS[this.activeIndex][this.listViewInstance.fields.text],
                        data: curViewDS[this.activeIndex],
                        index: this.activeIndex
                    };
                }
                if (this.listViewInstance.showCheckBox) {
                    this.listViewInstance.trigger('select', eventArgs, (observedArgs: SelectEventArgs) => {
                        if (observedArgs.cancel) {
                            if (!isChecked) {
                                eventArgs.isChecked = isChecked;
                                this.uiIndices.activeIndices.push(resutJSON.index as number);
                            } else {
                                eventArgs.isChecked = !isChecked;
                                this.uiIndices.activeIndices.splice(this.uiIndices.activeIndices.indexOf(resutJSON.index as number), 1);
                            }
                        }
                    });
                } else if (!isSelected) {
                    this.listViewInstance.removeSelect();
                    this.listViewInstance.trigger('select', eventArgs, (observedArgs: SelectEventArgs) => {
                        if (observedArgs.cancel) {
                            this.activeIndex = undefined;
                        }
                    });
                }
            }
        } else if (isNullOrUndefined(obj) && !this.listViewInstance.showCheckBox) {
            this.listViewInstance.removeSelect();
            this.activeIndex = undefined;
        }
    }

    public enableItem(obj: Fields | HTMLElement | Element): void {
        const resutJSON: { [key: string]: object | number } = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
        if (Object.keys(resutJSON).length) {
            this.uiIndices.disabledItemIndices.splice(this.uiIndices.disabledItemIndices.indexOf(resutJSON.index as number), 1);
        }
    }

    public disableItem(obj: Fields | HTMLElement | Element): void {
        const resutJSON: { [key: string]: object | number } = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
        if (Object.keys(resutJSON).length && this.uiIndices.disabledItemIndices.indexOf(resutJSON.index as number) === -1) {
            this.uiIndices.disabledItemIndices.push(resutJSON.index as number);
        }
    }
    public showItem(obj: Fields | HTMLElement | Element): void {
        const resutJSON: { [key: string]: object | number } = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
        if (Object.keys(resutJSON).length) {
            this.uiIndices.hiddenItemIndices.splice(this.uiIndices.hiddenItemIndices.indexOf(resutJSON.index as number), 1);
        }
    }

    public hideItem(obj: Fields | HTMLElement | Element): void {
        const resutJSON: { [key: string]: object | number } = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
        if (Object.keys(resutJSON).length && this.uiIndices.hiddenItemIndices.indexOf(resutJSON.index as number) === -1) {
            this.uiIndices.hiddenItemIndices.push(resutJSON.index as number);
        }
    }

    public removeItem(obj: HTMLElement | Element | Fields): void {
        let dataSource: DataSource;
        const curViewDS: DataSource[] = this.listViewInstance.curViewDS;
        const resutJSON: { [key: string]: object | number } = this.findDSAndIndexFromId(curViewDS, obj);
        if (Object.keys(resutJSON).length) {
            dataSource = resutJSON.data as DataSource;
            if (curViewDS[(resutJSON.index as number) - 1] &&
                curViewDS[(resutJSON.index as number) - 1].isHeader &&
                ((curViewDS[(resutJSON.index as number) - 1])
                    .items as { [key: string]: object; }[]).length === 1) {
                this.removeUiItem((resutJSON.index as number) - 1);
                this.removeUiItem((resutJSON.index as number) - 1);
            } else {
                this.removeUiItem((resutJSON.index as number));
            }
        }
        const listDataSource: DataSource[] = this.listViewInstance.dataSource instanceof DataManager
            ? this.listViewInstance.localData : this.listViewInstance.dataSource;
        const index: number = listDataSource.indexOf(dataSource);
        if (index !== -1) {
            listDataSource.splice(index, 1);
            this.listViewInstance.setViewDataSource(listDataSource);
        }
        // recollect all the list item into collection

        this.listViewInstance.liCollection =
            <HTMLElement[] & NodeListOf<HTMLLIElement>>this.listViewInstance.curUL.querySelectorAll('li');

    }

    // eslint-disable-next-line
    public setCheckboxLI(li: HTMLElement | Element, e?: MouseEvent | KeyboardEvent | FocusEvent): void {
        const index: number = Array.prototype.indexOf.call(this.listViewInstance.curUL.querySelectorAll('li'), li) + this.uiFirstIndex;
        this.activeIndex = Array.prototype.indexOf.call(this.listViewInstance.curUL.querySelectorAll('li'), li) + this.uiFirstIndex;
        if (li.classList.contains(classNames.selected)) {
            if (this.uiIndices.activeIndices.indexOf(index) === -1) {
                this.uiIndices.activeIndices.push(index);
            }
        } else {
            this.uiIndices.activeIndices.splice(this.uiIndices.activeIndices.indexOf(index), 1);
        }
    }

    // eslint-disable-next-line
    public setSelectLI(li: HTMLElement | Element, e?: MouseEvent | KeyboardEvent | FocusEvent): void {
        this.activeIndex = Array.prototype.indexOf.call(this.listViewInstance.curUL.querySelectorAll('li'), li) + this.uiFirstIndex;
    }
    public checkedItem(checked: boolean): void {
        if (checked) {
            this.uiIndices.activeIndices = [];
            this.activeIndex = undefined;
            const data: DataSource[] = this.listViewInstance.curViewDS as DataSource[];
            for (let index: number = 0; index < data.length; index++) {
                if (!data[index as number].isHeader) {
                    this.uiIndices.activeIndices.push(index);
                }
            }

        } else {
            this.activeIndex = undefined;
            this.uiIndices.activeIndices = [];
        }

    }

    private addUiItem(index: number): void {
        // virtually new add list item based on the scollbar position
        // if the scroll bar is at the top, just pretend the new item has been added since no UI
        // change is required for the item that has been added at last but when scroll bar is at the bottom
        // just detach top and inject into bottom to mimic new item is added
        const curViewDs: DataSource[] = this.listViewInstance.curViewDS as DataSource[];
        this.changeUiIndices(index, true);
        if (this.activeIndex && this.activeIndex >= index) {
            this.activeIndex++;
        }
        if (this.listViewInstance.showCheckBox &&
            (curViewDs[index as number] as { [key: string]: object; })[this.listViewInstance.fields.isChecked]) {
            this.uiIndices.activeIndices.push(index);
        }
        if (!parseFloat(this.bottomElement.style.height) && !parseFloat(this.topElement.style.height)) {
            this.bottomElement.style.height = parseFloat(this.bottomElement.style.height) + this.listItemHeight + 'px';
        }
        if (parseFloat(this.bottomElement.style.height)) {
            const liItem: HTMLElement = this.listViewInstance.curUL.lastElementChild.previousSibling as HTMLElement;
            const target: HTMLElement = this.listViewInstance.getLiFromObjOrElement(curViewDs[index + 1]) ||
                this.listViewInstance.getLiFromObjOrElement(curViewDs[index + 2]);
            if (target) {
                this.bottomElement.style.height = parseFloat(this.bottomElement.style.height) + this.listItemHeight + 'px';
                this.updateUI(liItem, index, target);
            }
        } else {
            const liItem: HTMLElement = this.listViewInstance.curUL.firstElementChild.nextSibling as HTMLElement;
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
                if (this.listViewInstance.isWindow === true) {
                    window.scrollTo(0, (pageYOffset + this.listItemHeight));
                }
                else {
                    this.listViewInstance.element.scrollTop += this.listItemHeight;
                }
            }
        }
        this.totalHeight += this.listItemHeight;
        this.listDiff = Math.round(parseFloat(this.topElement.style.height) / this.listItemHeight);
    }

    private removeUiItem(index: number): void {
        this.totalHeight -= this.listItemHeight;
        const curViewDS: DataSource = (this.listViewInstance.curViewDS as { [key: string]: object; }[])[index as number];
        const liItem: HTMLElement = this.listViewInstance.getLiFromObjOrElement(curViewDS);
        (this.listViewInstance.curViewDS as { [key: string]: object; }[]).splice(index, 1);
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
                    const checklistElement: Element = liItem.querySelector('.' + classNames.checkboxWrapper);
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
        this.listDiff = Math.round(parseFloat(this.topElement.style.height) / this.listItemHeight);
    }

    private changeUiIndices(index: number, increment: boolean): void {
        const keys: string[] = Object.keys(this.uiIndices);
        for (let ind: number = 0; ind < keys.length; ind++) {
            this.uiIndices[keys[ind as number]] = this.uiIndices[keys[ind as number]].map((i: number) => {
                if (i >= index) {
                    return increment ? ++i : --i;
                } else {
                    return i;
                }
            });
        }
    }

    public addItem(data: DataSource[], fields: Fields, dataSource: DataSource[], index: number): void {
        for (let i: number = 0; i < data.length; i++) {
            const currentItem: { [key: string]: object; } = data[i as number];
            // push the given data to main data array
            dataSource = this.listViewInstance.addItemAtIndex(index, dataSource, currentItem);
            // recalculate all the group data or other datasource related things
            this.listViewInstance.setViewDataSource(dataSource);
            // render list items for first time due to no datasource present earlier
            if (!this.domItemCount) {
                // fresh rendering for first time
                if ((this.listViewInstance.template || this.listViewInstance.groupTemplate) && !this.isNgTemplate()) {
                    this.listViewInstance.listBaseOption.template = null;
                    this.listViewInstance.listBaseOption.groupTemplate = null;
                    this.listViewInstance.listBaseOption.itemCreated = this.createUIItem.bind(this);
                }
                this.uiVirtualization();
                // when expected expected DOM count doesn't meet the condition we need to create and inject new item into DOM
            } else if (this.domItemCount < this.expectedDomItemCount) {
                const ds: DataSource = this.listViewInstance.findItemFromDS(dataSource, fields);

                if (ds instanceof Array) {
                    if (this.listViewInstance.ulElement) {
                        let index: number = (this.listViewInstance.curViewDS as DataSource[]).indexOf(currentItem);
                        // inject new list item into DOM
                        this.createAndInjectNewItem(currentItem, index);

                        // check for group header item
                        const curViewDS: DataSource =
                            (this.listViewInstance.curViewDS as DataSource[])[index - 1];
                        if (curViewDS && curViewDS.isHeader && (curViewDS.items as DataSource[]).length === 1) {
                            // target group item index in datasource
                            --index;
                            // inject new group header into DOM for previously created list item
                            this.createAndInjectNewItem(curViewDS, index);
                        }
                    }
                    // recollect all the list item into collection
                    this.listViewInstance.liCollection =
                        <HTMLElement[] & NodeListOf<HTMLLIElement>>this.listViewInstance.curUL.querySelectorAll('li');
                }
            } else {
                const index: number = (this.listViewInstance.curViewDS as { [key: string]: object; }[]).indexOf(currentItem);
                // virtually new add list item based on the scollbar position
                this.addUiItem(index);
                // check for group header item needs to be added
                const curViewDS: DataSource = (this.listViewInstance.curViewDS as DataSource[])[index - 1];
                if (curViewDS && curViewDS.isHeader && (curViewDS.items as DataSource[]).length === 1) {
                    this.addUiItem(index - 1);
                }
            }
        }
    }

    private createAndInjectNewItem(itemData: DataSource, index: number): void {
        // generate li item for given datasource
        let target: HTMLElement;
        const li: HTMLElement[] = ListBase.createListItemFromJson(
            this.listViewInstance.createElement,
            [itemData] as {[key: string]: object}[],
            this.listViewInstance.listBaseOption,
            null,
            null,
            this.listViewInstance);
        // check for target element whether to insert before last item or group item
        if ((Object.keys(this.listViewInstance.curViewDS).length - 1) === index) {
            target = this.listViewInstance.curUL.lastElementChild as HTMLElement;
        } else {
            // target group header's first child item to append its header
            target = this.listViewInstance.getLiFromObjOrElement(this.listViewInstance.curViewDS[index + 1]) ||
                this.listViewInstance.getLiFromObjOrElement(this.listViewInstance.curViewDS[index + 2]);
        }
        if (this.listViewInstance.fields.groupBy
            && this.listViewInstance.curViewDS[index + 1]
            && this.listViewInstance.curViewDS[index + 1].isHeader) {
            const targetEle: HTMLElement = this.listViewInstance.getLiFromObjOrElement(this.listViewInstance.curViewDS[index - 1]);
            if (targetEle) {
                target = targetEle.nextElementSibling as HTMLElement;
            }
        }
        // insert before the target element
        this.listViewInstance.ulElement.insertBefore(li[0], target);
        // increment internal DOM count, last index count for new element
        this.domItemCount++;
        if (this.bottomElementHeight <= 0) {
            this.uiLastIndex++;
        }
        // recalculate the current item height, to avoid jumpy scroller
        this.refreshItemHeight();
    }

    public createUIItem(args: ItemCreatedArgs): void {
        if (!args.item.classList.contains('e-list-group-item')) {
            this.templateData = args.curData.isHeader ? (args.curData as { [key: string]: object[]; }).items[0] as DataSource :
                args.curData;
            if (this.listViewInstance.showCheckBox) {
                (this.listViewInstance as any).renderCheckbox(args);
                if ((!isNullOrUndefined(this.listViewInstance.virtualCheckBox)) &&
                    (!isNullOrUndefined(this.listViewInstance.virtualCheckBox.outerHTML))) {
                    const div: HTMLElement = document.createElement('div');
                    const commonTemplate: string = '<div class="e-text-content" role="presentation"> ' +
                        '<span class="e-list-text"> ${' + this.listViewInstance.fields.text + '} </span></div>';
                    const templateFunction: Function = compile(this.listViewInstance.template || commonTemplate, this.listViewInstance);
                    const nodes: NodeList = templateFunction(this.templateData, this.listViewInstance);
                    if (this.listViewInstance.template && this.listViewInstance.isReact) {
                        this.listViewInstance.renderReactTemplates();
                    }
                    [].slice.call(nodes).forEach((ele: HTMLElement): void => {
                        div.appendChild(ele);
                    });
                    if (div.children && div.children[0]) {
                        div.children[0].classList.add('e-checkbox');
                        if (this.listViewInstance.checkBoxPosition === 'Left') {
                            div.children[0].classList.add('e-checkbox-left');
                        }
                        else {
                            div.children[0].classList.add('e-checkbox-right');
                        }
                        if (this.listViewInstance.checkBoxPosition === 'Left') {
                            div.children[0].insertBefore(
                                this.listViewInstance.virtualCheckBox,
                                (div.childNodes[0] as HTMLElement).children[0]
                            );
                        } else {
                            div.children[0].appendChild(this.listViewInstance.virtualCheckBox);
                        }
                        while (args.item.lastChild) {
                            args.item.removeChild(args.item.lastChild);
                        }
                        [].slice.call(div.children).forEach((ele: HTMLElement): void => {
                            args.item.appendChild(ele);
                        });
                    }
                }
            }
        }
    }

    public reRenderUiVirtualization(): void {
        this.wireScrollEvent(true);
        if (this.listViewInstance.contentContainer) {
            detach(this.listViewInstance.contentContainer);
        }
        this.listViewInstance.preRender();
        // resetting the dom count to 0, to avoid edge case of dataSource suddenly becoming zero
        // and then manually adding item using addItem API
        this.domItemCount = 0;
        this.listViewInstance.header();
        this.listViewInstance.setLocalData();
    }

    private updateUI(element: HTMLElement, index: number, targetElement?: HTMLElement): void {
        const onChange: Function = this.isNgTemplate() ? this.onNgChange : this.onChange;
        if (this.listViewInstance.template || this.listViewInstance.groupTemplate) {
            const curViewDS: DataSource = (this.listViewInstance.curViewDS as DataSource[])[index as number];
            element.dataset.uid = (curViewDS[this.listViewInstance.fields.id]) as any ?
                (curViewDS[this.listViewInstance.fields.id]) as any : ListBase.generateId() as any;
            onChange(curViewDS, element, this);
        } else {
            this.updateUiContent(element, index);
        }
        this.changeElementAttributes(element, index);
        if (targetElement) {
            this.listViewInstance.ulElement.insertBefore(element, targetElement);
        }
    }

    /**
     * Handles the UI change in vue for the list view.
     *
     * @param {DataSource} newData - The new data source for the list view.
     * @param {ElementContext} listElement - The HTML element context for the list view.
     * @param {Virtualization} virtualThis - The virtualization context for the list view.
     * @returns {void}
     */
    private onChange(newData: DataSource, listElement: ElementContext, virtualThis: Virtualization): void {
        const liItem: HTMLElement[] = ListBase.createListItemFromJson(virtualThis.listViewInstance.createElement,
                                                                      [newData] as { [key: string]: Object; }[],
                                                                      virtualThis.listViewInstance.listBaseOption,
                                                                      null, null, virtualThis.listViewInstance);
        if (virtualThis.listViewInstance.isReact) {
            virtualThis.listViewInstance.renderReactTemplates();
        }
        while (listElement.lastChild) {
            listElement.removeChild(listElement.lastChild);
        }
        [].slice.call(liItem[0].children).forEach((ele: HTMLElement): void => {
            listElement.appendChild(ele);
        });
    }

    private onNgChange(newData: DataSource, listElement: ElementContext, virtualThis: Virtualization): void {
        // compile given target element with template for new data
        const templateCompiler: Function = compile(virtualThis.listViewInstance.template);
        const resultElement: NodeList = templateCompiler(newData);
        while (listElement.lastChild) {
            listElement.removeChild(listElement.lastChild);
        }
        listElement.appendChild(resultElement[0]);
    }

    public getModuleName(): string {
        return 'virtualization';
    }

    public destroy(): void {
        this.wireScrollEvent(true);
        this.topElement = null;
        this.bottomElement = null;
    }
}

interface DataSource {
    [key: string]: object;
}

