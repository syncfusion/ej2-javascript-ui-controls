/**
 * AccumulationChart base file
 */
import { Property, ChildProperty, Complex, createElement } from '@syncfusion/ej2-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Border, Font, Animation, Index, EmptyPointSettings, Connector } from '../../common/model/base';
import { Rect, ChartLocation, stringToNumber, PathOption, Size, appendChildElement } from '../../common/utils/helper';
import { AccumulationType, AccumulationLabelPosition, PyramidModes } from '../model/enum';
import { IAccSeriesRenderEventArgs, IAccPointRenderEventArgs } from '../model/pie-interface';
import { LegendShape } from '../../chart/utils/enum';
import { AccumulationDataLabelSettingsModel } from '../model/acc-base-model';
import { Data } from '../../common/model/data';
import { seriesRender, pointRender } from '../../common/model/constants';
import { getSeriesColor } from '../../common/model/theme';
import { FontModel, BorderModel, AnimationModel, EmptyPointSettingsModel, ConnectorModel } from '../../common/model/base-model';
import { AccumulationChart } from '../accumulation';
import { getElement, firstToLowerCase } from '../../common/utils/helper';
import { Units, Alignment, Regions, Position, SeriesCategories } from '../../common/utils/enum';
import { GroupModes } from './enum';

/**
 * Annotation for accumulation series
 */
export class AccumulationAnnotationSettings extends ChildProperty<AccumulationAnnotationSettings> {
    /**
     * Content of the annotation, which accepts the id of the custom element.
     * @default null
     */
    @Property(null)
    public content: string;

    /**
     * if set coordinateUnit as `Pixel` X specifies the axis value
     * else is specifies pixel or percentage of coordinate
     * @default 0
     */
    @Property('0')
    public x: string | Date | number;

    /**
     * if set coordinateUnit as `Pixel` Y specifies the axis value
     * else is specifies pixel or percentage of coordinate
     * @default 0
     */
    @Property('0')
    public y: string | number;

    /**
     * Specifies the coordinate units of the annotation. They are
     * * Pixel - Annotation renders based on x and y pixel value.
     * * Point - Annotation renders based on x and y axis value.
     * @default 'Pixel'
     */

    @Property('Pixel')
    public coordinateUnits: Units;

    /**
     * Specifies the regions of the annotation. They are
     * * Chart - Annotation renders based on chart coordinates.
     * * Series - Annotation renders based on series coordinates.
     * @default 'Chart'
     */

    @Property('Chart')
    public region: Regions;

    /**
     * Specifies the position of the annotation. They are
     * * Top - Align the annotation element as top side.
     * * Bottom - Align the annotation element as bottom side.
     * * Middle - Align the annotation element as mid point.
     * @default 'Middle'
     */

    @Property('Middle')
    public verticalAlignment: Position;

    /**
     * Specifies the alignment of the annotation. They are
     * * Near - Align the annotation element as top side.
     * * Far - Align the annotation element as bottom side.
     * * Center - Align the annotation element as mid point.
     * @default 'Center'
     */

    @Property('Center')
    public horizontalAlignment: Alignment;

    /**
     * Information about annotation for assistive technology.
     * @default null
     */
    @Property(null)
    public description: string;

}

/**
 * Configures the dataLabel in accumulation chart.
 */
export class AccumulationDataLabelSettings extends ChildProperty<AccumulationDataLabelSettings> {

    /**
     * If set true, data label for series gets render.
     * @default false
     */

    @Property(false)
    public visible: boolean;

    /**
     * The DataSource field which contains the data label value.
     * @default null
     */

    @Property(null)
    public name: string;

    /**
     * The background color of the data label, which accepts value in hex, rgba as a valid CSS color string.
     * @default 'transparent'
     */

    @Property('transparent')
    public fill: string;

    /**
     * Specifies the position of data label. They are.
     * * Outside - Places label outside the point.
     * * Inside - Places label inside the point.
     * @default 'Inside'
     */

    @Property('Inside')
    public position: AccumulationLabelPosition;

    /**
     * The roundedCornerX for the data label. It requires `border` values not to be null.
     * @default 5
     */
    @Property(5)
    public rx: number;

    /**
     * The roundedCornerY for the data label. It requires `border` values not to be null.
     * @default 5
     */
    @Property(5)
    public ry: number;

    /**
     * Option for customizing the border lines.
     */

    @Complex<BorderModel>({ width: null, color: null }, Border)
    public border: BorderModel;

    /**
     * Option for customizing the data label text.
     */

    @Complex<FontModel>({ size: '11px', color: null }, Font)
    public font: FontModel;

    /**
     * Options for customize the connector line in series.
     * This property is applicable for Pie, Funnel and Pyramid series.
     * The default connector length for Pie series is '4%'. For other series, it is null.
     */
    @Complex<ConnectorModel>({}, Connector)
    public connectorStyle: ConnectorModel;

    /**
     * Custom template to format the data label content. Use ${point.x} and ${point.y} as a placeholder
     * text to display the corresponding data point.
     * @default null
     */

    @Property(null)
    public template: string;

}

/**
 * Points model for the series.
 */

export class AccPoints {

    public x: Object;
    public y: number;
    public visible: boolean = true;
    public text: string;
    public tooltip: string;
    public originalText: string;
    /** @private */
    public label: string;
    public color: string;
    public percentage: number;
    public symbolLocation: ChartLocation = null;
    public index: number;
    /** @private */
    public midAngle: number;
    /** @private */
    public endAngle: number;
    /** @private */
    public labelAngle: number;
    /** @private */
    public region: Rect = null;
    /** @private */
    public labelRegion: Rect = null;
    /** @private */
    public labelVisible: boolean = true;
    /** @private */
    public labelPosition: AccumulationLabelPosition;
    /** @private */
    public yRatio: number;
    /** @private */
    public heightRatio: number;
    /** @private */
    public labelOffset: ChartLocation;
    public regions: Rect[] = null;
    /** @private */
    public isExplode: boolean = false;
    /** @private */
    public isClubbed: boolean = false;
    /** @private */
    public isSliced: boolean = false;
    /** @private */
    public start: number;
    /** @private */
    public degree: number;
}

/**
 *  Configures the series in accumulation chart.
 */

export class AccumulationSeries extends ChildProperty<AccumulationSeries> {

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
     * let pie: AccumulationChart = new AccumulationChart({
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
     * @default ''
     */

    @Property('')
    public dataSource: Object | DataManager;

    /**
     * Specifies Query to select data from dataSource. This property is applicable only when the dataSource is `ej.DataManager`.
     * @default null
     */
    @Property()
    public query: Query;

    /**
     * The DataSource field which contains the x value.
     * @default ''
     */

    @Property('')
    public xName: string;

    /**
     * Specifies the series name
     * @default ''
     */

    @Property('')
    public name: string;

    /**
     * The provided value will be considered as a Tooltip Mapping name 
     * @default ''
     */
    @Property('')
    public tooltipMappingName: string;

    /**
     * The DataSource field which contains the y value.
     * @default ''
     */

    @Property('')
    public yName: string;

    /**
     * Specifies the series visibility.
     * @default true
     */

    @Property(true)
    public visible: boolean;

    /**
     * Options for customizing the border of the series.
     */

    @Complex<BorderModel>({ color: null, width: 0 }, Border)
    public border: BorderModel;

    /**
     * Options for customizing the animation for series.
     */

    @Complex<AnimationModel>(null, Animation)
    public animation: AnimationModel;

    /**
     * The shape of the legend. Each series has its own legend shape. They are
     * * Circle - Renders a circle.
     * * Rectangle - Renders a rectangle.
     * * Triangle - Renders a triangle.
     * * Diamond - Renders a diamond.
     * * Cross - Renders a cross.
     * * HorizontalLine - Renders a horizontalLine.
     * * VerticalLine - Renders a verticalLine.
     * * Pentagon - Renders a pentagon.
     * * InvertedTriangle - Renders a invertedTriangle.
     * * SeriesType -Render a legend shape based on series type.
     * @default 'SeriesType'
     */

    @Property('SeriesType')
    public legendShape: LegendShape;

    /**
     * The DataSource field that contains the color value of point
     * It is applicable for series
     * @default ''
     */

    @Property('')
    public pointColorMapping: string;


    /**
     * Custom style for the selected series or points.
     * @default null
     */
    @Property(null)
    public selectionStyle: string;

    /**
     * AccumulationSeries y values less than groupTo are combined into single slice named others
     * @default null
     */
    @Property(null)
    public groupTo: string;

    /**
     * AccumulationSeries y values less than groupMode are combined into single slice named others
     * @default Value
     */
    @Property('Value')
    public groupMode: GroupModes;

    /**
     * The data label for the series.
     */
    @Complex<AccumulationDataLabelSettingsModel>({}, AccumulationDataLabelSettings)
    public dataLabel: AccumulationDataLabelSettingsModel;

    /**
     * Palette for series points.
     * @default []
     */
    @Property([])
    public palettes: string[];

    /**
     * Start angle for a series.
     * @default 0
     */
    @Property(0)
    public startAngle: number;

    /**
     * End angle for a series.
     * @default null
     */
    @Property(null)
    public endAngle: number;

    /**
     * Radius of the pie series and its values in percentage.
     * @default '80%'
     */
    @Property('80%')
    public radius: string;

    /**
     * When the innerRadius value is greater than 0 percentage, a donut will appear in pie series. It takes values only in percentage.
     * @default '0'
     */
    @Property('0')
    public innerRadius: string;

    /**
     * Specify the type of the series in accumulation chart.
     * @default 'Pie'
     */
    @Property('Pie')
    public type: AccumulationType;

    /**
     * To enable or disable tooltip for a series.
     * @default true
     */
    @Property(true)
    public enableTooltip: boolean;

    /**
     * If set true, series points will be exploded on mouse click or touch.
     * @default false
     */
    @Property(false)
    public explode: boolean;

    /**
     * Distance of the point from the center, which takes values in both pixels and percentage.
     * @default '30%'
     */
    @Property('30%')
    public explodeOffset: string;

    /**
     * If set true, all the points in the series will get exploded on load.
     * @default false
     */
    @Property(false)
    public explodeAll: boolean;

    /**
     * Index of the point, to be exploded on load.
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public explodeIndex: number;

    /**
     * options to customize the empty points in series
     */
    @Complex<EmptyPointSettingsModel>({ mode: 'Drop' }, EmptyPointSettings)
    public emptyPointSettings: EmptyPointSettingsModel;

    /**
     * Defines the distance between the segments of a funnel/pyramid series. The range will be from 0 to 1
     * @default 0
     */
    @Property(0)
    public gapRatio: number;

    /**
     * Defines the width of the funnel/pyramid with respect to the chart area
     * @default '80%'
     */
    @Property('80%')
    public width: string;

    /**
     * Defines the height of the funnel/pyramid with respect to the chart area
     * @default '80%'
     */
    @Property('80%')
    public height: string;

    /**
     * Defines the width of the funnel neck with respect to the chart area
     * @default '20%'
     */
    @Property('20%')
    public neckWidth: string;

    /**
     * Defines the height of the funnel neck with respect to the chart area
     * @default '20%'
     */
    @Property('20%')
    public neckHeight: string;

    /**
     * Defines how the values have to be reflected, whether through height/surface of the segments
     * @default 'Linear'
     */
    @Property('Linear')
    public pyramidMode: PyramidModes;
    /**
     * The opacity of the series.
     * @default 1.
     */
    @Property(1)
    public opacity: number;

    /** @private */
    public points: AccPoints[] = [];
    /** @private */
    public clubbedPoints: AccPoints[] = [];
    /** @private */
    public dataModule: Data;
    /** @private */
    public sumOfPoints: number = 0;
    /** @private */
    public index: number;
    /** @private */
    public sumOfClub: number;
    /** @private */
    public resultData: Object;
    /** @private */
    public lastGroupTo: string;
    /** @private */
    public isRectSeries: boolean = true;
    /** @private */
    public clipRect: Rect = new Rect(0, 0, 0, 0);
     /** @private */
    public category: SeriesCategories = 'Series';
    /**
     * To find the max bounds of the data label to place smart legend
     *  @private
     */
    public labelBound: Rect;
    /**
     * To find the max bounds of the accumulation segment to place smart legend
     *  @private
     */
    public accumulationBound: Rect;

    /**
     * Defines the funnel size
     * @private
     */
    public triangleSize: Size;

    /**
     * Defines the size of the funnel neck
     * @private
     */
    public neckSize: Size;
    /** @private To refresh the Datamanager for series */
    public refreshDataManager(accumulation: AccumulationChart, render : boolean): void {
        let dateSource: Object | DataManager = this.dataSource || accumulation.dataSource;
        if (isNullOrUndefined(this.query)) {
            this.dataManagerSuccess({ result: dateSource, count: (dateSource as Object[]).length }, accumulation, render);
            return;
        }
        let dataManager: Promise<Object> = this.dataModule.getData(this.dataModule.generateQuery().requiresCount());
        dataManager.then((e: { result: Object, count: number }) => this.dataManagerSuccess(e, accumulation, render));
    }
    /**
     * To get points on dataManager is success
     * @private
     */
    public dataManagerSuccess(e: { result: Object, count: number }, accumulation: AccumulationChart, render : boolean): void {
        let argsData: IAccSeriesRenderEventArgs = {
            name: seriesRender, series: this, data: e.result,
        };
        accumulation.trigger(seriesRender, argsData);
        this.resultData = e.result !== '' ? e.result : [];
        this.getPoints(this.resultData, accumulation);
        if (++accumulation.seriesCounts === accumulation.visibleSeries.length && render) {
            accumulation.refreshChart();
        }
    }
    /** @private To find points from result data */
    public getPoints(result: Object, accumulation: AccumulationChart): void {
        let length: number = Object.keys(result).length;
        this.sumOfPoints = 0;
        if (length === 0) {
            return null;
        }
        this.findSumOfPoints(result);
        this.points = [];
        this.clubbedPoints = [];
        this.sumOfClub = 0;
        let point: AccPoints;
        let colors: string[] = this.palettes.length ? this.palettes : getSeriesColor(accumulation.theme);
        let clubValue: number = stringToNumber(this.groupTo, this.sumOfPoints);
        for (let i: number = 0; i < length; i++) {
            point = this.setPoints(result, i, colors);
            let currentY: number = point.y;
            if (!this.isClub(point, clubValue, i)) {
                if (isNullOrUndefined(point.y)) {
                    point.visible = false;
                }
                this.pushPoints(point, colors);
            } else {
                point.index = this.clubbedPoints.length;
                point.isExplode = true;
                this.clubbedPoints.push(point);
                point.isSliced = true;
            }
        }
        this.lastGroupTo = this.groupTo;
        if (this.sumOfClub > 0) {
            let clubPoint: AccPoints = this.generateClubPoint();
            this.pushPoints(clubPoint, colors);
            let pointsLength: number = this.points.length - 1;
            this.clubbedPoints.map((point: AccPoints) => {
                point.index += pointsLength;
                point.color = clubPoint.color;
            });
        }
        if (
            this.clubbedPoints.length && this.explode && this.type === 'Pie'
            && (this.explodeAll || this.points[this.points.length - 1].index === this.explodeIndex)
        ) {
            this.points.splice(this.points.length - 1, 1);
            this.points = this.points.concat(this.clubbedPoints);
        }
    }
    /**
     * Generate club point
     */
    public generateClubPoint(): AccPoints {
        let clubPoint: AccPoints = new AccPoints();
        clubPoint.isClubbed = true;
        clubPoint.x = 'Others';
        clubPoint.y = this.sumOfClub;
        clubPoint.text = clubPoint.originalText = clubPoint.x + ': ' + this.sumOfClub;
        return clubPoint;
    }
    /**
     * Method to set point index and color
     */
    private pushPoints(point: AccPoints, colors: string[]): void {
        point.index = this.points.length;
        point.isExplode = this.explodeAll || (point.index === this.explodeIndex);
        point.color = point.color || colors[point.index % colors.length];
        this.points.push(point);
    }
    /**
     * Method to find club point
     */
    private isClub(point: AccPoints, clubValue: number, index: number): boolean {
        if (!isNullOrUndefined(clubValue)) {
            if (this.groupMode === 'Value' && Math.abs(point.y) <= clubValue) {
                this.sumOfClub += Math.abs(point.y);
                return true;
            } else if (this.groupMode === 'Point' && index >= clubValue ) {
                this.sumOfClub += Math.abs(point.y);
                return true;
            }
        }
        return false;
    }
    /**
     * Method to find sum of points in the series
     */
    private findSumOfPoints(result: Object): void {
        let length: number = Object.keys(result).length;
        for (let i: number = 0; i < length; i++) {
            if (!isNullOrUndefined(result[i][this.yName])) {
                this.sumOfPoints += Math.abs(result[i][this.yName]);
            }
        }
    }
    /**
     * Method to set points x, y and text from data source
     */
    private setPoints(data: Object, i: number, colors: string[]): AccPoints {
        let point: AccPoints = new AccPoints();
        point.x = getValue(this.xName, data[i]);
        point.y = getValue(this.yName, data[i]);
        point.percentage = (+(point.y / this.sumOfPoints * 100).toFixed(2));
        point.color = getValue(this.pointColorMapping, data[i]);
        point.text = point.originalText = getValue(this.dataLabel.name || '', data[i]);
        point.tooltip = getValue(this.tooltipMappingName || '', data[i]);
        this.setAccEmptyPoint(point, i, data, colors);
        return point;
    }
    /**
     * Method render the series elements for accumulation chart
     * @private
     */
    public renderSeries(accumulation: AccumulationChart, redraw?: boolean): void {

        let seriesGroup: Element = redraw ? getElement(accumulation.element.id + '_Series_' + this.index) :
            accumulation.renderer.createGroup({ id: accumulation.element.id + '_Series_' + this.index });

        this.renderPoints(accumulation, seriesGroup, redraw);

        let datalabelGroup: Element;

        if (accumulation.accumulationDataLabelModule && this.dataLabel.visible) {

            datalabelGroup = accumulation.renderer.createGroup({ id: accumulation.element.id + '_datalabel_Series_' + this.index });

            (datalabelGroup as HTMLElement).style.visibility =
                (this.animation.enable && accumulation.animateSeries && this.type === 'Pie') ? 'hidden' : 'visible';

            this.renderDataLabel(accumulation, datalabelGroup, redraw);
        }
        if (this.type === 'Pie') {
            this.findMaxBounds(this.labelBound, this.accumulationBound);
            accumulation.pieSeriesModule.animateSeries(accumulation, this.animation, this, seriesGroup);
        }
        if (accumulation.accumulationLegendModule) {
            this.labelBound.x -= accumulation.explodeDistance;
            this.labelBound.y -= accumulation.explodeDistance;
            this.labelBound.height += (accumulation.explodeDistance - this.labelBound.y);
            this.labelBound.width += (accumulation.explodeDistance - this.labelBound.x);
        }
    }
    /**
     * Method render the points elements for accumulation chart series.
     */
    private renderPoints(accumulation: AccumulationChart, seriesGroup: Element, redraw?: boolean): void {
        let pointId: string = accumulation.element.id + '_Series_' + this.index + '_Point_';
        let option: PathOption;
        for (let point of this.points) {
            let argsData: IAccPointRenderEventArgs = {
                cancel: false, name: pointRender, series: this, point: point, fill: point.color,
                border: this.isEmpty(point) ? { width: this.emptyPointSettings.border.width, color: this.emptyPointSettings.border.color } :
                    { width: this.border.width, color: this.border.color }
            };
            accumulation.trigger(pointRender, argsData);
            point.color = argsData.fill;
            option = new PathOption(
                    pointId + point.index, point.color, argsData.border.width || 1, argsData.border.color || point.color, this.opacity,
                    '', ''
                );
            accumulation[(firstToLowerCase(this.type) + 'SeriesModule')].
                    renderPoint(point, this, accumulation, option, seriesGroup, redraw);
        }
        appendChildElement(accumulation.getSeriesElement(), seriesGroup, redraw);
    }
    /**
     * Method render the datalabel elements for accumulation chart.
     */
    private renderDataLabel(accumulation: AccumulationChart, datalabelGroup: Element, redraw?: boolean): void {
        accumulation.accumulationDataLabelModule.findAreaRect();
        let element: HTMLElement = createElement('div', {
            id: accumulation.element.id + '_Series_0' + '_DataLabelCollections'
        });
        for (let point of this.points) {
            if (point.visible) {
                accumulation.accumulationDataLabelModule.renderDataLabel(
                    point, this.dataLabel, datalabelGroup, this.points, this.index, element,
                    redraw
                );
            }
        }
        if (this.dataLabel.template !== null && element.childElementCount) {
            appendChildElement(
                getElement(accumulation.element.id + '_Secondary_Element'), element, redraw
            );
        }
        appendChildElement(accumulation.getSeriesElement(), datalabelGroup, redraw);
    }

    /**
     * To find maximum bounds for smart legend placing
     * @private
     */
    public findMaxBounds(totalbound: Rect, bound: Rect): void {
        totalbound.x = bound.x < totalbound.x ? bound.x : totalbound.x;
        totalbound.y = bound.y < totalbound.y ? bound.y : totalbound.y;
        totalbound.height = (bound.y + bound.height) > totalbound.height ? (bound.y + bound.height) : totalbound.height;
        totalbound.width = (bound.x + bound.width) > totalbound.width ? (bound.x + bound.width) : totalbound.width;
    }
    /**
     * To set empty point value for null points
     * @private
     */
    public setAccEmptyPoint(point: AccPoints, i: number, data: Object, colors: string[]): void {
        if (!isNullOrUndefined(point.y)) {
            return null;
        }
        point.color = this.emptyPointSettings.fill || point.color;
        switch (this.emptyPointSettings.mode) {
            case 'Zero':
                point.y = 0;
                point.visible = true;
                break;
            case 'Average':
                let previous: number = data[i - 1] ? (data[i - 1][this.yName] || 0) : 0;
                let next: number = data[i + 1] ? (data[i + 1][this.yName] || 0) : 0;
                point.y = (Math.abs(previous) + Math.abs(next)) / 2;
                this.sumOfPoints += point.y;
                point.visible = true;
                break;
            default :
                point.visible = false;
                break;
        }
    }
    /**
     * To find point is empty
     */
    private isEmpty(point: AccPoints): boolean {
        return point.color === this.emptyPointSettings.fill;
    }
}
/**
 * method to get series from index
 * @private
 */
export function getSeriesFromIndex(index: number, visibleSeries: AccumulationSeries[]): AccumulationSeries {
    for (let series of visibleSeries) {
        if (index === series.index) {
            return <AccumulationSeries>series;
        }
    }
    return <AccumulationSeries>visibleSeries[0];
}
/**
 * method to get point from index
 * @private
 */
export function pointByIndex(index: number, points: AccPoints[]): AccPoints {
    for (let point of points) {
        if (point.index === index) {
            return point;
        }
    }
    return null;
}
