/* eslint-disable security/detect-object-injection */
/* eslint-disable no-useless-escape */
/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable jsdoc/require-param */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable valid-jsdoc */
import { NotifyPropertyChanges, Property, Event, Complex, INotifyPropertyChanged, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { extend, compile as templateComplier, Component, resetBlazorTemplate, isBlazor, isNullOrUndefined } from '@syncfusion/ej2-base';
import { SvgRenderer } from '../svg-render/index';
import { ChildProperty, createElement, EmitType, remove, Browser, AnimationOptions, Animation, animationMode } from '@syncfusion/ej2-base';
import { TextStyleModel, TooltipBorderModel, TooltipModel, ToolLocationModel, AreaBoundsModel } from './tooltip-model';
import { ITooltipThemeStyle, ITooltipRenderingEventArgs, ITooltipAnimationCompleteArgs, IBlazorTemplate } from './interface';
import { ITooltipLoadedEventArgs, getTooltipThemeColor } from './interface';
import { Size, Rect, Side, measureText, getElement, findDirection, drawSymbol, textElement } from './helper';
import { removeElement, TextOption, TooltipLocation, PathOption, withInAreaBounds } from './helper';
import { TooltipShape, TooltipTheme, TooltipPlacement } from './enum';

/**
 * Configures the fonts in charts.
 *
 * @private
 */

export class TextStyle extends ChildProperty<TextStyle> {

    /**
     * Font size for the text.
     *
     * @default null
     */
    @Property(null)
    public size: string;

    /**
     * Color for the text.
     *
     * @default ''
     */
    @Property('')
    public color: string;

    /**
     * FontFamily for the text.
     */
    @Property('Segoe UI')
    public fontFamily: string;

    /**
     * FontWeight for the text.
     *
     * @default 'Normal'
     */
    @Property('Normal')
    public fontWeight: string;

    /**
     * FontStyle for the text.
     *
     * @default 'Normal'
     */
    @Property('Normal')
    public fontStyle: string;

    /**
     * Opacity for the text.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Font size for the header text.
     *
     * @default null
     */
    @Property(null)
    public headerTextSize: string;

    /**
     * Font size for the bold text.
     *
     * @default null
     */
    @Property(null)
    public boldTextSize: string;
}

/**
 * Configures the borders in the chart.
 *
 * @private
 */
export class TooltipBorder extends ChildProperty<TooltipBorder> {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default ''
     */
    @Property('')
    public color: string;

    /**
     * The width of the border in pixels.
     *
     * @default 1
     */
    @Property(1)
    public width: number;

    /**
     * The dash-array of the border.
     *
     * @default ''
     */
    @Property('')
    public dashArray: string;

}

/**
 * Configures the borders in the chart.
 *
 * @private
 */
export class AreaBounds extends ChildProperty<AreaBounds> {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default ''
     */
    @Property(0)
    public x: number;

    /**
     * The width of the border in pixels.
     *
     * @default 1
     */
    @Property(0)
    public y: number;

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default ''
     */
    @Property(0)
    public width: number;

    /**
     * The width of the border in pixels.
     *
     * @default 1
     */
    @Property(0)
    public height: number;

}

/**
 * Configures the borders in the chart.
 *
 * @private
 */
export class ToolLocation extends ChildProperty<ToolLocation> {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default ''
     */
    @Property(0)
    public x: number;

    /**
     * The width of the border in pixels.
     *
     * @default 1
     */
    @Property(0)
    public y: number;

}

/**
 * Represents a sorted tooltip item used for arranging split tooltips.
 *
 * @private
 */
interface ISortedTooltipItem {
    /**
     * The vertical (X) coordinate of the tooltip rectangle (left).
     */
    xPosition: number;
    /**
     * The vertical (Y) coordinate of the tooltip rectangle (top).
     */
    yPosition: number;
    /**
     * The height of the tooltip rectangle in pixels.
     */
    height: number;

    /**
     * The width of the tooltip rectangle in pixels.
     */
    width: number;
    /**
     * The original index of this tooltip in the source collection.
     */
    originalIndex: number;
}


/**
 * Represents the Tooltip control.
 * ```html
 * <div id="tooltip"/>
 * <script>
 *   var tooltipObj = new Tooltip({ isResponsive : true });
 *   tooltipObj.appendTo("#tooltip");
 * </script>
 * ```
 *
 * @private
 */
@NotifyPropertyChanges
export class Tooltip extends Component<HTMLElement> implements INotifyPropertyChanged {


    /**
     * Enables / Disables the visibility of the tooltip.
     *
     * @default false.
     * @private
     */
    @Property(false)
    public enable: boolean;

    /**
     * If set to true, a single ToolTip will be displayed for every index.
     *
     * @default false.
     * @private
     */
    @Property(false)
    public shared: boolean;

    /**
     * Specifies whether to enable split tooltip support.
     * When set to `true`, tooltips will be displayed separately for each point in the series.
     *
     * @default false
     * @private
     */
    @Property(false)
    public split: boolean;

    /**
     * If true, the chart displays a tooltip for the data point nearest the cursor;
     *
     * @default false
     * @private
     */
    @Property(false)
    public followPointer: boolean;

    /**
     * To enable crosshair tooltip animation.
     *
     * @default false.
     * @private
     */
    @Property(false)
    public crosshair: boolean;

    /**
     * To enable shadow for the tooltip.
     *
     * @default false.
     * @private
     */

    @Property(false)
    public enableShadow: boolean;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.
     *
     * @private
     */

    @Property(null)
    public fill: string;

    /**
     * Header for tooltip.
     *
     * @private
     */

    @Property('')
    public header: string;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.
     *
     * @private
     */

    @Property(0.75)
    public opacity: number;

    /**
     * Options to customize the ToolTip text.
     *
     * @private
     */

    @Complex<TextStyleModel>({ size: '12px', fontWeight: null, color: null, fontStyle: 'Normal', fontFamily: null }, TextStyle)
    public textStyle: TextStyleModel;

    /**
     * Custom template to format the ToolTip content. Use ${x} and ${y} as the placeholder text to display the corresponding data point.
     *
     * @default null.
     * @aspType string
     * @private
     */

    @Property(null)
    public template: string | Function;

    /**
     * If set to true, ToolTip will animate while moving from one point to another.
     *
     * @default true.
     * @private
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * Duration for Tooltip animation.
     *
     * @default 300
     * @private
     */
    @Property(300)
    public duration: number;

    /**
     * To rotate the tooltip.
     *
     * @default false.
     * @private
     */
    @Property(false)
    public inverted: boolean;

    /**
     * Negative value of the tooltip.
     *
     * @default true.
     * @private
     */
    @Property(false)
    public isNegative: boolean;

    /**
     * Options to customize tooltip borders.
     *
     * @private
     */
    @Complex<TooltipBorderModel>({ color: null, width: null }, TooltipBorder)
    public border: TooltipBorderModel;

    /**
     * Content for the tooltip.
     *
     * @private
     */
    @Property([])
    public content: string[];

    /**
     * Content for the tooltip.
     *
     * @private
     */
    @Property(10)
    public markerSize: number;

    /**
     * Clip location.
     *
     * @private
     */
    @Complex<ToolLocationModel>({ x: 0, y: 0 }, ToolLocation)
    public clipBounds: ToolLocationModel;

    /**
     * Clip location.
     *
     * @private
     */
    @Property([])
    public splitClipBounds: Rect [];

    /**
     * Palette for marker.
     *
     * @private
     */
    @Property([])
    public palette: string[];

    /**
     * Shapes for marker.
     *
     * @private
     */
    @Property([])
    public shapes: TooltipShape[];

    /**
     * imageUrl for marker.
     *
     * @private
     */
    @Property('')
    public markerImage: string;

    /**
     * Location for Tooltip.
     *
     * @private
     */
    @Complex<ToolLocationModel>({ x: 0, y: 0 }, ToolLocation)
    public location: ToolLocationModel;

    /**
     * Location for Tooltip.
     *
     * @private
     */
    @Complex<ToolLocationModel>({ x: 0, y: 0 }, ToolLocation)
    public splitLocations: ToolLocationModel[];

    /**
     * Holds the type of each series in the chart.
     *
     * @private
     */
    @Property([])
    public seriesTypes: string[];

    /**
     * Location for Tooltip.
     *
     * @private
     */
    @Property(0)
    public offset: number;

    /**
     * Rounded corner for x.
     *
     * @private
     */
    @Property(4)
    public rx: number;

    /**
     * Rounded corner for y.
     *
     * @private
     */
    @Property(4)
    public ry: number;

    /**
     * Margin for left and right.
     *
     * @private
     */
    @Property(5)
    public marginX: number;

    /**
     *  Margin for top and bottom.
     *
     * @private
     */
    @Property(5)
    public marginY: number;

    /**
     * Padding for arrow.
     *
     * @private
     */
    @Property(7)
    public arrowPadding: number;

    /**
     * Data for template.
     *
     * @private
     */
    @Property(null)
    public data: Object;

    /**
     * Specifies the theme for the chart.
     *
     * @default 'Material'
     * @private
     */
    @Property('Material')
    public theme: TooltipTheme;

    /**
     * Bounds for the rect.
     *
     * @private
     */
    @Complex<AreaBoundsModel>({ x: 0, y: 0, width: 0, height: 0 }, AreaBounds)
    public areaBounds: AreaBoundsModel;

    /**
     * Bounds for chart.
     *
     * @private
     */
    @Property(null)
    public availableSize: Size;

    /**
     * Blazor templates
     */
    @Property()
    public blazorTemplate: IBlazorTemplate;

    /**
     * To check chart is canvas.
     *
     * @default false.
     * @private
     */

    @Property(false)
    public isCanvas: boolean;

    /**
     * To check tooltip wrap for chart.
     *
     * @default false.
     * @private
     */

    @Property(false)
    public isTextWrap: boolean;

    /**
     * Specifies the location of the tooltip in a fixed position.
     *
     * @default false.
     * @private
     */

    @Property(false)
    public isFixed: boolean;

    /**
     * To place tooltip in a particular position.
     *
     * @default null.
     * @private
     */
    @Property(null)
    public tooltipPlacement: TooltipPlacement;

    /**
     * Control instance
     *
     * @default null.
     * @private
     */
    @Property(null)
    public controlInstance: object;

    /**
     * Specifies the control name.
     *
     * @default ''
     * @private
     */
    @Property('')
    public controlName: string;

    /**
     * Enables or disables the display of tooltips for the nearest data point to the cursor.
     *
     * @default false.
     */

    @Property(false)
    public showNearestTooltip: boolean;

    /**
     * Triggers before each axis range is rendered.
     *
     * @event tooltipRender
     * @private
     */
    @Event()
    public tooltipRender: EmitType<ITooltipRenderingEventArgs>;

    /**
     * Triggers after chart load.
     *
     * @event loaded
     * @private
     */
    @Event()
    public loaded: EmitType<ITooltipLoadedEventArgs>;

    /**
     * Triggers after animation complete.
     *
     * @event animationComplete
     * @private
     */
    @Event()
    public animationComplete: EmitType<ITooltipAnimationCompleteArgs>;

    /**
     * Enables / Disables the rtl rendering of tooltip elements.
     *
     * @default false.
     * @private
     */
    @Property(false)
    public enableRTL: boolean;

    /**
     * change tooltip location.
     *
     * @default false.
     * @private
     */
    @Property(false)
    public allowHighlight: boolean;

    /**
     * Specifies whether to display the header line in the tooltip.
     *
     * @default true
     */
    @Property(true)
    public showHeaderLine: boolean;

    //Internal variables

    private elementSize: Size;
    private toolTipInterval: number;
    private padding: number;
    private areaMargin: number;
    private highlightPadding: number;
    private textElements: Element[];
    private templateFn: Function;
    private formattedText: string[];
    private markerPoint: number[];
    /** @private */
    private valueX: number;
    /** @private */
    private valueY: number;
    public fadeOuted: boolean;
    /** @private */
    private renderer: SvgRenderer;
    /** @private */
    private themeStyle: ITooltipThemeStyle;
    private isFirst: boolean;
    private isWrap: boolean;
    private leftSpace: number;
    private rightSpace: number;
    private wrappedText: string;
    private revert: boolean;
    private outOfBounds: boolean;
    private splitTooltipRectCollection: Rect[];
    private previousContent: string[];
    private hasHorizontalOverflow: boolean;


    /**
     * Constructor for creating the widget
     *
     * @hidden
     */
    constructor(options?: TooltipModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }

    /**
     * Initialize the event handler.
     *
     * @private
     */

    protected preRender(): void {
        this.allowServerDataBinding = false;
        this.initPrivateVariable();
        if (!this.isCanvas) {
            this.removeSVG();
        }
        this.createTooltipElement();
    }

    private initPrivateVariable(): void {
        this.renderer = new SvgRenderer(this.element.id);
        this.themeStyle = getTooltipThemeColor(this.theme);
        this.formattedText = [];
        this.padding = 5;
        this.highlightPadding = 3;
        this.areaMargin = 10;
        this.isFirst = true;
        this.markerPoint = [];
    }

    private removeSVG(): void {
        const svgObject: Element = document.getElementById(this.element.id + '_svg');
        const templateObject: Element = document.getElementById(this.element.id + 'parent_template');
        if (this.blazorTemplate) {
            resetBlazorTemplate(this.element.id + 'parent_template' + '_blazorTemplate');
        }
        if (svgObject && svgObject.parentNode) {
            remove(svgObject);
        }
        if (templateObject && templateObject.parentNode) {
            remove(templateObject);
        }
    }

    /**
     * To Initialize the control rendering.
     */
    protected render(): void {
        this.fadeOuted = false;
        if (!this.template) {
            if (this.split) {
                this.renderSplitTooltip();
            } else {
                this.renderText(this.isFirst);
                const argsData: ITooltipRenderingEventArgs = {
                    cancel: false, name: 'tooltipRender', tooltip: this
                };
                this.trigger('tooltipRender', argsData);
                const markerSide: Side = this.renderTooltipElement(<Rect>this.areaBounds, <TooltipLocation>this.location, 0);
                this.drawMarker(markerSide.isBottom, markerSide.isRight, this.markerSize, 0);
            }
        } else {
            if (this.split) {
                for (let splitIndex: number = 0; splitIndex < (this.data as Object[]).length; splitIndex++) {
                    this.updateTemplateFn();
                    this.createTemplate(<Rect>this.areaBounds, <TooltipLocation>this.location, splitIndex);
                }
            }
            else {
                this.updateTemplateFn();
                this.createTemplate(<Rect>this.areaBounds, <TooltipLocation>this.location);
            }
        }
        this.trigger('loaded', { tooltip: this });
        const element: Element = document.getElementById('chartmeasuretext');
        if (element) {
            remove(element);
        }
        this.allowServerDataBinding = true;
    }

    /**
     * Handles rendering when split tooltip is enabled (creates/removes per-split groups/paths,
     * renders text for each split item, computes auto positions and renders each split tooltip).
     * @private
     */
    private renderSplitTooltip(): void {
        const svgRoot: Element = getElement(this.element.id + '_svg');
        const prevCount: number = (this.previousContent && this.previousContent.length) ? this.previousContent.length : 0;
        const currentCount: number = this.content.length;

        if (svgRoot) {
            if (currentCount > prevCount) {
                for (let index: number = prevCount; index < currentCount; index++) {
                    let tooltipGroup: HTMLElement = document.getElementById(this.element.id + '_group_' + index) as HTMLElement;
                    if (!tooltipGroup) {
                        tooltipGroup = this.renderer.createGroup({ id: this.element.id + '_group_' + index }) as HTMLElement;
                        tooltipGroup.setAttribute('transform', 'translate(0,0)');
                        svgRoot.appendChild(tooltipGroup);

                        const tooltipPath: Element = this.renderer.drawPath({
                            'id': this.element.id + '_path_' + index,
                            'stroke-width': ((this.theme === 'Fabric' || this.theme === 'Fluent' || this.theme === 'Fluent2' || this.theme === 'Fluent2HighContrast') && !this.border.width) ? 1 : this.border.width,
                            'fill': this.fill || this.themeStyle.tooltipFill,
                            'opacity': ((this.theme === 'TailwindDark' || this.theme === 'Tailwind' || this.theme === 'Tailwind3Dark' || this.theme === 'Tailwind3' || this.theme === 'Bootstrap5' || this.theme === 'Bootstrap5Dark' || this.theme.indexOf('Fluent2') > -1) && this.opacity === 0.75) ? 1 : this.opacity,
                            'stroke': this.border.color || (this.theme === 'Fabric' || this.theme === 'Fluent' || this.theme === 'Fluent2' ? '#D2D0CE' : this.border.color)
                        });
                        tooltipGroup.appendChild(tooltipPath);
                    }
                }
            } else if (currentCount < prevCount) {
                for (let index: number = currentCount; index < prevCount; index++) {
                    removeElement(this.element.id + '_group_' + index);
                    removeElement(this.element.id + '_path_' + index);
                    removeElement(this.element.id + '_trackball_group_' + index);
                    removeElement(this.element.id + '_tooltip_connector_' + index);
                }
            }
        }

        this.splitTooltipRectCollection = [];
        this.hasHorizontalOverflow = false;

        for (let splitIndex: number = 0; splitIndex < currentCount; splitIndex++) {
            this.renderText(this.isFirst, splitIndex);
        }

        if (this.split) {
            this.calculateAutoPositions();
        }

        for (let splitIndex: number = 0; splitIndex < currentCount; splitIndex++) {
            const argsData: ITooltipRenderingEventArgs = {
                cancel: false, name: 'tooltipRender', tooltip: this
            };
            this.trigger('tooltipRender', argsData);
            const markerSide: Side = this.renderTooltipElement(<Rect>this.areaBounds, <TooltipLocation>this.location, splitIndex);
            this.drawMarker(markerSide.isBottom, markerSide.isRight, this.markerSize, splitIndex);
        }

        this.previousContent = this.content;
    }

    /**
     * Calculates the actual clip rectangle that encompasses all split clip bounds.
     * @returns The combined clip rectangle
     * @private
     */
    private getActualSplitClipRect(): Rect {
        if (!this.splitClipBounds || this.splitClipBounds.length === 0) {
            return new Rect(0, 0, 0, 0);
        }

        let minY: number = Infinity;
        let maxY: number = -Infinity;
        let minX: number = Infinity;
        let maxX: number = -Infinity;

        for (const clipBound of this.splitClipBounds) {
            const boundTop: number = clipBound.y;
            const boundBottom: number = clipBound.y + clipBound.height;
            const boundLeft: number = clipBound.x;
            const boundRight: number = clipBound.x + clipBound.width;

            minY = Math.min(minY, boundTop);
            maxY = Math.max(maxY, boundBottom);
            minX = Math.min(minX, boundLeft);
            maxX = Math.max(maxX, boundRight);
        }

        const actualWidth: number = maxX - minX;
        const actualHeight: number = maxY - minY;

        return new Rect(minX, minY, actualWidth, actualHeight);
    }

    /**
     * Calculates adjusted positions for split tooltips to prevent overlap
     * Centers overlapping clusters with median at the gap center
     *
     * @private
     */
    private calculateAutoPositions(): void {
        if (!this.split || this.splitTooltipRectCollection.length < 1) {
            return;
        }

        const TOOLTIP_PADDING: number = 20;
        const MINIMUM_GAP: number = 5;
        const OVERFLOW_BUFFER: number = 5;

        let totalXPosition: number = 0;
        const areaBoundsRight: number = this.areaBounds.x + this.areaBounds.width;
        if (!this.inverted) {
            for (const tooltipRect of this.splitTooltipRectCollection) {
                const tooltipRightEdge: number = tooltipRect.x + tooltipRect.width;

                if (tooltipRightEdge > areaBoundsRight) {
                    this.hasHorizontalOverflow = true;
                }

                totalXPosition += tooltipRect.x;
            }

            const averageXPosition: number = totalXPosition / this.splitTooltipRectCollection.length;

            for (const tooltipRect of this.splitTooltipRectCollection) {
                tooltipRect.x = this.hasHorizontalOverflow
                    ? averageXPosition - (tooltipRect.width + 2 * TOOLTIP_PADDING)
                    : averageXPosition;
            }
        } else {
            const horizontalItems: Array<ISortedTooltipItem> = this.splitTooltipRectCollection
                .map((rect: Rect, originalIndex: number): ISortedTooltipItem => ({
                    xPosition: rect.x,
                    yPosition: rect.y,
                    width: rect.width,
                    height: rect.height,
                    originalIndex: originalIndex
                }))
                .sort((leftItem: ISortedTooltipItem, rightItem: ISortedTooltipItem): number => leftItem.xPosition - rightItem.xPosition);

            for (let itemIndex: number = 1; itemIndex < horizontalItems.length; itemIndex++) {
                const previousItem: ISortedTooltipItem = horizontalItems[itemIndex - 1];
                const currentItem: ISortedTooltipItem = horizontalItems[itemIndex];
                const requiredX: number = previousItem.xPosition + previousItem.width + MINIMUM_GAP + OVERFLOW_BUFFER;
                if (currentItem.xPosition < requiredX) { currentItem.xPosition = requiredX; }
            }

            for (const sortedItem of horizontalItems) {
                this.splitTooltipRectCollection[sortedItem.originalIndex].x = sortedItem.xPosition;
            }
            return;
        }

        const sortedTooltipItems: Array<ISortedTooltipItem> = this.splitTooltipRectCollection
            .map((rect: Rect, originalIndex: number): ISortedTooltipItem => ({
                xPosition: rect.x,
                width: rect.width,
                yPosition: rect.y,
                height: rect.height,
                originalIndex: originalIndex
            }))
            .sort((firstItem: ISortedTooltipItem, secondItem: ISortedTooltipItem): number =>
                firstItem.yPosition - secondItem.yPosition
            );

        let clusterStartIndex: number = 0;
        let previousClusterBottomY: number = -Infinity;

        while (clusterStartIndex < sortedTooltipItems.length) {
            const currentCluster: Array<ISortedTooltipItem> = [sortedTooltipItems[clusterStartIndex]];
            let nextItemIndex: number = clusterStartIndex + 1;

            while (nextItemIndex < sortedTooltipItems.length) {
                const previousTooltip: ISortedTooltipItem = currentCluster[currentCluster.length - 1];
                const currentTooltip: ISortedTooltipItem = sortedTooltipItems[nextItemIndex];
                const previousTooltipBottom: number = previousTooltip.yPosition + previousTooltip.height;

                if (currentTooltip.yPosition < previousTooltipBottom + MINIMUM_GAP) {
                    currentCluster.push(currentTooltip);
                    nextItemIndex++;
                } else {
                    break;
                }
            }

            if (currentCluster.length > 1) {
                let totalCenterPoints: number = 0;
                let clusterTotalHeight: number = 0;

                for (const tooltipItem of currentCluster) {
                    const centerY: number = tooltipItem.yPosition + (tooltipItem.height / 2);
                    totalCenterPoints += centerY;
                    clusterTotalHeight += tooltipItem.height;
                }

                const medianCenterY: number = totalCenterPoints / currentCluster.length;
                const totalHeightWithGaps: number = clusterTotalHeight + MINIMUM_GAP * (currentCluster.length - 1);

                let currentYPosition: number = Math.max(
                    medianCenterY - (totalHeightWithGaps / 2),
                    previousClusterBottomY + MINIMUM_GAP
                );

                for (const tooltipItem of currentCluster) {
                    tooltipItem.yPosition = currentYPosition;
                    currentYPosition += tooltipItem.height + MINIMUM_GAP;
                }

                previousClusterBottomY = currentYPosition - MINIMUM_GAP;
            } else {
                const singleTooltip: ISortedTooltipItem = currentCluster[0];
                const requiredMinimumY: number = previousClusterBottomY + MINIMUM_GAP;

                if (singleTooltip.yPosition < requiredMinimumY) {
                    singleTooltip.yPosition = requiredMinimumY;
                }

                previousClusterBottomY = singleTooltip.yPosition + singleTooltip.height;
            }

            clusterStartIndex = nextItemIndex;
        }

        const itemCount: number = sortedTooltipItems.length;

        if (itemCount === 0) {
            return;
        }

        const lastTooltip: ISortedTooltipItem = sortedTooltipItems[itemCount - 1];
        const lastTooltipBottom: number = lastTooltip.yPosition + lastTooltip.height;
        const actualClipRect: Rect = this.getActualSplitClipRect();

        if (lastTooltipBottom > (actualClipRect.y + actualClipRect.height)) {
            const overflowAmount: number = lastTooltipBottom - actualClipRect.height + OVERFLOW_BUFFER;

            for (let currentIndex: number = itemCount - 1; currentIndex >= 0; currentIndex--) {
                const currentTooltipY: number = sortedTooltipItems[currentIndex].yPosition;
                const previousTooltipBottom: number = currentIndex === 0
                    ? actualClipRect.y
                    : sortedTooltipItems[currentIndex - 1].yPosition + sortedTooltipItems[currentIndex - 1].height;
                const availableSpace: number = currentTooltipY - previousTooltipBottom;

                if (availableSpace > overflowAmount) {
                    for (let shiftIndex: number = currentIndex; shiftIndex < itemCount; shiftIndex++) {
                        sortedTooltipItems[shiftIndex].yPosition -= overflowAmount;
                    }
                    break;
                }
            }
        }

        const firstTooltip: ISortedTooltipItem = sortedTooltipItems[0];

        if (firstTooltip.yPosition < (actualClipRect.y)) {
            const overflowAmount: number = actualClipRect.y - firstTooltip.yPosition + OVERFLOW_BUFFER;

            for (let currentIndex: number = 0; currentIndex < itemCount; currentIndex++) {
                const currentTooltipBottom: number = sortedTooltipItems[currentIndex].yPosition + sortedTooltipItems[currentIndex].height;
                const nextTooltipY: number = currentIndex === itemCount - 1
                    ? (actualClipRect.height)
                    : sortedTooltipItems[currentIndex + 1].yPosition;
                const availableSpace: number = nextTooltipY - currentTooltipBottom;

                if (availableSpace > overflowAmount) {
                    for (let shiftIndex: number = currentIndex; shiftIndex >= 0; shiftIndex--) {
                        sortedTooltipItems[shiftIndex].yPosition += overflowAmount;
                    }
                    break;
                }
            }
        }

        for (const tooltipItem of sortedTooltipItems) {
            this.splitTooltipRectCollection[tooltipItem.originalIndex].y = tooltipItem.yPosition;
        }
    }

    /**
     * Draws a connector line between the default tooltip position and the actual position
     * @param splitIndex - Index of the split tooltip
     * @param pointLocationX - pointLocation X position of the tooltip
     * @param pointLocationY - pointLocation Y position of the tooltip
     * @returns The connector line element
     * @private
     */
    private drawConnectorLine(splitIndex: number, pointLocationX: number, pointLocationY: number): Element {
        const startX: number = pointLocationX - this.splitTooltipRectCollection[splitIndex].x;
        const startY: number = pointLocationY - this.splitTooltipRectCollection[splitIndex].y;
        const endX: number = this.hasHorizontalOverflow ? this.splitTooltipRectCollection[splitIndex].width : 0;
        const endY: number = this.splitTooltipRectCollection[splitIndex].height / 2;
        const connectorPath: string = 'M ' + startX + ' ' + startY + ' L ' + endX + ' ' + endY;

        const connectorLine: Element = this.renderer.drawPath({
            'id': this.element.id + '_tooltip_connector_' + splitIndex,
            'd': connectorPath,
            'stroke': this.palette[splitIndex],
            'stroke-width': 1,
            'opacity': this.opacity
        });

        return connectorLine;
    }

    /**
     * Handle split tooltip connector and compute initial rect and overflow.
     * Returns the rect, whether tooltip overflows and whether it should be left-aligned.
     */
    private handleSplitPosition(
        splitIndex: number, groupElement: Element, areaBounds: Rect,
        arrowLocation: TooltipLocation, tipLocation: TooltipLocation
    ): { rect: Rect, tooltipOverflow: boolean, isLeft: boolean, isConnectorLineNeeded: boolean } {
        const pointLocationX: number = this.splitLocations[splitIndex].x + this.splitClipBounds[splitIndex].x;
        const pointLocationY: number = this.splitLocations[splitIndex].y + this.splitClipBounds[splitIndex].y;
        const isConnectorLineNeeded: boolean = pointLocationY !== (
            this.splitTooltipRectCollection[splitIndex].y + this.splitTooltipRectCollection[splitIndex].height / 2
        ) && (this.seriesTypes[splitIndex] !== 'Column');

        let isLeft: boolean = false;

        if (isConnectorLineNeeded) {
            const connectorLine: Element = this.drawConnectorLine(splitIndex, pointLocationX, pointLocationY);
            groupElement.appendChild(connectorLine);
        } else {
            if (document.getElementById(this.element.id + '_tooltip_connector_' + splitIndex)) {
                removeElement(this.element.id + '_tooltip_connector_' + splitIndex);
            }
            arrowLocation.x = this.hasHorizontalOverflow ? this.splitTooltipRectCollection[splitIndex].width : 0;
            arrowLocation.y = this.splitTooltipRectCollection[splitIndex].height / 2;
            tipLocation.y = this.splitTooltipRectCollection[splitIndex].height / 2;
            if (this.hasHorizontalOverflow) {
                isLeft = true;
            }
        }

        const rect: Rect = this.splitTooltipRectCollection[splitIndex];
        const tooltipOverflow: boolean = (rect.y < (0) || rect.y + rect.height > (areaBounds.height)) ||
            !(withInAreaBounds(pointLocationX, pointLocationY, (this.splitClipBounds[splitIndex] as Rect)));

        return { rect: rect, tooltipOverflow: tooltipOverflow, isLeft: isLeft, isConnectorLineNeeded: isConnectorLineNeeded };
    }

    private createTooltipElement(): void {
        this.textElements = [];
        if (!this.template || this.shared) {
            // SVG element for tooltip
            if (this.enableRTL) {
                this.element.setAttribute('dir', 'ltr');
            }
            const svgObject: Element = this.renderer.createSvg({ id: this.element.id + '_svg' });
            this.element.appendChild(svgObject);

            if (this.split) {
                this.configureSplitTooltipElements(svgObject);
            } else {
                // Group to hold text and path.
                let groupElement: HTMLElement = document.getElementById(this.element.id + '_group');
                if (!groupElement) {
                    groupElement = <HTMLElement>this.renderer.createGroup({ id: this.element.id + '_group' });
                    groupElement.setAttribute('transform', 'translate(0,0)');
                }
                svgObject.appendChild(groupElement);
                const pathElement: Element = this.renderer.drawPath({
                    'id': this.element.id + '_path',
                    'stroke-width': ((this.theme === 'Fabric' || this.theme === 'Fluent' || this.theme === 'Fluent2' || this.theme === 'Fluent2HighContrast') && !this.border.width) ? 1 : this.border.width,
                    'fill': this.fill || this.themeStyle.tooltipFill,
                    'opacity': ((this.theme === 'TailwindDark' || this.theme === 'Tailwind' || this.theme === 'Tailwind3Dark' || this.theme === 'Tailwind3' || this.theme === 'Bootstrap5' || this.theme === 'Bootstrap5Dark' || this.theme.indexOf('Fluent2') > -1) && this.opacity === 0.75) ? 1 : this.opacity,
                    'stroke': this.border.color || (this.theme === 'Fabric' || this.theme === 'Fluent' || this.theme === 'Fluent2' ? '#D2D0CE' : this.border.color)
                });
                groupElement.appendChild(pathElement);
            }
        }
    }

    /**
     * Create groups and paths for split tooltip mode.
     * @private
     */
    private configureSplitTooltipElements(svgObject: Element): void {
        for (let splitIndex: number = 0; splitIndex < (this.split ? this.content.length : 1); splitIndex++) {
            // Group to hold text and path for each split tooltip.
            let groupElement: HTMLElement = document.getElementById(this.element.id + '_group_' + splitIndex) as HTMLElement;
            if (!groupElement) {
                groupElement = <HTMLElement>this.renderer.createGroup({ id: this.element.id + '_group_' + splitIndex }) as HTMLElement;
                groupElement.setAttribute('transform', 'translate(0,0)');
            }
            svgObject.appendChild(groupElement);
            const pathElement: Element = this.renderer.drawPath({
                'id': this.element.id + '_path_' + splitIndex,
                'stroke-width': ((this.theme === 'Fabric' || this.theme === 'Fluent' || this.theme === 'Fluent2' || this.theme === 'Fluent2HighContrast') && !this.border.width) ? 1 : this.border.width,
                'fill': this.fill || this.themeStyle.tooltipFill,
                'opacity': ((this.theme === 'TailwindDark' || this.theme === 'Tailwind' || this.theme === 'Tailwind3Dark' || this.theme === 'Tailwind3' || this.theme === 'Bootstrap5' || this.theme === 'Bootstrap5Dark' || this.theme.indexOf('Fluent2') > -1) && this.opacity === 0.75) ? 1 : this.opacity,
                'stroke': this.border.color || (this.theme === 'Fabric' || this.theme === 'Fluent' || this.theme === 'Fluent2' ? '#D2D0CE' : this.border.color)
            });
            groupElement.appendChild(pathElement);
        }
    }

    private drawMarker(isBottom: boolean, isRight: boolean, size: number, splitIndex: number): void {
        if (this.shapes.length <= 0) {
            return null;
        }
        let shapeOption: PathOption;
        let count: number = 0;

        const markerGroup: HTMLElement = <HTMLElement>this.renderer.createGroup({ id: (this.split ? this.element.id + '_trackball_group_' + splitIndex : this.element.id + '_trackball_group') });
        const groupElement: Element = getElement(this.split ? this.element.id + '_group_' + splitIndex : this.element.id + '_group');
        if (!groupElement) {
            return null;
        }
        const x: number = ((this.enableRTL) ? (this.split ? this.splitTooltipRectCollection[splitIndex].width
            - size - this.marginX : this.elementSize.width - (size / 2)) :
            (this.marginX * 2) + (size / 2)) + (isRight ? this.arrowPadding : 0);
        for (let index: number = 0; index < this.shapes.length; index++) {
            const shape: TooltipShape = this.shapes[this.split ? splitIndex : index];
            if (!(this.split && (splitIndex !== index))) {
                if (shape !== 'None') {
                    shapeOption = new PathOption(
                        this.element.id + ('_Trackball_' + (this.split ? splitIndex : count)), this.palette[(this.split ? splitIndex : count) as number],
                        1, '#cccccc', 1, null);
                    if (this.markerPoint[(this.split ? 0 : count) as number]) {
                        let padding: number = 0;
                        if (this.header.indexOf('<br') > -1) {
                            padding = this.header.split(/<br.*?>/g).length + (this.split ? splitIndex : count);
                        }
                        const tooltipContent: string = (this.formattedText && this.formattedText.length >= 2)
                            ? `${this.getTooltipTextContent(this.formattedText[1])}, ${this.getTooltipTextContent(this.formattedText[0])}`
                            : '';
                        markerGroup.appendChild(drawSymbol(
                            new TooltipLocation(x, this.markerPoint[(this.split ? 0 : count) as number]
                            - this.padding + (isBottom ? this.arrowPadding : padding)),
                            shape, new Size(size, size), this.markerImage, shapeOption, 'img', tooltipContent));
                    }
                    count++;
                }
            }
        }
        groupElement.appendChild(markerGroup);
    }

    private renderTooltipElement(areaBounds: Rect, location: TooltipLocation, splitIndex: number): Side {
        const tooltipDiv: HTMLDivElement = <HTMLDivElement>getElement(this.element.id);
        const arrowLocation: TooltipLocation = new TooltipLocation(0, 0);
        const tipLocation: TooltipLocation = new TooltipLocation(0, 0);
        const svgObject: Element = getElement(this.element.id + '_svg');
        const groupElement: Element = getElement(this.split ? this.element.id + '_group_' + splitIndex : this.element.id + '_group');
        const pathElement: Element = getElement(this.split ? this.element.id + '_path_' + splitIndex : this.element.id + '_path');
        let rect: Rect;
        let isConnectorLineNeeded: boolean;
        let isTop: boolean = false; let isLeft: boolean = false;
        let isBottom: boolean = false; let x: number = 0; let y: number = 0;
        let tooltipOverflow: boolean;
        if (!isNullOrUndefined(groupElement)) {
            if (this.header !== '' && this.showHeaderLine) {
                this.elementSize.height += this.marginY;
            }
            if (this.split) {
                const splitResult: { rect: Rect, tooltipOverflow: boolean, isLeft: boolean, isConnectorLineNeeded: boolean } =
                    this.handleSplitPosition(splitIndex, groupElement, areaBounds, arrowLocation, tipLocation);
                rect = splitResult.rect;
                tooltipOverflow = splitResult.tooltipOverflow;
                isConnectorLineNeeded = splitResult.isConnectorLineNeeded;
                isLeft = splitResult.isLeft;
            }
            else if (this.isFixed) {
                const width: number = this.elementSize.width + (2 * this.marginX);
                const height: number = this.elementSize.height + (2 * this.marginY);
                rect = new Rect(location.x, location.y, width, height);
            }
            else if (this.content.length > 1 || this.followPointer) {
                rect = this.sharedTooltipLocation(areaBounds, this.location.x, this.location.y);
                isTop = true;
            } else {
                rect = this.tooltipLocation(areaBounds, location, arrowLocation, tipLocation);
                if (!this.inverted) {
                    isTop = (rect.y < (location.y + this.clipBounds.y));
                    isBottom = !isTop;
                    y = (isTop ? 0 : this.arrowPadding);
                } else {
                    isLeft = (rect.x < (location.x + this.clipBounds.x));
                    x = (isLeft ? 0 : this.arrowPadding);
                    if (this.allowHighlight) {
                        rect.x += isLeft ? this.highlightPadding : -(2 * this.highlightPadding);
                    }
                }
            }
            if (this.header !== '' && this.showHeaderLine && !this.split) {
                let wrapPadding: number = 2;
                let padding: number = 0;
                const wrapHeader: string = this.isWrap ? this.wrappedText : this.header;
                if (this.isWrap && typeof (wrapHeader) === 'string' && (wrapHeader.indexOf('<') > -1 || wrapHeader.indexOf('>') > -1)) {
                    const textArray: string[] = wrapHeader.split('<br>');
                    wrapPadding = textArray.length;
                }
                if (this.header.indexOf('<br') > -1) {
                    padding = 5 * (this.header.split(/<br.*?>/g).length - 1);
                }
                const key: string = 'properties';
                const font: TextStyle = <TextStyle>extend({}, this.textStyle, null, true)[key as string];
                const headerSize: number = measureText(this.isWrap ? this.wrappedText : this.header, font, this.themeStyle.textStyle).height
                 + (this.marginY * wrapPadding) + (isBottom ? this.arrowPadding : 0) + (this.isWrap ? 5 : padding); //header padding;
                const xLength: number = (this.marginX * 3) + (!isLeft && !isTop && !isBottom ? this.arrowPadding : 0);
                const direction: string = 'M ' + xLength + ' ' + headerSize +
                    'L ' + (rect.width + (!isLeft && !isTop && !isBottom ? this.arrowPadding : 0) - (this.marginX * 2)) +
                    ' ' + headerSize;
                const pathElement: Element = this.renderer.drawPath({
                    'id': this.element.id + '_header_path', 'stroke-width': 1,
                    'fill': null, 'opacity': this.theme === 'Material3' ||  this.theme === 'Material3Dark' ? 0.2 : 0.8, 'stroke': this.themeStyle.tooltipHeaderLine, 'd': direction
                });
                groupElement.appendChild(pathElement);
            }

            const start: number = this.border.width / 2;
            const pointRect: Rect = new Rect(start + x, start + y, rect.width - start, rect.height - start);

            groupElement.setAttribute('opacity', this.split && tooltipOverflow ? '0' : '1');
            if (this.enableAnimation && !this.isFirst && !this.crosshair) {
                this.animateTooltipDiv((this.split ? (groupElement as HTMLDivElement) : tooltipDiv), rect);
            } else {
                this.updateDiv((this.split ? (groupElement as HTMLDivElement) : tooltipDiv), rect.x, rect.y);
            }
            // eslint-disable-next-line no-extra-boolean-cast
            svgObject.setAttribute('height', (this.split ? this.areaBounds.height : (rect.height + this.border.width + (!((!this.inverted)) ? 0 : this.arrowPadding) + 5)).toString());
            svgObject.setAttribute('width', (this.split ? this.areaBounds.width : (rect.width + this.border.width + (((!this.inverted)) ? 0 : this.arrowPadding) + 5)).toString());
            svgObject.setAttribute('opacity', '1');
            if (!isNullOrUndefined(this.tooltipPlacement)) {
                isTop = this.tooltipPlacement.indexOf('Top') > -1;
                isBottom = this.tooltipPlacement.indexOf('Bottom') > -1;
                isLeft = this.tooltipPlacement.indexOf('Left') > -1;
            }
            pathElement.setAttribute('d', findDirection(
                this.rx, this.ry, pointRect, arrowLocation,
                isConnectorLineNeeded ? 0 : this.arrowPadding, isTop, isBottom, isLeft, tipLocation.x, tipLocation.y, this.controlName
            ));
            if ((this.enableShadow && this.theme !== 'Bootstrap4') || this.theme.indexOf('Fluent2') > -1) {
                // To fix next chart initial tooltip opacity issue in tab control
                const shadowId: string = this.element.id + '_shadow';
                if (this.theme === 'Tailwind' || this.theme === 'TailwindDark' || this.theme === 'Tailwind3' || this.theme === 'Tailwind3Dark'
                    || this.theme === 'Bootstrap5' || this.theme === 'Bootstrap5Dark') {
                    pathElement.setAttribute('box-shadow', '0px 1px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1)');
                } else {
                    pathElement.setAttribute('filter', Browser.isIE ? '' : 'url(#' + shadowId + ')');
                }
                let shadow: string = '<filter id="' + shadowId + '" height="130%"><feGaussianBlur in="SourceAlpha" stdDeviation="3"/>';
                if (this.theme.indexOf('Fluent2') > -1) {
                    shadow += '<feOffset dx="-1" dy="3.6" result="offsetblur"/><feComponentTransfer><feFuncA type="linear" slope="0.2"/>';
                } else {
                    shadow += '<feOffset dx="3" dy="3" result="offsetblur"/><feComponentTransfer><feFuncA type="linear" slope="0.5"/>';
                }
                shadow += '</feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>';

                const defElement: Element = this.renderer.createDefs();
                defElement.setAttribute('id', this.element.id + 'SVG_tooltip_definition');
                groupElement.appendChild(defElement);

                defElement.innerHTML = shadow;
            }

            const borderColor: string = ((this.theme === 'Fabric' || this.theme === 'Fluent' || this.theme === 'Fluent2') && ! this.border.color ) ? '#D2D0CE' : this.theme === 'Fluent2HighContrast' ? '#FFFFFF' : this.border.color ;
            pathElement.setAttribute('stroke', borderColor);
            if (!isNullOrUndefined(this.border.dashArray)) {
                pathElement.setAttribute('stroke-dasharray', this.border.dashArray);
            }

            this.changeText(new TooltipLocation(x, y), isBottom, !isLeft && !isTop && !isBottom, splitIndex);

            if (this.revert) {
                this.inverted = !this.inverted;
                this.revert = false;
            }
        }

        return new Side(isBottom, !isLeft && !isTop && !isBottom);

    }


    private changeText(point: TooltipLocation, isBottom: boolean, isRight: boolean, splitIndex: number): void {

        const element: HTMLElement = document.getElementById(this.split ? this.element.id + '_text_' + splitIndex : this.element.id + '_text');

        if (isBottom) {
            element.setAttribute('transform', 'translate(0,' + this.arrowPadding + ')');
        }
        if (isRight) {
            element.setAttribute('transform', 'translate(' + this.arrowPadding + ' 0)');
        }
    }

    private findFormattedText(splitIndex: number): void {
        this.formattedText = [];
        if (this.header.replace(/<b>/g, '').replace(/<\/b>/g, '').trim() !== '' && !this.split) {
            this.formattedText = this.formattedText.concat(this.header);
        }
        this.formattedText = this.formattedText.concat(this.split ? this.content[splitIndex] : this.content);
    }

    // tslint:disable-next-line:max-func-body-length
    private renderText(isRender: boolean, splitIndex?: number): void {
        let height: number = 0; let width: number = 0; // Padding for text;
        let subWidth: number = 0; let lines: string[];
        const key: string = 'properties';
        const font: TextStyle = <TextStyle>extend({}, this.textStyle, null, true)[key as string];
        const groupElement: Element = getElement(this.split ? this.element.id + '_group_' + splitIndex : this.element.id + '_group');
        let tspanElement: HTMLElement; let textCollection: string[];
        let tspanStyle: string = ''; let line: string; let tspanOption: Object;
        this.findFormattedText(splitIndex);
        this.isWrap = false;
        const isRtlEnabled: boolean = document.body.getAttribute('dir') === 'rtl';
        const anchor: string = isRtlEnabled && !this.enableRTL ? 'end' : 'start';
        this.leftSpace = this.areaBounds.x + this.location.x;
        this.rightSpace = (this.areaBounds.x + this.areaBounds.width) - this.leftSpace;
        const headerContent: string = this.split ? '' : this.header.replace(/<b>/g, '').replace(/<\/b>/g, '').trim();
        const isBoldTag: boolean = this.header.indexOf('<b>') > -1 && this.header.indexOf('</b>') > -1;
        const headerWidth: number = measureText(this.formattedText[0], font, this.themeStyle.textStyle).width
            + (2 * this.marginX) + this.arrowPadding;
        const isLeftSpace: boolean = (this.location.x - headerWidth) < this.location.x;
        const isRightSpace: boolean = (this.areaBounds.x + this.areaBounds.width) < (this.location.x + headerWidth); let header: string;
        let headerSpace: number = (headerContent !== '' && this.showHeaderLine) ? this.marginY : 0;
        let isRow: boolean = true; let isColumn: boolean = true; this.markerPoint = [];
        const markerSize: number = (this.shapes.length > 0) ? 10 : 0;
        const markerPadding: number = (this.shapes.length > 0) ? 5 : 0;
        const spaceWidth: number = 4; let subStringLength: number;
        const fontSize: string = '12px'; let fontWeight: string = '400'; let labelColor: string = this.themeStyle.tooltipLightLabel;
        const dy: number = (22 / parseFloat(fontSize)) * (parseFloat(font.size || this.themeStyle.textStyle.size));
        const contentWidth: number[] = [];
        let textHeight: number = 0;
        if (!isRender || this.isCanvas) {
            removeElement(this.split ? this.element.id + '_text_' + splitIndex : this.element.id + '_text');
            removeElement(this.element.id + '_header_path');
            removeElement(this.split ? this.element.id + '_trackball_group_' + splitIndex : this.element.id + '_trackball_group');
            removeElement(this.element.id + 'SVG_tooltip_definition');
        }
        // Condition to resolve the text size issue only in chart.
        if (this.controlName === 'Chart' && parseFloat(fontSize) < parseFloat(font.size || this.themeStyle.textStyle.headerTextSize)) {
            textHeight = (parseFloat(font.size || this.themeStyle.textStyle.size) - parseFloat(fontSize));
        }
        const options: TextOption = new TextOption(
            this.split ? this.element.id + '_text_' + splitIndex : this.element.id + '_text', this.marginX * 2, (textHeight + this.marginY * 2 + this.padding * 2 + (this.marginY === 2 ? this.controlName === 'RangeNavigator' ? 5 : 3 : 0)),
            anchor, ''
        );
        const parentElement: Element = textElement(options, font, font.color || this.themeStyle.tooltipBoldLabel,
                                                   groupElement, this.themeStyle.textStyle);
        const withoutHeader: boolean = this.formattedText.length === 1 && this.formattedText[0].indexOf(' : <b>') > -1;
        const isHeader: boolean = this.split ? false : this.header !== '';
        const size: number = isHeader && isBoldTag ? 16 : 13;
        for (let k: number = 0, pointsLength: number = this.formattedText.length; k < pointsLength; k++) {
            textCollection = this.formattedText[k as number].replace(/<(b|strong)>/g, '<b>')
                .replace(/<\/(b|strong)>/g, '</b>')
                .split(/<br.*?>/g);
            if (this.isTextWrap && this.header !== this.formattedText[k as number] && this.formattedText[k as number].indexOf('<br') === -1) {
                subStringLength = Math.round(this.leftSpace > this.rightSpace ? (this.leftSpace / size) : (this.rightSpace / size));
                textCollection = this.formattedText[k as number].match(new RegExp('.{1,' + subStringLength + '}', 'g'));
            }
            if (k === 0 && !withoutHeader && this.isTextWrap &&
                (this.leftSpace < headerWidth || isLeftSpace) &&
                (this.rightSpace < headerWidth || isRightSpace)
            ) {
                subStringLength = Math.round(this.leftSpace > this.rightSpace ? (this.leftSpace / size) : (this.rightSpace / size));
                header = headerContent !== '' ? headerContent : this.formattedText[k as number];
                textCollection = header.match(new RegExp('.{1,' + subStringLength + '}', 'g'));
                this.wrappedText = isBoldTag ? '<b>' + textCollection.join('<br>') + '</b>' : textCollection.join('<br>');
                this.isWrap = textCollection.length > 1;
            }
            if (textCollection[0] === '') {
                continue;
            }
            if ((k !== 0) || (headerContent === '')) {
                this.markerPoint.push(((headerContent !== '' && this.showHeaderLine) ? (this.marginY) : 0) + options.y + height - (textHeight !== 0 ? ((textHeight / this.markerSize) * (parseFloat(font.size || this.themeStyle.textStyle.headerTextSize) / this.markerSize)) : 0));
            }
            for (let i: number = 0, len: number = textCollection.length; i < len; i++) { // string value of unicode for LTR is \u200E
                lines = textCollection[i as number].replace(/<b>/g, '<br><b>').replace(/<\/b>/g, '</b><br>').replace(/:/g, (this.enableRTL) ? '<br>\u200E: <br>' : '<br>\u200E:<br>')
                    .split('<br>');
                if (this.enableRTL && lines.length > 0) {
                    const colonMatches: RegExpMatchArray | null = textCollection[i as number].match(/:/g);
                    const colonCount: number = colonMatches ? colonMatches.length : 0;
                    const shouldReverse: boolean = colonCount > 0 &&
                        (this.controlName === 'Sankey' ? colonCount === 1 : true);
                    if (shouldReverse) {
                        lines[0] = lines[0].trim();
                        lines.reverse();
                    }
                }
                subWidth = 0;
                isColumn = true;
                height += dy;
                for (let j: number = 0, len: number = lines.length; j < len; j++) {
                    line = lines[j as number];
                    if (this.enableRTL && line !== '' && this.isRTLText(line)) {
                        line = line.concat('\u200E');
                    }
                    if (!/\S/.test(line) && line !== '') {
                        line = ' ';  //to trim multiple white spaces to single white space
                    }
                    if ((!isColumn && line === ' ') || (line.replace(/<b>/g, '').replace(/<\/b>/g, '').trim() !== '')) {
                        subWidth += line !== ' ' ? spaceWidth : 0;
                        if (isColumn && !isRow) {
                            if (this.header.indexOf('<br') > -1 && k !== 0) {
                                headerSpace += this.header.split(/<br.*?>/g).length;
                            }
                            tspanOption = {
                                x: (this.marginX * 2) + (markerSize + markerPadding),
                                dy: dy + ((isColumn) ? headerSpace : 0), fill: ''
                            };
                            headerSpace = null;
                        } else {
                            if (isRow && isColumn) {
                                tspanOption = {
                                    x: (headerContent === '') ? ((this.marginX * 2) + (markerSize + markerPadding))
                                        : (this.marginX * 2) + (this.isWrap ? (markerSize + markerPadding) : 0)
                                };
                            } else {
                                tspanOption = {};
                            }
                        }
                        isColumn = false;
                        tspanElement = <HTMLElement>this.renderer.createTSpan(tspanOption, '');
                        parentElement.appendChild(tspanElement);
                        if (line.indexOf('<b>') > -1 || ((isBoldTag && j === 0 && k === 0) && (isHeader || this.isWrap))) {
                            fontWeight = '600'; labelColor = this.themeStyle.tooltipBoldLabel;
                            tspanStyle = 'font-weight:' + fontWeight; font.fontWeight = fontWeight;
                            (tspanElement).setAttribute('fill', this.textStyle.color || labelColor);
                        } else {
                            tspanStyle = fontWeight === '600' ? 'font-weight:' + fontWeight : '';
                            font.fontWeight = fontWeight;
                            (tspanElement).setAttribute('fill', this.textStyle.color || labelColor);
                        }
                        if (line.indexOf('</b>') > -1 || ((isBoldTag && j === len - 1 && k === 0) && (isHeader || this.isWrap))) {
                            fontWeight = 'Normal'; labelColor = this.themeStyle.tooltipLightLabel;
                        }
                        // eslint-disable-next-line no-useless-escape
                        if (tspanStyle !== '') {
                            tspanElement.style.fontWeight = tspanStyle.split('font-weight:')[1];
                            tspanElement.style.color = tspanElement.getAttribute('fill');
                        }
                        // 'inherit' will apply css style from parent element.
                        tspanElement.style.fontFamily = 'inherit';
                        tspanElement.style.fontStyle = 'inherit';
                        tspanElement.style.fontSize = (this.header === this.formattedText[k]) ?  font.size || this.themeStyle.textStyle.headerTextSize : (line.indexOf('<b>') > -1 || line.indexOf('</b>') > -1) ? font.size || this.themeStyle.textStyle.boldTextSize : font.size || this.themeStyle.textStyle.size;
                        tspanElement.style.fontWeight = (this.header === this.formattedText[k] && (this.header.indexOf('<b>') === -1 || this.header.indexOf('</b>') === -1)) ? (this.textStyle.fontWeight || (this.theme.indexOf('Tailwind3') > -1 ? '500' : '600')) : line.indexOf('<b>') > -1 || line.indexOf('</b>') > -1 ? (this.theme.indexOf('Bootstrap5') > -1) ? (this.textStyle.fontWeight || '600') : 'bold' : ((line.indexOf('<b>') === -1 || line.indexOf('</b>') === -1) && (this.theme.indexOf('Bootstrap5') > -1 || this.theme.indexOf('Tailwind3') > -1)) ? this.textStyle.fontWeight || (this.theme.indexOf('Tailwind3') > -1 ? '500' : '600') : (this.textStyle.fontWeight || font.fontWeight);
                        const textFont: TextStyle = <TextStyle>extend({}, this.textStyle, null, true)[key as string];
                        textFont.fontWeight = tspanElement.style.fontWeight;
                        textFont.size = tspanElement.style.fontSize;
                        isRow = false;
                        (tspanElement).textContent = line = this.getTooltipTextContent(line);
                        subWidth += measureText(line, textFont, this.themeStyle.textStyle).width;
                    }
                }
                subWidth -= spaceWidth;
                width = Math.max(width, subWidth);
                contentWidth.push(subWidth);
            }
        }
        this.elementSize = new Size(width + (width > 0 ? (2 * this.marginX) : 0), height);
        this.elementSize.width += (markerSize + markerPadding); // marker size + marker Spacing
        const element: HTMLElement = <HTMLElement>(parentElement.childNodes[0]);
        if (headerContent !== '' && element && !this.isWrap) {
            font.fontWeight = '600';
            const width: number = (this.elementSize.width + (2 * this.padding)) / 2 - measureText(headerContent, font,
                                                                                                  this.themeStyle.textStyle, true).width
                                                                                                         / 2;
            element.setAttribute('x', width.toString());
        }
        this.renderContentRTL(parentElement, isHeader, markerSize + markerPadding, contentWidth);
        if (this.split) {
            const padding: number = 20;
            const elementWidth: number = this.elementSize.width + (2 * this.marginX);
            const elementHeight: number = this.elementSize.height + (2 * this.marginY);
            const rect: Rect = new Rect(this.splitLocations[splitIndex as number].x
                + this.splitClipBounds[splitIndex].x + padding, (this.splitLocations[splitIndex as number].y
                    + this.splitClipBounds[splitIndex].y) - elementHeight / 2, elementWidth, elementHeight);
            this.splitTooltipRectCollection.push(rect);
        }
    }

    private renderContentRTL(textElement: Element, isHeader: boolean, markerSize: number, contentWidth: number[]): void {
        if (this.enableRTL) {
            let tspanElement: HTMLElement;
            let contentWidthIndex: number = isHeader ? 1 : 0;
            for (let i: number = 0; i < textElement.childNodes.length; i++) {
                tspanElement = <HTMLElement>(textElement.childNodes[i as number]);
                if ((!isHeader || i > 0) && !isNullOrUndefined(tspanElement.getAttribute('x'))) {
                    tspanElement.setAttribute('x', (this.elementSize.width - (markerSize + contentWidth[contentWidthIndex as number])).toString());
                    contentWidthIndex++;
                }
            }
        }
    }

    private getTooltipTextContent(tooltipText: string): string {
        const characterCollection: string[] = tooltipText.match(/<[a-zA-Z\/](.|\n)*?>/g);
        if (isNullOrUndefined(characterCollection)) {
            return tooltipText;
        }
        const isRtlText: boolean = this.isRTLText(tooltipText);
        for (let i: number = 0; i < characterCollection.length; i++) {
            if (this.isValidHTMLElement(characterCollection[i as number].replace('<', '').replace('/', '').replace('>', '').trim())) {
                tooltipText = tooltipText.replace(characterCollection[i as number], isRtlText ? '\u200E' : '');
            }
        }
        return tooltipText;
    }

    private isValidHTMLElement(element: string): boolean {
        return document.createElement(element).toString() !== '[object HTMLUnknownElement]';
    }

    private isRTLText(tooltipContent: string): boolean {
        return /[\u0590-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(tooltipContent);
    }

    private createTemplate(areaBounds: Rect, location: TooltipLocation, splitIndex?: number): void {
        const argsData: ITooltipRenderingEventArgs = { cancel: false, name: 'tooltipRender', tooltip: this };
        this.trigger('tooltipRender', argsData);
        const parent: HTMLElement = document.getElementById(this.element.id);
        if (this.isCanvas) {
            this.removeSVG();
        }
        if (this.split && !isNullOrUndefined(splitIndex)) {
            parent.setAttribute('opacity', '1');
            parent.style.display = '';
            const splitParentId: string = this.element.id + 'parent_template' + splitIndex;
            const splitParentElem: HTMLElement = document.getElementById(splitParentId) as HTMLElement;
            if (splitParentElem) {
                remove(splitParentElem);
            }
        } else {
            const firstElement: HTMLElement = !isNullOrUndefined(parent) ? (parent.firstElementChild as HTMLElement) : null;
            if (firstElement) {
                remove(firstElement);
            }
        }
        if (!argsData.cancel) {
            const elem: Element = createElement('div', { id: this.split ? this.element.id + 'parent_template' + splitIndex : this.element.id + 'parent_template' });
            let templateElement: HTMLCollection;
            if (this.controlName === 'Chart' && this.shared) {
                for (let i: number = 0; i < (this.data as Object[]).length; i++) {
                    const sharedTemplateElement: HTMLCollection = this.templateFn(this.data[i], this.controlInstance, elem.id, elem.id + '_blazorTemplate', '');
                    if (i === 0) {
                        templateElement = sharedTemplateElement;
                    }
                    else {
                        if (sharedTemplateElement.length > 1) {
                            templateElement[i].outerHTML = sharedTemplateElement[i].outerHTML || sharedTemplateElement[i].textContent;
                        }
                        else {
                            templateElement[templateElement.length - 1].outerHTML += sharedTemplateElement[0].outerHTML;
                        }
                    }
                }
            }
            else {
                templateElement = this.templateFn(this.split ? (this.data as Object[])[splitIndex] : this.data, this.controlInstance, elem.id, elem.id + '_blazorTemplate', '');
            }
            while (templateElement && templateElement.length > 0) {
                if (isBlazor() || templateElement.length === 1) {
                    elem.appendChild(templateElement[0]);
                    templateElement = null;
                } else {
                    elem.appendChild(templateElement[0]);
                }
            }
            if (!isNullOrUndefined(parent)) {
                parent.appendChild(elem);
            }
            const element: Element = this.split || this.isCanvas ? elem : this.element;
            const rect: ClientRect = element.getBoundingClientRect();
            this.padding = 0;
            this.elementSize = new Size(rect.width, rect.height);
            let tooltipRect: Rect;
            if (this.split && !isNullOrUndefined(splitIndex)) {
                const padding: number = 20;
                const elementWidth: number = this.elementSize.width + (2 * this.marginX);
                const elementHeight: number = this.elementSize.height + (2 * this.marginY);
                const rect: Rect = new Rect(this.splitLocations[splitIndex as number].x
                    + this.splitClipBounds[splitIndex].x + padding, (this.splitLocations[splitIndex as number].y
                        + this.splitClipBounds[splitIndex].y) - elementHeight / 2, elementWidth, elementHeight);
                tooltipRect = rect;
            }
            else {
                tooltipRect = this.shared ? this.sharedTooltipLocation(areaBounds, this.location.x, this.location.y)
                    : this.tooltipLocation(areaBounds, location, new TooltipLocation(0, 0), new TooltipLocation(0, 0));
            }
            if (this.enableAnimation && !this.isFirst && !this.crosshair) {
                this.animateTooltipDiv(<HTMLDivElement>this.element, tooltipRect);
            } else {
                this.updateDiv(<HTMLDivElement>element, tooltipRect.x, tooltipRect.y);
            }
            if (this.blazorTemplate) {
                //Customer issue - F149037  Call back function to handle the blazor tooltip alignment issues
                const tooltipRendered: Function = () => {
                    const rect1: ClientRect = getElement(thisObject.element.id).getBoundingClientRect();
                    thisObject.elementSize = new Size(rect1.width, rect1.height);
                    const tooltipRect1: Rect = thisObject.tooltipLocation(
                        areaBounds, location, new TooltipLocation(0, 0), new TooltipLocation(0, 0));
                    thisObject.updateDiv(getElement(thisObject.element.id) as HTMLDivElement, tooltipRect1.x, tooltipRect1.y);
                };
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                const thisObject: Tooltip = this;
                tooltipRendered.bind(thisObject, areaBounds, location);
                updateBlazorTemplate(
                    this.element.id + 'parent_template' + '_blazorTemplate', this.blazorTemplate.name,
                    this.blazorTemplate.parent, undefined, tooltipRendered);
            }
        } else {
            remove(getElement(this.element.id + '_tooltip'));
        }
    }

    private sharedTooltipLocation(bounds: Rect, x: number, y: number): Rect {
        const width: number = this.elementSize.width + (2 * this.marginX);
        const height: number = this.elementSize.height + (2 * this.marginY);
        const pointerTooltipRect: Rect = new Rect((this.shared || this.inverted)
            ? (x + 2 * this.padding) : (x - width / 2), (this.shared || this.inverted) ? (y - height / 2)
            : (y - (height + this.padding)), width, height);
        const tooltipRect: Rect = this.followPointer ? pointerTooltipRect : new Rect(x + 2 * this.padding
            , y - height - this.padding, width, height);
        if (tooltipRect.y < bounds.y) {
            tooltipRect.y += (tooltipRect.height + 2 * this.padding);
        }
        if (tooltipRect.y + tooltipRect.height > bounds.y + bounds.height){
            tooltipRect.y = Math.max((bounds.y + bounds.height) - (tooltipRect.height + 2 * this.padding), bounds.y);
        }
        if (tooltipRect.x + tooltipRect.width > bounds.x + bounds.width) {
            tooltipRect.x = (bounds.x + this.location.x) - (tooltipRect.width + 4 * this.padding);
        }
        if (tooltipRect.x < bounds.x) {
            tooltipRect.x = bounds.x;
        }
        return tooltipRect;
    }
    /** @private */
    public getCurrentPosition(
        bounds: Rect, symbolLocation: TooltipLocation, arrowLocation: TooltipLocation,
        tipLocation: TooltipLocation): Rect {
        const position: TooltipPlacement = this.tooltipPlacement;
        const clipX: number = this.clipBounds.x;
        const clipY: number = this.clipBounds.y;
        const markerHeight: number = this.offset;
        const width: number = this.elementSize.width + (2 * this.marginX);
        const height: number = this.elementSize.height + (2 * this.marginY);
        let location: TooltipLocation = new TooltipLocation(symbolLocation.x, symbolLocation.y);
        if (position === 'Top' || position === 'Bottom') {
            location = new TooltipLocation(
                location.x + clipX - this.elementSize.width / 2 - this.padding,
                location.y + clipY - this.elementSize.height - (2 * this.padding) - this.arrowPadding - markerHeight
            );
            arrowLocation.x = tipLocation.x = width / 2;
            if (position === 'Bottom') {
                location.y = symbolLocation.y + clipY + markerHeight;
            }
            if (bounds.x + bounds.width < location.x + width) {
                location.x = (bounds.width > width) ? ((bounds.x + bounds.width) - width + 6) : bounds.x;
                arrowLocation.x = tipLocation.x = (bounds.width > width) ? (bounds.x + symbolLocation.x - location.x) : symbolLocation.x;
            } else if (bounds.x > location.x) {
                location.x = bounds.x;
                arrowLocation.x = tipLocation.x = symbolLocation.x;
            }
        } else {
            location = new TooltipLocation(
                location.x + clipX + markerHeight,
                location.y + clipY - this.elementSize.height / 2 - (this.padding)
            );
            arrowLocation.y = tipLocation.y = height / 2;
            if (position === 'Left') {
                location.x = symbolLocation.x + clipX - markerHeight - (width + this.arrowPadding);
            }
            if (bounds.y + bounds.height < location.y + height) {
                location.y = (bounds.height > height) ? ((bounds.y + bounds.height) - height + 6) : bounds.y;
                arrowLocation.y = tipLocation.y = (bounds.height > height) ? (bounds.y + symbolLocation.y - location.y) : symbolLocation.y;
            } else if (bounds.y > location.y) {
                location.y = bounds.y;
                arrowLocation.y = tipLocation.y = symbolLocation.y;
            }
        }
        return new Rect(location.x, location.y, width, height);
    }
    // tslint:disable-next-line:max-func-body-length
    /** @private */
    public tooltipLocation(
        bounds: Rect, symbolLocation: TooltipLocation, arrowLocation: TooltipLocation,
        tipLocation: TooltipLocation): Rect {
        if (!isNullOrUndefined(this.tooltipPlacement)) {
            const tooltipRect: Rect = this.getCurrentPosition(bounds, symbolLocation, arrowLocation, tipLocation);
            return tooltipRect;
        }
        let location: TooltipLocation = new TooltipLocation(symbolLocation.x, symbolLocation.y);
        const width: number = this.elementSize.width + (2 * this.marginX);
        const height: number = this.elementSize.height + (2 * this.marginY);

        const markerHeight: number = this.offset;

        const clipX: number = this.clipBounds.x;
        const clipY: number = this.clipBounds.y;
        const clipWidth: number = (this.clipBounds as Rect).width;
        const clipHeight: number = (this.clipBounds as Rect).height;
        const boundsX: number = bounds.x;
        const boundsY: number = bounds.y;
        this.outOfBounds = false;
        if (!this.inverted) {
            location = new TooltipLocation(
                location.x + clipX - this.elementSize.width / 2 - this.padding,
                location.y + clipY - this.elementSize.height - (2 * (this.allowHighlight ? this.highlightPadding : this.padding)) -
                    this.arrowPadding - markerHeight
            );
            arrowLocation.x = tipLocation.x = width / 2;
            if ((location.y < boundsY || (this.isNegative)) && !(this.controlName === 'Progressbar')) {
                location.y = (symbolLocation.y < 0 ? 0 : symbolLocation.y) + clipY + markerHeight;
            }
            if (location.y + height + this.arrowPadding > boundsY + bounds.height) {
                location.y = Math.min(symbolLocation.y, boundsY + bounds.height) + clipY
                    - this.elementSize.height - (2 * this.padding) - this.arrowPadding - markerHeight;
            }
            if (((location.x + width > boundsX + bounds.width) && location.y < boundsY || (this.isNegative)) && !(this.controlName === 'Progressbar')) {
                location.y = (symbolLocation.y < 0 ? 0 : symbolLocation.y) + clipY + markerHeight;
            }
            tipLocation.x = width / 2;
            if (location.x < boundsX && !(this.controlName === 'Progressbar')) {
                arrowLocation.x -= (boundsX - location.x);
                tipLocation.x -= (boundsX - location.x);
                location.x = boundsX;
            }
            if (location.x + width > boundsX + bounds.width && !(this.controlName === 'Progressbar')) {
                arrowLocation.x += ((location.x + width) - (boundsX + bounds.width));
                tipLocation.x += ((location.x + width) - (boundsX + bounds.width));
                location.x -= ((location.x + width) - (boundsX + bounds.width));
            }
            if (location.x < boundsX && !(this.controlName === 'Progressbar')) {
                arrowLocation.x -= (boundsX - location.x);
                tipLocation.x -= (boundsX - location.x);
                location.x = boundsX;
            }
            if (arrowLocation.x + this.arrowPadding > width - this.rx) {
                arrowLocation.x = width - this.rx - this.arrowPadding;
                tipLocation.x = width - this.rx - this.arrowPadding;
            }
            if (arrowLocation.x - this.arrowPadding < this.rx) {
                arrowLocation.x = tipLocation.x = this.rx + this.arrowPadding;
            }

            if (this.controlName === 'Chart') {
                if (((bounds.x + bounds.width) - (location.x + arrowLocation.x)) < this.areaMargin + this.arrowPadding ||
                 (location.x + arrowLocation.x) < this.areaMargin + this.arrowPadding) {
                    this.outOfBounds = true;
                }
                if (this.template && (location.y < 0)) {
                    location.y = symbolLocation.y + clipY + markerHeight;
                }
                if (!withInAreaBounds(location.x, location.y, bounds) || this.outOfBounds ) {
                    this.inverted = !this.inverted;
                    this.revert = true;
                    location = new TooltipLocation(
                        symbolLocation.x + markerHeight + clipX,
                        symbolLocation.y + clipY - this.elementSize.height / 2 - (this.padding)
                    );
                    tipLocation.x = arrowLocation.x = 0;
                    tipLocation.y = arrowLocation.y = height / 2;
                    if ((location.x + this.arrowPadding + width > boundsX + bounds.width) || (this.isNegative)) {
                        location.x = (symbolLocation.x > boundsX + bounds.width ? bounds.width : symbolLocation.x)
                            + clipX - markerHeight - (this.arrowPadding + width);
                    }
                    if (location.x < boundsX) {
                        location.x = (symbolLocation.x < 0 ? 0 : symbolLocation.x) + markerHeight + clipX;
                    }
                    if (location.y <= boundsY) {
                        tipLocation.y -= (boundsY - location.y);
                        arrowLocation.y -= (boundsY - location.y);
                        location.y = boundsY;
                    }
                    if (location.y + height >= bounds.height + boundsY) {
                        arrowLocation.y += ((location.y + height) - (bounds.height + boundsY));
                        tipLocation.y += ((location.y + height) - (bounds.height + boundsY));
                        location.y -= ((location.y + height) - (bounds.height + boundsY));
                    }
                    if ((this.arrowPadding) + arrowLocation.y > height - this.ry) {
                        arrowLocation.y = height - this.arrowPadding - this.ry;
                        tipLocation.y = height;
                    }
                    if (arrowLocation.y - this.arrowPadding < this.ry) {
                        arrowLocation.y = (this.arrowPadding) + this.ry;
                        tipLocation.y = 0;
                    }
                }
            }

        } else {
            location = new TooltipLocation(
                location.x + clipX + markerHeight,
                location.y + clipY - this.elementSize.height / 2 - (this.padding)
            );
            arrowLocation.y = tipLocation.y = height / 2;
            if ((location.x + width + this.arrowPadding > boundsX + bounds.width) || (this.isNegative)) {
                location.x = (symbolLocation.x > bounds.width + bounds.x ? bounds.width : symbolLocation.x)
                    + clipX - markerHeight - (width + this.arrowPadding);
            }
            if (symbolLocation.x > clipWidth) {
                location.x = clipWidth + clipX - (width + this.arrowPadding);
            }
            if (location.x < boundsX) {
                location.x = (symbolLocation.x < 0 ? 0 : symbolLocation.x) + clipX + markerHeight;
            }
            if ((location.x + width + this.arrowPadding > boundsX + bounds.width)) {
                location.x = (symbolLocation.x > bounds.width + bounds.x ? bounds.width : symbolLocation.x)
                    + clipX - markerHeight - (width + this.arrowPadding);
            }
            if (location.y <= boundsY) {
                arrowLocation.y -= (boundsY - location.y);
                tipLocation.y -= (boundsY - location.y);
                location.y = boundsY;
            }
            if (location.y + height >= boundsY + bounds.height) {
                arrowLocation.y += ((location.y + height) - (boundsY + bounds.height));
                tipLocation.y += ((location.y + height) - (boundsY + bounds.height));
                location.y -= ((location.y + height) - (boundsY + bounds.height));
            }
            if (location.x + width >= boundsX + bounds.width && this.controlName === 'Chart') {
                arrowLocation.x += ((location.x + width) - (boundsX + bounds.width));
                tipLocation.x += ((location.x + width) - (boundsX + bounds.width));
                location.x -= ((location.x + width) - (boundsX + bounds.width));
                location.x = location.x - this.arrowPadding - this.padding;
            }
            if (arrowLocation.y + this.arrowPadding > height - this.ry) {
                arrowLocation.y = height - this.ry - this.arrowPadding;
                tipLocation.y = height;
            }
            if (arrowLocation.y - this.arrowPadding < this.ry) {
                arrowLocation.y = tipLocation.y = this.ry + this.arrowPadding;
            }

            if (this.controlName === 'Chart') {
                if ((location.y + arrowLocation.y) < this.areaMargin + this.arrowPadding ||
                    ((bounds.y + bounds.height) - (location.y + arrowLocation.y)) < this.areaMargin + this.arrowPadding) {
                    this.outOfBounds = true;
                }

                if (!withInAreaBounds(location.x, location.y, bounds) || this.outOfBounds) {
                    this.inverted = !this.inverted;
                    location = new TooltipLocation(
                        symbolLocation.x + clipX - this.padding - this.elementSize.width / 2,
                        symbolLocation.y + clipY - this.elementSize.height - (2 * this.padding) - markerHeight - this.arrowPadding
                    );
                    this.revert = true;
                    tipLocation.x = arrowLocation.x = width / 2;
                    tipLocation.y = arrowLocation.y = 0;
                    if (location.y < boundsY || (this.isNegative)) {
                        location.y = (symbolLocation.y < 0 ? 0 : symbolLocation.y) + markerHeight + clipY;
                    }
                    if (location.y + this.arrowPadding + height > boundsY + bounds.height) {
                        location.y = Math.min(symbolLocation.y, boundsY + bounds.height) + clipY
                            - this.elementSize.height - (2 * this.padding) - markerHeight - this.arrowPadding;
                    }
                    tipLocation.x = width / 2;
                    if (location.x < boundsX) {
                        tipLocation.x -= (boundsX - location.x);
                        arrowLocation.x -= (boundsX - location.x);
                        location.x = boundsX;
                    }
                    if (location.x + width > bounds.width + boundsX) {
                        arrowLocation.x += ((location.x + width) - (bounds.width + boundsX));
                        tipLocation.x += ((location.x + width) - (bounds.width + boundsX));
                        location.x -= ((location.x + width) - (bounds.width + boundsX));
                    }
                    if ((this.arrowPadding) + arrowLocation.x > width - this.rx) {
                        tipLocation.x = width - this.rx - (this.arrowPadding);
                        arrowLocation.x = width - this.rx - (this.arrowPadding);
                    }
                    if (arrowLocation.x - (this.arrowPadding) < this.rx) {
                        arrowLocation.x = tipLocation.x = this.rx + (this.arrowPadding);
                    }
                }
            }
            if (this.enableRTL && this.controlName === 'Sankey') {
                const relativeX: number = location.x - boundsX;
                const mirroredRelativeX: number = bounds.width - relativeX - (this.elementSize.width + (2 * this.marginX));
                location.x = boundsX + mirroredRelativeX;
            }
        }
        return new Rect(location.x, location.y, width, height);
    }
    private animateTooltipDiv(tooltipDiv: HTMLDivElement, rect: Rect): void {
        let x: number = parseFloat(tooltipDiv.style.left);
        let y: number = parseFloat(tooltipDiv.style.top);
        const duration: number = (this.duration === 0 && animationMode === 'Enable') ? 300 : this.duration;
        if ((this.controlName === 'Chart' && (this.shared || this.split)) && !this.enableRTL) {
            const transformValues: string[] = (this.split ? tooltipDiv : this.element).style.transform.split(/[(),\s]+/);
            x = parseFloat(transformValues[1]);
            y = parseFloat(transformValues[2]);
            tooltipDiv.style.transition = 'transform ' + duration + 'ms ease';
        } else if (this.controlName === 'Sankey' && this.enableRTL) {
            const width: number = this.elementSize.width + (2 * this.marginX);
            const containerWidth: number = (this.availableSize && this.availableSize.width) ?
                this.availableSize.width : (this.areaBounds.x + this.areaBounds.width);
            const targetRight: number = containerWidth - (rect.x + width);

            // Ensure positioning is anchored only by 'right' in RTL
            tooltipDiv.style.left = '';
            tooltipDiv.style.transform = '';

            tooltipDiv.style.transition = `right ${duration}ms ease, top ${duration}ms ease`;
            tooltipDiv.style.right = `${targetRight}px`;
            tooltipDiv.style.top = `${rect.y}px`;

            new Animation({}).animate(tooltipDiv, {
                duration: duration,
                progress: (): void => { /* CSS transition handles movement */ },
                end: (): void => {
                    this.updateDiv(tooltipDiv, rect.x, rect.y);
                    this.trigger('animationComplete', { tooltip: this });
                }
            });
            return;
        }
        let currenDiff: number;
        new Animation({}).animate(tooltipDiv, {
            duration: duration,
            progress: (args: AnimationOptions): void => {
                currenDiff = (args.timeStamp / args.duration);
                tooltipDiv.style.animation = null;
                if ((this.controlName === 'Chart' && (this.shared || this.split)) && !this.enableRTL) {
                    tooltipDiv.style.transform = 'translate(' + (x + (rect.x - x)) + 'px,' + (y + rect.y - y) + 'px)';
                    tooltipDiv.style.left = '';
                    tooltipDiv.style.top = '';
                } else if (this.controlName === 'Chart' && this.showNearestTooltip) {
                    tooltipDiv.style.transition = 'left ' + args.duration + 'ms ease-out, top ' + args.duration + 'ms ease-out';
                    tooltipDiv.style.left = rect.x + 'px';
                    tooltipDiv.style.top = rect.y + 'px';
                } else {
                    tooltipDiv.style.left = (x + currenDiff * (rect.x - x)) + 'px';
                    tooltipDiv.style.top = (y + currenDiff * (rect.y - y)) + 'px';
                    tooltipDiv.style.transform = this.controlName === 'RangeNavigator' ? tooltipDiv.style.transform : '';
                }
            },
            end: (model: AnimationOptions): void => {
                this.updateDiv(tooltipDiv, rect.x, rect.y);
                this.trigger('animationComplete', { tooltip: this });
            }
        });
    }

    private updateDiv(tooltipDiv: HTMLDivElement, x: number, y: number): void {
        if ((this.controlName === 'Chart' && ((this.shared && !this.crosshair) || this.split) ) && (!this.enableRTL || this.split)) {
            tooltipDiv.style.transform = 'translate(' + x + 'px,' + y + 'px)';
            tooltipDiv.style.left = '';
            tooltipDiv.style.top = '';
            tooltipDiv.style.right = '';
        } else if (this.controlName === 'Sankey' && this.enableRTL) {
            const width: number = this.elementSize.width + (2 * this.marginX);
            const containerWidth: number = (this.availableSize && this.availableSize.width) ?
                this.availableSize.width : (this.areaBounds.x + this.areaBounds.width);
            const right: number = containerWidth - (x + width);
            tooltipDiv.style.right = right + 'px';
            tooltipDiv.style.left = '';
            tooltipDiv.style.top = y + 'px';
            tooltipDiv.style.transform = '';
        } else {
            tooltipDiv.style.left = x + 'px';
            tooltipDiv.style.top = y + 'px';
            tooltipDiv.style.transform = this.controlName === 'RangeNavigator' ? tooltipDiv.style.transform : '';
            tooltipDiv.style.right = '';
        }
    }


    private updateTemplateFn(): void {
        if (this.template) {
            try {
                if (typeof this.template !== 'function' && document.querySelectorAll(this.template).length) {
                    this.templateFn = templateComplier(document.querySelector(this.template).innerHTML.trim());
                } else {
                    this.templateFn = templateComplier(this.template);
                }
            } catch (e) {
                this.templateFn = templateComplier(this.template);
            }
        }
    }

    /** @private */
    public fadeOut(): void {
        const tooltipElement: HTMLElement = (this.isCanvas && !this.template) ? <HTMLElement>getElement(this.element.id + '_svg') :
            <HTMLElement>getElement(this.element.id);
        const tooltipDiv: HTMLElement = <HTMLElement>getElement(this.element.id);
        if (tooltipElement) {
            let tooltipGroup: HTMLElement = this.split && this.template ? tooltipElement : tooltipElement.firstChild as HTMLElement;
            if (tooltipGroup && tooltipGroup.nodeType !== Node.ELEMENT_NODE) {
                tooltipGroup = tooltipElement.firstElementChild as HTMLElement;
            }
            if (this.isCanvas && !this.template) {
                tooltipGroup = document.getElementById(this.element.id + '_group') ? document.getElementById(this.element.id + '_group') :
                    tooltipGroup;
            }
            if (!tooltipGroup) {
                return null;
            }
            let opacity: number = parseFloat(tooltipGroup.getAttribute('opacity'));
            opacity = !isNullOrUndefined(opacity) ? opacity : 1;
            new Animation({}).animate(tooltipGroup, {
                duration: 200,
                progress: (args: AnimationOptions): void => {
                    //  tooltipGroup.removeAttribute('e-animate');
                    this.progressAnimation(tooltipGroup, opacity, (args.timeStamp / args.duration));
                },
                end: () => {
                    this.fadeOuted = true;
                    this.endAnimation(tooltipGroup);
                    tooltipDiv.style.transition = '';
                }
            });
        }
    }

    private progressAnimation(tooltipGroup: HTMLElement, opacity: number, timeStamp: number): void {
        tooltipGroup.style.animation = '';
        tooltipGroup.setAttribute('opacity', (opacity - timeStamp).toString());
    }
    /*
     * @hidden
     */
    private endAnimation(tooltipGroup: HTMLElement): void {
        tooltipGroup.setAttribute('opacity', '0');
        if (this.template) {
            tooltipGroup.style.display = 'none';
        }
        this.trigger('animationComplete', { tooltip: this });
    }

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @private
     */
    public getPersistData(): string {
        const keyEntity: string[] = [];
        return this.addOnPersist(keyEntity);
    }

    /**
     * Get component name
     *
     *  @private
     */

    public getModuleName(): string {
        return 'tooltip';
    }

    /**
     * To destroy the accumulationcharts
     *
     * @private
     */
    public destroy(): void {
        super.destroy();
        this.element.classList.remove('e-tooltip');
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: TooltipModel, oldProp: TooltipModel): void {
        if (this.blazorTemplate) {
            resetBlazorTemplate(this.element.id + 'parent_template' + '_blazorTemplate');
        }
        this.isFirst = false;
        this.render();
    }

}
