import { IntervalType } from '../../common/utils/enum';
import { firstToLowerCase, RectOption, getPoint } from '../../common/utils/helper';
import { Axis } from '../../chart/axis/axis';
import { DateTime } from '../../chart/axis/date-time-axis';
import { Logarithmic } from '../../chart/axis/logarithmic-axis';
import { NiceInterval } from '../../chart/axis/axis-helper';
import { AxisModel } from '../../chart/axis/axis-model';
import { RangeNavigator } from '../range-navigator';
import { DataManager, Query, DataUtil } from '@syncfusion/ej2-data';
import { DataPoint } from '../utils/helper';
import { animationMode, createElement, getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Animation, AnimationOptions } from '@syncfusion/ej2-base';
import { Double } from '../../chart/axis/double-axis';
import { RangeNavigatorSeries } from '../model/range-base';
import { getSeriesColor } from '../../common/model/theme';
import { PathOption, Rect, measureText, Size } from '@syncfusion/ej2-svg-base';
import { Data } from '../../common/model/data';
import { DateTimeCategory } from '../../chart/axis/date-time-category-axis';
import { StockSeriesModel } from '../../stock-chart';
import { RangeNavigatorType } from '../..';

/**
 * To render Chart series
 */
interface LiveXAxisRange {
    min: number;
    max: number;
    delta: number;
}

interface LiveTextAnimation {
    element: SVGTextElement;
    oldX: number;
    finalX: number;
}

interface LivePathAnimation {
    element: SVGPathElement;
    template: string;
    oldNumbers: number[];
    finalNumbers: number[];
}
export class RangeSeries extends NiceInterval {
    private dataSource: Object | DataManager;
    private xName: string;
    private yName: string;
    private query: Query;
    public xMin: number;
    private previousLiveXAxisRange: LiveXAxisRange | null = null;
    public xMax: number;
    public yMin: number;
    public yMax: number;
    private yAxis: Axis;
    public xAxis: Axis;
    public labels: string[];
    public indexLabels: { [key: string]: number };
    private seriesLength: number;
    private chartGroup: Element;
    constructor(range: RangeNavigator) {
        super();
        this.dataSource = range.dataSource;
        this.xName = range.xName;
        this.yName = range.yName;
        this.query = range.query;
        this.xMin = Infinity; this.xMax = -Infinity;
        this.yMin = Infinity; this.yMax = -Infinity;
        this.labels = [];
        this.indexLabels = {};
    }

    /**
     * To render light weight and data manager process.
     *
     * @param {RangeNavigator} control - RangeNavigator instance.
     * @returns {void}
     */
    public renderChart(control: RangeNavigator): void {
        let dataSource: Object;
        let query: Query;
        this.seriesLength = 0;
        control.rangeSlider.points = [];

        const allSeries: RangeNavigatorSeries[] = control.series as RangeNavigatorSeries[];

        if (allSeries.length) {
            allSeries.map((series: RangeNavigatorSeries) => {
                dataSource = series.dataSource || control.dataSource;
                query = series.query || control.query;
                series.points = [];
                this.processDataSource(dataSource, query, control, series);
            });
        } else {
            this.processDataSource(control.dataSource, control.query, control);
        }
    }

    private processDataSource(dataSource: Object, query: Query, control: RangeNavigator, series?: RangeNavigatorSeries): void {
        if (!(dataSource instanceof DataManager) && !isNullOrUndefined(dataSource) && isNullOrUndefined(query)) {
            this.dataManagerSuccess({ result: dataSource, count: (dataSource as Object[]).length }, control, series);
            return;
        }
        control.dataModule = new Data(dataSource, query);
        const dataManager: Promise<Object> = control.dataModule.getData(control.dataModule.generateQuery().requiresCount());
        dataManager.then((e: { result: Object, count: number }) => this.dataManagerSuccess(e, control, series));
    }
    /**
     * data manager process calculated here.
     *
     * @param {Object} e - The data manager result object.
     * @param {Object} e.result - The result of the data manager process.
     * @param {number} e.count - The count of items in the result.
     * @param {RangeNavigator} control - The RangeNavigator control.
     * @param {RangeNavigatorSeries} series - Optional parameter representing the series data.
     * @returns {void}
     */
    private dataManagerSuccess(e: { result: Object, count: number }, control: RangeNavigator, series?: RangeNavigatorSeries): void {
        const viewData: Object = e.count ? e.result : [];
        control.allowServerDataBinding = false;
        this.processJsonData(viewData as Object[], control, Object.keys(viewData).length, series);
        this.seriesLength += series ? 1 : this.seriesLength;
        if (!series || this.seriesLength === (control.series as RangeNavigatorSeries[]).length) {
            this.processXAxis(control);
            this.calculateGroupingBounds(control);
            this.processYAxis(control);
            control.renderChart();
        }
    }
    /**
     * Process JSON data from data source.
     *
     * @param {Object[]} viewData - The data array to be processed.
     * @param {RangeNavigator} control - The RangeNavigator control.
     * @param {number} len - The length of the data array.
     * @param {RangeNavigatorSeries} series - The series data for the RangeNavigator control.
     * @returns {void}
     */
    private processJsonData(viewData: Object[], control: RangeNavigator, len: number, series: RangeNavigatorSeries): void {
        let i: number = 0;
        let point: DataPoint;
        const xName: string = (series && series.xName) || control.xName;
        const yName: string = (series && series.yName) || control.yName;
        const controlValueType: string = control.valueType as string;
        const isDateTime: boolean = controlValueType.indexOf('DateTime') > -1;
        const isDateTimeCategory: boolean = controlValueType === 'DateTimeCategory';

        // PERF: hoist Intl parser/formatter out of the per-point loop.
        // Previously rebuilt on every iteration (525,600 rebuilds for a
        // 525,600-row dataset). They are only needed for string-date
        // fallbacks; numeric and Date inputs bypass them entirely.
        const dateParser: Function = isDateTime ? control.intl.getDateParser({ skeleton: 'full', type: 'dateTime' }) : null;
        const dateFormatter: Function = isDateTime ? control.intl.getDateFormat({ skeleton: 'full', type: 'dateTime' }) : null;
        const indexLabels: { [key: string]: number } = this.indexLabels;
        const labels: string[] = this.labels;
        const hasNumberOrDateFastPath: boolean = isDateTime;
        const hasJsonParse: boolean = !!(DataUtil && DataUtil.parse && typeof DataUtil.parse.parseJson === 'function');

        while (i < len) {
            const rawX: any = getValue(xName, viewData[i as number]);
            const rawY: any = getValue(yName, viewData[i as number]);
            point = new DataPoint(rawX, rawY);
            (point as any).index = i;
            point.yValue = +point.y;
            // PERF: symbolLocations and regions are only consumed by the
            // Range Slider thumb hit-test and Range Navigator renderers
            // when rendering. Lazy-init them later — see RangeSeries
            // renderers' `storePointLocation` guards. Skipping the per-
            // point empty-array allocation avoids >525k unused arrays.

            if (hasNumberOrDateFastPath) {
                if (typeof rawX === 'number' && isFinite(rawX)) {
                    point.x = rawX;
                    point.xValue = rawX;
                } else if (rawX instanceof Date) {
                    point.xValue = rawX.getTime();
                    point.x = rawX;
                } else {
                    // String / serialized fallback preserves the
                    // original EJ2 semantics for ISO and locale strings.
                    const parsedVal: any = hasJsonParse
                        ? DataUtil.parse.parseJson({ val: rawX }).val
                        : rawX;
                    const parsedDate: Date = parsedVal instanceof Date
                        ? parsedVal
                        : new Date(parsedVal);
                    point.x = parsedDate;
                    if (isNaN(parsedDate.getTime())) {
                        i++;
                        continue;
                    }
                    point.xValue = parsedDate.getTime();
                }

                if (isDateTimeCategory) {
                    const key: string = point.xValue.toString();
                    if (indexLabels[key as string] === undefined) {
                        indexLabels[key as string] = labels.length;
                        labels.push(key);
                    }
                    point.xValue = indexLabels[key as string];
                }
            } else {
                // Double / Logarithmic
                point.xValue = +point.x;
            }

            // Ignore invalid numeric points for Double / Logarithmic so
            // axis range/label generation does not receive NaN/undefined.
            if (controlValueType === 'Double' || controlValueType === 'Logarithmic') {
                if (
                    isNullOrUndefined(point.xValue) ||
                    isNullOrUndefined(point.yValue) ||
                    isNaN(point.xValue as number) ||
                    isNaN(point.yValue as number)
                ) {
                    i++;
                    continue;
                }

                if (controlValueType === 'Logarithmic' && (point.xValue as number) <= 0) {
                    i++;
                    continue;
                }
            }

            if (series) {
                series.points.push(point);
            }
            const xv: number = point.xValue as number;
            if (xv < this.xMin) {
                this.xMin = xv;
            }
            if (xv > this.xMax) {
                this.xMax = xv;
            }
            if (point.visible) {
                const yv: number = point.yValue as number;
                if (yv < this.yMin) {
                    this.yMin = yv;
                }
                if (yv > this.yMax) {
                    this.yMax = yv;
                }
            }
            control.rangeSlider.points.push(point);
            i++;
        }
    }

    /**
     * Updates the existing final point in a Range Navigator series.
     *
     * This method does not add a new point. The x-value of the
     * supplied data must match the current last point.
     *
     * @param {Object} dataPoint - Specifies the updated data point.
     * @param {number} seriesIndex - Specifies the series index.
     * @param {RangeNavigator} control - Specifies the Range Navigator.
     * @param {number} duration - Specifies the animation duration.
     * @returns {void}
     *
     * @private
     */
    public setData(
        dataPoint: Object,
        seriesIndex: number,
        control: RangeNavigator,
        duration?: number
    ): void {
        const seriesCollection: RangeNavigatorSeries[] =
        control.series as RangeNavigatorSeries[];
        const series: RangeNavigatorSeries =
        seriesCollection[seriesIndex as number];

        const updatedPoint: DataPoint | null =
        this.createLivePoint(
            dataPoint,
            series,
            control
        );

        const lastIndex: number =
        series.points.length - 1;

        const existingPoint: DataPoint =
        series.points[lastIndex as number];
        (updatedPoint as any).index =
        (existingPoint as any).index;

        (updatedPoint as any).symbolLocations =
        [];

        (updatedPoint as any).regions =
        [];

        updatedPoint.visible = true;

        /*
     * Replace the series point without increasing its length.
     */
        series.points[lastIndex as number] =
        updatedPoint;

        /*
     * Replace the corresponding RangeSlider point.
     * Search from the end because the same slider collection
     * can include points from multiple series.
     */
        if (
            control.rangeSlider &&
        control.rangeSlider.points
        ) {
            for (
                let index: number =
                control.rangeSlider.points.length - 1;
                index >= 0;
                index--
            ) {
                const sliderPoint: DataPoint =
                control.rangeSlider.points[index as number];

                if (
                    Number(sliderPoint.xValue) ===
                Number(existingPoint.xValue)
                ) {
                    control.rangeSlider.points[index as number] =
                    updatedPoint;

                    break;
                }
            }
        }

        /*
     * Recalculate the navigator Y range because the updated
     * value can be outside the previous range.
     */
        this.yMin = Infinity;
        this.yMax = -Infinity;

        for (
            let collectionIndex: number = 0;
            collectionIndex < seriesCollection.length;
            collectionIndex++
        ) {
            const currentSeries: RangeNavigatorSeries =
            seriesCollection[collectionIndex as number];

            for (
                let pointIndex: number = 0;
                pointIndex < currentSeries.points.length;
                pointIndex++
            ) {
                const currentPoint: DataPoint =
                currentSeries.points[pointIndex as number];

                const yValue: number =
                Number(currentPoint.yValue);

                if (
                    currentPoint.visible !== false &&
                !isNaN(yValue)
                ) {
                    this.yMin =
                    Math.min(this.yMin, yValue);

                    this.yMax =
                    Math.max(this.yMax, yValue);
                }
            }
        }

        this.processYAxis(control);
        this.updateLiveSeriesAxes(control);

        /*
     * The x-value is unchanged, so the navigator X-axis and
     * slider selection do not need to move.
     */
        this.refreshLiveSeries(
            series,
            seriesIndex,
            control,
            duration
        );
    }


    /**
     * Adds a new point to the Range Navigator series.
     *
     * @param {Object} dataPoint - Specifies the point to add.
     * @param {number} seriesIndex - Specifies the series index.
     * @param {RangeNavigator} control - Specifies the Range Navigator.
     * @param {number} duration - Specifies the animation duration.
     * @returns {void}
     *
     * @private
     */
    public addPoint(
        dataPoint: Object,
        seriesIndex: number,
        control: RangeNavigator
    ): RangeNavigatorSeries | null {
        const seriesCollection:
        any =
        control.series;

        const series: RangeNavigatorSeries =
        seriesCollection[seriesIndex  as number];

        const point: any =
        this.createLivePoint(
            dataPoint,
            series,
            control
        );
        if (
            this.xAxis &&
        this.xAxis.actualRange
        ) {
            this.previousLiveXAxisRange = {
                min:
                Number(
                    this.xAxis.actualRange.min
                ),

                max:
                Number(
                    this.xAxis.actualRange.max
                ),

                delta:
                Number(
                    this.xAxis.actualRange.delta
                )
            };
        } else {
            this.previousLiveXAxisRange =
            null;
        }

        point.index =
        series.points.length;

        point.symbolLocations = [];
        point.regions = [];
        point.visible = true;

        series.points.push(
            point
        );

        if (!control.rangeSlider.points) {
            control.rangeSlider.points = [];
        }

        control.rangeSlider.points.push(
            point
        );

        this.xMin =
        Math.min(
            this.xMin,
            Number(point.xValue)
        );

        this.xMax =
        Math.max(
            this.xMax,
            Number(point.xValue)
        );

        if (!isNaN(Number(point.yValue))) {
            this.yMin =
            Math.min(
                this.yMin,
                Number(point.yValue)
            );

            this.yMax =
            Math.max(
                this.yMax,
                Number(point.yValue)
            );
        }

        if (
            control.valueType ===
            'DateTimeCategory' &&
        control.stockChart
        ) {
            control.stockChart.sortedData =
            this.labels.map(
                (label: string): number => {
                    return parseInt(
                        label,
                        10
                    );
                }
            );
        }

        /*
     * Calculate the expanded final axes.
     */
        this.processXAxis(
            control
        );

        this.processYAxis(
            control
        );

        this.updateLiveSeriesAxes(
            control
        );

        return series;
    }


    public renderLivePoint(
        series: RangeNavigatorSeries,
        seriesIndex: number,
        control: RangeNavigator,
        duration?: number
    ): void {

        this.refreshLiveSeries(
            series,
            seriesIndex,
            control,
            duration
        );

        this.animateLiveAxisRange(
            control,
            duration
        );
    }
    private animateLiveAxisRange(
        control: RangeNavigator,
        duration?: number
    ): void {

        const previousRange:
        LiveXAxisRange | null =
        this.previousLiveXAxisRange;

        const currentRange:
        LiveXAxisRange = {
            min:
            Number(
                this.xAxis.actualRange.min
            ),

            max:
            Number(
                this.xAxis.actualRange.max
            ),

            delta:
            Number(
                this.xAxis.actualRange.delta
            )
        };

        this.previousLiveXAxisRange =
        null;

        const elementId: string =
        control.element.id;

        const gridLinesId: string =
        elementId +
        '_GridLines';

        const axisLabelsId: string =
        elementId +
        '_AxisLabels';

        const oldGridLines:
        HTMLElement | null =
        document.getElementById(
            gridLinesId
        );

        const oldAxisLabels:
        HTMLElement | null =
        document.getElementById(
            axisLabelsId
        );

        if (
            oldGridLines &&
        oldGridLines.parentNode
        ) {
            oldGridLines.parentNode.removeChild(
                oldGridLines
            );
        }

        if (
            oldAxisLabels &&
        oldAxisLabels.parentNode
        ) {
            oldAxisLabels.parentNode.removeChild(
                oldAxisLabels
            );
        }

        /*
     * Render the axis using its final expanded range.
     */
        control.rangeAxis.renderGridLines();
        control.rangeAxis.renderAxisLabels();

        const gridLines:
        SVGGElement | null =
        document.getElementById(
            gridLinesId
        ) as unknown as SVGGElement | null;

        const axisLabels:
        SVGGElement | null =
        document.getElementById(
            axisLabelsId
        ) as unknown as SVGGElement | null;
        const animationDuration: number = Math.max(duration as number, 0);

        const boundsX: number =
        Number(control.bounds.x);

        const boundsWidth: number =
        Number(control.bounds.width);

        if (
            isNaN(boundsX) ||
        isNaN(boundsWidth) ||
        boundsWidth <= 0
        ) {
            return;
        }

        /*
     * Convert a final-axis pixel coordinate to the pixel
     * coordinate representing the same value in the old
     * historical range.
     */
        const getOldX: (
            finalX: number
        ) => number = (
            finalX: number
        ): number => {
            const coefficient: number =
            (
                finalX -
                boundsX
            ) /
            boundsWidth;

            const axisValue: number =
            currentRange.min +
            coefficient *
            currentRange.delta;

            return (
                boundsX +
            (
                axisValue -
                previousRange.min
            ) /
            previousRange.delta *
            boundsWidth
            );
        };

        /*
     * Hide the newly rendered final axis until all elements
     * are moved to their old visual positions.
     */
        gridLines.style.visibility =
        'hidden';

        axisLabels.style.visibility =
        'hidden';

        const textElements:
        NodeListOf<SVGTextElement> =
        axisLabels.querySelectorAll(
            'text'
        );

        const textAnimations:
        LiveTextAnimation[] = [];

        for (
            let textIndex: number = 0;
            textIndex < textElements.length;
            textIndex++
        ) {
            const textElement:
            SVGTextElement =
            textElements[
                textIndex as number
            ];

            const finalX: number =
            Number(
                textElement.getAttribute(
                    'x'
                )
            );

            const oldX: number =
            getOldX(
                finalX
            );

            textAnimations.push({
                element:
                textElement,

                oldX:
                oldX,

                finalX:
                finalX
            });

            textElement.setAttribute(
                'x',
                oldX.toString()
            );
        }

        const pathElements:
        NodeListOf<SVGPathElement> =
        gridLines.querySelectorAll(
            'path'
        );

        const pathAnimations:
        LivePathAnimation[] = [];

    /*
     * Store the source positions and parsed value of each
     * number found in the SVG path.
     */
    type PathNumberToken = {
        start: number;
        end: number;
        value: number;
    };

    /*
     * Check whether a character is an ASCII digit without
     * using a regular expression.
     */
    const isDigit: (
        character: string
    ) => boolean = (
        character: string
    ): boolean => {
        return (
            character >= '0' &&
            character <= '9'
        );
    };

    const getPathNumberTokens: (
        pathData: string
    ) => PathNumberToken[] = (
        pathData: string
    ): PathNumberToken[] => {
        const tokens:
        PathNumberToken[] = [];

        let index: number =
            0;

        while (index < pathData.length) {
            const start: number =
                index;

            /*
             * Read an optional sign.
             */
            if (
                pathData[index as number] === '-' ||
                pathData[index as number] === '+'
            ) {
                index++;
            }

            let integerDigitCount: number =
                0;

            while (
                index < pathData.length &&
                isDigit(
                    pathData[index as number]
                )
            ) {
                integerDigitCount++;
                index++;
            }

            let decimalDigitCount: number =
                0;

            /*
             * Read the optional decimal portion.
             */
            if (
                index < pathData.length &&
                pathData[index as number] === '.'
            ) {
                index++;

                while (
                    index < pathData.length &&
                    isDigit(
                        pathData[index as number]
                    )
                ) {
                    decimalDigitCount++;
                    index++;
                }
            }

            /*
             * A valid number must contain at least one digit.
             */
            if (
                integerDigitCount === 0 &&
                decimalDigitCount === 0
            ) {
                index =
                    start + 1;

                continue;
            }

            const numberText: string =
                pathData.substring(
                    start,
                    index
                );

            const value: number =
                Number(numberText);

            if (!isNaN(value)) {
                tokens.push({
                    start:
                        start,

                    end:
                        index,

                    value:
                        value
                });
            }
        }

        return tokens;
    };

    /*
     * Return all numeric values contained in an SVG path.
     */
    const parsePathNumbers: (
        pathData: string
    ) => number[] = (
        pathData: string
    ): number[] => {
        const tokens:
        PathNumberToken[] =
            getPathNumberTokens(
                pathData
            );

        const numbers:
        number[] = [];

        for (
            let tokenIndex: number = 0;
            tokenIndex < tokens.length;
            tokenIndex++
        ) {
            numbers.push(
                tokens[
                    tokenIndex as number
                ].value
            );
        }

        return numbers;
    };

    /*
     * Replace numbers in an SVG path while preserving all
     * commands, commas, spaces and other separators.
     */
    const createPathFromNumbers: (
        template: string,
        numbers: number[]
    ) => string = (
        template: string,
        numbers: number[]
    ): string => {
        const tokens:
        PathNumberToken[] =
            getPathNumberTokens(
                template
            );

        let result: string =
            '';

        let previousEnd: number =
            0;

        const replacementCount: number =
            Math.min(
                tokens.length,
                numbers.length
            );

        for (
            let tokenIndex: number = 0;
            tokenIndex < replacementCount;
            tokenIndex++
        ) {
            const token:
            PathNumberToken =
                tokens[
                    tokenIndex as number
                ];

            result +=
                template.substring(
                    previousEnd,
                    token.start
                );

            result +=
                String(
                    numbers[
                        tokenIndex as number
                    ]
                );

            previousEnd =
                token.end;
        }

        /*
         * Preserve the remaining SVG path content.
         */
        result +=
            template.substring(
                previousEnd
            );

        return result;
    };

    for (
        let pathIndex: number = 0;
        pathIndex < pathElements.length;
        pathIndex++
    ) {
        const pathElement:
        SVGPathElement =
            pathElements[
                pathIndex as number
            ];

        const finalPath: string =
            pathElement.getAttribute(
                'd'
            );

        const finalNumbers: number[] =
            parsePathNumbers(
                finalPath
            );
        const oldNumbers: number[] =
            finalNumbers.slice();

        /*
         * Range Navigator grid and tick paths use alternating
         * X and Y numeric coordinates. Transform only X.
         */
        for (
            let coordinateIndex: number = 0;
            coordinateIndex < oldNumbers.length;
            coordinateIndex += 2
        ) {
            oldNumbers[
                coordinateIndex as number
            ] =
                getOldX(
                    finalNumbers[
                        coordinateIndex as number
                    ]
                );
        }

        pathAnimations.push({
            element:
                pathElement,

            template:
                finalPath,

            oldNumbers:
                oldNumbers,

            finalNumbers:
                finalNumbers
        });

        pathElement.setAttribute(
            'd',
            createPathFromNumbers(
                finalPath,
                oldNumbers
            )
        );
    }

    const svgNamespace: string =
        'http://www.w3.org/2000/svg';

    const clipId: string =
        elementId +
        '_LiveAxisRangeClip';

    const existingClip:
    HTMLElement | null =
        document.getElementById(
            clipId
        );

    if (
        existingClip &&
        existingClip.parentNode
    ) {
        existingClip.parentNode.removeChild(
            existingClip
        );
    }

    let definitions:
    SVGDefsElement | null =
        control.svgObject.querySelector(
            'defs'
        ) as SVGDefsElement | null;

    if (!definitions) {
        definitions =
            document.createElementNS(
                svgNamespace,
                'defs'
            ) as SVGDefsElement;

        control.svgObject.insertBefore(
            definitions,
            control.svgObject.firstChild
        );
    }

    const clipPath:
    SVGClipPathElement =
        document.createElementNS(
            svgNamespace,
            'clipPath'
        ) as SVGClipPathElement;

    clipPath.setAttribute(
        'id',
        clipId
    );

    const clipRectangle:
    SVGRectElement =
        document.createElementNS(
            svgNamespace,
            'rect'
        ) as SVGRectElement;

    clipRectangle.setAttribute(
        'x',
        String(
            control.bounds.x
        )
    );

    clipRectangle.setAttribute(
        'y',
        '0'
    );

    clipRectangle.setAttribute(
        'width',
        String(
            control.bounds.width
        )
    );

    clipRectangle.setAttribute(
        'height',
        String(
            control.availableSize.height
        )
    );

    clipPath.appendChild(
        clipRectangle
    );

    definitions.appendChild(
        clipPath
    );

    gridLines.setAttribute(
        'clip-path',
        'url(#' +
        clipId +
        ')'
    );

    axisLabels.setAttribute(
        'clip-path',
        'url(#' +
        clipId +
        ')'
    );

    /*
     * Reveal the final axis only after its elements have been
     * moved to their old visual coordinates.
     */
    gridLines.style.visibility =
        'visible';

    axisLabels.style.visibility =
        'visible';

    new Animation({}).animate(
        createElement('div'),
        {
            duration:
                animationDuration,

            progress: (
                args: any
            ): void => {
                const progress: number =
                    Math.max(
                        0,
                        Math.min(
                            args.timeStamp /
                            args.duration,
                            1
                        )
                    );

                for (
                    let labelIndex: number = 0;
                    labelIndex < textAnimations.length;
                    labelIndex++
                ) {
                    const textAnimation:
                    LiveTextAnimation =
                        textAnimations[
                            labelIndex as number
                        ];

                    const currentX: number =
                        textAnimation.oldX +
                        (
                            textAnimation.finalX -
                            textAnimation.oldX
                        ) *
                        progress;

                    textAnimation.element
                        .setAttribute(
                            'x',
                            currentX.toString()
                        );
                }

                for (
                    let pathIndex: number = 0;
                    pathIndex < pathAnimations.length;
                    pathIndex++
                ) {
                    const pathAnimation:
                    LivePathAnimation =
                        pathAnimations[
                            pathIndex as number
                        ];

                    const currentNumbers:
                    number[] = [];

                    for (
                        let numberIndex: number = 0;
                        numberIndex <
                            pathAnimation
                                .finalNumbers
                                .length;
                        numberIndex++
                    ) {
                        const finalNumber:
                        number =
                            pathAnimation
                                .finalNumbers[
                                    numberIndex as number
                                ];

                        /*
                         * Even indexes are X coordinates.
                         * Odd indexes are Y coordinates.
                         */
                        if (
                            numberIndex % 2 === 0
                        ) {
                            const oldNumber:
                            number =
                                pathAnimation
                                    .oldNumbers[
                                        numberIndex as number
                                    ];

                            currentNumbers.push(
                                oldNumber +
                                (
                                    finalNumber -
                                    oldNumber
                                ) *
                                progress
                            );
                        } else {
                            currentNumbers.push(
                                finalNumber
                            );
                        }
                    }

                    pathAnimation.element
                        .setAttribute(
                            'd',
                            createPathFromNumbers(
                                pathAnimation
                                    .template,
                                currentNumbers
                            )
                        );
                }
            },

            end: (): void => {
                for (
                    let labelIndex: number = 0;
                    labelIndex < textAnimations.length;
                    labelIndex++
                ) {
                    const textAnimation:
                    LiveTextAnimation =
                        textAnimations[
                            labelIndex as number
                        ];

                    textAnimation.element
                        .setAttribute(
                            'x',
                            textAnimation
                                .finalX
                                .toString()
                        );
                }

                for (
                    let pathIndex: number = 0;
                    pathIndex < pathAnimations.length;
                    pathIndex++
                ) {
                    const pathAnimation:
                    LivePathAnimation =
                        pathAnimations[
                            pathIndex as number
                        ];

                    pathAnimation.element
                        .setAttribute(
                            'd',
                            pathAnimation.template
                        );
                }

                gridLines.removeAttribute(
                    'clip-path'
                );

                axisLabels.removeAttribute(
                    'clip-path'
                );

                if (
                    clipPath &&
                    clipPath.parentNode
                ) {
                    clipPath.parentNode.removeChild(
                        clipPath
                    );
                }
            }
        }
    );
    }
    private createLivePoint(
        dataPoint: Object,
        series: RangeNavigatorSeries,
        control: RangeNavigator
    ): DataPoint | null {
        const xName: string =
        series.xName;

        const yName: string =
        series.yName;

        const point: DataPoint =
        new DataPoint(
            getValue(xName, dataPoint),
            getValue(yName, dataPoint)
        );

        point.yValue = +point.y;

        (point as any).symbolLocations = [];
        (point as any).regions = [];

        const valueType: string =
        control.valueType as string;

        if (valueType.indexOf('DateTime') > -1) {
            const dateParser: Function =
            control.intl.getDateParser({
                skeleton: 'full',
                type: 'dateTime'
            });

            const dateFormatter: Function =
            control.intl.getDateFormat({
                skeleton: 'full',
                type: 'dateTime'
            });

            const parsedValue: Object =
    DataUtil.parse.parseJson
        ? DataUtil.parse.parseJson({
            val: point.x
        }).val
        : point.x;

            point.x = new Date(
                parsedValue as any
            );

            if (isNaN((point.x as Date).getTime())) {
                return null;
            }
            point.xValue = (point.x as Date).getTime();

            if (valueType === 'DateTimeCategory') {
                const dateValue: string =
                point.xValue.toString();

                if (
                    this.indexLabels[dateValue as string] ===
                undefined
                ) {
                    this.indexLabels[dateValue as string] =
                    this.labels.length;

                    this.labels.push(dateValue);
                }

                point.xValue =
                this.indexLabels[dateValue as string];
            }
        } else {
            point.xValue = +point.x;
        }

        if (
            isNullOrUndefined(point.xValue) ||
        isNaN(point.xValue as number) ||
        isNullOrUndefined(point.yValue) ||
        isNaN(point.yValue as number)
        ) {
            return null;
        }
        point.visible = true;

        return point;
    }
    private updateLiveSeriesAxes(
        control: RangeNavigator
    ): void {
        const seriesCollection: RangeNavigatorSeries[] =
        control.series as RangeNavigatorSeries[];

        for (
            let index: number = 0;
            index < seriesCollection.length;
            index++
        ) {
            const currentSeries: RangeNavigatorSeries =
            seriesCollection[index as number];

            currentSeries.xAxis =
            this.xAxis;

            currentSeries.yAxis =
            this.yAxis;

            currentSeries.chart =
            control;

            currentSeries.index =
            index;

            currentSeries.xAxis.isInversed =
            control.enableRtl;
        }
    }

    private refreshLiveSeries(
        series: RangeNavigatorSeries,
        seriesIndex: number,
        control: RangeNavigator,
        duration?: number
    ): void {

        const originalType: string = series.type as string;
        const navigatorType: string = originalType;
        series.xAxis = this.xAxis;
        series.yAxis = this.yAxis;
        series.chart = control;
        series.index = seriesIndex;
        series.xAxis.isInversed =
        control.enableRtl;

        const seriesData: any = series;
        const controlData: any = control;

        seriesData.drawPoints = series.points;

        seriesData.emptyPointSettings = {
            mode: 'Zero'
        };

        if (
            control.valueType === 'DateTimeCategory'
        ) {
            for (
                let pointIndex: number = 0;
                pointIndex < series.points.length;
                pointIndex++
            ) {
                const currentPoint: DataPoint =
                series.points[pointIndex as number];

                const pointTime: number =
                (currentPoint.x instanceof Date)
                    ? currentPoint.x.getTime()
                    : new Date(
                        currentPoint.x as string | number
                    ).getTime();

                currentPoint.xValue =
                this.xAxis.labels.indexOf(
                    pointTime.toString()
                );
            }
        }

        const moduleName: string =
        firstToLowerCase(
            navigatorType
        ) + 'SeriesModule';

        const seriesModule: any =
        controlData[moduleName as string];

        if (
            !seriesModule ||
        !series.seriesElement
        ) {
            series.type =
            originalType as RangeNavigatorType;

            return;
        }
    }
    /**
     * Process x axis for range navigator.
     *
     * @private
     * @param {RangeNavigator} control - The RangeNavigator control.
     * @returns {void}
     */
    public processXAxis(control: RangeNavigator): void {
        const axis: AxisModel = {
            minimum: control.minimum,
            maximum: control.maximum,
            interval: control.interval,
            valueType: control.valueType,
            isInversed: control.enableRtl,
            labelFormat: control.labelFormat,
            logBase: control.logBase,
            skeleton: control.skeleton,
            skeletonType: control.skeletonType,
            allowDecimals: control.allowDecimals !== undefined ? control.allowDecimals : true
        };

        this.xAxis = axis as Axis;
        this.xAxis.intervalType = control.intervalType as IntervalType;
        this.xAxis.maximumLabels = 3;
        this.xAxis.skeleton = control.skeleton;
        this.xAxis.intervalDivs = [10, 5, 2, 1];
        this.xAxis.rect = control.bounds;
        this.xAxis.visibleLabels = [];
        this.xAxis.orientation = 'Horizontal';
        this.xAxis.labels = this.labels;
        this.xAxis.indexLabels = this.indexLabels;
        const axisModule: Double | DateTime | Logarithmic | DateTimeCategory = (control as any)[firstToLowerCase(control.valueType as string) + 'Module'];
        axisModule.min = this.xMin;
        axisModule.max = this.xMax;
        axisModule.getActualRange(this.xAxis, control.bounds);
        const axisValueType: string = this.xAxis.valueType as string;
        if (axisValueType === 'Double' || axisValueType === 'DateTime' || axisValueType === 'DateTimeCategory') {
            axisModule.updateActualRange(
                this.xAxis, this.xAxis.actualRange.min, this.xAxis.actualRange.max, this.xAxis.actualRange.interval
            );
        }

        // add half-point padding on X-axis so first and last columns
        // are fully visible instead of being clipped by the navigator bounds.
        const hasColumnSeries: boolean = !control.stockChart && !!control.series && (control.series as RangeNavigatorSeries[]).some((s: RangeNavigatorSeries) => (s.type as string) === 'Column');
        if (hasColumnSeries && axisValueType !== 'Logarithmic') {
            let minDelta: number = Infinity;

            (control.series as RangeNavigatorSeries[]).forEach((series: RangeNavigatorSeries) => {
                if ((series.type as string) === 'Column' && series.points && series.points.length > 1) {
                    const sortedPoints: DataPoint[] = series.points
                        .filter((p: DataPoint) => (p as DataPoint).visible !== false)
                        .slice()
                        .sort((a: DataPoint, b: DataPoint) => (a.xValue as number) - (b.xValue as number));

                    for (let i: number = 1; i < sortedPoints.length; i++) {
                        const delta: number =
                            (sortedPoints[i as number].xValue as number) -
                            (sortedPoints[i - 1].xValue as number);
                        if (delta > 0) {
                            minDelta = Math.min(minDelta, delta);
                        }
                    }
                }
            });

            let padding: number = 0;

            if (axisValueType === 'DateTimeCategory') {
                padding = 0.5;
            } else if (isFinite(minDelta)) {
                padding = minDelta / 2;
            } else {
                // fallback for single-point or equal-x cases
                padding = ((this.xAxis.actualRange.delta as number) || 1) / 2;
            }

            // apply padding only when min/max are not explicitly set by user
            if (isNullOrUndefined(control.minimum)) {
                this.xAxis.actualRange.min -= padding;
            }
            if (isNullOrUndefined(control.maximum)) {
                this.xAxis.actualRange.max += padding;
            }
        }

        this.xAxis.actualRange.delta = this.xAxis.actualRange.max - this.xAxis.actualRange.min;
        this.xAxis.visibleRange = this.xAxis.actualRange;
        axisModule.calculateVisibleLabels(this.xAxis, control);
        if (this.xAxis.valueType === 'DateTimeCategory' && control.periodSelectorModule) {
            control.periodSelectorModule.isDatetimeCategory = true;
            control.periodSelectorModule.sortedData = this.labels.map((label : string) => parseInt(label, 10));
        }
    }

    /**
     * Process yAxis for range navigator.
     *
     * @param {RangeNavigator} control - RangeNavigator instance.
     * @private
     * @returns {void}
     */
    public processYAxis(control: RangeNavigator): void {
        const axis: AxisModel = {
            majorGridLines: { width: 0 }, rangePadding: 'None',
            majorTickLines: { width: 0 }, labelStyle: { size: '0' },
            visible: false, valueType: 'Double', minimum: null, maximum: null,
            interval: null
        };
        this.yAxis = axis as Axis;
        this.yAxis.rect = control.bounds;
        this.yAxis.maximumLabels = 3;
        this.yAxis.intervalDivs = [10, 5, 2, 1];
        this.yAxis.orientation = 'Vertical';

        let yMin: number = this.yMin;
        let yMax: number = this.yMax;

        if (yMin === yMax) {
            yMax += 1;
            yMin -= 1;
        }

        const hasColumnSeries: boolean =
            !!control.series &&
            (control.series as RangeNavigatorSeries[]).some((s: RangeNavigatorSeries) => (s.type as string) === 'Column');

        if (hasColumnSeries) {
            const delta: number = yMax - yMin;
            const padding: number = delta === 0 ? Math.abs((yMax || 1)) * 0.1 : delta * 0.1;

            if (yMin >= 0) {
                // Positive-only data:
                // add some space below min so the smallest column is visible
                yMin = Math.max(0, yMin - padding);
            } else if (yMax <= 0) {
                // Negative-only data:
                // add some space above max and below min
                yMax = Math.min(0, yMax + padding);
                yMin = yMin - padding;
            } else {
                // Mixed positive/negative:
                // pad both sides
                yMin = yMin - padding;
                yMax = yMax + padding;
            }
        }

        control.doubleModule.min = yMin;
        control.doubleModule.max = yMax;
        control.doubleModule.getActualRange(this.yAxis, control.bounds);
        control.doubleModule.updateActualRange(
            this.yAxis, this.yAxis.actualRange.min, this.yAxis.actualRange.max, this.yAxis.actualRange.interval
        );
        this.yAxis.actualRange.delta = this.yAxis.actualRange.max - this.yAxis.actualRange.min;
        this.yAxis.visibleRange = this.yAxis.actualRange;
    }

    /**
     * Process Light weight control.
     *
     * @param {RangeNavigator} control - RangeNavigator instance.
     * @private
     * @returns {void}
     */
    public renderSeries(control: RangeNavigator): void {
        this.chartGroup = control.renderer.createGroup({ id: control.element.id + '_chart' });
        const colors: string[] = getSeriesColor(control.theme);

        const allSeries: RangeNavigatorSeries[] = control.series as RangeNavigatorSeries[];

        const visibleColumnSeries: RangeNavigatorSeries[] = control.stockChart ? [] : allSeries.filter(
            (s: RangeNavigatorSeries, idx: number) => {
                const stockSeriesVisible: boolean =
                    control.stockChart ? control.stockChart.series[idx as number].visible : true;
                return (s.type as string) === 'Column' && stockSeriesVisible;
            }
        );
        // Precompute side-by-side positions ONCE for all visible
        if (visibleColumnSeries.length > 1) {
            const controlAny: any = control; // used any since we didn't have the chart properties in range navigator series
            controlAny.enableSideBySidePlacement = true;
            controlAny.visibleSeries = visibleColumnSeries;
            controlAny.columns = controlAny.columns || [{}];
            controlAny.rows = controlAny.rows || [{}];

            visibleColumnSeries.forEach((columnSeries: any) => {
                columnSeries.chart = control;
                columnSeries.xAxis = this.xAxis;
                columnSeries.yAxis = this.yAxis;
                columnSeries.findSeriesCollection = function (): any[] {
                    return visibleColumnSeries;
                };
                columnSeries.position = null;
                columnSeries.rectCount = null;
            });

            const columnModule: any = controlAny['columnSeriesModule'];
            if (columnModule && columnModule.getSideBySidePositions && visibleColumnSeries[0]) {
                columnModule.getSideBySidePositions(visibleColumnSeries[0]);
            }
        }

        allSeries.map((series: RangeNavigatorSeries, index: number) => {
            const isSeriesVisible: boolean = control.stockChart ? control.stockChart.series[index as number].visible : true;

            if (isSeriesVisible) {
                series.xAxis = this.xAxis;
                series.yAxis = this.yAxis;
                series.chart = control;
                series.index = index;
                series.xAxis.isInversed = control.enableRtl;

                const stockSeries: StockSeriesModel =
                    control.stockChart && control.stockChart.series && control.stockChart.series[index as number];

                const hasGradient: boolean =
                    (stockSeries && !isNullOrUndefined(stockSeries.linearGradient) &&
                        stockSeries.linearGradient.gradientColorStop.length > 0) ||
                    (stockSeries && !isNullOrUndefined(stockSeries.radialGradient) &&
                        stockSeries.radialGradient.gradientColorStop.length > 0);

                const fillColor: string =
                    (hasGradient && series.interior.indexOf('gradient')) > 0
                        ? series.interior
                        : (series.fill || colors[index % colors.length]);

                series.interior = fillColor;
                this.createSeriesElement(control, series, index);

                const seriesAny: any = series;
                const controlAny: any = control;

                seriesAny.emptyPointSettings = { mode: 'Zero' };
                seriesAny.drawPoints = series.points;
                seriesAny.category = seriesAny.category || 'Series';
                seriesAny.seriesType = seriesAny.seriesType || 'XY';

                const seriesAxisValueType: string = series.xAxis.valueType as string;

                if (seriesAxisValueType === 'DateTimeCategory') {
                    for (let i: number = 0; i < series.points.length; i++) {
                        series.points[i as number].xValue =
                            this.xAxis.labels.indexOf(Date.parse(series.points[i as number].x.toString()).toString());
                    }
                }
                const originalSeriesType: string = series.type as string;

                const rangeNavigatorType: string = control.stockChart
                    ? (originalSeriesType === 'Area' ? 'Area' : originalSeriesType === 'StepLine' ? 'StepLine' : 'Line')
                    : originalSeriesType;
                const seriesType: string = rangeNavigatorType;

                // Spline / SplineArea setup
                if (seriesType === 'Spline' || seriesType === 'SplineArea') {
                    const originalYMin: number = seriesAny.yMin;
                    const originalYMax: number = seriesAny.yMax;
                    const validPoints: DataPoint[] = series.points.filter((p: DataPoint) => p.yValue != null);

                    if (validPoints.length > 0) {
                        const dataYValues: number[] = validPoints.map((p: DataPoint) => p.yValue as number);
                        const dataMin: number = Math.min(...dataYValues);
                        const dataMax: number = Math.max(...dataYValues);

                        seriesAny.yMin = dataMin;
                        seriesAny.yMax = dataMax;

                        const splineModuleName: string = firstToLowerCase(seriesType) + 'SeriesModule';
                        const splineModule: any = controlAny[splineModuleName as string];
                        if (splineModule && splineModule.findSplinePoint) {
                            splineModule.chart = controlAny;
                            splineModule.findSplinePoint(series);
                        }

                        seriesAny.yMin = originalYMin;
                        seriesAny.yMax = originalYMax;
                    }

                    seriesAny.cardinalSplineTension = 0.5;
                    seriesAny.splineType = 'Natural';
                }
                // Column setup
                if (seriesType === 'Column') {
                    controlAny.visibleSeries = visibleColumnSeries;
                    controlAny.requireInvertedAxis = false;
                    controlAny.enableCanvas = false;
                    controlAny.duration = control.animationDuration;
                    controlAny.redraw = control.redraw;

                    seriesAny.columnSpacing = isNullOrUndefined(seriesAny.columnSpacing) ? 0.1 : seriesAny.columnSpacing;
                    seriesAny.columnWidth = isNullOrUndefined(seriesAny.columnWidth) ? 0.7 : seriesAny.columnWidth;
                    seriesAny.clipRect = series.clipRect;
                    seriesAny.isRectSeries = true;

                    if (visibleColumnSeries.length > 1) {
                        const columnIndex: number = visibleColumnSeries.indexOf(series);
                        controlAny.enableSideBySidePlacement = true;

                        seriesAny.position = columnIndex;
                        seriesAny.rectCount = visibleColumnSeries.length;
                    } else {
                        // Single series
                        seriesAny.position = 0;
                        seriesAny.rectCount = 0;
                        controlAny.enableSideBySidePlacement = false;
                    }

                    // Ensure point metadata exists
                    for (let cp: number = 0; cp < series.points.length; cp++) {
                        (series.points[cp as number] as any).index = cp;
                        if (isNullOrUndefined((series.points[cp as number] as any).visible)) {
                            (series.points[cp as number] as any).visible =
                                !isNullOrUndefined(series.points[cp as number].yValue) &&
                                !isNaN(series.points[cp as number].yValue as number);
                        }
                        (series.points[cp as number] as any).symbolLocations =
                            (series.points[cp as number] as any).symbolLocations;
                        (series.points[cp as number] as any).regions =
                            (series.points[cp as number] as any).regions;
                    }

                    const validColumnPoints: DataPoint[] = series.points.filter((p: DataPoint) => (p as any).visible);

                    let minPixelDelta: number = Infinity;
                    let prevX: number | null = null;

                    for (let px: number = 0; px < validColumnPoints.length; px++) {
                        const pointX: number = getPoint(
                            validColumnPoints[px as number].xValue as number,
                            0,
                            this.xAxis,
                            this.yAxis,
                            false
                        ).x;

                        if (prevX !== null) {
                            const currentDelta: number = Math.abs(pointX - prevX);
                            if (currentDelta > 0) {
                                minPixelDelta = Math.min(minPixelDelta, currentDelta);
                            }
                        }
                        prevX = pointX;
                    }

                    if (!isFinite(minPixelDelta) || minPixelDelta <= 0) {
                        if (validColumnPoints.length === 1) {
                            minPixelDelta = this.xAxis.rect.width * 0.15;
                        } else if (validColumnPoints.length > 1) {
                            minPixelDelta = this.xAxis.rect.width / validColumnPoints.length;
                        } else {
                            minPixelDelta = 10;
                        }
                    }

                    let basePixelWidth: number = minPixelDelta * seriesAny.columnWidth;

                    // Split available slot among visible column series
                    if (visibleColumnSeries.length > 1) {
                        basePixelWidth = basePixelWidth / visibleColumnSeries.length;
                    }

                    seriesAny.columnWidthInPixel = Math.max(basePixelWidth, 1);

                    if (!seriesAny.border) {
                        seriesAny.border = { width: 0, color: 'transparent' };
                    }
                }

                const seriesModuleName: string = firstToLowerCase(seriesType) + 'SeriesModule';
                const seriesModule: any = controlAny[seriesModuleName as string];

                if (seriesModule) {
                    seriesModule.render(series, this.xAxis, this.yAxis, false);
                } else {
                    const defaultSeriesModule: any = controlAny['lineSeriesModule'];
                    defaultSeriesModule.render(series, this.xAxis, this.yAxis, false);
                }

                this.chartGroup.appendChild(series.seriesElement);
                // Animation
                if (((series.animation.enable && animationMode !== 'Disable') || animationMode === 'Enable') &&
                    control.animateSeries) {
                    if (seriesModule) {
                        seriesModule.chart = controlAny;
                        seriesModule.doAnimation(series);
                    }
                }
                (series as RangeNavigatorSeries).type = originalSeriesType as RangeNavigatorType;
            }
        });
    }

    /**
     * Append series elements in element.
     *
     * @param {RangeNavigator} control - The RangeNavigator control.
     * @returns {void}
     */
    public appendSeriesElements(control: RangeNavigator): void {
        control.svgObject.appendChild(this.chartGroup);
        if ((control.series as RangeNavigatorSeries[]).length) {
            this.drawSeriesBorder(control);
        }
    }

    private createSeriesElement(control: RangeNavigator, series: RangeNavigatorSeries, index: number): void {
        const elementId: string = control.element.id;
        series.clipRect = new Rect(
            this.xAxis.rect.x, this.yAxis.rect.y,
            this.xAxis.rect.width, this.yAxis.rect.height
        );
        series.clipRectElement = control.renderer.drawClipPath(new RectOption(
            elementId + '_RangeSeriesClipRect_' + index, 'transparent', { width: 1, color: 'Gray' }, 1,
            {
                x: 0, y: 0,
                width: series.clipRect.width,
                height: series.clipRect.height
            })
        );
        series.seriesElement = control.renderer.createGroup({
            'id': elementId + 'SeriesGroup' + index,
            'transform': 'translate(' + series.clipRect.x + ',' + (series.clipRect.y) + ')',
            'clip-path': 'url(#' + elementId + '_RangeSeriesClipRect_' + index + ')'
        });
        series.seriesElement.appendChild(series.clipRectElement);
    }

    /**
     * Calculate grouping bounds for x axis.
     *
     * @private
     * @param {RangeNavigator} control - The RangeNavigator control.
     * @returns {void}
     */
    public calculateGroupingBounds(control: RangeNavigator): void {
        const padding: number = control.margin.bottom;
        const labelHeight: number = measureText('string', control.labelStyle, control.themeStyle.axisLabelFont).height;
        const controlValueType: string = control.valueType as string;
        const xMin: number = controlValueType === 'DateTimeCategory' ? parseInt(this.xAxis.labels[this.xMin], 10) : this.xMin;
        const xMax: number = controlValueType === 'DateTimeCategory' ? parseInt(this.xAxis.labels[this.xMax], 10) : this.xMax;
        this.calculateDateTimeNiceInterval(this.xAxis, new Size(control.bounds.width, control.bounds.height), xMin, xMax, false);
        if (control.enableGrouping && (controlValueType === 'DateTime' || controlValueType === 'DateTimeCategory') &&
            (this.xAxis.actualIntervalType !== 'Years' || !(control.series as RangeNavigatorSeries[]).length)
        ) {
            control.bounds.height -= (control.labelPosition === 'Outside' || !(control.series as RangeNavigatorSeries[]).length) ? padding + labelHeight : (labelHeight + 2 * padding);
        }
        if (!(control.series as RangeNavigatorSeries[]).length) {
            control.bounds.y += control.bounds.height / 4;
            control.bounds.height = control.bounds.height / 2;
        }
    }

    private drawSeriesBorder(control: RangeNavigator): void {
        const start: string = control.stockChart ? 'M' : 'L';
        const close: string = control.stockChart ? '' : 'Z';
        const options: PathOption = new PathOption(
            control.element.id + '_SeriesBorder', 'transparent', control.navigatorBorder.width, control.navigatorBorder.color || (control.theme.indexOf('Dark') > -1 ? '#49454F' : '#DDDDDD'), 1, control.navigatorBorder.dashArray,
            ('M ' + (control.bounds.x) + ' ' + (control.bounds.y) +
                ' L ' + (control.bounds.x + control.bounds.width) + ' ' + control.bounds.y +
                start + (control.bounds.x + control.bounds.width) + ' ' + (control.bounds.y + control.bounds.height) +
                ' L ' + (control.bounds.x) + ' ' + (control.bounds.y + control.bounds.height) + close)

        );
        const htmlObject: Element = control.renderer.drawPath(options) as HTMLElement;

        control.svgObject.appendChild(htmlObject);
    }
}


