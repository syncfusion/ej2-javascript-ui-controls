import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { StockChart } from '@syncfusion/ej2-charts';
import { Template } from '@syncfusion/ej2-angular-base';
import { StockChartSeriesCollectionDirective } from './series.directive';
import { StockChartAxesDirective } from './axes.directive';
import { StockChartRowsDirective } from './rows.directive';
import { StockChartAnnotationsDirective } from './annotations.directive';
import { StockChartSelectedDataIndexesDirective } from './selecteddataindexes.directive';
import { StockChartPeriodsDirective } from './periods.directive';
import { StockEventsDirective } from './stockevents.directive';
import { StockChartIndicatorsDirective } from './indicators.directive';

export const inputs: string[] = ['annotations','axes','background','border','chartArea','crosshair','dataSource','enableCustomRange','enablePeriodSelector','enablePersistence','enableRtl','enableSelector','exportType','height','indicatorType','indicators','isMultiSelect','isSelect','isTransposed','legendSettings','locale','margin','noDataTemplate','periods','primaryXAxis','primaryYAxis','rows','selectedDataIndexes','selectionMode','series','seriesType','stockEvents','theme','title','titleStyle','tooltip','trendlineType','width','zoomSettings'];
export const outputs: string[] = ['axisLabelRender','beforeExport','beforeIndicatorChange','crosshairLabelRender','indicatorChanged','legendClick','legendRender','load','loaded','onZooming','pointClick','pointMove','rangeChange','selectorRender','seriesRender','stockChartMouseClick','stockChartMouseDown','stockChartMouseLeave','stockChartMouseMove','stockChartMouseUp','stockEventRender','tooltipRender','dataSourceChange'];
export const twoWays: string[] = ['dataSource'];

/**
 * Stock Chart Component
 * ```html
 * <ejs-stockchart></ejs-stockchart>
 * ```
 */
@Component({
    selector: 'ejs-stockchart',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childSeries: new ContentChild(StockChartSeriesCollectionDirective),
        childAxes: new ContentChild(StockChartAxesDirective),
        childRows: new ContentChild(StockChartRowsDirective),
        childAnnotations: new ContentChild(StockChartAnnotationsDirective),
        childSelectedDataIndexes: new ContentChild(StockChartSelectedDataIndexesDirective),
        childPeriods: new ContentChild(StockChartPeriodsDirective),
        childStockEvents: new ContentChild(StockEventsDirective),
        childIndicators: new ContentChild(StockChartIndicatorsDirective),
        tooltip_template: new ContentChild('tooltipTemplate'),
        legendSettings_template: new ContentChild('legendSettingsTemplate')
    }
})
@ComponentMixins([ComponentBase])
export class StockChartComponent extends StockChart implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare axisLabelRender: any;
	declare beforeExport: any;
	declare beforeIndicatorChange: any;
	declare crosshairLabelRender: any;
	declare indicatorChanged: any;
	declare legendClick: any;
	declare legendRender: any;
	declare load: any;
	declare loaded: any;
	declare onZooming: any;
	declare pointClick: any;
	declare pointMove: any;
	declare rangeChange: any;
	declare selectorRender: any;
	declare seriesRender: any;
	declare stockChartMouseClick: any;
	declare stockChartMouseDown: any;
	declare stockChartMouseLeave: any;
	declare stockChartMouseMove: any;
	declare stockChartMouseUp: any;
	declare stockEventRender: any;
	declare tooltipRender: any;
	public declare dataSourceChange: any;
    public declare childSeries: QueryList<StockChartSeriesCollectionDirective>;
    public declare childAxes: QueryList<StockChartAxesDirective>;
    public declare childRows: QueryList<StockChartRowsDirective>;
    public declare childAnnotations: QueryList<StockChartAnnotationsDirective>;
    public declare childSelectedDataIndexes: QueryList<StockChartSelectedDataIndexesDirective>;
    public declare childPeriods: QueryList<StockChartPeriodsDirective>;
    public declare childStockEvents: QueryList<StockEventsDirective>;
    public declare childIndicators: QueryList<StockChartIndicatorsDirective>;
    public tags: string[] = ['series', 'axes', 'rows', 'annotations', 'selectedDataIndexes', 'periods', 'stockEvents', 'indicators'];

    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('ChartsLineSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsColumnSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsSplineSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsSplineAreaSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsStripLine');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsAreaSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsRangeAreaSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsTooltip');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsCrosshair');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsDateTime');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsZoom');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsDataLabel');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsSelection');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsChartAnnotation');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsHiloSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsHiloOpenCloseSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsCandleSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsSmaIndicator');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsTmaIndicator');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsEmaIndicator');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsAccumulationDistributionIndicator');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsMacdIndicator');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsAtrIndicator');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsRsiIndicator');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsMomentumIndicator');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsStochasticIndicator');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsBollingerBands');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsTrendlines');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsRangeTooltip');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsExport');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsStockLegend');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsDateTimeCategory');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsLastValueLabel');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsSeriesLabel');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }

        this.registerEvents(outputs);
        this.addTwoWay.call(this, twoWays);
        setValue('currentInstance', this, this.viewContainerRef);
        this.context  = new ComponentBase();
    }

    public ngOnInit() {
        this.context.ngOnInit(this);
    }

    public ngAfterViewInit(): void {
        this.context.ngAfterViewInit(this);
    }

    public ngOnDestroy(): void {
        this.context.ngOnDestroy(this);
    }

    public ngAfterContentChecked(): void {
        this.tagObjects[0].instance = this.childSeries;
        if (this.childAxes) {
                    this.tagObjects[1].instance = this.childAxes as any;
                }
        if (this.childRows) {
                    this.tagObjects[2].instance = this.childRows as any;
                }
        if (this.childAnnotations) {
                    this.tagObjects[3].instance = this.childAnnotations as any;
                }
        if (this.childSelectedDataIndexes) {
                    this.tagObjects[4].instance = this.childSelectedDataIndexes as any;
                }
        if (this.childPeriods) {
                    this.tagObjects[5].instance = this.childPeriods as any;
                }
        if (this.childStockEvents) {
                    this.tagObjects[6].instance = this.childStockEvents as any;
                }
        if (this.childIndicators) {
                    this.tagObjects[7].instance = this.childIndicators as any;
                }
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(StockChartComponent.prototype, 'tooltip_template');
Template()(StockChartComponent.prototype, 'legendSettings_template');


