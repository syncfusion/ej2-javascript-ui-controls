import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { BulletChart } from '@syncfusion/ej2-charts';
import { Template } from '@syncfusion/ej2-angular-base';
import { BulletRangeCollectionDirective } from './ranges.directive';

export const inputs: string[] = ['animation','border','categoryField','categoryLabelStyle','dataLabel','dataSource','enableGroupSeparator','enablePersistence','enableRtl','height','interval','labelFormat','labelPosition','labelStyle','legendSettings','locale','majorTickLines','margin','maximum','minimum','minorTickLines','minorTicksPerInterval','opposedPosition','orientation','query','ranges','subtitle','subtitleStyle','tabIndex','targetColor','targetField','targetTypes','targetWidth','theme','tickPosition','title','titlePosition','titleStyle','tooltip','type','valueBorder','valueField','valueFill','valueHeight','width'];
export const outputs: string[] = ['beforePrint','bulletChartMouseClick','legendRender','load','loaded','tooltipRender','dataSourceChange'];
export const twoWays: string[] = ['dataSource'];

/**
 * BulletChart Component
 * ```html
 * <ejs-bulletchart></ejs-bulletchart>
 * ```
 */
@Component({
    selector: 'ejs-bulletchart',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childRanges: new ContentChild(BulletRangeCollectionDirective),
        tooltip_template: new ContentChild('tooltipTemplate')
    }
})
@ComponentMixins([ComponentBase])
export class BulletChartComponent extends BulletChart implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare beforePrint: any;
	declare bulletChartMouseClick: any;
	declare legendRender: any;
	declare load: any;
	declare loaded: any;
	declare tooltipRender: any;
	public declare dataSourceChange: any;
    public declare childRanges: QueryList<BulletRangeCollectionDirective>;
    public tags: string[] = ['ranges'];

    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('ChartsBulletTooltip');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsBulletChartLegend');
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
        this.tagObjects[0].instance = this.childRanges;
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(BulletChartComponent.prototype, 'tooltip_template');


