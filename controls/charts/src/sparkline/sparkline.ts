import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, Complex } from '@syncfusion/ej2-base';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { remove, L10n, Internationalization, Event, EmitType, ModuleDeclaration, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Browser, EventHandler, Touch, Collection } from '@syncfusion/ej2-base';
import { SparklineBorder, SparklineTooltipSettings, ContainerArea, AxisSettings, Padding, SparklineMarkerSettings } from './model/base';
import { SparklineDataLabelSettings, RangeBandSettings } from './model/base';
import { SparklineBorderModel, SparklineTooltipSettingsModel, ContainerAreaModel, AxisSettingsModel } from './model/base-model';
import { SparklineMarkerSettingsModel, SparklineDataLabelSettingsModel, RangeBandSettingsModel, PaddingModel } from './model/base-model';
import { SparklineType, SparklineValueType, SparklineRangePadding, SparklineTheme } from './model/enum';
import { Size, createSvg, RectOption, Rect, drawRectangle, getIdElement, SparkValues, withInBounds, removeElement } from './utils/helper';
import { ISparklineLoadedEventArgs, ISparklineLoadEventArgs, IDataLabelRenderingEventArgs, IPointRegionEventArgs } from './model/interface';
import { IMarkerRenderingEventArgs, ISparklinePointEventArgs, ISparklineMouseEventArgs } from './model/interface';
import { IAxisRenderingEventArgs, ISparklineResizeEventArgs, ITooltipRenderingEventArgs } from './model/interface';
import { ISeriesRenderingEventArgs, IThemes } from './model/interface';
import { SparklineRenderer } from './rendering/sparkline-renderer';
import { SparklineTooltip } from './rendering/sparkline-tooltip';
import { SparklineModel } from './sparkline-model';
import { getThemeColor } from './utils/helper';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { getElement } from '../common/utils/helper';

/**
 * Represents the Sparkline control.
 * ```html
 * <div id="sparkline"/>
 * <script>
 *   var sparkline = new Sparkline();
 *   sparkline.appendTo("#sparkline");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Sparkline extends Component<HTMLElement> implements INotifyPropertyChanged {
    // Sparkline Module declaration
    public sparklineTooltipModule: SparklineTooltip;


    // API configuration for sparkline

    /**
     * To configure Sparkline width.
     */
    @Property(null)
    public width: string;
    /**
     * To configure Sparkline height.
     */
    @Property(null)
    public height: string;
    /**
     * To configure Sparkline points border color and width.
     */
    @Complex<SparklineBorderModel>({}, SparklineBorder)
    public border: SparklineBorderModel;
    /**
     * To configure Sparkline series type.
     *
     * @default 'Line'
     */
    @Property('Line')
    public type: SparklineType;
    /**
     * To configure Sparkline series type.
     *
     * @default 'None'
     */
    @Property('None')
    public rangePadding: SparklineRangePadding;
    /**
     * To configure sparkline data source.
     *
     * @isGenericType true
     * @default null
     */
    @Property(null)
    public dataSource: Object[] | DataManager;
    /**
     * Specifies the query for filter the data.
     *
     * @default null
     */
    @Property(null)
    public query: Query;
    /**
     * To configure sparkline series value type.
     *
     * @default 'Numeric'
     */
    @Property('Numeric')
    public valueType: SparklineValueType;
    /**
     * To configure sparkline series xName.
     *
     * @default null
     */
    @Property(null)
    public xName: string;
    /**
     * To configure sparkline series yName.
     *
     * @default null
     */
    @Property(null)
    public yName: string;
    /**
     * To configure sparkline series fill.
     *
     * @default '#00bdae'
     */
    @Property('#00bdae')
    public fill: string;
    /**
     * To configure sparkline series highest y value point color.
     *
     * @default ''
     */
    @Property('')
    public highPointColor: string;
    /**
     * To configure sparkline series lowest y value point color.
     *
     * @default ''
     */
    @Property('')
    public lowPointColor: string;
    /**
     * To configure sparkline series first x value point color.
     *
     * @default ''
     */
    @Property('')
    public startPointColor: string;
    /**
     * To configure sparkline series last x value point color.
     *
     * @default ''
     */
    @Property('')
    public endPointColor: string;
    /**
     * To configure sparkline series negative y value point color.
     *
     * @default ''
     */
    @Property('')
    public negativePointColor: string;
    /**
     * To configure sparkline winloss series tie y value point color.
     *
     * @default ''
     */
    @Property('')
    public tiePointColor: string;
    /**
     * To configure sparkline series color palette. It applicable to column and pie type series.
     *
     * @default []
     */
    @Property([])
    public palette: string[];
    /**
     * To configure sparkline line series width.
     *
     * @default '1'
     */
    @Property(1)
    public lineWidth: number;
    /**
     * To configure sparkline line series opacity.
     *
     * @default '1'
     */
    @Property(1)
    public opacity: number;
    /**
     * To apply internationalization for sparkline.
     *
     * @default null
     */
    @Property(null)
    public format: string;
    /**
     * To enable the separator.
     *
     * @default false
     */
    @Property(false)
    public useGroupingSeparator: boolean;
    /**
     * To configure Sparkline tooltip settings.
     */
    @Complex<SparklineTooltipSettingsModel>({}, SparklineTooltipSettings)
    public tooltipSettings: SparklineTooltipSettingsModel;
    /**
     * To configure Sparkline container area customization.
     */
    @Complex<ContainerAreaModel>({}, ContainerArea)
    public containerArea: ContainerAreaModel;
    /**
     * To configure Sparkline axis line customization.
     */
    @Collection<RangeBandSettingsModel>([], RangeBandSettings)
    public rangeBandSettings: RangeBandSettingsModel[];
    /**
     * To configure Sparkline container area customization.
     */
    @Complex<AxisSettingsModel>({}, AxisSettings)
    public axisSettings: AxisSettingsModel;
    /**
     * To configure Sparkline marker configuration.
     */
    @Complex<SparklineMarkerSettingsModel>({}, SparklineMarkerSettings)
    public markerSettings: SparklineMarkerSettingsModel;
    /**
     * To configure Sparkline dataLabel configuration.
     */
    @Complex<SparklineDataLabelSettingsModel>({}, SparklineDataLabelSettings)
    public dataLabelSettings: SparklineDataLabelSettingsModel;
    /**
     * To configure Sparkline container area customization.
     */
    @Complex<PaddingModel>({}, Padding)
    public padding: PaddingModel;
    /**
     * To configure sparkline theme.
     *
     * @default 'Material'
     */
    @Property('Material')
    public theme: SparklineTheme;

    // sparkline events

    /**
     * Triggers after sparkline rendered.
     *
     * @event loaded
     */
    @Event()
    public loaded: EmitType<ISparklineLoadedEventArgs>;

    /**
     * Triggers before sparkline render.
     *
     * @event load
     */
    @Event()
    public load: EmitType<ISparklineLoadEventArgs>;

    /**
     * Triggers before sparkline tooltip render.
     *
     * @event tooltipInitialize
     */
    @Event()
    public tooltipInitialize: EmitType<ITooltipRenderingEventArgs>;

    /**
     * Triggers before sparkline series render.
     *
     * @event seriesRendering
     */
    @Event()
    public seriesRendering: EmitType<ISeriesRenderingEventArgs>;

    /**
     * Triggers before sparkline axis render.
     *
     * @event axisRendering
     */
    @Event()
    public axisRendering: EmitType<IAxisRenderingEventArgs>;

    /**
     * Triggers before sparkline points render.
     *
     * @event pointRendering
     */
    @Event()
    public pointRendering: EmitType<ISparklinePointEventArgs>;

    /**
     * Triggers while mouse move on the sparkline point region.
     *
     * @event pointRegionMouseMove
     */
    @Event()
    public pointRegionMouseMove: EmitType<IPointRegionEventArgs>;

    /**
     * Triggers while mouse click on the sparkline point region.
     *
     * @event pointRegionMouseClick
     */
    @Event()
    public pointRegionMouseClick: EmitType<IPointRegionEventArgs>;

    /**
     * Triggers while mouse move on the sparkline container.
     *
     * @event sparklineMouseMove
     */
    @Event()
    public sparklineMouseMove: EmitType<ISparklineMouseEventArgs>;

    /**
     * Triggers while mouse click on the sparkline container.
     *
     * @event sparklineMouseClick
     */
    @Event()
    public sparklineMouseClick: EmitType<ISparklineMouseEventArgs>;

    /**
     * Triggers before the sparkline datalabel render.
     *
     * @event dataLabelRendering
     */
    @Event()
    public dataLabelRendering: EmitType<IDataLabelRenderingEventArgs>;

    /**
     * Triggers before the sparkline marker render.
     *
     * @event markerRendering
     */
    @Event()
    public markerRendering: EmitType<IMarkerRenderingEventArgs>;
    /**
     * Triggers on resizing the sparkline.
     *
     * @event resize
     */
    @Event()
    public resize: EmitType<ISparklineResizeEventArgs>;

    // Sparkline internal properties.

    /**
     * SVG renderer object.
     *
     * @private
     */
    public renderer: SvgRenderer;
    /**
     * Sparkline renderer object.
     *
     * @private
     */
    public sparklineRenderer: SparklineRenderer;
    /**
     * Sparkline SVG element's object.
     *
     * @private
     */
    public svgObject: Element;
    /** @private */
    public isDevice: boolean = Browser.isDevice;
    /** @private */
    public intervalDivs: number[] = [10, 5, 2, 1];
    /** @private */
    public isTouch: boolean;
    /** @private */
    public mouseX: number;
    /** @private */
    public mouseY: number;
    /**
     * resize event timer.
     *
     * @private
     */
    public resizeTo: number;
    /**
     * Sparkline available height, width.
     *
     * @private
     */
    public availableSize: Size;

    /**
     * Sparkline theme support.
     *
     *  @private
     */
    public sparkTheme: IThemes;

    /**
     * localization object.
     *
     * @private
     */
    public localeObject: L10n;
    /**
     * To process sparkline data internally.
     *
     * @private
     */
    public sparklineData: Object[] | DataManager;
    /**
     * It contains default values of localization values
     */
    private defaultLocalConstants: Object;

    /**
     * Internal use of internationalization instance.
     *
     * @private
     */
    public intl: Internationalization;

    private previousTargetId: string = '';
    private currentPointIndex: number = 0;

    // Sparkline rendering starts from here.

    /**
     * Constructor for creating the Sparkline widget.
     *
     * @param {SparklineModel} options - The options to configure the Sparkline widget.
     * @param {string | HTMLElement} element - The target element to render the Sparkline widget.
     */
    constructor(options?: SparklineModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }
    /**
     * Initializing pre-required values for sparkline.
     *
     * @returns {void}
     */
    protected preRender(): void {

        this.allowServerDataBinding = false;

        this.unWireEvents();

        this.trigger('load', { sparkline: this });

        this.sparkTheme = getThemeColor(this.theme);

        this.sparklineRenderer = new SparklineRenderer(this);

        this.setTheme();

        this.createSVG();

        this.wireEvents();

        this.setCulture();
    }

    /**
     * Sparkline Elements rendering starting.
     *
     * @returns {void}
     */
    protected render(): void {
        // Sparkline rendering splitted into rendering and calculations
        this.sparklineRenderer.processDataManager();
        this.renderComplete();
        this.allowServerDataBinding = true;
    }

    /**
     * @private
     * @returns {void}
     */
    public processSparklineData(): void {
        this.sparklineRenderer.processData();
        this.renderSparkline();
        this.element.appendChild(this.svgObject);
        this.setSecondaryElementPosition();
        this.trigger('loaded', { sparkline: this });
    }
    /**
     * To render sparkline elements.
     *
     * @returns {void}
     */
    public renderSparkline(): void {
        // To render the sparkline elements

        this.renderBorder();

        this.createDiv();

        this.sparklineRenderer.renderSeries();
    }
    /**
     * Create secondary element for the tooltip.
     *
     * @returns {void}
     */
    private createDiv(): void {
        const tooltipDiv: Element = document.createElement('div');
        tooltipDiv.id = this.element.id + '_Secondary_Element';
        (tooltipDiv as HTMLElement).style.position = 'relative';
        this.element.appendChild(tooltipDiv);
        this.element.setAttribute('tabindex', '0');
        this.element.style.display = 'block';
        this.element.style.position = 'relative';
    }
    /**
     * To set the left and top position for data label template for sparkline.
     *
     * @returns {void}
     */
    private setSecondaryElementPosition(): void {
        const element: HTMLDivElement = getIdElement(this.element.id + '_Secondary_Element') as HTMLDivElement;
        if (!element) {
            return;
        }
        const rect: ClientRect = this.element.getBoundingClientRect();
        const svgRect: ClientRect = getIdElement(this.element.id + '_svg').getBoundingClientRect();
        element.style.left = Math.max(svgRect.left - rect.left, 0) + 'px';
        element.style.top = Math.max(svgRect.top - rect.top, 0) + 'px';
    }
    /**
     * Render the sparkline border.
     *
     * @private
     * @returns {void}
     */
    private renderBorder(): void {
        const width: number = this.containerArea.border.width;
        let borderRect: RectOption;
        if (width > 0 || this.containerArea.background !== 'transparent') {
            borderRect = new RectOption(
                this.element.id + '_SparklineBorder', this.sparkTheme.background, this.containerArea.border, 1,
                new Rect(width / 2, width / 2, this.availableSize.width - width, this.availableSize.height - width));
            this.svgObject.appendChild(drawRectangle(this, borderRect) as SVGRectElement);
        }
        // Used to create clip path sparkline
        const padding: PaddingModel = this.padding;
        if (this.markerSettings.visible.length) {
            padding.left = 0;
            padding.right = 0;
            padding.bottom = 0;
            padding.top = 0;
        }
        borderRect = new RectOption(
            this.element.id + '_sparkline_clip_rect', 'transparent', { color: 'transparent', width: 0 }, 1,
            new Rect(padding.left, padding.top, this.availableSize.width - (padding.left + padding.right),
                     this.availableSize.height - (padding.top + padding.bottom)));
        const clipPath: Element = this.renderer.createClipPath({ id: this.element.id + '_sparkline_clip_path' });
        drawRectangle(this, borderRect, clipPath);
        this.svgObject.appendChild(clipPath);
    }
    /**
     * To create svg element for sparkline.
     *
     * @returns {void}
     */
    private createSVG(): void {

        this.removeSvg();

        createSvg(this);
    }
    /**
     * To Remove the Sparkline SVG object.
     *
     * @returns {void}
     */
    private removeSvg(): void {
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > 0) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
                remove(this.svgObject);
            }
        }
        removeElement(this.element.id + '_Secondary_Element');
        if (this.sparklineTooltipModule) {
            this.sparklineTooltipModule.removeTooltipElements();
        }
    }

    /**
     * Method to set culture for sparkline.
     *
     * @returns {void}
     */
    private setCulture(): void {
        this.intl = new Internationalization();
        this.localeObject = new L10n(this.getModuleName(), this.defaultLocalConstants, this.locale);
    }

    /**
     * Keyboard navigation is used to set the tab theme color for the sparkline.
     *
     * @returns {void}
     */
    private setTheme(): void {
        /*! Set theme */
        this.sparkTheme = getThemeColor(this.theme);
        if (!(document.getElementById(this.element.id + 'Keyboard_sparkline_focus'))) {
            const style: HTMLStyleElement = document.createElement('style');
            style.setAttribute('id', (<HTMLElement>this.element).id + 'Keyboard_sparkline_focus');
            style.innerText = '.e-sparkline-focused:focus,' +
                'div[id*=container]:focus, path[id*=_sparkline_]:focus, circle[id*=_sparkline_]:focus {outline: none } .e-sparkline-focused:focus-visible,' +
                'div[id*=container]:focus-visible, path[id*=_sparkline_]:focus-visible, circle[id*=_sparkline_]:focus-visible {outline: 1.5px ' + this.sparkTheme.tabColor + ' solid}';
            document.body.appendChild(style);
        }
    }

    /**
     * To provide the array of modules needed for sparkline rendering.
     *
     * @returns {ModuleDeclaration[]} - The array of modules required for Sparkline rendering.
     * @private
     */
    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];

        if (this.tooltipSettings.visible || this.tooltipSettings.trackLineSettings.visible) {
            modules.push({
                member: 'SparklineTooltip',
                args: [this]
            });
        }
        return modules;
    }
    /**
     * Method to unbind events for sparkline chart.
     *
     * @returns {void}
     */
    private unWireEvents(): void {
        const cancel: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /*! UnBind the Event handler */

        EventHandler.remove(this.element, Browser.touchMoveEvent, this.sparklineMove);
        EventHandler.remove(this.element, cancel, this.sparklineMouseLeave);
        EventHandler.remove(this.element, Browser.touchEndEvent, this.sparklineMouseEnd);
        EventHandler.remove(this.element, 'keyup', this.chartKeyUp);
        EventHandler.remove(this.element, 'keydown', this.chartKeyDown);
        window.removeEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.sparklineResize
        );

    }
    /**
     * Method to bind events for the sparkline.
     *
     * @returns {void}
     */
    private wireEvents(): void {
        const cancel: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';

        /*! Bind the Event handler */
        EventHandler.add(this.element, Browser.touchMoveEvent, this.sparklineMove, this);
        EventHandler.add(this.element, 'click', this.sparklineClick, this);
        EventHandler.add(this.element, cancel, this.sparklineMouseLeave, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.sparklineMouseEnd, this);
        EventHandler.add(this.element, 'keyup', this.chartKeyUp, this);
        EventHandler.add(this.element, 'keydown', this.chartKeyDown, this);
        window.addEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.sparklineResize.bind(this)
        );

        new Touch(this.element);
    }
    /**
     * Sparkline resize event.
     *
     * @private
     * @returns {boolean} - false
     */
    public sparklineResize(): boolean {
        const args: ISparklineResizeEventArgs = {
            name: 'resize',
            previousSize: this.availableSize,
            sparkline: this,
            currentSize: new Size(0, 0)
        };
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        this.resizeTo = +setTimeout(
            (): void => {
                if (this.isDestroyed) {
                    clearTimeout(this.resizeTo);
                    return;
                }
                this.unWireEvents();
                this.createSVG();
                this.refreshing = true;
                this.wireEvents();
                args.currentSize = this.availableSize;
                this.trigger('resize', args);
                this.render();
                this.refreshing = false;
            },
            500);
        return false;
    }
    /**
     * Handles the mouse move on sparkline.
     *
     * @param {PointerEvent} e - The pointer event.
     * @returns {boolean} - false
     * @private
     */
    public sparklineMove(e: PointerEvent): boolean {
        this.setSparklineMouseXY(e);
        this.notify(Browser.touchMoveEvent, e);
        const args: ISparklineMouseEventArgs = {
            name: 'sparklineMouseMove', cancel: false,
            sparkline: this, event: e
        };
        this.trigger(args.name, args);
        const pointClick: { isPointRegion: boolean, pointIndex: number } = this.isPointRegion(e);
        if (pointClick.isPointRegion) {
            const pointArgs: IPointRegionEventArgs = {
                name: 'pointRegionMouseMove', cancel: false,
                event: e, sparkline: this,
                pointIndex: pointClick.pointIndex
            };
            this.trigger(pointArgs.name, pointArgs);
        }
        return false;
    }
    /**
     * Handles the mouse click on sparkline.
     *
     * @param {PointerEvent} e - The pointer event.
     * @returns {boolean} - false
     * @private
     */
    public sparklineClick(e: PointerEvent): boolean {
        this.setSparklineMouseXY(e);
        const args: ISparklineMouseEventArgs = {
            name: 'sparklineMouseClick', cancel: false,
            sparkline: this, event: e
        };
        this.trigger(args.name, args);
        const pointClick: { isPointRegion: boolean, pointIndex: number } = this.isPointRegion(e);
        if (pointClick.isPointRegion) {
            const pointArgs: IPointRegionEventArgs = {
                name: 'pointRegionMouseClick', cancel: false,
                event: e, sparkline: this,
                pointIndex: pointClick.pointIndex
            };
            this.trigger(pointArgs.name, pointArgs);
        }
        return false;
    }
    /**
     * To check mouse event target is point region or not.
     *
     * @param {PointerEvent} e - The pointer event.
     * @returns {{isPointRegion: boolean, pointIndex: number}} - Object containing whether the target is within a point region and the index of the point.
     */
    private isPointRegion(e: PointerEvent): { isPointRegion: boolean, pointIndex: number } {
        const startId: string = this.element.id + '_';
        const id: string[] = (e.target as Element).id.replace(startId, '').split('_');
        if (id[1] === this.type.toLowerCase()) {
            let index: number = parseInt(id[2], 10);
            if ((isNullOrUndefined(index) || isNaN(index)) && (this.type === 'Line' || this.type === 'Area')) {
                this.sparklineRenderer.visiblePoints.forEach((point: SparkValues, i: number): void => {
                    if (withInBounds(this.mouseX, this.mouseY, new Rect(point.x - 5, point.y - 5, 10, 10))) {
                        index = i; return;
                    }
                });
            }
            return { isPointRegion: true, pointIndex: index };
        }
        return { isPointRegion: false, pointIndex: null };
    }
    /**
     * Handles the mouse end.
     *
     * @param {PointerEvent} e - The pointer event.
     * @returns {boolean} - false
     * @private
     */
    public sparklineMouseEnd(e: PointerEvent): boolean {
        this.setSparklineMouseXY(e);
        this.notify(Browser.touchEndEvent, e);
        return false;
    }
    /**
     * Handles the mouse leave on sparkline.
     *
     * @param {PointerEvent} e - The pointer event.
     * @returns {boolean} - false
     * @private
     */
    public sparklineMouseLeave(e: PointerEvent): boolean {
        this.setSparklineMouseXY(e);
        this.notify(Browser.isPointer ? 'pointerleave' : 'mouseleave', e);
        return false;
    }

    /**
     * Handles the keyboard onkeydown on sparkline.
     *
     * @param {KeyboardEvent} e - The keyboard event.
     * @returns {boolean} - false
     * @private
     */
    public chartKeyDown(e: KeyboardEvent): boolean {
        let actionKey: string = '';
        if (this.tooltipSettings.visible && ((e.code === 'Tab' && this.previousTargetId.indexOf('_sparkline_') > -1) || e.code === 'Escape')) {
            actionKey = 'ESC';
        }
        if (actionKey !== '') {
            this.sparklineKeyboardNavigations(e, (e.target as HTMLElement).id, actionKey);
        }
        return false;
    }

    /**
     * Handles the keyboard onkeydown on sparkline.
     *
     * @param {KeyboardEvent} e - The keyboard event.
     * @returns {boolean} - false
     * @private
     */
    public chartKeyUp(e: KeyboardEvent): boolean {
        let actionKey: string = '';
        let targetId: string = e.target['id'];
        let groupElement: HTMLElement;
        const targetElement: HTMLElement = e.target as HTMLElement;
        const seriesElement: HTMLElement = getElement(this.element.id + '_sparkline_g') as HTMLElement;
        if (seriesElement && seriesElement.firstElementChild) {
            const firstChild: HTMLElement = seriesElement.firstElementChild as HTMLElement;
            let className: string = firstChild.getAttribute('class');
            if (className && className.indexOf('e-sparkline-focused') === -1) {
                className = className + ' e-sparkline-focused';
            } else if (!className) {
                className = 'e-sparkline-focused';
            }
            firstChild.setAttribute('class', className);
        }
        if (e.code === 'Tab') {
            if (this.previousTargetId !== '') {
                if (this.previousTargetId.indexOf('_sparkline_') > -1 && targetId.indexOf('_sparkline_') === -1) {
                    groupElement = getElement(this.element.id + '_sparkline_g') as HTMLElement;
                    this.setTabIndex(groupElement.children[this.currentPointIndex] as HTMLElement,
                                     groupElement.firstElementChild as HTMLElement);
                }
            }
            this.previousTargetId = targetId;
            actionKey = this.tooltipSettings.visible ? 'Tab' : '';
        }
        else if (e.code.indexOf('Arrow') > -1) {
            e.preventDefault();
            this.previousTargetId = targetId;
            if (targetId.indexOf('_sparkline_') > -1) {
                groupElement = targetElement.parentElement;
                let currentPoint: Element = e.target as Element;
                targetElement.removeAttribute('tabindex');
                targetElement.blur();
                if ((e.code === 'ArrowUp' || e.code === 'ArrowDown')) {
                    this.currentPointIndex += e.code === 'ArrowUp' ? 1 : -1;
                }
                if (targetId.indexOf('_marker') > -1) {
                    this.currentPointIndex = this.getActualIndex(this.currentPointIndex,
                                                                 getElement(this.element.id + '_sparkline_marker_g').childElementCount);
                    currentPoint = getElement(this.element.id + '_sparkline_marker_' +
                        this.currentPointIndex);
                }
                else if (targetId.indexOf('_column') > -1) {
                    this.currentPointIndex = this.getActualIndex(this.currentPointIndex,
                                                                 getElement(this.element.id + '_sparkline_g').childElementCount);
                    currentPoint = getElement(this.element.id + '_sparkline_column_' + this.currentPointIndex);
                }
                else if (targetId.indexOf('_winloss') > -1) {
                    this.currentPointIndex = this.getActualIndex(this.currentPointIndex,
                                                                 getElement(this.element.id + '_sparkline_g').childElementCount);
                    currentPoint = getElement(this.element.id + '_sparkline_winloss_' + this.currentPointIndex);
                }
                else if (targetId.indexOf('_pie') > -1) {
                    this.currentPointIndex = this.getActualIndex(this.currentPointIndex,
                                                                 getElement(this.element.id + '_sparkline_g').childElementCount);
                    currentPoint = getElement(this.element.id + '_sparkline_pie_' + this.currentPointIndex);
                }
                targetId = this.focusChild(currentPoint as HTMLElement);
                actionKey = this.tooltipSettings.visible ? 'ArrowMove' : '';
            }
        }
        if (actionKey !== '') {
            this.sparklineKeyboardNavigations(e, targetId, actionKey);
        }
        return false;
    }

    private sparklineKeyboardNavigations(e: KeyboardEvent, targetId: string, actionKey: string): void {
        switch (actionKey) {
        case 'Tab':
        case 'ArrowMove':
            if (targetId.indexOf('_sparkline_') > -1) {
                let pointIndex: number;
                if ((this.type.indexOf('Line') > -1) || (this.type.indexOf('Area') > -1)) {
                    pointIndex = +(targetId.split('_sparkline_')[1].split('marker_')[1]);
                }
                else if (this.type.indexOf('WinLoss') > -1) {
                    pointIndex = +(targetId.split('_sparkline_')[1].split('winloss_')[1]);
                }
                else if (this.type.indexOf('Pie') > -1) {
                    pointIndex = +(targetId.split('_sparkline_')[1].split('pie_')[1]);
                }
                else {
                    pointIndex = +(targetId.split('_sparkline_')[1].split('column_')[1]);
                }
                if (this.sparklineTooltipModule) {
                    this.sparklineTooltipModule.renderTooltip(this.sparklineRenderer.visiblePoints[pointIndex as number]);
                }
            }
            break;
        case 'ESC':
            this.sparklineTooltipModule.removeTooltipElements();
            break;
        }
    }

    private setTabIndex(previousElement: HTMLElement, currentElement: HTMLElement): void {
        if (previousElement) {
            previousElement.removeAttribute('tabindex');
        }
        if (currentElement) {
            currentElement.setAttribute('tabindex', '0');
        }
    }

    private getActualIndex(index: number, totalLength: number): number {
        return index > totalLength - 1 ? 0 : (index < 0 ? totalLength - 1 : index);
    }

    private focusChild(element: HTMLElement): string {
        element.setAttribute('tabindex', '0');
        let className: string = element.getAttribute('class');
        element.setAttribute('tabindex', '0');
        if (className && className.indexOf('e-sparkline-focused') === -1) {
            className = 'e-sparkline-focused ' + className;
        } else if (!className) {
            className = 'e-sparkline-focused';
        }
        element.setAttribute('class', className);
        element.focus();
        return element.id;
    }

    /**
     * Method to set mouse x, y from events.
     *
     * @param {PointerEvent} e - The pointer event.
     * @returns {void}
     */
    private setSparklineMouseXY(e: PointerEvent): void {
        let pageY: number;
        let pageX: number;
        if (e.type.indexOf('touch') > -1) {
            this.isTouch = true;
            const touchArg: TouchEvent = <TouchEvent & PointerEvent>e;
            pageX = touchArg.changedTouches[0].clientX;
            pageY = touchArg.changedTouches[0].clientY;
        } else {
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2';
            pageY = e.clientY;
            pageX = e.clientX;
        }
        const rect: ClientRect = this.element.getBoundingClientRect();
        const svgRect: ClientRect = getIdElement(this.element.id + '_svg').getBoundingClientRect();
        this.mouseY = (pageY - rect.top) - Math.max(svgRect.top - rect.top, 0);
        this.mouseX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
    }
    /**
     * To change rendering while property value modified.
     *
     * @private
     * @param {SparklineModel} newProp - new SparklineModel.
     * @returns {void}
     */
    public onPropertyChanged(newProp: SparklineModel): void {
        let render: boolean = false;
        let refresh: boolean = false;
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'xName':
            case 'yName':
            case 'axisSettings':
            case 'rangeBandSettings':
            case 'type':
            case 'valueType':
            case 'enableRtl':
                refresh = true;
                break;
            case 'dataSource':
                refresh = true;
                break;
            case 'border':
            case 'markerSettings':
            case 'dataLabelSettings':
            case 'tooltipSettings':
            case 'startPointColor':
            case 'highPointColor':
            case 'lowPointColor':
            case 'endPointColor':
            case 'negativePointColor':
            case 'theme':
                render = true;
                break;
            }
        }
        if (refresh) {
            this.createSVG();
            this.sparklineRenderer.processData();
            this.refreshSparkline();
        } else if (render) {
            this.createSVG();
            this.refreshSparkline();
        }
    }
    /**
     * To render sparkline series and appending.
     *
     * @returns {void}
     */
    private refreshSparkline(): void {
        // Issue fix. React had native render method. So OnProperty change used render method won't wrok.
        this.renderSparkline();
        this.element.appendChild(this.svgObject);
        this.setSecondaryElementPosition();
    }
    /**
     * Get component name.
     *
     * @returns {string} - Returns the module name.
     */
    public getModuleName(): string {
        return 'sparkline';
    }

    /**
     * Destroy the component.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.sparklineData = [];
        // let element: HTMLElement = document.getElementById(this.element.id + 'Keyboard_chart_focus');
        // if (element) { element.remove(); }
        const element: HTMLElement = document.getElementById(this.element.id + 'Keyboard_sparkline_focus');
        if (element) { element.remove(); }
        removeElement('sparklinesmeasuretext');
        if (this.element) {
            this.unWireEvents();
            super.destroy();
            this.removeSvg();
            this.svgObject = null;
        }
    }

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @private
     * @returns {string} -  The properties to be maintained in the persisted state.
     */
    public getPersistData(): string {
        return '';
    }

}
