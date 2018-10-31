import { Maps } from '../../index';
import {
    LayerSettings, ColorMappingSettings, BorderModel, LegendPosition, FontModel, LegendSettingsModel,
    click, IShapeSelectedEventArgs, shapeSelected, ILegendRenderingEventArgs, legendRendering,
    MarkerSettingsModel, MarkerSettings, LegendShape, LabelPosition, LabelIntersectAction
} from '../index';
import { LegendArrangement, LegendMode } from '../index';
import {
    Rect, measureText, CircleOption, PathOption, textTrim,
    removeClass, createStyle, querySelector, getTemplateFunction
} from '../utils/helper';
import { RectOption, Size, TextOption, Point, renderTextElement, drawSymbol } from '../utils/helper';
import { isNullOrUndefined, SvgRenderer, Browser, EventHandler, remove } from '@syncfusion/ej2-base';

/**
 * Legend module is used to render legend for the maps
 */
export class Legend {
    /* tslint:disable:no-string-literal */
    public legendCollection: Object[];
    public legendRenderingCollections: Object[];
    private legendHeight: number;
    private legendWidth: number;
    private translate: Point;
    private legendBorderRect: Rect = new Rect(0, 0, 0, 0);
    private maps: Maps;
    private totalPages: Object[] = [];
    private page: number = 0;
    private currentPage: number = 0;
    private interactiveLocation: Point = new Point(0, 0);
    private legendItemRect: Rect = new Rect(0, 0, 0, 0);
    private heightIncrement: number = 0;
    private widthIncrement: number = 0;
    private textMaxWidth: number = 0;
    private legendGroup: Element;
    private previousId: string;
    private areaRect: Rect = new Rect(0, 0, 0, 0);
    constructor(maps: Maps) {
        this.maps = maps;
        this.addEventListener();
    }
    /**
     * To calculate legend bounds and draw the legend shape and text.
     */
    public renderLegend(): void {
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
                let propertyPath: string = layer.shapePropertyPath;
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
                this.legendItemRect = { x: itemStartX, y: itemStartY, width: legendWidth, height: legendHeight };
            } else {
                legendWidth = (isNullOrUndefined(legendWidth)) ? map.mapAreaRect.width : legendWidth;
                legendHeight = (isNullOrUndefined(legendHeight)) ? map.mapAreaRect.height : legendHeight;
                let j: number = 0;
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
        dataPath: string, colorValuePath: string, propertyPath: string
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
                map.trigger(legendRendering, eventArgs);
                let rectOptions: RectOption = new RectOption(itemId, eventArgs.fill, eventArgs.shapeBorder, 1, bounds);
                textOptions = new TextOption(textId, textLocation.x, textLocation.y, 'middle', item['text'], '', '');
                renderTextElement(textOptions, textFont, textFont.color, this.legendGroup);
                this.legendGroup.appendChild(render.drawRectangle(rectOptions));
            }
            this.renderLegendBorder();
        } else {
            this.drawLegendItem(this.currentPage);
        }
    }

    private drawLegendItem(page: number): void {
        let map: Maps = this.maps;
        let legend: LegendSettingsModel = <LegendSettingsModel>map.legendSettings;
        let spacing: number = 10;
        let shapeSize: Size = new Size(legend.shapeWidth, legend.shapeHeight);
        let textOptions: TextOption;
        let renderOptions: CircleOption | PathOption | RectOption;
        let render: SvgRenderer = map.renderer;
        let shapeBorder: BorderModel = legend.shapeBorder;
        let eventArgs: ILegendRenderingEventArgs = {
            name: legendRendering, cancel: false, fill: '', shape: legend.shape
        };
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
                map.trigger(legendRendering, eventArgs);
                let shapeId: string = map.element.id + '_Legend_Shape_Index_' + i;
                let textId: string = map.element.id + '_Legend_Text_Index_' + i;
                let shapeLocation: Point = collection['Shape'];
                let textLocation: Point = collection['Text'];
                let imageUrl: string = ((isNullOrUndefined(collection['ImageSrc'])) ? legend.shape : collection['ImageSrc']);
                let renderOptions: PathOption = new PathOption(
                    shapeId, eventArgs.fill, eventArgs.shapeBorder.width, eventArgs.shapeBorder.color, 1, ''
                );
                legendElement.appendChild(drawSymbol(shapeLocation, eventArgs.shape, shapeSize, collection['ImageSrc'], renderOptions));
                textOptions = new TextOption(textId, textLocation.x, textLocation.y, 'start', legendText, '', '');
                renderTextElement(textOptions, legend.textStyle, legend.textStyle.color, legendElement);
                this.legendGroup.appendChild(legendElement);
            }
            let pagingGroup: Element;
            let width: number = spacing; let height: number = (spacing / 2);
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
                let leftPageOptions: PathOption = new PathOption(map.element.id + '_Left_Page', '#a6a6a6', 0, '#a6a6a6', 1, '', leftPath);
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
    }

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
            textOptions = new TextOption(
                map.element.id + '_LegendTitle',
                (this.legendItemRect.x) + (this.legendItemRect.width / 2),
                this.legendItemRect.y - (textSize.height / 2),
                'middle', trimTitle, '');
            renderTextElement(textOptions, textStyle, textStyle.color, this.legendGroup);
        }
        let renderOptions: RectOption = new RectOption(
            map.element.id + '_Legend_Border', legend.background, legend.border, 1, this.legendBorderRect, null, null, '', ''
        );
        this.legendGroup.appendChild(map.renderer.drawRectangle(renderOptions));
        this.translate = (legend.position !== 'Float') ?
            this.getLegendAlignment(map, this.legendBorderRect.width, this.legendBorderRect.height, legend) : legend.location;
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

    private getLegendAlignment(map: Maps, width: number, height: number, legend: LegendSettingsModel): Point {
        let x: number; let y: number;
        let spacing: number = 10;
        let totalWidth: number = map.availableSize.width;
        let totalHeight: number = map.availableSize.height;
        switch (legend.position) {
            case 'Top':
            case 'Bottom':
                map.mapAreaRect.height = (map.mapAreaRect.height - height);
                x = (totalWidth / 2) - (width / 2);
                y = (legend.position === 'Top') ? map.mapAreaRect.y : (map.mapAreaRect.y + map.mapAreaRect.height);
                map.mapAreaRect.y = (legend.position === 'Top') ? map.mapAreaRect.y + height + spacing : map.mapAreaRect.y;
                break;
            case 'Left':
            case 'Right':
                map.mapAreaRect.width = (map.mapAreaRect.width - width);
                x = (legend.position === 'Left') ? map.mapAreaRect.x : map.mapAreaRect.x + map.mapAreaRect.width;
                y = (totalHeight / 2) - (height / 2);
                map.mapAreaRect.x = (legend.position === 'Left') ? map.mapAreaRect.x + width : map.mapAreaRect.x;
                break;
        }
        switch (legend.alignment) {
            case 'Near':
                if (legend.position === 'Top' || legend.position === 'Bottom') {
                    x = map.mapAreaRect.x;
                } else {
                    y = map.mapAreaRect.y;
                }
                break;
            case 'Far':
                if (legend.position === 'Top' || legend.position === 'Bottom') {
                    x = totalWidth - width;
                } else {
                    y = totalHeight - height;
                }
                break;
        }
        return new Point(x, y);
    }

    private getMarkersLegendCollections(layerIndex: number, markers: MarkerSettingsModel[]): void {
        markers.forEach((marker: MarkerSettings, markerIndex: number) => {
            let dataSource: Object[] = marker.dataSource;
            let field: string = marker.legendText;
            let templateFn: Function;
            dataSource.forEach((data: Object, dataIndex: number) => {
                let imageSrc: string = null;
                if (marker.visible && (!isNullOrUndefined(data['latitude'])) && (!isNullOrUndefined(data['longitude']))) {
                    if (marker.template) {
                        templateFn = getTemplateFunction(marker.template);
                        let templateElement: Element = templateFn(this.maps);
                        let markerEle: Element = isNullOrUndefined(templateElement.childElementCount) ? templateElement[0] :
                            templateElement;
                        imageSrc = markerEle.querySelector('img').src;
                    }
                    let text: string = isNullOrUndefined(data[field]) ? '' : data[field];
                    this.legendCollection.push({
                        layerIndex: layerIndex, markerIndex: markerIndex, dataIndex: dataIndex,
                        fill: marker.fill, text: text, imageSrc: imageSrc
                    });
                }
            });
        });
    }

    private getRangeLegendCollection(
        layerIndex: number, layerData: Object[], colorMapping: ColorMappingSettings[], dataSource: Object[],
        dataPath: string, colorValuePath: string, propertyPath: string
    ): void {
        let legendText: string;
        let fill: string = this.maps.legendSettings.fill;
        for (let colorMap of colorMapping) {
            if (!isNullOrUndefined(colorMap.from) && !isNullOrUndefined(colorMap.to)) {
                legendText = !isNullOrUndefined(colorMap.label) ? colorMap.label : colorMap.from + ' - ' + colorMap.to;
                let rangeData: Object[] = [];
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
                let legendFill: string = (isNullOrUndefined(fill)) ? colorMap.color : fill;
                this.getOverallLegendItemsCollection(legendText, legendFill, rangeData);
            }
        }
    }

    private getOverallLegendItemsCollection(legendText: string, legendFill: string, legendData: Object[]): void {
        let newColllection: Object[] = [];
        if (legendData.length > 0) {
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
            this.legendCollection.push({ text: legendText, fill: legendFill, data: newColllection });
        }
    }

    private getEqualLegendCollection(
        layerIndex: number, layerData: Object[], colorMapping: ColorMappingSettings[], dataSource: Object[],
        dataPath: string, colorValuePath: string, propertyPath: string
    ): void {
        let fill: string = this.maps.legendSettings.fill;
        let legendText: string;
        for (let colorMap of colorMapping) {
            if (!isNullOrUndefined(colorMap.value)) {
                legendText = !isNullOrUndefined(colorMap.label) ? colorMap.label : colorMap.value;
                let equalData: Object[] = [];
                let eqaulColorProcess: boolean = false;
                dataSource.forEach((data: Object, dataIndex: number) => {
                    let equalValue: string = data[colorValuePath];
                    if (equalValue === colorMap.value) {
                        eqaulColorProcess = true;
                        equalData.push(this.getLegendData(layerIndex, dataIndex, data, dataPath, layerData, propertyPath, equalValue));
                    }
                });
                if (!eqaulColorProcess) {
                    equalData.push({
                        layerIndex: layerIndex, shapeIndex: null, dataIndex: null,
                        name: null, value: null
                    });
                }
                let legendFill: string = (isNullOrUndefined(fill)) ? colorMap.color : fill;
                this.getOverallLegendItemsCollection(legendText, legendFill, equalData);
            }
        }
    }

    private getDataLegendCollection(
        layerIndex: number, layerData: Object[], colorMapping: ColorMappingSettings[], dataSource: Object[],
        dataPath: string, colorValuePath: string, propertyPath: string
    ): void {
        let legendText: string;
        let fill: string = this.maps.legendSettings.fill;
        if (!isNullOrUndefined(colorValuePath)) {
            dataSource.forEach((data: Object, dataIndex: number) => {
                let dataValue: string = data[colorValuePath];
                let newData: Object[] = [];
                let legendFill: string = (isNullOrUndefined(fill)) ? dataValue : fill;
                if (!isNullOrUndefined(dataValue) && colorMapping.length === 0) {
                    legendText = data[dataPath];
                    newData.push(this.getLegendData(layerIndex, dataIndex, data, dataPath, layerData, propertyPath, dataValue));
                }
                this.getOverallLegendItemsCollection(legendText, legendFill, newData);
            });
        }
    }

    public interactiveHandler(e: PointerEvent): void {
        let target: Element = <Element>e.target;
        let legend: LegendSettingsModel = <LegendSettingsModel>this.maps.legendSettings;
        let id: string = this.maps.element.id + '_Interactive_Legend';
        let hoverId: string = legend.type === 'Layers' ? '_ShapeIndex_' : (legend.type === 'Markers') ? '_MarkerIndex_' :
            '_BubbleIndex_';
        if (target.id.indexOf(hoverId) > 1) {
            let layerIndex: number = parseFloat(target.id.split('_')[2]);
            let dataIndex: number = parseFloat(target.id.split('_')[6]);
            let fill: string; let stroke: string; let strokeWidth: number;
            if (!(isNullOrUndefined(querySelector(id, this.maps.element.id)))) {
                remove(querySelector(id, this.maps.element.id));
            }
            let layer: LayerSettings = (<LayerSettings>this.maps.layersCollection[layerIndex]);
            if (legend.visible && this.legendRenderingCollections.length > 0
                && legend.mode === 'Interactive' && (legend.type === 'Layers' ? layer.visible :
                    legend.type === 'Markers' ? layer.markerSettings[parseFloat(target.id.split('_')[4])].visible :
                        (this.maps.getBubbleVisible(<LayerSettings>this.maps.layersCollection[layerIndex])))
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

        // this.maps.on(click, this.legendClick, this);
    }



    // private legendClick(targetEle: Element): void {
    //     if (targetEle.parentElement.id.indexOf(this.maps.element.id + '_Legend_Index_') > -1) {
    //         let mapElement: Element;
    //         let data: object;
    //         let legendIndex: number = parseFloat(targetEle.parentElement.id.substr((this.maps.element.id + '_Legend_Index_').length));
    //         let selectedItem: object[] = this.legendCollection[legendIndex]['data'];
    //         let childElement: Element;
    //         let isVisible: boolean = selectedItem['_isVisible'];
    //         if (this.maps.legendSettings.toggleVisibility) {
    //             for (let i: number = 0; i < selectedItem.length; i++) {
    //                 data = this.legendCollection[legendIndex]['data'][i];
    //                 mapElement = querySelector(
    //                     this.maps.element.id + '_LayerIndex_' + data['layerIndex'] +
    //                     '_ShapeIndex_' + data['shapeIndex'] + '_dataIndex_' + data['dataIndex'],
    //                     this.maps.element.id);
    //                 if (isVisible) {
    //                     mapElement.setAttribute('opacity', '0');
    //                 } else {
    //                     mapElement.setAttribute('opacity', '1');
    //                 }
    //             }
    //             selectedItem['_isVisible'] = isVisible ? false : true;
    //         } else if (this.maps.legendSettings.legendSelection && this.maps.selectionSettings.enable) {
    //             this.selectShapes(targetEle, legendIndex);
    //         }
    //     }
    // }
    // private selectShapes(targetEle: Element, legendIndex: number): void {
    //     let mapElement: Element;
    //     let selectedElements: NodeListOf<Element>;
    //     let selectedLength: number;
    //     let childElement: HTMLElement = targetEle.parentElement.childNodes[0] as HTMLElement;
    //     let legendSelected: boolean = targetEle.parentElement.id.indexOf('_Legend_Index_') &&
    //         childElement.getAttribute('class') ? true : false;
    //     if (!this.maps.selectionSettings.enableMultiSelect) {
    //         selectedElements = querySelectorAll('selectionMapStyle', document.body);
    //         selectedLength = selectedElements.length;
    //         for (let i: number = 0; i < selectedLength; i++) {
    //             removeClass(selectedElements[selectedElements.length - 1]);
    //         }
    //         if (!legendSelected) {
    //             this.select(legendIndex, targetEle);
    //         }
    //     } else {
    //         if (legendSelected) {
    //             for (let data of this.legendCollection[legendIndex]['data']) {
    //                 mapElement = querySelector(
    //                     this.maps.element.id + '_LayerIndex_' + data['layerIndex'] +
    //                     '_ShapeIndex_' + data['shapeIndex'] + '_dataIndex_' + data['dataIndex'],
    //                     this.maps.element.id);
    //                 removeClass(mapElement);
    //             }
    //             removeClass(childElement);
    //         } else {
    //             this.select(legendIndex, targetEle);
    //         }
    //     }
    // }
    // private select(legendIndex: number, targetEle: Element): void {
    //     let mapElement: Element;
    //     let childElement: HTMLElement = targetEle.parentElement.childNodes[0] as HTMLElement;
    //     for (let i: number = 0; i < this.legendCollection.length; i++) {
    //         if (i === legendIndex && !childElement.getAttribute('class')) {
    //             for (let data of this.legendCollection[i]['data']) {
    //                 mapElement = querySelector(
    //                     this.maps.element.id + '_LayerIndex_' + data['layerIndex'] +
    //                     '_ShapeIndex_' + data['shapeIndex'] + '_dataIndex_' + data['dataIndex'],
    //                     this.maps.element.id);
    //                 let eventArgs: IShapeSelectedEventArgs = {
    //                     cancel: false,
    //                     name: shapeSelected,
    //                     fill: this.maps.selectionSettings.fill,
    //                     opacity: this.maps.selectionSettings.opacity,
    //                     border: this.maps.selectionSettings.border
    //                 };
    //                 if (!document.getElementById('selectionMap')) {
    //                     document.body.appendChild(createStyle('selectionMap', 'selectionMapStyle', eventArgs));
    //                 }
    //                 mapElement.setAttribute('class', 'selectionMapStyle');
    //             }
    //             childElement.setAttribute('class', 'selectionMapStyle');
    //         }
    //     }
    // }


    public removeEventListener(): void {
        if (this.maps.isDestroyed) {
            return;
        }
        this.maps.off(Browser.touchMoveEvent, this.interactiveHandler);
        this.maps.off(Browser.touchEndEvent, this.interactiveHandler);
        // this.maps.off(click, this.legendClick);
    }

    private getLegendData(
        layerIndex: number, dataIndex: number, data: Object, dataPath: string,
        layerData: Object[], shapePropertyPath: string, value: string | number
    ): Object[] {
        let legendData: Object[] = [];
        if (Object.prototype.toString.call(layerData) === '[object Array]') {
            for (let i: number = 0; i < layerData.length; i++) {
                let shapeData: Object = layerData[i];
                if (shapeData['properties'][shapePropertyPath] === data[dataPath]) {
                    legendData.push({
                        layerIndex: layerIndex, shapeIndex: i, dataIndex: dataIndex,
                        name: data[dataPath], value: value
                    });
                }
            }
        }
        return legendData;
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