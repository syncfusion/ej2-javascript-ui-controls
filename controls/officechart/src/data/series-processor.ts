/**
 * Series processor for evaluated Office and Spreadsheet chart series.
 */
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ChartModel } from '../base/chart';
import { ChartType } from '../common/enum';
import { AxisModel, DataLabelSettingsModel } from '../base/chart-model';
import { OfficeSeriesModel } from '../integrations/data-provider';

export interface ISeriesProcessResult {
    series: OfficeSeriesModel[];
    primaryXAxis?: AxisModel;
    primaryYAxis?: AxisModel;
    legendSettings?: object;
}

/**
 * SeriesProcessor handles processing and validation of pre-evaluated or direct SeriesModel collections.
 */
export class SeriesProcessor {
    /**
     * Processes direct series data for chart rendering.
     *
     * @param {ChartModel} model - Chart model.
     * @param {OfficeSeriesModel[]} [series] - Direct series array.
     * @returns {ISeriesProcessResult} Processed series result.
     */
    public process(model: ChartModel, series?: OfficeSeriesModel[]): ISeriesProcessResult {
        const inputSeries: OfficeSeriesModel[] = (series && Array.isArray(series)) ? series :
            ((model && model.series && Array.isArray(model.series)) ? model.series as OfficeSeriesModel[] : []);
        const type: ChartType = model ? model.type : undefined;
        const isAccChart: boolean = type === 'Pie' || type === 'Doughnut';
        const dataLabel: DataLabelSettingsModel = model && model.dataLabelSettings ? {
            name: 'displayText',
            visible: model.dataLabelSettings.visible,
            position: model.dataLabelSettings.position
        } : { name: 'displayText' };
        // Rebuild series per chart type matching Spreadsheet's pushSeries
        const resultSeries: OfficeSeriesModel[] = inputSeries.map((sItem: OfficeSeriesModel) => {
            const data: object[] = (sItem.dataSource as object[]) || [];
            const name: string = sItem.name || '';
            const address: string = sItem.nameAddress || '';
            let pObj: Record<string, unknown> = {};
            if (type === 'Line' || type === 'StackingLine' || type === 'StackingLine100') {
                pObj = {
                    dataSource: data, type: type, xName: 'x', yName: 'y', name: name, nameAddress: address,
                    tooltipMappingName: 'displayText',
                    marker: model.markerSettings ? {
                        visible: model.markerSettings.visible, width: model.markerSettings.size || 12,
                        height: model.markerSettings.size || 12, shape: model.markerSettings.shape || 'Circle',
                        dataLabel: dataLabel,
                        isFilled: model.markerSettings.isFilled, border: model.markerSettings.border,
                        fill: model.markerSettings.isFilled ? model.markerSettings.fill : null
                    } : { dataLabel: dataLabel }
                };
            } else if (type === 'Scatter') {
                pObj = {
                    dataSource: data, type: type, xName: 'x', yName: 'y', name: name, nameAddress: address,
                    tooltipMappingName: 'displayText',
                    marker: { visible: false, width: 12, height: 12, shape: 'Circle', dataLabel: dataLabel }
                };
            } else if (isAccChart) {
                // Pie and Doughnut: in EJ2 accumulation chart, series.type is always 'Pie', and Doughnut is configured via innerRadius
                pObj = {
                    dataSource: data, type: 'Pie', radius: '100%', xName: 'x', yName: 'y',
                    innerRadius: type === 'Pie' ? '0%' : '40%',
                    dataLabel: {
                        visible: !!dataLabel.visible,
                        position: dataLabel.position === 'Outer' ? 'Outside' : 'Inside',
                        name: 'displayText', font: { fontWeight: '600' }
                    },
                    tooltipMappingName: 'displayText'
                };
            } else {
                pObj = {
                    dataSource: data, type: type, xName: 'x', yName: 'y',
                    name: name, nameAddress: address, marker: { dataLabel: dataLabel },
                    tooltipMappingName: 'displayText'
                };
            }
            return pObj as OfficeSeriesModel;
        });

        // Build spreadsheet-style default axes if cartesian chart
        let primaryXAxis: AxisModel = model ? model.primaryXAxis : undefined;
        let primaryYAxis: AxisModel = model ? model.primaryYAxis : undefined;

        if (!isAccChart && model) {
            const chartX: AxisModel = model.primaryXAxis || {};
            const chartY: AxisModel = model.primaryYAxis || {};

            primaryXAxis = {
                majorGridLines: chartX.majorGridLines && !isNullOrUndefined(chartX.majorGridLines.width)
                    ? { width: chartX.majorGridLines.width } : { width: 0 },
                minorGridLines: chartX.minorGridLines && !isNullOrUndefined(chartX.minorGridLines.width)
                    ? { width: chartX.minorGridLines.width } : { width: 0 },
                majorTickLines: chartX.majorTickLines && !isNullOrUndefined(chartX.majorTickLines.width)
                    ? { width: chartX.majorTickLines.width } : { width: 1 },
                minorTicksPerInterval: chartX.minorGridLines && chartX.minorGridLines.width > 0 ? 5 : 0,
                labelStyle: chartX.labelStyle && !isNullOrUndefined(chartX.labelStyle.size)
                    ? { size: chartX.labelStyle.size } : {},
                edgeLabelPlacement: 'Shift',
                lineStyle: { width: 0 },
                crossesAt: 0,
                rangePadding: chartX.rangePadding || (type === 'Scatter' ? 'Round' : 'Auto'),
                valueType: chartX.valueType || 'Category',
                title: chartX.title || ''
            };

            primaryYAxis = {
                majorGridLines: chartY.majorGridLines && !isNullOrUndefined(chartY.majorGridLines.width)
                    ? { width: chartY.majorGridLines.width } : { width: 1 },
                minorGridLines: chartY.minorGridLines && !isNullOrUndefined(chartY.minorGridLines.width)
                    ? { width: chartY.minorGridLines.width } : { width: 0 },
                majorTickLines: chartY.majorTickLines && !isNullOrUndefined(chartY.majorTickLines.width)
                    ? { width: chartY.majorTickLines.width } : { width: 1 },
                minorTicksPerInterval: chartY.minorGridLines && chartY.minorGridLines.width > 0 ? 5 : 0,
                labelStyle: chartY.labelStyle && !isNullOrUndefined(chartY.labelStyle.size)
                    ? { size: chartY.labelStyle.size } : {},
                edgeLabelPlacement: 'Shift',
                lineStyle: { width: 0 },
                crossesAt: 0,
                title: chartY.title || ''
            };
        }

        return {
            series: resultSeries,
            primaryXAxis: primaryXAxis,
            primaryYAxis: primaryYAxis,
            legendSettings: model && model.legendSettings ? model.legendSettings : { visible: true, position: 'Bottom' }
        };
    }
}
