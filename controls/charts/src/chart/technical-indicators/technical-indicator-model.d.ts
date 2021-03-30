import { Property, Complex } from '@syncfusion/ej2-base';import { TechnicalIndicators, FinancialDataFields, MacdType } from './../utils/enum';import { ConnectorModel } from '../../common/model/base-model';import { Connector } from '../../common/model/base';import { Series, SeriesBase } from '../series/chart-series';import { firstToLowerCase } from '../../common/utils/helper';import { Rect } from '@syncfusion/ej2-svg-base';import { Chart } from '../chart';
import {SeriesBaseModel} from "../series/chart-series-model";

/**
 * Interface for a class TechnicalIndicator
 */
export interface TechnicalIndicatorModel extends SeriesBaseModel{

    /**
     * Defines the type of the technical indicator
     *
     * @default 'Sma'
     */
    type?: TechnicalIndicators;

    /**
     * Defines the period, the price changes over which will be considered to predict the trend
     *
     * @default 14
     */
    period?: number;

    /**
     * Defines the look back period, the price changes over which will define the %K value in stochastic indicators
     *
     * @default 14
     */
    kPeriod?: number;

    /**
     * Defines the period, the price changes over which will define the %D value in stochastic indicators
     *
     * @default 3
     */
    dPeriod?: number;

    /**
     * Defines the over-bought(threshold) values. It is applicable for RSI and stochastic indicators
     *
     * @default 80
     */
    overBought?: number;

    /**
     * Defines the over-sold(threshold) values. It is applicable for RSI and stochastic indicators
     *
     * @default 20
     */
    overSold?: number;

    /**
     * Sets the standard deviation values that helps to define the upper and lower bollinger bands
     *
     * @default 2
     */
    standardDeviation?: number;

    /**
     * Defines the field to compare the current value with previous values
     *
     * @default 'Close'
     */
    field?: FinancialDataFields;

    /**
     * Sets the slow period to define the Macd line
     *
     * @default 12
     */
    slowPeriod?: number;

    /**
     * Sets the fast period to define the Macd line
     *
     * @default 26
     */
    fastPeriod?: number;

    /**
     * Enables/Disables the over-bought and over-sold regions
     *
     * @default true
     */
    showZones?: boolean;

    /**
     * Defines the appearance of the the MacdLine of Macd indicator
     *
     * @default { color: '#ff9933', width: 2 }
     */
    macdLine?: ConnectorModel;

    /**
     * Defines the type of the Macd indicator.
     *
     * @default 'Both'
     */
    macdType?: MacdType;

    /**
     * Defines the color of the positive bars in Macd indicators
     *
     * @default '#2ecd71'
     */
    macdPositiveColor?: string;

    /**
     * Defines the color of the negative bars in Macd indicators
     *
     * @default '#e74c3d'
     */
    macdNegativeColor?: string;

    /**
     * Options for customizing the BollingerBand in the indicator.
     *
     * @default 'rgba(211,211,211,0.25)'
     */

    bandColor?: string;

    /**
     * Defines the appearance of the upper line in technical indicators
     */
    upperLine?: ConnectorModel;

    /**
     * Defines the appearance of lower line in technical indicators
     */

    lowerLine?: ConnectorModel;

    /**
     * Defines the appearance of period line in technical indicators
     */

    periodLine?: ConnectorModel;

    /**
     * Defines the name of the series, the data of which has to be depicted as indicator
     *
     * @default ''
     */
    seriesName?: string;

}