
import { TreeMap } from '../treemap';
import { Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
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
    constructor(treeMap: TreeMap) {
        this.treemap = treeMap;
        this.addEventListener();
    }

    /**
     * Mouse Move event in highlight
     *
     * @param {PointerEvent} e - Specifies the pointer argument.
     * @returns {boolean} - return the highlight process is true or false.
     * @private
     */
    public mouseMove(e: PointerEvent | KeyboardEvent): boolean {
        const targetEle: Element = <Element>e.target;
        return this.highlightOnMouseMove(targetEle);
    }

    /**
     * This method highlights the target element for mouse move event.
     *
     * @param {Element} targetElement - Specifies the target element to highlight.
     * @returns {boolean} - return the highlight process is true or false.
     * @private
     */
    public highlightOnMouseMove(targetElement: Element): boolean {
        const treemap: TreeMap = this.treemap;
        let processHighlight: boolean;
        const targetId: string = targetElement.id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let eventArgs: IItemHighlightEventArgs; const items: any[] = [];
        const highlight: HighlightSettingsModel = this.treemap.highlightSettings;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let item: any; const highLightElements: Element[] = []; let process: boolean;
        let treeMapElement: Element; let element: Element; let orders: string[];
        const selectionModule: TreeMapSelection = this.treemap.treeMapSelectionModule;
        let shapeSelected: boolean = false;
        if (selectionModule && selectionModule.legendSelectionCollection.length > 0) {
            for (let i: number = 0; i < selectionModule.legendSelectionCollection.length; i++) {
                for (let j: number = 0; j < selectionModule.legendSelectionCollection[i as number]['ShapeCollection']['Elements'].length; j++) {
                    const selectedElementIndex: number = parseFloat(selectionModule.legendSelectionCollection[i as number]['ShapeCollection']['Elements'][j as number].id.split('Item_Index_')[1].split('_')[0]);
                    const targetElementIndex: number = targetId.indexOf('_Item_Index_') > -1 ? parseFloat(targetId.split('Item_Index_')[1].split('_')[0]) : null;
                    if (selectionModule.legendSelectionCollection[i as number]['ShapeCollection']['Elements'][j as number].id === targetId ||
                        selectedElementIndex === targetElementIndex) {
                        shapeSelected = true;
                        break;
                    }
                }
            }
        }
        if (targetId.indexOf('_Item_Index') > -1 && !shapeSelected) {
            if (this.highLightId !== targetId ||
                (this.legendHighlightCollection[0] ? this.legendHighlightCollection[0]['ShapeCollection']['Elements'].length > 1 : false)) {
                treeMapElement = document.getElementById(treemap.element.id + '_TreeMap_' + treemap.layoutType + '_Layout');
                const selectionElements: HTMLCollection = document.getElementsByClassName('treeMapSelection');
                item = this.treemap.layout.renderItems[parseFloat(targetId.split('_Item_Index_')[1])];
                let index: number;
                if (this.treemap.legendSettings.visible) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const collection: any[] = this.treemap.treeMapLegendModule.legendCollections;
                    const length: number = this.treemap.treeMapLegendModule.legendCollections.length;
                    index = (!treemap.legendSettings.removeDuplicateLegend && treemap.palette && treemap.palette.length > 0 &&
                             treemap.leafItemSettings.colorMapping.length === 0 && treemap.levels.length === 0) ?
                        parseFloat(targetId.split('_Item_Index_')[1]) : getLegendIndex(length, item, treemap);
                    if (isNullOrUndefined(index)) {
                        removeLegend(this.legendHighlightCollection, treemap);
                        removeLegend(this.shapeHighlightCollection, treemap);
                        this.legendHighlightCollection = [];
                        treemap.treeMapLegendModule.removeInteractivePointer();
                    }
                    this.shapeElement = this.treemap.legendSettings.mode === 'Default' ? document.getElementById(this.treemap.element.id + '_Legend_Shape_Index_' + index) : document.getElementById(this.treemap.element.id + '_Legend_Index_' + index);
                    if (this.shapeElement !== null) {
                        if (selectionModule ? this.shapeElement.id !== ((selectionModule && selectionModule.shapeElement)
                            ? selectionModule.shapeElement.id : null) : true) {
                            this.currentElement.push({currentElement: this.shapeElement});
                            removeLegend(this.shapeHighlightCollection, treemap);
                            this.shapeHighlightCollection.push({ legendEle: this.shapeElement, oldFill: collection[index as number]['legendFill'],
                                oldOpacity: collection[index as number]['opacity'], oldBorderColor: collection[index as number]['borderColor'],
                                oldBorderWidth: collection[index as number]['borderWidth']
                            });
                            const legendText: Element = this.treemap.legendSettings.mode === 'Default' ? document.getElementById(this.treemap.element.id + '_Legend_Text_Index_' + index)
                                : document.getElementById(this.treemap.element.id + '_Legend_Index_' + index + '_Text');
                            setColor(
                                legendText, highlight.fill, highlight.opacity, null,
                                null);
                            setColor(
                                this.shapeElement, highlight.fill, highlight.opacity, highlight.border.color,
                                highlight.border.width.toString());
                            this.target = 'highlight';
                        } else if (this.currentElement.length > 0 && this.currentElement[this.currentElement.length - 1]['currentElement'] !== this.shapeElement) {
                            removeSelectionWithHighlight(this.shapeHighlightCollection, this.currentElement, treemap);
                            this.highLightId = '';
                        }
                    }
                }
                orders = findHightLightItems(item, [], highlight.mode, treemap);
                for (let i: number = 0; i < treeMapElement.childElementCount; i++) {
                    element = treeMapElement.childNodes[i as number] as Element;
                    process = true;
                    const valuePath: string = (treemap.rangeColorValuePath !== '') ? treemap.rangeColorValuePath : null;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const targetItem: any = treemap.layout.renderItems[parseFloat(targetId.split('_Item_Index_')[1])];
                    item = treemap.layout.renderItems[parseFloat(element.id.split('_Item_Index_')[1])];
                    for (let j: number = 0; j < selectionElements.length; j++) {
                        if (element.id === selectionElements[j as number].id ||
                            element.id === selectionElements[j as number].parentElement.id) {
                            process = false;
                            break;
                        }
                    }
                    if (orders.indexOf(item['levelOrderName']) > -1 && process &&
                        (!isNullOrUndefined(valuePath) ?
                            (item['data'][valuePath as string] === targetItem['data'][valuePath as string] ||
                                (highlight.mode !== 'Item' && treemap.levels.length > 0)
                            ) : true)) {
                        highLightElements.push(element);
                        items.push(item);
                    }
                }
                removeClassNames(document.getElementsByClassName('treeMapHighLight'), 'treeMapHighLight', treemap);
                for (let k: number = 0; k < highLightElements.length; k++) {
                    element = highLightElements[k as number];
                    applyOptions(
                        element.childNodes[0] as SVGPathElement,
                        { border: highlight.border, fill: highlight.fill, opacity: highlight.opacity }
                    );
                    element.classList.add('treeMapHighLight');
                    this.highLightId = targetId;
                }
                eventArgs = { cancel: false, name: itemHighlight, treemap: treemap, items: items, elements: highLightElements };
                treemap.trigger(itemHighlight, eventArgs);
            }
        } else if (targetId.indexOf('_Legend_Shape') > -1 || targetId.indexOf('_Legend_Index') > -1 || targetId.indexOf('_Legend_Text_Index') > -1) {
            if (!isNullOrUndefined(selectionModule)) {
                selectionModule.legendSelectId = !isNullOrUndefined(treemap.legendId[0]) ? treemap.legendId[0] : null;
            }
            const selectedLegendIndex: number = selectionModule && selectionModule.legendSelectId ?
                parseFloat(selectionModule.legendSelectId.split('Index_')[1]) :
                (selectionModule && selectionModule.shapeSelectId ? parseFloat(selectionModule.shapeSelectId.split('Index_')[1]) : null);
            const targetIndex: number = this.treemap.legendSettings.mode === 'Default'  ?  (targetId.indexOf('Text') === -1 ? parseFloat(targetId.split('_Legend_Shape_Index_')[1]) : parseFloat(targetId.split('_Legend_Text_Index_')[1]))
                : parseFloat(targetId.split('_Legend_Index_')[1]);
            if (this.treemap.legendSettings.visible && targetIndex !== selectedLegendIndex) {
                let itemIndex: number;
                let groupIndex: number;
                let length: number;
                const valuePath: string = (treemap.rangeColorValuePath !== '') ? treemap.rangeColorValuePath : null;
                const targetEle: Element = document.getElementById(targetId);
                if (this.shapeTarget === 'highlight') {
                    removeLegend(this.legendHighlightCollection, this.treemap);
                    this.legendHighlightCollection = [];
                }
                this.shapeTarget = 'highlight';
                const dataLength: number = this.treemap.treeMapLegendModule.legendCollections[targetIndex as number]['legendData'].length;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const collection: any[] = this.treemap.treeMapLegendModule.legendCollections;
                for (let i: number = 0; i < dataLength; i++) {
                    for (let j: number = 0; j < this.treemap.layout.renderItems.length; j++) {
                        if ((!isNullOrUndefined(valuePath) && treemap.leafItemSettings.colorMapping.length > 0 &&
                             treemap.levels.length === 0)
                            ? treemap.treeMapLegendModule.legendCollections[targetIndex as number]['legendData'][i as number]['data'][valuePath as string] === treemap.layout.renderItems[j as number]['data'][valuePath as string]
                            : (treemap.treeMapLegendModule.legendCollections[targetIndex as number]['legendData'][i as number]['levelOrderName'] === treemap.layout.renderItems[j as number]['levelOrderName'])) {
                            itemIndex = j;
                            groupIndex = this.treemap.layout.renderItems[j as number]['groupIndex'];
                            const nodeEle: Element = document.getElementById(this.treemap.element.id + '_Level_Index_' + groupIndex + '_Item_Index_' + itemIndex + '_RectPath');
                            if (i === 0 || this.legendHighlightCollection.length === 0) {
                                this.legendHighlightCollection = [];
                                pushCollection(
                                    this.legendHighlightCollection, targetIndex, j, targetEle, nodeEle,
                                    this.treemap.layout.renderItems, collection);
                                length = this.legendHighlightCollection.length;
                                this.legendHighlightCollection[length - 1]['ShapeCollection'] = { Elements: [] };
                            }
                            let legendShape: Element; let legendText: Element;
                            if (targetEle.id.indexOf('Text') > -1) {
                                legendShape = this.treemap.legendSettings.mode === 'Interactive' ? document.getElementById(targetEle.id.replace('_Text', ''))
                                    : document.getElementById(this.treemap.element.id + '_Legend_Shape_Index_' + targetIndex);
                                setColor(targetEle, highlight.fill, highlight.opacity, null, null);
                                setColor(legendShape, highlight.fill, highlight.opacity, highlight.border.color,
                                         highlight.border.width.toString());
                            } else {
                                legendText = this.treemap.legendSettings.mode === 'Interactive' ? document.getElementById(targetEle.id + '_Text')
                                    : document.getElementById(this.treemap.element.id + '_Legend_Text_Index_' + targetIndex);
                                setColor(legendText, highlight.fill, highlight.opacity, null, null);
                                setColor(targetEle, highlight.fill, highlight.opacity, highlight.border.color,
                                         highlight.border.width.toString());
                            }
                            setColor(
                                nodeEle, highlight.fill, highlight.opacity, highlight.border.color,
                                highlight.border.width.toString());
                            length = this.legendHighlightCollection.length;
                            this.legendHighlightCollection[length - 1]['ShapeCollection']['Elements'].push(nodeEle);
                        }
                    }
                }
                if (dataLength === 0 && this.treemap.palette && this.treemap.palette.length > 0) {
                    for (let j: number = 0; j < this.treemap.layout.renderItems.length; j++) {
                        if ((this.treemap.treeMapLegendModule.legendCollections[targetIndex as number]['levelOrderName'] === this.treemap.layout.renderItems[j as number]['levelOrderName'] ||
                            this.treemap.layout.renderItems[j as number]['levelOrderName'].indexOf(this.treemap.treeMapLegendModule.legendCollections[targetIndex as number]['levelOrderName']) > -1) &&
                            ((!this.treemap.legendSettings.removeDuplicateLegend && treemap.palette && treemap.palette.length > 0 &&
                              !this.treemap.layout.renderItems[j as number].parent.isDrilled) ?
                                targetIndex === j : true)) {
                            itemIndex = j;
                            groupIndex = this.treemap.layout.renderItems[j as number]['groupIndex'];
                            const nodeEle: Element = document.getElementById(this.treemap.element.id + '_Level_Index_' + groupIndex + '_Item_Index_' + itemIndex + '_RectPath');
                            pushCollection(
                                this.legendHighlightCollection, targetIndex, j, targetEle, nodeEle,
                                this.treemap.layout.renderItems, collection);
                            length = this.legendHighlightCollection.length;
                            this.legendHighlightCollection[length - 1]['ShapeCollection'] = { Elements: [] };
                            let legendItem: Element;
                            if (targetEle.id.indexOf('Text') > -1) {
                                legendItem = this.treemap.legendSettings.mode === 'Interactive' ? document.getElementById(targetEle.id.replace('_Text', ''))
                                    : document.getElementById(this.treemap.element.id + '_Legend_Shape_Index_' + targetIndex);
                                setColor(targetEle, highlight.fill, highlight.opacity, null, null);
                                setColor(
                                    legendItem, highlight.fill, highlight.opacity, highlight.border.color,
                                    highlight.border.width.toString());
                            } else {
                                legendItem = this.treemap.legendSettings.mode === 'Interactive' ? document.getElementById(targetEle.id + '_Text')
                                    : document.getElementById(this.treemap.element.id + '_Legend_Text_Index_' + targetIndex);
                                setColor(legendItem, highlight.fill, highlight.opacity, null, null);
                                setColor(
                                    targetEle, highlight.fill, highlight.opacity, highlight.border.color,
                                    highlight.border.width.toString());
                            }
                            setColor(
                                nodeEle, highlight.fill, highlight.opacity, highlight.border.color,
                                highlight.border.width.toString());
                            length = this.legendHighlightCollection.length;
                            this.legendHighlightCollection[length - 1]['ShapeCollection']['Elements'].push(nodeEle);
                        }
                    }
                }
            } else {
                removeClassNames(document.getElementsByClassName('treeMapHighLight'), 'treeMapHighLight', treemap);
                removeLegend(this.legendHighlightCollection, treemap);
                this.legendHighlightCollection = [];
            }
        } else {
            if (selectionModule ? this.shapeElement ? this.shapeElement.getAttribute('id') !== selectionModule.legendSelectId : true : true) {
                if (selectionModule ? this.shapeElement !== selectionModule.shapeElement : true && this.treemap.legendSettings.visible) {
                    removeClassNames(document.getElementsByClassName('treeMapHighLight'), 'treeMapHighLight', treemap);
                }
            }
            if ((this.shapeTarget === 'highlight' || this.target === 'highlight') && this.treemap.legendSettings.visible) {
                if (selectionModule ? this.shapeElement ? this.shapeElement.getAttribute('id') !== selectionModule.legendSelectId : true : true) {
                    if (selectionModule ? this.shapeElement !== selectionModule.shapeElement : true && selectionModule ?
                        selectionModule.legendSelect : true) {
                        removeLegend(this.shapeHighlightCollection, treemap);
                        this.shapeHighlightCollection = [];
                    }
                }
            }
            if (this.shapeTarget === 'highlight' && this.treemap.legendSettings.visible) {
                removeLegend(this.legendHighlightCollection, this.treemap);
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
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.shapeElement = null;
        this.shapeHighlightCollection = [];
        this.legendHighlightCollection = [];
        this.currentElement = [];
        this.removeEventListener();
        this.treemap = null;
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
    constructor(treeMap: TreeMap) {
        this.treemap = treeMap;
        this.addEventListener();
    }

    /**
     * Mouse down event in selection
     *
     * @param {PointerEvent} e - Specifies the pointer argument.
     * @returns {void}
     * @private
     */
    public mouseDown(e: PointerEvent | KeyboardEvent): void {
        const targetEle: Element = <Element>e.target;
        e.preventDefault();
        this.selectionOnMouseDown(targetEle);
    }

    /**
     * This method selects the target element for mouse down event.
     *
     * @param {Element} targetEle - Specifies the target element that was clicked.
     * @returns {void}
     * @private
     */
    public selectionOnMouseDown(targetEle: Element): void {
        let eventArgs: IItemSelectedEventArgs;
        const treemap: TreeMap = this.treemap;
        (targetEle as HTMLElement).setAttribute('tabindex', '-1');
        (targetEle as HTMLElement).style.outline = 'none';
        if (!targetEle.id.includes('Legend_Shape_Index')) {
            (targetEle as HTMLElement).focus();
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items: any[] = []; const targetId: string = targetEle.id; const labelText : string = (targetEle as HTMLElement).innerHTML;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let item: any; const selectionElements: Element[] = [];
        let treeMapElement: Element; let element: Element; let orders: string[];
        const selection: SelectionSettingsModel = treemap.selectionSettings;
        const highlightModule: TreeMapHighlight = this.treemap.treeMapHighlightModule;
        const layoutID: string = treemap.element.id + '_TreeMap_' + treemap.layoutType + '_Layout';
        item = treemap.layout.renderItems[parseFloat(targetId.split('_Item_Index_')[1])];
        const isDrillItem: boolean = (item && !item.isLeafItem && treemap.enableDrillDown) &&
            (targetEle.textContent.indexOf('[+]') > -1 || targetEle.textContent.indexOf('[-]') > -1 ||
             (!isNullOrUndefined(targetEle.nextElementSibling) &&
              (targetEle.nextSibling.textContent.indexOf('[+]') > -1 || targetEle.nextSibling.textContent.indexOf('[-]') > -1)));
        if (targetId.indexOf('_Item_Index') > -1 && !isDrillItem) {
            if ((this.treemap.selectionId !== targetId &&
                 (treemap.selectionId ? parseFloat(treemap.selectionId.split('_Item_Index_')[1]) !== parseFloat(targetId.split('_Item_Index_')[1]) : true)) ||
                (this.legendSelectionCollection[0] ? this.legendSelectionCollection[0]['ShapeCollection']['Elements'].length > 1 : false)) {
                treemap.levelSelection = [];
                treemap.legendId = [];
                this.shapeSelectId = '';
                removeLegend(this.legendSelectionCollection, treemap);
                this.legendSelectionCollection = [];
                treeMapElement = document.getElementById(layoutID);
                let index: number;
                if (this.treemap.legendSettings.visible) {
                    this.shapeSelect = false;
                    const length: number = this.treemap.treeMapLegendModule.legendCollections.length;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const collection: any[] = this.treemap.treeMapLegendModule.legendCollections;
                    this.shapeElement = undefined;
                    removeLegend(this.shapeSelectionCollection, treemap);
                    if (highlightModule) {
                        highlightModule.shapeTarget = 'selection';
                        highlightModule.shapeHighlightCollection = [];
                    }
                    index = (!treemap.legendSettings.removeDuplicateLegend && treemap.palette && treemap.palette.length > 0 &&
                             treemap.leafItemSettings.colorMapping.length === 0
                             && treemap.levels.length === 0) ?
                        parseFloat(targetId.split('_Item_Index_')[1]) : getLegendIndex(length, item, treemap);
                    this.shapeElement = this.treemap.legendSettings.mode === 'Default' ? document.getElementById(this.treemap.element.id + '_Legend_Shape_Index_' + index) : document.getElementById(this.treemap.element.id + '_Legend_Index_' + index);
                    if (this.shapeElement !== null) {
                        this.shapeSelectId = this.shapeElement.getAttribute('id');
                        this.shapeSelectionCollection.push({ legendEle: this.shapeElement, oldFill: collection[index as number]['legendFill'],
                            oldOpacity: collection[index as number]['opacity'], oldBorderColor: collection[index as number]['borderColor'],
                            oldBorderWidth: collection[index as number]['borderWidth']
                        });
                        const legendText: Element = this.treemap.legendSettings.mode === 'Default' ? document.getElementById(this.treemap.element.id + '_Legend_Text_Index_' + index)
                            : document.getElementById(this.treemap.element.id + '_Legend_Index_' + index + '_Text');
                        setColor(
                            legendText, selection.fill, selection.opacity, null,
                            null);
                        setColor(
                            this.shapeElement, selection.fill, selection.opacity, selection.border.color,
                            selection.border.width.toString());
                        treemap.legendId.push(this.shapeElement.id);
                        treemap.legendId.push(legendText.id);
                    }
                }
                orders = findHightLightItems(item, [], selection.mode, treemap);
                for (let i: number = 0; i < treeMapElement.childElementCount; i++) {
                    element = treeMapElement.childNodes[i as number] as Element;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const targetItem: any = treemap.layout.renderItems[parseFloat(targetId.split('_Item_Index_')[1])];
                    item = treemap.layout.renderItems[parseFloat(element.id.split('_Item_Index_')[1])];
                    const valuePath: string = (treemap.rangeColorValuePath !== '') ? treemap.rangeColorValuePath : null;
                    if (orders.indexOf(item['levelOrderName']) > -1 &&
                        (!isNullOrUndefined(valuePath) ?
                            (item['data'][valuePath as string] === targetItem['data'][valuePath as string] ||
                                (selection.mode !== 'Item' && treemap.levels.length > 0)
                            ) : true)) {
                        selectionElements.push(element);
                        if (targetId.indexOf('_RectPath') > -1) {
                            treemap.levelSelection.push(element.id);
                        }
                        items.push(item);
                    }
                }
                removeClassNames(document.getElementsByClassName('treeMapSelection'), 'treeMapSelection', treemap);
                this.treemap.selectionId = targetId;
                const highLightElements: HTMLCollection = document.getElementsByClassName('treeMapHighLight');
                for (let k: number = 0; k < selectionElements.length; k++) {
                    element = selectionElements[k as number];
                    if (highLightElements.length > 0) {
                        for (let j: number = 0; j < highLightElements.length; j++) {
                            if (highLightElements[j as number].id === element.id) {
                                highLightElements[j as number].classList.remove('treeMapHighLight');
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
                removeLegend(this.legendSelectionCollection, treemap);
                removeLegend(this.shapeSelectionCollection, treemap);
                this.treemap.legendId = [];
                this.shapeSelectionCollection = [];
                this.legendSelectionCollection = [];
                this.shapeElement = undefined;
                this.shapeSelect = true;
                this.shapeSelectId = '';
                this.treemap.levelSelection = [];
                this.legendSelectId = '';
                if (this.legendSelect || this.shapeSelect) {
                    removeClassNames(document.getElementsByClassName('treeMapSelection'), 'treeMapSelection', treemap);
                    this.treemap.selectionId = '';
                }
            }
        } else if (targetId.indexOf('_Legend_Shape') > -1 || targetId.indexOf('_Legend_Index') > -1 || targetId.indexOf('_Legend_Text_') > -1) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const collection: any[] = this.treemap.treeMapLegendModule.legendCollections;
            const legendSelectIdIndex: number = !isNullOrUndefined(this.legendSelectId) ? parseFloat(this.legendSelectId.split('_Index_')[1]) : null;
            if (this.treemap.legendSettings.visible && (legendSelectIdIndex !== parseFloat(targetId.split('_Index_')[1]))) {
                let itemIndex: number;
                let groupIndex: number;
                let length: number;
                treemap.legendId = [];
                treemap.levelSelection = [];
                this.legendSelectId = targetId;
                this.legendSelect = false;
                const legendIndex: number = !isNaN(parseInt(targetId[targetId.length - 1], 10)) ?
                    parseInt(targetId[targetId.length - 1], 10) :
                    parseInt(targetId[targetId.length - 6], 10);
                const targetEle: Element = document.getElementById(targetId);
                removeLegend(this.legendSelectionCollection, treemap);
                removeClassNames(document.getElementsByClassName('treeMapSelection'), 'treeMapSelection', treemap);
                removeLegend(this.shapeSelectionCollection, treemap);
                this.legendSelectionCollection = [];
                if (highlightModule) {
                    highlightModule.shapeTarget = 'selection';
                    highlightModule.legendHighlightCollection = [];
                }
                const valuePath: string = (treemap.rangeColorValuePath !== '') ? treemap.rangeColorValuePath : null;
                const index: number = this.treemap.legendSettings.mode === 'Default'  ?  (targetId.indexOf('Text') === -1 ? parseFloat(targetId.split('_Legend_Shape_Index_')[1]) : parseFloat(targetId.split('_Legend_Text_Index_')[1]))
                    : parseFloat(targetId.split('_Legend_Index_')[1]);
                const dataLength: number = this.treemap.treeMapLegendModule.legendCollections[index as number]['legendData'].length;
                for (let k: number = 0; k < dataLength; k++) {
                    for (let l: number = 0; l < this.treemap.layout.renderItems.length; l++) {
                        if ((!isNullOrUndefined(valuePath) && treemap.leafItemSettings.colorMapping.length > 0 &&
                             treemap.levels.length === 0) ?
                            (treemap.treeMapLegendModule.legendCollections[index as number]['legendData'][k as number]['data'][valuePath as string] === treemap.layout.renderItems[l as number]['data'][valuePath as string])
                            : (this.treemap.treeMapLegendModule.legendCollections[index as number]['legendData'][k as number]['levelOrderName'] === this.treemap.layout.renderItems[l as number]['levelOrderName'])) {
                            itemIndex = l;
                            groupIndex = this.treemap.layout.renderItems[l as number]['groupIndex'];
                            const nodeEle: Element = document.getElementById(this.treemap.element.id + '_Level_Index_' + groupIndex + '_Item_Index_' + itemIndex + '_RectPath');
                            this.treemap.selectionId = nodeEle.id;
                            if (k === 0 || this.legendSelectionCollection.length === 0) {
                                pushCollection(
                                    this.legendSelectionCollection, legendIndex, l, targetEle, nodeEle,
                                    this.treemap.layout.renderItems, collection);
                                length = this.legendSelectionCollection.length;
                                this.legendSelectionCollection[length - 1]['ShapeCollection'] = { Elements: [] };
                            }
                            this.treemap.selectionId = nodeEle.id;
                            let legendShape: Element; let legendText: Element;
                            if (targetEle.id.indexOf('Text') > -1) {
                                legendShape = this.treemap.legendSettings.mode === 'Interactive' ? document.getElementById(targetEle.id.replace('_Text', ''))
                                    : document.getElementById(this.treemap.element.id + '_Legend_Shape_Index_' + index);
                                setColor(legendShape, selection.fill, selection.opacity, selection.border.color,
                                         selection.border.width.toString());
                                setColor(targetEle, selection.fill, selection.opacity, null, null);
                                this.legendSelectId = legendShape.id;
                                this.shapeElement = legendShape;
                                treemap.legendId.push(targetEle.id);
                                treemap.legendId.push(legendShape.id);
                            } else {
                                legendText = this.treemap.legendSettings.mode === 'Interactive' ? document.getElementById(targetEle.id + '_Text')
                                    : document.getElementById(this.treemap.element.id + '_Legend_Text_Index_' + index);
                                setColor(legendText, selection.fill, selection.opacity, null, null);
                                setColor(targetEle, selection.fill, selection.opacity, selection.border.color,
                                         selection.border.width.toString());
                                this.shapeElement = targetEle;
                                treemap.legendId.push(targetEle.id);
                                treemap.legendId.push(legendText.id);
                            }
                            setColor(
                                nodeEle, selection.fill, selection.opacity, selection.border.color,
                                selection.border.width.toString());
                            length = this.legendSelectionCollection.length;
                            treemap.levelSelection.push(nodeEle.id);
                            this.legendSelectionCollection[length - 1]['ShapeCollection']['Elements'].push(nodeEle);
                        }
                    }
                }
                if (dataLength === 0 && this.treemap.palette && this.treemap.palette.length > 0) {
                    for (let j: number = 0; j < this.treemap.layout.renderItems.length; j++) {
                        if ( (this.treemap.treeMapLegendModule.legendCollections[index as number]['levelOrderName'] === this.treemap.layout.renderItems[j as number]['levelOrderName'] ||
                            this.treemap.layout.renderItems[j as number]['levelOrderName'].indexOf(this.treemap.treeMapLegendModule.legendCollections[index as number]['levelOrderName']) > -1) &&
                                ((!this.treemap.legendSettings.removeDuplicateLegend && treemap.palette && treemap.palette.length > 0 &&
                                  !this.treemap.layout.renderItems[j as number].parent.isDrilled) ?
                                    index === j : true)) {
                            itemIndex = j;
                            groupIndex = this.treemap.layout.renderItems[j as number]['groupIndex'];
                            const nodeEle: Element = document.getElementById(this.treemap.element.id + '_Level_Index_' + groupIndex + '_Item_Index_' + itemIndex + '_RectPath');
                            pushCollection(
                                this.legendSelectionCollection, index, j, targetEle, nodeEle,
                                this.treemap.layout.renderItems, collection);
                            this.treemap.selectionId = nodeEle.id;
                            length = this.legendSelectionCollection.length;
                            this.legendSelectionCollection[length - 1]['ShapeCollection'] = { Elements: [] };
                            let legendItem: Element;
                            if (targetEle.id.indexOf('Text') > -1) {
                                legendItem = this.treemap.legendSettings.mode === 'Interactive' ? document.getElementById(targetEle.id.replace('_Text', ''))
                                    : document.getElementById(this.treemap.element.id + '_Legend_Shape_Index_' + index);
                                setColor(targetEle, selection.fill, selection.opacity, null, null);
                                setColor(legendItem, selection.fill, selection.opacity, selection.border.color,
                                         selection.border.width.toString());
                                this.legendSelectId = legendItem.id;
                                this.shapeElement = legendItem;
                            } else {
                                legendItem = this.treemap.legendSettings.mode === 'Interactive' ? document.getElementById(targetEle.id + '_Text')
                                    : document.getElementById(this.treemap.element.id + '_Legend_Text_Index_' + index);
                                setColor(legendItem, selection.fill, selection.opacity, null, null);
                                setColor(targetEle, selection.fill, selection.opacity, selection.border.color,
                                         selection.border.width.toString());
                                this.legendSelectId = targetId;
                                this.shapeElement = targetEle;
                            }
                            setColor(
                                nodeEle, selection.fill, selection.opacity, selection.border.color,
                                selection.border.width.toString());
                            treemap.levelSelection.push(nodeEle.id);
                            if (treemap.legendId.indexOf(legendItem.id) === -1) {
                                treemap.legendId.push(legendItem.id);
                            }
                            if (treemap.legendId.indexOf(targetEle.id) === -1) {
                                treemap.legendId.push(targetEle.id);
                            }
                            length = this.legendSelectionCollection.length;
                            this.legendSelectionCollection[length - 1]['ShapeCollection']['Elements'].push(nodeEle);
                        }
                    }
                }
            } else {
                removeLegend(this.legendSelectionCollection, this.treemap);
                removeLegend(this.shapeSelectionCollection, this.treemap);
                this.legendSelectionCollection = [];
                if (highlightModule) { highlightModule.shapeTarget = 'highlight'; }
                this.legendSelect = true;
                this.legendSelectId = '';
                this.treemap.legendId = [];
                this.treemap.levelSelection = [];
                this.shapeElement = null;
                this.shapeSelectId = '';
                if (this.legendSelect || this.shapeSelect) {
                    removeClassNames(document.getElementsByClassName('treeMapSelection'), 'treeMapSelection', treemap);
                    this.treemap.selectionId = '';
                }
            }
        } else if (isDrillItem) {
            removeLegend(this.legendSelectionCollection, this.treemap);
            this.legendSelectionCollection = [];
            this.legendSelect = true;
            this.legendSelectId = '';
            this.treemap.legendId = [];
            this.treemap.levelSelection = [];
            this.treemap.selectionId = '';
            this.shapeElement = null;
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
                if (levelOrder === this.treemap.layout.renderItems[s as number]['levelOrderName']) {
                    item = this.treemap.layout.renderItems[s as number];
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
                element = treeMapElement.childNodes[i as number] as Element;
                item = this.treemap.layout.renderItems[parseFloat(element.id.split('_Item_Index_')[1])];
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
                    removeShape(this.shapeSelectionCollection);
                    index = getLegendIndex(length, items[m as number], this.treemap);
                    this.shapeElement = this.treemap.legendSettings.mode === 'Default' ? document.getElementById(this.treemap.element.id + '_Legend_Shape_Index_' + index) : document.getElementById(this.treemap.element.id + '_Legend_Index_' + index);
                    if (this.shapeElement !== null) {
                        this.shapeSelectId = this.shapeElement.getAttribute('id');
                        this.treemap.legendId.push(this.shapeSelectId);
                        this.shapeSelectionCollection.push({
                            legendEle: this.shapeElement, oldFill: collection[index as number]['legendFill'],
                            oldOpacity: collection[index as number]['opacity'], oldBorderColor: collection[index as number]['borderColor'],
                            oldBorderWidth: collection[index as number]['borderWidth']
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
                element = selectionElements[k as number];
                if (highLightElements.length > 0) {
                    for (let j: number = 0; j < highLightElements.length; j++) {
                        if (highLightElements[j as number].id === element.id) {
                            highLightElements[j as number].classList.remove('treeMapHighLight');
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
            removeShape(this.shapeSelectionCollection);
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
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.shapeElement = null;
        this.shapeSelectionCollection = [];
        this.legendSelectionCollection = [];
        this.removeEventListener();
        this.treemap = null;
    }
}
