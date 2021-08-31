/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Maps } from '../../index';
import {
    LayerSettings, ColorMappingSettings, BorderModel, LegendPosition, FontModel, LegendSettingsModel,
    click, ILegendRenderingEventArgs, legendRendering,
    MarkerSettingsModel, MarkerSettings, LegendShape, LabelPosition, LabelIntersectAction
} from '../index';
import { LegendArrangement, LegendMode } from '../index';
import {
    Rect, measureText, CircleOption, PathOption, textTrim,
    removeClass, querySelector, getTemplateFunction, maintainStyleClass, getValueFromObject
} from '../utils/helper';
import { RectOption, Size, TextOption, Point, renderTextElement, drawSymbol, checkPropertyPath, getElement } from '../utils/helper';
import { isNullOrUndefined, Browser, EventHandler, remove, extend } from '@syncfusion/ej2-base';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { LayerSettingsModel, HighlightSettingsModel, SelectionSettingsModel } from '../model/base-model';
import { ShapeSettings } from '../model/base';
/**
 * Legend module is used to render legend for the maps
 */
export class Legend {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public legendCollection: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public legendRenderingCollections: any[];
    private translate: Point;
    public legendBorderRect: Rect = new Rect(0, 0, 0, 0);
    private maps: Maps;
    /**
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public totalPages: any[] = [];
    private page: number = 0;
    /**
     * @private
     */
    public currentPage: number = 0;
    private legendItemRect: Rect = new Rect(0, 0, 0, 0);
    private heightIncrement: number = 0;
    private widthIncrement: number = 0;
    private textMaxWidth: number = 0;
    private legendGroup: Element;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private shapeHighlightCollection: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public legendHighlightCollection: any[] = [];
    public shapePreviousColor: string[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public selectedNonLegendShapes: any[] = [];
    public shapeToggled: boolean = true;
    private legendLinearGradient: Element;
    private currentLayer: LayerSettings;
    private defsElement: Element;
    public legendElement: Element[] = null;
    public oldShapeElement: Element;
    constructor(maps: Maps) {
        this.maps = maps;
        this.addEventListener();
    }
    /**
     * To calculate legend bounds and draw the legend shape and text.
     *
     * @returns {void}
     */
    public renderLegend(): void {
        this.legendRenderingCollections = [];
        this.legendCollection = [];
        this.totalPages = [];
        this.widthIncrement = 0;
        this.heightIncrement = 0;
        this.defsElement = this.maps.renderer.createDefs();
        this.maps.svgObject.appendChild(this.defsElement);
        this.calculateLegendBounds();
        this.drawLegend();
    }

    public calculateLegendBounds(): void {
        const map: Maps = this.maps;
        const legend: LegendSettingsModel = <LegendSettingsModel>map.legendSettings;
        this.legendCollection = [];
        const spacing: number = 10;
        const leftPadding: number = 10; const topPadding: number = map.mapAreaRect.y;
        this.legendRenderingCollections = [];
        Array.prototype.forEach.call(map.layersCollection, (layer: LayerSettings, layerIndex: number) => {
            if (!isNullOrUndefined(layer.shapeData)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const layerData: any[] = layer.shapeData['features'];
                const dataPath: string = layer.shapeDataPath;
                const propertyPath: string | string[] = layer.shapePropertyPath;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let dataSource: any[] = layer.dataSource as any[];
                let colorValuePath: string;
                let colorMapping: ColorMappingSettings[];
                if (legend.type === 'Layers' && layer.visible) {
                    colorValuePath = layer.shapeSettings.colorValuePath;
                    colorMapping = <ColorMappingSettings[]>layer.shapeSettings.colorMapping;
                    this.getLegends(layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath);
                } else if (legend.type === 'Bubbles') {
                    for (const bubble of layer.bubbleSettings) {
                        if (bubble.visible) {
                            colorValuePath = bubble.colorValuePath;
                            colorMapping = <ColorMappingSettings[]>bubble.colorMapping;
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            dataSource = bubble.dataSource as any[];
                            this.getLegends(layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath);
                        }
                    }
                } else {
                    this.getMarkersLegendCollections(layerIndex, layer.markerSettings);
                }
            }
        });
        if (this.legendCollection.length > 0) {
            for (let i: number = 0; i < this.legendCollection.length; i++) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const legendItem: any = this.legendCollection[i];
                const eventArgs: ILegendRenderingEventArgs = {
                    name: legendRendering, cancel: false, fill: legendItem['fill'], shape: legend.shape,
                    shapeBorder: legend.shapeBorder,
                    text: typeof legendItem['text'] === 'number' ? legendItem['text'].toString() : legendItem['text']
                };
                map.trigger('legendRendering', eventArgs);
                legendItem['fill'] = eventArgs.fill;
                legendItem['shape'] = eventArgs.shape;
                legendItem['shapeBorder'] = eventArgs.shapeBorder;
                legendItem['text'] = eventArgs.text;
                if (eventArgs.cancel) {
                    this.legendCollection.splice(i, 1);
                    i--;
                }
            }
        }
        const defaultSize: number = 25;
        const legendTitle: string = map.legendSettings.title.text;
        const titleTextStyle: FontModel = map.legendSettings.titleStyle;
        if (this.legendCollection.length > 0) {
            const legendMode: LegendMode = legend.mode;
            let shapeX: number = 0; let shapeY: number = 0;
            let textX: number = 0; let textY: number = 0;
            const shapePadding: number = legend.shapePadding;
            const textPadding: number = 10;
            const shapeHeight: number = legend.shapeHeight; const shapeWidth: number = legend.shapeWidth;
            let shapeLocation: Point[] = []; let textLocation: Rect[] = [];
            let legendRectCollection: Rect[] = [];
            let location: Point;
            const position: LegendPosition = legend.position;
            const labelAction: LabelIntersectAction = legend.labelDisplayMode;
            const arrangement: LegendArrangement = (legend.orientation === 'None') ? ((position === 'Top' || position === 'Bottom')
                ? 'Horizontal' : 'Vertical') : legend.orientation;
            let legendWidth: number = (legend.width.length > 1) ? (legend.width.indexOf('%') > -1) ? (map.availableSize.width / 100)
                * parseInt(legend.width, 10) : parseInt(legend.width, 10) : null;
            let legendHeight: number = (legend.height.length > 1) ? (legend.height.indexOf('%') > -1) ? (map.availableSize.height / 100) *
                parseInt(legend.height, 10) : parseInt(legend.height, 10) : null;
            let legendItemStartX: number; let legendItemStartY: number;
            let startX: number = 0; let startY: number = 0;
            const legendtitleSize: Size = measureText(legendTitle, titleTextStyle);
            if (legendMode === 'Interactive') {
                const itemTextStyle: FontModel = legend.textStyle;
                const legendLength: number = this.legendCollection.length;
                const rectWidth: number = (arrangement === 'Horizontal') ? (isNullOrUndefined(legendWidth)) ? (map.mapAreaRect.width / legendLength) :
                    (legendWidth / legendLength) : (isNullOrUndefined(legendWidth)) ? defaultSize : legendWidth;
                const rectHeight: number = (arrangement === 'Horizontal') ? (isNullOrUndefined(legendHeight)) ? defaultSize : legendHeight :
                    (isNullOrUndefined(legendHeight)) ? (map.mapAreaRect.height / legendLength) : (legendHeight / legendLength);
                startX = 0; startY = legendtitleSize.height + spacing;
                const position: LabelPosition = legend.labelPosition;
                let textX: number = 0; let textY: number = 0; const textPadding: number = 10;
                let itemStartX: number = 0; let itemStartY: number = 0;
                let maxTextHeight: number = 0; let maxTextWidth: number = 0;
                for (let i: number = 0; i < this.legendCollection.length; i++) {
                    startX = (arrangement === 'Horizontal') ? (startX + rectWidth) : startX;
                    startY = (arrangement === 'Horizontal') ? startY : (startY + rectHeight);
                    let legendText: string = this.legendCollection[i]['text'];
                    let itemTextSize: Size = new Size(0, 0);
                    if (labelAction === 'None') {
                        itemTextSize = measureText(legendText, itemTextStyle);
                    } else if (labelAction === 'Trim') {
                        legendText = textTrim((arrangement === 'Horizontal' ? rectWidth : rectHeight), legendText, itemTextStyle);
                        itemTextSize = measureText(legendText, itemTextStyle);
                    } else {
                        legendText = '';
                    }
                    maxTextHeight = Math.max(maxTextHeight, itemTextSize.height);
                    maxTextWidth = Math.max(maxTextWidth, itemTextSize.width);
                    if (itemTextSize.width > 0 && itemTextSize.height > 0) {
                        if (arrangement === 'Horizontal') {
                            textX = startX + (rectWidth / 2);
                            textY = (position === 'After') ? (startY + rectHeight + (itemTextSize.height / 2)) + textPadding :
                                (startY - textPadding);
                        } else {
                            textX = (position === 'After') ? startX - (itemTextSize.width / 2) - textPadding
                                : (startX + rectWidth + itemTextSize.width / 2) + textPadding;
                            textY = startY + (rectHeight / 2) + (itemTextSize.height / 4);
                        }
                    }
                    if (i === 0) {
                        itemStartX = (arrangement === 'Horizontal') ? startX : (position === 'After') ?
                            textX - (itemTextSize.width / 2) : startX;
                        itemStartY = (arrangement === 'Horizontal') ? (position === 'After') ? startY :
                            textY - (itemTextSize.height / 2) : startY;
                        if (this.legendCollection.length === 1) {
                            legendWidth = (arrangement === 'Horizontal') ? Math.abs((startX + rectWidth) - itemStartX) :
                                (rectWidth + maxTextWidth + textPadding);
                            legendHeight = (arrangement === 'Horizontal') ? (rectHeight + (maxTextHeight / 2) + textPadding) :
                                Math.abs((startY + rectHeight) - itemStartY);
                        }
                    } else if (i === this.legendCollection.length - 1) {
                        legendWidth = (arrangement === 'Horizontal') ? Math.abs((startX + rectWidth) - itemStartX) :
                            (rectWidth + maxTextWidth + textPadding);
                        legendHeight = (arrangement === 'Horizontal') ? (rectHeight + (maxTextHeight / 2) + textPadding) :
                            Math.abs((startY + rectHeight) - itemStartY);
                    }
                    this.legendRenderingCollections.push({
                        fill: this.legendCollection[i]['fill'], x: startX, y: startY,
                        width: rectWidth, height: rectHeight,
                        text: legendText, textX: textX, textY: textY,
                        textWidth: itemTextSize.width, textHeight: itemTextSize.height,
                        shapeBorder: this.legendCollection[i]['shapeBorder']
                    });
                }
                if (this.legendCollection.length === 1) {
                    legendHeight = rectHeight;
                    legendWidth = rectWidth;
                }
                this.legendItemRect = { x: itemStartX, y: itemStartY, width: legendWidth, height: legendHeight };
            } else {
                legendWidth = (isNullOrUndefined(legendWidth)) ? map.mapAreaRect.width : legendWidth;
                legendHeight = (isNullOrUndefined(legendHeight)) ? map.mapAreaRect.height : legendHeight;
                let j: number = 0;
                this.page = 0;
                for (let i: number = 0; i < this.legendCollection.length; i++) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const legendItem: any = this.legendCollection[i];
                    if (isNullOrUndefined(this.totalPages[this.page])) {
                        this.totalPages[this.page] = { Page: (this.page + 1), Collection: [] };
                    }
                    const legendTextSize: Size = measureText(legendItem['text'], legend.textStyle);
                    this.textMaxWidth = Math.max(this.textMaxWidth, legendTextSize.width);
                    if (i === 0) {
                        startX = shapeX = (leftPadding + (shapeWidth / 2));
                        startY = shapeY = topPadding + legendtitleSize.height + (shapeHeight > legendTextSize.height ? shapeHeight / 2
                            : (legendTextSize.height / 4));
                    } else {
                        const maxSize: number = (legendTextSize.height > shapeHeight) ? legendTextSize.height : shapeHeight;
                        if (arrangement === 'Horizontal') {
                            const prvePositionX: number = (textLocation[j - 1].x + textLocation[j - 1].width) + textPadding + shapeWidth;
                            if ((prvePositionX + shapePadding + legendTextSize.width) > legendWidth) {
                                const nextPositionY: number = (textLocation[j - 1].y > (shapeLocation[j - 1].y + (shapeHeight / 2)) ?
                                    textLocation[j - 1].y : (shapeLocation[j - 1].y + (shapeHeight / 2))) + topPadding;
                                if ((nextPositionY + maxSize) > legendHeight) {
                                    this.getPageChanged();
                                    j = 0;
                                    shapeLocation = [];
                                    textLocation = [];
                                    legendRectCollection = [];
                                    shapeX = startX;
                                    shapeY = startY;
                                } else {
                                    shapeX = (shapeLocation[0].x);
                                    shapeY = (nextPositionY + (maxSize / 2));
                                }
                            } else {
                                shapeX = (prvePositionX - (shapeWidth / 2));
                                shapeY = (shapeLocation[j - 1]).y;
                            }
                        } else {
                            const prevPositionY: number = textLocation[j - 1].y > shapeLocation[j - 1].y + (shapeHeight / 2) ?
                                textLocation[j - 1].y : shapeLocation[j - 1].y + (shapeHeight / 2);
                            if ((prevPositionY + topPadding + maxSize) > legendHeight) {
                                const nextPositionX: number = (textLocation[j - 1].x + this.textMaxWidth + textPadding);
                                if ((nextPositionX + shapePadding + legendTextSize.width) > legendWidth) {
                                    shapeX = startX;
                                    shapeY = startY;
                                    legendRectCollection = [];
                                    textLocation = [];
                                    shapeLocation = [];
                                    this.getPageChanged();
                                    j = 0;
                                } else {
                                    shapeX = nextPositionX + (shapeWidth / 2);
                                    shapeY = (shapeLocation[0].y);
                                }
                            } else {
                                shapeX = shapeLocation[j - 1].x;
                                shapeY = prevPositionY + topPadding + (shapeHeight / 2);
                            }
                        }
                    }
                    textX = shapeX + (shapeWidth / 2) + shapePadding;
                    textY = shapeY + (legendTextSize.height / 4);
                    shapeLocation.push({ x: shapeX, y: shapeY });
                    textLocation.push({ x: textX, y: textY, width: legendTextSize.width, height: (legendTextSize.height / 2) });
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (<any[]>this.totalPages[this.page]['Collection']).push({
                        DisplayText: legendItem['text'],
                        ImageSrc: legendItem['imageSrc'],
                        Shape: { x: shapeX, y: shapeY },
                        Text: { x: textX, y: textY },
                        Fill: legendItem['fill'],
                        legendShape: legendItem['shape'],
                        shapeBorder: legendItem['shapeBorder'],
                        idIndex: i,
                        Rect: {
                            x: shapeLocation[j].x - (shapeWidth / 2),
                            y: (shapeLocation[j].y - (shapeHeight / 2)) < (textY - legendTextSize.height) ?
                                (shapeLocation[j].y - (shapeHeight / 2)) : (textY - legendTextSize.height),
                            width: Math.abs((shapeLocation[j].x - (shapeWidth / 2)) - (textX + legendTextSize.width)),
                            height: ((shapeHeight > legendTextSize.height) ? shapeHeight : legendTextSize.height)
                        }
                    });
                    j++;
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const collection: any[] = (<any[]>this.totalPages[0]['Collection']);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                Array.prototype.forEach.call(collection, (legendObj: any, index: number) => {
                    const legendRect: Rect = new Rect(
                        legendObj['Rect']['x'], legendObj['Rect']['y'],
                        legendObj['Rect']['width'], legendObj['Rect']['height']
                    );
                    if (index === 0) {
                        legendItemStartX = legendRect.x;
                        legendItemStartY = legendRect.y;
                    }
                    this.widthIncrement = Math.max(this.widthIncrement, Math.abs(legendItemStartX - (legendRect.x + legendRect.width)));
                    this.heightIncrement = Math.max(this.heightIncrement, Math.abs(legendItemStartY - (legendRect.y + legendRect.height)));
                });
                legendWidth = ((this.widthIncrement < legendWidth) ? this.widthIncrement : legendWidth);
                legendHeight = ((this.heightIncrement < legendHeight) ? this.heightIncrement : legendHeight);
                this.legendItemRect = {
                    x: collection[0]['Rect']['x'], y: collection[0]['Rect']['y'],
                    width: legendWidth, height: legendHeight
                };
            }
        }
    }
    /**
     * Get the legend collections
     *
     * @param {number} layerIndex - Specifies the layer index
     * @param {object[]} layerData - Specifies the layer data
     * @param {ColorMappingSettings[]} colorMapping - Specifies the color mapping
     * @param {object[]} dataSource - Specifies the data source
     * @param {string} dataPath - Specifies the data path
     * @param {string} colorValuePath - Specifies the color value path
     * @param {string | string[]} propertyPath - Specifies the property path
     * @returns {void}
     */
    private getLegends(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        layerIndex: number, layerData: any[], colorMapping: ColorMappingSettings[], dataSource: any[],
        dataPath: string, colorValuePath: string, propertyPath: string | string[]
    ): void {
        this.getRangeLegendCollection(layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath);
        this.getEqualLegendCollection(layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath);
        this.getDataLegendCollection(layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath);
    }
    private getPageChanged(): void {
        this.page++;
        if (isNullOrUndefined(this.totalPages[this.page])) {
            this.totalPages[this.page] = { Page: (this.page + 1), Collection: [] };
        }
    }

    private legendTextTrim(maxWidth: number, text: string, font: FontModel, legendRectSize: number): string {
        let label: string = text;
        let size: number = measureText(text, font).width;
        const legendWithoutTextSize : number = legendRectSize - size;
        if (legendRectSize > maxWidth) {
            const textLength: number = text.length;
            for (let i: number = textLength - 1; i >= 0; --i) {
                label = text.substring(0, i) + '...';
                size = measureText(label, font).width;
                const totalSize : number = legendWithoutTextSize + size;
                if (totalSize <= maxWidth || label.length < 4) {
                    if (label.length < 4) {
                        label = ' ';
                    }
                    return label;
                }
            }
        }
        return label;
    }

    // eslint-disable-next-line valid-jsdoc
    /**
     * To draw the legend shape and text.
     */
    public drawLegend(): void {
        const map: Maps = this.maps;
        const legend: LegendSettingsModel = <LegendSettingsModel>map.legendSettings;
        const render: SvgRenderer = map.renderer;
        let textOptions: TextOption;
        const textFont: FontModel = legend.textStyle;
        this.legendGroup = render.createGroup({ id: map.element.id + '_Legend_Group' });
        if (legend.mode === 'Interactive') {
            for (let i: number = 0; i < this.legendRenderingCollections.length; i++) {
                const itemId: string = map.element.id + '_Legend_Index_' + i;
                const textId: string = map.element.id + '_Legend_Index_' + i + '_Text';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const item: any = this.legendRenderingCollections[i];
                const bounds: Rect = new Rect(item['x'], item['y'], item['width'], item['height']);
                if (i === 0) {
                    this.renderLegendBorder();
                }
                const textLocation: Point = new Point(item['textX'], item['textY']);
                textFont.color = (textFont.color !== null) ? textFont.color : this.maps.themeStyle.legendTextColor;
                const rectOptions: RectOption = new RectOption(itemId, item['fill'], item['shapeBorder'], legend.opacity, bounds);
                textOptions = new TextOption(textId, textLocation.x, textLocation.y, 'middle', item['text'], '', '');
                textFont.fontFamily = map.themeStyle.fontFamily || textFont.fontFamily;
                textFont.size = map.themeStyle.legendFontSize || textFont.size;
                renderTextElement(textOptions, textFont, textFont.color, this.legendGroup);
                this.legendGroup.appendChild(render.drawRectangle(rectOptions));
                this.legendToggle();
            }
        } else {
            this.drawLegendItem(this.currentPage);
        }
    }

    private drawLegendItem(page: number): void {
        const map: Maps = this.maps;
        const legend: LegendSettingsModel = <LegendSettingsModel>map.legendSettings; const spacing: number = 10;
        const shapeSize: Size = new Size(legend.shapeWidth, legend.shapeHeight);
        let textOptions: TextOption; let renderOptions: CircleOption | PathOption | RectOption;
        const render: SvgRenderer = map.renderer;
        if (page >= 0 && page < this.totalPages.length) {
            if (querySelector(this.legendGroup.id, this.maps.element.id)) {
                remove(querySelector(this.legendGroup.id, this.maps.element.id));
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            for (let i: number = 0; i < (<any[]>this.totalPages[page]['Collection']).length; i++) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const collection: any = <any[]>this.totalPages[page]['Collection'][i];
                const shapeBorder: BorderModel = collection['shapeBorder'];
                const legendElement: Element = render.createGroup({ id: map.element.id + '_Legend_Index_' + collection['idIndex'] });
                let legendText: string = collection['DisplayText'];
                const shape: LegendShape = <LegendShape>((legend.type === 'Markers') ? ((isNullOrUndefined(collection['ImageSrc'])) ?
                    legend.shape : 'Image') : collection['legendShape']);
                const strokeColor: string = (legend.shape === 'HorizontalLine' || legend.shape === 'VerticalLine'
                    || legend.shape === 'Cross') ? isNullOrUndefined(legend.fill) ? '#000000' : legend.fill : shapeBorder.color;
                const strokeWidth: number = (legend.shape === 'HorizontalLine' || legend.shape === 'VerticalLine'
                    || legend.shape === 'Cross') ? (shapeBorder.width === 0) ?
                        1 : shapeBorder.width : shapeBorder.width;
                const shapeId: string = map.element.id + '_Legend_Shape_Index_' + collection['idIndex'];
                const textId: string = map.element.id + '_Legend_Text_Index_' + collection['idIndex'];
                const shapeLocation: Point = collection['Shape'];
                const textLocation: Point = collection['Text'];
                const imageUrl: string = ((isNullOrUndefined(collection['ImageSrc'])) ? legend.shape : collection['ImageSrc']);
                const renderOptions: PathOption = new PathOption(
                    shapeId, collection['Fill'], strokeWidth, strokeColor, legend.opacity,
                    isNullOrUndefined(shapeBorder.opacity) ? legend.opacity : shapeBorder.opacity, ''
                );
                legend.textStyle.color = (legend.textStyle.color !== null) ? legend.textStyle.color :
                    this.maps.themeStyle.legendTextColor;
                legend.textStyle.fontFamily = map.themeStyle.fontFamily || legend.textStyle.fontFamily;
                legend.textStyle.size = map.themeStyle.legendFontSize || legend.textStyle.size;
                if (i === 0) {
                    this.renderLegendBorder();
                }
                legendElement.appendChild(drawSymbol(shapeLocation, shape, shapeSize, collection['ImageSrc'], renderOptions));
                const legendRectSize : number = collection['Rect']['x'] + collection['Rect']['width'];
                if (legendRectSize > this.legendBorderRect.width) {
                    const trimmedText : string = this.legendTextTrim(this.legendBorderRect.width, legendText,
                                                                     legend.textStyle, legendRectSize);
                    legendText = trimmedText;
                }
                textOptions = new TextOption(textId, textLocation.x, textLocation.y, 'start', legendText, '', '');
                renderTextElement(textOptions, legend.textStyle, legend.textStyle.color, legendElement);
                this.legendGroup.appendChild(legendElement);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (i === ((<any[]>this.totalPages[page]['Collection']).length - 1)) {
                    let pagingGroup: Element; const width: number = spacing; const height: number = (spacing / 2);
                    if (this.page !== 0) {
                        const pagingText: string = (page + 1) + '/' + this.totalPages.length;
                        const pagingFont: FontModel = legend.textStyle;
                        const pagingTextSize: Size = measureText(pagingText, pagingFont);
                        const leftPageX: number = (this.legendItemRect.x + this.legendItemRect.width) - pagingTextSize.width -
                            (width * 2) - spacing;
                        const rightPageX: number = (this.legendItemRect.x + this.legendItemRect.width);
                        const locY: number = (this.legendItemRect.y + this.legendItemRect.height) + (height / 2) + spacing;
                        const pageTextX: number = rightPageX - width - (pagingTextSize.width / 2) - (spacing / 2);
                        pagingGroup = render.createGroup({ id: map.element.id + '_Legend_Paging_Group' });
                        const leftPageElement: Element = render.createGroup({ id: map.element.id + '_Legend_Left_Paging_Group' });
                        const rightPageElement: Element = render.createGroup({ id: map.element.id + '_Legend_Right_Paging_Group' });
                        const rightPath: string = ' M ' + rightPageX + ' ' + locY + ' L ' + (rightPageX - width) + ' ' + (locY - height) +
                            ' L ' + (rightPageX - width) + ' ' + (locY + height) + ' z ';
                        const leftPath: string = ' M ' + leftPageX + ' ' + locY + ' L ' + (leftPageX + width) + ' ' + (locY - height) +
                            ' L ' + (leftPageX + width) + ' ' + (locY + height) + ' z ';
                        const leftPageOptions: PathOption = new PathOption(
                            map.element.id + '_Left_Page', '#a6a6a6', 0, '#a6a6a6', 1, 1, '', leftPath
                        );
                        leftPageElement.appendChild(render.drawPath(leftPageOptions));
                        const leftRectPageOptions: RectOption = new RectOption(
                            map.element.id + '_Left_Page_Rect', 'transparent', {}, 1,
                            new Rect(leftPageX - (width / 2), (locY - (height * 2)), width * 2, spacing * 2), null, null, '', ''
                        );
                        leftPageElement.appendChild(render.drawRectangle(leftRectPageOptions));
                        this.wireEvents(leftPageElement);
                        const rightPageOptions: PathOption = new PathOption(
                            map.element.id + '_Right_Page', '#a6a6a6', 0, '#a6a6a6', 1, 1, '', rightPath
                        );
                        rightPageElement.appendChild(render.drawPath(rightPageOptions));
                        const rightRectPageOptions: RectOption = new RectOption(
                            map.element.id + '_Right_Page_Rect', 'transparent', {}, 1,
                            new Rect((rightPageX - width), (locY - height), width, spacing), null, null, '', ''
                        );
                        rightPageElement.appendChild(render.drawRectangle(rightRectPageOptions));
                        this.wireEvents(rightPageElement);
                        pagingGroup.appendChild(leftPageElement);
                        pagingGroup.appendChild(rightPageElement);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const pageTextOptions: any = {
                            'id': map.element.id + '_Paging_Text',
                            'x': pageTextX,
                            'y': locY + (pagingTextSize.height / 4),
                            'fill': '#a6a6a6',
                            'font-size': '14px',
                            'font-style': pagingFont.fontStyle,
                            'font-family': pagingFont.fontFamily,
                            'font-weight': pagingFont.fontWeight,
                            'text-anchor': 'middle',
                            'transform': '',
                            'opacity': 1,
                            'dominant-baseline': ''
                        };
                        pagingGroup.appendChild(render.createText(pageTextOptions, pagingText));
                        this.legendGroup.appendChild(pagingGroup);
                    }
                    this.legendToggle();
                }
            }
        }
    }

    public legendHighLightAndSelection(targetElement: Element, value: string): void {
        let shapeIndex: number;
        let layerIndex: number;
        let dataIndex: number;
        const legend: LegendSettingsModel = this.maps.legendSettings;
        const textEle: Element = legend.mode === 'Default' ? document.getElementById(targetElement.id.replace('Shape', 'Text')) :
            document.getElementById(targetElement.id + '_Text');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const collection: any[] = this.maps.legendModule.legendCollection;
        let length: number;
        const multiSelectEnable: boolean = this.maps.layers[collection[0]['data'][0]['layerIndex']].selectionSettings.enableMultiSelect;
        let selectLength: number = 0;
        let interactProcess: boolean = true;
        const idIndex: number = parseFloat(targetElement.id.charAt(targetElement.id.length - 1));
        this.updateLegendElement();
        const toggleLegendCheck: number = this.maps.toggledLegendId.indexOf(idIndex);
        if (this.maps.legendSettings.toggleLegendSettings.enable && value === 'highlight' && toggleLegendCheck !== -1) {
            const collectionIndex: number = this.getIndexofLegend(this.legendHighlightCollection, targetElement);
            if (collectionIndex !== -1) {
                this.legendHighlightCollection.splice(collectionIndex, 1);
            }
            this.removeLegendHighlightCollection();
            return null;
        }
        if (value === 'selection') {
            this.shapeHighlightCollection = [];
            if (!this.maps.shapeSelections && !multiSelectEnable) {
                this.removeAllSelections();
                this.maps.shapeSelections = true;
            }
            if (this.maps.legendSelectionCollection.length > 0 && (!multiSelectEnable ? this.maps.shapeSelections : true)) {
                for (let k: number = 0; k < this.maps.legendSelectionCollection.length; k++) {
                    if (targetElement === this.maps.legendSelectionCollection[k]['legendElement']) {
                        this.maps.legendSelectionCollection[k]['legendElement'] = targetElement;
                        interactProcess = false;
                        this.removeLegendSelectionCollection(this.maps.legendSelectionCollection[k]['legendElement']);

                        this.maps.selectedLegendElementId.splice(this.maps.selectedLegendElementId.indexOf(idIndex), 1);
                        this.maps.legendSelectionCollection.splice(k, 1);
                        this.maps.legendSelection = this.maps.legendSelectionCollection.length > 0 ? false : true;
                        break;
                    } else if (!multiSelectEnable) {
                        if (this.maps.legendSelectionCollection.length > 1) {
                            for (let z : number = 0; z < this.maps.legendSelectionCollection.length; z++) {
                                this.removeLegendSelectionCollection(this.maps.legendSelectionCollection[z]['legendElement']);
                            }
                            this.maps.legendSelectionCollection = [];
                        } else {
                            this.removeLegendSelectionCollection(this.maps.legendSelectionCollection[k]['legendElement']);
                            this.maps.legendSelectionCollection.splice(k, 1);
                        }
                    }
                }
            }
        } else {
            if (this.maps.legendSelectionCollection.length > 0) {
                for (let k: number = 0; k < this.maps.legendSelectionCollection.length; k++) {
                    if ((targetElement.id.indexOf('_Legend_Shape') > -1 || targetElement.id.indexOf('_Legend_Index')) &&
                        targetElement === this.maps.legendSelectionCollection[k]['legendElement']) {
                        interactProcess = false;
                        break;
                    } else {
                        this.removeLegendHighlightCollection();
                    }
                }
            }
            this.removeLegendHighlightCollection();
        }
        if (interactProcess) {
            for (let i: number = 0; i < collection.length; i++) {
                const idIndex: number = this.maps.legendSettings.mode === 'Interactive' ?
                    parseFloat(targetElement.id.split('_Legend_Index_')[1]) :
                    parseFloat(targetElement.id.split('_Legend_Shape_Index_')[1]);
                if (textEle.textContent === collection[i]['text'] && collection[i]['data'].length > 0
                && idIndex === i) {
                    const layer: LayerSettingsModel = this.maps.layers[collection[i]['data'][0]['layerIndex']];
                    let enable: boolean; let module: HighlightSettingsModel | SelectionSettingsModel;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    let data: any[];
                    if (!isNullOrUndefined(layer)) {
                        enable = (value === 'selection') ? layer.selectionSettings.enable : layer.highlightSettings.enable;
                        module = void 0;
                        module = (value === 'selection') ? layer.selectionSettings : layer.highlightSettings;
                        data = collection[i]['data'];
                    }

                    if (enable) {
                        for (let j: number = 0; j < data.length; j++) {
                            shapeIndex = data[j]['shapeIndex'];
                            layerIndex = data[j]['layerIndex'];
                            dataIndex = data[j]['dataIndex'];
                            const shapeEle: Element = document.getElementById(this.maps.element.id + '_LayerIndex_' +
                                layerIndex + '_shapeIndex_' + shapeIndex + '_dataIndex_' + dataIndex);
                            if (shapeEle !== null) {
                                let shapeMatch: boolean = true;
                                if (this.maps.legendSelectionCollection !== null) {
                                    for (let i: number = 0; i < this.maps.legendSelectionCollection.length; i++) {
                                        if (this.maps.legendSelectionCollection[i]['legendElement'] === targetElement) {
                                            shapeMatch = false;
                                            break;
                                        }
                                    }
                                }
                                if (value === 'highlight' && shapeMatch) {
                                    if (j === 0) {
                                        this.legendHighlightCollection = [];
                                        this.pushCollection(
                                            targetElement, this.legendHighlightCollection, collection[i],
                                            layer.shapeSettings as ShapeSettings);
                                    }
                                    length = this.legendHighlightCollection.length;
                                    const legendHighlightColor: string = this.legendHighlightCollection[length - 1]['legendOldFill'];
                                    this.legendHighlightCollection[length - 1]['MapShapeCollection']['Elements'].push(shapeEle);
                                    const shapeItemCount: number = this.legendHighlightCollection[length - 1]['MapShapeCollection']['Elements'].length - 1;
                                    const shapeOldFillColor: string = shapeEle.getAttribute('fill');
                                    this.legendHighlightCollection[length - 1]['shapeOldFillColor'].push(shapeOldFillColor);
                                    const shapeOldColor: string = this.legendHighlightCollection[length - 1]['shapeOldFillColor'][shapeItemCount];
                                    this.shapePreviousColor = this.legendHighlightCollection[length - 1]['shapeOldFillColor'];
                                    this.setColor(
                                        shapeEle, !isNullOrUndefined(module.fill) ? module.fill : shapeOldColor,
                                        module.opacity.toString(), module.border.color, module.border.width.toString(), 'highlight');
                                    this.setColor(
                                        targetElement, !isNullOrUndefined(module.fill) ? module.fill : legendHighlightColor,
                                        module.opacity.toString(), module.border.color, module.border.width.toString(), 'highlight');
                                } else if (value === 'selection') {
                                    this.legendHighlightCollection = [];
                                    this.maps.legendSelectionClass = module;
                                    if (j === 0) {
                                        this.pushCollection(
                                            targetElement, this.maps.legendSelectionCollection, collection[i],
                                            layer.shapeSettings as ShapeSettings);
                                        if (multiSelectEnable) {
                                            this.maps.selectedLegendElementId.push(i);
                                        } else {
                                            if (this.maps.selectedLegendElementId.length === 0) {
                                                this.maps.selectedLegendElementId.push(i);
                                            } else {
                                                this.maps.selectedLegendElementId = [];
                                                this.maps.selectedLegendElementId.push(i);
                                            }
                                        }
                                    }
                                    selectLength = this.maps.legendSelectionCollection.length;
                                    const legendSelectionColor: string = this.maps.legendSelectionCollection[selectLength - 1]['legendOldFill'];
                                    this.maps.legendSelectionCollection[selectLength - 1]['MapShapeCollection']['Elements'].push(shapeEle);
                                    this.maps.legendSelectionCollection[selectLength - 1]['shapeOldFillColor'] = this.shapePreviousColor;
                                    this.setColor(
                                        targetElement, !isNullOrUndefined(module.fill) ? module.fill : legendSelectionColor,
                                        module.opacity.toString(), module.border.color, module.border.width.toString(), 'selection');
                                    this.setColor(
                                        shapeEle, !isNullOrUndefined(module.fill) ? module.fill : legendSelectionColor,
                                        module.opacity.toString(), module.border.color, module.border.width.toString(), 'selection');
                                    if (this.maps.selectedElementId.indexOf(shapeEle.getAttribute('id')) === - 1) {
                                        this.maps.selectedElementId.push(shapeEle.getAttribute('id'));
                                    }
                                    if (j === data.length - 1) {
                                        this.maps.legendSelection = false;
                                        this.removeLegend(this.maps.legendSelectionCollection);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private setColor(element: Element, fill: string, opacity: string, borderColor: string, borderWidth: string, type: string): void {
        if (type === 'selection') {
            maintainStyleClass('ShapeselectionMap', 'ShapeselectionMapStyle', fill, opacity, borderColor, borderWidth, this.maps);
            element.setAttribute('class', 'ShapeselectionMapStyle');
        } else {
            element.setAttribute('fill', fill);
            element.setAttribute('fill-opacity', opacity);
            element.setAttribute('stroke', borderColor);
            element.setAttribute('stroke-width', (Number(borderWidth) / this.maps.scale).toString());
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public pushCollection(targetElement: Element, collection: any[], oldElement: any, shapeSettings: ShapeSettings): void {
        collection.push({
            legendElement: targetElement, legendOldFill: oldElement['fill'], legendOldOpacity: oldElement['opacity'],
            legendOldBorderColor: oldElement['borderColor'], legendOldBorderWidth: oldElement['borderWidth'],
            shapeOpacity: shapeSettings.opacity, shapeOldBorderColor: shapeSettings.border.color,
            shapeOldBorderWidth: shapeSettings.border.width
        });
        const length: number = collection.length;
        collection[length - 1]['MapShapeCollection'] = { Elements: [] };
        collection[length - 1]['shapeOldFillColor'] = [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private removeLegend(collection: any[]): void {
        for (let i: number = 0; i < collection.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const item: any = collection[i];
            this.setColor(
                item['legendElement'], item['legendOldFill'], item['legendOldOpacity'],
                item['legendOldBorderColor'], item['legendOldBorderWidth'], 'highlight');
            const dataCount: number = item['MapShapeCollection']['Elements'].length;
            for (let j: number = 0; j < dataCount; j++) {
                const shapeFillColor: string = item['legendOldFill'].indexOf('url') !== -1
                    ? item['shapeOldFillColor'][j] : item['legendOldFill'];
                this.setColor(
                    item['MapShapeCollection']['Elements'][j], shapeFillColor, item['shapeOpacity'],
                    item['shapeOldBorderColor'], item['shapeOldBorderWidth'], 'highlight');
            }
        }
    }

    public removeLegendHighlightCollection(): void {
        if (this.legendHighlightCollection.length > 0) {
            this.removeLegend(this.legendHighlightCollection);
            this.legendHighlightCollection = [];
        }
    }

    public removeLegendSelectionCollection(targetElement: Element): void {
        if (this.maps.legendSelectionCollection.length > 0) {
            removeClass(targetElement);
            const shapeElements: string[] = this.shapesOfLegend(targetElement);
            const dataCount: number = shapeElements.length;
            for (let j: number = 0; j < dataCount; j++) {
                const shapeElement: Element = getElement(shapeElements[j]);
                if (shapeElement.getAttribute('class') === 'ShapeselectionMapStyle') {
                    removeClass(shapeElement);
                    const selectedElementIdIndex: number = this.maps.selectedElementId.indexOf(shapeElement.id);
                    if (selectedElementIdIndex !== - 1) {
                        this.maps.selectedElementId.splice(selectedElementIdIndex, 1);
                    }
                }
            }
        }
    }

    public removeShapeHighlightCollection(): void {
        if (this.shapeHighlightCollection.length > 0) {
            for (let i: number = 0; i < this.shapeHighlightCollection.length; i++) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const item: any = this.shapeHighlightCollection[i];
                let removeFill: boolean = true;
                for (let j: number = 0; j < this.maps.legendSelectionCollection.length; j++) {
                    if (this.maps.legendSelectionCollection[j]['legendElement'] === item['legendElement']) {
                        removeFill = false;
                    }
                }
                if (removeFill) {
                    this.setColor(
                        item['legendElement'], item['legendOldFill'], item['legendOldOpacity'],
                        item['legendOldBorderColor'], item['legendOldBorderWidth'], 'highlight');
                }
            }
        }
    }

    public shapeHighLightAndSelection(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        targetElement: Element, data: any, module: SelectionSettingsModel | HighlightSettingsModel,
        getValue: string, layerIndex: number): void {
        if (data !== undefined) {
            this.updateLegendElement();
            this.shapeToggled = true;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const collection: any[] = this.maps.legendModule.legendCollection;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const indexes: any = this.legendIndexOnShape(data, layerIndex);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const shapeElement: any = this.shapeDataOnLegend(targetElement);
            const toggleLegendCheck: number = this.maps.toggledLegendId.indexOf(indexes['actualIndex']);
            if (this.maps.legendSettings.toggleLegendSettings.enable && toggleLegendCheck !== -1) {
                this.shapeToggled = false;
                this.legendHighlightCollection = [];
                const collectionIndex: number = this.getIndexofLegend(this.shapeHighlightCollection, shapeElement['LegendEle']);
                if (collectionIndex !== -1) {
                    this.shapeHighlightCollection.splice(collectionIndex, 1);
                }
                this.removeShapeHighlightCollection();
                return null;
            }
            if (indexes['currentIndex'] === undefined && indexes['actualIndex'] === undefined) {
                this.removeShapeHighlightCollection();
                return null;
            }
            if (indexes['currentIndex'] === undefined && getValue === 'selection'
                && !this.maps.layers[layerIndex].selectionSettings.enableMultiSelect &&
                targetElement.getAttribute('class') !== 'ShapeselectionMapStyle') {
                this.maps.legendSelection = false;
            }
            if (getValue === 'selection' && !this.maps.layers[layerIndex].selectionSettings.enableMultiSelect &&
                !this.maps.legendSelection) {
                this.removeAllSelections();
                this.maps.legendSelection = true;
            }
            if (indexes['currentIndex'] === undefined) {
                if (getValue === 'selection' && indexes['actualIndex'] !== undefined) {
                    let checkSelection: number = 0;
                    for (let i: number = 0; i < shapeElement['Elements'].length; i++) {
                        if (shapeElement['Elements'][i].getAttribute('class') === 'ShapeselectionMapStyle') {
                            checkSelection++;
                        }
                    }
                    const selectionIndex: number = this.maps.selectedLegendElementId.indexOf(indexes['actualIndex']);
                    if (selectionIndex === -1) {
                        this.maps.selectedLegendElementId.push(indexes['actualIndex']);
                        this.maps.legendSelectionClass = <SelectionSettingsModel>module;
                    } else {
                        if ((checkSelection <= 1) && targetElement.getAttribute('class') === 'ShapeselectionMapStyle') {
                            if (!this.maps.layers[layerIndex].selectionSettings.enableMultiSelect) {
                                this.maps.selectedLegendElementId.splice(selectionIndex, 1);
                            } else {
                                if (checkSelection <= 1 && targetElement.getAttribute('class') === 'ShapeselectionMapStyle') {
                                    this.maps.selectedLegendElementId.splice(selectionIndex, 1);
                                }
                            }
                        }
                    }
                }
                this.removeShapeHighlightCollection();
                return null;
            }
            const text: string = collection[indexes['actualIndex']]['text'];
            let content: string; let legendShape: Element;

            if (this.maps.legendSettings.mode === 'Default') {
                if (indexes['currentIndex'] !== undefined) {
                    content = document.getElementById(this.maps.element.id + '_Legend_Text_Index_' + indexes['actualIndex']).textContent;
                    legendShape = document.getElementById(this.maps.element.id + '_Legend_Shape_Index_' + indexes['actualIndex']);
                }
            } else {
                content = document.getElementById(this.maps.element.id + '_Legend_Index_' + indexes['actualIndex']
                    + '_Text').textContent;
                legendShape = document.getElementById(this.maps.element.id + '_Legend_Index_' + indexes['actualIndex']);
            }
            this.oldShapeElement = shapeElement['LegendEle'];
            const length: number = this.maps.legendSelectionCollection.length;
            if (text === content) {
                let shapeMatched: boolean = true;
                if (this.maps.legendSelectionCollection) {
                    for (let i: number = 0; i < this.maps.legendSelectionCollection.length; i++) {
                        if (this.maps.legendSelectionCollection[i]['legendElement'] === shapeElement['LegendEle']) {
                            shapeMatched = false;
                            break;
                        }
                    }
                }
                if (getValue === 'highlight' && shapeMatched) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const selectionEle: any = this.isTargetSelected(shapeElement, this.shapeHighlightCollection);
                    if (selectionEle === undefined || (selectionEle && !selectionEle['IsSelected'])) {
                        this.pushCollection(
                            legendShape, this.shapeHighlightCollection, collection[indexes['actualIndex']],
                            this.maps.layers[layerIndex].shapeSettings as ShapeSettings
                        );
                    }
                    for (let j: number = 0; j < this.shapeHighlightCollection.length; j++) {
                        if (shapeElement['LegendEle'].id === this.shapeHighlightCollection[j]['legendElement'].id) {
                            this.shapeHighlightCollection[j]['legendElement'] = shapeElement['LegendEle'];
                        }
                    }
                    if (length > 0) {
                        for (let j: number = 0; j < length; j++) {
                            if (shapeElement['LegendEle'] === this.maps.legendSelectionCollection[j]['legendElement']) {
                                this.maps.legendSelectionCollection[j]['legendElement'] = shapeElement['LegendEle'];
                                this.removeShapeHighlightCollection();
                                break;
                            } else if (j === length - 1) {
                                this.removeShapeHighlightCollection();
                                this.setColor(
                                    legendShape, !isNullOrUndefined(module.fill) ? module.fill : legendShape.getAttribute('fill'),
                                    module.opacity.toString(), module.border.color, module.border.width.toString(), 'highlight');
                            }
                        }
                    } else {
                        this.removeShapeHighlightCollection();
                        this.setColor(
                            legendShape, !isNullOrUndefined(module.fill) ? module.fill : legendShape.getAttribute('fill'),
                            module.opacity.toString(), module.border.color, module.border.width.toString(), 'highlight');
                    }
                } else if (getValue === 'selection') {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const selectionEle: any = this.isTargetSelected(shapeElement, this.maps.legendSelectionCollection);
                    if (length > 0) {
                        let j: number = 0;
                        while (j < this.maps.legendSelectionCollection.length) {
                            if (shapeElement['LegendEle'] !== this.maps.legendSelectionCollection[j]['legendElement'] &&
                                !(<SelectionSettingsModel>module).enableMultiSelect) {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const element: any = this.maps.legendSelectionCollection[j];
                                const selectedLegendIndex: number = this.maps.selectedLegendElementId.indexOf(indexes['actualIndex']);
                                this.maps.selectedLegendElementId.splice(selectedLegendIndex, 1);
                                this.maps.legendSelectionCollection.splice(j, 1);
                                removeClass(element['legendElement']);
                                this.maps.shapeSelections = true;
                                j = 0;
                            } else { j++; }
                        }
                    }
                    if (selectionEle && (
                        selectionEle['IsSelected'] && targetElement.getAttribute('class') === 'ShapeselectionMapStyle')) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const element: any = this.maps.legendSelectionCollection[selectionEle['SelectionIndex']];
                        let multiSelection: number = 0;
                        if ((<SelectionSettingsModel>module).enableMultiSelect) {
                            for (let i: number = 0; i < shapeElement['Elements'].length; i++) {
                                if (targetElement.getAttribute('class') === shapeElement['Elements'][i].getAttribute('class')) {
                                    multiSelection++;
                                }
                            }
                        }
                        if (multiSelection <= 1 && (!(<SelectionSettingsModel>module).enableMultiSelect ?
                            this.maps.legendSelection : true)) {
                            this.maps.selectedLegendElementId.splice(this.maps.selectedLegendElementId.indexOf(indexes['actualIndex']), 1);
                            if (!isNullOrUndefined(shapeElement['LegendEle'])) {
                                removeClass(shapeElement['LegendEle']);
                            }
                            this.maps.legendSelectionCollection.splice(selectionEle['SelectionIndex'], 1);
                            this.maps.shapeSelections = true;
                        }
                    } else {
                        if ((selectionEle === undefined || (selectionEle && !selectionEle['IsSelected'])) &&
                            !isNullOrUndefined(legendShape)) {
                            const legendSelectionIndex: number = this.getIndexofLegend(this.maps.legendSelectionCollection, legendShape);
                            if (legendSelectionIndex === -1) {
                                this.pushCollection(
                                    legendShape, this.maps.legendSelectionCollection, collection[indexes['actualIndex']],
                                    this.maps.layers[layerIndex].shapeSettings as ShapeSettings
                                );
                            }
                        }
                        let addId: boolean = true;
                        for (let i: number = 0; i < this.maps.selectedLegendElementId.length; i++) {
                            if (indexes['actualIndex'] === this.maps.selectedLegendElementId[i]) {
                                addId = false;
                            }
                        }
                        if (addId) {
                            this.maps.selectedLegendElementId.push(indexes['actualIndex']);
                        }
                        this.maps.legendSelectionClass = <SelectionSettingsModel>module;
                        this.removeLegend(this.shapeHighlightCollection);
                        if (!isNullOrUndefined(legendShape)) {
                            this.setColor(
                                legendShape, !isNullOrUndefined(module.fill) ? module.fill : legendShape.getAttribute('fill'),
                                module.opacity.toString(), module.border.color, module.border.width.toString(), 'selection');
                            const legendSelectionIndex: number = this.getIndexofLegend(this.maps.legendSelectionCollection, legendShape);
                            this.maps.legendSelectionCollection[legendSelectionIndex]['MapShapeCollection']['Elements'].push(targetElement);
                        }
                        this.maps.shapeSelections = false;
                    }
                } else if (document.getElementsByClassName('highlightMapStyle').length > 0) {
                    this.removeShapeHighlightCollection();
                    removeClass(document.getElementsByClassName('highlightMapStyle')[0]);
                }
            }
        } else {
            this.removeShapeHighlightCollection();
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private isTargetSelected(target: any, collection: any[]): any {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let selectEle: any;
        for (let i: number = 0; i < collection.length; i++) {
            if (!isNullOrUndefined(target['LegendEle'].getAttribute('id')) &&
                (target['LegendEle'].getAttribute('id') === collection[i]['legendElement'].getAttribute('id'))) {
                selectEle = { IsSelected: true, SelectionIndex: i };
            }
        }
        return selectEle;
    }

    private updateLegendElement(): void {
        for (let i: number = 0; i < this.maps.legendSelectionCollection.length; i++) {
            if (document.getElementById(this.maps.legendSelectionCollection[i]['legendElement'].id)) {
                this.maps.legendSelectionCollection[i]['legendElement'] =
                    document.getElementById(this.maps.legendSelectionCollection[i]['legendElement'].id);
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getIndexofLegend(targetCollection: any[], targetElement: Element): number {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const legendIndex: number = targetCollection.map((e: any) => { return e['legendElement']; }).indexOf(targetElement);
        return legendIndex;
    }

    private removeAllSelections(): void {
        for (let i: number = 0; i < this.maps.selectedElementId.length; i++) {
            const selectedElement: Element = document.getElementById(this.maps.selectedElementId[i]);
            removeClass(selectedElement);
        }
        for (let j: number = 0; j < this.maps.selectedLegendElementId.length; j++) {
            const idIndex: string = this.maps.legendSettings.mode === 'Interactive' ?
                'container_Legend_Index_' : 'container_Legend_Shape_Index_';
            const selectedElement: string = idIndex + this.maps.selectedLegendElementId[j];
            const legendElement: Element = document.getElementById(selectedElement);
            if (!isNullOrUndefined(legendElement)) {
                removeClass(document.getElementById(selectedElement));
            }
        }
        this.maps.legendSelectionCollection = [];
        this.maps.selectedLegendElementId = [];
        this.maps.selectedElementId = [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public legendIndexOnShape(data: any, index: number): any {
        let legendIndex: number;
        let actualIndex: number;
        const path: string = this.maps.layers[index].shapeDataPath;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value: any = data[path];
        const legendType: string = this.maps.legendSettings.mode;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const collection: any[] = this.maps.legendModule.legendCollection;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let currentCollection: any[];
        if (legendType === 'Default' && !isNullOrUndefined(this.maps.legendModule.totalPages)) {
            currentCollection = this.maps.legendModule.totalPages[this.maps.legendModule.currentPage]['Collection'];
        }
        const currentCollectionLength: number = legendType === 'Default' ? currentCollection['length'] : 1;
        for (let i: number = 0; i < collection.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dataValue: any[] = collection[i]['data'];
            for (let k: number = 0; k < currentCollectionLength; k++) {
                if (legendType !== 'Default' || collection[i]['text'] === currentCollection[k]['DisplayText']) {
                    for (let j: number = 0; j < dataValue.length; j++) {
                        if (value === dataValue[j]['name']) {
                            legendIndex = k;
                        }
                    }
                }
            }
            for (let j: number = 0; j < dataValue.length; j++) {
                if (value === dataValue[j]['name']) {
                    actualIndex = i;
                }
            }

        }
        return { currentIndex: legendIndex, actualIndex: actualIndex };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private shapeDataOnLegend(targetElement: Element): any {
        let shapeIndex: number;
        let layerIndex: number;
        let dataIndex: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const collection: any[] = this.maps.legendModule.legendCollection;
        const legend: LegendSettingsModel = this.maps.legendSettings;
        for (let i: number = 0; i < collection.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any[] = collection[i]['data'];
            let process: boolean = false;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const elements: any[] = [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const currentElement: any = { Elements: [] };
            for (let j: number = 0; j < data.length; j++) {
                shapeIndex = data[j]['shapeIndex'];
                layerIndex = data[j]['layerIndex'];
                dataIndex = data[j]['dataIndex'];
                const shapeEle: Element = document.getElementById(this.maps.element.id + '_LayerIndex_' +
                    layerIndex + '_shapeIndex_' + shapeIndex + '_dataIndex_' + dataIndex);
                if (targetElement === shapeEle) {
                    process = true;
                }
                elements.push(shapeEle);
            }
            if (process) {
                if (isNullOrUndefined(currentElement['LegendEle'])) {
                    currentElement['LegendEle'] = legend.mode === 'Default' ?
                        document.getElementById(this.maps.element.id + '_Legend_Shape_Index_' + i) :
                        document.getElementById(this.maps.element.id + '_Legend_Index_' + i);
                }
                currentElement['Elements'] = elements;
                return currentElement;
            }
        }
        return null;
    }

    private shapesOfLegend(targetElement: Element): string[] {
        let shapeIndex: number;
        let layerIndex: number;
        let dataIndex: number;
        const idIndex: number = parseFloat(targetElement.id.charAt(targetElement.id.length - 1));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any[] = this.maps.legendModule.legendCollection[idIndex]['data'];
        const legendShapeElements: string[] = [];
        for (let i: number = 0; i < data.length; i++) {
            shapeIndex = data[i]['shapeIndex'];
            layerIndex = data[i]['layerIndex'];
            dataIndex = data[i]['dataIndex'];
            const shapeElement: Element = document.getElementById(this.maps.element.id + '_LayerIndex_' +
                layerIndex + '_shapeIndex_' + shapeIndex + '_dataIndex_' + dataIndex);
            if (!isNullOrUndefined(shapeElement)) {
                legendShapeElements.push(shapeElement.id);
            }
        }
        return legendShapeElements;
    }

    private legendToggle(): void {
        const map: Maps = this.maps;
        const legend: LegendSettingsModel = <LegendSettingsModel>map.legendSettings;
        if (this.maps.selectedLegendElementId) {
            // To maintain the state of legend selection during page resize.
            for (let j: number = 0; j < this.maps.selectedLegendElementId.length; j++) {
                const idIndex: string = legend.mode === 'Interactive' ? this.maps.element.id + '_Legend_Index_' : this.maps.element.id + '_Legend_Shape_Index_';
                const selectedElement: Element = map.svgObject.querySelector('#' + idIndex + this.maps.selectedLegendElementId[j]);
                if (!isNullOrUndefined(selectedElement)) {
                    const fill: string = !isNullOrUndefined(this.maps.legendSelectionClass.fill) ?
                        this.maps.legendSelectionClass.fill : selectedElement.getAttribute('fill');
                    this.setColor(
                        selectedElement, fill, this.maps.legendSelectionClass.opacity.toString(),
                        this.maps.legendSelectionClass.border.color, this.maps.legendSelectionClass.border.width.toString(), 'selection');
                    for (let i: number = 0; i < this.maps.legendSelectionCollection.length; i++) {
                        if (this.maps.legendSelectionCollection[i]['legendElement'].id === selectedElement.id) {
                            this.maps.legendSelectionCollection[i]['legendElement'] = selectedElement;
                        }
                    }
                    const legendSelectionIndex: number = this.getIndexofLegend(this.maps.legendSelectionCollection, selectedElement);
                    if (legendSelectionIndex === -1) {
                        const layerIndex: number = this.maps.legendModule.legendCollection[this.maps.selectedLegendElementId[j]]['data'][j]['layerIndex'];
                        this.pushCollection(
                            selectedElement, this.maps.legendSelectionCollection, this.maps.legendModule.legendCollection[this.maps.selectedLegendElementId[j]],
                            this.maps.layers[layerIndex].shapeSettings as ShapeSettings
                        );
                    }
                }
            }
        }
        if (this.maps.toggledLegendId) {
            for (let j: number = 0; j < this.maps.toggledLegendId.length; j++) {
                const legendTextId: string = legend.mode === 'Interactive' ? ('#' + this.maps.element.id + '_Legend_Index_' + this.maps.toggledLegendId[j] + '_Text') : ('#' + this.maps.element.id + '_Legend_Text_Index_' + this.maps.toggledLegendId[j]);
                const textElement: Element = map.svgObject.querySelector(legendTextId);
                if (!isNullOrUndefined(textElement)) {
                    textElement.setAttribute('fill', '#E5E5E5');
                }
                const legendShapeId: string = legend.mode === 'Interactive' ? ('#' + this.maps.element.id + '_Legend_Index_' + this.maps.toggledLegendId[j]) : ('#' + this.maps.element.id + '_Legend_Shape_Index_' + this.maps.toggledLegendId[j]);
                const legendElement: Element = map.svgObject.querySelector(legendShapeId);
                if (!isNullOrUndefined(legendElement)) {
                    legendElement.setAttribute('fill', '#E5E5E5');
                }
            }
        }
    }

    private renderLegendBorder(): void {
        const map: Maps = this.maps;
        const legend: LegendSettingsModel = <LegendSettingsModel>map.legendSettings;
        const legendTitle: string = legend.title.text;
        const textStyle: FontModel = legend.titleStyle;
        let textOptions: TextOption;
        const spacing: number = 10;
        const trimTitle: string = textTrim((this.legendItemRect.width + (spacing * 2)), legendTitle, textStyle);
        const textSize: Size = measureText(trimTitle, textStyle);
        this.legendBorderRect = new Rect(
            (this.legendItemRect.x - spacing),
            (this.legendItemRect.y - spacing - textSize.height),
            (this.legendItemRect.width) + (spacing * 2),
            (this.legendItemRect.height) + (spacing * 2) + textSize.height +
            (legend.mode === 'Interactive' ? 0 : (this.page !== 0) ? spacing : 0)
        );
        const legendBorder: BorderModel = {
            color: legend.border.color, width: legend.border.width, opacity: legend.border.opacity
        };
        legendBorder.opacity = isNullOrUndefined(legendBorder.opacity) ? 1 : legendBorder.opacity;
        const renderOptions: RectOption = new RectOption(
            map.element.id + '_Legend_Border', legend.background, legendBorder, 1,
            this.legendBorderRect, null, null, '', ''
        );
        this.legendGroup.appendChild(map.renderer.drawRectangle(renderOptions));
        this.getLegendAlignment(map, this.legendBorderRect.width, this.legendBorderRect.height, legend);
        this.legendGroup.setAttribute('transform', 'translate( ' + (this.translate.x + (-(this.legendBorderRect.x))) + ' ' +
            (this.translate.y + (-(this.legendBorderRect.y))) + ' )');
        map.svgObject.appendChild(this.legendGroup);
        if (legendTitle) {
            textStyle.color = (textStyle.color !== null) ? textStyle.color : this.maps.themeStyle.legendTitleFontColor;
            textOptions = new TextOption(
                map.element.id + '_LegendTitle',
                (this.legendItemRect.x) + (this.legendItemRect.width / 2),
                this.legendItemRect.y - (textSize.height / 2) - spacing / 2,
                'middle', trimTitle, '');
            renderTextElement(textOptions, textStyle, textStyle.color, this.legendGroup);
        }
    }

    public changeNextPage(e: PointerEvent): void {
        this.currentPage = ((<Element>e.target).id.indexOf('_Left_Page_') > -1) ? (this.currentPage - 1) :
            (this.currentPage + 1);
        this.legendGroup = this.maps.renderer.createGroup({ id: this.maps.element.id + '_Legend_Group' });
        this.drawLegendItem(this.currentPage);
        if (querySelector(this.maps.element.id + '_Legend_Border', this.maps.element.id)) {
            (<HTMLElement>querySelector(this.maps.element.id + '_Legend_Border', this.maps.element.id)).style.pointerEvents = 'none';
        }
    }

    private getLegendAlignment(map: Maps, width: number, height: number, legend: LegendSettingsModel): void {
        let x: number; let y: number;
        const spacing: number = 10;
        let totalRect: Rect;
        // eslint-disable-next-line prefer-const
        totalRect = extend({}, map.mapAreaRect, totalRect, true) as Rect;
        const areaX: number = totalRect.x;
        const areaY: number = totalRect.y;
        const areaHeight: number = totalRect.height;
        const areaWidth: number = totalRect.width;
        const totalWidth: number = map.availableSize.width;
        const totalHeight: number = map.availableSize.height;
        if (legend.position === 'Float') {
            this.translate = legend.location;
        } else {
            switch (legend.position) {
            case 'Top':
            case 'Bottom':
                totalRect.height = (areaHeight - height);
                x = (totalWidth / 2) - (width / 2);
                y = (legend.position === 'Top') ? areaY : (areaY + totalRect.height);
                totalRect.y = (legend.position === 'Top') ? areaY + height + spacing : areaY;
                break;
            case 'Left':
            case 'Right':
                totalRect.width = (areaWidth - width);
                x = (legend.position === 'Left') ? areaX : (areaX + totalRect.width) - spacing;
                y = (totalHeight / 2) - (height / 2);
                totalRect.x = (legend.position === 'Left') ? areaX + width : areaX;
                break;
            }
            switch (legend.alignment) {
            case 'Near':
                if (legend.position === 'Top' || legend.position === 'Bottom') {
                    x = totalRect.x;
                } else {
                    y = totalRect.y;
                }
                break;
            case 'Far':
                if (legend.position === 'Top' || legend.position === 'Bottom') {
                    x = (totalWidth - width) - spacing;
                } else {
                    y = totalHeight - height;
                }
                break;
            }
            if ((legend.height || legend.width) && legend.mode !== 'Interactive') {
                map.totalRect = totalRect;
            } else {
                if ((legend.height || legend.width) && legend.mode === 'Interactive')
                {
                    map.totalRect = totalRect;
                }
                map.mapAreaRect = totalRect;
            }
            this.translate = new Point(x, y);
        }
    }

    private getMarkersLegendCollections(layerIndex: number, markers: MarkerSettingsModel[]): void {
        Array.prototype.forEach.call(markers, (marker: MarkerSettings, markerIndex: number) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dataSource: any[] = marker.dataSource as any[];
            const field: string = marker.legendText;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let templateFn: any;
            let isDuplicate: boolean;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Array.prototype.forEach.call(dataSource, (data: any, dataIndex: number) => {
                let imageSrc: string = null;
                const showLegend: boolean = isNullOrUndefined(data[this.maps.legendSettings.showLegendPath]) ? true :
                    data[this.maps.legendSettings.showLegendPath];
                if (marker.visible && showLegend && (!isNullOrUndefined(data['latitude'])) && (!isNullOrUndefined(data['longitude']))) {
                    if (marker.template) {
                        templateFn = getTemplateFunction(marker.template);
                        const templateElement: Element = templateFn(this.maps);
                        const markerEle: Element = isNullOrUndefined(templateElement.childElementCount) ? templateElement[0] :
                            templateElement;
                        imageSrc = markerEle.querySelector('img').src;
                    }
                    const text: string = isNullOrUndefined(data[field]) ? '' : data[field];
                    const legendFill: string = !isNullOrUndefined(marker.colorValuePath) ? data[marker.colorValuePath] : marker.fill;
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const newData: any[] = [];
                    if (this.maps.legendSettings.removeDuplicateLegend) {
                        newData.push(this.getMarkerLegendData(layerIndex, text, legendFill));
                        this.getOverallLegendItemsCollection(text, legendFill, newData, showLegend);
                    } else {
                        newData.push({layerIndex : layerIndex, markerIndex: markerIndex, dataIndex: dataIndex, value: legendFill, name: text,
                            shape: !isNullOrUndefined(marker.shapeValuePath) ? data[marker.shapeValuePath] : marker.shape});
                        this.getOverallLegendItemsCollection(text, legendFill, newData, showLegend);
                    }
                    
                }
            });
        });
    }
    private getMarkerLegendData(layerIndex: number, text: string, legendFill: string): any[] {
        const legendData: any[] = [];
        this.maps.layers[layerIndex].markerSettings.map((markerSettings: MarkerSettings, markerIndex: number) => {
            const markerData: any[] = <any[]>markerSettings.dataSource;
            Array.prototype.forEach.call(markerData, (data: any, dataIndex: number) => {
                let marker: MarkerSettingsModel = this.maps.layers[layerIndex].markerSettings[markerIndex];
                if ((text === data[marker.legendText] || text === '') && legendFill == data[marker.colorValuePath]) {
                    legendData.push({layerIndex : layerIndex, markerIndex: markerIndex, dataIndex: dataIndex, value: legendFill, name: text,
                        shape: !isNullOrUndefined(marker.shapeValuePath) ? data[marker.shapeValuePath] : marker.shape});
                }
            })
        })
        return legendData;
    }

    private getRangeLegendCollection(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        layerIndex: number, layerData: any[], colorMapping: ColorMappingSettings[], dataSource: any[],
        dataPath: string, colorValuePath: string, propertyPath: string | string[]
    ): void {
        let legendText: string; let legendIndex: number = 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fill: string = this.maps.legendSettings.fill; let rangeData: any[] = [];
        for (const colorMap of colorMapping) {
            if (!isNullOrUndefined(colorMap.from) && !isNullOrUndefined(colorMap.to)) {
                legendText = !isNullOrUndefined(colorMap.label) ? colorMap.label : colorMap.from + ' - ' + colorMap.to;
                rangeData = [];
                let colorMapProcess: boolean = false;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                Array.prototype.forEach.call(dataSource, (data: any, dataIndex: number) => {
                    const colorValue: number = (colorValuePath.indexOf('.') > -1) ? Number(getValueFromObject(data, colorValuePath)) :
                        parseFloat(data[colorValuePath]);
                    if (colorValue >= colorMap.from && colorValue <= colorMap.to) {
                        colorMapProcess = true;
                        rangeData.push(this.getLegendData(layerIndex, dataIndex, data, dataPath, layerData, propertyPath, colorValue));
                    }
                });
                if (!colorMapProcess) {
                    rangeData.push({
                        layerIndex: layerIndex, shapeIndex: null, dataIndex: null,
                        name: null, value: null
                    });
                }
                const legendFill: string = (isNullOrUndefined(fill)) ? Object.prototype.toString.call(colorMap.color) === '[object Array]' ?
                    !isNullOrUndefined(colorMap.value) ? colorMap.color[0] : this.legendGradientColor(colorMap, legendIndex) :
                    <string>colorMap.color : fill;
                legendIndex++;
                this.getOverallLegendItemsCollection(legendText, legendFill, rangeData, colorMap.showLegend);
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getOverallLegendItemsCollection(legendText: string, legendFill: string, legendData: any[], showLegend: boolean): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newColllection: any[] = [];
        const legend: LegendSettingsModel = this.maps.legendSettings;
        if (legendData.length > 0 && showLegend) {
            for (let i: number = 0; i < legendData.length; i++) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const collection: any[] = <any[]>legendData[i];
                if (collection.length > 0) {
                    for (let j: number = 0; j < collection.length; j++) {
                        newColllection.push(collection[j]);
                    }
                } else {
                    newColllection.push(legendData[i]);
                }
                newColllection['_isVisible'] = true;
            }
            const isDuplicate: boolean = this.maps.legendSettings.removeDuplicateLegend ?
                this.removeDuplicates(this.legendCollection, legendText, legendFill) : false;
            if (!isDuplicate) {
                this.legendCollection.push({
                    text: legendText, fill: legendFill, data: newColllection, opacity: legend.opacity,
                    borderColor: legend.shapeBorder.color, borderWidth: legend.shapeBorder.width
                });
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private removeDuplicates(legendCollection: any[], text: string, legendFill: string): boolean {
        let isDuplicate: boolean = false;
        for (let i: number = 0; i < legendCollection.length; i++) {
            if ((legendCollection[i]['text'] === text || legendCollection[i]['text'] === '') && legendCollection[i]['fill'] === legendFill) {
                isDuplicate = true;
                break;
            } else {
                continue;
            }
        }
        return isDuplicate;
    }

    private getEqualLegendCollection(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        layerIndex: number, layerData: any[], colorMapping: ColorMappingSettings[], dataSource: any[],
        dataPath: string, colorValuePath: string, propertyPath: string | string[]
    ): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fill: string = this.maps.legendSettings.fill; const equalValues: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let legendText: string; let legendIndex: number = 0; let equalData: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const outOfRangeValues: any[] = []; const outOfRange: any[] = [];
        for (const colorMap of colorMapping) {
            if (!isNullOrUndefined(colorMap.value)) {
                legendText = !isNullOrUndefined(colorMap.label) ? colorMap.label : colorMap.value;
                equalData = [];
                let eqaulColorProcess: boolean = false;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                Array.prototype.forEach.call(dataSource, (data: any, dataIndex: number) => {
                    const equalValue: string = ((colorValuePath.indexOf('.') > -1) ? (getValueFromObject(data, colorValuePath)) :
                        (data[colorValuePath]));
                    if (equalValue === colorMap.value) {
                        eqaulColorProcess = true;
                        if (equalValues.indexOf(equalValue) === -1) {
                            equalValues.push(equalValue);
                        }
                        equalData.push(this.getLegendData(layerIndex, dataIndex, data, dataPath, layerData, propertyPath, equalValue));
                    } else {
                        if (outOfRangeValues.indexOf(equalValue) === -1) {
                            outOfRangeValues.push(equalValue);
                        }
                    }
                });
                for (let x: number = 0; x < equalValues.length; x++) {
                    for (let y: number = 0; y < outOfRangeValues.length; y++) {
                        if (equalValues[x] === outOfRangeValues[y]) {
                            const equalIndex: number = outOfRangeValues.indexOf(equalValues[x]);
                            outOfRangeValues.splice(equalIndex, 1);
                        }
                    }
                }
                if (!eqaulColorProcess) {
                    equalData.push({
                        layerIndex: layerIndex, shapeIndex: null, dataIndex: null,
                        name: null, value: null
                    });
                }
                const legendFill: string = (isNullOrUndefined(fill)) ? Object.prototype.toString.call(colorMap.color) === '[object Array]'
                    ? colorMap.color[0] : <string>colorMap.color : fill;
                legendIndex++;
                this.getOverallLegendItemsCollection(legendText, legendFill, equalData, colorMap.showLegend);
            } else if (isNullOrUndefined(colorMap.minOpacity) && isNullOrUndefined(colorMap.maxOpacity) && isNullOrUndefined(colorMap.value)
                && isNullOrUndefined(colorMap.from) && isNullOrUndefined(colorMap.to) && !isNullOrUndefined(colorMap.color)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                Array.prototype.forEach.call(dataSource, (data: any, dataIndex: number) => {
                    const equalValue: string = ((colorValuePath.indexOf('.') > -1) ? (getValueFromObject(data, colorValuePath)) :
                        (data[colorValuePath]));
                    for (let k: number = 0; k < outOfRangeValues.length; k++) {
                        if (equalValue === outOfRangeValues[k]) {
                            outOfRange.push(
                                this.getLegendData(layerIndex, dataIndex, data, dataPath, layerData, propertyPath, equalValue));
                        }
                    }
                });
                if (outOfRangeValues.length === 0) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    let range: boolean = false; const outRange: any[] = [];
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    Array.prototype.forEach.call(dataSource, (data: any, dataIndex: number) => {
                        range = false;
                        const rangeValue: number = data[colorValuePath];
                        for (let z: number = 0; z < colorMapping.length; z++) {
                            if (!isNullOrUndefined(rangeValue) && !isNaN(rangeValue)) {
                                if (rangeValue >= colorMapping[z].from && rangeValue <= colorMapping[z].to) {
                                    range = true;
                                }
                            } else if (!range) {
                                range = false;
                            }
                        }
                        if (!range) {
                            outOfRange.push(this.getLegendData(layerIndex, dataIndex, data, dataPath, layerData, propertyPath, rangeValue));
                        }
                    });
                }
                legendText = !isNullOrUndefined(colorMap.label) ? colorMap.label : 'Others';
                const outfill: string = ((Object.prototype.toString.call(colorMap.color) === '[object Array]'))
                    ? colorMap.color[0] : <string>colorMap.color;
                const legendOutFill: string = outfill;
                legendIndex++;
                this.getOverallLegendItemsCollection(legendText, legendOutFill, outOfRange, colorMap.showLegend);
            }
        }
    }

    private getDataLegendCollection(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        layerIndex: number, layerData: any[], colorMapping: ColorMappingSettings[], dataSource: any[],
        dataPath: string, colorValuePath: string, propertyPath: string | string[]
    ): void {
        let legendText: string;
        const fill: string = this.maps.legendSettings.fill;
        const valuePath: string = this.maps.legendSettings.valuePath;
        if (!isNullOrUndefined(colorValuePath) && !isNullOrUndefined(dataSource)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Array.prototype.forEach.call(dataSource, (data: any, dataIndex: number) => {
                const showLegend: boolean = isNullOrUndefined(this.maps.legendSettings.showLegendPath) ?
                    true : isNullOrUndefined(data[this.maps.legendSettings.showLegendPath]) ?
                        false : data[this.maps.legendSettings.showLegendPath];
                const dataValue: string = ((colorValuePath.indexOf('.') > -1) ? (getValueFromObject(data, colorValuePath)) :
                    (data[colorValuePath]));
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const newData: any[] = [];
                const legendFill: string = (isNullOrUndefined(fill)) ? dataValue : fill;
                if (!isNullOrUndefined(dataValue) && colorMapping.length === 0) {
                    legendText = !isNullOrUndefined(data[valuePath]) ? ((valuePath.indexOf('.') > -1) ?
                        getValueFromObject(data, valuePath) : data[valuePath]) : ((dataPath.indexOf('.') > -1) ?
                        getValueFromObject(data, dataPath) : data[dataPath]);
                    newData.push(this.getLegendData(layerIndex, dataIndex, data, dataPath, layerData, propertyPath, dataValue));
                }
                this.getOverallLegendItemsCollection(legendText, legendFill, newData, showLegend);
            });
        }
    }

    public interactiveHandler(e: PointerEvent): void {
        const target: Element = <Element>e.target;
        const legend: LegendSettingsModel = <LegendSettingsModel>this.maps.legendSettings;
        const id: string = this.maps.element.id + '_Interactive_Legend';
        const hoverId: string = legend.type === 'Layers' ? '_shapeIndex_' : (legend.type === 'Markers') ? '_MarkerIndex_' :
            '_BubbleIndex_';
        if (target.id.indexOf(hoverId) > 1) {
            const layerIndex: number = parseFloat(target.id.split('_LayerIndex_')[1].split('_')[0]);
            const dataIndex: number = parseFloat(target.id.split(/_dataIndex_/i)[1].split('_')[0]);
            let fill: string; let stroke: string; let strokeWidth: number;
            if (!(isNullOrUndefined(querySelector(id, this.maps.element.id)))) {
                remove(querySelector(id, this.maps.element.id));
            }
            const layer: LayerSettings = (<LayerSettings>this.maps.layersCollection[layerIndex]);
            const markerVisible: boolean = (legend.type === 'Layers' ? layer.visible :
                legend.type === 'Markers' ? layer.markerSettings[parseFloat(target.id.split('_MarkerIndex_')[1].split('_')[0])].visible :
                    (this.maps.getBubbleVisible(<LayerSettings>this.maps.layersCollection[layerIndex])));
            if (legend.visible && this.legendRenderingCollections.length > 0
                && legend.mode === 'Interactive' && markerVisible
            ) {
                const svgRect: ClientRect = this.maps.svgObject.getBoundingClientRect();
                for (let i: number = 0; i < this.legendCollection.length; i++) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const currentData: any = this.legendCollection[i];
                    const legendElement: Element = querySelector(this.maps.element.id + '_Legend_Index_' + i, this.maps.element.id);
                    const legendRect: ClientRect = <ClientRect>legendElement.getBoundingClientRect();
                    const rect: Rect = new Rect(
                        Math.abs(legendRect.left - svgRect.left), Math.abs(legendRect.top - svgRect.top),
                        legendRect.width, legendRect.height
                    );
                    fill = legendElement.getAttribute('fill');
                    stroke = legend.shapeBorder.color;
                    strokeWidth = legend.shapeBorder.width;
                    if (!isNullOrUndefined(currentData['data'])) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const data: any[] = <any[]>currentData['data'];
                        for (let j: number = 0; j < data.length; j++) {
                            if (dataIndex === data[j]['dataIndex'] && layerIndex === data[j]['layerIndex']) {
                                this.renderInteractivePointer(legend, fill, stroke, id, strokeWidth, rect);
                                break;
                            }
                        }
                    }
                }
            }
        } else {
            if (!(isNullOrUndefined(querySelector(id, this.maps.element.id)))) {
                remove(querySelector(id, this.maps.element.id));
            }
        }
    }

    private renderInteractivePointer(

        legend: LegendSettingsModel, fill: string, stroke: string, id: string, strokeWidth: number, rect: Rect
    ): void {
        let path: string;
        let locX: number; let locY: number;
        const height: number = 10; const width: number = 10;
        const direction: string = (legend.orientation === 'None') ? (legend.position === 'Top' || legend.position === 'Bottom')
            ? 'Horizontal' : 'Vertical' : legend.orientation;
        if (direction === 'Horizontal') {
            if (!legend.invertedPointer) {
                locX = rect.x + (rect.width / 2);
                locY = rect.y;
                path = ' M ' + locX + ' ' + locY + ' L ' + (locX - width) + ' ' + (locY - height) +
                    ' L ' + (locX + width) + ' ' + (locY - height) + ' Z ';
            } else {
                locX = rect.x + (rect.width / 2);
                locY = rect.y + (rect.height);
                path = ' M ' + locX + ' ' + locY + ' L ' + (locX - width) + ' ' + (locY + height) +
                    ' L ' + (locX + width) + ' ' + (locY + height) + ' Z ';
            }
        } else {
            if (!legend.invertedPointer) {
                locX = rect.x + (rect.width);
                locY = rect.y + (rect.height / 2);
                path = ' M ' + locX + ' ' + locY + ' L ' + (locX + width) + ' ' + (locY - height) +
                    ' L ' + (locX + width) + ' ' + (locY + height) + ' z ';
            } else {
                locX = rect.x;
                locY = rect.y + (rect.height / 2);
                path = ' M ' + locX + ' ' + locY + ' L ' + (locX - width) + ' ' + (locY - height) +
                    ' L ' + (locX - width) + ' ' + (locY + height) + ' z ';
            }
        }
        const pathOptions: PathOption = new PathOption(id, fill, strokeWidth, stroke, 1, 1, '', path);
        this.maps.svgObject.appendChild(this.maps.renderer.drawPath(pathOptions) as SVGPathElement);
    }

    public wireEvents(element: Element): void {
        EventHandler.add(element, Browser.touchStartEvent, this.changeNextPage, this);
    }

    public addEventListener(): void {
        if (this.maps.isDestroyed) {
            return;
        }
        this.maps.on(Browser.touchMoveEvent, this.interactiveHandler, this);
        this.maps.on(Browser.touchEndEvent, this.interactiveHandler, this);
        this.maps.on(click, this.legendClick, this);
    }

    private markerToggleSelection(mapElement: Element, layerIndex: number, markerIndex: number, legendIndex: number) {
        mapElement.setAttribute('fill', this.legendCollection[legendIndex]['fill']);
        mapElement.setAttribute('stroke', this.maps.layers[layerIndex].markerSettings[markerIndex].border.color);
        mapElement.setAttribute('fill-opacity', (this.maps.layers[layerIndex].markerSettings[markerIndex].opacity).toString());
        mapElement.setAttribute('stroke-width', (this.maps.layers[layerIndex].markerSettings[markerIndex].border.width).toString());
        mapElement.setAttribute('stroke-opacity', (isNullOrUndefined(this.maps.layers[layerIndex].markerSettings[markerIndex].border.opacity) ?
            this.maps.layers[layerIndex].markerSettings[markerIndex].opacity :
            this.maps.layers[layerIndex].markerSettings[markerIndex].border.opacity).toString());
    }

    private bubbleToggleSelection(mapElement: Element, layerIndex: number, bubbleIndex: number, legendIndex: number) {
        mapElement.setAttribute('fill', this.legendCollection[legendIndex]['fill']);
        mapElement.setAttribute('stroke', this.maps.layers[layerIndex].bubbleSettings[bubbleIndex].border.color);
        mapElement.setAttribute('fill-opacity', (this.maps.layers[layerIndex].bubbleSettings[bubbleIndex].opacity).toString());
        mapElement.setAttribute('stroke-width', (this.maps.layers[layerIndex].bubbleSettings[bubbleIndex].border.width).toString());
        mapElement.setAttribute('stroke-opacity', (isNullOrUndefined(this.maps.layers[layerIndex].bubbleSettings[bubbleIndex].border.opacity) ?
            this.maps.layers[layerIndex].bubbleSettings[bubbleIndex].opacity :
            this.maps.layers[layerIndex].bubbleSettings[bubbleIndex].border.opacity).toString());
    }

    private legendClick(targetEle: Element): void {
        let legendShapeId: Element;
        let legendTextId: Element;
        let legendTextColor: string;
        const legendToggleFill: string = this.maps.legendSettings.toggleLegendSettings.fill;
        const legendToggleOpacity: number = this.maps.legendSettings.toggleLegendSettings.opacity;
        const legendToggleBorderColor: string = this.maps.legendSettings.toggleLegendSettings.border.color;
        const legendToggleBorderWidth: number = this.maps.legendSettings.toggleLegendSettings.border.width;
        const legendToggleBorderOpacity: number = isNullOrUndefined(this.maps.legendSettings.toggleLegendSettings.border.opacity) ?
            this.maps.legendSettings.toggleLegendSettings.opacity : this.maps.legendSettings.toggleLegendSettings.border.opacity;
        if (targetEle.parentNode['id'].indexOf(this.maps.element.id + '_Legend_Index_') > -1) {
            let mapElement: Element;
            const legendIndex: number = parseFloat(targetEle.parentElement.id.substr((this.maps.element.id + '_Legend_Index_').length));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const selectedItem: any[] = this.legendCollection[legendIndex]['data'];
            let isVisible: boolean = selectedItem['_isVisible'];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let shape: any;
            if (this.maps.legendSettings.toggleLegendSettings.enable && (this.maps.legendSettings.type === 'Bubbles' || this.maps.legendSettings.type === 'Markers')) {
                for (let k: number = 0; k < this.maps.layers.length; k++) {
                    for (let j: number = 0; j < (this.maps.legendSettings.type === 'Bubbles' ? this.maps.layers[k].bubbleSettings.length : this.maps.layers[k].markerSettings.length); j++) {
                        for (let i: number = 0; i < selectedItem.length; i++) {
                            shape = this.legendCollection[legendIndex]['data'][i];
                            mapElement = this.maps.legendSettings.type === 'Bubbles' ? querySelector(this.maps.element.id + '_LayerIndex_' + shape['layerIndex'] +
                                '_BubbleIndex_' + j + '_dataIndex_' + shape['dataIndex'], this.maps.element.id) : querySelector(this.maps.element.id + '_LayerIndex_' + shape['layerIndex'] +
                                '_MarkerIndex_' + j + '_dataIndex_' + shape['dataIndex'], this.maps.element.id);
                            if (!isNullOrUndefined(shape['shape']) && shape['shape'] === 'Balloon') {
                                    mapElement = mapElement.children[0];
                            }
                            if (isVisible && mapElement !== null) {
                                if (this.maps.legendSettings.toggleLegendSettings.applyShapeSettings) {
                                    mapElement.setAttribute('fill', this.maps.layers[k].shapeSettings.fill);
                                    mapElement.setAttribute('stroke', this.maps.layers[k].shapeSettings.border.color);
                                    mapElement.setAttribute('fill-opacity', (this.maps.layers[k].shapeSettings.opacity).toString());
                                    mapElement.setAttribute('stroke-width', (this.maps.layers[k].shapeSettings.border.width).toString());
                                    mapElement.setAttribute('stroke-opacity', (isNullOrUndefined(this.maps.layers[k].shapeSettings.border.opacity) ?
                                        this.maps.layers[k].shapeSettings.opacity :
                                        this.maps.layers[k].shapeSettings.border.opacity).toString());
                                } else {
                                    mapElement.setAttribute('fill', legendToggleFill);
                                    mapElement.setAttribute('fill-opacity', (legendToggleOpacity).toString());
                                    mapElement.setAttribute('stroke', legendToggleBorderColor);
                                    mapElement.setAttribute('stroke-width', (legendToggleBorderWidth).toString());
                                    mapElement.setAttribute('stroke-opacity', (legendToggleBorderOpacity).toString());
                                }
                                if (targetEle !== null) {
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Shape_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute('fill', '#E5E5E5');
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Text_Index_' + legendIndex, this.maps.element.id);
                                    legendTextId.setAttribute('fill', '#E5E5E5');
                                }
                            } else {
                                if (this.maps.legendSettings.type === 'Markers') {
                                    this.markerToggleSelection(mapElement, k, j, legendIndex);
                                } else {
                                    this.bubbleToggleSelection(mapElement, k, j, legendIndex);
                                }
                                if (targetEle !== null) {
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Shape_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute('fill', this.legendCollection[legendIndex]['fill']);
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Text_Index_' + legendIndex, this.maps.element.id);
                                    legendTextId.setAttribute('fill', '#757575');
                                }
                            }
                        }
                        selectedItem['_isVisible'] = isVisible ? false : true;
                    }
                }
            }
            if (this.maps.legendSettings.type === 'Layers' && this.maps.legendSettings.toggleLegendSettings.enable) {
                let layerElement: Element;
                this.removeCollections(targetEle, legendIndex);
                const toggledLegendIdIndex: number = this.maps.toggledLegendId.indexOf(legendIndex);
                if (toggledLegendIdIndex !== -1) { isVisible = false; }
                for (let j: number = 0; j < this.maps.layers.length; j++) {
                    for (let i: number = 0; i < selectedItem.length; i++) {
                        shape = this.legendCollection[legendIndex]['data'][i];
                        layerElement = querySelector(this.maps.element.id + '_LayerIndex_' + shape['layerIndex'] +
                            '_shapeIndex_' + shape['shapeIndex'] + '_dataIndex_' + shape['dataIndex'], this.maps.element.id);
                        if (layerElement !== null) {
                            const toggledShapeIdIndex: number = this.maps.toggledShapeElementId.indexOf(layerElement.id);
                            if (isVisible) {
                                if (i === 0) {
                                    this.maps.toggledLegendId.push(legendIndex);
                                }
                                if (toggledShapeIdIndex === -1) {
                                    this.maps.toggledShapeElementId.push(layerElement.id);
                                }
                                if (this.maps.legendSettings.toggleLegendSettings.applyShapeSettings) {
                                    layerElement.setAttribute('fill', this.maps.layers[j].shapeSettings.fill);
                                    layerElement.setAttribute('fill-opacity', (this.maps.layers[j].shapeSettings.opacity).toString());
                                    layerElement.setAttribute('stroke', this.maps.layers[j].shapeSettings.border.color);
                                    layerElement.setAttribute('stroke-width', (this.maps.layers[j].shapeSettings.border.width).toString());
                                    layerElement.setAttribute('stroke-opacity', (isNullOrUndefined(this.maps.layers[j].shapeSettings.border.opacity) ?
                                        this.maps.layers[j].shapeSettings.opacity :
                                        this.maps.layers[j].shapeSettings.border.opacity).toString());
                                } else {
                                    layerElement.setAttribute('fill', legendToggleFill);
                                    layerElement.setAttribute('fill-opacity', (legendToggleOpacity).toString());
                                    layerElement.setAttribute('stroke', legendToggleBorderColor);
                                    layerElement.setAttribute('stroke-width', (legendToggleBorderWidth).toString());
                                    layerElement.setAttribute('stroke-opacity', (legendToggleBorderOpacity).toString());
                                }
                                if (targetEle !== null) {
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Text_Index_' + legendIndex, this.maps.element.id);
                                    legendTextId.setAttribute('fill', '#E5E5E5');
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Shape_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute('fill', '#E5E5E5');
                                }
                            } else {
                                if (toggledLegendIdIndex !== -1 && i === 0) {
                                    this.maps.toggledLegendId.splice(toggledLegendIdIndex, 1);
                                }
                                if (toggledShapeIdIndex !== -1) {
                                    this.maps.toggledShapeElementId.splice(toggledShapeIdIndex, 1);
                                }
                                layerElement.setAttribute('fill', this.legendCollection[legendIndex]['fill']);
                                layerElement.setAttribute('stroke-opacity', (isNullOrUndefined(this.maps.layers[j].shapeSettings.border.opacity) ?
                                    this.maps.layers[j].shapeSettings.opacity :
                                    this.maps.layers[j].shapeSettings.border.opacity).toString());
                                layerElement.setAttribute('stroke-width', (this.maps.layers[j].shapeSettings.border.width).toString());
                                layerElement.setAttribute('fill-opacity', (this.maps.layers[j].shapeSettings.opacity).toString());
                                layerElement.setAttribute('stroke', this.maps.layers[j].shapeSettings.border.color);
                                if (targetEle !== null) {
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Text_Index_' + legendIndex, this.maps.element.id);
                                    legendTextId.setAttribute('fill', '#757575');
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Shape_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute('fill', this.legendCollection[legendIndex]['fill']);
                                }
                            }
                        }
                    }
                }
                selectedItem['_isVisible'] = isVisible ? false : true;
            }
        } else if (!isNullOrUndefined(targetEle.id) && (targetEle.id.indexOf(this.maps.element.id + '_Legend_Shape_Index') > -1 ||
            targetEle.id.indexOf(this.maps.element.id + '_Legend_Index') !== -1) && this.maps.legendSettings.visible &&
            targetEle.id.indexOf('_Text') === -1) {
            let LegendInteractive: Element;
            const legendIndex: number = parseFloat(targetEle.id.substr((this.maps.element.id + '_Legend_Index_').length));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let mapdata: any;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const selectedItem: any[] = this.legendCollection[legendIndex]['data'];
            let isVisible: boolean = selectedItem['_isVisible'];
            if ((this.maps.legendSettings.type === 'Bubbles' || this.maps.legendSettings.type === 'Markers') && this.maps.legendSettings.toggleLegendSettings.enable) {
                for (let k: number = 0; k < this.maps.layers.length; k++) {
                    for (let j: number = 0; j < (this.maps.legendSettings.type === 'Bubbles' ? this.maps.layers[k].bubbleSettings.length : this.maps.layers[k].markerSettings.length); j++) {
                        for (let i: number = 0; i < selectedItem.length; i++) {
                            mapdata = this.legendCollection[legendIndex]['data'][i];
                            LegendInteractive = this.maps.legendSettings.type === 'Bubbles' ? querySelector(this.maps.element.id + '_LayerIndex_' + mapdata['layerIndex'] +
                                '_BubbleIndex_' + j + '_dataIndex_' + mapdata['dataIndex'], this.maps.element.id) : querySelector(this.maps.element.id + '_LayerIndex_' + mapdata['layerIndex'] +
                                '_MarkerIndex_' + j + '_dataIndex_' + mapdata['dataIndex'], this.maps.element.id);
                            if (!isNullOrUndefined(mapdata['shape']) && mapdata['shape'] === 'Balloon') {
                                LegendInteractive = LegendInteractive.children[0];
                            }
                            if (isVisible && LegendInteractive !== null) {

                                if (this.maps.legendSettings.toggleLegendSettings.applyShapeSettings) {
                                    LegendInteractive.setAttribute('fill', this.maps.layers[k].shapeSettings.fill);
                                    LegendInteractive.setAttribute('stroke', this.maps.layers[k].shapeSettings.border.color);
                                    LegendInteractive.setAttribute('stroke-width', (this.maps.layers[k].shapeSettings.border.width).toString());
                                    LegendInteractive.setAttribute('stroke-opacity', (isNullOrUndefined(this.maps.layers[k].shapeSettings.border.opacity) ?
                                        this.maps.layers[k].shapeSettings.opacity :
                                        this.maps.layers[k].shapeSettings.border.opacity).toString());
                                    LegendInteractive.setAttribute('fill-opacity', (this.maps.layers[k].shapeSettings.opacity).toString());
                                } else {
                                    LegendInteractive.setAttribute('fill', legendToggleFill);
                                    LegendInteractive.setAttribute('fill-opacity', (legendToggleOpacity).toString());
                                    LegendInteractive.setAttribute('stroke', legendToggleBorderColor);
                                    LegendInteractive.setAttribute('stroke-width', (legendToggleBorderWidth).toString());
                                    LegendInteractive.setAttribute('stroke-opacity', (legendToggleBorderOpacity).toString());
                                }
                                if (targetEle !== null) {
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex + '_Text', this.maps.element.id);
                                    legendTextId.setAttribute('fill', '#E5E5E5');
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute('fill', '#E5E5E5');
                                }
                            } else {
                                if (this.maps.legendSettings.type === 'Markers') {
                                    this.markerToggleSelection(LegendInteractive, k, j, legendIndex);
                                } else {
                                    this.bubbleToggleSelection(LegendInteractive, k, j, legendIndex);
                                }
                                if (targetEle !== null) {
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute('fill', this.legendCollection[legendIndex]['fill']);
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex + '_Text', this.maps.element.id);
                                    legendTextId.setAttribute('fill', '#757575');
                                }
                            }
                        }
                        selectedItem['_isVisible'] = isVisible ? false : true;
                    }
                }
            }
            if (this.maps.legendSettings.type === 'Layers' && this.maps.legendSettings.toggleLegendSettings.enable) {
                let mapLegendElement: Element;
                this.removeCollections(targetEle, legendIndex);
                const toggleLegendIdIndex: number = this.maps.toggledLegendId.indexOf(legendIndex);
                if (toggleLegendIdIndex !== -1) { isVisible = false; }
                for (let k: number = 0; k < this.maps.layers.length; k++) {
                    for (let i: number = 0; i < selectedItem.length; i++) {
                        mapdata = this.legendCollection[legendIndex]['data'][i];
                        mapLegendElement = querySelector(this.maps.element.id + '_LayerIndex_' + mapdata['layerIndex'] +
                            '_shapeIndex_' + mapdata['shapeIndex'] + '_dataIndex_' + mapdata['dataIndex'], this.maps.element.id);
                        if (mapLegendElement !== null) {
                            const toggledShapeIdIndex: number = this.maps.toggledShapeElementId.indexOf(mapLegendElement.id);
                            if (isVisible) {
                                if (i === 0) {
                                    this.maps.toggledLegendId.push(legendIndex);
                                }
                                if (toggledShapeIdIndex === -1) {
                                    this.maps.toggledShapeElementId.push(mapLegendElement.id);
                                }
                                if (this.maps.legendSettings.toggleLegendSettings.applyShapeSettings) {
                                    mapLegendElement.setAttribute('fill', this.maps.layers[0].shapeSettings.fill);
                                    mapLegendElement.setAttribute('stroke', this.maps.layers[0].shapeSettings.border.color);
                                    mapLegendElement.setAttribute('fill-opacity', (this.maps.layers[k].shapeSettings.opacity).toString());
                                    mapLegendElement.setAttribute('stroke-width', (this.maps.layers[k].shapeSettings.border.width).toString());
                                    mapLegendElement.setAttribute('stroke-opacity', (isNullOrUndefined(this.maps.layers[k].shapeSettings.border.opacity) ?
                                        this.maps.layers[k].shapeSettings.opacity :
                                        this.maps.layers[k].shapeSettings.border.opacity).toString());
                                } else {
                                    mapLegendElement.setAttribute('fill', legendToggleFill);
                                    mapLegendElement.setAttribute('fill-opacity', (legendToggleOpacity).toString());
                                    mapLegendElement.setAttribute('stroke', legendToggleBorderColor);
                                    mapLegendElement.setAttribute('stroke-width', (legendToggleBorderWidth).toString());
                                    mapLegendElement.setAttribute('stroke-opacity', (legendToggleBorderOpacity).toString());
                                }
                                if (targetEle !== null) {
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute('fill', '#E5E5E5');
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex + '_Text', this.maps.element.id);
                                    legendTextId.setAttribute('fill', '#E5E5E5');
                                }
                            } else {
                                if (toggleLegendIdIndex !== -1 && i === 0) {
                                    this.maps.toggledLegendId.splice(toggleLegendIdIndex, 1);
                                }
                                if (toggledShapeIdIndex !== -1) {
                                    this.maps.toggledShapeElementId.splice(toggledShapeIdIndex, 1);
                                }
                                mapLegendElement.setAttribute('fill-opacity', (this.maps.layers[k].shapeSettings.opacity).toString());
                                mapLegendElement.setAttribute('stroke-width', (this.maps.layers[k].shapeSettings.border.width).toString());
                                mapLegendElement.setAttribute('stroke', this.maps.layers[0].shapeSettings.border.color);
                                mapLegendElement.setAttribute('stroke-opacity', (isNullOrUndefined(this.maps.layers[k].shapeSettings.border.opacity) ?
                                    this.maps.layers[k].shapeSettings.opacity : this.maps.layers[k].shapeSettings.border.opacity).toString());
                                mapLegendElement.setAttribute('fill', this.legendCollection[legendIndex]['fill']);
                                if (targetEle !== null) {
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex + '_Text', this.maps.element.id);
                                    legendTextId.setAttribute('fill', '#757575');
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute('fill', this.legendCollection[legendIndex]['fill']);
                                }
                            }
                        }
                    }
                }
                selectedItem['_isVisible'] = isVisible ? false : true;
            }
        }
    }

    private removeCollections(targetEle: Element, legendIndex: number): void {
        this.removeLegendSelectionCollection(targetEle);
        const legendSelectionIndex: number = this.getIndexofLegend(this.maps.legendSelectionCollection, targetEle);
        if (legendSelectionIndex !== -1) {
            this.maps.legendSelectionCollection.splice(legendSelectionIndex, 1);
        }
        const legendHighlightIndex: number = this.getIndexofLegend(this.legendHighlightCollection, targetEle);
        if (legendHighlightIndex !== -1) {
            this.legendHighlightCollection.splice(legendSelectionIndex, 1);
        }
        const shapeHighlightIndex: number = this.getIndexofLegend(this.shapeHighlightCollection, targetEle);
        if (shapeHighlightIndex !== -1) {
            this.shapeHighlightCollection.splice(shapeHighlightIndex, 1);
        }
        const selectedIndex: number = this.maps.selectedLegendElementId.indexOf(legendIndex);
        if (selectedIndex !== -1) { this.maps.selectedLegendElementId.splice(selectedIndex, 1); }
    }

    public removeEventListener(): void {
        if (this.maps.isDestroyed) {
            return;
        }
        this.maps.off(Browser.touchMoveEvent, this.interactiveHandler);
        this.maps.off(Browser.touchEndEvent, this.interactiveHandler);
        this.maps.off(click, this.legendClick);
    }

    private getLegendData(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        layerIndex: number, dataIndex: number, data: any, dataPath: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        layerData: any[], shapePropertyPath: string | string[], value: string | number
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): any[] {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const legendData: any[] = [];
        if (Object.prototype.toString.call(layerData) === '[object Array]') {
            for (let i: number = 0; i < layerData.length; i++) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const shapeData: any = layerData[i];
                const dataPathValue: string = (dataPath.indexOf('.') > -1 ) ? getValueFromObject(data, dataPath) : data[dataPath];
                const shapePath: string = checkPropertyPath(data[dataPath], shapePropertyPath, shapeData['properties']);
                const dataPathValueCase : string | number = !isNullOrUndefined(dataPathValue)
                    ? dataPathValue.toLowerCase() : dataPathValue;
                const shapeDataValueCase : string = !isNullOrUndefined(shapeData['properties'][shapePath])
                && isNaN(shapeData['properties'][shapePath]) ? shapeData['properties'][shapePath].toLowerCase() : shapeData['properties'][shapePath];
                if (shapeDataValueCase === dataPathValueCase) {
                    legendData.push({
                        layerIndex: layerIndex, shapeIndex: i, dataIndex: dataIndex,
                        name: data[dataPath], value: value
                    });
                }
            }
        }
        return legendData;
    }

    public legendGradientColor(colorMap: ColorMappingSettings, legendIndex: number): string {
        let legendFillColor: string;
        const xmlns: string = 'http://www.w3.org/2000/svg';
        if (!isNullOrUndefined(colorMap.color) && typeof (colorMap.color) === 'object') {
            const linerGradientEle: Element = document.createElementNS(xmlns, 'linearGradient');
            const opacity: number = 1; const position: LegendPosition = this.maps.legendSettings.position;
            const x2: string = position === 'Top' || position === 'Bottom' ? '100' : '0';
            const y2: string = position === 'Top' || position === 'Bottom' ? '0' : '100';
            linerGradientEle.setAttribute('id', 'linear_' + legendIndex + '_' + this.maps.element.id);
            linerGradientEle.setAttribute('x1', 0 + '%');
            linerGradientEle.setAttribute('y1', 0 + '%');
            linerGradientEle.setAttribute('x2', x2 + '%');
            linerGradientEle.setAttribute('y2', y2 + '%');
            for (let b: number = 0; b < colorMap.color.length; b++) {
                const offsetColor: number = 100 / (colorMap.color.length - 1);
                const stopEle: Element = document.createElementNS(xmlns, 'stop');
                stopEle.setAttribute('offset', b * offsetColor + '%');
                stopEle.setAttribute('stop-color', colorMap.color[b]);
                stopEle.setAttribute('stop-opacity', opacity.toString());
                linerGradientEle.appendChild(stopEle);
            }
            this.legendLinearGradient = linerGradientEle;
            const color: string = 'url(' + '#linear_' + legendIndex + '_' + this.maps.element.id + ')';
            this.defsElement.appendChild(linerGradientEle);
            legendFillColor = color;
        }
        return legendFillColor;
    }


    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name
     */
    protected getModuleName(): string {
        return 'Legend';
    }

    /**
     * To destroy the legend.
     *
     * @param {Maps} maps - Specifies the instance of the maps
     * @returns {void}
     * @private
     */
    public destroy(maps: Maps): void {
        /**
         * Destroy method performed here
         */
        this.removeEventListener();
    }
}
