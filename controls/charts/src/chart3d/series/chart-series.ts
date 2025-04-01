import { Property, ChildProperty, Complex, DateFormatOptions } from '@syncfusion/ej2-base';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { getVisiblePoints, StackValues } from '../../common/utils/helper';
import { firstToLowerCase } from '../../common/utils/helper';
import { Rect } from '@syncfusion/ej2-svg-base';
import { BorderModel, MarginModel, AnimationModel } from '../../common/model/base-model';
import { Border, Margin, Animation } from '../../common/model/base';
import { DataManager, Query, DataUtil } from '@syncfusion/ej2-data';
import { Chart3DAxis, Chart3DColumn, Chart3DRow } from '../axis/axis';
import { Data } from '../../common/model/data';
import { seriesRender } from '../../common/model/constants';
import { EmptyPointMode, LegendShape, SeriesCategories, ShapeType } from '../../common/utils/enum';
import { setRange } from '../../common/utils/helper';
import { Chart3D } from '../chart3D';
import { Chart3DSeriesRenderEventArgs, Chart3DStyleOptions, Chart3DLocation, Chart3DRangeValues, Chart3DRectPosition, Chart3DDepthInfoType, Chart3DTextFont } from '../model/chart3d-Interface';
import { Chart3DSeriesType, Chart3DDataLabelPosition } from '../utils/enum';
import { Chart3DEmptyPointSettingsModel, Chart3DDataLabelSettingsModel } from './chart-series-model';
import { getMinPointsDeltaValue } from '../utils/chart3dRender';
import { Chart3DTextFontModel } from '../model/chart3d-Interface-model';

/**
 * Configures the data label in the series.
 */
export class Chart3DDataLabelSettings extends ChildProperty<Chart3DDataLabelSettings> {

    /**
     * If set true, data label for series renders.
     *
     * @default false
     */
    @Property(false)
    public visible: boolean;

    /**
     * The DataSource field that contains the data label value.
     *
     * @default null
     */
    @Property(null)
    public name: string;

    /**
     * The background color of the data label accepts value in hex and rgba as a valid CSS color string.
     *
     * @default 'transparent'
     */
    @Property('transparent')
    public fill: string;

    /**
     * Used to format the point data label that accepts any global string format like 'C', 'n1', 'P' etc.
     * It also accepts placeholder like '{value}°C' in which value represent the point data label, e.g, 20°C.
     *
     * @default null
     */
    @Property(null)
    public format: string;

    /**
     * The opacity for the background.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Specifies angle for data label.
     *
     * @default 0
     */
    @Property(0)
    public angle: number;

    /**
     * Enables rotation for data label.
     *
     * @default false
     */
    @Property(false)
    public enableRotation: boolean;

    /**
     * Specifies the position of the data label. They are,
     * * top: Positions the label on top of the point.
     * * Bottom: Positions the label at the bottom of the point.
     * * Middle: Positions the label to the middle of the point.
     *
     * @default 'Middle'
     */
    @Property('Middle')
    public position: Chart3DDataLabelPosition;

    /**
     * Option for customizing the border lines.
     */
    @Complex<BorderModel>({ width: null, color: null }, Border)
    public border: BorderModel;

    /**
     * Margin configuration for the data label.
     */
    @Complex<MarginModel>({ left: 5, right: 5, top: 5, bottom: 5 }, Margin)
    public margin: MarginModel;

    /**
     * Option for customizing the data label text.
     */
    @Complex<Chart3DTextFontModel>({ size: null, color: null, fontStyle: null, fontWeight: null, fontFamily: null }, Chart3DTextFont)
    public font: Chart3DTextFontModel;

    /**
     * Custom template to show the data label. Use ${point.x} and ${point.y} as a placeholder
     * text to display the corresponding data point.
     *
     * @default null
     * @aspType string
     */
    @Property(null)
    public template: string | Function;

}

/**
 * Configures the Empty Points of series
 */

export class Chart3DEmptyPointSettings extends ChildProperty<Chart3DEmptyPointSettings> {

    /**
     * To customize the fill color of empty points.
     *
     * @default null
     */

    @Property(null)
    public fill: string;

    /**
     * To customize the mode of empty points.
     *
     * @default Gap
     */

    @Property('Gap')
    public mode: EmptyPointMode;
}

/**
 * Points model for the series.
 *
 * @public
 */
export class Chart3DPoint {
    /** Point x. */
    public x: Object;
    /** Point y. */
    public y: Object;
    /** Point visibility. */
    public visible: boolean;
    /** Point text. */
    public text: string;
    /** Point tooltip. */
    public tooltip: string;
    /** Point color. */
    public color: string;
    /** Point symbol location. */
    public symbolLocations: Chart3DLocation = null;
    /** Point x value. */
    public xValue: number;
    /** Point y value. */
    public yValue: number;
    /** Point color mapping. */
    public colorValue: number;
    /** Point index value. */
    public index: number;
    /** Point percentage value. */
    public percentage: number = null;
    /** Point size value. */
    public size: Object;
    /** Point empty checking. */
    public isEmpty: boolean;
    /** Point interior value. */
    public interior: string;
    /** To know the point is selected. */
    public isSelect: boolean = false;
    /** Point x. */
    public series: Object;
    /** Point top value. */
    public top: number;
    /** Point bottom value. */
    public bottom: number;
    /** Point right value. */
    public right: number;
    /** Point left value. */
    public left: number;
    /** Point start depth value. */
    public startDepth: number;
    /** Point end depth value. */
    public endDepth: number;
    /** Point x range values. */
    public xRange: Chart3DRangeValues;
    /** Point y range values. */
    public yRange: Chart3DRangeValues;
    /** Point plan values. */
    public plans: Chart3DRangeValues;
}

/**
 * Configures the series in charts.
 *
 * @public
 */
export class Chart3DSeries extends ChildProperty<Chart3DSeries> {
    /**
     * The DataSource field that contains the x value.
     *
     * @default ''
     */
    @Property('')
    public xName: string;

    /**
     * The DataSource field that contains the point colors.
     *
     * @default ''
     */
    @Property('')
    public pointColorMapping: string;

    /**
     * Specifies the visibility of series.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * The name of the horizontal axis associated with the series. It requires `axes` of the chart.
     *
     * @default null
     */
    @Property(null)
    public xAxisName: string;

    /**
     * The name of the vertical axis associated with the series. It requires `axes` of the chart.
     *
     * @default null
     */
    @Property(null)
    public yAxisName: string;

    /**
     * Options to customizing animation for the series.
     */
    @Complex<AnimationModel>({ duration: 2000 }, Animation)
    public animation: AnimationModel;

    /**
     * The fill color for the series, which can accept values in hex or rgba as a valid CSS color string.
     *
     * @default null
     */
    @Property(null)
    public fill: string;

    /**
     * Specifies the data source for the series. It can be an array of JSON objects or an instance of DataManager.
     *
     *
     * @default ''
     */
    @Property('')
    public dataSource: Object | DataManager;

    /**
     * Specifies a query to select data from the DataSource. This property is applicable only when the DataSource is an `ej.DataManager`.
     *
     * @default ''
     */
    @Property()
    public query: Query;

    /**
     * The data label for the series.
     */
    @Complex<Chart3DDataLabelSettingsModel>({}, Chart3DDataLabelSettings)
    public dataLabel: Chart3DDataLabelSettingsModel;

    /**
     * The name of the series as displayed in the legend.
     *
     * @default ''
     */
    @Property('')
    public name: string;

    /**
     * The DataSource field that contains the y value.
     *
     * @default ''
     */
    @Property('')
    public yName: string;

    /**
     * The DataSource field that contains the size value of y
     *
     * @default ''
     */
    @Property('')
    public size: string;

    /**
     * This property allows grouping series in `stacked column / bar` charts.
     * Any string value can be provided to the stackingGroup property.
     * If any two or above series have the same value, those series will be grouped together.
     *
     * @default ''
     */
    @Property('')
    public stackingGroup: string;


    /**
     * The opacity of the series.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Defines the name that specifies the chart series are mutually exclusive and can be overlaid.
     * The axis in the same group shares the same baseline and location on the corresponding axis.
     *
     * @default ''
     */
    @Property('')
    public groupName: string;

    /**
     * Specifies the type of the series in the 3D chart. Available options include:
     * - Column
     * - Bar
     * - StackingColumn
     * - StackingBar
     * - StackingColumn100
     * - StackingBar100
     *
     * @default 'Column'
     */
    @Property('Column')
    public type: Chart3DSeriesType;

    /**
     * Enable tooltip for the chart series.
     *
     * @default true
     */
    @Property(true)
    public enableTooltip: boolean;

    /**
     * Format of the tooltip content.
     *
     * @default ''
     */
    @Property('')
    public tooltipFormat: string;

    /**
     * The data source field that contains the tooltip value.
     *
     * @default ''
     */
    @Property('')
    public tooltipMappingName: string;

    /**
     * The shape of the legend. Each series has its own legend shape, which can be one of the following:
     * * Circle
     * * Rectangle
     * * Triangle
     * * Diamond
     * * Cross
     * * HorizontalLine
     * * VerticalLine
     * * Pentagon
     * * InvertedTriangle
     * * SeriesType
     * * Image
     *
     * @default 'SeriesType'
     */
    @Property('SeriesType')
    public legendShape: LegendShape;

    /**
     * The URL for the Image that is to be displayed as a Legend icon.  It requires  `legendShape` value to be an `Image`.
     *
     * @default ''
     */
    @Property('')
    public legendImageUrl: string;

    /**
     * options to customize the empty points in series.
     */
    @Complex<Chart3DEmptyPointSettingsModel>(null, Chart3DEmptyPointSettings)
    public emptyPointSettings: Chart3DEmptyPointSettingsModel;

    /**
     * Render the column series points with a particular column width.
     *
     * @default null
     */
    @Property(null)
    public columnWidth: number;

    /**
     * Defines the shape of the data in a column and bar chart.
     * Rectangle: Displays the data in a column and bar chart in a rectangle shape.
     * Cylinder: Displays the data in a column and bar chart in a cylinder shape.
     *
     * @default 'Rectangle'
     */
    @Property('Rectangle')
    public columnFacet: ShapeType;

    /**
     * To render the column series points with particular column spacing. It takes value from 0 - 1.
     *
     * @default 0.1
     */
    @Property(0.1)
    public columnSpacing: number;

    /** @private */
    public xMin: number;
    /** @private */
    public xMax: number;
    /** @private */
    public yMin: number;
    /** @private */
    public yMax: number;
    /** @private */
    public xAxis: Chart3DAxis;
    /** @private */
    public yAxis: Chart3DAxis;
    /** @private */
    public chart: Chart3D;
    /** @private */
    public currentViewData: Object = [];
    /** @private */
    public clipRect: Rect = new Rect(0, 0, 0, 0);
    /** @private */
    public xData: number[];
    /** @private */
    public yData: number[];
    /** @private */
    public index: number;
    /** @private */
    public dataModule: Data;
    /** @private */
    public points: Chart3DPoint[];
    /** @private */
    public visiblePoints: Chart3DPoint[];
    /** @private */
    public sizeMax: number;
    /** @private */
    public dataLabelElement: HTMLElement
    public visibleSeriesCount: number = 0;
    /** @private */
    public position: number;
    /** @private */
    public rectCount: number;
    /** @private */
    public category: SeriesCategories = 'Series';
    /** @private */
    public isRectSeries: boolean = false;
    /** @private */
    public stackedValues: StackValues;
    /** @private */
    public interior: string;
    /** @private */
    public all: boolean = false;
    constructor(parent: any, propName: string, defaultValue: Object, isArray?: boolean) {
        super(parent, propName, defaultValue, isArray);
    }

    /**
     * This method is responsible for handling and processing JSON data.
     *
     * @returns {void}
     * @hidden
     */
    public processJsonData(): void {
        let i: number = 0;
        let point: Chart3DPoint = new Chart3DPoint();
        const xName: string = this.xName;
        const textMappingName: string = this instanceof Chart3DSeries && this.dataLabel.name ?
            this.dataLabel.name : '';
        const len: number = (this.currentViewData as object[] || []).length;
        this.points = [];
        this.xMin = Infinity; this.xMax = -Infinity;
        this.yMin = Infinity; this.yMax = -Infinity;
        this.sizeMax = -Infinity;
        if (this.xAxis.valueType === 'Category') {
            while (i < len) {
                point = this.dataPoint(i, textMappingName, xName);
                this.pushCategoryData(point, i, <string>point.x);
                this.pushData(point, i);
                this.setEmptyPoint(point, i);
                i++;
            }

        } else if (this.xAxis.valueType.indexOf('DateTime') > -1) {
            const option: DateFormatOptions = {
                skeleton: 'full',
                type: 'dateTime'
            };
            const dateParser: Function = this.chart.intl.getDateParser(option);
            const dateFormatter: Function = this.chart.intl.getDateFormat(option);
            while (i < len) {
                point = this.dataPoint(i, textMappingName, xName);
                if (!isNullOrUndefined(point.x) && point.x !== '') {
                    point.x = new Date(
                        DataUtil.parse.parseJson({ val: point.x }).val
                    );
                    if (this.xAxis.valueType === 'DateTime') {
                        point.xValue = Date.parse(point.x.toString());
                    } else {
                        this.pushCategoryData(point, i, Date.parse(dateParser(dateFormatter(point.x))).toString());
                    }
                    this.pushData(point, i);
                    this.setEmptyPoint(point, i);
                } else {
                    point.visible = false;
                }
                i++;
            }
        } else {
            while (i < len) {
                point = this.dataPoint(i, textMappingName, xName);
                point.xValue = <number>point.x;
                this.pushData(point, i);
                this.setEmptyPoint(point, i);
                i++;
            }
        }
    }

    /**
     * Pushes data into a collection at a specified index.
     *
     * @param {Chart3DPoint} point - The Chart3DPoint object representing the data to be pushed.
     * @param {number} i - The index at which the data should be pushed.
     * @returns {void}
     */
    private pushData(point: Chart3DPoint, i: number): void {
        point.index = i;
        point.yValue = <number>point.y;
        point.series = this;
        // To find the min, max for the axis range.
        this.xMin = Math.min(this.xMin, point.xValue);
        this.xMax = Math.max(this.xMax, point.xValue);
        this.xData.push(point.xValue);
    }

    /**
     * Creates and returns a Chart3DPoint object representing a data point at the specified index.
     *
     * @param {number} i - The index of the data point.
     * @param {string} textMappingName - The name of the property containing text information for the data point.
     * @param {string} xName - The name of the property containing X-axis information for the data point.
     * @returns {Chart3DPoint} - The Chart3DPoint object representing the data point.
     */
    protected dataPoint(i: number, textMappingName: string, xName: string): Chart3DPoint {
        this.points[i as number] = new Chart3DPoint();
        const point: Chart3DPoint = <Chart3DPoint>this.points[i as number];
        const currentViewData: Object = this.currentViewData[i as number];
        const getObjectValueByMappingString: Function = this.get3DObjectValue;
        point.x = getObjectValueByMappingString(xName, currentViewData);
        point.interior = getObjectValueByMappingString(this.pointColorMapping, currentViewData) as string;
        if (this instanceof Chart3DSeries) {
            point.y = getObjectValueByMappingString(this.yName, currentViewData);
            point.size = getObjectValueByMappingString(this.size, currentViewData);
            point.text = getObjectValueByMappingString(textMappingName, currentViewData) as string;
            point.tooltip = getObjectValueByMappingString(this.tooltipMappingName, currentViewData) as string;

        }
        return point;
    }

    /**
     * Retrieves the value associated with a specified mapping name from a given data object.
     *
     * @param {string} mappingName - The mapping name used to retrieve the value from the data object.
     * @param {Object} data - The data object from which the value is retrieved.
     * @returns {Object} - The value associated with the specified mapping name in the data object.
     */
    private get3DObjectValue(mappingName: string, data: Object): Object {
        return data[mappingName as string];
    }

    /**
     * Sets values for an empty data point at the specified index.
     *
     * @param {Chart3DPoint} point - The Chart3DPoint object representing the empty data point.
     * @param {number} i - The index of the empty data point.
     * @returns {void}
     */
    public setEmptyPoint(point: Chart3DPoint, i: number): void {
        if (!this.findVisibility(point)) {
            point.visible = true;
            return null;
        }
        point.isEmpty = true;
        const series: Chart3DSeries = this instanceof Chart3DSeries && this;
        const mode: EmptyPointMode = series.emptyPointSettings.mode;
        switch (mode) {
        case 'Zero':
            point.visible = true;
            point.y = point.yValue = this.yData[i as number] = 0;
            break;
        case 'Average':
            if (this instanceof Chart3DSeries) {
                point.y = point.yValue = this.yData[i as number] = this.getAverage(this.yName, i);
            }
            point.visible = true;
            break;
        case 'Drop':
        case 'Gap':
            this.yData[i as number] = null;
            point.visible = false;
            break;
        }
    }

    /**
     * Determines the visibility status of a Chart3DPoint.
     *
     * @param {Chart3DPoint} point - The Chart3DPoint object for which visibility is determined.
     * @returns {boolean} - A boolean indicating the visibility status of the Chart3DPoint.
     */
    private findVisibility(point: Chart3DPoint): boolean {
        this.setXYMinMax(point.yValue);
        this.yData.push(point.yValue);
        return isNullOrUndefined(point.x) || (isNullOrUndefined(point.y) || isNaN(+point.y));
    }

    /**
     * Sets the minimum and maximum values for the X and Y dimensions based on the provided Y value.
     *
     * @param {number} yValue - The Y value used to set the minimum and maximum values for the X and Y dimensions.
     * @returns {void}
     */
    private setXYMinMax(yValue: number): void {
        const isLogAxis: boolean = (this.yAxis.valueType === 'Logarithmic' || this.xAxis.valueType === 'Logarithmic');
        const isNegativeValue: boolean = yValue < 0 || this.yAxis.rangePadding === 'None';
        let seriesMinY: number;
        if (!setRange(this.yAxis)) {
            seriesMinY = ((isLogAxis ? (yValue) : isNegativeValue ? yValue : 0));
        } else {
            seriesMinY = yValue;
        }
        this.yMin = isLogAxis ?
            Math.min(this.yMin, (isNullOrUndefined(seriesMinY) || isNaN(seriesMinY) || (seriesMinY === 0) ||
                (seriesMinY.toString() === '0') || (seriesMinY.toString() === '')) ? this.yMin : seriesMinY) :
            Math.min(this.yMin, (isNullOrUndefined(seriesMinY) || isNaN(seriesMinY)) ? this.yMin : seriesMinY);
        this.yMax = Math.max(this.yMax, (isNullOrUndefined(yValue) || isNaN(yValue)) ? this.yMax : yValue);
    }

    /**
     * Pushes category data to the Chart3DPoint object at the specified index.
     *
     * @param {Chart3DPoint} point - The Chart3DPoint object to which category data is pushed.
     * @param {number} index - The index at which the category data is pushed.
     * @param {string} pointX - The X value of the category data to be pushed.
     * @returns {void}
     */
    protected pushCategoryData(point: Chart3DPoint, index: number, pointX: string): void {
        if (this.chart.tooltip) {
            if (!this.visible) {
                return null;
            }
        }
        if (!this.xAxis.isIndexed) {
            if (this.xAxis.indexLabels[pointX as string] === undefined) {
                this.xAxis.indexLabels[pointX as string] = this.xAxis.labels.length;
                this.xAxis.labels.push(pointX as string);
            }
            point.xValue = this.xAxis.indexLabels[pointX as string];
        } else {
            if (this.xAxis.labels[index as number]) {
                this.xAxis.labels[index as number] += ', ' + pointX;
            }
            else {
                this.xAxis.labels.push(pointX);
            }
            // this.xAxis.labels[index as number] ? this.xAxis.labels[index as number] += ', ' + pointX :
            //     this.xAxis.labels.push(pointX);
            point.xValue = index;
        }
    }

    /**
     * Calculates the average value of a specified member in the data object.
     *
     * @param {string} member - The member for which the average is calculated.
     * @param {number} i - The index used for the calculation.
     * @param {Object} data - The data object from which the average is calculated. Defaults to the current view data.
     * @returns {number} - The calculated average value.
     */
    private getAverage(member: string, i: number, data: Object = this.currentViewData): number {
        const previous: number = data[i - 1] ? (data[i - 1][member as string] || 0) : 0;
        const next: number = data[i + 1] ? (data[i + 1][member as string] || 0) : 0;
        return (previous + next) / 2;
    }

    /**
     * Refreshes the data manager for the 3D chart.
     *
     * @param {Chart3D} chart - The 3D chart for which the data manager is refreshed.
     * @returns {void}
     */
    public refreshDataManager(chart: Chart3D): void {
        this.chart = chart;
        let dataSource: Object | DataManager;
        const isAngular: string = 'isAngular';
        if (chart[isAngular as string]) {
            dataSource = Object.keys(this.dataSource).length ? this.dataSource : chart.dataSource;
        } else {
            dataSource = this.dataSource || chart.dataSource;
        }
        if (!(dataSource instanceof DataManager) && isNullOrUndefined(this.query)) {
            this.dataManagerSuccess({ result: dataSource, count: (dataSource as Object[]).length }, false);
            return;
        }

        const dataManager: Promise<Object> = this.dataModule.getData(this.dataModule.generateQuery().requiresCount());
        dataManager.then((e: { result: Object, count: number }) => this.dataManagerSuccess(e));

    }

    /**
     * Handles the success callback for the data manager operation.
     *
     * @param {Object} e - The success callback parameters containing the result and count.
     * @param {Object} e.result - The result object returned by the data manager operation.
     * @param {number} e.count - The count of items returned by the data manager operation.
     * @param {boolean} [isRemoteData=true] - Indicates whether the data is fetched remotely. Defaults to true.
     * @returns {void}
     */
    private dataManagerSuccess(e: { result: Object, count: number }, isRemoteData: boolean = true): void {
        this.currentViewData = e.count ? e.result : [];
        this.chart.allowServerDataBinding = false;
        if (this instanceof Chart3DSeries) {
            const argsData: Chart3DSeriesRenderEventArgs = {
                series: this, data: this.currentViewData, fill: this.interior
            };
            this.chart.trigger(seriesRender, argsData);
            this.interior = argsData.fill;
            this.currentViewData = argsData.data;
        }
        this.processJsonData();
        this.refreshChart(isRemoteData);
        this.currentViewData = null;
    }

    /**
     * Refreshes the chart, updating its data and appearance.
     *
     * @param {boolean} isRemoteData - Indicates whether the data is fetched remotely.
     * @returns {void}
     */
    private refreshChart(isRemoteData: boolean): void {
        const chart: Chart3D = this.chart;
        if (this instanceof Chart3DSeries) {
            chart.visibleSeriesCount += isRemoteData ? 1 : 0;
        }
        if (chart.visibleSeries.length === (chart.visibleSeriesCount)) {
            chart.refreshBound();
            chart.trigger('loaded', { chart: chart });
        }
        if (this instanceof Chart3DSeries) {
            chart.visibleSeriesCount += isRemoteData ? 0 : 1;
        }
    }

    /**
     * Refreshes the axis labels in the chart.
     * This method is responsible for updating and rendering the axis labels based on the chart's current state.
     *
     * @returns {void}
     * @public
     */
    public refreshAxisLabel(): void {
        if (this.xAxis.valueType !== 'Category') {
            return null;
        }
        this.xAxis.labels = [];
        this.xAxis.indexLabels = {};
        for (const item of this.xAxis.series) {
            if (item.visible) {
                item.xMin = Infinity; item.xMax = -Infinity;
                for (const point of item.points) {
                    (item as Chart3DSeries).pushCategoryData(point, point.index, <string>point.x);
                    item.xMin = Math.min(item.xMin, point.xValue);
                    item.xMax = Math.max(item.xMax, point.xValue);
                }
            }
        }
    }

    /**
     * Finds the collection of Chart3DSeries associated with the given Chart3DColumn and Chart3DRow in the 3D chart.
     *
     * @param {Chart3DColumn} column - The Chart3DColumn object representing the column in the 3D chart.
     * @param {Chart3DRow} row - The Chart3DRow object representing the row in the 3D chart.
     * @param {boolean} isStack - Indicates whether the series should be stacked.
     * @returns {Chart3DSeries[]} - An array of Chart3DSeries associated with the specified column and row.
     * @public
     */
    public findSeriesCollection(column: Chart3DColumn, row: Chart3DRow, isStack: boolean): Chart3DSeries[] {
        const seriesCollection: Chart3DSeries[] = [];
        for (const rowAxis of row.axes) {
            for (const rowSeries of rowAxis.series) {
                for (const axis of column.axes) {
                    for (const series of axis.series) {
                        if (series === rowSeries && series.visible && this.rectSeriesInChart(series, isStack)) {
                            seriesCollection.push(series);
                        }
                    }
                }
            }
        }
        return seriesCollection;
    }

    /**
     * Checks whether the given Chart3DSeries with rectangular data is present in the 3D chart.
     *
     * @param {Chart3DSeries} series - The Chart3DSeries object to check for presence in the chart.
     * @param {boolean} isStack - Indicates whether the series should be stacked.
     * @returns {boolean} - A boolean value indicating whether the series is present in the 3D chart.
     * @private
     */
    private rectSeriesInChart(series: Chart3DSeries, isStack: boolean): boolean {
        const type: string = (series.type).toLowerCase();
        return type.indexOf('column') !== -1 || type.indexOf('bar') !== -1 || isStack;
    }

    /**
     * Calculates the stacked values for the Chart3DSeries based on stacking type and chart context.
     *
     * @param {boolean} isStacking100 - Indicates whether the stacking type is 100% stacking.
     * @param {Chart3D} chart - The parent Chart3D object providing context for the calculation.
     * @returns {void}
     * @private
     */
    public calculateStackedValue(isStacking100: boolean, chart: Chart3D): void {
        for (const columnItem of chart.columns) {
            for (const item of chart.rows) {
                this.calculateStackingValues(this.findSeriesCollection(<Chart3DColumn>columnItem, <Chart3DRow>item, true), isStacking100);
            }
        }
    }

    /**
     * Calculates stacking values for the given Chart3DSeries collection based on the stacking type.
     *
     * @param {Chart3DSeries[]} seriesCollection - The collection of Chart3DSeries to calculate stacking values for.
     * @param {boolean} isStacking100 - Indicates whether the stacking type is 100% stacking.
     * @returns {void}
     * @private
     */
    private calculateStackingValues(seriesCollection: Chart3DSeries[], isStacking100: boolean): void {
        let startValues: number[];
        let endValues: number[];
        let yValues: number[] = [];
        const lastPositive: number[] = [];
        const lastNegative: number[] = [];
        let stackingGroup: string;
        let lastValue: number;
        let value: number;
        let frequencies: number[] = [];
        if (isStacking100) {
            frequencies = <number[]>this.findFrequencies(seriesCollection);
        }
        const groupingValues: string[] = [];
        let visiblePoints: any = [];
        for (let i: number = 0; i < seriesCollection.length; i++) {
            const series: Chart3DSeries = seriesCollection[i as number];
            if (!groupingValues[series.stackingGroup]) {
                groupingValues[series.stackingGroup] = [];
                groupingValues[series.stackingGroup].push(series);
            }
            else if (groupingValues[series.stackingGroup] !== undefined) {
                groupingValues[series.stackingGroup].push(series);
            }
        }
        const keys: string[] = Object.keys(groupingValues);
        for (let k: number = 0; k < keys.length; k++) {
            const stackingSeies: Chart3DSeries[] = [];
            const stackedValues: number[] = [];
            const seriesCollection: Chart3DSeries[] = groupingValues[keys[k as number]];
            for (const series of seriesCollection) {
                if (series.type.indexOf('Stacking') !== -1) {
                    stackingGroup = series.stackingGroup;
                    if (!lastPositive[stackingGroup as string]) {
                        lastPositive[stackingGroup as string] = [];
                        lastNegative[stackingGroup as string] = [];
                    }
                    yValues = series.yData;
                    startValues = [];
                    endValues = [];
                    stackingSeies.push(series);
                    visiblePoints = getVisiblePoints(series);
                    for (let j: number = 0, pointsLength: number = visiblePoints.length; j < pointsLength; j++) {
                        lastValue = 0;
                        value = +yValues[j as number]; // Fix for chart not rendering while y value is given as string issue
                        if (lastPositive[stackingGroup as string][visiblePoints[j as number].xValue] === undefined) {
                            lastPositive[stackingGroup as string][visiblePoints[j as number].xValue] = 0;
                        }
                        if (lastNegative[stackingGroup as string][visiblePoints[j as number].xValue] === undefined) {
                            lastNegative[stackingGroup as string][visiblePoints[j as number].xValue] = 0;
                        }
                        if (isStacking100) {
                            value = value / frequencies[stackingGroup as string][visiblePoints[j as number].xValue] * 100;
                            value = !isNaN(value) ? value : 0;
                            visiblePoints[j as number].percentage = +(value.toFixed(2));
                        } else {
                            stackedValues[j as number] = stackedValues[j as number] ?
                                stackedValues[j as number] + Math.abs(value) : Math.abs(value);
                        }
                        if (value >= 0) {
                            lastValue = lastPositive[stackingGroup as string][visiblePoints[j as number].xValue];
                            lastPositive[stackingGroup as string][visiblePoints[j as number].xValue] += value;
                        } else {
                            lastValue = lastNegative[stackingGroup as string][visiblePoints[j as number].xValue];
                            lastNegative[stackingGroup as string][visiblePoints[j as number].xValue] += value;
                        }
                        startValues.push(lastValue);
                        endValues.push(value + lastValue);
                        if (isStacking100 && (endValues[j as number] > 100)) {
                            endValues[j as number] = 100;
                        }
                    }
                    series.stackedValues = new StackValues(startValues, endValues);
                    const isLogAxis: boolean = series.yAxis.valueType === 'Logarithmic';
                    const isColumnBarType: boolean = (series.type.indexOf('Column') !== -1 || series.type.indexOf('Bar') !== -1);
                    series.yMin = isLogAxis && isColumnBarType && series.yMin < 1 ? series.yMin :
                        (series.yAxis.startFromZero && series.type.indexOf('100') > -1 && series.yAxis.rangePadding === 'Auto' && series.yMin >= 0) ? 0 : parseFloat((Math.min.apply(0, isStacking100 ? startValues : endValues)).toFixed(10));
                    series.yMax = Math.max.apply(0, endValues);
                    if (series.yMin > Math.min.apply(0, endValues)) {
                        series.yMin = (isStacking100) ? -100 :
                            isLogAxis && isColumnBarType && series.yMin < 1 ? series.yMin : Math.min.apply(0, endValues);
                    }
                    if (series.yMax < Math.max.apply(0, startValues)) {
                        series.yMax = 0;
                    }
                }
            }
            this.findPercentageOfStacking(stackingSeies, stackedValues, isStacking100);
        }
    }

    /**
     * Finds the percentage of stacking for the given Chart3DSeries collection and values.
     *
     * @param {Chart3DSeries[]} stackingSeries - The collection of Chart3DSeries to find the percentage of stacking for.
     * @param {number[]} values - The values to calculate the percentage of stacking.
     * @param {boolean} isStacking100 - Indicates whether the stacking type is 100% stacking.
     * @returns {void}
     */
    private findPercentageOfStacking(stackingSeries: Chart3DSeries[], values: number[], isStacking100: boolean): void {
        for (const item of stackingSeries) {
            if (isStacking100) {
                return null;
            }
            for (const point of getVisiblePoints(item)) {
                point.percentage = Math.abs(+(<number>point.y / values[point.index] * 100).toFixed(2));
            }
        }
    }

    /**
     * Finds the frequencies for the given Chart3DSeries collection.
     *
     * @param {Chart3DSeries[]} seriesCollection - The collection of Chart3DSeries to find frequencies for.
     * @returns {number[]} An array of frequencies for each series in the collection.
     * @private
     */
    private findFrequencies(seriesCollection: Chart3DSeries[]): number[] {
        const frequencies: number[] = [];
        let stackingGroup: string;
        let visiblePoints: Chart3DPoint[] = [];
        for (const series of seriesCollection) {
            series.yAxis.isStack100 = series.type.indexOf('100') !== -1 ? true : false;
            visiblePoints = this.getVisiblePoints();
            if (series.type.indexOf('Stacking') !== -1) {
                stackingGroup =  series.stackingGroup;
                if (!frequencies[stackingGroup as string]) {
                    frequencies[stackingGroup as string] = [];
                }
                for (let j: number = 0, pointsLength: number = visiblePoints.length; j < pointsLength; j++) {
                    if (frequencies[stackingGroup as string][visiblePoints[j as number].xValue] === undefined) {
                        frequencies[stackingGroup as string][visiblePoints[j as number].xValue] = 0;
                    }
                    if (series.yData[j as number] > 0) {
                        frequencies[stackingGroup as string][visiblePoints[j as number].xValue] += series.yData[j as number];
                    } else {
                        frequencies[stackingGroup as string][visiblePoints[j as number].xValue] -= series.yData[j as number];
                    }
                }
            }
        }
        return frequencies;
    }

    /**
     * Renders the Chart3DSeries on the given 3D chart.
     *
     * @param {Chart3D} chart - The 3D chart on which to render the series.
     * @returns {void}
     * @private
     */
    public renderSeries(chart: Chart3D): void {
        let seriesType: string = firstToLowerCase(this.type);
        seriesType = seriesType.replace('100', '');
        if (chart[seriesType + 'Series3DModule']) {
            this.visiblePoints = this.getVisiblePoints();
            chart[seriesType + 'Series3DModule'].draw(this, chart);
            if (this.dataLabel.visible && this.visible) {
                chart.dataLabel3DModule.render(this, this.chart, this.dataLabel);
            }
        }
    }

    /**
     * Retrieves the visible data points for the Chart3DSeries.
     * The visibility of points may be influenced by factors such as data filtering or chart settings.
     *
     * @returns {Chart3DPoint[]} An array of Chart3DPoint objects representing the visible data points.
     * @private
     */
    private getVisiblePoints(): Chart3DPoint[] {
        const points: Chart3DPoint[] = extend([], this.points, null, true) as Chart3DPoint[];
        const tempPoints: Chart3DPoint[] = [];
        let tempPoint: Chart3DPoint;
        let pointIndex: number = 0;
        for (let i: number = 0; i < points.length; i++) {
            tempPoint = points[i as number];
            if (isNullOrUndefined(tempPoint.x)) {
                continue;
            } else {
                tempPoint.index = pointIndex++;
                tempPoints.push(tempPoint);
            }
        }
        return tempPoints;
    }

    /**
     * Sets the color for a specific Chart3DPoint in the series.
     * This method allows you to customize the color of an individual data point.
     *
     * @param {Chart3DPoint} point - The Chart3DPoint for which to set the color.
     * @param {string} color - The color value to be applied to the data point.
     * @returns {string} The updated color value after applying any modifications or validations.
     * @private
     */
    public setPointColor(point: Chart3DPoint, color: string): string {
        color = point.interior || color;
        return point.isEmpty ? (this.emptyPointSettings.fill || color) : color;
    }

    /**
     * Gets the Y values from an array of Chart3DPoint objects.
     *
     * @param {Chart3DPoint[]} points - An array of Chart3DPoint objects.
     * @returns {number[]} An array containing the Y values extracted from the provided data points.
     * @private
     */
    public getYValues(points: Chart3DPoint[]): number[] {
        const values: number[] = [];
        const length: number = points.length;
        for (let i: number = 0; i < length; i++) {
            values.push(points[i as number].yValue);
        }
        return values;
    }

    /**
     * Gets the X values from an array of Chart3DPoint objects.
     * This method extracts the X values from a collection of data points.
     *
     * @param {Chart3DPoint[]} points - An array of Chart3DPoint objects.
     * @returns {number[]} An array containing the X values extracted from the provided data points.
     * @private
     */
    public getXValues(points: Chart3DPoint[]): number[] {
        const values: number[] = [];
        const length: number = points.length;
        for (let i: number = 0; i < length; i++) {
            values.push(points[i as number].xValue);
        }
        return values;
    }

    /**
     * Gets the segment depth information for a Chart3DSeries.
     * This method retrieves the depth information for the segments of a Chart3DSeries.
     *
     * @param {Chart3DSeries} series - The Chart3DSeries for which segment depth is obtained.
     * @returns {Chart3DDepthInfoType} The depth information for the segments of the specified series.
     * @private
     */
    public getSegmentDepth (series: Chart3DSeries): Chart3DDepthInfoType {
        const actualDepth: number = this.chart.depth;
        let start: number;
        let end: number;

        if (this.chart.enableSideBySidePlacement) {
            const space: number = actualDepth / 4;
            start = space;
            end = space * (series.columnFacet === 'Rectangle' ? 2.5 : 3);
        } else {
            const index: number = series.position - 1;
            const count: number = series.rectCount;
            const space: number = actualDepth / ((count * 2) + count + 1);
            start = space + (space * index * 3);
            end = start + space * (series.columnFacet === 'Rectangle' ? 1.5 : 2);
        }
        return { start: start, end: end, delta: end - start };
    }

    /**
     * Calculates the side-by-side positions for segments in a Chart3DSeries.
     * This method determines the positions of segments when they are arranged side-by-side.
     *
     * @param {Chart3DSeries} series - The Chart3DSeries for which side-by-side positions are calculated.
     * @returns {void}
     * @private
     */
    private getSideBySidePositions(series: Chart3DSeries): void {
        const chart: Chart3D = series.chart;
        for (const columnItem of chart.columns) {
            for (const item of chart.rows) {
                this.findRectPosition(series.findSeriesCollection(<Chart3DColumn>columnItem, <Chart3DRow>item, false));
            }
        }
    }

    /**
     * Finds the position of rectangles for a collection of Chart3DSeries.
     * This method determines the position of rectangles based on the given series collection.
     *
     * @param {Chart3DSeries[]} seriesCollection - The collection of Chart3DSeries for which rectangle positions are determined.
     * @returns {void}
     * @private
     */
    private findRectPosition(seriesCollection: Chart3DSeries[]): void {
        const groupingValues: string[] = [];
        const vSeries: Chart3DRectPosition = { rectCount: 0, position: null };
        for (let i: number = 0; i < seriesCollection.length; i++) {
            const value: Chart3DSeries = seriesCollection[i as number];
            if (value.type.indexOf('Stacking') !== -1 || value.groupName !== '') {
                const groupName: string = value.type.indexOf('Stacking') !== -1 ? value.stackingGroup : value.type + value.groupName;
                if (groupName) {
                    if (groupingValues[groupName as string] === undefined) {
                        value.position = vSeries.rectCount;
                        groupingValues[groupName as string] = vSeries.rectCount++;
                    } else {
                        value.position = groupingValues[groupName as string];
                    }
                } else {
                    if (vSeries.position === null) {
                        vSeries.rectCount++;
                        value.position = vSeries.rectCount;
                        vSeries.position = vSeries.rectCount;
                    } else {
                        value.position = vSeries.position;
                    }
                }
            } else {
                vSeries.rectCount++;
                value.position = vSeries.rectCount;
            }
        }
        for (let i: number = 0; i < seriesCollection.length; i++) {
            const value: Chart3DSeries = seriesCollection[i as number];
            value.rectCount = vSeries.rectCount;
        }
    }

    /**
     * Gets a range of values between the specified start and end points.
     * This method returns a Chart3DRangeValues object representing the range of values between the given start and end points.
     *
     * @param {number} start - The starting point of the range.
     * @param {number} end - The ending point of the range.
     * @returns {Chart3DRangeValues} - An object representing the range of values between the start and end points.
     */
    public getDoubleRange(start: number, end: number): Chart3DRangeValues {
        let mstart: number;
        let mend: number;
        if (start > end) {
            mstart = end;
            mend = start;
        }
        else {
            mstart = start;
            mend = end;
        }
        const mdelta: number = mend - mstart;
        const mmedian: number = (mstart + mend) / 2;
        const misEmpty: boolean = isNaN(mstart) || isNaN(mend);
        return { start: mstart, end: mend, delta: mdelta, median: mmedian, isEmpty: misEmpty };
    }

    /**
     * Sets the style options for the specified Chart3DSeries.
     * This method applies the style options to customize the appearance of the specified series.
     *
     * @param {Chart3DSeries} series - The Chart3DSeries for which the style options should be set.
     * @returns {Chart3DStyleOptions} - An object representing the style options applied to the series.
     */
    public setStyle(series: Chart3DSeries): Chart3DStyleOptions {
        const options: Chart3DStyleOptions = {
            interior: series.interior,
            opacity: series.opacity,
            dashArray: ''
        };
        return options;
    }

    /**
     * Gets the side-by-side positioning information for the specified Chart3DSeries.
     * This method calculates and returns the range values that define the position of the series in a side-by-side arrangement.
     *
     * @param {Chart3DSeries} series - The Chart3DSeries for which side-by-side positioning information is needed.
     * @returns {Chart3DRangeValues} - An object representing the range values that define the position of the series in a side-by-side arrangement.
     */
    public getSideBySideInfo(series: Chart3DSeries): Chart3DRangeValues  {
        this.chart.currentSeries = series;
        const minimumPointDelta: number = getMinPointsDeltaValue(series.xAxis, this.chart.visibleSeries);
        const spacing: number = series.columnSpacing;
        const columnWidth: number = (series.columnWidth === null || isNaN(+series.columnWidth)) ? 0.7 : Math.min(series.columnWidth, 1);
        this.getSideBySidePositions(series);
        const pos: number = series.position;
        const all: number = series.rectCount;
        const width: number = minimumPointDelta * columnWidth;
        const loc: number = (pos - (series.stackingGroup === '' ? 1 : 0)) / all - 0.5;
        let range: Chart3DRangeValues = this.getDoubleRange(loc, loc + (1 / all));
        if (!this.chart.enableSideBySidePlacement) {
            return this.getDoubleRange(-width / 2, width / 2);
        }
        if (!range.isEmpty) {
            range = this.getDoubleRange(range.start * width, range.end * width);
            const radius: number = spacing * range.delta;
            range = this.getDoubleRange(range.start + radius / 2, range.end - radius / 2);
        }
        return range;
    }
}
