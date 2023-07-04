import { Smithchart } from '../../smithchart';
import { measureText, TextOption, renderTextElement, CircleOption, PathOption, RectOption } from '../../smithchart/utils/helper';
import { SmithchartFontModel } from '../../smithchart/utils/utils-model';
import { SmithchartLegendSettingsModel, LegendItemStyleModel, LegendItemStyleBorderModel } from '../../smithchart/legend/legend-model';
import { SmithchartRect, SmithchartSize, LegendSeries, Point } from '../../smithchart/utils/utils';
import { ISmithchartLegendRenderEventArgs } from '../../smithchart/model/interface';
import { legendRender } from '../model/constant';

export class SmithchartLegend {
    public legendActualBounds: SmithchartRect;
    public legendSeries: LegendSeries[] = [];
    public legendGroup: Element;
    /**
     * legend rendering.
     */
    public legendItemGroup: Element;

    public renderLegend(smithchart: Smithchart): SmithchartRect {
        this.calculateLegendBounds(smithchart);
        this._drawLegend(smithchart);
        return this.legendActualBounds;
    }

    private calculateLegendBounds(smithchart: Smithchart): void {
        this.legendSeries = [];
        const padding: number = 10;
        const legend: SmithchartLegendSettingsModel = smithchart.legendSettings;
        const legendSizeHeight: number = legend.height;
        const legendSizeWidth: number = legend.width;
        const itemPadding: number = legend.itemPadding > 0 ? legend.itemPadding : 0;
        const position: string = legend.position.toLowerCase();
        const font: SmithchartFontModel = legend.title.textStyle;
        let width: number = 0;
        let height: number = 0;
        let legendItemWidth: number = 0;
        let legendItemHeight: number = 0;
        let legendHeight: number = 0;
        const svgObjectWidth: number = smithchart.availableSize.width - ((smithchart.elementSpacing * 4) - (legend.border.width * 2)
            + (smithchart.border.width * 2));
        let rowCount: number = legend.rowCount;
        let columnCount: number = legend.columnCount;
        const titleSize: SmithchartSize = measureText(smithchart.legendSettings['title']['text'], font, smithchart.themeStyle.legendTitleFont);
        let maxRowWidth: number = 0;
        let totalRowHeight: number = 0;
        let curRowWidth: number = 0;
        let curRowHeight: number = 0;
        let allowItems: number;
        let itemsCountRow: number = 0;
        const length: number = smithchart.series.length;
        let legendBounds: SmithchartRect;
        if (smithchart.legendSettings.visible && length !== 0) {
            if (position === 'bottom' || position === 'top' || position === 'custom') {
                if ((rowCount && columnCount) && (rowCount <= columnCount)) {
                    rowCount = length / columnCount;
                } else if (rowCount == null && columnCount != null) {
                    rowCount = length / columnCount;
                } else if (rowCount == null && columnCount == null) {
                    rowCount = 1;
                }
                if (rowCount) {
                    allowItems = Math.ceil(length / rowCount);
                }
            } else {
                if ((rowCount && columnCount) && (rowCount <= columnCount)) {
                    columnCount = length / rowCount;
                } else if (rowCount != null && columnCount == null) {
                    columnCount = length / rowCount;
                } else if (rowCount == null && columnCount == null) {
                    columnCount = 1;
                }
                if (columnCount) {
                    allowItems = columnCount;
                }
            }
            for (let i: number = 0; i < length; i++) {
                this.legendSeries.push({
                    text: smithchart.series[i as number]['name'] ? smithchart.series[i as number]['name'] : 'series' + i,
                    seriesIndex: i,
                    shape: smithchart.legendSettings.shape,
                    fill: smithchart.series[i as number].fill || smithchart.seriesColors[i % smithchart.seriesColors.length],
                    bounds: null
                });
                const legendsize: SmithchartSize = this._getLegendSize(smithchart, this.legendSeries[i as number]);
                legendItemWidth = Math.max(legendsize['width'], legendItemWidth);
                legendItemHeight = Math.max(legendsize['height'], legendItemHeight);
                this.legendSeries[i as number]['bounds'] = { width: legendItemWidth, height: legendItemHeight };
                itemsCountRow = itemsCountRow + 1;
                curRowWidth = curRowWidth + legendItemWidth + itemPadding;
                curRowHeight = Math.max(legendItemHeight, curRowHeight);
                if (position === 'top' || position === 'bottom' || position === 'custom') {
                    if (curRowWidth > svgObjectWidth) {
                        curRowWidth -= legendsize.width + itemPadding;
                        maxRowWidth = Math.max(maxRowWidth, curRowWidth);
                        curRowWidth = legendsize.width + itemPadding;
                        totalRowHeight = totalRowHeight + curRowHeight + itemPadding;
                    }
                }
                if (itemsCountRow === allowItems || i === length - 1) {
                    maxRowWidth = Math.max(maxRowWidth, curRowWidth);
                    totalRowHeight = totalRowHeight + curRowHeight + itemPadding;
                    legendHeight = totalRowHeight;
                    itemsCountRow = 0;
                    curRowHeight = 0;
                    curRowWidth = 0;
                }
            }
            width = (titleSize.width) > maxRowWidth - itemPadding ? (titleSize.width + padding * 2 + itemPadding) :
                maxRowWidth + padding * 2 - (smithchart.border.width * 2);
            height = legendHeight + smithchart.elementSpacing;
            legendBounds = { x: 0, y: 0, width: width, height: height };
        }
        this.legendActualBounds = legendBounds;
        if (legendSizeWidth != null) {
            this.legendActualBounds.width = legendSizeWidth;
        }
        if (legendSizeHeight != null) {
            this.legendActualBounds.height = legendSizeHeight;
        }
    }

    private _getLegendSize(smithchart: Smithchart, series: LegendSeries): SmithchartSize {
        const legend: SmithchartLegendSettingsModel = smithchart.legendSettings;
        const symbolWidth: number = legend.itemStyle.width;
        const symbolHeight: number = legend.itemStyle.height;
        const textSize: SmithchartSize = measureText(series.text, legend.textStyle, smithchart.themeStyle.legendLabelFont);
        const width: number = symbolWidth + textSize.width + legend.shapePadding;
        const height: number = Math.max(symbolHeight, textSize.height);

        return { width: width, height: height };
    }
    /* eslint-disable  */
    private _drawLegend(smithchart: Smithchart): void {
        let legend: SmithchartLegendSettingsModel = smithchart.legendSettings;
        let legendPosition: string = legend.position.toLowerCase();
        let alignment: string = legend.alignment;
        let legendBounds: SmithchartRect = this.legendActualBounds;
        let maxWidth: number = 0;
        let startX: number;
        let startY: number;
        let titleFont: SmithchartFontModel = smithchart.title.font ? smithchart.title.font : smithchart.title.textStyle;
        let smithchartTitleHeight: number = measureText(smithchart.title.text, titleFont, smithchart.themeStyle.legendLabelFont).height;
        let smithchartSubtitleHeight: number = measureText(smithchart.title.subtitle.text, smithchart.title.subtitle.textStyle, smithchart.themeStyle.legendLabelFont).height;
        let elementSpacing: number = smithchart.elementSpacing;
        let offset: number = smithchartTitleHeight + smithchartSubtitleHeight + elementSpacing + smithchart.margin.top;
        let itemPadding: number = legend.itemPadding > 0 ? legend.itemPadding : 0;
        let svgObjectWidth: number = smithchart.availableSize.width;
        let svgObjectHeight: number = smithchart.availableSize.height;
        let legendBorder: number = legend.border.width;
        let legendWidth: number = 0;
        let titleSize: SmithchartSize = measureText(legend['title']['text'], legend.title.textStyle, smithchart.themeStyle.legendLabelFont);
        let legendTitleHeight: number = titleSize.height;
        let borderSize: number = smithchart.border.width;
        let svgWidth: number = svgObjectWidth - ((borderSize * 2));
        let svgHeight: number = svgObjectHeight - ((borderSize * 2));
        legendBounds.height += legendTitleHeight;
        if (legendPosition !== 'custom') {
            switch (legendPosition) {
                case 'bottom':
                    legendBounds.y = svgHeight - (legendBounds.height + (legendBorder) + elementSpacing);
                    break;
                case 'top':
                    legendBounds.y = borderSize + offset;
                    break;
                case 'right':
                    legendBounds.x = svgWidth - legendBounds.width - (elementSpacing * 2);
                    break;
                case 'left':
                    legendBounds.x = borderSize + (elementSpacing * 2);
                    break;
            }
            if (legendPosition === 'left' || legendPosition === 'right') {
                switch (alignment) {
                    case 'Center':
                        legendBounds.y = (svgHeight / 2) - ((legendBounds.height + legendBorder * 2) / 2) + (elementSpacing / 2);
                        break;
                    case 'Near':
                        legendBounds.y = borderSize + (elementSpacing * 2) + offset;
                        break;
                    case 'Far':
                        legendBounds.y = svgHeight - (legendBounds.height + (legendBorder)) - (elementSpacing * 2);
                        break;
                }
            } else {
                switch (alignment) {
                    case 'Center':
                        legendBounds.x = (svgWidth / 2) - ((legendBounds.width + legendBorder * 2) / 2) + (elementSpacing / 2);
                        break;
                    case 'Near':
                        legendBounds.x = borderSize + (elementSpacing * 2);
                        break;
                    case 'Far':
                        legendBounds.x = svgWidth - (legendBounds.width + (legendBorder)) - (elementSpacing * 2);
                        break;
                }
            }
        } else {
            legendBounds.y = (legend.location.y < svgHeight) ? legend.location.y : 0;
            legendBounds.x = (legend.location.x < svgWidth) ? legend.location.x : 0;
        }
        if (legendPosition === 'bottom' || legendPosition === 'top') {
            for (let i: number = 0; i < this.legendSeries.length; i++) {
                legendWidth += this.legendSeries[i].bounds.width + itemPadding;
                if (legendWidth > svgWidth) {
                    legendBounds.x = (svgWidth / 2) - ((legendBounds.width + legendBorder * 2) / 2) + (elementSpacing / 2);
                    break;
                }
            }
        }
        let gLegendEle: Element = smithchart.renderer.createGroup({ 'id': smithchart.element.id + '_legend_group' });
        smithchart.svgObject.appendChild(gLegendEle);
        this.legendItemGroup = smithchart.renderer.createGroup({ 'id': smithchart.element.id + 'legendItem_Group' });
        let currentX: number = startX = elementSpacing;
        let currentY: number = startY = elementSpacing;
        if (legend.title.text !== '' && legend.title.visible) {
            gLegendEle.appendChild(this.drawLegendTitle(smithchart, legend, legendBounds, gLegendEle));
            currentY = startY = elementSpacing + legendTitleHeight;
        }
        for (let k: number = 0; k < this.legendSeries.length; k++) {
            if ((legend.rowCount < legend.columnCount || legend.rowCount === legend.columnCount) &&
                (legendPosition === 'top' || legendPosition === 'bottom' || legendPosition === 'custom')) {
                if ((currentX + this.legendSeries[k]['bounds'].width) > legendBounds.width + startX) {
                    currentX = elementSpacing;
                    currentY += this.legendSeries[k]['bounds'].height + itemPadding;
                }
                this.legendGroup = this.drawLegendItem(smithchart, legend, this.legendSeries[k], k, currentX, (currentY), legendBounds);
                gLegendEle.appendChild(this.legendGroup);
                currentX += this.legendSeries[k]['bounds'].width + itemPadding;
            } else {
                if (((currentY + this.legendSeries[k]['bounds'].height + itemPadding) +
                    legendTitleHeight + borderSize > legendBounds.height + startY)) {
                    currentY = startY;
                    currentX += maxWidth + (itemPadding);
                }
                this.legendGroup = this.drawLegendItem(
                    smithchart, legend, this.legendSeries[k], k, (currentX), (currentY), legendBounds);
                gLegendEle.appendChild(this.legendGroup);
                currentY += this.legendSeries[k]['bounds'].height + itemPadding;
                maxWidth = Math.max(maxWidth, this.legendSeries[k]['bounds'].width);
            }
        }
        gLegendEle.setAttribute('transform', 'translate(' + legendBounds.x.toString() + ',' + legendBounds.y.toString() + ')');
        this.drawLegendBorder(gLegendEle, smithchart, legend, legendBounds);
    }

    private drawLegendBorder(
        gLegendEle: Element, smithchart: Smithchart, legend: SmithchartLegendSettingsModel, legendBounds: SmithchartRect): void {
        let borderRect: RectOption = new RectOption(
            smithchart.element.id + '_svg' + '_legendRect', 'none', legend.border, 1,
            new SmithchartRect(0, 0, legendBounds.width, legendBounds.height));
        gLegendEle.appendChild(smithchart.renderer.drawRectangle(borderRect) as SVGRectElement);
    }
    private drawLegendTitle(
        smithchart: Smithchart, legend: SmithchartLegendSettingsModel, legendBounds: SmithchartRect,
        gLegendEle: Element): Element {
        let elementSpacing: number = smithchart.elementSpacing;
        let titleSize: SmithchartSize = measureText(legend.title.text, legend.title.textStyle, smithchart.themeStyle.legendLabelFont);
        let titleWidth: number = titleSize.width;
        let titleHeight: number = titleSize.height;
        let textAlignment: string = legend.title.textAlignment;
        let startX: number = 0;
        let legendBoundsWidth: number = legendBounds.width;
        let startY: number = elementSpacing + (titleHeight / 2);
        switch (textAlignment) {
            case 'Far':
                startX = legendBoundsWidth - titleWidth - startX;
                break;
            case 'Center':
                startX = legendBoundsWidth / 2 - (titleWidth) / 2;
                break;
        }
        if (startX < 0) {
            startX = 0;
            legendBoundsWidth = titleWidth;
        }
        if (legendBoundsWidth < titleWidth + startX) {
            legendBoundsWidth = titleWidth + startX;
        }
        let options: TextOption = new TextOption(
            smithchart.element.id + '_LegendTitleText', startX, startY, 'start', legend.title.text
        );
        let element: Element = renderTextElement(options, legend.title.textStyle, legend.title.textStyle.color || smithchart.themeStyle.legendTitleFont.color, gLegendEle, smithchart.themeStyle.legendTitleFont);
        element.setAttribute('aria-label', legend.title.description || legend.title.text);
        return element;
    }

    private drawLegendItem(
        smithchart: Smithchart, legend: SmithchartLegendSettingsModel, legendSeries: LegendSeries,
        k: number, x: number, y: number, legendBounds: SmithchartRect): Element {
        let location: Point;
        let radius: number;
        let symbol: LegendItemStyleModel = legend.itemStyle;
        let itemPadding: number = legend.itemPadding;
        let textHeight: number;
        radius = Math.sqrt(symbol['width'] * symbol['width'] + symbol['height'] * symbol['height']) / 2;
        textHeight = measureText(legendSeries['text'], legend.textStyle, smithchart.themeStyle.legendLabelFont).height;
        location = {
            x: x + symbol['width'] / 2,
            y: (y + (textHeight > symbol['height'] ? textHeight : symbol['height']) / 2)
        };

        let legendGroup: Element = smithchart.renderer.createGroup({ id: smithchart.element.id + '_svg' + '_Legend' + k.toString() });
        legendGroup['style']['cursor'] = legend.toggleVisibility ? 'pointer' : 'default';
        let legendEventArgs: ISmithchartLegendRenderEventArgs = {
            text: legendSeries['text'],
            fill: legendSeries['fill'],
            shape: legendSeries['shape'],
            name: legendRender,
            cancel: false
        };
        let legendRenderSuccess: Function = (args: ISmithchartLegendRenderEventArgs) => {
            if (!args.cancel) {
                let shape: Element = this.drawLegendShape(smithchart, legendSeries, location.x, location.y, k, legend, args);
                legendGroup.appendChild(shape);
                let options: TextOption = new TextOption(
                    smithchart.element.id + '_LegendItemText' + k.toString(), location.x + symbol['width'] / 2 + legend.shapePadding,
                    location.y + textHeight / 4, 'start', args.text
                );
                legend.textStyle.fontFamily = legend.textStyle.fontFamily || smithchart.themeStyle.legendLabelFont.fontFamily;
                legend.textStyle.size = legend.textStyle.size || smithchart.themeStyle.legendLabelFont.size;
                let element: Element = renderTextElement(options, legend.textStyle, legend.textStyle.color || smithchart.themeStyle.legendLabelFont.color, legendGroup, smithchart.themeStyle.legendLabelFont);
                legendGroup.setAttribute('aria-label', legend.description || ('Show ' + options.text));
                legendGroup.appendChild(element);
                this.legendItemGroup.appendChild(legendGroup);
            }
        };
        legendRenderSuccess.bind(this);
        smithchart.trigger(legendRender, legendEventArgs, legendRenderSuccess);
        return this.legendItemGroup;
    }
    private drawLegendShape(
        smithchart: Smithchart, legendSeries: LegendSeries, locX: number, locY: number, index: number,
        legend: SmithchartLegendSettingsModel, legendEventArgs: ISmithchartLegendRenderEventArgs): Element {
        let element: Element;
        let circleOptions: CircleOption;
        let pathOptions: PathOption;
        let path: string;
        let symbol: LegendItemStyleModel = legend.itemStyle;
        let width: number = symbol['width'];
        let height: number = symbol['height'];
        let x: number = locX + (-width / 2);
        let y: number = locY + (-height / 2);
        let border: LegendItemStyleBorderModel = { color: symbol.border.color, width: symbol.border.width };
        let opacity: number = 1;
        let fill: string = (smithchart.series[index].visibility === 'visible') ? legendEventArgs.fill : 'grey';
        let shape: string = legendEventArgs.shape.toLowerCase();
        let radius: number = Math.sqrt(height * height + width * width) / 2;
        switch (shape) {
            case 'circle':
                circleOptions = new CircleOption(
                    smithchart.element.id + '_svg' + '_LegendItemShape' + index.toString(),
                    fill, border, opacity, locX, locY, radius, null);
                element = smithchart.renderer.drawCircle(circleOptions) as SVGCircleElement;
                break;
            case 'rectangle':
                path = 'M' + ' ' + x + ' ' + (locY + (-height / 2)) + ' ' +
                    'L' + ' ' + ((width / 2) + locX) + ' ' + (locY + (-height / 2)) + ' ' +
                    'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (height / 2)) + ' ' +
                    'L' + ' ' + x + ' ' + (locY + (height / 2)) + ' ' +
                    'L' + ' ' + x + ' ' + (locY + (-height / 2)) + ' z';
                pathOptions = new PathOption(
                    smithchart.element.id + '_svg' + '_LegendItemShape' + index.toString(),
                    fill, border.width, border.color, 1, '', path);
                element = smithchart.renderer.drawPath(pathOptions) as SVGPathElement;
                break;
            case 'diamond':
                path = 'M' + ' ' + x + ' ' + locY + ' ' +
                    'L' + ' ' + locX + ' ' + (locY + (-height / 2)) + ' ' +
                    'L' + ' ' + ((width / 2) + locX) + ' ' + locY + ' ' +
                    'L' + ' ' + locX + ' ' + (locY + (height / 2)) + ' ' +
                    'L' + ' ' + x + ' ' + locY + ' z';
                pathOptions = new PathOption(
                    smithchart.element.id + '_svg' + '_LegendItemShape' + index.toString(),
                    fill, border.width, border.color, 1, '', path);
                element = smithchart.renderer.drawPath(pathOptions) as SVGPathElement;
                break;
            case 'pentagon':
                let eq: number = 72;
                for (let j: number = 0; j <= 5; j++) {
                    let xValue: number = radius * Math.cos((Math.PI / 180) * (j * eq));
                    let yValue: number = radius * Math.sin((Math.PI / 180) * (j * eq));
                    if (j === 0) {
                        path = 'M' + ' ' + (xValue + locX) + ' ' + (locY + yValue) + ' ';
                    } else {
                        path = path.concat('L' + ' ' + (locX + xValue) + ' ' + (locY + yValue) + ' ');
                    }
                }
                path = path.concat('Z');
                pathOptions = new PathOption(
                    smithchart.element.id + '_svg' + '_LegendItemShape' + index.toString(),
                    fill, border.width, border.color, 1, '', path);
                element = smithchart.renderer.drawPath(pathOptions) as SVGPathElement;
                break;
            case 'triangle':
                path = 'M' + ' ' + x + ' ' + ((height / 2) + locY) + ' ' +
                    'L' + ' ' + locX + ' ' + (locY + (-height / 2)) + ' ' +
                    'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (height / 2)) + ' ' +
                    'L' + ' ' + x + ' ' + (locY + (height / 2)) + ' Z';
                pathOptions = new PathOption(
                    smithchart.element.id + '_svg' + '_LegendItemShape' + index.toString(),
                    fill, border.width, border.color, 1, '', path);
                element = smithchart.renderer.drawPath(pathOptions) as SVGPathElement;
                break;
        }
        return element;
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'SmithchartLegend';
    }
    /**
     * To destroy the legend. 
     * @return {void}
     * @private
     */
    public destroy(smithchart: Smithchart): void {
        /**
         * Destroy method performed here
         */
    }
}