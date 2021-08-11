import { ListView, ItemCreatedArgs, classNames, Fields, UISelectedItem } from './list-view';
import { EventHandler, append, isNullOrUndefined, detach, removeClass, addClass, compile, formatUnit } from '@syncfusion/ej2-base';
import { debounce } from '@syncfusion/ej2-base';
import {ListBase} from '../common/list-base';
import { DataManager } from '@syncfusion/ej2-data';

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

    // eslint-disable-next-line
    private listViewInstance: any;
    private headerData: DataSource;
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
     * For internal use only.
     *
     * @private
     */

    public uiVirtualization(): void {
        this.wireScrollEvent(false);
        const curViewDS: { [key: string]: object; }[] = this.listViewInstance.curViewDS as { [key: string]: object; }[];
        const firstDs: { [key: string]: object }[] = curViewDS.slice(0, 1);
        this.listViewInstance.ulElement = this.listViewInstance.curUL = ListBase.createList(
            // eslint-disable-next-line
            this.listViewInstance.createElement, firstDs as any, this.listViewInstance.listBaseOption, null, this.listViewInstance);
        this.listViewInstance.contentContainer = this.listViewInstance.createElement('div', { className: classNames.content });
        this.listViewInstance.element.appendChild(this.listViewInstance.contentContainer);
        this.listViewInstance.contentContainer.appendChild(this.listViewInstance.ulElement);
        this.listItemHeight = this.listViewInstance.ulElement.firstElementChild.getBoundingClientRect().height;
        this.expectedDomItemCount = this.ValidateItemCount(10000);
        this.domItemCount = this.ValidateItemCount(Object.keys(this.listViewInstance.curViewDS).length);
        this.uiFirstIndex = 0;
        this.uiLastIndex = this.domItemCount - 1;
        const otherDs: { [key: string]: object; }[] = curViewDS.slice(1, this.domItemCount);
        const listItems: HTMLElement[] = ListBase.createListItemFromJson(
            // eslint-disable-next-line
            this.listViewInstance.createElement, otherDs as any, this.listViewInstance.listBaseOption, null, null, this.listViewInstance);
        append(listItems, this.listViewInstance.ulElement);
        this.listViewInstance.liCollection = <HTMLElement[] & NodeListOf<HTMLLIElement>>
            this.listViewInstance.curUL.querySelectorAll('li');
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
                EventHandler.remove(this.listViewInstance.element, 'scroll', this.updateUlContainer);
            }
        }
    }

    private updateUlContainer(e: Event): void {
        let listDiff: number;
        const virtualElementContainer: HTMLElement = this.listViewInstance.ulElement.querySelector('.' + classNames.virtualElementContainer);
        if (isNullOrUndefined(this.listViewInstance.liElementHeight)) {
            this.listViewInstance.updateLiElementHeight();
        }

        if (this.listViewInstance.isWindow) {
            // eslint-disable-next-line
            listDiff = Math.round((e as any).target.documentElement.scrollTop / this.listViewInstance.liElementHeight) - 2; 
        } else {
            // eslint-disable-next-line
            listDiff = Math.round((e as any).target.scrollTop / this.listViewInstance.liElementHeight) - 2;
        }
        if (((listDiff - 1) * this.listViewInstance.liElementHeight) < 0) {
            virtualElementContainer.style.top = '0px';
        } else {
            virtualElementContainer.style.top = (listDiff) * this.listViewInstance.liElementHeight + 'px';
        }
    }

    private ValidateItemCount(dataSourceLength: number): number {
        const height: number = parseFloat(formatUnit(this.listViewInstance.height));
        let itemCount: number;
        if (this.listViewInstance.isWindow) {
            itemCount = Math.round((window.innerHeight / this.listItemHeight) * windowElementCount);
        } else {
            if (typeof this.listViewInstance.height === 'string' && this.listViewInstance.height.indexOf('%') !== -1) {
                // eslint-disable-next-line max-len
                itemCount = Math.round((this.listViewInstance.element.getBoundingClientRect().height / this.listItemHeight) * listElementCount);
            } else {
                itemCount = Math.round((height / this.listItemHeight) * listElementCount);
            }
        }
        if (itemCount > dataSourceLength) {
            itemCount = dataSourceLength;
        }
        return itemCount;
    }

    private uiIndicesInitialization(): void {
        this.uiIndices = { 'activeIndices': [], 'disabledItemIndices': [], 'hiddenItemIndices': [] };
        const data: DataSource[] = this.listViewInstance.curViewDS as DataSource[];
        for (let i: number = 0; i < data.length; i++) {
            if (this.listViewInstance.showCheckBox && data[i][this.listViewInstance.fields.isChecked]) {
                this.uiIndices.activeIndices.push(i);
            }
            // eslint-disable-next-line
            if (!isNullOrUndefined((data[i] as any)[this.listViewInstance.fields.enabled]) &&
            !data[i][this.listViewInstance.fields.enabled]) {
                // eslint-disable-next-line
                (this.uiIndices.disabledItemIndices.push(i)) as any;
            }
        }
        if (this.isNgTemplate()) {
            const items: ElementContext[] = this.listViewInstance.element.querySelectorAll('.' + classNames.listItem);
            for (let index: number = 0; index < items.length; index++) {
                items[index].context = this.listViewInstance.viewContainerRef.get(index).context;
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

    private onVirtualUiScroll(e: Event): void {
        let startingHeight: number;
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
            this.updateUI(elements[i], index);
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
        const curViewDs: { [key: string]: any; }[] = this.listViewInstance.curViewDS as DataSource[];
        if (typeof (this.listViewInstance.dataSource as string[])[0] === 'string' ||
            typeof (this.listViewInstance.dataSource as number[])[0] === 'number') {
            element.dataset.uid = ListBase.generateId();
            element.getElementsByClassName(classNames.listItemText)[0].innerHTML =
                (this.listViewInstance.curViewDS as string[] | number[])[index].toString();
        } else {
            // eslint-disable-next-line
            element.dataset.uid = (curViewDs[index][this.listViewInstance.fields.id])as any ?
                // eslint-disable-next-line
                (curViewDs[index][this.listViewInstance.fields.id]) as any : (ListBase.generateId()as any);
            element.getElementsByClassName(classNames.listItemText)[0].innerHTML =
                // eslint-disable-next-line
                (curViewDs[index][this.listViewInstance.fields.text]) as any;
        }
        if (this.listViewInstance.showIcon) {
            if (element.querySelector('.' + classNames.listIcon)) {
                detach(element.querySelector('.' + classNames.listIcon));
            }
            if ((this.listViewInstance.curViewDS[index] as { [key: string]: object; })[this.listViewInstance.fields.iconCss]) {
                const textContent: Element = element.querySelector('.' + classNames.textContent);
                const target: Element = this.listViewInstance.createElement('div', {
                    className: classNames.listIcon + ' ' +
                        (this.listViewInstance.curViewDS[index] as { [key: string]: object; })[this.listViewInstance.fields.iconCss]
                });
                textContent.insertBefore(target, element.querySelector('.' + classNames.listItemText));
            }
        }
        if (this.listViewInstance.showCheckBox && this.listViewInstance.fields.groupBy) {
            if (!this.checkListWrapper) {
                this.checkListWrapper = this.listViewInstance.curUL.querySelector('.' + classNames.checkboxWrapper).cloneNode(true);
            }
            const textContent: Element = element.querySelector('.' + classNames.textContent);
            if ((this.listViewInstance.curViewDS[index] as { [key: string]: object; }).isHeader) {
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
            if ((this.listViewInstance.curViewDS as { [key: string]: object; }[])[index].isHeader) {
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
                    // eslint-disable-next-line
                    (fields as { [key: string]: any ; })[this.listViewInstance.fields.id]
                    // eslint-disable-next-line
                    === (data[this.listViewInstance.fields.id] && data[this.listViewInstance.fields.id] as any) || fields === data)) {
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
                        (dataCollection as string[]).push((curViewDS as string[])[indices[i]]);
                    }
                    return {
                        text: dataCollection as string[],
                        // eslint-disable-next-line
                        data: dataCollection as any,
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
                const curViewDS: { [key: string]: object | string }[] = this.listViewInstance.curViewDS as { [key: string]: object; }[];
                const text: string = this.listViewInstance.fields.text;
                if (this.listViewInstance.showCheckBox) {
                    const indexArray: number[] = this.uiIndices.activeIndices;
                    for (let i: number = 0; i < indexArray.length; i++) {
                        textCollection.push((curViewDS[indexArray[i]] as { [key: string]: string; })[text]);
                        (dataCollection as { [key: string]: any; }[]).push(curViewDS[indexArray[i]] as DataSource);
                    }
                    const dataSource: { [key: string]: any; }[] =
                        this.listViewInstance.dataSource instanceof DataManager
                            ? curViewDS : this.listViewInstance.dataSource;
                    return {
                        text: textCollection,
                        // eslint-disable-next-line
                        data: dataCollection as any,
                        index: this.uiIndices.activeIndices.map((index: number) =>
                            dataSource.indexOf(curViewDS[index] as DataSource))
                    };
                } else {
                    const dataSource: { [key: string]: any; }[] =
                        this.listViewInstance.dataSource instanceof DataManager
                            ? curViewDS : this.listViewInstance.dataSource;
                    return {
                        text: curViewDS[this.activeIndex][this.listViewInstance.fields.text] as string,
                        // eslint-disable-next-line
                        data: curViewDS[this.activeIndex] as any,
                        index: dataSource.indexOf(curViewDS[this.activeIndex])
                    };
                }
            }
        } else {
            return undefined;
        }
    }

    public selectItem(obj: Fields | HTMLElement | Element): void {
        const resutJSON: { [key: string]: any | number } = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
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
                let eventArgs: { [key: string]: any; };
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
                    eventArgs.isChecked = isChecked;
                    this.listViewInstance.trigger('select', eventArgs);
                } else if (!isSelected) {
                    this.listViewInstance.removeSelect();
                    this.listViewInstance.trigger('select', eventArgs);
                }
            }
        } else if (isNullOrUndefined(obj) && !this.listViewInstance.showCheckBox) {
            this.listViewInstance.removeSelect();
            this.activeIndex = undefined;
        }
    }

    public enableItem(obj: Fields | HTMLElement | Element): void {
        const resutJSON: { [key: string]: any | number } = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
        if (Object.keys(resutJSON).length) {
            this.uiIndices.disabledItemIndices.splice(this.uiIndices.disabledItemIndices.indexOf(resutJSON.index as number), 1);
        }
    }

    public disableItem(obj: Fields | HTMLElement | Element): void {
        const resutJSON: { [key: string]: any | number } = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
        if (Object.keys(resutJSON).length && this.uiIndices.disabledItemIndices.indexOf(resutJSON.index as number) === -1) {
            this.uiIndices.disabledItemIndices.push(resutJSON.index as number);
        }
    }
    public showItem(obj: Fields | HTMLElement | Element): void {
        const resutJSON: { [key: string]: any | number } = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
        if (Object.keys(resutJSON).length) {
            this.uiIndices.hiddenItemIndices.splice(this.uiIndices.hiddenItemIndices.indexOf(resutJSON.index as number), 1);
        }
    }

    public hideItem(obj: Fields | HTMLElement | Element): void {
        const resutJSON: { [key: string]: any | number } = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
        if (Object.keys(resutJSON).length && this.uiIndices.hiddenItemIndices.indexOf(resutJSON.index as number) === -1) {
            this.uiIndices.hiddenItemIndices.push(resutJSON.index as number);
        }
    }

    public removeItem(obj: HTMLElement | Element | Fields): void {
        let dataSource: DataSource;
        const curViewDS: DataSource[] = this.listViewInstance.curViewDS;
        const resutJSON: { [key: string]: any | number } = this.findDSAndIndexFromId(curViewDS, obj);
        if (Object.keys(resutJSON).length) {
            dataSource = resutJSON.data as DataSource;
            if (curViewDS[(resutJSON.index as number) - 1] &&
                curViewDS[(resutJSON.index as number) - 1].isHeader &&
                ((curViewDS[(resutJSON.index as number) - 1])
                    .items as { [key: string]: any; }[]).length === 1) {
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
                if (!data[index].isHeader) {
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
            (curViewDs[index] as { [key: string]: object; })[this.listViewInstance.fields.isChecked]) {
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
                if (this.listViewInstance.isWindow === true)
                {
                    window.scrollTo(0, (pageYOffset + this.listItemHeight));
                }
                else{ this.listViewInstance.element.scrollTop += this.listItemHeight;
                }
            }
        }
        this.totalHeight += this.listItemHeight;
        this.listDiff = Math.round(parseFloat(this.topElement.style.height) / this.listItemHeight);
    }

    private removeUiItem(index: number): void {
        this.totalHeight -= this.listItemHeight;
        const curViewDS: DataSource = (this.listViewInstance.curViewDS as { [key: string]: object; }[])[index];
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
            this.uiIndices[keys[ind]] = this.uiIndices[keys[ind]].map((i: number) => {
                if (i >= index) {
                    return increment ? ++i : --i;
                } else {
                    return i;
                }
            });
        }
    }

    public addItem(data: DataSource[], fields: Fields, dataSource: DataSource[]): void {
        for (let i: number = 0; i < data.length; i++) {
            const currentItem: { [key: string]: object; } = data[i];
            // push the given data to main data array
            dataSource.push(currentItem);
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
                const index: number = (this.listViewInstance.curViewDS as { [key: string]: any; }[]).indexOf(currentItem);
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
            // eslint-disable-next-line
            [itemData] as any,
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
        if (this.listViewInstance.fields.groupBy && this.listViewInstance.curViewDS[index + 1] && this.listViewInstance.curViewDS[index + 1].isHeader) {
            let targetEle : HTMLElement = this.listViewInstance.getLiFromObjOrElement(this.listViewInstance.curViewDS[index - 1]);
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
        const virtualTemplate: string = this.listViewInstance.template;
        const template: HTMLElement = this.listViewInstance.createElement('div');
        let commonTemplate: string = '<div class="e-text-content" role="presentation"> ' +
            '<span class="e-list-text"> ${' + this.listViewInstance.fields.text + '} </span></div>';
        if (this.listViewInstance.isReact) {
            commonTemplate = null;
        }
        if (this.listViewInstance.showCheckBox) {
            // eslint-disable-next-line
            (this.listViewInstance as any).renderCheckbox(args);
            if ((!isNullOrUndefined(this.listViewInstance.virtualCheckBox)) &&
                (!isNullOrUndefined(this.listViewInstance.virtualCheckBox.outerHTML))) {
                const div: HTMLElement = document.createElement('div');
                div.innerHTML = this.listViewInstance.template || commonTemplate;
                if (div.children && div.children[0]) {
                    div.children[0].classList.add('e-checkbox');
                    if (this.listViewInstance.checkBoxPosition === 'Left')
                    {
                        div.children[0].classList.add('e-checkbox-left');
                    }
                    else
                    {
                        div.children[0].classList.add('e-checkbox-right');
                    }
                    if (this.listViewInstance.checkBoxPosition === 'Left') {
                        div.children[0].insertBefore(this.listViewInstance.virtualCheckBox, (div.childNodes[0] as HTMLElement).children[0]);
                    } else {
                        div.children[0].appendChild(this.listViewInstance.virtualCheckBox);
                    }
                    this.listViewInstance.template = div.innerHTML;
                }
            }
            template.innerHTML = this.listViewInstance.template;
            this.listViewInstance.template = virtualTemplate;
        } else {
            template.innerHTML = this.listViewInstance.template || commonTemplate;
        }
        // eslint-disable-next-line
        const templateElements: any = template.getElementsByTagName('*');
        const groupTemplate: HTMLElement = this.listViewInstance.createElement('div');
        if (this.listViewInstance.fields.groupBy) {
            groupTemplate.innerHTML = this.listViewInstance.groupTemplate || commonTemplate;
        }
        // eslint-disable-next-line
        let groupTemplateElements: any = groupTemplate.getElementsByTagName('*');
        if (args.curData.isHeader) {
            this.headerData = args.curData;
        }
        this.templateData = args.curData.isHeader ? (args.curData as { [key: string]: any[]; }).items[0] as DataSource :
            args.curData;
        if (!this.listViewInstance.isReact || (typeof this.listViewInstance.template == "string" && !args.item.classList.contains("e-list-group-item")) || 
            (typeof this.listViewInstance.groupTemplate == "string" && args.item.classList.contains("e-list-group-item"))) {
            args.item.innerHTML = '';
        }
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
        const element: HTMLElement = args.curData.isHeader ? groupTemplate : template;
        if (element.firstElementChild) {
            args.item.insertBefore(element.firstElementChild, null);
        }
    }

    private compileTemplate(element: HTMLElement, item: HTMLElement, isHeader: boolean): void {
        this.textProperty(element, item, isHeader);
        this.classProperty(element, item, isHeader);
        this.attributeProperty(element, item, isHeader);
    }

    private onChange(newData: DataSource, listElement: HTMLElement): void {
        (<ElementContext>listElement).context.data = newData;
        // eslint-disable-next-line max-len
        const groupTemplateNodes: object[] = ((<ElementContext>listElement).context.nodes as { [key: string]: object[] }).groupTemplateNodes;
        // eslint-disable-next-line max-len
        const flatTemplateNodes: object[] = ((<ElementContext>listElement).context.nodes as { [key: string]: object[] }).flatTemplateNodes;
        // eslint-disable-next-line
        if (!isNullOrUndefined(newData.isHeader as any) && newData.isHeader as any && (<ElementContext>listElement).context.type as any === 'groupList' as any) {
            // eslint-disable-next-line
            const element: HTMLElement = listElement.firstElementChild as HTMLElement as any;
            detach(listElement.firstElementChild);
            listElement.insertBefore((<ElementContext>listElement).context.template as HTMLElement, null);
            (<ElementContext>listElement).context.template = element;
            (<ElementContext>listElement).context.type = 'flatList';
            for (let i: number = 0; i < groupTemplateNodes.length; i++) {
                // eslint-disable-next-line
                (groupTemplateNodes[i] as { [key: string]: Function }).onChange(newData);
            }
        } else if (!newData.isHeader && (<ElementContext>listElement).context.type === 'flatList') {
            const element: HTMLElement = listElement.firstElementChild as HTMLElement;
            detach(listElement.firstElementChild);
            listElement.insertBefore((<ElementContext>listElement).context.template as HTMLElement, null);
            (<ElementContext>listElement).context.template = element;
            (<ElementContext>listElement).context.type = 'groupList';
            for (let i: number = 0; i < flatTemplateNodes.length; i++) {
                // eslint-disable-next-line
                (flatTemplateNodes[i] as { [key: string]: Function }).onChange(newData);
            }
        } else if (!newData.isHeader) {
            for (let i: number = 0; i < flatTemplateNodes.length; i++) {
                // eslint-disable-next-line
                (flatTemplateNodes[i] as { [key: string]: Function }).onChange(newData);
            }
        } else {
            for (let i: number = 0; i < groupTemplateNodes.length; i++) {
                // eslint-disable-next-line
                (groupTemplateNodes[i] as { [key: string]: Function }).onChange(newData);
            }
        }
    }

    // eslint-disable-next-line
    private updateContextData(listElement: HTMLElement, node: { [key: string]: string | Function | string[] }, isHeader: Boolean): void {
        if (isHeader) {
            ((<ElementContext>listElement).context.nodes as { [key: string]: object[] }).groupTemplateNodes.push(node);
        } else {
            ((<ElementContext>listElement).context.nodes as { [key: string]: object[] }).flatTemplateNodes.push(node);
        }
    }
    private classProperty(element: HTMLElement, listElement: HTMLElement, isHeader: boolean): void {
        const regex: RegExp = new RegExp('\\${([^}]*)}', 'g');
        const resultantOutput: RegExpExecArray[] = [];
        let regexMatch: RegExpExecArray;
        while (regexMatch !== null) {
            const match: RegExpExecArray = regex.exec(element.className);
            resultantOutput.push(match);
            regexMatch = match;
            if (regexMatch === null) {
                resultantOutput.pop();
            }
        }
        if (resultantOutput && resultantOutput.length) {
            for (let i: number = 0; i < resultantOutput.length; i++) {
                const classNameMatch: RegExpExecArray = resultantOutput[i];
                // eslint-disable-next-line
                let classFunction: Function;
                if (classNameMatch[1].indexOf('?') !== -1 && classNameMatch[1].indexOf(':') !== -1) {
                    // tslint:disable-next-line:no-function-constructor-with-string-args
                    classFunction = new Function('data', 'return ' + classNameMatch[1].replace(/\$/g, 'data.'));
                } else {
                    // tslint:disable-next-line:no-function-constructor-with-string-args
                    classFunction = new Function('data', 'return ' + 'data.' + classNameMatch[1]);
                }
                // eslint-disable-next-line
                const subNode: { [key: string]: string | Function } = {};
                if (isHeader) {
                    subNode.bindedvalue = classFunction(this.headerData);
                } else {
                    subNode.bindedvalue = classFunction(this.templateData);
                }
                subNode.onChange = (value: DataSource) => {
                    if (subNode.bindedvalue) {
                        removeClass([element], (subNode.bindedvalue as string).split(' ').filter((css: string) => css));
                    }
                    const newCss: string = classFunction(value) as string;
                    if (newCss) {
                        addClass([element], (newCss).split(' ').filter((css: string) => css));
                    }
                    subNode.bindedvalue = newCss;
                };
                const className: string[] = classNameMatch[0].split(' ');
                for (let i: number = 0; i < className.length; i++) { element.classList.remove(className[i]); }
                if (subNode.bindedvalue) {
                    addClass([element], (subNode.bindedvalue as string).split(' ').filter((css: string) => css));
                }
                this.updateContextData(listElement, subNode, isHeader);
            }
        }
    }
    private attributeProperty(element: HTMLElement, listElement: HTMLElement, isHeader: boolean): void {
        const attributeNames: string[] = [];
        for (let i: number = 0; i < element.attributes.length; i++) {
            attributeNames.push(element.attributes[i].nodeName);
        }
        if (attributeNames.indexOf('class') !== -1) {
            attributeNames.splice(attributeNames.indexOf('class'), 1);
        }
        for (let i: number = 0; i < attributeNames.length; i++) {
            const attributeName: string = attributeNames[i];
            const attrNameMatch: RegExpExecArray | string[] = new RegExp('\\${([^}]*)}', 'g').exec(attributeName) || [];
            const attrValueMatch: RegExpExecArray | string[] = new RegExp('\\${([^}]*)}', 'g').exec(element.getAttribute(attributeName))
                || [];
            // eslint-disable-next-line
            let attributeNameFunction: Function;
            // eslint-disable-next-line
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
                // eslint-disable-next-line @typescript-eslint/ban-types
                const subNode: { [key: string]: string[] | Function | string } = {};
                if (isHeader) {
                    subNode.bindedvalue = [attrNameMatch[1] === undefined ? undefined : attributeNameFunction(this.headerData),
                        attrValueMatch[1] === undefined ? undefined : attributeValueFunction(this.headerData)];
                } else {
                    subNode.bindedvalue = [attrNameMatch[1] === undefined ? undefined : attributeNameFunction(this.templateData),
                        attrValueMatch[1] === undefined ? undefined : attributeValueFunction(this.templateData)];
                }
                subNode.attrName = (subNode.bindedvalue as string[])[0] === undefined ?
                    attributeName : (subNode.bindedvalue as string[])[0];
                subNode.onChange = (value: DataSource) => {
                    const bindedvalue: string = (subNode.bindedvalue as string[])[1] === undefined ?
                        element.getAttribute(subNode.attrName as string) : attributeValueFunction(value);
                    element.removeAttribute(subNode.attrName as string);
                    subNode.attrName = (subNode.bindedvalue as string[])[0] === undefined ? subNode.attrName : attributeNameFunction(value);
                    element.setAttribute(subNode.attrName as string, bindedvalue);
                    subNode.bindedvalue = [(subNode.bindedvalue as string[])[0] === undefined ? undefined : attributeNameFunction(value),
                        (subNode.bindedvalue as string[])[1] === undefined ? undefined : attributeValueFunction(value)];
                };
                const attributeValue: string = (subNode.bindedvalue as string[])[1] === undefined ? element.getAttribute(attributeName) :
                    (subNode.bindedvalue as string[])[1];
                element.removeAttribute(attributeName as string);
                element.setAttribute(subNode.attrName as string, attributeValue as string);
                this.updateContextData(listElement, subNode, isHeader);
            }
        }

    }

    private textProperty(element: HTMLElement, listElement: HTMLElement, isHeader: boolean): void {
        const regex: RegExp = new RegExp('\\${([^}]*)}', 'g');
        const resultantOutput: RegExpExecArray[] = [];
        let regexMatch: RegExpExecArray;
        while (regexMatch !== null) {
            const match: RegExpExecArray = regex.exec(element.innerText);
            resultantOutput.push(match);
            regexMatch = match;
            if (regexMatch === null) {
                resultantOutput.pop();
            }
        }
        const isChildHasTextContent: boolean = Array.prototype.some.call(element.children, (element: HTMLElement) => {
            if (new RegExp('\\${([^}]*)}', 'g').exec(element.innerText)) {
                return true;

            } else {
                return false;
            }
        });
        if (resultantOutput && resultantOutput.length && !isChildHasTextContent) {
            for (let i: number = 0; i < resultantOutput.length; i++) {
                const textPropertyMatch: RegExpExecArray = resultantOutput[i];
                // eslint-disable-next-line
                const subNode: { [key: string]: string | Function } = {};
                // eslint-disable-next-line
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
                subNode.onChange = (value: DataSource) => {
                    element.innerText = element.innerText.replace(subNode.bindedvalue as string, textFunction(value));
                    subNode.bindedvalue = textFunction(value);
                };
                element.innerText = element.innerText.replace(textPropertyMatch[0], subNode.bindedvalue as string);
                this.updateContextData(listElement, subNode, isHeader);
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
        // eslint-disable-next-line @typescript-eslint/ban-types
        const onChange: Function = this.isNgTemplate() ? this.onNgChange : this.onChange;
        if (this.listViewInstance.template || this.listViewInstance.groupTemplate) {
            const curViewDS: DataSource = (this.listViewInstance.curViewDS as DataSource[])[index];
            // eslint-disable-next-line
            element.dataset.uid = (curViewDS[this.listViewInstance.fields.id]) as any ?
                // eslint-disable-next-line
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

    private onNgChange(newData: DataSource, listElement: ElementContext, virtualThis: Virtualization): void {
        // compile given target element with template for new data
        // eslint-disable-next-line
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
    }
}

interface DataSource {
    [key: string]: object;
}

