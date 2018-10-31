/**
 * Exports util methods used by RichTextEditor.
 */
import { isNullOrUndefined as isNOU, addClass, removeClass, L10n, selectAll } from '@syncfusion/ej2-base';
import * as classes from '../base/classes';
import * as model from '../models/items';
import { toolsLocale } from '../models/default-locale';
import { IToolbarItems, IDropDownItemModel, ISetToolbarStatusArgs, IToolbarItemModel } from './interface';
import { BaseToolbar } from '../actions/base-toolbar';
import { DropDownButtons } from '../actions/dropdown-buttons';
import { ServiceLocator } from '../services/service-locator';

let undoRedoItems: string[] = ['Undo', 'Redo'];

export function getIndex(val: string, items: (string | IToolbarItems)[]): number {
    let index: number = -1;
    items.some((item: string, i: number) => {
        if (typeof item === 'string' && val === item.toLocaleLowerCase()) {
            index = i;
            return true;
        }
        return false;
    });
    return index;
}

export function hasClass(element: Element | HTMLElement, className: string): boolean {
    let hasClass: boolean = false;
    if (element.classList.contains(className)) {
        hasClass = true;
    }
    return hasClass;
}

export function getDropDownValue(items: IDropDownItemModel[], value: string, type: string, returnType: string): string {
    let data: IDropDownItemModel;
    let result: string;
    for (let k: number = 0; k < items.length; k++) {
        if (type === 'value' && items[k].value.toLocaleLowerCase() === value.toLocaleLowerCase()) {
            data = items[k];
            break;
        } else if (type === 'text' && items[k].text.toLocaleLowerCase() === value.toLocaleLowerCase()) {
            data = items[k];
            break;
        } else if (type === 'subCommand' && items[k].subCommand.toLocaleLowerCase() === value.toLocaleLowerCase()) {
            data = items[k];
            break;
        }
    }
    if (!isNOU(data)) {
        switch (returnType) {
            case 'text':
                result = data.text;
                break;
            case 'value':
                result = data.value;
                break;
            case 'iconCss':
                result = data.iconCss;
                break;
        }
    }
    return result;
}

export function isIDevice(): boolean {
    let result: boolean = false;
    let iosDevices: string[] = ['iphone', 'ipad', 'ipod'];
    for (let i: number = 0; i < iosDevices.length; i++) {
        if (navigator.platform.toLocaleLowerCase().indexOf(iosDevices[i]) > -1) {
            result = true;
            break;
        }
    }
    return result;
}

export function getFormattedFontSize(value: string): string {
    if (isNOU(value)) { return ''; }
    let result: string[] = value.split('pt');
    return result[0] + ' pt';
}

export function pageYOffset(e: MouseEvent, parentElement: HTMLElement, isIFrame: boolean): number {
    let y: number = 0;
    if (isIFrame) {
        y = window.pageYOffset + parentElement.getBoundingClientRect().top + e.clientY;
    } else {
        y = e.pageY;
    }
    return y;
}

export function getTooltipText(item: string, serviceLocator: ServiceLocator): string {
    let i10n: L10n = serviceLocator.getService<L10n>('rteLocale');
    let itemLocale: string = toolsLocale[item];
    let tooltipText: string = i10n.getConstant(itemLocale);
    return tooltipText;
}

export function setToolbarStatus(e: ISetToolbarStatusArgs, isPopToolbar: boolean): void {
    let dropDown: DropDownButtons = e.dropDownModule;
    let data: { [key: string]: string | boolean } = <{ [key: string]: string | boolean }>e.args;
    let keys: string[] = Object.keys(e.args);
    for (let key of keys) {
        for (let j: number = 0; j < e.tbItems.length; j++) {
            let item: string = e.tbItems[j].subCommand;
            let itemStr: string = item && item.toLocaleLowerCase();
            if (item && (itemStr === key) || (item === 'UL' && key === 'unorderedlist') || (item === 'OL' && key === 'orderedlist')) {
                if (typeof data[key] === 'boolean') {
                    if (data[key] === true) {
                        addClass([e.tbElements[j]], [classes.CLS_ACTIVE]);
                    } else {
                        removeClass([e.tbElements[j]], [classes.CLS_ACTIVE]);
                    }
                } else if ((typeof data[key] === 'string' || data[key] === null) &&
                    getIndex(key, e.parent.toolbarSettings.items) > -1) {
                    let value: string = ((data[key]) ? data[key] : '') as string;
                    let result: string = '';
                    switch (key) {
                        case 'formats':
                            if (isNOU(dropDown.formatDropDown) || isPopToolbar) { return; }
                            let formatItems: IDropDownItemModel[] = e.parent.format.types;
                            result = getDropDownValue(formatItems, value, 'subCommand', 'text');
                            dropDown.formatDropDown.content = ('<span style="display: inline-flex;' +
                                'width:' + e.parent.format.width + '" >' +
                                '<span class="e-rte-dropdown-btn-text">'
                                + (isNOU(result) ? 'Paragraph' : result) +
                                '</span></span>');
                            dropDown.formatDropDown.dataBind();
                            break;
                        case 'alignments':
                            if (isNOU(dropDown.alignDropDown)) { return; }
                            let alignItems: IDropDownItemModel[] = model.alignmentItems;
                            result = getDropDownValue(alignItems, value, 'subCommand', 'iconCss');
                            dropDown.alignDropDown.iconCss = isNOU(result) ? 'e-icons e-justify-left' : result;
                            dropDown.alignDropDown.dataBind();
                            break;
                        case 'fontname':
                            if (isNOU(dropDown.fontNameDropDown) || isPopToolbar) { return; }
                            let fontNameItems: IDropDownItemModel[] = e.parent.fontFamily.items;
                            result = getDropDownValue(fontNameItems, value, 'value', 'text');
                            let name: string = (isNOU(result) ? 'Segoe UI' : result);
                            e.tbElements[j].title = name;
                            dropDown.fontNameDropDown.content = ('<span style="display: inline-flex;' +
                                'width:' + e.parent.fontFamily.width + '" >' +
                                '<span class="e-rte-dropdown-btn-text">'
                                + name + '</span></span>');
                            dropDown.fontNameDropDown.dataBind();
                            break;
                        case 'fontsize':
                            if (isNOU(dropDown.fontSizeDropDown)) { return; }
                            let fontSizeItems: IDropDownItemModel[] = e.parent.fontSize.items;
                            result = getDropDownValue(fontSizeItems, value, 'value', 'value');
                            dropDown.fontSizeDropDown.content = ('<span style="display: inline-flex;' +
                                'width:' + e.parent.fontSize.width + '" >' +
                                '<span class="e-rte-dropdown-btn-text">'
                                + (isNOU(result) ? '10 pt' : getFormattedFontSize(result)) +
                                '</span></span>');
                            dropDown.fontSizeDropDown.dataBind();
                            break;
                    }
                }
            }
        }
    }
}

export function getCollection(items: string | string[]): string[] {
    if (typeof items === 'object') {
        return items;
    } else {
        return [items];
    }
}

export function getTBarItemsIndex(items: string[], toolbarItems: IToolbarItemModel[]): number[] {
    let itemsIndex: number[] = [];
    for (let i: number = 0; i < items.length; i++) {
        for (let j: number = 0; j < toolbarItems.length; j++) {
            if (toolbarItems[j].type === 'Separator') {
                continue;
            } else {
                if (items[i] === 'OrderedList' && toolbarItems[j].subCommand === 'OL') {
                    itemsIndex.push(j);
                    break;
                } else if (items[i] === 'UnorderedList' && toolbarItems[j].subCommand === 'UL') {
                    itemsIndex.push(j);
                    break;
                } else if (items[i] === toolbarItems[j].subCommand) {
                    itemsIndex.push(j);
                    break;
                }
            }
        }
    }
    return itemsIndex;
}

export function updateUndoRedoStatus(baseToolbar: BaseToolbar, undoRedoStatus: { [key: string]: boolean }): void {
    let i: number = 0;
    let trgItems: number[] = getTBarItemsIndex(getCollection(undoRedoItems), baseToolbar.toolbarObj.items);
    let tbItems: HTMLElement[] = selectAll('.' + classes.CLS_TB_ITEM, baseToolbar.toolbarObj.element);
    let keys: string[] = Object.keys(undoRedoStatus);
    for (let key of keys) {
        let target: HTMLElement = tbItems[trgItems[i]];
        if (target) { baseToolbar.toolbarObj.enableItems(target, undoRedoStatus[key]); }
        i++;
    }
}

/**
 * To dispatch the event manually 
 */
export function dispatchEvent(element: Element | HTMLDocument, type: string): void {
    let evt: Event = document.createEvent('HTMLEvents');
    evt.initEvent(type, false, true);
    element.dispatchEvent(evt);
}