import { Property, ChildProperty, Complex, LinearGradient, Browser, createElement } from '@syncfusion/ej2-base';
import { HeatMap } from '../heatmap';
import { DrawSvgCanvas, TextOption, TextBasic, PathOption, Line, LineOption, GradientPointer, CurrentLegendRect } from '../utils/helper';
import { Size, measureText, getTitle, getElement, CanvasTooltip } from '../utils/helper';
import { LegendPosition, Alignment, LabelDisplayType } from '../utils/enum';
import { BorderModel, FontModel } from '../model/base-model';
import { Font, LegendColorCollection, BubbleTooltipData, ColorCollection } from '../model/base';
import { Rect, RectOption, Gradient, GradientColor, showTooltip, stringToNumber } from '../utils/helper';
import { Axis } from '../axis/axis';
import { Theme } from '../model/theme';
import { LegendSettingsModel } from './legend-model';
import { CurrentRect } from '../utils/helper';
import { Tooltip as tool } from '@syncfusion/ej2-svg-base';

/**
 * Configures the Legend
 */
export class LegendSettings extends ChildProperty<LegendSettings> {
    /**
     * Specifies the height of Legend.
     * @default ''
     */
    @Property('')
    public height: string;

    /**
     * Specifies the width of Legend.
     * @default ''
     */
    @Property('')
    public width: string;

    /**
     * Specifies the position of Legend to render.
     * @default 'Right'
     */
    @Property('Right')
    public position: LegendPosition;

    /**
     * Specifies whether the Legend should be visible or not.
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * Specifies the alignment of the legend
     * @default 'Center'
     */
    @Property('Center')
    public alignment: Alignment;

    /**
     * Specifies whether the label should be visible or not.
     * @default true
     */
    @Property(true)
    public showLabel: boolean;

    /**
     * Specifies whether the gradient pointer should be visible or not.
     * @default true
     */
    @Property(true)
    public showGradientPointer: boolean;

    /**
     * Specifies whether smart legend should be displayed or not when palette type is fixed.
     * @default false
     */
    @Property(false)
    public enableSmartLegend: boolean;

    /**
     * Specifies the type of label display for smart legend.
     * * All:  All labels are displayed.
     * * Edge: Labels will be displayed only at the edges of the legend.
     * * None: No labels are displayed. 
     * @default 'All'
     */
    @Property('All')
    public labelDisplayType: LabelDisplayType;

    /**
     * Specifies the legend label style. 
     * @default ''
     */
    @Complex<FontModel>(Theme.legendLabelFont, Font)
    public textStyle: FontModel;
}

/**
 * 
 * The `Legend` module is used to render legend for the heatmap.
 */
export class Legend {
    private heatMap: HeatMap;
    private drawSvgCanvas: DrawSvgCanvas;
    private legend: Element;
    private legendGroup: Rect;
    public legendRectScale: Rect;
    public maxLegendLabelSize: Size = new Size(0, 0);
    public gradientPointer: HTMLElement;
    private legendHeight: string;
    private legendWidth: string;
    private height: number;
    private width: number;
    private legendRectPadding: number;
    private gradientScaleSize: number = 10;
    private segmentCollections: number[] = [];
    private textWrapCollections: number[] = [];
    public labelCollections: string[] = [];
    private legendMinValue: number;
    private legendMaxValue: number;
    private legendSize: number = 10;
    public previousOptions: GradientPointer = new GradientPointer(0, 0, 0, 0, 0, 0);
    public listPerPage: number = 0;
    private numberOfPages: number = 1;
    private listHeight: number;
    private listWidth: number = 0;
    private legendScale: Element;
    public fillRect: Rect = new Rect(0, 0, 0, 0);
    private legendRect: Rect = new Rect(0, 0, 0, 0);
    public currentPage: number = 1;
    private lastList: number[] = [];
    public navigationCollections: Rect[] = [];
    private pagingRect: Rect = new Rect(0, 0, 0, 0);
    private labelPadding: number;
    private paginggroup: Element;
    private translategroup: Element;
    private listInterval: number = 10; // padding between two lists
    public legendLabelTooltip: CanvasTooltip[] = [];
    private numberOfRows: number;
    private labelXCollections: number[] = [];
    private labelYCollections: number[] = [];
    private legendXCollections: number[] = [];
    private legendYCollections: number[] = [];
    /** @private */
    public legendRectPositionCollection: CurrentLegendRect[] = [];
    /** @private */
    public tooltipObject: tool;
    constructor(heatMap?: HeatMap) {
        this.heatMap = heatMap;
        this.drawSvgCanvas = new DrawSvgCanvas(heatMap);
    };

   /**
    * Get module name
    */
    protected getModuleName(): string {
        return 'Legend';
    }
    /**
     * To destroy the Legend.
     * @return {void}
     * @private
     */
    public destroy(heatMap: HeatMap): void {
        /**
         * destory code
         */
    };
    /**
     * @private
     */
    public renderLegendItems(): void {
        let heatMap: HeatMap = this.heatMap;
        let tempBorder: BorderModel = {
            color: 'transparent',
            width: 0,
        };
        this.legend = heatMap.renderer.createGroup({ id: heatMap.element.id + '_Heatmap_Legend' });
        let rectItems: RectOption = new RectOption(heatMap.element.id + '_LegendBound', 'none', tempBorder, 1, this.legendGroup);
        this.drawSvgCanvas.drawRectangle(rectItems, this.legend);
        let legendBound: Rect = this.legendRectScale;
        let rectItemsSvg: Rect = new Rect(legendBound.x, legendBound.y, legendBound.width, legendBound.height);
        if (heatMap.paletteSettings.type === 'Gradient' || (heatMap.paletteSettings.type === 'Fixed' &&
            heatMap.legendSettings.enableSmartLegend === true)) {
            if (heatMap.paletteSettings.type === 'Gradient') {
                let fill: string;
                if (heatMap.enableCanvasRendering) {
                    let grd: CanvasGradient; let ctx: CanvasRenderingContext2D = heatMap.canvasRenderer.ctx;
                    if (heatMap.horizontalGradient) {
                        grd = ctx.createLinearGradient(legendBound.x, 0, legendBound.x + legendBound.width, 0);
                    } else {
                        grd = ctx.createLinearGradient(0, legendBound.y, 0, legendBound.y + legendBound.height);
                    }
                    for (let i: number = 0; i < heatMap.legendColorCollection.length; i++) {
                        let value: number = ((heatMap.legendColorCollection[i].value - this.legendMinValue) /
                            (this.legendMaxValue - this.legendMinValue));
                        value = isNaN(value) ? 0 : value;
                        grd.addColorStop(value, heatMap.legendColorCollection[i].color);
                    }
                    ctx.fillStyle = grd;
                    fill = grd.toString();
                } else {
                    let gradientOptions: LinearGradient; let gradientColor: GradientColor;
                    let cgradientColors: GradientColor[] = [];
                    for (let i: number = 0; i < heatMap.legendColorCollection.length; i++) {
                        let gradientPercentage: number = ((heatMap.legendColorCollection[i].value - this.legendMinValue) /
                            (this.legendMaxValue - this.legendMinValue)) * 100;
                        gradientPercentage = isNaN(gradientPercentage) ? 0 : gradientPercentage;
                        gradientColor = new GradientColor(
                            heatMap.legendColorCollection[i].color, gradientPercentage + '%');
                        cgradientColors.push(gradientColor);
                    }
                    if (heatMap.horizontalGradient) {
                        gradientOptions = new Gradient(heatMap.element.id + '_lineargradient', '0%', '100%', '0%', '0%');
                    } else {
                        gradientOptions = new Gradient(heatMap.element.id + '_lineargradient', '0%', '0%', '0%', '100%');
                    }
                    let linearGradient: Element = heatMap.renderer.drawGradient('linearGradient', gradientOptions, cgradientColors);
                    this.legend.appendChild(linearGradient as HTMLElement);
                    fill = 'url(#' + heatMap.element.id + '_lineargradient)';
                }
                let rectItem: RectOption = new RectOption(heatMap.element.id + '_Gradient_Legend', fill, tempBorder, 1, rectItemsSvg);
                this.drawSvgCanvas.drawRectangle(rectItem, this.legend);
                this.renderColorAxisGrid(rectItemsSvg);
            } else {
                this.renderSmartLegend();
            }
            if (!heatMap.enableCanvasRendering) {
                heatMap.svgObject.appendChild(this.legend as HTMLElement);
            }
            if (heatMap.legendSettings.showLabel && (heatMap.paletteSettings.type === 'Gradient' ||
                (heatMap.paletteSettings.type === 'Fixed' && heatMap.legendSettings.labelDisplayType !== 'None'))) {
                this.renderLegendLabel(rectItemsSvg);
            }
        } else {
            this.legendScale = heatMap.renderer.createGroup({ id: heatMap.element.id + 'Heatmap_GradientScale' });
            let listRect: RectOption = new RectOption(heatMap.element.id + '_Gradient_Scale', 'none', tempBorder, 1, this.legendRectScale);
            this.drawSvgCanvas.drawRectangle(listRect, this.legendScale);
            if (!heatMap.enableCanvasRendering) {
                this.legend.appendChild(this.legendScale);
            }
            this.translategroup = heatMap.renderer.createGroup({ id: heatMap.element.id + '_translate' });
            this.calculateListPerPage(rectItemsSvg);
            if (this.numberOfPages > 1) {
                this.paginggroup = heatMap.renderer.createGroup({ id: heatMap.element.id + '_navigation' });
            }
            this.renderListLegendMode(rectItemsSvg);
        }
    }

    private renderSmartLegend(): void {
        let heatMap: HeatMap = this.heatMap;
        let colorCollection: ColorCollection[] = heatMap.colorCollection;
        let smartLegendRect: Rect;
        let tempBorder: BorderModel = {
            color: 'transparent',
            width: 0,
        };
        let legendBound: Rect = this.legendRectScale;
        let legendX: number; let legendY: number; let legendWidth: number; let legendHeight: number;
        let width: number = legendBound.width / colorCollection.length;
        let height: number = legendBound.height / colorCollection.length;
        this.legendRectPositionCollection = [];
        for (let i: number = 0; i < colorCollection.length; i++) {
            let rectPosition: CurrentLegendRect = new CurrentLegendRect(0, 0, 0, 0, '', '');
            if (heatMap.horizontalGradient) {
                legendX = legendBound.x + (i * width);
                legendY = legendBound.y;
                legendWidth = width;
                legendHeight = legendBound.height;
                this.segmentCollections.push((heatMap.legendSettings.labelDisplayType === 'Edge' &&
                    i === colorCollection.length - 1) ? legendX + width : legendX);
            } else {
                legendX = legendBound.x;
                legendY = legendBound.y + (i * height);
                legendWidth = legendBound.width;
                legendHeight = height;
                this.segmentCollections.push((heatMap.legendSettings.labelDisplayType === 'Edge' &&
                    i === colorCollection.length - 1) ? legendY + height : legendY);
            }
            smartLegendRect = new Rect(legendX, legendY, legendWidth, legendHeight);
            let rectItem: RectOption = new RectOption(
                heatMap.element.id + '_Smart_Legend' + i, colorCollection[i].color, tempBorder, 1, smartLegendRect
            );
            this.drawSvgCanvas.drawRectangle(rectItem, this.legend);
            rectPosition.x = legendX;
            rectPosition.y = legendY;
            rectPosition.width = legendWidth;
            rectPosition.height = legendHeight;
            rectPosition.label = this.labelCollections[i];
            rectPosition.id = heatMap.element.id + '_Smart_Legend' + i;
            this.legendRectPositionCollection.push(rectPosition);
            let text: string[] = getTitle(this.labelCollections[i], heatMap.legendSettings.textStyle, this.textWrapCollections[i]);
            if (text.length !== 0 && heatMap.enableCanvasRendering) {
                let elementSize: Size = measureText(this.labelCollections[i], heatMap.legendSettings.textStyle);
                this.legendLabelTooltip.push(new CanvasTooltip(
                    this.labelCollections[i],
                    new Rect(rectPosition.x, rectPosition.y, elementSize.width, elementSize.height)));
            }
        }
    }

    private renderLegendLabel(rect: Rect): void {
        let heatMap: HeatMap = this.heatMap;
        let anchor: string; let dominantBaseline: string;
        let legendLabel: Element;
        let textWrapWidth: number = 0;
        let text: string[];
        this.legendLabelTooltip = [];
        let colorCollection: ColorCollection[] = heatMap.paletteSettings.type === 'Gradient' ?
            heatMap.legendColorCollection : heatMap.colorCollection;
        if (heatMap.enableCanvasRendering) {
            let ctx: CanvasRenderingContext2D = heatMap.canvasRenderer.ctx;
            ctx.rect(this.legendGroup.x, this.legendGroup.y, this.legendGroup.width, this.legendGroup.height);
            ctx.clip();
        } else {
            legendLabel = heatMap.renderer.createGroup({ id: heatMap.element.id + '_Heatmap_LegendLabel' });
        }
        let labelX: number; let labelY: number;
        for (let i: number = 0; i < colorCollection.length; i++) {
            let value: number = ((colorCollection[i].value - this.legendMinValue) /
                (this.legendMaxValue - this.legendMinValue)) * 100;
            if (heatMap.horizontalGradient) {
                labelX = this.segmentCollections[i];
                labelY = rect.y + rect.height + this.labelPadding;
                anchor = (value === 0) || (heatMap.paletteSettings.type === 'Fixed') ?
                    (heatMap.legendSettings.labelDisplayType === 'Edge' &&
                        i === colorCollection.length - 1) ? 'end' : 'start' : (i === colorCollection.length - 1) ? 'end' : 'middle';
                dominantBaseline = 'hanging';
            } else {
                labelX = rect.x + rect.width + this.labelPadding;
                labelY = this.segmentCollections[i];
                dominantBaseline = (value === 0) || (heatMap.paletteSettings.type === 'Fixed') ?
                    (heatMap.legendSettings.labelDisplayType === 'Edge' &&
                        i === colorCollection.length - 1) ? 'baseline' : 'hanging' :
                    (i === colorCollection.length - 1) ? 'baseline' : 'middle';
            }
            textWrapWidth = heatMap.horizontalGradient ? this.textWrapCollections[i] : this.width - (this.legendRectScale.width +
                this.labelPadding + this.legendRectPadding);
            if (this.labelCollections[i] !== '') {
                text = getTitle(this.labelCollections[i], heatMap.legendSettings.textStyle, textWrapWidth);
                if (text.length !== 0 && text[0].indexOf('...') !== -1 && heatMap.enableCanvasRendering) {
                    let elementSize: Size = measureText(text[0], heatMap.legendSettings.textStyle);
                    this.legendLabelTooltip.push(new CanvasTooltip(
                        this.labelCollections[i],
                        new Rect(labelX, labelY, elementSize.width, elementSize.height)));
                }
                let textBasic: TextBasic = new TextBasic(
                    labelX, labelY, anchor, text, 0,
                    'translate(0,0)', dominantBaseline);
                let options: TextOption = new TextOption(
                    heatMap.element.id + '_Legend_Label' + i, textBasic, heatMap.legendSettings.textStyle,
                    heatMap.legendSettings.textStyle.color || heatMap.themeStyle.legendLabel);
                if (text.length > 1) {
                    this.drawSvgCanvas.createWrapText(options, heatMap.legendSettings.textStyle, legendLabel);
                } else {
                    this.drawSvgCanvas.createText(options, legendLabel, text[0]);
                }
                if (Browser.isIE && !heatMap.enableCanvasRendering) {
                    if (dominantBaseline === 'middle') {
                        (legendLabel.lastChild as Element).setAttribute('dy', '0.6ex');
                    } else if (dominantBaseline === 'hanging') {
                        (legendLabel.lastChild as Element).setAttribute('dy', '1.5ex');
                    }
                }
            }
        }
        if (!heatMap.enableCanvasRendering) {
            this.legendGroup.height = this.legendGroup.height > 0 ? this.legendGroup.height : 0;
            this.legendGroup.width = this.legendGroup.width > 0 ? this.legendGroup.width : 0;
            this.legend.appendChild(legendLabel as HTMLElement);
            let clippath: Element = heatMap.renderer.createClipPath({ id: heatMap.element.id + '_clipPath' });
            let clipRect: Element = heatMap.renderer.drawRectangle(this.legendGroup);
            clippath.appendChild(clipRect);
            heatMap.svgObject.appendChild(clippath);
            this.legend.setAttribute('style', 'clip-path:url(#' + clippath.id + ')');
        }
    }
    /**
     * @private
     */
    public renderGradientPointer(e: PointerEvent, pageX: number, pageY: number): void {
        let heatMap: HeatMap = this.heatMap;
        let currentRect: CurrentRect = heatMap.heatMapSeries.getCurrentRect(pageX, pageY);
        let cellValue: string = heatMap.bubbleSizeWithColor ? (currentRect.value as BubbleTooltipData[])[0].bubbleData.toString() !== '' ?
            !this.heatMap.isColorValueExist ? (currentRect.value as BubbleTooltipData[])[0].bubbleData.toString() :
                (currentRect.value as BubbleTooltipData[])[1].bubbleData.toString() : '' : currentRect.value.toString();
        let rect: Rect = this.legendRectScale;
        let legendPart: number;
        let direction: string; let options: PathOption; let legendPath: number;
        let pathX1: number; let pathY1: number; let pathX2: number; let pathY2: number; let pathX3: number; let pathY3: number;
        if (cellValue.toString() !== '') {
            if (!heatMap.horizontalGradient) {
                legendPart = rect.height / 100;
                legendPath = legendPart * ((Number(cellValue) - this.legendMinValue) /
                    (this.legendMaxValue - this.legendMinValue)) * 100;
                pathX1 = rect.x - 1;
                pathY1 = rect.y + legendPath;
                pathX2 = pathX3 = rect.x - 8;
                pathY2 = rect.y - 5 + legendPath;
                pathY3 = rect.y + 5 + legendPath;
            } else {
                legendPart = rect.width / 100;
                legendPath = legendPart * ((Number(cellValue) - this.legendMinValue) /
                    (this.legendMaxValue - this.legendMinValue)) * 100;
                pathX1 = rect.x + legendPath;
                pathY1 = rect.y + rect.height;
                pathX2 = rect.x - 5 + legendPath;
                pathY2 = pathY3 = rect.y + rect.height + 8;
                pathX3 = rect.x + 5 + legendPath;
            }
            direction = 'M' + ' ' + pathX1 + ' ' + pathY1 + ' ' +
                'L' + ' ' + pathX2 + ' ' + pathY2 + ' ' + 'L' + ' ' + pathX3 + ' ' + pathY3 + ' ' + 'Z';
            options = new PathOption(
                heatMap.element.id + '_Gradient_Pointer', 'gray', 0.01,
                '#A0A0A0', 1, '0,0', direction);
            if (!heatMap.enableCanvasRendering) {
                this.gradientPointer = heatMap.renderer.drawPath(options) as HTMLElement;
                (<HTMLElement>this.gradientPointer).style.visibility = 'visible';
                this.legend.appendChild(this.gradientPointer);
            } else {
                this.removeGradientPointer();
                let canvasTranslate: Int32Array;
                heatMap.canvasRenderer.drawPath(options, canvasTranslate);
                this.previousOptions.pathX1 = pathX1;
                this.previousOptions.pathY1 = pathY1;
                this.previousOptions.pathX2 = pathX2;
                this.previousOptions.pathY2 = pathY2;
                this.previousOptions.pathX3 = pathX3;
                this.previousOptions.pathY3 = pathY3;
            }
        } else {
            this.removeGradientPointer();
        }
    }
    /**
     * @private
     */
    public removeGradientPointer(): void {
        let heatMap: HeatMap = this.heatMap;
        if (this.gradientPointer && !heatMap.enableCanvasRendering) {
            (<HTMLElement>this.gradientPointer).style.visibility = 'hidden';
        } else if (heatMap.enableCanvasRendering) {
            if (Object.keys(this.previousOptions).length !== 0) {
                if (heatMap.horizontalGradient) {
                    this.fillRect.x = this.previousOptions.pathX2 - 1;
                    this.fillRect.y = this.previousOptions.pathY1;
                    this.fillRect.width = this.previousOptions.pathX3 - this.previousOptions.pathX2 + 2;
                    this.fillRect.height = this.previousOptions.pathY2 + 1 - this.previousOptions.pathY1;
                } else {
                    this.fillRect.x = this.previousOptions.pathX2 - 1;
                    this.fillRect.y = this.previousOptions.pathY2 - 1;
                    this.fillRect.width = this.previousOptions.pathX1 - this.previousOptions.pathX2 + 1;
                    this.fillRect.height = this.previousOptions.pathY3 - this.previousOptions.pathY2 + 2;
                }
            }
            heatMap.canvasRenderer.ctx.fillStyle = heatMap.themeStyle.background;
            heatMap.canvasRenderer.ctx.fillRect(this.fillRect.x, this.fillRect.y, this.fillRect.width, this.fillRect.height);
        }
    }
    /**
     * @private
     */
    public calculateLegendBounds(rect: Rect): void {
        let heatMap: HeatMap = this.heatMap;
        let legendSettings: LegendSettingsModel = heatMap.legendSettings;
        let colorCollection: LegendColorCollection[] = heatMap.legendColorCollection;
        this.labelCollections = [];
        if (legendSettings.position !== 'Bottom' && legendSettings.position !== 'Top' &&
            legendSettings.position !== 'Right' && legendSettings.position !== 'Left') {
            legendSettings.position = 'Right';
        }
        heatMap.horizontalGradient = legendSettings.position === 'Bottom' || legendSettings.position === 'Top';
        this.legendRectPadding = heatMap.horizontalGradient ? 16 : 10; // padding between rect and legend
        this.labelPadding = legendSettings.showLabel ? this.heatMap.horizontalGradient ? 10 : 6 : 0; // padding between list and label
        this.legendHeight = legendSettings.height;
        this.legendWidth = legendSettings.width;
        if (heatMap.paletteSettings.type === 'Fixed') {
            let paletteCollection: ColorCollection[] = heatMap.colorCollection;
            for (let i: number = 0; i < paletteCollection.length; i++) {
                let label: string = paletteCollection[i].label ? paletteCollection[i].label :
                    paletteCollection[i].value.toString();
                if (heatMap.legendSettings.enableSmartLegend && heatMap.legendSettings.labelDisplayType === 'Edge'
                    && i > 0 && i < paletteCollection.length - 1) {
                    this.labelCollections.push('');
                } else {
                    this.labelCollections.push(label);
                }
            }
        } else {
            for (let i: number = 0; i < colorCollection.length; i++) {
                let label: string = colorCollection[i].isHidden ? '' : colorCollection[i].label ?
                    colorCollection[i].label : colorCollection[i].value.toString();
                this.labelCollections.push(label);
            }
        }
        if (heatMap.paletteSettings.type === 'Gradient' || (heatMap.paletteSettings.type === 'Fixed' &&
            heatMap.legendSettings.enableSmartLegend)) {
            this.maxLegendLabelSize = this.getMaxLabelSize();
            if (heatMap.horizontalGradient && legendSettings.height === '') {
                this.legendHeight = ((2 * this.legendRectPadding) + this.legendSize + this.maxLegendLabelSize.height).toString();
            } else if (!heatMap.horizontalGradient && legendSettings.width === '' && (legendSettings.textStyle.textOverflow === 'None' ||
                (heatMap.paletteSettings.type === 'Fixed' && heatMap.legendSettings.enableSmartLegend &&
                    heatMap.legendSettings.labelDisplayType === 'None'))) {
                this.legendWidth = ((2 * this.legendRectPadding) + this.legendSize + this.maxLegendLabelSize.width).toString();
            }
        } else {
            this.calculateListLegendBounds(rect);
        }
        this.legendHeight = this.legendHeight ? this.legendHeight : heatMap.horizontalGradient ? '50' : '100%';
        this.legendWidth = this.legendWidth ? this.legendWidth : heatMap.horizontalGradient ?
            '100%' : heatMap.paletteSettings.type === 'Fixed' && !heatMap.legendSettings.enableSmartLegend ? '70' : '50';
        this.height = stringToNumber(this.legendHeight, rect.height);
        this.width = stringToNumber(this.legendWidth, rect.width);
        if (heatMap.horizontalGradient) {
            this.height = heatMap.paletteSettings.type === 'Gradient' ? this.height < 50 ? 50 : this.height : this.height;
            if (legendSettings.position === 'Top') {
                rect.y += this.height;
            }
            rect.height -= this.height;
        } else {
            this.width = heatMap.paletteSettings.type === 'Gradient' ? this.width < 50 ? 50 : this.width : this.width;
            if (legendSettings.position === 'Left') {
                rect.x += this.width;
            }
            rect.width -= this.width;
        }
    }

    private calculateListLegendBounds(rect: Rect): void {
        let heatMap: HeatMap = this.heatMap;
        this.listWidth = 0;
        this.listHeight = 0;
        this.currentPage = 1;
        let padding: number = 10; // padding of paging elements
        if (heatMap.horizontalGradient) {
            for (let i: number = 0; i < heatMap.colorCollection.length; i++) {
                let size: number = 0;
                if (heatMap.legendSettings.showLabel) {
                    let text: string = this.labelCollections[i];
                    size = measureText(text, heatMap.legendSettings.textStyle).width;
                }
                let perListWidth: number = this.legendSize + this.labelPadding + size + this.listInterval;
                this.listWidth += perListWidth;
            }
            this.listWidth += this.listInterval + padding;
            if (this.legendWidth === '') {
                this.legendWidth = this.listWidth > rect.width ? rect.width.toString() : this.listWidth.toString();
            }
            if (this.legendHeight === '') {
                this.numberOfRows = Math.ceil(this.listWidth / stringToNumber(this.legendWidth, rect.width));
                this.numberOfRows = this.numberOfRows > 3 ? 3 : this.numberOfRows;
                this.legendHeight = (this.listWidth > rect.width || this.listWidth > stringToNumber(this.legendWidth, rect.width)) &&
                    this.numberOfRows > 3 ? (((this.legendSize + this.listInterval) * this.numberOfRows) + this.legendRectPadding +
                        parseInt(heatMap.legendSettings.textStyle.size, 10) + padding).toString() :
                    (((this.legendSize + this.listInterval) * this.numberOfRows) + this.legendRectPadding).toString();
            }
        } else {
            this.listHeight = ((this.legendSize + this.listInterval) * heatMap.colorCollection.length) + this.listInterval;
            if (this.legendHeight === '') {
                this.legendHeight = this.listHeight > rect.height ? rect.height.toString() : this.listHeight.toString();
            }
            if (this.legendWidth === '' && heatMap.legendSettings.textStyle.textOverflow !== 'Trim') {
                this.maxLegendLabelSize = this.getMaxLabelSize();
                this.legendWidth = ((2 * this.legendRectPadding) + this.legendSize + this.labelPadding +
                    this.maxLegendLabelSize.width).toString();
            }
        }
        if (stringToNumber(this.legendHeight, rect.height) < 50) {
            this.legendHeight = '50';
        }
        if (stringToNumber(this.legendWidth, rect.width) < 70) {
            this.legendWidth = '70';
        }
    }

    private getMaxLabelSize(): Size {
        let heatMap: HeatMap = this.heatMap;
        this.maxLegendLabelSize = new Size(0, 0);
        if (!heatMap.legendSettings.showLabel || (heatMap.horizontalGradient && heatMap.paletteSettings.type === 'Fixed' &&
            !heatMap.legendSettings.enableSmartLegend) || (heatMap.paletteSettings.type === 'Fixed' &&
                heatMap.legendSettings.labelDisplayType === 'None')) {
            return this.maxLegendLabelSize;
        } else {
            let labelSize: Size = this.maxLegendLabelSize;
            for (let i: number = 0; i < heatMap.colorCollection.length; i++) {
                let size: Size = measureText(this.labelCollections[i], heatMap.legendSettings.textStyle);
                labelSize.width = (labelSize.width > size.width) ? labelSize.width : size.width;
                labelSize.height = (labelSize.height > size.height) ? labelSize.height : size.height;
            }
            return labelSize;
        }
    }
    /**
     * @private
     */
    public calculateLegendSize(rect: Rect, legendTop: number): void {
        let heatMap: HeatMap = this.heatMap;
        let legendSettings: LegendSettingsModel = heatMap.legendSettings;
        let left: number; let top: number; let padding: number = 10; // inner padding for axis title and axil labels
        let alignment: string = legendSettings.alignment;
        let height: number = stringToNumber(this.legendHeight, rect.height);
        let width: number = stringToNumber(this.legendWidth, rect.width);
        let axis: Axis[] = heatMap.axisCollections; let axisTitlePadding: number = 0;
        if (heatMap.horizontalGradient) {
            width = width > rect.width ? rect.width : width;
            height = heatMap.paletteSettings.type === 'Gradient' ? height > 50 ? height : 50 : this.height;
            left = alignment === 'Near' ? rect.x : alignment === 'Far' ? rect.x + rect.width - width :
                rect.x + (rect.width / 2) - (width / 2);
            if (heatMap.xAxis.title.text !== '') {
                axisTitlePadding = measureText(heatMap.xAxis.title.text, heatMap.xAxis.textStyle).height + padding;
            }
            let axisHeight: number = axis[0].opposedPosition ? 0 : axis[0].maxLabelSize.height + axisTitlePadding + padding;
            top = legendSettings.position === 'Top' ? heatMap.titleSettings.text ? legendTop :
                heatMap.margin.top : rect.y + rect.height + axisHeight;
        } else {
            height = height > rect.height ? rect.height : height;
            width = heatMap.paletteSettings.type === 'Gradient' ? width > 50 ? width : 50 : width;
            top = alignment === 'Near' ? rect.y : alignment === 'Far' ? rect.y + rect.height - height :
                rect.y + (rect.height / 2) - (height / 2);
            if (heatMap.yAxis.title.text !== '') {
                axisTitlePadding = measureText(heatMap.yAxis.title.text, heatMap.yAxis.textStyle).height + padding;
            }
            let axisWidth: number = axis[1].opposedPosition ? axis[1].maxLabelSize.width + axisTitlePadding + padding : 0;
            left = legendSettings.position === 'Right' ? rect.x + rect.width + axisWidth : heatMap.margin.left;

        }
        this.legendGroup = new Rect(left, top, width, height);
        this.calculateGradientScale(this.legendGroup);
    }

    // calculating number of lists per page
    private measureListLegendBound(rect: Rect): void {
        let heatMap: HeatMap = this.heatMap;
        let padding: number = 15; // padding of paging element
        this.numberOfPages = 1;
        if (heatMap.horizontalGradient) {
            if (this.listWidth > this.width) {
                this.numberOfRows = Math.ceil(this.listWidth / this.width);
                this.listHeight = ((this.legendSize + this.listInterval) * this.numberOfRows);
                this.listPerPage = this.numberOfRows <= 3 ? this.numberOfRows : Math.ceil((this.height - padding -
                    parseInt(heatMap.legendSettings.textStyle.size, 10) -
                    this.legendRectPadding) / (this.legendSize + this.listInterval));
                this.numberOfPages = Math.ceil(this.numberOfRows / this.listPerPage);
            } else {
                this.listPerPage = 1;
            }
        } else {
            if (this.listHeight > rect.height || this.listHeight > this.height) {
                let maxHeight: number = stringToNumber(this.legendHeight, rect.height);
                maxHeight = maxHeight > rect.height ? rect.height : maxHeight;
                this.listPerPage = Math.floor(maxHeight / (this.legendSize + this.listInterval) - 1);
                this.numberOfPages = Math.max(1, Math.ceil(heatMap.colorCollection.length / this.listPerPage));
            } else {
                this.listPerPage = heatMap.colorCollection.length;
                this.legendHeight = this.listHeight.toString();
            }
        }
    }

    private renderPagingElements(): void {
        let heatMap: HeatMap = this.heatMap;
        if (this.numberOfPages > 1) {
            this.navigationCollections = [];
            this.legend.appendChild(this.paginggroup);
            let iconSize: number = 10;
            let rightArrowX: number = this.legendGroup.x + this.legendGroup.width - iconSize;
            let rightArrowY: number = this.legendGroup.y + this.legendGroup.height - iconSize;
            let text: string = this.currentPage + '/' + this.numberOfPages;
            let textSize: Size = measureText(text, heatMap.legendSettings.textStyle);
            let textX: number = rightArrowX - textSize.width - 15;
            let textBasic: TextBasic = new TextBasic(textX, rightArrowY, 'start', text, 0, 'translate(0,0)', 'middle');
            let options: TextOption = new TextOption(
                heatMap.element.id + '_paging', textBasic, heatMap.legendSettings.textStyle,
                heatMap.legendSettings.textStyle.color || heatMap.themeStyle.legendLabel);
            this.drawSvgCanvas.createText(options, this.paginggroup, text);
            if (Browser.isIE && !heatMap.enableCanvasRendering) {
                (this.paginggroup.lastChild as Element).setAttribute('dy', '0.6ex');
            }
            this.pagingRect = new Rect(textX, rightArrowY - textSize.height / 2, textSize.width, textSize.height);
            let pagingTextRect: RectOption = new RectOption(
                heatMap.element.id + '_pagingText', 'none', { color: 'transparent', width: 0 },
                1, this.pagingRect);
            this.drawSvgCanvas.drawRectangle(pagingTextRect, this.paginggroup);
            let rightArrowRect: RectOption = new RectOption(
                heatMap.element.id + '_rightArrow', 'none', { color: 'transparent', width: 0 }, 1,
                new Rect(rightArrowX - iconSize, rightArrowY - iconSize / 2, iconSize, iconSize));
            this.drawSvgCanvas.drawRectangle(rightArrowRect, this.paginggroup);


            let rightArrow: string = 'M' + ' ' + (rightArrowX) + ' ' + rightArrowY + ' ' +
                'L' + ' ' + (rightArrowX - iconSize) + ' ' + (rightArrowY - iconSize / 2) + ' ' + 'L' + ' ' +
                (rightArrowX - iconSize) + ' ' + (rightArrowY + (iconSize / 2)) + 'Z';
            let leftX: number = textX - 15;

            let leftArrow: string = 'M' + ' ' + leftX + ' ' + rightArrowY + ' ' +
                'L' + ' ' + (leftX + iconSize) + ' ' + (rightArrowY - iconSize / 2) + ' ' + 'L' + ' ' +
                (leftX + iconSize) + ' ' + (rightArrowY + (iconSize / 2)) + 'Z';

            let leftArrowRect: RectOption = new RectOption(
                heatMap.element.id + '_leftArrow', 'none', { color: 'transparent', width: 0 }, 1,
                new Rect(leftX, rightArrowY - iconSize / 2, iconSize, iconSize));
            this.drawSvgCanvas.drawRectangle(leftArrowRect, this.paginggroup);

            let leftOption: PathOption = new PathOption(
                heatMap.element.id + '_Legend_leftarrow', 'gray', 0.01, '#A0A0A0', 1, '0,0', leftArrow);
            let rightOption: PathOption = new PathOption(
                heatMap.element.id + '_Legend_rightarrow', 'gray', 0.01, '#A0A0A0', 1, '0,0', rightArrow);
            this.navigationCollections.push(rightArrowRect);
            this.navigationCollections.push(leftArrowRect);

            if (!heatMap.enableCanvasRendering) {
                let arrow: Element = heatMap.renderer.drawPath(leftOption);
                let rightarrow: Element = heatMap.renderer.drawPath(rightOption);
                this.paginggroup.appendChild(arrow);
                this.paginggroup.appendChild(rightarrow);
            } else {
                let canvasTranslate: Int32Array;
                heatMap.canvasRenderer.drawPath(leftOption, canvasTranslate);
                heatMap.canvasRenderer.drawPath(rightOption, canvasTranslate);
            }
        }
    }

    private calculateGradientScale(scale: Rect): void {
        let heatMap: HeatMap = this.heatMap;
        let padding: number = 10; // padding between legend bounds and gradient scale
        let left: number; let top: number; let height: number; let width: number;
        if (heatMap.paletteSettings.type === 'Fixed' && !heatMap.legendSettings.enableSmartLegend) {
            this.measureListLegendBound(heatMap.initialClipRect);
        }
        if (heatMap.horizontalGradient) {
            left = scale.x + padding;
            top = scale.y + this.legendRectPadding;
            width = heatMap.paletteSettings.type === 'Fixed' && !heatMap.legendSettings.enableSmartLegend ?
                scale.width - (2 * this.listInterval) : scale.width - 2 * padding;
            height = heatMap.paletteSettings.type === 'Fixed' && !heatMap.legendSettings.enableSmartLegend ?
                (this.legendSize + this.listInterval) * this.listPerPage - this.listInterval : this.gradientScaleSize;
        } else {
            left = scale.x + this.legendRectPadding;
            top = scale.y + padding;
            width = (heatMap.paletteSettings.type === 'Fixed' && !heatMap.legendSettings.enableSmartLegend) ?
                scale.width - padding : this.gradientScaleSize;
            height = heatMap.paletteSettings.type === 'Fixed' && !heatMap.legendSettings.enableSmartLegend ?
                (this.legendSize + this.listInterval) * this.listPerPage - this.listInterval : scale.height - 2 * padding;
        }
        this.legendRectScale = new Rect(left, top, width, height);
        if (heatMap.paletteSettings.type === 'Gradient' || heatMap.paletteSettings.type === 'Fixed' &&
            heatMap.legendSettings.enableSmartLegend) {
            this.calculateColorAxisGrid(this.legendRectScale);
        }
    }

    private calculateColorAxisGrid(legendRect: Rect): void {
        let heatMap: HeatMap = this.heatMap;
        let rect: Rect = this.legendRectScale;
        let legendPart: number; let text: string[];
        let maxTextWrapLength: number = 0;
        this.segmentCollections = [];
        this.textWrapCollections = [];
        let pathX1: number; let pathY1: number;
        let colorCollection: ColorCollection[] = heatMap.paletteSettings.type === 'Gradient' ?
            heatMap.legendColorCollection : heatMap.colorCollection;
        let minValue: number = heatMap.bubbleSizeWithColor ? heatMap.minColorValue : heatMap.dataSourceMinValue;
        let maxValue: number = heatMap.bubbleSizeWithColor ? heatMap.maxColorValue : heatMap.dataSourceMaxValue;
        this.legendMinValue = colorCollection[0].value > minValue ? minValue : colorCollection[0].value;
        this.legendMaxValue = colorCollection[colorCollection.length - 1].value < maxValue ? maxValue :
         colorCollection[colorCollection.length - 1].value;
        if (heatMap.paletteSettings.type === 'Gradient') {
            for (let index: number = 0; index < colorCollection.length; index++) {
                let value: number = ((colorCollection[index].value - this.legendMinValue) /
                    (this.legendMaxValue - this.legendMinValue)) * 100;
                value = isNaN(value) ? 0 : value;
                if (!heatMap.horizontalGradient) {
                    legendPart = rect.height / 100;
                    pathY1 = legendRect.y + (legendPart * value);
                    this.segmentCollections.push(pathY1);
                } else {
                    legendPart = rect.width / 100;
                    pathX1 = legendRect.x + (legendPart * value);
                    this.segmentCollections.push(pathX1);
                }
            }
        }
        let textWrapWidth: number;
        if (heatMap.horizontalGradient) {
            for (let i: number = 0; i < colorCollection.length; i++) {
                if (heatMap.paletteSettings.type === 'Gradient') {
                    let previousSegmentWidth: number = (this.segmentCollections[i] - this.segmentCollections[i - 1]) / 2;
                    let nextSegmentWidth: number = (this.segmentCollections[i + 1] - this.segmentCollections[i]) / 2;
                    if (i === colorCollection.length - 1) {
                        textWrapWidth = previousSegmentWidth;
                    } else if (i === 0) {
                        textWrapWidth = nextSegmentWidth;
                    } else {
                        textWrapWidth = previousSegmentWidth < nextSegmentWidth ? previousSegmentWidth : nextSegmentWidth;
                    }
                } else {
                    textWrapWidth = this.legendRectScale.width / heatMap.colorCollection.length;
                }
                this.textWrapCollections.push(textWrapWidth);
                text = getTitle(this.labelCollections[i], heatMap.legendSettings.textStyle, textWrapWidth);
                maxTextWrapLength = text.length > maxTextWrapLength ? text.length : maxTextWrapLength;
            }
            if (heatMap.legendSettings.position === 'Bottom') {
                heatMap.initialClipRect.height -= (this.maxLegendLabelSize.height * (maxTextWrapLength - 1));
                this.legendGroup.y -= (this.maxLegendLabelSize.height * (maxTextWrapLength - 1));
                this.legendRectScale.y = this.legendGroup.y + this.legendRectPadding;
                this.legendGroup.height = parseInt(this.legendHeight, 10) + (this.maxLegendLabelSize.height * (maxTextWrapLength - 1));
            } else {
                heatMap.initialClipRect.y += (this.maxLegendLabelSize.height * (maxTextWrapLength - 1));
                heatMap.initialClipRect.height -= (this.maxLegendLabelSize.height * (maxTextWrapLength - 1));
                this.legendRectScale.y = this.legendGroup.y + this.legendRectPadding;
                this.legendGroup.height = parseInt(this.legendHeight, 10) + (this.maxLegendLabelSize.height * (maxTextWrapLength - 1));
            }
        }
    }

    private renderColorAxisGrid(legendRect: Rect): void {
        let heatMap: HeatMap = this.heatMap;
        let legendElement: Element;
        let pathX1: number; let pathY1: number; let pathX2: number; let pathY2: number;
        if (!heatMap.enableCanvasRendering) {
            legendElement = this.heatMap.renderer.createGroup({ id: heatMap.element.id + '_ColorAxis_Grid' });
        }
        for (let i: number = 0; i < heatMap.legendColorCollection.length; i++) {
            if (!heatMap.horizontalGradient) {
                pathX1 = legendRect.x;
                pathY1 = pathY2 = this.segmentCollections[i];
                pathX2 = legendRect.x + legendRect.width;
            } else {
                pathX1 = pathX2 = this.segmentCollections[i];
                pathY1 = legendRect.y;
                pathY2 = legendRect.y + legendRect.height;
            }
            let direction: Line = new Line(pathX1, pathY1, pathX2, pathY2);
            let line: LineOption = new LineOption(this.heatMap.element.id + '_ColorAxis_Grid' + i, direction, '#EEEEEE', 1);
            this.drawSvgCanvas.drawLine(line, legendElement);
            if (!heatMap.enableCanvasRendering) {
                this.legend.appendChild(legendElement as HTMLElement);
            }
        }
    }
    /**
     * @private
     */
    public renderLegendLabelTooltip(e: PointerEvent): void {
        let x: number = this.heatMap.mouseX;
        let y: number = this.heatMap.mouseY;
        if ((<Element>e.target).id.indexOf('_Legend_Label') !== -1 && (<HTMLElement>event.target).textContent.indexOf('...') > -1) {
            let targetId: string[] = (<HTMLElement>event.target).id.split(this.heatMap.element.id + '_Legend_Label');
            if (targetId.length === 2) {
                let index: number;
                if (targetId[1].length === 1 || this.heatMap.legendSettings.textStyle.textOverflow === 'Trim') {
                    index = parseInt(targetId[1], 10);
                } else {
                    index = parseInt(targetId[1].substring(0, targetId[1].length - 1), 10);
                }
                showTooltip(
                    this.labelCollections[index], x, y, this.heatMap.element.offsetWidth,
                    this.heatMap.element.id + '_LegendLabel_Tooltip',
                    getElement(this.heatMap.element.id + '_Secondary_Element'), null, this.heatMap);
                document.getElementById(this.heatMap.element.id + '_LegendLabel_Tooltip').style.visibility = 'visible';

            }
        } else {
            let element: HTMLElement = document.getElementById(this.heatMap.element.id + '_LegendLabel_Tooltip');
            if (element) {
                element.style.visibility = 'hidden';
            }
        }
    }

    private calculateListPerPage(rect: Rect): void {
        let heatMap: HeatMap = this.heatMap;
        if (heatMap.horizontalGradient) {
            this.lastList = [];
            let legendX: number = rect.x; let legendY: number = rect.y;
            let size: number = 0; let division: number = 0;
            let labelX: number = 0; let labelY: number = 0; let interval: number = 20;
            let i: number;
            let legendSize: number = 10; let padding: number = 5;
            this.labelXCollections = [];
            this.labelYCollections = [];
            this.legendXCollections = [];
            this.legendYCollections = [];
            for (i = 0; i < heatMap.colorCollection.length; i++) {
                if (heatMap.legendSettings.showLabel) {
                    let text: string = this.labelCollections[i];
                    size = measureText(text, heatMap.legendSettings.textStyle).width;
                }
                labelX = legendX + legendSize + padding;
                labelY = legendY + padding;
                let maxWidth: number = heatMap.legendSettings.showLabel ? labelX + size : legendX + this.legendSize + this.listInterval;
                if (i !== 0 && maxWidth > this.legendGroup.width + this.legendGroup.x - this.listInterval) {
                    division += 1;
                    legendX = rect.x;
                    legendY = rect.y + (division * interval);
                    labelX = legendX + legendSize + padding;
                    labelY = legendY + padding;
                    if (division % (this.listPerPage) === 0) {
                        this.lastList.push(i);
                        legendY = rect.y;
                        labelY = legendY + padding;
                        division = 0;
                    }
                }
                this.labelXCollections.push(labelX);
                this.labelYCollections.push(labelY);
                this.legendXCollections.push(legendX);
                this.legendYCollections.push(legendY);
                legendX = legendX + this.legendSize + this.labelPadding + size + this.listInterval;
            }
            this.lastList.push(i);
            this.numberOfPages = this.lastList.length;
        }
    }

    private renderListLegendMode(rect: Rect): void {
        let heatMap: HeatMap = this.heatMap;
        let legendSize: number = 10;
        let tempBorder: BorderModel = {
            color: 'transparent',
            width: 0,
        };
        let padding: number = 5; // padding for legend label from top
        this.legendLabelTooltip = [];
        let listRect: Rect; let size: Size = new Size(0, 0); let division: number = 0;
        let labelX: number = 0; let labelY: number = 0;
        let legendX: number = rect.x; let legendY: number = rect.y;
        this.renderPagingElements();
        let x: number; let y: number;
        let textWrapWidth: number = this.legendGroup.width - (this.legendSize +
            this.legendRectPadding + this.labelPadding);
        if (!heatMap.horizontalGradient) {
            x = (this.currentPage * (this.listPerPage)) - (this.listPerPage);
            y = x + this.listPerPage;
            y = y < heatMap.colorCollection.length ? y : heatMap.colorCollection.length;
        } else {
            x = this.currentPage === 1 ? 0 : this.lastList[this.currentPage - 2];
            y = this.lastList[this.currentPage - 1];
        }
        for (let i: number = x; i < y; i++) {
            if (heatMap.legendSettings.showLabel) {
                let text: string = this.labelCollections[i];
                size = measureText(text, heatMap.legendSettings.textStyle);
            }
            if (heatMap.horizontalGradient) {
                legendX = this.legendXCollections[i];
                legendY = this.legendYCollections[i];
                labelX = this.labelXCollections[i];
                labelY = this.labelYCollections[i];
            }
            if (heatMap.legendSettings.showLabel) {
                labelX = legendX + this.legendSize + this.labelPadding;
                labelY = legendY + padding;
                let text: string[] = getTitle(this.labelCollections[i], heatMap.legendSettings.textStyle, textWrapWidth);
                if (text[0].indexOf('...') !== -1 && heatMap.enableCanvasRendering) {
                    this.legendLabelTooltip.push(new CanvasTooltip(
                        this.labelCollections[i],
                        new Rect(labelX, labelY, size.width, size.height)));
                }
                let textBasic: TextBasic = new TextBasic(labelX, labelY, 'start', text, 0, 'translate(0,0)', 'middle');
                let options: TextOption = new TextOption(
                    heatMap.element.id + '_Legend_Label' + i, textBasic, heatMap.legendSettings.textStyle,
                    heatMap.legendSettings.textStyle.color || heatMap.themeStyle.legendLabel);
                if (text.length > 1) {
                    this.drawSvgCanvas.createWrapText(options, heatMap.legendSettings.textStyle, this.translategroup);
                } else {
                    this.drawSvgCanvas.createText(options, this.translategroup, text[0]);
                }
                if (Browser.isIE && !heatMap.enableCanvasRendering) {
                    (this.translategroup.lastChild as Element).setAttribute('dy', '0.6ex');
                }
            }

            listRect = new Rect(legendX, legendY, legendSize, legendSize);
            let rectItems: RectOption = new RectOption(
                heatMap.element.id + '_legend_list' + i,
                heatMap.colorCollection[i].color, tempBorder, 1, listRect);
            this.drawSvgCanvas.drawRectangle(rectItems, this.translategroup);
            heatMap.horizontalGradient ? legendX = legendX + this.legendSize + this.labelPadding + size.width + this.listInterval :
                legendY += this.legendSize + this.listInterval;
        }
        if (!heatMap.enableCanvasRendering) {
            this.legendGroup.height = this.legendGroup.height > 0 ? this.legendGroup.height : 0;
            this.legendGroup.width = this.legendGroup.width > 0 ? this.legendGroup.width : 0;
            let clippath: Element = heatMap.renderer.createClipPath({ id: heatMap.element.id + '_LegendScale_ClipPath' });
            let clipRect: Element = heatMap.renderer.drawRectangle(this.legendGroup);
            clippath.appendChild(clipRect);
            this.translategroup.appendChild(clippath);
            this.translategroup.setAttribute('style', 'clip-path:url(#' + clippath.id + ')');
            this.legendScale.appendChild(this.translategroup);
            heatMap.svgObject.appendChild(this.legend as HTMLElement);
        }
    }
    /**
     * @private
     */
    public translatePage(heatMap: HeatMap, page: number, isNext: boolean): void {
        let padding: number = 5;
        if ((isNext && page >= 1 && page < this.numberOfPages) || (!isNext && page > 1 && page <= this.numberOfPages)) {
            if (isNext) {
                this.currentPage += 1;
                this.legendRect.y += this.legendRect.height;
            } else {
                this.currentPage -= 1;
                this.legendRect.y -= this.legendRect.height;
            }
            if (!heatMap.enableCanvasRendering) {
                this.paginggroup.removeChild(this.paginggroup.firstChild);
                while (this.translategroup.childNodes.length) {
                    this.translategroup.removeChild(this.translategroup.firstChild);
                }
            } else {
                let ctx: CanvasRenderingContext2D = heatMap.canvasRenderer.ctx;
                ctx.fillRect(this.legendRectScale.x - padding, this.legendRectScale.y - padding, this.legendRectScale.width +
                    padding, this.legendRectScale.height + (2 * padding));
                ctx.fillRect(this.pagingRect.x, this.pagingRect.y, this.pagingRect.width, this.pagingRect.height);
            }
            this.renderListLegendMode(this.legendRectScale);
        }
    }

    /**
     * To create div container for tooltip which appears on hovering the smart legend.
     * @param heatmap 
     * @private
     */
    public createTooltipDiv(heatMap: HeatMap): void {
        let element: Element = <HTMLElement>createElement('div', {
            id: this.heatMap.element.id + 'legendLabelTooltipContainer',
            styles: 'position:absolute'
        });
        this.heatMap.element.appendChild(element);
    }

    /**
     * To render tooltip for smart legend.
     * @private
     */
    public renderTooltip(currentLegendRect: CurrentLegendRect): void {
        let heatMap: HeatMap = this.heatMap;
        let tempTooltipText: string[] = [currentLegendRect.label];
        let offset: number = null;
        offset = parseInt(heatMap.legendSettings.textStyle.size, 10) / 2;
        this.tooltipObject = new tool(
            {
                offset: offset,
                theme: heatMap.theme,
                content: tempTooltipText,
                location: {
                    x: currentLegendRect.x + (currentLegendRect.width / 2),
                    y: currentLegendRect.y + (currentLegendRect.height / 2)
                },
                inverted: heatMap.horizontalGradient ? false : true,
                areaBounds:
                {
                    height: this.legendGroup.height + this.legendGroup.y,
                    width: this.legendGroup.width + this.legendGroup.x,
                    x: heatMap.legendSettings.position === 'Right' ? 0 : this.legendGroup.x,
                    y: heatMap.legendSettings.position === 'Top' ? heatMap.titleSettings.text === '' ? this.legendGroup.height -
                        this.legendGroup.y : this.legendGroup.y : 0
                }
            },
            '#' + this.heatMap.element.id + 'legendLabelTooltipContainer');
        this.tooltipObject.element.style.visibility = 'visible';
    }

    /**
     * To create tooltip for smart legend.
     * @private
     */
    public createTooltip(pageX: number, pageY: number): void {
        let currentLegendRect: CurrentLegendRect;
        for (let i: number = 0; i < this.heatMap.colorCollection.length; i++) {
            let position: CurrentLegendRect = this.legendRectPositionCollection[i];
            if (pageX > position.x && pageX < position.width + position.x &&
                pageY > position.y && pageY < position.height + position.y) {
                currentLegendRect = this.legendRectPositionCollection[i];
                break;
            }
        }
        let ele: HTMLElement = document.getElementById(this.heatMap.element.id + 'legendLabelTooltipContainer');
        if (ele && ele.style.visibility === 'visible' && this.tooltipObject && !this.heatMap.isTouch) {
            this.tooltipObject.fadeOut();
            ele.style.visibility = 'hidden';
        }
        if (currentLegendRect) {
            this.renderTooltip(currentLegendRect);
        }
    }
}