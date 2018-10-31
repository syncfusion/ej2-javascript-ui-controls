import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, Complex, SvgRenderer } from '@syncfusion/ej2-base';
import { remove, L10n, Internationalization, Event, EmitType, ModuleDeclaration, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Browser, EventHandler, Touch, Collection } from '@syncfusion/ej2-base';
import { SparklineBorder, SparklineTooltipSettings, ContainerArea, AxisSettings, Padding, SparklineMarkerSettings } from './model/base';
import { SparklineDataLabelSettings, RangeBandSettings } from './model/base';
import { SparklineBorderModel, SparklineTooltipSettingsModel, ContainerAreaModel, AxisSettingsModel } from './model/base-model';
import { SparklineMarkerSettingsModel, SparklineDataLabelSettingsModel, RangeBandSettingsModel, PaddingModel } from './model/base-model';
import { SparklineType, SparklineValueType, SparklineTheme } from './model/enum';
import { Size, createSvg, RectOption, Rect, drawRectangle, getIdElement, SparkValues, withInBounds, removeElement } from './utils/helper';
import { ISparklineLoadedEventArgs, ISparklineLoadEventArgs, IDataLabelRenderingEventArgs, IPointRegionEventArgs } from './model/interface';
import { IMarkerRenderingEventArgs, ISparklinePointEventArgs, ISparklineMouseEventArgs } from './model/interface';
import { IAxisRenderingEventArgs, ISparklineResizeEventArgs, ITooltipRenderingEventArgs } from './model/interface';
import { ISeriesRenderingEventArgs } from './model/interface';
import { SparklineRenderer } from './rendering/sparkline-renderer';
import { SparklineTooltip } from './rendering/sparkline-tooltip';
import { SparklineModel } from './sparkline-model';

//tslint:disable: no-duplicate-lines
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
     * @default 'Line'
     */
    @Property('Line')
    public type: SparklineType;
    /**
     * To configure sparkline data source.
     * @default []
     */
    @Property([])
    public dataSource: Object[];
    /**
     * To configure sparkline series value type.
     * @default 'Numeric'
     */
    @Property('Numeric')
    public valueType: SparklineValueType;
    /**
     * To configure sparkline series xName.
     * @default null
     */
    @Property(null)
    public xName: string;
    /**
     * To configure sparkline series yName.
     * @default null
     */
    @Property(null)
    public yName: string;
    /**
     * To configure sparkline series fill.
     * @default '#00bdae'
     */
    @Property('#00bdae')
    public fill: string;
    /**
     * To configure sparkline series highest y value point color.
     * @default ''
     */
    @Property('')
    public highPointColor: string;
    /**
     * To configure sparkline series lowest y value point color.
     * @default ''
     */
    @Property('')
    public lowPointColor: string;
    /**
     * To configure sparkline series first x value point color.
     * @default ''
     */
    @Property('')
    public startPointColor: string;
    /**
     * To configure sparkline series last x value point color.
     * @default ''
     */
    @Property('')
    public endPointColor: string;
    /**
     * To configure sparkline series negative y value point color.
     * @default ''
     */
    @Property('')
    public negativePointColor: string;
    /**
     * To configure sparkline winloss series tie y value point color.
     * @default ''
     */
    @Property('')
    public tiePointColor: string;
    /**
     * To configure sparkline series color palette. It applicable to column and pie type series.
     * @default []
     */
    @Property([])
    public palette: string[];
    /**
     * To configure sparkline line series width.
     * @default '1'
     */
    @Property(1)
    public lineWidth: number;
    /**
     * To configure sparkline line series opacity.
     * @default '1'
     */
    @Property(1)
    public opacity: number;
    /**
     * To apply internationalization for sparkline.
     * @default null
     */
    @Property(null)
    public format: string;
    /**
     * To enable the separator
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
     * @default 'Material'
     */
    @Property('Material')
    public theme: SparklineTheme;

    // sparkline events

    /**
     * Triggers after sparkline rendered.
     * @event
     */
    @Event()
    public loaded: EmitType<ISparklineLoadedEventArgs>;

    /**
     * Triggers before sparkline render.
     * @event
     */
    @Event()
    public load: EmitType<ISparklineLoadEventArgs>;

    /**
     * Triggers before sparkline tooltip render.
     * @event
     */
    @Event()
    public tooltipInitialize: EmitType<ITooltipRenderingEventArgs>;

    /**
     * Triggers before sparkline series render.
     * @event
     */
    @Event()
    public seriesRendering: EmitType<ISeriesRenderingEventArgs>;

    /**
     * Triggers before sparkline axis render.
     * @event
     */
    @Event()
    public axisRendering: EmitType<IAxisRenderingEventArgs>;

    /**
     * Triggers before sparkline points render.
     * @event
     */
    @Event()
    public pointRendering: EmitType<ISparklinePointEventArgs>;

    /**
     * Triggers while mouse move on the sparkline point region.
     * @event
     */
    @Event()
    public pointRegionMouseMove: EmitType<IPointRegionEventArgs>;

    /**
     * Triggers while mouse click on the sparkline point region.
     * @event
     */
    @Event()
    public pointRegionMouseClick: EmitType<IPointRegionEventArgs>;

    /**
     * Triggers while mouse move on the sparkline container.
     * @event
     */
    @Event()
    public sparklineMouseMove: EmitType<ISparklineMouseEventArgs>;

    /**
     * Triggers while mouse click on the sparkline container.
     * @event
     */
    @Event()
    public sparklineMouseClick: EmitType<ISparklineMouseEventArgs>;

    /**
     * Triggers before the sparkline datalabel render.
     * @event
     */
    @Event()
    public dataLabelRendering: EmitType<IDataLabelRenderingEventArgs>;

    /**
     * Triggers before the sparkline marker render.
     * @event
     */
    @Event()
    public markerRendering: EmitType<IMarkerRenderingEventArgs>;
    /**
     * Triggers on resizing the sparkline.
     * @event
     */
    @Event()
    public resize: EmitType<ISparklineResizeEventArgs>;

    // sparkline internal properties

    /**
     * svg renderer object.
     * @private
     */
    public renderer: SvgRenderer;
    /**
     * sparkline renderer object.
     * @private
     */
    public sparklineRenderer: SparklineRenderer;
    /**
     * sparkline svg element's object
     * @private
     */
    public svgObject: Element;
    /** @private */
    public isDevice: Boolean = Browser.isDevice;
    /** @private */
    public isTouch: Boolean;
    /** @private */
    public mouseX: number;
    /** @private */
    public mouseY: number;
    /**
     * resize event timer
     * @private
     */
    public resizeTo: number;
    /**
     * Sparkline available height, width
     * @private
     */
    public availableSize: Size;

    /**
     * localization object 
     * @private
     */
    public localeObject: L10n;
    /**
     * To process sparkline data internally.
     * @private
     */
    public sparklineData: Object[];
    /**
     * It contains default values of localization values
     */
    private defaultLocalConstants: Object;

    /**
     * Internal use of internationalization instance.
     * @private
     */
    public intl: Internationalization;

    // Sparkline rendering starts from here.

    /**
     * Constructor for creating the Sparkline widget
     */
    constructor(options?: SparklineModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }
    /**
     * Initializing pre-required values for sparkline.
     */
    protected preRender(): void {
        this.unWireEvents();

        this.trigger('load', { sparkline: this });

        this.sparklineRenderer = new SparklineRenderer(this);

        this.createSVG();

        this.wireEvents();

        this.setCulture();
    }

    /**
     * Sparkline Elements rendering starting.
     */
    protected render(): void {
        // Sparkline rendering splitted into rendering and calculations

        this.sparklineRenderer.processData();

        this.renderSparkline();

        this.element.appendChild(this.svgObject);

        this.setSecondaryElementPosition();

        this.trigger('loaded', { sparkline: this });
    }
    /**
     * To render sparkline elements
     */
    public renderSparkline(): void {
        // To render the sparkline elements

        this.renderBorder();

        this.createDiv();

        this.sparklineRenderer.renderSeries();
    }
    /**
     * Create secondary element for the tooltip
     */
    private createDiv(): void {
        let tooltipDiv: Element = document.createElement('div');
        tooltipDiv.id = this.element.id + '_Secondary_Element';
        tooltipDiv.setAttribute('style', 'position: relative');
        this.element.appendChild(tooltipDiv);
        this.element.style.display = 'block';
        this.element.style.position = 'relative';
    }
    /**
     * To set the left and top position for data label template for sparkline
     */
    private setSecondaryElementPosition(): void {
        let element: HTMLDivElement = getIdElement(this.element.id + '_Secondary_Element') as HTMLDivElement;
        if (!element) {
            return;
        }
        let rect: ClientRect = this.element.getBoundingClientRect();
        let svgRect: ClientRect = getIdElement(this.element.id + '_svg').getBoundingClientRect();
        element.style.left = Math.max(svgRect.left - rect.left, 0) + 'px';
        element.style.top = Math.max(svgRect.top - rect.top, 0) + 'px';
    }
    /**
     * @private
     * Render the sparkline border
     */
    private renderBorder(): void {
        let width: number = this.containerArea.border.width;
        let borderRect: RectOption;
        if (width > 0 || this.containerArea.background !== 'transparent') {
            borderRect = new RectOption(
                this.element.id + '_SparklineBorder', this.containerArea.background, this.containerArea.border, 1,
                new Rect(width / 2, width / 2, this.availableSize.width - width, this.availableSize.height - width));
            this.svgObject.appendChild(drawRectangle(this, borderRect) as SVGRectElement);
        }
        // Used to create clip path sparkline
        let padding: PaddingModel = this.padding;
        borderRect = new RectOption(
            this.element.id + '_sparkline_clip_rect', 'transparent', { color: 'transparent', width: 0 }, 1,
            new Rect(padding.left, padding.top, this.availableSize.width - (padding.left + padding.right),
                     this.availableSize.height - (padding.top + padding.bottom)));
        let clipPath: Element = this.renderer.createClipPath({ id: this.element.id + '_sparkline_clip_path' });
        drawRectangle(this, borderRect, clipPath);
        this.svgObject.appendChild(clipPath);
    }
    /**
     * To create svg element for sparkline
     */
    private createSVG(): void {

        this.removeSvg();

        createSvg(this);
    }
    /**
     * To Remove the Sparkline SVG object
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
     * Method to set culture for sparkline
     */
    private setCulture(): void {
        this.intl = new Internationalization();
        this.localeObject = new L10n(this.getModuleName(), this.defaultLocalConstants, this.locale);
    }

    /**
     * To provide the array of modules needed for sparkline rendering
     * @return {ModuleDeclaration[]}
     * @private 
     */
    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];

        if (this.tooltipSettings.visible || this.tooltipSettings.trackLineSettings.visible) {
            modules.push({
                member: 'SparklineTooltip',
                args: [this]
            });
        }
        return modules;
    }
    /**
     * Method to unbind events for sparkline chart
     */
    private unWireEvents(): void {
        let move: string = Browser.touchMoveEvent;
        let cancel: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /*! UnBind the Event handler */

        EventHandler.remove(this.element, Browser.touchMoveEvent, this.sparklineMove);
        EventHandler.remove(this.element, cancel, this.sparklineMouseLeave);
        EventHandler.remove(this.element, Browser.touchEndEvent, this.sparklineMouseEnd);
        window.removeEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.sparklineResize
        );

    }
    /**
     * Method to bind events for the sparkline
     */
    private wireEvents(): void {
        let cancel: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';

        /*! Bind the Event handler */
        EventHandler.add(this.element, Browser.touchMoveEvent, this.sparklineMove, this);
        EventHandler.add(this.element, 'click', this.sparklineClick, this);
        EventHandler.add(this.element, cancel, this.sparklineMouseLeave, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.sparklineMouseEnd, this);
        window.addEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.sparklineResize.bind(this)
        );

        new Touch(this.element);
    }
    /**
     * Sparkline resize event.
     * @private
     */
    public sparklineResize(e: Event): boolean {
        let args: ISparklineResizeEventArgs = {
            name: 'resize',
            previousSize: this.availableSize,
            sparkline: this,
            currentSize: new Size(0, 0)
        };
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        this.resizeTo = setTimeout(
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
            },
            500);
        return false;
    }
    /**
     * Handles the mouse move on sparkline. 
     * @return {boolean}
     * @private
     */
    public sparklineMove(e: PointerEvent): boolean {
        this.setSparklineMouseXY(e);
        this.notify(Browser.touchMoveEvent, e);
        let args: ISparklineMouseEventArgs = {
            name: 'sparklineMouseMove', cancel: false, sparkline: this, event: e
        };
        this.trigger(args.name, args);
        let pointClick: { isPointRegion: boolean, pointIndex: number } = this.isPointRegion(e);
        if (pointClick.isPointRegion) {
            let pointArgs: IPointRegionEventArgs = {
                name: 'pointRegionMouseMove', cancel: false, event: e, sparkline: this, pointIndex: pointClick.pointIndex
            };
            this.trigger(pointArgs.name, pointArgs);
        }
        return false;
    }
    /**
     * Handles the mouse click on sparkline. 
     * @return {boolean}
     * @private
     */
    public sparklineClick(e: PointerEvent): boolean {
        this.setSparklineMouseXY(e);
        let args: ISparklineMouseEventArgs = {
            name: 'sparklineMouseClick', cancel: false, sparkline: this, event: e
        };
        this.trigger(args.name, args);
        let pointClick: { isPointRegion: boolean, pointIndex: number } = this.isPointRegion(e);
        if (pointClick.isPointRegion) {
            let pointArgs: IPointRegionEventArgs = {
                name: 'pointRegionMouseClick', cancel: false, event: e, sparkline: this, pointIndex: pointClick.pointIndex
            };
            this.trigger(pointArgs.name, pointArgs);
        }
        return false;
    }
    /**
     * To check mouse event target is point region or not.
     */
    private isPointRegion(e: PointerEvent): { isPointRegion: boolean, pointIndex: number } {
        let startId: string = this.element.id + '_';
        let id: string[] = (e.target as Element).id.replace(startId, '').split('_');
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
     * @return {boolean}
     * @private
     */
    public sparklineMouseEnd(e: PointerEvent): boolean {
        this.setSparklineMouseXY(e);
        this.notify(Browser.touchEndEvent, e);
        return false;
    }
    /**
     * Handles the mouse leave on sparkline. 
     * @return {boolean}
     * @private
     */
    public sparklineMouseLeave(e: PointerEvent): boolean {
        this.setSparklineMouseXY(e);
        this.notify(Browser.isPointer ? 'pointerleave' : 'mouseleave', e);
        return false;
    }

    /**
     * Method to set mouse x, y from events
     */
    private setSparklineMouseXY(e: PointerEvent): void {
        let pageY: number;
        let pageX: number;
        if (e.type.indexOf('touch') > -1) {
            this.isTouch = true;
            let touchArg: TouchEvent = <TouchEvent & PointerEvent>e;
            pageX = touchArg.changedTouches[0].clientX;
            pageY = touchArg.changedTouches[0].clientY;
        } else {
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2';
            pageY = e.clientY;
            pageX = e.clientX;
        }
        let rect: ClientRect = this.element.getBoundingClientRect();
        let svgRect: ClientRect = getIdElement(this.element.id + '_svg').getBoundingClientRect();
        this.mouseY = (pageY - rect.top) - Math.max(svgRect.top - rect.top, 0);
        this.mouseX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
    }
    /**
     * To change rendering while property value modified.
     * @private
     */
    public onPropertyChanged(newProp: SparklineModel, oldProp: SparklineModel): void {
        let render: boolean = false;
        let refresh: boolean = false;
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'xName':
                case 'yName':
                case 'dataSource':
                case 'axisSettings':
                case 'type':
                case 'valueType':
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
     */
    private refreshSparkline(): void {
        // Issue fix. React had native render method. So OnProperty change used render method won't wrok. 
        this.renderSparkline();
        this.element.appendChild(this.svgObject);
        this.setSecondaryElementPosition();
    }
    /**
     * Get component name
     */
    public getModuleName(): string {
        return 'sparkline';
    }

    /**
     * Destroy the component
     */
    public destroy(): void {
        super.destroy();
    }

    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    public getPersistData(): string {
        return '';
    }

}