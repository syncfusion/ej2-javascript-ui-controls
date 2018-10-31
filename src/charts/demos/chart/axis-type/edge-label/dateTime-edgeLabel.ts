/**
 * axis spec 
 */

export let xyData: any[] = [{ x: new Date('2001-04-13T09:07:00+08:00'), y: 2000 }, { x: new Date('2002-04-13T09:07:00+08:00'), y: 64 },
{ x: new Date('2003-04-13T09:07:00+08:00'), y: 1230 }, { x: new Date('2004-04-13T09:07:00+08:00'), y: 766 },
{ x: new Date('2005-04-13T09:07:00+08:00'), y: 200 }, { x: new Date('2006-04-13T09:07:00+08:00'), y: 959 },
{ x: new Date('2007-04-13T09:07:00+08:00'), y: 250 }, { x: new Date('2008-04-13T09:07:00+08:00'), y: 90 },
{ x: new Date('2009-04-13T09:07:00+08:00'), y: 564 }, { x: new Date('2010-04-13T09:07:00+08:00'), y: 500 },
{ x: new Date('2011-04-13T09:07:00+08:00'), y: 420 }, { x: new Date('2012-04-13T09:07:00+08:00'), y: 300 }];



import { Chart, DateTime, LineSeries, ColumnSeries, AreaSeries, BubbleSeries, SplineSeries, StepLineSeries, StripLine } from '../../../../src/chart/index';
import { Axis, ILoadedEventArgs, Series } from '../../../../src/chart/index';
Chart.Inject(DateTime, LineSeries, ColumnSeries, AreaSeries, BubbleSeries, StepLineSeries, SplineSeries, StripLine);

let chart: Chart = new Chart({
    axes: [
        {
            title: 'HorizontalAxis1(None)', name: 'HorizontalAxis1', valueType: 'DateTime', majorGridLines: { width: 0 },
            skeletonType: 'Date', skeleton: 'full', edgeLabelPlacement: 'None', rangePadding: 'Round', desiredIntervals: 15,
        },
        {
            title: 'HorizontalAxis2(Hide)', name: 'HorizontalAxis2', valueType: 'DateTime', majorGridLines: { width: 0 },
            skeletonType: 'Date', skeleton: 'full', edgeLabelPlacement: 'Hide', rangePadding: 'Round', desiredIntervals: 15
        },
        {
            title: 'HorizontalAxis3(Shift)', name: 'HorizontalAxis3', valueType: 'DateTime', majorGridLines: { width: 0 },
            skeletonType: 'Date', skeleton: 'full', edgeLabelPlacement: 'Shift', rangePadding: 'Round', desiredIntervals: 15
        },
        {
            title: 'HorizontalAxis4(None)', name: 'HorizontalAxis4', opposedPosition: true, valueType: 'DateTime',
            majorGridLines: { width: 0 },
            skeletonType: 'Date', skeleton: 'full', edgeLabelPlacement: 'None', rangePadding: 'Round', desiredIntervals: 15
        },
        {
            title: 'HorizontalAxis5(Hide)', name: 'HorizontalAxis5', opposedPosition: true, valueType: 'DateTime',
            majorGridLines: { width: 0 },
            skeletonType: 'Date', skeleton: 'full', edgeLabelPlacement: 'Hide', rangePadding: 'Round', desiredIntervals: 15
        },
        {
            title: 'HorizontalAxis6(Shift)', name: 'HorizontalAxis6', opposedPosition: true, valueType: 'DateTime',
            majorGridLines: { width: 0 },
            skeletonType: 'Date', skeleton: 'full', edgeLabelPlacement: 'Shift', rangePadding: 'Round', desiredIntervals: 15
        },
        { title: 'verticalAxis1(None)', name: 'verticalAxis1', edgeLabelPlacement: 'None', majorGridLines: { width: 0 }, },
        { title: 'verticalAxis2(Hide)', name: 'verticalAxis2', edgeLabelPlacement: 'Hide', majorGridLines: { width: 0 }, },
        { title: 'verticalAxis3(Shift)', name: 'verticalAxis3', edgeLabelPlacement: 'Shift', majorGridLines: { width: 0 }, },
        { title: 'verticalAxis4(None)', name: 'verticalAxis4', opposedPosition: true, edgeLabelPlacement: 'None',
          majorGridLines: { width: 0 }, stripLines: [{ start: 300, end: 1000, visible: true, zIndex: 'Behind', color: 'red', opacity: 0.5, horizontalAlignment: 'Start', verticalAlignment: 'End'}]},
        { title: 'verticalAxis5(Hide)', name: 'verticalAxis5', opposedPosition: true, edgeLabelPlacement: 'Hide',
          majorGridLines: { width: 0 }, stripLines: [{ start: 1500, end: 2000, visible: true, zIndex: 'Over', color: 'violet', opacity: 0.43, horizontalAlignment: 'Start', verticalAlignment: 'End'}]},
        { title: 'verticalAxis6(Shift)', name: 'verticalAxis6', opposedPosition: true, edgeLabelPlacement: 'Shift',
          majorGridLines: { width: 0 }, },
    ],
    series: [
        { dataSource: xyData, xName: 'x', yName: 'y', xAxisName: 'HorizontalAxis1', yAxisName: 'verticalAxis1' },
        { dataSource: xyData, xName: 'x', yName: 'y', xAxisName: 'HorizontalAxis2', yAxisName: 'verticalAxis2', type: 'Column' },
        { dataSource: xyData, xName: 'x', yName: 'y', xAxisName: 'HorizontalAxis3', yAxisName: 'verticalAxis3', type: 'Area' },
        { dataSource: xyData, xName: 'x', yName: 'y', xAxisName: 'HorizontalAxis4', yAxisName: 'verticalAxis4', type: 'Spline' },
        { dataSource: xyData, xName: 'x', yName: 'y', xAxisName: 'HorizontalAxis5', yAxisName: 'verticalAxis5', type: 'StepLine' },
        { dataSource: xyData, xName: 'x', yName: 'y', xAxisName: 'HorizontalAxis6', yAxisName: 'verticalAxis6', type: 'Bubble' },
    ],
    title: 'edgeLabelPlacement and stripline zIndex',
    height: '800',
    border: { color: 'black', width: 2},
    width: '1400',
    load: (args: ILoadedEventArgs) => {
        args.chart.series.forEach((series: Series) => {
            series.animation.enable = false;
        });
    }
});

chart.appendTo('#container');

let inversed: any = document.getElementById('inversed');
inversed.onclick = () => {
    chart.title = 'category-log axis with inversed';
    chart.primaryXAxis.isInversed = inversed.checked;
    chart.primaryYAxis.isInversed = inversed.checked;
    for (let axis of chart.axes) {
            axis.isInversed = inversed.checked;
    }
    chart.refresh();
};
