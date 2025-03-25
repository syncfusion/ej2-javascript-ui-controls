import { Maps } from '../../index';
import {
    LayerSettings, ColorMappingSettings, BorderModel, LegendPosition, FontModel, LegendSettingsModel,
    click, ILegendRenderingEventArgs, legendRendering,
    MarkerSettingsModel, MarkerSettings, LegendShape, LabelPosition, LabelIntersectAction
} from '../index';
import { LegendArrangement, LegendMode } from '../index';
import {
    Rect, measureText, PathOption, textTrim, drawBalloon,
    removeClass, querySelector, maintainStyleClass, getValueFromObject, getTemplateFunction
} from '../utils/helper';
import { RectOption, Size, TextOption, Point, renderTextElement, drawSymbol, checkPropertyPath, getElement } from '../utils/helper';
import { isNullOrUndefined, Browser, EventHandler, remove, extend } from '@syncfusion/ej2-base';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { LayerSettingsModel, HighlightSettingsModel, SelectionSettingsModel } from '../model/base-model';
import { ShapeSettings } from '../model/base';
import { Theme } from '../model/theme';
/**
 * Legend module is used to render legend for the maps
 */
export class Legend {
    /**
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public legendCollection: any[];
    /**
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public legendRenderingCollections: any[];
    private translate: Point;
    /**
     * @private
     */
    public legendBorderRect: Rect = new Rect(0, 0, 0, 0);
    /**
     * @private
     */
    public initialMapAreaRect: Rect = new Rect(0, 0, 0, 0);
    /**
     * @private
     */
    public legendTotalRect: Rect = new Rect(0, 0, 0, 0);
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
    private arrowTimer: number;
    /**
     * @private
     */
    public legendGroup: Element;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private shapeHighlightCollection: any[] = [];
    /**
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public legendHighlightCollection: any[] = [];
    /**
     * @private
     */
    public shapePreviousColor: string[] = [];
    /**
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public selectedNonLegendShapes: any[] = [];
    /**
     * @private
     */
    public shapeToggled: boolean = true;
    private legendLinearGradient: Element;
    private currentLayer: LayerSettings;
    private defsElement: Element;
    /**
     * @private
     */
    public legendElement: Element[] = null;
    /**
     * @private
     */
    public oldShapeElement: Element;
    constructor(maps: Maps) {
        this.maps = maps;
        this.addEventListener();
    }
    /**
     * To calculate legend bounds and draw the legend shape and text.
     *
     * @returns {void}
     * @private
     */
    public renderLegend(): void {
        this.legendRenderingCollections = [];
        this.legendCollection = [];
        this.totalPages = [];
        this.widthIncrement = 0;
        this.heightIncrement = 0;
        this.defsElement = this.maps.renderer.createDefs();
        this.maps.svgObject.appendChild(this.defsElement);
        this.initialMapAreaRect = this.maps.mapAreaRect;
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
                }
            }
            if (legend.type === 'Markers') {
                this.getMarkersLegendCollections(layerIndex, layer.markerSettings);
            }
        });
        if (this.legendCollection.length > 0) {
            for (let i: number = 0; i < this.legendCollection.length; i++) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const legendItem: any = this.legendCollection[i as number];
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
                    let legendText: string = this.legendCollection[i as number]['text'];
                    let itemTextSize: Size = new Size(0, 0);
                    if (labelAction === 'None') {
                        itemTextSize = measureText(legendText, itemTextStyle);
                    } else if (labelAction === 'Trim') {
                        legendText = textTrim((arrangement === 'Horizontal' ? rectWidth : rectHeight), legendText, itemTextStyle);
                        itemTextSize = measureText(legendText, itemTextStyle);
                    } else {
                        legendText = '';
                    }
                    if (legend.position === 'Left' || legend.position === 'Right' || legend.position === 'Float') {
                        for (let i: number = 0; i < this.legendCollection.length; i++) {
                            const legendItem: object = this.legendCollection[i as number];
                            const legendTextSize: Size = measureText(legendItem['text'], legend.textStyle);
                            this.textMaxWidth = Math.max(this.textMaxWidth, legendTextSize.width);
                        }
                    }
                    maxTextHeight = Math.max(maxTextHeight, itemTextSize.height);
                    maxTextWidth = Math.max(maxTextWidth, itemTextSize.width);
                    if (itemTextSize.width > 0 && itemTextSize.height > 0) {
                        if (arrangement === 'Horizontal') {
                            textX = startX + (rectWidth / 2);
                            textY = (position === 'After') ? (startY + rectHeight + (itemTextSize.height / 2)) + textPadding :
                                (startY - textPadding);
                        } else {
                            textX = (position === 'After') ? startX - (this.textMaxWidth / 2) - textPadding
                                : (startX + rectWidth + this.textMaxWidth / 2) + textPadding;
                            textY = startY + (rectHeight / 2) + (itemTextSize.height / 4);
                        }
                    }
                    if (i === 0) {
                        itemStartX = (arrangement === 'Horizontal') ? startX : (position === 'After') ?
                            textX - (this.textMaxWidth / 2) : startX;
                        itemStartY = (arrangement === 'Horizontal') ? (position === 'After') ? startY :
                            textY - (itemTextSize.height / 2) : startY;
                        if (this.legendCollection.length === 1) {
                            legendWidth = (arrangement === 'Horizontal') ? Math.abs((startX + rectWidth) - itemStartX) :
                                (rectWidth + this.textMaxWidth + textPadding);
                            legendHeight = (arrangement === 'Horizontal') ? (rectHeight + (maxTextHeight / 2) + textPadding) :
                                Math.abs((startY + rectHeight) - itemStartY);
                        }
                    } else if (i === this.legendCollection.length - 1) {
                        legendWidth = (arrangement === 'Horizontal') ? Math.abs((startX + rectWidth) - itemStartX) :
                            (rectWidth + this.textMaxWidth + textPadding);
                        legendHeight = (arrangement === 'Horizontal') ? (rectHeight + (maxTextHeight / 2) + textPadding) :
                            Math.abs((startY + rectHeight) - itemStartY);
                    }
                    this.legendRenderingCollections.push({
                        fill: this.legendCollection[i as number]['fill'], x: startX, y: startY,
                        width: rectWidth, height: rectHeight,
                        text: legendText, textX: textX, textY: textY,
                        textWidth: itemTextSize.width, textHeight: itemTextSize.height,
                        shapeBorder: this.legendCollection[i as number]['shapeBorder']
                    });
                }
                if (this.legendCollection.length === 1 ) {
                    legendHeight = maxTextHeight + textPadding;
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
                    const legendItem: any = this.legendCollection[i as number];
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
                                    textLocation = [];
                                    shapeLocation = [];
                                    this.getPageChanged();
                                    j = 0;
                                } else {
                                    shapeX = nextPositionX + (shapeWidth / 2);
                                    shapeY = (shapeLocation[0].y);
                                }
                            } else {
                                const padding: number = 10;
                                shapeX = shapeLocation[j - 1].x;
                                shapeY = prevPositionY + padding + (shapeHeight / 2);
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
                            x: shapeLocation[j as number].x - (shapeWidth / 2),
                            y: (shapeLocation[j as number].y - (shapeHeight / 2)) < (textY - legendTextSize.height) ?
                                (shapeLocation[j as number].y - (shapeHeight / 2)) : (textY - legendTextSize.height),
                            width: Math.abs((shapeLocation[j as number].x - (shapeWidth / 2)) - (textX + legendTextSize.width)),
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
     * @param {any[]} layerData - Specifies the layer data
     * @param {ColorMappingSettings[]} colorMapping - Specifies the color mapping
     * @param {any[]} dataSource - Specifies the data source
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
     *
     * @private
     */
    public drawLegend(): void {
        const map: Maps = this.maps;
        const legend: LegendSettingsModel = <LegendSettingsModel>map.legendSettings;
        const render: SvgRenderer = map.renderer;
        let textOptions: TextOption;
        const textFont: FontModel = {
            size: legend.textStyle.size,
            color: legend.textStyle.color,
            fontFamily: legend.textStyle.fontFamily,
            fontWeight: legend.textStyle.fontWeight,
            fontStyle: legend.textStyle.fontStyle,
            opacity: legend.textStyle.opacity
        };
        this.legendGroup = render.createGroup({ id: map.element.id + '_Legend_Group' });
        if (legend.mode === 'Interactive') {
            for (let i: number = 0; i < this.legendRenderingCollections.length; i++) {
                const itemId: string = map.element.id + '_Legend_Index_' + i;
                const textId: string = map.element.id + '_Legend_Index_' + i + '_Text';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const item: any = this.legendRenderingCollections[i as number];
                const bounds: Rect = new Rect(item['x'], item['y'], item['width'], item['height']);
                if (i === 0) {
                    this.renderLegendBorder();
                }
                const textLocation: Point = new Point(item['textX'], item['textY']);
                textFont.color = (textFont.color !== null) ? textFont.color : this.maps.themeStyle.legendTextColor;
                const rectOptions: RectOption = new RectOption(itemId, item['fill'], item['shapeBorder'], legend.opacity, bounds);
                textOptions = new TextOption(textId, textLocation.x, textLocation.y, 'middle', item['text'], '', '');
                textFont.fontFamily = !isNullOrUndefined(textFont.fontFamily) ? textFont.fontFamily : this.maps.themeStyle.fontFamily;
                textFont.size = textFont.size || map.themeStyle.legendFontSize;
                const textElement : Element = renderTextElement(textOptions, textFont, textFont.color, this.legendGroup);
                textElement.setAttribute('aria-label', item['text']);
                textElement.setAttribute('role', 'region');
                const rectElement: Element = render.drawRectangle(rectOptions);
                this.legendGroup.appendChild(rectElement);
                if (map.legendSettings.toggleLegendSettings.enable && (legend.type === 'Layers' || legend.type === 'Markers')) {
                    this.maintainLegendToggle(i, rectElement, textElement);
                }
                this.legendToggle();
            }
        } else {
            this.drawLegendItem(this.currentPage);
        }
    }
    /**
     * @param {number} page - Specifies the legend page.
     * @returns {void}
     * @private
     */
    public drawLegendItem(page: number): void {
        const map: Maps = this.maps;
        const legend: LegendSettingsModel = <LegendSettingsModel>map.legendSettings; const spacing: number = 10;
        const shapeSize: Size = new Size(legend.shapeWidth, legend.shapeHeight);
        let textOptions: TextOption;
        const render: SvgRenderer = map.renderer;
        let legendShape: LegendShape = legend.shape;
        if (page >= 0 && page < this.totalPages.length) {
            if (querySelector(this.legendGroup.id, this.maps.element.id)) {
                remove(querySelector(this.legendGroup.id, this.maps.element.id));
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            for (let i: number = 0; i < (<any[]>this.totalPages[page as number]['Collection']).length; i++) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const collection: any = <any[]>this.totalPages[page as number]['Collection'][i as number];
                const shapeBorder: BorderModel = collection['shapeBorder'];
                const legendElement: Element = render.createGroup({ id: map.element.id + '_Legend_Index_' + collection['idIndex'] });
                let legendText: string = collection['DisplayText'];
                const pagingArrowPadding: number = 4;
                const strokeColor: string = (legend.shape === 'HorizontalLine' || legend.shape === 'VerticalLine'
                    || legend.shape === 'Cross') ? isNullOrUndefined(legend.fill) ? '#000000' : legend.fill : shapeBorder.color;
                const strokeWidth: number = (legend.shape === 'HorizontalLine' || legend.shape === 'VerticalLine'
                    || legend.shape === 'Cross') ? (shapeBorder.width === 0) ?
                        1 : shapeBorder.width : shapeBorder.width;
                const shapeId: string = map.element.id + '_Legend_Shape_Index_' + collection['idIndex'];
                const textId: string = map.element.id + '_Legend_Text_Index_' + collection['idIndex'];
                const shapeLocation: Point = new Point(collection['Shape']['x'], (collection['Shape']['y'] - pagingArrowPadding));
                const textLocation: Point = new Point(collection['Text']['x'], (collection['Text']['y'] - pagingArrowPadding));
                const renderOptions: PathOption = new PathOption(
                    shapeId, collection['Fill'], strokeWidth, strokeColor, legend.opacity,
                    isNullOrUndefined(shapeBorder.opacity) ? legend.opacity : shapeBorder.opacity, ''
                );
                const legendTextStyle: FontModel = {
                    fontFamily: legend.textStyle.fontFamily, fontStyle: legend.textStyle.fontStyle,
                    fontWeight: legend.textStyle.fontWeight, size: legend.textStyle.size, color: legend.textStyle.color,
                    opacity: legend.textStyle.opacity
                };
                legendTextStyle.color = (legendTextStyle.color !== null) ? legendTextStyle.color :
                    this.maps.themeStyle.legendTextColor;
                legendTextStyle.fontFamily = !isNullOrUndefined(legendTextStyle.fontFamily) ? legendTextStyle.fontFamily :
                    this.maps.themeStyle.fontFamily;
                legendTextStyle.size = legendTextStyle.size || map.themeStyle.legendFontSize;
                legendTextStyle.fontWeight = legendTextStyle.fontWeight || map.themeStyle.fontWeight;
                if (i === 0) {
                    this.renderLegendBorder();
                }
                if (legend.type === 'Markers' && legend.useMarkerShape) {
                    const legendShapeData: object = this.legendCollection[collection['idIndex']].data[0];
                    const marker: MarkerSettingsModel = map.layers[legendShapeData['layerIndex']].markerSettings[legendShapeData['markerIndex']];
                    legendShape = !isNullOrUndefined(marker.dataSource[legendShapeData['dataIndex']][marker['shapeValuePath']]) && marker.dataSource[legendShapeData['dataIndex']][marker['shapeValuePath']] !== '' ? marker.dataSource[legendShapeData['dataIndex']][marker['shapeValuePath']] : marker.shape;
                }
                if (legendShape === 'Balloon') {
                    legendElement.appendChild(drawBalloon(map, renderOptions, shapeSize, { x: shapeLocation.x, y: (shapeLocation.y + 5)}, 'Legend'));
                }
                else {
                    legendElement.appendChild(drawSymbol(shapeLocation, legendShape, shapeSize, collection['ImageSrc'], renderOptions));
                }
                const legendRectSize : number = collection['Rect']['x'] + collection['Rect']['width'];
                if (legendRectSize > this.legendBorderRect.width) {
                    const trimmedText: string = this.legendTextTrim(this.legendBorderRect.width, legendText,
                                                                    legendTextStyle, legendRectSize);
                    legendText = trimmedText;
                }
                textOptions = new TextOption(textId, textLocation.x, textLocation.y, 'start', legendText, '', '');
                const textElement : Element = renderTextElement(textOptions, legendTextStyle, legendTextStyle.color, legendElement);
                textElement.setAttribute('aria-label', legendText);
                textElement.setAttribute('role', 'region');
                this.legendGroup.appendChild(legendElement);
                if (map.legendSettings.toggleLegendSettings.enable && (legend.type === 'Layers' || legend.type === 'Markers')) {
                    const legendShapeElement: Element = legendElement.childNodes[0] as Element;
                    this.maintainLegendToggle(collection['idIndex'], legendShapeElement, textElement);
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (i === ((<any[]>this.totalPages[page as number]['Collection']).length - 1)) {
                    let pagingGroup: Element; const width: number = spacing; const height: number = (spacing / 2);
                    if (this.page !== 0) {
                        const pagingText: string = (page + 1) + '/' + this.totalPages.length;
                        const pagingFont: FontModel = legend.textStyle;
                        const pagingTextSize: Size = measureText(pagingText, pagingFont);
                        const leftPageX: number = (this.legendItemRect.x + this.legendItemRect.width) - pagingTextSize.width -
                        (width * 2) - (spacing * 2) + (pagingArrowPadding / 2);
                        const rightPageX: number = (this.legendItemRect.x + this.legendItemRect.width);
                        const pageTextX: number = rightPageX - width - (pagingTextSize.width / 2) - (spacing / 2) - pagingArrowPadding;
                        const locY: number = (this.legendItemRect.y + this.legendItemRect.height) + (height / 2) + spacing;
                        pagingGroup = render.createGroup({ id: map.element.id + '_Legend_Paging_Group' });
                        const leftPageElement: Element = render.createGroup({ id: map.element.id + '_Legend_Left_Paging_Group' });
                        const rightPageElement: Element = render.createGroup({ id: map.element.id + '_Legend_Right_Paging_Group' });
                        const rightPath: string = ' M ' + rightPageX + ' ' + locY + ' L ' + (rightPageX - width) + ' ' + (locY - height) +
                            ' L ' + (rightPageX - width) + ' ' + (locY + height) + ' z ';
                        const leftPath: string = ' M ' + leftPageX + ' ' + locY + ' L ' + (leftPageX + width) + ' ' + (locY - height) +
                            ' L ' + (leftPageX + width) + ' ' + (locY + height) + ' z ';
                        const leftPageOptions: PathOption = new PathOption(
                            map.element.id + '_Left_Page', this.maps.themeStyle.legendTextColor, 0, this.maps.themeStyle.legendTextColor, ((page + 1) === 1 ? 0.5 : 1), 1, '', leftPath
                        );
                        leftPageElement.appendChild(render.drawPath(leftPageOptions));
                        const leftRectPageOptions: RectOption = new RectOption(
                            map.element.id + '_Left_Page_Rect', 'transparent', {}, 1,
                            new Rect(leftPageX - (width / 2), (locY - (height * 2)), width * 2, spacing * 2), null, null, '', ''
                        );
                        let pathEle: Element = render.drawRectangle(leftRectPageOptions);
                        pathEle.setAttribute('aria-label', 'Navigate to the previous legend items');
                        pathEle.setAttribute('role', 'button');
                        (pathEle as HTMLElement).tabIndex = (page + 1) === 1 ? -1 : map.tabIndex;
                        if ((page + 1) === 1) {
                            (pathEle as HTMLElement).style.cursor = 'default';
                            (pathEle as HTMLElement).style.setProperty('outline', 'none');
                        } else {
                            (pathEle as HTMLElement).style.cursor = 'pointer';
                            (pathEle as HTMLElement).style.removeProperty('outline');
                        }
                        leftPageElement.appendChild(pathEle);
                        this.wireEvents(leftPageElement);
                        const rightPageOptions: PathOption = new PathOption(
                            map.element.id + '_Right_Page', this.maps.themeStyle.legendTextColor, 0, this.maps.themeStyle.legendTextColor, ((page + 1) === this.totalPages.length ? 0.5 : 1), 1, '', rightPath
                        );
                        rightPageElement.appendChild(render.drawPath(rightPageOptions));
                        const rightRectPageOptions: RectOption = new RectOption(
                            map.element.id + '_Right_Page_Rect', 'transparent', {}, 1,
                            new Rect(rightPageX - spacing - (width / 2), (locY - (height * 2)), width * 2, spacing * 2), null, null, '', ''
                        );
                        pathEle = render.drawRectangle(rightRectPageOptions);
                        pathEle.setAttribute('aria-label', 'Navigate to the next legend items');
                        pathEle.setAttribute('role', 'button');
                        (pathEle as HTMLElement).tabIndex = (page + 1) === this.totalPages.length ? -1 : map.tabIndex;
                        if ((page + 1) === this.totalPages.length) {
                            (pathEle as HTMLElement).style.cursor = 'default';
                            (pathEle as HTMLElement).style.setProperty('outline', 'none');
                        } else {
                            (pathEle as HTMLElement).style.cursor = 'pointer';
                            (pathEle as HTMLElement).style.removeProperty('outline');
                        }
                        rightPageElement.appendChild(pathEle);
                        this.wireEvents(rightPageElement);
                        pagingGroup.appendChild(leftPageElement);
                        pagingGroup.appendChild(rightPageElement);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const pageTextOptions: any = {
                            'id': map.element.id + '_Paging_Text',
                            'x': pageTextX,
                            'y': locY + (pagingTextSize.height / 4),
                            'fill': this.maps.themeStyle.legendTextColor,
                            'font-size': '14px',
                            'font-style': pagingFont.fontStyle,
                            'font-family': pagingFont.fontFamily,
                            'font-weight': pagingFont.fontWeight,
                            'text-anchor': 'middle',
                            'transform': '',
                            'opacity': 1,
                            'dominant-baseline': ''
                        };
                        const pagingTextElement: HTMLElement = <HTMLElement>render.createText(pageTextOptions, pagingText);
                        pagingTextElement.style.cssText = 'user-select: none;';
                        pagingTextElement.setAttribute('aria-label', pagingText);
                        pagingTextElement.setAttribute('role', 'region');
                        pagingGroup.appendChild(pagingTextElement);
                        this.legendGroup.appendChild(pagingGroup);
                    }
                    this.legendToggle();
                }
            }
        }
    }
    /**
     * @param {number} legendIndex - Specifies the legend index.
     * @param {Element} legendShapeElement - Specifies the legend shape element.
     * @param {Element} legendTextElement - Specifies the legend text element.
     * @returns {void}
     * @private
     */
    public maintainLegendToggle(legendIndex: number, legendShapeElement: Element, legendTextElement: Element): void {
        if (this.maps.legendSettings.toggleLegendSettings.enable &&
            !isNullOrUndefined(this.maps.toggledLegendId) && this.maps.toggledLegendId.indexOf(legendIndex) > -1 &&
            !isNullOrUndefined(this.maps.toggledElementId) && this.maps.toggledElementId.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const currentItem: any[] = this.legendCollection[legendIndex as number]['data'];
            if (!this.maps.legendSettings.toggleLegendSettings.applyShapeSettings) {
                this.setToggleAttributes(legendTextElement, legendShapeElement, this.maps.legendSettings.toggleLegendSettings.fill,
                                         this.maps.legendSettings.toggleLegendSettings.opacity,
                                         this.maps.legendSettings.toggleLegendSettings.border.color,
                                         this.maps.legendSettings.toggleLegendSettings.border.width,
                                         isNullOrUndefined(this.maps.legendSettings.toggleLegendSettings.border.opacity) ?
                                             this.maps.legendSettings.toggleLegendSettings.opacity :
                                             this.maps.legendSettings.toggleLegendSettings.border.opacity,
                                         this.maps.legendSettings.toggleLegendSettings.fill);
            } else {
                const layerIndex: number = currentItem[currentItem.length - 1].layerIndex;
                this.setToggleAttributes(legendTextElement, legendShapeElement,
                                         this.maps.layers[layerIndex as number].shapeSettings.fill,
                                         this.maps.layers[layerIndex as number].shapeSettings.opacity,
                                         /* eslint-disable-next-line max-len */
                                         this.maps.layers[layerIndex as number].shapeSettings.border.color || this.maps.themeStyle.shapeBorderColor,
                                         isNullOrUndefined(this.maps.layers[layerIndex as number].shapeSettings.border.width)
                                             ? 0 : this.maps.layers[layerIndex as number].shapeSettings.border.width,
                                         isNullOrUndefined(this.maps.layers[layerIndex as number].shapeSettings.border.opacity)
                                             ? this.maps.layers[layerIndex as number].shapeSettings.opacity
                                             : this.maps.layers[layerIndex as number].shapeSettings.border.opacity,
                                         this.maps.layers[layerIndex as number].shapeSettings.fill);
            }
            currentItem['_isVisible'] = false;
        }
    }
    public legendHighLightAndSelection(targetElement: Element, value: string): void {
        let shapeIndex: number;
        let layerIndex: number;
        let dataIndex: number;
        let pointIndex: number;
        const legend: LegendSettingsModel = this.maps.legendSettings;
        const textEle: Element = legend.mode === 'Default' ? document.getElementById(targetElement.id.replace('Shape', 'Text')) :
            document.getElementById(targetElement.id + '_Text');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const collection: any[] = this.maps.legendModule.legendCollection;
        let length: number;
        const multiSelectEnable: boolean = !isNullOrUndefined(collection[0]['data'][0]['layerIndex']) ? this.maps.layers[collection[0]['data'][0]['layerIndex']].selectionSettings.enableMultiSelect : false;
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
                    if (targetElement === this.maps.legendSelectionCollection[k as number]['legendElement']) {
                        this.maps.legendSelectionCollection[k as number]['legendElement'] = targetElement;
                        interactProcess = false;
                        this.removeLegendSelectionCollection(this.maps.legendSelectionCollection[k as number]['legendElement']);

                        this.maps.selectedLegendElementId.splice(this.maps.selectedLegendElementId.indexOf(idIndex), 1);
                        this.maps.legendSelectionCollection.splice(k, 1);
                        this.maps.legendSelection = this.maps.legendSelectionCollection.length > 0 ? false : true;
                        break;
                    } else if (!multiSelectEnable) {
                        if (this.maps.legendSelectionCollection.length > 1) {
                            for (let z : number = 0; z < this.maps.legendSelectionCollection.length; z++) {
                                this.removeLegendSelectionCollection(this.maps.legendSelectionCollection[z as number]['legendElement']);
                            }
                            this.maps.legendSelectionCollection = [];
                        } else {
                            this.removeLegendSelectionCollection(this.maps.legendSelectionCollection[k as number]['legendElement']);
                            this.maps.legendSelectionCollection.splice(k, 1);
                        }
                    }
                }
            }
        } else {
            if (this.maps.legendSelectionCollection.length > 0) {
                for (let k: number = 0; k < this.maps.legendSelectionCollection.length; k++) {
                    if ((targetElement.id.indexOf('_Legend_Shape') > -1 || targetElement.id.indexOf('_Legend_Index')) &&
                        targetElement === this.maps.legendSelectionCollection[k as number]['legendElement']) {
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
                if (textEle.textContent === collection[i as number]['text'] && collection[i as number]['data'].length > 0
                && idIndex === i) {
                    const layer: LayerSettingsModel = this.maps.layers[collection[i as number]['data'][0]['layerIndex']];
                    let enable: boolean; let legendModule: HighlightSettingsModel | SelectionSettingsModel;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    let data: any[];
                    if (!isNullOrUndefined(layer)) {
                        enable = (value === 'selection') ? layer.selectionSettings.enable : layer.highlightSettings.enable;
                        legendModule = void 0;
                        legendModule = (value === 'selection') ? layer.selectionSettings : layer.highlightSettings;
                        data = collection[i as number]['data'];
                    }

                    if (enable) {
                        for (let j: number = 0; j < data.length; j++) {
                            let shapeElement: Element;
                            shapeIndex = data[j as number]['shapeIndex'];
                            layerIndex = data[j as number]['layerIndex'];
                            dataIndex = data[j as number]['dataIndex'];
                            pointIndex = data[j as number]['pointIndex'];
                            if (pointIndex === -1) {
                                shapeElement = document.getElementById(this.maps.element.id + '_LayerIndex_' +
                                layerIndex + '_shapeIndex_' + shapeIndex + '_dataIndex_' + dataIndex);
                            } else {
                                shapeElement = document.getElementById(this.maps.element.id + '_LayerIndex_' +
                                layerIndex + '_shapeIndex_' + shapeIndex + '_dataIndex_' + dataIndex + '_multiLine_' + pointIndex);
                            }
                            if (shapeElement !== null) {
                                let shapeMatch: boolean = true;
                                if (this.maps.legendSelectionCollection !== null) {
                                    for (let i: number = 0; i < this.maps.legendSelectionCollection.length; i++) {
                                        if (this.maps.legendSelectionCollection[i as number]['legendElement'] === targetElement) {
                                            shapeMatch = false;
                                            break;
                                        }
                                    }
                                }
                                if (value === 'highlight' && shapeMatch) {
                                    if (j === 0) {
                                        this.legendHighlightCollection = [];
                                        this.pushCollection(
                                            targetElement, this.legendHighlightCollection, collection[i as number],
                                            layer.shapeSettings as ShapeSettings);
                                    }
                                    length = this.legendHighlightCollection.length;
                                    const legendHighlightColor: string = this.legendHighlightCollection[length - 1]['legendOldFill'];
                                    this.legendHighlightCollection[length - 1]['MapShapeCollection']['Elements'].push(shapeElement);
                                    const shapeItemCount: number = this.legendHighlightCollection[length - 1]['MapShapeCollection']['Elements'].length - 1;
                                    const shapeOldFillColor: string = shapeElement.getAttribute('fill');
                                    const shapeOldOpacity: string = shapeElement.getAttribute('fill-opacity');
                                    this.legendHighlightCollection[length - 1]['shapeOldFillColor'].push(shapeOldFillColor);
                                    this.legendHighlightCollection[length - 1]['shapeOldOpacity'] = shapeOldOpacity;
                                    const shapeOldColor: string = this.legendHighlightCollection[length - 1]['shapeOldFillColor'][shapeItemCount as number];
                                    const shapeOldFillOpacity: string = this.legendHighlightCollection[length - 1]['shapeOldOpacity'];
                                    this.shapePreviousColor = this.legendHighlightCollection[length - 1]['shapeOldFillColor'];
                                    this.setColor(
                                        shapeElement, !isNullOrUndefined(legendModule.fill) ? legendModule.fill : shapeOldColor,
                                        isNullOrUndefined(legendModule.opacity) ? shapeOldFillOpacity : legendModule.opacity.toString(), legendModule.border.color, legendModule.border.width.toString(), 'highlight');
                                    this.setColor(
                                        targetElement, !isNullOrUndefined(legendModule.fill) ? legendModule.fill : legendHighlightColor,
                                        isNullOrUndefined(legendModule.opacity) ? shapeOldFillOpacity : legendModule.opacity.toString(), legendModule.border.color, legendModule.border.width.toString(), 'highlight');
                                } else if (value === 'selection') {
                                    this.legendHighlightCollection = [];
                                    this.maps.legendSelectionClass = legendModule;
                                    if (j === 0) {
                                        this.pushCollection(
                                            targetElement, this.maps.legendSelectionCollection, collection[i as number],
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
                                    this.maps.legendSelectionCollection[selectLength - 1]['MapShapeCollection']['Elements'].push(shapeElement);
                                    this.maps.legendSelectionCollection[selectLength - 1]['shapeOldFillColor'] = this.shapePreviousColor;
                                    this.setColor(
                                        targetElement, !isNullOrUndefined(legendModule.fill) ? legendModule.fill : legendSelectionColor,
                                        legendModule.opacity.toString(), legendModule.border.color, legendModule.border.width.toString(), 'selection');
                                    this.setColor(
                                        shapeElement, !isNullOrUndefined(legendModule.fill) ? legendModule.fill : legendSelectionColor,
                                        legendModule.opacity.toString(), legendModule.border.color, legendModule.border.width.toString(), 'selection');
                                    if (this.maps.selectedElementId.indexOf(shapeElement.getAttribute('id')) === - 1) {
                                        this.maps.selectedElementId.push(shapeElement.getAttribute('id'));
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
        const isLineStringShape: boolean = (element.parentElement.id.indexOf('LineString') > -1);
        if (type === 'selection') {
            maintainStyleClass((isLineStringShape ? 'LineselectionMap' : 'ShapeselectionMap'),
                               (isLineStringShape ? 'LineselectionMapStyle' : 'ShapeselectionMapStyle'),
                               (isLineStringShape ? 'transparent' : fill),
                               opacity, (isLineStringShape ? fill : borderColor), borderWidth, this.maps);
            element.setAttribute('class', isLineStringShape ? 'LineselectionMapStyle' : 'ShapeselectionMapStyle');
        } else {
            element.setAttribute('fill', isLineStringShape ? 'transparent' : fill);
            element.setAttribute('fill-opacity', opacity);
            element.setAttribute('stroke', isLineStringShape ? fill : borderColor);
            element.setAttribute('stroke-width', (Number(borderWidth) / this.maps.scale).toString());
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public pushCollection(targetElement: Element, collection: any[], oldElement: object, shapeSettings: ShapeSettings): void {
        collection.push({
            legendElement: targetElement, legendOldFill: oldElement['fill'], legendOldOpacity: oldElement['opacity'],
            legendOldBorderColor: oldElement['borderColor'], legendOldBorderWidth: oldElement['borderWidth'],
            shapeOpacity: shapeSettings.opacity, shapeOldBorderColor: shapeSettings.border.color || this.maps.themeStyle.shapeBorderColor,
            shapeOldBorderWidth: shapeSettings.border.width
        });
        const length: number = collection.length;
        collection[length - 1]['MapShapeCollection'] = { Elements: [] };
        collection[length - 1]['shapeOldFillColor'] = [];
        collection[length - 1]['shapeOldOpacity'] = null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private removeLegend(collection: any[]): void {
        for (let i: number = 0; i < collection.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const item: any = collection[i as number];
            this.setColor(
                item['legendElement'], item['legendOldFill'], item['legendOldOpacity'],
                item['legendOldBorderColor'], item['legendOldBorderWidth'], 'highlight');
            const dataCount: number = item['MapShapeCollection']['Elements'].length;
            for (let j: number = 0; j < dataCount; j++) {
                const shapeFillColor: string = item['legendOldFill'].indexOf('url') !== -1
                    ? item['shapeOldFillColor'][j as number] : item['legendOldFill'];
                const shapeOpacity: string = !isNullOrUndefined(item['shapeOldOpacity']) ? item['shapeOldOpacity'] : item['shapeOpacity'];
                this.setColor(
                    item['MapShapeCollection']['Elements'][j as number], shapeFillColor, shapeOpacity,
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
                const shapeElement: Element = getElement(shapeElements[j as number]);
                if (shapeElement.getAttribute('class') === 'ShapeselectionMapStyle' ||
                    shapeElement.getAttribute('class') === 'LineselectionMapStyle') {
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
                const item: any = this.shapeHighlightCollection[i as number];
                let removeFill: boolean = true;
                for (let j: number = 0; j < this.maps.legendSelectionCollection.length; j++) {
                    if (this.maps.legendSelectionCollection[j as number]['legendElement'] === item['legendElement']) {
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
        targetElement: Element, data: object, legendModule: SelectionSettingsModel | HighlightSettingsModel,
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
                && !this.maps.layers[layerIndex as number].selectionSettings.enableMultiSelect &&
                targetElement.getAttribute('class') !== 'ShapeselectionMapStyle') {
                this.maps.legendSelection = false;
            }
            if (getValue === 'selection' && !this.maps.layers[layerIndex as number].selectionSettings.enableMultiSelect &&
                !this.maps.legendSelection) {
                this.removeAllSelections();
                this.maps.legendSelection = true;
            }
            if (indexes['currentIndex'] === undefined) {
                if (getValue === 'selection' && indexes['actualIndex'] !== undefined) {
                    let checkSelection: number = 0;
                    for (let i: number = 0; i < shapeElement['Elements'].length; i++) {
                        if (shapeElement['Elements'][i as number].getAttribute('class') === 'ShapeselectionMapStyle') {
                            checkSelection++;
                        }
                    }
                    const selectionIndex: number = this.maps.selectedLegendElementId.indexOf(indexes['actualIndex']);
                    if (selectionIndex === -1) {
                        this.maps.selectedLegendElementId.push(indexes['actualIndex']);
                        this.maps.legendSelectionClass = <SelectionSettingsModel>legendModule;
                    } else {
                        if ((checkSelection <= 1) && (targetElement.getAttribute('class') === 'ShapeselectionMapStyle'
                            || targetElement.getAttribute('class') === 'LineselectionMapStyle')) {
                            if (!this.maps.layers[layerIndex as number].selectionSettings.enableMultiSelect) {
                                this.maps.selectedLegendElementId.splice(selectionIndex, 1);
                            } else {
                                if (checkSelection <= 1 && (targetElement.getAttribute('class') === 'ShapeselectionMapStyle'
                                    || targetElement.getAttribute('class') === 'LineselectionMapStyle')) {
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
                        if (this.maps.legendSelectionCollection[i as number]['legendElement'] === shapeElement['LegendEle']) {
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
                            this.maps.layers[layerIndex as number].shapeSettings as ShapeSettings
                        );
                    }
                    for (let j: number = 0; j < this.shapeHighlightCollection.length; j++) {
                        if (shapeElement['LegendEle'].id === this.shapeHighlightCollection[j as number]['legendElement'].id) {
                            this.shapeHighlightCollection[j as number]['legendElement'] = shapeElement['LegendEle'];
                        }
                    }
                    if (length > 0) {
                        for (let j: number = 0; j < length; j++) {
                            if (shapeElement['LegendEle'] === this.maps.legendSelectionCollection[j as number]['legendElement']) {
                                this.maps.legendSelectionCollection[j as number]['legendElement'] = shapeElement['LegendEle'];
                                this.removeShapeHighlightCollection();
                                break;
                            } else if (j === length - 1) {
                                this.removeShapeHighlightCollection();
                                this.setColor(
                                    legendShape, !isNullOrUndefined(legendModule.fill) ? legendModule.fill : legendShape.getAttribute('fill'),
                                    legendModule.opacity.toString(), legendModule.border.color, legendModule.border.width.toString(), 'highlight');
                            }
                        }
                    } else {
                        this.removeShapeHighlightCollection();
                        this.setColor(
                            legendShape, !isNullOrUndefined(legendModule.fill) ? legendModule.fill : legendShape.getAttribute('fill'),
                            !isNullOrUndefined(legendModule.opacity) ? legendModule.opacity.toString() : '1', legendModule.border.color, legendModule.border.width.toString(), 'highlight');
                    }
                } else if (getValue === 'selection') {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const selectionEle: any = this.isTargetSelected(shapeElement, this.maps.legendSelectionCollection);
                    if (length > 0) {
                        let j: number = 0;
                        while (j < this.maps.legendSelectionCollection.length) {
                            if (shapeElement['LegendEle'] !== this.maps.legendSelectionCollection[j as number]['legendElement'] &&
                                !(<SelectionSettingsModel>legendModule).enableMultiSelect) {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const element: any = this.maps.legendSelectionCollection[j as number];
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
                        selectionEle['IsSelected'] && (targetElement.getAttribute('class') === 'ShapeselectionMapStyle'
                            || targetElement.getAttribute('class') === 'LineselectionMapStyle'))) {
                        let multiSelection: number = 0;
                        if ((<SelectionSettingsModel>legendModule).enableMultiSelect) {
                            for (let i: number = 0; i < shapeElement['Elements'].length; i++) {
                                if (targetElement.getAttribute('class') === shapeElement['Elements'][i as number].getAttribute('class')) {
                                    multiSelection++;
                                }
                            }
                        }
                        if (multiSelection <= 1 && (!(<SelectionSettingsModel>legendModule).enableMultiSelect ?
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
                                    this.maps.layers[layerIndex as number].shapeSettings as ShapeSettings
                                );
                            }
                        }
                        let addId: boolean = true;
                        for (let i: number = 0; i < this.maps.selectedLegendElementId.length; i++) {
                            if (indexes['actualIndex'] === this.maps.selectedLegendElementId[i as number]) {
                                addId = false;
                            }
                        }
                        if (addId) {
                            this.maps.selectedLegendElementId.push(indexes['actualIndex']);
                        }
                        this.maps.legendSelectionClass = <SelectionSettingsModel>legendModule;
                        this.removeLegend(this.shapeHighlightCollection);
                        if (!isNullOrUndefined(legendShape)) {
                            this.setColor(
                                legendShape, !isNullOrUndefined(legendModule.fill) ? legendModule.fill : legendShape.getAttribute('fill'),
                                !isNullOrUndefined(legendModule.opacity) ? legendModule.opacity.toString() : '1', legendModule.border.color, legendModule.border.width.toString(), 'selection');
                            const legendSelectionIndex: number = this.getIndexofLegend(this.maps.legendSelectionCollection, legendShape);
                            this.maps.legendSelectionCollection[legendSelectionIndex as number]['MapShapeCollection']['Elements'].push(targetElement);
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
                (target['LegendEle'].getAttribute('id') === collection[i as number]['legendElement'].getAttribute('id'))) {
                selectEle = { IsSelected: true, SelectionIndex: i };
            }
        }
        return selectEle;
    }

    private updateLegendElement(): void {
        for (let i: number = 0; i < this.maps.legendSelectionCollection.length; i++) {
            if (document.getElementById(this.maps.legendSelectionCollection[i as number]['legendElement'].id)) {
                this.maps.legendSelectionCollection[i as number]['legendElement'] =
                    document.getElementById(this.maps.legendSelectionCollection[i as number]['legendElement'].id);
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
            const selectedElement: Element = document.getElementById(this.maps.selectedElementId[i as number]);
            removeClass(selectedElement);
        }
        for (let j: number = 0; j < this.maps.selectedLegendElementId.length; j++) {
            const idIndex: string = this.maps.legendSettings.mode === 'Interactive' ?
                this.maps.element.id + '_Legend_Index_' : this.maps.element.id + '_Legend_Shape_Index_';
            const selectedElement: string = idIndex + this.maps.selectedLegendElementId[j as number];
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
    public legendIndexOnShape(data: object, index: number): any {
        let legendIndex: number;
        let actualIndex: number;
        const path: string = this.maps.layers[index as number].shapeDataPath;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value: any = data[path as string];
        const legendType: string = this.maps.legendSettings.mode;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const collection: any[] = this.maps.legendModule.legendCollection;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let currentCollection: any[];
        if (legendType === 'Default' && !isNullOrUndefined(this.maps.legendModule.totalPages) && (this.maps.legendModule.totalPages.length > 0)) {
            currentCollection = this.maps.legendModule.totalPages[this.maps.legendModule.currentPage]['Collection'];
        }
        const currentCollectionLength: number = (legendType === 'Default' && !isNullOrUndefined(currentCollection)) ? currentCollection['length'] : 1;
        for (let i: number = 0; i < collection.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dataValue: any[] = collection[i as number]['data'];
            for (let k: number = 0; k < currentCollectionLength; k++) {
                if (legendType !== 'Default' || collection[i as number]['text'] === currentCollection[k as number]['DisplayText']) {
                    for (let j: number = 0; j < dataValue.length; j++) {
                        if (value === dataValue[j as number]['name']) {
                            legendIndex = k;
                        }
                    }
                }
            }
            for (let j: number = 0; j < dataValue.length; j++) {
                if (value === dataValue[j as number]['name']) {
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
        let pointIndex: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const collection: any[] = this.maps.legendModule.legendCollection;
        const legend: LegendSettingsModel = this.maps.legendSettings;
        for (let i: number = 0; i < collection.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any[] = collection[i as number]['data'];
            let process: boolean = false;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const elements: any[] = [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const currentElement: any = { Elements: [] };
            for (let j: number = 0; j < data.length; j++) {
                let shapeElement: Element;
                shapeIndex = data[j as number]['shapeIndex'];
                layerIndex = data[j as number]['layerIndex'];
                dataIndex = data[j as number]['dataIndex'];
                pointIndex = data[j as number]['pointIndex'];
                if (pointIndex === -1) {
                    shapeElement = document.getElementById(this.maps.element.id + '_LayerIndex_' +
                        layerIndex + '_shapeIndex_' + shapeIndex + '_dataIndex_' + dataIndex);
                } else {
                    shapeElement = document.getElementById(this.maps.element.id + '_LayerIndex_' +
                        layerIndex + '_shapeIndex_' + shapeIndex + '_dataIndex_' + dataIndex + '_multiLine_' + pointIndex);
                }
                if (targetElement === shapeElement) {
                    process = true;
                }
                elements.push(shapeElement);
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
        let pointIndex: number;
        const idIndex: number = parseFloat(targetElement.id.charAt(targetElement.id.length - 1));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any[] = this.maps.legendModule.legendCollection[idIndex as number]['data'];
        const legendShapeElements: string[] = [];
        for (let i: number = 0; i < data.length; i++) {
            let shapeElement: Element;
            shapeIndex = data[i as number]['shapeIndex'];
            layerIndex = data[i as number]['layerIndex'];
            dataIndex = data[i as number]['dataIndex'];
            pointIndex = data[i as number]['pointIndex'];
            if (pointIndex === -1) {
                shapeElement = document.getElementById(this.maps.element.id + '_LayerIndex_' +
                    layerIndex + '_shapeIndex_' + shapeIndex + '_dataIndex_' + dataIndex);
            } else {
                shapeElement = document.getElementById(this.maps.element.id + '_LayerIndex_' +
                    layerIndex + '_shapeIndex_' + shapeIndex + '_dataIndex_' + dataIndex + '_multiLine_' + pointIndex);
            }
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
                const selectedElement: Element = map.svgObject.querySelector('#' + idIndex + this.maps.selectedLegendElementId[j as number]);
                if (!isNullOrUndefined(selectedElement)) {
                    const fill: string = !isNullOrUndefined(this.maps.legendSelectionClass.fill) ?
                        this.maps.legendSelectionClass.fill : selectedElement.getAttribute('fill');
                    this.setColor(
                        selectedElement, fill, this.maps.legendSelectionClass.opacity.toString(),
                        this.maps.legendSelectionClass.border.color, this.maps.legendSelectionClass.border.width.toString(), 'selection');
                    for (let i: number = 0; i < this.maps.legendSelectionCollection.length; i++) {
                        if (this.maps.legendSelectionCollection[i as number]['legendElement'].id === selectedElement.id) {
                            this.maps.legendSelectionCollection[i as number]['legendElement'] = selectedElement;
                        }
                    }
                    const legendSelectionIndex: number = this.getIndexofLegend(this.maps.legendSelectionCollection, selectedElement);
                    if (legendSelectionIndex === -1) {
                        const layerIndex: number = this.maps.legendModule.legendCollection[this.maps.selectedLegendElementId[j as number]]['data'][j as number]['layerIndex'];
                        this.pushCollection(
                            selectedElement, this.maps.legendSelectionCollection,
                            this.maps.legendModule.legendCollection[this.maps.selectedLegendElementId[j as number]],
                            this.maps.layers[layerIndex as number].shapeSettings as ShapeSettings
                        );
                    }
                }
            }
        }
        if (this.maps.toggledLegendId) {
            for (let j: number = 0; j < this.maps.toggledLegendId.length; j++) {
                const legendTextId: string = legend.mode === 'Interactive' ? ('#' + this.maps.element.id + '_Legend_Index_' + this.maps.toggledLegendId[j as number] + '_Text') : ('#' + this.maps.element.id + '_Legend_Text_Index_' + this.maps.toggledLegendId[j as number]);
                const textElement: Element = map.svgObject.querySelector(legendTextId);
                if (!isNullOrUndefined(textElement)) {
                    textElement.setAttribute('fill', '#E5E5E5');
                }
                const legendShapeId: string = legend.mode === 'Interactive' ? ('#' + this.maps.element.id + '_Legend_Index_' + this.maps.toggledLegendId[j as number]) : ('#' + this.maps.element.id + '_Legend_Shape_Index_' + this.maps.toggledLegendId[j as number]);
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
        const textStyle: FontModel = {
            fontFamily: legend.titleStyle.fontFamily, fontStyle: legend.titleStyle.fontStyle,
            fontWeight: legend.titleStyle.fontWeight, size: legend.titleStyle.size, color: legend.titleStyle.color,
            opacity: legend.titleStyle.opacity
        };
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
            color: legend.border.color || this.maps.themeStyle.legendBorderColor, opacity: legend.border.opacity,
            width: legend.border.width || this.maps.themeStyle.legendBorderWidth
        };
        legendBorder.opacity = isNullOrUndefined(legendBorder.opacity) ? 1 : legendBorder.opacity;
        const renderOptions: RectOption = new RectOption(
            map.element.id + '_Legend_Border', legend.background, legendBorder, 1,
            this.legendBorderRect, null, null, '', ''
        );
        this.legendGroup.appendChild(map.renderer.drawRectangle(renderOptions));
        this.getLegendAlignment(map, this.legendBorderRect.width, this.legendBorderRect.height, legend);
        this.legendGroup.setAttribute('transform', 'translate( ' + (this.translate.x + (-this.legendBorderRect.x)) + ' ' +
            (this.translate.y + (-(this.legendBorderRect.y)) ) + ' )');
        if (legend.position !== 'Float') {
            map.svgObject.appendChild(this.legendGroup);
        }
        if (legendTitle) {
            textStyle.color = (textStyle.color !== null) ? textStyle.color : this.maps.themeStyle.legendTitleFontColor;
            textStyle.fontFamily = !isNullOrUndefined(textStyle.fontFamily) ? textStyle.fontFamily
                : this.maps.themeStyle.fontFamily;
            textStyle.size = !isNullOrUndefined(textStyle.size) ? textStyle.size
                : this.maps.themeStyle.subTitleFontSize || Theme.legendTitleFont.size;
            textStyle.fontWeight = !isNullOrUndefined(textStyle.fontWeight) ? textStyle.fontWeight
                : this.maps.themeStyle.titleFontWeight || Theme.legendTitleFont.fontWeight;
            textOptions = new TextOption(
                map.element.id + '_LegendTitle',
                (this.legendItemRect.x) + (this.legendItemRect.width / 2),
                this.legendItemRect.y - (textSize.height / 2) - spacing / 2,
                'middle', trimTitle, '');
            const element : Element = renderTextElement(textOptions, textStyle, textStyle.color, this.legendGroup);
            element.setAttribute('aria-label', legendTitle);
            element.setAttribute('role', 'region');
        }
    }

    public changeNextPage(e: PointerEvent): void {
        this.currentPage = ((<Element>e.target).id.indexOf('_Left_Page_') > -1) ? (this.currentPage - 1) :
            (this.currentPage + 1);
        this.legendGroup = this.maps.renderer.createGroup({ id: this.maps.element.id + '_Legend_Group' });
        this.maps.mapAreaRect = this.initialMapAreaRect;
        this.drawLegendItem(this.currentPage);
        if (!isNullOrUndefined(this.maps.legendModule) && this.maps.legendSettings.position === 'Float') {
            if (this.maps.isTileMap) {
                this.maps.mapLayerPanel.layerGroup.appendChild(this.maps.legendModule.legendGroup);
            }
            else {
                this.maps.svgObject.appendChild(this.maps.legendModule.legendGroup);
            }
        }
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
        const locationX: number = !isNullOrUndefined(legend.location.x) ? (typeof (legend.location.x) === 'string' &&
            (legend.location.x as string).indexOf('%') > -1 ? (map.availableSize.width / 100) * parseFloat(legend.location.x) :
            typeof (legend.location.x) === 'string' ? parseFloat(legend.location.x) : legend.location.x) : 0;
        const locationY: number = !isNullOrUndefined(legend.location.y) ? (typeof (legend.location.y) === 'string' &&
            (legend.location.y as string).indexOf('%') > -1 ? (map.availableSize.height / 100) * parseFloat(legend.location.y) :
            typeof (legend.location.y) === 'string' ? parseFloat(legend.location.y) : legend.location.y) : 0;
        if (legend.position === 'Float') {
            this.translate = map.isTileMap ? new Point(locationX, locationY + (spacing / 4)) :
                new Point(locationX + map.mapAreaRect.x, locationY + map.mapAreaRect.y);
            this.legendTotalRect = map.mapAreaRect;
        } else {
            switch (legend.position) {
            case 'Top':
            case 'Bottom':
                totalRect.height = (legend.position === 'Top') ? (areaHeight - height) : (areaHeight - height - (spacing * 2));
                x = (totalWidth / 2) - (width / 2);
                y = (legend.position === 'Top') ? areaY : (areaY + totalRect.height);
                totalRect.y = (legend.position === 'Top') ? areaY + height + (map.isTileMap ? (spacing / 2) : spacing) : areaY - (spacing / 2);
                break;
            case 'Left':
            case 'Right':
                totalRect.width = (areaWidth - width - map.mapAreaRect.x);
                x = (legend.position === 'Left') ? areaX + (spacing / 2) : (areaX + totalRect.width + spacing);
                y = (totalHeight / 2) - (height / 2);
                totalRect.x = (legend.position === 'Left') ? areaX + width + spacing : areaX;
                break;
            }
            switch (legend.alignment) {
            case 'Near':
                if (legend.position === 'Top' || legend.position === 'Bottom') {
                    x = totalRect.x - (legend.mode === 'Interactive' ? spacing : 0);
                }
                else {
                    y = totalRect.y - (!(legend.height && legend.width) && legend.mode === 'Interactive' ? map.mapAreaRect.x : 0);
                }
                break;
            case 'Far':
                if (legend.position === 'Top' || legend.position === 'Bottom') {
                    x = (totalWidth - width) - (legend.mode === 'Interactive' ? 0 : spacing);
                }
                else {
                    y = totalHeight - height - (legend.mode === 'Default' ? spacing : 0);
                }
                break;
            }
            if ((legend.height || legend.width) && legend.mode !== 'Interactive') {
                this.legendTotalRect = map.mapAreaRect = map.totalRect = totalRect;
            } else {
                map.totalRect = null;
                if ((legend.height || legend.width) && legend.mode === 'Interactive')
                {
                    map.totalRect = totalRect;
                }
                this.legendTotalRect = map.mapAreaRect = totalRect;
            }
            if (legend.position === 'Left') {
                map.mapAreaRect.width = totalRect.width;
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Array.prototype.forEach.call(dataSource, (data: any, dataIndex: number) => {
                let imageSrc: string = null;
                const showLegend: boolean = isNullOrUndefined(data[this.maps.legendSettings.showLegendPath]) ? true :
                    data[this.maps.legendSettings.showLegendPath];
                const latitude: boolean = !isNullOrUndefined(data['latitude']) || !isNullOrUndefined(data['Latitude']) || !isNullOrUndefined(data[marker.latitudeValuePath]);
                const longitude: boolean = !isNullOrUndefined(data['longitude']) || !isNullOrUndefined(data['Longitude']) || !isNullOrUndefined(data[marker.longitudeValuePath]);
                if (marker.visible && showLegend && latitude && longitude) {
                    if (marker.template) {
                        templateFn = getTemplateFunction(marker.template, this.maps);
                        const templateElement: Element = templateFn(this.maps);
                        const markerEle: Element = isNullOrUndefined(templateElement.childElementCount) ? templateElement[0] :
                            templateElement;
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        imageSrc = markerEle.querySelector('img').src;
                    }
                    const text: string = isNullOrUndefined(data[field as string]) ? '' : data[field as string];
                    const legendFill: string = !isNullOrUndefined(marker.colorValuePath) ? data[marker.colorValuePath] : marker.fill;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const newData: any[] = [];
                    if (this.maps.legendSettings.removeDuplicateLegend) {
                        newData.push(this.getMarkerLegendData(layerIndex, text, legendFill));
                        this.getOverallLegendItemsCollection(text, legendFill, newData, showLegend);
                    } else {
                        newData.push({layerIndex : layerIndex, markerIndex: markerIndex, dataIndex: dataIndex, value: legendFill,
                            name: text,
                            shape: (!isNullOrUndefined(marker.shapeValuePath) && !isNullOrUndefined(data[marker.shapeValuePath]) && data[marker.shapeValuePath] !== '') ? data[marker.shapeValuePath] : (this.maps.legendSettings.useMarkerShape ? marker.shape : this.maps.legendSettings.shape)});
                        this.getOverallLegendItemsCollection(text, legendFill, newData, showLegend);
                    }
                }
            });
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getMarkerLegendData(layerIndex: number, text: string, legendFill: string): any[] {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const legendData: any[] = [];
        this.maps.layers[layerIndex as number].markerSettings.map((markerSettings: MarkerSettings, markerIndex: number) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const markerData: any[] = <any[]>markerSettings.dataSource;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Array.prototype.forEach.call(markerData, (data: any, dataIndex: number) => {
                const marker: MarkerSettingsModel = this.maps.layers[layerIndex as number].markerSettings[markerIndex as number];
                if ((text === data[marker.legendText] || text === '') && legendFill === (data[marker.colorValuePath] || marker.fill)) {
                    legendData.push({layerIndex : layerIndex, markerIndex: markerIndex, dataIndex: dataIndex, value: legendFill, name: text,
                        shape: !isNullOrUndefined(marker.shapeValuePath) ? data[marker.shapeValuePath] : marker.shape});
                }
            });
        });
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
                if (!isNullOrUndefined(dataSource) && dataSource.length > 0) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    Array.prototype.forEach.call(dataSource, (data: any, dataIndex: number) => {
                        const colorValue: number = (colorValuePath.indexOf('.') > -1) ? Number(getValueFromObject(data, colorValuePath)) :
                            parseFloat(data[colorValuePath as string]);
                        if (colorValue >= colorMap.from && colorValue <= colorMap.to) {
                            colorMapProcess = true;
                            rangeData.push(this.getLegendData(layerIndex, dataIndex, data, dataPath, layerData, propertyPath, colorValue));
                        }
                    });
                }
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
                const collection: any[] = <any[]>legendData[i as number];
                if (collection.length > 0) {
                    for (let j: number = 0; j < collection.length; j++) {
                        newColllection.push(collection[j as number]);
                    }
                } else {
                    newColllection.push(legendData[i as number]);
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
            } else {
                for (let i: number = 0; i < this.legendCollection.length; i++) {
                    if (this.legendCollection[i as number]['text'] === legendText && this.legendCollection[i as number]['fill'] === legendFill) {
                        this.legendCollection[i as number].data.push(newColllection[0]);
                    }
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private removeDuplicates(legendCollection: any[], text: string, legendFill: string): boolean {
        let isDuplicate: boolean = false;
        for (let i: number = 0; i < legendCollection.length; i++) {
            if ((legendCollection[i as number]['text'] === text || legendCollection[i as number]['text'] === '') && legendCollection[i as number]['fill'] === legendFill) {
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
        let legendText: string; let equalData: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const outOfRangeValues: any[] = []; const outOfRange: any[] = [];
        for (const colorMap of colorMapping) {
            if (!isNullOrUndefined(colorMap.value)) {
                legendText = !isNullOrUndefined(colorMap.label) ? colorMap.label : colorMap.value;
                equalData = [];
                let eqaulColorProcess: boolean = false;
                if (!isNullOrUndefined(dataSource) && dataSource.length > 0) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    Array.prototype.forEach.call(dataSource, (data: any, dataIndex: number) => {
                        const equalValue: string = ((colorValuePath && colorValuePath.indexOf('.') > -1) ? (getValueFromObject(data, colorValuePath)) :
                            (data[colorValuePath as string]));
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
                }
                for (let x: number = 0; x < equalValues.length; x++) {
                    for (let y: number = 0; y < outOfRangeValues.length; y++) {
                        if (equalValues[x as number] === outOfRangeValues[y as number]) {
                            const equalIndex: number = outOfRangeValues.indexOf(equalValues[x as number]);
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
                this.getOverallLegendItemsCollection(legendText, legendFill, equalData, colorMap.showLegend);
            } else if (isNullOrUndefined(colorMap.minOpacity) && isNullOrUndefined(colorMap.maxOpacity) && isNullOrUndefined(colorMap.value)
                && isNullOrUndefined(colorMap.from) && isNullOrUndefined(colorMap.to) && !isNullOrUndefined(colorMap.color)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                Array.prototype.forEach.call(dataSource, (data: any, dataIndex: number) => {
                    const equalValue: string = ((colorValuePath.indexOf('.') > -1) ? (getValueFromObject(data, colorValuePath)) :
                        (data[colorValuePath as string]));
                    for (let k: number = 0; k < outOfRangeValues.length; k++) {
                        if (equalValue === outOfRangeValues[k as number]) {
                            outOfRange.push(
                                this.getLegendData(layerIndex, dataIndex, data, dataPath, layerData, propertyPath, equalValue));
                        }
                    }
                });
                if (outOfRangeValues.length === 0) {
                    let range: boolean = false;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    Array.prototype.forEach.call(dataSource, (data: any, dataIndex: number) => {
                        range = false;
                        const rangeValue: number = data[colorValuePath as string];
                        for (let z: number = 0; z < colorMapping.length; z++) {
                            if (!isNullOrUndefined(rangeValue) && !isNaN(rangeValue)) {
                                if (rangeValue >= colorMapping[z as number].from && rangeValue <= colorMapping[z as number].to) {
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
                    (data[colorValuePath as string]));
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const newData: any[] = [];
                const legendFill: string = (isNullOrUndefined(fill)) ? dataValue : fill;
                if (!isNullOrUndefined(dataValue) && colorMapping.length === 0 &&
                    (!isNullOrUndefined(valuePath) || !isNullOrUndefined(dataPath))) {
                    legendText = !isNullOrUndefined(data[valuePath as string]) ? ((valuePath.indexOf('.') > -1) ?
                        getValueFromObject(data, valuePath) : data[valuePath as string]) : ((dataPath.indexOf('.') > -1) ?
                        getValueFromObject(data, dataPath) : data[dataPath as string]);
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
            const layer: LayerSettings = (<LayerSettings>this.maps.layersCollection[layerIndex as number]);
            const markerVisible: boolean = (legend.type === 'Layers' ? layer.visible :
                legend.type === 'Markers' ? layer.markerSettings[parseFloat(target.id.split('_MarkerIndex_')[1].split('_')[0])].visible :
                    (this.maps.getBubbleVisible(<LayerSettings>this.maps.layersCollection[layerIndex as number])));
            if (legend.visible && this.legendRenderingCollections.length > 0
                && legend.mode === 'Interactive' && markerVisible
            ) {
                const svgRect: ClientRect = this.maps.svgObject.getBoundingClientRect();
                for (let i: number = 0; i < this.legendCollection.length; i++) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const currentData: any = this.legendCollection[i as number];
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
                            if (dataIndex === data[j as number]['dataIndex'] && layerIndex === data[j as number]['layerIndex']) {
                                this.renderInteractivePointer(legend, fill, stroke, id, strokeWidth, rect);
                                const arrowElement: Element = querySelector(id, this.maps.element.id);
                                if (this.maps.isDevice && !(isNullOrUndefined(arrowElement))) {
                                    clearTimeout(this.arrowTimer);
                                    this.arrowTimer = setTimeout(() => {
                                        if (!isNullOrUndefined(arrowElement.parentNode)) {
                                            remove(arrowElement);
                                        }
                                    }, 2000);
                                }
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
        rect.y = legend.position === 'Float' && this.maps.isTileMap ? rect.y - this.maps.mapAreaRect.y : rect.y;
        if (direction === 'Horizontal') {
            if (!legend.invertedPointer) {
                locX = rect.x + (rect.width / 2) - (legend.position === 'Float' && this.maps.isTileMap ? this.maps.mapAreaRect.x : 0);
                locY = rect.y;
                path = ' M ' + locX + ' ' + locY + ' L ' + (locX - width) + ' ' + (locY - height) +
                    ' L ' + (locX + width) + ' ' + (locY - height) + ' Z ';
            } else {
                locX = rect.x + (rect.width / 2) - (legend.position === 'Float' && this.maps.isTileMap ? this.maps.mapAreaRect.x : 0);
                locY = rect.y + (rect.height);
                path = ' M ' + locX + ' ' + locY + ' L ' + (locX - width) + ' ' + (locY + height) +
                    ' L ' + (locX + width) + ' ' + (locY + height) + ' Z ';
            }
        } else {
            if (!legend.invertedPointer) {
                locX = rect.x + rect.width - (legend.position === 'Float' && this.maps.isTileMap ? this.maps.mapAreaRect.x : 0);
                locY = rect.y + (rect.height / 2);
                path = ' M ' + locX + ' ' + locY + ' L ' + (locX + width) + ' ' + (locY - height) +
                    ' L ' + (locX + width) + ' ' + (locY + height) + ' z ';
            } else {
                locX = rect.x - (legend.position === 'Float' && this.maps.isTileMap ? this.maps.mapAreaRect.x : 0);
                locY = rect.y + (rect.height / 2);
                path = ' M ' + locX + ' ' + locY + ' L ' + (locX - width) + ' ' + (locY - height) +
                    ' L ' + (locX - width) + ' ' + (locY + height) + ' z ';
            }
        }
        const pathOptions: PathOption = new PathOption(id, fill, strokeWidth, stroke, 1, 1, '', path);
        if (legend.position === 'Float' && this.maps.isTileMap) {
            this.maps.mapLayerPanel.layerGroup.appendChild(this.maps.renderer.drawPath(pathOptions) as SVGPathElement);
        } else {
            this.maps.svgObject.appendChild(this.maps.renderer.drawPath(pathOptions) as SVGPathElement);
        }
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

    private markerToggleSelection(mapElement: Element, layerIndex: number, markerIndex: number, legendIndex: number): void {
        mapElement.setAttribute('fill', this.legendCollection[legendIndex as number]['fill']);
        mapElement.setAttribute('stroke', this.maps.layers[layerIndex as number].markerSettings[markerIndex as number].border.color);
        mapElement.setAttribute('fill-opacity', (this.maps.layers[layerIndex as number].markerSettings[markerIndex as number].opacity).toString());
        mapElement.setAttribute('stroke-width', (this.maps.layers[layerIndex as number].markerSettings[markerIndex as number].border.width).toString());
        mapElement.setAttribute('stroke-opacity', (isNullOrUndefined(this.maps.layers[layerIndex as number].markerSettings[markerIndex as number].border.opacity) ?
            this.maps.layers[layerIndex as number].markerSettings[markerIndex as number].opacity :
            this.maps.layers[layerIndex as number].markerSettings[markerIndex as number].border.opacity).toString());
        const indexToRemoveSelectedElement: number = this.maps.toggledElementId.indexOf(mapElement.id);
        if (indexToRemoveSelectedElement !== -1) {
            this.maps.toggledElementId.splice(indexToRemoveSelectedElement, 1);
        }
    }

    private bubbleToggleSelection(mapElement: Element, layerIndex: number, bubbleIndex: number, legendIndex: number): void {
        mapElement.setAttribute('fill', this.legendCollection[legendIndex as number]['fill']);
        mapElement.setAttribute('stroke', this.maps.layers[layerIndex as number].bubbleSettings[bubbleIndex as number].border.color);
        mapElement.setAttribute('fill-opacity', (this.maps.layers[layerIndex as number].bubbleSettings[bubbleIndex as number].opacity).toString());
        mapElement.setAttribute('stroke-width', (this.maps.layers[layerIndex as number].bubbleSettings[bubbleIndex as number].border.width).toString());
        mapElement.setAttribute('stroke-opacity', (isNullOrUndefined(this.maps.layers[layerIndex as number].bubbleSettings[bubbleIndex as number].border.opacity) ?
            this.maps.layers[layerIndex as number].bubbleSettings[bubbleIndex as number].opacity :
            this.maps.layers[layerIndex as number].bubbleSettings[bubbleIndex as number].border.opacity).toString());
    }

    private legendClick(targetEle: Element): void {
        let legendShapeId: Element;
        let legendTextId: Element;
        const legendToggleFill: string = this.maps.legendSettings.toggleLegendSettings.fill;
        const legendToggleOpacity: number = this.maps.legendSettings.toggleLegendSettings.opacity;
        const legendToggleBorderColor: string = this.maps.legendSettings.toggleLegendSettings.border.color;
        const legendToggleBorderWidth: number = this.maps.legendSettings.toggleLegendSettings.border.width;
        const legendToggleBorderOpacity: number = isNullOrUndefined(this.maps.legendSettings.toggleLegendSettings.border.opacity) ?
            this.maps.legendSettings.toggleLegendSettings.opacity : this.maps.legendSettings.toggleLegendSettings.border.opacity;
        if (!isNullOrUndefined(targetEle.parentNode) && targetEle.parentNode['id'].indexOf(this.maps.element.id + '_Legend_Index_') > -1) {
            let mapElement: Element;
            const legendIndex: number = parseFloat(targetEle.parentElement.id.substr((this.maps.element.id + '_Legend_Index_').length));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const selectedItem: any[] = this.legendCollection[legendIndex as number]['data'];
            let isVisible: boolean = selectedItem['_isVisible'];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let shape: any;
            if (this.maps.legendSettings.toggleLegendSettings.enable && (this.maps.legendSettings.type === 'Bubbles' || this.maps.legendSettings.type === 'Markers')) {
                for (let k: number = 0; k < this.maps.layers.length; k++) {
                    for (let j: number = 0; j < (this.maps.legendSettings.type === 'Bubbles' ? this.maps.layers[k as number].bubbleSettings.length : this.maps.layers[k as number].markerSettings.length); j++) {
                        for (let i: number = 0; i < selectedItem.length; i++) {
                            shape = this.legendCollection[legendIndex as number]['data'][i as number];
                            mapElement = this.maps.legendSettings.type === 'Bubbles' ? querySelector(this.maps.element.id + '_LayerIndex_' + shape['layerIndex'] +
                                '_BubbleIndex_' + j + '_dataIndex_' + shape['dataIndex'], this.maps.element.id) : querySelector(this.maps.element.id + '_LayerIndex_' + shape['layerIndex'] +
                                '_MarkerIndex_' + shape['markerIndex'] + '_dataIndex_' + shape['dataIndex'], this.maps.element.id);
                            if (!isNullOrUndefined(shape['shape']) && shape['shape'] === 'Balloon') {
                                mapElement = this.maps.legendSettings.type === 'Bubbles' ? querySelector(this.maps.element.id + '_LayerIndex_' + shape['layerIndex'] +
                                '_BubbleIndex_' + j + '_dataIndex_' + shape['dataIndex'] + '_Group', this.maps.element.id) : querySelector(this.maps.element.id + '_LayerIndex_' + shape['layerIndex'] +
                                '_MarkerIndex_' + shape['markerIndex'] + '_dataIndex_' + shape['dataIndex'] + '_Group', this.maps.element.id);
                                mapElement = mapElement.children[0];
                            }
                            const toggledLegendIdIndex: number = this.maps.toggledLegendId.indexOf(legendIndex);
                            if (isVisible && mapElement !== null) {
                                if (this.maps.legendSettings.toggleLegendSettings.applyShapeSettings) {
                                    mapElement.setAttribute('fill', this.maps.layers[k as number].shapeSettings.fill);
                                    mapElement.setAttribute('stroke', this.maps.layers[k as number].shapeSettings.border.color || this.maps.themeStyle.shapeBorderColor);
                                    mapElement.setAttribute('fill-opacity', (this.maps.layers[k as number].shapeSettings.opacity).toString());
                                    mapElement.setAttribute('stroke-width', (isNullOrUndefined(this.maps.layers[k as number].shapeSettings.border.width) ? 0 : this.maps.layers[k as number].shapeSettings.border.width).toString());
                                    mapElement.setAttribute('stroke-opacity', (isNullOrUndefined(this.maps.layers[k as number].shapeSettings.border.opacity) ?
                                        this.maps.layers[k as number].shapeSettings.opacity :
                                        this.maps.layers[k as number].shapeSettings.border.opacity).toString());
                                } else {
                                    mapElement.setAttribute('fill', legendToggleFill);
                                    mapElement.setAttribute('fill-opacity', (legendToggleOpacity).toString());
                                    mapElement.setAttribute('stroke', legendToggleBorderColor);
                                    mapElement.setAttribute('stroke-width', (legendToggleBorderWidth).toString());
                                    mapElement.setAttribute('stroke-opacity', (legendToggleBorderOpacity).toString());
                                }
                                if (this.maps.legendSettings.type === 'Markers') {
                                    if (toggledLegendIdIndex === -1) {
                                        this.maps.toggledLegendId.push(legendIndex);
                                    }
                                    const index: number = this.maps.toggledElementId.indexOf(mapElement.id);
                                    if (index === -1) {
                                        this.maps.toggledElementId.push(mapElement.id);
                                    }
                                }
                                if (targetEle !== null) {
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Shape_Index_' + legendIndex, this.maps.element.id);
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Text_Index_' + legendIndex, this.maps.element.id);
                                    if (!this.maps.legendSettings.toggleLegendSettings.applyShapeSettings) {
                                        this.setToggleAttributes(legendTextId, legendShapeId, legendToggleFill,
                                                                 legendToggleOpacity, legendToggleBorderColor, legendToggleBorderWidth,
                                                                 legendToggleBorderOpacity, legendToggleFill);
                                    } else {
                                        this.setToggleAttributes(legendTextId, legendShapeId,
                                                                 this.maps.layers[k as number].shapeSettings.fill,
                                                                 this.maps.layers[k as number].shapeSettings.opacity,
                                                                 /* eslint-disable-next-line max-len */
                                                                 this.maps.layers[k as number].shapeSettings.border.color || this.maps.themeStyle.shapeBorderColor,
                                                                 isNullOrUndefined(this.maps.layers[k as number].shapeSettings.border.width)
                                                                     ? 0 : this.maps.layers[k as number].shapeSettings.border.width,
                                                                 /* eslint-disable-next-line max-len */
                                                                 isNullOrUndefined(this.maps.layers[k as number].shapeSettings.border.opacity)
                                                                     ? this.maps.layers[k as number].shapeSettings.opacity
                                                                     : this.maps.layers[k as number].shapeSettings.border.opacity,
                                                                 this.maps.layers[k as number].shapeSettings.fill);
                                    }
                                }
                            } else {
                                if (this.maps.legendSettings.type === 'Markers') {
                                    if (toggledLegendIdIndex !== -1 && i === 0) {
                                        this.maps.toggledLegendId.splice(toggledLegendIdIndex, 1);
                                    }
                                    this.markerToggleSelection(mapElement, k, j, legendIndex);
                                } else {
                                    this.bubbleToggleSelection(mapElement, k, j, legendIndex);
                                }
                                if (targetEle !== null) {
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Shape_Index_' + legendIndex, this.maps.element.id);
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Text_Index_' + legendIndex, this.maps.element.id);
                                    this.setToggleAttributes(legendTextId, legendShapeId, this.legendCollection[legendIndex as number]['fill'], this.legendCollection[legendIndex as number]['opacity'],
                                                             this.legendCollection[legendIndex as number]['shapeBorder']['color'], this.legendCollection[legendIndex as number]['shapeBorder']['width'],
                                                             this.legendCollection[legendIndex as number]['shapeBorder']['opacity'], this.maps.legendSettings.textStyle.color);
                                    if (this.maps.legendSettings.shape === 'HorizontalLine' || this.maps.legendSettings.shape === 'VerticalLine' || this.maps.legendSettings.shape === 'Cross') {
                                        legendShapeId.setAttribute('stroke', this.legendCollection[legendIndex as number]['fill']);
                                    }
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
                        shape = this.legendCollection[legendIndex as number]['data'][i as number];
                        layerElement = querySelector(this.maps.element.id + '_LayerIndex_' + shape['layerIndex'] +
                            '_shapeIndex_' + shape['shapeIndex'] + '_dataIndex_' + shape['dataIndex'], this.maps.element.id);
                        if (layerElement !== null) {
                            const toggledShapeIdIndex: number = this.maps.toggledElementId.indexOf(layerElement.id);
                            if (isVisible) {
                                if (i === 0) {
                                    this.maps.toggledLegendId.push(legendIndex);
                                }
                                if (toggledShapeIdIndex === -1) {
                                    this.maps.toggledElementId.push(layerElement.id);
                                }
                                if (this.maps.legendSettings.toggleLegendSettings.applyShapeSettings) {
                                    layerElement.setAttribute('fill', this.maps.layers[j as number].shapeSettings.fill);
                                    layerElement.setAttribute('fill-opacity', (this.maps.layers[j as number].shapeSettings.opacity).toString());
                                    layerElement.setAttribute('stroke', this.maps.layers[j as number].shapeSettings.border.color || this.maps.themeStyle.shapeBorderColor);
                                    layerElement.setAttribute('stroke-width', (isNullOrUndefined(this.maps.layers[j as number].shapeSettings.border.width) ? 0 : this.maps.layers[j as number].shapeSettings.border.width).toString());
                                    layerElement.setAttribute('stroke-opacity', (isNullOrUndefined(this.maps.layers[j as number].shapeSettings.border.opacity) ?
                                        this.maps.layers[j as number].shapeSettings.opacity :
                                        this.maps.layers[j as number].shapeSettings.border.opacity).toString());
                                } else {
                                    layerElement.setAttribute('fill', legendToggleFill);
                                    layerElement.setAttribute('fill-opacity', (legendToggleOpacity).toString());
                                    layerElement.setAttribute('stroke', legendToggleBorderColor);
                                    layerElement.setAttribute('stroke-width', (legendToggleBorderWidth).toString());
                                    layerElement.setAttribute('stroke-opacity', (legendToggleBorderOpacity).toString());
                                }
                                if (targetEle !== null) {
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Text_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Shape_Index_' + legendIndex, this.maps.element.id);
                                    if (!this.maps.legendSettings.toggleLegendSettings.applyShapeSettings) {
                                        this.setToggleAttributes(legendTextId, legendShapeId, legendToggleFill, legendToggleOpacity,
                                                                 legendToggleBorderColor, legendToggleBorderWidth,
                                                                 legendToggleBorderOpacity, legendToggleFill);
                                    } else {
                                        this.setToggleAttributes(legendTextId, legendShapeId,
                                                                 this.maps.layers[j as number].shapeSettings.fill,
                                                                 this.maps.layers[j as number].shapeSettings.opacity,
                                                                 /* eslint-disable-next-line max-len */
                                                                 this.maps.layers[j as number].shapeSettings.border.color || this.maps.themeStyle.shapeBorderColor,
                                                                 isNullOrUndefined(this.maps.layers[j as number].shapeSettings.border.width)
                                                                     ? 0 : this.maps.layers[j as number].shapeSettings.border.width,
                                                                 /* eslint-disable-next-line max-len */
                                                                 isNullOrUndefined(this.maps.layers[j as number].shapeSettings.border.opacity)
                                                                     ? this.maps.layers[j as number].shapeSettings.opacity
                                                                     : this.maps.layers[j as number].shapeSettings.border.opacity,
                                                                 this.maps.layers[j as number].shapeSettings.fill);
                                    }
                                }
                            } else {
                                if (toggledLegendIdIndex !== -1 && i === 0) {
                                    this.maps.toggledLegendId.splice(toggledLegendIdIndex, 1);
                                }
                                if (toggledShapeIdIndex !== -1) {
                                    this.maps.toggledElementId.splice(toggledShapeIdIndex, 1);
                                }
                                layerElement.setAttribute('fill', this.legendCollection[legendIndex as number]['fill']);
                                layerElement.setAttribute('stroke-opacity', (isNullOrUndefined(this.maps.layers[j as number].shapeSettings.border.opacity) ?
                                    this.maps.layers[j as number].shapeSettings.opacity :
                                    this.maps.layers[j as number].shapeSettings.border.opacity).toString());
                                layerElement.setAttribute('stroke-width', (isNullOrUndefined(this.maps.layers[j as number].shapeSettings.border.width) ? 0 : this.maps.layers[j as number].shapeSettings.border.width).toString());
                                layerElement.setAttribute('fill-opacity', (this.maps.layers[j as number].shapeSettings.opacity).toString());
                                layerElement.setAttribute('stroke', this.maps.layers[j as number].shapeSettings.border.color || this.maps.themeStyle.shapeBorderColor);
                                if (targetEle !== null) {
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Text_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Shape_Index_' + legendIndex, this.maps.element.id);
                                    this.setToggleAttributes(legendTextId, legendShapeId, this.legendCollection[legendIndex as number]['fill'], this.legendCollection[legendIndex as number]['opacity'],
                                                             this.legendCollection[legendIndex as number]['shapeBorder']['color'], this.legendCollection[legendIndex as number]['shapeBorder']['width'],
                                                             this.legendCollection[legendIndex as number]['shapeBorder']['opacity'], '#757575');
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
            const legendIndex: number = parseFloat(targetEle.id.split(this.maps.element.id + '_Legend_Index_')[1]);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let mapdata: any;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const selectedItem: any[] = this.legendCollection[legendIndex as number]['data'];
            let isVisible: boolean = selectedItem['_isVisible'];
            if ((this.maps.legendSettings.type === 'Bubbles' || this.maps.legendSettings.type === 'Markers') && this.maps.legendSettings.toggleLegendSettings.enable) {
                const toggledLegendIdIndex: number = this.maps.toggledLegendId.indexOf(legendIndex);
                for (let k: number = 0; k < this.maps.layers.length; k++) {
                    for (let j: number = 0; j < (this.maps.legendSettings.type === 'Bubbles' ? this.maps.layers[k as number].bubbleSettings.length : this.maps.layers[k as number].markerSettings.length); j++) {
                        for (let i: number = 0; i < selectedItem.length; i++) {
                            mapdata = this.legendCollection[legendIndex as number]['data'][i as number];
                            LegendInteractive = this.maps.legendSettings.type === 'Bubbles' ? querySelector(this.maps.element.id + '_LayerIndex_' + mapdata['layerIndex'] +
                                '_BubbleIndex_' + j + '_dataIndex_' + mapdata['dataIndex'], this.maps.element.id) : querySelector(this.maps.element.id + '_LayerIndex_' + mapdata['layerIndex'] +
                                '_MarkerIndex_' + j + '_dataIndex_' + mapdata['dataIndex'], this.maps.element.id);
                            if (!isNullOrUndefined(mapdata['shape']) && mapdata['shape'] === 'Balloon') {
                                LegendInteractive = this.maps.legendSettings.type === 'Bubbles' ? querySelector(this.maps.element.id + '_LayerIndex_' + mapdata['layerIndex'] +
                                '_BubbleIndex_' + j + '_dataIndex_' + mapdata['dataIndex'] + '_Group', this.maps.element.id) : querySelector(this.maps.element.id + '_LayerIndex_' + mapdata['layerIndex'] +
                                '_MarkerIndex_' + j + '_dataIndex_' + mapdata['dataIndex'] + '_Group', this.maps.element.id);
                                LegendInteractive = LegendInteractive.children[0];
                            }
                            if (isVisible && LegendInteractive !== null) {
                                if (this.maps.legendSettings.type === 'Markers') {
                                    if (toggledLegendIdIndex === -1) {
                                        this.maps.toggledLegendId.push(legendIndex);
                                    }
                                    const index: number = this.maps.toggledElementId.indexOf(LegendInteractive.id);
                                    if (index === -1) {
                                        this.maps.toggledElementId.push(LegendInteractive.id);
                                    }
                                }
                                if (this.maps.legendSettings.toggleLegendSettings.applyShapeSettings) {
                                    LegendInteractive.setAttribute('fill', this.maps.layers[k as number].shapeSettings.fill);
                                    LegendInteractive.setAttribute('stroke', this.maps.layers[k as number].shapeSettings.border.color || this.maps.themeStyle.shapeBorderColor);
                                    LegendInteractive.setAttribute('stroke-width', (isNullOrUndefined(this.maps.layers[k as number].shapeSettings.border.width) ? 0 : this.maps.layers[k as number].shapeSettings.border.width).toString());
                                    LegendInteractive.setAttribute('stroke-opacity', (isNullOrUndefined(this.maps.layers[k as number].shapeSettings.border.opacity) ?
                                        this.maps.layers[k as number].shapeSettings.opacity :
                                        this.maps.layers[k as number].shapeSettings.border.opacity).toString());
                                    LegendInteractive.setAttribute('fill-opacity', (this.maps.layers[k as number].shapeSettings.opacity).toString());
                                } else {
                                    LegendInteractive.setAttribute('fill', legendToggleFill);
                                    LegendInteractive.setAttribute('fill-opacity', (legendToggleOpacity).toString());
                                    LegendInteractive.setAttribute('stroke', legendToggleBorderColor);
                                    LegendInteractive.setAttribute('stroke-width', (legendToggleBorderWidth).toString());
                                    LegendInteractive.setAttribute('stroke-opacity', (legendToggleBorderOpacity).toString());
                                }
                                if (targetEle !== null) {
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex + '_Text', this.maps.element.id);
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex, this.maps.element.id);
                                    if (!this.maps.legendSettings.toggleLegendSettings.applyShapeSettings) {
                                        this.setToggleAttributes(legendTextId, legendShapeId, legendToggleFill,
                                                                 legendToggleOpacity, legendToggleBorderColor,
                                                                 legendToggleBorderWidth, legendToggleBorderOpacity, legendToggleFill);
                                    } else {
                                        this.setToggleAttributes(legendTextId, legendShapeId,
                                                                 this.maps.layers[k as number].shapeSettings.fill,
                                                                 this.maps.layers[k as number].shapeSettings.opacity,
                                                                 /* eslint-disable-next-line max-len */
                                                                 this.maps.layers[k as number].shapeSettings.border.color || this.maps.themeStyle.shapeBorderColor,
                                                                 /* eslint-disable-next-line max-len */
                                                                 (isNullOrUndefined(this.maps.layers[k as number].shapeSettings.border.width)
                                                                     ? 0
                                                                     : this.maps.layers[k as number].shapeSettings.border.width),
                                                                 /* eslint-disable-next-line max-len */
                                                                 (isNullOrUndefined(this.maps.layers[k as number].shapeSettings.border.opacity)
                                                                     ? this.maps.layers[k as number].shapeSettings.opacity
                                                                     : this.maps.layers[k as number].shapeSettings.border.opacity),
                                                                 this.maps.layers[k as number].shapeSettings.fill);
                                    }
                                }
                            } else {
                                if (this.maps.legendSettings.type === 'Markers') {
                                    if (toggledLegendIdIndex !== -1 && i === 0) {
                                        this.maps.toggledLegendId.splice(toggledLegendIdIndex, 1);
                                    }
                                    this.markerToggleSelection(LegendInteractive, k, j, legendIndex);
                                } else {
                                    this.bubbleToggleSelection(LegendInteractive, k, j, legendIndex);
                                }
                                if (targetEle !== null) {
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute('fill', this.legendCollection[legendIndex as number]['fill']);
                                    legendShapeId.setAttribute('fill-opacity', this.legendCollection[legendIndex as number]['opacity']);
                                    legendShapeId.setAttribute('stroke', this.legendCollection[legendIndex as number]['shapeBorder']['color']);
                                    legendShapeId.setAttribute('stroke-width', this.legendCollection[legendIndex as number]['shapeBorder']['width']);
                                    legendShapeId.setAttribute('stroke-opacity', this.legendCollection[legendIndex as number]['shapeBorder']['opacity']);
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex + '_Text', this.maps.element.id);
                                    legendTextId.setAttribute('fill', this.maps.legendSettings.textStyle.color);
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
                        mapdata = this.legendCollection[legendIndex as number]['data'][i as number];
                        mapLegendElement = querySelector(this.maps.element.id + '_LayerIndex_' + mapdata['layerIndex'] +
                            '_shapeIndex_' + mapdata['shapeIndex'] + '_dataIndex_' + mapdata['dataIndex'], this.maps.element.id);
                        if (mapLegendElement !== null) {
                            const toggledShapeIdIndex: number = this.maps.toggledElementId.indexOf(mapLegendElement.id);
                            if (isVisible) {
                                if (i === 0) {
                                    this.maps.toggledLegendId.push(legendIndex);
                                }
                                if (toggledShapeIdIndex === -1) {
                                    this.maps.toggledElementId.push(mapLegendElement.id);
                                }
                                if (this.maps.legendSettings.toggleLegendSettings.applyShapeSettings) {
                                    mapLegendElement.setAttribute('fill', this.maps.layers[0].shapeSettings.fill);
                                    mapLegendElement.setAttribute('stroke', this.maps.layers[0].shapeSettings.border.color || this.maps.themeStyle.shapeBorderColor);
                                    mapLegendElement.setAttribute('fill-opacity', (this.maps.layers[k as number].shapeSettings.opacity).toString());
                                    mapLegendElement.setAttribute('stroke-width', (isNullOrUndefined(this.maps.layers[k as number].shapeSettings.border.width) ? 0 : this.maps.layers[k as number].shapeSettings.border.width).toString());
                                    mapLegendElement.setAttribute('stroke-opacity', (isNullOrUndefined(this.maps.layers[k as number].shapeSettings.border.opacity) ?
                                        this.maps.layers[k as number].shapeSettings.opacity :
                                        this.maps.layers[k as number].shapeSettings.border.opacity).toString());
                                } else {
                                    mapLegendElement.setAttribute('fill', legendToggleFill);
                                    mapLegendElement.setAttribute('fill-opacity', (legendToggleOpacity).toString());
                                    mapLegendElement.setAttribute('stroke', legendToggleBorderColor);
                                    mapLegendElement.setAttribute('stroke-width', (legendToggleBorderWidth).toString());
                                    mapLegendElement.setAttribute('stroke-opacity', (legendToggleBorderOpacity).toString());
                                }
                                if (targetEle !== null) {
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex, this.maps.element.id);
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex + '_Text', this.maps.element.id);
                                    if (!this.maps.legendSettings.toggleLegendSettings.applyShapeSettings) {
                                        this.setToggleAttributes(legendTextId, legendShapeId, legendToggleFill,
                                                                 legendToggleOpacity, legendToggleBorderColor, legendToggleBorderWidth,
                                                                 legendToggleBorderOpacity, legendToggleFill);
                                    } else {
                                        this.setToggleAttributes(legendTextId, legendShapeId, this.maps.layers[0].shapeSettings.fill,
                                                                 this.maps.layers[k as number].shapeSettings.opacity,
                                                                 /* eslint-disable-next-line max-len */
                                                                 this.maps.layers[0].shapeSettings.border.color || this.maps.themeStyle.shapeBorderColor,
                                                                 isNullOrUndefined(this.maps.layers[k as number].shapeSettings.border.width)
                                                                     ? 0
                                                                     : this.maps.layers[k as number].shapeSettings.border.width,
                                                                 /* eslint-disable-next-line max-len */
                                                                 isNullOrUndefined(this.maps.layers[k as number].shapeSettings.border.opacity)
                                                                     ? this.maps.layers[k as number].shapeSettings.opacity
                                                                     : this.maps.layers[k as number].shapeSettings.border.opacity,
                                                                 this.maps.layers[0].shapeSettings.fill);
                                    }
                                }
                            } else {
                                if (toggleLegendIdIndex !== -1 && i === 0) {
                                    this.maps.toggledLegendId.splice(toggleLegendIdIndex, 1);
                                }
                                if (toggledShapeIdIndex !== -1) {
                                    this.maps.toggledElementId.splice(toggledShapeIdIndex, 1);
                                }
                                mapLegendElement.setAttribute('fill-opacity', (this.maps.layers[k as number].shapeSettings.opacity).toString());
                                mapLegendElement.setAttribute('stroke-width', (isNullOrUndefined(this.maps.layers[k as number].shapeSettings.border.width) ? 0 :
                                    this.maps.layers[k as number].shapeSettings.border.width).toString());
                                mapLegendElement.setAttribute('stroke', this.maps.layers[0].shapeSettings.border.color || this.maps.themeStyle.shapeBorderColor);
                                mapLegendElement.setAttribute('stroke-opacity', (isNullOrUndefined(this.maps.layers[k as number].shapeSettings.border.opacity) ?
                                    this.maps.layers[k as number].shapeSettings.opacity :
                                    this.maps.layers[k as number].shapeSettings.border.opacity).toString());
                                mapLegendElement.setAttribute('fill', this.legendCollection[legendIndex as number]['fill']);
                                if (targetEle !== null) {
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex + '_Text', this.maps.element.id);
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex, this.maps.element.id);
                                    this.setToggleAttributes(legendTextId, legendShapeId, this.legendCollection[legendIndex as number]['fill'], this.legendCollection[legendIndex as number]['opacity'],
                                                             this.legendCollection[legendIndex as number]['shapeBorder']['color'], this.legendCollection[legendIndex as number]['shapeBorder']['width'],
                                                             this.legendCollection[legendIndex as number]['shapeBorder']['opacity'], '#757575');
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
        const pagingElement: HTMLElement = document.getElementById(this.maps.element.id + '_Legend_Paging_Group');
        if (pagingElement) {
            for (let i: number = 0; i < pagingElement.childElementCount; i++) {
                EventHandler.remove((pagingElement.childNodes[i as number] as HTMLElement), Browser.touchStartEvent,
                                    this.changeNextPage);
            }
        }
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
                const shapeData: any = layerData[i as number];
                const dataPathValue: string = (dataPath.indexOf('.') > -1 ) ? getValueFromObject(data, dataPath) : data[dataPath as string];
                const shapePath: string = checkPropertyPath(data[dataPath as string], shapePropertyPath, shapeData['properties']);
                const dataPathValueCase: string | number = !isNullOrUndefined(dataPathValue) &&
                    typeof dataPathValue === 'string' ? dataPathValue.toLowerCase() : dataPathValue;
                const shapeDataValueCase: string = !isNullOrUndefined(shapeData['properties'][shapePath as string])
                    && isNaN(shapeData['properties'][shapePath as string]) ?
                    shapeData['properties'][shapePath as string].toLowerCase() : shapeData['properties'][shapePath as string];
                if (shapeDataValueCase === dataPathValueCase) {
                    if (shapeData['geometry']['type'] !== 'MultiPoint') {
                        legendData.push({
                            layerIndex: layerIndex, shapeIndex: i, dataIndex: dataIndex,
                            name: data[dataPath as string], value: value, pointIndex: -1
                        });
                    } else {
                        for (let j: number = 0; j < shapeData['geometry'].coordinates.length; j++) {
                            legendData.push({
                                layerIndex: layerIndex, shapeIndex: i, dataIndex: dataIndex,
                                name: data[dataPath as string], value: value, pointIndex: j
                            });
                        }
                    }
                }
            }
        }
        return legendData;
    }

    private setToggleAttributes(textElement: Element, shapeElement: Element, fillColor: string, fillOpacity: number,
                                borderColor: string, borderWidth: number, borderOpacity: number, textColor: string): void {
        textElement.setAttribute('fill', textColor);
        shapeElement.setAttribute('fill', fillColor);
        shapeElement.setAttribute('fill-opacity', (fillOpacity).toString());
        shapeElement.setAttribute('stroke', borderColor);
        shapeElement.setAttribute('stroke-width', (borderWidth).toString());
        if (!isNullOrUndefined(borderOpacity)) {
            shapeElement.setAttribute('stroke-opacity', (borderOpacity).toString());
        }
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
                stopEle.setAttribute('stop-color', colorMap.color[b as number]);
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
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.legendCollection = [];
        this.legendRenderingCollections = [];
        this.translate = null;
        this.legendBorderRect = null;
        this.initialMapAreaRect = null;
        this.legendTotalRect = null;
        this.totalPages = [];
        this.legendItemRect = null;
        this.legendGroup = null;
        this.shapeHighlightCollection = [];
        this.legendHighlightCollection = [];
        this.shapePreviousColor = [];
        this.selectedNonLegendShapes = [];
        this.legendLinearGradient = null;
        this.currentLayer = null;
        this.defsElement = null;
        this.legendElement = [];
        this.oldShapeElement = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(this.maps as any).refreshing) {
            this.maps = null;
        }
    }
}
