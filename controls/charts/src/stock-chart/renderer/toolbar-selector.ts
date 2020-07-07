import { StockChart } from '../stock-chart';
import { PeriodsModel, FontModel } from '../../common/model/base-model';
import { titlePositionX, textElement, appendChildElement, getElement } from '../../common/utils/helper';
import { ExportType } from '../../common/utils/enum';
import { TrendlineTypes, ChartSeriesType, TechnicalIndicators } from '../../chart/utils/enum';
import { AxisModel, RowModel } from '../../chart/axis/axis-model';
import { TechnicalIndicatorModel } from '../../chart/technical-indicators/technical-indicator-model';
import { TrendlineModel  } from '../../chart/series/chart-series-model';
import { DropDownButton, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { Button } from '@syncfusion/ej2-buttons';
import { ItemModel } from '@syncfusion/ej2-navigations';
import { Rect, TextOption, measureText, SvgRenderer } from '@syncfusion/ej2-svg-base';
import { remove } from '@syncfusion/ej2-base';
import { StockSeries } from '../model/base';
import { StockSeriesModel } from '../model/base-model';

/**
 * Period selector for range navigator
 */

/** @private */
export class ToolBarSelector {
    private stockChart: StockChart;
    private indicatorDropDown: DropDownButton;
    private trendlineDropDown: DropDownButton;
    private selectedSeries: string = '';
    private selectedIndicator: string = '';
    private selectedTrendLine: string = '';
    constructor(chart: StockChart) {
        this.stockChart = chart;
        this.selectedSeries = this.stockChart.series[0].type;
    }

    public initializePeriodSelector(): void {
        let periods: PeriodsModel[] = this.stockChart.tempPeriods;
        this.stockChart.periods = periods;
        this.stockChart.periodSelector.rootControl = this.stockChart;
        let rect : Rect = this.stockChart.chart.chartAxisLayoutPanel.seriesClipRect;
        let htmlElement : HTMLElement = getElement(this.stockChart.element.id + '_Secondary_Element') as HTMLElement;
        let height : number = this.stockChart.toolbarHeight;
        this.stockChart.periodSelector.appendSelector({thumbSize: 0, element: htmlElement, width: rect.width, height: height},
                                                      rect.x);
        this.initializeSeriesSelector();
        this.initializeIndicatorSelector();
        this.initializeTrendlineSelector();
        this.exportButton();
        this.printButton();
        this.resetButton();
    }

    /**
     * This method returns itemModel for dropdown button
     * @param type 
     */
    private getDropDownItems(type: ChartSeriesType[] | TechnicalIndicators[] | ExportType[] | TrendlineTypes[]): ItemModel[] {
        let result: ItemModel[] = [];
        if (type === this.stockChart.seriesType) {
            for (let i: number = 0; i < type.length; i++) {
                result.push({ text: '&nbsp;&nbsp;&nbsp;' + type[i].toString() });
            }
            for (let i: number = 0; i < this.stockChart.series.length; i++) {
                for (let j: number = 0; j < result.length; j++) {
                    let text: string = result[j].text.replace('&nbsp;&nbsp;&nbsp;', '');
                    text = (text === 'OHLC') ? 'HiloOpenClose' : text;
                    if (text === this.stockChart.series[i].type) {
                        result[j].text = result[j].text.replace('&nbsp;&nbsp;&nbsp;', '&#10004&nbsp;');
                    }
                }
            }
        } else if (type === this.stockChart.exportType) {
            for (let i: number = 0; i < type.length; i++) {
                    result.push({ text: type[i].toString() });
            }
        } else {
            for (let i: number = 0; i < type.length; i++) {
                if (type[i].toString() !== 'Print') {
                    result.push({ text: '&nbsp;&nbsp;&nbsp;' + type[i].toString() });
                }
            }
        }
        return result;
    }

    /**
     * This method changes the type of series while selectind series in dropdown button
     */
    private addedSeries(seriesType: string): void {
        let series: StockSeriesModel[] = this.stockChart.series;
        for (let i: number = 0; i < series.length; i++) {
            if (series[i].yName === 'volume') {
                continue;
            }
            series[i].type = <ChartSeriesType>(seriesType.indexOf('Candle') > -1 ? 'Candle' :
            (seriesType.indexOf('OHLC') > -1 ? 'HiloOpenClose' : seriesType) );
            series[i].enableSolidCandles = seriesType === 'Candle';
            for (let index: number = 0; index < series[i].trendlines.length; index++) {
                let trendLine: TrendlineModel = series[i].trendlines[index];
                trendLine.animation.enable = false;
                trendLine.enableTooltip = false;
            }
        }
    }
    public initializeSeriesSelector(): void {
        let seriesType: DropDownButton = new DropDownButton({
            items: this.getDropDownItems(this.stockChart.seriesType),
            select: (args: MenuEventArgs) => {
                this.selectedSeries = args.item.text;
                let text: string = this.tickMark(args);
                this.addedSeries(text);
                this.stockChart.cartesianChart.initializeChart();
            },
        });
        seriesType.appendTo('#' + this.stockChart.element.id + '_seriesType');
    }

    //private variables:
    private trendline: TrendlineTypes;
    private indicators: TechnicalIndicators[] = [];
    private secondayIndicators: TechnicalIndicators[] = [];
    public resetButton(): void {
        let isProtect: string = 'isProtectedOnChange';
        this.stockChart[isProtect]  = true;
        let reset: Button = new Button();
        reset.appendTo('#' + this.stockChart.element.id + '_reset');
        document.getElementById(this.stockChart.element.id + '_reset').onclick = () => {
            let indicatorlength: number = this.indicators.length;
            while (indicatorlength) {
                this.stockChart.indicators.pop();
                indicatorlength--;
            }
            this.indicators = [];
            this.secondayIndicators = [];
            if (!this.stockChart.isSingleAxis) {
                if (this.stockChart.rows.length > 2) {
                    this.stockChart.rows.splice(2, this.stockChart.rows.length - 1);
                }
                if (this.stockChart.axes.length > 2) {
                    this.stockChart.axes.splice(1, this.stockChart.axes.length - 1);
                    this.stockChart.axes[0].rowIndex = 1;
                }
            } else {
                this.stockChart.rows = [{}];
            }
            for (let i: number = 0; i < this.stockChart.series.length; i++) {
                if (this.stockChart.series[i].yName === 'volume') {
                    continue;
                }
                this.stockChart.series[i].type = this.stockChart.tempSeriesType[i];
                if (this.stockChart.series[i].trendlines.length !== 0) {
                    this.stockChart.series[i].trendlines[0].width = 0;
                }
            }
            this.stockChart.indicatorElements = null;
            this.stockChart.resizeTo = null;
            this.stockChart.zoomChange = false;

            this.stockChart.refresh();
            this.stockChart[isProtect]  = true;
        };
    }
    public initializeTrendlineSelector(): void {
        this.trendlineDropDown = new DropDownButton({
            items: this.stockChart.resizeTo ? this.trendlineDropDown.items :
            this.getDropDownItems(this.stockChart.trendlineType),
            select: (args: MenuEventArgs) => {
                let text: string = this.tickMark(args);
                text = text.split(' ')[0].toLocaleLowerCase() + (text.split(' ')[1] ? text.split(' ')[1] : '');
                text = text.substr(0, 1).toUpperCase() + text.substr(1);
                let type: TrendlineTypes = <TrendlineTypes>text;
                this.selectedTrendLine = this.selectedTrendLine === '' ? type : this.selectedTrendLine + ',' + type;
                if (this.trendline !== type) {
                    this.trendline = type;
                    for (let i: number = 0; i < this.stockChart.series.length; i++) {
                        if (this.stockChart.series[i].yName === 'volume') {
                            continue;
                        }
                        if (this.stockChart.series[0].trendlines.length === 0) {
                            let trendlines: TrendlineModel[];
                            if (this.stockChart.trendlinetriggered) {
                                trendlines = [{ type: type, width: 1, enableTooltip : false }];
                                this.stockChart.trendlinetriggered = false;
                            }
                            this.stockChart.series[0].trendlines = trendlines;
                        } else {
                            this.stockChart.series[0].trendlines[0].width = 1;
                            this.stockChart.series[0].trendlines[0].type = type;
                            this.stockChart.series[0].trendlines[0].animation.enable = this.stockChart.trendlinetriggered ? true : false;
                        }
                    }
                    this.stockChart.cartesianChart.initializeChart();
                } else {
                    args.item.text = '&nbsp;&nbsp;&nbsp;' + args.item.text.replace('&#10004&nbsp;', '');
                    this.stockChart.series[0].trendlines[0].width = 0;
                    this.trendline = null;
                    this.stockChart.cartesianChart.initializeChart();
                }
            },
        });
        this.trendlineDropDown.appendTo('#' + this.stockChart.element.id + '_trendType');
    }
    public initializeIndicatorSelector(): void {
        this.indicatorDropDown = new DropDownButton({
            items: this.stockChart.resizeTo ? this.indicatorDropDown.items :
            this.getDropDownItems(this.stockChart.indicatorType),
            select: (args: MenuEventArgs) => {
                for (let l: number = 0; l < this.stockChart.series.length; l++) {
                    if (this.stockChart.series[l].trendlines.length !== 0) {
                        this.stockChart.series[l].trendlines[0].animation.enable = false;
                    }
                }
                args.item.text = args.item.text.indexOf('&#10004&nbsp;') >= 0 ? args.item.text.substr(args.item.text.indexOf(';') + 1) :
                    args.item.text;
                let text: string = args.item.text.replace('&nbsp;&nbsp;&nbsp;', '');
                text = text.split(' ')[0].toLocaleLowerCase() + (text.split(' ')[1] ? text.split(' ')[1] : '');
                text = text.substr(0, 1).toUpperCase() + text.substr(1);
                let type: TechnicalIndicators = <TechnicalIndicators>text;
                this.selectedIndicator = this.selectedIndicator.indexOf(type) === -1 ? this.selectedIndicator + ' ' + type :
                                         this.selectedIndicator.replace(type, '');
                if (type === 'Tma' || type === 'BollingerBands' || type === 'Sma' || type === 'Ema') {
                    if (this.indicators.indexOf(type) === -1) {
                        args.item.text = '&#10004&nbsp;' + args.item.text.replace('&nbsp;&nbsp;&nbsp;', '');
                        let indicator: TechnicalIndicatorModel[] = this.getIndicator(type, this.stockChart.series[0].yAxisName);
                        this.indicators.push(type);
                        this.stockChart.indicators = this.stockChart.indicators.concat(indicator);
                        this.stockChart.cartesianChart.initializeChart();
                    } else {
                        args.item.text = '&nbsp;&nbsp;&nbsp;' + args.item.text;
                        for (let z: number = 0; z < this.stockChart.indicators.length; z++) {
                            if (this.stockChart.indicators[z].type === type) {
                                this.stockChart.indicators.splice(z, 1);
                            }
                        }
                        this.indicators.splice(this.indicators.indexOf(type), 1);
                        this.stockChart.cartesianChart.initializeChart();
                    }
                } else {
                    this.createIndicatorAxes(type, args);
                }
            },
        });
        this.indicatorDropDown.appendTo('#' + this.stockChart.element.id + '_indicatorType');
    }
    private getIndicator(type: TechnicalIndicators, yAxisName: string): TechnicalIndicatorModel[] {
        let currentSeries: StockSeries = this.stockChart.series[0] as StockSeries;
        let indicator: TechnicalIndicatorModel[] = [{
            type: type, period: 3, yAxisName: yAxisName,
            dataSource : currentSeries.localData,
            xName : currentSeries.xName,
            open : currentSeries.open,
            close : currentSeries.close,
            high : currentSeries.high,
            low : currentSeries.low,
            volume : currentSeries.volume,
            fill: type === 'Sma' ? '#32CD32' : '#6063ff',
            animation: { enable: false }, upperLine: { color: '#FFE200', width: 1 },
            periodLine: { width: 2 }, lowerLine: { color: '#FAA512', width: 1 },
            fastPeriod: 8, slowPeriod: 5, macdType: 'Both', width: 1,
            macdPositiveColor: '#6EC992', macdNegativeColor: '#FF817F',
            bandColor: 'rgba(245, 203, 35, 0.12)',
        }];
        return indicator;
    }
    public createIndicatorAxes(type: TechnicalIndicators, args: MenuEventArgs ): void {
        if (this.indicators.indexOf(type) === -1) {
            args.item.text = '&#10004&nbsp;' + args.item.text.replace('&nbsp;&nbsp;&nbsp;', '');
            this.indicators.push(type);
            let axis: AxisModel[];
            let row: RowModel[];
            let indicator: TechnicalIndicatorModel[];
            let len: number = this.stockChart.rows.length;
            this.stockChart.rows[this.stockChart.rows.length - 1].height = '15%';
            row = [{ height: '' + (100 - len * 15) + 'px' }];
            if (this.stockChart.rows.length === 1) {
                this.stockChart.isSingleAxis = true;
             }
            this.stockChart.rows = this.stockChart.rows.concat(row);
            if (!this.stockChart.isSingleAxis) {
               this.stockChart.axes[0].rowIndex += 1;
             } else {
                for (let i: number = 0; i < this.stockChart.axes.length; i++) {
                    this.stockChart.axes[i].rowIndex += 1;
                }
             }
            axis = [{
                plotOffset: 10, opposedPosition: true,
                rowIndex: (!this.stockChart.isSingleAxis ? this.stockChart.axes.length : 0),
                desiredIntervals: 1,
                labelFormat : 'n2',
                majorGridLines: this.stockChart.primaryYAxis.majorGridLines,
                lineStyle: this.stockChart.primaryYAxis.lineStyle,
                labelPosition : this.stockChart.primaryYAxis.labelPosition,
                majorTickLines: this.stockChart.primaryYAxis.majorTickLines,
                rangePadding: 'None',  name: type.toString(),
            }];
            this.stockChart.axes = this.stockChart.axes.concat(axis);
            this.stockChart.primaryYAxis.rowIndex = (!this.stockChart.isSingleAxis ? 0 : len + 1);
            indicator = this.getIndicator(type, type.toString());
            this.stockChart.indicators = this.stockChart.indicators.concat(indicator);
            this.stockChart.cartesianChart.initializeChart();
        } else {
            args.item.text = '&nbsp;&nbsp;&nbsp;' + args.item.text;
            for (let i: number = 0; i < this.stockChart.indicators.length; i++) {
                if (this.stockChart.indicators[i].type === type) {
                    this.stockChart.indicators.splice(i, 1);
                }
            }
            this.indicators.splice(this.indicators.indexOf(type), 1);
            let removedIndex: number = 0;
            for (let z: number = 0; z < this.stockChart.axes.length; z++) {
                if (this.stockChart.axes[z].name === type) {
                    removedIndex = this.stockChart.axes[z].rowIndex;
                    this.stockChart.rows.splice(z, 1);
                    this.stockChart.axes.splice(z, 1);
                }
            }
            for (let z: number = 0; z < this.stockChart.axes.length; z++) {
                if (this.stockChart.axes[z].rowIndex !== 0 && this.stockChart.axes[z].rowIndex > removedIndex) {
                    this.stockChart.axes[z].rowIndex = this.stockChart.axes[z].rowIndex - 1;
                }
            }
            this.stockChart.cartesianChart.initializeChart();
        }
    }
    public tickMark(args: MenuEventArgs): string {
        let text: string;
        // tslint:disable-next-line:no-string-literal
        let items: ItemModel[] = args.item['parentObj'].items;
        for (let i: number = 0 ; i < items.length; i++ ) {
            items[i].text = items[i].text.indexOf('&#10004&nbsp;') >= 0 ?
            items[i].text.substr(items[i].text.indexOf(';') + 1) :
            items[i].text;
            if ( !(items[i].text.indexOf('&nbsp;&nbsp;&nbsp;') >= 0)) {
                items[i].text = '&nbsp;&nbsp;&nbsp;' + items[i].text;
            }
        }
        if (args.item.text.indexOf('&nbsp;&nbsp;&nbsp;') >= 0) {
            text = args.item.text.replace('&nbsp;&nbsp;&nbsp;', '');
            args.item.text = args.item.text.replace('&nbsp;&nbsp;&nbsp;', '&#10004&nbsp;');
        } else {
            text = args.item.text.replace('&#10004&nbsp;', '');
        }
        return text;
    }
    public printButton(): void {
        if (this.stockChart.exportType.indexOf('Print') > -1) {
            let print: Button = new Button();
            print.appendTo('#' + this.stockChart.element.id + '_print');
            document.getElementById(this.stockChart.element.id + '_print').onclick = () => {
                    this.stockChart.chart.print(this.stockChart.element.id);
            };
        }
    }
    public exportButton(): void {
        let exportChart: DropDownButton = new DropDownButton({
            items: this.getDropDownItems(this.stockChart.exportType),
            select: (args: MenuEventArgs) => {
                let type: ExportType = <ExportType>args.item.text;
                let stockChart: StockChart = this.stockChart;
                let stockID: string = stockChart.element.id + '_stockChart_';
                let additionalRect: ClientRect;
                let svgHeight: ClientRect = stockChart.svgObject.getBoundingClientRect();
                if (stockChart.chart.exportModule) {
                    this.stockChart.svgObject.insertAdjacentElement('afterbegin', this.addExportSettings());
                    additionalRect = stockChart.svgObject.firstElementChild.getBoundingClientRect();
                    this.stockChart.svgObject.setAttribute('height', (svgHeight.height + additionalRect.height).toString());
                    (getElement(stockID + 'chart') as HTMLElement).style.transform = 'translateY(' + additionalRect.height + 'px)';
                    if (stockChart.enableSelector) {
                        (getElement(stockID + 'rangeSelector') as HTMLElement).setAttribute('transform',
                            // tslint:disable-next-line:align
                            'translate(' + 0 + ',' + (stockChart.cartesianChart.cartesianChartSize.height + additionalRect.height) + ')');
                    }
                    stockChart.chart.exportModule.export(type, 'StockChart', null, [stockChart], null, stockChart.svgObject.clientHeight);
                    remove(getElement(this.stockChart.element.id + '_additionalExport'));
                    (getElement(stockID + 'chart') as HTMLElement).style.transform = 'translateY(0px)';
                    if (stockChart.enableSelector) {
                        (getElement(stockID + 'rangeSelector') as HTMLElement).setAttribute('transform',
                            // tslint:disable-next-line:align
                            'translate(' + 0 + ',' + (stockChart.cartesianChart.cartesianChartSize.height) + ')');
                    }
                    this.stockChart.svgObject.setAttribute('height', (svgHeight.height).toString());
                }
            }
        });
        exportChart.appendTo('#' + this.stockChart.element.id + '_export');
    }
    public calculateAutoPeriods(): PeriodsModel[] {
        let defaultPeriods: PeriodsModel[] = [];
        defaultPeriods = this.findRange(this.stockChart.seriesXMin, this.stockChart.seriesXMax);
        defaultPeriods.push({ text: 'YTD', selected: true }, { text: 'All' });
        return defaultPeriods;
    }

    private findRange(min: number, max: number): PeriodsModel[] {
        let defaultPeriods: PeriodsModel[] = [];
        if (((max - min) / 3.154e+10) >= 1) {
            defaultPeriods.push(
                { text: '1M', interval: 1, intervalType: 'Months' },
                { text: '3M', interval: 3, intervalType: 'Months' },
                { text: '6M', interval: 6, intervalType: 'Months' },
                { text: '1Y', interval: 1, intervalType: 'Years' });
        } else if ((max - min) / 1.577e+10 >= 1) {
            defaultPeriods.push(
                { text: '1M', interval: 1, intervalType: 'Months' },
                { text: '3M', interval: 3, intervalType: 'Months' },
                { text: '6M', interval: 6, intervalType: 'Months' });
        } else if ((max - min) / 2.628e+9 >= 1) {
            defaultPeriods.push(
                { text: '1D', interval: 1, intervalType: 'Days' },
                { text: '3W', interval: 3, intervalType: 'Weeks' },
                { text: '1M', interval: 1, intervalType: 'Months' });
        } else if ((max - min) / 8.64e+7 >= 1) {
            defaultPeriods.push(
                { text: '1H', interval: 1, intervalType: 'Hours' },
                { text: '12H', interval: 12, intervalType: 'Hours' },
                { text: '1D', interval: 1, intervalType: 'Days' },
            );
        }
        return defaultPeriods;
    }

    /**
     * Text elements added to while export the chart
     * It details about the seriesTypes, indicatorTypes and Trendlines selected in chart.
     */
    private addExportSettings(): Element {
        let exportElement: Element = this.stockChart.renderer.createGroup({
            id: this.stockChart.element.id + '_additionalExport',
            width: this.stockChart.availableSize.width,
        });
        let titleHeight: number =  measureText(this.stockChart.title, this.stockChart.titleStyle).height;
        let options: TextOption = new TextOption(
            exportElement.id + '_Title',
            titlePositionX(new Rect(0, 0, this.stockChart.availableSize.width, 0), this.stockChart.titleStyle),
            0, 'middle', this.stockChart.title, '', 'text-before-edge'
        );
        textElement(this.stockChart.renderer as SvgRenderer, options, this.stockChart.titleStyle,
                    this.stockChart.titleStyle.color, exportElement);
        let style: FontModel = { size: '15px', fontWeight: '500', color: null, fontStyle: 'Normal', fontFamily: 'Segoe UI' };
        let x: number = measureText('Series: ' + this.selectedSeries, style).width / 2;
        let y: number = titleHeight;
        this.textElementSpan(
            new TextOption(exportElement.id + '_Series', x, y, 'start', ['Series : ', this.selectedSeries], '', 'text-before-edge'), style,
            'black', exportElement
        );
        x += measureText('Series: ' + this.selectedSeries + ' Z', style).width;
        if (this.selectedIndicator !== '') {
            this.textElementSpan(
                new TextOption(exportElement.id + '_Indicator', x, y, 'start', ['Indicator :', this.selectedIndicator],
                               '', 'text-before-edge'),
                style, 'black', exportElement
            );
            x += measureText('Indicator: ' + this.selectedIndicator +  ' Z', style).width;
        }

        if (this.selectedTrendLine !== '') {
            this.textElementSpan(
                new TextOption(exportElement.id + '_TrendLine', x, y, 'start', ['Trendline :' , this.selectedTrendLine],
                               '', 'text-before-edge'),
                style, 'black', exportElement
            );
        }
        return exportElement;
    }

    /** @private */
    private textElementSpan(
        options: TextOption, font: FontModel, color: string,
        parent: HTMLElement | Element, isMinus: boolean = false, redraw?: boolean, isAnimate?: boolean,
        forceAnimate: boolean = false, animateDuration?: number
    ): Element {
        let renderer: SvgRenderer = new SvgRenderer('');
        let renderOptions: Object = {};
        let htmlObject: Element;
        let text: string;
        let tspanElement: Element;
        renderOptions = {
            'id': options.id,
            'font-style': font.fontStyle,
            'font-family': font.fontFamily,
            'font-weight': font.fontWeight,
            'text-anchor': options.anchor,
            'x': options.x,
            'y': options.y,
            'fill': color,
            'font-size': font.size,
            'transform': options.transform,
            'opacity': font.opacity,
            'dominant-baseline': options.baseLine,
        };
        text = typeof options.text === 'string' ? options.text : isMinus ? options.text[options.text.length - 1] : options.text[0];
        htmlObject = renderer.createText(renderOptions, text);
        if (typeof options.text !== 'string' && options.text.length > 1) {
            for (let i: number = 1, len: number = options.text.length; i < len; i++) {
                options.text[i] = ' ' + options.text[i];
                tspanElement = renderer.createTSpan(
                    {
                        'x': options.x + measureText(text, font).width + 5, 'id': options.id,
                        'y': (options.y), opacity : 0.5
                    },
                    options.text[i]
                );
                htmlObject.appendChild(tspanElement);
            }
        }
        appendChildElement(false, parent, htmlObject, redraw, isAnimate, 'x', 'y', null, null, forceAnimate, false, null, animateDuration);
        return htmlObject;
    }
}