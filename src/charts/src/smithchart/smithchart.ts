
import { Component, Complex, NotifyPropertyChanges, INotifyPropertyChanged, Property } from '@syncfusion/ej2-base';
import { isNullOrUndefined, Browser, ModuleDeclaration} from '@syncfusion/ej2-base';
import { createElement, remove, Event, EmitType, EventHandler } from '@syncfusion/ej2-base';
import { createSvg, RectOption, measureText, TextOption, renderTextElement } from '../smithchart/utils/helper';
import { removeElement, textTrim } from '../smithchart/utils/helper';
import { SmithchartRect,  SmithchartSize } from '../smithchart/utils/utils';
import { SmithchartMarginModel, SmithchartBorderModel, SmithchartFontModel} from '../smithchart/utils/utils-model';
import { SmithchartMargin, SmithchartBorder, SmithchartFont} from '../smithchart/utils/utils';
import {TitleModel, SubtitleModel} from '../smithchart/title/title-model';
import { SmithchartLegendSettingsModel} from '../smithchart/legend/legend-model';
import {SmithchartAxisModel} from '../smithchart/axis/axis-model';
import { TooltipRender } from '../smithchart/series/tooltip';
import { ISmithchartLoadedEventArgs, ISmithchartLoadEventArgs, ISmithchartThemeStyle } from '../smithchart/model/interface';
import { ISmithchartLegendRenderEventArgs, ITitleRenderEventArgs, ISubTitleRenderEventArgs} from '../smithchart/model/interface';
import { ISmithchartAxisLabelRenderEventArgs, ISmithchartPrintEventArgs} from '../smithchart/model/interface';
import { ISmithchartSeriesRenderEventArgs, ISmithchartAnimationCompleteEventArgs} from '../smithchart/model/interface';
import { ISmithchartTextRenderEventArgs} from '../smithchart/model/interface';
import { getThemeColor } from '../smithchart/model/theme';
import { SmithchartLegendSettings} from '../smithchart/legend/legend';
import { SmithchartAxis} from '../smithchart/axis/axis';
import { Title} from '../smithchart/title/title';
import { SmithchartSeriesModel} from '../smithchart/series/series-model';
import { SmithchartSeries} from '../smithchart/series/series';
import { AreaBounds} from '../smithchart/utils/area';
import { AxisRender} from '../smithchart/axis/axisrender';
import { SmithchartLegend} from '../smithchart/legend/legendrender';
import { SeriesRender} from '../smithchart/series/seriesrender';
import { SvgRenderer, Collection } from '@syncfusion/ej2-base';
import { getSeriesColor} from '../smithchart/model/theme';
import { SmithchartTheme, RenderType} from '../smithchart/utils/enum';
import { Tooltip } from '@syncfusion/ej2-svg-base';
import { ExportUtils } from '../smithchart/utils/export';
import { SmithchartExportType } from '../smithchart/utils/enum';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { titleRender, subtitleRender} from '../smithchart/model/constant';
import { SmithchartModel} from '../smithchart/smithchart-model';
/* tslint:disable:no-string-literal */
/**
 * Represents the Smithchart control.
 * ```html
 * <div id="smithchart"/>
 * <script>
 *   var chartObj = new Smithchart({ isResponsive : true });
 *   chartObj.appendTo("#smithchart");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Smithchart extends Component<HTMLElement> implements INotifyPropertyChanged {

/**
 * legend bounds
 */
    public legendBounds: SmithchartRect;
/**
 * area bounds
 */
    public bounds: SmithchartRect;
/**
 * `smithchartLegendModule` is used to add legend to the smithchart.
 */
    public smithchartLegendModule: SmithchartLegend;

/**
 * `tooltipRenderModule` is used to add tooltip to the smithchart.
 */
    public tooltipRenderModule: TooltipRender;

/**
 * render type of smithchart.
 * @default Impedance
 */

@Property('Impedance')
public renderType: RenderType;

/**
 * width for smithchart.
 * @default ''
 */
@Property('')
public width: string;

/**
 * height for smithchart.
 * @default ''
 */
 @Property('')
public height: string;

/**
 * theme for smithchart.
 * @default Material
 */

@Property('Material')
public theme: SmithchartTheme;

/** @private */

    public seriesrender: SeriesRender;
/** @private */
    public themeStyle: ISmithchartThemeStyle;

/** @private */
    public availableSize: SmithchartSize;

    /**
     *  options for customizing margin
     */
    @Complex<SmithchartMarginModel>({}, SmithchartMargin)
    public margin: SmithchartMarginModel;

/**
 *  options for customizing margin
 */
    @Complex<SmithchartFontModel>({}, SmithchartFont)
    public font: SmithchartFontModel;

    /**
     *  options for customizing border
     */

     @Complex<SmithchartBorderModel>({}, SmithchartBorder)
    public border: SmithchartBorderModel;

   /**
    *  options for customizing title
    */

@Complex<TitleModel>({}, Title)
    public title: TitleModel;

    /**
     *  options for customizing series
     */

@Collection<SmithchartSeriesModel>([{}], SmithchartSeries)
    public series: SmithchartSeriesModel[];


/**
 *  options for customizing legend
 */

@Complex<SmithchartLegendSettingsModel>({}, SmithchartLegendSettings)
    public legendSettings: SmithchartLegendSettingsModel;

/**
 * Options to configure the horizontal axis.
 */

    @Complex<SmithchartAxisModel>({}, SmithchartAxis)
    public horizontalAxis: SmithchartAxisModel;

    /**
     * Options to configure the vertical axis.
     */

    @Complex<SmithchartAxisModel>({}, SmithchartAxis)
    public radialAxis: SmithchartAxisModel;

/**
 * svg renderer object.
 * @private
 */
    public renderer: SvgRenderer;
/** @private */
    public svgObject: Element;
/** @private */
    public animateSeries: boolean;
/** @private */
    public seriesColors: string[];

    public chartArea: SmithchartRect;

/**
 * Resize the smithchart
 */
    private resizeTo: number;

    private isTouch: boolean;

    private fadeoutTo: number;

    /**
     * The background color of the smithchart.
     */
    @Property(null)
    public background: string;

    /**
     *  Spacing between elements
     * @default 10
     */

    @Property(10)
    public elementSpacing: number;

    /**
     *  Spacing between elements
     * @default 1
     */

    @Property(1)
    public radius: number;

    /**
     * Triggers before the prints gets started.
     * @event
     */
    @Event()
    public beforePrint: EmitType<ISmithchartPrintEventArgs>;
    /**
     * Triggers after the animation completed.
     * @event
     */
    @Event()
    public animationComplete: EmitType<ISmithchartAnimationCompleteEventArgs>;

    /**
     * Triggers before smithchart rendered.
     * @event
     */
    @Event()
    public load: EmitType<ISmithchartLoadEventArgs>;
    /**
     * Triggers after smithchart rendered.
     * @event
     */
    @Event()
    public loaded: EmitType<ISmithchartLoadedEventArgs>;

    /**
     * Triggers before the legend is rendered.
     * @event
     */
    @Event()
    public legendRender: EmitType<ISmithchartLegendRenderEventArgs>;

    /**
     * Triggers before the title is rendered.
     * @event
     */
    @Event()
    public titleRender: EmitType<ITitleRenderEventArgs>;

    /**
     * Triggers before the sub-title is rendered.
     * @event
     */
    @Event()
    public subtitleRender: EmitType<ISubTitleRenderEventArgs>;

    /**
     * Triggers before the datalabel text is rendered.
     * @event
     */
    @Event()
    public textRender: EmitType<ISmithchartTextRenderEventArgs>;
    /**
     * Triggers before the axis label is rendered
     * @event
     */
    @Event()
    public axisLabelRender: EmitType<ISmithchartAxisLabelRenderEventArgs>;

    /**
     * Triggers before the series is rendered.
     * @event
     */

    @Event()
    public seriesRender: EmitType<ISmithchartSeriesRenderEventArgs>;

/**
 * Get component name
 */

    public getModuleName(): string {
        return 'smithchart';
    }

    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    public getPersistData(): string {
        return '';
    }

    /**
     * Method to create SVG element.
     */

    private createChartSvg(): void {
        this.removeSvg();
        createSvg(this);
    }

     private renderTitle(title: TitleModel, type: string, groupEle: Element): void {
        let font: SmithchartFontModel = title.font ? title.font : title.textStyle;
        let textSize: SmithchartSize = measureText(title.text, font);
        let x: number;
        let y: number;
        let textAlignment: string = title.textAlignment;
        let titleText: string = title.text;
        let maxTitleWidth: number = (isNullOrUndefined(title.maximumWidth)) ?
                                     Math.abs(this.margin.left + this.margin.right - (this.availableSize.width)) :
                                     title.maximumWidth;
        let  titleWidthEnable: boolean = textSize.width > maxTitleWidth ? true : false;
        if (textSize.width > this.availableSize.width) {
            x = this.margin.left + this.border.width;
        } else {
        x = textAlignment === 'Center' ? (this.availableSize.width / 2 - textSize['width'] /  2) :
            (textAlignment === 'Near' ? (this.margin.left + this.elementSpacing + this.border.width) : (this.availableSize.width
             - textSize['width'] - (this.margin.right + this.elementSpacing + this.border.width)));
        }
        y = this.margin.top + textSize['height'] / 2 + this.elementSpacing;
        if (title.enableTrim && titleWidthEnable) {
                titleText = textTrim(maxTitleWidth, title.text, font);
                textSize = measureText(titleText, font);
            }
        groupEle = this.renderer.createGroup({ id: this.element.id + '_Title_Group' });
        let titleEventArgs: ITitleRenderEventArgs = { text: titleText, x: x, y: y, name: 'titleRender', cancel: false};
        this.trigger(titleRender, titleEventArgs);
        let options: TextOption = new TextOption(
                this.element.id + '_Smithchart_' + type, titleEventArgs.x, titleEventArgs.y, 'start', titleEventArgs.text
            );
        let element: Element = renderTextElement(options, font, this.themeStyle.chartTitle, groupEle);
        element.setAttribute('aria-label', title.description || title.text);
        let titleLocation: {x: number, y: number, textSize: SmithchartSize} = {x: x, y: y, textSize: textSize};
        this.svgObject.appendChild(groupEle);
        if (title.subtitle.text !== '' &&  title.subtitle.visible) {
        this.renderSubtitle(title, type, textSize, this.availableSize, titleLocation, groupEle);
        }
     }

     private renderSubtitle(title: TitleModel, type: string, textSize: SmithchartSize, size: SmithchartSize,
                            titleLocation: {x: number, y: number, textSize: SmithchartSize}, groupEle: Element): void {

     let x: number;
     let y: number;
     let font: SmithchartFontModel = title.subtitle.textStyle;
     let subTitle: SubtitleModel = title.subtitle;
     let subTitleSize: SmithchartSize = measureText(subTitle.text, font);
     let textAnchor: string;
     let subTitleText: string = subTitle.text;
     let maxSubTitleWidth: number = isNullOrUndefined(subTitle.maximumWidth) ?
                                    (this.bounds.width * 0.75) : subTitle.maximumWidth;
     if (subTitle.enableTrim && subTitleSize.width > maxSubTitleWidth) {
                subTitleText = textTrim(maxSubTitleWidth, subTitle.text, font);
            }
     x = title['subtitle'].textAlignment === 'Far' ? (titleLocation.x + (titleLocation.textSize.width)) :
         (title['subtitle'].textAlignment === 'Near') ? titleLocation.x :
         (titleLocation.x + (titleLocation.textSize.width / 2));
     y = titleLocation.y + (2 * this.elementSpacing);
     textAnchor = title['subtitle'].textAlignment === 'Far' ? 'end' :
                  (title['subtitle'].textAlignment === 'Near') ? 'start' : 'middle';
     let subtitleEventArgs: ISubTitleRenderEventArgs = { text: subTitleText, x: x, y: y, name: 'subtitleRender', cancel: false};
     this.trigger(subtitleRender, subtitleEventArgs);
     let options: TextOption = new TextOption(
                this.element.id + '_Smithchart_' + type, subtitleEventArgs.x, subtitleEventArgs.y, textAnchor, subtitleEventArgs.text
            );
     let element: Element = renderTextElement(options, font, this.themeStyle.chartTitle, groupEle);
     element.setAttribute('aria-label', subTitle.description || subTitle.text);
     groupEle.appendChild(element);
     }
     /**
      * @private
      * Render the smithchart border
      */
    private renderBorder(): void {
        let border: SmithchartBorderModel = this.border;
        let color: string = this.theme === 'Highcontrast' ? '#000000' : '#FFFFFF';
        this.background = this.background ? this.background : color;
        let borderRect: RectOption = new RectOption(this.element.id + '_SmithchartBorder', this.background, border, 1,
                                                    new SmithchartRect(
                                                        border.width / 2, border.width / 2,
                                                        this.availableSize.width - border.width,
                                                        this.availableSize.height - border.width));
        this.svgObject.appendChild(this.renderer.drawRectangle(borderRect) as SVGRectElement);
    }
/**
 * Called internally if any of the property value changed.
 * @private
 */
    public onPropertyChanged(newProp: SmithchartModel, oldProp: SmithchartModel): void {

        this.animateSeries = false;
        let renderer: boolean = false;
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'background':
                    renderer = true;
                    break;
                case 'size':
                    this.createChartSvg();
                    renderer = true;
                    break;
                case 'theme':
                    this.animateSeries = true;
                    renderer = true;
                    break;
                case 'border':
                    renderer = true;
                    break;
            }
        }
        if (renderer) {
            this.render();
        }
     }

    /**
     * Constructor for creating the Smithchart widget
     */
    constructor(options?: SmithchartModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }

    /**
     * Initialize the event handler.
     */

    protected preRender(): void {
        this.trigger('load', {smithchart: this});
        this.unWireEVents();
        this.initPrivateVariable();
        this.wireEVents();
    }
    private initPrivateVariable(): void {
        this.animateSeries = true;
    }
    /**
     * To Initialize the control rendering.
     */
    private setTheme(): void {
    /*! Set theme */
        this.themeStyle = getThemeColor(this.theme);
        this.seriesColors = getSeriesColor(this.theme);
        // let count: number = colors.length;
        // for (let i: number = 0; i < this.series.length; i++) {

        //     this.series[i].fill = this.series[i].fill ? this.series[i].fill : colors[i % count];
        // }
    }
    protected render(): void {

        this.createChartSvg();
        this.element.appendChild(this.svgObject);
        this.setTheme();
        this.createSecondaryElement();
        this.renderBorder();
        if (this.smithchartLegendModule && this.legendSettings.visible) {
            this.legendBounds = this.smithchartLegendModule.renderLegend(this);
        }
        this.legendBounds = this.legendBounds ? this.legendBounds : {x: 0, y: 0, width: 0, height: 0};
        let areaBounds: AreaBounds = new AreaBounds();
        this.bounds = areaBounds.calculateAreaBounds(this, this.title, this.legendBounds);
        if (this.title.text !== '' && this.title.visible) {
        this.renderTitle(this.title, 'title', null);
        }
        let axisRender: AxisRender = new AxisRender();
        axisRender.renderArea(this, this.bounds);
        this.seriesrender = new SeriesRender();
        this.seriesrender.draw(this, axisRender, this.bounds);
        this.trigger('loaded', { smithchart: this });
    }
     private createSecondaryElement(): void {
        if (isNullOrUndefined(document.getElementById(this.element.id + '_Secondary_Element'))) {
            let secondaryElement: HTMLElement = createElement('div', {
                id: this.element.id + '_Secondary_Element',
                styles: 'position: absolute;z-index:1;'
            });
            this.element.appendChild(secondaryElement);
            let rect: ClientRect = this.element.getBoundingClientRect();
            let svgRect: HTMLElement = document.getElementById(this.element.id + '_svg');
            if (svgRect) {
              let svgClientRect: ClientRect = svgRect.getBoundingClientRect();
              secondaryElement.style.left = Math.max(svgClientRect.left - rect.left, 0) + 'px';
              secondaryElement.style.top = Math.max(svgClientRect.top - rect.top, 0) + 'px';
            }

        } else {
            removeElement(this.element.id + '_Secondary_Element');
        }
    }
/**
 * To destroy the widget
 * @method destroy
 * @return {void}.
 * @member of smithChart
 */

    public destroy(): void {
        this.unWireEVents();
        super.destroy();
        this.element.classList.remove('e-smithchart');
    }
    /**
     * To bind event handlers for smithchart.
     */
    private wireEVents(): void {

        EventHandler.add(this.element, 'click', this.smithchartOnClick, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.mouseMove, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.mouseEnd, this);
        window.addEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.smithchartOnResize.bind(this)
        );

    }

    public mouseMove(e: PointerEvent): void {
        if (e.type === 'touchmove') {
            this.isTouch = true;
        } else {
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2' || this.isTouch;
        }
        if (this.tooltipRenderModule && !this.isTouch) {
        this.tooltipRenderModule.smithchartMouseMove(this, e);
        }
    }

    public mouseEnd(e: PointerEvent): void {
        if (e.type === 'touchend') {
            this.isTouch = true;
        } else {
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2';
        }
        if (this.tooltipRenderModule && this.isTouch) {
        let tooltipElement: Tooltip = this.tooltipRenderModule.smithchartMouseMove(this, e);
        if (tooltipElement) {
        this.fadeoutTo = setTimeout(
                (): void => {
                    tooltipElement.fadeOut();
                },
                2000);
        }
        }
    }

    /**
     * To handle the click event for the smithchart.
     */
     /* tslint:disable:no-string-literal */
    public smithchartOnClick(e: PointerEvent): void {
    let targetEle: Element = <Element>e.target;
    let targetId: string = targetEle.id;
    let parentElement: Element = document.getElementById(targetId).parentElement;
    let grpElement: Element = document.getElementById(parentElement.id).parentElement;
    if ( grpElement.id === 'containerlegendItem_Group' && this.legendSettings.toggleVisibility) {
        let childElement: HTMLElement = <HTMLElement>parentElement.childNodes[1];
        let circleElement: HTMLElement = <HTMLElement>parentElement.childNodes[0];
        let legendText: string = childElement.textContent;
        let seriesIndex: number;
        let fill: string;
        for (let i: number = 0; i < this.smithchartLegendModule.legendSeries.length; i++) {
            if (legendText === this.smithchartLegendModule.legendSeries[i]['text']) {
                    seriesIndex = this.smithchartLegendModule.legendSeries[i].seriesIndex;
                    fill = this.smithchartLegendModule.legendSeries[i].fill;
            }
        }
        let seriesElement: HTMLElement = <HTMLElement>document.getElementById(this.element.id + '_svg' + '_seriesCollection' + seriesIndex);
        if (seriesElement.getAttribute('visibility') === 'visible') {
            circleElement.setAttribute('fill', 'gray');
            seriesElement.setAttribute('visibility', 'hidden');
            this.series[seriesIndex].visibility = 'hidden';
        } else {
            circleElement.setAttribute('fill', fill);
            seriesElement.setAttribute('visibility', 'visible');
            this.series[seriesIndex].visibility = 'visible';
        }
        }
    }
    /**
     * To unbind event handlers from smithchart.
     */
    private unWireEVents(): void {

        EventHandler.remove(this.element, 'click', this.smithchartOnClick);
        EventHandler.remove(this.element, Browser.touchMoveEvent, this.mouseMove);
        EventHandler.remove(this.element, Browser.touchEndEvent, this.mouseEnd);
        window.removeEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.smithchartOnResize
        );
    }
    public print(id?: string[] | string | Element): void {
        let exportChart: ExportUtils = new ExportUtils(this);
        exportChart.print(id);
    }
    /**
     * Handles the export method for chart control.
     * @param type 
     * @param fileName 
     */
    public export(type: SmithchartExportType, fileName: string, orientation?: PdfPageOrientation): void {
        let exportMap: ExportUtils = new ExportUtils(this);
        exportMap.export(type, fileName, orientation);
    }
/**
 * To handle the window resize event on smithchart.
 */
    public smithchartOnResize(e: Event): boolean {

        this.animateSeries = false;
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        this.resizeTo = setTimeout(
                (): void => {
                    this.render();
                },
                500);
        return false;
    }
    /**
     * To provide the array of modules needed for smithchart rendering
     * @return {ModuleDeclaration[]}
     * @private 
     */
    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        if (this.legendSettings.visible) {
            modules.push({
                member: 'SmithchartLegend',
                args: [this]
            });
        }
        for (let i: number = 0; i < this.series.length; i++) {
        if (this.series[i].tooltip.visible) {
            modules.push({
                member: 'TooltipRender',
                args: [this]
            });
            break;
        }
        }
        return modules;
    }


    /**
     * To Remove the SVG. 
     * @return {boolean}
     * @private
     */
    public removeSvg(): void {
    removeElement(this.element.id + '_Secondary_Element');
    let removeLength: number = 0;
    if (this.svgObject) {
            while (this.svgObject.childNodes.length > removeLength) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
                remove(this.svgObject);
            }
        }
    }

}

