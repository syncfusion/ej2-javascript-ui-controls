import { ChartTheme } from './enum';

/**
 * Default chart overlay width in pixels.
 */
export const DEFAULT_CHART_WIDTH: number = 480;

/**
 * Default chart overlay height in pixels.
 */
export const DEFAULT_CHART_HEIGHT: number = 290;

/**
 * Default chart overlay top offset in pixels.
 */
export const DEFAULT_CHART_TOP: number = 0;

/**
 * Default chart overlay left offset in pixels.
 */
export const DEFAULT_CHART_LEFT: number = 0;

/**
 * Default border color.
 */
export const DEFAULT_BORDER_COLOR: string = '';

/**
 * Default border width in pixels.
 */
export const DEFAULT_BORDER_WIDTH: number = 1;

/**
 * Default grid line width in pixels.
 */
export const DEFAULT_GRID_LINE_WIDTH: number = 0;

/**
 * Default marker size in pixels.
 */
export const DEFAULT_MARKER_SIZE: number = 5;

/**
 * Default axis label font size.
 */
export const DEFAULT_LABEL_SIZE: string = '16px';

/**
 * Default major tick line width in pixels.
 */
export const DEFAULT_MAJOR_TICK_WIDTH: number = 1;

/**
 * Default chart margin in pixels.
 */
export const DEFAULT_CHART_MARGIN: number = 0;

/**
 * Keywords for Office Chart JSON parsing (Variant 0: verbose, Variant 1: minified)
 */
export const chartTypeProperty: string[] = ['chartType', 'ct'];
export const widthProperty: string[] = ['width', 'w'];
export const heightProperty: string[] = ['height', 'h'];
export const chartDataProperty: string[] = ['chartData', 'cd'];
export const chartCategoryProperty: string[] = ['chartCategory', 'c'];
export const chartLegendProperty: string[] = ['chartLegend', 'cl'];
export const chartPrimaryCategoryAxisProperty: string[] = ['chartPrimaryCategoryAxis', 'cpca'];
export const chartSeriesProperty: string[] = ['chartSeries', 'cs'];
export const chartTitleProperty: string[] = ['chartTitle', 'ctt'];
export const chartPrimaryValueAxisProperty: string[] = ['chartPrimaryValueAxis', 'cpva'];
export const dataPointsProperty: string[] = ['dataPoints', 'dp'];
export const seriesNameProperty: string[] = ['seriesName', 'sn'];
export const errorBarProperty: string[] = ['errorBar', 'eb'];
export const dataLabelProperty: string[] = ['dataLabel', 'sl'];
export const trendLinesProperty: string[] = ['trendLines', 'tl'];
export const fillProperty: string[] = ['fill', 'f'];
export const foreColorProperty: string[] = ['foreColor', 'fc'];
export const positionProperty: string[] = ['position', 'p'];
export const typeProperty: string[] = ['type', 't'];
export const directionProperty: string[] = ['direction', 'dir'];
export const endStyleProperty: string[] = ['endStyle', 'est'];
export const nameProperty: string[] = ['name', 'n'];
export const forwardProperty: string[] = ['forward', 'fw'];
export const backwardProperty: string[] = ['backward', 'bw'];
export const interceptProperty: string[] = ['intercept', 'itr'];
export const lineProperty: string[] = ['line', 'l'];
export const rgbProperty: string[] = ['rgb', 'rgb'];
export const categoryTypeProperty: string[] = ['categoryType', 'ct'];
export const hasMajorGridLinesProperty: string[] = ['hasMajorGridLines', 'hmajgl'];
export const hasMinorGridLinesProperty: string[] = ['hasMinorGridLines', 'hmingl'];
export const minimumValueProperty: string[] = ['minimumValue', 'minv'];
export const maximumValueProperty: string[] = ['maximumValue', 'maxv'];
export const majorUnitProperty: string[] = ['majorUnit', 'maju'];
export const categoryXNameProperty: string[] = ['categoryXName', 'cx'];
export const numberFormatProperty: string[] = ['numberFormat', 'nf'];
export const yValueProperty: string[] = ['yValue', 'yv'];
export const sizeProperty: string[] = ['size', 'sz'];
export const seriesFormatProperty: string[] = ['seriesFormat', 'sf'];
export const idProperty: string[] = ['id', 'i'];
export const isAutoMajorProperty: string[] = ['isAutoMajor', 'iam'];

/**
 * Default English localization dictionary for Chart Ribbon items.
 */
export const defaultChartRibbonLocale: { [key: string]: string } = {
    'Chart': 'Chart',
    'ChartDesign': 'Chart Design',
    'ChartType': 'Chart Type',
    'AddChartElement': 'Add Chart Element',
    'SwitchRowColumn': 'Switch Row Column',
    'ChartTheme': 'Chart Theme',
    'ChartElements': 'Chart Elements',
    'Data': 'Data',
    'Type': 'Type',
    'Column': 'Column',
    'Bar': 'Bar',
    'Area': 'Area',
    'Pie': 'Pie',
    'PieAndDoughnut': 'Pie / Doughnut',
    'Line': 'Line',
    'Scatter': 'Scatter',
    'ClusteredColumn': 'Clustered Column',
    'StackedColumn': 'Stacked Column',
    'StackedColumn100': '100% Stacked Column',
    'ClusteredBar': 'Clustered Bar',
    'StackedBar': 'Stacked Bar',
    'StackedBar100': '100% Stacked Bar',
    'StackedArea': 'Stacked Area',
    'StackedArea100': '100% Stacked Area',
    'StackedLine': 'Stacked Line',
    'StackedLine100': '100% Stacked Line',
    'LineMarker': 'Line with Markers',
    'StackedLineMarker': 'Stacked Line with Markers',
    'StackedLine100Marker': '100% Stacked Line with Markers',
    'Doughnut': 'Doughnut',
    'Axes': 'Axes',
    'AxisTitle': 'Axis Title',
    'ChartTitle': 'Chart Title',
    'HorizontalAxisTitle': 'Horizontal Axis Title',
    'VerticalAxisTitle': 'Vertical Axis Title',
    'EnterTitle': 'Enter Title',
    'Ok': 'OK',
    'Cancel': 'Cancel',
    'DataLabels': 'Data Labels',
    'GridLines': 'Gridlines',
    'Gridlines': 'Gridlines',
    'Legend': 'Legend',
    'Legends': 'Legends',
    'PrimaryHorizontal': 'Primary Horizontal',
    'PrimaryVertical': 'Primary Vertical',
    'None': 'None',
    'AboveChart': 'Above Chart',
    'CenteredOverlay': 'Centered Overlay',
    'Center': 'Center',
    'InsideEnd': 'Inside End',
    'InsideBase': 'Inside Base',
    'OutsideEnd': 'Outside End',
    'PrimaryMajorHorizontal': 'Primary Major Horizontal',
    'PrimaryMajorVertical': 'Primary Major Vertical',
    'PrimaryMinorHorizontal': 'Primary Minor Horizontal',
    'PrimaryMinorVertical': 'Primary Minor Vertical',
    'Right': 'Right',
    'Top': 'Top',
    'Left': 'Left',
    'Bottom': 'Bottom',
    'Material': 'Material',
    'Fabric': 'Fabric',
    'Bootstrap': 'Bootstrap',
    'HighContrastLight': 'High Contrast Light',
    'MaterialDark': 'Material Dark',
    'FabricDark': 'Fabric Dark',
    'HighContrast': 'HighContrast',
    'BootstrapDark': 'Bootstrap Dark',
    'Bootstrap4': 'Bootstrap 4',
    'Bootstrap5Dark': 'Bootstrap5 Dark',
    'Bootstrap5': 'Bootstrap 5',
    'TailwindDark': 'Tailwind Dark',
    'Tailwind': 'Tailwind',
    'Tailwind3': 'Tailwind 3',
    'Tailwind3Dark': 'Tailwind 3 Dark',
    'FluentDark': 'Fluent Dark',
    'Fluent': 'Fluent',
    'Fluent2': 'Fluent 2',
    'Fluent2Dark': 'Fluent 2 Dark',
    'Material3': 'Material 3',
    'Material3Dark': 'Material 3 Dark'
};

/**
 * Chart theme names list.
 */
export const CHART_THEMES: ChartTheme[] = [
    'Material', 'Fabric', 'Bootstrap', 'HighContrastLight', 'MaterialDark', 'FabricDark', 'HighContrast',
    'BootstrapDark', 'Bootstrap4', 'Bootstrap5Dark', 'Bootstrap5', 'TailwindDark', 'Tailwind', 'Tailwind3',
    'Tailwind3Dark', 'FluentDark', 'Fluent', 'Fluent2', 'Fluent2Dark', 'Material3', 'Material3Dark'
];
