/**
 * Sankey chart legend
 */

import { BaseLegend, LegendOptions } from '../../common/legend/legend';
import { Size, Rect, measureText } from '@syncfusion/ej2-svg-base';
import { Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ChartLocation, getElement, getUnicodeText, indexFinder, removeElement, showTooltip, textTrim, textWrap } from '../../common/utils/helper';
import { Sankey } from '../sankey';
import { SankeyLegendSettings, SankeyNode } from '../model/sankey-base';
import { SankeyLegendItemHoverEventArgs, SankeyLegendRenderEventArgs, SankeyNodeLayout } from '../model/sankey-interface';
import { LegendSettingsModel } from '../../common/legend/legend-model';
import { regSub, regSup } from '../../common/model/constants';
import { SankeyNodeModel } from '../model/sankey-base-model';

/**
 * The `Legend` module is used to render the legend for the sankey chart.
 */
export class SankeyLegend extends BaseLegend {
    constructor(chart: Sankey) {
        super(chart as Sankey);
        this.library = this;
        this.wireEvents();
    }

    /**
     * Binding events for legend module.
     *
     * @returns {void}
     * @private
     */
    public wireEvents(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.on(Browser.touchMoveEvent, this.handleMouseMove, this);
        this.chart.on('click', this.handleClick, this);
        this.chart.on(Browser.touchEndEvent, this.handleMouseEnd, this);
    }
    /**
     * UnBinding events for legend module.
     *
     * @returns {void}
     * @private
     */
    public unWireEvents(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.off(Browser.touchMoveEvent, this.handleMouseMove);
        this.chart.off('click', this.handleClick);
        this.chart.off(Browser.touchEndEvent, this.handleMouseEnd);
    }

    /**
     * Handles mouse handleLegendMove events on the legend when legend interaction is enabled and the chart is not in touch mode.
     *
     * @param {MouseEvent} event - The mouse handleLegendMove event triggered by the user.
     * @returns {void}
     */
    private handleMouseMove(event: MouseEvent): void {
        const chart: Sankey | undefined = this.chart as Sankey | undefined;
        if (!chart || !chart.legendSettings.visible || chart.isTouch) { return; }
        this.handleLegendMove(event);
    }

    /**
     * Handles mouse end events on the legend when legend interaction is enabled and the chart is in touch mode.
     *
     * @param {MouseEvent} event - The mouse end event triggered by the user.
     * @returns {void}
     * @private
     */
    public handleMouseEnd(event: MouseEvent): void {
        const chart: Sankey | undefined = this.chart as Sankey | undefined;
        if (!chart || !chart.legendSettings.visible || !chart.isTouch) { return; }
        this.handleLegendMove(event);
    }

    /**
     * Builds legend items from the Sankey node collection and applies RTL/reverse ordering rules.
     *
     * @param {Sankey} chart - The Sankey chart instance used to derive legend items.
     * @returns {void}
     * @private
     */
    public getLegendOptions(chart: Sankey): void {
        this.legendCollections = [];
        this.isRtlEnable = chart.enableRtl;

        if (this.legendCollections.length === 0 && chart.nodeLayoutMap) {
            if (typeof chart.nodeLayoutMap === 'object') {
                const nodeLayoutMap: Record<string, SankeyNodeLayout> =
                    chart.nodeLayoutMap as Record<string, SankeyNodeLayout>;

                for (const nodeKey of Object.keys(nodeLayoutMap)) {
                    const nodeLayout: SankeyNodeLayout = nodeLayoutMap[nodeKey as string];
                    if (!nodeLayout) { continue; }

                    const legendText: string = nodeLayout.label || nodeLayout.id;
                    const fillColor: string = nodeLayout.color;
                    const legendOption: LegendOptions =
                        new LegendOptions(legendText, fillColor, 'Rectangle', true, null, '');

                    this.legendCollections.push(legendOption);
                }
            }
        }

        this.isReverse = !this.isRtlEnable && (chart.legendSettings as SankeyLegendSettings).reverse;
        if (this.isReverse) { this.legendCollections.reverse(); }
    }

    /**
     * Calculates legend layout metrics and updates bounds including pagination based on available space.
     *
     * @param {Size} availableSize - The available rendering size for the legend.
     * @param {Rect} legendBounds - The legend bounds to be updated based on computed layout.
     * @param {LegendSettingsModel} legend - The legend settings model used for layout calculations.
     * @returns {void}
     * @private
     */
    public getLegendBounds(availableSize: Size, legendBounds: Rect, legend: LegendSettingsModel): void {
        this.calculateLegendTitle(legend, legendBounds);

        this.isTitle = !!legend.title;
        this.chartRowCount = 1;
        this.rowHeights = [];
        this.columnHeights = [];
        this.pageHeights = [];

        const padding: number = legend.padding;

        let extraHeight: number = 0;
        let extraWidth: number = 0;

        let titleSpace: number = this.isTitle ? (this.legendTitleSize.height + this.fivePixel) : 0;
        titleSpace = (this.isTitle && this.isVertical) ? (this.legendTitleSize.height + this.fivePixel) : titleSpace;

        if (!this.isVertical) {
            extraHeight = !legend.height ? ((availableSize.height / 100) * 5) : 0;
        } else {
            extraWidth = !legend.width ? ((availableSize.width / 100) * 5) : 0;
        }

        legendBounds.height += extraHeight;
        legendBounds.width += extraWidth;
        let shapeWidth: number = legend.shapeWidth;
        let shapePadding: number = legend.shapePadding;

        let maximumRowWidth: number = 0;
        let currentRowWidth: number = 0;
        let currentItemWidth: number = 0;

        let currentColumnHeight: number = 0;
        let currentColumnIndex: number = 0;

        let rowCount: number = 0;
        const titleArrowSpace: number = 0;

        let legendRenderArgs: SankeyLegendRenderEventArgs;
        let hasRenderableItems: boolean = false;

        this.maxItemHeight = Math.max(
            measureText('MeasureText', legend.textStyle, this.chart.themeStyle.legendLabelFont).height,
            legend.shapeHeight
        );

        for (let itemIndex: number = 0; itemIndex < this.legendCollections.length; itemIndex++) {
            const legendOption: LegendOptions = this.legendCollections[itemIndex as number];

            if (regSub.test(legendOption.text)) {
                legendOption.text = getUnicodeText(legendOption.text, regSub);
            }
            if (regSup.test(legendOption.text)) {
                legendOption.text = getUnicodeText(legendOption.text, regSup);
            }
            legendOption.originalText = legendOption.text;

            legendRenderArgs = { fill: legendOption.fill, text: legendOption.text };
            this.chart.trigger('legendItemRendering', legendRenderArgs);

            legendOption.render = true;
            legendOption.text = legendRenderArgs.text;
            legendOption.fill = legendRenderArgs.fill;

            legendOption.textSize = measureText(
                legendOption.text,
                legend.textStyle,
                this.chart.themeStyle.legendLabelFont
            );

            shapeWidth = legendOption.text ? legend.shapeWidth : 0;
            shapePadding = legendOption.text ? legend.shapePadding : 0;
            if (legendOption.render && legendOption.text) {
                hasRenderableItems = true;

                currentItemWidth =
                    shapeWidth +
                    shapePadding +
                    legendOption.textSize.width +
                    (!this.isVertical
                        ? (itemIndex === 0 ? padding : this.itemPadding)
                        : padding);

                currentRowWidth += currentItemWidth;

                this.getLegendHeight(legendOption, legend, legendBounds, currentRowWidth, this.maxItemHeight, padding);

                if (legendBounds.width < (padding + currentRowWidth + titleArrowSpace) || this.isVertical) {
                    maximumRowWidth = Math.max(
                        maximumRowWidth,
                        (currentRowWidth + padding + titleArrowSpace - (this.isVertical ? 0 : currentItemWidth))
                    );

                    if (rowCount === 0 && (currentItemWidth !== currentRowWidth)) {
                        rowCount = 1;
                    }

                    currentRowWidth = this.isVertical ? 0 : currentItemWidth;
                    rowCount++;

                    currentColumnIndex = 0;
                    currentColumnHeight = 0;
                }

                const rowIndex: number = rowCount > 0 ? (rowCount - 1) : 0;

                this.rowHeights[rowIndex as number] = Math.max(
                    (this.rowHeights[rowIndex as number] || 0),
                    Math.max(legendOption.textSize.height, legend.shapeHeight)
                );

                this.columnHeights[currentColumnIndex as number] =
                    (this.columnHeights[currentColumnIndex as number] || 0) +
                    Math.max(legendOption.textSize.height, legend.shapeHeight) +
                    ((this.isVertical || (rowCount > 0 && this.legend.itemPadding))
                        ? (itemIndex === 0 ? padding : this.itemPadding)
                        : padding);

                currentColumnIndex++;
            }
        }

        const tallestColumnHeight: number = this.columnHeights.length > 0 ? Math.max(...this.columnHeights) : 0;

        currentColumnHeight = tallestColumnHeight + padding + titleSpace;
        currentColumnHeight = Math.max(currentColumnHeight, (this.maxItemHeight + padding) + padding + titleSpace);

        this.isPaging = legendBounds.height < currentColumnHeight;
        this.totalPages = rowCount;

        if (hasRenderableItems) {
            this.setBounds(Math.max((currentRowWidth + padding), maximumRowWidth), currentColumnHeight, legend, legendBounds);
        } else {
            this.setBounds(0, 0, legend, legendBounds);
        }
    }

    /**
     * Updates legend item text collection and height when wrapping is enabled and the item exceeds the available row width.
     *
     * @param {LegendOptions} legendOption - The legend item to update with wrapped text and computed height.
     * @param {LegendSettingsModel} legend - The legend settings used to determine wrapping and padding behavior.
     * @param {Rect} legendBounds - The bounding rectangle that limits legend layout width.
     * @param {number} rowWidth - The current accumulated row width including previous legend items.
     * @param {number} legendHeight - The base height used to compute wrapped text block height.
     * @param {number} padding - The padding value used in legend layout calculations.
     * @returns {void}
     * @private
     */
    public getLegendHeight(
        legendOption: LegendOptions,
        legend: LegendSettingsModel,
        legendBounds: Rect,
        rowWidth: number,
        legendHeight: number,
        padding: number
    ): void {
        const textWidth: number = legendOption.textSize.width;
        const effectiveTextPadding: number = legend.shapePadding + (padding * 2) + legend.shapeWidth;

        switch (legend.textStyle.textOverflow) {
        case 'Wrap':
            if (textWidth + rowWidth > legendBounds.width) {
                legendOption.textCollection = textWrap(
                    legendOption.text,
                    (legendBounds.width - effectiveTextPadding),
                    legend.textStyle,
                    this.chart.enableRtl,
                    null,
                    null,
                    this.chart.themeStyle.legendLabelFont
                );
            } else {
                legendOption.textCollection.push(legendOption.text);
            }
            legendOption.textSize.height = (legendHeight * legendOption.textCollection.length);
            break;
        }
    }

    /**
     * Calculates and assigns the legend item render location and applies trim overflow based on available width.
     *
     * @param {LegendOptions} legendOption - The legend item whose render point is being computed.
     * @param {ChartLocation} start - The starting location for the current row/column layout.
     * @param {number} textPadding - The padding to apply between shape and text for positioning calculations.
     * @param {LegendOptions} previousLegend - The previous legend item used as a reference for placement.
     * @param {Rect} rect - The layout bounds rectangle used to determine line breaks/column breaks.
     * @param {number} count - The current legend item index in the collection.
     * @param {number} firstLegend - The index of the first legend item in the current page/section.
     * @returns {void}
     * @private
     */
    public getRenderPoint(
        legendOption: LegendOptions,
        start: ChartLocation,
        textPadding: number,
        previousLegend: LegendOptions,
        rect: Rect,
        count: number,
        firstLegend: number
    ): void {
        const padding: number = this.legend.padding;
        const previousItemTextWidth: number = textPadding + previousLegend.textSize.width;
        const previousBound: number = previousLegend.location.x + ((!this.isRtlEnable) ? previousItemTextWidth : -previousItemTextWidth);

        if (
            this.isWithinLegendBounds(previousBound, (legendOption.textSize.width) + textPadding - this.itemPadding, rect) ||
            this.isVertical
        ) {
            legendOption.location.x = start.x;

            if (count !== firstLegend) {
                this.chartRowCount++;
            }
            const rowIndex: number = (this.chartRowCount - 2) >= this.rowHeights.length ? this.rowHeights.length - 1 :
                (this.chartRowCount - 2);
            legendOption.location.y = (count === firstLegend)
                ? previousLegend.location.y
                : previousLegend.location.y +
                (this.isVertical
                    ? Math.max(previousLegend.textSize.height, this.legend.shapeHeight)
                    : this.rowHeights[rowIndex as number]) +
                ((this.isVertical || (this.chartRowCount > 1 && this.legend.itemPadding)) ? this.itemPadding : padding);
        } else {
            legendOption.location.x = (count === firstLegend) ? previousLegend.location.x : previousBound;
            legendOption.location.y = previousLegend.location.y;
        }

        const availableWidth: number = (!this.isRtlEnable)
            ? (this.legendBounds.x + this.legendBounds.width) - (legendOption.location.x + textPadding
                - this.itemPadding - this.legend.shapeWidth / 2)
            : (legendOption.location.x - textPadding + this.itemPadding + (this.legend.shapeWidth / 2)) - this.legendBounds.x;

        if (this.legend.textStyle.textOverflow === 'Trim') {
            legendOption.text = textTrim(
                +availableWidth.toFixed(4),
                legendOption.text,
                this.legend.textStyle,
                this.chart.enableRtl,
                this.chart.themeStyle.legendLabelFont
            );
        }
    }

    /**
     * Checks whether the next legend item will exceed the provided bounds based on RTL direction.
     *
     * @param {number} previousBound - The computed boundary position from the previous legend item.
     * @param {number} textWidth - The width to be tested against the bounds.
     * @param {Rect} rect - The bounding rectangle used for overflow detection.
     * @returns {boolean} true if within bouunds, else false.
     *
     * @private
     */
    public isWithinLegendBounds(previousBound: number, textWidth: number, rect: Rect): boolean {
        if (!this.isRtlEnable) {
            return (previousBound + textWidth) > (rect.x + rect.width + (this.legend.shapeWidth / 2));
        } else {
            return (previousBound - textWidth) < (rect.x - (this.legend.shapeWidth / 2));
        }
    }

    /**
     * Processes legend hover/trim-tooltip behavior based on the current pointer target within the legend.
     *
     * @param {Event} event - The interaction event used to resolve the current legend target element.
     * @returns {void}
     *
     * @private
     */
    public handleLegendMove(event: Event): void {
        const chart: Sankey = this.chart as Sankey;
        const x: number = chart.mouseX;
        const y: number = chart.mouseY;

        const targetElement: HTMLElement = event.target as HTMLElement;

        // Trigger legendItemHover event
        if (targetElement && targetElement.id.indexOf('_legend_') > -1) {
            let legendIndex: number = indexFinder(targetElement.id).point;

            if (isNullOrUndefined(legendIndex) && targetElement.id.indexOf('_g_') > -1) {
                const targetIdParts: string[] = targetElement.id.split(this.legendID + '_g_');
                if (targetIdParts.length === 2) {
                    legendIndex = parseInt(targetIdParts[1], 10);
                }
            }

            if (!isNaN(legendIndex) && this.legendCollections[legendIndex as number]) {
                const legendItem: LegendOptions = this.legendCollections[legendIndex as number];
                let nodeKey: string | null = null;

                const nodeKeys: string[] = Object.keys(chart.nodeLayoutMap) as string[];
                for (let keyIndex: number = 0; keyIndex < nodeKeys.length; keyIndex++) {
                    const key: string = nodeKeys[keyIndex as number];
                    if ((chart.nodeLayoutMap[key as string].label || chart.nodeLayoutMap[key as string].id) === legendItem.originalText) {
                        nodeKey = key;
                        break;
                    }
                }

                if (nodeKey && chart.nodeLayoutMap[nodeKey as string]) {
                    const nodeLayout: SankeyNodeLayout = chart.nodeLayoutMap[nodeKey as string];
                    if (nodeLayout) {
                        let hoveredUserNode: SankeyNodeModel | null = null;

                        const userNodes: SankeyNodeModel[] = (chart.nodes as SankeyNodeModel[]) || [];
                        for (let nodeIndex: number = 0; nodeIndex < userNodes.length; nodeIndex++) {
                            const nodeDefinition: SankeyNodeModel = userNodes[nodeIndex as number];
                            if (nodeDefinition && nodeDefinition.id === nodeLayout.id) {
                                hoveredUserNode = nodeDefinition;
                                break;
                            }
                        }

                        const hoverArgs: SankeyLegendItemHoverEventArgs = { node: hoveredUserNode as SankeyNode };
                        chart.trigger('legendItemHover', hoverArgs);
                    }
                }
            }
        }

        if (targetElement && targetElement.textContent && targetElement.textContent.indexOf('...') > -1) {
            const targetIdParts: string[] = targetElement.id.split(this.legendID + '_text_');
            if (targetIdParts.length === 2) {
                const legendTextIndex: number = parseInt(targetIdParts[1], 10);
                if (!isNaN(legendTextIndex)) {
                    removeElement(this.chart.element.id + '_EJ2_Legend_Tooltip');
                    showTooltip(
                        (event.target as HTMLElement).textContent,
                        x,
                        y,
                        chart.element.offsetWidth,
                        this.chart.element.id + '_EJ2_Legend_Tooltip',
                        getElement(this.chart.element.id + '_Secondary_Element')
                    );
                }
            }
        } else {
            removeElement(this.chart.element.id + '_EJ2_Legend_Tooltip');
        }
    }

    /**
     * Handles legend click interactions for paging controls when legend is visible.
     *
     * @param {Event | PointerEvent} event - The click or pointer event raised from the legend element.
     * @returns {void}
     *
     * @private
     */
    public handleClick(event: Event | PointerEvent): void {
        const chart: Sankey | undefined = this.chart as Sankey | undefined;
        if (!chart || !chart.legendSettings.visible) { return; }

        const targetElement: HTMLElement = event.target as HTMLElement;
        const firstChildElement: HTMLElement | null = targetElement.firstElementChild as HTMLElement | null;

        const targetId: string = targetElement.id.indexOf('_chart_legend_g_') > -1
            ? (firstChildElement ? firstChildElement.id : targetElement.id)
            : targetElement.id;

        if (targetId.indexOf(this.legendID + '_pageup') > -1) {
            this.changePage(event, true);
        } else if (targetId.indexOf(this.legendID + '_pagedown') > -1) {
            this.changePage(event, false);
        }
    }

    /**
     * Gets the module name for the Sankey legend component.
     *
     * @returns {string} - the module name
     */
    protected getModuleName(): string { return 'SankeyLegend'; }

    /**
     * To destroy the Legend.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.unWireEvents();
    }
}
