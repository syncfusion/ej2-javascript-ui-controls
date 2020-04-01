
import { TreeMap } from '../treemap';
import { Browser, isNullOrUndefined, createElement } from '@syncfusion/ej2-base';
import { IItemHighlightEventArgs, IItemSelectedEventArgs } from '../model/interface';
import { itemHighlight, itemSelected } from '../model/constants';
import { HighlightSettingsModel, SelectionSettingsModel } from '../model/base-model';
import { findHightLightItems, removeClassNames, applyOptions, removeShape, removeLegend,
    removeSelectionWithHighlight, setColor, getLegendIndex, pushCollection } from '../utils/helper';

/**
 * Performing treemap highlight
 */
export class TreeMapHighlight {
    private treemap: TreeMap;
    public highLightId: string;
    private target: string = 'highlight';
    public shapeTarget: string = 'highlight';
    private shapeElement: Element;
    public shapeHighlightCollection: object[] = [];
    public legendHighlightCollection: object[] = [];
    public currentElement: object[] = [];
    constructor(treeMap: TreeMap) {
        this.treemap = treeMap;
        this.addEventListener();
    }

    /* tslint:disable:no-string-literal */
    //tslint:disable:max-func-body-length
    /* tslint:disable:max-line-length */
    /**
     * Mouse down event in highlight
     */
    public mouseMove(e: PointerEvent): boolean {
        let treemap: TreeMap = this.treemap;
        let processHighlight: boolean;
        let targetId: string = (<Element>e.target).id;
        let eventArgs: IItemHighlightEventArgs; let items: Object[] = [];
        let eventBlazorArgs: IItemHighlightEventArgs;
        let highlight: HighlightSettingsModel = this.treemap.highlightSettings;
        let item: Object; let highLightElements: Element[] = []; let process: boolean;
        let treeMapElement: Element; let element: Element; let orders: string[];
        let selectionModule: TreeMapSelection = this.treemap.treeMapSelectionModule;
        if (targetId.indexOf('_Item_Index') > -1 && (selectionModule ? selectionModule.selectionId !== targetId : true)) {
            if (this.highLightId !== targetId) {
                treeMapElement = document.getElementById(treemap.element.id + '_TreeMap_' + treemap.layoutType + '_Layout');
                let selectionElements: HTMLCollection = document.getElementsByClassName('treeMapSelection');
                item = this.treemap.layout.renderItems[parseFloat(targetId.split('_')[6])];
                let index: number;
                if (this.treemap.legendSettings.visible) {
                    let collection: object[] = this.treemap.treeMapLegendModule.legendCollections;
                    let length: number = this.treemap.treeMapLegendModule.legendCollections.length;
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
                eventBlazorArgs = { cancel: false, name: itemHighlight, items: null, elements: highLightElements };
                treemap.trigger(itemHighlight, treemap.isBlazor ? eventBlazorArgs : eventArgs);
            } else {
                processHighlight = false;
            }
        }
    }
        } else if (targetId.indexOf('_Legend_Shape') > -1 || targetId.indexOf('_Legend_Index') > -1) {
            if (this.treemap.legendSettings.visible && (selectionModule ? selectionModule.legendSelectId !== targetId : true) && (selectionModule ? selectionModule.shapeSelectId !== targetId : true)) {
                let index: number;
                let itemIndex: number;
                let groupIndex: number;
                let length: number;
                let targetEle: Element = document.getElementById(targetId);
                if (this.shapeTarget === 'highlight') {
                    removeLegend(this.legendHighlightCollection, 'highlight');
                }
                this.shapeTarget = 'highlight';
                index = this.treemap.legendSettings.mode === 'Default' ? parseFloat(targetId.split('_')[4]) : parseFloat(targetId.split('_')[3]);
                let dataLength: number = this.treemap.treeMapLegendModule.legendCollections[index]['legendData'].length;
                let collection: object[] = this.treemap.treeMapLegendModule.legendCollections;
                let legendIndex: number = parseInt(targetId[targetId.length - 1], 10);
                for (let i: number = 0; i < dataLength; i++) {
                    for (let j: number = 0; j < this.treemap.layout.renderItems.length; j++) {
                        if (this.treemap.treeMapLegendModule.legendCollections[index]['legendData'][i]['levelOrderName'] === this.treemap.layout.renderItems[j]['levelOrderName']) {
                            itemIndex = j;
                            groupIndex = this.treemap.layout.renderItems[j]['groupIndex'];
                            let nodeEle: Element = document.getElementById('container_Level_Index_' + groupIndex + '_Item_Index_' + itemIndex + '_RectPath');
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
    public selectionId: string;
    public legendSelectId: string;
    public shapeSelectId: string;
    public shapeElement: Element;
    public shapeSelectionCollection: object[] = [];
    public legendSelectionCollection: object[] = [];
    public shapeSelect: boolean = true;
    public legendSelect: boolean = true;
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
        let eventBlazorArgs: Object;
        let treemap: TreeMap = this.treemap;
        let items: Object[] = []; let targetId: string = targetEle.id; let labelText : string = targetEle.innerHTML;
        let item: Object; let selectionElements: Element[] = []; let opacity: string;
        let treeMapElement: Element; let element: Element; let orders: string[];
        let selection: SelectionSettingsModel = treemap.selectionSettings;
        let highlightModule: TreeMapHighlight = this.treemap.treeMapHighlightModule;
        let layoutID: string = treemap.element.id + '_TreeMap_' + treemap.layoutType + '_Layout';
        if (targetId.indexOf('_Item_Index') > -1) {
            e.preventDefault();
            if (this.selectionId !== targetId && this.legendSelect) {
                treeMapElement = document.getElementById(layoutID);
                item = treemap.layout.renderItems[parseFloat(targetId.split('_')[6])];
                let index: number;
                if (this.treemap.legendSettings.visible) {
                    this.shapeSelect = false;
                    let length: number = this.treemap.treeMapLegendModule.legendCollections.length;
                    let collection: object[] = this.treemap.treeMapLegendModule.legendCollections;
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
                        selection.fill = selection.fill === 'null' ?
                                    treemap.layout.renderItems[parseInt(element.id.split('Item_Index_')[1], 10)]['options']['fill']
                                            : selection.fill;
                        applyOptions(
                            element.childNodes[0] as SVGPathElement,
                            { border: selection.border, fill: selection.fill, opacity: selection.opacity }
                        );
                        element.classList.add('treeMapSelection');
                    }
                    eventArgs = { cancel: false, name: itemSelected, treemap: treemap, items: items, elements: selectionElements,
                        text : labelText, contentItemTemplate : labelText };
                    eventBlazorArgs = { cancel: false, name: itemSelected, text: labelText, contentItemTemplate: labelText };
                    if (treemap.isBlazor) {
                        const { treemap, items, elements, ...blazorEventArgs }: IItemSelectedEventArgs = eventArgs;
                        eventBlazorArgs = blazorEventArgs;
                    }
                    treemap.trigger(itemSelected, treemap.isBlazor ? eventBlazorArgs : eventArgs, (observedArgs: IItemSelectedEventArgs) => {
                        if (observedArgs.contentItemTemplate !== labelText) {
                            let itemSelect: string = targetId.split('_RectPath')[0];
                            let itemTemplate: Element;
                            if (targetId.indexOf('_LabelTemplate') > -1) {
                                itemTemplate = targetEle;
                            } else {
                                itemTemplate = document.querySelector('#' + itemSelect + '_LabelTemplate');
                            }
                            if (!isNullOrUndefined(itemTemplate)) {
                                if (treemap.isBlazor) {
                                    let templateCreated : Element = createElement('div');
                                    templateCreated.innerHTML = observedArgs.contentItemTemplate;
                                    let templateElement: Element = templateCreated.children[0].firstElementChild;
                                    itemTemplate['style']['left'] = Number(itemTemplate['style']['left'].split('px')[0]) - (templateElement['style']['width'].split('px')[0] / 2) + 'px';
                                    itemTemplate['style']['top'] = Number(itemTemplate['style']['top'].split('px')[0]) - (templateElement['style']['height'].split('px')[0] / 2) + 'px';
                                }
                                itemTemplate.innerHTML = observedArgs.contentItemTemplate;
                            }
                        }
                    });
                }
            } else {
                removeShape(this.shapeSelectionCollection, 'selection');
                this.shapeElement = undefined;
                this.shapeSelect = true;
                this.shapeSelectId = '';
                removeClassNames(document.getElementsByClassName('treeMapSelection'), 'treeMapSelection', treemap);
                this.selectionId = '';
            }
        } else if (targetId.indexOf('_Legend_Shape') > -1 || targetId.indexOf('_Legend_Index') > -1) {
            let collection: object[] = this.treemap.treeMapLegendModule.legendCollections;
            if (this.treemap.legendSettings.visible && this.legendSelectId !== targetId && this.shapeSelect) {
                let index: number;
                let itemIndex: number;
                let groupIndex: number;
                let length: number;
                this.legendSelectId = targetId;
                this.legendSelect = false;
                let legendIndex: number = parseInt(targetId[targetId.length - 1], 10);
                let targetEle: Element = document.getElementById(targetId);
                removeLegend(this.legendSelectionCollection, 'selection');
                if (highlightModule) { highlightModule.shapeTarget = 'selection'; }
                index = this.treemap.legendSettings.mode === 'Default' ? parseFloat(targetId.split('_')[4]) : parseFloat(targetId.split('_')[3]);
                let dataLength: number = this.treemap.treeMapLegendModule.legendCollections[index]['legendData'].length;
                for (let k: number = 0; k < dataLength; k++) {
                    for (let l: number = 0; l < this.treemap.layout.renderItems.length; l++) {
                        if (this.treemap.treeMapLegendModule.legendCollections[index]['legendData'][k]['levelOrderName'] === this.treemap.layout.renderItems[l]['levelOrderName']) {
                            itemIndex = l;
                            groupIndex = this.treemap.layout.renderItems[l]['groupIndex'];
                            let nodeEle: Element = document.getElementById('container_Level_Index_' + groupIndex + '_Item_Index_' + itemIndex + '_RectPath');
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