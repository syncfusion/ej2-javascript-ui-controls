import { withInRange, getPoint, PathOption, drawSymbol, Size, getElement } from '../../common/utils/helper';
import { Rect, markerAnimate, TransformToVisible, ChartLocation, appendChildElement } from '../../common/utils/helper';
import { Chart } from '../chart';
import { Series, Points } from './chart-series';
import { MarkerSettingsModel } from '../series/chart-series-model';
import { IPointRenderEventArgs } from '../../common/model/interface';
import { pointRender } from '../../common/model/constants';
import { Axis } from '../../chart/axis/axis';

/**
 * `ScatterSeries` module is used to render the scatter series.
 */

export class ScatterSeries {

    /**
     * Render the scatter series.
     * @return {void}
     * @private
     */

    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean): void {
        let marker: MarkerSettingsModel = series.marker;
        let visiblePoints: Points[] = series.points;
        let argsData: IPointRenderEventArgs;
        let getCoordinate: Function = series.chart.chartAreaType === 'PolarRadar' ? TransformToVisible : getPoint;
        let startLocation: ChartLocation;
        let redraw: boolean = series.chart.redraw;
        for (let point of visiblePoints) {
            startLocation = (redraw && point.symbolLocations) ? point.symbolLocations[0] : null;
            point.symbolLocations = []; point.regions = [];
            if (point.visible && withInRange(visiblePoints[point.index - 1], point, visiblePoints[point.index + 1], series)) {
                argsData = {
                    cancel: false, name: pointRender, series: series, point: point,
                    fill: series.setPointColor(point, series.interior),
                    border: series.setBorderColor(point, { width: series.border.width, color: series.border.color }),
                    height: marker.height, width: marker.width, shape: marker.shape
                };
                series.chart.trigger(pointRender, argsData);
                if (!argsData.cancel) {
                    point.symbolLocations.push(
                        getCoordinate(point.xValue, point.yValue, xAxis, yAxis, isInverted, series)
                    );
                    point.color = argsData.fill;
                    this.refresh(series, point, argsData, startLocation);
                } else {
                    point.marker = { visible: true };
                }
            }
        }
    }
    /**
     * To append scatter element
     * @param series 
     * @param point 
     * @param argsData 
     * @param startLocation 
     */
    private refresh(series: Series, point: Points, argsData: IPointRenderEventArgs, startLocation: ChartLocation): void {
        let chart: Chart = series.chart;
        let circlePath: String;
        let previousPath: string;
        let marker: MarkerSettingsModel = series.marker;
        let shapeOption: PathOption = new PathOption(
            chart.element.id + '_Series_' + series.index + '_Point_' + point.index, argsData.fill,
            argsData.border.width, argsData.border.color, series.opacity, null
        );
        if (chart.redraw && getElement(shapeOption.id)) {
            circlePath = argsData.shape === 'Circle' ? 'c' : '';
            previousPath = getElement(shapeOption.id).getAttribute('d');
        }
        appendChildElement(
            series.seriesElement, drawSymbol(
                point.symbolLocations[0], argsData.shape, new Size(argsData.width, argsData.height),
                marker.imageUrl, shapeOption, point.x.toString() + ':' + point.yValue.toString()
            ),
            chart.redraw, true, circlePath + 'x', circlePath + 'y',
            startLocation, previousPath
        );
        point.regions.push(new Rect(
            point.symbolLocations[0].x - marker.width, point.symbolLocations[0].y - marker.height,
            2 * marker.width, 2 * marker.height
        ));
        point.marker = {
            border: argsData.border, fill: argsData.fill,
            height: argsData.height, visible: true,
            width: argsData.width, shape: argsData.shape
        };
    }
    /**
     * Animates the series.
     * @param  {Series} series - Defines the series to animate.
     * @return {void}
     */
    public doAnimation(series: Series): void {
        let duration: number = series.animation.duration;
        let delay: number = series.animation.delay;
        let rectElements: NodeList = series.seriesElement.childNodes;
        let count: number = 1;
        for (let point of series.points) {
            if (!point.symbolLocations.length || !rectElements[count]) {
                continue;
            }
            markerAnimate(
                <HTMLElement>rectElements[count], delay, duration, series,
                point.index, point.symbolLocations[0], false
            );
            count++;
        }
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the series
         */
        return 'ScatterSeries';
    }

    /**
     * To destroy the scatter. 
     * @return {void}
     */

    public destroy(chart: Chart): void {
        /**
         * Destroy method calling here
         */
    }

}