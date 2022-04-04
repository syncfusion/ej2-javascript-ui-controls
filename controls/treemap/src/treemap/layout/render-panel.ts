/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable brace-style */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import { TreeMap } from '../treemap';
import {
    Rect, itemsToOrder, TextOption, Size, measureText, textTrim, hide, wordWrap, textWrap,
    getTemplateFunction, convertElement, findLabelLocation, PathOption, textFormatter, ColorValue, colorNameToHex, convertHexToColor,
    colorMap, measureElement, convertToContainer, convertToRect, getShortestEdge, getArea, orderByArea, isParentItem, maintainSelection
} from '../utils/helper';
import { isNullOrUndefined, createElement, extend } from '@syncfusion/ej2-base';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { Location, findChildren, renderTextElement } from '../utils/helper';
import { LevelSettings, Font, LeafItemSettings } from '../model/base';
import { LabelPosition, LabelAlignment } from '../utils/enum';
import { BorderModel, FontModel, ColorMappingModel, LevelSettingsModel, LeafItemSettingsModel } from '../model/base-model';
import { IItemRenderingEventArgs } from '../model/interface';
import { itemRendering } from '../model/constants';
import { LevelsData } from './../treemap';

/**
 * To calculate and render the shape layer
 */

export class LayoutPanel {
    private treemap: TreeMap;
    private currentRect: Rect;
    public layoutGroup: Element;
    private renderer: SvgRenderer;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public renderItems: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private parentData: any[];
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor(treemap: TreeMap) {
        this.treemap = treemap;
    }

    public processLayoutPanel(): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let data: any[] | any; let totalRect: Rect;
        if (LevelsData.levelsData && LevelsData.levelsData.length > 0) {
            data = (!isNullOrUndefined(this.treemap.initialDrillDown.groupIndex) &&
                !isNullOrUndefined(this.treemap.initialDrillDown.groupName)) &&
                (isNullOrUndefined(this.treemap.drilledItems) ? isNullOrUndefined(this.treemap.drilledItems)
                    : this.treemap.drilledItems.length === 0) ?
                this.getDrilldownData(LevelsData.levelsData[0], [])[0] : LevelsData.levelsData[0];
            totalRect = extend({}, this.treemap.areaRect, totalRect, false) as Rect;
            if (!isNullOrUndefined(this.treemap.treeMapLegendModule) && !isNullOrUndefined(this.treemap.totalRect)) {
                if (this.treemap.legendSettings.position !== 'Float') {
                    totalRect = this.treemap.totalRect;
                }
            }
            if (!isNullOrUndefined(this.treemap.currentLevel) &&
                (isNullOrUndefined(this.treemap.drilledItems) ? !isNullOrUndefined(this.treemap.drilledItems)
                    : this.treemap.drilledItems.length !== 0)) {
                const count: number = this.treemap.drilledItems.length - 1;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const x: any = this.treemap.drilledItems[count]['data'];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const y: any = {};
                y[this.treemap.drilledItems[count]['data']['groupName']] = [x];
                if (!isNullOrUndefined(this.treemap.initialDrillDown.groupIndex) && !this.treemap.enableBreadcrumb) {
                    this.treemap.currentLevel = this.treemap.drilledItems[count]['data']['groupIndex'];
                }
                this.calculateLayoutItems(y || LevelsData.levelsData[0], totalRect);
                this.renderLayoutItems(y || LevelsData.levelsData[0]);
            } else {
                if (!isNullOrUndefined(this.treemap.initialDrillDown.groupIndex) &&
                    (isNullOrUndefined(this.treemap.drilledItems) ? isNullOrUndefined(this.treemap.drilledItems)
                        : this.treemap.drilledItems.length === 0)) {
                    this.treemap.currentLevel = this.treemap.initialDrillDown.groupIndex;
                }
                this.calculateLayoutItems(data || LevelsData.levelsData[0], totalRect);
                this.renderLayoutItems(data || LevelsData.levelsData[0]);
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getDrilldownData(data: any, drillData: any[]): any {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const treemap: TreeMap = this.treemap; const newData: any = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const child: any[] = findChildren(data)['values'];
        if (child && child.length > 0 && drillData.length === 0) {
            for (let i: number = 0; i < child.length; i++) {
                if (child[i]['groupIndex'] === treemap.initialDrillDown.groupIndex &&
                    child[i]['name'] === treemap.initialDrillDown.groupName) {
                    child[i]['isDrilled'] = true;
                    newData[child[i]['groupName']] = [child[i]];
                    drillData.push(newData);
                }
            }
            for (let j: number = 0; j < child.length; j++) {
                this.getDrilldownData(child[j], drillData);
            }
        }
        return drillData;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public calculateLayoutItems(data: any, rect: Rect): void {
        this.renderItems = [];
        this.parentData = [];
        if (!isNullOrUndefined(this.treemap.weightValuePath)) {
            if (this.treemap.layoutType.indexOf('SliceAndDice') > -1) {
                this.computeSliceAndDiceDimensional(data, rect);
            } else {
                rect.height = rect.height + rect.y;
                rect.width = rect.width + rect.x;
                this.computeSquarifyDimensional(data, rect);
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private computeSliceAndDiceDimensional(data: any, coords: Rect): any {
        const leafItem: LeafItemSettings = this.treemap.leafItemSettings as LeafItemSettings;
        let rect: Rect; const groups: LevelSettings[] = this.treemap.levels as LevelSettings[];
        let groupIndex: number; let isLeafItem: boolean = false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const children: any[] = findChildren(data)['values'];
        let gap: number; let headerHeight: number;
        if (children && children.length > 0) {
            this.sliceAndDiceProcess(children, coords);
            if (this.treemap.levels.length > 0) {
                for (let i: number = 0; i < children.length; i++) {
                    groupIndex = children[i]['groupIndex'];
                    isLeafItem = (groups.length === 0 || groupIndex === groups.length);
                    gap = isLeafItem ? leafItem.gap : groups[groupIndex].groupGap;
                    headerHeight = groups.length === 0 ? 0 : groups[groupIndex] ? groups[groupIndex].showHeader ?
                        groups[groupIndex].headerHeight : 0 : groups[groupIndex - 1].showHeader ? groups[groupIndex - 1].headerHeight : 0;
                    rect = children[i]['rect'];
                    rect = new Rect(
                        rect.x + (gap / 2), rect.y + (headerHeight + (gap / 2)), rect.width - gap,
                        Math.abs(rect.height - (gap + headerHeight)));
                    this.computeSliceAndDiceDimensional(children[i], rect);
                }
            }
        }
        return data;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private sliceAndDiceProcess(processData: any[], rect: Rect): void {
        const parentArea: number = rect.height * rect.width;
        const levels: LevelSettingsModel[] = this.treemap.levels;
        let childValue: number; let alottedValue: number = 0; let totalWeight: number = 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        processData.forEach((data: any) => { totalWeight += data['weight']; });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        processData.forEach((child: any) => {
            child['weightArea'] = parentArea * (child['weight'] as number) / totalWeight;
        });
        const isHorizontal: boolean = (this.treemap.layoutType === 'SliceAndDiceAuto') ? (rect.width > rect.height) :
            (this.treemap.layoutType === 'SliceAndDiceHorizontal');
        processData.sort(itemsToOrder);
        for (let i: number = 0; i < processData.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const item: any = processData[i];
            item['isLeafItem'] = (levels.length === 0) || ((this.treemap.isHierarchicalData ||
                isNullOrUndefined(this.treemap.leafItemSettings.labelPath)) ?
                item['groupIndex'] === levels.length - 1 : item['groupIndex'] === this.treemap.levels.length);
            if (isHorizontal) {
                childValue = ((parentArea / totalWeight) * processData[i]['weight']) / rect.height;
                if (alottedValue <= rect.width) {
                    processData[i]['rect'] = new Rect(alottedValue + rect.x, rect.y, childValue, rect.height);
                }
            } else {
                childValue = ((parentArea / totalWeight) * processData[i]['weight']) / rect.width;
                if (alottedValue <= rect.height) {
                    processData[i]['rect'] = new Rect(rect.x, alottedValue + rect.y, rect.width, childValue);
                }
            }
            alottedValue += childValue;
            this.renderItems.push(processData[i]);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private computeSquarifyDimensional(data: any, coords: Rect): void {
        const leaf: LeafItemSettings = this.treemap.leafItemSettings as LeafItemSettings;
        let rect: Rect; const levels: LevelSettings[] = this.treemap.levels as LevelSettings[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const groupIndex: number = 0; const isLeafItem: boolean = false; let item: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const child: any[] = findChildren(data)['values']; let index: number;
        let padding: number; let headerHeight: number;
        if (child && child.length > 0) {
            if (this.parentData.length === 0) {
                this.parentData = [];
                this.parentData.push(child);
            }
            this.calculateChildrenLayout(data, child, coords);
            if (this.treemap.levels.length > 0) {
                for (let i: number = 0; i < child.length; i++) {
                    item = child[i];
                    index = item['groupIndex'];
                    rect = item['rect'];
                    padding = (item['isLeafItem'] ? leaf.padding : levels[index].groupPadding) / 2;
                    headerHeight = this.treemap.isHierarchicalData ? index === 0 && item['isLeafItem'] ? 0 : levels[index] ?
                        levels[index].showHeader ? levels[index].headerHeight : 0 : 0 : (levels.length === 0) ? 0 : levels[index] ?
                        levels[index].showHeader ? levels[index].headerHeight : 0 : 0;
                    rect = new Rect(
                        rect.x + padding, rect.y + (headerHeight + padding),
                        rect.width - padding, rect.height - padding
                    );
                    if (!item['isLeafItem'] && item['weight'] > 0) {
                        this.computeSquarifyDimensional(child[i], rect);
                    }
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private calculateChildrenLayout(parent: any, children: any[], coords: Rect): void {
        this.computeTotalArea(children, getArea(coords));
        children.sort(orderByArea);
        this.performRowsLayout(children, [], coords, []);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private performRowsLayout(data: any[], currentRow: any[], rect: Rect, stack: any[]): any[] {
        const dataLength: number = data.length;
        if (dataLength === 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newCoordinates: any[] = this.getCoordinates(currentRow, rect);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newStack: any[] = stack.concat(newCoordinates);
            return newStack;
        }
        const width: number = getShortestEdge(rect);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nextDatum: any = data[0];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const restData: any[] = data.slice(1, dataLength);
        if (this.aspectRatio(currentRow, nextDatum, width)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newRow: any[] = currentRow.concat(nextDatum);
            return this.performRowsLayout(restData, newRow, rect, stack);
        } else {
            const currentRowLength: number = currentRow.length;
            let valueSum: number = 0;
            for (let i: number = 0; i < currentRowLength; i += 1) {
                valueSum += currentRow[i]['itemArea'];
            }
            const newContainer: Rect = this.cutArea(rect, valueSum);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newCoordinates: any[] = this.getCoordinates(currentRow, rect);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newStack: any[] = stack.concat(newCoordinates);
            return this.performRowsLayout(data, [], newContainer, newStack);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private aspectRatio(currentRow: any[], nextDatum: any, length: number): boolean {
        if (currentRow.length === 0) {
            return true;
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newRow: any[] = currentRow.concat(nextDatum);
            const currentMaxAspectRatio: number = this.findMaxAspectRatio(currentRow, length);
            const newMaxAspectRatio: number = this.findMaxAspectRatio(newRow, length);
            return (currentMaxAspectRatio >= newMaxAspectRatio);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private findMaxAspectRatio(row: any[], length: number): number {
        const rowLength: number = row.length;
        let minArea: number = Infinity;
        let maxArea: number = -Infinity;
        let sumArea: number = 0;
        for (let i: number = 0; i < rowLength; i += 1) {
            const area: number = row[i]['itemArea'];
            if (area < minArea) {
                minArea = area;
            }
            if (area > maxArea) {
                maxArea = area;
            }
            sumArea += area;
        }
        const result: number = Math.max((Math.pow(length, 2)) * maxArea / (Math.pow(sumArea, 2)), (Math.pow(sumArea, 2)) /
            ((Math.pow(length, 2)) * minArea));
        return result;
    }


    private cutArea(rect: Rect, area: number): Rect {
        const newContainer: Rect = convertToContainer(rect);
        const width: number = newContainer.width;
        const height: number = newContainer.height;
        const xOffset: number = newContainer.x;
        const yOffset: number = newContainer.y;
        if (width >= height) {
            const areaWidth: number = area / height;
            const newWidth: number = width - areaWidth;
            const container: Rect = {
                x: xOffset + areaWidth,
                y: yOffset,
                width: newWidth,
                height: height
            };
            return convertToRect(container);
        } else {
            const areaHeight: number = area / width;
            const newHeight: number = height - areaHeight;
            const container: Rect = {
                x: xOffset,
                y: yOffset + areaHeight,
                width: width,
                height: newHeight
            };
            return convertToRect(container);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getCoordinates(row: any[], rect: Rect): any[] {
        const container: Rect = convertToContainer(rect); let headerHeight: number;
        const width: number = container.width; const height: number = container.height;
        const xOffset: number = container.x; const yOffset: number = container.y;
        const rowLength: number = row.length; const levels: LevelSettingsModel[] = this.treemap.levels;
        const leaf: LeafItemSettingsModel = this.treemap.leafItemSettings; let index: number;
        let valueSum: number = 0;
        for (let i: number = 0; i < rowLength; i += 1) {
            valueSum += row[i]['itemArea'];
        }
        const areaWidth: number = valueSum / height; const areaHeight: number = valueSum / width;
        let subXOffset: number = xOffset; let subYOffset: number = yOffset; let padding: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const coordinates: any[] = []; let isParent: boolean; let gap: number; let parentRect: Rect;
        for (let i: number = 0; i < rowLength; i += 1) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const item: any = row[i];
            index = item['groupIndex'];
            item['isLeafItem'] = (levels.length === 0) || (this.treemap.isHierarchicalData ? index === levels.length :
                isNullOrUndefined(leaf.labelPath) ? false : index === levels.length);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            isParent = isParentItem(this.parentData[0] as any[], item);
            parentRect = isParent ? this.treemap.areaRect : item['parent'].rect;
            padding = item['isLeafItem'] ? leaf.padding : levels[index].groupPadding;
            if (width >= height) {
                const y1: number = subYOffset + item['itemArea'] / areaWidth;
                item['rect'] = {
                    x: subXOffset,
                    y: subYOffset,
                    width: subXOffset + areaWidth,
                    height: y1
                };
                subYOffset = y1;
            } else {
                const x1: number = subXOffset + item['itemArea'] / areaHeight;
                item['rect'] = {
                    x: subXOffset,
                    y: subYOffset,
                    width: x1,
                    height: subYOffset + areaHeight
                };
                subXOffset = x1;
            }
            if (item['weight'] > 0 && (isParent || (Math.round(rect.y + (padding / 2)) <=
                Math.round(parentRect.y + (parentRect.height - parentRect.y)) && Math.round(rect.x + (padding / 2)) <=
                Math.round(parentRect.x + (parentRect.width - parentRect.x))))) {
                this.renderItems.push(item);
                coordinates.push(item);
            }
        }
        return coordinates;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private computeTotalArea(data: any[], area: number): any[] {
        const dataLength: number = data.length;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dataSum: number = 0; const result: any[] = [];
        for (let i: number = 0; i < dataLength; i += 1) {
            const dataLength: number = data.length;
            let dataSum: number = 0;
            for (let i: number = 0; i < dataLength; i += 1) {
                dataSum += data[i]['weight'];
            }
            const multiplier: number = area / dataSum;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let datum: any;
            for (let j: number = 0; j < dataLength; j++) {
                datum = data[j];
                datum['itemArea'] = datum['weight'] * multiplier;
                result.push(datum);
            }
        }
        return result;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public onDemandProcess(childItems: any): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let parentItem: any = {}; let totalRect: Rect;
        parentItem = childItems[0]['parent'];
        this.treemap.currentLevel = parentItem['isDrilled'] ? parentItem['groupIndex'] : null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let parentItemGroupname: any = {};
        if (isNullOrUndefined(parentItem['groupName'])) {
            parentItemGroupname = parentItem;
        } else {
            parentItemGroupname[parentItem['groupName']] = [parentItem];
        }
        totalRect = extend({}, this.treemap.areaRect, totalRect, false) as Rect;
        if (!isNullOrUndefined(this.treemap.treeMapLegendModule) && !isNullOrUndefined(this.treemap.totalRect)) {
            totalRect = this.treemap.totalRect;
        }
        const count: number = this.treemap.levels.length;
        for (let i: number = 0; i < count; i++) {
            const levelCount: number = childItems[0]['groupIndex'];
            if (count === levelCount) {
                this.treemap.levels[count] = this.treemap.levels[i];
            } else {
                this.treemap.levels.splice(count - 1, 1);
            }
        }
        this.calculateLayoutItems(parentItemGroupname, totalRect);
        this.renderLayoutItems(parentItemGroupname);
    }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public renderLayoutItems(renderData: any): void {
        const textCollection: string[] = []; let position: string;
        const treeMap: TreeMap = this.treemap; let colorMapping: ColorMappingModel[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let txtVisible: boolean; let getItemColor: any; let eventArgs: IItemRenderingEventArgs;
        this.renderer = treeMap.renderer; let trimHeader: string | string[];
        const textLocation: Location = new Location(0, 0); let pathOptions: PathOption;
        const elementID: string = treeMap.element.id; let index: number; let templatePosition: LabelPosition;
        const mode: string = treeMap.layoutType; let rect: Rect; let format: string;
        const interSectAction: LabelAlignment = this.treemap.leafItemSettings.interSectAction;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let textSize: Size; let fill: string; let item: any; let renderText: string;
        let opacity: number; const padding: number = 5; let rectPath: string = ''; let isRender: boolean;
        const secondaryEle: HTMLElement = document.getElementById(treeMap.element.id + '_Secondary_Element');
        let groupId: string; let textOptions: TextOption; let templateEle: HTMLElement; let gap: number;
        let textStyle: Font; const levels: LevelSettings[] = treeMap.levels as LevelSettings[];
        this.layoutGroup = this.renderer.createGroup({ id: elementID + '_TreeMap_' + mode + '_Layout' });
        let itemGroup: Element; let level: LevelSettings; let template: string; let border: BorderModel;
        const templateGroup: HTMLElement = createElement('div', {
            id: treeMap.element.id + '_Label_Template_Group',
            className: 'template',
            styles: 'overflow: hidden; position: absolute;pointer-events: none;' +
                'top:' + treeMap.areaRect.y + 'px;' +
                'left:' + treeMap.areaRect.x + 'px;' +
                'height:' + treeMap.areaRect.height + 'px;' +
                'width:' + treeMap.areaRect.width + 'px;'
        });
        let isLeafItem: boolean = false; const leaf: LeafItemSettings = treeMap.leafItemSettings as LeafItemSettings;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let childItems: any[]; let connectorText: string;
        for (let i: number = 0; i < this.renderItems.length; i++) {
            item = this.renderItems[i];
            index = item['groupIndex'];
            if (this.treemap.drillDownView && isNullOrUndefined(this.treemap.currentLevel)
                && index > 0 || this.treemap.drillDownView
                && index > (this.treemap.currentLevel + 1)) {
                continue;
            }
            rect = item['rect'];
            isLeafItem = item['isLeafItem'];
            groupId = elementID + '_Level_Index_' + index + '_Item_Index_' + i;
            itemGroup = this.renderer.createGroup({ id: groupId + '_Group' });
            gap = (isLeafItem ? leaf.gap : levels[index].groupGap) / 2;
            const treemapItemRect: Rect = this.treemap.totalRect ? convertToContainer(this.treemap.totalRect) : this.treemap.areaRect;
            if (treeMap.layoutType === 'Squarified') {
                rect.width = Math.abs(rect.x - rect.width) - gap;
                rect.height = Math.abs(rect.y - rect.height) - gap;
            }
            if (treeMap.renderDirection === 'TopRightBottomLeft') {
                rect.x = (treemapItemRect.x + treemapItemRect.width) - rect.width - Math.abs(treemapItemRect.x - rect.x);
            } else if (treeMap.renderDirection === 'BottomLeftTopRight') {
                rect.y = (treemapItemRect.y + treemapItemRect.height) - rect.height - Math.abs(treemapItemRect.y - rect.y);
            } else if (treeMap.renderDirection === 'BottomRightTopLeft') {
                rect.x = (treemapItemRect.x + treemapItemRect.width) - rect.width - Math.abs(treemapItemRect.x - rect.x);
                rect.y = (treemapItemRect.y + treemapItemRect.height) - rect.height - Math.abs(treemapItemRect.y - rect.y);
            }
            colorMapping = isLeafItem ? leaf.colorMapping : levels[index].colorMapping;
            getItemColor = this.getItemColor(isLeafItem, item);
            fill = getItemColor['fill'];
            opacity = getItemColor['opacity'];
            format = isLeafItem ? leaf.labelFormat : (levels[index]).headerFormat;
            let levelName: string;
            txtVisible = isLeafItem ? leaf.showLabels : (levels[index]).showHeader;
            if (index === this.treemap.currentLevel) {
                if (this.treemap.enableBreadcrumb) {
                    const re: RegExp = /#/gi;
                    connectorText = '#' + this.treemap.breadcrumbConnector + '#';
                    levelName = item['levelOrderName'].replace(re, connectorText);
                    levelName = index !== 0 ? '#' + levelName : levelName;
                } else {
                    levelName = item['name'];
                }
            } else {
                if (this.treemap.enableBreadcrumb) {
                    item['isDrilled'] = false;
                }
                levelName = item['name'];
            }
            renderText = textFormatter(format, item['data'], this.treemap) || levelName || 'undefined';
            childItems = findChildren(item)['values'];
            renderText = !isLeafItem && childItems && childItems.length > 0 && this.treemap.enableDrillDown ?
                !item['isDrilled'] ? treeMap.enableRtl ? renderText + ' [+]' : '[+] ' + renderText :
                    treeMap.enableRtl ? renderText + ' [-]' : '[-] ' + renderText : renderText;
            textStyle = (isLeafItem ? leaf.labelStyle : levels[index].headerStyle) as Font;
            textStyle.fontFamily = this.treemap.themeStyle.labelFontFamily || textStyle.fontFamily;
            border = isLeafItem ? leaf.border : levels[index].border;
            position = !isLeafItem ? (levels[index].headerAlignment) === 'Near' ? 'TopLeft' : (levels[index].headerAlignment) === 'Center' ?
                'TopCenter' : 'TopRight' : leaf.labelPosition;
            templatePosition = isLeafItem ? leaf.templatePosition : levels[index].templatePosition;
            template = isLeafItem ? leaf.labelTemplate : levels[index].headerTemplate;
            item['options'] = { border: border, opacity: opacity, fill: fill };
            eventArgs = {
                cancel: false, name: itemRendering, treemap: this.treemap, text : renderText,
                currentItem: item, RenderItems: this.renderItems, options: item['options']
            };
            this.treemap.trigger(itemRendering, eventArgs, (observedArgs: IItemRenderingEventArgs) => {
                if (!observedArgs.cancel) {
                    rectPath = ' M ' + rect.x + ' ' + rect.y + ' L ' + (rect.x + rect.width) + ' ' + rect.y +
                        ' L ' + (rect.x + rect.width) + ' ' + (rect.y + rect.height) + ' L ' + rect.x + ' ' + (rect.y + rect.height) + 'z';
                    pathOptions = new PathOption(groupId + '_RectPath', fill, border.width, border.color, opacity, null, rectPath);
                    const path: Element = this.renderer.drawPath(pathOptions);
                    itemGroup.appendChild(path);
                    if (txtVisible) {
                        if (eventArgs.text !== renderText) {
                            eventArgs.text = textFormatter(eventArgs.text, item['data'], this.treemap) || levelName;
                        }
                        this.renderItemText(
                            eventArgs.text.toString(), itemGroup, textStyle, rect, interSectAction, groupId, fill,
                            position as LabelPosition, connectorText
                        );
                    }
                    if (template) {
                        templateEle = this.renderTemplate(secondaryEle, groupId, rect, templatePosition, template, item, isLeafItem);
                        templateGroup.appendChild(templateEle);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (this.treemap as any).renderReactTemplates();
                    }
                    itemGroup.setAttribute('aria-label', item['name']);
                    itemGroup.setAttribute('tabindex', (this.treemap.tabIndex + i + 2).toString());
                    maintainSelection(this.treemap, itemGroup, 'treeMapSelection');
                    this.layoutGroup.appendChild(itemGroup);
                }
            });
        }
        if (templateGroup.childNodes.length > 0) {
            secondaryEle.appendChild(templateGroup);
        }
        this.treemap.svgObject.appendChild(this.layoutGroup);
    }

    private renderItemText(
        text: string, parentElement: Element, textStyle: FontModel, rect: Rect, interSectAction: LabelAlignment,
        groupId: string, fill: string, position: LabelPosition, connectorText: string
    ): void {
        let level: LevelSettings; let headerPosition: string;
        const secondaryEle: HTMLElement = document.getElementById(this.treemap.element.id + '_Secondary_Element');
        const leaf: LeafItemSettings = this.treemap.leafItemSettings as LeafItemSettings;
        const padding: number = 5; let textSize: Size;
        let textCollection: string[] = []; let customText: string | string[]; let templateEle: HTMLElement;
        const tspanText: string[] = []; let height: number = 0; let textName: string;
        textCollection = ((text.indexOf('<br>')) !== -1) ? text.split('<br>') : null;
        customText = this.labelInterSectAction(rect, text, textStyle, interSectAction);
        textSize = measureText(textCollection && textCollection[0] || customText[0], textStyle);
        if (this.treemap.enableRtl) {
            const labelSize: Size = measureText(text, textStyle);
            const drillSymbolCount: number = text.search('[+]') || text.search('[-]');
            if (rect.width < labelSize.width && drillSymbolCount > 0) {
                const label: string = text.substring(drillSymbolCount - 1, text.length);
                const drillSymbol: string = '[+]';
                const drillSymbolSize: Size = measureText(drillSymbol, textStyle);
                customText['0'] = textTrim(rect.width - drillSymbolSize.width - padding, customText[0], textStyle) + label;
            }

        }
        const textLocation: Location = findLabelLocation(rect, position, textSize, 'Text', this.treemap);
        if (!isNullOrUndefined(textCollection)) {
            const collection: string[] = [];
            let texts: string = null;
            const maxNumber: number[] = [];
            for (let i: number = 0; i < textCollection.length; i++) {
                texts = textTrim((rect.width - 5), textCollection[i], textStyle);
                textSize = measureText(texts, textStyle);
                height += textSize.height;
                maxNumber.push(textSize.width);
                collection.push(texts);
            }
            customText = collection;
            textSize.width = Math.max.apply(null, maxNumber);
            textSize.height = height;
        }
        if (interSectAction === 'WrapByWord' || interSectAction === 'Wrap' || interSectAction === 'Trim') {
            for (let j: number = 0; j < customText.length; j++) {
                textSize = measureText(customText[j], textStyle);
                height += textSize.height;
                if ((rect.height - padding) > height) {
                    tspanText.push(customText[j]);
                }
            }
            if (interSectAction === 'Wrap' && customText.length !== tspanText.length && tspanText.length) {
                const collectionLength: number = tspanText.length - 1;
                let stringText: string = tspanText[collectionLength];
                stringText = stringText.substring(0, (stringText.length - 1)) + '...';
                tspanText.splice(collectionLength);
                if (stringText !== '...') {
                    tspanText.push(stringText);
                }
            }
        } else {
            textName = customText as string;
            tspanText.push(textName);
        }
        const textOptions: TextOption = new TextOption(
            groupId + '_Text', textLocation.x, textLocation.y, 'start', tspanText, '', '', connectorText
        );
        renderTextElement(textOptions, textStyle, textStyle.color || this.getSaturatedColor(fill), parentElement);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getItemColor(isLeafItem: boolean, item: any): any {
        const treemap: TreeMap = this.treemap;
        let itemFill: string = isLeafItem ? treemap.leafItemSettings.fill : treemap.levels[item['groupIndex']].fill;
        let itemOpacity: number = isLeafItem ? treemap.leafItemSettings.opacity : treemap.levels[item['groupIndex']].opacity;
        if (!isNullOrUndefined(LevelsData.defaultLevelsData)) {
            if (LevelsData.defaultLevelsData.length > 0) {
                LevelsData.levelsData = LevelsData.defaultLevelsData;
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parentData: any[] = findChildren(LevelsData.levelsData[0])['values'];
        const colorMapping: ColorMappingModel[] = isLeafItem ? treemap.leafItemSettings.colorMapping :
            treemap.levels[item['groupIndex']].colorMapping;
        if (colorMapping.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const option: any = colorMap(
                colorMapping, item['data'][this.treemap.equalColorValuePath],
                item['data'][this.treemap.rangeColorValuePath], item['data'][this.treemap.weightValuePath]);
            itemFill = !isNullOrUndefined(option['fill']) ? option['fill'] : treemap.leafItemSettings.fill;
            itemOpacity = option['opacity'];
        } else {
            for (let i: number = 0; i < parentData.length; i++) {
                if ((parentData[i]['levelOrderName'] as string) === (item['levelOrderName'] as string).split('#')[0]) {
                    itemFill = !isNullOrUndefined(itemFill) ? itemFill : !isNullOrUndefined(treemap.colorValuePath) ?
                        parentData[i]['data'][treemap.colorValuePath] : treemap.palette.length > 0 ?
                            treemap.palette[i % treemap.palette.length] : '#808080';
                }
            }
        }
        return { fill: itemFill, opacity: itemOpacity };
    }

    /**
     * To find saturated color for datalabel
     *
     * @param {string} color - Specifies the color
     * @returns {string} - Returns the color
     */
    private getSaturatedColor(color: string): string {
        let saturatedColor: string = color;
        saturatedColor = (saturatedColor === 'transparent') ? window.getComputedStyle(document.body, null).backgroundColor : saturatedColor;
        const rgbValue: ColorValue = convertHexToColor(colorNameToHex(saturatedColor));
        const contrast: number = Math.round((rgbValue.r * 299 + rgbValue.g * 587 + rgbValue.b * 114) / 1000);
        return contrast >= 128 ? 'black' : 'white';
    }

    private renderTemplate(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        secondaryEle: HTMLElement, groupId: string, rect: Rect, position: LabelPosition, template: string, item: any, isLeafItem: boolean
    ): HTMLElement {
        const templateId: string = isLeafItem ? groupId + '_LabelTemplate' : groupId + '_HeaderTemplate';
        const baseTemplateId: string = isLeafItem ? '_LabelTemplate' : '_HeaderTemplate';
        if (isNullOrUndefined(template['prototype'])) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const keys: any[] = Object.keys(item['data']);
            for (let i: number = 0; i < keys.length; i++) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                template = template.replace(new RegExp('{{:' + <string>keys[i] + '}}', 'g'), item['data'][keys[i].toString()]);
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const templateFn: any = getTemplateFunction(template);
        const templateElement: HTMLCollection = templateFn(item['data'], this.treemap, template, this.treemap.element.id + baseTemplateId, false);
        const labelEle: HTMLElement = convertElement(templateElement, templateId, item['data']);
        const templateSize: Size = measureElement(labelEle, secondaryEle);
        const templateLocation: Location = findLabelLocation(rect, position, templateSize, 'Template', this.treemap);
        labelEle.style.left = templateLocation.x + 'px';
        labelEle.style.top = templateLocation.y + 'px';
        return labelEle;
    }
    private labelInterSectAction(rect: Rect, text: string, textStyle: FontModel, alignment: LabelAlignment): string | string[] {
        let textValue: string | string[]; const maxWidth: number = rect.width - 10;
        switch (alignment) {
        case 'Hide':
            textValue = [hide(maxWidth, rect.height, text, textStyle)];
            break;
        case 'Trim':
            textValue = [textTrim((maxWidth + 3), text, textStyle)];
            break;
        case 'WrapByWord':
            textValue = wordWrap(maxWidth, text, textStyle);
            break;
        case 'Wrap':
            textValue = textWrap(maxWidth, text, textStyle);
            break;
        }
        return textValue;
    }
}
