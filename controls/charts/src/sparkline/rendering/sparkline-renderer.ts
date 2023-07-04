/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
/* eslint-disable valid-jsdoc */
import { Sparkline, IAxisRenderingEventArgs, ISeriesRenderingEventArgs, SparklineValueType } from '../index';
import { ISparklinePointEventArgs, IMarkerRenderingEventArgs, IDataLabelRenderingEventArgs } from '../index';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { PathOption, SparkValues, drawPath, drawRectangle, RectOption, Rect, CircleOption, drawCircle, getSeriesColor } from '../utils/helper';
import { measureText, renderTextElement, TextOption, Size } from '../utils/helper';
import { PaddingModel, AxisSettingsModel, SparklineMarkerSettingsModel, SparklineFontModel } from '../model/base-model';
import { SparklineDataLabelSettingsModel, SparklineBorderModel } from '../model/base-model';
import { RangeBandSettingsModel } from '../model/base-model';
import { EdgeLabelMode } from '../model/enum';
import { DataManager, Query } from '@syncfusion/ej2-data';

/**
 * Sparkline rendering calculation file
 */
export class SparklineRenderer {
    /**
     * To process sparkline instance internally.
     */
    private sparkline: Sparkline;
    private min: number;
    private maxLength: number;
    private unitX: number;
    private unitY: number;
    private axisColor: string;
    private axisWidth: number;
    private axisValue: number;
    private clipId: string;
    /**
     * To get visible points options internally.
     *
     * @private
     */
    public visiblePoints: SparkValues[];
    private axisHeight: number;
    /**
     * To process highpoint index color for tooltip customization
     *
     * @private
     */
    public highPointIndex: number;
    /**
     * To process low point index color for tooltip customization
     *
     * @private
     */
    public lowPointIndex: number;
    /**
     * To process start point index color for tooltip customization
     *
     * @private
     */
    public startPointIndex: number;
    /**
     * To process end point index color for tooltip customization
     *
     * @private
     */
    public endPointIndex: number;
    /**
     * To process negative point index color for tooltip customization
     *
     * @private
     */
    public negativePointIndexes: number[];

    /**
     * Sparkline data calculations
     */
    constructor(sparkline: Sparkline) {
        this.sparkline = sparkline;
    }
    /**
     * To process the sparkline data.
     */
    public processData(): void {
        let data: object[] = <object[]>this.sparkline.dataSource;
        if (isNullOrUndefined(data) || !data.length) {
            return;
        } else if (!isNaN(this.sparkline.dataSource[0] as number) || this.sparkline.valueType === 'Numeric') {
            data = (this.sparkline.enableRtl) ? data.reverse() : data;
            this.sparkline.sparklineData = data; // extend([], data) as Object[];
        } else {
            this['process' + this.sparkline.valueType]();
        }
        this.axisCalculation();
    }

    public processDataManager(): void {
        let dataModule: DataManager; let queryModule: Query;
        if (this.sparkline.dataSource instanceof DataManager) {
            dataModule = this.sparkline.dataSource;
            queryModule = this.sparkline.query instanceof Query ? this.sparkline.query : new Query();
            const dataManager: Promise<Object> = dataModule.executeQuery(queryModule);
            dataManager.then((e: Object) => {
                this.sparkline.setProperties({ dataSource: e['result'] }, true);
                this.sparkline.sparklineData = this.sparkline.dataSource;
                this.sparkline.processSparklineData();
            });
        } else {
            this.sparkline.processSparklineData();
        }
    }
    /**
     * To process sparkline category data.
     */
    private processCategory(
        data: Object[] = <object[]>this.sparkline.dataSource, x: string = this.sparkline.xName, y: string = this.sparkline.yName): void {
        const temp: Object[] = [];
        const xValues: string[] = [];
        data.forEach((value: object) => {
            if (xValues.indexOf(value[x as string]) === -1) {
                xValues.push(value[x as string]);
            }
            const currentData: object = {};
            currentData[this.sparkline.xName] = xValues.indexOf(value[x as string]);
            currentData[this.sparkline.yName] = value[y as string];
            temp.push(currentData);
        });
        this.sparkline.sparklineData = temp;
    }
    /**
     * To process sparkline DateTime data.
     */
    private processDateTime(
        data: Object[] = <object[]>this.sparkline.dataSource, x: string = this.sparkline.xName, y: string = this.sparkline.yName): void {
        const temp: Object[] = [];
        data.forEach((value: object) => {
            const currentData: object = {};
            currentData[x as string] = value[x as string].getTime();
            currentData[y as string] = value[y as string];
            temp.push(currentData);
        });
        this.sparkline.sparklineData = temp;
    }
    /**
     * To render sparkline series.
     *
     * @private
     */
    public renderSeries(): void {
        const spark: Sparkline = this.sparkline;
        this.clipId = spark.element.id + '_sparkline_clip_path';
        this.drawAxis();
        const argsData: ISeriesRenderingEventArgs = {
            name: 'seriesRendering',
            cancel: false,
            lineWidth: spark.lineWidth,
            border: spark.border,
            fill: spark.fill,
            sparkline: spark
        };
        const seriesRenderingSuccess: Function = (args: ISeriesRenderingEventArgs) => {
            if (!this.visiblePoints || args.cancel) {
                return;
            }
            if (spark.type !== 'Pie' && spark.type !== 'WinLoss' && spark.rangeBandSettings.length) {
                const group: Element = this.sparkline.renderer.createGroup({ id: this.sparkline.element.id + '_sparkline_rangeband_g' });
                for (let i: number = 0; i < spark.rangeBandSettings.length; i++) {
                    if ((spark.axisSettings.minY <= spark.rangeBandSettings[i as number].startRange) ||
                    (spark.axisSettings.maxY >= spark.rangeBandSettings[i as number].endRange)) {
                        this.rangeBand(spark.rangeBandSettings[i as number], group, i);
                    }
                }
                this.sparkline.svgObject.appendChild(group);
            }
            this['render' + spark.type](this.visiblePoints, args);
            this.renderMarker(this.visiblePoints);
            this.renderLabel(this.visiblePoints);
        };
        seriesRenderingSuccess.bind(this);
        spark.trigger('seriesRendering', argsData, seriesRenderingSuccess);
    }
    /**
     * To render a range band
     */
    private rangeBand(rangeBandSettings: RangeBandSettingsModel, group: Element, index: number): void {
        const model: Sparkline = this.sparkline;
        const height: number = (model.availableSize.height) - model.padding.top * 2;
        const width: number = (model.availableSize.width) - model.padding.left * 2;
        const stValue: number = rangeBandSettings.startRange;
        const edValue: number = rangeBandSettings.endRange;
        let stHeight: number = (height - ((height / this.unitY) * (stValue - this.min))) + model.padding.top;
        let edHeight: number = (height - ((height / this.unitY) * (edValue - this.min))) + model.padding.top;
        const color: string = rangeBandSettings.color || this.sparkline.sparkTheme.rangeBandColor;
        if (edHeight > (height + model.padding.top)) {
            edHeight = (height + model.padding.top);
        } else if (edHeight < (0 + model.padding.top)) {
            edHeight = (0 + model.padding.top);
        }
        if (stHeight > (height + model.padding.top)) {
            stHeight = (height + model.padding.top);
        } else if (stHeight < (0 + model.padding.top)) {
            stHeight = (0 + model.padding.top);
        }
        const path: string = 'M ' + (model.padding.left) + ' ' + stHeight + ' L ' + (width + (model.padding.left)) + ' ' + stHeight +
            ' L ' + (width + (model.padding.left)) + ' ' + edHeight + ' L ' + (model.padding.left) + ' ' + edHeight + ' Z ';
        const pathOption: PathOption = {
            'id': model.element.id + '_rangeBand_' + index,
            'fill': color,
            'opacity': rangeBandSettings.opacity,
            'stroke': 'transparent',
            'stroke-width': model.lineWidth,
            'd': path,
            'stroke-dasharray': ''
        };
        drawPath(this.sparkline, pathOption, group);
    }
    /**
     * To render line series
     */
    private renderLine(points: SparkValues[], args: ISeriesRenderingEventArgs): void {
        const spark: Sparkline = this.sparkline;
        const g: Element = this.sparkline.renderer.createGroup({
            id: spark.element.id + '_sparkline_g',
            'clip-path': 'url(#' + this.clipId + ')'
        });
        let color: string = this.sparkline.fill;
        color = (this.sparkline.fill === '#00bdae' && this.sparkline.theme === 'Bootstrap4')
            ? this.sparkline.sparkTheme.axisLineColor : color;
        const pathOption: PathOption = new PathOption(
            spark.element.id + '_sparkline_line', 'transparent', args.lineWidth, color, spark.opacity);
        let d: string = '';
        for (let i: number = 0, len: number = points.length; i < len; i++) {
            if (i === 0) {
                d = 'M ' + points[0].x + ' ' + points[i as number].y + ' ';
            }
            d += 'L ' + points[i as number].x + ' ' + points[i as number].y + ' ';
        }
        pathOption.d = d;
        drawPath(this.sparkline, pathOption, g);
        this.sparkline.svgObject.appendChild(g);
    }
    /**
     * To render pie series
     */
    private renderPie(points: SparkValues[], args: ISeriesRenderingEventArgs): void {
        const spark: Sparkline = this.sparkline;
        const height: number = spark.availableSize.height - (spark.padding.top + spark.padding.bottom);
        const width: number = spark.availableSize.width - (spark.padding.left + spark.padding.right);
        const area: number = (height <= width) ? height / 2 : width / 2;
        const X: number = spark.availableSize.width / 2;  // center position of x
        const Y: number = spark.availableSize.height / 2; // center position of y
        let deg: number = 0;
        let stRad: number;
        let edRad: number;
        const stroke: string = args.border.color;
        const opacity: number = spark.opacity;
        const strokeWidth: number = args.border.width;
        const colors: string[] = (spark.palette.length) ? spark.palette : getSeriesColor(this.sparkline.theme);
        const group: Element = this.sparkline.renderer.createGroup({ id: spark.element.id + '_sparkline_g' });
        let low: number;
        let high: number;
        const locations: SparkValues[] = extend([], [], points) as SparkValues[];
        if (spark.highPointColor || spark.lowPointColor) {
            const pointsYvalues: number[] = locations.map((a: SparkValues) => { return a.yVal; });
            low = Math.min.apply(null, pointsYvalues);
            high = Math.max.apply(null, pointsYvalues);
        }
        this.negativePointIndexes = [];
        for (let i: number = 0, stDeg: number = 90, edDeg: number, flag: string; i < points.length; i++) {
            stDeg += deg;
            deg = points[i as number]['degree'];
            edDeg = stDeg + deg;
            stRad = (stDeg - 90) * Math.PI / 180.0;
            edRad = (edDeg - 90) * Math.PI / 180.0;
            points[i as number]['stAng'] = stRad;
            points[i as number]['endAng'] = edRad;
            flag = (deg < 180) ? '0' : '1';
            const temp: Object = points[i as number]['coordinates'] = {
                sX: X + (area * Math.cos(stRad)), sY: Y +
                    (area * Math.sin(stRad)), eX: X + (area * Math.cos(edRad)), eY: Y + (area * Math.sin(edRad))
            };
            const pathArc: string = 'M ' + X + ' ' + Y + ' L ' + temp['eX'] + ' ' + temp['eY'] + ' A ' + area + ' ' +
                area + ' 0 ' + flag + ',0 ' + temp['sX'] + ' ' + temp['sY'] + ' Z';
            const pathOption: PathOption = {
                'id': spark.element.id + '_sparkline_pie_' + i,
                'opacity': opacity,
                'fill': colors[i % colors.length],
                'stroke': stroke,
                'stroke-width': strokeWidth,
                'd': pathArc,
                'stroke-dasharray': ''
            };
            this.getPieSpecialPoint(points[i as number], spark, pathOption, i, high, low, points.length);
            const pointArgs: ISparklinePointEventArgs = this.triggerPointRender(
                'pointRendering', i, pathOption.fill, { color: stroke, width: strokeWidth });
            pathOption.fill = pointArgs.fill; pathOption.stroke = pointArgs.border.color;
            pathOption['stroke-width'] = pointArgs.border.width;
            if (!pointArgs.cancel) {
                const element: Element = drawPath(this.sparkline, pathOption, group);
                element.setAttribute('role', 'img');
                element.setAttribute('aria-label', spark.dataSource[i as number][spark.xName] + ' : ' + points[i as number].yVal);
            }
            const diffRadian: number = edRad - stRad;
            const mid: { x: number, y: number } = {
                x: X + ((area / 2) * Math.cos(stRad + (diffRadian / 2))),
                y: Y + ((area / 2) * Math.sin(stRad + (diffRadian / 2)))
            };
            points[i as number].location.x = mid.x; points[i as number].location.y = mid.y;
        }
        this.sparkline.svgObject.appendChild(group);
    }
    /**
     * To get special point color and option for Pie series.
     */
    private getPieSpecialPoint(
        temp: SparkValues, spark: Sparkline, option: PathOption, i: number, high: number, low: number, length: number
    ): void {
        if (temp.yVal < 0 && spark.negativePointColor) {
            option.fill = spark.negativePointColor;
            this.negativePointIndexes.push(i);
        }
        if (i === 0 && spark.startPointColor) {
            option.fill = spark.startPointColor;
            this.startPointIndex = i;
        } else if ((i === (length - 1)) && spark.endPointColor) {
            option.fill = spark.endPointColor;
            this.endPointIndex = i;
        }
        if (temp.yVal === high && spark.highPointColor) {
            option.fill = spark.highPointColor;
            this.highPointIndex = i;
        } else if (temp.yVal === low && spark.lowPointColor) {
            option.fill = spark.lowPointColor;
            this.lowPointIndex = i;
        }
    }
    /**
     * To render area series
     */
    private renderArea(points: SparkValues[], args: ISeriesRenderingEventArgs): void {
        const spark: Sparkline = this.sparkline;
        const group: Element = this.sparkline.renderer.createGroup({
            id: spark.element.id + '_sparkline_g',
            'clip-path': 'url(#' + this.clipId + ')'
        });
        let pathOption: PathOption = new PathOption(
            spark.element.id + '_sparkline_area', args.fill, 0, 'transparent', spark.opacity);
        let d: string = '';
        let str: string = '';
        for (let i: number = 0, len: number = points.length; i < len; i++) {
            if (i !== 0) {
                str += 'L ' + points[i as number].x + ' ' + points[i as number].y + ' ';
            } else {
                d = 'M ' + points[i as number].x + ' ' + this.axisHeight + ' ';
                str = 'M ' + points[i as number].x + ' ' + points[i as number].y + ' ';
            }
            d += 'L ' + points[i as number].x + ' ' + points[i as number].y + ' ';
            if (i === (len - 1)) {
                d += 'L ' + points[i as number].x + ' ' + this.axisHeight + ' Z';
            }
        }
        pathOption.d = d;
        drawPath(this.sparkline, pathOption, group);
        pathOption = new PathOption(
            spark.element.id + '_sparkline_area_str', 'transparent', args.border.width, args.border.color, spark.opacity, '', str);
        drawPath(this.sparkline, pathOption, group);
        this.sparkline.svgObject.appendChild(group);
    }
    /**
     * To render column series
     */
    private renderColumn(points: SparkValues[], args: ISeriesRenderingEventArgs): void {
        const spark: Sparkline = this.sparkline;
        const locations: SparkValues[] = extend([], [], points) as SparkValues[];
        const group: Element = this.sparkline.renderer.createGroup({
            id: spark.element.id + '_sparkline_g',
            'clip-path': 'url(#' + this.clipId + ')'
        });
        let lowPos: number;
        let highPos: number;
        if (this.sparkline.highPointColor || this.sparkline.lowPointColor) {
            const pointsYPos: number[] = locations.map((a: SparkValues) => { return a.markerPosition; });
            highPos = Math.min.apply(null, pointsYPos);
            lowPos = Math.max.apply(null, pointsYPos);
        }
        const id: string = spark.element.id + '_sparkline_column_';
        const rectOptions: RectOption = new RectOption(id, '', args.border, spark.opacity, null);
        let temp: SparkValues;
        const len: number = points.length;
        this.negativePointIndexes = [];
        const colors: string[] = (spark.palette.length) ? spark.palette : getSeriesColor(this.sparkline.theme);
        for (let i: number = 0; i < len; i++) {
            temp = points[i as number];
            rectOptions.id = id + i;
            rectOptions.fill = colors[0];
            rectOptions.rect = new Rect(temp.x, temp.y, temp.width, temp.height);
            this.getSpecialPoint(true, temp, spark, rectOptions, i, highPos, lowPos, len);
            temp.location.y = (temp.markerPosition <= this.axisHeight) ? temp.y : (temp.y + temp.height);
            temp.location.x = temp.x + (temp.width / 2);
            rectOptions.stroke = args.border.color ? (args.border.color) : rectOptions.fill;
            const pointArgs: ISparklinePointEventArgs = {
                name: 'pointRendering', cancel: false, pointIndex: i, fill: rectOptions.fill,
                border: { color: rectOptions.stroke, width: args.border.width }
            };
            this.sparkline.trigger('pointRendering', pointArgs, () => {
                temp = points[i as number];
                rectOptions.id = id + i;
                rectOptions.rect = new Rect(temp.x, temp.y, temp.width, temp.height);
                this.getSpecialPoint(true, temp, spark, rectOptions, i, highPos, lowPos, len);
                rectOptions.fill = pointArgs.fill;
                rectOptions.stroke = pointArgs.border.color;
                temp.location.y = (temp.markerPosition <= this.axisHeight) ? temp.y : (temp.y + temp.height);
                rectOptions['stroke-width'] = pointArgs.border.width;
                temp.location.x = temp.x + (temp.width / 2);
                if (!pointArgs.cancel) {
                    const element: Element = drawRectangle(spark, rectOptions, group);
                    element.setAttribute('role', 'img');
                    element.setAttribute('aria-label', spark.dataSource[i as number][spark.xName] + ' : ' + points[i as number].yVal);
                    group.appendChild(element);
                }
            });
        }
        this.sparkline.svgObject.appendChild(group);
    }
    /**
     * To render WinLoss series
     */
    private renderWinLoss(points: SparkValues[], args: ISeriesRenderingEventArgs): void {
        const spark: Sparkline = this.sparkline;
        const group: Element = this.sparkline.renderer.createGroup({
            id: spark.element.id + '_sparkline_g',
            'clip-path': 'url(#' + this.clipId + ')'
        });
        const id: string = spark.element.id + '_sparkline_winloss_';
        const options: RectOption = new RectOption(id, '', args.border, spark.opacity, null);
        let temp: SparkValues;
        const len: number = points.length;
        const paletteLength: number = spark.palette.length;
        const colors: string[] = (spark.palette.length) ? spark.palette : getSeriesColor(this.sparkline.theme);
        for (let i: number = 0; i < len; i++) {
            temp = points[i as number];
            options.id = id + i;
            options.fill = (paletteLength) ? spark.palette[i % paletteLength] : ((temp.yVal === this.axisValue) ?
            (this.sparkline.tiePointColor || '#a216f3') : ((temp.yVal > this.axisValue) ? args.fill || colors[i % colors.length] :
                    (spark.negativePointColor || '#e20f07')));
            options.stroke = (args.border.color) ? (args.border.color) : options.fill;
            options.rect = new Rect(temp.x, temp.y, temp.width, temp.height);
            temp.location.x = temp.x + (temp.width / 2);
            temp.location.y = (temp.yVal >= this.axisValue) ? (temp.y) : (temp.y + temp.height);
            const pointArgs: ISparklinePointEventArgs = this.triggerPointRender(
                'pointRendering', i, options.fill, { color: options.stroke, width: args.border.width });
            options.fill = pointArgs.fill; options.stroke = pointArgs.border.color;
            options['stroke-width'] = pointArgs.border.width;
            if (!pointArgs.cancel) {
                const element: Element = drawRectangle(spark, options, group);
                element.setAttribute('role', 'img');
                element.setAttribute('aria-label', spark.dataSource[i as number][spark.xName] + ' : ' + points[i as number].yVal);
            }
        }
        this.sparkline.svgObject.appendChild(group);
    }

    private renderMarker(points: SparkValues[]): void {
        const spark: Sparkline = this.sparkline;
        const marker: SparklineMarkerSettingsModel = spark.markerSettings;
        if ((spark.type === 'Pie' || spark.type === 'WinLoss' || !marker.visible.length)) {
            return;
        }
        const locations: SparkValues[] = extend([], [], points) as SparkValues[];
        const group: Element = this.sparkline.renderer.createGroup({
            id: spark.element.id + '_sparkline_marker_g',
            'clip-path': 'url(#' + this.clipId + ')'
        });
        let temp: SparkValues;
        const id: string = spark.element.id + '_sparkline_marker_';
        const option: CircleOption = new CircleOption('', marker.fill, marker.border, marker.opacity, 0, 0, marker.size / 2, '');
        let highPos: number;
        let lowPos: number;
        const visible: string = marker.visible.join();
        if ((visible.toLowerCase().indexOf('high') > -1) || (visible.toLowerCase().indexOf('low') > -1)) {
            const pointsYPos: number[] = locations.map((a: SparkValues) => { return a.markerPosition; });
            highPos = Math.min.apply(null, pointsYPos);
            lowPos = Math.max.apply(null, pointsYPos);
        }
        this.negativePointIndexes = [];
        for (let i: number = 0, length: number = points.length; i < length; i++) {
            temp = points[i as number];
            option.id = id + i;
            option.cx = temp.location.x;
            option.cy = temp.location.y;
            option.fill = marker.fill;
            let render: boolean = (visible.toLowerCase().indexOf('all') > -1);
            render = this.getSpecialPoint(render, temp, spark, option, i, highPos, lowPos, length, visible.toLowerCase());
            option.stroke = marker.border.color || option.fill;
            const markerArgs: IMarkerRenderingEventArgs = {
                name: 'markerRendering', cancel: false,
                border: { color: option.stroke, width: marker.border.width },
                fill: option.fill, pointIndex: i,
                sparkline: this.sparkline,
                x: option.cx, y: option.cy, size: marker.size
            };
            this.sparkline.trigger('markerRendering', markerArgs, () => {
                if (render && !markerArgs.cancel) {
                    option.id = id + i;
                    option.cx = markerArgs.x;
                    option.cy = markerArgs.y;
                    option.fill = markerArgs.fill; option.stroke = markerArgs.border.color;
                    option['stroke-width'] = markerArgs.border.width;
                    option.r = markerArgs.size / 2;
                    const element: Element = drawCircle(spark, option, group);
                    element.setAttribute('role', 'img');
                    element.setAttribute('aria-label', spark.dataSource[i as number][spark.xName] + ' : ' + points[i as number].yVal);
                    group.appendChild(element);
                }
            });
        }
        this.sparkline.svgObject.appendChild(group);
    }
    /**
     * To get special point color and option.
     */
    private getSpecialPoint(
        render: boolean, temp: SparkValues, spark: Sparkline, option: PathOption, i: number, highPos: number,
        lowPos: number, length: number, visible: string = ''
    ): boolean {
        if (temp.markerPosition > this.axisHeight) {
            option.fill = spark.negativePointColor || option.fill;
            this.negativePointIndexes.push(i);
            render = render || (visible.indexOf('negative') > -1);
        }
        if (i === 0) {
            option.fill = spark.startPointColor || option.fill;
            this.startPointIndex = i;
            render = render || (visible.indexOf('start') > -1);
        } else if ((i === (length - 1))) {
            option.fill = spark.endPointColor || option.fill;
            this.endPointIndex = i;
            render = render || (visible.indexOf('end') > -1);
        }
        if (temp.markerPosition === highPos) {
            option.fill = spark.highPointColor || option.fill;
            this.highPointIndex = i;
            render = render || (visible.indexOf('high') > -1);
        } else if (temp.markerPosition === lowPos) {
            option.fill = spark.lowPointColor || option.fill;
            this.lowPointIndex = i;
            render = render || (visible.indexOf('low') > -1);
        }
        if (visible.indexOf('none') > -1) {
            render = false;
        }
        return render;
    }
    /**
     * To render data label for sparkline.
     */
    private renderLabel(points: SparkValues[]): void {
        const spark: Sparkline = this.sparkline;
        const dataLabel: SparklineDataLabelSettingsModel = spark.dataLabelSettings;
        const color: string = dataLabel.textStyle.color || spark.sparkTheme.dataLabelColor;
        if ((spark.type === 'WinLoss' || !dataLabel.visible.length)) {
            return;
        }
        const locations: SparkValues[] = extend([], [], points) as SparkValues[];
        const id: string = spark.element.id + '_sparkline_label_';
        const group: Element = this.sparkline.renderer.createGroup({
            id: spark.element.id + '_sparkline_label_g',
            style: 'pointer-events: none;'
        });
        group.setAttribute('aria-hidden', 'true');
        let g: Element;
        let temp: SparkValues;
        const textId: string = id + 'text_';
        const rectId: string = id + 'rect_';
        const option: TextOption = new TextOption('', 0, 0, 'middle', '', 'middle');
        const labelStyle: SparklineFontModel = dataLabel.textStyle;
        const pointsYPos: number[] = locations.map((a: SparkValues) => { return a.markerPosition; });
        const highPos: number = Math.min.apply(null, pointsYPos);
        const lowPos: number = Math.max.apply(null, pointsYPos);
        const space: number = 1;
        const padding: number = (dataLabel.fill !== 'transparent' || dataLabel.border.width) ? 2 : 0;
        let size: Size = measureText('sparkline_measure_text', labelStyle, this.sparkline.sparkTheme.dataLabelFont);
        const rectOptions: RectOption = new RectOption('', dataLabel.fill, dataLabel.border, dataLabel.opacity, null);
        let edgeLabelOption: { x: number, render: boolean };
        for (let i: number = 0, length: number = points.length; i < length; i++) {
            temp = points[i as number];
            option.id = textId + i;
            option.x = temp.location.x + dataLabel.offset.x;
            option.y = ((spark.type === 'Pie') ? temp.location.y : ((temp.markerPosition > this.axisHeight) ? (temp.location.y +
                (size.height / 2) + space + 2 + padding) : (temp.location.y - (size.height / 2) - space - padding))) + dataLabel.offset.y;
            option.text = (dataLabel.format !== '') ? this.formatter(dataLabel.format, this.sparkline.dataSource[i as number]) :
                temp.yVal.toString();
            const labelArgs: IDataLabelRenderingEventArgs = {
                name: 'dataLabelRendering', cancel: false,
                border: dataLabel.border, fill: dataLabel.fill, pointIndex: i,
                sparkline: this.sparkline,
                x: option.x, y: option.y, text: option.text, color: color
            };
            this.sparkline.trigger('dataLabelRendering', labelArgs, () => {
                size = measureText(labelArgs.text, labelStyle, this.sparkline.sparkTheme.dataLabelFont);
                option.text = labelArgs.text;
                let renderLabel: boolean = (dataLabel.visible.join().toLowerCase().indexOf('all') > -1);
                renderLabel = this.getLabelVisible(renderLabel, temp, i, dataLabel, length, highPos, lowPos);
                edgeLabelOption = this.arrangeLabelPosition(dataLabel.edgeLabelMode, renderLabel, labelArgs.x, i, length, size, padding);
                if (renderLabel && !labelArgs.cancel && edgeLabelOption.render) {
                    rectOptions.id = rectId + i;
                    rectOptions.fill = labelArgs.fill;
                    rectOptions.stroke = labelArgs.border.color;
                    rectOptions['stroke-width'] = labelArgs.border.width;
                    option.y = labelArgs.y;
                    option.x = edgeLabelOption.x;
                    rectOptions.rect = new Rect(
                        option.x - ((size.width / 2) + padding), (option.y - padding - (size.height / 1.75)), size.width + (padding * 2),
                        size.height + (padding * 2));
                    g = this.sparkline.renderer.createGroup({ id: id + 'g' + i });
                    drawRectangle(spark, rectOptions, g);
                    renderTextElement(option, labelStyle, labelArgs.color, g, this.sparkline.sparkTheme.dataLabelFont);
                    group.appendChild(g);
                }
            });
        }
        this.sparkline.svgObject.appendChild(group);
    }
    private arrangeLabelPosition(
        edgeLabel: EdgeLabelMode, render: boolean, x: number, index: number, length: number, size: Size, padding: number
    ): { x: number, render: boolean } {
        if (edgeLabel === 'None') {
            return { x, render };
        }
        if (index === 0 && ((x - (size.width / 2) - padding) <= 0)) {
            if (edgeLabel === 'Hide') {
                render = false;
            } else {
                x = this.sparkline.padding.left + padding + (size.width / 2);
            }
        } else if (index === length - 1 && ((x + (size.width / 2) + padding) >= this.sparkline.availableSize.width)) {
            if (edgeLabel === 'Hide') {
                render = false;
            } else {
                x -= (size.width / 2 + padding);
            }
        }
        return { x, render };
    }
    /**
     * To get special point color and option.
     */
    private getLabelVisible(
        render: boolean, temp: SparkValues, i: number, label: SparklineDataLabelSettingsModel, length: number,
        highPos: number, lowPos: number
    ): boolean {
        const labelVisible: string = label.visible.join().toLowerCase();
        if (temp.markerPosition > this.axisHeight) {
            render = render || (labelVisible.indexOf('negative') > -1);
        }
        if (i === 0) {
            render = render || (labelVisible.indexOf('start') > -1);
        } else if ((i === (length - 1))) {
            render = render || (labelVisible.indexOf('end') > -1);
        }
        if (temp.markerPosition === highPos) {
            render = render || (labelVisible.indexOf('high') > -1);
        } else if (temp.markerPosition === lowPos) {
            render = render || (labelVisible.indexOf('low') > -1);
        }
        if (label.visible.join().toLowerCase().indexOf('none') > -1) {
            render = false;
        }
        return render;
    }
    /**
     * To format text
     */
    private formatter(format: string, data: object): string {
        if (isNullOrUndefined(format)) {
            return null;
        }
        const keys: string[] = Object.keys(data);
        for (const key of keys) {
            format = format.split('${' + key + '}').join(data[key as string]);
        }
        return format;
    }
    /**
     * To calculate min max for x and y axis
     */
    private axisCalculation(): void {
        this.findRanges(<object[]>this.sparkline.sparklineData);
    }
    /**
     * To find x axis interval.
     */
    private getInterval(data: Object[], x: string): number {
        let interval: number = 1;
        const x1: number = data[0][x as string];
        const x2: number = isNullOrUndefined(data[1]) ? undefined : data[1][x as string];
        if (!isNullOrUndefined(x1) && !isNullOrUndefined(x2)) {
            const temp: object[] = extend([], data) as Object[];
            let validData: object[] = [];
            temp.forEach((value: object) => {
                if (!isNullOrUndefined(value[x as string])) {
                    validData.push(value);
                }
            });
            validData.sort((a: object, b: object) => {
                if (isNullOrUndefined(a[x as string]) || isNullOrUndefined(b[x as string])) {
                    return 0;
                }
                return a[x as string] - b[x as string];
            });
            validData = (this.sparkline.enableRtl) ? validData.reverse() : validData;
            interval = validData[1][x as string] - validData[0][x as string];
        }
        return interval;
    }
    /**
     * To find x axis interval.
     */
    private getPaddingInterval(data: Object[], x: string, type: SparklineValueType, delta: number): number {
        const interval: number = 1;
        const size: number = this.sparkline.availableSize.height;
        let intervalCount: number = interval * data.length;
        intervalCount = Math.max((size * (intervalCount / 100)), 1);
        let niceInterval: number = delta / intervalCount;
        for (const intervalVal of this.sparkline.intervalDivs) {
            const currentInterval: number = interval * intervalVal;
            if (intervalCount < (delta / currentInterval)) {
                break;
            }
            niceInterval = currentInterval;
        }
        return niceInterval;
    }
    /**
     * To calculate axis ranges internally.
     */
    private findRanges(data: Object[]): void {
        const model: Sparkline = this.sparkline;
        let max: number; let min: number; let minX: number; let maxX: number;
        const maxPointsLength: number = data.length;
        let temp: object[];
        let sumofValues: number = 0;
        const isNumericArray: boolean = Array.isArray(data) && typeof data[0] !== 'object';
        if (isNumericArray) {
            if (model.type === 'Pie') {
                for (let i: number = 0; i < maxPointsLength; i++) {
                    sumofValues += Math.abs(data[i as number] as number);
                }
            } else {
                max = Math.max.apply(null, data);
                min = Math.min.apply(null, data);
                minX = 0;
                maxX = maxPointsLength - 1;
            }
        } else {
            if (model.type === 'Pie') {
                for (let i: number = 0; i < maxPointsLength; i++) {
                    sumofValues += Math.abs(data[i as number][model.yName]);
                }
            } else {
                if (isNullOrUndefined(data[0][model.xName])) {
                    const x: number[] = data.map((z: object) => { return z[model.yName]; });
                    max = Math.max.apply(null, x); min = Math.min.apply(null, x);
                } else {
                    temp = extend([], data) as Object[];
                    temp = temp.sort((a: object, b: object) => { return a[model.yName] - b[model.yName]; });
                    max = temp[temp.length - 1][model.yName];
                    min = temp[0][model.yName];
                }
                if (!isNullOrUndefined(data[0][model.xName])) {
                    temp = temp.sort((a: object, b: object) => { return a[model.xName] - b[model.xName]; });
                    temp = (this.sparkline.enableRtl) ? temp.reverse() : temp;
                    maxX = temp[temp.length - 1][model.xName];
                    minX = temp[0][model.xName];
                } else {
                    minX = 0;
                    maxX = maxPointsLength - 1;
                }
            }
        }
        let y2: number; let height: number; let width: number; let x1: number = 0; let y1: number;
        const padding: PaddingModel = model.padding; let point: SparkValues;
        const axis: AxisSettingsModel = model.axisSettings;
        let value: number = axis.value;
        if (model.type !== 'Pie') {
            this.maxLength = maxPointsLength;
            height = model.availableSize.height - (padding.bottom + padding.top);
            width = model.availableSize.width - (padding.left + padding.right);
            maxX = isNullOrUndefined(axis.maxX) ? maxX : axis.maxX;
            minX = isNullOrUndefined(axis.minX) ? minX : axis.minX;
            max = isNullOrUndefined(axis.maxY) ? max : axis.maxY;
            min = isNullOrUndefined(axis.minY) ? min : axis.minY;
            const color: string = axis.lineSettings.color || this.sparkline.sparkTheme.axisLineColor;
            const eventArgs: IAxisRenderingEventArgs = {
                name: 'axisRendering', cancel: false, sparkline: model,
                maxX: maxX, minX: minX, maxY: max, minY: min, value: axis.value,
                lineColor: color, lineWidth: axis.lineSettings.width
            };
            model.trigger('axisRendering', eventArgs);
            if (eventArgs.cancel) {
                this.visiblePoints = [];
                return;
            }
            maxX = eventArgs.maxX; minX = eventArgs.minX;
            max = eventArgs.maxY; min = eventArgs.minY;
            value = this.axisValue = eventArgs.value; this.axisColor = eventArgs.lineColor; this.axisWidth = eventArgs.lineWidth;
        }
        let unitX: number = maxX - minX;
        let unitY: number = max - min;
        unitX = (unitX === 0) ? 1 : unitX;
        unitY = (unitY === 0) ? 1 : unitY;
        this.unitX = unitX; this.unitY = unitY; this.min = min;
        x1 = 0;
        y1 = height - ((height / unitY) * (-min));
        y1 = (min < 0 && max <= 0) ? 0 : (min < 0 && max > 0) ? y1 : height;
        if (value >= min && value <= max) { y1 = height - Math.round(height * ((value - min) / this.unitY)); }
        this.axisHeight = y1 + padding.top;
        let percent: number; let x: number; let y: number;
        const visiblePoints: SparkValues[] = [];
        const delta: number = max - min;
        const interval: number = this.getInterval(data, model.xName);
        const interVal: number = this.getPaddingInterval(data, model.xName, model.valueType, delta);
        for (let i: number = 0; i < maxPointsLength; i++) {
            if (isNullOrUndefined(data[i as number][model.xName]) && isNullOrUndefined(data[i as number][model.yName]) &&
                ((data[i as number][model.yName]) !== 0) && isNumericArray) {
                x = i; y = data[i as number] as number;
            } else if (isNullOrUndefined(data[i as number][model.xName])) {
                x = i; y = data[i as number][model.yName];
            } else {
                x = data[i as number] [model.xName]; y = data[i as number][model.yName];
            }
            if (isNullOrUndefined(x) || isNullOrUndefined(y)) {
                continue;
            }
            if (model.type === 'Line' || model.type === 'Area') {
                y2 = (min !== max && maxPointsLength !== 1) ? height - Math.round(height * ((y - min) / this.unitY)) : padding.top;
                point = { x: (minX !== maxX) ? Math.round(width * ((x - minX) / this.unitX)) : width / 2, y: y2, markerPosition: y2 };
            } else if (model.type === 'Column' || model.type === 'WinLoss') {
                let colWidth: number = width / (((maxX - minX) / interval) + 1);
                const calSpace: number = 0.5;
                const space: number = (calSpace * 2); //calspace is default space for column and winloss
                colWidth -= (space);
                x1 = (((x - minX) / interval) * (colWidth + space)) + (space / 2);
                if (model.type === 'WinLoss') {
                    // win or gain column height half of the height , draw(zero) height factor
                    const winLossFactor: number = 0.5;
                    const drawHeightFactor: number = 40;
                    y2 = (y > value) ? (height / 4) : (y < value) ? (height * winLossFactor) :
                        ((height * winLossFactor) - (height / drawHeightFactor));
                    point = {
                        x: x1, y: y2, height: (y !== value) ? (height / 4) : height / 20, width: colWidth,
                        markerPosition: (y2 > y1) ? (y1 + Math.abs(y2 - y1)) : y2
                    };
                } else {
                    if (i === 0 && model.rangePadding !== 'None') {
                        min -= model.rangePadding === 'Additional' ? (interVal + padding.top) : interVal;
                        max += model.rangePadding === 'Additional' ? (interVal + padding.top) : interVal;
                        unitX = maxX - minX;
                        unitY = max - min;
                        unitX = (unitX === 0) ? 1 : unitX;
                        unitY = (unitY === 0) ? 1 : unitY;
                        this.unitX = unitX;
                        this.unitY = unitY;
                        this.min = min;
                    }
                    const z: number = ((height / this.unitY) * (y - min));
                    const z1: number = (y === min && y > value) ? ((maxPointsLength !== 1 && this.unitY !== 1) ?
                        (height / this.unitY) * (min / 2) : (z | 1)) :
                        (y === max && y < value && maxPointsLength !== 1 && this.unitY !== 1) ? (height / this.unitY) * (-max / 2) : z;
                    y2 = Math.abs(height - z1);
                    point = {
                        x: x1, y: (y2 > y1) ? y1 : y2, height: Math.abs(y2 - y1),
                        width: colWidth, markerPosition: (y2 > y1) ? (y1 + Math.abs(y2 - y1)) : y2
                    };
                }
            } else if (model.type === 'Pie') {
                percent = (Math.abs(y) / sumofValues) * 100;
                point = {
                    percent: percent, degree: ((Math.abs(y) / sumofValues) * 360)
                };
            }
            if (model.type !== 'Pie') {
                point.x += padding.left;
                point.y += padding.top;
            }
            if (model.type !== 'WinLoss') {
                point.markerPosition += padding.top;
            }
            point.location = { x: point.x, y: point.y };
            point.xVal = x; point.yVal = y;
            visiblePoints.push(point);
        }
        visiblePoints.sort((a: SparkValues, b: SparkValues): number => {
            return a.x - b.x;
        });
        this.visiblePoints = visiblePoints;
    }
    /**
     * To render the sparkline axis
     */
    private drawAxis(): void {
        const spark: Sparkline = this.sparkline;
        const height: number = this.axisHeight;
        if ((spark.type !== 'WinLoss') && (spark.type !== 'Pie') && spark.axisSettings.lineSettings.visible) {
            const xAxis: object = {
                'id': spark.element.id + '_Sparkline_XAxis',
                'x1': spark.padding.left, 'y1': height,
                'x2': spark.availableSize.width - spark.padding.right, 'y2': height,
                'stroke': this.axisColor,
                'opacity': spark.axisSettings.lineSettings.opacity,
                'stroke-dasharray': spark.axisSettings.lineSettings.dashArray,
                'stroke-width': this.axisWidth,
                'clip-path': 'url(#' + this.clipId + ')'
            };
            spark.svgObject.appendChild(spark.renderer.drawLine(xAxis));
        }
    }
    /**
     * To trigger point render event
     */
    private triggerPointRender(name: string, i: number, fill: string, border: SparklineBorderModel): ISparklinePointEventArgs {
        const args: ISparklinePointEventArgs = {
            name: name, cancel: false,
            border: border, fill: fill,
            sparkline: this.sparkline,
            pointIndex: i
        };
        this.sparkline.trigger(name, args);
        return args;
    }
}
