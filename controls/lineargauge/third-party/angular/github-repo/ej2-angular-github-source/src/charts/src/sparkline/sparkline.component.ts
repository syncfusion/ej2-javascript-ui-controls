import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { Sparkline } from '@syncfusion/ej2-charts';

import { RangeBandSettingsDirective } from './rangebandsettings.directive';

export const inputs: string[] = ['axisSettings','border','containerArea','dataLabelSettings','dataSource','enablePersistence','enableRtl','endPointColor','fill','format','height','highPointColor','lineWidth','locale','lowPointColor','markerSettings','negativePointColor','opacity','padding','palette','query','rangeBandSettings','rangePadding','startPointColor','theme','tiePointColor','tooltipSettings','type','useGroupingSeparator','valueType','width','xName','yName'];
export const outputs: string[] = ['axisRendering','dataLabelRendering','load','loaded','markerRendering','pointRegionMouseClick','pointRegionMouseMove','pointRendering','resize','seriesRendering','sparklineMouseClick','sparklineMouseMove','tooltipInitialize'];
export const twoWays: string[] = [''];

/**
 * Sparkline Component
 * ```html
 * <ejs-sparkline></ejs-sparkline>
 * ```
 */
@Component({
    selector: 'ejs-sparkline',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childRangeBandSettings: new ContentChild(RangeBandSettingsDirective)
    }
})
@ComponentMixins([ComponentBase])
export class SparklineComponent extends Sparkline implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare axisRendering: any;
	declare dataLabelRendering: any;
	declare load: any;
	declare loaded: any;
	declare markerRendering: any;
	declare pointRegionMouseClick: any;
	declare pointRegionMouseMove: any;
	declare pointRendering: any;
	declare resize: any;
	declare seriesRendering: any;
	declare sparklineMouseClick: any;
	declare sparklineMouseMove: any;
	public declare tooltipInitialize: any;
    public declare childRangeBandSettings: QueryList<RangeBandSettingsDirective>;
    public tags: string[] = ['rangeBandSettings'];

    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('ChartsSparklineTooltip');
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
        this.tagObjects[0].instance = this.childRangeBandSettings;
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}


