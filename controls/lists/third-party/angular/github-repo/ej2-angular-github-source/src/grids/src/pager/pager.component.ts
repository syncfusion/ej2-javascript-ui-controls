import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { Pager } from '@syncfusion/ej2-grids';
import { Template } from '@syncfusion/ej2-angular-base';


export const inputs: string[] = ['cssClass','currentPage','customText','enableExternalMessage','enablePagerMessage','enablePersistence','enableQueryString','enableRtl','externalMessage','locale','pageCount','pageSize','pageSizes','template','totalRecordsCount'];
export const outputs: string[] = ['click','created','dropDownChanged','currentPageChange','pageSizeChange','pageCountChange','pageSizesChange'];
export const twoWays: string[] = ['currentPage', 'pageSize', 'pageCount', 'pageSizes'];

/**
 * `ejs-pager` represents the Angular Pager Component.
 * ```html
 * <ejs-pager></ejs-pager>
 * ```
 */
@Component({
    selector: 'ejs-pager',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        template: new ContentChild('template')
    }
})
@ComponentMixins([ComponentBase])
export class PagerComponent extends Pager implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare click: any;
	declare created: any;
	declare dropDownChanged: any;
	declare currentPageChange: any;
	declare pageSizeChange: any;
	declare pageCountChange: any;
	public declare pageSizesChange: any;



    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];

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
        
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(PagerComponent.prototype, 'template');


