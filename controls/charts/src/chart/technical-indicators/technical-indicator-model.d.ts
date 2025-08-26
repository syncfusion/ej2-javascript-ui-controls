import { Property, Complex } from '@syncfusion/ej2-base';import { TechnicalIndicators, FinancialDataFields, MacdType } from './../utils/enum';import { Series, SeriesBase } from '../series/chart-series';import { firstToLowerCase } from '../../common/utils/helper';import { Rect } from '@syncfusion/ej2-svg-base';import { Chart } from '../chart';import { ConnectorModel, AccessibilityModel } from '../../common/model/base-model';import { Connector, Accessibility } from '../../common/model/base';
import {SeriesBaseModel} from "../series/chart-series-model";

/**
 * Interface for a class TechnicalIndicator
 */
export interface TechnicalIndicatorModel extends SeriesBaseModel{

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
    type?: TechnicalIndicators;

    /**
     * Defines the period over which price changes are considered for trend prediction.
     *
     * @default 14
     */
    period?: number;

    /**
     * Defines the look-back period for price changes used to calculate the %K value in stochastic indicators.
     *
     * @default 14
     */
    kPeriod?: number;

    /**
     * Defines the period over which price changes determine the %D value in stochastic indicators.
     *
     * @default 3
     */
    dPeriod?: number;

    /**
     * Specifies the over-bought (threshold) values applicable for RSI and stochastic indicators.
     *
     * @default 80
     */
    overBought?: number;

    /**
     * Defines the over-sold (threshold) values for RSI and stochastic indicators.
     *
     * @default 20
     */
    overSold?: number;

    /**
     * Sets the standard deviation values used to define the upper and lower Bollinger Bands.
     *
     * @default 2
     */
    standardDeviation?: number;

    /**
     * Defines the field used to compare the current value with previous values.
     *
     * @default 'Close'
     */
    field?: FinancialDataFields;

    /**
     * Sets the slow period for defining the MACD line.
     *
     * @default 12
     */
    slowPeriod?: number;

    /**
     * Sets the fast period to define the MACD line.
     *
     * @default 26
     */
    fastPeriod?: number;

    /**
     * Specifies whether to enable or disable the over-bought and over-sold regions.
     *
     * @default true
     */
    showZones?: boolean;

    /**
     * Defines the appearance of the MACD line in the MACD indicator.
     *
     * @default { color: '#ff9933', width: 2 }
     */
    macdLine?: ConnectorModel;

    /**
     * Defines the type of the MACD (Moving Average Convergence Divergence) indicator.
     *
     * @default 'Both'
     */
    macdType?: MacdType;

    /**
     * Specifies the color for positive bars in the MACD indicator.
     *
     * @default '#2ecd71'
     */
    macdPositiveColor?: string;

    /**
     * Specifies the color for negative bars in the MACD indicator.
     *
     * @default '#e74c3d'
     */
    macdNegativeColor?: string;

    /**
     * Configures the settings for customizing the Bollinger Bands in the indicator.
     *
     * @default 'rgba(211,211,211,0.25)'
     */

    bandColor?: string;

    /**
     * Defines the appearance of the upper line in technical indicators.
     */
    upperLine?: ConnectorModel;

    /**
     * Defines the appearance of the lower line in technical indicators.
     */

    lowerLine?: ConnectorModel;

    /**
     * Defines the appearance of the period line in technical indicators.
     */

    periodLine?: ConnectorModel;

    /**
     * Options to improve accessibility for technical indicator elements.
     */
    accessibility?: AccessibilityModel;

    /**
     * Specifies the name of the series to be used for displaying the indicator data.
     *
     * @default ''
     */
    seriesName?: string;

}