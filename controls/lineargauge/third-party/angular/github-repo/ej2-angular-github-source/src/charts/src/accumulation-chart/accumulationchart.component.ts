import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { AccumulationChart } from '@syncfusion/ej2-charts';
import { Template } from '@syncfusion/ej2-angular-base';
import { AccumulationSeriesCollectionDirective } from './series.directive';
import { AccumulationAnnotationsDirective } from './annotations.directive';

export const inputs: string[] = ['accessibility','allowExport','annotations','background','backgroundImage','border','center','centerLabel','currencyCode','dataSource','enableAnimation','enableBorderOnMouseMove','enableExport','enableHtmlSanitizer','enablePersistence','enableRtl','enableSmartLabels','focusBorderColor','focusBorderMargin','focusBorderWidth','height','highlightColor','highlightMode','highlightPattern','isMultiSelect','legendSettings','locale','margin','noDataTemplate','selectedDataIndexes','selectionMode','selectionPattern','series','subTitle','subTitleStyle','theme','title','titleStyle','tooltip','useGroupingSeparator','width'];
export const outputs: string[] = ['afterExport','animationComplete','annotationRender','beforeExport','beforePrint','beforeResize','chartDoubleClick','chartMouseClick','chartMouseDown','chartMouseLeave','chartMouseMove','chartMouseUp','legendClick','legendRender','load','loaded','pointClick','pointMove','pointRender','resized','selectionComplete','seriesRender','textRender','tooltipRender','dataSourceChange'];
export const twoWays: string[] = ['dataSource'];

/**
 * AccumulationChart Component
 * ```html
 * <ejs-accumulationchart></ejs-accumulationchart>
 * ```
 */
@Component({
    selector: 'ejs-accumulationchart',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childSeries: new ContentChild(AccumulationSeriesCollectionDirective),
        childAnnotations: new ContentChild(AccumulationAnnotationsDirective),
        tooltip_template: new ContentChild('tooltipTemplate'),
        legendSettings_template: new ContentChild('legendSettingsTemplate')
    }
})
@ComponentMixins([ComponentBase])
export class AccumulationChartComponent extends AccumulationChart implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare afterExport: any;
	declare animationComplete: any;
	declare annotationRender: any;
	declare beforeExport: any;
	declare beforePrint: any;
	declare beforeResize: any;
	declare chartDoubleClick: any;
	declare chartMouseClick: any;
	declare chartMouseDown: any;
	declare chartMouseLeave: any;
	declare chartMouseMove: any;
	declare chartMouseUp: any;
	declare legendClick: any;
	declare legendRender: any;
	declare load: any;
	declare loaded: any;
	declare pointClick: any;
	declare pointMove: any;
	declare pointRender: any;
	declare resized: any;
	declare selectionComplete: any;
	declare seriesRender: any;
	declare textRender: any;
	declare tooltipRender: any;
	public declare dataSourceChange: any;
    public declare childSeries: QueryList<AccumulationSeriesCollectionDirective>;
    public declare childAnnotations: QueryList<AccumulationAnnotationsDirective>;
    public tags: string[] = ['series', 'annotations'];

    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('ChartsPieSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsFunnelSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsPyramidSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsAccumulationTooltip');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsAccumulationLegend');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsAccumulationSelection');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsAccumulationHighlight');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsAccumulationDataLabel');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsAccumulationAnnotation');
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
        if (this.childAnnotations) {
                    this.tagObjects[1].instance = this.childAnnotations as any;
                }
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(AccumulationChartComponent.prototype, 'tooltip_template');
Template()(AccumulationChartComponent.prototype, 'legendSettings_template');


