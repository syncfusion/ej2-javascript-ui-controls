/**
 * Circular 3D chart legend.
 */
import { Browser, isNullOrUndefined, Animation, AnimationOptions, Property, Complex, ChildProperty } from '@syncfusion/ej2-base';
import { CircularChart3DPoints, CircularChart3DSeries } from '../renderer/series';
import { BorderModel, ContainerPaddingModel, FontModel, MarginModel } from '../../common/model/base-model';
import { CircularChart3D } from '../circularchart3d';
import { Border, ContainerPadding, Font, Margin } from '../../common/model/base';
import { BaseLegend, LegendOptions } from '../../common/legend/legend';
import { LegendSettingsModel } from '../../common/legend/legend-model';
import { Rect, Size, measureText } from '@syncfusion/ej2-svg-base';
import { Alignment, LabelOverflow, LegendPosition, LegendTitlePosition, TextWrap } from '../../common/utils/enum';
import { ChartLocation, textTrim, getElement } from '../../common/utils/helper';
import { CircularChart3DLegendRenderEventArgs, CircularChart3DLegendClickEventArgs } from '../model/pie-interface';
import { textWrap } from '../../common/utils/helper';
import { legendClick } from '../../common/model/constants';
import { LocationModel } from '../../common/model/base-model';
import { Location } from '../../common/model/base';

/**
 * Configures the legends in circular 3D charts.
 */
export class CircularChart3DLegendSettings extends ChildProperty<CircularChart3DLegendSettings> {

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
     * let pie: CircularChart3D = new CircularChart3D({
     * ...
     *   legendSettings: {
     *     visible: true,
     *     position: 'Custom',
     *     location: { x: 100, y: 150 },
     *   },
     * ...
     * });
     * pie.appendTo('#Chart');
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
    @Complex<FontModel>({ fontFamily: null, size: '14px', fontStyle: 'Normal', fontWeight: '400', color: null }, Font)
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
    @Complex<MarginModel>({ left: 0, right: 0, top: 0, bottom: 0 }, Margin)
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
    @Complex<FontModel>({ fontFamily: null, size: '14px', fontStyle: 'Normal', fontWeight: '600', color: null }, Font)
    public titleStyle: FontModel;

    /**
     * Legend title position.
     *
     * @default 'Top'
     */
    @Property('Top')
    public titlePosition: LegendTitlePosition;

    /**
     * Defines the text wrap behavior to employ when the individual legend text overflows.
     * * `Normal`: Specifies to break words only at allowed break points.
     * * `Wrap`: Specifies to break a word once it is too long to fit on a line by itself.
     * * `AnyWhere`: Specifies to break a word at any point if there are no otherwise-acceptable break points in the line.
     *
     * @default 'Normal'
     */
    @Property('Normal')
    public textWrap: TextWrap;

    /**
     * Defines the text overflow behavior to employ when the individual legend text overflows
     * * `Clip`: Specifies the text is clipped and not accessible.
     * * `Ellipsis`: Specifies an ellipsis (“...”) to the clipped text.
     *
     * @default 'Ellipsis'
     */
    @Property('Ellipsis')
    public textOverflow: LabelOverflow;

    /**
     * Maximum width for the legend title.
     *
     * @default 100
     */
    @Property(100)
    public maximumTitleWidth: number;

    /**
     * Minimum label width for the legend text.
     *
     * @default null
     */
    @Property(null)
    public maximumLabelWidth: number;

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
 * The `CircularChartLegend3D` module used to render the legend for a circular 3D chart.
 */
export class CircularChartLegend3D extends BaseLegend {
    /** @private */
    public titleRect: Rect;
    private maxColumnWidth: number;

    /**
     * Constructor for CircularChart3D legend.
     *
     * @param {CircularChart3D} chart - The chart instance to which the legend belongs.
     */
    constructor(chart: CircularChart3D) {
        super(chart);
        this.library = this;
        this.titleRect = new Rect(0, chart.margin.top, 0, 0);
        this.addEventListener();
    }

    /**
     * Binds events for the legend module.
     *
     * @returns {void}
     */
    private addEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.on(Browser.touchMoveEvent, this.mouseMove, this);
        this.chart.on(Browser.touchEndEvent, this.mouseEnd, this);
        this.chart.on('click', this.click, this);
    }

    /**
     * Unbinds events for the legend module.
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
     * Handles mouse movement for the legend module.
     *
     * @param {MouseEvent} e - The mouse event.
     * @returns {void}
     */
    private mouseMove(e: MouseEvent): void {
        if (this.chart.legendSettings.visible && !this.chart.isTouch) {
            this.move(e);
            if ((<CircularChart3D>this.chart).circularChartHighlight3DModule && ((<CircularChart3D>this.chart).highlightMode !== 'None' || (<CircularChart3D>this.chart).legendSettings.enableHighlight)) {
                const legendItemsId: string[] = [this.legendID + '_text_', this.legendID + '_shape_marker_',
                    this.legendID + '_shape_', this.legendID + '_g_'];
                const targetId: string = (<HTMLElement>e.target).id;
                for (const id of legendItemsId) {
                    if (targetId.indexOf(id) > -1) {
                        if ((<CircularChart3D>this.chart).circularChartSelection3DModule) {
                            (<CircularChart3D>this.chart).circularChartSelection3DModule.legendSelection(
                                <CircularChart3D>this.chart, e.target as Element, e.type);
                        } else if ((<CircularChart3D>this.chart).circularChartHighlight3DModule) {
                            (<CircularChart3D>this.chart).circularChartHighlight3DModule.legendSelection(
                                <CircularChart3D>this.chart, e.target as Element, e.type);
                        }
                        break;
                    }

                }
            }
        }
    }

    /**
     * Handles mouse end for the legend module.
     *
     * @param {MouseEvent} e - The mouse event.
     * @returns {void}
     */
    private mouseEnd(e: MouseEvent): void {
        if (this.chart.legendSettings.visible && this.chart.isTouch) {
            this.move(e);
        }
    }

    /**
     * Retrieves the legend options for the circular 3D chart.
     *
     * @param {CircularChart3D} chart - The circular 3D chart instance.
     * @param {CircularChart3DSeries[]} series - The array of circular 3D series in the chart.
     * @returns {void}
     * @private
     */
    public getLegendOptions(chart: CircularChart3D, series: CircularChart3DSeries[]): void {
        this.legendCollections = [];
        this.isRtlEnable = chart.enableRtl;
        this.isReverse = !this.isRtlEnable && chart.legendSettings.reverse;
        for (let i: number = 0; i < 1; i++) {
            for (const point of series[i as number].points) {
                if (!isNullOrUndefined(point.x) && !isNullOrUndefined(point.y)) {
                    this.legendCollections.push(new LegendOptions(
                        point.x.toString(), point.color, series[i as number].legendShape, point.visible,
                        'Pie', series[0].legendImageUrl, null, null,
                        point.index, series[i as number].index
                    ));
                }
            }
            if (this.isReverse) {
                this.legendCollections.reverse();
            }
        }
    }

    /**
     * Calculates the legend bounds based on the available size, existing legend bounds, and legend settings.
     *
     * @param {Size} availableSize - The available size for the legend.
     * @param {Rect} legendBounds - The existing bounds of the legend.
     * @param {LegendSettingsModel} legend - The legend settings model.
     * @returns {void}
     * @private
     */
    public getLegendBounds(availableSize: Size, legendBounds: Rect, legend: LegendSettingsModel): void {
        this.calculateLegendTitle(legend, legendBounds);
        this.isTitle = legend.title ? true : false;
        let extraWidth: number = 0;
        let extraHeight: number = 0;
        let legendOption: LegendOptions;
        this.chartRowCount = 1;
        this.rowHeights = [];
        this.columnHeights = [];
        this.pageHeights = [];
        const padding: number = legend.padding;
        const titlePosition: LegendTitlePosition = legend.titlePosition;
        let titlePlusArrowSpace: number = 0;
        const arrowWidth: number = this.arrowWidth;
        const arrowHeight: number = legend.enablePages ? 0 : this.arrowHeight;
        if (!this.isVertical) {
            extraHeight = !legend.height ? ((availableSize.height / 100) * 5) : 0;
        } else {
            extraWidth = !legend.width ? ((availableSize.width / 100) * 5) : 0;
        }
        legendBounds.width += extraWidth;
        legendBounds.height += extraHeight;
        const shapePadding: number = legend.shapePadding;
        let maximumWidth: number = legend.maximumLabelWidth ? legend.maximumLabelWidth : 0;
        const shapeWidth: number = legend.shapeWidth;
        let rowWidth: number = 0;
        let columnCount: number = 0;
        let rowCount: number = 0;
        const columnWidth: number[] = [];
        const pageWidth: number[] = [];
        let pageRowWidth: number = 0;
        let previousRowCount: number = 0;
        let columnHeight: number = 0;
        let legendWidth: number = 0;
        let titleHeight: number = 0;
        this.maxItemHeight = Math.max(measureText('MeasureText', legend.textStyle, this.chart.themeStyle.legendLabelFont).height, legend.shapeHeight);
        let legendEventArgs: CircularChart3DLegendRenderEventArgs;
        let render: boolean = false;
        for (let i: number = 0; i < this.legendCollections.length; i++) {
            legendOption = this.legendCollections[i as number];
            legendEventArgs = {
                fill: legendOption.fill, text: legendOption.text, shape: legendOption.shape,
                name: 'legendRender', cancel: false
            };
            this.chart.trigger('legendRender', legendEventArgs);
            legendOption.render = !legendEventArgs.cancel;
            legendOption.text = ((legendEventArgs.text.indexOf('&') > -1) ?
                this.convertHtmlEntities(legendEventArgs.text) : legendEventArgs.text);
            legendOption.fill = legendEventArgs.fill;
            legendOption.shape = legendEventArgs.shape;
            legendOption.textSize = measureText(legendOption.text, legend.textStyle, this.chart.themeStyle.legendLabelFont);
            if (legendOption.render && legendOption.text !== '') {
                render = true;
                legendWidth = shapeWidth + shapePadding + (legend.maximumLabelWidth ? legend.maximumLabelWidth :
                    legendOption.textSize.width) + (!this.isVertical ? (i === 0) ? padding : this.itemPadding : padding);
                this.getLegendHeight(legendOption, legend, legendBounds, rowWidth, this.maxItemHeight, padding);
                if (this.isVertical) {
                    columnHeight += legendOption.textSize.height + ((i === 0) ? padding : this.itemPadding);
                    if (columnHeight + this.itemPadding + (arrowHeight / this.pageButtonSize) > (legendBounds.height)) {
                        rowWidth = rowWidth + maximumWidth;
                        pageRowWidth = this.getPageWidth(pageWidth);
                        this.totalPages = Math.max(rowCount, this.totalPages || 1);
                        if ((rowWidth - pageRowWidth + legendWidth) > legendBounds.width) {
                            pageWidth.push(rowWidth - pageRowWidth);
                            rowCount = this.rowHeights.length;
                            previousRowCount = rowCount;
                        }
                        else {
                            rowCount = previousRowCount;
                        }
                        columnWidth.push(maximumWidth);
                        maximumWidth = 0;
                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                        columnHeight = legendOption.textSize.height + padding; legendOption.textSize.height + padding;
                        columnCount++;
                    }
                    this.columnHeights[columnCount as number] = (this.columnHeights[columnCount as number] ?
                        this.columnHeights[columnCount as number] : 0) +
                        legendOption.textSize.height + ((i === 0) ? padding : this.itemPadding);
                    maximumWidth = Math.max(legendWidth, maximumWidth);
                    this.rowHeights[rowCount as number] = Math.max((this.rowHeights[rowCount as number] ?
                        this.rowHeights[rowCount as number] : 0), legendOption.textSize.height);
                    rowCount++;
                } else {
                    if (!legend.enablePages) { // For new legend navigation support
                        titlePlusArrowSpace = this.isTitle && titlePosition !== 'Top' ? this.legendTitleSize.width + this.fivePixel : 0;
                        titlePlusArrowSpace += arrowWidth;
                    }
                    rowWidth = rowWidth + legendWidth;
                    if (legendBounds.width < (padding + rowWidth + titlePlusArrowSpace)) {
                        maximumWidth = Math.max(maximumWidth, (rowWidth + padding + titlePlusArrowSpace - legendWidth));
                        if (rowCount === 0 && (legendWidth !== rowWidth)) {
                            rowCount = 1;
                        }
                        rowWidth = legendWidth;
                        rowCount++;
                        columnCount = 0;
                    }
                    const len: number = rowCount ? (rowCount - 1) : rowCount;
                    this.rowHeights[len as number] = Math.max((this.rowHeights[len as number] ? this.rowHeights[len as number] : 0),
                                                              legendOption.textSize.height);
                    this.columnHeights[columnCount as number] = (this.columnHeights[columnCount as number] ?
                        this.columnHeights[columnCount as number] : 0) +
                        legendOption.textSize.height + padding;
                    columnCount++;
                }
            }
        }
        titleHeight = titlePosition === 'Top' ? this.legendTitleSize.height : 0;
        if (this.isVertical) {
            rowWidth = rowWidth + maximumWidth;
            this.isPaging = legendBounds.width < (rowWidth + padding);
            columnHeight = Math.max.apply(null, this.columnHeights) + padding + arrowHeight + titleHeight;
            columnHeight = Math.max(columnHeight, ((this.totalPages || 1) * (this.maxItemHeight + padding)) + padding + arrowHeight);
            this.isPaging = this.isPaging && (this.totalPages > 1);
            columnWidth.push(maximumWidth);
        } else {
            this.totalPages = rowCount;
            columnHeight = Math.max.apply(null, this.columnHeights) + padding + arrowHeight + titleHeight;
            this.isPaging = legendBounds.height < columnHeight;
            columnHeight = !legend.enablePages && this.isPaging ? (this.maxItemHeight + padding) + padding + titleHeight : columnHeight;
            columnHeight = Math.max(columnHeight, (this.maxItemHeight + padding) + padding + titleHeight);
            if (!this.isPaging) { // For title left and right position
                rowWidth += this.isTitle && titlePosition !== 'Top' ? (this.fivePixel + this.legendTitleSize.width + this.fivePixel) : 0;
            }
        }
        this.maxColumns = 0; // initialization for max columns
        const width: number = this.isVertical ? this.getMaxColumn(columnWidth, legendBounds.width, padding, rowWidth + padding) :
            Math.max(rowWidth + padding, maximumWidth);
        if (render) { // if any legends not skipped in event check
            this.setBounds(width, columnHeight, legend, legendBounds);
        } else {
            this.setBounds(0, 0, legend, legendBounds);
        }
    }

    /**
     * Calculates the total width by summing up the values in the provided array of page widths.
     *
     * @param {number[]} pageWidth - An array containing individual page widths.
     * @returns {number} - The total width calculated as the sum of page widths.
     * @private
     */
    private getPageWidth(pageWidth: number[]): number {
        let sum: number = 0;
        for (let i: number = 0; i < pageWidth.length; i++) {
            sum += pageWidth[i as number];
        }
        return sum;
    }

    /**
     * Calculates the legend height based on the provided legend options, legend settings, bounds, row width,
     * legend height, and padding values.
     *
     * @param {LegendOptions} option - The legend options containing necessary information.
     * @param {LegendSettingsModel} legend - The legend settings model.
     * @param {Rect} bounds - The bounds of the legend.
     * @param {number} rowWidth - The width of the legend row.
     * @param {number} legendHeight - The height of the legend.
     * @param {number} padding - The padding value for additional space.
     * @returns {void}
     * @private
     */
    public getLegendHeight(option: LegendOptions, legend: LegendSettingsModel, bounds: Rect, rowWidth: number,
                           legendHeight: number, padding: number): void {
        const legendWidth: number = option.textSize.width;
        const textPadding: number = legend.shapePadding + (padding * 2) + legend.shapeWidth;
        switch (legend.textWrap) {
        case 'Wrap':
        case 'AnyWhere':
            if (legendWidth > legend.maximumLabelWidth || legendWidth + rowWidth > bounds.width) {
                option.textCollection = textWrap(
                    option.text,
                    (legend.maximumLabelWidth ? Math.min(legend.maximumLabelWidth, (bounds.width - textPadding)) :
                        (bounds.width - textPadding)), legend.textStyle, this.chart.enableRtl, null,
                    null, this.chart.themeStyle.legendLabelFont
                );
            } else {
                option.textCollection.push(option.text);
            }
            option.textSize.height = (legendHeight * option.textCollection.length);
            break;
        }
    }

    /**
     * Converts HTML entities in the given legend text to their corresponding normal string values.
     *
     * @param {string} legendText - The legend text containing HTML entities.
     * @returns {string} - The string with HTML entities converted to their normal values.
     * @private
     */
    private convertHtmlEntities(legendText: string): string {
        let text: string = (legendText).replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').replace('&quot;', '"').replace('&nbsp;', ' ').replace('&cent;', '¢').replace('&pound;', '£').replace('&yen;', '¥').replace('&euro;', '€').replace('&copy;', '©').replace('&reg;', '®');
        text = (text).replace('&#38;', '&').replace('&#60;', '<').replace('&#62;', '>').replace('&#34;', '"').replace('&#160;', ' ').
            replace('&#162;', '¢').replace('&#163;', '£').replace('&#165;', '¥').replace('&#8364;', '€').replace('&#169;', '©').replace('&#174;', '®');
        return text;
    }

    /**
     * Retrieves the maximum column value for a given set of columns based on the specified width, padding, and row width.
     *
     * @param {number[]} columns - The array of column values to find the maximum from.
     * @param {number} width - The width parameter used in the calculation.
     * @param {number} padding - The padding value for additional space.
     * @param {number} rowWidth - The width of the legend row.
     * @returns {number} - The maximum column value calculated from the provided array.
     * @private
     */
    private getMaxColumn(columns: number[], width: number, padding: number, rowWidth: number): number {
        let maxPageColumn: number = padding;
        this.maxColumnWidth = Math.max.apply(null, columns);
        for (let i: number = 0; i < columns.length; i++) {
            maxPageColumn += this.maxColumnWidth;
            this.maxColumns++;
            if (maxPageColumn + padding > width) {
                maxPageColumn -= this.maxColumnWidth;
                this.maxColumns--;
                break;
            }
        }
        this.isPaging = (maxPageColumn < rowWidth) && (this.totalPages > 1);
        if (maxPageColumn === padding) {
            maxPageColumn = width;
        }
        this.maxColumns = Math.max(1, this.maxColumns);
        this.maxWidth = maxPageColumn;
        let columnWidth: number = this.maxColumnWidth + padding;
        let prevPage: number = 0;
        const columnCount: number = this.columnHeights.length;
        if (this.isPaging && this.isVertical) {
            for (let i: number = 1; i < columnCount; i++) {
                columnWidth += (this.maxColumnWidth + padding);
                if (columnWidth > width) {
                    this.pageHeights.push(((prevPage !== i - 1) ? Math.max.apply(null, this.columnHeights.slice(prevPage, i - 1)) :
                        this.columnHeights[prevPage as number]));
                    columnWidth = this.maxColumnWidth + padding;
                    prevPage = i;
                }
            }
            this.pageHeights.push(((prevPage !== columnCount - 1) ?
                Math.max.apply(null, this.columnHeights.slice(prevPage, columnCount - 1)) : this.columnHeights[prevPage as number]));
            this.totalPages = this.pageHeights.length;
        }
        return maxPageColumn;
    }

    /**
     * Calculates the available width from the legend's x position.
     *
     * @param {number} tx - The x position of the legend.
     * @param {number} width - The width of the legend.
     * @returns {number} - The available width of the legend.
     */
    private getAvailWidth(tx: number, width: number): number {
        if (this.isVertical) {
            width = this.maxWidth;
        } else if (!this.isVertical && this.isPaging && !this.legend.enablePages) {
            return width - tx - this.fivePixel;
        }
        return width - ((this.legend.padding * 2) + this.legend.shapeWidth + this.legend.shapePadding);
    }

    /**
     * Determines the legend rendering locations from legend items.
     *
     * @param {LegendOptions} legendOption - The current legend option.
     * @param {ChartLocation} start - The start location of the legend.
     * @param {number} textPadding - The text padding of the legend text.
     * @param {LegendOptions} prevLegend - The previous legend option.
     * @param {Rect} rect - The legend bounds.
     * @param {number} count - The legend index.
     * @param {number} firstLegend - The current legend location.
     * @returns {void}
     * @private
     */
    public getRenderPoint(legendOption: LegendOptions, start: ChartLocation, textPadding: number, prevLegend: LegendOptions,
                          rect: Rect, count: number, firstLegend: number): void {
        const padding: number = this.legend.padding;
        const previousLocation: number = prevLegend.location.y + this.maxItemHeight / 4 + (prevLegend.textCollection.length > 0 ?
            ((prevLegend.textCollection.length - 1) * this.maxItemHeight) : 0);
        if (this.isVertical) {
            if (count === firstLegend || (previousLocation + legendOption.textSize.height + padding > (rect.y + rect.height))) {
                legendOption.location.x = prevLegend.location.x + ((count === firstLegend) ? 0 : (!this.isRtlEnable) ?
                    this.maxColumnWidth : -this.maxColumnWidth);
                legendOption.location.y = start.y;
                const textStartLoc: number = (this.legend.shapeWidth / 2) + padding;
                this.pageXCollections.push(legendOption.location.x + ((!this.isRtlEnable) ? -textStartLoc : textStartLoc));
            } else {
                legendOption.location.x = prevLegend.location.x;
                legendOption.location.y = prevLegend.location.y + prevLegend.textSize.height + this.itemPadding;
            }
        } else {
            const textWidth: number = textPadding + (this.legend.maximumLabelWidth ?
                this.legend.maximumLabelWidth : prevLegend.textSize.width);
            const previousBound: number = prevLegend.location.x + ((!this.isRtlEnable) ? textWidth : -textWidth);
            if (this.isWithinBounds(previousBound, (this.legend.maximumLabelWidth ? this.legend.maximumLabelWidth :
                legendOption.textSize.width) + textPadding - this.itemPadding, rect, this.legend.shapeWidth / 2)) {
                if (count !== firstLegend) {
                    this.chartRowCount++;
                }
                legendOption.location.y = (count === firstLegend) ? prevLegend.location.y :
                    prevLegend.location.y + this.rowHeights[(this.chartRowCount - 2)] + padding;
                legendOption.location.x = start.x;
            } else {
                legendOption.location.y = prevLegend.location.y;
                legendOption.location.x = (count === firstLegend) ? prevLegend.location.x : previousBound;
            }
        }
        let availablewidth: number = this.getAvailWidth(legendOption.location.x, this.legendBounds.width);
        availablewidth = this.legend.maximumLabelWidth ? Math.min(this.legend.maximumLabelWidth, availablewidth) : availablewidth;
        if (this.legend.textOverflow === 'Ellipsis' && this.legend.textWrap === 'Normal') {
            legendOption.text = textTrim(+availablewidth.toFixed(4), legendOption.text,
                                         this.legend.textStyle, this.chart.enableRtl, this.chart.themeStyle.legendTitleFont);
        }
    }

    /**
     * Checks whether the legend group is within the specified legend bounds, considering RTL (Right-to-Left) rendering.
     *
     * @param {number} previousBound - The previous legend bound value.
     * @param {number} textWidth - The width of the legend text.
     * @param {Rect} legendBounds - The bounds of the legend.
     * @param {number} shapeWidth - The width of the legend shape.
     * @returns {boolean} - Returns true if the legend group is within bounds; otherwise, returns false.
     * @private
     */
    private isWithinBounds(previousBound: number, textWidth: number, legendBounds: Rect, shapeWidth: number): boolean {
        if (!this.isRtlEnable) {
            return (previousBound + textWidth) > (legendBounds.x + legendBounds.width + shapeWidth);
        }
        else {
            return (previousBound - textWidth) < (legendBounds.x - shapeWidth);
        }
    }

    /**
     * Determines the smart legend placement based on specified label bounds, legend bounds, and margin settings.
     *
     * @param {Rect} labelBound - The bounds of the legend label.
     * @param {Rect} legendBound - The bounds of the legend.
     * @param {MarginModel} margin - The margin settings for additional space.
     * @returns {void}
     * @private
     */
    public getSmartLegendLocation(labelBound: Rect, legendBound: Rect, margin: MarginModel): void {
        let space: number;
        switch (this.position) {
        case 'Left':
            space = ((labelBound.x - legendBound.width) - margin.left) / 2;
            legendBound.x = (labelBound.x - legendBound.width) < margin.left ? legendBound.x :
                (labelBound.x - legendBound.width) - space;
            break;
        case 'Right':
            space = ((this.chart.availableSize.width - margin.right) - (labelBound.x + labelBound.width + legendBound.width)) / 2;
            legendBound.x = (labelBound.x + labelBound.width + legendBound.width) > (this.chart.availableSize.width - margin.right) ?
                legendBound.x : (labelBound.x + labelBound.width + space);
            break;
        case 'Top':
            this.getTitleRect(this.chart as CircularChart3D);
            space = ((labelBound.y - legendBound.height) - (this.titleRect.y + this.titleRect.height)) / 2;
            legendBound.y = (labelBound.y - legendBound.height) < margin.top ? legendBound.y :
                (labelBound.y - legendBound.height) - space;
            break;
        case 'Bottom':
            space = ((this.chart.availableSize.height - margin.bottom) - (labelBound.y + labelBound.height + legendBound.height)) / 2;
            legendBound.y = labelBound.y + labelBound.height + legendBound.height > (this.chart.availableSize.height - margin.bottom) ?
                legendBound.y : (labelBound.y + labelBound.height) + space;
            break;
        }
    }

    /**
     * Retrieves the title rectangle for the circular 3D chart.
     *
     * @param {CircularChart3D} circular - The circular 3D chart instance.
     * @returns {Rect | null} - The title rectangle or null if no title is present.
     * @private
     */
    private getTitleRect(circular: CircularChart3D): void {
        if (!circular.title) {
            return null;
        }
        const titleSize: Size = measureText(circular.title, circular.titleStyle, this.chart.themeStyle.legendTitleFont);
        this.titleRect = new Rect(
            circular.availableSize.width / 2 - titleSize.width / 2, circular.margin.top, titleSize.width, titleSize.height);
    }

    /**
     * Retrieves the legend options based on the specified index from the given legend collections.
     *
     * @param {number} index - The index used to find the corresponding legend in the legend collections.
     * @param {LegendOptions[]} legendCollections - The array of legend options containing legend information.
     * @returns {LegendOptions | undefined} - The legend options corresponding to the specified index, or null if not found.
     * @private
     */
    private legendByIndex(index: number, legendCollections: LegendOptions[]): LegendOptions {
        for (const legend of legendCollections) {
            if (legend.pointIndex === index) {
                return legend;
            }
        }
        return null;
    }

    /**
     * Handles the click event to show or hide the legend.
     *
     * @param {Event} event - The event object representing the click event.
     * @returns {void}
     * @private
     */
    public click(event: Event): void {
        const targetId: string = (<HTMLElement>event.target).id.indexOf('_chart_legend_g_') > -1 ?
            (event.target as HTMLElement).firstChild['id'] : (<HTMLElement>event.target).id;
        const chart: CircularChart3D = this.chart as CircularChart3D;
        const legendItemsId: string[] = [this.legendID + '_text_', this.legendID + '_shape_', this.legendID + '_shape_marker_'];
        (this.chart as CircularChart3D).animateSeries = false;
        for (const id of legendItemsId) {
            if (targetId.indexOf(id) > -1) {
                const pointIndex: number = parseInt(targetId.split(id)[1], 10);
                if ((this.chart as CircularChart3D).legendSettings.toggleVisibility && !isNaN(pointIndex)) {
                    const currentSeries: CircularChart3DSeries = (<CircularChart3D>this.chart).visibleSeries[0];
                    const point: CircularChart3DPoints = currentSeries.points[pointIndex as number];
                    const legendOption: LegendOptions = this.legendByIndex(pointIndex, this.legendCollections);
                    const legendClickArgs: CircularChart3DLegendClickEventArgs = {
                        legendText: legendOption.text, legendShape: legendOption.shape,
                        chart: chart,
                        series: currentSeries, point: point,
                        name: legendClick, cancel: false
                    };
                    this.chart.trigger(legendClick, legendClickArgs);
                    if (!legendClickArgs.cancel) {
                        point.visible = !point.visible;
                        legendOption.visible = point.visible;
                        currentSeries.sumOfPoints += point.visible ? point.y : -point.y;
                        chart.redraw = chart.enableAnimation;
                        this.sliceVisibility(pointIndex, point.visible);
                        (<CircularChart3D>chart).removeSeriesElements(chart);
                        chart.removeSvg();
                        const svgObject: Element | null = document.getElementById(this.chart.element.id + '-svg-chart-3d');
                        if (svgObject) {
                            while (svgObject.childNodes.length > 0) {
                                svgObject.removeChild(svgObject.firstChild);
                            }
                        }
                        (<CircularChart3D>this.chart).circular3DPolygon = [];
                        (<CircularChart3D>this.chart).visibleSeries[0].segments = [];
                        this.chart.animateSeries = false;
                        (<CircularChart3D>this.chart).calculateBounds();
                        (<CircularChart3D>this.chart).renderElements();
                        if (chart.circularChartHighlight3DModule && (chart.highlightMode !== 'None' || chart.legendSettings.enableHighlight)) {
                            chart.circularChartHighlight3DModule.redrawSelection(chart);
                        }
                    }
                } else {
                    if ((<CircularChart3D>this.chart).circularChartSelection3DModule && !isNaN(pointIndex)) {
                        (<CircularChart3D>this.chart).circularChartSelection3DModule.legendSelection(
                            <CircularChart3D>this.chart, event.target as Element, event.type);
                    } else if ((<CircularChart3D>this.chart).circularChartHighlight3DModule && !isNaN(pointIndex)) {
                        (<CircularChart3D>this.chart).circularChartHighlight3DModule.legendSelection(
                            <CircularChart3D>this.chart, event.target as Element, event.type);
                    }
                }
            }
        }
        if (targetId.indexOf(this.legendID + '_pageup') > -1) {
            this.changePage(event, true);
        } else if (targetId.indexOf(this.legendID + '_pagedown') > -1) {
            this.changePage(event, false);
        }
        chart.redraw = false;
    }

    /**
     * Updates the visibility of a slice in the circular 3D chart based on the specified index and visibility status.
     *
     * @param {number} index - The index of the slice to be updated.
     * @param {boolean} isVisible - The visibility status to be set for the slice.
     * @returns {void}
     * @private
     */
    private sliceVisibility(index: number, isVisible: boolean): void {
        let sliceId: string = this.chart.element.id + '_Series_0_Point_';
        if (((this.chart as CircularChart3D).visibleSeries[0] as CircularChart3DSeries).dataLabel.visible) {
            sliceId = this.chart.element.id + '_datalabel_Series_0_';
            this.sliceAnimate(getElement(sliceId + 'g_' + index), isVisible);
        }
    }

    /**
     * Performs animation on the specified slice elements based on the visibility of a slice.
     *
     * @param {Element} element - The slice element to be animated.
     * @param {boolean} isVisible - A boolean value indicating the visibility of the slice.
     * @returns {void}
     */
    private sliceAnimate(element: Element, isVisible: boolean): void {
        if (!element) {
            return null;
        }
        new Animation({}).animate(<HTMLElement>element, {
            duration: 300,
            delay: 0,
            name: isVisible ? 'FadeIn' : 'FadeOut',
            end: (args: AnimationOptions): void => {
                args.element.style.visibility = isVisible ? 'visible' : 'hidden';
            }
        });
    }

    /**
     * Retrieves the module name for the circular 3D chart legend.
     *
     * @returns {string} - The module name.
     */
    protected getModuleName(): string {
        return 'CircularChartLegend3D';
    }

    /**
     * Destroys the circular 3D chart legend.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.removeEventListener();
    }
}
