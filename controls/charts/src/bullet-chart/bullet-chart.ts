import { Component, Property, NotifyPropertyChanges, Browser, Complex, Event, EmitType } from '@syncfusion/ej2-base';
import { EventHandler, remove, INotifyPropertyChanged, ModuleDeclaration, Collection, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Internationalization } from '@syncfusion/ej2-base';
import { SvgRenderer, Rect, Size, measureText, TextOption } from '@syncfusion/ej2-svg-base';
import { Query } from '@syncfusion/ej2-data';
import { OrientationType, TickPosition, LabelsPlacement, TextPosition, FeatureType, TargetType } from './utils/enum';
import { AnimationModel, BorderModel } from '../common/model/base-model';
import { Margin, Animation, Border } from '../common/model/base';
import { MarginModel } from '../common/model/base-model';
import { BulletChartModel } from './bullet-chart-model';
import { Data } from '../common/model/data';
import { BulletChartAxis } from './renderer/bullet-axis';
import { BulletChartTheme } from './utils/theme';
import { ScaleGroup } from './renderer/scale-render';
import { redrawElement, textElement, getElement, appendChildElement } from '../common/utils/helper';
import { BulletTooltip } from './user-interaction/tooltip';
import { RectOption, stringToNumber, ChartTheme } from '../chart/index';
import { getTitle, logBase } from '../common/utils/helper';
import { BulletTooltipSettings, Range, BulletLabelStyle, BulletDataLabel } from './model/bullet-base';
import { MajorTickLinesSettings, MinorTickLinesSettings } from './model/bullet-base';
import { BulletTooltipSettingsModel, RangeModel } from './model/bullet-base-model';
import { MajorTickLinesSettingsModel, MinorTickLinesSettingsModel } from './model/bullet-base-model';
import { BulletLabelStyleModel, BulletDataLabelModel } from './model/bullet-base-model';
import { resized } from '../common/model/constants';
import { IBulletResizeEventArgs, IBulletStyle, IBulletchartTooltipEventArgs, IBulletLoadedEventArgs } from './model/bullet-interface';
import { IFeatureBarBounds } from './model/bullet-interface';
import { getBulletThemeColor } from './utils/theme';

/**
 * bullet chart
 */
@NotifyPropertyChanges
export class BulletChart extends Component<HTMLElement> implements INotifyPropertyChanged {

    /**
     * `bulletTooltipModule` is used to manipulate and add tooltip to the feature bar.
     */
    public bulletTooltipModule: BulletTooltip;

    /**
     * The width of the bullet chart as a string accepts input as both like '100px' or '100%'.
     * If specified as '100%, bullet chart renders to the full width of its parent element.
     * @default null
     * @aspDefaultValueIgnore
     */

    @Property(null)
    public width: string;

    /**
     * The height of the bullet chart as a string accepts input both as '100px' or '100%'.
     * If specified as '100%, bullet chart renders to the full height of its parent element.
     * @default null
     * @aspDefaultValueIgnore
     */

    @Property(null)
    public height: string;

    /**
     * The locale of the bullet chart as a string.
     * @default null
     * @aspDefaultValueIgnore
     */

    @Property(null)
    public locale: string;

    /**
     * Options for customizing major tick lines.
     */

    @Complex<MajorTickLinesSettingsModel>({}, MajorTickLinesSettings)
    public majorTickLines: MajorTickLinesSettingsModel;

    /**
     * Options for customizing minor tick lines.
     */

    @Complex<MinorTickLinesSettingsModel>({}, MinorTickLinesSettings)
    public minorTickLines: MinorTickLinesSettingsModel;

    /**
     * Specifies the minimum range of an scale.
     * @default null
     */

    @Property(null)
    public minimum: number;

    /**
     * Specifies the maximum range of an scale.
     * @default null
     */

    @Property(null)
    public maximum: number;

    /**
     * Specifies the interval for an scale.
     * @default null
     */

    @Property(null)
    public interval: number;

    /**
     * specifies the interval of minor ticks
     * @default 4
     */

    @Property(4)
    public minorTicksPerInterval: number;

    /**
     * Options for customizing labels
     */

    @Complex<BulletLabelStyleModel>(BulletChartTheme.axisLabelFont, BulletLabelStyle)
    public labelStyle: BulletLabelStyleModel;

    /**
     * Options for customizing values labels
     */

    @Complex<BulletLabelStyleModel>(BulletChartTheme.axisLabelFont, BulletLabelStyle)
    public categoryLabelStyle: BulletLabelStyleModel;


    /**
     * Specifies the format of the bullet chart axis labels.
     * @default ''
     */

    @Property('')
    public labelFormat: string;

    /**
     * Specifies the title of the bullet chart.
     * @default ''
     */

    @Property('')
    public title: string;


    /**
     * Options for customizing the title styles of the bullet chart
     */
    @Complex<BulletLabelStyleModel>(BulletChartTheme.titleFont, BulletLabelStyle)
    public titleStyle: BulletLabelStyleModel;

    /**
     * Specifies the sub title of the bullet chart.
     * @default ''
     */

    @Property('')
    public subtitle: string;


    /**
     * Options for customizing the sub title styles of the bullet chart
     */
    @Complex<BulletLabelStyleModel>(BulletChartTheme.subTitleFont, BulletLabelStyle)
    public subtitleStyle: BulletLabelStyleModel;


    /**
     * Orientation of the scale
     * @default 'Horizontal'
     */
    @Property('Horizontal')
    public orientation: OrientationType;

    /**
     * Options for customizing the color and width of the chart border.
     */

    @Complex<BorderModel>({ color: '#DDDDDD', width: 0 }, Border)
    public border: BorderModel;

    /**
     * Options for customizing the tooltip of the BulletChart.
     */

    @Complex<BulletTooltipSettingsModel>({}, BulletTooltipSettings)
    public tooltip: BulletTooltipSettingsModel;

    /**
     * provides Qualitative ranges of the bullet chart.
     */
    // tslint:disable-next-line:max-line-length
    @Collection<RangeModel>([{ end: null, opacity: 1, color: '' }, { end: null, opacity: 1, color: '' }, { end: null, opacity: 1, color: '' }], Range)
    public ranges: RangeModel[];

    /**
     * specifies the axis label position of the bullet chart
     * @default 'Outside'
     */

    @Property('Outside')
    public labelPosition: LabelsPlacement;

    /**
     * specifies the tick position of the bullet chart
     * @default 'Outside'
     */

    @Property('Outside')
    public tickPosition: TickPosition;

    /**
     * Sets the title position of bullet chart.
     * @default 'Top'.
     */

    @Property('Top')
    public titlePosition: TextPosition;

    /**
     * If set to true, the axis will render at the opposite side of its default position.
     * @default false
     */

    @Property(false)
    public opposedPosition: boolean;

    /**
     * Specifies the theme for the bullet chart.
     * @default 'Material'
     */
    @Property('Material')
    public theme: ChartTheme;

    /**
     * Options for customizing animation of the feature bar.
     */

    @Complex<AnimationModel>({}, Animation)
    public animation: AnimationModel;

    /**
     * Options for customizing data label of the feature bar.
     */

    @Complex<BulletDataLabelModel>({}, BulletDataLabel)
    public dataLabel: BulletDataLabelModel;

    /**
     * default value for enableGroupSeparator
     * @default false
     */
    @Property(false)
    public enableGroupSeparator: boolean;

    /**
     *  Options to customize left, right, top and bottom margins of the bullet chart.
     */

    @Complex<MarginModel>({ top: 15, bottom: 10, left: 15, right: 15 }, Margin)
    public margin: MarginModel;

    /**
     * Options for customizing comparative bar color bullet chart
     * @default 5
     */

    @Property(5)
    public targetWidth: number;

    /**
     * Default stroke of comparative measure.
     * @default '#191919'
     */

    @Property('#191919')
    public targetColor: string;

    /**
     * Options for customizing feature bar height of the bullet chart
     * @default 6
     */

    @Property(6)
    public valueHeight: number;

    /**
     * Default stroke color of feature measure.
     * @default null
     */

    @Property(null)
    public valueFill: string;

    /**
     * Options for customizing the color and width of the feature bar border.
     */

    @Complex<BorderModel>({ color: 'transparent', width: 0 }, Border)
    public valueBorder: BorderModel;


    /**
     * default value of multiple data bullet chart.
     * @isdatamanager false
     * @default null
     */

    @Property(null)
    public dataSource: Object;

    /**
     * It defines the query for the data source.
     * @default null
     */
    @Property(null)
    public query: Query;

    /**
     * It defines the category for the data source.
     * @default null
     */
    @Property(null)
    public categoryField: string;

    /**
     * Default type on feature measure.
     * @default 'Rect'
     */

    @Property('Rect')
    public type: FeatureType;

    /**
     * The DataSource field that contains the value value.
     * @default ''
     */

    @Property('')
    public valueField: string;

    /**
     * The DataSource field that contains the target value.
     * @default ''
     */

    @Property('')
    public targetField: string;

    /**
     * The DataSource field that contains the target value.
     * @default ['Rect', 'Cross', 'Circle']
     */
    @Property(['Rect', 'Cross', 'Circle'])
    public targetTypes: TargetType[];

    /**
     * TabIndex value for the bullet chart.
     * @default 1
     */
    @Property(1)
    public tabIndex: number;

    // Event declaration section starts for bulletcharts

    /**
     * Triggers before the bulletchart tooltip is rendered.
     * @event
     */
    @Event()
    public tooltipRender: EmitType<IBulletchartTooltipEventArgs>;


    /**
     * Triggers before bullet chart load.
     * @event
     * @deprecated
     */
    @Event()
    public load: EmitType<IBulletLoadedEventArgs>;



    /** @private */
    public renderer: SvgRenderer;
    /** @private */
    public svgObject: HTMLElement;
    /** @private */
    public intl: Internationalization;
    /** @private */
    public bulletAxis: BulletChartAxis;
    /** @private */
    public scale: ScaleGroup;
    /** @private */
    public availableSize: Size;
    /** @private */
    private bulletid: number = 57726;
    /** @private */
    public delayRedraw: boolean;
    /** @private */
    public dataModule: Data;
    /** @private */
    public animateSeries: boolean = true;
    /** @private */
    public containerWidth: number;
    /** @private */
    // tslint:disable-next-line
    public resizeBound: any;
    /** @private */
    private resizeTo: number;
    /** @private */
    public containerHeight: number;
    /** @private */
    private dataCount: number;
    /** @private */
    public redraw: boolean;
    /** @private */
    private titleCollections: string[];
    /** @private */
    private subTitleCollections: string[];
    /** @private */
    public initialClipRect: Rect;
    /** @private */
    public bulletChartRect: Rect;
    /** @private */
    public mouseX: number;
    /** @private */
    public mouseY: number;
    private padding: number = 5;
    /** @private */
    public leftSize: number = 0;
    /** @private */
    public rightSize: number = 0;
    /** @private */
    public topSize: number = 0;
    /** @private */
    public bottomSize: number = 0;
    /** @private */
    public maxLabelSize: Size = new Size(0, 0);
    public maxTitleSize: Size = new Size(0, 0);
    /** @private */
    public themeStyle: IBulletStyle;
    /** @private */
    public rangeCollection: number[];
     /** @private */
    public intervalDivs: number[] = [10, 5, 2, 1];
    /** @private */
    public format: Function;
    /**
     * Constructor for creating the bullet chart
     * @hidden
     */
    constructor(options?: BulletChartModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }

    /**
     * Initialize the event handler.
     */
    protected preRender(): void {
        this.allowServerDataBinding = false;
        this.unWireEvents();
        this.initPrivateValues();
        this.setCulture();
        this.wireEvents();
    }

    /**
     * To initialize the private variables
     */
    private initPrivateValues(): void {
        this.delayRedraw = false;
        this.scale = new ScaleGroup(this);
        this.bulletAxis = new BulletChartAxis(this);
        if (this.element.id === '') {
            let collection: number = document.getElementsByClassName('e-BulletChart').length;
            this.element.id = 'BulletChart_' + this.bulletid + '_' + collection;
        }

    }

    /**
     * Method to set culture for BulletChart
     */
    private setCulture(): void {
        this.intl = new Internationalization();
    }

    /**
     * To Initialize the bullet chart rendering.
     */

    protected render(): void {

        this.trigger('load', { bulletChart: this });

        this.setTheme();

        this.createSvg(this);

        this.findRange();

        this.calculatePosition();

        this.renderBulletElements();

        this.allowServerDataBinding = true;
        this.renderComplete();

    }

    /**
     * Theming for bullet chart
     */
    private setTheme(): void {
        this.themeStyle = getBulletThemeColor(this.theme, this);
    }

    private findRange(): void {
        if (!this.minimum) {
            this.minimum = 0;
        }
        if (!this.maximum) {
            this.maximum = 0;
            for (let i: number = 0; i < this.ranges.length; i++) {
                this.maximum = this.maximum > this.ranges[i].end ? this.maximum : this.ranges[i].end;
            }
        }
        if (!this.interval) {
           this.interval = this.calculateNumericNiceInterval(this.maximum - this.minimum);
        }
    }
    protected getActualDesiredIntervalsCount(availableSize: Size): number {
        let size: number = this.orientation === 'Horizontal' ? availableSize.width : availableSize.height;
            // tslint:disable-next-line:align
            let desiredIntervalsCount: number = (this.orientation === 'Horizontal' ? 0.533 : 1) * 3;
            desiredIntervalsCount = Math.max((size * (desiredIntervalsCount / 100)), 1);
            return desiredIntervalsCount;
    }
    /**
     * Numeric Nice Interval for the axis.
     * @private
     */
    protected calculateNumericNiceInterval(delta: number): number {
        let actualDesiredIntervalsCount: number = this.getActualDesiredIntervalsCount(this.availableSize);
        let niceInterval: number = delta / actualDesiredIntervalsCount;
        let minInterval: number = Math.pow(10, Math.floor(logBase(niceInterval, 10)));
        for (let interval of this.intervalDivs) {
            let currentInterval: number = minInterval * interval;
            if (actualDesiredIntervalsCount < (delta / currentInterval)) {
                break;
            }
            niceInterval = currentInterval;
        }
        return niceInterval;
    }

    /**
     * To set the left and top position for data label template for center aligned bulletchart
     */
    private setSecondaryElementPosition(): void {
        let element: HTMLDivElement = getElement(this.element.id + '_Secondary_Element') as HTMLDivElement;
        if (!element) {
            return;
        }
        let rect: ClientRect = this.element.getBoundingClientRect();
        let svgRect: ClientRect = getElement(this.element.id + '_svg').getBoundingClientRect();
        element.style.left = Math.max(svgRect.left - rect.left, 0) + 'px';
        element.style.top = Math.max(svgRect.top - rect.top, 0) + 'px';
        element.style.position = 'relative';
    }
    /**
     * Method to create SVG element.
     */

    public createSvg(chart: BulletChart): void {
        this.removeSvg();
        chart.renderer = new SvgRenderer(chart.element.id);
        this.calculateAvailableSize(this);
        chart.svgObject = <HTMLElement>chart.renderer.createSvg({
            id: chart.element.id + '_svg',
            width: chart.availableSize.width,
            height: chart.availableSize.height
        });
        this.renderChartBackground();
    }

    /**
     * Creating a background element to the svg object
     */
    private renderChartBackground(): void {
        let rect: RectOption = new RectOption(
            this.element.id + '_ChartBorder', this.themeStyle.background,
            { width: this.border.width || 0, color: this.border.color || 'transparent' }, 1,
            new Rect(0, 0, this.availableSize.width, this.availableSize.height)
        );
        this.svgObject.appendChild(this.renderer.drawRectangle(rect) as HTMLElement);
    }


    /**
     * Rendering the bullet elements
     */
    private renderBulletElements(): void {
        let scaleGroup: Element = this.renderer.createGroup({ 'id': this.svgObject.id + '_scaleGroup' });
        this.svgObject.appendChild(scaleGroup);

        this.renderBulletChartTitle();

        this.rangeCollection = this.scale.drawScaleGroup(scaleGroup);

        let size : number = (this.orientation === 'Horizontal') ? this.initialClipRect.width : this.initialClipRect.height;

        let intervalValue: number = size / ((this.maximum - this.minimum) / this.interval);

        this.bulletAxis.renderMajorTickLines(intervalValue, scaleGroup);

        this.bulletAxis.renderMinorTickLines(intervalValue, scaleGroup);

        this.bulletAxis.renderAxisLabels(intervalValue, scaleGroup);

        this.bulletChartRect.x = (this.titlePosition === 'Left' ||
            this.titlePosition === 'Right' || this.orientation === 'Vertical') ? this.bulletChartRect.x : 0;
        let categoryWidth: number = (this.categoryField != null) ? (this.maxLabelSize.width + this.margin.left) : 0;

        let elementId: string = this.element.id;
        if (this.element.tagName !== 'g') {
            let tooltipDiv: Element = redrawElement(this.redraw, elementId + '_Secondary_Element') ||
                this.createElement('div');
            tooltipDiv.id = elementId + '_Secondary_Element';
            appendChildElement(false, this.element, tooltipDiv, this.redraw);
        }
        if (this.tooltip.enable) {
            appendChildElement(
                false, this.svgObject, this.renderer.createGroup(
                    { id: elementId + '_UserInteraction', style: 'pointer-events:none;' }
                ),
                this.redraw
            );
        }
        //this.bulletAxis.renderYAxisLabels(intervalValue, scaleGroup, this.bulletChartRect);
        this.bindData();
        this.renderDataLabel();
        //this.changeOrientation(scaleGroup);
        this.element.appendChild(this.svgObject);
        this.setSecondaryElementPosition();
    }


    /**
     * Handles the bullet chart resize.
     * @return {boolean}
     * @private
     */

    private bulletResize(e: Event): boolean {
        this.animateSeries = false;
        let arg: IBulletResizeEventArgs = {
            chart: this,
            name: resized,
            currentSize: new Size(0, 0),
            previousSize: new Size(
                this.availableSize.width,
                this.availableSize.height
            ),
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
                this.createSvg(this);
                arg.currentSize = this.availableSize;
                this.trigger(resized, arg);
                this.calculatePosition();
                this.renderBulletElements();
            },
            500);
        return false;
    }

    /**
     * Process the data values of feature and comparative measure bar
     */
    private bindData(): void {
        if (this.dataSource != null) {
            this.dataCount = (this.dataSource as object[]).length;
            this.drawMeasures(this.dataCount);
        }
    }

    /**
     * Rendering the feature and comaparative measure bars
     */
    private drawMeasures(dataCount: number): void {
        this.scale.renderFeatureBar(dataCount);
        this.scale.renderComparativeSymbol(dataCount);
    }

    /**
     * To calculate the title bounds
     */
    private calculatePosition(): void {
        let margin: MarginModel = this.margin;
        // Title Height;
        let titleHeight: number = 0;
        let subTitleHeight: number = 0;
        let titleSize: Size = new Size(0, 0);
        let padding: number = 5;
        this.titleCollections = [];
        this.subTitleCollections = [];
        let maxTitlteWidth: number = 0;
        let maxTitlteHeight: number = 0;
        let maxVerticalTitlteHeight: number = padding;
        if (this.title) {
            this.titleCollections = getTitle(this.title, this.titleStyle, this.titleStyle.maximumTitleWidth);
            titleHeight = (measureText(this.title, this.titleStyle).height * this.titleCollections.length) + padding;
            for (let titleText of this.titleCollections) {
                titleSize = measureText(titleText, this.titleStyle);
                maxTitlteWidth = titleSize.width > maxTitlteWidth ? titleSize.width : maxTitlteWidth;
                maxTitlteHeight = titleSize.height > maxTitlteHeight ? titleSize.height : maxTitlteHeight;
            }
            maxVerticalTitlteHeight += maxTitlteHeight;
            this.subTitleCollections = getTitle(this.subtitle, this.subtitleStyle, this.titleStyle.maximumTitleWidth);
            if (this.subtitle) {
                for (let subText of this.subTitleCollections) {
                    titleSize = measureText(subText, this.subtitleStyle);
                    maxTitlteWidth = titleSize.width > maxTitlteWidth ? titleSize.width : maxTitlteWidth;
                    maxTitlteHeight = titleSize.height > maxTitlteHeight ? titleSize.height : maxTitlteHeight;
                }
                subTitleHeight = (measureText(this.subtitle, this.subtitleStyle).height * this.subTitleCollections.length) +
                    padding;
                maxVerticalTitlteHeight += maxTitlteHeight;
            }
        }
        this.maxTitleSize = new Size(maxTitlteWidth, this.orientation === 'Vertical' ? maxVerticalTitlteHeight : maxTitlteHeight);
        this.maxLabelSize = this.getMaxLabelWidth(this);
        this.initialClipRect = this.getBulletBounds(
            (this.orientation === 'Vertical' ? maxVerticalTitlteHeight : maxTitlteWidth), titleHeight, subTitleHeight, margin);
        this.bulletChartRect = new Rect(
            this.initialClipRect.x, this.initialClipRect.y, this.initialClipRect.width, this.initialClipRect.height
        );
    }

    /**
     * Calculate the rect values based on title position.
     * @return {void}
     * @private
     */
    public getBulletBounds(
        maxTitlteWidth: number, titleHeight: number, subTitleHeight: number, margin: MarginModel
    ): Rect {
        let padding: number = 5;
        let rect: Rect = new Rect(0, 0, 0, 0);
        let enableRtl: boolean = this.enableRtl;
        let labelSpace: number = (this.labelPosition === this.tickPosition) ? padding : 0;
        let tickSize: number = ((this.tickPosition === 'Inside') ? 0 : (this.majorTickLines.height));
        // tslint:disable-next-line:max-line-length
        let labelSize : number = ((this.labelPosition === 'Inside') ? 0 : padding +
                                ((this.tickPosition === 'Outside')  ? 0 : (measureText(this.maximum.toString(), this.labelStyle).height)));
        let topAxisLabel: number = 0;
        let bottomAxisLabel: number = 0;
        let leftAxisLabel: number = 0;
        let rightAxisLabel: number = 0;
        let topCategory: number = 0;
        let bottomCategory: number = 0;
        let leftCategory: number = 0;
        let rightCategory: number = 0;
        let title : number = maxTitlteWidth;
        let categoryLabelSize : number;
        if (this.orientation === 'Horizontal') {
            categoryLabelSize = this.maxLabelSize.width;
            topAxisLabel = (this.opposedPosition) ? tickSize + labelSize + labelSpace : 0;
            bottomAxisLabel = (!this.opposedPosition) ? tickSize + labelSize + labelSpace : 0;
            leftCategory = ((categoryLabelSize && !enableRtl) ? (categoryLabelSize) : 0);
            leftCategory += (title && this.titlePosition === 'Left') ? padding * 3 : 0;
            rightCategory = ((categoryLabelSize && enableRtl) ? (categoryLabelSize) : 0);
            rightCategory += (title && this.titlePosition === 'Right') ? padding  : 0;
        } else {
            categoryLabelSize = this.maxLabelSize.height;
            rightAxisLabel = (this.opposedPosition) ? tickSize + labelSpace : 0;
            rightAxisLabel += (this.opposedPosition && this.labelPosition !== 'Inside') ?
            (measureText(this.maximum.toString(), this.labelStyle).width) : 0;
            leftAxisLabel = (!this.opposedPosition) ? tickSize + labelSpace : 0;
            leftAxisLabel += (!this.opposedPosition && this.labelPosition !== 'Inside') ?
            (measureText(this.maximum.toString(), this.labelStyle).width) : 0;
            topCategory = ((categoryLabelSize && enableRtl) ? (categoryLabelSize + padding) : 0);
            bottomCategory = ((categoryLabelSize && !enableRtl) ? (categoryLabelSize + padding) : 0);
        }
        switch (this.titlePosition) {
            case 'Left':
                rect.x = margin.left + title + leftCategory + leftAxisLabel;
                rect.width = this.availableSize.width - margin.right - rect.x - rightCategory - rightAxisLabel;
                rect.y = margin.top + topAxisLabel + topCategory;
                rect.height = this.availableSize.height - rect.y - margin.bottom - bottomAxisLabel - bottomCategory;
                break;
            case 'Right':
                rect.x = margin.left + leftCategory + leftAxisLabel;
                // tslint:disable-next-line:max-line-length
                rect.width = this.availableSize.width - rightAxisLabel - margin.right - rect.x - (title + padding) - rightCategory;
                rect.y = margin.top + topAxisLabel + topCategory;
                rect.height = this.availableSize.height - rect.y - margin.bottom - bottomAxisLabel - bottomCategory;
                break;
            case 'Top':
                rect.x = margin.left + leftAxisLabel + leftCategory;
                rect.width = this.availableSize.width - margin.right - rect.x - rightCategory - rightAxisLabel;
                rect.y = margin.top + (titleHeight + subTitleHeight) + topAxisLabel + topCategory;
                rect.height = this.availableSize.height - rect.y - margin.bottom - bottomAxisLabel - bottomCategory;
                break;
            case 'Bottom':
                rect.x = margin.left + leftAxisLabel + leftCategory;
                rect.y = margin.top + topAxisLabel + topCategory;
                rect.width = this.availableSize.width - margin.right - rect.x - rightCategory - rightAxisLabel;
                // tslint:disable-next-line:max-line-length
                rect.height = this.availableSize.height - rect.y - bottomCategory - margin.bottom - bottomAxisLabel - (titleHeight + subTitleHeight);
                break;
        }
        return rect;
    }


    /**
     * Calculate maximum label width for category values.
     * @return {void}
     * @private
     */
    public getMaxLabelWidth(bulletChart: BulletChart): Size {
        this.maxLabelSize = new Size(0, 0);
        if (!this.categoryField) {
            return this.maxLabelSize;
        }
        let label: Size;
        for (let i: number = 0, len: number = Object.keys(this.dataSource).length; i < len; i++) {
            label = measureText((this.dataSource[i][this.categoryField] || ''), this.categoryLabelStyle);
            if (label.width > this.maxLabelSize.width) {
                this.maxLabelSize.width = label.width;
            }
            if (label.height > this.maxLabelSize.height) {
                this.maxLabelSize.height = label.height;
            }
        }
        return this.maxLabelSize;
    }

    /**
     * To render the title of the bullet chart
     */
    private renderBulletChartTitle(): void {
        let margin: MarginModel = this.margin;
        let x: number = 0;
        let y: number = 0;
        let padding: number = 5;
        let anchor: string = 'middle';
        let transform : string = '';
        let alignment: string = this.titleStyle.textAlignment;
        let elementSize: Size = measureText(this.title, this.titleStyle);
        let subTitleSize: Size = (this.subtitle) ? measureText(this.subtitle, this.subtitleStyle) : new Size(0, 0);
        if (this.title) {
            if (this.orientation === 'Horizontal') {
            switch (this.titlePosition) {
                case 'Top':
                    x = this.findHorizontalAlignment(margin);
                    anchor = (alignment === 'Far') ? 'end' : ((alignment === 'Near') ? 'start' : 'middle');
                    y = margin.top + elementSize.height / 2 + padding;
                    break;
                case 'Bottom':
                    x = this.findHorizontalAlignment(margin);
                    anchor = (alignment === 'Far') ? 'end' : ((alignment === 'Near') ? 'start' : 'middle');
                    // tslint:disable-next-line:max-line-length
                    y = this.availableSize.height - margin.bottom - elementSize.height / 3 + padding * 2 - ((subTitleSize.height) ? subTitleSize.height + padding  : 0);
                    break;
                case 'Left':
                    anchor = 'end';
                    x = margin.left + this.maxTitleSize.width;
                    // tslint:disable-next-line:max-line-length
                    y = (this.margin.top + (this.availableSize.height) / 2 - elementSize.height / 3) - ((subTitleSize.height) ? subTitleSize.height  : 0);
                    break;
                case 'Right':
                    anchor = 'start';
                    x = (this.availableSize.width - margin.right - this.maxTitleSize.width + padding);
                    // tslint:disable-next-line:max-line-length
                    y = (this.margin.top + (this.availableSize.height) / 2 - elementSize.height / 3) - ((subTitleSize.height) ? subTitleSize.height  : 0);
                    break;
            }
        } else {
            switch (this.titlePosition) {
            case 'Top':
                    x = (this.availableSize.width) / 2 + padding * 2;
                    y =  this.margin.top + elementSize.height / 2 + padding;
                    break;
                case 'Bottom':
                    x = (this.availableSize.width) / 2;
                    // tslint:disable-next-line:max-line-length
                    y =  this.availableSize.height - this.margin.bottom - elementSize.height / 3 + padding * 2 - ((subTitleSize.height) ? subTitleSize.height + padding  : 0);
                    break;
                case 'Left':
                    y = this.findVerticalAlignment(margin);
                    anchor = (alignment === 'Far') ? 'start' : ((alignment === 'Near') ? 'end' : 'middle');
                    x = margin.left;
                    // tslint:disable-next-line:max-line-length
                    break;
                case 'Right':
                    x = (this.availableSize.width - margin.right - elementSize.height / 3);
                    anchor = (alignment === 'Far') ? 'start' : ((alignment === 'Near') ? 'end' : 'middle');
                    // tslint:disable-next-line:max-line-length
                    y = this.findVerticalAlignment(margin);
                    break;
            }
            transform = (this.titlePosition === 'Left')  ? 'rotate(-90,' + x + ',' + y + ')' :
            ((this.titlePosition === 'Right') ? 'rotate(90,' + x + ',' + y + ')' : '');
        }
            let options: TextOption = new TextOption(
                this.element.id + '_BulletChartTitle', x, y, anchor, this.titleCollections, transform, 'auto');
            let element: Element = textElement(
                this.renderer, options, this.titleStyle, this.titleStyle.color || this.themeStyle.titleFontColor, this.svgObject);
            if (element) {
                element.setAttribute('aria-label', this.title);
                element.setAttribute('tabindex', this.tabIndex.toString());
            }
            if (this.subtitle) {
                this.renderBulletChartSubTitle(x, y, anchor, options);
            }
        }
    }
    /**
     * To render the data label for bullet chart
     */
    private renderDataLabel(): void {
        let x: number = 0;
        let y: number = 0;
        let elementSpacing: number = 10;
        let anchor: string;
        let transform : string = '';
        let enableRtl: boolean = this.enableRtl;
        let data: Object;
        let featureBounds : IFeatureBarBounds;
        let format: string = this.labelFormat ? this.labelFormat : '';
        let isCustomFormat: boolean = format.match('{value}') !== null;
        if (this.dataLabel.enable) {
            for (let i: number = 0, len: number = Object.keys(this.dataSource).length; i < len; i++) {
                data = this.dataSource[i];
                featureBounds = this.scale.featureBarBounds[i];
                let labelText: string = (data[this.valueField]).toString();
                this.format = this.intl.getNumberFormat({
                    format: isCustomFormat ? '' : format, useGrouping: this.enableGroupSeparator
                });
                labelText = isCustomFormat ? format.replace('{value}', this.format(labelText)) : labelText;
                let labelSize: Object = measureText(labelText, this.dataLabel.labelStyle);
                // tslint:disable:no-string-literal
                let textWidth: number = labelSize['width'];
                let textHeight: number = labelSize['height'];
                if (this.orientation === 'Horizontal') {
                    anchor = this.type === 'Rect' ? 'end' : (enableRtl ? 'end' : 'start');
                    x = featureBounds.x + (enableRtl ? (this.type === 'Rect' ? textWidth + elementSpacing : -elementSpacing) :
                    featureBounds.width) + (this.type === 'Rect' ? -elementSpacing / 2 : elementSpacing / 2);
                    y = featureBounds.y + featureBounds.height / 2;
                } else {
                    anchor = 'middle';
                    x = featureBounds.y + featureBounds.height / 2;
                    y = featureBounds.x + (enableRtl ? featureBounds.width + ( this.type === 'Rect' ? -textHeight : textHeight) : 0) +
                        (this.type === 'Rect' ? elementSpacing : -elementSpacing);
                }
                let labelOptions: TextOption = new TextOption(
                    this.element.id + '_DataLabel_' + i,
                    x, y, anchor, labelText, transform, 'middle');
                let label: Element = textElement(
                    this.renderer, labelOptions, this.dataLabel.labelStyle,
                    this.dataLabel.labelStyle.color || this.themeStyle.dataLabelFontColor, this.svgObject);
            }
        }
    }
    private findHorizontalAlignment(margin: MarginModel): number {
        let x: number = 0;
        switch (this.titleStyle.textAlignment) {
            case 'Center':
                x = (this.availableSize.width - margin.left - margin.right) / 2;
                break;
            case 'Near':
                x = margin.left;
                break;
            case 'Far':
                x = this.availableSize.width - margin.right;
                break;
        }
        return x;
    }
    private findVerticalAlignment(margin: MarginModel): number {
        let y: number = 0;
        switch (this.titleStyle.textAlignment) {
            case 'Center':
                y = (this.availableSize.height - margin.top - margin.bottom) / 2;
                break;
            case 'Near':
                y = margin.top;
                break;
            case 'Far':
                y = this.availableSize.height - margin.bottom;
                break;
        }
        return y;
    }


    /**
     * To render the sub title of the bullet chart
     */
    private renderBulletChartSubTitle(x: number, y: number, anchor: string, options: TextOption): void {
        let margin: MarginModel = this.margin;
        let padding: number = 5;
        let transform : string = '';
        let elementSize: Size = measureText(this.subtitle, this.subtitleStyle);
        if (this.orientation === 'Horizontal') {
            switch (this.titlePosition) {
                case 'Top':
                    y = y + elementSize.height + padding / 2;
                    break;
                case 'Bottom':
                    y = this.availableSize.height - margin.bottom - elementSize.height / 3 + padding;
                    break;
                case 'Left':
                    y = y + elementSize.height + padding / 2;
                    break;
                case 'Right':
                    y = y + elementSize.height + padding / 2;
                    break;
            }
        } else {
            switch (this.titlePosition) {
                case 'Top':
                    y = y + elementSize.height + padding / 2;
                    break;
                case 'Bottom':
                        y = this.availableSize.height - margin.bottom - elementSize.height / 3 + padding;
                    break;
                case 'Left':
                    x += elementSize.height + padding / 2;
                    break;
                case 'Right':
                    x -= elementSize.height + padding / 2;
                    break;
            }
            transform = (this.titlePosition === 'Left')  ? 'rotate(-90,' + x + ',' + y + ')' :
            ((this.titlePosition === 'Right') ? 'rotate(90,' + x + ',' + y + ')' : '');
        }
        let subTitleOptions: TextOption = new TextOption(
            this.element.id + '_BulletChartSubTitle', x, y, anchor, this.subTitleCollections, transform, 'auto');
        let element: Element = textElement(
            this.renderer, subTitleOptions, this.subtitleStyle,
            this.subtitleStyle.color || this.themeStyle.subTitleFontColor, this.svgObject
            );
        if (element) {
            element.setAttribute('aria-label', this.title);
            element.setAttribute('tabindex', this.tabIndex.toString());
        }
    }

    /**
     * To calculate the available size and width of the container
     */

    private calculateAvailableSize(bulletChart: BulletChart): void {
        let containerWidth: number = this.element.clientWidth || this.element.offsetWidth || 200;
        // tslint:disable-next-line:max-line-length
        let height : number = (this.orientation === 'Vertical') ? 450 : ((this.titlePosition === 'Left' || this.titlePosition === 'Right') ? 83 : 126);
        let containerHeight: number = this.element.clientHeight || height;
        bulletChart.availableSize = new Size(
            stringToNumber(bulletChart.width, containerWidth) || containerWidth,
            stringToNumber(bulletChart.height, containerHeight) || containerHeight
        );
    }


    public removeSvg(): void {
        let svgElement: HTMLElement = document.getElementById(this.element.id + '_svg');
        if (svgElement) {
            remove(svgElement);
        }
    }

    protected getPersistData(): string {
        let keyEntity: string[] = ['loaded'];
        return this.addOnPersist(keyEntity);
    }

    /** Wire, UnWire and Event releated calculation Started here */

    /**
     * Method to un-bind events for bullet chart
     */
    private unWireEvents(): void {
        /*! Find the Events type */
        let startEvent: string = Browser.touchStartEvent;
        let moveEvent: string = Browser.touchMoveEvent;
        let stopEvent: string = Browser.touchEndEvent;
        let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /*! UnBind the Event handler */

        EventHandler.remove(this.element, startEvent, this.bulletMouseDown);
        EventHandler.remove(this.element, moveEvent, this.bulletMouseMove);
        EventHandler.remove(this.element, cancelEvent, this.bulletMouseLeave);

        window.removeEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.resizeBound
        );

    }

    /**
     * Method to bind events for bullet chart
     */
    private wireEvents(): void {
        let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /*! Bind the Event handler */
        EventHandler.add(this.element, Browser.touchMoveEvent, this.bulletMouseMove, this);
        EventHandler.add(this.element, cancelEvent, this.bulletMouseLeave, this);
        EventHandler.add(this.element, Browser.touchStartEvent, this.bulletMouseDown, this);
        this.resizeBound = this.bulletResize.bind(this);
        window.addEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.resizeBound
        );
        /*! Apply the style for chart */
        this.setStyle(<HTMLElement>this.element);
    }

    private setStyle(element: HTMLElement): void {
        element.style.position = 'relative';
        element.style.display = 'block';
    }

    /**
     * Handles the mouse move on the bullet chart.
     * @return {boolean}
     * @private
     */
    private bulletMouseMove(e: PointerEvent): void {
        let pageX: number;
        let pageY: number;
        pageX = e.clientX;
        pageY = e.clientY;
        this.setPointMouseXY(pageX, pageY);
        let targetId: string;
        let targetClass: string;
        targetId = (e.target as Element).id;
        /* tslint:disable:no-string-literal */
        targetClass = (e.target as Element).className['baseVal'];
        /* tslint:enable:no-string-literal */
        if (targetClass !== this.svgObject.id + '_FeatureMeasure' || this.svgObject.id + '_ComparativeMeasure') {
            if (!isNullOrUndefined(this.dataSource)) {
                for (let i: number = 0; i < Object.keys(this.dataSource).length; i++) {
                    document.getElementById(this.svgObject.id + '_FeatureMeasure_' + i).setAttribute('opacity', '1');
                    document.getElementById(this.svgObject.id + '_ComparativeMeasure_' + i).setAttribute('opacity', '1');
                }
            }
        }
        if (!this.isTouch(e)) {
            let id: string = 'tooltipDiv' + this.element.id;
            let tooltipDiv: Element = document.getElementById(id);
            if (tooltipDiv) {
                remove(tooltipDiv);
            }
            if (this.bulletTooltipModule) {
                this.bulletTooltipModule._elementTooltip(e, targetClass, targetId, this.mouseX, this.mouseY);
                this.bulletTooltipModule._displayTooltip(e, targetClass, targetId, this.mouseX, this.mouseY);
            }
        }
    }
    /**
     * To find mouse x, y for aligned bullet chart element svg position
     */
    private setPointMouseXY(pageX: number, pageY: number): void {
        let svgClientRect: ClientRect = getElement(this.svgObject.id).getBoundingClientRect();
        let elemntClientRect: ClientRect = this.element.getBoundingClientRect();
        this.mouseX = (pageX - elemntClientRect.left) - Math.max(svgClientRect.left - elemntClientRect.left, 0);
        this.mouseY = (pageY - elemntClientRect.top) - Math.max(svgClientRect.top - elemntClientRect.top, 0);
    }
    /**
     * Handles the mouse leave on the bullet chart.
     * @return {boolean}
     * @private
     */
    public bulletMouseLeave(e: PointerEvent): void {
        if (!this.isTouch(e)) {
            let tooltipDiv: HTMLElement = document.getElementById('.tooltipDiv' + this.element.id);
            if (tooltipDiv) {
                remove(tooltipDiv);
            }
        }
    }

    /**
     * Handles the touch event.
     * @return {boolean}
     * @private
     */
    private isTouch(event: PointerEvent): boolean {
        if ((event.pointerType === 'touch') || (event.type.indexOf('touch') > -1)) {
            return true;
        }
        return false;
    }
    /**
     * Handles the mouse down on the bullet chart.
     * @return {boolean}
     * @private
     */
    private bulletMouseDown(e: PointerEvent): void {
        if (this.isTouch(e)) {
            remove(document.getElementById(('tooltipDiv' + this.element.id)));
            let targetId: string = (e.target as Element).id;
            /* tslint:disable:no-string-literal */
            let targetClass: string = (e.target as Element).className['baseVal'];
            if (this.bulletTooltipModule) {
                this.bulletTooltipModule._elementTooltip(e, targetClass, targetId, this.mouseX, this.mouseY);
                this.bulletTooltipModule._displayTooltip(e, targetClass, targetId, this.mouseX, this.mouseY);
            }
        }
    }

    /**
     * Called internally if any of the property value changed.
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    public onPropertyChanged(newProp: BulletChartModel, oldProp: BulletChartModel): void {
        let renderer: boolean = false;
        let refreshBounds: boolean = false;
        let refreshRange: boolean = false;
        this.animateSeries = false;
        if (!this.delayRedraw) {
            for (let prop of Object.keys(newProp)) {
                switch (prop) {
                    case 'height':
                    case 'width':
                        this.createSvg(this);
                        refreshBounds = true;
                        break;
                    case 'subtitle':
                    case 'title':
                        refreshBounds = true;
                        break;
                    case 'tickPosition':
                        renderer = true;
                        break;
                    case 'labelPosition':
                        renderer = true;
                        break;
                    case 'titlePosition':
                        renderer = true;
                        break;
                    case 'minimum':
                    case 'maximum':
                    case 'interval':
                        refreshBounds = true;
                        break;
                    case 'majorTickLines':
                    case 'minorTickLines':
                    case 'type':
                    case 'ranges':
                    case 'valueFill':
                    case 'targetColor':
                        refreshBounds = true;
                        break;
                    case 'titleStyle':
                        if (newProp.titleStyle) {
                            refreshBounds = true;
                        } else {
                            renderer = true;
                        }
                        break;
                    case 'subtitleStyle':
                        if (newProp.subtitleStyle && (newProp.subtitleStyle.size || newProp.subtitleStyle.textOverflow)) {
                            refreshBounds = true;
                        } else {
                            renderer = true;
                        }
                        break;
                    case 'border':
                        renderer = true;
                        break;
                    case 'opposedPosition':
                        renderer = true;
                        break;
                    case 'dataSource':
                        this.bindData();
                        refreshBounds = true;
                        break;
                    case 'theme':
                        this.animateSeries = true; break;
                    case 'locale':
                    case 'currencyCode':
                        super.refresh(); break;
                }
            }
            if (!refreshBounds && renderer) {
                this.removeSvg();
                this.renderBulletElements();
                this.trigger('loaded', { BulletChart: this });
            }
            if (refreshBounds) {
                this.render();
                this.trigger('loaded', { BulletChart: this });
                this.redraw = false;
            }
        }
    }

    /**
     * To provide the array of modules needed for bullet chart rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        if (this.tooltip.enable) {
            modules.push({
                member: 'BulletTooltip',
                args: [this]
            });
        }
        return modules;
    }

    public getModuleName(): string {
        return 'bulletChart';
    }

    /**
     * To destroy the widget
     * @method destroy
     * @return {void}.
     * @member of BulletChart
     */

    public destroy(): void {
        this.unWireEvents();
        super.destroy();
        this.removeSvg();
        this.svgObject = null;
        this.element.classList.remove('e-BulletChart');
    }

}