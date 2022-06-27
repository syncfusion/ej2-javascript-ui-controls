import { Property, ChildProperty, Complex, Browser, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { LinearGradient, TooltipTheme } from '@syncfusion/ej2-svg-base';
import { HeatMap } from '../heatmap';
import { DrawSvgCanvas, TextOption, TextBasic, PathOption, Line, LineOption, GradientPointer, textTrim } from '../utils/helper';
import { Size, measureText, getTitle, getElement, CanvasTooltip, formatValue, LegendRange, ToggleVisibility, sum } from '../utils/helper';
import { LegendPosition, Alignment, LabelDisplayType } from '../utils/enum';
import { BorderModel, FontModel, TitleModel } from '../model/base-model';
import { Font, LegendColorCollection, BubbleTooltipData, ColorCollection, Title } from '../model/base';
import { Rect, RectOption, Gradient, GradientColor, showTooltip, stringToNumber, CurrentLegendRect, removeElement } from '../utils/helper';
import { Axis } from '../axis/axis';
import { Theme } from '../model/theme';
import { LegendSettingsModel } from './legend-model';
import { CurrentRect } from '../utils/helper';
import { Tooltip as tool } from '@syncfusion/ej2-svg-base';
import { ILegendRenderEventArgs } from '../model/interface';
/**
 * Configures the Legend
 */
export class LegendSettings extends ChildProperty<LegendSettings> {
    /**
     * Specifies the height of Legend.
     *
     * @default ''
     */
    @Property('')
    public height: string;

    /**
     * Specifies the width of Legend.
     *
     * @default ''
     */
    @Property('')
    public width: string;
    /**
     * Specifies title of Legend.
     *
     * @default ''
     */
    @Complex<TitleModel>({ text: '', textStyle: Theme.titleFont }, Title)
    public title: TitleModel;
    /**
     * Specifies the position of Legend to render.
     *
     * @default 'Right'
     */
    @Property('Right')
    public position: LegendPosition;

    /**
     * Specifies whether the Legend should be visible or not.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * Specifies the alignment of the legend
     *
     * @default 'Center'
     */
    @Property('Center')
    public alignment: Alignment;

    /**
     * Specifies whether the label should be visible or not.
     *
     * @default true
     */
    @Property(true)
    public showLabel: boolean;

    /**
     * Specifies whether the gradient pointer should be visible or not.
     *
     * @default true
     */
    @Property(true)
    public showGradientPointer: boolean;

    /**
     * Specifies whether smart legend should be displayed or not when palette type is fixed.
     *
     * @default false
     */
    @Property(false)
    public enableSmartLegend: boolean;

    /**
     * Specifies the type of label display for smart legend.
     * * All:  All labels are displayed.
     * * Edge: Labels will be displayed only at the edges of the legend.
     * * None: No labels are displayed.
     *
     * @default 'All'
     */
    @Property('All')
    public labelDisplayType: LabelDisplayType;

    /**
     * Specifies the legend label style.
     *
     * @default ''
     */
    @Complex<FontModel>(Theme.legendLabelFont, Font)
    public textStyle: FontModel;

    /**
     * Specifies the formatting options for the legend label.
     *
     * @default ''
     */

    @Property('')
    public labelFormat: string;

    /**
     * To toggle the visibility of heatmap cells based on legend range selection
     *
     * @default true
     */
    @Property(true)
    public toggleVisibility: boolean;
}

/**
 *
 * The `Legend` module is used to render legend for the heatmap.
 */
export class Legend {
    private heatMap: HeatMap;
    private drawSvgCanvas: DrawSvgCanvas;
    private legend: Element;
    public legendGroup: Rect;
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
    private segmentCollectionsLabels: number[] = [];
    private labelPosition: number;
    private textWrapCollections: number[] = [];
    public labelCollections: string[] = [];
    public labelCollection: string[] = [];
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
    public legendTitleTooltip: CanvasTooltip[] = [];
    private numberOfRows: number;
    private labelXCollections: number[] = [];
    private labelYCollections: number[] = [];
    private legendXCollections: number[] = [];
    private legendYCollections: number[] = [];
    /** @private */
    public legendRectPositionCollection: CurrentLegendRect[] = [];
    /** @private */
    public legendRange: LegendRange[] = [];
    /** @private */
    public legendTextRange: LegendRange[] = [];
    /** @private */
    public visibilityCollections: boolean[] = [];
    /** @private */
    public tooltipObject: tool;
    /** @private */
    // eslint-disable-next-line @typescript-eslint/ban-types
    public format: Function;
    constructor(heatMap?: HeatMap) {
        this.heatMap = heatMap;
        this.drawSvgCanvas = new DrawSvgCanvas(heatMap);
    }

    /**
     * Get module name
     */

    protected getModuleName(): string {
        return 'Legend';
    }
    /**
     * To destroy the Legend.
     *
     * @returns {void}
     * @private
     */

    public destroy(): void {
        /**
         * destory code
         */
    }
    /**
     * @private
     */

    public renderLegendItems(): void {
        const heatMap: HeatMap = this.heatMap; heatMap.toggleValue = [];
        const tempBorder: BorderModel = { color: 'transparent', width: 0 };
        this.legend = heatMap.renderer.createGroup({ id: heatMap.element.id + '_Heatmap_Legend' });
        const rectItems: RectOption = new RectOption(heatMap.element.id + '_LegendBound', 'none', tempBorder, 1, this.legendGroup);
        this.drawSvgCanvas.drawRectangle(rectItems, this.legend);
        const legendBound: Rect = this.legendRectScale; const ctx: CanvasRenderingContext2D = heatMap.canvasRenderer.ctx;
        const rectItemsSvg: Rect = new Rect(legendBound.x, legendBound.y, legendBound.width, legendBound.height); let fill: string;
        if (heatMap.paletteSettings.type === 'Fixed') {
            const colorCollection: ColorCollection[] = (!heatMap.legendSettings.enableSmartLegend) ?
                heatMap.colorCollection : heatMap.legendColorCollection;
            this.legendRange = (heatMap.resizing || (!heatMap.legendOnLoad && heatMap.rendering)) ? [] : this.legendRange;
            this.legendTextRange = (heatMap.resizing || (!heatMap.legendOnLoad && heatMap.rendering)) ? [] : this.legendTextRange;
            if (heatMap.enableCanvasRendering) {
                ctx.save(); ctx.clip();
            }
            for (let i: number = 0; i < colorCollection.length; i++) {
                const visibility: boolean = !isNullOrUndefined(this.visibilityCollections[i]) ? this.visibilityCollections[i] : true;
                heatMap.toggleValue.push(new ToggleVisibility(
                    visibility, colorCollection[i].value, colorCollection[i].startValue, colorCollection[i].endValue));
            }
        }
        if (heatMap.paletteSettings.type === 'Gradient' || (heatMap.paletteSettings.type === 'Fixed' &&
            heatMap.legendSettings.enableSmartLegend === true)) {
            if (heatMap.paletteSettings.type === 'Gradient') {
                if (heatMap.enableCanvasRendering) {
                    let grd: CanvasGradient; const ctx: CanvasRenderingContext2D = heatMap.canvasRenderer.ctx;
                    if (heatMap.horizontalGradient) {
                        grd = ctx.createLinearGradient(legendBound.x, 0, legendBound.x + legendBound.width, 0);
                    } else {
                        grd = ctx.createLinearGradient(0, legendBound.y, 0, legendBound.y + legendBound.height);
                    }
                    if (heatMap.legendSettings.title.text) { ctx.clip(); }
                    for (let i: number = 0; i < heatMap.legendColorCollection.length; i++) {
                        let value: number = (((this.heatMap.isColorRange ? heatMap.legendColorCollection[i].startValue :
                            heatMap.legendColorCollection[i].value) - this.legendMinValue) /
                            (this.legendMaxValue - this.legendMinValue));
                        value = isNaN(value) ? 0 : value;
                        if (this.heatMap.isColorRange && this.heatMap.paletteSettings.type === 'Gradient') {
                            this.calculateCanvasColorRange(i, grd);
                        } else { grd.addColorStop(value, heatMap.legendColorCollection[i].color); }
                    }
                    ctx.fillStyle = grd; fill = grd.toString();
                } else {
                    let gradientOptions: LinearGradient; let gradientColor: GradientColor;
                    const cgradientColors: GradientColor[] = [];
                    for (let i: number = 0; i < heatMap.legendColorCollection.length; i++) {
                        if (this.heatMap.isColorRange && this.heatMap.paletteSettings.type === 'Gradient') {
                            this.calculateColorRange(i, cgradientColors);
                        } else {
                            let gradientPercentage: number = ((heatMap.legendColorCollection[i].value - this.legendMinValue) /
                                (this.legendMaxValue - this.legendMinValue)) * 100;
                            gradientPercentage = isNaN(gradientPercentage) ? 0 : gradientPercentage;
                            gradientColor = new GradientColor(
                                heatMap.legendColorCollection[i].color, gradientPercentage + '%');
                            cgradientColors.push(gradientColor);
                        }
                        if (this.legendMaxValue === this.legendMinValue) { break; }
                    }
                    if (heatMap.horizontalGradient) {
                        gradientOptions = new Gradient(heatMap.element.id + '_lineargradient', '0%', '100%', '0%', '0%');
                    } else {
                        gradientOptions = new Gradient(heatMap.element.id + '_lineargradient', '0%', '0%', '0%', '100%');
                    }
                    const linearGradient: Element = heatMap.renderer.drawGradient('linearGradient', gradientOptions, cgradientColors);
                    this.legend.appendChild(linearGradient as HTMLElement);
                    fill = 'url(#' + heatMap.element.id + '_lineargradient)';
                }
                const rectItem: RectOption = new RectOption(heatMap.element.id + '_Gradient_Legend', fill, tempBorder, 1, rectItemsSvg);
                this.drawSvgCanvas.drawRectangle(rectItem, this.legend);
                this.renderElements(rectItemsSvg);
            } else {
                this.renderSmartLegend();
                this.renderTitle(rectItemsSvg);
            }
            if (!heatMap.enableCanvasRendering) {
                heatMap.svgObject.appendChild(this.legend as HTMLElement);
            }
            if (heatMap.enableCanvasRendering) {
                ctx.restore();
            }
            this.renderLegendLabel(rectItemsSvg);
        } else {
            this.legendScale = heatMap.renderer.createGroup({ id: heatMap.element.id + 'Heatmap_GradientScale' });
            const listRect: RectOption = new RectOption(heatMap.element.id + '_Gradient_Scale', 'none', tempBorder, 1, this.legendRectScale);
            this.drawSvgCanvas.drawRectangle(listRect, this.legendScale);
            this.renderTitle(rectItemsSvg);
            if (!heatMap.enableCanvasRendering) {
                this.legend.appendChild(this.legendScale);
            }
            this.translategroup = heatMap.renderer.createGroup({ id: heatMap.element.id + '_translate' });
            this.calculateListPerPage(rectItemsSvg);
            if (this.numberOfPages > 1) {
                this.paginggroup = heatMap.renderer.createGroup({ id: heatMap.element.id + '_navigation' });
            }
            this.renderListLegendMode(rectItemsSvg, true);
            if (heatMap.enableCanvasRendering) {
                ctx.restore();
            }
        }
    }
    private renderElements(rectItemsSvg: Rect): void {
        this.renderTitle(rectItemsSvg);
        this.renderColorAxisGrid(rectItemsSvg);
    }
    private calculateCanvasColorRange(i: number, grd: CanvasGradient): void {
        const heatMap: HeatMap = this.heatMap;
        let value: number = ((((heatMap.legendColorCollection[i].startValue < heatMap.dataSourceMinValue &&
            heatMap.legendColorCollection[i].endValue > heatMap.dataSourceMinValue) ?
            heatMap.dataSourceMinValue : heatMap.legendColorCollection[i].startValue) - this.legendMinValue) /
            (this.legendMaxValue - this.legendMinValue));
        value = isNaN(value) ? 0 : value;
        const value1: number = ((heatMap.legendColorCollection[i].endValue >= this.heatMap.dataSourceMaxValue ?
            this.heatMap.dataSourceMaxValue : heatMap.legendColorCollection[i].endValue) - this.legendMinValue) /
            (this.legendMaxValue - this.legendMinValue);
        if (this.heatMap.legendColorCollection[0].startValue !== this.heatMap.dataSourceMinValue && i === 0 &&
            this.heatMap.legendColorCollection[0].startValue > this.heatMap.dataSourceMinValue) {

            value = (this.heatMap.legendColorCollection[0].startValue - this.legendMinValue) /
                (this.legendMaxValue - this.legendMinValue);
            grd.addColorStop(value / 2, this.heatMap.paletteSettings.fillColor.minColor);
            grd.addColorStop(value, this.heatMap.paletteSettings.fillColor.maxColor);
        }
        grd.addColorStop(value, heatMap.legendColorCollection[i].minColor);
        grd.addColorStop(value1, heatMap.legendColorCollection[i].maxColor);
        if (this.heatMap.legendColorCollection[i].endValue !== ((i === this.heatMap.legendColorCollection.length - 1) ?
            this.heatMap.dataSourceMaxValue : this.heatMap.legendColorCollection[i + 1].startValue) &&
            this.heatMap.legendColorCollection[i].endValue < this.heatMap.dataSourceMaxValue) {
            value = (heatMap.legendColorCollection[i].endValue - this.legendMinValue) /
                (this.legendMaxValue - this.legendMinValue);
            grd.addColorStop(value, this.heatMap.paletteSettings.fillColor.minColor);
            value = ((i === this.heatMap.legendColorCollection.length - 1 ? this.heatMap.dataSourceMaxValue :
                heatMap.legendColorCollection[i + 1].startValue) - this.legendMinValue) /
                (this.legendMaxValue - this.legendMinValue);
            grd.addColorStop(value, this.heatMap.paletteSettings.fillColor.maxColor);
        }
    }
    private calculateColorRange(i: number, cgradientColors: GradientColor[] = []): void {
        const heatMap: HeatMap = this.heatMap; heatMap.toggleValue = [];

        let gradientPercentage: number;
        let gradientColor: GradientColor;
        let gradientColor2: GradientColor; let gradientColor3: GradientColor;
        if (this.heatMap.legendColorCollection[0].startValue > this.heatMap.dataSourceMinValue && i === 0) {
            gradientPercentage = (this.heatMap.dataSourceMinValue - this.legendMinValue) /
                (this.legendMaxValue - this.legendMinValue) * 100;
            gradientPercentage = isNaN(gradientPercentage) ? 0 : gradientPercentage;
            gradientColor = new GradientColor(heatMap.paletteSettings.fillColor.minColor, gradientPercentage + '%');
            cgradientColors.push(gradientColor);
            gradientPercentage = (heatMap.legendColorCollection[0].startValue - this.legendMinValue) /
                (this.legendMaxValue - this.legendMinValue) * 100;
            gradientColor = new GradientColor(heatMap.paletteSettings.fillColor.maxColor, gradientPercentage + '%');
            cgradientColors.push(gradientColor);
        }
        gradientPercentage = ((heatMap.legendColorCollection[i].startValue - this.legendMinValue) /
            (this.legendMaxValue - this.legendMinValue)) * 100;
        gradientPercentage = isNaN(gradientPercentage) ? 0 : gradientPercentage;
        gradientColor = new GradientColor(
            heatMap.legendColorCollection[i].minColor, gradientPercentage + '%');
        cgradientColors.push(gradientColor);
        gradientPercentage = (heatMap.legendColorCollection[i].endValue - this.legendMinValue) /
            (this.legendMaxValue - this.legendMinValue) * 100;
        const gradientColor1: GradientColor = new GradientColor(heatMap.legendColorCollection[i].maxColor, gradientPercentage + '%');
        cgradientColors.push(gradientColor1);
        if (this.heatMap.legendColorCollection[i].endValue !== ((i === this.heatMap.legendColorCollection.length - 1) ?
            this.heatMap.dataSourceMaxValue : this.heatMap.legendColorCollection[i + 1].startValue)) {
            gradientPercentage = (heatMap.legendColorCollection[i].endValue - this.legendMinValue) /
                (this.legendMaxValue - this.legendMinValue) * 100;
            gradientColor2 = new GradientColor(this.heatMap.paletteSettings.fillColor.minColor, (gradientPercentage) + '%');
            cgradientColors.push(gradientColor2);
            gradientPercentage = ((i === (this.heatMap.legendColorCollection.length - 1) ?
                this.heatMap.dataSourceMaxValue : heatMap.legendColorCollection[i + 1].startValue) - this.legendMinValue) /
                (this.legendMaxValue - this.legendMinValue) * 100;
            gradientColor3 = new GradientColor(this.heatMap.paletteSettings.fillColor.maxColor, (gradientPercentage) + '%');
            cgradientColors.push(gradientColor3);
        }
    }
    private renderTitle(rect: Rect): void {
        const heatMap: HeatMap = this.heatMap;
        if (heatMap.legendSettings.title.text) {
            const title: TitleModel = heatMap.legendSettings.title;
            const titleSize: Size = measureText(title.text, title.textStyle);
            let padding: number = !heatMap.legendSettings.showLabel ? heatMap.horizontalGradient ? 10 : 6 : this.labelPadding;
            let y: number; const anchor: string = 'start';
            let maxWidth: number; let dominantBaseline: string;
            let text: string = title.text;
            let options: TextOption;
            let yValue: number;
            if (heatMap.legendSettings.title.textStyle.textOverflow === 'Trim') {
                maxWidth = this.width - 10;
                text = textTrim(maxWidth, text, title.textStyle);
            }
            if (!heatMap.horizontalGradient) {
                padding = - (padding + titleSize.height / 4);
                if (text.length !== 0 && heatMap.enableCanvasRendering) {
                    this.legendTitleTooltip.push(new CanvasTooltip(
                        title.text, new Rect(
                            rect.x, rect.y - titleSize.height, maxWidth, titleSize.height)));
                }
                options = new TextOption(
                    heatMap.element.id + '_legendTitle',
                    new TextBasic(
                        rect.x, rect.y + padding, anchor, text, 0, 'translate(0,0)', dominantBaseline),
                    title.textStyle,
                    title.textStyle.color || heatMap.themeStyle.heatMapTitle);
            } else {
                y = rect.y + (heatMap.legendSettings.position === 'Top' ? 0 :
                    -(10 + titleSize.height + padding));
                padding = heatMap.legendSettings.position === 'Top' ? - (padding + titleSize.height / 4) :
                    (padding + (3 * titleSize.height / 4));
                yValue = heatMap.legendSettings.position === 'Bottom' ? y : y - titleSize.height;
                if (text.length !== 0 && heatMap.enableCanvasRendering) {
                    this.legendTitleTooltip.push(new CanvasTooltip(
                        title.text,
                        new Rect(rect.x, yValue, maxWidth, titleSize.height)));
                }
                titleSize.width = rect.width < titleSize.width ? rect.width : titleSize.width;
                options = new TextOption(
                    heatMap.element.id + '_legendTitle',
                    new TextBasic(
                        rect.x + (rect.width / 2) - (titleSize.width / 2), y + padding, anchor, text, 0, 'translate(0,0)', dominantBaseline),
                    title.textStyle, title.textStyle.color || heatMap.themeStyle.heatMapTitle);
            }
            this.drawSvgCanvas.createText(options, this.legend, text);
        }
    }
    private renderSmartLegend(): void {
        const heatMap: HeatMap = this.heatMap;
        const colorCollection: ColorCollection[] = heatMap.colorCollection;
        let smartLegendRect: Rect;
        const tempBorder: BorderModel = {
            color: 'transparent',
            width: 0
        };
        const legendBound: Rect = this.legendRectScale;
        let legendX: number; let legendY: number; let legendWidth: number; let legendHeight: number;
        const width: number = legendBound.width / colorCollection.length;
        const height: number = legendBound.height / colorCollection.length;
        this.legendRectPositionCollection = []; this.legendRange = [];
        for (let i: number = 0; i < heatMap.legendColorCollection.length; i++) {
            const rectPosition: CurrentLegendRect = new CurrentLegendRect(0, 0, 0, 0, '', '');
            if (heatMap.horizontalGradient) {
                legendX = legendBound.x + (i * width);
                legendY = legendBound.y;
                legendWidth = width;
                legendHeight = legendBound.height;
                this.segmentCollections.push((heatMap.legendSettings.labelDisplayType === 'Edge' &&
                    i === heatMap.legendColorCollection.length - 1 && !heatMap.legendColorCollection[i].isHidden) ?
                    legendX + width : legendX);
            } else {
                legendX = legendBound.x;
                legendY = legendBound.y + (i * height);
                legendWidth = legendBound.width;
                legendHeight = height;
                this.segmentCollections.push((heatMap.legendSettings.labelDisplayType === 'Edge' &&
                    i === heatMap.legendColorCollection.length - 1 && !heatMap.legendColorCollection[i].isHidden) ?
                    legendY + height : legendY);
            }
            smartLegendRect = new Rect(legendX, legendY, legendWidth, legendHeight);
            const legendRange: LegendRange = new LegendRange(0, 0, 0, 0, 0, true, 0);
            legendRange.x = legendX; legendRange.y = legendY; legendRange.width = legendWidth;
            legendRange.height = legendHeight; legendRange.value = this.heatMap.isColorRange ?
                heatMap.legendColorCollection[i].endValue : heatMap.legendColorCollection[i].value;
            legendRange.currentPage = this.currentPage;
            if (colorCollection.length !== heatMap.legendColorCollection.length && i === heatMap.legendColorCollection.length - 1) {
                if ( heatMap.horizontalGradient ) {
                    legendRange.width = 0; }
                else {
                    legendRange.height = 0; }
                this.visibilityCollections[i] = this.visibilityCollections[i - 1];
            }
            legendRange.visible = !isNullOrUndefined(this.visibilityCollections[i]) ? this.visibilityCollections[i] : true;
            this.legendRange.push(legendRange);
            if (!heatMap.legendColorCollection[i].isHidden) {
                const color: string = heatMap.legendOnLoad ? this.heatMap.isColorRange ? colorCollection[i].minColor :
                    colorCollection[i].color : this.legendRange[i].visible ? this.heatMap.isColorRange ? colorCollection[i].minColor :
                    colorCollection[i].color : '#D3D3D3';
                const rectItem: RectOption = new RectOption(
                    heatMap.element.id + '_Smart_Legend' + i, color, tempBorder, 1, smartLegendRect
                );
                this.drawSvgCanvas.drawRectangle(rectItem, this.legend);
                rectPosition.x = legendX;
                rectPosition.y = legendY;
                rectPosition.width = legendWidth;
                rectPosition.height = legendHeight;
                rectPosition.label = this.labelCollections[i];
                rectPosition.id = heatMap.element.id + '_Smart_Legend' + i;
                this.legendRectPositionCollection.push(rectPosition);
                const text: string[] = getTitle(this.labelCollections[i], heatMap.legendSettings.textStyle, this.textWrapCollections[i]);
                if (text.length !== 0 && heatMap.enableCanvasRendering) {
                    const elementSize: Size = measureText(this.labelCollections[i], heatMap.legendSettings.textStyle);
                    this.legendLabelTooltip.push(new CanvasTooltip(
                        this.labelCollections[i],
                        new Rect(rectPosition.x, rectPosition.y, elementSize.width, elementSize.height)));
                }
            }
        }
    }

    private colorRangeLegendPosition(i: number, labelX: number): void {
        if (this.segmentCollections.length !== this.segmentCollectionsLabels.length) {
            for (let k: number = 0; k < this.segmentCollections.length; k++) {
                if (this.segmentCollectionsLabels[i] === this.segmentCollections[k]) {
                    labelX = this.segmentCollectionsLabels[i] + (((k === this.segmentCollections.length - 1 ?
                        (this.heatMap.horizontalGradient ? this.width : this.height) :
                        this.segmentCollections[k + 1]) - this.segmentCollections[k]) / 2);
                    break;
                }
            }
        } else {
            labelX = this.segmentCollectionsLabels[i] + (((i === this.segmentCollectionsLabels.length - 1 ?
                (this.heatMap.horizontalGradient ? this.width : this.height) :
                this.segmentCollectionsLabels[i + 1]) - this.segmentCollectionsLabels[i]) / 2);
        }
        this.labelPosition = labelX;
    }

    private renderLegendLabel(rect: Rect): void {
        const heatMap: HeatMap = this.heatMap; this.legendTextRange = [];
        if (heatMap.legendSettings.showLabel && (heatMap.paletteSettings.type === 'Gradient' ||
            (heatMap.paletteSettings.type === 'Fixed' && heatMap.legendSettings.labelDisplayType !== 'None'))) {
            let anchor: string = 'start'; let dominantBaseline: string; let legendLabel: Element; let textWrapWidth: number = 0;
            let text: string[]; this.legendLabelTooltip = []; let elementSize: Size; const isColorRange: boolean = heatMap.isColorRange;
            const colorCollection: ColorCollection[] = heatMap.legendColorCollection;
            if (heatMap.enableCanvasRendering) {
                const ctx: CanvasRenderingContext2D = heatMap.canvasRenderer.ctx;
                ctx.rect(this.legendGroup.x, this.legendGroup.y, this.legendGroup.width, this.legendGroup.height);
                ctx.save(); ctx.clip(); ctx.restore();
            } else {
                legendLabel = heatMap.renderer.createGroup({ id: heatMap.element.id + '_Heatmap_LegendLabel' });
            }
            let labelX: number; let labelY: number;
            for (let i: number = 0; i < colorCollection.length; i++) {
                const value: number = ((colorCollection[i].value - (Math.round(this.legendMinValue * 100) / 100)) /
                    ((Math.round(this.legendMaxValue * 100) / 100) - (Math.round(this.legendMinValue * 100) / 100))) * 100;
                if (heatMap.horizontalGradient) {
                    if (this.heatMap.isColorRange && heatMap.paletteSettings.type === 'Gradient') {
                        this.colorRangeLegendPosition(i, labelX); labelX = this.labelPosition;
                    } else if (this.heatMap.legendSettings.enableSmartLegend && this.heatMap.isColorRange &&
                        heatMap.paletteSettings.type === 'Fixed') {
                        labelX = this.segmentCollections[i] + ((rect.width / colorCollection.length) / 2);
                    } else { labelX = this.segmentCollections[i]; }
                    labelY = rect.y + rect.height + this.labelPadding;
                    anchor = (((Math.round(value * 100) / 100) === 0 && !isColorRange) || (heatMap.paletteSettings.type === 'Fixed' &&
                        i === 0)) ? 'start' : (((Math.round(value * 100) / 100) === 100 && heatMap.paletteSettings.type === 'Gradient' &&
                            !isColorRange) || (Math.round(heatMap.dataSourceMaxValue * 100) / 100) === colorCollection[i].value &&
                            heatMap.legendSettings.enableSmartLegend) || (heatMap.legendSettings.enableSmartLegend &&
                                heatMap.paletteSettings.type === 'Fixed' && heatMap.legendSettings.labelDisplayType === 'Edge') ? 'end' : 'middle';
                    dominantBaseline = 'hanging';
                } else {
                    labelX = rect.x + rect.width + this.labelPadding;
                    if (this.heatMap.isColorRange && heatMap.paletteSettings.type === 'Gradient') {
                        this.colorRangeLegendPosition(i, labelY); labelY = this.labelPosition;
                    } else if (this.heatMap.legendSettings.enableSmartLegend && this.heatMap.isColorRange &&
                        heatMap.paletteSettings.type === 'Fixed') {
                        labelY = this.segmentCollections[i] + ((rect.height / colorCollection.length) / 2);
                    } else { labelY = this.segmentCollections[i]; }
                    dominantBaseline = (((Math.round(value * 100) / 100) === 0 && !isColorRange) || (i === 0 &&
                        heatMap.paletteSettings.type === 'Fixed')) ? 'hanging' : (((Math.round(value * 100) / 100) === 100 &&
                            !isColorRange && heatMap.paletteSettings.type === 'Gradient') ||
                            (Math.round(heatMap.dataSourceMaxValue * 100) / 100) === colorCollection[i].value &&
                            heatMap.legendSettings.enableSmartLegend) || (heatMap.legendSettings.enableSmartLegend &&
                                heatMap.legendSettings.labelDisplayType === 'Edge' &&
                                heatMap.paletteSettings.type === 'Fixed') ? 'auto' : 'middle';
                }
                textWrapWidth = heatMap.horizontalGradient ? this.textWrapCollections[i] : this.width - (this.legendRectScale.width +
                    this.labelPadding + this.legendRectPadding);
                text = getTitle(this.labelCollections[i], heatMap.legendSettings.textStyle, textWrapWidth);
                elementSize = measureText(text[0], heatMap.legendSettings.textStyle);

                if (heatMap.paletteSettings.type === 'Fixed') {
                    const rectY: number = dominantBaseline === 'hanging' ? labelY : dominantBaseline === 'middle' ?
                        labelY - elementSize.height / 2 : labelY - elementSize.height;
                    const rectX: number = anchor === 'end' ? labelX - elementSize.width : anchor === 'middle' ?
                        labelX - elementSize.width / 2 : labelX;
                    const textPosition: LegendRange = new LegendRange(
                        rectX, rectY, elementSize.width, elementSize.height, colorCollection[i].value, true, this.currentPage);
                    textPosition.visible = !isNullOrUndefined(this.visibilityCollections[i]) ? this.visibilityCollections[i] : true;
                    this.legendTextRange.push(textPosition);
                }
                if (this.labelCollections[i] !== '') {
                    if (text.length !== 0 && text[0].indexOf('...') !== -1 && heatMap.enableCanvasRendering) {
                        this.legendLabelTooltip.push(new CanvasTooltip(
                            this.labelCollections[i], new Rect(labelX, labelY, elementSize.width, elementSize.height)));
                    }
                    const textBasic: TextBasic = new TextBasic(labelX, labelY, anchor, text, 0, 'translate(0,0)', dominantBaseline);
                    const options: TextOption = new TextOption(
                        heatMap.element.id + '_Legend_Label' + i, textBasic, heatMap.legendSettings.textStyle,
                        heatMap.legendSettings.textStyle.color || heatMap.themeStyle.legendLabel);
                    options.fill = heatMap.legendOnLoad ? options.fill :
                        (heatMap.paletteSettings.type === 'Fixed' && !this.legendRange[i].visible) ? '#D3D3D3' : options.fill;
                    if (text.length > 1) {
                        this.drawSvgCanvas.createWrapText(options, heatMap.legendSettings.textStyle, legendLabel);
                    } else { this.drawSvgCanvas.createText(options, legendLabel, text[0]); }
                    if (Browser.isIE && !heatMap.enableCanvasRendering) {
                        if (dominantBaseline === 'middle') {
                            (legendLabel.lastChild as Element).setAttribute('dy', '0.6ex');
                        } else if (dominantBaseline === 'hanging') {
                            (legendLabel.lastChild as Element).setAttribute('dy', '1.5ex');
                        }
                    }
                }
                if (this.legendMaxValue === this.legendMinValue && heatMap.paletteSettings.type === 'Gradient') { break; }
            }
            if (!heatMap.enableCanvasRendering) {
                this.legendGroup.height = this.legendGroup.height > 0 ? this.legendGroup.height : 0;
                this.legendGroup.width = this.legendGroup.width > 0 ? this.legendGroup.width : 0;
                this.legend.appendChild(legendLabel as HTMLElement);
                const clippath: Element = heatMap.renderer.createClipPath({ id: heatMap.element.id + '_clipPath' });
                const clipRect: Element = heatMap.renderer.drawRectangle(this.legendGroup);
                clippath.appendChild(clipRect); heatMap.svgObject.appendChild(clippath);
                this.legend.setAttribute('style', 'clip-path:url(#' + clippath.id + ')');
            }
        }
    }
    /**
     * @private
     */

    public renderGradientPointer(e: PointerEvent, pageX: number, pageY: number): void {
        const heatMap: HeatMap = this.heatMap;
        const currentRect: CurrentRect = heatMap.heatMapSeries.getCurrentRect(pageX, pageY);
        const cellValue: string = heatMap.bubbleSizeWithColor ? (currentRect.value as BubbleTooltipData[])[0].bubbleData.toString() !== '' ?
            !this.heatMap.isColorValueExist ? (currentRect.value as BubbleTooltipData[])[0].bubbleData.toString() :
                (currentRect.value as BubbleTooltipData[])[1].bubbleData.toString() : '' : currentRect.value.toString();
        const rect: Rect = this.legendRectScale;
        let legendPart: number;
        let direction: string; let options: PathOption; let legendPath: number;
        let pathX1: number; let pathY1: number; let pathX2: number; let pathY2: number; let pathX3: number; let pathY3: number;
        if (cellValue.toString() !== '') {
            if (!heatMap.horizontalGradient) {
                legendPart = rect.height / 100;
                legendPath = legendPart * ((Number(cellValue) - this.legendMinValue) /
                    (this.legendMaxValue - this.legendMinValue)) * 100;
                legendPath = isNaN(legendPath) ? 0 : legendPath;
                pathX1 = rect.x - 1;
                pathY1 = rect.y + legendPath;
                pathX2 = pathX3 = rect.x - 8;
                pathY2 = rect.y - 5 + legendPath;
                pathY3 = rect.y + 5 + legendPath;
            } else {
                legendPart = rect.width / 100;
                legendPath = legendPart * ((Number(cellValue) - this.legendMinValue) /
                    (this.legendMaxValue - this.legendMinValue)) * 100;
                legendPath = isNaN(legendPath) ? 0 : legendPath;
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
        const heatMap: HeatMap = this.heatMap;
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
        const heatMap: HeatMap = this.heatMap;
        const legendSettings: LegendSettingsModel = heatMap.legendSettings; this.labelCollection = [];
        this.labelCollections = []; const colorCollection: LegendColorCollection[] = heatMap.legendColorCollection;
        if (legendSettings.position !== 'Bottom' && legendSettings.position !== 'Top' &&
            legendSettings.position !== 'Right' && legendSettings.position !== 'Left') {
            legendSettings.position = 'Right';
        }
        const title: TitleModel = heatMap.legendSettings.title; const titleSize: Size = measureText(title.text, title.textStyle);
        heatMap.horizontalGradient = legendSettings.position === 'Bottom' || legendSettings.position === 'Top';
        this.legendRectPadding = heatMap.horizontalGradient ? heatMap.legendSettings.title.text ?
            titleSize.height + 16 : 16 : 10; // padding between rect and legend
        this.labelPadding = legendSettings.showLabel ? this.heatMap.horizontalGradient ? 10 : 6 : 0; // padding between list and label
        this.legendHeight = legendSettings.height; this.legendWidth = legendSettings.width;
        const format: string = heatMap.legendSettings.labelFormat; const isCustom: boolean = format.match('{value}') !== null;
        this.format = heatMap.intl.getNumberFormat({ format: isCustom ? '' : format });
        if (heatMap.paletteSettings.type === 'Fixed') {
            for (let i: number = 0; i < colorCollection.length; i++) {
                const label: string = colorCollection[i].label ? colorCollection[i].label : this.heatMap.isColorRange ?
                    colorCollection[i].startValue.toString() + '-' + colorCollection[i].endValue.toString() : formatValue(
                        isCustom, format, colorCollection[i].value, this.format).toString();
                const legendEventArg: ILegendRenderEventArgs = { cancel: false, text: label, name: 'legendRender' };
                this.labelCollection.push(label);
                this.heatMap.trigger('legendRender', legendEventArg);
                if (heatMap.legendRender) {
                    if (heatMap.legendSettings.enableSmartLegend && heatMap.legendSettings.labelDisplayType === 'Edge'
                        && i > 0 && i < colorCollection.length - 1) {
                        this.labelCollections.push('');
                    } else {
                        if (!legendEventArg.cancel) {
                            this.labelCollections.push(legendEventArg.text);
                        } else { this.labelCollections.push(''); }
                    }
                } else {
                    if (heatMap.legendSettings.enableSmartLegend && heatMap.legendSettings.labelDisplayType === 'Edge'
                        && i > 0 && i < colorCollection.length - 1) {
                        this.labelCollections.push('');
                    } else { this.labelCollections.push(label); }
                }
            }
        } else {
            for (let i: number = 0; i < colorCollection.length; i++) {
                const label: string = colorCollection[i].isHidden ? '' : colorCollection[i].label ? colorCollection[i].label :
                    this.heatMap.isColorRange ? colorCollection[i].startValue.toString() + '-' + colorCollection[i].endValue.toString() :
                        formatValue(isCustom, format, colorCollection[i].value, this.format).toString();
                const legendEventArg: ILegendRenderEventArgs = { cancel: false, text: label, name: 'legendRender'};
                if (!colorCollection[i].isHidden) { this.heatMap.trigger('legendRender', legendEventArg); }
                if (heatMap.legendRender) {
                    if (!legendEventArg.cancel) {
                        if (i > 0 && i < colorCollection.length - 1 && heatMap.legendSettings.labelDisplayType === 'Edge') {
                            this.labelCollections.push('');
                        } else {
                            if (!legendEventArg.cancel) {
                                this.labelCollections.push(legendEventArg.text);
                            } else { this.labelCollections.push(''); }
                        }
                    } else {
                        this.labelCollections.push('');
                    }
                } else {
                    if (i > 0 && i < colorCollection.length - 1 && heatMap.legendSettings.labelDisplayType === 'Edge') {
                        this.labelCollections.push('');
                    } else { this.labelCollections.push(label); }
                }
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
            this.calculateTitleBounds();
        } else {
            this.calculateListLegendBounds(rect);
        }
        this.legendHeight = this.legendHeight ? this.legendHeight : heatMap.horizontalGradient ? '50' : '100%';
        this.legendWidth = this.legendWidth ? this.legendWidth : heatMap.horizontalGradient ?
            '100%' : heatMap.paletteSettings.type === 'Fixed' && !heatMap.legendSettings.enableSmartLegend ? '70' : '50';
        this.height = stringToNumber(this.legendHeight, rect.height);
        this.width = stringToNumber(this.legendWidth, rect.width);
        if (heatMap.horizontalGradient) {
            this.height = heatMap.paletteSettings.type === 'Gradient' || heatMap.legendSettings.enableSmartLegend ?
                this.height < 50 ? 50 : this.height : this.height;
            if (legendSettings.position === 'Top') {
                rect.y += this.height;
            }
            rect.height -= this.height;
        } else {
            this.width = heatMap.paletteSettings.type === 'Gradient' || heatMap.legendSettings.enableSmartLegend ?
                this.width < 50 ? 50 : this.width : this.width;
            if (legendSettings.position === 'Left') {
                rect.x += this.width;
            }
            rect.width -= this.width;
        }
    }

    private calculateTitleBounds(): void {
        const heatMap: HeatMap = this.heatMap;
        const title: TitleModel = heatMap.legendSettings.title;
        const titleSize: Size = measureText(title.text, title.textStyle);
        if (heatMap.legendSettings.title.text) {
            if ((heatMap.legendSettings.position === 'Top' || heatMap.legendSettings.position === 'Bottom') &&
                heatMap.legendSettings.height === '') {
                this.legendHeight = (((2 * this.legendRectPadding) - titleSize.height) +
                    this.legendSize + this.maxLegendLabelSize.height).toString();
            }
            if (heatMap.legendSettings.width === '' && (heatMap.legendSettings.textStyle.textOverflow === 'None' ||
                (heatMap.paletteSettings.type === 'Fixed' && heatMap.legendSettings.enableSmartLegend &&
                    heatMap.legendSettings.labelDisplayType === 'None'))) {
                if (heatMap.legendSettings.position === 'Right') {
                    this.legendWidth = ((2 * this.legendRectPadding + titleSize.width) +
                        this.legendSize + this.maxLegendLabelSize.width).toString();
                } else if (heatMap.legendSettings.position === 'Left') {
                    titleSize.width = titleSize.width > this.maxLegendLabelSize.width ? titleSize.width : this.maxLegendLabelSize.width;
                    this.legendWidth = ((2 * this.legendRectPadding + titleSize.width) + this.legendSize).toString();
                }
            }
        }
    }
    private calculateListLegendBounds(rect: Rect): void {
        const heatMap: HeatMap = this.heatMap;
        this.listWidth = 0;
        this.listHeight = 0;
        this.currentPage = 1;
        const padding: number = 10; // padding of paging elements
        const title: TitleModel = heatMap.legendSettings.title;
        const titleSize: Size = measureText(title.text, title.textStyle);
        const height: string = (titleSize.height + 50).toString();
        if (heatMap.horizontalGradient) {
            for (let i: number = 0; i < heatMap.colorCollection.length; i++) {
                let size: number = 0;
                if (heatMap.legendSettings.showLabel) {
                    const text: string = this.labelCollections[i];
                    size = measureText(text, heatMap.legendSettings.textStyle).width;
                }
                const perListWidth: number = this.legendSize + this.labelPadding + size + this.listInterval;
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
            this.listHeight = ((this.legendSize + this.listInterval) * heatMap.colorCollection.length)
                + this.listInterval + (heatMap.legendSettings.title.text ? titleSize.height : 0);
            if (this.legendHeight === '') {
                this.legendHeight = this.listHeight > rect.height ? rect.height.toString() : this.listHeight.toString();
            }
            if (this.legendWidth === '' && heatMap.legendSettings.textStyle.textOverflow !== 'Trim') {
                this.maxLegendLabelSize = this.getMaxLabelSize();
                this.maxLegendLabelSize.width = titleSize.width > this.maxLegendLabelSize.width ?
                    titleSize.width : this.maxLegendLabelSize.width;
                this.legendWidth = ((2 * this.legendRectPadding) + this.legendSize + this.labelPadding +
                    this.maxLegendLabelSize.width).toString();
            }
        }
        if (stringToNumber(this.legendHeight, rect.height) < 50) {
            this.legendHeight = height;
        }
        if (stringToNumber(this.legendWidth, rect.width) < 70) {
            this.legendWidth = '70';
        }
    }

    private getMaxLabelSize(): Size {
        const heatMap: HeatMap = this.heatMap;
        this.maxLegendLabelSize = new Size(0, 0);
        if (!heatMap.legendSettings.showLabel || (heatMap.horizontalGradient && heatMap.paletteSettings.type === 'Fixed' &&
            !heatMap.legendSettings.enableSmartLegend) || (heatMap.paletteSettings.type === 'Fixed' &&
                heatMap.legendSettings.labelDisplayType === 'None')) {
            return this.maxLegendLabelSize;
        } else {
            const labelSize: Size = this.maxLegendLabelSize;
            for (let i: number = 0; i < heatMap.legendColorCollection.length; i++) {
                const size: Size = measureText(this.labelCollections[i], heatMap.legendSettings.textStyle);
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
        const heatMap: HeatMap = this.heatMap;
        const legendSettings: LegendSettingsModel = heatMap.legendSettings;
        let left: number; let top: number; const padding: number = 10; // inner padding for axis title and axil labels
        const alignment: string = legendSettings.alignment; let width: number;
        let height: number = stringToNumber(this.legendHeight, rect.height);
        if (!heatMap.legendSettings.title.text) {
            width = stringToNumber(this.legendWidth, rect.width);
        } else {
            width = this.width;
        }
        const axis: Axis[] = heatMap.axisCollections; let axisTitlePadding: number = 0;
        if (heatMap.horizontalGradient) {
            width = width > rect.width ? rect.width : width;
            height = heatMap.paletteSettings.type === 'Gradient' || heatMap.legendSettings.enableSmartLegend ?
                height > 50 ? height : 50 : this.height;
            left = alignment === 'Near' ? rect.x : alignment === 'Far' ? rect.x + rect.width - width :
                rect.x + (rect.width / 2) - (width / 2);
            if (heatMap.xAxis.title.text !== '') {
                axisTitlePadding = measureText(heatMap.xAxis.title.text, heatMap.xAxis.textStyle).height + padding;
            }
            const axisHeight: number = axis[0].opposedPosition ? 0 : sum(axis[0].xAxisMultiLabelHeight) + axis[0].maxLabelSize.height +
                axisTitlePadding + padding;
            top = legendSettings.position === 'Top' ? heatMap.titleSettings.text ? legendTop :
                heatMap.margin.top : rect.y + rect.height + axisHeight;
        } else {
            height = height > rect.height ? rect.height : height;
            width = heatMap.paletteSettings.type === 'Gradient' || heatMap.legendSettings.enableSmartLegend ?
                width > 50 ? width : 50 : width;
            top = alignment === 'Near' ? rect.y : alignment === 'Far' ? rect.y + rect.height - height :
                rect.y + (rect.height / 2) - (height / 2);
            if (heatMap.yAxis.title.text !== '') {
                axisTitlePadding = measureText(heatMap.yAxis.title.text, heatMap.yAxis.textStyle).height + padding;
            }
            const axisWidth: number = axis[1].opposedPosition ? sum(axis[1].yAxisMultiLabelHeight) +
                axis[1].maxLabelSize.width + axisTitlePadding + 2 * padding : 0;
            left = legendSettings.position === 'Right' ? rect.x + rect.width + axisWidth : heatMap.margin.left;
        }
        this.legendGroup = new Rect(left, top, width, height);
        this.calculateGradientScale(this.legendGroup);
    }

    // calculating number of lists per page
    private measureListLegendBound(rect: Rect): void {
        const heatMap: HeatMap = this.heatMap; const title: TitleModel = heatMap.legendSettings.title;
        const padding: number = 15; // padding of paging element
        this.numberOfPages = 1; const titleSize: Size = measureText(title.text, title.textStyle);
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
                maxHeight = heatMap.legendSettings.title.text ? maxHeight - titleSize.height : maxHeight;
                this.listPerPage = Math.floor(maxHeight / (this.legendSize + this.listInterval) - 1);
                this.numberOfPages = Math.max(1, Math.ceil(heatMap.colorCollection.length / this.listPerPage));
            } else {
                this.listPerPage = heatMap.colorCollection.length;
                this.legendHeight = this.listHeight.toString();
            }
        }
    }

    private renderPagingElements(): void {
        const heatMap: HeatMap = this.heatMap;
        if (this.numberOfPages > 1) {
            this.navigationCollections = [];
            this.legend.appendChild(this.paginggroup);
            const iconSize: number = 10;
            const rightArrowX: number = this.legendGroup.x + this.legendGroup.width - iconSize;
            const rightArrowY: number = this.legendGroup.y + this.legendGroup.height - iconSize;
            const text: string = this.currentPage + '/' + this.numberOfPages;
            const textSize: Size = measureText(text, heatMap.legendSettings.textStyle);
            const textX: number = rightArrowX - textSize.width - 15;
            const textBasic: TextBasic = new TextBasic(textX, rightArrowY, 'start', text, 0, 'translate(0,0)', 'middle');
            const options: TextOption = new TextOption(
                heatMap.element.id + '_paging', textBasic, heatMap.legendSettings.textStyle,
                heatMap.legendSettings.textStyle.color || heatMap.themeStyle.legendLabel);
            this.drawSvgCanvas.createText(options, this.paginggroup, text);
            if (Browser.isIE && !heatMap.enableCanvasRendering) {
                (this.paginggroup.lastChild as Element).setAttribute('dy', '0.6ex');
            }
            this.pagingRect = new Rect(textX, rightArrowY - textSize.height / 2, textSize.width, textSize.height);
            const pagingTextRect: RectOption = new RectOption(
                heatMap.element.id + '_pagingText', 'none', { color: 'transparent', width: 0 },
                1, this.pagingRect);
            this.drawSvgCanvas.drawRectangle(pagingTextRect, this.paginggroup);
            const rightArrowRect: RectOption = new RectOption(
                heatMap.element.id + '_rightArrow', 'none', { color: 'transparent', width: 0 }, 1,
                new Rect(rightArrowX - iconSize, rightArrowY - iconSize / 2, iconSize, iconSize));
            this.drawSvgCanvas.drawRectangle(rightArrowRect, this.paginggroup);


            const rightArrow: string = 'M' + ' ' + (rightArrowX) + ' ' + rightArrowY + ' ' +
                'L' + ' ' + (rightArrowX - iconSize) + ' ' + (rightArrowY - iconSize / 2) + ' ' + 'L' + ' ' +
                (rightArrowX - iconSize) + ' ' + (rightArrowY + (iconSize / 2)) + 'Z';
            const leftX: number = textX - 15;

            const leftArrow: string = 'M' + ' ' + leftX + ' ' + rightArrowY + ' ' +
                'L' + ' ' + (leftX + iconSize) + ' ' + (rightArrowY - iconSize / 2) + ' ' + 'L' + ' ' +
                (leftX + iconSize) + ' ' + (rightArrowY + (iconSize / 2)) + 'Z';

            const leftArrowRect: RectOption = new RectOption(
                heatMap.element.id + '_leftArrow', 'none', { color: 'transparent', width: 0 }, 1,
                new Rect(leftX, rightArrowY - iconSize / 2, iconSize, iconSize));
            this.drawSvgCanvas.drawRectangle(leftArrowRect, this.paginggroup);

            const leftOption: PathOption = new PathOption(
                heatMap.element.id + '_Legend_leftarrow', 'gray', 0.01, '#A0A0A0', 1, '0,0', leftArrow);
            const rightOption: PathOption = new PathOption(
                heatMap.element.id + '_Legend_rightarrow', 'gray', 0.01, '#A0A0A0', 1, '0,0', rightArrow);
            this.navigationCollections.push(rightArrowRect);
            this.navigationCollections.push(leftArrowRect);

            if (!heatMap.enableCanvasRendering) {
                const arrow: Element = heatMap.renderer.drawPath(leftOption);
                const rightarrow: Element = heatMap.renderer.drawPath(rightOption);
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
        const heatMap: HeatMap = this.heatMap;
        const padding: number = 10; // padding between legend bounds and gradient scale
        let left: number; let top: number; let height: number; let width: number;
        const title: TitleModel = heatMap.legendSettings.title;
        const titleSize: Size = measureText(title.text, title.textStyle);
        const titleHeight: number = heatMap.legendSettings.title.text ? titleSize.height : 0;
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
            top = scale.y + padding + titleHeight;
            width = (heatMap.paletteSettings.type === 'Fixed' && !heatMap.legendSettings.enableSmartLegend) ?
                scale.width - padding : this.gradientScaleSize;
            height = heatMap.paletteSettings.type === 'Fixed' && !heatMap.legendSettings.enableSmartLegend ?
                (this.legendSize + this.listInterval) * this.listPerPage - this.listInterval :
                scale.height - 2 * padding - titleHeight;
        }
        this.legendRectScale = new Rect(left, top, width, height);
        if (heatMap.paletteSettings.type === 'Gradient' || heatMap.paletteSettings.type === 'Fixed' &&
            heatMap.legendSettings.enableSmartLegend) {
            this.calculateColorAxisGrid(this.legendRectScale);
        }
    }

    private calculateColorAxisGrid(legendRect: Rect): void {
        const heatMap: HeatMap = this.heatMap;
        const rect: Rect = this.legendRectScale;
        let legendPart: number; let text: string[]; let maxTextWrapLength: number = 0;
        this.segmentCollectionsLabels = []; this.segmentCollections = [];
        this.textWrapCollections = []; let pathX1: number; let pathY1: number;
        const colorCollection: ColorCollection[] = heatMap.paletteSettings.type === 'Gradient' ?
            heatMap.legendColorCollection : heatMap.colorCollection;
        const minValue: number = heatMap.bubbleSizeWithColor ? heatMap.minColorValue : heatMap.dataSourceMinValue;
        const maxValue: number = heatMap.bubbleSizeWithColor ? heatMap.maxColorValue : heatMap.dataSourceMaxValue;
        this.legendMinValue = this.heatMap.isColorRange ? (colorCollection[0].startValue > heatMap.dataSourceMinValue) ?
            heatMap.dataSourceMinValue : colorCollection[0].startValue : ((colorCollection[0].value > minValue) ? minValue :
            colorCollection[0].value);
        this.legendMaxValue = this.heatMap.isColorRange ? (colorCollection[colorCollection.length - 1].endValue <
            heatMap.dataSourceMaxValue) ? heatMap.dataSourceMaxValue : colorCollection[colorCollection.length - 1].endValue :
            (colorCollection[colorCollection.length - 1].value < maxValue ? maxValue : colorCollection[colorCollection.length - 1].value);
        if (heatMap.paletteSettings.type === 'Gradient') {
            for (let index: number = 0; index < colorCollection.length; index++) {
                let value: number;
                legendPart = (this.heatMap.isColorRange && heatMap.horizontalGradient ? rect.width : rect.height) / 100;
                if (this.heatMap.isColorRange) {
                    if (colorCollection[0].startValue !== this.heatMap.dataSourceMinValue && index === 0 &&
                        colorCollection[0].startValue > this.heatMap.dataSourceMinValue) {
                        value = (this.heatMap.dataSourceMinValue - this.legendMinValue) /
                            (this.legendMaxValue - this.legendMinValue) * 100;
                        pathY1 = (heatMap.horizontalGradient ? legendRect.x : legendRect.y) + (legendPart * value);
                        this.segmentCollections.push(pathY1);
                    }
                    value = ((((colorCollection[index].startValue < heatMap.dataSourceMinValue && colorCollection[index].endValue >
                        heatMap.dataSourceMaxValue) ? heatMap.dataSourceMinValue : colorCollection[index].startValue) -
                        this.legendMinValue) / (this.legendMaxValue - this.legendMinValue)) * 100;
                    value = isNaN(value) ? 0 : value;
                    pathY1 = (heatMap.horizontalGradient ? legendRect.x : legendRect.y) + (legendPart * value);
                    this.segmentCollections.push(pathY1);
                    this.segmentCollectionsLabels.push(pathY1);
                    if (colorCollection[index].endValue !== ((index === colorCollection.length - 1) ?
                        this.heatMap.dataSourceMaxValue : colorCollection[index + 1].startValue) &&
                        this.heatMap.legendColorCollection[index].endValue < this.heatMap.dataSourceMaxValue) {
                        if (index === colorCollection.length - 1) {
                            value = (colorCollection[index].endValue - this.legendMinValue) /
                                (this.legendMaxValue - this.legendMinValue) * 100;
                            pathY1 = (heatMap.horizontalGradient ? legendRect.x : legendRect.y) + (legendPart * value);
                            this.segmentCollections.push(pathY1);
                        }
                        value = ((index === colorCollection.length - 1 ? this.heatMap.dataSourceMaxValue :
                            colorCollection[index].endValue) - this.legendMinValue) /
                            (this.legendMaxValue - this.legendMinValue) * 100;
                        pathY1 = (heatMap.horizontalGradient ? legendRect.x : legendRect.y) + (legendPart * value);
                        this.segmentCollections.push(pathY1);
                    }
                } else {
                    value = ((colorCollection[index].value - this.legendMinValue) / (this.legendMaxValue - this.legendMinValue)) * 100;
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
        }
        let textWrapWidth: number;
        if (heatMap.horizontalGradient) {
            const segmentWidth: number[] = this.heatMap.isColorRange ? this.segmentCollectionsLabels : this.segmentCollections;
            for (let i: number = 0; i < colorCollection.length; i++) {
                if (heatMap.paletteSettings.type === 'Gradient') {
                    const previousSegmentWidth: number = (segmentWidth[i] - segmentWidth[i - 1]) / 2;
                    const nextSegmentWidth: number = (segmentWidth[i + 1] - segmentWidth[i]) / 2;
                    if (i === colorCollection.length - 1) {
                        textWrapWidth = this.heatMap.isColorRange ? (legendRect.width - segmentWidth[i - 1]) / 2 : previousSegmentWidth;
                    } else if (i === 0) {
                        textWrapWidth = nextSegmentWidth;
                    } else {
                        textWrapWidth = (previousSegmentWidth < nextSegmentWidth && !this.heatMap.isColorRange) ?
                            previousSegmentWidth : nextSegmentWidth;
                    }
                } else {
                    const width: number = this.legendRectScale.width / heatMap.colorCollection.length;
                    textWrapWidth = heatMap.legendSettings.labelDisplayType === 'Edge' ? width : width / 2;
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
        const heatMap: HeatMap = this.heatMap;
        let legendElement: Element;
        let pathX1: number; let pathY1: number; let pathX2: number; let pathY2: number;
        if (!heatMap.enableCanvasRendering) {
            legendElement = this.heatMap.renderer.createGroup({ id: heatMap.element.id + '_ColorAxis_Grid' });
        }
        for (let i: number = 0; i < (heatMap.isColorRange ? this.segmentCollections.length : heatMap.legendColorCollection.length); i++) {
            if (!heatMap.horizontalGradient) {
                pathX1 = legendRect.x;
                pathY1 = pathY2 = this.segmentCollections[i];
                pathX2 = legendRect.x + legendRect.width;
            } else {
                pathX1 = pathX2 = this.segmentCollections[i];
                pathY1 = legendRect.y;
                pathY2 = legendRect.y + legendRect.height;
            }
            const direction: Line = new Line(pathX1, pathY1, pathX2, pathY2);
            const line: LineOption = new LineOption(this.heatMap.element.id + '_ColorAxis_Grid' + i, direction, '#EEEEEE', 1);
            this.drawSvgCanvas.drawLine(line, legendElement);
            if (!heatMap.enableCanvasRendering) {
                this.legend.appendChild(legendElement as HTMLElement);
            }
        }
    }
    /**
     * @private
     */

    public renderLegendTitleTooltip(e: PointerEvent, pageX: number, pageY: number): void {
        if ((<Element>e.target).id.indexOf('_legendTitle') !== -1 && (<HTMLElement>e.target).textContent.indexOf('...') > -1) {
            showTooltip(
                this.heatMap.legendSettings.title.text, pageX, pageY,
                this.heatMap.element.offsetWidth, this.heatMap.element.id + '_legendTitle_Tooltip',
                getElement(this.heatMap.element.id + '_Secondary_Element'), null, this.heatMap);
            document.getElementById(this.heatMap.element.id + '_legendTitle_Tooltip').style.visibility = 'visible';
        } else {
            const element: HTMLElement = document.getElementById(this.heatMap.element.id + '_legendTitle_Tooltip');
            if (element) {
                element.style.visibility = 'hidden';
            }
        }
    }
    /**
     * @private
     */

    public renderLegendLabelTooltip(e: PointerEvent, pageX: number, pageY: number): void {
        if ((<Element>e.target).id.indexOf('_Legend_Label') !== -1 && (<HTMLElement>e.target).textContent.indexOf('...') > -1) {
            const targetId: string[] = (<HTMLElement>e.target).id.split(this.heatMap.element.id + '_Legend_Label');
            if (targetId.length === 2) {
                let index: number;
                if (targetId[1].length === 1 || this.heatMap.legendSettings.textStyle.textOverflow === 'Trim') {
                    index = parseInt(targetId[1], 10);
                } else {
                    index = parseInt(targetId[1].substring(0, targetId[1].length - 1), 10);
                }
                showTooltip(
                    this.labelCollections[index], pageX, pageY, this.heatMap.element.offsetWidth,
                    this.heatMap.element.id + '_LegendLabel_Tooltip',
                    getElement(this.heatMap.element.id + '_Secondary_Element'), null, this.heatMap);
                document.getElementById(this.heatMap.element.id + '_LegendLabel_Tooltip').style.visibility = 'visible';

            }
        } else {
            const element: HTMLElement = document.getElementById(this.heatMap.element.id + '_LegendLabel_Tooltip');
            if (element) {
                element.style.visibility = 'hidden';
            }
        }
    }

    private calculateListPerPage(rect: Rect): void {
        const heatMap: HeatMap = this.heatMap;
        if (heatMap.horizontalGradient) {
            this.lastList = [];
            let legendX: number = rect.x; let legendY: number = rect.y;
            let size: number = 0; let division: number = 0;
            let labelX: number = 0; let labelY: number = 0; const interval: number = 20;
            let i: number;
            const legendSize: number = 10; const padding: number = 5;
            this.labelXCollections = [];
            this.labelYCollections = [];
            this.legendXCollections = [];
            this.legendYCollections = [];
            for (i = 0; i < heatMap.colorCollection.length; i++) {
                if (heatMap.legendSettings.showLabel) {
                    const text: string = this.labelCollections[i];
                    size = measureText(text, heatMap.legendSettings.textStyle).width;
                }
                labelX = legendX + legendSize + padding;
                labelY = legendY + padding;
                const maxWidth: number = heatMap.legendSettings.showLabel ? labelX + size : legendX + this.legendSize + this.listInterval;
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

    private renderListLegendMode(rect: Rect, translate: boolean): void {
        const heatMap: HeatMap = this.heatMap; const legendSize: number = 10;
        const tempBorder: BorderModel = {
            color: 'transparent', width: 0
        };
        const padding: number = 5; // padding for legend label from top
        this.legendLabelTooltip = [];
        let listRect: Rect; let size: Size = new Size(0, 0);
        let labelX: number = 0; let labelY: number = 0;
        let legendX: number = rect.x; let legendY: number = rect.y;
        if (translate) {
            this.renderPagingElements();
        }
        let x: number; let y: number;
        const textWrapWidth: number = heatMap.legendSettings.title.text ? this.width - (2 * (this.legendSize + this.labelPadding)) :
            this.legendGroup.width - (this.legendSize + this.legendRectPadding + this.labelPadding);
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
                const text: string = this.labelCollections[i];
                size = measureText(text, heatMap.legendSettings.textStyle);
            }
            const legendEventArgs: ILegendRenderEventArgs = {
                cancel: false, text: this.labelCollection[i], name: 'legendRender'
            };
            if (heatMap.horizontalGradient) {
                legendX = this.legendXCollections[i];
                legendY = this.legendYCollections[i];
                labelX = this.labelXCollections[i];
                labelY = this.labelYCollections[i];
            }
            labelX = legendX + this.legendSize + this.labelPadding;
            labelY = legendY + padding;
            this.heatMap.trigger('legendRender', legendEventArgs);
            if (translate && heatMap.rendering && this.legendRange.length <= heatMap.colorCollection.length) {
                const rectPosition: LegendRange = new LegendRange(
                    legendX, legendY, legendSize, legendSize, heatMap.colorCollection[i].value, true, this.currentPage);
                rectPosition.visible = !isNullOrUndefined(this.visibilityCollections[i]) ? this.visibilityCollections[i] : true;
                if (!legendEventArgs.cancel) {
                    this.legendRange.push(rectPosition);
                } else {
                    const rectPosition: LegendRange = new LegendRange(
                        legendX, legendY, 0, 0, heatMap.colorCollection[i].value, true, this.currentPage);
                    this.legendRange.push(rectPosition);
                }
                if (heatMap.legendSettings.showLabel) {
                    const textPosition: LegendRange = new LegendRange(
                        labelX, (labelY - size.height / 2), size.width, size.height,
                        heatMap.colorCollection[i].value, true, this.currentPage);
                    textPosition.visible = !isNullOrUndefined(this.visibilityCollections[i]) ? this.visibilityCollections[i] : true;
                    this.legendTextRange.push(textPosition);
                }
            }
            if (!legendEventArgs.cancel) {
                if (heatMap.legendSettings.showLabel) {
                    const text: string[] = getTitle(this.labelCollections[i], heatMap.legendSettings.textStyle, textWrapWidth);
                    if (text[0].indexOf('...') !== -1 && heatMap.enableCanvasRendering) {
                        this.legendLabelTooltip.push(new CanvasTooltip(
                            this.labelCollections[i], new Rect(labelX, labelY, size.width, size.height)));
                    }
                    const textBasic: TextBasic = new TextBasic(labelX, labelY, 'start', text, 0, 'translate(0,0)', 'middle');
                    const options: TextOption = new TextOption(
                        heatMap.element.id + '_Legend_Label' + i, textBasic, heatMap.legendSettings.textStyle,
                        heatMap.legendSettings.textStyle.color || heatMap.themeStyle.legendLabel);
                    options.fill = heatMap.legendOnLoad ? options.fill : this.legendRange[i].visible ? options.fill : '#D3D3D3';
                    this.drawSvgCanvas.createText(options, this.translategroup, text[0]);
                    if (Browser.isIE && !heatMap.enableCanvasRendering) {
                        (this.translategroup.lastChild as Element).setAttribute('dy', '0.6ex');
                    }
                }
                listRect = new Rect(legendX, legendY, legendSize, legendSize);
                const listColor: string = heatMap.legendOnLoad ? this.heatMap.isColorRange ? heatMap.colorCollection[i].minColor :
                    heatMap.colorCollection[i].color :
                    this.legendRange[i].visible ? this.heatMap.isColorRange ? heatMap.colorCollection[i].minColor :
                        heatMap.colorCollection[i].color : '#D3D3D3';
                const rectItems: RectOption = new RectOption(
                    heatMap.element.id + '_legend_list' + i, listColor, tempBorder, 1, listRect);
                this.drawSvgCanvas.drawRectangle(rectItems, this.translategroup);
                if ( heatMap.horizontalGradient ) {
                    legendX = legendX + this.legendSize + this.labelPadding + size.width + this.listInterval; }
                else {
                    legendY += this.legendSize + this.listInterval; }
            }
        }
        if (!heatMap.enableCanvasRendering) {
            this.legendGroup.height = this.legendGroup.height > 0 ? this.legendGroup.height : 0;
            this.legendGroup.width = this.legendGroup.width > 0 ? this.legendGroup.width : 0;
            const clippath: Element = heatMap.renderer.createClipPath({ id: heatMap.element.id + '_LegendScale_ClipPath' });
            const clipRect: Element = heatMap.renderer.drawRectangle(this.legendGroup);
            clippath.appendChild(clipRect);
            this.translategroup.appendChild(clippath);
            this.legend.setAttribute('style', 'clip-path:url(#' + clippath.id + ')');
            this.legendScale.appendChild(this.translategroup);
            heatMap.svgObject.appendChild(this.legend as HTMLElement);
        }
    }
    /**
     * @private
     */

    public translatePage(heatMap: HeatMap, page: number, isNext: boolean): void {
        const padding: number = 5;
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
                const ctx: CanvasRenderingContext2D = heatMap.canvasRenderer.ctx;
                ctx.fillRect(this.legendRectScale.x - padding, this.legendRectScale.y - padding, this.legendRectScale.width +
                    padding, this.legendRectScale.height + (2 * padding));
                ctx.fillRect(this.pagingRect.x, this.pagingRect.y, this.pagingRect.width, this.pagingRect.height);
            }
            this.renderListLegendMode(this.legendRectScale, true);
        }
        if (heatMap.enableCanvasRendering && heatMap.allowSelection && heatMap.rectSelected) {
            const ctx: CanvasRenderingContext2D = heatMap.secondaryCanvasRenderer.ctx;
            const position: string = heatMap.legendSettings.position;
            const initialRect: Rect = heatMap.initialClipRect;
            const rectX: number = position === 'Right' ? initialRect.x + initialRect.width : 0;
            const rectY: number = position === 'Bottom' ? initialRect.y + initialRect.height : 0;
            const rectWidth: number = position === 'Right' ? heatMap.availableSize.width - (initialRect.x +
                initialRect.width) : position === 'Left' ? initialRect.x : heatMap.availableSize.width;
            const rectHeight: number = position === 'Top' ? initialRect.y : position === 'Bottom' ?
                heatMap.availableSize.height - (initialRect.y + initialRect.height) : heatMap.availableSize.height;
            ctx.save();
            ctx.clearRect(rectX, rectY, rectWidth, rectHeight);
            ctx.restore();
            const oldCanvas: HTMLElement = document.getElementById(heatMap.element.id + '_canvas');
            const newCanvas: HTMLElement = document.getElementById(heatMap.element.id + '_secondary_canvas');
            const rectImage: ImageData = (oldCanvas as HTMLCanvasElement).getContext('2d').getImageData(rectX, rectY, rectWidth, rectHeight);
            (newCanvas as HTMLCanvasElement).getContext('2d').putImageData(rectImage, rectX, rectY);
            oldCanvas.style.opacity = '0.3';
        }
    }

    /**
     * To create div container for tooltip which appears on hovering the smart legend.
     *
     * @param heatmap
     * @private
     */

    public createTooltipDiv(): void {
        const element: Element = <HTMLElement>createElement('div', {
            id: this.heatMap.element.id + 'legendLabelTooltipContainer',
            styles: 'position:absolute'
        });
        this.heatMap.element.appendChild(element);
    }

    /**
     * To render tooltip for smart legend.
     *
     * @private
     */

    public renderTooltip(currentLegendRect: CurrentLegendRect): void {
        const heatMap: HeatMap = this.heatMap;
        const tempTooltipText: string[] = [currentLegendRect.label];
        let offset: number = null;
        offset = parseInt(heatMap.legendSettings.textStyle.size, 10) / 2;
        this.tooltipObject = new tool(
            {
                offset: offset,
                theme: heatMap.theme as TooltipTheme,
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
     *
     * @private
     */

    public createTooltip(pageX: number, pageY: number): void {
        let currentLegendRect: CurrentLegendRect;
        for (let i: number = 0; i < this.heatMap.colorCollection.length; i++) {
            const position: CurrentLegendRect = this.legendRectPositionCollection[i];
            if (position && pageX > position.x && pageX < position.width + position.x &&
                pageY > position.y && pageY < position.height + position.y) {
                currentLegendRect = this.legendRectPositionCollection[i];
                break;
            }
        }
        const ele: HTMLElement = document.getElementById(this.heatMap.element.id + 'legendLabelTooltipContainer');
        if (ele && ele.style.visibility === 'visible' && this.tooltipObject && !this.heatMap.isTouch) {
            this.tooltipObject.fadeOut();
            ele.style.visibility = 'hidden';
        }
        if (currentLegendRect) {
            this.renderTooltip(currentLegendRect);
        }
    }

    /**
     * Toggle the visibility of cells based on legend selection
     *
     * @private
     */

    public legendRangeSelection(index: number): void {
        const heatMap: HeatMap = this.heatMap;
        const legendRange: LegendRange[] = this.legendRange;
        const padding: number = 5;
        const legendPadding: number = heatMap.horizontalGradient ? 10 : 0;
        const legendBound: Rect = this.legendRectScale; const ctx: CanvasRenderingContext2D = heatMap.canvasRenderer.ctx;
        heatMap.rangeSelection = true;
        if (heatMap.enableCanvasRendering) {
            const ctx: CanvasRenderingContext2D = heatMap.canvasRenderer.ctx;
            if (heatMap.legendSettings.enableSmartLegend) {
                ctx.fillRect(
                    legendBound.x - padding, legendBound.y - padding, (legendBound.width + this.labelPadding +
                        this.maxLegendLabelSize.width) + padding,
                    legendBound.height + 2 * (padding + legendPadding));
            } else {
                ctx.fillRect(legendBound.x - padding, legendBound.y - padding, legendBound.width +
                    padding, legendBound.height + (2 * padding));
            }
        } else {
            if (heatMap.legendSettings.enableSmartLegend) {
                while (this.legend && this.legend.childNodes.length) {
                    this.legend.removeChild(this.legend.firstChild);
                }
            } else {
                while (this.translategroup && this.translategroup.childNodes.length) {
                    this.translategroup.removeChild(this.translategroup.firstChild);
                }
            }

            removeElement(heatMap.heatMapSeries.containerRectObject.id);
            if (heatMap.cellSettings.showLabel) {
                removeElement(heatMap.heatMapSeries.containerTextObject.id);
            }
        }
        if (heatMap.legendSettings.enableSmartLegend) {
            if (heatMap.colorCollection.length !== heatMap.legendColorCollection.length) {
                if (index === heatMap.legendColorCollection.length - 1) {
                    heatMap.toggleValue[index - 1].visible = this.visibilityCollections[index - 1] =
                        legendRange[index - 1].visible = !legendRange[index].visible;
                } else {
                    if (index === heatMap.colorCollection.length - 1) {
                        heatMap.toggleValue[index + 1].visible = this.visibilityCollections[index + 1] =
                            legendRange[index + 1].visible = !legendRange[index].visible;
                    }
                }
            }
        }
        heatMap.toggleValue[index].visible = this.visibilityCollections[index] = legendRange[index].visible = !legendRange[index].visible;
        heatMap.legendOnLoad = false;
        if (heatMap.legendSettings.enableSmartLegend) {
            this.renderSmartLegend();
            const rectItemsSvg: Rect = new Rect(legendBound.x, legendBound.y, legendBound.width, legendBound.height);
            this.renderLegendLabel(rectItemsSvg);
            if (heatMap.enableCanvasRendering) {
                ctx.save();
                ctx.clip();
            }
            if (heatMap.renderingMode === 'SVG') {
                this.renderTitle(rectItemsSvg);
            }
        } else {
            this.renderListLegendMode(this.legendRectScale, false);
        }
        if (heatMap.enableCanvasRendering) {
            ctx.restore();
        }
        heatMap.heatMapSeries.renderRectSeries();
        heatMap.clearSelection();
        if (heatMap.enableCanvasRendering && heatMap.allowSelection) {
            // heatMap.createSvg();
            // heatMap.refreshBound();
            // heatMap.createMultiCellDiv(false);
        }
    }

    /**
     * update visibility collections of legend and series
     *
     * @private
     */

    public updateLegendRangeCollections(): void {
        const heatMap: HeatMap = this.heatMap;
        heatMap.rangeSelection = !heatMap.legendOnLoad ? true : false;
        this.visibilityCollections = !heatMap.legendOnLoad ? this.visibilityCollections : [];
        heatMap.toggleValue = !heatMap.legendOnLoad ? heatMap.toggleValue : [];
        this.legendRange = !heatMap.legendOnLoad ? this.legendRange : [];
        this.legendTextRange = !heatMap.legendOnLoad ? this.legendTextRange : [];
    }
}
