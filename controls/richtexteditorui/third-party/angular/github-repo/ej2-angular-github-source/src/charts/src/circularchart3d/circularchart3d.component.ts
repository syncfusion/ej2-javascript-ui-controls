import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { CircularChart3D } from '@syncfusion/ej2-charts';
import { Template } from '@syncfusion/ej2-angular-base';
import { CircularChart3DSeriesCollectionDirective } from './series.directive';
import { CircularChart3DSelectedDataIndexesDirective } from './selecteddataindexes.directive';

export const inputs: string[] = ['background','backgroundImage','border','dataSource','depth','enableAnimation','enableExport','enablePersistence','enableRotation','enableRtl','height','highlightColor','highlightMode','highlightPattern','isMultiSelect','legendSettings','locale','margin','rotation','selectedDataIndexes','selectionMode','selectionPattern','series','subTitle','subTitleStyle','theme','tilt','title','titleStyle','tooltip','useGroupingSeparator','width'];
export const outputs: string[] = ['afterExport','beforeExport','beforePrint','beforeResize','circularChart3DMouseClick','circularChart3DMouseDown','circularChart3DMouseLeave','circularChart3DMouseMove','circularChart3DMouseUp','legendClick','legendRender','load','loaded','pointClick','pointMove','pointRender','resized','selectionComplete','seriesRender','textRender','tooltipRender','dataSourceChange'];
export const twoWays: string[] = ['dataSource'];

/**
 * CircularChart3D Component
 * ```html
 * <ejs-circularchart3d></ejs-circularchart3d>
 * ```
 */
@Component({
    selector: 'ejs-circularchart3d',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childSeries: new ContentChild(CircularChart3DSeriesCollectionDirective),
        childSelectedDataIndexes: new ContentChild(CircularChart3DSelectedDataIndexesDirective),
        tooltip_template: new ContentChild('tooltipTemplate')
    }
})
@ComponentMixins([ComponentBase])
export class CircularChart3DComponent extends CircularChart3D implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare afterExport: any;
	declare beforeExport: any;
	declare beforePrint: any;
	declare beforeResize: any;
	declare circularChart3DMouseClick: any;
	declare circularChart3DMouseDown: any;
	declare circularChart3DMouseLeave: any;
	declare circularChart3DMouseMove: any;
	declare circularChart3DMouseUp: any;
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
    public declare childSeries: QueryList<CircularChart3DSeriesCollectionDirective>;
    public declare childSelectedDataIndexes: QueryList<CircularChart3DSelectedDataIndexesDirective>;
    public tags: string[] = ['series', 'selectedDataIndexes'];

    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('ChartsPieSeries3D');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsCircularChartTooltip3D');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsCircularChartLegend3D');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsCircularChartSelection3D');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsCircularChartDataLabel3D');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsCircularChartHighlight3D');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsCircularChartExport3D');
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
        if (this.childSelectedDataIndexes) {
                    this.tagObjects[1].instance = this.childSelectedDataIndexes as any;
                }
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(CircularChart3DComponent.prototype, 'tooltip_template');


