/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
/* eslint-disable valid-jsdoc */
/**
 * Chart legend
 */
import { Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { LegendOptions, BaseLegend } from '../../common/legend/legend';
import { LegendShape } from '../../chart/utils/enum';
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
     */
    private addEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.on('click', this.click, this);
        this.chart.on(Browser.touchEndEvent, this.mouseEnd, this);
        this.chart.on(Browser.touchMoveEvent, this.bulletMouseMove, this);
    }
    /**
     * UnBinding events for bullet chart legend module.
     */
    private removeEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.off('click', this.click);
        this.chart.off(Browser.touchEndEvent, this.mouseEnd);
        this.chart.off(Browser.touchMoveEvent, this.bulletMouseMove);
    }
    /**
     * To handle mosue move for legend module
     */
    private bulletMouseMove(e: MouseEvent): void {
        if (this.chart.legendSettings.visible && this.chart.isTouch) {
            this.move(e);
        }
    }
    /**
     * To handle mosue end for legend module
     */
    private mouseEnd(e: MouseEvent): void {
        if (this.chart.legendSettings.visible && this.chart.isTouch) {
            this.move(e);
        }
    }
    /**
     * Get the legend options.
     *
     * @returns {void}
     * @private
     */
    public getLegendOptions(visibleRangeCollection: Range[]): void {
        this.legendCollections = [];
        let fill: string;
        let count: number = 0;
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
    /** @private */
    public getLegendBounds(availableSize: Size, bulletLegendBounds: Rect, legend: LegendSettingsModel): void {
        let extraWidth: number = 0;
        const padding: number = legend.padding;
        let extraHeight: number = 0;
        if (!this.isVertical) {
            extraHeight = !legend.height ? ((availableSize.height / 100) * 5) : 0;
        } else {
            extraWidth = !legend.width ? ((availableSize.width / 100) * 5) : 0;
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
    /** @private */
    public getRenderPoint(
        bulletLegendOption: LegendOptions, start: ChartLocation, textPadding: number, prevLegend: LegendOptions,
        rect: Rect, count: number, firstLegend: number): void {
        const previousBound: number = (prevLegend.location.x + textPadding + prevLegend.textSize.width);
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
        const availwidth: number = (this.legendBounds.x + this.legendBounds.width) - (bulletLegendOption.location.x +
            textPadding - this.legend.shapeWidth / 2);
        bulletLegendOption.text = textTrim(+availwidth.toFixed(4), bulletLegendOption.text, this.legend.textStyle, this.chart.themeStyle.legendLabelFont);
    }
    /**
     * To show the tooltip for the trimmed text in legend.
     *
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
     * Get module name
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
         * Destroy method calling here
         */
        this.removeEventListener();
    }
}
