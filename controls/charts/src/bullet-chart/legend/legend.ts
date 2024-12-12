/**
 * Chart legend
 */
import { Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { LegendOptions, BaseLegend } from '../../common/legend/legend';
import { LegendShape } from '../../common/utils/enum';
import { Range } from '../model/bullet-base';
import { LegendSettingsModel } from '../../common/legend/legend-model';
import { textTrim, ChartLocation} from '../../common/utils/helper';
import { Size, measureText, Rect } from '@syncfusion/ej2-svg-base';
import { IBulletLegendRenderEventArgs } from '../../bullet-chart/model/bullet-interface';
import { legendRender } from '../../common/model/constants';
import { BulletChart } from '../bullet-chart';
import { TargetType } from '../utils/enum';

/**
 * `Legend` module is used to render legend for the chart.
 */
export class BulletChartLegend extends BaseLegend {
    constructor(chart: BulletChart) {
        super(chart);
        this.library = this;
        this.addEventListener();
    }
    /**
     * Binding events for legend module.
     *
     * @returns {void}
     */
    private addEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.on('click', this.click, this);
        this.chart.on(Browser.touchEndEvent, this.mouseEnd, this);
        this.chart.on(Browser.touchMoveEvent, this.bulletMouseMove, this);
    }
    /**
     * UnBinding events for bullet chart legend module.
     *
     * @returns {void}
     */
    private removeEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.off('click', this.click);
        this.chart.off(Browser.touchEndEvent, this.mouseEnd);
        this.chart.off(Browser.touchMoveEvent, this.bulletMouseMove);
    }
    /**
     * To handle mouse move for legend module.
     *
     * @param {MouseEvent} e - The mouse move event for the legend module.
     * @returns {void}
     */
    private bulletMouseMove(e: MouseEvent): void {
        if (this.chart.legendSettings.visible && this.chart.isTouch) {
            this.move(e);
        }
    }
    /**
     * To handle mouse end for legend module.
     *
     * @param {MouseEvent} e - The mouse end event for the legend module.
     * @returns {void}
     */
    private mouseEnd(e: MouseEvent): void {
        if (this.chart.legendSettings.visible && this.chart.isTouch) {
            this.move(e);
        }
    }
    /**
     * Get the legend options.
     *
     * @param {Range[]} visibleRangeCollection - The collection of visible ranges.
     * @returns {void}
     * @private
     */
    public getLegendOptions(visibleRangeCollection: Range[]): void {
        this.legendCollections = [];
        let fill: string;
        let count: number = 0;
        this.isRtlEnable = this.chart.enableRtl;
        const key: string = 'color';
        const bulletChart: BulletChart = this.chart as BulletChart;
        for (const range of visibleRangeCollection) {
            if (range.name !== null) {
                fill = range.color ? range.color : bulletChart.themeStyle.rangeStrokes[range.index][key as string];
                this.legendCollections.push(new LegendOptions(
                    range.name, fill, range.shape, this.chart.legendSettings.visible, null,
                    range.legendImageUrl, null, false, range.index, null
                ));
                count++;
            }
        }
        if (bulletChart.dataSource !== null && bulletChart.valueField !== '') {
            fill = (bulletChart.theme.indexOf('Dark') > -1) ? 'white' : bulletChart.valueFill ? bulletChart.valueFill : 'black';
            const shape: LegendShape = bulletChart.orientation === 'Vertical' ? 'TargetRect' : 'ActualRect';
            this.legendCollections.push(new LegendOptions(
                'Actual', fill, shape, this.chart.legendSettings.visible, null, '', null, false, count++, null
            ));
        }
        if (bulletChart.dataSource !== null && bulletChart.targetField !== '') {
            fill = (bulletChart.theme.indexOf('Dark') > -1) ? 'white' : bulletChart.targetColor ? bulletChart.targetColor : 'black';
            const shape: LegendShape = bulletChart.orientation === 'Vertical' ? 'ActualRect' : 'TargetRect';
            for (let i: number = 0; i < Object.keys(bulletChart.dataSource).length; i++) {
                if (isNullOrUndefined(bulletChart.dataSource[i as number][bulletChart.targetField].length)
                || bulletChart.dataSource[i as number][bulletChart.targetField].length === 1) {
                    while (i === 0) {
                        this.legendCollections.push(new LegendOptions(
                            'Target', fill, shape, this.chart.legendSettings.visible, null, '', null, false, count++, null
                        ));
                        break;
                    }
                } else {
                    const targetTypes: TargetType[] = bulletChart.targetTypes;
                    const targetType: string[] = [];
                    const targetTypeLength: number = targetTypes.length;
                    while (i === 0) {
                        for (let i: number = 0; i < targetTypeLength ; i++) {
                            targetType[i as number] = targetTypes[i % targetTypeLength];
                            targetType[i as number] = (targetType[i as number] === 'Rect') ? bulletChart.orientation === 'Vertical' ?
                                'ActualRect' : 'TargetRect' : (targetType[i as number]);
                            targetType[i as number] = (targetType[i as number] === 'Cross') ? 'Multiply' :  targetType[i as number];
                            this.legendCollections.push(
                                new LegendOptions(
                                    'Target_' + i, fill, <LegendShape>targetType[i as number], this.chart.legendSettings.visible,
                                    null, '', null, false, count++, null
                                ));
                        }
                        break;
                    }
                }
            }
        }
    }
    /**
     * Retrieves the legend bounds for the bullet chart.
     *
     * @param {Size} availableSize - The available size for rendering.
     * @param {Rect} bulletLegendBounds - The bounds of the bullet chart legend.
     * @param {LegendSettingsModel} legend - The legend settings for the bullet chart.
     * @returns {void}
     * @private
     */
    public getLegendBounds(availableSize: Size, bulletLegendBounds: Rect, legend: LegendSettingsModel): void {
        let extraWidth: number = 0;
        const padding: number = legend.padding;
        let extraHeight: number = 0;
        if (!this.isVertical) {
            extraHeight = ((availableSize.height / 100) * 5);
        } else {
            extraWidth = ((availableSize.width / 100) * 5);
        }
        bulletLegendBounds.height += extraHeight;
        bulletLegendBounds.width += extraWidth;
        let maximumWidth: number = 0;
        let legendRowWidth: number = 0;
        let legendRowCount: number = 0;
        let legendWidth: number = 0;
        let columnHeight: number = 0;
        const shapeWidth: number = legend.shapeWidth;
        const shapePadding: number = legend.shapePadding;
        let legendEventArgs: IBulletLegendRenderEventArgs;
        this.maxItemHeight = Math.max(measureText('MeasureText', legend.textStyle, this.chart.themeStyle.legendLabelFont).height, legend.shapeHeight);
        let render: boolean = false;
        for (const bulletLegendOption of this.legendCollections) {
            legendEventArgs = {
                fill: bulletLegendOption.fill, text: bulletLegendOption.text, shape: bulletLegendOption.shape,
                name: legendRender, cancel: false
            };
            this.chart.trigger(legendRender, legendEventArgs);
            bulletLegendOption.render = !legendEventArgs.cancel;
            bulletLegendOption.text = legendEventArgs.text;
            bulletLegendOption.fill = legendEventArgs.fill;
            bulletLegendOption.shape = legendEventArgs.shape;
            bulletLegendOption.textSize = measureText(bulletLegendOption.text, legend.textStyle, this.chart.themeStyle.legendLabelFont);
            if (bulletLegendOption.render && bulletLegendOption.text !== '') {
                render = true;
                legendWidth = shapeWidth + shapePadding + bulletLegendOption.textSize.width + padding;
                legendRowWidth = legendRowWidth + legendWidth;
                if (bulletLegendBounds.width < (padding + legendRowWidth) || this.isVertical) {
                    maximumWidth = Math.max(maximumWidth, (legendRowWidth + padding - (this.isVertical ? 0 : legendWidth)));
                    if (legendRowCount === 0 && (legendWidth !== legendRowWidth)) {
                        legendRowCount = 1;
                    }
                    legendRowWidth = this.isVertical ? 0 : legendWidth;
                    legendRowCount++;
                    columnHeight = (legendRowCount * (this.maxItemHeight + padding)) + padding;
                }
            }
        }
        columnHeight = Math.max(columnHeight, (this.maxItemHeight + padding) + padding);
        this.isPaging = bulletLegendBounds.height < columnHeight;
        this.totalPages = legendRowCount;
        if (render) {
            this.setBounds(Math.max((legendRowWidth + padding), maximumWidth), columnHeight, legend, bulletLegendBounds);
        } else {
            this.setBounds(0, 0, legend, bulletLegendBounds);
        }
    }
    /**
     * Retrieves the rendering point for the bullet chart legend.
     *
     * @param {LegendOptions} bulletLegendOption - The legend options for the bullet chart.
     * @param {ChartLocation} start - The starting location for rendering.
     * @param {number} textPadding - The padding around the text.
     * @param {LegendOptions} prevLegend - The previous legend options.
     * @param {Rect} rect - The rect region for the legend.
     * @param {number} count - The count of legends.
     * @param {number} firstLegend - The index of the first legend.
     * @returns {void}
     * @private
     */
    public getRenderPoint(
        bulletLegendOption: LegendOptions, start: ChartLocation, textPadding: number, prevLegend: LegendOptions,
        rect: Rect, count: number, firstLegend: number): void {
        const textWidth: number = textPadding + (this.legend.maximumLabelWidth ? this.legend.maximumLabelWidth : prevLegend.textSize.width);
        const previousBound: number = prevLegend.location.x + ((!this.isRtlEnable) ? textWidth : -textWidth);
        const padding: number = this.legend.padding;
        if ((previousBound + (bulletLegendOption.textSize.width + textPadding)) > (rect.x + rect.width + this.legend.shapeWidth / 2) ||
            this.isVertical) {
            bulletLegendOption.location.x = start.x;
            bulletLegendOption.location.y = (count === firstLegend) ? prevLegend.location.y :
                prevLegend.location.y + this.maxItemHeight + padding;
        } else {
            bulletLegendOption.location.x = (count === firstLegend) ? prevLegend.location.x : previousBound;
            bulletLegendOption.location.y = prevLegend.location.y;
        }
        const availwidth: number = (!this.isRtlEnable) ? (this.legendBounds.x + this.legendBounds.width) - (bulletLegendOption.location.x +
            textPadding - this.itemPadding - this.legend.shapeWidth / 2) : (bulletLegendOption.location.x - textPadding +
                this.itemPadding + (this.legend.shapeWidth / 2)) - this.legendBounds.x;
        bulletLegendOption.text = textTrim(+availwidth.toFixed(4), bulletLegendOption.text, this.legend.textStyle,
                                           this.chart.enableRtl, this.chart.themeStyle.legendLabelFont);
    }
    /**
     * To show the tooltip for the trimmed text in legend.
     *
     * @param {Event | PointerEvent} event - The click event.
     * @returns {void}
     */
    public click(event: Event | PointerEvent): void {
        const symbolTargetId: string = (<HTMLElement>event.target).id;
        if (symbolTargetId.indexOf(this.legendID + '_pagedown') > -1) {
            this.changePage(event, false);
        } else if (symbolTargetId.indexOf(this.legendID + '_pageup') > -1) {
            this.changePage(event, true);
        }
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        return 'BulletChartLegend';
    }

    /**
     * To destroy the Legend.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        /**
         * Destroy method calling here.
         */
        this.removeEventListener();
    }
}
