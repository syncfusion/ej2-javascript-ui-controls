/**
 * Pivot Selection Sample
 */

import { IDataSet, IGridValues, IAxisSet, IField, IFieldOptions } from '../../../src/base/engine';
import { pivot_nodata } from '../../../spec/base/datasource.spec';
import { PivotView } from '../../../src/pivotview/base/pivotview';
import { FieldList } from '../../../src/common/actions/field-list';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { PivotCellSelectedEventArgs, CellSelectedObject } from '../../../src';
import { SeriesModel } from '@syncfusion/ej2-charts';
import { Chart, Category, Legend, Tooltip, ColumnSeries, LineSeries } from '@syncfusion/ej2-charts';

PivotView.Inject(FieldList);
let onInit: boolean = true;
let measureList: { [key: string]: string } = {};
let chart: Chart;
let selectedCells: CellSelectedObject[];
let chartSeries: SeriesModel[];
let pivotGridObj: PivotView = new PivotView({
    dataSourceSettings: {
        dataSource: pivot_nodata as IDataSet[],
        enableSorting: true,
        rows: [{ name: 'Country' }, { name: 'State' }],
        columns: [{ name: 'Product' }, { name: 'Date' }],
        values: [{ name: 'Quantity' }], filters: [],
    },
    showFieldList: false,
    width: 1000,
    height: 300,
    dataBound: () => {
        if (onInit) {
            pivotGridObj.dataSourceSettings.values.forEach(function (value: IFieldOptions) { measureList[value.name] = value.caption || value.name });
            chartSeries = frameChartSeries();
            chartUpdate();
        }
    },
    gridSettings: {
        allowSelection: true,
        selectionSettings: { mode: 'Both', type: 'Multiple', cellSelectionMode: 'Box' }
    },
    cellSelected: (args: PivotCellSelectedEventArgs) => {
        selectedCells = args.selectedCellsInfo;
        if (selectedCells && selectedCells.length > 0) {
            chartSeries = frameChartSeries();
            chartUpdate();
        }
    }
});
pivotGridObj.appendTo('#PivotView');

function frameChartSeries(): SeriesModel[] {
    let columnGroupObject: { [key: string]: { x: string, y: number }[] } = {};
    let valuesContent: IGridValues = pivotGridObj.engineModule.valueContent;
    if (onInit) {
        for (let cCnt: number = 0; cCnt < valuesContent.length; cCnt++) {
            for (let cellIndex of Object.keys(valuesContent[cCnt])) {
                let cell: IAxisSet = valuesContent[cCnt][Number(cellIndex)];
                if (cell.columnHeaders && cell.rowHeaders) {
                    let columnSeries = pivotGridObj.dataSourceSettings.values.length > 1 ?
                        (cell.columnHeaders.toString() + ' ~ ' + measureList[cell.actualText]) : cell.columnHeaders.toString();
                    if (columnGroupObject[columnSeries]) {
                        columnGroupObject[columnSeries].push({ x: cell.rowHeaders.toString(), y: Number(cell.value) });
                    } else {
                        columnGroupObject[columnSeries] = [{ x: cell.rowHeaders.toString(), y: Number(cell.value) }];
                    }
                }
            }
        }
    } else {
        for (let cell of selectedCells) {
            if (cell.measure !== '') {
                let columnSeries = (pivotGridObj.dataSourceSettings.values.length > 1 && measureList[cell.measure]) ?
                    (cell.columnHeaders.toString() + ' ~ ' + measureList[cell.measure]) : cell.columnHeaders.toString();
                if (columnGroupObject[columnSeries]) {
                    columnGroupObject[columnSeries].push({ x: cell.rowHeaders == '' ? 'Grand Total' : cell.rowHeaders.toString(), y: Number(cell.value) });
                } else {
                    columnGroupObject[columnSeries] = [{ x: cell.rowHeaders == '' ? 'Grand Total' : cell.rowHeaders.toString(), y: Number(cell.value) }];
                }
            }
        }
    }
    let columnKeys: string[] = Object.keys(columnGroupObject);
    let chartSeries: SeriesModel[] = [];
    for (let key of columnKeys) {
        chartSeries.push({
            dataSource: columnGroupObject[key],
            xName: 'x',
            yName: 'y',
            type: 'Column',
            name: key
        });
    }
    return chartSeries;
}

function chartUpdate() {
    if (onInit) {
        onInit = false;
        Chart.Inject(ColumnSeries, LineSeries, Legend, Tooltip, Category);
        chart = new Chart({
            title: 'Sales Analysis',
            legendSettings: {
                visible: true
            },
            tooltip: {
                enable: true
            },
            primaryYAxis: {
                title: pivotGridObj.dataSourceSettings.values.map(function (args) { return args.caption || args.name }).join(' ~ '),
            },
            primaryXAxis: {
                valueType: 'Category',
                title: pivotGridObj.dataSourceSettings.rows.map(function (args) { return args.caption || args.name }).join(' ~ '),
                labelIntersectAction: 'Rotate45'
            },
            series: chartSeries,
        }, '#chart');
    } else {
        chart.series = chartSeries;
        chart.primaryXAxis.title = pivotGridObj.dataSourceSettings.rows.map(function (args) { return args.caption || args.name }).join(' ~ ');
        chart.primaryYAxis.title = pivotGridObj.dataSourceSettings.values.map(function (args) { return args.caption || args.name }).join(' ~ ');
        chart.refresh();
    }
}