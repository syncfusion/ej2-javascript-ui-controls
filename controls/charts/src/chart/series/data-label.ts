import { ChartLocation, ColorValue, RectOption, isCollide, isOverlap, LabelLocation, rotateTextSize } from '../../common/utils/helper';
import { markerAnimate, appendChildElement, getVisiblePoints } from '../../common/utils/helper';
import { getLabelText, convertHexToColor, calculateRect, textElement, colorNameToHex, animateTextElement } from '../../common/utils/helper';
import { Chart } from '../chart';
import { Size, measureText, TextOption, Rect, SvgRenderer, CanvasRenderer, PathOption } from '@syncfusion/ej2-svg-base';
import { BorderModel, MarginModel, FontModel, SmartLabelSettingsModel, ConnectorLineStyleModel } from '../../common/model/base-model';
import { DataLabelSettingsModel, MarkerSettingsModel } from '../series/chart-series-model';
import { ErrorBarDirection } from '../utils/enum';
import { Series, Points } from './chart-series';
import { getSideBySideInterval } from './column-base';
import { ITextRenderEventArgs } from '../../chart/model/chart-interface';
import { textRender } from '../../common/model/constants';
import {
    createTemplate, getFontStyle, getElement, measureElementRect, templateAnimate, withIn, withInBounds
} from '../../common/utils/helper';
import { createElement, getValue, extend, initializeTelemetryFeature, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Alignment, LabelPosition } from '../../common/utils/enum';
import { getPoint, isRotatedRectIntersect } from '../../common/utils/helper';
import { Axis } from '../../chart/axis/axis';

/**
 * Metadata captured for one data label instance during Smart Labels Pass 1 (series rendering).
 * Nothing is drawn when this is created - Pass 2 (renderSmartLabels) consumes these once every
 * series, marker and series-element bound on the chart is known.
 *
 * @private
 */
interface SmartLabelPendingInfo {
    series: Series;
    point: Points;
    dataLabel: DataLabelSettingsModel;
    text: string;
    /** Resolved final text color (argsData.font.color, else the same contrast-based fallback the normal path uses). */
    color: string;
    /** The label's background/shape fill (argsData.color - may differ from dataLabel.fill via the textRender event). */
    backgroundFill: string;
    /** The label's border (argsData.border - may differ from dataLabel.border via the textRender event). */
    border: BorderModel;
    /** The label's font (argsData.font - may differ from dataLabel.font via the textRender event). */
    font: FontModel;
    /** Whether this label draws a background shape at all (this.isShape, snapshotted per-label). */
    isShape: boolean;
    textSize: Size;
    /** The rect the legacy (non-smart) positioning logic would have used, in chart/plot-area space. */
    desiredRect: Rect;
    /** The point's symbol location, in chart/plot-area space. */
    anchor: ChartLocation;
    /** The point's own series-element bounds (column/bar/candle rect, etc.), in chart/plot-area space. */
    ownRegion: Rect | null;
    labelIndex: number;
    /** The series clip rect, kept so Pass 2 can convert absolute chart-space rects back to clip-relative
     * coordinates when drawing (drawSmartLabelElement / drawConnectorLine re-apply this offset). */
    clip: Rect;
}

/**
 * Rendered geometry of one series, used by `smartLabelSettings.seriesOverlapAction`.
 * Everything is in chart/plot-area space.
 *
 * @private
 */
interface SeriesElementBounds {
    series: Series;
    /** Rectangular elements (column, bar, candle ...). */
    bounds: Rect[];
    /** Polylines sampled from the rendered path (line, spline, area outline, trendline ...). */
    paths: ChartLocation[][];
    /** Half of the stroke width of the path. */
    halfWidth: number;
    /** True when the path encloses a filled region (area series). */
    isArea: boolean;
}

/**
 * A rendered, non-relocated data label that must be hidden if it overlaps a series element.
 *
 * @private
 */
interface SeriesOverlapLabel {
    series: Series;
    point: Points;
    rect: Rect;
    textElement: Element;
    shapeId: string;
}

/**
 * The `DataLabel` module is used to render data labels for data points.
 */
export class DataLabel {

    private chart: Chart;
    private margin: MarginModel;
    private isShape: boolean;
    private locationX: number;
    private locationY: number;
    private fontBackground: string;
    private borderWidth: number;
    private markerHeight: number;
    public commonId: string;
    private yAxisInversed: boolean;
    private inverted: boolean;
    private errorHeight: number = 0;
    private chartBackground: string;
    private extraSpace: number;
    /**
     * Stores the resolved label position selected during automatic
     * collision resolution.
     *
     * @private
     */
    private actualPosition: LabelPosition = 'Middle';
    /** @private */
    public dataLabelRectCollection: { [id: string]: Rect } = {};
    /** @private */
    public repositionedLabels: Rect[] = [];
    /** Keys (label text + point location) of labels already rendered, used by `showDuplicateLabels`. */
    private renderedLabelKeys: { [key: string]: boolean } = {};
    private keyCollectionOwner: Rect[];
    /**
     * Smart Labels (enableSmartLabels) Pass 1 storage: one entry per data label instance whose
     * placement has been deferred to Pass 2 (renderSmartLabels). Cleared at the end of Pass 2.
     *
     * @private
     */
    public pendingSmartLabels: SmartLabelPendingInfo[] = [];
    /**
     * Labels rendered while `seriesOverlapAction` is 'Hide', checked once all series elements exist.
     *
     * @private
     */
    public seriesOverlapLabels: SeriesOverlapLabel[] = [];
    /** Series element geometry used while Smart Labels are placed; null when not required. */
    private seriesElementBounds: SeriesElementBounds[] = null;
    /**
     * Constructor for the data label module.
     *
     * @private
     */

    constructor(chart: Chart) {
        initializeTelemetryFeature('DataLabel', 'Charts');
        this.chart = chart;
    }

    private initPrivateVariables(series: Series, marker: MarkerSettingsModel): void {
        let transform: string = '';
        let clipPath: string = '';
        const isBubbleCanvasMode: boolean = this.chart.enableCanvas && series.type === 'Bubble' && marker.dataLabel.visible;
        const render: SvgRenderer | CanvasRenderer = isBubbleCanvasMode ? this.chart.svgRenderer : series.chart.renderer;
        const index: number | string = (series.index === undefined) ? series.category : series.index;
        if (series.chart.chartAreaType === 'Cartesian') {
            transform = 'translate(' + series.clipRect.x + ',' + (series.clipRect.y) + ')';
            clipPath = 'url(#' + this.chart.element.id + '_ChartSeriesClipRect_' + index + ')';
        }
        if ((marker.dataLabel.visible && !this.chart.enableCanvas) || isBubbleCanvasMode) {
            series.shapeElement = render.createGroup({
                'id': this.chart.element.id + 'ShapeGroup' + index,
                'transform': transform,
                'clip-path': 'url(#' + this.chart.element.id + '_ChartSeriesClipRect_' + index + ')'
            });
            series.textElement = render.createGroup({
                'id': this.chart.element.id + 'TextGroup' + index,
                'transform': transform,
                'clip-path': clipPath
            });
            series.textElement.setAttribute('aria-hidden', 'true');
        }
        this.markerHeight = ((series.type === 'Scatter' || marker.visible)) ? (marker.height / 2) : 0;
        this.commonId = this.chart.element.id + '_Series_' + index + '_Point_';
        this.calculateErrorHeight(series, series.marker.dataLabel.position);
        this.chartBackground = this.chart.chartArea.background === 'transparent' ?
            this.chart.background || this.chart.themeStyle.background : this.chart.chartArea.background;
    }

    private calculateErrorHeight(series: Series, position: LabelPosition): void {
        if (!series.errorBar.visible) {
            return null;
        } else if (series.errorBar.visible && this.chart.chartAreaType !== 'PolarRadar') {
            const direction: ErrorBarDirection = series.errorBar.direction;
            const positiveHeight: number = this.chart.errorBarModule.positiveHeight;
            const negativeHeight: number = this.chart.errorBarModule.negativeHeight;
            if (this.isRectSeries(series)) {
                if (position === 'Top' || position === 'Auto') {
                    if (direction === 'Both' || direction === 'Minus') {
                        this.errorHeight = negativeHeight;
                    } else {
                        this.errorHeight = 0;
                    }
                }
                if (position === 'Outer' || position === 'Auto') {
                    if (direction === 'Both' || direction === 'Plus') {
                        this.errorHeight = positiveHeight;
                    } else {
                        this.errorHeight = 0;
                    }
                }
            } else {
                if (position === 'Top' || position === 'Outer' || position === 'Auto') {
                    if ((direction === 'Both' || direction === 'Plus') && (!series.chart.isTransposed)) {
                        this.errorHeight = positiveHeight;
                    } else {
                        this.errorHeight = 0;
                    }
                }
                if (position === 'Bottom' || position === 'Auto') {
                    if (direction === 'Both' || direction === 'Minus') {
                        this.errorHeight = negativeHeight;
                    } else {
                        this.errorHeight = 0;
                    }
                }
            }
        } else {
            this.errorHeight = 0;
        }
    }

    private isRectSeries(series: Series): boolean {
        return series.isRectSeries || series.type === 'RangeArea' || series.type === 'SplineRangeArea' || series.type === 'RangeStepArea';
    }

    /**
     * Render the data label for series.
     *
     * @param {Series} series - The series to render.
     * @param {Chart} chart - The parent chart.
     * @param {DataLabelSettingsModel} dataLabel - The settings for data labels.
     * @returns {void}
     * @private
     */
    public render(series: Series, chart: Chart, dataLabel: DataLabelSettingsModel): void {
        // initialize the private variable
        this.initPrivateVariables(series, series.marker);
        this.inverted = chart.requireInvertedAxis;
        this.yAxisInversed = series.yAxis.isAxisInverse;
        if ((series.type.indexOf('StackingColumn') > -1 || series.type.indexOf('StackingBar') > -1) &&
            this.repositionedLabels.length > 0 && this.chart.dataLabelCollections.length === 0) {
            this.repositionedLabels = [];
        }
        if (this.keyCollectionOwner !== this.chart.dataLabelCollections) {
            this.keyCollectionOwner = this.chart.dataLabelCollections;
            this.renderedLabelKeys = {};
        }
        const templateId: string = chart.element.id + '_Series_' +
            (series.index === undefined ? series.category : series.index) + '_DataLabelCollections';
        const element: HTMLElement = createElement('div', {
            id: templateId
        });
        const visiblePoints: Points[] = getVisiblePoints(series);
        const secondaryElement: Element = getElement(chart.element.id + '_Secondary_Element');
        const isBubbleCanvasMode: boolean = chart.enableCanvas && series.type === 'Bubble' && dataLabel.visible;
        // Data label point iteration started
        if (series.visible) {
            for (let i: number = 0; i < visiblePoints.length; i++) {
                this.renderDataLabel(series, visiblePoints[i as number], element, dataLabel);
            }
        }
        if (isBubbleCanvasMode) {
            let labelSvg: Element = getElement(chart.element.id + '_datalabel_svg');
            if (!labelSvg) {
                labelSvg = chart.svgRenderer.createSvg({
                    id: chart.element.id + '_datalabel_svg',
                    width: chart.availableSize.width,
                    height: chart.availableSize.height
                });
                (labelSvg as SVGElement).style.cssText = 'position:absolute; display:block; pointer-events:none;';
                secondaryElement.appendChild(labelSvg);
            }
            if (series.shapeElement && series.shapeElement.parentNode !== labelSvg) {
                labelSvg.appendChild(series.shapeElement);
            }
            if (series.textElement && series.textElement.parentNode !== labelSvg) {
                labelSvg.appendChild(series.textElement);
            }
            if (element.childElementCount) {
                appendChildElement(chart.enableCanvas, secondaryElement, element, chart.redraw,
                                   false, 'x', 'y', null, '', false, false, null, chart.duration);
            }
        }
        else if (element.childElementCount) {
            if (!chart.enableCanvas) {
                appendChildElement(chart.enableCanvas, getElement(chart.element.id + '_Secondary_Element'), element, chart.redraw,
                                   false, 'x', 'y', null, '', false, false, null, chart.duration);
            } else {
                getElement(chart.element.id + '_Secondary_Element').appendChild(element);
            }
        }
    }

    /**
     * Checks whether a label with the same text has already been rendered at the same point location,
     * and registers the label otherwise.
     *
     * @param {Points} point - The point being rendered.
     * @param {number} index - The label index of the point.
     * @param {string} text - The label text.
     * @returns {boolean} true if an identical label already exists at this location.
     */
    private isDuplicateLabel(point: Points, index: number, text: string): boolean {
        const location: ChartLocation = point.symbolLocations[index as number] || point.symbolLocations[0];
        if (!location) {
            return false;
        }
        const key: string = text + '|' + Math.round(location.x) + '|' + Math.round(location.y);
        if (this.renderedLabelKeys[key as string]) {
            return true;
        }
        this.renderedLabelKeys[key as string] = true;
        return false;
    }

    public renderDataLabel(series: Series, point: Points, element: HTMLElement, dataLabel: DataLabelSettingsModel): Element[] {
        if (!dataLabel.showZero && ((point.y === 0) || (point.y === 0 && series.emptyPointSettings.mode === 'Zero'))) {
            return null;
        }
        this.margin = dataLabel.margin;
        let labelText: string[] = [];
        let labelLength: number;
        let xPos: number;
        let yPos: number;
        let xValue: number;
        let yValue: number;
        let degree: number;
        let rectCenterX: number; let rectCenterY: number;
        let labelLocation: LabelLocation = { x: 0, y: 0 };
        let textSize: Size;
        const clip: Rect = series.clipRect;
        let shapeRect: HTMLElement;
        let isDataLabelOverlap: boolean = false;
        const dataLabelElement: Element[] = [];
        let startLocation: ChartLocation;
        dataLabel.enableRotation = dataLabel.labelIntersectAction === 'Rotate90' ? true : dataLabel.enableRotation;
        const angle: number = degree = dataLabel.labelIntersectAction === 'Rotate90' ? 90 : dataLabel.angle;
        const border: BorderModel = { width: dataLabel.border.width, color: dataLabel.border.color };
        const argsFont: FontModel = <FontModel>(extend({}, getValue('properties', dataLabel.font), null, true));
        const isBubbleCanvasMode: boolean = this.chart.enableCanvas && series.type === 'Bubble';
        if (
            (point.symbolLocations.length && point.symbolLocations[0]) ||
            (series.type === 'BoxAndWhisker' && point.regions.length)
        ) {
            labelText = point.text !== null ? getLabelText(point, series, this.chart) : [];
            labelLength = labelText.length;
            for (let i: number = 0; i < labelLength; i++) {
                const argsData: ITextRenderEventArgs = {
                    cancel: false, name: textRender, series: series,
                    point: point, text: labelText[i as number], border: border,
                    color: dataLabel.fill, template: dataLabel.template, font: argsFont, location: labelLocation,
                    textSize: measureText(labelText[i as number], dataLabel.font, this.chart.themeStyle.datalabelFont)
                };
                this.chart.trigger(textRender, argsData);
                if (!argsData.cancel && !this.chart.showDuplicateLabels && this.isDuplicateLabel(point, i, argsData.text)) {
                    continue;
                }
                if (!argsData.cancel) {
                    this.fontBackground = argsData.color;
                    this.isDataLabelShape(argsData, this.chart.enableSmartLabels ? dataLabel.smartLabelSettings : null);
                    this.markerHeight = series.type === 'Bubble' ? (point.regions[0].height / 2) : this.markerHeight;
                    if (argsData.template !== null) {
                        this.createDataLabelTemplate(element, series, dataLabel, point, argsData, i, this.chart.redraw, angle);
                    } else {
                        // Split label text on newline characters to support multi-line data labels
                        const labelLines: string[] = typeof argsData.text === 'string'
                            ? argsData.text.split(/\r\n|\n/)
                            : [argsData.text];
                        const isMultiLine: boolean = labelLines.length > 1;
                        const useRotationForTextSize: boolean = dataLabel.enableRotation && !this.chart.enableSmartLabels;
                        if (useRotationForTextSize && isMultiLine) {
                            let maximumWidth: number = 0;
                            let totalHeight: number = 0;

                            for (const line of labelLines) {
                                const lineSize: Size = rotateTextSize(dataLabel.font, line, angle, this.chart,
                                                                      this.chart.themeStyle.datalabelFont);

                                maximumWidth = Math.max(maximumWidth, lineSize.width);
                                totalHeight += lineSize.height;
                            }

                            textSize = new Size(maximumWidth, totalHeight);
                        }
                        else if (useRotationForTextSize) {
                            textSize = rotateTextSize(dataLabel.font, labelLines[0], angle, this.chart,
                                                      this.chart.themeStyle.datalabelFont);
                        }
                        else if (isMultiLine) {
                            let maximumWidth: number = 0;
                            let totalHeight: number = 0;

                            for (const line of labelLines) {
                                const lineSize: Size = measureText(
                                    line,
                                    dataLabel.font,
                                    this.chart.themeStyle.datalabelFont
                                );

                                maximumWidth = Math.max(maximumWidth, lineSize.width);
                                totalHeight += lineSize.height;
                            }

                            textSize = new Size(maximumWidth, totalHeight);
                        }
                        else {
                            textSize = measureText(argsData.text, dataLabel.font, this.chart.themeStyle.datalabelFont);
                        }
                        const rect: Rect = this.calculateTextPosition(point, series, textSize, dataLabel, i, angle);
                        let unRotatedText: Size;

                        if (isMultiLine) {
                            let maximumWidth: number = 0;
                            let totalHeight: number = 0;

                            for (const line of labelLines) {
                                const lineSize: Size = measureText(
                                    line,
                                    dataLabel.font,
                                    this.chart.themeStyle.datalabelFont
                                );

                                maximumWidth = Math.max(maximumWidth, lineSize.width);
                                totalHeight += lineSize.height;
                            }

                            unRotatedText = new Size(maximumWidth, totalHeight);
                        } else {
                            unRotatedText = measureText(
                                argsData.text,
                                dataLabel.font,
                                this.chart.themeStyle.datalabelFont
                            );
                        }
                        rectCenterX = rect.x + (rect.width / 2);
                        rectCenterY = rect.y + (rect.height / 2);
                        const rotateRect: Rect = dataLabel.enableRotation
                            ? new Rect(
                                (rectCenterX - (unRotatedText.width / 2) - this.margin.left),
                                (rectCenterY - (unRotatedText.height / 2) - this.margin.top),
                                unRotatedText.width + this.margin.left + this.margin.right,
                                unRotatedText.height + this.margin.top + this.margin.bottom
                            )
                            : rect;
                        const actualRect: Rect = new Rect(rect.x + clip.x, rect.y + clip.y, rect.width, rect.height);
                        // StackingColumn (/StackingColumn100) specific: clamp the label rect inside the
                        // column rect when the natural position (e.g. 'Top') pushes it outside the column
                        // (very common for tiny bottom segments where position: 'Top' places the label
                        // below the column). This keeps the value readable inside its column.
                        if ((series.type === 'StackingColumn' || series.type === 'StackingColumn100') &&
                            (dataLabel.labelIntersectAction === 'RelocateVertically' || dataLabel.labelIntersectAction === 'RelocateHorizontally' || this.chart.enableSmartLabels)
                            && point.regions && point.regions[0] && !dataLabel.enableRotation) {
                            const colRect: Rect = point.regions[0];
                            const columnTop: number = colRect.y;
                            const columnBottom: number = colRect.y + colRect.height;
                            const labelRectY: number = rect.y;
                            const labelRectBottom: number = rect.y + rect.height;
                            const labelCenterY: number = (labelRectY + labelRectBottom) / 2;
                            const centerOutsideColumn: boolean = labelCenterY < columnTop || labelCenterY > columnBottom;
                            if (labelRectBottom <= columnTop || labelRectY >= columnBottom || centerOutsideColumn) {
                                let clampedY: number = columnTop;
                                if (rect.height >= colRect.height) {
                                    clampedY = Math.min(columnTop, columnBottom - rect.height);
                                }
                                rect.y = clampedY;
                                actualRect.y = clampedY + clip.y;
                            }
                        }
                        const isStackingBar: boolean = series.type === 'StackingBar' || series.type === 'StackingBar100';
                        const isStackingColumn: boolean = series.type === 'StackingColumn' || series.type === 'StackingColumn100';
                        //let notOverlapping: boolean;
                        if (this.chart.enableSmartLabels && !isStackingBar && !isStackingColumn && this.chart.chartAreaType !== 'PolarRadar') {
                            // Same visibility rule the regular path applies: no label for a point zoomed out of range.
                            if ((series.seriesType === 'XY' && point.yValue !== undefined && !withIn(point.yValue, series.yAxis.visibleRange)) ||
                                !withIn(point.xValue, series.xAxis.visibleRange)) {
                                continue;
                            }
                            const backgroundColorForContrast: string = this.fontBackground === 'transparent'
                                ? ((this.chart.theme.indexOf('Dark') > -1 || this.chart.theme.indexOf('HighContrast') > -1) ? 'black' : 'white')
                                : this.fontBackground;
                            const rgbForContrast: ColorValue = convertHexToColor(colorNameToHex(backgroundColorForContrast));
                            const contrastForText: number = Math.round(
                                ((rgbForContrast.r * 299) + (rgbForContrast.g * 587) + (rgbForContrast.b * 114)) / 1000
                            );
                            const resolvedTextColor: string = argsData.font.color || (
                                this.chart.theme === 'Bootstrap5' ? '#212529' :
                                    this.chart.theme === 'Bootstrap5Dark' ? '#DEE2E6' :
                                        ((contrastForText >= 128 || series.type === 'Hilo' || series.type === 'HiloOpenClose') ?
                                            (this.chart.theme.indexOf('Tailwind3') > -1 ? '#111827' : 'black') :
                                            (this.chart.theme.indexOf('Tailwind3') > -1 ? '#FFFFFF' : 'white'))
                            );
                            const ownRegionForIndex: Rect = ((point.regions && (point.regions[i as number] || point.regions[0])) ?
                                (point.regions[i as number] || point.regions[0]) : null) as Rect;
                            // Smart Labels always use angle=0; the user's rotation setting is ignored
                            // for the Smart Label flow (see block comment above).
                            const smartBorder: BorderModel = dataLabel.smartLabelSettings && dataLabel.smartLabelSettings.border;
                            const hasSmartBorder: boolean = !!smartBorder && !!smartBorder.color;
                            this.collectSmartLabel(
                                series, point, dataLabel, argsData.text, resolvedTextColor, dataLabel.smartLabelSettings.background ||
                                argsData.color, (hasSmartBorder ? smartBorder : argsData.border) as BorderModel,
                                argsData.font, this.isShape, textSize, rect, actualRect, i, clip, ownRegionForIndex
                            );
                            continue;
                        }
                        if (dataLabel.enableRotation) {
                            const rectCoordinates: ChartLocation[] = this.getRectanglePoints(actualRect);
                            rectCenterX = rotateRect.x + (rotateRect.width / 2);
                            rectCenterY = rotateRect.y + (rotateRect.height / 2);
                            isDataLabelOverlap = (dataLabel.labelIntersectAction === 'Rotate90' || angle === -90 || angle === 90) ?
                                false : this.isDataLabelOverlapWithChartBound(rectCoordinates, this.chart,
                                                                              { x: 0, y: 0, width: 0, height: 0 });
                            if (!isDataLabelOverlap) {
                                this.chart.rotatedDataLabelCollections.push(rectCoordinates);
                                const currentPointIndex: number = this.chart.rotatedDataLabelCollections.length - 1;
                                for (let index: number = currentPointIndex; index >= 0; index--) {
                                    if (this.chart.rotatedDataLabelCollections[currentPointIndex as number] &&
                                        this.chart.rotatedDataLabelCollections[index - 1] &&
                                        isRotatedRectIntersect(
                                            this.chart.rotatedDataLabelCollections[currentPointIndex as number],
                                            this.chart.rotatedDataLabelCollections[index - 1])
                                    ) {
                                        isDataLabelOverlap = true;
                                        this.chart.rotatedDataLabelCollections[currentPointIndex as number] = null;
                                        break;
                                    }
                                }
                            }
                        } else {
                            isDataLabelOverlap = isCollide(rect, this.chart.dataLabelCollections, clip);
                        }
                        // Handle data label rendering with overlap detection and smart repositioning.
                        const isRelocateAction: boolean = dataLabel.labelIntersectAction === 'RelocateVertically' ||
                            dataLabel.labelIntersectAction === 'RelocateHorizontally' || this.chart.enableSmartLabels;
                        const shouldUseSmartReposition: boolean = isDataLabelOverlap &&
                            isRelocateAction && (isStackingColumn || isStackingBar) &&
                            withInBounds(rect.x + clip.x, rect.y + clip.y, clip);

                        if ((!isDataLabelOverlap || dataLabel.labelIntersectAction === 'None' || shouldUseSmartReposition)) {
                            // On first render there is no pre-existing data label shape, so default the
                            // animation start location to (0, 0) to avoid passing undefined to appendChildElement.
                            startLocation = { x: 0, y: 0 };
                            const dataLabelShapeElement: Element = getElement(this.commonId + point.index + '_TextShape_' + i);
                            if (dataLabelShapeElement) {
                                startLocation = { x: +dataLabelShapeElement.getAttribute('x'), y: +dataLabelShapeElement.getAttribute('y') };
                            }

                            // For smart repositioned labels, we'll add the rect after calculating the new position
                            let smartLabelRect: Rect = actualRect;
                            if (this.isShape && !shouldUseSmartReposition) {
                                shapeRect = (isBubbleCanvasMode ? this.chart.svgRenderer : this.chart.renderer).drawRectangle(
                                    new RectOption(
                                        this.commonId + point.index + '_TextShape_' + i,
                                        argsData.color, argsData.border, dataLabel.opacity, rotateRect, dataLabel.rx,
                                        dataLabel.ry, '', dataLabel.border.dashArray
                                    ),
                                    new Int32Array([clip.x, clip.y])) as HTMLElement;
                                if (series.shapeElement) {
                                    if (isBubbleCanvasMode) {
                                        series.shapeElement.appendChild(shapeRect);
                                    } else {
                                        appendChildElement(this.chart.enableCanvas, series.shapeElement, shapeRect, this.chart.redraw, true, 'x', 'y', startLocation);
                                    }
                                }
                            }
                            // Checking the font color
                            const backgroundColor: string = this.fontBackground === 'transparent' ? ((this.chart.theme.indexOf('Dark') > -1 || this.chart.theme.indexOf('HighContrast') > -1) ? 'black' : 'white') : this.fontBackground;
                            const rgbValue: ColorValue = convertHexToColor(colorNameToHex(backgroundColor));
                            const contrast: number = Math.round((rgbValue.r * 299 + rgbValue.g * 587 + rgbValue.b * 114) / 1000);

                            // If smart reposition is needed, calculate new position at top of chart
                            let repositionedShapeRect: Rect = null;
                            if (shouldUseSmartReposition) {
                                const normalizedOffset: number = dataLabel.labelIntersectAction === 'RelocateHorizontally' || (this.chart.enableSmartLabels && dataLabel.labelIntersectAction !== 'RelocateVertically') ? 0 : dataLabel.smartLabelSettings.offset;

                                // Calculate x position based on normalized offset within the point's region
                                const pointRegion: Rect = point.regions[0];
                                if (isStackingBar) {
                                    // For StackingBar/StackingBar100: place labels to the right of the bar segment and
                                    // stack them to the left when they would overlap a previously positioned label.
                                    const pointRegion: Rect = point.regions[0];
                                    const textPadding: number = 2;
                                    const rowThreshold: number = Math.max(10, textSize.height * 0.3); // 30% of text height for DPI independence
                                    const labelCenterY: number = pointRegion.y + (pointRegion.height * normalizedOffset) -
                                     (textPadding * 2);
                                    yPos = labelCenterY + (textSize.height / 3);
                                    xPos = this.chart.enableRtl ? (series.type === 'StackingBar' ? clip.x + (textSize.height / 2) - textPadding : clip.width + (textSize.height / 2)) : (series.type === 'StackingBar' ? clip.width : 0) - (textSize.width / 2);

                                    // Calculate label vertical bounds in chart coordinates so the collision check is
                                    // aligned with the rendered text (top = yPos - textSize.height, bottom = yPos).
                                    let labelYMin: number = yPos - (textSize.height / 2);
                                    const labelYMax: number = yPos;
                                    for (const existingRect of this.repositionedLabels) {
                                        // Check if label is in approximately the same row (similar y-range)
                                        const existingYMin: number = existingRect.y;
                                        const existingYMax: number = existingRect.y + existingRect.height;

                                        // If labels overlap in Y-axis range, they're in the same row - stack them to the left
                                        if ((labelYMin <= existingYMax + rowThreshold) && (labelYMax >= existingYMin - rowThreshold)) {
                                            // Place this label to the left of the existing one, keeping the text padding
                                            xPos = this.chart.enableRtl ? Math.max(xPos, existingRect.x + existingRect.width +
                                                (textSize.width / 2) + textPadding) :
                                                Math.min(xPos, existingRect.x - (textSize.width / 2) - textPadding);
                                            if ((dataLabel.labelIntersectAction === 'RelocateHorizontally' || (this.chart.enableSmartLabels && dataLabel.labelIntersectAction !== 'RelocateVertically')) && xPos < pointRegion.x + pointRegion.width) {
                                                yPos += textPadding * 2;
                                                labelYMin += textPadding * 2;
                                            }
                                        }
                                    }

                                    // xValue should be the center of the label for proper rotation/alignment
                                    xValue = xPos + (textSize.width / 2);
                                    yValue = yPos + (textSize.height / 2);
                                    degree = 0;

                                    // Create a new rect for the repositioned label to track in collections
                                    const rectPadding: number = 1;
                                    smartLabelRect = new Rect(xPos - (textSize.width / 2) - rectPadding, labelYMin - (rectPadding * 2),
                                                              textSize.width + (rectPadding * 2), textSize.height - (rectPadding)
                                    );
                                    const collideWithExisting: boolean = isCollide(smartLabelRect, this.chart.dataLabelCollections, clip);
                                    if (collideWithExisting) {
                                        xPos = this.chart.enableRtl ? clip.width + (textSize.width / 2) : -(textSize.width / 2);
                                        smartLabelRect = new Rect(
                                            xPos - (textSize.width / 2) - rectPadding,
                                            yPos - (textSize.height / 2) - (rectPadding * 2),
                                            textSize.width + (rectPadding * 2),
                                            textSize.height - (rectPadding * 2)
                                        );
                                    }
                                    if (smartLabelRect.y + clip.y < 0 || smartLabelRect.y + smartLabelRect.height > clip.height) {
                                        continue;
                                    }

                                    // Add to repositioned labels tracking for stacking
                                    this.repositionedLabels.push(smartLabelRect);

                                    // Store the repositioned rect for shape creation later
                                    repositionedShapeRect = smartLabelRect;
                                } else {
                                    const regionStart: number = pointRegion.x;
                                    const labelCenterX: number = regionStart + (pointRegion.width * normalizedOffset);
                                    // Text rendering position (top-left) is center minus half width
                                    xPos = labelCenterX;
                                    const textPadding: number = 3;

                                    if (dataLabel.labelIntersectAction === 'RelocateHorizontally' || (this.chart.enableSmartLabels && dataLabel.labelIntersectAction !== 'RelocateVertically')) {
                                        xPos = regionStart;
                                        yPos = series.type === 'StackingColumn100'
                                            ? - textSize.height + textPadding * 2
                                            : textSize.height;
                                    } else {
                                        yPos = series.type === 'StackingColumn100'
                                            ? textSize.height - series.clipRect.y
                                            : textSize.height;
                                    }

                                    if (dataLabel.labelIntersectAction === 'RelocateHorizontally' || (this.chart.enableSmartLabels && dataLabel.labelIntersectAction !== 'RelocateVertically')) {
                                        const rowThreshold: number = Math.max(5, textSize.height * 0.2);
                                        let needsRowCheck: boolean = true;
                                        let rowCheckGuard: number = 0;
                                        while (needsRowCheck && rowCheckGuard < 50) {
                                            rowCheckGuard++;
                                            needsRowCheck = false;
                                            const labelYMin: number = yPos - textSize.height / 2;
                                            const labelYMax: number = yPos + textSize.height / 2;

                                            for (const existingRect of this.repositionedLabels) {
                                                // For horizontal stacking, check if label originates from the same point region
                                                // Labels that extend beyond point region width are still part of the same stacking group
                                                const samePoint: boolean = existingRect.x >= pointRegion.x - (textSize.width) &&
                                                    existingRect.x < pointRegion.x + pointRegion.width;

                                                if (samePoint) {
                                                    // Check if this existing label is in approximately the same row (Y range overlap)
                                                    const existingYMin: number = existingRect.y;
                                                    const existingYMax: number = existingRect.y + existingRect.height;

                                                    // ONLY check labels in the CURRENT row - not previous rows
                                                    if ((labelYMin <= existingYMax + rowThreshold) &&
                                                    (labelYMax >= existingYMin - rowThreshold)) {
                                                        xPos = Math.max(xPos, existingRect.x + existingRect.width + (textSize.width / 2) +
                                                        textPadding);
                                                    }
                                                }
                                            }

                                            // Check if label exceeds point region width - if yes, wrap to next row
                                            // xPos is the CENTER position, so we need to check if center + half width exceeds region
                                            if (xPos > pointRegion.x + pointRegion.width) {
                                                yPos = yPos + textSize.height + textPadding;
                                                xPos = regionStart + (textPadding * rowCheckGuard);
                                                needsRowCheck = true;
                                                const collideWithExisting: boolean = isCollide(smartLabelRect, this.chart.dataLabelCollections, clip) || (series.type === 'StackingColumn100' && yPos > 0 && yPos < textSize.height);
                                                if (collideWithExisting) {
                                                // If collision detected, render the label below the series rect instead of at top
                                                    yPos = series.clipRect.height + textSize.height;
                                                    const rectPadding: number = 1;
                                                    // Update the smart label rect with new position
                                                    smartLabelRect = new Rect(
                                                        xPos - (textSize.width / 2) - rectPadding,
                                                        yPos - (textSize.height / 2) - (rectPadding * 2),
                                                        textSize.width + (rectPadding * 2),
                                                        textSize.height - (rectPadding * 2)
                                                    );

                                                    // Update yValue to match new position
                                                    yValue = yPos;
                                                }
                                            }
                                        }
                                    }
                                    else {
                                    // Vertical layout: check X overlap (same column) and stack top to bottom.
                                        const labelXMin: number = xPos;
                                        const labelXMax: number = xPos + textSize.width;
                                        const threshold: number = Math.max(10, textSize.width * 0.2); // 20% of text width for DPI-independent threshold

                                        for (const existingRect of this.repositionedLabels) {
                                        // Check if label is in approximately the same column (similar x-range)
                                            const existingXMin: number = existingRect.x;
                                            const existingXMax: number = existingRect.x + existingRect.width;

                                            // If labels overlap in X-axis range, they're in the same column - stack them vertically
                                            if ((labelXMin <= existingXMax + threshold) && (labelXMax >= existingXMin - threshold)) {
                                            // This label should be positioned below the existing one
                                                yPos = Math.max(yPos, existingRect.y + existingRect.height + textSize.height - textPadding);
                                            }
                                        }
                                    }

                                    // xValue should be the center of the label for proper rotation/alignment
                                    xValue = xPos + (textSize.width / 2);
                                    yValue = yPos;
                                    degree = 0;

                                    // Create a new rect for the repositioned label to track in collections
                                    // Position rect to match the drawn text bounds (xPos is already the left edge)
                                    const rectPadding: number = 1;
                                    smartLabelRect = new Rect(
                                        xPos - (textSize.width / 2) - rectPadding,
                                        yPos - (textSize.height / 2) - (rectPadding * 4),
                                        textSize.width + (rectPadding * 2),
                                        textSize.height - (rectPadding * 2)
                                    );
                                    if (smartLabelRect.x + clip.x < 0 || smartLabelRect.x + smartLabelRect.width > clip.x + clip.width) {
                                        continue;
                                    }
                                    // Add to repositioned labels tracking for stacking IMMEDIATELY, This ensures subsequent labels in the same loop (and subsequent series
                                    // calls for the same point) can see this label's position for row/column checks.
                                    this.repositionedLabels.push(smartLabelRect);

                                    // Check if the repositioned label collides with existing data labels
                                    const collideWithExisting: boolean = isCollide(smartLabelRect, this.chart.dataLabelCollections, clip) || (series.type === 'StackingColumn100' && yPos > 0 && yPos < textSize.height);

                                    if (collideWithExisting) {
                                    // If collision detected, render the label below the series rect instead of at top
                                        yPos = series.clipRect.height + textSize.height;

                                        // Update the smart label rect with new position
                                        smartLabelRect = new Rect(
                                            xPos - (textSize.width / 2) - rectPadding,
                                            yPos - (textSize.height / 2) - (rectPadding * 2),
                                            textSize.width + (rectPadding * 2),
                                            textSize.height - (rectPadding * 2)
                                        );

                                        // Update yValue to match new position
                                        yValue = yPos;

                                        // Update the rect in the repositioned labels collection with the new position
                                        this.repositionedLabels[this.repositionedLabels.length - 1] = smartLabelRect;
                                    }

                                    // Store the repositioned rect for shape creation later
                                    repositionedShapeRect = smartLabelRect;
                                }
                            } else {
                                xPos = (rotateRect.x + this.margin.left + unRotatedText.width / 2) + labelLocation.x;
                                const firstLineHeight: number = measureText(labelLines[0], dataLabel.font,
                                                                            this.chart.themeStyle.datalabelFont).height;
                                yPos = (rotateRect.y + this.margin.top + firstLineHeight * 3 / 4) + labelLocation.y;
                                labelLocation = { x: 0, y: 0 };
                                if (angle !== 0 && dataLabel.enableRotation) {
                                    // xValue = xPos - (dataLabel.margin.left) / 2 + (dataLabel.margin.right / 2);
                                    xValue = rectCenterX;
                                    //yValue = yPos - (dataLabel.margin.top) / 2 - (textSize.height / dataLabel.margin.top) +
                                    // (dataLabel.margin.bottom) / 2;
                                    yValue = rectCenterY;
                                    degree = (angle > 360) ? angle - 360 : (angle < -360) ? angle + 360 : angle;
                                } else {
                                    degree = 0;
                                    xValue = rect.x;
                                    yValue = rect.y;
                                    xPos -= this.chart.chartAreaType === 'Cartesian' && xPos + (textSize.width / 2) > clip.width ? (!this.chart.requireInvertedAxis && xPos > clip.width) ? 0 : (xPos + textSize.width / 2) - clip.width : 0;
                                    yPos -= (yPos + textSize.height > clip.y + clip.height && !(series.type.indexOf('Bar') > -1)) ? (yPos + textSize.height) - (clip.y + clip.height) : 0;
                                }
                            }

                            // Push the appropriate rect (original or repositioned) to track label positions
                            this.chart.dataLabelCollections.push(smartLabelRect);
                            const wasRelocated: boolean = repositionedShapeRect && shouldUseSmartReposition;
                            if (wasRelocated) {
                                const relocateSettings: SmartLabelSettingsModel = dataLabel.smartLabelSettings;
                                const borderColor: string = relocateSettings && relocateSettings.border
                                    ? relocateSettings.border.color
                                    : (dataLabel.border && dataLabel.border.color ? dataLabel.border.color :
                                        this.chart.themeStyle.tooltipFill);
                                const borderWidth: number = relocateSettings && relocateSettings.border ? relocateSettings.border.width :
                                    dataLabel.border && dataLabel.border.width ? dataLabel.border.width : 1;
                                const borderDashArray: string = relocateSettings && relocateSettings.border ?
                                    relocateSettings.border.dashArray : dataLabel.border && dataLabel.border.dashArray ? dataLabel.border.dashArray : '';
                                shapeRect = this.chart.renderer.drawRectangle(
                                    new RectOption(
                                        this.commonId + point.index + '_TextShape_' + i,
                                        relocateSettings.background && relocateSettings.background.toLowerCase() !== 'transparent' ? relocateSettings.background : this.chart.themeStyle.tooltipFill,
                                        { color: borderColor, width: borderWidth, dashArray: borderDashArray },
                                        dataLabel.opacity,
                                        repositionedShapeRect,
                                        0,
                                        0,
                                        '',
                                        borderDashArray
                                    ),
                                    new Int32Array([clip.x, clip.y])) as HTMLElement;
                                if (series.shapeElement) {
                                    appendChildElement(this.chart.enableCanvas, series.shapeElement, shapeRect, this.chart.redraw, true, 'x', 'y', startLocation);
                                }
                            }

                            const textAnchor: string = 'middle';
                            let oldText: string;
                            if (this.chart.redraw && document.getElementById(this.commonId + point.index + '_Text_' + i)) {
                                oldText = document.getElementById(this.commonId + point.index + '_Text_' + i).textContent;
                            }
                            if (argsData.text) {
                                const textElem: Element = textElement(
                                    isBubbleCanvasMode ? this.chart.svgRenderer : this.chart.renderer,
                                    new TextOption(
                                        this.commonId + ((series.removedPointIndex !== null && series.removedPointIndex <= point.index) ? (point.index + 1) : point.index) + '_Text_' + i,
                                        xPos, yPos,
                                        textAnchor, isMultiLine ? labelLines : argsData.text, 'rotate(' + degree + ',' + (xValue) + ',' + (yValue) + ')', 'auto', degree
                                    ),
                                    argsData.font, argsData.font.color || (wasRelocated ? this.chart.themeStyle.tooltipLabelFont.color : (this.chart.theme === 'Bootstrap5' ? '#212529' : this.chart.theme === 'Bootstrap5Dark' ? '#DEE2E6' : ((contrast >= 128 || series.type === 'Hilo' || series.type === 'HiloOpenClose') ?
                                        this.chart.theme.indexOf('Tailwind3') > -1 ? '#111827' : 'black' : this.chart.theme.indexOf('Tailwind3') > -1 ? '#FFFFFF' : 'white'))),
                                    series.textElement, false, this.chart.redraw, true, false, series.chart.duration, series.clipRect, null,
                                    null, isBubbleCanvasMode ? false : this.chart.enableCanvas, isMultiLine,
                                    this.chart.themeStyle.datalabelFont, new ChartLocation(xValue, yValue)
                                );
                                dataLabelElement.push(textElem);
                                if (this.hidesOnSeriesOverlap(dataLabel) && !wasRelocated && !this.chart.enableCanvas && textElem) {
                                    this.seriesOverlapLabels.push({
                                        series: series, point: point, rect: smartLabelRect, textElement: textElem,
                                        shapeId: this.isShape ? this.commonId + point.index + '_TextShape_' + i : null
                                    });
                                }

                                if (wasRelocated && shapeRect) {
                                    const pointRegion: Rect = point.regions[0];
                                    let labelCenter: ChartLocation;
                                    let pointTop: ChartLocation;
                                    if (isStackingBar) {
                                        // For StackingBar: connect the left edge of the relocated label back to the bar's
                                        // right edge so the leader lines still indicate which segment the value belongs to.
                                        labelCenter = new ChartLocation(xPos - (textSize.width / 2), yPos - (textSize.height * 0.2));
                                        const labelLeftX: number = xPos - (textSize.width / 2);
                                        const connectionPointY: number = yPos;
                                        pointTop = new ChartLocation(
                                            pointRegion.x + (this.chart.enableRtl ? 0 : pointRegion.width),
                                            connectionPointY
                                        );
                                        // Ensure the connector is drawn from the label's actual left edge instead of the
                                        // mid anchor used for rotation alignment.
                                        labelCenter = new ChartLocation(labelLeftX, yPos);
                                    } else {
                                        const textPadding: number = 2;
                                        labelCenter = new ChartLocation(
                                            xPos,
                                            yPos - (pointRegion.y < yPos ? textPadding + textSize.height / 2  : 0)
                                        );
                                        const connectionPointX: number = xPos;
                                        pointTop = new ChartLocation(
                                            connectionPointX,
                                            pointRegion.y
                                        );
                                    }
                                    // Removes the series clip-path to support rendering relocated Smart Labels
                                    // outside the series bounds when there is not enough space within the plotting area.
                                    if (series.textElement) {
                                        series.textElement.removeAttribute('clip-path');
                                    }
                                    if (series.shapeElement) {
                                        series.shapeElement.removeAttribute('clip-path');
                                    }
                                    // Connectors and pointer shapes are drawn into a dedicated
                                    this.drawConnectorLine(
                                        labelCenter, pointTop, series, point, dataLabel, i
                                    );
                                }
                            }
                            if (this.isShape && dataLabel.enableRotation) {
                                shapeRect.setAttribute('transform', 'rotate(' + angle + ', ' + xValue + ', ' + yValue + ')');
                            }
                            if (!wasRelocated && this.chart.stackLabels.visible && series.type.indexOf('Stacking') > -1) {
                                this.dataLabelRectCollection = !this.dataLabelRectCollection ? {}
                                    : this.dataLabelRectCollection;
                                this.dataLabelRectCollection[this.commonId + ((series.removedPointIndex !== null && series.removedPointIndex <= point.index) ? (point.index + 1) : point.index) + '_Text_' + i] = actualRect;
                                this.dataLabelRectCollection[this.commonId + point.index + '_TextShape_' + i] = actualRect;
                            }
                            if (series.removedPointIndex !== null && series.removedPointIndex <= point.index) {
                                (series.textElement.lastChild as HTMLElement).id = this.commonId + point.index + '_Text_' + i;
                            }
                            if (this.chart.redraw && oldText !== argsData.text) {
                                animateTextElement(series.textElement.querySelector('#' + this.commonId + point.index + '_Text_' + i), this.chart.duration, parseFloat(oldText), parseFloat(argsData.text), series.marker.dataLabel.format || series.yAxis.labelFormat);
                            }
                        } else if (getElement(this.commonId + point.index + '_Text_0') && series.chart.redraw && series.currentData) {
                            getElement(this.commonId + point.index + '_Text_0').remove();
                        }
                    }
                }
            }
        }
        return dataLabelElement;
    }

    /**
     * Renders the stack labels for the chart.
     *
     * This method is responsible for displaying cumulative total values on stacked chart segments.
     *
     * @returns {void}
     */
    public renderStackLabels(): void {
        const stackLabelGroup: Element = this.chart.renderer.createGroup({ id: `${this.chart.element.id}_StackLabelGroup` });
        if (!this.chart.enableCanvas && stackLabelGroup) {
            this.chart.seriesElements.appendChild(stackLabelGroup);
        }
        let positivePoints: { [xValue: string]: Points } = {};
        let negativePoints: { [xValue: string]: Points } = {};
        let zeroPoints: { [xValue: string]: Points } = {};
        const groupingValues: string[] = [];
        let keys: string[] = [];
        let stackLabelIndex: number = 0;
        if (this.chart.visibleSeries && this.chart.visibleSeries.length > 0) {
            for (let i: number = 0; i < this.chart.visibleSeries.length; i++) {
                keys = Object.keys(groupingValues);
                const series: Series = this.chart.visibleSeries[i as number];
                if (!groupingValues[series.stackingGroup]) {
                    groupingValues[series.stackingGroup] = [];
                    groupingValues[series.stackingGroup].push(series);
                }
                else if (groupingValues[series.stackingGroup] !== undefined) {
                    groupingValues[series.stackingGroup].push(series);
                }
            }
            if (keys[0] !== '') {
                for (let groupIndex: number = 0; groupIndex < keys.length; groupIndex++) {
                    positivePoints = {};
                    negativePoints = {};
                    zeroPoints = {};
                    const seriesInGroup: Series[] = groupingValues[keys[groupIndex as number]];
                    if (!seriesInGroup || seriesInGroup.length === 0) {
                        continue;
                    }
                    // Iterate series in reverse to preserve stacking order
                    for (let si: number = seriesInGroup.length - 1; si >= 0; si--) {
                        const series: Series = seriesInGroup[si as number];
                        if (!series || !series.visible) { continue; }
                        if (!this.chart.enableCanvas && series.animation.enable && this.chart.animateSeries) {
                            stackLabelGroup.setAttribute('visibility', 'hidden');
                        }
                        if (series.points && series.points.length > 0 && series.stackedValues) {
                            for (let pointIndex: number = 0; pointIndex < series.points.length; pointIndex++) {
                                const point: Points = series.points[pointIndex as number];
                                const pointXValueAsKey: string = String(point.x);
                                const endValue: number = series.stackedValues.endValues[pointIndex as number];
                                if (!positivePoints[pointXValueAsKey as string] && endValue > 0
                                    && point.visible) {
                                    positivePoints[pointXValueAsKey as string] = point;
                                }
                                if (!negativePoints[pointXValueAsKey as string] && endValue < 0
                                    && point.visible) {
                                    negativePoints[pointXValueAsKey as string] = point;
                                }
                                if (!positivePoints[pointXValueAsKey as string]
                                    && !negativePoints[pointXValueAsKey as string]
                                    && !zeroPoints[pointXValueAsKey as string]
                                    && (!isNaN(endValue) && endValue === 0)) {
                                    // Track zero-stack categories even when the contributing points
                                    // are hidden via the empty-point 'Drop' mode so the customer
                                    // still receives a 0-valued Stack Label.
                                    zeroPoints[pointXValueAsKey as string] = point;
                                }
                            }
                        }
                    }
                    stackLabelIndex = this.calculateStackLabel(
                        positivePoints, negativePoints, zeroPoints,
                        seriesInGroup, stackLabelGroup, stackLabelIndex
                    );
                }
            }
            else {
                // Collect all visible series into a synthetic single-group so the zero-points
                // renderer can identify the stacking group by series position.
                const stackGroupSeries: Series[] = [];
                for (let seriesIndex: number = this.chart.visibleSeries.length - 1; seriesIndex >= 0; seriesIndex--) {
                    const series: Series = this.chart.visibleSeries[seriesIndex as number];
                    if (!this.chart.enableCanvas && series.animation.enable && this.chart.animateSeries) {
                        stackLabelGroup.setAttribute('visibility', 'hidden');
                    }
                    if (series.visible && series.points && series.points.length > 0 && series.stackedValues) {
                        stackGroupSeries.push(series);
                        for (let pointIndex: number = 0; pointIndex < series.points.length; pointIndex++) {
                            const point: Points = series.points[pointIndex as number];
                            const pointXValueAsKey: string = String(point.x);
                            const endValue: number = series.stackedValues.endValues[pointIndex as number];
                            if (!positivePoints[pointXValueAsKey as string] && endValue > 0
                                && point.visible) {
                                positivePoints[pointXValueAsKey as string] = point;
                            }
                            if (!negativePoints[pointXValueAsKey as string] && endValue < 0
                                && point.visible) {
                                negativePoints[pointXValueAsKey as string] = point;
                            }
                            if (!positivePoints[pointXValueAsKey as string]
                                && !negativePoints[pointXValueAsKey as string]
                                && !zeroPoints[pointXValueAsKey as string]
                                && (!isNaN(endValue) && endValue === 0)) {
                                // Includes invisible points so the 0 value still receives a label
                                // when all contributing values resolve to zero.
                                zeroPoints[pointXValueAsKey as string] = point;
                            }
                        }
                    }
                }
                this.calculateStackLabel(
                    positivePoints, negativePoints, zeroPoints, stackGroupSeries,
                    stackLabelGroup, stackLabelIndex
                );
            }
        }
    }

    /**
     * This method is responsible for positioning the cumulative sum of stacking column series.
     *
     * @param {Object} positivePoints - The positive points of the stacking series.
     * @param {Object} negativePoints - The negative points of the stacking series.
     * @param {Object} zeroPoints - The zero points of the stacking series.
     * @param {Series[]} seriesInGroup - The array of series in group.
     * @param {Element} stackLabelGroup - The stack label group element.
     * @param {number} stackLabelIndex - The index of the stack label.
     * @returns {number} - The number of stack labels.
     */
    public calculateStackLabel(positivePoints: { [xValue: string]: Points }, negativePoints: { [xValue: string]: Points },
                               zeroPoints: { [xValue: string]: Points }, seriesInGroup: Series[],
                               stackLabelGroup: Element, stackLabelIndex: number): number {
        // Sets up the iteration order: positive stack labels first, then negative,
        // and finally zero-value stack labels anchored to the value-axis baseline.
        const pointMaps: { [xValue: string]: Points }[] = [positivePoints, negativePoints];
        const mapCount: number = pointMaps.length;
        for (let mapIndex: number = 0; mapIndex < mapCount; mapIndex++) {
            const points: { [xValue: string]: Points } = pointMaps[mapIndex as number];
            const index: number = mapIndex;
            if (points) {
                let totalValue: number = 0;
                let currentPoint: Points;
                Object.keys(points).forEach((pointXValueAsKey: string) => {
                    const positiveValue: number = (points[pointXValueAsKey as string].series as Series)
                        .stackedValues.endValues[points[pointXValueAsKey as string].index];
                    const negativeValue: number = negativePoints[pointXValueAsKey as string] ?
                        (negativePoints[pointXValueAsKey as string].series as Series).stackedValues.
                            endValues[negativePoints[pointXValueAsKey as string].index] : 0;
                    if (index === 0) {
                        // Handle positive points
                        totalValue = positiveValue + negativeValue;
                        currentPoint = points[pointXValueAsKey as string];
                    } else if (!positivePoints[pointXValueAsKey as string]) {
                        // Handle negative points only if no corresponding positive point
                        totalValue = positiveValue;
                        currentPoint = points[pointXValueAsKey as string];
                    }
                    if (currentPoint && currentPoint.symbolLocations[0] &&
                        withInBounds(currentPoint.symbolLocations[0].x + (currentPoint.series as Series).clipRect.x,
                                     currentPoint.symbolLocations[0].y + (currentPoint.series as Series).clipRect.y,
                                     (currentPoint.series as Series).clipRect)) {
                        const series: Series = currentPoint.series as Series;
                        const symbolLocation: ChartLocation = currentPoint.symbolLocations[0];
                        const labelFormat: string = this.chart.stackLabels.format;
                        let stackLabeltext: string = (totalValue % 1 === 0)
                            ? totalValue.toFixed(0)
                            : (totalValue.toFixed(2).slice(-1) === '0' ? totalValue.toFixed(1) : totalValue.toFixed(2));
                        if (labelFormat) {
                            const customLabelFormat: boolean = labelFormat.match('{value}') !== null;
                            stackLabeltext = customLabelFormat
                                ? labelFormat.replace('{value}', stackLabeltext.toString())
                                : this.chart.intl.getNumberFormat({
                                    format: labelFormat,
                                    useGrouping: this.chart.useGroupingSeparator
                                })(totalValue);
                        }
                        const argsStackLabelFont: FontModel = <FontModel>(extend({}, getValue('properties', this.chart.stackLabels.font), null, true));
                        const argsData: ITextRenderEventArgs = {
                            cancel: false, name: textRender, series: series,
                            point: null, text: stackLabeltext, border: this.chart.stackLabels.border,
                            color: this.chart.stackLabels.fill, template: null, font: argsStackLabelFont, location: null,
                            textSize: measureText(stackLabeltext, this.chart.stackLabels.font, this.chart.themeStyle.datalabelFont)
                        };
                        this.chart.trigger(textRender, argsData);
                        if (!argsData.cancel) {
                            const textSize: Size = measureText(argsData.text, argsData.font
                                , this.chart.themeStyle.datalabelFont);
                            // Define padding to maintain a consistent gap from the symbol location values
                            const padding: number = 10;
                            if (this.chartBackground === undefined) {
                                this.chartBackground = this.chart.chartArea.background === 'transparent' ?
                                    this.chart.background || this.chart.themeStyle.background : this.chart.chartArea.background;
                            }
                            const backgroundColor: string = argsData.color === 'transparent' && this.chartBackground === 'transparent' ? ((this.chart.theme.indexOf('Dark') > -1 || this.chart.theme.indexOf('HighContrast') > -1) ? 'black' : 'white') : this.chart.stackLabels.fill !== 'transparent' ? this.chart.stackLabels.fill : this.chartBackground;
                            const rgbValue: ColorValue = convertHexToColor(colorNameToHex(backgroundColor));
                            const contrast: number = Math.round((rgbValue.r * 299 + rgbValue.g * 587 + rgbValue.b * 114) / 1000);
                            const alignmentValue: number = textSize.width + argsData.border.width
                                + this.chart.stackLabels.margin.left + this.chart.stackLabels.margin.right - padding / 2;
                            const invertedYOffset: number = (
                                textSize.height +
                                this.chart.stackLabels.margin.top -
                                this.chart.stackLabels.margin.bottom -
                                padding / 2
                            ) / 2;
                            const yOffset: number = this.chart.requireInvertedAxis ? invertedYOffset :
                                (this.chart.primaryYAxis.isInversed ? (index === 0 ? (textSize.height + padding / 2) : -padding)
                                    : (index === 0 ? -padding : (textSize.height + padding / 2)));
                            let xOffset: number = this.chart.requireInvertedAxis ?
                                ((this.chart.primaryYAxis.isInversed ? (index === 0 ? -(padding + textSize.width / 2) :
                                    (padding + textSize.width / 2)) : (index === 0 ? (padding + textSize.width / 2) :
                                    -(padding + textSize.width / 2)))) : 0;
                            xOffset += argsData.font.textAlignment === 'Far' ? alignmentValue :
                                (argsData.font.textAlignment === 'Near' ? -alignmentValue : 0);
                            let xPosition: number = Math.max(series.clipRect.x + textSize.width,
                                                             Math.min(xOffset + series.clipRect.x + symbolLocation.x, series.clipRect.x
                                    + series.clipRect.width - textSize.width));
                            let yPosition: number = Math.max(
                                series.clipRect.y + textSize.height,
                                Math.min(
                                    yOffset + series.clipRect.y + symbolLocation.y -
                                    ((this.chart.stackLabels.angle > 0 && !this.chart.requireInvertedAxis) ? textSize.width / 2 : 0),
                                    series.clipRect.y + series.clipRect.height - (this.chart.requireInvertedAxis ? 0 : textSize.height)
                                )
                            );
                            if (this.chart.enableCanvas) {
                                xPosition -= series.clipRect.x;
                                yPosition -= series.clipRect.y;
                            }
                            const rect: Rect = new Rect(
                                xPosition - textSize.width / 2 - this.chart.stackLabels.margin.left,
                                yPosition - textSize.height - this.chart.stackLabels.margin.top,
                                textSize.width + (this.chart.stackLabels.margin.left + this.chart.stackLabels.margin.right),
                                textSize.height + padding / 2 + (this.chart.stackLabels.margin.top + this.chart.stackLabels.margin.bottom)
                            );
                            const shapeRect: Element = this.chart.renderer.drawRectangle(
                                new RectOption(
                                    `${this.chart.element.id}StackLabel_TextShape_${stackLabelIndex}`,
                                    argsData.color, argsData.border, null, rect, this.chart.stackLabels.rx,
                                    this.chart.stackLabels.ry, '', null
                                ),
                                new Int32Array([symbolLocation.x, symbolLocation.y])) as HTMLElement;
                            shapeRect.setAttribute('transform', `rotate(${this.chart.stackLabels.angle}, ${xPosition}, ${yPosition})`);
                            appendChildElement(this.chart.enableCanvas, stackLabelGroup, shapeRect, this.chart.redraw);
                            textElement(
                                this.chart.renderer,
                                new TextOption(
                                    `${this.chart.element.id}_StackLabel_${stackLabelIndex}`, xPosition, yPosition, 'middle', argsData.text,
                                    `rotate(${this.chart.stackLabels.angle}, ${xPosition}, ${yPosition})`, 'auto', this.chart.stackLabels.angle
                                ), argsData.font, (argsData.font.color || (this.chart.theme === 'Bootstrap5' ? '#212529' : this.chart.theme === 'Bootstrap5Dark' ? '#DEE2E6' : ((contrast >= 128) ?
                                    this.chart.theme.indexOf('Tailwind3') > -1 ? '#111827' : 'black' : this.chart.theme.indexOf('Tailwind3') > -1 ? '#FFFFFF' : 'white')))
                                , stackLabelGroup, null, this.chart.redraw, true,
                                null, this.chart.duration, series.clipRect, null, null, this.chart.enableCanvas
                                , null, this.chart.themeStyle.datalabelFont, null
                            );
                            if (series.type === 'StackingLine' || series.type === 'StackingArea') {
                                document.querySelectorAll(
                                    `[id^="${this.chart.element.id}_Series_${series.index}_Point_${currentPoint.index}_Text_"], 
                                [id^="${this.chart.element.id}_Series_${series.index}_Point_${currentPoint.index}_TextShape_"]`
                                ).forEach((element: Element) => {
                                    if (element.id) {
                                        (element as HTMLElement).style.visibility = 'hidden';
                                        element.setAttribute('data-collide', 'true');
                                    }
                                });
                            }
                            for (const dataLabelID in this.dataLabelRectCollection) {
                                if (Object.prototype.hasOwnProperty.call(this.dataLabelRectCollection, dataLabelID)) {
                                    const dataLabelRect: Rect = this.dataLabelRectCollection[dataLabelID as string];
                                    if (dataLabelRect) {
                                        const isCollided: boolean = isCollide(rect, [dataLabelRect], { x: 0, y: 0, height: 0, width: 0 });
                                        if (isCollided) {
                                            const dataLabelElement: Element = document.getElementById(dataLabelID);
                                            if (dataLabelElement) {
                                                (dataLabelElement as HTMLElement).style.visibility = 'hidden';
                                                dataLabelElement.setAttribute('data-collide', 'true');
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    stackLabelIndex++;
                });
            }
        }
        // Render Stack Labels for stacking groups that resolve to a total of zero
        // (covering empty, null, undefined, or pure zero-value point combinations).
        if (zeroPoints && seriesInGroup && seriesInGroup.length > 0) {
            let representativeSeries: Series = seriesInGroup[0];
            for (let gi: number = 0; gi < seriesInGroup.length; gi++) {
                if (seriesInGroup[gi as number] && seriesInGroup[gi as number].visible) {
                    representativeSeries = seriesInGroup[gi as number];
                    break;
                }
            }
            if (representativeSeries && representativeSeries.points && representativeSeries.points.length > 0
                && representativeSeries.stackedValues) {
                Object.keys(zeroPoints).forEach((pointXValueAsKey: string) => {
                    const zeroPoint: Points = zeroPoints[pointXValueAsKey as string];
                    const series: Series = zeroPoint && (zeroPoint.series as Series);
                    if (!zeroPoint || !series || !series.clipRect || !series.xAxis || !series.yAxis) {
                        return;
                    }
                    // Normalize null/undefined to 0 explicitly for the Stack Label total.
                    let totalValue: number = 0;
                    for (const groupSeries of seriesInGroup) {
                        if (!groupSeries || !groupSeries.points) { continue; }
                        let sourcePoint: Points = groupSeries.points[zeroPoint.index];
                        // Point indexes can differ across series after category or DateTime processing.
                        // Fall back to the matching x value when the same array index does not represent this category.
                        if (!sourcePoint || String(sourcePoint.x) !== pointXValueAsKey) {
                            for (let pi: number = 0; pi < groupSeries.points.length; pi++) {
                                const candidate: Points = groupSeries.points[pi as number];
                                if (candidate && String(candidate.x) === pointXValueAsKey) {
                                    sourcePoint = candidate;
                                    break;
                                }
                            }
                        }
                        if (!sourcePoint) { continue; }
                        const rawValue: number = (sourcePoint.y === null || sourcePoint.y === undefined)
                            ? 0
                            : Number(sourcePoint.y);
                        if (!isNaN(rawValue)) {
                            totalValue += rawValue;
                        }
                    }
                    if (isNaN(totalValue)) {
                        totalValue = 0;
                    }
                    // Determine the horizontal center of the side-by-side reserved location.
                    // The center is computed using the same fraction-based positioning logic
                    // employed by ColumnBase.getSideBySideInfo. Offsets are applied in axis
                    // units so they remain valid for DateTime / categorical / numeric axes
                    // before being projected to pixels via getPoint.
                    const position: number = isNullOrUndefined(series.position) ? 0 : series.position;
                    const rectCount: number = (series.rectCount && series.rectCount > 0) ? series.rectCount : 1;
                    const fractionStart: number = (position / rectCount) - 0.5;
                    const fractionEnd: number = ((position + 1) / rectCount) - 0.5;
                    const pointSpacing: number = (series.columnWidth === null || isNaN(+series.columnWidth))
                        ? 0.7
                        : Math.min(series.columnWidth, 1);
                    const minimumPointDelta: number = getSideBySideInterval(series.xAxis, series.chart.visibleSeries);
                    const columnWidth: number = minimumPointDelta * pointSpacing;
                    const seriesSpacing: number = series.chart.enableSideBySidePlacement ? series.columnSpacing : 0;
                    let startOffset: number = fractionStart * columnWidth;
                    let endOffset: number = fractionEnd * columnWidth;
                    const radius: number = seriesSpacing * (endOffset - startOffset);
                    startOffset += radius / 2;
                    endOffset -= radius / 2;
                    // Resolve both boundary edges in axis units to pixel-space via getPoint so
                    // the pixel/millisecond conversion is handled in one place.
                    const zeroPointLocation: ChartLocation = getPoint(
                        zeroPoint.xValue, 0, series.xAxis, series.yAxis, series.chart.requireInvertedAxis
                    );
                    const groupEdgeStartLocation: ChartLocation = getPoint(
                        zeroPoint.xValue + startOffset, 0, series.xAxis, series.yAxis, series.chart.requireInvertedAxis
                    );
                    const groupEdgeEndLocation: ChartLocation = getPoint(
                        zeroPoint.xValue + endOffset, 0, series.xAxis, series.yAxis, series.chart.requireInvertedAxis
                    );
                    const symbolLocation: ChartLocation = new ChartLocation(
                        (groupEdgeStartLocation.x + groupEdgeEndLocation.x) / 2,
                        zeroPointLocation.y
                    );
                    // getPoint returns coordinates relative to the axis origin, so keep
                    // symbolLocation axis-relative and resolve the clip offset when
                    // calculating xPosition/yPosition (mirrors the positive-path logic).
                    const clip: Rect = series.clipRect;
                    if (symbolLocation.x < 0) {
                        symbolLocation.x = 0;
                    }
                    if (symbolLocation.x > clip.width) {
                        symbolLocation.x = clip.width;
                    }
                    const labelFormat: string = this.chart.stackLabels.format;
                    let stackLabeltext: string = (totalValue % 1 === 0)
                        ? totalValue.toFixed(0)
                        : (totalValue.toFixed(2).slice(-1) === '0' ? totalValue.toFixed(1) : totalValue.toFixed(2));
                    if (labelFormat) {
                        const customLabelFormat: boolean = labelFormat.match('{value}') !== null;
                        stackLabeltext = customLabelFormat
                            ? labelFormat.replace('{value}', stackLabeltext.toString())
                            : this.chart.intl.getNumberFormat({
                                format: labelFormat,
                                useGrouping: this.chart.useGroupingSeparator
                            })(totalValue);
                    }
                    const argsStackLabelFont: FontModel = <FontModel>(extend({}, getValue('properties', this.chart.stackLabels.font), null, true));
                    const argsData: ITextRenderEventArgs = {
                        cancel: false, name: textRender, series: series,
                        point: zeroPoint, text: stackLabeltext, border: this.chart.stackLabels.border,
                        color: this.chart.stackLabels.fill, template: null, font: argsStackLabelFont, location: null,
                        textSize: measureText(stackLabeltext, this.chart.stackLabels.font, this.chart.themeStyle.datalabelFont)
                    };
                    this.chart.trigger(textRender, argsData);
                    if (!argsData.cancel) {
                        const textSize: Size = measureText(argsData.text, argsData.font,
                                                           this.chart.themeStyle.datalabelFont);
                        // Highlight neighboring data labels as collided when a zero-value label occupies a stack top
                        // for StackingLine/StackingArea where the marker symbols could overlap.
                        for (const dataLabelID in this.dataLabelRectCollection) {
                            if (Object.prototype.hasOwnProperty.call(this.dataLabelRectCollection, dataLabelID)) {
                                const dataLabelRect: Rect = this.dataLabelRectCollection[dataLabelID as string];
                                if (dataLabelRect) {
                                    const collisionRect: Rect = new Rect(
                                        clip.x + symbolLocation.x - textSize.width / 2,
                                        clip.y + symbolLocation.y - textSize.height,
                                        textSize.width,
                                        textSize.height
                                    );
                                    const isCollided: boolean = isCollide(collisionRect, [dataLabelRect],
                                                                          { x: 0, y: 0, height: 0, width: 0 });
                                    const zeroLabelCenterX: number = collisionRect.x + collisionRect.width / 2;
                                    const dataLabelCenterX: number = dataLabelRect.x + dataLabelRect.width / 2;
                                    const isSameXBucket: boolean = Math.abs(zeroLabelCenterX - dataLabelCenterX) <=
                                        Math.max(collisionRect.width, dataLabelRect.width) / 2;
                                    if (isCollided && isSameXBucket) {
                                        const dataLabelElement: Element = document.getElementById(dataLabelID);
                                        if (dataLabelElement) {
                                            const elementTop: number = parseFloat(
                                                dataLabelElement.getAttribute('y') || '0'
                                            );
                                            const seriesRectY: number = series.chart.requireInvertedAxis
                                                ? series.xAxis.rect.y + (symbolLocation.x - series.xAxis.rect.x) * -1
                                                : series.yAxis.rect.y;
                                            // Only hide labels that are visually nearby the zero stack center.
                                            const distance: number = Math.abs(elementTop - seriesRectY);
                                            if (distance < textSize.height * 4) {
                                                (dataLabelElement as HTMLElement).style.visibility = 'hidden';
                                                dataLabelElement.setAttribute('data-collide', 'true');
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        // Treat zero totals as positive for baseline-resolution purposes.
                        // The label is anchored to the baseline value (0) on the value axis.
                        const padding: number = 10;
                        if (this.chartBackground === undefined) {
                            this.chartBackground = this.chart.chartArea.background === 'transparent' ?
                                this.chart.background || this.chart.themeStyle.background : this.chart.chartArea.background;
                        }
                        const invertedYOffset: number = (
                            textSize.height +
                            this.chart.stackLabels.margin.top -
                            this.chart.stackLabels.margin.bottom -
                            padding / 2
                        ) / 2;
                        const yOffset: number = this.chart.requireInvertedAxis ? invertedYOffset :
                            (this.chart.primaryYAxis.isInversed ? (textSize.height + padding / 2) : -padding);
                        const xOffset: number = this.chart.requireInvertedAxis ?
                            (this.chart.primaryYAxis.isInversed ? -(padding + textSize.width / 2) :
                                (padding + textSize.width / 2)) : 0;
                        const backgroundColor: string = argsData.color === 'transparent' && this.chartBackground === 'transparent'
                            ? ((this.chart.theme.indexOf('Dark') > -1 || this.chart.theme.indexOf('HighContrast') > -1)
                                ? 'black' : 'white')
                            : this.chart.stackLabels.fill !== 'transparent'
                                ? this.chart.stackLabels.fill
                                : this.chartBackground;
                        const rgbValue: ColorValue = convertHexToColor(colorNameToHex(backgroundColor));
                        const contrast: number = Math.round((rgbValue.r * 299 + rgbValue.g * 587 + rgbValue.b * 114) / 1000);
                        let xPosition: number = Math.max(
                            clip.x + textSize.width / 2,
                            Math.min(
                                clip.x + symbolLocation.x + xOffset,
                                clip.x + clip.width - textSize.width / 2
                            )
                        );
                        let yPosition: number = Math.max(
                            clip.y + textSize.height,
                            Math.min(
                                clip.y + symbolLocation.y + yOffset,
                                clip.y + clip.height - textSize.height
                            )
                        );
                        if (this.chart.enableCanvas) {
                            xPosition -= series.clipRect.x;
                            yPosition -= series.clipRect.y;
                        }
                        const rect: Rect = new Rect(
                            xPosition - textSize.width / 2 - this.chart.stackLabels.margin.left,
                            yPosition - textSize.height - this.chart.stackLabels.margin.top,
                            textSize.width + (this.chart.stackLabels.margin.left + this.chart.stackLabels.margin.right),
                            textSize.height + padding / 2 + (this.chart.stackLabels.margin.top + this.chart.stackLabels.margin.bottom)
                        );
                        const shapeRect: Element = this.chart.renderer.drawRectangle(
                            new RectOption(
                                `${this.chart.element.id}StackLabel_TextShape_${stackLabelIndex}`,
                                argsData.color, argsData.border, null, rect, this.chart.stackLabels.rx,
                                this.chart.stackLabels.ry, '', null
                            ),
                            new Int32Array([symbolLocation.x, symbolLocation.y])) as HTMLElement;
                        shapeRect.setAttribute('transform', `rotate(${this.chart.stackLabels.angle}, ${xPosition}, ${yPosition})`);
                        appendChildElement(this.chart.enableCanvas, stackLabelGroup, shapeRect, this.chart.redraw);
                        textElement(
                            this.chart.renderer,
                            new TextOption(
                                `${this.chart.element.id}_StackLabel_${stackLabelIndex}`, xPosition, yPosition, 'middle', argsData.text,
                                `rotate(${this.chart.stackLabels.angle}, ${xPosition}, ${yPosition})`, 'auto', this.chart.stackLabels.angle
                            ), argsData.font, (argsData.font.color || (this.chart.theme === 'Bootstrap5' ? '#212529'
                                : this.chart.theme === 'Bootstrap5Dark' ? '#DEE2E6'
                                    : ((contrast >= 128) ? (this.chart.theme.indexOf('Tailwind3') > -1 ? '#111827' : 'black')
                                        : this.chart.theme.indexOf('Tailwind3') > -1 ? '#FFFFFF' : 'white')))
                            , stackLabelGroup, null, this.chart.redraw, true,
                            null, this.chart.duration, series.clipRect, null, null, this.chart.enableCanvas
                            , null, this.chart.themeStyle.datalabelFont, null
                        );
                    }
                    stackLabelIndex++;
                });
            }
        }
        return stackLabelIndex;
    }

    /**
     * Retrieves the points of a rectangle.
     *
     * @param {Rect} rect - The rectangle whose points are to be retrieved.
     * @returns {ChartLocation[]} - The points of the rectangle.
     */
    private getRectanglePoints(rect: Rect): ChartLocation[] {
        const loc1: ChartLocation = new ChartLocation(rect.x, rect.y);
        const loc2: ChartLocation = new ChartLocation(rect.x + rect.width, rect.y);
        const loc3: ChartLocation = new ChartLocation(rect.x + rect.width, rect.y + rect.height);
        const loc4: ChartLocation = new ChartLocation(rect.x, rect.y + rect.height);
        return [loc1, loc2, loc3, loc4];
    }

    private isDataLabelOverlapWithChartBound(rectCoordinates: ChartLocation[], chart: Chart, clip: Rect): boolean {
        for (let index: number = 0; index < rectCoordinates.length; index++) {
            if (!withInBounds(rectCoordinates[index as number].x + clip.x,
                              rectCoordinates[index as number].y + clip.y, chart.initialClipRect)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Creates a template for data labels.
     *
     * @param {HTMLElement} parentElement - The parent element to which the template will be appended.
     * @param {Series} series - The series associated with the data label.
     * @param {DataLabelSettingsModel} dataLabel - The settings for the data label.
     * @param {Points} point - The data point to which the data label is associated.
     * @param {ITextRenderEventArgs} data - The event data associated with rendering the data label.
     * @param {number} labelIndex - The index of the data label.
     * @param {boolean} redraw - Specifies whether to redraw the template.
     * @param {number} angle - Specifies the angle of rotation.
     * @returns {void}
     */
    private createDataLabelTemplate(
        parentElement: HTMLElement, series: Series,
        dataLabel: DataLabelSettingsModel, point: Points, data: ITextRenderEventArgs, labelIndex: number,
        redraw: boolean, angle: number
    ): void {
        this.margin = { left: 0, right: 0, bottom: 0, top: 0 };
        const clip: Rect = series.clipRect;
        const childElement: HTMLElement = createTemplate(
            createElement('div', {
                id: this.chart.element.id + '_Series_' + (series.index === undefined ? series.category : series.index) + '_DataLabel_'
                    + point.index + (labelIndex ? ('_' + labelIndex) : ''),
                styles: 'position: absolute;background-color:' + data.color + ';' +
                    getFontStyle(dataLabel.font, this.chart.themeStyle.datalabelFont) + ';border:' + data.border.width + 'px solid ' + data.border.color + ';'
            }),
            point.index, (this.chart.enableHtmlSanitizer ? this.chart.sanitize(data.template as string) : data.template), this.chart, point, series, this.chart.element.id + '_DataLabel', labelIndex);
        this.calculateTemplateLabelSize(parentElement, childElement, point, series, dataLabel, labelIndex, clip, redraw, null, angle);
    }
    public calculateTemplateLabelSize(
        parentElement: HTMLElement, childElement: HTMLElement, point: Points, series: Series, dataLabel: DataLabelSettingsModel,
        labelIndex: number, clip: Rect, redraw: boolean, isReactCallback?: boolean, angle?: number
    ): void {
        const elementRect: ClientRect = measureElementRect(childElement, redraw, isReactCallback);
        const rect: Rect = this.calculateTextPosition(
            point, series, { width: elementRect.width, height: elementRect.height },
            dataLabel, labelIndex, angle
        );
        const clipWidth: number = 0;
        const clipHeight: number = 0;
        let isOverlap: boolean = false;
        if (isReactCallback) {
            isOverlap = (elementRect.width === 0 || elementRect.height === 0); // To check the data label already overlap before react callback call
            // clipWidth = ((series.clipRect.x + rect.x) + elementRect.width) > parentElement.clientWidth ?
            //     (parentElement.clientWidth - (series.clipRect.x + rect.x)) : 0;
            // clipHeight = (series.points.length - 1 === point.index) ? elementRect.height / 2 : 0;
        }
        childElement.style.left = ((this.chart.chartAreaType === 'PolarRadar' ? 0 : series.clipRect.x) + rect.x - clipWidth) + 'px';
        childElement.style.top = ((this.chart.chartAreaType === 'PolarRadar' ? 0 : series.clipRect.y) + rect.y + clipHeight) + 'px';
        const vAxis: Axis = series.chart.requireInvertedAxis ? series.xAxis : series.yAxis;
        const hAxis: Axis = series.chart.requireInvertedAxis ? series.yAxis : series.xAxis;
        if (childElement.childElementCount && !isOverlap && (!isCollide(rect, this.chart.dataLabelCollections, clip) ||
            dataLabel.labelIntersectAction === 'None') && (series.seriesType !== 'XY' || point.yValue === undefined ||
                withIn(point.yValue, series.yAxis.visibleRange) || (series.type.indexOf('Stacking') > -1) ||
                (series.type.indexOf('100') > -1 && withIn(series.stackedValues.endValues[point.index], series.yAxis.visibleRange))) &&
            withIn(point.xValue, series.xAxis.visibleRange) && parseFloat(childElement.style.top) >= vAxis.rect.y &&
            parseFloat(childElement.style.left) >= hAxis.rect.x &&
            parseFloat(childElement.style.top) <= vAxis.rect.y + vAxis.rect.height &&
            parseFloat(childElement.style.left) <= hAxis.rect.x + hAxis.rect.width
        ) {
            this.chart.dataLabelCollections.push(new Rect(
                rect.x + clip.x, rect.y + clip.y, rect.width, rect.height
            ));
            appendChildElement(this.chart.enableCanvas, parentElement, childElement, redraw, true, 'left', 'top');
            if (series.animation.enable && this.chart.animateSeries && !this.chart.enableCanvas) {
                this.doDataLabelAnimation(series, childElement);
            } else if (this.chart.enableCanvas) {
                parentElement.appendChild(childElement);
            }
        }
    }
    private calculateTextPosition(
        point: Points, series: Series, textSize: Size,
        dataLabel: DataLabelSettingsModel, labelIndex: number, angle: number
    ): Rect {
        let labelRegion: Rect = labelIndex > 1 ? (series.type === 'Candle') ? point.regions[1] : point.regions[0] : point.regions[0];
        if (labelIndex > 1 && series.type === 'HiloOpenClose') {
            labelRegion = (labelIndex === 2) ? point.regions[1] : point.regions[2];
        }
        let location: ChartLocation;
        location = this.getLabelLocation(point, series, textSize, labelIndex);
        const padding: number = 5;
        const clipRect: Rect = series.clipRect;
        // calculating alignment
        if (!this.chart.requireInvertedAxis || !this.isRectSeries(series) || series.type === 'BoxAndWhisker') {
            this.locationX = location.x;
            const alignmentValue: number = textSize.height + (this.borderWidth * 2) + this.markerHeight +
                this.margin.bottom + this.margin.top + padding;
            location.x = (dataLabel.position === 'Auto') ? location.x :
                this.calculateAlignment(
                    alignmentValue, location.x, dataLabel.alignment,
                    this.isRectSeries(series) ? point.yValue < 0 : false
                );
            // calculating position
            location.y = (!this.isRectSeries(series) || series.type === 'BoxAndWhisker') ?
                this.calculatePathPosition(
                    location.y, dataLabel.position, series, point, textSize, labelIndex
                ) :
                this.calculateRectPosition(
                    location.y, labelRegion, point.yValue < 0 !== this.yAxisInversed,
                    dataLabel.position, series, textSize, labelIndex, point
                );
            if (this.isRectSeries(series) && this.chart.chartAreaType === 'PolarRadar') {
                location = this.calculatePolarRectPosition(
                    location, dataLabel.position, series, point, textSize, labelIndex, dataLabel.alignment, alignmentValue);
            }
        } else {
            this.locationY = location.y;
            const alignmentValue: number = textSize.width + this.borderWidth + this.margin.left + this.margin.right - padding;
            location.x = dataLabel.position === 'Auto' ? location.x :
                this.calculateAlignment(alignmentValue, location.x, dataLabel.alignment, point.yValue < 0);
            location.x = this.calculateRectPosition(
                location.x, labelRegion, point.yValue < 0 !== this.yAxisInversed,
                dataLabel.position, series, textSize, labelIndex, point
            );
        }
        const rect: Rect = calculateRect(location, textSize, this.margin);
        // Checking the condition whether data Label has been exist the clip rect
        if (!((dataLabel.enableRotation === true && (angle !== 0)) && !this.chart.enableSmartLabels) &&
            !((rect.y > (clipRect.y + clipRect.height)) || (rect.x > (clipRect.x + clipRect.width)) ||
                (rect.x + rect.width < 0) || (rect.y + rect.height < 0))) {
            rect.x = rect.x < 0 ? (series.type === 'StackingColumn' && !this.inverted ? 0 : padding) : rect.x;
            rect.y = (rect.y < 0 && !this.chart.requireInvertedAxis) && !(dataLabel.labelIntersectAction === 'None') ? padding : rect.y;
            rect.x -= (rect.x + rect.width) > (clipRect.x + clipRect.width) ? (rect.x + rect.width)
                - (clipRect.x + clipRect.width) + padding : 0;
            rect.y -= (rect.y + rect.height) > (clipRect.y + clipRect.height) ? (rect.y + rect.height)
                - (clipRect.y + clipRect.height) + padding : 0;
            this.fontBackground = this.fontBackground === 'transparent' ? this.chartBackground : this.fontBackground;
        }

        let dataLabelOutRegion: boolean;
        if (this.inverted && series.isRectSeries && (rect.x + rect.width > labelRegion.x + labelRegion.width)) {
            dataLabelOutRegion = true;
        }
        this.fontBackground = dataLabelOutRegion ? this.chartBackground : this.fontBackground;

        return rect;
    }

    // Calculation label location for polar column draw types
    private calculatePolarRectPosition(
        location: ChartLocation, position: LabelPosition, series: Series,
        point: Points, size: Size, labelIndex: number, alignment: Alignment, alignmentValue: number
    ): ChartLocation {
        const padding: number = 5;
        let columnRadius: number;
        const chartWidth: number = this.chart.availableSize.width;
        const alignmentSign: number = (alignment === 'Center') ? 0 : (alignment === 'Far' ? 1 : -1);
        const angle: number = (point.regionData.startAngle - 0.5 * Math.PI) + (point.regionData.endAngle - point.regionData.startAngle) / 2;
        if (labelIndex === 0) {
            columnRadius = point.regionData.radius < point.regionData.innerRadius ? point.regionData.innerRadius
                : point.regionData.radius;
        } else {
            columnRadius = point.regionData.radius > point.regionData.innerRadius ? point.regionData.innerRadius
                : point.regionData.radius;
        }
        this.fontBackground = this.fontBackground === 'transparent' ? this.chartBackground : this.fontBackground;
        if (series.drawType.indexOf('Stacking') > -1) {
            position = position === 'Outer' ? 'Top' : position;
        } else if (series.drawType.indexOf('Range') > -1) {
            position = (position === 'Outer' || position === 'Top') ? position : 'Auto';
        }
        if (position === 'Outer') {
            columnRadius = labelIndex === 0 ? columnRadius + 2 * padding + this.markerHeight :
                columnRadius - 2 * padding - this.markerHeight;
        } else if (position === 'Middle') {
            columnRadius = columnRadius / 2 + padding;
            if (series.drawType === 'StackingColumn') {
                columnRadius = point.regionData.innerRadius + ((point.regionData.radius - point.regionData.innerRadius) / 2)
                    + padding - (size.height / 2);
            }
        } else if (position === 'Top') {
            columnRadius = labelIndex === 0 ? columnRadius - 2 * padding - this.markerHeight :
                columnRadius + 2 * padding + this.markerHeight;
        } else if (position === 'Bottom') {
            columnRadius = 2 * padding;
            columnRadius += (series.drawType === 'StackingColumn') ? (point.regionData.innerRadius + this.markerHeight) : 0;
        } else {
            if (labelIndex === 0) {
                columnRadius = columnRadius >= series.chart.radius ? columnRadius - padding :
                    series.drawType === 'StackingColumn' ? columnRadius - 2 * padding : columnRadius + 2 * padding;
            } else {
                columnRadius = columnRadius >= series.chart.radius ? columnRadius + padding : columnRadius - 2 * padding;
            }
        }
        columnRadius += (alignmentValue * alignmentSign);
        location.x = series.clipRect.width / 2 + series.clipRect.x + columnRadius * Math.cos(angle);
        // To change x location based on text anchor for column and stackingcolumn chart
        if (series.drawType === 'StackingColumn') {
            location.x = location.x < chartWidth / 2 ? location.x + size.width / 2 :
                (location.x > chartWidth / 2 ? location.x - size.width / 2 : location.x);
        } else if (series.drawType === 'Column') {
            location.x = location.x < chartWidth / 2 ? location.x - size.width / 2 :
                (location.x > chartWidth / 2 ? location.x + size.width / 2 : location.x);
        }
        location.y = series.clipRect.height / 2 + series.clipRect.y + columnRadius * Math.sin(angle);
        return location;
    }


    /**
     * Gets the location for the data label.
     *
     * @param {Points} point - The data point associated with the label.
     * @param {Series} series - The series associated with the data label.
     * @param {Size} textSize - The size of the text to be displayed in the data label.
     * @param {number} labelIndex - The index of the data label.
     * @returns {ChartLocation} - The location for the data label.
     */
    private getLabelLocation(point: Points, series: Series, textSize: Size, labelIndex: number): ChartLocation {
        let location: ChartLocation = new ChartLocation(0, 0);
        let labelRegion: Rect = (series.type === 'Candle' && labelIndex > 1) ? point.regions[1] : point.regions[0];
        if (series.type === 'HiloOpenClose') {
            labelRegion = (labelIndex === 2) ? point.regions[1] : point.regions[2];
        }
        const xAxis: Axis = series.xAxis;
        const yAxis: Axis = series.yAxis;
        const isInverted: boolean = series.chart.requireInvertedAxis;
        if (series.type === 'BoxAndWhisker') {
            this.markerHeight = 0;
            switch (labelIndex) {
            case 0: location = getPoint(point.xValue, point.median, xAxis, yAxis, isInverted); break;
            case 1: location = getPoint(point.xValue, point.maximum, xAxis, yAxis, isInverted); break;
            case 2: location = getPoint(point.xValue, point.minimum, xAxis, yAxis, isInverted); break;
            case 3: location = getPoint(point.xValue, point.upperQuartile, xAxis, yAxis, isInverted); break;
            case 4: location = getPoint(point.xValue, point.lowerQuartile, xAxis, yAxis, isInverted); break;
            default: {
                location = getPoint(point.xValue, point.outliers[labelIndex - 5], xAxis, yAxis, isInverted);
                this.markerHeight = series.marker.height / 2;
                break;
            }
            }
            if (isInverted) {
                location.y = point.regions[0].y + (point.regions[0].height / 2);
            } else {
                location.x = point.regions[0].x + (point.regions[0].width / 2);
            }
        } else if (isInverted && series.type.indexOf('Stacking') > -1 && point.yValue === 0) {
            location = { x: labelRegion.x + labelRegion.width, y: labelRegion.y + (labelRegion.height) / 2 };
        } else if (labelIndex === 0 || labelIndex === 1) {
            location = new ChartLocation(point.symbolLocations[0].x, point.symbolLocations[0].y);
        } else if ((labelIndex === 2 || labelIndex === 3) && series.type === 'Candle') {
            location = new ChartLocation(point.symbolLocations[1].x, point.symbolLocations[1].y);
        } else if (isInverted) {
            location = { x: labelRegion.x + (labelRegion.width) / 2, y: labelRegion.y };
        } else {
            location = { x: labelRegion.x + labelRegion.width, y: labelRegion.y + (labelRegion.height) / 2 };
        }

        //Aligning the label at the beginning of the tick, when tick size is less than text size
        if (labelIndex > 1 && series.type === 'HiloOpenClose') {
            if (series.chart.requireInvertedAxis) {
                const height: number = labelRegion.height;
                location.y = labelRegion.y + height / 2 + 2 * (labelIndex === 2 ? 1 : -1);
            } else {
                const width: number = labelRegion.width;
                location.x = labelRegion.x + width / 2 + 2 * (labelIndex === 2 ? 1 : -1);
            }
        }
        return location;
    }

    private calculateRectPosition(
        labelLocation: number, rect: Rect, isMinus: boolean,
        position: LabelPosition, series: Series, textSize: Size, labelIndex: number, point: Points
    ): number {
        if (series.chart.chartAreaType === 'PolarRadar') {
            return null;
        }
        const padding: number = 5;
        const margin: MarginModel = this.margin;
        const textLength: number = !this.inverted ? textSize.height : textSize.width;
        if (position === 'Bottom' && series.type === 'StackingColumn' && !this.inverted && rect.height < textSize.height) {
            this.extraSpace = this.borderWidth + ((Math.abs(rect.height - textSize.height / 2) < padding) ? 0 : padding);
        } else {
            this.extraSpace = this.borderWidth + textLength / 2 + (position !== 'Outer' && series.type.indexOf('Column') > -1 &&
                (Math.abs(rect.height - textSize.height) < padding) ? 0 : padding);
        }
        if (series.type === 'StackingColumn100' || series.type === 'StackingBar100') {
            position = (position === 'Outer') ? 'Top' : position;
        } else if (series.type.indexOf('Range') > -1) {
            position = (position === 'Outer' || position === 'Top') ? position : 'Auto';
        } else if (series.type === 'Waterfall') {
            position = position === 'Auto' ? 'Middle' : position;
        }

        switch (position) {
        case 'Bottom':
            labelLocation = !this.inverted ?
                isMinus ? (labelLocation + (series.type === 'Waterfall' ? (- this.extraSpace - margin.top - this.markerHeight) : (-rect.height + this.extraSpace + margin.top))) :
                    (labelLocation + rect.height - this.extraSpace - margin.bottom) :
                isMinus ? (labelLocation + (series.type === 'Waterfall' ? (+ this.extraSpace + margin.left + this.markerHeight) : (+ rect.width - this.extraSpace - margin.left))) :
                    (labelLocation - rect.width + this.extraSpace + margin.right);
            break;
        case 'Middle':
            labelLocation = !this.inverted ?
                (isMinus ? labelLocation - (rect.height / 2) : labelLocation + (rect.height / 2)) :
                (isMinus ? labelLocation + (rect.width / 2) : labelLocation - (rect.width / 2));
            break;
        case 'Auto':
            labelLocation = this.calculateRectActualPosition(labelLocation, rect, isMinus, series, textSize, labelIndex, point);
            break;
        default:
            this.extraSpace += this.errorHeight;
            labelLocation = this.calculateTopAndOuterPosition(labelLocation, rect,
                                                              position, series, labelIndex, this.extraSpace, isMinus, point);

            break;
        }
        const check: boolean = !this.inverted ? (labelLocation < rect.y || labelLocation > rect.y + rect.height) :
            (labelLocation < rect.x || labelLocation > rect.x + rect.width);
        this.fontBackground = check ?
            (this.fontBackground === 'transparent' ? this.chartBackground : this.fontBackground)
            : this.fontBackground === 'transparent' ? (point.color || series.interior) : this.fontBackground;
        const seriesLength: number = series.chart.series.length;
        if (position === 'Outer' && (series.type.indexOf('Stacking') > -1) && ((seriesLength - 1) > series.index)) {
            let nextSeries: Series;
            let nextSeriesPoint: Points;
            for (let i: number = series.index + 1; i < seriesLength; i++) {
                nextSeries = series.chart.series[i as number] as Series;
                nextSeriesPoint = <Points>nextSeries.points[point.index];
                if ((nextSeries.type.indexOf('Stacking') > -1) && (nextSeries.type.indexOf('100') === -1)) {
                    this.fontBackground = (nextSeriesPoint && ((nextSeriesPoint.yValue < 0 && point.yValue < 0) ||
                        (nextSeriesPoint.yValue > 0 && point.yValue > 0))) ? (nextSeriesPoint ? nextSeriesPoint.color :
                            nextSeries.interior) : this.fontBackground;
                    break;
                }
            }
        }
        return labelLocation;
    }

    private calculatePathPosition(
        labelLocation: number, position: LabelPosition, series: Series,
        point: Points, size: Size, labelIndex: number
    ): number {
        const padding: number = 5;
        if ((series.type.indexOf('Area') > -1 && series.type !== 'RangeArea' && series.type !== 'SplineRangeArea' && series.type !== 'RangeStepArea')
            && this.yAxisInversed && series.marker.dataLabel.position !== 'Auto') {
            position = position === 'Top' ? 'Bottom' : position === 'Bottom' ? 'Top' : position;
        }
        this.fontBackground = this.fontBackground === 'transparent' ? this.chartBackground : this.fontBackground;
        switch (position) {
        case 'Top':
        case 'Outer':
            labelLocation = labelLocation - this.markerHeight - this.borderWidth - size.height / 2 - this.margin.bottom - padding -
                    this.errorHeight;
            break;
        case 'Bottom':
            labelLocation = labelLocation + this.markerHeight + this.borderWidth + size.height / 2 + this.margin.top + padding +
                    this.errorHeight;
            break;
        case 'Auto':
            labelLocation = this.calculatePathActualPosition(
                labelLocation, this.markerHeight, series, point, size, labelIndex
            );
            break;
        }
        return labelLocation;
    }

    private isDataLabelShape(style: ITextRenderEventArgs, smartSettings?: SmartLabelSettingsModel): void {
        // Smart Label background / border styles must also create the label shape.
        const smartBorder: BorderModel = smartSettings && smartSettings.border;
        const hasSmartStyle: boolean = !!smartSettings && (
            (!!smartSettings.background && smartSettings.background !== 'transparent') ||
            !!(smartBorder && smartBorder.color));
        this.isShape = (style.color !== 'transparent' || style.border.width > 0 || hasSmartStyle);
        this.borderWidth = (hasSmartStyle && smartBorder && smartBorder.width > 0) ? smartBorder.width : style.border.width;
        if (!this.isShape) {
            this.margin = { left: 0, right: 0, bottom: 0, top: 0 };
        }
    }

    private calculateRectActualPosition(
        labelLocation: number, rect: Rect, isMinus: boolean,
        series: Series, size: Size, labelIndex: number, point: Points
    ): number {
        let location: number;
        let labelRect: Rect;
        let isOverLap: boolean = true;
        // Stacking series skip 'Outer' and begin automatic placement from 'Top'.
        let position: number = series.type.indexOf('Stacking') > -1 ? 1 : 0;
        const collection: Rect[] = this.chart.dataLabelCollections;
        const finalPosition: number = series.type.indexOf('Range') !== -1 || series.type === 'Hilo' ? 2 : 4;
        let actualPosition: LabelPosition = this.getPosition(position);
        while (isOverLap && position < finalPosition) {
            actualPosition = this.getPosition(position);
            this.fontBackground = series.marker.dataLabel.fill;
            location = this.calculateRectPosition(
                labelLocation, rect, isMinus, actualPosition,
                series, size, labelIndex, point);
            if (!this.inverted) {
                labelRect = calculateRect(new ChartLocation(this.locationX, location), size, this.margin);
                isOverLap = labelRect.y < 0 || isCollide(labelRect, collection, series.clipRect) ||
                    labelRect.y > series.clipRect.height;
                if (series.marker.dataLabel.template === null && isOverLap !== true) {
                    isOverLap = labelRect.y / 2 + size.height + (point.regions[0].height - 2 * this.extraSpace) > series.clipRect.height;
                }
            } else {
                labelRect = calculateRect(new ChartLocation(location, this.locationY), size, this.margin);
                isOverLap = labelRect.x < 0 || isCollide(labelRect, collection, series.clipRect) ||
                    labelRect.x + labelRect.width > series.clipRect.width;
            }
            position++;
        }
        // Store the position resolved for the current rectangular-series label.
        this.actualPosition = actualPosition;
        return location;
    }

    // alignment calculation assigned here
    private calculateAlignment(value: number, labelLocation: number, alignment: Alignment, isMinus: boolean): number {
        switch (alignment) {
        case 'Far': labelLocation = !this.inverted ? (isMinus ? labelLocation + value : labelLocation - value) :
            (isMinus ? labelLocation - value : labelLocation + value); break;
        case 'Near': labelLocation = !this.inverted ? (isMinus ? labelLocation - value : labelLocation + value) :
            (isMinus ? labelLocation + value : labelLocation - value); break;
        }
        return labelLocation;
    }
    //calculation for top and outer position of datalabel for rect series
    private calculateTopAndOuterPosition(
        location: number, rect: Rect, position: LabelPosition, series: Series, index: number,
        extraSpace: number, isMinus: boolean, point: Points
    ): number {
        const margin: MarginModel = this.margin;
        let top: boolean;
        switch (series.type) {
        case 'RangeColumn':
        case 'RangeArea':
        case 'RangeStepArea':
        case 'SplineRangeArea':
        case 'Hilo':
            top = (index === 0 && !this.yAxisInversed) || (index === 1 && this.yAxisInversed);
            location = this.updateLabelLocation(position, location, extraSpace, margin, rect, top);
            break;
        case 'Candle':
            top = (index === 0 || index === 2) && !this.yAxisInversed
                    || (index === 1 || index === 3) && this.yAxisInversed;

            location = this.updateLabelLocation(position, location, extraSpace, margin, rect, top, index > 1);
            break;
        case 'HiloOpenClose':
            if (index <= 1) {
                top = (index === 0 && !this.yAxisInversed) || (index === 1 && this.yAxisInversed);
                location = this.updateLabelLocation(position, location, extraSpace, margin, rect, top);
            } else {
                if (this.yAxisInversed) {
                    location = !this.inverted ? location + extraSpace + margin.top : location - extraSpace - margin.right;
                } else {
                    location = !this.inverted ? location - extraSpace - margin.bottom : location + extraSpace + margin.left;
                }
            }
            break;
        default:
            if (((isMinus && position === 'Top') || (!isMinus && position === 'Outer')) || (position === 'Top' && series.visiblePoints[point.index].yValue === 0)) {
                location = !this.inverted ? location + (isMinus && series.type === 'Waterfall' ? (-rect.height + extraSpace + margin.bottom) : (-extraSpace - margin.bottom - this.markerHeight)) :
                    location + (isMinus && series.type === 'Waterfall' ?  (+ rect.width - extraSpace - margin.left) : (+ extraSpace + margin.left + this.markerHeight));
            } else {
                location = !this.inverted ? location + (isMinus && series.type === 'Waterfall' ? (-rect.height - extraSpace - margin.top) : (+ extraSpace + margin.top + this.markerHeight)) :
                    location + (isMinus && series.type === 'Waterfall' ? (+rect.width + extraSpace + margin.top) : (- extraSpace - margin.right - this.markerHeight));
            }
            break;
        }
        return location;
    }

    /**
     * Updates the location of the data label.
     *
     * @param {LabelPosition} position - The position of the data label.
     * @param {number} location - The initial location of the data label.
     * @param {number} extraSpace - Extra space to adjust the label position.
     * @param {MarginModel} margin - The margin for the chart.
     * @param {Rect} rect - The rectangle associated with the data label.
     * @param {boolean} top - Indicates whether the label is positioned at the top.
     * @param {boolean} inside - Indicates whether the label is inside the chart area.
     * @returns {number} The updated location of the data label.
     */
    private updateLabelLocation(
        position: LabelPosition, location: number, extraSpace: number,
        margin: MarginModel, rect: Rect, top: boolean, inside: boolean = false
    ): number {
        if (!this.inverted) {
            if (top) {
                location = (position === 'Outer' && !inside) ? location - extraSpace - margin.bottom - this.markerHeight :
                    location + extraSpace + margin.top + this.markerHeight;
            } else {
                location = (position === 'Outer' && !inside) ? location + rect.height + extraSpace + margin.top + this.markerHeight :
                    location + rect.height - extraSpace - margin.bottom - this.markerHeight;
            }
        } else {
            if (top) {
                location = (position === 'Outer' && !inside) ? location + extraSpace + margin.left + this.markerHeight :
                    location - extraSpace - margin.right - this.markerHeight;
            } else {
                location = (position === 'Outer' && !inside) ? location - rect.width - extraSpace - margin.right - this.markerHeight :
                    location - rect.width + extraSpace + margin.left + this.markerHeight;
            }
        }
        return location;
    }

    private calculatePathActualPosition(
        y: number, markerSize: number, series: Series,
        point: Points, size: Size, labelIndex: number
    ): number {
        const points: Points[] = series.points;
        const index: number = point.index;
        const yValue: number = points[index as number].yValue;
        let position: LabelPosition;
        const nextPoint: Points = points.length - 1 > index ? points[index + 1] : null;
        const previousPoint: Points = index > 0 ? points[index - 1] : null;
        let yLocation: number;
        let isOverLap: boolean = true;
        let labelRect: Rect;
        let isBottom: boolean;
        let positionIndex: number;
        const collection: Rect[] = this.chart.dataLabelCollections;
        if (series.type === 'Bubble') {
            position = 'Top';
        } else if (series.type.indexOf('Step') > -1) {
            position = 'Top';
            if (index) {
                position = (!previousPoint || !previousPoint.visible || (yValue > previousPoint.yValue !== this.yAxisInversed)
                    || yValue === previousPoint.yValue) ? 'Top' : 'Bottom';
            }
        } else if (series.type === 'BoxAndWhisker') {
            if (labelIndex === 1 || labelIndex === 3 || labelIndex > 4) {
                position = series.yAxis.isAxisInverse ? 'Bottom' : 'Top';
            } else if (labelIndex === 2 || labelIndex === 4) {
                position = series.yAxis.isAxisInverse ? 'Top' : 'Bottom';
            } else {
                isOverLap = false;
                position = 'Middle';
                yLocation = this.calculatePathPosition(y, position, series, point, size, labelIndex);
            }
        } else {
            if (index === 0) {
                position = (!nextPoint || !nextPoint.visible || yValue > nextPoint.yValue ||
                    (yValue < nextPoint.yValue && this.yAxisInversed)) ? 'Top' : 'Bottom';
            } else if (index === points.length - 1) {
                position = (!previousPoint || !previousPoint.visible || yValue > previousPoint.yValue ||
                    (yValue < previousPoint.yValue && this.yAxisInversed)) ? 'Top' : 'Bottom';
            } else {
                if (!nextPoint.visible && !(previousPoint && previousPoint.visible)) {
                    position = 'Top';
                } else if (!nextPoint.visible || !previousPoint) {
                    position = (nextPoint.yValue > yValue || (previousPoint && previousPoint.yValue > yValue)) ?
                        'Bottom' : 'Top';
                } else {
                    const slope: number = (nextPoint.yValue - previousPoint.yValue) / 2;
                    const intersectY: number = (slope * index) + (nextPoint.yValue - (slope * (index + 1)));
                    position = !this.yAxisInversed ? intersectY < yValue ? 'Top' : 'Bottom' :
                        intersectY < yValue ? 'Bottom' : 'Top';
                }
            }
        }
        isBottom = position === 'Bottom';
        positionIndex = ['Outer', 'Top', 'Bottom', 'Middle', 'Auto'].indexOf(position);
        let actualPosition: LabelPosition = position;
        while (isOverLap && positionIndex < 4) {
            actualPosition = this.getPosition(positionIndex);
            yLocation = this.calculatePathPosition(y, actualPosition, series, point, size, labelIndex);
            labelRect = calculateRect(new ChartLocation(this.locationX, yLocation), size, this.margin);
            isOverLap = labelRect.y < 0 || isCollide(labelRect, collection, series.clipRect)
                || (labelRect.y + labelRect.height) > series.clipRect.height;
            positionIndex = isBottom ? positionIndex - 1 : positionIndex + 1;
            isBottom = false;
        }
        // For path series, update the resolved position only when it is not Auto.
        if (actualPosition !== 'Auto') {
            this.actualPosition = actualPosition;
        }
        return yLocation;
    }

    /**
     * Draws a connector line from the repositioned label to the data point.
     *
     * @param {ChartLocation} labelLocation - The location of the repositioned label.
     * @param {ChartLocation} pointLocation - The location of the data point.
     * @param {Series} series - The series associated with the data label.
     * @param {Points} point - The data point to which the data label is associated.
     * @param {DataLabelSettingsModel} dataLabel - The data label settings.
     * @param {number} labelIndex - The index of the label within the point (0 for the primary label).
     * @returns {void}
     * @private
     */
    private drawConnectorLine(
        labelLocation: ChartLocation, pointLocation: ChartLocation, series: Series,
        point: Points, dataLabel: DataLabelSettingsModel, labelIndex: number = 0
    ): void {
        if (!series.textElement && !this.chart.enableCanvas) {
            return;
        }

        // Built from the series itself (this.commonId belongs to whichever series rendered last) and the label
        // index, so the upper and lower labels of one point (e.g. range series) each keep their own connector.
        const connectorLineId: string = this.getConnectorId(series, point, labelIndex, '_ConnectorLine');
        const connectorLineElement: Element = getElement(connectorLineId);

        // Remove existing connector line if redrawing
        if (connectorLineElement) {
            connectorLineElement.remove();
        }

        // Use the connector line style from smartLabelSettings when configured, otherwise fall back to the border color.
        const relocateSettings: SmartLabelSettingsModel = dataLabel.smartLabelSettings;
        const connectorStyle: ConnectorLineStyleModel = (relocateSettings && relocateSettings.connectorLineStyle) ?
            relocateSettings.connectorLineStyle : null;
        const lineColor: string = (connectorStyle && connectorStyle.color)
            ? connectorStyle.color
            : (dataLabel.border.color || this.chart.themeStyle.datalabelFont.color);
        const lineWidth: number = connectorStyle && connectorStyle.width !== undefined && connectorStyle.width !== null ?
            connectorStyle.width : 1;
        const lineOpacity: number = connectorStyle && connectorStyle.opacity !== undefined && connectorStyle.opacity !== null ?
            connectorStyle.opacity : 1;
        const clip: Rect = series.clipRect;

        // Create a path element for the connector line that supports canvas offset
        const pathData: string = 'M ' + labelLocation.x + ' ' + labelLocation.y + ' L ' + pointLocation.x + ' ' + pointLocation.y;
        const pathOption: PathOption = new PathOption(
            connectorLineId,
            'none',
            lineWidth,
            lineColor,
            lineOpacity,
            '',
            pathData
        );

        // Draw line with clip offset for canvas mode (same as rectangle)
        const connectorLine: Element = this.chart.renderer.drawPath(
            pathOption,
            new Int32Array([clip.x, clip.y])
        ) as HTMLElement;

        // The connector line is decorative; hide it from assistive tech.
        connectorLine.setAttribute('aria-hidden', 'true');
        connectorLine.setAttribute('focusable', 'false');
        // Adds the Smart Label connector line to the series text element to ensure
        // proper rendering and grouping with the data label elements.
        if (series.textElement && series.shapeElement) {
            appendChildElement(this.chart.enableCanvas, series.textElement, connectorLine, this.chart.redraw, true);
        }

        // Draw pointer shape if configured
        if (relocateSettings && relocateSettings.pointerShape && relocateSettings.pointerShape !== 'None') {
            this.drawPointerShape(labelLocation, pointLocation, series, point, dataLabel, lineColor, lineOpacity, labelIndex);
        }
    }

    private getConnectorId(series: Series, point: Points, labelIndex: number, suffix: string): string {
        return this.chart.element.id + '_Series_' + series.index + '_Point_' + point.index + suffix +
            (labelIndex > 0 ? '_' + labelIndex : '');
    }

    /**
     * Draws a pointer shape at the connection point.
     *
     * @param {ChartLocation} labelLocation - The location of the repositioned label.
     * @param {ChartLocation} pointLocation - The location of the data point.
     * @param {Series} series - The series associated with the data label.
     * @param {Points} point - The data point to which the data label is associated.
     * @param {DataLabelSettingsModel} dataLabel - The data label settings.
     * @param {string} color - The color of the pointer.
     * @param {number} opacity - The opacity of the pointer.
     * @param {number} labelIndex - The index of the label within the point (0 for the primary label).
     * @returns {void}
     * @private
     */
    private drawPointerShape(
        labelLocation: ChartLocation, pointLocation: ChartLocation, series: Series,
        point: Points, dataLabel: DataLabelSettingsModel, color: string, opacity: number = 1, labelIndex: number = 0
    ): void {
        const relocateSettings: SmartLabelSettingsModel = dataLabel.smartLabelSettings;
        const pointerShape: string = relocateSettings.pointerShape;
        const pointerId: string = this.getConnectorId(series, point, labelIndex, '_Pointer');
        const clip: Rect = series.clipRect;

        if (pointerShape === 'Arrow') {
            // Calculate arrow dimensions
            const arrowSize: number = 6;
            const angle: number = Math.atan2(pointLocation.y - labelLocation.y, pointLocation.x - labelLocation.x);

            // Calculate arrow points
            const arrowTipX: number = pointLocation.x;
            const arrowTipY: number = pointLocation.y;
            const arrowBaseX: number = pointLocation.x - arrowSize * Math.cos(angle);
            const arrowBaseY: number = pointLocation.y - arrowSize * Math.sin(angle);

            // Left point of arrow
            const arrowLeftX: number = arrowBaseX - arrowSize * Math.sin(angle) * 0.5;
            const arrowLeftY: number = arrowBaseY + arrowSize * Math.cos(angle) * 0.5;

            // Right point of arrow
            const arrowRightX: number = arrowBaseX + arrowSize * Math.sin(angle) * 0.5;
            const arrowRightY: number = arrowBaseY - arrowSize * Math.cos(angle) * 0.5;

            // Create arrow path
            const arrowPath: string = 'M ' + arrowTipX + ' ' + arrowTipY +
                ' L ' + arrowLeftX + ' ' + arrowLeftY +
                ' L ' + arrowRightX + ' ' + arrowRightY + ' Z';

            const arrowOption: PathOption = new PathOption(
                pointerId,
                color,
                0,
                color,
                opacity,
                '',
                arrowPath
            );

            const pointer: Element = this.chart.renderer.drawPath(
                arrowOption,
                new Int32Array([clip.x, clip.y])
            ) as HTMLElement;

            // The pointer is decorative; hide it from assistive tech.
            pointer.setAttribute('aria-hidden', 'true');
            pointer.setAttribute('focusable', 'false');
            // Adds the Smart Label pointer to the series text element to ensure
            // proper rendering and grouping with the data label elements.
            if (series.textElement && series.shapeElement) {
                appendChildElement(this.chart.enableCanvas, series.textElement, pointer, this.chart.redraw, true);
            }
        }
    }

    /**
     * Initiates the animation for data labels.
     *
     * @param {Series} series - The series associated with the data labels.
     * @param {Element} [element] - The element to animate.
     * @returns {void}
     * @private
     */
    public doDataLabelAnimation(series: Series, element?: Element): void {
        const shapeElements: NodeList = series.shapeElement.childNodes;
        const textNode: NodeList = series.textElement.childNodes;
        const delay: number = series.animation.delay + series.animation.duration;
        const duration: number = series.chart.animated ? series.chart.duration : 200;
        let location: ChartLocation;
        const length: number = element ? 1 : textNode.length;
        let tempElement: HTMLElement;
        for (let i: number = 0; i < length; i++) {
            tempElement = textNode[i as number] as HTMLElement;
            if (element) {
                (<HTMLElement>element).style.visibility = 'hidden';
                templateAnimate(element, delay, duration, 'ZoomIn');
            } else {
                location = new ChartLocation(
                    (+tempElement.getAttribute('x')) + ((+tempElement.getAttribute('width')) / 2),
                    (+tempElement.getAttribute('y')) + ((+tempElement.getAttribute('height')) / 2));
                markerAnimate(tempElement, delay, series.animation.duration, series, null, location, true);
                if (shapeElements[i as number]) {
                    tempElement = shapeElements[i as number] as HTMLElement;
                    location = new ChartLocation(
                        (+tempElement.getAttribute('x')) + ((+tempElement.getAttribute('width')) / 2),
                        (+tempElement.getAttribute('y')) + ((+tempElement.getAttribute('height')) / 2));
                    markerAnimate(tempElement, delay, series.animation.duration, series, null, location, true);
                }
            }
        }
    }

    private getPosition(index: number): LabelPosition {
        return <LabelPosition>(['Outer', 'Top', 'Bottom', 'Middle', 'Auto'][index as number]);
    }

    private collectSmartLabel(
        series: Series, point: Points, dataLabel: DataLabelSettingsModel, text: string, color: string,
        backgroundFill: string, border: BorderModel, font: FontModel, isShape: boolean, textSize: Size,
        rect: Rect, actualRect: Rect, labelIndex: number, clip: Rect, ownRegion: Rect | null
    ): void {
        const anchorRegion: Rect = ownRegion || (point.regions && (point.regions[labelIndex as number] || point.regions[0]));
        const symbolLocation: ChartLocation = (point.symbolLocations && (point.symbolLocations[labelIndex as number] ||
            point.symbolLocations[0])) ? (point.symbolLocations[labelIndex as number] || point.symbolLocations[0]) :
            anchorRegion ? { x: anchorRegion.x + (anchorRegion.width / 2), y: anchorRegion.y + (anchorRegion.height / 2) } :
                { x: rect.x + (rect.width / 2), y: rect.y + (rect.height / 2) };
        this.pendingSmartLabels.push({
            series: series,
            point: point,
            dataLabel: dataLabel,
            text: text,
            color: color,
            backgroundFill: backgroundFill,
            border: border,
            font: font,
            isShape: isShape,
            textSize: textSize,
            desiredRect: actualRect,
            anchor: { x: symbolLocation.x + clip.x, y: symbolLocation.y + clip.y },
            ownRegion: ownRegion ? new Rect(ownRegion.x + clip.x, ownRegion.y + clip.y, ownRegion.width, ownRegion.height) : null,
            labelIndex: labelIndex,
            clip: clip
        });
    }

    /**
     * Pass 1: places every pending Smart Label one by one (spec section 8), each validated against
     * chart bounds, series markers, series elements (own and other series) and every label already
     * placed in this pass, using a Top/Bottom/Left/Right/Outer/Inner search with progressively
     * increasing offset (spec sections 2-4), drawing a connector line only when the label actually
     * moved off its point (spec section 5).
     *
     * @returns {void}
     * @private
     */
    public renderSmartLabels(): void {
        if (!this.pendingSmartLabels || this.pendingSmartLabels.length === 0) {
            return;
        }
        const plotBounds: Rect = ((this.chart.chartAxisLayoutPanel && this.chart.chartAxisLayoutPanel.seriesClipRect) ?
            this.chart.chartAxisLayoutPanel.seriesClipRect : null) as Rect;
        // chart.markerCollections isn't populated by the marker-rendering code, so marker regions are
        // built directly from each visible point's symbolLocations instead.
        const markerBlockers: Rect[] = this.collectMarkerBounds();
        this.seriesElementBounds = this.pendingSmartLabels.some((pending: SmartLabelPendingInfo): boolean => {
            return this.hidesOnSeriesOverlap(pending.dataLabel);
        }) ? this.collectElementBounds() : null;
        const placedSmartLabelRects: Rect[] = [];
        // Spread once per pass instead of once per label (placeSmartLabel only reads this array).
        const staticBlockers: Rect[] = [...this.chart.dataLabelCollections, ...markerBlockers];

        for (const pending of this.pendingSmartLabels) {
            this.placeSmartLabel(pending, staticBlockers, placedSmartLabelRects, plotBounds);
        }
        this.pendingSmartLabels = [];
        this.seriesElementBounds = null;
    }

    /**
     * Hides every label rendered with `seriesOverlapAction` that overlaps a series element.
     * Runs once all series are rendered, because the elements of later series do not exist while an
     * earlier series renders its labels. Labels are never moved here.
     *
     * @returns {void}
     * @private
     */
    public hideLabelsOverlappingSeriesElements(): void {
        const labels: SeriesOverlapLabel[] = this.seriesOverlapLabels;
        this.seriesOverlapLabels = [];
        if (!labels.length || this.chart.enableCanvas) {
            return;
        }
        const elements: SeriesElementBounds[] = this.collectElementBounds();
        for (const label of labels) {
            if (!this.overlapsSeriesElement(label.rect, elements, label.series, label.point)) {
                continue;
            }
            const idPrefix: string = this.chart.element.id + '_Series_' + label.series.index + '_Point_' + label.point.index;
            const related: Element[] = [
                label.textElement,
                label.shapeId ? getElement(label.shapeId) : null,
                getElement(idPrefix + '_ConnectorLine'),
                getElement(idPrefix + '_Pointer')
            ];
            for (const element of related) {
                if (element && element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }
        }
    }

    private hidesOnSeriesOverlap(dataLabel: DataLabelSettingsModel): boolean {
        return !!(dataLabel && dataLabel.smartLabelSettings && dataLabel.smartLabelSettings.seriesOverlapAction === 'Hide');
    }

    /**
     * Collects the rendered geometry of every visible series: the regions of rectangular series and the
     * path (sampled to a polyline) of line, area and trendline series.
     *
     * @returns {SeriesElementBounds[]} - chart/plot-area space geometry per series.
     * @private
     */
    private collectElementBounds(): SeriesElementBounds[] {
        const entries: SeriesElementBounds[] = [];
        if (this.chart.enableCanvas) {
            return entries;
        }
        for (const series of this.chart.visibleSeries) {
            if (!series || !series.visible || !series.points) {
                continue;
            }
            const clip: Rect = series.clipRect;
            const bounds: Rect[] = [];
            const paths: ChartLocation[][] = [];
            if (series.isRectSeries) {
                for (const point of series.points) {
                    if (!point || !point.visible || !point.symbolLocations || !point.regions) {
                        continue;
                    }
                    // Rect series (Column/Bar/Candle/stacking): the region is the drawn element.
                    for (const region of point.regions) {
                        if (region && region.width > 0 && region.height > 0) {
                            bounds.push(new Rect(region.x + clip.x, region.y + clip.y, region.width, region.height));
                        }
                    }
                }
            }
            // Line-type series: regions are empty, so use the rendered path geometry instead.
            if (bounds.length === 0 && series.pathElement) {
                const direction: string = series.pathElement.getAttribute('d');
                if (direction) {
                    // Path vertices are series-clip-relative; shift them to chart/plot-area space.
                    paths.push(...this.parsePath(direction, clip));
                }
            }
            if (bounds.length > 0 || paths.length > 0) {
                entries.push({
                    series: series, bounds: bounds, paths: paths,
                    halfWidth: Math.max(series.width || 2, 2) / 2, isArea: series.type.indexOf('Area') > -1
                });
            }
        }
        return entries;
    }

    /**
     * Converts an SVG path (absolute M, L, H, V, C, S, Q, T, A, Z commands) into polylines, sampling curves.
     *
     * @param {string} direction - The `d` attribute of the path.
     * @param {Rect} clip - The series clip rect used to shift the vertices.
     * @returns {ChartLocation[]} - Array of polylines (each sub path as an array of points).
     * @private
     */
    private parsePath(direction: string, clip: Rect): ChartLocation[][] {
        const tokens: string[] = direction.match(/[A-Za-z]|-?[\d.]+e[-+]?\d+|-?[\d.]+/g) || [];
        const paths: ChartLocation[][] = [];
        const steps: number = 12;
        let current: ChartLocation[] = null;
        let command: string = '';
        let index: number = 0;
        let x: number = 0;
        let y: number = 0;
        let startX: number = 0;
        let startY: number = 0;
        const add: Function = (px: number, py: number): void => {
            x = px; y = py;
            if (!current) {
                current = [];
                paths.push(current);
            }
            current.push(new ChartLocation(px + clip.x, py + clip.y));
        };
        const read: Function = (count: number): number[] => {
            const values: number[] = [];
            for (let i: number = 0; i < count; i++) {
                values.push(parseFloat(tokens[index++]));
            }
            return values;
        };
        while (index < tokens.length) {
            if (/[A-Za-z]/.test(tokens[index as number])) {
                command = tokens[index++].toUpperCase();
                if (command === 'Z') {
                    if (current) {
                        add(startX, startY);
                    }
                    current = null;
                    x = startX; y = startY;
                    continue;
                }
            }
            if (command === 'M') {
                const v: number[] = read(2);
                current = null;
                add(v[0], v[1]);
                startX = v[0]; startY = v[1];
                command = 'L';
            } else if (command === 'L') {
                const v: number[] = read(2);
                add(v[0], v[1]);
            } else if (command === 'H') {
                add(read(1)[0], y);
            } else if (command === 'V') {
                add(x, read(1)[0]);
            } else if (command === 'C' || command === 'S' || command === 'Q' || command === 'T') {
                const count: number = command === 'C' ? 6 : (command === 'S' || command === 'Q') ? 4 : 2;
                const v: number[] = read(count);
                const x0: number = x;
                const y0: number = y;
                for (let step: number = 1; step <= steps; step++) {
                    const t: number = step / steps;
                    const mt: number = 1 - t;
                    if (command === 'C') {
                        add((mt * mt * mt * x0) + (3 * mt * mt * t * v[0]) + (3 * mt * t * t * v[2]) + (t * t * t * v[4]),
                            (mt * mt * mt * y0) + (3 * mt * mt * t * v[1]) + (3 * mt * t * t * v[3]) + (t * t * t * v[5]));
                    } else if (command === 'T') {
                        add(x0 + ((v[0] - x0) * t), y0 + ((v[1] - y0) * t));
                    } else {
                        // Q, and S approximated with its end-side control point.
                        add((mt * mt * x0) + (2 * mt * t * v[0]) + (t * t * v[2]),
                            (mt * mt * y0) + (2 * mt * t * v[1]) + (t * t * v[3]));
                    }
                }
            } else if (command === 'A') {
                const v: number[] = read(7);
                add(v[5], v[6]);
            } else {
                index++;
            }
        }
        return paths.filter((path: ChartLocation[]): boolean => path.length > 1);
    }

    /**
     * Checks whether a label rect overlaps any series element. The rectangular element of the label's own
     * point is ignored, and so is the filled region of the label's own area series.
     *
     * @param {Rect} rect - The label rect in chart/plot-area space.
     * @param {SeriesElementBounds[]} elements - The collected series geometry.
     * @param {Series} ownSeries - The series the label belongs to.
     * @param {Points} ownPoint - The point the label belongs to.
     * @returns {boolean} - True when the label overlaps a series element.
     * @private
     */
    private overlapsSeriesElement(rect: Rect, elements: SeriesElementBounds[], ownSeries: Series, ownPoint: Points): boolean {
        const clip: Rect = ownSeries.clipRect;
        const ownRegions: Rect[] = (ownPoint && ownPoint.regions ? ownPoint.regions : []).map((region: Rect): Rect => {
            return new Rect(region.x + clip.x, region.y + clip.y, region.width, region.height);
        });
        for (const element of elements) {
            for (const bound of element.bounds) {
                const isOwn: boolean = element.series === ownSeries && ownRegions.some((region: Rect): boolean => {
                    return Math.abs(region.x - bound.x) < 0.5 && Math.abs(region.y - bound.y) < 0.5 &&
                        Math.abs(region.width - bound.width) < 0.5 && Math.abs(region.height - bound.height) < 0.5;
                });
                if (!isOwn && isOverlap(rect, bound)) {
                    return true;
                }
            }
            const area: Rect = new Rect(
                rect.x - element.halfWidth, rect.y - element.halfWidth,
                rect.width + (element.halfWidth * 2), rect.height + (element.halfWidth * 2)
            );
            for (const path of element.paths) {
                for (let i: number = 1; i < path.length; i++) {
                    if (this.segmentIntersectsRect(path[i - 1], path[i as number], area)) {
                        return true;
                    }
                }
                if (element.isArea && element.series !== ownSeries) {
                    const corners: ChartLocation[] = this.getRectanglePoints(rect);
                    if (corners.some((corner: ChartLocation): boolean => this.isInsidePolygon(corner, path))) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private segmentIntersectsRect(start: ChartLocation, end: ChartLocation, rect: Rect): boolean {
        const dx: number = end.x - start.x;
        const dy: number = end.y - start.y;
        const p: number[] = [-dx, dx, -dy, dy];
        const q: number[] = [start.x - rect.x, rect.x + rect.width - start.x, start.y - rect.y, rect.y + rect.height - start.y];
        let t0: number = 0;
        let t1: number = 1;
        for (let i: number = 0; i < 4; i++) {
            if (p[i as number] === 0) {
                if (q[i as number] < 0) {
                    return false;
                }
            } else {
                const t: number = q[i as number] / p[i as number];
                if (p[i as number] < 0) {
                    if (t > t1) {
                        return false;
                    }
                    t0 = Math.max(t0, t);
                } else {
                    if (t < t0) {
                        return false;
                    }
                    t1 = Math.min(t1, t);
                }
            }
        }
        return true;
    }

    private isInsidePolygon(location: ChartLocation, polygon: ChartLocation[]): boolean {
        let inside: boolean = false;
        for (let i: number = 0, j: number = polygon.length - 1; i < polygon.length; j = i++) {
            const a: ChartLocation = polygon[i as number];
            const b: ChartLocation = polygon[j as number];
            if ((a.y > location.y) !== (b.y > location.y) &&
                location.x < ((b.x - a.x) * (location.y - a.y) / (b.y - a.y)) + a.x) {
                inside = !inside;
            }
        }
        return inside;
    }

    /**
     * Builds marker collision regions from every visible point's `symbolLocations`, sized by that
     * series' own configured marker width/height. Only series with a visible marker contribute
     * blockers, since an invisible marker occupies no drawn space to avoid.
     *
     * @returns {Rect[]} - chart/plot-area-space bounds for every rendered marker.
     * @private
     */
    private collectMarkerBounds(): Rect[] {
        const bounds: Rect[] = [];
        for (const series of this.chart.visibleSeries) {
            if (!series || !series.visible || !series.points) {
                continue;
            }
            const clip: Rect = series.clipRect;
            const halfWidth: number = (series.marker.width || 10) / 2;
            const halfHeight: number = (series.marker.height || 10) / 2;
            for (const point of series.points) {
                if (!point || !point.visible || !point.symbolLocations) {
                    continue;
                }
                for (const location of point.symbolLocations) {
                    if (!location) {
                        continue;
                    }
                    bounds.push(new Rect(
                        location.x + clip.x - halfWidth, location.y + clip.y - halfHeight,
                        halfWidth * 2, halfHeight * 2
                    ));
                }
            }
        }
        return bounds;
    }

    private buildSmartLabelCandidates(
        anchor: ChartLocation, desiredRect: Rect, w: number, h: number, offset: number, baseOffset: number
    ): { name: string; rect: Rect }[] {
        const cx: number = anchor.x;
        const cy: number = anchor.y;
        const candidates: { name: string; rect: Rect }[] = [
            { name: 'Top', rect: new Rect(cx - (w / 2), cy - offset - h, w, h) },
            { name: 'Bottom', rect: new Rect(cx - (w / 2), cy + offset, w, h) },
            { name: 'Left', rect: new Rect(cx - offset - w, cy - (h / 2), w, h) },
            { name: 'Right', rect: new Rect(cx + offset, cy - (h / 2), w, h) }
        ];
        const outerDx: number = (desiredRect.x + (desiredRect.width / 2)) - cx;
        const outerDy: number = (desiredRect.y + (desiredRect.height / 2)) - cy;
        const outerLen: number = Math.sqrt((outerDx * outerDx) + (outerDy * outerDy)) || 1;
        const outerUx: number = outerDx / outerLen;
        const outerUy: number = outerDy / outerLen;
        const outerCx: number = cx + (outerUx * (outerLen + offset - baseOffset));
        const outerCy: number = cy + (outerUy * (outerLen + offset - baseOffset));
        candidates.push({ name: 'Outer', rect: new Rect(outerCx - (w / 2), outerCy - (h / 2), w, h) });
        // Inner mirrors Outer back through the anchor - towards the point's own element interior.
        candidates.push({
            name: 'Inner',
            rect: new Rect((2 * cx) - outerCx - (w / 2), (2 * cy) - outerCy - (h / 2), w, h)
        });
        return candidates;
    }

    private getRangeSmartLabelSide(pending: SmartLabelPendingInfo): string | null {
        const type: string = pending.series.type;
        if (type !== 'RangeArea' && type !== 'SplineRangeArea' && type !== 'RangeStepArea' && type !== 'RangeColumn') {
            return null;
        }
        const yInversed: boolean = pending.series.yAxis.isAxisInverse;
        const isUpper: boolean = (pending.labelIndex === 0 && !yInversed) || (pending.labelIndex === 1 && yInversed);
        if (this.chart.requireInvertedAxis) {
            return isUpper ? 'Right' : 'Left';
        }
        return isUpper ? 'Top' : 'Bottom';
    }

    private buildRangeSmartLabelRect(anchor: ChartLocation, side: string, w: number, h: number, offset: number): Rect {
        switch (side) {
        case 'Top':
            return new Rect(anchor.x - (w / 2), anchor.y - offset - h, w, h);
        case 'Bottom':
            return new Rect(anchor.x - (w / 2), anchor.y + offset, w, h);
        case 'Left':
            return new Rect(anchor.x - offset - w, anchor.y - (h / 2), w, h);
        default:
            return new Rect(anchor.x + offset, anchor.y - (h / 2), w, h);
        }
    }

    private clampCandidateToClipRect(rect: Rect, clip: Rect, enableRotation: boolean, angle: number): void {
        // Outer guard from calculateTextPosition(): skip rotated labels (clamping a rotated bbox in
        // axis-aligned space is meaningless) and labels wholly outside the plot area (clamping them
        // would pull them back to the wrong side).
        if (enableRotation && angle !== 0) {
            return;
        }
        if ((rect.y > (clip.y + clip.height)) || (rect.x > (clip.x + clip.width)) ||
            (rect.x + rect.width < 0) || (rect.y + rect.height < 0)) {
            return;
        }
        const padding: number = 5;
        // Left edge: snap inward by padding if past the clip.
        rect.x = rect.x < clip.x ? clip.x + padding : rect.x;
        // Top edge: snap inward by padding if past the clip.
        rect.y = rect.y < clip.y ? clip.y + padding : rect.y;
        // Right edge: shift left by (rightOverflow + padding) if past the clip.
        if (rect.x + rect.width > clip.x + clip.width) {
            rect.x -= (rect.x + rect.width) - (clip.x + clip.width) + padding;
        }
        // Bottom edge: shift up by (bottomOverflow + padding) if past the clip.
        if (rect.y + rect.height > clip.y + clip.height) {
            rect.y -= (rect.y + rect.height) - (clip.y + clip.height) + padding;
        }
    }

    private placeSmartLabel(
        pending: SmartLabelPendingInfo, staticBlockers: Rect[],
        placedSmartLabelRects: Rect[], plotBounds: Rect
    ): void {
        const dataLabel: DataLabelSettingsModel = pending.dataLabel;
        const anchor: ChartLocation = pending.anchor;
        const textSize: Size = pending.textSize;
        const isShape: boolean = pending.isShape;
        const shapePad: number = isShape ? 4 : 0;
        const w: number = textSize.width + (shapePad * 2);
        const h: number = textSize.height + (shapePad * 2);
        const baseOffset: number = 4;
        const step: number = 2;
        const maxOffset: number = baseOffset + (step * 8);
        const emptyRect: Rect = { x: 0, y: 0, width: 0, height: 0 };

        let chosen: Rect | null = null;
        // Tracks whether the chosen position is a Smart Label candidate picked to avoid a collision
        // (true) or the original default label position with no relocation (false). Only relocated
        // labels need a connector line back to their data point.
        let isRelocated: boolean = false;

        // Keep the default (non-smart) label position whenever it is collision-free and inside the plot area;
        // the candidate search below is used only when the default position actually needs to be relocated.
        const desired: Rect = pending.desiredRect;
        const defaultRect: Rect = new Rect(
            desired.x + (desired.width / 2) - (w / 2), desired.y + (desired.height / 2) - (h / 2), w, h
        );
        const defaultInside: boolean = !plotBounds || (
            defaultRect.x >= plotBounds.x && defaultRect.y >= plotBounds.y &&
            (defaultRect.x + defaultRect.width) <= (plotBounds.x + plotBounds.width) &&
            (defaultRect.y + defaultRect.height) <= (plotBounds.y + plotBounds.height)
        );
        const hidesOnOverlap: boolean = !!this.seriesElementBounds && this.hidesOnSeriesOverlap(dataLabel);
        // Range series: the upper label is only ever tried above the range and the lower label only below it
        // (left/right when the axes are inverted); only the padding grows. No other candidate is evaluated.
        const rangeSide: string | null = this.getRangeSmartLabelSide(pending);
        if (!rangeSide && defaultInside && !isCollide(defaultRect, staticBlockers, emptyRect) &&
            !isCollide(defaultRect, placedSmartLabelRects, emptyRect) &&
            !(hidesOnOverlap && this.overlapsSeriesElement(defaultRect, this.seriesElementBounds, pending.series, pending.point))) {
            chosen = defaultRect;
            isRelocated = false;
        }

        // Range labels keep growing the padding in their own direction until they leave the plot area, so a free
        // slot further out is still found; the generic search keeps its fixed limit.
        const searchLimit: number = rangeSide && plotBounds ? Math.max(plotBounds.width, plotBounds.height) : maxOffset;
        for (let offset: number = baseOffset; offset <= searchLimit && !chosen; offset += step) {
            const candidates: { name: string; rect: Rect }[] = rangeSide ?
                [{ name: rangeSide, rect: this.buildRangeSmartLabelRect(anchor, rangeSide, w, h, offset) }] :
                this.buildSmartLabelCandidates(anchor, pending.desiredRect, w, h, offset, baseOffset);
            for (const candidate of candidates) {
                const rect: Rect = candidate.rect;
                if (!rangeSide) {
                    this.clampCandidateToClipRect(rect, plotBounds, false, 0);
                } else if (plotBounds && (rangeSide === 'Top' || rangeSide === 'Bottom')) {
                    // Edge points: slide the label sideways into the plot area; it stays above/below the range.
                    rect.x = Math.max(plotBounds.x, Math.min(rect.x, plotBounds.x + plotBounds.width - rect.width));
                } else if (plotBounds) {
                    rect.y = Math.max(plotBounds.y, Math.min(rect.y, plotBounds.y + plotBounds.height - rect.height));
                }
                const insideBounds: boolean = !plotBounds || (
                    rect.x >= plotBounds.x && rect.y >= plotBounds.y &&
                    (rect.x + rect.width) <= (plotBounds.x + plotBounds.width) &&
                    (rect.y + rect.height) <= (plotBounds.y + plotBounds.height)
                );
                const collides: boolean = isCollide(rect, staticBlockers, emptyRect) ||
                    isCollide(rect, placedSmartLabelRects, emptyRect) ||
                    (hidesOnOverlap && this.overlapsSeriesElement(rect, this.seriesElementBounds, pending.series, pending.point));
                if (insideBounds && !collides) {
                    chosen = rect;
                    isRelocated = true;
                    break;
                }
            }
        }

        // No collision-free position inside the plot area exists (e.g. a very small chart): skip this label
        // rather than drawing it over another label, marker or series element.
        if (!chosen) {
            return;
        }

        // Registered immediately so later Smart Labels in this same pass see it (spec section 8).
        this.chart.dataLabelCollections.push(chosen);
        placedSmartLabelRects.push(chosen);

        this.drawSmartLabelElement(pending, chosen, isShape, shapePad);

        // Connector lines are drawn only when the Smart Label algorithm relocated the label AND the gap between
        // the point's symbol location and the final label bounds exceeds the threshold. Labels left in their default
        // position, or relocated but still close to the point, are rendered clean without leader lines.
        const right: number = chosen.x + chosen.width;
        const bottom: number = chosen.y + chosen.height;
        const dx: number = anchor.x < chosen.x ? chosen.x - anchor.x : (anchor.x > right ? anchor.x - right : 0);
        const dy: number = anchor.y < chosen.y ? chosen.y - anchor.y : (anchor.y > bottom ? anchor.y - bottom : 0);
        const connectorThreshold: number = 12;
        if (isRelocated && Math.sqrt((dx * dx) + (dy * dy)) > connectorThreshold) {
            let edge: ChartLocation;
            if (dy >= dx) {
                // Label above the point -> bottom edge; label below the point -> top edge.
                edge = { x: chosen.x + (chosen.width / 2), y: anchor.y > bottom ? bottom : chosen.y };
            } else {
                // Label left of the point -> right edge; label right of the point -> left edge.
                edge = { x: anchor.x > right ? right : chosen.x, y: chosen.y + (chosen.height / 2) };
            }
            const clip: Rect = pending.clip;
            // drawConnectorLine expects clip-relative coordinates - it applies the clip offset itself.
            this.drawConnectorLine(
                { x: edge.x - clip.x, y: edge.y - clip.y },
                { x: anchor.x - clip.x, y: anchor.y - clip.y },
                pending.series, pending.point, dataLabel, pending.labelIndex
            );
        }
    }

    private drawSmartLabelElement(pending: SmartLabelPendingInfo, chosenAbsolute: Rect, isShape: boolean, shapePad: number): void {
        const series: Series = pending.series;
        const point: Points = pending.point;
        const dataLabel: DataLabelSettingsModel = pending.dataLabel;
        const clip: Rect = pending.clip;
        const rect: Rect = new Rect(
            chosenAbsolute.x - clip.x + shapePad, chosenAbsolute.y - clip.y + shapePad,
            chosenAbsolute.width - (shapePad * 2), chosenAbsolute.height - (shapePad * 2)
        );
        const labelId: string = this.chart.element.id + '_Series_' + series.index + '_Point_' + point.index + '_Text_Smart_' + pending.labelIndex;

        if (isShape) {
            const shapeId: string = this.chart.element.id + '_Series_' + series.index + '_Point_' + point.index + '_TextShape_Smart_' + pending.labelIndex;
            const shapeRect: Rect = new Rect(
                rect.x - shapePad, rect.y - shapePad, rect.width + (shapePad * 2), rect.height + (shapePad * 2)
            );
            const rectOption: RectOption = new RectOption(
                shapeId, pending.backgroundFill, pending.border, dataLabel.opacity as number, shapeRect,
                dataLabel.rx, dataLabel.ry, '', (pending.border as BorderModel).dashArray
            );
            const shapeElement: HTMLElement = this.chart.renderer.drawRectangle(
                rectOption, new Int32Array([clip.x, clip.y])) as HTMLElement;
            appendChildElement(
                this.chart.enableCanvas, series.shapeElement || series.textElement, shapeElement,
                this.chart.redraw, true, 'x', 'y', undefined, '', false, false, undefined, series.animation.duration
            );
        }

        const textElem: Element = textElement(
            this.chart.renderer,
            new TextOption(labelId, rect.x + (rect.width / 2), rect.y + (rect.height / 1.5), 'middle', pending.text),
            pending.font, pending.color, series.textElement, false, this.chart.redraw, true, false,
            series.animation.duration, clip, undefined, undefined, this.chart.enableCanvas, undefined,
            this.chart.themeStyle.datalabelFont, new ChartLocation(rect.x, rect.y)
        );
        if (textElem && !this.chart.enableCanvas && !isShape) {
            const outlineColor: string = (pending.backgroundFill && pending.backgroundFill !== 'transparent') ?
                pending.backgroundFill : ((this.chart.theme.indexOf('Dark') > -1 || this.chart.theme.indexOf('HighContrast') > -1) ? '#000000' : '#ffffff');
            textElem.setAttribute('paint-order', 'stroke fill');
            textElem.setAttribute('stroke', outlineColor);
            textElem.setAttribute('stroke-width', '3px');
            textElem.setAttribute('stroke-linejoin', 'round');
        }
        if (textElem && series.textElement && (textElem as HTMLElement).parentNode !== series.textElement) {
            appendChildElement(this.chart.enableCanvas, series.textElement, textElem, this.chart.redraw, true);
        }
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        // Returns the module name
        return 'DataLabel';
    }
    /**
     * To destroy the dataLabel for series.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        // Destroy method performed here
    }

}
