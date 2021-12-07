/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable brace-style */
import { TreeMap } from '../treemap';
import { Browser, isNullOrUndefined, createElement } from '@syncfusion/ej2-base';
import { IItemHighlightEventArgs, IItemSelectedEventArgs } from '../model/interface';
import { itemHighlight, itemSelected } from '../model/constants';
import { HighlightSettingsModel, SelectionSettingsModel } from '../model/base-model';
import { findHightLightItems, removeClassNames, applyOptions, removeShape, removeLegend,
    removeSelectionWithHighlight, setColor, getLegendIndex, pushCollection, setItemTemplateContent } from '../utils/helper';

/**
 * Performing treemap highlight
 */
export class TreeMapHighlight {
    private treemap: TreeMap;
    public highLightId: string;
    private target: string = 'highlight';
    public shapeTarget: string = 'highlight';
    private shapeElement: Element;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public shapeHighlightCollection: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public legendHighlightCollection: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public currentElement: any[] = [];
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor(treeMap: TreeMap) {
        this.treemap = treeMap;
        this.addEventListener();
    }

    /* eslint-disable max-len */
    // eslint-disable-next-line valid-jsdoc
    /**
     * Mouse down event in highlight
     */
    public mouseMove(e: PointerEvent): boolean {
        const treemap: TreeMap = this.treemap;
        let processHighlight: boolean;
        const targetId: string = (<Element>e.target).id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let eventArgs: IItemHighlightEventArgs; const items: any[] = [];
        const highlight: HighlightSettingsModel = this.treemap.highlightSettings;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let item: any; const highLightElements: Element[] = []; let process: boolean;
        let treeMapElement: Element; let element: Element; let orders: string[];
        const selectionModule: TreeMapSelection = this.treemap.treeMapSelectionModule;
        if (targetId.indexOf('_Item_Index') > -1 && (selectionModule ? this.treemap.selectionId !== targetId : true)) {
            if (this.highLightId !== targetId) {
                treeMapElement = document.getElementById(treemap.element.id + '_TreeMap_' + treemap.layoutType + '_Layout');
                const selectionElements: HTMLCollection = document.getElementsByClassName('treeMapSelection');
                item = this.treemap.layout.renderItems[parseFloat(targetId.split('_')[6])];
                let index: number;
                if (this.treemap.legendSettings.visible) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const collection: any[] = this.treemap.treeMapLegendModule.legendCollections;
                    const length: number = this.treemap.treeMapLegendModule.legendCollections.length;
                    index = getLegendIndex(length, item, treemap);
                    this.shapeElement = this.treemap.legendSettings.mode === 'Default' ? document.getElementById('container_Legend_Shape_Index_' + index) : document.getElementById('container_Legend_Index_' + index);
                    if (this.shapeElement !== null && (selectionModule ? this.shapeElement.getAttribute('id') !== selectionModule.legendSelectId : true)) {
                        if (selectionModule ? this.shapeElement !== selectionModule.shapeElement : true) {
                            this.currentElement.push({currentElement: this.shapeElement});
                            removeShape(this.shapeHighlightCollection, 'highlight');
                            this.shapeHighlightCollection.push({ legendEle: this.shapeElement, oldFill: collection[index]['legendFill'],
                                oldOpacity: collection[index]['opacity'], oldBorderColor: collection[index]['borderColor'],
                                oldBorderWidth: collection[index]['borderWidth']
                            });
                            setColor(
                                this.shapeElement, highlight.fill, highlight.opacity, highlight.border.color,
                                highlight.border.width.toString());
                            this.target = 'highlight';
                        } else if (this.currentElement.length > 0 && this.currentElement[this.currentElement.length - 1]['currentElement'] !== this.shapeElement) {
                            removeSelectionWithHighlight(this.shapeHighlightCollection, this.currentElement, treemap);
                            this.highLightId = '';
                        }
                    } else if (this.currentElement.length > 0 && this.currentElement[this.currentElement.length - 1]['currentElement'] !== this.shapeElement) {
                        removeSelectionWithHighlight(this.shapeHighlightCollection, this.currentElement, treemap);
                        this.highLightId = '';
                    }
                }
                orders = findHightLightItems(item, [], highlight.mode, treemap);
                if (this.treemap.legendSettings.visible ? selectionModule ? this.shapeElement ? this.shapeElement.getAttribute('id') !== selectionModule.legendSelectId : true : true : true) {
                    if (this.treemap.legendSettings.visible ? selectionModule ? this.shapeElement !== selectionModule.shapeElement : true : true) {
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
                }
            }
        } else if (targetId.indexOf('_Legend_Shape') > -1 || targetId.indexOf('_Legend_Index') > -1) {
            if (this.treemap.legendSettings.visible && (selectionModule ? selectionModule.legendSelectId !== targetId : true) && (selectionModule ? selectionModule.shapeSelectId !== targetId : true)) {
                let itemIndex: number;
                let groupIndex: number;
                let length: number;
                const targetEle: Element = document.getElementById(targetId);
                if (this.shapeTarget === 'highlight') {
                    removeLegend(this.legendHighlightCollection, 'highlight');
                }
                this.shapeTarget = 'highlight';
                const index: number = this.treemap.legendSettings.mode === 'Default' ? parseFloat(targetId.split('_')[4]) : parseFloat(targetId.split('_')[3]);
                const dataLength: number = this.treemap.treeMapLegendModule.legendCollections[index]['legendData'].length;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const collection: any[] = this.treemap.treeMapLegendModule.legendCollections;
                const legendIndex: number = parseInt(targetId[targetId.length - 1], 10);
                for (let i: number = 0; i < dataLength; i++) {
                    for (let j: number = 0; j < this.treemap.layout.renderItems.length; j++) {
                        if (this.treemap.treeMapLegendModule.legendCollections[index]['legendData'][i]['levelOrderName'] === this.treemap.layout.renderItems[j]['levelOrderName']) {
                            itemIndex = j;
                            groupIndex = this.treemap.layout.renderItems[j]['groupIndex'];
                            const nodeEle: Element = document.getElementById('container_Level_Index_' + groupIndex + '_Item_Index_' + itemIndex + '_RectPath');
                            if (i === 0) {
                                this.legendHighlightCollection = [];
                                pushCollection(
                                    this.legendHighlightCollection, legendIndex, j, targetEle, nodeEle,
                                    this.treemap.layout.renderItems, collection);
                                length = this.legendHighlightCollection.length;
                                this.legendHighlightCollection[length - 1]['ShapeCollection'] = { Elements: [] };
                            }
                            setColor(
                                targetEle, highlight.fill, highlight.opacity, highlight.border.color,
                                highlight.border.width.toString());
                            setColor(
                                nodeEle, highlight.fill, highlight.opacity, highlight.border.color,
                                highlight.border.width.toString());
                            length = this.legendHighlightCollection.length;
                            this.legendHighlightCollection[length - 1]['ShapeCollection']['Elements'].push(nodeEle);
                        }
                    }
                }
            }
        } else {
            if (selectionModule ? this.shapeElement ? this.shapeElement.getAttribute('id') !== selectionModule.legendSelectId : true : true) {
                if (selectionModule ? this.shapeElement !== selectionModule.shapeElement : true && this.treemap.legendSettings.visible) {
                    removeClassNames(document.getElementsByClassName('treeMapHighLight'), 'treeMapHighLight', treemap);
                }
            }
            if ((this.shapeTarget === 'highlight' || this.target === 'highlight') && this.treemap.legendSettings.visible) {
                if (selectionModule ? this.shapeElement ? this.shapeElement.getAttribute('id') !== selectionModule.legendSelectId : true : true) {
                    if (selectionModule ? this.shapeElement !== selectionModule.shapeElement : true && selectionModule ? selectionModule.legendSelect : true) {
                        removeShape(this.shapeHighlightCollection, 'highlight');
                        this.shapeHighlightCollection = [];
                    }
                }
            }
            if (this.shapeTarget === 'highlight' && this.treemap.legendSettings.visible) {
                removeLegend(this.legendHighlightCollection, 'highlight');
            }
            this.highLightId = '';
            processHighlight = false;
        }
        return processHighlight;
    }

    /**
     * To bind events for highlight
     *
     * @returns {void}
     */
    private addEventListener(): void {
        if (this.treemap.isDestroyed) {
            return;
        }
        this.treemap.on(Browser.touchMoveEvent, this.mouseMove, this);
    }
    /**
     * To unbind events for highlight
     *
     * @returns {void}
     */
    private removeEventListener(): void {
        if (this.treemap.isDestroyed) {
            return;
        }
        this.treemap.off(Browser.touchMoveEvent, this.mouseMove);
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name
     */
    protected getModuleName(): string {
        return 'treeMapHighlight';
    }
    /**
     * To destroy the hightlight.
     *
     * @param {TreeMap} treeMap - Specifies the instance of the treemap.
     * @returns {void}
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
    public legendSelectId: string;
    public shapeSelectId: string;
    public shapeElement: Element;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public shapeSelectionCollection: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public legendSelectionCollection: any[] = [];
    public shapeSelect: boolean = true;
    public legendSelect: boolean = true;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor(treeMap: TreeMap) {
        this.treemap = treeMap;
        this.addEventListener();
    }

    // eslint-disable-next-line valid-jsdoc
    /**
     * Mouse down event in selection
     */
    public mouseDown(e: PointerEvent): void {
        const targetEle: Element = <Element>e.target;
        let eventArgs: IItemSelectedEventArgs;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const treemap: TreeMap = this.treemap;
        treemap.levelSelection = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items: any[] = []; const targetId: string = targetEle.id; const labelText : string = targetEle.innerHTML;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let item: any; const selectionElements: Element[] = []; let opacity: string;
        let treeMapElement: Element; let element: Element; let orders: string[];
        const selection: SelectionSettingsModel = treemap.selectionSettings;
        const highlightModule: TreeMapHighlight = this.treemap.treeMapHighlightModule;
        const layoutID: string = treemap.element.id + '_TreeMap_' + treemap.layoutType + '_Layout';
        if (targetId.indexOf('_Item_Index') > -1) {
            e.preventDefault();
            if (this.treemap.selectionId !== targetId && this.legendSelect) {
                treeMapElement = document.getElementById(layoutID);
                item = treemap.layout.renderItems[parseFloat(targetId.split('_')[6])];
                let index: number;
                if (this.treemap.legendSettings.visible) {
                    this.shapeSelect = false;
                    const length: number = this.treemap.treeMapLegendModule.legendCollections.length;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const collection: any[] = this.treemap.treeMapLegendModule.legendCollections;
                    this.shapeElement = undefined;
                    removeShape(this.shapeSelectionCollection, 'selection');
                    if (highlightModule) {
                        highlightModule.shapeTarget = 'selection';
                        highlightModule.shapeHighlightCollection = [];
                    }
                    index = getLegendIndex(length, item, treemap);
                    this.shapeElement = this.treemap.legendSettings.mode === 'Default' ? document.getElementById('container_Legend_Shape_Index_' + index) : document.getElementById('container_Legend_Index_' + index);
                    if (this.shapeElement !== null) {
                        this.shapeSelectId = this.shapeElement.getAttribute('id');
                        this.shapeSelectionCollection.push({ legendEle: this.shapeElement, oldFill: collection[index]['legendFill'],
                            oldOpacity: collection[index]['opacity'], oldBorderColor: collection[index]['borderColor'],
                            oldBorderWidth: collection[index]['borderWidth']
                        });
                        setColor(
                            this.shapeElement, selection.fill, selection.opacity, selection.border.color,
                            selection.border.width.toString());
                    }
                }
                orders = findHightLightItems(item, [], selection.mode, treemap);
                for (let i: number = 0; i < treeMapElement.childElementCount; i++) {
                    element = treeMapElement.childNodes[i] as Element;
                    item = treemap.layout.renderItems[element.id.split('_')[6]];
                    if (orders.indexOf(item['levelOrderName']) > -1) {
                        selectionElements.push(element);
                        treemap.levelSelection.push(element.id);
                        items.push(item);
                    }
                }
                removeClassNames(document.getElementsByClassName('treeMapSelection'), 'treeMapSelection', treemap);
                this.treemap.selectionId = targetId;
                const highLightElements: HTMLCollection = document.getElementsByClassName('treeMapHighLight');
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
                    eventArgs = { cancel: false, name: itemSelected, treemap: treemap, items: items, elements: selectionElements,
                        text : labelText, contentItemTemplate : labelText };
                    treemap.trigger(itemSelected, eventArgs, (observedArgs: IItemSelectedEventArgs) => {
                        if (observedArgs.contentItemTemplate !== labelText) {
                            setItemTemplateContent(targetId, targetEle, observedArgs.contentItemTemplate);
                        }
                    });
                }
            } else {
                removeShape(this.shapeSelectionCollection, 'selection');
                this.shapeSelectionCollection = [];
                this.shapeElement = undefined;
                this.shapeSelect = true;
                this.shapeSelectId = '';
                this.treemap.legendId = [];
                removeClassNames(document.getElementsByClassName('treeMapSelection'), 'treeMapSelection', treemap);
                this.treemap.selectionId = '';
            }
        } else if (targetId.indexOf('_Legend_Shape') > -1 || targetId.indexOf('_Legend_Index') > -1) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const collection: any[] = this.treemap.treeMapLegendModule.legendCollections;
            if (this.treemap.legendSettings.visible && this.legendSelectId !== targetId && this.shapeSelect) {
                let itemIndex: number;
                let groupIndex: number;
                let length: number;
                this.legendSelectId = targetId;
                this.legendSelect = false;
                const legendIndex: number = parseInt(targetId[targetId.length - 1], 10);
                const targetEle: Element = document.getElementById(targetId);
                removeLegend(this.legendSelectionCollection, 'selection');
                if (highlightModule) { highlightModule.shapeTarget = 'selection'; }
                const index: number = this.treemap.legendSettings.mode === 'Default' ? parseFloat(targetId.split('_')[4]) : parseFloat(targetId.split('_')[3]);
                const dataLength: number = this.treemap.treeMapLegendModule.legendCollections[index]['legendData'].length;
                for (let k: number = 0; k < dataLength; k++) {
                    for (let l: number = 0; l < this.treemap.layout.renderItems.length; l++) {
                        if (this.treemap.treeMapLegendModule.legendCollections[index]['legendData'][k]['levelOrderName'] === this.treemap.layout.renderItems[l]['levelOrderName']) {
                            itemIndex = l;
                            groupIndex = this.treemap.layout.renderItems[l]['groupIndex'];
                            const nodeEle: Element = document.getElementById('container_Level_Index_' + groupIndex + '_Item_Index_' + itemIndex + '_RectPath');
                            if (k === 0) {
                                pushCollection(
                                    this.legendSelectionCollection, legendIndex, l, targetEle, nodeEle,
                                    this.treemap.layout.renderItems, collection);
                                length = this.legendSelectionCollection.length;
                                this.legendSelectionCollection[length - 1]['ShapeCollection'] = { Elements: [] };
                            }
                            setColor(
                                targetEle, selection.fill, selection.opacity, selection.border.color,
                                selection.border.width.toString());
                            setColor(
                                nodeEle, selection.fill, selection.opacity, selection.border.color,
                                selection.border.width.toString());
                            length = this.legendSelectionCollection.length;
                            this.legendSelectionCollection[length - 1]['ShapeCollection']['Elements'].push(nodeEle);
                        }
                    }
                }
            } else {
                removeLegend(this.legendSelectionCollection, 'Selection');
                if (highlightModule) { highlightModule.shapeTarget = 'highlight'; }
                this.legendSelect = true;
                this.legendSelectId = '';
            }
        }
    }

    /**
     * @param {string} levelOrder - Specifies the level order of treemap item
     * @param {boolean} enable - Specifies the boolean value
     * @returns {void}
     * @private
     */
    public selectTreemapItem(levelOrder: string, enable: boolean): void {
        if (enable) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let item: any;
            for (let s: number = 0; s < this.treemap.layout.renderItems.length; s++) {
                if (levelOrder === this.treemap.layout.renderItems[s]['levelOrderName']) {
                    item = this.treemap.layout.renderItems[s];
                    break;
                }
            }
            const selection: SelectionSettingsModel = this.treemap.selectionSettings;
            const selectionElements: Element[] = [];
            let element: Element;
            let index: number;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const items: any[] = [];
            this.treemap.levelSelection = [];
            const layoutID: string = this.treemap.element.id + '_TreeMap_' + this.treemap.layoutType + '_Layout';
            const treeMapElement: Element = document.getElementById(layoutID);
            const orders: string[] = findHightLightItems(item, [], selection.mode, this.treemap);
            for (let i: number = 0; i < treeMapElement.childElementCount; i++) {
                element = treeMapElement.childNodes[i] as Element;
                item = this.treemap.layout.renderItems[element.id.split('_')[6]];
                if (orders.indexOf(item['levelOrderName']) > -1) {
                    selectionElements.push(element);
                    this.treemap.levelSelection.push(element.id);
                    items.push(item);
                }
            }
            if (this.treemap.legendSettings.visible) {
                for (let m: number = 0; m < items.length; m++) {
                    this.shapeSelect = false;
                    const length: number = this.treemap.treeMapLegendModule.legendCollections.length;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const collection: any[] = this.treemap.treeMapLegendModule.legendCollections;
                    this.shapeElement = undefined;
                    removeShape(this.shapeSelectionCollection, 'selection');
                    index = getLegendIndex(length, items[m], this.treemap);
                    this.shapeElement = this.treemap.legendSettings.mode === 'Default' ? document.getElementById('container_Legend_Shape_Index_' + index) : document.getElementById('container_Legend_Index_' + index);
                    if (this.shapeElement !== null) {
                        this.shapeSelectId = this.shapeElement.getAttribute('id');
                        this.treemap.legendId.push(this.shapeSelectId);
                        this.shapeSelectionCollection.push({
                            legendEle: this.shapeElement, oldFill: collection[index]['legendFill'],
                            oldOpacity: collection[index]['opacity'], oldBorderColor: collection[index]['borderColor'],
                            oldBorderWidth: collection[index]['borderWidth']
                        });
                        setColor(
                            this.shapeElement, selection.fill, selection.opacity, selection.border.color,
                            selection.border.width.toString());
                    }
                }
            }
            removeClassNames(document.getElementsByClassName('treeMapSelection'), 'treeMapSelection', this.treemap);
            const selectionElement: Element = document.getElementById(this.treemap.levelSelection[0]);
            this.treemap.selectionId = selectionElement.childNodes[0]['id'];
            const highLightElements: HTMLCollection = document.getElementsByClassName('treeMapHighLight');
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
                    selection.fill = selection.fill === 'null' ?
                        this.treemap.layout.renderItems[parseInt(element.id.split('Item_Index_')[1], 10)]['options']['fill']
                        : selection.fill;
                    applyOptions(
                        element.childNodes[0] as SVGPathElement,
                        { border: selection.border, fill: selection.fill, opacity: selection.opacity }
                    );
                    element.classList.add('treeMapSelection');
                }
            }
        } else {
            removeShape(this.shapeSelectionCollection, 'selection');
            this.shapeElement = undefined;
            this.treemap.levelSelection = [];
            this.shapeSelect = true;
            this.shapeSelectId = '';
            this.treemap.legendId = [];
            removeClassNames(document.getElementsByClassName('treeMapSelection'), 'treeMapSelection', this.treemap);
            this.treemap.selectionId = '';
        }
    }

    /**
     * To bind events for selection
     *
     * @returns {void}
     */
    private addEventListener(): void {
        if (this.treemap.isDestroyed) {
            return;
        }
        this.treemap.on(Browser.touchStartEvent, this.mouseDown, this);
    }
    /**
     * To unbind events for selection
     *
     * @returns {void}
     */
    private removeEventListener(): void {
        if (this.treemap.isDestroyed) {
            return;
        }
        this.treemap.off(Browser.touchStartEvent, this.mouseDown);
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        return 'treeMapSelection';
    }
    /**
     * To destroy the selection.
     *
     * @param {TreeMap} treeMap - Specifies the treemap instance.
     * @returns {void}
     * @private
     */
    public destroy(treeMap: TreeMap): void {
        this.removeEventListener();
    }
}
