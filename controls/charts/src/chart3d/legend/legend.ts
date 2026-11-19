/**
 * Chart legend
 */
import { Browser, ChildProperty, Complex, Property, extend, remove } from '@syncfusion/ej2-base';
import { Chart3DSeries} from '../series/chart-series';
import { Border, ContainerPadding, Font, Indexes, Margin } from '../../common/model/base';
import { LegendOptions, BaseLegend } from '../../common/legend/legend';
import { Chart3D, Chart3DPoint } from '../../chart3d';
import { Chart3DLegendMode, Chart3DSeriesType } from '../../chart3d/utils/enum';
import { textTrim, ChartLocation, removeElement} from '../../common/utils/helper';
import { getUnicodeText} from '../../common/utils/helper';
import { Size, measureText, Rect, getElement } from '@syncfusion/ej2-svg-base';
import { legendRender, legendClick, regSub, regSup} from '../../common/model/constants';
import { Chart3DAxis } from '../axis/axis';
import { Alignment, LabelOverflow, LegendPosition, LegendTitlePosition, TextWrap } from '../../common/utils/enum';
import { textWrap } from '../../common/utils/helper';
import { Chart3DLegendClickEventArgs, Chart3DLegendRenderEventArgs } from '../model/chart3d-Interface';
import { BorderModel, ContainerPaddingModel, FontModel, LocationModel, MarginModel } from '../../common/model/base-model';
import { Chart3DLegendSettingsModel } from './legend-model';
import { Location } from '../../common/model/base';
/**
 * Configures the legends in charts.
 */
export class Chart3DLegendSettings extends ChildProperty<Chart3DLegendSettings> {

    /**
     * If set to true, the legend will be displayed for the chart.
     *
     * @default true
     */

    @Property(true)
    public visible: boolean;

    /**
     * The height of the legend in pixels.
     *
     * @default null
     */

    @Property(null)
    public height: string;

    /**
     * The width of the legend in pixels.
     *
     * @default null
     */

    @Property(null)
    public width: string;

    /**
     * Specifies the location of the legend, relative to the chart.
     * If x is 20, legend moves by 20 pixels to the right of the chart. It requires the `position` to be `Custom`.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart3D: Chart3D = new Chart3D({
     * ...
     *   legendSettings: {
     *     visible: true,
     *     position: 'Custom',
     *     location: { x: 100, y: 150 },
     *   },
     * ...
     * });
     * chart3D.appendTo('#Chart');
     * ```
     */

    @Complex<LocationModel>({ x: 0, y: 0 }, Location)
    public location: LocationModel;

    /**
     * Position of the legend in the chart. Available options include:
     * * Auto: Places the legend based on the area type.
     * * Top: Displays the legend at the top of the chart.
     * * Left: Displays the legend at the left of the chart.
     * * Bottom: Displays the legend at the bottom of the chart.
     * * Right: Displays the legend at the right of the chart.
     * * Custom: Displays the legend based on the given x and y values.
     *
     * @default 'Auto'
     */

    @Property('Auto')
    public position: LegendPosition;

    /**
     * Mode of legend items.
     * * Series: Legend items generated based on series count.
     * * Point: Legend items generated based on unique data points.
     * * Range: Legend items generated based on range color mapping property.
     * * Gradient: Single linear bar generated based on range color mapping property.
     * This property is applicable for chart component only.
     */
    @Property('Series')
    public mode: Chart3DLegendMode;

    /**
     * Option to customize the padding around the legend items.
     *
     * @default 8
     */

    @Property(8)
    public padding: number;

    /**
     * Option to customize the padding between legend items.
     *
     * @default null
     */

    @Property(null)
    public itemPadding: number;

    /**
     * Legend in chart can be aligned as follows:
     * * Near: Aligns the legend to the left of the chart.
     * * Center: Aligns the legend to the center of the chart.
     * * Far: Aligns the legend to the right of the chart.
     *
     * @default 'Center'
     */

    @Property('Center')
    public alignment: Alignment;

    /**
     * Options to customize the legend text.
     */

    @Complex<FontModel>({fontFamily: null, size: null, fontStyle: null, fontWeight: null, color: null}, Font)
    public textStyle: FontModel;

    /**
     * Shape height of the legend in pixels.
     *
     * @default 10
     */

    @Property(10)
    public shapeHeight: number;

    /**
     * Shape width of the legend in pixels.
     *
     * @default 10
     */

    @Property(10)
    public shapeWidth: number;

    /**
     * Options to customize the border of the legend.
     */

    @Complex<BorderModel>({}, Border)
    public border: BorderModel;

    /**
     *  Options to customize left, right, top and bottom margins of the chart.
     */

    @Complex<MarginModel>({left: 0, right: 0, top: 0, bottom: 0}, Margin)
    public margin: MarginModel;

    /**
     *  Options to customize left, right, top and bottom padding for legend container of the chart.
     */

    @Complex<ContainerPaddingModel>({ left: 0, right: 0, top: 0, bottom: 0 }, ContainerPadding)
    public containerPadding: ContainerPaddingModel;

    /**
     * Padding between the legend shape and text.
     *
     * @default 8
     */

    @Property(8)
    public shapePadding: number;

    /**
     * The background color of the legend that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default 'transparent'
     */

    @Property('transparent')
    public background: string;

    /**
     * Opacity of the legend.
     *
     * @default 1
     */

    @Property(1)
    public opacity: number;

    /**
     * If set to true, series visibility collapses based on the legend visibility.
     *
     * @default true
     */

    @Property(true)
    public toggleVisibility: boolean;

    /**
     * If set to true, the series get highlighted, while hovering the legend.
     *
     * @default false
     */

    @Property(false)
    public enableHighlight: boolean;
    /**
     * Description for legends.
     *
     * @default null
     */

    @Property(null)
    public description: string;

    /**
     * TabIndex value for the legend.
     *
     * @default 3
     */

    @Property(3)
    public tabIndex: number;

    /**
     * Title for legends.
     *
     * @default null
     */

    @Property(null)
    public title: string;

    /**
     * Options to customize the legend title.
     */

    @Complex<FontModel>({fontFamily: null, size: null, fontStyle: null, fontWeight: null, color: null}, Font)
    public titleStyle: FontModel;

    /**
     * legend title position.
     *
     * @default 'Top'
     */

    @Property('Top')
    public titlePosition: LegendTitlePosition;

    /**
     * Defines the text wrap behavior to employ when the individual legend text overflows
     * * `Normal` -  Specifies to break words only at allowed break points.
     * * `Wrap` - Specifies to break a word once it is too long to fit on a line by itself.
     * * `AnyWhere` - Specifies to break a word at any point if there are no otherwise-acceptable break points in the line.
     *
     * @default 'Normal'
     */

    @Property('Normal')
    public textWrap : TextWrap;

    /**
     * Defines the text overflow behavior to employ when the individual legend text overflows
     * * `Clip` -  Specifies the text is clipped and not accessible.
     * * `Ellipsis` -  Specifies an ellipsis (“...”) to the clipped text.
     *
     * @default 'Ellipsis'
     */

    @Property('Ellipsis')
    public textOverflow  : LabelOverflow;

    /**
     * maximum width for the legend title.
     *
     * @default 100
     */

    @Property(100)
    public maximumTitleWidth: number;

    /**
     * Maximum label width for the legend text.
     *
     * @default null
     */

    @Property(null)
    public maximumLabelWidth : number;

    /**
     * If set to true, legend will be visible using pages.
     *
     * @default true
     */

    @Property(true)
    public enablePages: boolean;

    /**
     * If `isInversed` set to true, then it inverses legend item content (image and text).
     *
     * @default false.
     */

    @Property(false)
    public isInversed: boolean;

    /**
     * If `reverse` is set to true, it reverses the order of legend items.
     *
     * @default false
     */

    @Property(false)
    public reverse: boolean;
}

/**
 * The `Legend` module is used to render legend for the chart.
 */
export class Legend3D extends BaseLegend {
    constructor(chart: Chart3D) {
        super(chart);
        this.library = this;
        this.addEventListener();
    }

    /**
     * Binding events for legend module.
     *
     * @returns {void}
     */
    private addEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.on(Browser.touchMoveEvent, this.mouseMove, this);
        this.chart.on('click', this.click, this);
        this.chart.on(Browser.touchEndEvent, this.mouseEnd, this);
    }

    /**
     * Unbinding events for legend module.
     *
     * @returns {void}
     */
    private removeEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.off(Browser.touchMoveEvent, this.mouseMove);
        this.chart.off('click', this.click);
        this.chart.off(Browser.touchEndEvent, this.mouseEnd);
    }

    /**
     * To handle mosue move for legend module
     *
     * @param {MouseEvent} e - Specifies the mouse event.
     * @returns {void}
     */
    private mouseMove(e: MouseEvent): void {
        if (this.chart.legendSettings.visible && !this.chart.isTouch) {
            this.move(e);
            if ((<Chart3D>this.chart).highlight3DModule && ((<Chart3D>this.chart).highlightMode !== 'None' || (<Chart3D>this.chart).legendSettings.enableHighlight)) {
                const legendItemsId: string[] = [this.legendID + '_text_', this.legendID + '_shape_marker_',
                    this.legendID + '_shape_', this.legendID + '_g_'];
                const targetId: string = (<HTMLElement>e.target).id;
                let index: number;
                for (const id of legendItemsId) {
                    if (targetId.indexOf(id) > -1) {
                        index = parseInt(targetId.split(id)[1], 10);
                        (<Chart3D>this.chart).highlight3DModule.legendSelection((<Chart3D>this.chart), index, e.target as Element, e.type);
                        break;
                    }

                }
            }
        }
    }

    /**
     * To handle mouse end for legend module
     *
     * @param {MouseEvent} e - Specifies the mouse event.
     * @returns {void}
     */
    private mouseEnd(e: MouseEvent): void {
        if (this.chart.legendSettings.visible && this.chart.isTouch) {
            this.move(e);
        }
    }

    /**
     * Retrieves and returns legend options for the visible series within a 3D chart.
     *
     * @param {Chart3DSeries[]} visibleSeriesCollection - The collection of visible series to extract legend options from.
     * @param {Chart3D} chart - The 3D chart containing the series and legend.
     * @returns {void}
     */
    public getLegendOptions(visibleSeriesCollection: Chart3DSeries[], chart: Chart3D): void {
        this.legendCollections = [];
        let seriesType: Chart3DSeriesType;
        let fill: string;
        this.isRtlEnable = chart.enableRtl;
        this.isReverse = !this.isRtlEnable && chart.legendSettings.reverse;
        if (visibleSeriesCollection.length > 1) {
            this.legend.mode = 'Series';
        }
        for (const series of visibleSeriesCollection) {
            if (this.legend.mode === 'Series') {
                seriesType = <Chart3DSeriesType>series.type;
                // To set legend color when use pointColorMapping
                fill = (series.pointColorMapping && series.points.length > 0) ?
                    (series.points[0].interior ? series.points[0].interior : series.interior) : series.interior;
                this.legendCollections.push(new LegendOptions(
                    series.name, fill, series.legendShape, series.visible,
                    seriesType, series.legendImageUrl ? series.legendImageUrl : '',
                    'None', false, null, null
                ));
            } else if (this.legend.mode === 'Point') {
                for (const points of series.points) {
                    seriesType = <Chart3DSeriesType>series.type;
                    fill = points.interior ? points.interior : series.interior;
                    if (this.legendCollections.filter((i: LegendOptions) => i.text === points.x.toString()).length === 0) {
                        this.legendCollections.push(new LegendOptions(
                            points.x.toString(), fill, series.legendShape, points.visible,
                            seriesType, '',
                            'None', false
                        ));
                    }
                }
            }
        }
        if (this.isReverse ) {
            this.legendCollections.reverse();
        }
    }

    /**
     * Calculates and retrieves the legend bounds within the available size for the provided legend settings.
     *
     * @param {Size} availableSize - The available size for positioning the legend.
     * @param {Rect} legendBounds - The initial bounds of the legend.
     * @param {Chart3DLegendSettingsModel} legend - The customization option for the legend.
     * @returns {void}
     */
    public get3DLegendBounds(availableSize: Size, legendBounds: Rect, legend: Chart3DLegendSettingsModel): void {
        this.calculateLegendTitle(legend, legendBounds);
        this.isTitle = legend.title ? true : false;
        this.chartRowCount = 1;
        this.rowHeights = [];
        this.columnHeights = [];
        this.pageHeights = [];
        const padding: number = legend.padding;
        const titlePosition: LegendTitlePosition = legend.titlePosition;
        let extraHeight: number = 0;
        let legendOption : LegendOptions;
        let extraWidth: number = 0;
        const arrowWidth: number = this.arrowWidth;
        const arrowHeight: number = this.arrowHeight;
        const verticalArrowSpace: number = this.isVertical && !legend.enablePages ? arrowHeight : 0;
        let titleSpace: number = this.isTitle && titlePosition === 'Top' ? this.legendTitleSize.height + this.fivePixel : 0;
        titleSpace = this.isTitle && this.isVertical && titlePosition !== 'Top' ? this.legendTitleSize.height + this.fivePixel : titleSpace;
        if (!this.isVertical) {
            extraHeight = !legend.height ? ((availableSize.height / 100) * 5) : 0;
        } else {
            extraWidth = !legend.width ? ((availableSize.width / 100) * 5) : 0;
        }
        legendBounds.height += (extraHeight);
        legendBounds.width += extraWidth;
        let shapeWidth: number = legend.shapeWidth;
        let shapePadding: number = legend.shapePadding;
        let maximumWidth: number = 0;
        let rowWidth: number = 0;
        let legendWidth: number = 0;
        let columnHeight: number = 0;
        let columnCount : number = 0;
        let rowCount: number = 0;
        let titlePlusArrowSpace: number = 0;
        let legendEventArgs: Chart3DLegendRenderEventArgs;
        let render: boolean = false;
        this.maxItemHeight = Math.max(measureText('MeasureText', legend.textStyle, this.chart.themeStyle.legendLabelFont).height, legend.shapeHeight);
        for (let i: number = 0; i < this.legendCollections.length; i++) {
            legendOption = this.legendCollections[i as number];
            if (regSub.test(legendOption.text)) {
                legendOption.text = getUnicodeText(legendOption.text, regSub);
            }
            if (regSup.test(legendOption.text)) {
                legendOption.text = getUnicodeText(legendOption.text, regSup);
            }
            legendEventArgs = {
                fill: legendOption.fill, text: legendOption.text, shape: legendOption.shape,
                cancel: false
            };
            this.chart.trigger(legendRender, legendEventArgs);
            legendOption.render = !legendEventArgs.cancel;
            legendOption.text = legendEventArgs.text;
            legendOption.fill = legendEventArgs.fill;
            legendOption.shape = legendEventArgs.shape;
            legendOption.markerShape = 'None';
            legendOption.textSize = measureText(legendOption.text, legend.textStyle, this.chart.themeStyle.legendLabelFont);
            shapeWidth = legendOption.text ? legend.shapeWidth : 0;
            shapePadding = legendOption.text ? legend.shapePadding : 0;
            if (legendOption.render && legendOption.text) {
                render = true;
                legendWidth = shapeWidth + shapePadding + (legend.maximumLabelWidth ? legend.maximumLabelWidth :
                    legendOption.textSize.width) + (!this.isVertical ? (i === 0) ? padding : this.itemPadding : padding);
                rowWidth = rowWidth + legendWidth;
                if (!legend.enablePages && !this.isVertical) {
                    titlePlusArrowSpace = this.isTitle && titlePosition !== 'Top' ? this.legendTitleSize.width + this.fivePixel : 0;
                    titlePlusArrowSpace += arrowWidth;
                }
                this.getLegendHeight(legendOption, legend, legendBounds, rowWidth, this.maxItemHeight, padding);
                if (legendBounds.width < (padding + rowWidth + titlePlusArrowSpace) || this.isVertical) {
                    maximumWidth = Math.max(maximumWidth, (rowWidth + padding + titlePlusArrowSpace - (this.isVertical ? 0 : legendWidth)));
                    if (rowCount === 0 && (legendWidth !== rowWidth)) {
                        rowCount = 1;
                    }
                    rowWidth = this.isVertical ? 0 : legendWidth;
                    rowCount++;
                    columnCount = 0;
                    columnHeight = verticalArrowSpace;
                }
                const len: number = (rowCount > 0 ? (rowCount - 1) : 0);
                this.rowHeights[len as number] = Math.max((this.rowHeights[len as number] ? this.rowHeights[len as number] : 0),
                                                          legendOption.textSize.height);
                this.columnHeights[columnCount as number] = (this.columnHeights[columnCount as number] ?
                    this.columnHeights[columnCount as number] : 0) +
                      legendOption.textSize.height + (this.isVertical ? (i === 0) ? padding : this.itemPadding : padding);
                columnCount++;
            }
        }
        columnHeight = Math.max.apply(null, this.columnHeights) +  padding + titleSpace;
        columnHeight = Math.max(columnHeight, (this.maxItemHeight + padding) + padding + titleSpace);
        this.isPaging = legendBounds.height < columnHeight;
        if (this.isPaging && !legend.enablePages) {
            if (this.isVertical) {
                columnHeight += columnHeight;
            } else {
                columnHeight = (this.maxItemHeight + padding) + padding + (titlePosition === 'Top' ? titleSpace : 0);
            }
        }
        this.totalPages = rowCount;
        if (!this.isPaging && !this.isVertical) {
            rowWidth += this.isTitle && titlePosition !== 'Top' ? (this.fivePixel + this.legendTitleSize.width + this.fivePixel) : 0;
        }
        if (render) {
            this.setBounds(Math.max((rowWidth + padding), maximumWidth), columnHeight, legend, legendBounds);
        } else {
            this.setBounds(0, 0, legend, legendBounds);
        }
    }

    /**
     * Calculates and retrieves the height of the legend within the specified legend bounds and based on the provided options and settings.
     *
     * @param {LegendOptions} legendOption - The options and data for the legend.
     * @param {Chart3DLegendSettingsModel} legend - The customization options for the legend.
     * @param {Rect} legendBounds - The bounds of the legend.
     * @param {number} rowWidth - The width of a row within the legend.
     * @param {number} legendHeight - The initial height of the legend.
     * @param {number} padding - The padding applied to the legend.
     * @returns {void}
     * @private
     */
    public getLegendHeight(legendOption: LegendOptions, legend: Chart3DLegendSettingsModel, legendBounds: Rect,
                           rowWidth: number, legendHeight : number, padding : number): void  {
        const legendWidth: number = legendOption.textSize.width;
        const textPadding: number = legend.shapePadding + (padding * 2) + legend.shapeWidth;
        switch (legend.textWrap) {
        case 'Wrap':
        case 'AnyWhere':
            if (legendWidth > legend.maximumLabelWidth || legendWidth + rowWidth > legendBounds.width) {
                legendOption.textCollection = textWrap(
                    legendOption.text,
                    (legend.maximumLabelWidth ? Math.min(legend.maximumLabelWidth, (legendBounds.width - textPadding)) :
                        (legendBounds.width - textPadding)), legend.textStyle, this.chart.enableRtl,
                    null, null, this.chart.themeStyle.legendLabelFont
                );
            } else {
                legendOption.textCollection.push(legendOption.text);
            }
            legendOption.textSize.height = (legendHeight * legendOption.textCollection.length);
            break;
        }
    }

    /**
     * Calculates and retrieves the render point (position) for the legend item within the legend area.
     *
     * @param {LegendOptions} legendOption - The options and data for the legend item.
     * @param {ChartLocation} start - The starting point for positioning the legend item.
     * @param {number} textPadding - The padding applied to the legend text.
     * @param {LegendOptions} prevLegend - The previous legend item for reference.
     * @param {Rect} rect - The bounding rectangle of the legend area.
     * @param {number} count - The index of the legend item within the legend.
     * @param {number} firstLegend - The index of the first legend item.
     * @returns {void}
     * @private
     */
    public getRenderPoint(
        legendOption: LegendOptions, start: ChartLocation, textPadding: number, prevLegend: LegendOptions,
        rect: Rect, count: number, firstLegend: number): void {
        const padding: number = this.legend.padding;
        const textWidth: number =  textPadding + (this.legend.maximumLabelWidth ?
            this.legend.maximumLabelWidth : prevLegend.textSize.width);
        const previousBound: number = prevLegend.location.x + ((!this.isRtlEnable) ? textWidth : -textWidth);
        if (this.isWithinBounds(previousBound, (this.legend.maximumLabelWidth ?
            this.legend.maximumLabelWidth : legendOption.textSize.width) + textPadding - this.itemPadding, rect) || this.isVertical) {
            legendOption.location.x = start.x;
            if (count !== firstLegend) {
                this.chartRowCount++;
            }
            legendOption.location.y = (count === firstLegend) ? prevLegend.location.y :
                prevLegend.location.y + (this.isVertical ? prevLegend.textSize.height :
                    this.rowHeights[(this.chartRowCount - 2)]) + (this.isVertical ? this.itemPadding : padding);
        } else {
            legendOption.location.x = (count === firstLegend) ? prevLegend.location.x : previousBound;
            legendOption.location.y = prevLegend.location.y;
        }
        let availwidth: number = (!this.isRtlEnable) ? (this.legendBounds.x + this.legendBounds.width) - (legendOption.location.x +
            textPadding - this.itemPadding - this.legend.shapeWidth / 2) :
            (legendOption.location.x - textPadding + this.itemPadding + (this.legend.shapeWidth / 2)) - this.legendBounds.x;
        if (!this.isVertical && this.isPaging && !this.legend.enablePages) {
            availwidth = this.legendBounds.width - legendOption.location.x - this.fivePixel;
        }
        availwidth = this.legend.maximumLabelWidth ? Math.min(this.legend.maximumLabelWidth, availwidth) : availwidth;
        if (this.legend.textOverflow === 'Ellipsis' && this.legend.textWrap === 'Normal') {
            legendOption.text = textTrim(+availwidth.toFixed(4), legendOption.text,
                                         this.legend.textStyle, this.chart.enableRtl, this.chart.themeStyle.legendLabelFont);
        }

    }

    /**
     * Checks whether the previous bound  width is within the given rectangular bounds.
     *
     * @param {number} previousBound - The previous bound (position) of an element.
     * @param {number} textWidth - The width of the text or element to be positioned.
     * @param {Rect} rect - The rectangular bounds to check against.
     * @returns {boolean} - True if the element is within the bounds; otherwise, false.
     * @private
     */
    private isWithinBounds(previousBound: number, textWidth: number, rect: Rect): boolean {
        if (!this.isRtlEnable) {
            return (previousBound + textWidth) > (rect.x + rect.width + (this.legend.shapeWidth / 2));
        }
        else {
            return (previousBound - textWidth) < (rect.x - (this.legend.shapeWidth / 2));
        }
    }

    /**
     * Handles the click event on a legend item at the specified index.
     *
     * @param {number} index - The index of the legend item clicked.
     * @param {Event | PointerEvent} event - The click or pointer event.
     * @returns {void}
     * @private
     */
    public LegendClick(index: number, event: Event | PointerEvent): void {
        const chart: Chart3D = <Chart3D>this.chart;
        const seriesIndex: number = chart.legendSettings.mode === 'Series' ? index : 0;
        const legendIndex: number = !this.isReverse ?  index : (this.legendCollections.length - 1) - index;
        const series: Chart3DSeries = chart.visibleSeries[seriesIndex as number];
        const legend: LegendOptions = this.legendCollections[legendIndex as number];
        const changeDetection: string = 'isProtectedOnChange';
        if (chart.legendSettings.mode === 'Series') {
            const legendClickArgs: Chart3DLegendClickEventArgs = {
                legendText: legend.text, legendShape: legend.shape,
                series: series, cancel: false
            };
            this.chart.trigger(legendClick, legendClickArgs);
            series.legendShape = legendClickArgs.legendShape;
            if (!legendClickArgs.cancel) {
                if (series.fill !== null) {
                    chart.visibleSeries[index as number].interior = series.fill;
                }
                if (chart.legendSettings.toggleVisibility) {
                    series.chart[changeDetection as string] = true;
                    this.changeSeriesVisiblity(series, series.visible);
                    legend.visible = series.visible;
                    this.refreshLegendToggle(chart, series);
                } else if (chart.highlight3DModule) {
                    chart.highlight3DModule.legendSelection(chart, index, event.target as Element, event.type);
                } else if (chart.selection3DModule) {
                    chart.selection3DModule.legendSelection(chart, index, event.target as Element, event.type);
                }
                series.chart[changeDetection as string] = false;
            }
        } else if (chart.legendSettings.mode === 'Point') {
            const point: Chart3DPoint = series.points[index as number];
            const legendClickArgs: Chart3DLegendClickEventArgs = {
                legendText: legend.text, legendShape: legend.shape,
                series: series, cancel: false
            };
            this.chart.trigger(legendClick, legendClickArgs);
            if (chart.legendSettings.toggleVisibility && !legendClickArgs.cancel) {
                point.visible = !point.visible;
                const legendOption: LegendOptions = this.legendCollections[index as number];
                legendOption.visible = point.visible;
                this.refreshLegendToggle(chart, series);
            }
        }
    }

    /**
     * Refreshes the legend toggle behavior for the specified series in a 3D chart.
     *
     * @param {Chart3D} chart - The 3D chart containing the legend and series.
     * @param {Chart3DSeries} series - The series for which the legend toggle behavior is refreshed.
     * @returns {void}
     * @private
     */
    private refreshLegendToggle(chart: Chart3D, series: Chart3DSeries): void {
        let selectedDataIndexes: Indexes[] = [];
        if (chart.selection3DModule) {
            selectedDataIndexes = <Indexes[]>extend([], chart.selection3DModule.selectedDataIndexes, null, true);
        }
        if ((chart.svgObject.childNodes.length > 0)) {
            while (chart.svgObject.lastChild) {
                chart.svgObject.removeChild(chart.svgObject.lastChild);
            }
            remove(chart.svgObject);
        }
        chart.animateSeries = false;
        removeElement(getElement(chart.element.id + '_Secondary_Element').querySelectorAll('.ejSVGTooltip')[0]);
        this.redrawSeriesElements(series, chart);
        chart.removeSvg();
        chart.refreshAxis();
        series.refreshAxisLabel();
        this.refreshSeries(chart.visibleSeries);
        chart.polygons = [];
        chart.refreshBound();
        chart.trigger('loaded', { chart: chart });
        if (selectedDataIndexes.length > 0) {
            chart.selection3DModule.selectedDataIndexes = selectedDataIndexes;
            chart.selection3DModule.redrawSelection(chart, chart.selectionMode);
        }
        if (chart.highlight3DModule && chart.highlightMode !== 'None' || chart.legendSettings.enableHighlight) {
            chart.highlight3DModule.redrawSelection(chart, chart.highlightMode);
        }
        chart.redraw = false;
    }

    /**
     * Changes the visibility of the specified series in a 3D chart.
     *
     * @param {Chart3DSeries} series - The series whose visibility is being changed.
     * @param {boolean} visibility - The new visibility state for the series (true for visible, false for hidden).
     * @returns {void}
     * @private
     */
    private changeSeriesVisiblity(series: Chart3DSeries, visibility: boolean): void {
        series.visible = !visibility;
        if (this.isSecondaryAxis(series.xAxis)) {
            series.xAxis.internalVisibility = series.xAxis.series.some((value: Chart3DSeries) => (value.visible));
        }
        if (this.isSecondaryAxis(series.yAxis)) {
            series.yAxis.internalVisibility = series.yAxis.series.some((value: Chart3DSeries) => (value.visible));
        }
    }

    /**
     * Checks whether the specified axis is a secondary axis within the 3D chart.
     *
     * @param {Chart3DAxis} axis - The axis to be checked.
     * @returns {boolean} - True if the axis is a secondary axis, otherwise, false.
     * @private
     */
    private isSecondaryAxis(axis: Chart3DAxis): boolean {
        return ((this.chart as Chart3D).axes.indexOf(axis) > -1);
    }

    /**
     * Redraws the elements of a 3D series on the chart.
     *
     * @param {Chart3DSeries} series - The 3D series to redraw.
     * @param {Chart3D} chart - The 3D chart instance.
     * @returns {void}
     * @private
     */
    private redrawSeriesElements(series: Chart3DSeries, chart: Chart3D): void {
        if (!chart.redraw) {
            return null;
        }
        removeElement(
            chart.element.id + '_Series_' + (series.index === undefined ? series.category : series.index) +
            '_DataLabelCollections'
        );
    }

    /**
     * Refreshes the position information of each series in a collection.
     *
     * @param {Chart3DSeries[]} seriesCollection - The collection of 3D series to refresh.
     * @returns {void}
     * @private
     */
    private refreshSeries(seriesCollection: Chart3DSeries[]): void {
        for (const series of seriesCollection) {
            series.position = undefined;
        }
    }

    /**
     * To show the tooltip for the trimmed text in legend.
     *
     * @param {Event | PointerEvent} event - Specifies the event.
     * @returns {void}
     * @private
     */
    public click(event: Event | PointerEvent): void {
        if (!this.chart.legendSettings.visible) {
            return;
        }
        const targetId: string = (<HTMLElement>event.target).id.indexOf('_chart_legend_g_') > -1 ?
            (event.target as HTMLElement).firstChild['id'] : (<HTMLElement>event.target).id;
        const legendItemsId: string[] = [this.legendID + '_text_', this.legendID + '_shape_marker_',
            this.legendID + '_shape_'];
        let seriesIndex: number;
        for (const id of legendItemsId) {
            if (targetId.indexOf(id) > -1) {
                seriesIndex = parseInt(targetId.split(id)[1], 10);
                this.LegendClick(seriesIndex, event);
                break;
            }
        }
        if (targetId.indexOf(this.legendID + '_pageup') > -1) {
            this.changePage(event, true);
        } else if (targetId.indexOf(this.legendID + '_pagedown') > -1) {
            this.changePage(event, false);
        }
    }

    /**
     * Get module name
     *
     * @returns {string} - Returns the module name
     */
    protected getModuleName(): string {
        return 'Legend3D';
    }

    /**
     * To destroy the legend module.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.removeEventListener();
    }
}
