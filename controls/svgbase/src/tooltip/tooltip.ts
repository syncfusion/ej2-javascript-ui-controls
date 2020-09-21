import {  NotifyPropertyChanges, Property, Event, Complex, INotifyPropertyChanged, updateBlazorTemplate } from '@syncfusion/ej2-base';
import {  extend,  compile as templateComplier, Component, resetBlazorTemplate, isBlazor, isNullOrUndefined } from '@syncfusion/ej2-base';
import { SvgRenderer } from '../svg-render/index';
import {  ChildProperty, createElement, EmitType, remove, Browser, AnimationOptions, Animation} from '@syncfusion/ej2-base';
import { TextStyleModel, TooltipBorderModel, TooltipModel, ToolLocationModel, AreaBoundsModel } from './tooltip-model';
import { ITooltipThemeStyle, ITooltipRenderingEventArgs, ITooltipAnimationCompleteArgs, IBlazorTemplate} from './interface';
import { ITooltipLoadedEventArgs, getTooltipThemeColor } from './interface';
import { Size, Rect, Side, measureText, getElement, findDirection, drawSymbol, textElement } from './helper';
import { removeElement, TextOption, TooltipLocation, PathOption } from './helper';
import { TooltipShape, TooltipTheme, TooltipPlacement } from './enum';

/**
 * Configures the fonts in charts.
 * @private
 */

export class TextStyle extends ChildProperty<TextStyle> {

    /**
     * Font size for the text.
     * @default null
     */
    @Property(null)
    public size: string;

    /**
     * Color for the text.
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
     * @default 'Normal'
     */
    @Property('Normal')
    public fontWeight: string;

    /**
     * FontStyle for the text.
     * @default 'Normal'
     */
    @Property('Normal')
    public fontStyle: string;

    /**
     * Opacity for the text.
     * @default 1
     */
    @Property(1)
    public opacity: number;

}

/**
 * Configures the borders in the chart.
 * @private
 */
export class TooltipBorder extends ChildProperty<TooltipBorder> {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     * @default ''
     */
    @Property('')
    public color: string;

    /**
     * The width of the border in pixels.
     * @default 1
     */
    @Property(1)
    public width: number;

}

/**
 * Configures the borders in the chart.
 * @private
 */
export class AreaBounds extends ChildProperty<AreaBounds> {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     * @default ''
     */
    @Property(0)
    public x: number;

    /**
     * The width of the border in pixels.
     * @default 1
     */
    @Property(0)
    public y: number;

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     * @default ''
     */
    @Property(0)
    public width: number;

    /**
     * The width of the border in pixels.
     * @default 1
     */
    @Property(0)
    public height: number;

}

/**
 * Configures the borders in the chart.
 * @private
 */
export class ToolLocation extends ChildProperty<ToolLocation> {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     * @default ''
     */
    @Property(0)
    public x: number;

    /**
     * The width of the border in pixels.
     * @default 1
     */
    @Property(0)
    public y: number;

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
 * @private
 */
@NotifyPropertyChanges
export class Tooltip extends Component<HTMLElement> implements INotifyPropertyChanged {


     /**
      * Enables / Disables the visibility of the tooltip.
      * @default false.
      * @private.
      */
    @Property(false)
    public enable: boolean;

    /**
     * If set to true, a single ToolTip will be displayed for every index.
     * @default false.
     * @private.
     */
    @Property(false)
    public shared: boolean;

    /**
     * To enable shadow for the tooltip.
     * @default true.
     * @private.
     */

    @Property(true)
    public enableShadow: boolean;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.
     * @private.
     */

    @Property(null)
    public fill: string;

    /**
     * Header for tooltip.
     * @private.
     */

    @Property('')
    public header: string;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.
     * @private.
     */

    @Property(0.75)
    public opacity: number;

    /**
     * Options to customize the ToolTip text.
     * @private.
     */

    @Complex<TextStyleModel>({ size: '13px', fontWeight: 'Normal', color: null, fontStyle: 'Normal', fontFamily: 'Segoe UI' }, TextStyle)
    public textStyle: TextStyleModel;

    /**
     * Custom template to format the ToolTip content. Use ${x} and ${y} as the placeholder text to display the corresponding data point.
     * @default null.
     * @private.
     */

    @Property(null)
    public template: string;

    /**
     * If set to true, ToolTip will animate while moving from one point to another.
     * @default true.
     * @private.
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * Duration for Tooltip animation.
     * @default 300
     * @private.
     */
    @Property(300)
    public duration: number;

   /**
    * To rotate the tooltip.
    * @default false.
    * @private.
    */
    @Property(false)
    public inverted: boolean;

   /**
    * Negative value of the tooltip.
    * @default true.
    * @private.
    */
    @Property(false)
    public isNegative: boolean;

    /**
     * Options to customize tooltip borders.
     * @private.
     */
    @Complex<TooltipBorderModel>({ color: '#cccccc', width: 0.5 }, TooltipBorder)
    public border: TooltipBorderModel;

    /**
     * Content for the tooltip.
     * @private.
     */
    @Property([])
    public content: string[];
    /**
     * Content for the tooltip.
     * @private.
     */
    @Property(10)
    public markerSize: number;

    /**
     * Clip location.
     * @private.
     */
    @Complex<ToolLocationModel>({ x: 0, y: 0 }, ToolLocation)
    public clipBounds: ToolLocationModel;

    /**
     * Palette for marker.
     * @private.
     */
    @Property([])
    public palette: string[];

    /**
     * Shapes for marker.
     * @private.
     */
    @Property([])
    public shapes: TooltipShape[];

    /**
     * Location for Tooltip.
     * @private.
     */
    @Complex<ToolLocationModel>({ x: 0, y: 0 }, ToolLocation)
    public location: ToolLocationModel;

    /**
     * Location for Tooltip.
     * @private.
     */
    @Property(0)
    public offset: number;

    /**
     * Rounded corner for x.
     * @private.
     */
    @Property(2)
    public rx: number;

    /**
     * Rounded corner for y.
     * @private.
     */
    @Property(2)
    public ry: number;

    /**
     * Margin for left and right.
     * @private.
     */
    @Property(5)
    public marginX: number;

    /**
     *  Margin for top and bottom.
     *  @private.
     */
    @Property(5)
    public marginY: number;

    /**
     * Padding for arrow.
     * @private.
     */
    @Property(12)
    public arrowPadding: number;

    /**
     * Data for template.
     * @private.
     */
    @Property(null)
    public data: Object;

   /**
    * Specifies the theme for the chart.
    * @default 'Material'
    * @private.
    */
    @Property('Material')
    public theme: TooltipTheme;

    /**
     * Bounds for the rect.
     * @private.
     */
    @Complex<AreaBoundsModel>({ x: 0, y: 0, width: 0, height: 0 }, AreaBounds)
    public areaBounds: AreaBoundsModel;

    /**
     * Bounds for chart.
     * @private.
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
     * @default false.
     * @private.
     */

    @Property(false)
    public isCanvas: boolean;

    /**
     * To check tooltip wrap for chart.
     * @default false.
     * @private.
     */

    @Property(false)
    public isTextWrap: boolean;

    /**
     * To place tooltip in a particular position.
     * @default null.
     * @private.
     */
    @Property(null)
    public tooltipPlacement: TooltipPlacement;

    /**
     * Triggers before each axis range is rendered.
     * @event
     * @private.
     */
    @Event()
    public tooltipRender: EmitType<ITooltipRenderingEventArgs>;

    /**
     * Triggers after chart load.
     * @event
     * @private.
     */
    @Event()
    public loaded: EmitType<ITooltipLoadedEventArgs>;

    /**
     * Triggers after chart load.
     * @event
     * @private.
     */
    @Event()
    public animationComplete: EmitType<ITooltipAnimationCompleteArgs>;

    //Internal variables

    private elementSize: Size;

    private toolTipInterval: number;
    private padding: number;
    private textElements: Element[];
    private templateFn: Function;
    private formattedText: string[];
    private markerPoint: number[];
    /** @private */
    private valueX: number;
    /** @private */
    private valueY: number;
    private tipRadius: number;
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


    /**
     * Constructor for creating the widget
     * @hidden
     */
    constructor(options?: TooltipModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }

    /**
     * Initialize the event handler.
     *  @private.
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
        this.isFirst = true;
        this.markerPoint = [];
    }

    private removeSVG(): void {
        let svgObject: Element = document.getElementById(this.element.id + '_svg');
        let templateObject: Element = document.getElementById(this.element.id + 'parent_template');
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
            this.renderText(this.isFirst);
            let argsData: ITooltipRenderingEventArgs = {
                cancel: false, name: 'tooltipRender', tooltip : this
            };
            this.trigger('tooltipRender', argsData);
            let markerSide: Side = this.renderTooltipElement(<Rect>this.areaBounds, <TooltipLocation>this.location);
            this.drawMarker(markerSide.isBottom, markerSide.isRight, this.markerSize);
        } else {
            this.updateTemplateFn();
            this.createTemplate(<Rect>this.areaBounds, <TooltipLocation>this.location);
        }
        this.trigger('loaded', { tooltip: this });
        let element : Element = document.getElementById('chartmeasuretext');
        if (element) {
           remove(element);
        }
        this.allowServerDataBinding = true;
    }

    private createTooltipElement(): void {
        this.textElements = [];
        if (!this.template || this.shared) {
            // SVG element for tooltip
            let svgObject: Element = this.renderer.createSvg({ id: this.element.id + '_svg' });
            this.element.appendChild(svgObject);
            // Group to hold text and path.
            let groupElement: HTMLElement = document.getElementById(this.element.id + '_group');
            if (!groupElement) {
                groupElement = <HTMLElement>this.renderer.createGroup({ id: this.element.id + '_group' });
                groupElement.setAttribute('transform', 'translate(0,0)');
            }
            svgObject.appendChild(groupElement);
            let pathElement: Element = this.renderer.drawPath({
                'id': this.element.id + '_path', 'stroke-width': this.theme === 'Bootstrap4' ? 0 : this.border.width,
                'fill': this.fill || this.themeStyle.tooltipFill, 'opacity': this.theme === 'Bootstrap4' ? 0.9 : this.opacity,
                'stroke': this.border.color
            });
            groupElement.appendChild(pathElement);
        }
    }

    private drawMarker(isBottom: boolean, isRight: boolean, size: number): void {
        if (this.shapes.length <= 0) {
            return null;
        }
        let shapeOption: PathOption;
        let count: number = 0;

        let markerGroup: HTMLElement = <HTMLElement>this.renderer.createGroup({ id: this.element.id + '_trackball_group' });
        let groupElement: Element = getElement(this.element.id + '_group');
        let x: number = (this.marginX * 2) + (size / 2) + (isRight ? this.arrowPadding : 0);
        for (let shape of this.shapes) {
            if (shape !== 'None') {
                shapeOption = new PathOption(
                    this.element.id + '_Trackball_' + count, this.palette[count],
                    1, '#cccccc', 1, null);
                if (this.markerPoint[count]) {
                    markerGroup.appendChild(drawSymbol(
                        new TooltipLocation(x, this.markerPoint[count] - this.padding + (isBottom ? this.arrowPadding : 0)),
                        shape, new Size(size, size), '', shapeOption, null));
                }
                count++;
            }
        }
        groupElement.appendChild(markerGroup);
    }

    private renderTooltipElement(areaBounds: Rect, location: TooltipLocation): Side {
        let tooltipDiv: HTMLDivElement = <HTMLDivElement>getElement(this.element.id);
        let arrowLocation: TooltipLocation = new TooltipLocation(0, 0);
        let tipLocation: TooltipLocation = new TooltipLocation(0, 0);
        let textHeights: number[];
        let svgObject: Element = getElement(this.element.id + '_svg');
        let groupElement: Element = getElement(this.element.id + '_group');
        let pathElement: Element = getElement(this.element.id + '_path');
        let rect: Rect;
        let isTop: boolean = false; let isLeft: boolean = false;
        let isBottom: boolean = false; let x: number = 0; let y: number = 0;
        this.tipRadius = 1;

        if (this.header !== '') {
            this.elementSize.height += this.marginY;
        }
        if (this.content.length > 1) {
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
            }
        }
        if (this.header !== '') {
            let headerSize: number = measureText(this.isWrap ? this.wrappedText : this.header, this.textStyle).height +
                (this.marginY * 2) + (isBottom ? this.arrowPadding : 0) + (this.isWrap ? 5 : 0); //header padding;
            let xLength: number = (this.marginX * 3) + (!isLeft && !isTop && !isBottom ? this.arrowPadding : 0);
            let direction: string = 'M ' + xLength + ' ' + headerSize +
                'L ' + (rect.width + (!isLeft && !isTop && !isBottom ? this.arrowPadding : 0) - (this.marginX * 2)) +
                ' ' + headerSize;
            let pathElement: Element = this.renderer.drawPath({
                'id': this.element.id + '_header_path', 'stroke-width': 1,
                'fill': null, 'opacity': 0.8, 'stroke': this.themeStyle.tooltipHeaderLine, 'd': direction
            });
            groupElement.appendChild(pathElement);
        }

        let start: number = this.border.width / 2;
        let pointRect: Rect = new Rect(start + x, start + y, rect.width - start, rect.height - start);
        groupElement.setAttribute('opacity', '1');
        if (this.enableAnimation && !this.shared && !this.isFirst) {
            this.animateTooltipDiv(tooltipDiv, rect);
        } else {
            this.updateDiv(tooltipDiv, rect.x, rect.y);
        }
        svgObject.setAttribute('height', (rect.height + this.border.width + (!((!this.inverted)) ? 0 : this.arrowPadding) + 5).toString());
        svgObject.setAttribute('width', (rect.width + this.border.width + (((!this.inverted)) ? 0 : this.arrowPadding) + 5).toString());
        svgObject.setAttribute('opacity', '1');
        if (!isNullOrUndefined(this.tooltipPlacement)) {
            isTop = this.tooltipPlacement.indexOf('Top') > -1;
            isBottom = this.tooltipPlacement.indexOf('Bottom') > -1;
            isLeft = this.tooltipPlacement.indexOf('Left') > -1;
        }
        pathElement.setAttribute('d', findDirection(
            this.rx, this.ry, pointRect, arrowLocation,
            this.arrowPadding, isTop, isBottom, isLeft, tipLocation.x, tipLocation.y, this.tipRadius
        ));
        if (this.enableShadow && this.theme !== 'Bootstrap4') {
            // To fix next chart initial tooltip opacity issue in tab control
            let shadowId: string = this.element.id + '_shadow';
            pathElement.setAttribute('filter', Browser.isIE ? '' : 'url(#' + shadowId + ')');
            let shadow: string = '<filter id="' + shadowId + '" height="130%"><feGaussianBlur in="SourceAlpha" stdDeviation="3"/>';
            shadow += '<feOffset dx="3" dy="3" result="offsetblur"/><feComponentTransfer><feFuncA type="linear" slope="0.5"/>';
            shadow += '</feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>';

            let defElement: Element = this.renderer.createDefs();
            defElement.setAttribute('id', this.element.id + 'SVG_tooltip_definition');
            groupElement.appendChild(defElement);

            defElement.innerHTML = shadow;
        }

        pathElement.setAttribute('stroke', this.border.color);

        this.changeText(new TooltipLocation(x, y), isBottom, !isLeft && !isTop && !isBottom, rect);

        return new Side(isBottom, !isLeft && !isTop && !isBottom);

    }


    private changeText(point: TooltipLocation, isBottom: boolean, isRight: boolean, rect: Rect): void {

        let element: HTMLElement = document.getElementById(this.element.id + '_text');

        if (isBottom) {
            element.setAttribute('transform', 'translate(0,' + this.arrowPadding + ')');
        }
        if (isRight) {
            element.setAttribute('transform', 'translate(' + this.arrowPadding + ' 0)');
        }
    }

    private findFormattedText() : void {
        this.formattedText = [];
        if (this.header.replace(/<b>/g, '').replace(/<\/b>/g, '').trim() !== '') {
            this.formattedText = this.formattedText.concat(this.header);
        }
        this.formattedText = this.formattedText.concat(this.content);
    }

    // tslint:disable-next-line:max-func-body-length
    private renderText(isRender: boolean): void {
        let height: number = 0; let width: number = 0; // Padding for text;
        let subWidth: number = 0; let lines: string[];
        let key: string = 'properties'; let size: number;
        let font: TextStyle = <TextStyle>extend({}, this.textStyle, null, true)[key];
        let groupElement: Element = getElement(this.element.id + '_group');
        let tspanElement: HTMLElement; let textCollection: string[];
        let tspanStyle: string = ''; let line: string; let tspanOption: Object;
        this.findFormattedText();
        let isHeader: boolean;
        let isRtlEnabled: boolean = document.body.getAttribute('dir') === 'rtl';
        let anchor: string = isRtlEnabled ? 'end' : 'start';
        this.leftSpace = this.areaBounds.x + this.location.x;
        this.rightSpace = (this.areaBounds.x + this.areaBounds.width) - this.leftSpace;
        let headerContent: string = this.header.replace(/<b>/g, '').replace(/<\/b>/g, '').trim();
        let isBoldTag: boolean = this.header.indexOf('<b>') > -1 && this.header.indexOf('</b>') > -1;
        let headerWidth: number = measureText(this.formattedText[0], font).width + (2 * this.marginX) + this.arrowPadding;
        let isLeftSpace: boolean = (this.location.x - headerWidth) < this.location.x;
        let isRightSpace: boolean = (this.areaBounds.x + this.areaBounds.width) < (this.location.x + headerWidth); let header: string;
        let headerSpace: number = (headerContent !== '') ? this.marginY : 0;
        let isRow: boolean = true; let isColumn: boolean = true; this.markerPoint = [];
        let markerSize: number = (this.shapes.length > 0) ? 10 : 0;
        let markerPadding: number = (this.shapes.length > 0) ? 5 : 0;
        let spaceWidth: number = 4; let subStringLength: number;
        let fontSize : string = '13px'; let fontWeight: string = 'Normal';  let labelColor: string = this.themeStyle.tooltipLightLabel;
        let dy: number = (22 / parseFloat(fontSize)) * (parseFloat(font.size));
        if (!isRender || this.isCanvas) {
            removeElement(this.element.id + '_text');
            removeElement(this.element.id + '_header_path');
            removeElement(this.element.id + '_trackball_group');
            removeElement(this.element.id + 'SVG_tooltip_definition');
        }
        let options: TextOption = new TextOption(
            this.element.id + '_text', this.marginX * 2, (this.marginY * 2 + this.padding * 2 + (this.marginY === 2 ? 3 : 0)),
            anchor, ''
        );
        let parentElement: Element = textElement(options, font, null, groupElement);
        let withoutHeader: boolean = this.formattedText.length === 1 && this.formattedText[0].indexOf(' : <b>') > -1;
        isHeader = this.header !== '';
        size = isHeader && isBoldTag ? 16 : 13;
        for (let k: number = 0, pointsLength: number = this.formattedText.length; k < pointsLength; k++) {
            textCollection = this.formattedText[k].replace(/<(b|strong)>/g, '<b>')
                .replace(/<\/(b|strong)>/g, '</b>')
                .split(/<br.*?>/g);
            if (k === 0 && !withoutHeader && this.isTextWrap &&
                (this.leftSpace < headerWidth || isLeftSpace) &&
                (this.rightSpace < headerWidth || isRightSpace)
            ) {
                subStringLength = Math.round(this.leftSpace > this.rightSpace ? (this.leftSpace / size) : (this.rightSpace / size));
                header = headerContent !== '' ? headerContent : this.formattedText[k];
                textCollection = header.match(new RegExp('.{1,' + subStringLength + '}', 'g'));
                this.wrappedText = isBoldTag ? '<b>' + textCollection.join('<br>') + '</b>' : textCollection.join('<br>');
                this.isWrap = textCollection.length > 1;
            }
            if (textCollection [0] === '' ) {
                    continue;
            }
            if ((k !== 0) || (headerContent === '')) {
                this.markerPoint.push((headerContent !== '' ? (this.marginY) : 0) + options.y + height);
            }
            for (let i: number = 0, len: number = textCollection.length; i < len; i++) { // string value of unicode for LTR is \u200E
                lines = textCollection[i].replace(/<b>/g, '<br><b>').replace(/<\/b>/g, '</b><br>').replace(/:/g, '<br>\u200E:<br>')
                        .split('<br>');
                subWidth = 0;
                isColumn = true;
                height += dy;
                for (let j: number = 0, len: number = lines.length; j < len; j++) {
                    line = lines[j];
                    if (!/\S/.test(line) && line !== '') {
                        line = ' ';  //to trim multiple white spaces to single white space
                    }
                    if ( (!isColumn && line === ' ') || (line.replace(/<b>/g, '').replace(/<\/b>/g, '').trim() !== '')) {
                        subWidth += line !== ' ' ? spaceWidth : 0;
                        if (isColumn && !isRow) {
                            tspanOption = { x: (this.marginX * 2) + (markerSize + markerPadding),
                                            dy: dy + ((isColumn) ? headerSpace : 0), fill: '' };
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
                            fontWeight = 'bold'; labelColor = this.themeStyle.tooltipBoldLabel;
                            tspanStyle = 'font-weight:' + fontWeight; font.fontWeight = fontWeight;
                            (tspanElement).setAttribute('fill', this.textStyle.color || labelColor);
                        } else {
                            tspanStyle = fontWeight === 'bold' ? 'font-weight:' + fontWeight : '';
                            font.fontWeight = fontWeight;
                            (tspanElement).setAttribute('fill', this.textStyle.color || labelColor);
                        }
                        if (line.indexOf('</b>') > -1 || ((isBoldTag && j === len - 1 && k === 0) && (isHeader || this.isWrap))) {
                            fontWeight = 'Normal'; labelColor = this.themeStyle.tooltipLightLabel;
                        }
                        let isRtlText: boolean = /[\u0590-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(line);
                        (tspanElement).textContent = line = line.replace(/<[a-zA-Z\/](.|\n)*?>/g, isRtlText ? '\u200E' : '');
                        subWidth += measureText(line, font).width;
                        if (tspanStyle !== '') {
                            tspanElement.setAttribute('style', tspanStyle);
                        }
                        isRow = false;
                    }
                }
                subWidth -= spaceWidth;
                width = Math.max(width, subWidth);
            }
        }
        this.elementSize = new Size(width + (width > 0 ? (2 * this.marginX) : 0), height);
        this.elementSize.width += (markerSize + markerPadding); // marker size + marker Spacing
        let element: HTMLElement = <HTMLElement>(parentElement.childNodes[0]);
        if (headerContent !== '' && element && !this.isWrap) {
            font.fontWeight = 'bold';
            let width: number = (this.elementSize.width + (2 * this.padding)) / 2 - measureText(headerContent, font).width / 2;
            element.setAttribute('x', width.toString());
        }
    }

    private createTemplate(areaBounds: Rect, location: TooltipLocation): void {
        let argsData: ITooltipRenderingEventArgs = { cancel: false, name: 'tooltipRender', tooltip : this};
        this.trigger('tooltipRender', argsData);
        let parent : HTMLElement = document.getElementById(this.element.id);
        if (this.isCanvas) {
            this.removeSVG();
        }
        let firstElement: HTMLElement = parent.firstElementChild as HTMLElement;
        if (firstElement) {
            remove(firstElement);
        }
        if (!argsData.cancel) {
            let elem: Element = createElement('div', { id: this.element.id + 'parent_template' });
            let templateElement: HTMLCollection = this.templateFn(this.data, this, 'tooltipTemplate', elem.id + '_blazorTemplate', '');
            while (templateElement && templateElement.length > 0) {
                if (isBlazor()) {
                    elem.appendChild(templateElement[0]);
                    templateElement = null;
                } else {
                    elem.appendChild(templateElement[0]);
                }
            }
            parent.appendChild(elem);
            let element: Element = this.isCanvas ? elem : this.element;
            let rect: ClientRect = element.getBoundingClientRect();
            this.padding = 0;
            this.elementSize = new Size(rect.width, rect.height);
            let tooltipRect: Rect = this.tooltipLocation(areaBounds, location, new TooltipLocation(0, 0), new TooltipLocation(0, 0));
            if (this.enableAnimation && !this.shared && !this.isFirst) {
                this.animateTooltipDiv(<HTMLDivElement>this.element, tooltipRect);
            } else {
                this.updateDiv(<HTMLDivElement>element, tooltipRect.x, tooltipRect.y);
            }
            if (this.blazorTemplate) {
                //Customer issue - F149037  Call back function to handle the blazor tooltip alignment issues
                let tooltipRendered: Function = () => {
                    let rect1: ClientRect = getElement(thisObject.element.id).getBoundingClientRect();
                    thisObject.elementSize = new Size(rect1.width, rect1.height);
                    let tooltipRect1: Rect = thisObject.tooltipLocation(areaBounds, location, new TooltipLocation(0, 0),
                                                                        new TooltipLocation(0, 0));
                    thisObject.updateDiv(getElement(thisObject.element.id) as HTMLDivElement, tooltipRect1.x, tooltipRect1.y);
                };
                let thisObject: Tooltip = this;
                tooltipRendered.bind(thisObject, areaBounds, location);
                updateBlazorTemplate(this.element.id + 'parent_template' + '_blazorTemplate',
                                     this.blazorTemplate.name, this.blazorTemplate.parent, undefined, tooltipRendered);
            }
        } else {
            remove(getElement(this.element.id + '_tooltip'));
        }
    }

    private sharedTooltipLocation(bounds: Rect, x: number, y: number): Rect {
        let width: number = this.elementSize.width + (2 * this.marginX);
        let height: number = this.elementSize.height + (2 * this.marginY);
        let tooltipRect: Rect = new Rect(x + 2 * this.padding, y - height - this.padding, width, height);
        if (tooltipRect.y < bounds.y) {
            tooltipRect.y += (tooltipRect.height + 2 * this.padding);
        }
        if (tooltipRect.x + tooltipRect.width > bounds.x + bounds.width) {
            tooltipRect.x -= (tooltipRect.width + 4 * this.padding);
        }
        return tooltipRect;
    }
    private getCurrentPosition(bounds: Rect, symbolLocation: TooltipLocation, arrowLocation: TooltipLocation,
                               tipLocation: TooltipLocation): Rect {
        let position: TooltipPlacement = this.tooltipPlacement;
        let clipX: number = this.clipBounds.x;
        let clipY: number = this.clipBounds.y;
        let markerHeight: number = this.offset;
        let width: number = this.elementSize.width + (2 * this.marginX);
        let height: number = this.elementSize.height + (2 * this.marginY);
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
    private tooltipLocation(bounds: Rect, symbolLocation: TooltipLocation, arrowLocation: TooltipLocation,
                            tipLocation: TooltipLocation): Rect {
        if (!isNullOrUndefined(this.tooltipPlacement)) {
            let tooltipRect: Rect = this.getCurrentPosition(bounds, symbolLocation, arrowLocation, tipLocation);
            return tooltipRect;
        }
        let location: TooltipLocation = new TooltipLocation(symbolLocation.x, symbolLocation.y);
        let width: number = this.elementSize.width + (2 * this.marginX);
        let height: number = this.elementSize.height + (2 * this.marginY);

        let markerHeight: number = this.offset;

        let clipX: number = this.clipBounds.x;
        let clipY: number = this.clipBounds.y;
        let boundsX: number = bounds.x;
        let boundsY: number = bounds.y;
        if (!this.inverted) {
            location = new TooltipLocation(
                location.x + clipX - this.elementSize.width / 2 - this.padding,
                location.y + clipY - this.elementSize.height - (2 * this.padding) - this.arrowPadding - markerHeight
            );
            arrowLocation.x = tipLocation.x = width / 2;
            if (location.y < boundsY || (this.isNegative)) {
                location.y = (symbolLocation.y < 0 ? 0 : symbolLocation.y) + clipY + markerHeight;
            }
            if (location.y + height + this.arrowPadding > boundsY + bounds.height) {
                location.y = (symbolLocation.y > bounds.height ? bounds.height : symbolLocation.y)
                    + clipY - this.elementSize.height - (2 * this.padding) - this.arrowPadding - markerHeight;
            }
            tipLocation.x = width / 2;
            if (location.x < boundsX) {
                arrowLocation.x -= (boundsX - location.x);
                tipLocation.x -= (boundsX - location.x);
                location.x = boundsX;
            }
            if (location.x + width > boundsX + bounds.width) {
                arrowLocation.x += ((location.x + width) - (boundsX + bounds.width));
                tipLocation.x += ((location.x + width) - (boundsX + bounds.width));
                location.x -= ((location.x + width) - (boundsX + bounds.width));
            }
            if (arrowLocation.x + this.arrowPadding / 2 > width - this.rx) {
                arrowLocation.x = width - this.rx - this.arrowPadding / 2;
                tipLocation.x = width;
                this.tipRadius = 0;
            }
            if (arrowLocation.x - this.arrowPadding / 2 < this.rx) {
                arrowLocation.x = this.rx + this.arrowPadding / 2;
                tipLocation.x = 0;
                this.tipRadius = 0;
            }
        } else {
            location = new TooltipLocation(
                location.x + clipX + markerHeight,
                location.y + clipY - this.elementSize.height / 2 - (this.padding)
            );
            arrowLocation.y = tipLocation.y = height / 2;
            if ((location.x + width + this.arrowPadding > boundsX + bounds.width) || (this.isNegative)) {
                location.x = (symbolLocation.x > bounds.width ? bounds.width : symbolLocation.x)
                    + clipX - markerHeight - (width + this.arrowPadding);
            }
            if (location.x < boundsX) {
                location.x = (symbolLocation.x < 0 ? 0 : symbolLocation.x) + clipX + markerHeight;
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
            if (arrowLocation.y + this.arrowPadding / 2 > height - this.ry) {
                arrowLocation.y = height - this.ry - this.arrowPadding / 2;
                tipLocation.y = height;
                this.tipRadius = 0;
            }
            if (arrowLocation.y - this.arrowPadding / 2 < this.ry) {
                arrowLocation.y = this.ry + this.arrowPadding / 2;
                tipLocation.y = 0;
                this.tipRadius = 0;
            }
        }
        return new Rect(location.x, location.y, width, height);
    }
    private animateTooltipDiv(tooltipDiv: HTMLDivElement, rect: Rect): void {
        let x: number = parseFloat(tooltipDiv.style.left);
        let y: number = parseFloat(tooltipDiv.style.top);
        let currenDiff: number;
        new Animation({}).animate(tooltipDiv, {
            duration: this.duration,
            progress: (args: AnimationOptions): void => {
                currenDiff = (args.timeStamp / args.duration);
                tooltipDiv.style.animation = null;
                tooltipDiv.style.left = (x + currenDiff * (rect.x - x)) + 'px';
                tooltipDiv.style.top = (y + currenDiff * (rect.y - y)) + 'px';
            },
            end: (model: AnimationOptions): void => {
                this.updateDiv(tooltipDiv, rect.x, rect.y);
                this.trigger('animationComplete', { tooltip: this });
            }
        });

    }

    private updateDiv(tooltipDiv: HTMLDivElement, x: number, y: number): void {
        tooltipDiv.style.left = x + 'px';
        tooltipDiv.style.top = y + 'px';
    }


    private updateTemplateFn(): void {
        if (this.template) {
            let e: Object;
            try {
                if (document.querySelectorAll(this.template).length) {
                    this.templateFn = templateComplier(document.querySelector(this.template).innerHTML.trim());
                }
            } catch (e) {
                this.templateFn = templateComplier(this.template);
            }
        }
    }

   /** @private */
    public fadeOut(): void {
        let tooltipElement: HTMLElement = (this.isCanvas && !this.template) ? <HTMLElement>getElement(this.element.id + '_svg') :
        <HTMLElement>getElement(this.element.id);
        if (tooltipElement) {
            let tooltipGroup: HTMLElement = tooltipElement.firstChild as HTMLElement;
            if (this.isCanvas && !this.template) {
                tooltipGroup = document.getElementById(this.element.id + '_group') ? document.getElementById(this.element.id + '_group') :
                               tooltipGroup;
            }
            let opacity: number;
            if (tooltipGroup) {
                opacity = parseFloat(tooltipGroup.getAttribute('opacity')) || 1;
            }
            new Animation({}).animate(tooltipGroup, {
                duration: 200,
                progress: (args: AnimationOptions): void => {
                    //  tooltipGroup.removeAttribute('e-animate');
                    this.progressAnimation(tooltipGroup, opacity, (args.timeStamp / args.duration));
                },
                end: (model: AnimationOptions) => {
                    this.fadeOuted = true;
                    this.endAnimation(tooltipGroup);
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
        if (this.template && !this.shared) {
            tooltipGroup.style.display = 'none';
        }
        this.trigger('animationComplete', {tooltip: this});
    }

   /**
    * Get the properties to be maintained in the persisted state.
    * @private
    */
    public getPersistData(): string {
        let keyEntity: string[] = [];
        return this.addOnPersist(keyEntity);
    }

  /**
   * Get component name
   *  @private
   */

    public getModuleName(): string {
        return 'tooltip';
    }

   /**
    * To destroy the accumulationcharts
    * @private
    */
    public destroy(): void {
        super.destroy();
        this.element.classList.remove('e-tooltip');
    }

      /**
       * Called internally if any of the property value changed.
       * @return {void}
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

