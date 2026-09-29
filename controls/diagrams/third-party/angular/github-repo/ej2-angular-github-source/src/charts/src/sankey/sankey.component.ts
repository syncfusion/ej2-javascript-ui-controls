import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { Sankey } from '@syncfusion/ej2-charts';
import { Template } from '@syncfusion/ej2-angular-base';
import { SankeyNodesCollectionDirective } from './nodes.directive';
import { SankeyLinksCollectionDirective } from './links.directive';

export const inputs: string[] = ['accessibility','allowExport','animation','background','backgroundImage','border','enableExport','enablePersistence','enableRtl','focusBorderColor','focusBorderMargin','focusBorderWidth','height','labelSettings','legendSettings','linkStyle','links','locale','margin','nodeStyle','nodes','orientation','subTitle','subTitleStyle','theme','title','titleStyle','tooltip','width'];
export const outputs: string[] = ['afterExport','beforeExport','beforePrint','exportCompleted','labelRendering','legendItemHover','legendItemRendering','linkClick','linkEnter','linkLeave','linkRendering','load','loaded','nodeClick','nodeEnter','nodeLeave','nodeRendering','sizeChanged','tooltipRendering'];
export const twoWays: string[] = [''];

/**
 * Sankey Component
 * ```html
 * <ejs-sankey></ejs-sankey>
 * ```
 */
@Component({
    selector: 'ejs-sankey',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childNodes: new ContentChild(SankeyNodesCollectionDirective),
        childLinks: new ContentChild(SankeyLinksCollectionDirective),
        tooltip_sankeyNodeTemplate: new ContentChild('tooltipSankeyNodeTemplate'),
        tooltip_sankeyLinkTemplate: new ContentChild('tooltipSankeyLinkTemplate')
    }
})
@ComponentMixins([ComponentBase])
export class SankeyComponent extends Sankey implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare afterExport: any;
	declare beforeExport: any;
	declare beforePrint: any;
	declare exportCompleted: any;
	declare labelRendering: any;
	declare legendItemHover: any;
	declare legendItemRendering: any;
	declare linkClick: any;
	declare linkEnter: any;
	declare linkLeave: any;
	declare linkRendering: any;
	declare load: any;
	declare loaded: any;
	declare nodeClick: any;
	declare nodeEnter: any;
	declare nodeLeave: any;
	declare nodeRendering: any;
	declare sizeChanged: any;
	public declare tooltipRendering: any;
    public declare childNodes: QueryList<SankeyNodesCollectionDirective>;
    public declare childLinks: QueryList<SankeyLinksCollectionDirective>;
    public tags: string[] = ['nodes', 'links'];

    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('ChartsSankeyLegend');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsSankeyTooltip');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsSankeyHighlight');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsSankeyExport');
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
        this.tagObjects[0].instance = this.childNodes;
        if (this.childLinks) {
                    this.tagObjects[1].instance = this.childLinks as any;
                }
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(SankeyComponent.prototype, 'tooltip_sankeyNodeTemplate');
Template()(SankeyComponent.prototype, 'tooltip_sankeyLinkTemplate');


