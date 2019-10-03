import { Maps } from '../../index';
import {
    LayerSettings, ColorMappingSettings, BorderModel, LegendPosition, FontModel, LegendSettingsModel,
    click, ILegendRenderingEventArgs, legendRendering,
    MarkerSettingsModel, MarkerSettings, LegendShape, LabelPosition, LabelIntersectAction
} from '../index';
import { LegendArrangement, LegendMode } from '../index';
import {
    Rect, measureText, CircleOption, PathOption, textTrim,
    removeClass, querySelector, getTemplateFunction
} from '../utils/helper';
import { RectOption, Size, TextOption, Point, renderTextElement, drawSymbol, checkPropertyPath } from '../utils/helper';
import { isNullOrUndefined, Browser, EventHandler, remove, extend } from '@syncfusion/ej2-base';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { LayerSettingsModel, HighlightSettingsModel, SelectionSettingsModel } from '../model/base-model';
import { ShapeSettings } from '../model/base';
/**
 * Legend module is used to render legend for the maps
 */
export class Legend {
    /* tslint:disable:no-string-literal */
    public legendCollection: Object[];
    public legendRenderingCollections: Object[];
    private translate: Point;
    private legendBorderRect: Rect = new Rect(0, 0, 0, 0);
    private maps: Maps;
    private totalPages: Object[] = [];
    private page: number = 0;
    private currentPage: number = 0;
    private legendItemRect: Rect = new Rect(0, 0, 0, 0);
    private heightIncrement: number = 0;
    private widthIncrement: number = 0;
    private textMaxWidth: number = 0;
    private legendGroup: Element;
    private shapeHighlightCollection: object[] = [];
    private shapeSelectionCollection: object[] = [];
    public legendHighlightCollection: object[] = [];
    public legendSelectionCollection: object[] = [];
    private legendLinearGradient: Element;
    private currentLayer: LayerSettings;
    private defsElement: Element;
    public legendElement: Element = null;
    private shapeElement: Element = null;
    public oldShapeElement: Element;
    public shapeSelection: boolean = true;
    public legendSelection: boolean = true;
    constructor(maps: Maps) {
        this.maps = maps;
        this.addEventListener();
    }
    /**
     * To calculate legend bounds and draw the legend shape and text.
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

    /* tslint:disable-next-line:max-func-body-length */
    public calculateLegendBounds(): void {
        let map: Maps = this.maps;
        let legend: LegendSettingsModel = <LegendSettingsModel>map.legendSettings;
        this.legendCollection = [];
        let spacing: number = 10;
        let leftPadding: number = 10; let topPadding: number = map.mapAreaRect.y;
        this.legendRenderingCollections = [];
        map.layersCollection.forEach((layer: LayerSettings, layerIndex: number) => {
            if (!isNullOrUndefined(layer.shapeData)) {
                let layerData: Object[] = layer.shapeData['features'];
                let dataPath: string = layer.shapeDataPath;
                let propertyPath: string | string[] = layer.shapePropertyPath;
                let dataSource: Object[] = layer.dataSource as Object[];
                let colorValuePath: string;
                let colorMapping: ColorMappingSettings[];
                if (legend.type === 'Layers' && layer.visible) {
                    colorValuePath = layer.shapeSettings.colorValuePath;
                    colorMapping = <ColorMappingSettings[]>layer.shapeSettings.colorMapping;
                    this.getLegends(layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath);
                } else if (legend.type === 'Bubbles') {
                    for (let bubble of layer.bubbleSettings) {
                        if (bubble.visible) {
                            colorValuePath = bubble.colorValuePath;
                            colorMapping = <ColorMappingSettings[]>bubble.colorMapping;
                            dataSource = bubble.dataSource;
                            this.getLegends(layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath);
                        }
                    }
                } else {
                    this.getMarkersLegendCollections(layerIndex, layer.markerSettings);
                }
            }
        });
        let defaultSize: number = 25;
        let legendTitle: string = map.legendSettings.title.text;
        let titleTextStyle: FontModel = map.legendSettings.titleStyle;
        if (this.legendCollection.length > 0) {
            let legendMode: LegendMode = legend.mode;
            let shapeX: number = 0; let shapeY: number = 0;
            let textX: number = 0; let textY: number = 0;
            let shapePadding: number = legend.shapePadding;
            let textPadding: number = 10;
            let shapeHeight: number = legend.shapeHeight; let shapeWidth: number = legend.shapeWidth;
            let shapeLocation: Point[] = []; let textLocation: Rect[] = [];
            let legendRectCollection: Rect[] = [];
            let location: Point;
            let position: LegendPosition = legend.position;
            let labelAction: LabelIntersectAction = legend.labelDisplayMode;
            let arrangement: LegendArrangement = (legend.orientation === 'None') ? ((position === 'Top' || position === 'Bottom')
                ? 'Horizontal' : 'Vertical') : legend.orientation;
            let legendWidth: number = (legend.width.length > 1) ? (legend.width.indexOf('%') > -1) ? (map.availableSize.width / 100)
                * parseInt(legend.width, 10) : parseInt(legend.width, 10) : null;
            let legendHeight: number = (legend.height.length > 1) ? (legend.height.indexOf('%') > -1) ? (map.availableSize.height / 100) *
                parseInt(legend.height, 10) : parseInt(legend.height, 10) : null;
            let legendItemStartX: number; let legendItemStartY: number;
            let startX: number = 0; let startY: number = 0;
            let legendtitleSize: Size = measureText(legendTitle, titleTextStyle);
            if (legendMode === 'Interactive') {
                let itemTextStyle: FontModel = legend.textStyle;
                let rectWidth: number; let rectHeight: number;
                let legendLength: number = this.legendCollection.length;
                rectWidth = (arrangement === 'Horizontal') ? (isNullOrUndefined(legendWidth)) ? (map.mapAreaRect.width / legendLength) :
                    (legendWidth / legendLength) : (isNullOrUndefined(legendWidth)) ? defaultSize : legendWidth;
                rectHeight = (arrangement === 'Horizontal') ? (isNullOrUndefined(legendHeight)) ? defaultSize : legendHeight :
                    (isNullOrUndefined(legendHeight)) ? (map.mapAreaRect.height / legendLength) : (legendHeight / legendLength);
                startX = 0; startY = legendtitleSize.height + spacing;
                let position: LabelPosition = legend.labelPosition;
                let textX: number = 0; let textY: number = 0; let textPadding: number = 10;
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
                        textWidth: itemTextSize.width, textHeight: itemTextSize.height
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
                    let legendItem: Object = this.legendCollection[i];
                    if (isNullOrUndefined(this.totalPages[this.page])) {
                        this.totalPages[this.page] = { Page: (this.page + 1), Collection: [] };
                    }
                    let legendTextSize: Size = measureText(legendItem['text'], legend.textStyle);
                    this.textMaxWidth = Math.max(this.textMaxWidth, legendTextSize.width);
                    if (i === 0) {
                        startX = shapeX = (leftPadding + (shapeWidth / 2));
                        startY = shapeY = topPadding + legendtitleSize.height + (shapeHeight > legendTextSize.height ? shapeHeight / 2
                            : (legendTextSize.height / 4));
                    } else {
                        let maxSize: number = (legendTextSize.height > shapeHeight) ? legendTextSize.height : shapeHeight;
                        if (arrangement === 'Horizontal') {
                            let prvePositionX: number = (textLocation[j - 1].x + textLocation[j - 1].width) + textPadding + shapeWidth;
                            if ((prvePositionX + shapePadding + legendTextSize.width) > legendWidth) {
                                let nextPositionY: number = (textLocation[j - 1].y > (shapeLocation[j - 1].y + (shapeHeight / 2)) ?
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
                            let prevPositionY: number = textLocation[j - 1].y > shapeLocation[j - 1].y + (shapeHeight / 2) ?
                                textLocation[j - 1].y : shapeLocation[j - 1].y + (shapeHeight / 2);
                            if ((prevPositionY + topPadding + maxSize) > legendHeight) {
                                let nextPositionX: number = (textLocation[j - 1].x + this.textMaxWidth + textPadding);
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
                    (<Object[]>this.totalPages[this.page]['Collection']).push({
                        DisplayText: legendItem['text'],
                        ImageSrc: legendItem['imageSrc'],
                        Shape: { x: shapeX, y: shapeY },
                        Text: { x: textX, y: textY },
                        Fill: legendItem['fill'],
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
                let collection: Object[] = (<Object[]>this.totalPages[0]['Collection']);
                collection.forEach((legendObj: Object, index: number) => {
                    let legendRect: Rect = new Rect(
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
     * 
     */
    private getLegends(
        layerIndex: number, layerData: object[], colorMapping: ColorMappingSettings[], dataSource: object[],
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

    /**
     * To draw the legend shape and text.
     */
    public drawLegend(): void {
        let map: Maps = this.maps;
        let legend: LegendSettingsModel = <LegendSettingsModel>map.legendSettings;
        let render: SvgRenderer = map.renderer;
        let textOptions: TextOption;
        let textFont: FontModel = legend.textStyle;
        this.legendGroup = render.createGroup({ id: map.element.id + '_Legend_Group' });
        let eventArgs: ILegendRenderingEventArgs = {
            name: legendRendering, cancel: false, fill: '', shape: legend.shape,
            shapeBorder: legend.shapeBorder
        };
        if (legend.mode === 'Interactive') {
            for (let i: number = 0; i < this.legendRenderingCollections.length; i++) {
                let itemId: string = map.element.id + '_Legend_Index_' + i;
                let textId: string = map.element.id + '_Legend_Index_' + i + '_Text';
                let item: Object = this.legendRenderingCollections[i];
                let bounds: Rect = new Rect(item['x'], item['y'], item['width'], item['height']);
                let textLocation: Point = new Point(item['textX'], item['textY']);
                eventArgs.fill = item['fill'];
                map.trigger(legendRendering, eventArgs, () => {
                    textFont.color = (textFont.color !== null) ? textFont.color : this.maps.themeStyle.legendTextColor;
                    let rectOptions: RectOption = new RectOption(itemId, eventArgs.fill, eventArgs.shapeBorder, legend.opacity, bounds);
                    textOptions = new TextOption(textId, textLocation.x, textLocation.y, 'middle', item['text'], '', '');
                    textFont.fontFamily = map.themeStyle.fontFamily || textFont.fontFamily;
                    textFont.size = map.themeStyle.legendFontSize || textFont.size;
                    renderTextElement(textOptions, textFont, textFont.color, this.legendGroup);
                    this.legendGroup.appendChild(render.drawRectangle(rectOptions));
                    if (i === this.legendRenderingCollections.length - 1) {
                        this.renderLegendBorder();
                    }
                });
            }
        } else {
            this.drawLegendItem(this.currentPage);
        }
    }

    // tslint:disable-next-line:max-func-body-length
    private drawLegendItem(page: number): void {
        let map: Maps = this.maps;
        let legend: LegendSettingsModel = <LegendSettingsModel>map.legendSettings; let spacing: number = 10;
        let shapeSize: Size = new Size(legend.shapeWidth, legend.shapeHeight);
        let textOptions: TextOption; let renderOptions: CircleOption | PathOption | RectOption;
        let render: SvgRenderer = map.renderer; let shapeBorder: BorderModel = legend.shapeBorder;
        let eventArgs: ILegendRenderingEventArgs = { name: legendRendering, cancel: false, fill: '', shape: legend.shape };
        if (page >= 0 && page < this.totalPages.length) {
            if (querySelector(this.legendGroup.id, this.maps.element.id)) {
                remove(querySelector(this.legendGroup.id, this.maps.element.id));
            }
            let strokeColor: string = (legend.shape === 'HorizontalLine' || legend.shape === 'VerticalLine'
                || legend.shape === 'Cross') ? isNullOrUndefined(legend.fill) ? '#000000' : legend.fill : shapeBorder.color;
            let strokeWidth: number = (legend.shape === 'HorizontalLine' || legend.shape === 'VerticalLine'
                || legend.shape === 'Cross') ? (shapeBorder.width === 0) ?
                    1 : shapeBorder.width : shapeBorder.width;
            eventArgs.shapeBorder = { width: strokeWidth, color: strokeColor };
            for (let i: number = 0; i < (<Object[]>this.totalPages[page]['Collection']).length; i++) {
                let collection: Object = <Object[]>this.totalPages[page]['Collection'][i];
                let legendElement: Element = render.createGroup({ id: map.element.id + '_Legend_Index_' + i });
                let legendText: string = collection['DisplayText'];
                eventArgs.fill = collection['Fill'];
                eventArgs.shape = <LegendShape>((legend.type === 'Markers') ? ((isNullOrUndefined(collection['ImageSrc'])) ?
                    legend.shape : 'Image') : legend.shape);
                map.trigger(legendRendering, eventArgs, () => {
                    let shapeId: string = map.element.id + '_Legend_Shape_Index_' + i;
                    let textId: string = map.element.id + '_Legend_Text_Index_' + i;
                    let shapeLocation: Point = collection['Shape'];
                    let textLocation: Point = collection['Text'];
                    let imageUrl: string = ((isNullOrUndefined(collection['ImageSrc'])) ? legend.shape : collection['ImageSrc']);
                    let renderOptions: PathOption = new PathOption(
                        shapeId, eventArgs.fill, eventArgs.shapeBorder.width, eventArgs.shapeBorder.color, legend.opacity, ''
                    );
                    legend.textStyle.color = (legend.textStyle.color !== null) ? legend.textStyle.color :
                    this.maps.themeStyle.legendTextColor;
                    legend.textStyle.fontFamily = map.themeStyle.fontFamily || legend.textStyle.fontFamily;
                    legend.textStyle.size = map.themeStyle.legendFontSize || legend.textStyle.size;
                    legendElement.appendChild(drawSymbol(shapeLocation, eventArgs.shape, shapeSize, collection['ImageSrc'], renderOptions));
                    textOptions = new TextOption(textId, textLocation.x, textLocation.y, 'start', legendText, '', '');
                    renderTextElement(textOptions, legend.textStyle, legend.textStyle.color, legendElement);
                    this.legendGroup.appendChild(legendElement);
                    if (i === ((<Object[]>this.totalPages[page]['Collection']).length - 1)) {
                        let pagingGroup: Element; let width: number = spacing; let height: number = (spacing / 2);
                        if (this.page !== 0) {
                            let pagingText: string = (page + 1) + '/' + this.totalPages.length;
                            let pagingFont: FontModel = legend.textStyle;
                            let pagingTextSize: Size = measureText(pagingText, pagingFont);
                            let leftPageX: number = (this.legendItemRect.x + this.legendItemRect.width) - pagingTextSize.width -
                                (width * 2) - spacing;
                            let rightPageX: number = (this.legendItemRect.x + this.legendItemRect.width);
                            let locY: number = (this.legendItemRect.y + this.legendItemRect.height) + (height / 2) + spacing;
                            let pageTextX: number = rightPageX - width - (pagingTextSize.width / 2) - (spacing / 2);
                            pagingGroup = render.createGroup({ id: map.element.id + '_Legend_Paging_Group' });
                            let leftPageElement: Element = render.createGroup({ id: map.element.id + '_Legend_Left_Paging_Group' });
                            let rightPageElement: Element = render.createGroup({ id: map.element.id + '_Legend_Right_Paging_Group' });
                            let rightPath: string = ' M ' + rightPageX + ' ' + locY + ' L ' + (rightPageX - width) + ' ' + (locY - height) +
                                ' L ' + (rightPageX - width) + ' ' + (locY + height) + ' z ';
                            let leftPath: string = ' M ' + leftPageX + ' ' + locY + ' L ' + (leftPageX + width) + ' ' + (locY - height) +
                                ' L ' + (leftPageX + width) + ' ' + (locY + height) + ' z ';
                            let leftPageOptions: PathOption = new PathOption(
                                map.element.id + '_Left_Page', '#a6a6a6', 0, '#a6a6a6', 1, '', leftPath
                                );
                            leftPageElement.appendChild(render.drawPath(leftPageOptions));
                            let leftRectPageOptions: RectOption = new RectOption(
                                map.element.id + '_Left_Page_Rect', 'transparent', {}, 1,
                                new Rect(leftPageX - (width / 2), (locY - (height * 2)), width * 2, spacing * 2), null, null, '', ''
                            );
                            leftPageElement.appendChild(render.drawRectangle(leftRectPageOptions));
                            this.wireEvents(leftPageElement);
                            let rightPageOptions: PathOption = new PathOption(
                                map.element.id + '_Right_Page', '#a6a6a6', 0, '#a6a6a6', 1, '', rightPath
                            );
                            rightPageElement.appendChild(render.drawPath(rightPageOptions));
                            let rightRectPageOptions: RectOption = new RectOption(
                                map.element.id + '_Right_Page_Rect', 'transparent', {}, 1,
                                new Rect((rightPageX - width), (locY - height), width, spacing), null, null, '', ''
                            );
                            rightPageElement.appendChild(render.drawRectangle(rightRectPageOptions));
                            this.wireEvents(rightPageElement);
                            pagingGroup.appendChild(leftPageElement);
                            pagingGroup.appendChild(rightPageElement);
                            let pageTextOptions: Object = {
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
                        this.renderLegendBorder();
                    }
                });
            }
        }
    }

    // tslint:disable-next-line:max-func-body-length
    public legendHighLightAndSelection(targetElement: Element, value: string): void {
        let shapeIndex: number;
        let layerIndex: number;
        let dataIndex: number;
        let textEle: Element;
        let legend: LegendSettingsModel = this.maps.legendSettings;
        textEle = legend.mode === 'Default' ? document.getElementById(targetElement.id.replace('Shape', 'Text')) :
            document.getElementById(targetElement.id + '_Text');
        let collection: object[] = this.maps.legendModule.legendCollection;
        let length: number;
        let selectLength: number = 0;
        let interactProcess: boolean = true;
        if (value === 'selection') {
            this.shapeHighlightCollection = [];
            if (this.legendSelectionCollection.length > 0) {
                for (let k: number = 0; k < this.legendSelectionCollection.length; k++) {
                    if (targetElement === this.legendSelectionCollection[k]['legendElement']) {
                        interactProcess = false;
                        this.removeLegendSelectionCollection();
                        this.legendSelectionCollection.splice(k, 1);
                        break;
                    } else {
                        this.removeLegendSelectionCollection();
                        this.legendSelectionCollection.splice(k, 1);
                    }
                }
            }
        } else {
            if (this.legendSelectionCollection.length > 0) {
                for (let k: number = 0; k < this.legendSelectionCollection.length; k++) {
                    if ((targetElement.id.indexOf('_Legend_Shape') > -1 || targetElement.id.indexOf('_Legend_Index')) && targetElement ===
                        this.legendSelectionCollection[k]['legendElement']) {
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
                if (textEle.textContent === collection[i]['text'] && collection[i]['data'].length > 0 &&
                   parseFloat(targetElement.id.split('_Legend_Index_')[1]) === i) {
                    let layer: LayerSettingsModel = this.maps.layers[collection[i]['data'][0]['layerIndex']];
                    let enable: boolean = (value === 'selection') ? layer.selectionSettings.enable : layer.highlightSettings.enable;
                    let module: HighlightSettingsModel | SelectionSettingsModel;
                    module = (value === 'selection') ? layer.selectionSettings : layer.highlightSettings;
                    let data: object[] = collection[i]['data'];
                    if (enable) {
                        for (let j: number = 0; j < data.length; j++) {
                            shapeIndex = data[j]['shapeIndex'];
                            layerIndex = data[j]['layerIndex'];
                            dataIndex = data[j]['dataIndex'];
                            let shapeEle: Element = document.getElementById(this.maps.element.id + '_LayerIndex_' +
                                layerIndex + '_shapeIndex_' + shapeIndex + '_dataIndex_' + dataIndex);
                            if (shapeEle !== null) {
                                if (value === 'highlight' && this.shapeElement !== targetElement) {
                                    if (j === 0) {
                                        this.legendHighlightCollection = [];
                                        this.pushCollection(
                                            targetElement, this.legendHighlightCollection, collection[i],
                                            layer.shapeSettings as ShapeSettings);
                                    }
                                    length = this.legendHighlightCollection.length;
                                    let legendHighlightColor : string = this.legendHighlightCollection[length - 1]['legendOldFill'];
                                    this.legendHighlightCollection[length - 1]['MapShapeCollection']['Elements'].push(shapeEle);
                                    this.setColor(
                                        shapeEle, !isNullOrUndefined(module.fill) ? module.fill : legendHighlightColor,
                                        module.opacity.toString(), module.border.color, module.border.width.toString());
                                    this.setColor(
                                        targetElement,  !isNullOrUndefined(module.fill) ? module.fill : legendHighlightColor,
                                        module.opacity.toString(), module.border.color, module.border.width.toString());
                                } else if (value === 'selection' && this.shapeSelection) {
                                    this.legendHighlightCollection = [];
                                    if (j === 0) {
                                        this.pushCollection(
                                            targetElement, this.legendSelectionCollection, collection[i],
                                            layer.shapeSettings as ShapeSettings);
                                    }
                                    selectLength = this.legendSelectionCollection.length;
                                    let legendSelectionColor : string = this.legendSelectionCollection[selectLength - 1]['legendOldFill'];
                                    this.legendSelectionCollection[selectLength - 1]['MapShapeCollection']['Elements'].push(shapeEle);
                                    this.setColor(
                                        targetElement, !isNullOrUndefined(module.fill) ? module.fill : legendSelectionColor,
                                        module.opacity.toString(), module.border.color, module.border.width.toString());
                                    this.setColor(
                                        shapeEle, !isNullOrUndefined(module.fill) ? module.fill : legendSelectionColor,
                                        module.opacity.toString(), module.border.color, module.border.width.toString());
                                    this.legendElement = targetElement;
                                    if (j === data.length - 1) { this.legendSelection = false; }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private setColor(element: Element, fill: string, opacity: string, borderColor: string, borderWidth: string): void {
        element.setAttribute('fill', fill);
        element.setAttribute('opacity', opacity);
        element.setAttribute('stroke', borderColor);
        element.setAttribute('stroke-width', (Number(borderWidth) / this.maps.scale).toString());
    }

    private pushCollection(targetElement: Element, collection: object[], oldElement: object, shapeSettings: ShapeSettings): void {
        collection.push({
            legendElement: targetElement, legendOldFill: oldElement['fill'], legendOldOpacity: oldElement['opacity'],
            legendOldBorderColor: oldElement['borderColor'], legendOldBorderWidth: oldElement['borderWidth'],
            shapeOpacity: shapeSettings.opacity, shapeOldBorderColor: shapeSettings.border.color,
            shapeOldBorderWidth: shapeSettings.border.width
        });
        length = collection.length;
        collection[length - 1]['MapShapeCollection'] = { Elements: [] };
    }

    private removeLegend(collection: object[]): void {
        for (let i: number = 0; i < collection.length; i++) {
            let item: object = collection[i];
            this.setColor(
                item['legendElement'], item['legendOldFill'], item['legendOldOpacity'],
                item['legendOldBorderColor'], item['legendOldBorderWidth']);
            let dataCount: number = item['MapShapeCollection']['Elements'].length;
            for (let j: number = 0; j < dataCount; j++) {
                this.setColor(
                    item['MapShapeCollection']['Elements'][j], item['legendOldFill'], item['shapeOpacity'],
                    item['shapeOldBorderColor'], item['shapeOldBorderWidth']);
            }
        }
    }

    public removeLegendHighlightCollection(): void {
        if (this.legendHighlightCollection.length > 0) {
            this.removeLegend(this.legendHighlightCollection);
        }
    }

    public removeLegendSelectionCollection(): void {
        if (this.legendSelectionCollection.length > 0) {
            this.removeLegend(this.legendSelectionCollection);
            this.legendElement = null;
            this.legendSelection = true;
        }
    }

    public removeShapeHighlightCollection(): void {
        if (this.shapeHighlightCollection.length > 0) {
            for (let i: number = 0; i < this.shapeHighlightCollection.length; i++) {
                let item: object = this.shapeHighlightCollection[i];
                let removeFill: boolean = true;
                for (let j: number = 0; j < this.shapeSelectionCollection.length; j++) {
                    if (this.shapeSelectionCollection[j]['legendElement'] === item['legendElement']) {
                        removeFill = false;
                    }
                }
                if (removeFill) {
                    this.setColor(
                        item['legendElement'], item['legendOldFill'], item['legendOldOpacity'],
                        item['legendOldBorderColor'], item['legendOldBorderWidth']);
                }
            }
        }
    }

    public shapeHighLightAndSelection(
        targetElement: Element, data: object, module: SelectionSettingsModel | HighlightSettingsModel,
        getValue: string, layerIndex: number): void {
        if (data !== undefined) {
            let collection: object[] = this.maps.legendModule.legendCollection;
            let index: number = this.legendIndexOnShape(data, layerIndex);
            let text: string = collection[index]['text'];
            let content: string; let legendShape: Element;
            if (this.maps.legendSettings.mode === 'Default') {
                content = document.getElementById(this.maps.element.id + '_Legend_Text_Index_' + index).textContent;
                legendShape = document.getElementById(this.maps.element.id + '_Legend_Shape_Index_' + index);
            } else {
                content = document.getElementById(this.maps.element.id + '_Legend_Index_' + index + '_Text').textContent;
                legendShape = document.getElementById(this.maps.element.id + '_Legend_Index_' + index);
            }
            let shapeElement: object = this.shapeDataOnLegend(targetElement);
            this.oldShapeElement = shapeElement['LegendEle'];
            let length: number = this.shapeSelectionCollection.length;
            if (text === content) {
                if (getValue === 'highlight' && shapeElement['LegendEle'] !== this.legendElement) {
                    let selectionEle: object = this.isTargetSelected(shapeElement, this.shapeHighlightCollection);
                    if (selectionEle === undefined || (selectionEle && !selectionEle['IsSelected'])) {
                        this.pushCollection(
                            legendShape, this.shapeHighlightCollection, collection[index],
                            this.maps.layers[layerIndex].shapeSettings as ShapeSettings
                        );
                    }
                    if (length > 0) {
                        for (let j: number = 0; j < length; j++) {
                            if (shapeElement['LegendEle'] === this.shapeSelectionCollection[j]['legendElement']) {
                                break;
                            } else if (j === length - 1) {
                                this.removeShapeHighlightCollection();
                                this.setColor(
                                    legendShape, !isNullOrUndefined(module.fill) ? module.fill : legendShape.getAttribute('fill') ,
                                    module.opacity.toString(), module.border.color, module.border.width.toString());
                            }
                        }
                    } else {
                        this.removeShapeHighlightCollection();
                        this.setColor(
                            legendShape, !isNullOrUndefined(module.fill) ? module.fill : legendShape.getAttribute('fill'),
                            module.opacity.toString(), module.border.color, module.border.width.toString());
                    }
                } else if (getValue === 'selection') {
                    let selectionEle: object = this.isTargetSelected(shapeElement, this.shapeSelectionCollection);
                    if (length > 0) {
                        for (let j: number = 0; j < length; j++) {
                            if (shapeElement['LegendEle'] !== this.shapeSelectionCollection[j]['legendElement']) {
                                let element: object = this.shapeSelectionCollection[j];
                                this.setColor(
                                    element['legendElement'], element['legendOldFill'], element['legendOldOpacity'],
                                    element['legendOldBorderColor'], element['legendOldBorderWidth']);
                                this.shapeSelection = true;
                                this.shapeElement = null;
                            }
                        }
                    }
                    if (selectionEle && (
                        selectionEle['IsSelected'] && targetElement.getAttribute('class') === 'ShapeselectionMapStyle')) {
                        let element: object = this.shapeSelectionCollection[selectionEle['SelectionIndex']];
                        this.setColor(
                            shapeElement['LegendEle'], element['legendOldFill'], element['legendOldOpacity'],
                            element['legendOldBorderColor'], element['legendOldBorderWidth']);
                        this.shapeSelectionCollection.splice(selectionEle['SelectionIndex'], 1);
                        this.shapeSelection = true;
                        this.shapeElement = null;
                    }
                    if (targetElement.getAttribute('class') !== 'ShapeselectionMapStyle' && this.legendSelection) {
                        if (selectionEle === undefined || (selectionEle && !selectionEle['IsSelected'])) {
                            this.pushCollection(
                                legendShape, this.shapeSelectionCollection, collection[index],
                                this.maps.layers[layerIndex].shapeSettings as ShapeSettings
                            );
                        }
                        this.setColor(
                            legendShape, !isNullOrUndefined(module.fill) ? module.fill : legendShape.getAttribute('fill'),
                            module.opacity.toString(), module.border.color, module.border.width.toString());
                        this.shapeElement = shapeElement['LegendEle'];
                        this.shapeSelection = false;
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

    private isTargetSelected(target: object, collection: object[]): object {
        let selectEle: object;
        for (let i: number = 0; i < collection.length; i++) {
            if (target['LegendEle'] === collection[i]['legendElement']) {
                selectEle = { IsSelected: true, SelectionIndex: i };
            }
        }
        return selectEle;
    }

    private legendIndexOnShape(data: object, index: number): number {
        let legendIndex: number;
        let path: string = this.maps.layers[index].shapeDataPath;
        let value: object = data[path];
        let collection: object[] = this.maps.legendModule.legendCollection;
        for (let i: number = 0; i < collection.length; i++) {
            let dataValue: object[] = collection[i]['data'];
            for (let j: number = 0; j < dataValue.length; j++) {
                if (value === dataValue[j]['name']) {
                    legendIndex = i;
                }
            }
        }
        return legendIndex;
    }

    private shapeDataOnLegend(targetElement: Element): object {
        let shapeIndex: number;
        let layerIndex: number;
        let dataIndex: number;
        let collection: object[] = this.maps.legendModule.legendCollection;
        let legend: LegendSettingsModel = this.maps.legendSettings;
        for (let i: number = 0; i < collection.length; i++) {
            let data: object[] = collection[i]['data'];
            let process: boolean = false;
            let elements: object[] = [];
            let currentElement: object = { Elements: [] };
            for (let j: number = 0; j < data.length; j++) {
                shapeIndex = data[j]['shapeIndex'];
                layerIndex = data[j]['layerIndex'];
                dataIndex = data[j]['dataIndex'];
                let shapeEle: Element = document.getElementById(this.maps.element.id + '_LayerIndex_' +
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
    //tslint:disable
    private renderLegendBorder(): void {
        let map: Maps = this.maps;
        let legend: LegendSettingsModel = <LegendSettingsModel>map.legendSettings;
        let legendTitle: string = legend.title.text;
        let textStyle: FontModel = legend.titleStyle;
        let textOptions: TextOption;
        let spacing: number = 10;
        let trimTitle: string = textTrim((this.legendItemRect.width + (spacing * 2)), legendTitle, textStyle);
        let textSize: Size = measureText(trimTitle, textStyle);
        this.legendBorderRect = new Rect(
            (this.legendItemRect.x - spacing),
            (this.legendItemRect.y - spacing - textSize.height),
            (this.legendItemRect.width) + (spacing * 2),
            (this.legendItemRect.height) + (spacing * 2) + textSize.height +
            (legend.mode === 'Interactive' ? 0 : (this.page !== 0) ? spacing : 0)
        );
        if (legendTitle) {
            textStyle.color = (textStyle.color !== null) ? textStyle.color : this.maps.themeStyle.legendTextColor;
            textOptions = new TextOption(
                map.element.id + '_LegendTitle',
                (this.legendItemRect.x) + (this.legendItemRect.width / 2),
                this.legendItemRect.y - (textSize.height / 2) - spacing / 2,
                'middle', trimTitle, '');
            renderTextElement(textOptions, textStyle, textStyle.color, this.legendGroup);
        }
        let renderOptions: RectOption = new RectOption(
            map.element.id + '_Legend_Border', legend.background, legend.border, 1, this.legendBorderRect, null, null, '', ''
        );
        this.legendGroup.appendChild(map.renderer.drawRectangle(renderOptions));
        this.getLegendAlignment(map, this.legendBorderRect.width, this.legendBorderRect.height, legend);
        this.legendGroup.setAttribute('transform', 'translate( ' + (this.translate.x + (-(this.legendBorderRect.x))) + ' ' +
            (this.translate.y + (-(this.legendBorderRect.y))) + ' )');
        map.svgObject.appendChild(this.legendGroup);
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
        let spacing: number = 10;let totalRect: Rect;
        totalRect = extend({}, map.mapAreaRect, totalRect, true) as Rect;
        let areaX: number = totalRect.x;
        let areaY: number = totalRect.y;
        let areaHeight: number = totalRect.height;
        let areaWidth: number = totalRect.width;
        let totalWidth: number = map.availableSize.width;
        let totalHeight: number = map.availableSize.height;
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
            if(legend.height && legend.width && legend.mode !== 'Interactive') {
                map.totalRect = totalRect;
            } else {
                map.mapAreaRect = totalRect;
            }
            this.translate = new Point(x, y);
        }
    }

    private getMarkersLegendCollections(layerIndex: number, markers: MarkerSettingsModel[]): void {
        markers.forEach((marker: MarkerSettings, markerIndex: number) => {
            let dataSource: Object[] = marker.dataSource;
            let field: string = marker.legendText;
            let templateFn: Function;
            let isDuplicate: boolean;
            dataSource.forEach((data: Object, dataIndex: number) => {
                let imageSrc: string = null;
                let showLegend: boolean = isNullOrUndefined(data[this.maps.legendSettings.showLegendPath]) ? true :
                    data[this.maps.legendSettings.showLegendPath];
                if (marker.visible && showLegend && (!isNullOrUndefined(data['latitude'] | data['Latitude'])) && (!isNullOrUndefined(data['longitude'] | data['Longitude']))) {
                    if (marker.template) {
                        templateFn = getTemplateFunction(marker.template);
                        let templateElement: Element = templateFn(this.maps);
                        let markerEle: Element = isNullOrUndefined(templateElement.childElementCount) ? templateElement[0] :
                            templateElement;
                        imageSrc = markerEle.querySelector('img').src;
                    }
                    let text: string = isNullOrUndefined(data[field]) ? '' : data[field];
                    isDuplicate = this.maps.legendSettings.removeDuplicateLegend ?
                        this.removeDuplicates(this.legendCollection, text) : false;
                    if (!isDuplicate) {
                        this.legendCollection.push({
                            layerIndex: layerIndex, markerIndex: markerIndex, dataIndex: dataIndex,
                            fill: marker.fill, text: text, imageSrc: imageSrc
                        });
                    }
                }
            });
        });
    }

    private getRangeLegendCollection(
        layerIndex: number, layerData: Object[], colorMapping: ColorMappingSettings[], dataSource: Object[],
        dataPath: string, colorValuePath: string, propertyPath: string | string[]
    ): void {
        let legendText: string; let legendIndex: number = 0;
        let fill: string = this.maps.legendSettings.fill; let rangeData: Object[] = [];
        for (let colorMap of colorMapping) {
            if (!isNullOrUndefined(colorMap.from) && !isNullOrUndefined(colorMap.to)) {
                legendText = !isNullOrUndefined(colorMap.label) ? colorMap.label : colorMap.from + ' - ' + colorMap.to;
                rangeData = [];
                let colorMapProcess: boolean = false;
                dataSource.forEach((data: Object, dataIndex: number) => {
                    let colorValue: number = parseFloat(data[colorValuePath]);
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
                let legendFill: string = (isNullOrUndefined(fill)) ? Object.prototype.toString.call(colorMap.color) === '[object Array]' ?
                    !isNullOrUndefined(colorMap.value) ? colorMap.color[0] : this.legendGradientColor(colorMap, legendIndex) :
                    <string>colorMap.color : fill;
                legendIndex++;
                this.getOverallLegendItemsCollection(legendText, legendFill, rangeData, colorMap.showLegend);
            }
        }
    }

    private getOverallLegendItemsCollection(legendText: string, legendFill: string, legendData: Object[], showLegend: boolean): void {
        let newColllection: Object[] = [];
        let legend: LegendSettingsModel = this.maps.legendSettings;
        if (legendData.length > 0 && showLegend) {
            for (let i: number = 0; i < legendData.length; i++) {
                let collection: Object[] = <Object[]>legendData[i];
                if (collection.length > 0) {
                    for (let j: number = 0; j < collection.length; j++) {
                        newColllection.push(collection[j]);
                    }
                } else {
                    newColllection.push(legendData[i]);
                }
                newColllection['_isVisible'] = true;
            }
            let isDuplicate: boolean = this.maps.legendSettings.removeDuplicateLegend ?
                this.removeDuplicates(this.legendCollection, legendText) : false;
            if (!isDuplicate) {
                this.legendCollection.push({
                    text: legendText, fill: legendFill, data: newColllection, opacity: legend.opacity,
                    borderColor: legend.shapeBorder.color, borderWidth: legend.shapeBorder.width
                });
            }
        }
    }

    private removeDuplicates(legendCollection: Object[], text: string): boolean {
        let isDuplicate: boolean = false;
        for (let i: number = 0; i < legendCollection.length; i++) {
            if (legendCollection[i]['text'] === text) {
                isDuplicate = true;
                break;
            } else {
                continue;
            }
        }
        return isDuplicate;
    }

    private getEqualLegendCollection(
        layerIndex: number, layerData: Object[], colorMapping: ColorMappingSettings[], dataSource: Object[],
        dataPath: string, colorValuePath: string, propertyPath: string | string[]
    ): void {
        let fill: string = this.maps.legendSettings.fill; let equalValues: Object[] = [];
        let legendText: string; let legendIndex: number = 0; let equalData: Object[] = [];
        let outOfRangeValues: Object[] = []; let outOfRange: Object[] = [];
        for (let colorMap of colorMapping) {
            if (!isNullOrUndefined(colorMap.value)) {
                legendText = !isNullOrUndefined(colorMap.label) ? colorMap.label : colorMap.value;
                equalData = [];
                let eqaulColorProcess: boolean = false;
                dataSource.forEach((data: Object, dataIndex: number) => {
                    let equalValue: string = data[colorValuePath];
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
                            let equalIndex: number = outOfRangeValues.indexOf(equalValues[x]);
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
                let legendFill: string = (isNullOrUndefined(fill)) ? Object.prototype.toString.call(colorMap.color) === '[object Array]'
                    ? colorMap.color[0] : <string>colorMap.color : fill;
                legendIndex++;
                this.getOverallLegendItemsCollection(legendText, legendFill, equalData, colorMap.showLegend);
            } else if (isNullOrUndefined(colorMap.minOpacity) && isNullOrUndefined(colorMap.maxOpacity) && isNullOrUndefined(colorMap.value)
                && isNullOrUndefined(colorMap.from) && isNullOrUndefined(colorMap.to) && !isNullOrUndefined(colorMap.color)) {
                dataSource.forEach((data: Object, dataIndex: number) => {
                    let equalValue: string = data[colorValuePath];
                    for (let k: number = 0; k < outOfRangeValues.length; k++) {
                        if (equalValue === outOfRangeValues[k]) {
                            outOfRange.push(
                                this.getLegendData(layerIndex, dataIndex, data, dataPath, layerData, propertyPath, equalValue));
                        }
                    }
                });
                if (outOfRangeValues.length === 0) {
                    let range: boolean = false; let outRange: Object[] = [];
                    dataSource.forEach((data: Object, dataIndex: number) => {
                        range = false;
                        let rangeValue: number = data[colorValuePath];
                        for (let z: number = 0; z < colorMapping.length; z++) {
                            if (!isNullOrUndefined(rangeValue) && rangeValue !== 0) {
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
                let outfill: string = ((Object.prototype.toString.call(colorMap.color) === '[object Array]'))
                    ? colorMap.color[0] : <string>colorMap.color;
                let legendOutFill: string = outfill;
                legendIndex++;
                this.getOverallLegendItemsCollection(legendText, legendOutFill, outOfRange, colorMap.showLegend);
            }
        }
    }

    private getDataLegendCollection(
        layerIndex: number, layerData: Object[], colorMapping: ColorMappingSettings[], dataSource: Object[],
        dataPath: string, colorValuePath: string, propertyPath: string | string[]
    ): void {
        let legendText: string;
        let fill: string = this.maps.legendSettings.fill;
        let valuePath: string = this.maps.legendSettings.valuePath;
        if (!isNullOrUndefined(colorValuePath) && !isNullOrUndefined(dataSource)) {
            dataSource.forEach((data: Object, dataIndex: number) => {
                let showLegend: boolean = isNullOrUndefined(this.maps.legendSettings.showLegendPath) ?
                    true : isNullOrUndefined(data[this.maps.legendSettings.showLegendPath]) ?
                        false : data[this.maps.legendSettings.showLegendPath];
                let dataValue: string = data[colorValuePath];
                let newData: Object[] = [];
                let legendFill: string = (isNullOrUndefined(fill)) ? dataValue : fill;
                if (!isNullOrUndefined(dataValue) && colorMapping.length === 0) {
                    legendText = !isNullOrUndefined(data[valuePath]) ? data[valuePath] : data[dataPath];
                    newData.push(this.getLegendData(layerIndex, dataIndex, data, dataPath, layerData, propertyPath, dataValue));
                }
                this.getOverallLegendItemsCollection(legendText, legendFill, newData, showLegend);
            });

        }
    }

    public interactiveHandler(e: PointerEvent): void {
        let target: Element = <Element>e.target;
        let legend: LegendSettingsModel = <LegendSettingsModel>this.maps.legendSettings;
        let id: string = this.maps.element.id + '_Interactive_Legend';
        let hoverId: string = legend.type === 'Layers' ? '_shapeIndex_' : (legend.type === 'Markers') ? '_MarkerIndex_' :
            '_BubbleIndex_';
        if (target.id.indexOf(hoverId) > 1) {
            let layerIndex: number = parseFloat(target.id.split('_LayerIndex_')[1].split('_')[0]);
            let dataIndex: number = parseFloat(target.id.split(/_dataIndex_/i)[1].split('_')[0]);
            let fill: string; let stroke: string; let strokeWidth: number;
            if (!(isNullOrUndefined(querySelector(id, this.maps.element.id)))) {
                remove(querySelector(id, this.maps.element.id));
            }
            let layer: LayerSettings = (<LayerSettings>this.maps.layersCollection[layerIndex]);
            let markerVisible: boolean = (legend.type === 'Layers' ? layer.visible :
            legend.type === 'Markers' ? layer.markerSettings[parseFloat(target.id.split('_MarkerIndex_')[1].split('_')[0])].visible :
                (this.maps.getBubbleVisible(<LayerSettings>this.maps.layersCollection[layerIndex])));
            if (legend.visible && this.legendRenderingCollections.length > 0
                && legend.mode === 'Interactive' && markerVisible
            ) {
                let svgRect: ClientRect = this.maps.svgObject.getBoundingClientRect();
                for (let i: number = 0; i < this.legendCollection.length; i++) {
                    let currentData: Object = this.legendCollection[i];
                    let legendElement: Element = querySelector(this.maps.element.id + '_Legend_Index_' + i, this.maps.element.id);
                    let legendRect: ClientRect = <ClientRect>legendElement.getBoundingClientRect();
                    let rect: Rect = new Rect(
                        Math.abs(legendRect.left - svgRect.left), Math.abs(legendRect.top - svgRect.top),
                        legendRect.width, legendRect.height
                    );
                    fill = legendElement.getAttribute('fill');
                    stroke = legend.shapeBorder.color;
                    strokeWidth = legend.shapeBorder.width;
                    if (!isNullOrUndefined(currentData['data'])) {
                        let data: Object[] = <Object[]>currentData['data'];
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
        let path: string; let pathOptions: PathOption;
        let locX: number; let locY: number;
        let height: number = 10; let width: number = 10;
        let direction: string = (legend.orientation === 'None') ? (legend.position === 'Top' || legend.position === 'Bottom')
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
        pathOptions = new PathOption(id, fill, strokeWidth, stroke, 1, '', path);
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

    private legendClick(targetEle: Element): void {
        let legendShapeId: Element;
        let legendTextId: Element;
        let legendTextColor: string;
        let legendToggleFill: string = this.maps.legendSettings.toggleLegendSettings.fill;
        let legendToggleOpacity: number = this.maps.legendSettings.toggleLegendSettings.opacity;
        let legendToggleBorderColor: string = this.maps.legendSettings.toggleLegendSettings.border.color;
        let legendToggleBorderWidth: number = this.maps.legendSettings.toggleLegendSettings.border.width; 
        if (targetEle.parentElement.id.indexOf(this.maps.element.id + '_Legend_Index_') > -1) {
            let mapElement: Element;
            let legendIndex: number = parseFloat(targetEle.parentElement.id.substr((this.maps.element.id + '_Legend_Index_').length));
            let selectedItem: object[] = this.legendCollection[legendIndex]['data'];
            let isVisible: boolean = selectedItem['_isVisible'];
            let shape: object;            
            if ( this.maps.legendSettings.toggleLegendSettings.enable && this.maps.legendSettings.type === "Bubbles") {
                for (let k: number = 0; k < this.maps.layers.length; k++) {
                    for (let j: number = 0; j < this.maps.layers[k].bubbleSettings.length; j++) {
                        for (let i: number = 0; i < selectedItem.length; i++) {
                            shape = this.legendCollection[legendIndex]['data'][i];                     
                            mapElement = querySelector(this.maps.element.id + '_LayerIndex_' + shape['layerIndex'] +
                            '_BubbleIndex_' + j + '_dataIndex_' + shape['dataIndex'], this.maps.element.id);
                            if (isVisible && mapElement !== null) {
                                if (this.maps.legendSettings.toggleLegendSettings.applyShapeSettings) {
                                    mapElement.setAttribute('fill', this.maps.layers[k].shapeSettings.fill);
                                    mapElement.setAttribute('stroke', this.maps.layers[k].shapeSettings.border.color);
                                    mapElement.setAttribute('opacity', (this.maps.layers[k].shapeSettings.opacity).toString());
                                    mapElement.setAttribute('stroke-width', (this.maps.layers[k].shapeSettings.border.width).toString());
                                } else {
                                    mapElement.setAttribute("fill", legendToggleFill);
                                    mapElement.setAttribute("opacity", (legendToggleOpacity).toString());
                                    mapElement.setAttribute('stroke', legendToggleBorderColor);
                                    mapElement.setAttribute('stroke-width', (legendToggleBorderWidth).toString());
                                }
                                if (targetEle !== null) {
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Shape_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute("fill", "#E5E5E5");
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Text_Index_' + legendIndex, this.maps.element.id);
                                    legendTextId.setAttribute("fill", "#E5E5E5");
                                }                                      
                            } else {
                                mapElement.setAttribute('fill', this.legendCollection[legendIndex]['fill']);
                                mapElement.setAttribute('stroke', this.maps.layers[k].bubbleSettings[j].border.color);
                                mapElement.setAttribute('opacity', (this.maps.layers[k].bubbleSettings[j].opacity).toString());
                                mapElement.setAttribute('stroke-width', (this.maps.layers[k].bubbleSettings[j].border.width).toString());
                                if (targetEle !== null) {
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Shape_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute("fill", this.legendCollection[legendIndex]['fill']);
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Text_Index_' + legendIndex, this.maps.element.id);
                                    legendTextId.setAttribute("fill", "#757575");
                                }
                                
                            }
                        }
                        selectedItem['_isVisible'] = isVisible ? false : true;
                    }
                }                
            }                       
             if ( this.maps.legendSettings.type === "Layers" && this.maps.legendSettings.toggleLegendSettings.enable) {
                let layerElement: Element;
                for (let k: number = 0; k < this.maps.layers.length; k++) {
                    for (let i: number = 0; i < selectedItem.length; i++) {
                        shape = this.legendCollection[legendIndex]['data'][i];                     
                        layerElement = querySelector(this.maps.element.id + '_LayerIndex_' + shape['layerIndex'] +
                        '_shapeIndex_' + shape['shapeIndex'] + '_dataIndex_' + shape['dataIndex'], this.maps.element.id);
                        if(layerElement !== null) {
                            if (isVisible) {
                                if (this.maps.legendSettings.toggleLegendSettings.applyShapeSettings) {
                                        layerElement.setAttribute('fill', this.maps.layers[k].shapeSettings.fill);
                                        layerElement.setAttribute('opacity', (this.maps.layers[k].shapeSettings.opacity).toString());
                                        layerElement.setAttribute('stroke', this.maps.layers[k].shapeSettings.border.color);
                                        layerElement.setAttribute('stroke-width', (this.maps.layers[k].shapeSettings.border.width).toString());
                                       } else {
                                        layerElement.setAttribute("fill", legendToggleFill);
                                        layerElement.setAttribute("opacity", (legendToggleOpacity).toString());
                                        layerElement.setAttribute('stroke', legendToggleBorderColor);
                                        layerElement.setAttribute('stroke-width', (legendToggleBorderWidth).toString());
                                       }                                                  
                                if (targetEle !== null) {
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Text_Index_' + legendIndex, this.maps.element.id);
                                    legendTextId.setAttribute("fill", "#E5E5E5");
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Shape_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute("fill", "#E5E5E5");
                                }                         
                           } else {
                                layerElement.setAttribute('fill', this.legendCollection[legendIndex]['fill']);
                                layerElement.setAttribute('opacity', (this.maps.layers[k].shapeSettings.opacity).toString());
                                layerElement.setAttribute('stroke', this.maps.layers[k].shapeSettings.border.color);
                                layerElement.setAttribute('stroke-width', (this.maps.layers[k].shapeSettings.border.width).toString());                         
                                if (targetEle !== null) {
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Text_Index_' + legendIndex, this.maps.element.id);
                                    legendTextId.setAttribute("fill", "#757575");
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Shape_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute("fill", this.legendCollection[legendIndex]['fill']);
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
                    let legendIndex: number = parseFloat(targetEle.id.substr((this.maps.element.id + '_Legend_Index_').length));
                    let mapdata: object;
                    let selectedItem: object[] = this.legendCollection[legendIndex]['data'];           
                    let isVisible: boolean = selectedItem['_isVisible'];
                    if (this.maps.legendSettings.type === "Bubbles" && this.maps.legendSettings.toggleLegendSettings.enable) {
                        for (let k: number = 0; k < this.maps.layers.length; k++) {
                            for (let j: number = 0; j < this.maps.layers[k].bubbleSettings.length; j++) {
                                for (let i: number = 0; i < selectedItem.length; i++) {
                                    mapdata = this.legendCollection[legendIndex]['data'][i];                     
                                    LegendInteractive = querySelector(this.maps.element.id + '_LayerIndex_' + mapdata['layerIndex'] +
                                    '_BubbleIndex_' + j + '_dataIndex_' + mapdata['dataIndex'], this.maps.element.id);
                                    if (isVisible && LegendInteractive !== null) {
                                        if (this.maps.legendSettings.toggleLegendSettings.applyShapeSettings) {
                                            LegendInteractive.setAttribute('fill', this.maps.layers[k].shapeSettings.fill);
                                            LegendInteractive.setAttribute('stroke', this.maps.layers[k].shapeSettings.border.color);
                                            LegendInteractive.setAttribute('stroke-width', (this.maps.layers[k].shapeSettings.border.width).toString());
                                            LegendInteractive.setAttribute('opacity', (this.maps.layers[k].shapeSettings.opacity).toString());
                                        } else {
                                            LegendInteractive.setAttribute("fill", legendToggleFill);
                                            LegendInteractive.setAttribute("opacity", (legendToggleOpacity).toString());
                                            LegendInteractive.setAttribute('stroke', legendToggleBorderColor);
                                            LegendInteractive.setAttribute('stroke-width', (legendToggleBorderWidth).toString());
                                        }
                                        if (targetEle !== null) {
                                            legendTextId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex + '_Text', this.maps.element.id);
                                            legendTextId.setAttribute("fill", "#E5E5E5");
                                            legendShapeId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex, this.maps.element.id);
                                            legendShapeId.setAttribute("fill", "#E5E5E5");
                                        }                                  
                                    } else {
                                        LegendInteractive.setAttribute('fill', this.legendCollection[legendIndex]['fill']);
                                        LegendInteractive.setAttribute('stroke', this.maps.layers[k].bubbleSettings[j].border.color);
                                        LegendInteractive.setAttribute('stroke-width', (this.maps.layers[k].bubbleSettings[j].border.width).toString());
                                        LegendInteractive.setAttribute('opacity', (this.maps.layers[k].bubbleSettings[j].opacity).toString());
                                        if (targetEle !== null) {
                                            legendShapeId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex, this.maps.element.id);
                                            legendShapeId.setAttribute("fill", this.legendCollection[legendIndex]['fill']);
                                            legendTextId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex + '_Text', this.maps.element.id);
                                            legendTextId.setAttribute("fill", "#757575");
                                        }
                                    }  
                                }
                                selectedItem['_isVisible'] = isVisible ? false : true;
                            }
                        }                
                    }                       
                    if ( this.maps.legendSettings.type === "Layers" && this.maps.legendSettings.toggleLegendSettings.enable) {
                        let mapLegendElement: Element;
                        for (let k: number = 0; k < this.maps.layers.length; k++) {
                            for (let i: number = 0; i < selectedItem.length; i++) {
                                mapdata = this.legendCollection[legendIndex]['data'][i];                     
                                mapLegendElement = querySelector(this.maps.element.id + '_LayerIndex_' + mapdata['layerIndex'] +
                                '_shapeIndex_' + mapdata['shapeIndex'] + '_dataIndex_' + mapdata['dataIndex'], this.maps.element.id);
                                if(mapLegendElement !== null) {
                                    if (isVisible) {                                    
                                        if (this.maps.legendSettings.toggleLegendSettings.applyShapeSettings) {
                                            mapLegendElement.setAttribute('fill', this.maps.layers[0].shapeSettings.fill);
                                            mapLegendElement.setAttribute('stroke', this.maps.layers[0].shapeSettings.border.color);
                                            mapLegendElement.setAttribute('opacity', (this.maps.layers[k].shapeSettings.opacity).toString());
                                            mapLegendElement.setAttribute('stroke-width', (this.maps.layers[k].shapeSettings.border.width).toString());
                                        } else {
                                            mapLegendElement.setAttribute("fill", legendToggleFill);
                                            mapLegendElement.setAttribute("opacity", (legendToggleOpacity).toString());
                                            mapLegendElement.setAttribute('stroke', legendToggleBorderColor);
                                            mapLegendElement.setAttribute('stroke-width', (legendToggleBorderWidth).toString());
                                        }
                                        if (targetEle !== null) {
                                            legendShapeId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex, this.maps.element.id);
                                            legendShapeId.setAttribute("fill", "#E5E5E5");
                                            legendTextId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex + '_Text', this.maps.element.id);
                                            legendTextId.setAttribute("fill", "#E5E5E5");                            
                                        }                             
                                    } else {
                                        mapLegendElement.setAttribute('fill', this.legendCollection[legendIndex]['fill']);
                                        mapLegendElement.setAttribute('stroke', this.maps.layers[0].shapeSettings.border.color);
                                        mapLegendElement.setAttribute('opacity', (this.maps.layers[k].shapeSettings.opacity).toString());
                                        mapLegendElement.setAttribute('stroke-width', (this.maps.layers[k].shapeSettings.border.width).toString());                                 
                                        if (targetEle !== null) {
                                            legendTextId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex + '_Text', this.maps.element.id);
                                            legendTextId.setAttribute("fill", "#757575");
                                            legendShapeId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex, this.maps.element.id);
                                            legendShapeId.setAttribute("fill", this.legendCollection[legendIndex]['fill']);
                                        }     
                                    }  
                                }    
                            }
                        }                 
                        selectedItem['_isVisible'] = isVisible ? false : true;
                    }
                }
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
        layerIndex: number, dataIndex: number, data: Object, dataPath: string,
        layerData: Object[], shapePropertyPath: string | string[], value: string | number
    ): Object[] {
        let legendData: Object[] = [];
        if (Object.prototype.toString.call(layerData) === '[object Array]') {
            for (let i: number = 0; i < layerData.length; i++) {
                let shapeData: Object = layerData[i];
                let shapePath: string = checkPropertyPath(data[dataPath], shapePropertyPath, shapeData['properties']);
                if (shapeData['properties'][shapePath] === data[dataPath]) {
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
        let xmlns: string = 'http://www.w3.org/2000/svg';
        if (!isNullOrUndefined(colorMap.color) && typeof (colorMap.color) === 'object') {
            let linerGradientEle: Element = document.createElementNS(xmlns, 'linearGradient');
            let opacity: number = 1; let position: LegendPosition = this.maps.legendSettings.position;
            let x2: string; let y2: string;
            x2 = position === 'Top' || position === 'Bottom' ? '100' : '0';
            y2 = position === 'Top' || position === 'Bottom' ? '0' : '100';
            linerGradientEle.setAttribute('id', 'linear_' + legendIndex);
            linerGradientEle.setAttribute('x1', 0 + '%');
            linerGradientEle.setAttribute('y1', 0 + '%');
            linerGradientEle.setAttribute('x2', x2 + '%');
            linerGradientEle.setAttribute('y2', y2 + '%');
            for (let b: number = 0; b < colorMap.color.length; b++) {
                let offsetColor: number = 100 / (colorMap.color.length - 1);
                let stopEle: Element = document.createElementNS(xmlns, 'stop');
                stopEle.setAttribute('offset', b * offsetColor + '%');
                stopEle.setAttribute('stop-color', colorMap.color[b]);
                stopEle.setAttribute('stop-opacity', opacity.toString());
                linerGradientEle.appendChild(stopEle);
            }
            this.legendLinearGradient = linerGradientEle;
            let color: string = 'url(' + '#linear_' + legendIndex + ')';
            this.defsElement.appendChild(linerGradientEle);
            legendFillColor = color;
        }
        return legendFillColor;
    }


    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'Legend';
    }

    /**
     * To destroy the legend.
     * @return {void}
     * @private
     */
    public destroy(maps: Maps): void {
        /**
         * Destroy method performed here
         */
        this.removeEventListener();
    }
}