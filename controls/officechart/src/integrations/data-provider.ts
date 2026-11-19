/**
 * Chart data provider contract.
 */
import { ChartModel } from '../base/chart';

export interface OfficeSeriesModel {
    name?: string;
    dataSource?: { x: unknown; y: unknown; displayText?: string }[] | object[];
    xName?: string;
    yName?: string;
    type?: string;
    radius?: string;
    innerRadius?: string;
    dataLabel?: object;
    marker?: object;
    animation?: { enable?: boolean };
    tooltipMappingName?: string;
    nameAddress?: string;
    category?: string;
    range?: string;
}

export interface IDataProvider {
    /**
     * Gets all series for the current chart context.
     *
     * @param {ChartModel} chart - Chart model.
     * @returns {OfficeSeriesModel[]} Processed series data.
     */
    getSeriesData?(chart?: ChartModel): OfficeSeriesModel[];

    /**
     * Checks whether printing is currently processing.
     *
     * @returns {boolean} True if printing.
     */
    isPrintingProcessing?(): boolean;
}

