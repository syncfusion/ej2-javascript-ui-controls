/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/indent */
/**
 * Used for stock event calculations.
 */
import { StockChart } from '../stock-chart';
import { StockEventsSettingsModel } from '../model/base-model';
import { Series, Points } from '../../chart/series/chart-series';
import { FlagType } from '../../common/utils/enum';
import { BorderModel } from '../../common/model/base-model';
import { withIn, PointData, textElement, getElement, valueToCoefficient, drawSymbol, ChartLocation } from '../../common/utils/helper';
import { BaseTooltip } from '../../common/user-interaction/tooltip';
import { Tooltip, PathOption, TextOption, measureText, Size } from '@syncfusion/ej2-svg-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { DataUtil } from '@syncfusion/ej2-data';
import { IStockEventRenderArgs } from '../model/base';
import { stockEventRender } from '../../common/model/constants';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
/**
 * @private
 */
export class StockEvents extends BaseTooltip {
    constructor(stockChart: StockChart) {
        super(stockChart.chart);
        this.stockChart = stockChart;
        this.chartId = this.stockChart.element.id;
    }
    private stockChart: StockChart;
    private chartId: string;
    /** @private */
    public stockEventTooltip: Tooltip;
    /** @private */
    public symbolLocations: ChartLocation[][] = [];
    private pointIndex: number;
    private seriesIndex: number;
    /**
     * To render stock events in chart
     *
     * @returns {Element} Stock event element
     * @private
     */
    public renderStockEvents(): Element {
        const sChart: StockChart = this.stockChart;
        let stockEvent: StockEventsSettingsModel;
        let stockEventElement: Element;
        let textSize: Size;
        // Creation of group elements for stock events
        const stockEventsElementGroup: Element = sChart.renderer.createGroup({ id: this.chartId + '_StockEvents' });
        this.symbolLocations = initialArray(sChart.series.length, sChart.stockEvents.length, new ChartLocation(0, 0));
        for (let i: number = 0; i < sChart.stockEvents.length; i++) {
            stockEvent = this.stockChart.stockEvents[i];
            for (const series of sChart.chart.series as Series[]) {
                const argsData: IStockEventRenderArgs = {
                    name: stockEventRender, stockChart: sChart, text: stockEvent.text,
                    type: stockEvent.type, cancel: false, series: series
                };
                sChart.trigger(stockEventRender, argsData);
                stockEvent.text = argsData.text;
                stockEvent.type = argsData.type;
                textSize = measureText(stockEvent.text + 'W', stockEvent.textStyle);
                if (!argsData.cancel) {
                    stockEventElement = sChart.renderer.createGroup(
                        { id: this.chartId + '_Series_' + series.index + '_StockEvents_' + i }
                    );
                    const stockEventDate: number = this.stockChart.isBlazor ? Date.parse((stockEvent.date).toString()) :
                            this.dateParse(stockEvent.date).getTime();
                    if (withIn(stockEventDate , series.xAxis.visibleRange)) {
                        if (stockEvent.seriesIndexes.length > 0) {
                            for (let j: number = 0; j < stockEvent.seriesIndexes.length; j++) {
                                if (stockEvent.seriesIndexes[j] === series.index) {
                                        stockEventsElementGroup.appendChild(
                                            this.creatEventGroup(stockEventElement, series, stockEvent, i, textSize));
                                 }
                             }
                        } else {
                            stockEventsElementGroup.appendChild(
                                this.creatEventGroup(stockEventElement, series, stockEvent, i, textSize));
                        }
                    }
                }
            }
        }
        return stockEventsElementGroup;
    }

    private creatEventGroup(stockEventElement: Element, series: Series, stockEvent: StockEventsSettingsModel,
                            i: number, textSize: Size): Element {
        const symbolLocation: ChartLocation = this.findClosePoint(series, stockEvent);
        if (!stockEvent.showOnSeries) {
            symbolLocation.y = series.yAxis.rect.y + series.yAxis.rect.height;
        }
        this.symbolLocations[series.index][i] = symbolLocation;
        this.createStockElements(stockEventElement, stockEvent, series, i, symbolLocation, textSize);
        return stockEventElement;
    }

    private findClosePoint(series: Series, sEvent: StockEventsSettingsModel): ChartLocation {
        const stockEventDate: number = this.stockChart.isBlazor ? Date.parse((sEvent.date).toString()) :
                            this.dateParse(sEvent.date).getTime();
        const closeIndex: number = this.getClosest(series, stockEventDate );
        let pointData: PointData;
        let point: Points;
        let yPixel: number;
        for (let k: number = 0; k < series.points.length; k++) {
            point = series.points[k];
            if (closeIndex === point.xValue && point.visible) {
                pointData = new PointData(point, series);
            } else if (k !== 0 && k !== series.points.length) {
                if (closeIndex > series.points[k - 1].xValue && closeIndex < series.points[k + 1].xValue) {
                    pointData = new PointData(point, series);
                }
            }
        }
        const xPixel: number = series.xAxis.rect.x + valueToCoefficient(pointData.point.xValue, series.xAxis) * series.xAxis.rect.width;
        yPixel = valueToCoefficient(pointData.point[sEvent.placeAt] as number, series.yAxis) * series.yAxis.rect.height;
        yPixel = (yPixel * -1) + (series.yAxis.rect.y + series.yAxis.rect.height);
        return new ChartLocation(xPixel, yPixel);
    }

    private createStockElements(stockEventElement: Element, stockEve: StockEventsSettingsModel, series: Series, i: number,
                                symbolLocation: ChartLocation, textSize: Size): void {
        const result: Size = new Size(textSize.width > 20 ? textSize.width : 20, textSize.height > 20 ? textSize.height : 20);
        let pathString: string; let pathOption: PathOption;
        const lx: number = symbolLocation.x; const ly: number = symbolLocation.y;
        const stockId: string = this.chartId + '_Series_' + series.index + '_StockEvents_' + i;
        const border: BorderModel = stockEve.border;
        switch (stockEve.type) {
            case 'Flag':
            case 'Circle':
            case 'Square':
                stockEventElement.appendChild(
                    drawSymbol(
                        new ChartLocation(lx, ly), 'Circle', new Size(2, 2), '',
                        new PathOption( stockId + '_Circle', 'transparent', border.width, border.color),
                        this.dateParse(stockEve.date).toISOString()
                    )
                );
                stockEventElement.appendChild(
                    drawSymbol(
                        new ChartLocation(lx, ly - 5), 'VerticalLine', new Size(9, 9), '',
                        new PathOption(stockId + '_Path', border.color, border.width, border.color),
                        this.dateParse(stockEve.date).toISOString()
                    )
                );
                stockEventElement.appendChild(
                    drawSymbol(
                        new ChartLocation(stockEve.type !== 'Flag' ? lx : lx + result.width / 2, ly - result.height),
                        stockEve.type, result, '', new PathOption(stockId + '_Shape', stockEve.background, border.width, border.color),
                        this.dateParse(stockEve.date).toISOString()
                    )
                );
                textElement(
                    this.stockChart.renderer as unknown as SvgRenderer,
                    new TextOption(stockId + '_Text', stockEve.type !== 'Flag' ? symbolLocation.x : symbolLocation.x + result.width / 2,
                                   (symbolLocation.y - result.height), 'middle', stockEve.text, '', 'middle'),
                    stockEve.textStyle, stockEve.textStyle.color, stockEventElement
                );
                break;

            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowRight':
            case 'ArrowLeft':
                pathString = 'M' + ' ' + lx + ' ' + ly + ' ' + this.findArrowpaths(stockEve.type);
                pathOption = new PathOption(stockId + '_Shape', stockEve.background, border.width, border.color, 1, '', pathString);
                stockEventElement.appendChild(this.stockChart.renderer.drawPath(pathOption));
                break;
            case 'Triangle':
            case 'InvertedTriangle':
                result.height = 3 * textSize.height;
                result.width = textSize.width + (1.5 * textSize.width);
                stockEventElement.appendChild(
                    drawSymbol(
                        new ChartLocation(symbolLocation.x, symbolLocation.y), stockEve.type, new Size(20, 20), '',
                        new PathOption(stockId + '_Shape', stockEve.background, border.width, border.color),
                        this.dateParse(stockEve.date).toISOString()
                    )
                );
                textElement(
                    this.stockChart.renderer as unknown as SvgRenderer,
                    new TextOption(stockId + '_Text', symbolLocation.x, symbolLocation.y, 'middle', stockEve.text, '', 'middle'),
                    stockEve.textStyle, stockEve.textStyle.color, stockEventElement
                );
                break;
            case 'Text':
                textSize.height += 8; //padding for text height
                pathString = 'M' + ' ' + (lx) + ' ' + (ly) + ' ' +
                    'L' + ' ' + (lx - 5) + ' ' + (ly - 5) + ' ' +
                    'L' + ' ' + (lx - ((textSize.width ) / 2)) + ' ' + (ly - 5) + ' ' +
                    'L' + ' ' + (lx - ((textSize.width ) / 2)) + ' ' + (ly - textSize.height) + ' ' +
                    'L' + ' ' + (lx + ((textSize.width ) / 2)) + ' ' + (ly - textSize.height) + ' ' +
                    'L' + ' ' + (lx + ((textSize.width ) / 2)) + ' ' + (ly - 5) + ' ' +
                    'L' + ' ' + (lx + 5) + ' ' + (ly - 5) + ' ' + 'Z';
                pathOption = new PathOption(stockId + '_Shape', stockEve.background, border.width, border.color, 1, '', pathString);
                stockEventElement.appendChild(this.stockChart.renderer.drawPath(pathOption));
                textElement(
                    this.stockChart.renderer as unknown as SvgRenderer,
                    new TextOption(stockId + '_Text', lx, ly - (textSize.height / 2), 'middle', stockEve.text, '', 'middle'),
                    stockEve.textStyle, stockEve.textStyle.color, stockEventElement
                );
                break;
            default:
                //pin type calculation.
                pathString = 'M' + ' ' + lx + ' ' + ly + ' ' +
                    'L' + ' ' + (lx - ((textSize.width) / 2)) + ' ' + (ly - textSize.height / 3) + ' ' +
                    'L' + ' ' + (lx - ((textSize.width) / 2)) + ' ' + (ly - textSize.height) + ' ' +
                    'L' + ' ' + (lx + ((textSize.width) / 2)) + ' ' + (ly - textSize.height) + ' ' +
                    'L' + ' ' + (lx + ((textSize.width) / 2)) + ' ' + (ly - textSize.height / 3) + ' ' + 'Z';
                pathOption = new PathOption(stockId + '_Shape', stockEve.background, border.width, border.color, 1, '', pathString);
                stockEventElement.appendChild(this.stockChart.renderer.drawPath(pathOption));
                //append text element
                textElement(
                    this.stockChart.renderer as unknown as SvgRenderer,
                    new TextOption(stockId + '_Text', lx, ly - (textSize.height / 2), 'middle', stockEve.text, '', 'middle'),
                    stockEve.textStyle, stockEve.textStyle.color, stockEventElement
                );
        }
    }

    public renderStockEventTooltip(targetId: string): void {
        const seriesIndex: number = parseInt((targetId.split('_StockEvents_')[0]).split(this.chartId + '_Series_')[1], 10);
        const pointIndex: number = parseInt(targetId.split('_StockEvents_')[1].replace(/\D+/g, ''), 10);
        const updatedLocation: ChartLocation = this.symbolLocations[seriesIndex][pointIndex];
        const pointLocation: ChartLocation = new ChartLocation(
            updatedLocation.x,
            updatedLocation.y + this.stockChart.toolbarHeight + this.stockChart.titleSize.height);
        this.applyHighLights(pointIndex, seriesIndex);
        //title size and toolbar height is added location for placing tooltip
        const svgElement: HTMLElement = this.getElement(this.chartId + '_StockEvents_Tooltip_svg');
        const isTooltip: boolean = (svgElement && parseInt(svgElement.getAttribute('opacity'), 10) > 0);
        if (!isTooltip) {
            if (getElement(this.chartId + '_StockEvents_Tooltip_svg')) {
                remove(getElement(this.chartId + '_StockEvents_Tooltip'));
            }
            const tooltipElement: Element = createElement('div', {
                id: this.chartId + '_StockEvents_Tooltip', className: 'ejSVGTooltip',
                attrs: { 'style': 'pointer-events:none; position:absolute;z-index: 1' }
            });
            getElement(this.chartId + '_Secondary_Element').appendChild(tooltipElement);
            this.stockEventTooltip = new Tooltip(
                {
                    opacity: 1,
                    header: '', content: [(this.stockChart.stockEvents[pointIndex].description)],
                    enableAnimation: true, location: pointLocation,
                    theme: this.stockChart.theme,
                    inverted: true,
                    areaBounds: this.stockChart.chart.chartAxisLayoutPanel.seriesClipRect
                });
            this.stockEventTooltip.areaBounds.y += this.stockChart.toolbarHeight + this.stockChart.titleSize.height;
            this.stockEventTooltip.appendTo('#' + tooltipElement.id);
        } else {
            this.stockEventTooltip.content = [(this.stockChart.stockEvents[pointIndex].description)];
            this.stockEventTooltip.location = pointLocation;
            this.stockEventTooltip.dataBind();
        }
    }

    /**
     * Remove the stock event tooltip
     *
     * @param {number} duration tooltip timeout duration
     * @returns {void}
     */
    public removeStockEventTooltip(duration: number): void {
        const tooltipElement: HTMLElement = this.getElement(this.chartId + '_StockEvents_Tooltip');
        this.stopAnimation();
        if (tooltipElement && this.stockEventTooltip) {
            this.toolTipInterval = +setTimeout(
                (): void => {
                    this.stockEventTooltip.fadeOut();
                    this.removeHighLights();
                },
                duration);
        }
    }

    private findArrowpaths(type: FlagType): string {
        let arrowString: string = '';
        switch (type) {
            case 'ArrowUp':
                arrowString = 'l -10 10 l 5 0 l 0 10 l 10 0 l 0 -10 l 5 0 z';
                break;
            case 'ArrowDown':
                arrowString = 'l -10 -10 l 5 0 l 0 -10 l 10 0 l 0 10 l 5 0 z';
                break;
            case 'ArrowLeft':
                arrowString = 'l -10 -10 l 0 5 l -10 0 l 0 10 l 10 0 l 0 5 z';
                break;
            case 'ArrowRight':
                arrowString = 'l 10 -10 l 0 5 l 10 0 l 0 10 l -10 0 l 0 5 z';
                break;
        }
        return arrowString;
    }

    private applyHighLights(pointIndex: number, seriesIndex: number): void {
        if (this.pointIndex !== pointIndex || this.seriesIndex !== seriesIndex) {
            this.removeHighLights();
        }
        this.pointIndex = pointIndex; this.seriesIndex = seriesIndex;
        const stockId: string = this.chartId + '_Series_' + seriesIndex + '_StockEvents_' + pointIndex;
        this.setOpacity(stockId + '_Shape', 0.5);
        this.setOpacity(stockId + '_Text', 0.5);
    }

    private removeHighLights(): void {
        const stockId: string = this.chartId + '_Series_' + this.seriesIndex + '_StockEvents_' + this.pointIndex;
        this.setOpacity(stockId + '_Shape', 1);
        this.setOpacity(stockId + '_Text', 1);
    }

    private setOpacity(elementId: string, opacity: number): void {
        if (getElement(elementId)) {
            getElement(elementId).setAttribute('opacity', opacity.toString());
        }
    }
    /**
     * To convert the c# or javascript date formats into js format
     * refer chart control's dateTime processing.
     *
     * @param {Date | string} value date or string value
     * @returns {Date} date format value
     */
    private dateParse(value: Date | string): Date {
        const dateParser: Function = this.chart.intl.getDateParser({ skeleton: 'full', type: 'dateTime' });
        const dateFormatter: Function = this.chart.intl.getDateFormat({ skeleton: 'full', type: 'dateTime' });
        return new Date((Date.parse(dateParser(dateFormatter(new Date(DataUtil.parse.parseJson({ val: value }).val))))));
    }
}

// eslint-disable-next-line valid-jsdoc
/**
 * To initialthe array
 *
 * @param {number} numrows numrows
 * @param {number} numcols numcols
 * @param {ChartLocation} initial initial
 * @returns {ChartLocation[][]} ChartLocation
 */
function initialArray(numrows: number, numcols: number, initial: ChartLocation): ChartLocation[][] {
    const arr: ChartLocation[][] = [];
    for (let i: number = 0; i < numrows; ++i) {
        const columns: ChartLocation[] = [];
        for (let j: number = 0; j < numcols; ++j) {
            columns[j] = initial;
        }
        arr[i] = columns;
    }
    return arr;
}
