import { Sparkline, IAxisRenderingEventArgs, ISeriesRenderingEventArgs, SparklineValueType} from '../index';
import { ISparklinePointEventArgs, IMarkerRenderingEventArgs, IDataLabelRenderingEventArgs } from '../index';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { PathOption, SparkValues, drawPath, drawRectangle, RectOption, Rect, CircleOption, drawCircle } from '../utils/helper';
import { measureText, renderTextElement, TextOption, Size } from '../utils/helper';
import { PaddingModel, AxisSettingsModel, SparklineMarkerSettingsModel, SparklineFontModel } from '../model/base-model';
import { SparklineDataLabelSettingsModel, SparklineBorderModel } from '../model/base-model';
import { RangeBandSettingsModel } from '../model/base-model';
import { EdgeLabelMode } from '../model/enum';

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
    private pointRegions: Rect[];
    private clipId: string;
    /**
     * To get visible points options internally.
     * @private
     */
    public visiblePoints: SparkValues[];
    private axisHeight: number;
    /**
     * To process highpoint index color for tooltip customization
     * @private
     */
    public highPointIndex: number;
    /**
     * To process low point index color for tooltip customization
     * @private
     */
    public lowPointIndex: number;
    /**
     * To process start point index color for tooltip customization
     * @private
     */
    public startPointIndex: number;
    /**
     * To process end point index color for tooltip customization
     * @private
     */
    public endPointIndex: number;
    /**
     * To process negative point index color for tooltip customization
     * @private
     */
    public negativePointIndexes: number[];

    /**
     * Sparkline data calculations
     * @param sparkline 
     */
    constructor(sparkline: Sparkline) {
        this.sparkline = sparkline;
    }
    /**
     * To process the sparkline data
     */
    public processData(data: Object[] = this.sparkline.dataSource): void {
        if (!this.sparkline.dataSource.length) {
            return;
        } else if (!isNaN(data[0] as number) || this.sparkline.valueType === 'Numeric') {
            this.sparkline.sparklineData = data; // extend([], data) as Object[];
        } else {
            this['process' + this.sparkline.valueType]();
        }
        this.axisCalculation();
    }
    /**
     * To process sparkline category data.
     */
    private processCategory(
        data: Object[] = this.sparkline.dataSource, x: string = this.sparkline.xName, y: string = this.sparkline.yName): void {
        let temp: Object[] = [];
        let xValues: string[] = [];
        data.forEach((value: object, index: number) => {
            if (xValues.indexOf(value[x]) === -1) {
                xValues.push(value[x]);
            }
            let currentData: object = {};
            currentData[this.sparkline.xName] = xValues.indexOf(value[x]);
            currentData[this.sparkline.yName] = value[y];
            temp.push(currentData);
        });
        this.sparkline.sparklineData = temp;
    }
    /**
     * To process sparkline DateTime data.
     */
    private processDateTime(
        data: Object[] = this.sparkline.dataSource, x: string = this.sparkline.xName, y: string = this.sparkline.yName): void {
        let temp: Object[] = [];
        data.forEach((value: object, index: number) => {
            let currentData: object = {};
            currentData[x] = value[x].getTime();
            currentData[y] = value[y];
            temp.push(currentData);
        });
        this.sparkline.sparklineData = temp;
    }
    /**
     * To render sparkline series.
     * @private
     */
    public renderSeries(): void {
        let spark: Sparkline = this.sparkline;
        this.clipId = spark.element.id + '_sparkline_clip_path';
        this.drawAxis();
        let args: ISeriesRenderingEventArgs = {
            name: 'seriesRendering', cancel: false, lineWidth: spark.lineWidth, border: spark.border, fill: spark.fill, sparkline: spark
        };
        spark.trigger(args.name, args);
        if (!this.visiblePoints || args.cancel) {
            return;
        }
        if (spark.type !== 'Pie' && spark.type !== 'WinLoss' && spark.rangeBandSettings.length) {
            let group: Element = this.sparkline.renderer.createGroup({id: this.sparkline.element.id + '_sparkline_rangeband_g'});
            for (let i: number = 0; i < spark.rangeBandSettings.length; i++) {
                if ((spark.axisSettings.minY <= spark.rangeBandSettings[i].startRange) ||
                    (spark.axisSettings.maxY >= spark.rangeBandSettings[i].endRange)) {
                    this.rangeBand(spark.rangeBandSettings[i], group, i);
                }
            }
            this.sparkline.svgObject.appendChild(group);
        }
        this['render' + spark.type](this.visiblePoints, args);
        this.renderMarker(this.visiblePoints);
        this.renderLabel(this.visiblePoints);
    }
    /**
     * To render a range band
     */
    private rangeBand(rangeBandSettings: RangeBandSettingsModel, group: Element, index: number): void {
        let model: Sparkline = this.sparkline;
        let height: number = (model.availableSize.height) - model.padding.top * 2;
        let width: number = (model.availableSize.width) - model.padding.left * 2;
        let stValue: number = rangeBandSettings.startRange;
        let edValue: number = rangeBandSettings.endRange;
        let stHeight: number = (height - ((height / this.unitY) * (stValue - this.min))) + model.padding.top;
        let edHeight: number = (height - ((height / this.unitY) * (edValue - this.min))) + model.padding.top;
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
        let path: string = 'M ' + (model.padding.left) + ' ' + stHeight + ' L ' + (width + (model.padding.left)) + ' ' + stHeight +
            ' L ' + (width + (model.padding.left)) + ' ' + edHeight + ' L ' + (model.padding.left) + ' ' + edHeight + ' Z ';
        let pathOption: PathOption = {
            'id': model.element.id + '_rangeBand_' + index,
            'fill': rangeBandSettings.color,
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
        let spark: Sparkline = this.sparkline;
        let g: Element = this.sparkline.renderer.createGroup({ id: spark.element.id + '_sparkline_g',
        'clip-path': 'url(#' + this.clipId + ')' });
        let pathOption: PathOption = new PathOption(
            spark.element.id + '_sparkline_line', 'transparent', args.lineWidth, args.fill, spark.opacity);
        let d: string = '';
        for (let i: number = 0, len: number = points.length; i < len; i++) {
            if (i === 0) {
                d = 'M ' + points[0].x + ' ' + points[i].y + ' ';
            }
            d += 'L ' + points[i].x + ' ' + points[i].y + ' ';
        }
        pathOption.d = d;
        drawPath(this.sparkline, pathOption, g);
        this.sparkline.svgObject.appendChild(g);
    }
    /**
     * To render pie series
     */
    /* tslint:disable:no-string-literal */
    private renderPie(points: SparkValues[], args: ISeriesRenderingEventArgs): void {
        let spark: Sparkline = this.sparkline;
        let height: number = spark.availableSize.height - (spark.padding.top + spark.padding.bottom);
        let width: number = spark.availableSize.width - (spark.padding.left + spark.padding.right);
        let area: number = (height <= width) ? height / 2 : width / 2;
        let X: number = spark.availableSize.width / 2;  // center position of x
        let Y: number = spark.availableSize.height / 2; // center position of y
        let deg: number = 0;
        let stRad: number;
        let edRad: number;
        let stroke: string = args.border.color;
        let opacity: number = spark.opacity;
        let strokeWidth: number = args.border.width;
        let colors: string[] = (spark.palette.length) ? spark.palette : ['#00bdae', '#404041', '#357cd2', '#e56590', '#f8b883',
            '#70ad47', '#dd8abd', '#7f84e8', '#7bb4eb', '#ea7a57'];
        let group: Element = this.sparkline.renderer.createGroup({ id: spark.element.id + '_sparkline_g' });
        let low: number;
        let high: number;
        let locations: SparkValues[] = extend([], [], points) as SparkValues[];
        if (spark.highPointColor || spark.lowPointColor) {
            let pointsYvalues: number[] = locations.map((a: SparkValues) => { return a.yVal; });
            low = Math.min.apply(null, pointsYvalues);
            high = Math.max.apply(null, pointsYvalues);
        }
        this.negativePointIndexes = [];
        for (let i: number = 0, stDeg: number = 90, edDeg: number, flag: string; i < points.length; i++) {
            stDeg += deg;
            deg = points[i]['degree'];
            edDeg = stDeg + deg;
            stRad = (stDeg - 90) * Math.PI / 180.0;
            edRad = (edDeg - 90) * Math.PI / 180.0;
            points[i]['stAng'] = stRad;
            points[i]['endAng'] = edRad;
            flag = (deg < 180) ? '0' : '1';
            let temp: Object = points[i]['coordinates'] = {
                sX: X + (area * Math.cos(stRad)), sY: Y +
                    (area * Math.sin(stRad)), eX: X + (area * Math.cos(edRad)), eY: Y + (area * Math.sin(edRad))
            };
            let pathArc: string = 'M ' + X + ' ' + Y + ' L ' + temp['eX'] + ' ' + temp['eY'] + ' A ' + area + ' ' +
                area + ' 0 ' + flag + ',0 ' + temp['sX'] + ' ' + temp['sY'] + ' Z';
            let pathOption: PathOption = {
                'id': spark.element.id + '_sparkline_pie_' + i,
                'opacity': opacity,
                'fill': colors[i % colors.length],
                'stroke': stroke,
                'stroke-width': strokeWidth,
                'd': pathArc,
                'stroke-dasharray': ''
            };
            this.getPieSpecialPoint(points[i], spark, pathOption, i, high, low, points.length);
            let pointArgs: ISparklinePointEventArgs = this.triggerPointRender(
                'pointRendering', i, pathOption.fill, {color: stroke, width: strokeWidth});
            pathOption.fill = pointArgs.fill; pathOption.stroke = pointArgs.border.color;
            pathOption['stroke-width'] = pointArgs.border.width;
            if (!pointArgs.cancel) {
                let element: Element = drawPath(this.sparkline, pathOption, group);
                element.setAttribute('aria-label', spark.dataSource[i][spark.xName] + ' : ' + points[i].yVal);
            }
            let diffRadian: number = edRad - stRad;
            let mid: { x: number, y: number } = {
                x: X + ((area / 2) * Math.cos(stRad + (diffRadian / 2))),
                y: Y + ((area / 2) * Math.sin(stRad + (diffRadian / 2)))
            };
            points[i].location.x = mid.x; points[i].location.y = mid.y;
        }
        this.sparkline.svgObject.appendChild(group);
    }
    /**
     * To get special point color and option for Pie series.
     */
    private getPieSpecialPoint(temp: SparkValues, spark: Sparkline, option: PathOption, i: number,
                               high: number, low: number, length: number): void {
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
        let spark: Sparkline = this.sparkline;
        let group: Element = this.sparkline.renderer.createGroup({ id: spark.element.id + '_sparkline_g',
        'clip-path': 'url(#' + this.clipId + ')' });
        let pathOption: PathOption = new PathOption(
            spark.element.id + '_sparkline_area', args.fill, 0, 'transparent', spark.opacity);
        let d: string = '';
        let str: string = '';
        for (let i: number = 0, len: number = points.length; i < len; i++) {
            if (i !== 0) {
                str += 'L ' + points[i].x + ' ' + points[i].y + ' ';
            } else {
                d = 'M ' + points[i].x + ' ' + this.axisHeight + ' ';
                str = 'M ' + points[i].x + ' ' + points[i].y + ' ';
            }
            d += 'L ' + points[i].x + ' ' + points[i].y + ' ';
            if (i === (len - 1)) {
                d += 'L ' + points[i].x + ' ' + this.axisHeight + ' Z';
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
        let spark: Sparkline = this.sparkline;
        let locations: SparkValues[] = extend([], [], points) as SparkValues[];
        let group: Element = this.sparkline.renderer.createGroup({ id: spark.element.id + '_sparkline_g',
        'clip-path': 'url(#' + this.clipId + ')' });
        let lowPos: number;
        let highPos: number;
        if (this.sparkline.highPointColor || this.sparkline.lowPointColor) {
            let pointsYPos: number[] = locations.map((a: SparkValues) => { return a.markerPosition; });
            highPos = Math.min.apply(null, pointsYPos);
            lowPos = Math.max.apply(null, pointsYPos);
        }
        let id: string = spark.element.id + '_sparkline_column_';
        let rectOptions: RectOption = new RectOption(id, '', args.border, spark.opacity, null);
        let paletteLength: number = spark.palette.length;
        let temp: SparkValues;
        let len: number = points.length;
        this.negativePointIndexes = [];
        for (let i: number = 0; i < len; i++) {
            temp = points[i];
            rectOptions.id = id + i;
            rectOptions.fill = (paletteLength) ? spark.palette[i % paletteLength] : args.fill;
            rectOptions.rect = new Rect(temp.x, temp.y, temp.width, temp.height);
            this.getSpecialPoint(true, temp, spark, rectOptions, i, highPos, lowPos, len);
            temp.location.y = (temp.markerPosition <= this.axisHeight) ? temp.y : (temp.y + temp.height);
            temp.location.x = temp.x + (temp.width / 2);
            rectOptions.stroke = args.border.color ? (args.border.color) : rectOptions.fill;
            let pointArgs: ISparklinePointEventArgs = this.triggerPointRender(
                'pointRendering', i, rectOptions.fill, {color: rectOptions.stroke, width: args.border.width});
            rectOptions.fill = pointArgs.fill; rectOptions.stroke = pointArgs.border.color;
            rectOptions['stroke-width'] = pointArgs.border.width;
            if (!pointArgs.cancel) {
                let element: Element = drawRectangle(spark, rectOptions, group);
                element.setAttribute('aria-label', spark.dataSource[i][spark.xName] + ' : ' + points[i].yVal);
            }
        }
        this.sparkline.svgObject.appendChild(group);
    }
    /**
     * To render WinLoss series
     */
    private renderWinLoss(points: SparkValues[], args: ISeriesRenderingEventArgs): void {
        let spark: Sparkline = this.sparkline;
        let group: Element = this.sparkline.renderer.createGroup({ id: spark.element.id + '_sparkline_g',
        'clip-path': 'url(#' + this.clipId + ')' });
        let id: string = spark.element.id + '_sparkline_winloss_';
        let options: RectOption = new RectOption(id, '', args.border, spark.opacity, null);
        let temp: SparkValues;
        let len: number = points.length;
        let paletteLength: number = spark.palette.length;
        for (let i: number = 0; i < len; i++) {
            temp = points[i];
            options.id = id + i;
            options.fill = (paletteLength) ? spark.palette[i % paletteLength] : ((temp.yVal === this.axisValue) ?
            (this.sparkline.tiePointColor || '#a216f3') : ((temp.yVal > this.axisValue) ? args.fill :
            (spark.negativePointColor || '#e20f07')));
            options.stroke = (args.border.color) ? (args.border.color) : options.fill;
            options.rect = new Rect(temp.x, temp.y, temp.width, temp.height);
            temp.location.x = temp.x + (temp.width / 2);
            temp.location.y = (temp.yVal >= this.axisValue) ? (temp.y) : (temp.y + temp.height);
            let pointArgs: ISparklinePointEventArgs = this.triggerPointRender(
                'pointRendering', i, options.fill, {color: options.stroke, width: args.border.width});
            options.fill = pointArgs.fill; options.stroke = pointArgs.border.color;
            options['stroke-width'] = pointArgs.border.width;
            if (!pointArgs.cancel) {
                let element: Element = drawRectangle(spark, options, group);
                element.setAttribute('aria-label', spark.dataSource[i][spark.xName] + ' : ' + points[i].yVal);
            }
        }
        this.sparkline.svgObject.appendChild(group);
    }
    private renderMarker(points: SparkValues[]): void {
        let spark: Sparkline = this.sparkline;
        let marker: SparklineMarkerSettingsModel = spark.markerSettings;
        if ((spark.type === 'Pie' || spark.type === 'WinLoss' || !marker.visible.length)) {
            return;
        }
        let locations: SparkValues[] = extend([], [], points) as SparkValues[];
        let group: Element = this.sparkline.renderer.createGroup({
            id: spark.element.id + '_sparkline_marker_g',
            'clip-path': 'url(#' + this.clipId + ')'
        });
        let temp: SparkValues;
        let id: string = spark.element.id + '_sparkline_marker_';
        let option: CircleOption = new CircleOption('', marker.fill, marker.border, marker.opacity, 0, 0, marker.size / 2, '');
        let highPos: number;
        let lowPos: number;
        let visible: string = marker.visible.join();
        if ((visible.toLowerCase().indexOf('high') > -1) || (visible.toLowerCase().indexOf('low') > -1)) {
            let pointsYPos: number[] = locations.map((a: SparkValues) => { return a.markerPosition; });
            highPos = Math.min.apply(null, pointsYPos);
            lowPos = Math.max.apply(null, pointsYPos);
        }
        this.negativePointIndexes = [];
        for (let i: number = 0, length: number = points.length; i < length; i++) {
            temp = points[i];
            option.id = id + i;
            option.cx = temp.location.x;
            option.cy = temp.location.y;
            option.fill = marker.fill;
            let render: boolean = (visible.toLowerCase().indexOf('all') > -1);
            render = this.getSpecialPoint(render, temp, spark, option, i, highPos, lowPos, length, visible.toLowerCase());
            option.stroke = marker.border.color || option.fill;
            let markerArgs: IMarkerRenderingEventArgs = {
                name: 'markerRendering', cancel: false, border: { color: option.stroke, width: marker.border.width }, fill: option.fill,
                pointIndex: i, sparkline: this.sparkline, x: option.cx, y: option.cy, size: marker.size
            };
            this.sparkline.trigger(markerArgs.name, markerArgs);
            if (render && !markerArgs.cancel) {
                option.fill = markerArgs.fill; option.stroke = markerArgs.border.color;
                option['stroke-width'] = markerArgs.border.width;
                option.r = markerArgs.size / 2;
                let element: Element = drawCircle(spark, option, group);
                element.setAttribute('aria-label', spark.dataSource[i][spark.xName] + ' : ' + points[i].yVal);
            }
        }
        this.sparkline.svgObject.appendChild(group);
    }
    /**
     * To get special point color and option.
     */
    private getSpecialPoint(render: boolean, temp: SparkValues, spark: Sparkline, option: PathOption, i: number, highPos: number,
                            lowPos: number, length: number, visible: string = ''): boolean {
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
        return render;
    }
    /**
     * To render data label for sparkline.
     */
    private renderLabel(points: SparkValues[]): void {
        let spark: Sparkline = this.sparkline;
        let dataLabel: SparklineDataLabelSettingsModel = spark.dataLabelSettings;
        let color: string = (spark.theme === 'Highcontrast') ? '#FFFFFF' : '#424242';
        color = (dataLabel.textStyle.color) ? dataLabel.textStyle.color : color;
        if ((spark.type === 'WinLoss' || !dataLabel.visible.length)) {
            return;
        }
        let locations: SparkValues[] = extend([], [], points) as SparkValues[];
        let id: string = spark.element.id + '_sparkline_label_';
        let group: Element = this.sparkline.renderer.createGroup({ id: spark.element.id + '_sparkline_label_g',
        style: 'pointer-events: none;' });
        let g: Element;
        let temp: SparkValues;
        let textId: string = id + 'text_';
        let rectId: string = id + 'rect_';
        let option: TextOption = new TextOption('', 0, 0, 'middle', '', 'middle');
        let labelStyle: SparklineFontModel = dataLabel.textStyle;
        let pointsYPos: number[] = locations.map((a: SparkValues) => { return a.markerPosition; });
        let highPos: number = Math.min.apply(null, pointsYPos);
        let lowPos: number = Math.max.apply(null, pointsYPos);
        let space: number = 1;
        let padding: number = (dataLabel.fill !== 'transparent' || dataLabel.border.width) ? 2 : 0;
        let size: Size = measureText('sparkline_measure_text', labelStyle);
        let rectOptions: RectOption = new RectOption('', dataLabel.fill, dataLabel.border, dataLabel.opacity, null);
        let edgeLabelOption: {x: number, render: boolean};
        for (let i: number = 0, length: number = points.length; i < length; i++) {
            temp = points[i];
            option.id = textId + i;
            option.x = temp.location.x + dataLabel.offset.x;
            option.y = ((spark.type === 'Pie') ? temp.location.y : ((temp.markerPosition > this.axisHeight) ? (temp.location.y +
                (size.height / 2) + space + padding) : (temp.location.y - (size.height / 2) - space - padding))) + dataLabel.offset.y;
            option.text = (dataLabel.format !== '') ? this.formatter(dataLabel.format, this.sparkline.dataSource[i]) :
            temp.yVal.toString();
            let labelArgs: IDataLabelRenderingEventArgs = {
                name: 'dataLabelRendering', cancel: false, border: dataLabel.border, fill: dataLabel.fill, pointIndex: i,
                sparkline: this.sparkline, x: option.x, y: option.y, text: option.text, color: color
            };
            this.sparkline.trigger(labelArgs.name, labelArgs);
            size = measureText(labelArgs.text, labelStyle);
            option.text = labelArgs.text;
            let render: boolean = (dataLabel.visible.join().toLowerCase().indexOf('all') > -1);
            render = this.getLabelVisible(render, temp, i, dataLabel, length, highPos, lowPos);
            edgeLabelOption = this.arrangeLabelPosition(dataLabel.edgeLabelMode, render, labelArgs.x, i, length, size, padding);
            if (render && !labelArgs.cancel && edgeLabelOption.render) {
                rectOptions.id = rectId + i;
                rectOptions.fill = labelArgs.fill; rectOptions.stroke = labelArgs.border.color;
                rectOptions['stroke-width'] = labelArgs.border.width;
                option.x = edgeLabelOption.x; option.y = labelArgs.y;
                rectOptions.rect = new Rect(
                    option.x - ((size.width / 2) + padding), (option.y - padding - (size.height / 1.75)), size.width + (padding * 2),
                    size.height + (padding * 2));
                g = this.sparkline.renderer.createGroup({ id: id + 'g' + i });
                drawRectangle(spark, rectOptions, g);
                renderTextElement(option, labelStyle, labelArgs.color, g);
                group.appendChild(g);
            }
        }
        this.sparkline.svgObject.appendChild(group);
    }
    private arrangeLabelPosition(
        edgeLabel: EdgeLabelMode, render: boolean, x: number, index: number, length: number, size: Size, padding: number
    ): {x: number, render: boolean} {
        if (edgeLabel === 'None') {
            return {x, render};
        }
        if (index === 0 && ((x - (size.width / 2) - padding) <= 0)) {
            if (edgeLabel === 'Hide') {
                render = false;
            } else {
                x = this.sparkline.padding.left + padding + (size.width / 2);
            }
        } else if (index === length - 1 && ((x + (size.width / 2) + padding)  >= this.sparkline.availableSize.width)) {
            if (edgeLabel === 'Hide') {
                render = false;
            } else {
                x -= (size.width / 2 + padding);
            }
        }
        return {x, render};
    }
    /**
     * To get special point color and option.
     */
    private getLabelVisible(render: boolean, temp: SparkValues, i: number, label: SparklineDataLabelSettingsModel, length: number,
                            highPos: number, lowPos: number): boolean {
        let labelVisible: string = label.visible.join().toLowerCase();
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
        return render;
    }
    /**
     * To format text
     */
    private formatter(format: string, data: object): string {
        if (isNullOrUndefined(format)) {
            return null;
        }
        let keys: string[] = Object.keys(data);
        for (let key of keys) {
            format = format.split('${' + key + '}').join(data[key]);
        }
        return format;
    }
    /**
     * To calculate min max for x and y axis
     */
    private axisCalculation(): void {
        this.findRanges(this.sparkline.sparklineData);
    }
    /**
     * To find x axis interval.
     */
    private getInterval(data: Object[], x: string, type: SparklineValueType): number {
        let interval: number  = 1;
        let x1: number = data[0][x];
        let x2: number = isNullOrUndefined(data[1]) ? undefined : data[1][x];
        if (!isNullOrUndefined(x1) && !isNullOrUndefined(x2)) {
            let temp: object[] = extend([], data) as Object[];
            let validData: object[] = [];
            temp.forEach((value: object) => {
                if (!isNullOrUndefined(value[x])) {
                    validData.push(value);
                }
            });
            validData.sort((a: object, b: object) => {
                if (isNullOrUndefined(a[x]) || isNullOrUndefined(b[x])) {
                    return 0;
                }
                return a[x] - b[x];
            });
            interval = validData[1][x] - validData[0][x];
        }
        return interval;
    }
    /**
     * To calculate axis ranges internally.
     */
    // tslint:disable-next-line:max-func-body-length
    private findRanges(data: Object[]): void {
        let model: Sparkline = this.sparkline;
        let max: number; let min: number; let minX: number; let maxX: number;
        let maxPointsLength: number = data.length;
        let temp: object[];
        let sumofValues: number = 0;
        let isNumericArray: boolean = Array.isArray(data) && typeof data[0] !== 'object';
        if (isNumericArray) {
            if (model.type === 'Pie') {
                for (let i: number = 0; i < maxPointsLength; i++) {
                    sumofValues += Math.abs(data[i] as number);
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
                    sumofValues += Math.abs(data[i][model.yName]);
                }
            } else {
                if (isNullOrUndefined(data[0][model.xName])) {
                    let x: number[] = data.map((z: object) => { return z[model.yName]; });
                    max = Math.max.apply(null, x); min = Math.min.apply(null, x);
                } else {
                    temp = extend([], data) as Object[];
                    temp = temp.sort((a: object, b: object) => { return a[model.yName] - b[model.yName]; });
                    max = temp[temp.length - 1][model.yName];
                    min = temp[0][model.yName];
                }
                if (!isNullOrUndefined(data[0][model.xName])) {
                    temp = temp.sort((a: object, b: object) => { return a[model.xName] - b[model.xName]; });
                    maxX = temp[temp.length - 1][model.xName];
                    minX = temp[0][model.xName];
                } else {
                    minX = 0;
                    maxX = maxPointsLength - 1;
                }
            }
        }
        let y2: number; let height: number; let width: number; let x1: number = 0; let y1: number;
        let padding: PaddingModel = model.padding; let point: SparkValues;
        let axis: AxisSettingsModel = model.axisSettings;
        let value: number = axis.value;
        if (model.type !== 'Pie') {
            this.maxLength = maxPointsLength;
            height = model.availableSize.height - (padding.bottom + padding.top);
            width = model.availableSize.width - (padding.left + padding.right);
            maxX = isNullOrUndefined(axis.maxX) ? maxX : axis.maxX;
            minX = isNullOrUndefined(axis.minX) ? minX : axis.minX;
            max = isNullOrUndefined(axis.maxY) ? max : axis.maxY;
            min = isNullOrUndefined(axis.minY) ? min : axis.minY;
            let color: string = (model.theme === 'Highcontrast') ? '#FFFFFF' : '#000000';
            color = (axis.lineSettings.color) ? axis.lineSettings.color : color;
            let eventArgs: IAxisRenderingEventArgs = {
                name: 'axisRendering', cancel: false, sparkline: model, maxX: maxX, minX: minX, maxY: max, minY: min,
                value: axis.value, lineColor: color, lineWidth: axis.lineSettings.width
            };
            model.trigger('axisRendering', eventArgs);
            if (eventArgs.cancel) {
                this.visiblePoints = [];
                return;
            }
            maxX = eventArgs.maxX; minX = eventArgs.minX;
            max = eventArgs.maxY; min = eventArgs.minY;
            value = this.axisValue = eventArgs.value; this.axisColor = eventArgs.lineColor; this.axisWidth = eventArgs.lineWidth;
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
        }
        let percent: number; let x: number; let y: number;
        let visiblePoints: SparkValues[] = [];
        let interval: number = this.getInterval(data, model.xName, model.valueType);
        for (let i: number = 0; i < maxPointsLength; i++) {
            if (isNullOrUndefined(data[i][model.xName]) && isNullOrUndefined(data[i][model.yName]) && ((data[i][model.yName]) !== 0)
            && isNumericArray) {
                x = i; y = data[i] as number;
            } else if (isNullOrUndefined(data[i][model.xName])) {
                x = i; y = data[i][model.yName];
            } else {
                x = data[i][model.xName]; y = data[i][model.yName];
            }
            if (isNullOrUndefined(x) || isNullOrUndefined(y)) {
                continue;
            }
            if (model.type === 'Line' || model.type === 'Area') {
                y2 = (min !== max && maxPointsLength !== 1) ? height - Math.round(height * ((y - min) / this.unitY)) : padding.top;
                point = { x: (minX !== maxX) ? Math.round(width * ((x - minX) / this.unitX)) : width / 2, y: y2, markerPosition: y2 };
            } else if (model.type === 'Column' || model.type === 'WinLoss') {
                let colWidth: number = width / (((maxX - minX) / interval) + 1);
                let calSpace: number = 0.5;
                let space: number = (calSpace * 2); //calspace is default space for column and winloss
                colWidth -= (space);
                x1 = (((x - minX) / interval) * (colWidth + space)) + (space / 2);
                if (model.type === 'WinLoss') {
                    // win or gain column height half of the height , draw(zero) height factor
                    let winLossFactor: number = 0.5;
                    let drawHeightFactor: number = 40;
                    y2 = (y > value) ? (height / 4) : (y < value) ? (height * winLossFactor) :
                        ((height * winLossFactor) - (height / drawHeightFactor));
                    point = { x: x1, y: y2, height: (y !== value) ? (height / 4) : height / 20, width: colWidth,
                    markerPosition: (y2 > y1) ? (y1 + Math.abs(y2 - y1)) : y2 };
                } else {
                    let z: number = ((height / this.unitY) * (y - min));
                    let z1: number = (y === min && y > value) ? ((maxPointsLength !== 1 && this.unitY !== 1) ?
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
            point.location = {x: point.x, y: point.y};
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
        let spark: Sparkline = this.sparkline;
        let height: number = this.axisHeight;
        if ((spark.type !== 'WinLoss') && (spark.type !== 'Pie') && spark.axisSettings.lineSettings.visible) {
            let xAxis: object = {
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
        let args: ISparklinePointEventArgs = {
            name: name, cancel: false, border: border, fill: fill, sparkline: this.sparkline, pointIndex: i
        };
        this.sparkline.trigger(name, args);
        return args;
    }
}