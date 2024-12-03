// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path='../series/chart-series-model.d.ts' />
import { Property, Complex } from '@syncfusion/ej2-base';
import { TechnicalIndicators, FinancialDataFields, MacdType } from './../utils/enum';
import { Series, SeriesBase } from '../series/chart-series';
import { firstToLowerCase } from '../../common/utils/helper';
import { Rect } from '@syncfusion/ej2-svg-base';
import { Chart } from '../chart';
import { ConnectorModel } from '../../common/model/base-model';
import { Connector } from '../../common/model/base';

/**
 * Defines how to represent the market trend using technical indicators.
 */
export class TechnicalIndicator extends SeriesBase {
    /**
     * Defines the types of technical indicators. They are:
     * * 'Sma' - Predicts the trend using the Simple Moving Average approach.
     * * 'Ema' - Predicts the trend using the Exponential Moving Average approach.
     * * 'Tma' - Predicts the trend using the Triangular Moving Average approach.
     * * 'Atr' - Predicts the trend using the Average True Range approach.
     * * 'AccumulationDistribution' - Predicts the trend using the Accumulation Distribution approach.
     * * 'Momentum' - Predicts the trend using the Momentum approach.
     * * 'Rsi' - Predicts the trend using the Relative Strength Index (RSI) approach.
     * * 'Macd' - Predicts the trend using the Moving Average Convergence Divergence (MACD) approach.
     * * 'Stochastic' - Predicts the trend using the Stochastic Oscillator approach.
     * * 'BollingerBands' - Predicts the trend using the Bollinger Bands approach.
     *
     * @default 'Sma'
     */
    @Property('Sma')
    public type: TechnicalIndicators;

    /**
     * Defines the period over which price changes are considered for trend prediction.
     *
     * @default 14
     */
    @Property(14)
    public period: number;

    /**
     * Defines the look-back period for price changes used to calculate the %K value in stochastic indicators.
     *
     * @default 14
     */
    @Property(14)
    public kPeriod: number;

    /**
     * Defines the period over which price changes determine the %D value in stochastic indicators.
     *
     * @default 3
     */
    @Property(3)
    public dPeriod: number;

    /**
     * Specifies the over-bought (threshold) values applicable for RSI and stochastic indicators.
     *
     * @default 80
     */
    @Property(80)
    public overBought: number;

    /**
     * Defines the over-sold (threshold) values for RSI and stochastic indicators.
     *
     * @default 20
     */
    @Property(20)
    public overSold: number;

    /**
     * Sets the standard deviation values used to define the upper and lower Bollinger Bands.
     *
     * @default 2
     */
    @Property(2)
    public standardDeviation: number;

    /**
     * Defines the field used to compare the current value with previous values.
     *
     * @default 'Close'
     */
    @Property('Close')
    public field: FinancialDataFields;

    /**
     * Sets the slow period for defining the MACD line.
     *
     * @default 12
     */
    @Property(12)
    public slowPeriod: number;

    /**
     * Sets the fast period to define the MACD line.
     *
     * @default 26
     */
    @Property(26)
    public fastPeriod: number;

    /**
     * Specifies whether to enable or disable the over-bought and over-sold regions.
     *
     * @default true
     */
    @Property(true)
    public showZones: boolean;

    /**
     * Defines the appearance of the MACD line in the MACD indicator.
     *
     * @default { color: '#ff9933', width: 2 }
     */
    @Complex<ConnectorModel>({ color: '#ff9933', width: 2 }, Connector)
    public macdLine: ConnectorModel;

    /**
     * Defines the type of the MACD (Moving Average Convergence Divergence) indicator.
     *
     * @default 'Both'
     */
    @Property('Both')
    public macdType: MacdType;

    /**
     * Specifies the color for positive bars in the MACD indicator.
     *
     * @default '#2ecd71'
     */
    @Property('#2ecd71')
    public macdPositiveColor: string;

    /**
     * Specifies the color for negative bars in the MACD indicator.
     *
     * @default '#e74c3d'
     */
    @Property('#e74c3d')
    public macdNegativeColor: string;

    /**
     * Configures the settings for customizing the Bollinger Bands in the indicator.
     *
     * @default 'rgba(211,211,211,0.25)'
     */

    @Property('rgba(211,211,211,0.25)')
    public bandColor: string;

    /**
     * Defines the appearance of the upper line in technical indicators.
     */
    @Complex<ConnectorModel>({ color: '#ffb735', width: 1 }, Connector)
    public upperLine: ConnectorModel;

    /**
     * Defines the appearance of the lower line in technical indicators.
     */

    @Complex<ConnectorModel>({ color: '#f2ec2f', width: 1 }, Connector)
    public lowerLine: ConnectorModel;

    /**
     * Defines the appearance of the period line in technical indicators.
     */

    @Complex<ConnectorModel>({ color: '#f2ec2f', width: 1 }, Connector)
    public periodLine: ConnectorModel;

    /**
     * Specifies the name of the series to be used for displaying the indicator data.
     *
     * @default ''
     */
    @Property('')
    public seriesName: string;

    /** @private */
    public targetSeries: Series[];

    /** @private */
    public sourceSeries: Series;

    /** @private */
    public indicatorElement: Element;

    /** @private */
    public clipRectElement: Element;

    /** @private */
    public clipRect: Rect = new Rect(0, 0, 0, 0);

    /**
     * Sets the data source for the series in the chart.
     *
     * @private
     * @param {Series} series - The series for which the data source is being set.
     * @param {Chart} chart - The chart instance.
     * @returns {void}
     */
    public setDataSource(series: Series, chart: Chart): void {
        if (series) {
            this.xData = series.xData;
            this.yData = series.yData;
            this.points = (series as Series).points;
        }
        const type: string = firstToLowerCase(this.type);
        if (this.visible) {
            chart[type + 'IndicatorModule'].initDataSource(this, chart);
        }
        chart.visibleSeriesCount += this.targetSeries.length;
    }
}
