/**
 * Circular 3D chart series.
 */
import { Browser, ChildProperty, Complex, Property, getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { AnimationModel } from '../../common/model/base-model';
import { Animation } from '../../common/model/base';
import { ChartLocation, appendChildElement, stringToNumber } from '../../common/utils/helper';
import { Rect, Size } from '@syncfusion/ej2-svg-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { EmptyPointMode, LegendShape } from '../../common/utils/enum';
import { Data } from '../../common/model/data';
import { CircularChart3D } from '../circularchart3d';
import { pointRender, seriesRender } from '../../common/model/constants';
import { getCircular3DSeriesColor } from '../model/theme';
import { CircularChart3DPointRenderEventArgs, CircularChart3DSeriesRenderEventArgs, CircularChart3DTextRenderEventArgs } from '../model/pie-interface';
import { CircularChart3DDataLabelSettings } from './dataLabel';
import { CircularChart3DDataLabelSettingsModel } from './dataLabel-model';
import { CircularChart3DEmptyPointSettingsModel } from './series-model';
import { CircularChart3DLegendSettingsModel } from '../legend/legend-model';
import { CircularChart3DPolygon, CircularChart3DSegments, CircularChart3DSeriesStyle, CircularChart3DSymbolLocation, CircularChart3DTitlePosition, CircularChart3DVector } from '../model/circular3d-base';

/**
 * Model representing data points for the circular 3D series.
 *
 * @public
 */
export class CircularChart3DPoints {
    /** Circular 3D point x value. */
    public x: Object;
    /** Circular 3D point y value. */
    public y: number;
    /**Circular 3D point visibility. */
    public visible: boolean = true;
    /** Circular 3D point text. */
    public text: string;
    /** Circular 3D point tooltip. */
    public tooltip: string;
    /** accumulation point slice radius. */
    public sliceRadius: string;
    /** Circular 3D point slice radius. */
    public radius: number;
    /** Circular 3D point original text.
     *  @private  
     */
    public originalText: string;
    /** Circular 3D point color. */
    public color: string;
    /** Circular 3D point percentage value. */
    public percentage: number;
    /** Circular 3D point index. */
    public index: number;
    /** @private */
    public isExplode: boolean = false;
    /** @private */
    public start: number;
    /** @private */
    public separatorY: string;
    /** @private  */
    public textSize: Size;
    /** @private */
    public legendImageUrl: string;
    /** @private */
    public symbolLocation: CircularChart3DSymbolLocation;
    /** @private */
    public startDepth: number;
    /** @private  */
    public argsData: CircularChart3DTextRenderEventArgs = null;
}

/**
 * Configures settings for empty points in the circular 3D series.
 */
export class CircularChart3DEmptyPointSettings extends ChildProperty<CircularChart3DEmptyPointSettings> {

    /**
     * Customize the fill color of empty points.
     *
     * @default null
     */
    @Property(null)
    public fill: string;

    /**
     * Customize the mode of empty points.
     *
     * @default Gap
     */
    @Property('Gap')
    public mode: EmptyPointMode;
}

/**
 *  Configures the series in a circular 3D chart.
 */
export class CircularChart3DSeries extends ChildProperty<CircularChart3DSeries> {

    /**
     * Specifies the dataSource for the series. It can be an array of JSON objects or an instance of DataManager.
     * ```html
     * <div id='Pie'></div>
     * ```
     * ```typescript
     * let dataManager: DataManager = new DataManager({
     *         url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Tasks/'
     * });
     * let query: Query = new Query().take(50).where('Estimate', 'greaterThan', 0, false);
     * let pie: CircularChart3D = new CircularChart3D({
     * ...
     *     series: [{
     *        dataSource: dataManager,
     *        xName: 'Id',
     *        yName: 'Estimate',
     *        query: query
     *    }],
     * ...
     * });
     * pie.appendTo('#Pie');
     * ```
     *
     * @default ''
     */
    @Property('')
    public dataSource: Object | DataManager;

    /**
     * Specifies the query to select data from the dataSource. This property is applicable only when the dataSource is `ej.DataManager`.
     *
     * @default null
     */
    @Property()
    public query: Query;

    /**
     * The DataSource field that contains the x value
     *
     * @default ''
     */
    @Property('')
    public xName: string;

    /**
     * The name of the series as displayed in the legend.
     *
     * @default ''
     */
    @Property('')
    public name: string;

    /**
     * The data source field that contains the tooltip value.
     *
     * @default ''
     */
    @Property('')
    public tooltipMappingName: string;

    /**
     * The DataSource field that contains the y value.
     *
     * @default ''
     */
    @Property('')
    public yName: string;

    /**
     * Specifies the visibility of the series.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * Options for customizing the animation of the series.
     */
    @Complex<AnimationModel>(null, Animation)
    public animation: AnimationModel;

    /**
     * The shape of the legend. Each series has its own legend shape. Available shapes:
     * * Circle - Renders a circle.
     * * Rectangle - Renders a rectangle.
     * * Triangle - Renders a triangle.
     * * Diamond - Renders a diamond.
     * * Cross - Renders a cross.
     * * HorizontalLine - Renders a horizontal line.
     * * VerticalLine - Renders a vertical line.
     * * Pentagon - Renders a pentagon.
     * * InvertedTriangle - Renders an inverted triangle.
     * * SeriesType -Render a legend shape based on series type.
     * * Image - Render an image. *
     *
     * @default 'SeriesType'
     */

    @Property('SeriesType')
    public legendShape: LegendShape;

    /**
     * The URL for the image that is to be displayed as a legend icon. It requires `legendShape` value to be an `Image`.
     *
     * @default ''
     */
    @Property('')
    public legendImageUrl: string;

    /**
     * The DataSource field that contains the point colors.
     *
     * @default ''
     */
    @Property('')
    public pointColorMapping: string;

    /**
     * The data label settings for the circular 3D series.
     */
    @Complex<CircularChart3DDataLabelSettingsModel>({}, CircularChart3DDataLabelSettings)
    public dataLabel: CircularChart3DDataLabelSettingsModel;

    /**
     * Palette configuration for the points in the circular 3D series.
     *
     * @default []
     */
    @Property([])
    public palettes: string[];

    /**
     * Specifies the radius of the pie series in percentage. Set to `null` for default.
     *
     * @default null
     */
    @Property(null)
    public radius: string;

    /**
     * When the innerRadius value is greater than 0 percentage, a donut will appear in the pie series. It takes values only in percentage.
     *
     * @default '0'
     */
    @Property('0')
    public innerRadius: string;

    /**
     * Specifies whether the tooltip is enabled or disabled for the circular 3D series.
     *
     * @default true
     */
    @Property(true)
    public enableTooltip: boolean;

    /**
     * If set true, series points will be exploded on mouse click or touch.
     *
     * @default false
     */
    @Property(false)
    public explode: boolean;

    /**
     * Distance of the point from the center, which takes values in both pixels and percentage.
     *
     * @default '30%'
     */
    @Property('30%')
    public explodeOffset: string;

    /**
     * If set true, all the points in the series will get exploded on load.
     *
     * @default false
     */
    @Property(false)
    public explodeAll: boolean;

    /**
     * Index of the point to be exploded on load. Set to `null` for no explosion.
     *
     * @default null
     */
    @Property(null)
    public explodeIndex: number;

    /**
     * Options to customize the appearance of empty points in the circular 3D series.
     */
    @Complex<CircularChart3DEmptyPointSettingsModel>({ mode: 'Drop' }, CircularChart3DEmptyPointSettings)
    public emptyPointSettings: CircularChart3DEmptyPointSettingsModel;

    /**
     * The opacity of the series.
     *
     * @default 1.
     */
    @Property(1)
    public opacity: number;

    /**
     * Calculates the maximum bounds of the data label to facilitate smart legend placement.
     *
     * @private
     */
    public labelBound: Rect;

    /** @private */
    public points: CircularChart3DPoints[] = [];
    /** @private */
    public dataModule: Data;
    /** @private */
    public sumOfPoints: number = 0;
    /** @private */
    public index: number;
    /** @private */
    public resultData: Object;
    /** @private */
    public isRectSeries: boolean = true;
    /** @private */
    public clipRect: Rect = new Rect(0, 0, 0, 0);
    /** @private */
    public category: string = 'Series';
    /** @private */
    public rightSidePoints: CircularChart3DPoints[] = [];
    /** @private */
    public leftSidePoints: CircularChart3DPoints[] = [];
    /** @private */
    public size: number;
    /** @private */
    public isRadiusMapped: boolean;
    /** @private */
    public coefficient: number;
    /** @private */
    public actualWidth: number;
    /** @private */
    public actualHeight: number;
    /** @private */
    public segments: CircularChart3DSegments[] = [];
    /** @private */
    public isExploded: boolean = false;
    /** @private */
    public dataLabelElement: HTMLElement;

    /**
     * Refreshes the DataManager for the circular 3D series.
     *
     * @private
     * @param {CircularChart3D} chart - The instance of the circular 3D chart.
     * @param {boolean} render - A boolean value indicating whether rendering is required.
     * @returns {void}
     */
    public refreshDataManager(chart: CircularChart3D, render: boolean): void {
        const dateSource: Object | DataManager = this.dataSource || chart.dataSource;
        if (!(dateSource instanceof DataManager) && isNullOrUndefined(this.query)) {
            this.dataManagerSuccess({ result: dateSource, count: (dateSource as Object[]).length }, chart, render);
            return;
        }
        const dataManager: Promise<Object> = this.dataModule.getData(this.dataModule.generateQuery().requiresCount());
        dataManager.then((e: { result: Object, count: number }) => this.dataManagerSuccess(e, chart));
    }

    // eslint-disable-next-line jsdoc/require-param
    /**
     * Handles the success event when the DataManager fetches data for the circular 3D series.
     *
     * @private
     * @param { object } dataObject - Specifies the series data object.
     * @param {CircularChart3D} chart - The instance of the circular 3D chart.
     * @param {boolean} render - A boolean value indicating whether rendering is required. Default is true.
     * @returns {void}
     */
    public dataManagerSuccess(dataObject: { result: Object, count: number }, chart: CircularChart3D, render: boolean = true): void {
        const argsData: CircularChart3DSeriesRenderEventArgs = {
            name: seriesRender, series: this, data: dataObject.result
        };
        chart.allowServerDataBinding = false;
        chart.trigger(seriesRender, argsData);
        this.resultData = dataObject.result !== '' ? dataObject.result : [];
        if (!render) {
            this.getPoints(this.resultData, chart);
        }
        if ((++chart.seriesCounts === chart.visibleSeries.length && render)) {
            this.getPoints(this.resultData, chart);
            chart.refreshChart();
        }
    }

    /**
     * Retrieves and processes data points for rendering on a circular 3D chart.
     *
     * @param {Object} result - An object containing the data points for the chart.
     * @param {CircularChart3D}chart - The instance of the circular 3D chart.
     * @returns {void}
     */
    private getPoints(result: Object, chart: CircularChart3D): void {
        const length: number = Object.keys(result).length;
        this.sumOfPoints = 0;
        if (length === 0) {
            this.points = [];
            return null;
        }
        this.findSumOfPoints(result);
        this.points = [];
        let point: CircularChart3DPoints;
        const colors: string[] = this.palettes.length ? this.palettes : getCircular3DSeriesColor(chart.theme);
        for (let i: number = 0; i < length; i++) {
            point = this.setPoints(result, i, chart);
            if (isNullOrUndefined(point.y)) {
                point.visible = false;
            }
            this.pushPoints(point, colors, chart);
        }
    }

    /**
     * Sets point index and color for a circular 3D data point.
     *
     * @param {CircularChart3DPoints} point - The CircularChart3DPoints object representing the data point.
     * @param {string[]} colors - An array specifying the point colors.
     * @param {CircularChart3D} chart - The instance of the circular 3D chart.
     * @returns {void}
     */
    private pushPoints(point: CircularChart3DPoints, colors: string[], chart: CircularChart3D): void {
        point.index = this.points.length;
        point.isExplode = this.explodeAll || (point.index === this.explodeIndex);
        point.color = point.color || colors[point.index % colors.length];
        const argsData: CircularChart3DPointRenderEventArgs = {
            cancel: false, name: pointRender, series: this, point: point,
            fill: point.color
        };
        chart.trigger(pointRender, argsData);
        point.color = argsData.fill;
        point.visible = !argsData.cancel;
        this.points.push(point);
    }

    /**
     * Calculates the sum of points in the circular 3D series.
     *
     * @param {Object} result - The result object containing data points.
     * @returns {void}
     */
    private findSumOfPoints(result: Object): void {
        const length: number = Object.keys(result).length;
        for (let i: number = 0; i < length; i++) {
            if (!isNullOrUndefined(result[i as number]) &&
                !isNullOrUndefined(result[i as number][this.yName]) && !isNaN(result[i as number][this.yName])) {
                this.sumOfPoints += Math.abs(result[i as number][this.yName]);
            }
        }
    }

    /**
     * Sets x, y, and text points from the specified data source.
     *
     * @param {Object} data - The data source containing information for the point.
     * @param {number} index - The index specifying the position in the data array.
     * @param {CircularChart3D} chart - Specifies the circular 3D chart instance.
     * @returns {CircularChart3DPoints} - Returns the CircularChart3DPoints object representing the data point.
     */
    private setPoints(data: Object, index: number, chart: CircularChart3D): CircularChart3DPoints {
        const point: CircularChart3DPoints = new CircularChart3DPoints();
        point.x = getValue(this.xName, data[index as number]);
        point.y = getValue(this.yName, data[index as number]);
        point.percentage = (+(point.y / this.sumOfPoints * 100).toFixed(2));
        point.legendImageUrl = getValue(this.legendImageUrl, data[index as number]);
        point.color = getValue(this.pointColorMapping, data[index as number]);
        point.text = point.originalText = getValue(this.dataLabel.name || '', data[index as number]);
        point.tooltip = getValue(this.tooltipMappingName || '', data[index as number]);
        point.sliceRadius = getValue(this.radius ? this.radius : '80%', data[index as number]);
        point.sliceRadius = isNullOrUndefined(point.sliceRadius) ? '80%' : point.sliceRadius;
        point.separatorY = chart.intl.formatNumber(point.y, { useGrouping: chart.useGroupingSeparator });
        this.setEmptyPoint(point, index, data, chart);
        return point;
    }

    /**
     * Draws the circular 3D series on the chart.
     *
     * @param {CircularChart3DSeries} series - The series to be drawn.
     * @param {CircularChart3D} chart - The circular 3D chart instance.
     * @returns {void}
     * @private
     */
    public draw(series: CircularChart3DSeries, chart: CircularChart3D ): void {
        const marginRatio: number = 0.03;
        const seriesIndex: number = chart.visibleSeries.indexOf(series);
        this.calculateSize(chart, series);
        const seriesRadius: string = series.radius ? series.radius : (Browser.isDevice && series.dataLabel.position === 'Outside') ? '40%' : '80%';
        const radius: number = parseInt(seriesRadius, 10);

        if (!((seriesRadius.indexOf('%') !== -1 || typeof radius === 'number') && !isNaN(radius))) {
            this.isRadiusMapped = true;
        }
        series.size = this.isRadiusMapped ? 0.8 : parseInt(seriesRadius, 10) / 100;
        series.coefficient = parseInt(series.innerRadius, 10) / 100;
        chart.circularRadius[seriesIndex as number] =
            (((1 - marginRatio) * Math.min(series.actualWidth / 2 - ((chart.legendSettings.visible && chart.circularChartLegend3DModule && (chart.legendSettings.position === 'Right' ||
                chart.legendSettings.position === 'Left')) ? chart.circularChartLegend3DModule.legendBounds.width : 0), series.actualHeight / 2)) * series.size);

        chart.innerRadius[seriesIndex as number] =
            series.coefficient * chart.circularRadius[seriesIndex as number];

        this.createPolygons(series, chart);
        if (this.dataLabel.visible) {
            chart.circularChartDataLabel3DModule.renderDataLabel(series, chart);
        }
        appendChildElement(false, chart.svgObject, chart.groupElement, chart.redraw);
        const size: Size = new Size(chart.availableSize.width, chart.availableSize.height);
        chart.graphics.prepareView(0, chart.depth, chart.rotation, chart.tilt, size, chart);
        chart.graphics.view(chart.svgObject, chart);
    }

    /**
     * Calculates the size of the series based on the chart settings.
     *
     * @param {CircularChart3D} chart - The circular 3D chart instance.
     * @param {CircularChart3DSeries} series - The series for which to calculate the size.
     * @returns {{ centerX: number, centerY: number }} - The calculated center coordinates.
     */
    private calculateSize(chart: CircularChart3D, series: CircularChart3DSeries): { centerX: number, centerY: number } {
        const legend: CircularChart3DLegendSettingsModel = chart.legendSettings;
        let legXSpace: number = 0;
        let legYSpace: number = 0;
        const legendPosition: string = chart.circularChartLegend3DModule ? chart.circularChartLegend3DModule.position : 'Auto';
        const title: string = chart.title;
        const subTitle: string = chart.subTitle;
        const titleLocation: CircularChart3DTitlePosition = chart.titleLocation;
        const subTitleLocation: CircularChart3DTitlePosition = chart.subTitleLocation;
        const titleTextOverflow: string = chart.titleStyle.textOverflow;
        const subTitleTextOverflow: string = chart.subTitleStyle.textOverflow;

        const titleEnable: boolean = (title &&
            (titleTextOverflow === 'Wrap')) ? true : false;

        const subTitleEnable: boolean = (subTitle &&
            (subTitleTextOverflow === 'Wrap')) ? true : false;

        if (legend.visible && chart.circularChartLegend3DModule && legendPosition !== 'Custom') {
            if (legendPosition === 'Right' || legendPosition === 'Left') {
                legXSpace = (legendPosition.toLowerCase() === 'right') ?
                    chart.margin.right : chart.margin.left + chart.circularChartLegend3DModule.legendBounds.width;
            } else {
                legYSpace = (legendPosition === 'Top') ? chart.margin.top :
                    ((legendPosition === 'Bottom') ? chart.margin.bottom + chart.circularChartLegend3DModule.legendBounds.height : 0);
            }
        }

        series.actualWidth = chart.availableSize.width - legXSpace;

        const centerx: number = (series.actualWidth * 0.5) + ((legendPosition === 'Left') ? legXSpace : 0);

        if (titleEnable || subTitleEnable) {
            const yOffset: number = titleLocation.size.height + (subTitleEnable ? subTitleLocation.size.height : 0) + legYSpace;
            series.actualHeight = (chart.svgObject as SVGSVGElement).height.baseVal.value - yOffset;
            const centery: number = series.actualHeight * 0.5 + (
                titleLocation.size.height + (subTitleEnable ? subTitleLocation.size.height : 0));
            return { centerX: centerx, centerY: centery };
        } else {
            const yOffset: number = ((title) ? titleLocation.y : 0) + legYSpace;
            series.actualHeight = (chart.svgObject as SVGSVGElement).height.baseVal.value - yOffset;
            const centery: number = series.actualHeight * 0.5 + ((legendPosition === 'Top') ?
                yOffset : ((title) ? (titleLocation.y) : 0));
            return { centerX: centerx, centerY: centery };
        }
    }

    // eslint-disable-next-line valid-jsdoc
    /**
     * Creates polygons for a 3D circular chart series.
     *
     * @param {CircularChart3DSeries} series - The CircularChart3D series for which to create polygons.
     * @param {CircularChart3D} chart - The circular 3D chart instance.
     * @returns {CircularChart3DPolygon[][]} - The array of created polygons.
     */
    private createPolygons(series: CircularChart3DSeries, chart: CircularChart3D): CircularChart3DPolygon[][] {
        let segments: CircularChart3DSegments[] = [];
        const polygons: CircularChart3DPolygon[][] = [];
        let seg: CircularChart3DSegments;
        let style: CircularChart3DSeriesStyle;
        let pointIndex: number;
        let polygonCollection: CircularChart3DPolygon[][] = [];
        if (series.segments.length === 0) {
            segments = this.createPoints(series, chart);
        } else {
            segments = series.segments;
        }
        const segmentsLength: number = segments.length;
        for (let i: number = 0; i < segmentsLength; i++) {
            seg = segments[i as number];
            if (seg.visible) {
                pointIndex = segments[i as number].pointIndex;
                style = {
                    opacity: series.opacity,
                    interior: series.points[pointIndex as number].color
                };
                polygonCollection = this.createSector(seg, chart, style, series.index);

                if (polygonCollection !== null) {
                    for (let k: number = 0; k < polygonCollection.length; k++) {
                        if (!polygons[k as number]) {
                            polygons[k as number] = [];
                        }
                        if (polygonCollection[k as number] !== null) {
                            for (let j: number = 0; j < polygonCollection[k as number].length; j++) {
                                polygons[k as number].push(polygonCollection[k as number][j as number]);
                            }
                        }
                    }
                }
            }
        }
        for (let i: number = 0; i < polygons.length; i++) {
            for (let k: number = 0; k < polygons[i as number].length; k++) {
                const polygone: CircularChart3DPolygon = (polygons[i as number][k as number]);
                chart.circular3DPolygon.push(polygone);
            }
        }
        return null;
    }

    // eslint-disable-next-line valid-jsdoc
    /**
     * Creates sectors for a circular 3D chart based on the specified parameters.
     *
     * @param {CircularChart3DSegments} segment - The CircularChart3DSegments instance defining the segment.
     * @param {CircularChart3D} chart - The circular 3D chart instance.
     * @param {CircularChart3DSeriesStyle} style - The CircularChart3DSeriesStyle defining the style of the sectors.
     * @param {number} seriesIndex - The index of the series to which the sectors belong.
     * @returns {CircularChart3DPolygon[][]} - An array of CircularChart3DPolygon arrays representing the created sectors.
     */
    private createSector(segment: CircularChart3DSegments, chart: CircularChart3D,
                         style: CircularChart3DSeriesStyle, seriesIndex: number): CircularChart3DPolygon[][] {
        const count: number = Math.ceil(segment.actualEndValue / 6);
        const degreesToRadians: number = Math.PI / 180;
        let index: number = 0;
        const depth: number = chart.depth;

        if (count < 1) {
            return null;
        }
        const polygonCollection: CircularChart3DPolygon[][] = [];
        const endValue: number = segment.actualEndValue / count;

        const outputPoints: ChartLocation[] = [];
        const inputPoints: ChartLocation[] = [];

        for (let i: number = 0; i < count + 1; i++) {
            const ox: number = segment.center.x + segment.radius * Math.cos((segment.actualStartValue + i * endValue) * degreesToRadians);
            const oy: number = segment.center.y + segment.radius * Math.sin((segment.actualStartValue + i * endValue) * degreesToRadians);

            outputPoints[i as number] = { x: ox, y: oy };

            const ix: number = segment.center.x +
                segment.inSideRadius * Math.cos((segment.actualStartValue + i * endValue) * degreesToRadians);
            const iy: number = segment.center.y +
                segment.inSideRadius * Math.sin((segment.actualStartValue + i * endValue) * degreesToRadians);

            inputPoints[i as number] = { x: ix, y: iy };
        }

        const originPolygon: CircularChart3DPolygon[] = [];
        let vts: CircularChart3DVector[] = [];

        for (let i: number = 0; i < count; i++) {
            vts = [
                this.vector(outputPoints[i as number].x, outputPoints[i as number].y, 0),
                this.vector(outputPoints[i as number].x, outputPoints[i as number].y, depth),
                this.vector(outputPoints[i + 1].x, outputPoints[i + 1].y, depth),
                this.vector(outputPoints[i + 1].x, outputPoints[i + 1].y, 0)
            ];

            originPolygon[i as number] = chart.polygon.polygon3D(
                vts,
                null,
                segment.index,
                null,
                null,
                style.opacity,
                style.interior,
                index.toString() + '-region' + '-series-' + seriesIndex + '-point-' + segment.index,
                chart.groupElement,
                segment.accessibilityText
            );
            index++;
        }

        polygonCollection[1] = originPolygon;

        if (segment.inSideRadius > 0) {
            const iPlgs: CircularChart3DPolygon[] = [];

            for (let i: number = 0; i < count; i++) {
                vts = [
                    this.vector(inputPoints[i as number].x, inputPoints[i as number].y, 0),
                    this.vector(inputPoints[i as number].x, inputPoints[i as number].y, depth),
                    this.vector(inputPoints[i + 1].x, inputPoints[i + 1].y, depth),
                    this.vector(inputPoints[i + 1].x, inputPoints[i + 1].y, 0)
                ];

                iPlgs[i as number] = chart.polygon.polygon3D(
                    vts,
                    null,
                    segment.index,
                    null,
                    null,
                    style.opacity,
                    style.interior,
                    index.toString() + '-region' + '-series-' + seriesIndex + '-point-' + segment.index,
                    chart.groupElement,
                    segment.accessibilityText
                );
                index++;
            }

            polygonCollection[3] = iPlgs;
        }

        const tVtxs: CircularChart3DVector[] = [];
        const bVtxs: CircularChart3DVector[] = [];

        for (let i: number = 0; i < count + 1; i++) {
            tVtxs.push(this.vector(outputPoints[i as number].x, outputPoints[i as number].y, 0));
            bVtxs.push(this.vector(outputPoints[i as number].x, outputPoints[i as number].y, depth));
        }

        if (segment.inSideRadius > 0) {
            for (let i: number = count; i > -1; i--) {
                tVtxs.push(this.vector(inputPoints[i as number].x, inputPoints[i as number].y, 0));
                bVtxs.push(this.vector(inputPoints[i as number].x, inputPoints[i as number].y, depth));
            }
        } else {
            tVtxs.push(segment.center);
            bVtxs.push(this.vector(segment.center.x, segment.center.y, depth));
        }
        polygonCollection[0] = [];
        polygonCollection[0].push(
            chart.polygon.polygon3D(
                tVtxs,
                null,
                segment.index,
                null,
                null,
                style.opacity,
                style.interior,
                index.toString() + '-region' + '-series-' + seriesIndex + '-point-' + segment.index,
                chart.groupElement,
                segment.accessibilityText
            )
        );
        index++;
        polygonCollection[0].push(
            chart.polygon.polygon3D(
                bVtxs,
                null,
                segment.index,
                null,
                null,
                style.opacity,
                style.interior,
                index.toString() + '-region' + '-series-' + seriesIndex + '-point-' + segment.index,
                chart.groupElement,
                segment.accessibilityText
            )
        );
        index++;

        if (segment.inSideRadius > 0) {
            const rvts: CircularChart3DVector[] = [
                this.vector(outputPoints[0].x, outputPoints[0].y, 0),
                this.vector(outputPoints[0].x, outputPoints[0].y, depth),
                this.vector(inputPoints[0].x, inputPoints[0].y, depth),
                this.vector(inputPoints[0].x, inputPoints[0].y, 0)
            ];

            const lvts: CircularChart3DVector[] = [
                this.vector(outputPoints[count as number].x, outputPoints[count as number].y, 0),
                this.vector(outputPoints[count as number].x, outputPoints[count as number].y, depth),
                this.vector(inputPoints[count as number].x, inputPoints[count as number].y, depth),
                this.vector(inputPoints[count as number].x, inputPoints[count as number].y, 0)
            ];

            polygonCollection[2] = [];

            polygonCollection[2].push(
                chart.polygon.polygon3D(
                    rvts,
                    null,
                    segment.index,
                    null,
                    null,
                    style.opacity,
                    style.interior,
                    index.toString() + '-region' + '-series-' + seriesIndex + '-point-' + segment.index,
                    chart.groupElement,
                    segment.accessibilityText
                )
            );
            index++;
            polygonCollection[2].push(
                chart.polygon.polygon3D(
                    lvts,
                    null,
                    segment.index,
                    null,
                    null,
                    style.opacity,
                    style.interior,
                    index.toString() + '-region' + '-series-' + seriesIndex + '-point-' + segment.index,
                    chart.groupElement,
                    segment.accessibilityText
                )
            );
            index++;
        } else {
            const rvts: CircularChart3DVector[] = [
                this.vector(outputPoints[0].x, outputPoints[0].y, 0),
                this.vector(outputPoints[0].x, outputPoints[0].y, depth),
                this.vector(segment.center.x, segment.center.y, depth),
                this.vector(segment.center.x, segment.center.y, 0)
            ];

            const lvts: CircularChart3DVector[] = [
                this.vector(outputPoints[count as number].x, outputPoints[count as number].y, 0),
                this.vector(outputPoints[count as number].x, outputPoints[count as number].y, depth),
                this.vector(segment.center.x, segment.center.y, depth),
                this.vector(segment.center.x, segment.center.y, 0)
            ];

            polygonCollection[2] = [];
            polygonCollection[2].push(
                chart.polygon.polygon3D(
                    rvts,
                    null,
                    segment.index,
                    null,
                    null,
                    style.opacity,
                    style.interior,
                    index.toString() + '-region' + '-series-' + seriesIndex + '-point-' + segment.index,
                    chart.groupElement,
                    segment.accessibilityText
                )
            );
            index++;
            polygonCollection[2].push(
                chart.polygon.polygon3D(
                    lvts,
                    null,
                    segment.index,
                    null,
                    null,
                    style.opacity,
                    style.interior,
                    index.toString() + '-region' + '-series-' + seriesIndex + '-point-' + segment.index,
                    chart.groupElement,
                    segment.accessibilityText
                )
            );
            index++;
        }

        return polygonCollection;
    }

    /**
     * Creates CircularChart3DSegments based on the provided CircularChart3D series and circular 3D chart.
     *
     * @param {CircularChart3DSeries} series - The circular 3D series for which to generate points.
     * @param {CircularChart3D} chart - The circular 3D chart instance.
     * @returns {CircularChart3DSegments[]} - An array of CircularChart3DSegments created for the series.
     */
    private createPoints(series: CircularChart3DSeries, chart: CircularChart3D): CircularChart3DSegments[] {
        series.segments = [];
        const size: { centerX: number, centerY: number } = this.calculateSize(chart, series);
        let all: number = 0;
        const visiblePoints: CircularChart3DPoints[] = series.points;
        const count: number = visiblePoints.length;
        for (let j: number = 0; j < count; j++) {
            if (visiblePoints[j as number].visible && !isNullOrUndefined(visiblePoints[j as number].y)) {
                all += visiblePoints[j as number].y;
            }
        }
        all = all !== 0 ? all : 1;
        const coefficient: number = 360 / all;
        const seriesIndex: number = series.index;
        const insideRadius: number = chart.innerRadius[seriesIndex as number];
        const yValues: number[] = this.getYValues(series.points);
        const pieHeight: number = chart.depth;
        let center: CircularChart3DVector;
        let arcStartAngle: number = 0;
        let arcEndAngle: number = 0;
        let current: number = 0;
        let pointIndex: number;
        let value: number;
        const rect: Rect = new Rect(0, 0, 0, 0);
        const offset: { X: number, Y: number } = { X: 0, Y: 0 };
        let segment: CircularChart3DSegments;
        let segIndex: number = 0;
        const radius: number = chart.circularRadius[seriesIndex as number];
        for (let i: number = 0; i < count; i++) {
            if (series.points[i as number].visible && !isNullOrUndefined(yValues[i as number])) {
                pointIndex = series.points[i as number].index;
                value = Math.abs(yValues[i as number]);
                arcEndAngle = Math.abs(value) * ((Math.PI * 2) / all);
                rect.x = 0;
                rect.y = 0;
                const point: CircularChart3DPoints = series.points[i as number];
                if (series.isRadiusMapped) {
                    if (series.points[i as number].sliceRadius.indexOf('%') !== -1) {
                        point.radius = stringToNumber(series.points[i as number].sliceRadius, this.size / 2);
                    } else {
                        point.radius = parseInt(series.points[i as number].sliceRadius, 10);
                    }
                } else {
                    point.radius = radius;
                }
                const accessibilityText: string = point.x + ':' + point.y + ', ' + series.name;
                if (!isNullOrUndefined(value)) {
                    if (series.explode && (series.explodeIndex === point.index ||
                        !series.isExploded && series.explodeAll)) {
                        offset.X = Math.cos(2 * Math.PI * (current + value / 2) / all);
                        offset.Y = Math.sin(2 * Math.PI * (current + value / 2) / all);
                        rect.x = 0.01 * point.radius * offset.X * stringToNumber(series.explodeOffset, 100);
                        rect.y = 0.01 * point.radius * offset.Y * stringToNumber(series.explodeOffset, 100);
                    }

                    center = this.vector(rect.x + size.centerX, rect.y + size.centerY, 0);
                    segment = this.createSegment(center, (coefficient * current), (coefficient * value),
                                                 pieHeight, point.radius, i, value, insideRadius, pointIndex, series, accessibilityText);

                    series.segments.push(segment);
                }

                this.addPieDataLabel(
                    segIndex, yValues[i as number], arcStartAngle, arcStartAngle + arcEndAngle,
                    point.radius, this.isChartRotated(chart) ? chart.depth + 5 : 0, center, series.points[i as number]);
                segIndex++;
                arcStartAngle += arcEndAngle;
                current += value;
            }
        }
        return series.segments;
    }

    /**
     * Adds a data label to a circular 3D chart at the specified position and orientation.
     *
     * @param {number} x - The x-coordinate of the data label position.
     * @param {number} y - The y-coordinate of the data label position.
     * @param {number} startAngle - The starting angle of the pie slice in degrees.
     * @param {number} endAngle - The ending angle of the pie slice in degrees.
     * @param {number} radius - The radius of the pie slice.
     * @param {number} startDepth - The depth at which the pie slice starts in the 3D space.
     * @param {CircularChart3DVector} center - The center point of the pie chart in 3D space.
     * @param {CircularChart3DPoints} point - The specific data point associated with the data label.
     * @returns {void}
     */
    private addPieDataLabel(x: number, y: number,
                            startAngle: number, endAngle: number, radius: number,
                            startDepth: number, center: CircularChart3DVector, point: CircularChart3DPoints): void {
        const angle: number = (startAngle + endAngle) / 2;
        point.symbolLocation = { x: 0, y: 0, radius: 0, angle: 0 };
        point.symbolLocation.x = x;
        point.symbolLocation.y = y;
        point.symbolLocation.radius = radius;
        point.symbolLocation.angle = angle;
        point.symbolLocation.center = center;
        point.startDepth = startDepth;
    }

    /**
     * Checks if the circular 3D chart is rotated.
     *
     * @param {CircularChart3D} chart - The circular 3D chart instance.
     * @returns {boolean} - A boolean indicating whether the chart is rotated.
     */
    private isChartRotated(chart: CircularChart3D): boolean {
        const actualTiltView: number = Math.abs(chart.tilt % 360);
        const actualRotateView: number = Math.abs(chart.rotation % 360);
        if ((actualTiltView > 90 && actualTiltView < 270) !== (actualRotateView > 90 && actualRotateView < 270)) {
            return true;
        }
        return false;
    }

    /**
     * Creates a segment based on the provided parameters.
     *
     * @param {CircularChart3DVector} center - The center point of the segment.
     * @param {number} start - The starting angle of the segment in radians.
     * @param {number} end - The ending angle of the segment in radians.
     * @param {number} height - The height of the segment.
     * @param {number} radius - The radial distance from the center to the segment.
     * @param {number} index - The index value of the segment.
     * @param {number} yValue - The y value associated with the segment.
     * @param {number} insideRadius - The inside radius of the segment.
     * @param {number} pointIndex - The index of the point associated with the segment.
     * @param {CircularChart3DSeries} series - The CircularChart3DSeries to which the segment belongs.
     * @param {string} accessibilityText - The accessibility text of the segment.
     * @returns {CircularChart3DSegments} - The created segment.
     */
    private createSegment(center: CircularChart3DVector, start: number, end: number,
                         height: number, radius: number, index: number, yValue: number,
                         insideRadius: number, pointIndex: number, series: CircularChart3DSeries,
                         accessibilityText: string): CircularChart3DSegments {
        return {
            startValue: start,
            endValue: end,
            depth: height,
            radius: radius,
            index: index,
            yData: yValue,
            center: center,
            inSideRadius: insideRadius,
            actualEndValue: end,
            actualStartValue: start,
            pointIndex: pointIndex,
            series: series,
            visible: true,
            accessibilityText: accessibilityText
        };
    }

    /**
     * Creates a new Vector3D instance from provided coordinates.
     *
     * @param {number | { x: number, y: number }} vx - Either an object with x and y properties or the x-coordinate.
     * @param {number} vy - The y-coordinate.
     * @param {number} vz - The z-coordinate.
     * @returns {CircularChart3DVector} - The new Vector3D instance.
     */
    private vector(vx: { x: number; y: number } | number, vy: number, vz: number): CircularChart3DVector {
        return { x: vx as number, y: vy, z: vz };
    }

    /**
     * Gets the `Y` values from an array of circular 3D series points.
     *
     * @param {CircularChart3DPoints[]} points - An array of CircularChart3DPoints.
     * @returns {number[]} - An array containing the Y values extracted from the CircularChart3DPoints.
     */
    private getYValues(points: CircularChart3DPoints[]): number[] {
        const values: number[] = [];
        const length: number = points.length;
        for (let i: number = 0; i < length; i++) {
            values.push(points[i as number].y);
        }
        return values;
    }

    /**
     * Updates the total bounds to encompass the maximum area covered by the specified bound and the current total bounds.
     *
     * @param {Rect} totalBound - The current total bounds to be updated.
     * @param {Rect} bound - The new bound to compare and update the total bounds.
     * @returns {void}
     * @private
     */
    public findMaxBounds(totalBound: Rect, bound: Rect): void {
        totalBound.x = bound.x < totalBound.x ? bound.x : totalBound.x;
        totalBound.y = bound.y < totalBound.y ? bound.y : totalBound.y;
        totalBound.height = (bound.y + bound.height) > totalBound.height ? (bound.y + bound.height) : totalBound.height;
        totalBound.width = (bound.x + bound.width) > totalBound.width ? (bound.x + bound.width) : totalBound.width;
    }

    /**
     * Sets the empty point value for null points in the circular 3D chart series.
     *
     * @param {CircularChart3DPoints} point - The data point to be checked and modified.
     * @param {number} index - The index of the data point.
     * @param {Object} data - The data object containing information about the data point.
     * @param {CircularChart3D} chart - The circular 3D chart instance.
     * @returns {void}
     */
    private setEmptyPoint(point: CircularChart3DPoints, index: number, data: Object, chart: CircularChart3D): void {
        if (!(isNullOrUndefined(point.y) || isNaN(point.y))) {
            return null;
        }
        point.color = this.emptyPointSettings.fill || point.color;
        let previous: number; let next: number;
        switch (this.emptyPointSettings.mode) {
        case 'Zero':
            point.y = 0;
            point.visible = true;
            break;
        case 'Average':
            previous = data[index - 1] ? (data[index - 1][this.yName] || 0) : 0;
            next = data[index + 1] ? (data[index + 1][this.yName] || 0) : 0;
            point.y = (Math.abs(previous) + Math.abs(next)) / 2;
            point.separatorY = chart.intl.formatNumber(point.y, { useGrouping: chart.useGroupingSeparator });
            this.sumOfPoints += point.y;
            point.visible = true;
            break;
        default:
            point.visible = false;
            break;
        }
    }

}

/**
 * The `PieSeries3D` module is used to render circular 3D `Pie` and `Donut` series.
 */
export class PieSeries3D extends CircularChart3DSeries {

    /**
     * To get the module name of the circular 3D chart pie series.
     *
     * @returns {string} - Returns the module name of the Pie series.
     */
    protected getModuleName(): string {
        return 'PieSeries3D';
    }

    /**
     * Destroys the circular 3D chart series.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        /**
         * Calling the destroy method here.
         */
    }
}
