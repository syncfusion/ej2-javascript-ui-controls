import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { Smithchart } from '@syncfusion/ej2-charts';

import { SmithchartSeriesCollectionDirective } from './series.directive';

export const inputs: string[] = ['background','border','elementSpacing','enablePersistence','enableRtl','font','height','horizontalAxis','legendSettings','locale','margin','radialAxis','radius','renderType','series','theme','title','width'];
export const outputs: string[] = ['animationComplete','axisLabelRender','beforePrint','legendRender','load','loaded','seriesRender','subtitleRender','textRender','titleRender','tooltipRender'];
export const twoWays: string[] = [''];

/**
 * Smithchart Component
 * ```html
 * <ejs-smithchart></ejs-smithchart>
 * ```
 */
@Component({
    selector: 'ejs-smithchart',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childSeries: new ContentChild(SmithchartSeriesCollectionDirective)
    }
})
@ComponentMixins([ComponentBase])
export class SmithchartComponent extends Smithchart implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare animationComplete: any;
	declare axisLabelRender: any;
	declare beforePrint: any;
	declare legendRender: any;
	declare load: any;
	declare loaded: any;
	declare seriesRender: any;
	declare subtitleRender: any;
	declare textRender: any;
	declare titleRender: any;
	public declare tooltipRender: any;
    public declare childSeries: QueryList<SmithchartSeriesCollectionDirective>;
    public tags: string[] = ['series'];

    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('ChartsSmithchartLegend');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsTooltipRender');
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
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}


