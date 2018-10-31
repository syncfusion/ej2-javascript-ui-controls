
import { TreeMap } from '../treemap';
import { Browser } from '@syncfusion/ej2-base';
import { IItemHighlightEventArgs, IItemSelectedEventArgs } from '../model/interface';
import { itemHighlight, itemSelected } from '../model/constants';
import { HighlightSettingsModel, SelectionSettingsModel } from '../model/base-model';
import { findHightLightItems, removeClassNames, applyOptions } from '../utils/helper';

/**
 * Performing treemap highlight
 */

export class TreeMapHighlight {
    private treemap: TreeMap;
    private highLightId: string;
    constructor(treeMap: TreeMap) {
        this.treemap = treeMap;
        this.addEventListener();
    }

    /* tslint:disable:no-string-literal */
    public mouseMove(e: PointerEvent): boolean {
        let treemap: TreeMap = this.treemap;
        let processHighlight: boolean;
        let targetId: string = (<Element>e.target).id;
        let eventArgs: IItemHighlightEventArgs; let items: Object[] = [];
        let highlight: HighlightSettingsModel = this.treemap.highlightSettings;
        let item: Object; let highLightElements: Element[] = []; let process: boolean;
        let treeMapElement: Element; let element: Element; let orders: string[];
        if (targetId.indexOf('_Item_Index') > -1) {
            if (this.highLightId !== targetId) {
                treeMapElement = document.getElementById(treemap.element.id + '_TreeMap_' + treemap.layoutType + '_Layout');
                let selectionElements: HTMLCollection = document.getElementsByClassName('treeMapSelection');
                item = this.treemap.layout.renderItems[parseFloat(targetId.split('_')[6])];
                orders = findHightLightItems(item, [], highlight.mode, treemap);
                for (let i: number = 0; i < treeMapElement.childElementCount; i++) {
                    element = treeMapElement.childNodes[i] as Element;
                    process = true;
                    item = treemap.layout.renderItems[element.id.split('_')[6]];
                    for (let j: number = 0; j < selectionElements.length; j++) {
                        if (element.id === selectionElements[j].id) {
                            process = false;
                            break;
                        }
                    }
                    if (orders.indexOf(item['levelOrderName']) > -1 && process) {
                        highLightElements.push(element);
                        items.push(item);
                    }
                }
                removeClassNames(document.getElementsByClassName('treeMapHighLight'), 'treeMapHighLight', treemap);
                for (let k: number = 0; k < highLightElements.length; k++) {
                    element = highLightElements[k];
                    applyOptions(
                        element.childNodes[0] as SVGPathElement,
                        { border: highlight.border, fill: highlight.fill, opacity: highlight.opacity }
                    );
                    element.classList.add('treeMapHighLight');
                    this.highLightId = targetId;
                }
                eventArgs = { cancel: false, name: itemHighlight, treemap: treemap, items: items, elements: highLightElements };
                treemap.trigger(itemHighlight, eventArgs);
            } else {
                processHighlight = false;
            }
        } else {
            removeClassNames(document.getElementsByClassName('treeMapHighLight'), 'treeMapHighLight', treemap);
            processHighlight = false;
        }
        return processHighlight;
    }

    /**
     * To bind events for highlight
     */
    private addEventListener(): void {
        if (this.treemap.isDestroyed) {
            return;
        }
        this.treemap.on(Browser.touchMoveEvent, this.mouseMove, this);
    }
    /**
     * To unbind events for highlight
     */
    private removeEventListener(): void {
        if (this.treemap.isDestroyed) {
            return;
        }
        this.treemap.off(Browser.touchMoveEvent, this.mouseMove);
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'treeMapHighlight';
    }
    /**
     * To destroy the hightlight. 
     * @return {void}
     * @private
     */
    public destroy(treeMap: TreeMap): void {
        this.removeEventListener();
    }
}
/**
 * Performing treemap selection
 */
export class TreeMapSelection {
    private treemap: TreeMap;
    private selectionId: string;
    constructor(treeMap: TreeMap) {
        this.treemap = treeMap;
        this.addEventListener();
    }

    /* tslint:disable:no-string-literal */
    /**
     * Mouse down event in selection
     */
    public mouseDown(e: PointerEvent): void {
        let targetEle: Element = <Element>e.target;
        let eventArgs: IItemSelectedEventArgs;
        let treemap: TreeMap = this.treemap;
        let items: Object[] = []; let targetId: string = targetEle.id;
        let item: Object; let selectionElements: Element[] = []; let opacity: string;
        let treeMapElement: Element; let element: Element; let orders: string[];
        let selection: SelectionSettingsModel = treemap.selectionSettings;
        let layoutID: string = treemap.element.id + '_TreeMap_' + treemap.layoutType + '_Layout';
        if (targetId.indexOf('_Item_Index') > -1) {
            e.preventDefault();
            if (this.selectionId !== targetId) {
                treeMapElement = document.getElementById(layoutID);
                item = treemap.layout.renderItems[parseFloat(targetId.split('_')[6])];
                orders = findHightLightItems(item, [], selection.mode, treemap);
                for (let i: number = 0; i < treeMapElement.childElementCount; i++) {
                    element = treeMapElement.childNodes[i] as Element;
                    item = treemap.layout.renderItems[element.id.split('_')[6]];
                    if (orders.indexOf(item['levelOrderName']) > -1) {
                        selectionElements.push(element);
                        items.push(item);
                    }
                }
                removeClassNames(document.getElementsByClassName('treeMapSelection'), 'treeMapSelection', treemap);
                this.selectionId = targetId;
                let highLightElements: HTMLCollection = document.getElementsByClassName('treeMapHighLight');
                for (let k: number = 0; k < selectionElements.length; k++) {
                    element = selectionElements[k];
                    if (highLightElements.length > 0) {
                        for (let j: number = 0; j < highLightElements.length; j++) {
                            if (highLightElements[j].id === element.id) {
                                highLightElements[j].classList.remove('treeMapHighLight');
                            }
                            applyOptions(
                                element.childNodes[0] as SVGPathElement,
                                { border: selection.border, fill: selection.fill, opacity: selection.opacity }
                            );
                            element.classList.add('treeMapSelection');
                        }
                    } else {
                        applyOptions(
                            element.childNodes[0] as SVGPathElement,
                            { border: selection.border, fill: selection.fill, opacity: selection.opacity }
                        );
                        element.classList.add('treeMapSelection');
                    }
                    eventArgs = { cancel: false, name: itemSelected, treemap: treemap, items: items, elements: selectionElements };
                    treemap.trigger(itemSelected, eventArgs);
                }
            } else {
                removeClassNames(document.getElementsByClassName('treeMapSelection'), 'treeMapSelection', treemap);
                this.selectionId = '';
            }
        } else {
            removeClassNames(document.getElementsByClassName('treeMapSelection'), 'treeMapSelection', treemap);
            this.selectionId = '';
        }
    }

    /**
     * To bind events for selection
     */
    private addEventListener(): void {
        if (this.treemap.isDestroyed) {
            return;
        }
        this.treemap.on(Browser.touchStartEvent, this.mouseDown, this);
    }
    /**
     * To unbind events for selection
     */
    private removeEventListener(): void {
        if (this.treemap.isDestroyed) {
            return;
        }
        this.treemap.off(Browser.touchStartEvent, this.mouseDown);
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'treeMapSelection';
    }
    /**
     * To destroy the selection. 
     * @return {void}
     * @private
     */
    public destroy(treeMap: TreeMap): void {
        this.removeEventListener();
    }
}