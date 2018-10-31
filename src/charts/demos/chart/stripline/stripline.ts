/**
 * axis spec 
 */

import { Chart, Category, Logarithmic, DateTime, LineSeries, ColumnSeries, AreaSeries, BubbleSeries, StepLineSeries, StripLine,
         CandleSeries, SplineSeries, Series, IAnnotationRenderEventArgs, Tooltip, ErrorBar, StripLineSettings,
         IPointRenderEventArgs, RangeAreaSeries, DataLabel, ITextRenderEventArgs, ChartAnnotation  } from '../../../src/chart/index';
import { Axis } from '../../../src/chart/index';
import { EmitType } from '@syncfusion/ej2-base';
Chart.Inject(Category, Logarithmic, LineSeries, DateTime, ColumnSeries, AreaSeries, BubbleSeries, StepLineSeries, StripLine,
             CandleSeries, SplineSeries, RangeAreaSeries, DataLabel, ChartAnnotation, Tooltip, ErrorBar );

let chart: Chart = new Chart({
    height: '550',
    zoomSettings: { enableSelectionZooming: true },
    primaryXAxis: {
        valueType: "DateTime",
            intervalType: "Days",
            interval: 1,
            labelFormat: "dd",
            edgeLabelPlacement: 'Hide',
            stripLines: [{
                    startFromAxis: true, size: 1, sizeType: 'Days', isRepeat: true,
                    repeatEvery: 7,
                    color: "#1cfddd", text: "Week end", opacity: 0.2,
                },
                {
                    start: new Date(2018, 6, 2), end: new Date(2018, 6, 5), isSegmented: true,
                    segmentStart: 0, segmentEnd: 50,
                    color: "#b01cfd", text: "Meeting - 1", rotation: 90
                },
                {
                    start: new Date(2018, 6, 10), end: new Date(2018, 6, 13), isSegmented: true,
                    segmentStart: 30, segmentEnd: 80,
                    color: "#fd3f1c", text: "Meeting - 2", rotation: 90
                },
            ]
        },
        primaryYAxis: {
            stripLines: [
                {
                    startFromAxis: true, end: 50, isSegmented: true,
                    segmentStart: new Date(2018, 6, 17), segmentEnd: new Date(2018, 6, 20),
                    color: "#1c96fd", text: "Meeting - 3",  rotation: 90
                },
                {
                    startFromAxis: true, end: 80, isSegmented: true,
                    segmentStart: new Date(2018, 6, 24), segmentEnd: new Date(2018, 6, 27),
                    color: "#69fd1c", text: "Meeting - 4",  rotation: 90
                },
            ]
        },
        series: [{
                dataSource: [{ x: new Date(2018, 5, 30), y: 10 }, { x: new Date(2018, 6, 4), y: 30 },
                    { x: new Date(2018, 6, 9), y: 40 }, { x: new Date(2018, 6, 16), y: 60 },
                    { x: new Date(2018, 6, 22), y: 17 },
                    { x: new Date(2018, 6, 25), y: 50 }, { x: new Date(2018, 6, 31), y: 67 }
                ],
                xName: 'x', width: 2,
                yName: 'y', type: 'Spline', marker: {
                    visible: true, width: 5, height: 5
                }, animation: { enable: false }
            }
        ],
    title: 'This Month Week-End',
    titleStyle: { textAlignment: "Center", }
});
chart.appendTo('#container');