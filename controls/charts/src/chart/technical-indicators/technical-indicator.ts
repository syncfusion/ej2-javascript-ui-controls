/// <reference path='../series/chart-series-model.d.ts' />
import { Property, Complex } from '@syncfusion/ej2-base';
import { TechnicalIndicators, FinancialDataFields, MacdType } from './../utils/enum';
import { ConnectorModel } from '../../common/model/base-model';
import { Connector } from '../../common/model/base';
import { Series, SeriesBase } from '../series/chart-series';
import { Rect, firstToLowerCase } from '../../common/utils/helper';
import { Chart } from '../chart';

/**
 * Defines how to represent the market trend using technical indicators
 */
export class TechnicalIndicator extends SeriesBase {
    /**
     * Defines the type of the technical indicator
     * @default 'Sma'
     */
    @Property('Sma')
    public type: TechnicalIndicators;

    /**
     * Defines the period, the price changes over which will be considered to predict the trend
     * @default 14
     */
    @Property(14)
    public period: number;

    /**
     * Defines the look back period, the price changes over which will define the %K value in stochastic indicators
     * @default 14
     */
    @Property(14)
    public kPeriod: number;

    /**
     * Defines the period, the price changes over which will define the %D value in stochastic indicators
     * @default 3
     */
    @Property(3)
    public dPeriod: number;

    /**
     * Defines the over-bought(threshold) values. It is applicable for RSI and stochastic indicators
     * @default 80
     */
    @Property(80)
    public overBought: number;

    /**
     * Defines the over-sold(threshold) values. It is applicable for RSI and stochastic indicators
     * @default 20
     */
    @Property(20)
    public overSold: number;

    /**
     * Sets the standard deviation values that helps to define the upper and lower bollinger bands
     * @default 2
     */
    @Property(2)
    public standardDeviation: number;

    /**
     * Defines the field to compare the current value with previous values
     * @default 'Close'
     */
    @Property('Close')
    public field: FinancialDataFields;

    /**
     * Sets the slow period to define the Macd line
     * @default 12
     */
    @Property(12)
    public slowPeriod: number;

    /**
     * Sets the fast period to define the Macd line
     * @default 26
     */
    @Property(26)
    public fastPeriod: number;

    /**
     * Enables/Disables the over-bought and over-sold regions
     * @default true
     */
    @Property(true)
    public showZones: boolean;

    /**
     * Defines the appearance of the the MacdLine of Macd indicator
     * @default { color: '#ff9933', width: 2 }
     */
    @Complex<ConnectorModel>({ color: '#ff9933', width: 2 }, Connector)
    public macdLine: ConnectorModel;

    /**
     * Defines the type of the Macd indicator.
     * @default 'Both'
     */
    @Property('Both')
    public macdType: MacdType;

    /**
     * Defines the color of the positive bars in Macd indicators
     * @default '#2ecd71'
     */
    @Property('#2ecd71')
    public macdPositiveColor: string;

    /**
     * Defines the color of the negative bars in Macd indicators
     * @default '#e74c3d'
     */
    @Property('#e74c3d')
    public macdNegativeColor: string;

    /**
     * Options for customizing the BollingerBand in the indicator.
     * @default 'rgba(211,211,211,0.25)'
     */

    @Property('rgba(211,211,211,0.25)')
    public bandColor: string;

    /**
     * Defines the appearance of the upper line in technical indicators
     */
    @Complex<ConnectorModel>({ color: '#ffb735', width: 1 }, Connector)
    public upperLine: ConnectorModel;

    /**
     * Defines the appearance of lower line in technical indicators
     */

    @Complex<ConnectorModel>({ color: '#f2ec2f', width: 1 }, Connector)
    public lowerLine: ConnectorModel;

    /**
     * Defines the appearance of period line in technical indicators
     */

    @Complex<ConnectorModel>({ color: '#f2ec2f', width: 1 }, Connector)
    public periodLine: ConnectorModel;

    /**
     * Defines the name of the series, the data of which has to be depicted as indicator
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

    /** @private */
    public setDataSource(series: Series, chart: Chart): void {
        if (series) {
            this.xData = series.xData;
            this.yData = series.yData;
            this.points = (series as Series).points;
        }
        let type: string = firstToLowerCase(this.type);
        chart[type + 'IndicatorModule'].initDataSource(this, chart);

        chart.visibleSeriesCount += this.targetSeries.length;
    }
}



