import { Component, ElementRef, ViewContainerRef, Renderer2, Injector, ChangeDetectionStrategy, QueryList, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, ComponentMixins, IComponentBase, applyMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { Accordion } from '@syncfusion/ej2-navigations';
import { Template } from '@syncfusion/ej2-angular-base';
import { AccordionItemsDirective } from './items.directive';

export const inputs: string[] = ['animation','dataSource','enableHtmlSanitizer','enablePersistence','enableRtl','expandMode','expandedIndices','headerTemplate','height','itemTemplate','items','locale','width'];
export const outputs: string[] = ['clicked','created','destroyed','expanded','expanding','expandedIndicesChange'];
export const twoWays: string[] = ['expandedIndices'];

/**
 * Represents the Angular Accordion Component.
 * ```html
 * <ejs-accordion></ejs-accordion>
 * ```
 */
@Component({
    selector: 'ejs-accordion',
    inputs: inputs,
    outputs: outputs,
    template: `<ng-content select='div'></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childItems: new ContentChild(AccordionItemsDirective),
        headerTemplate: new ContentChild('headerTemplate'),
        itemTemplate: new ContentChild('itemTemplate')
    }
})
@ComponentMixins([ComponentBase])
export class AccordionComponent extends Accordion implements IComponentBase {
    public declare containerContext : any;
    public declare tagObjects: any;
	declare clicked: any;
	declare created: any;
	declare destroyed: any;
	declare expanded: any;
	declare expanding: any;
	public declare expandedIndicesChange: any;
    public declare childItems: QueryList<AccordionItemsDirective>;
    public tags: string[] = ['items'];

    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];

        this.registerEvents(outputs);
        this.addTwoWay.call(this, twoWays);
        setValue('currentInstance', this, this.viewContainerRef);
        this.containerContext  = new ComponentBase();
    }

    public ngOnInit() {
        this.containerContext.ngOnInit(this);
    }

    public ngAfterViewInit(): void {
        this.containerContext.ngAfterViewInit(this);
    }

    public ngOnDestroy(): void {
        this.containerContext.ngOnDestroy(this);
    }

    public ngAfterContentChecked(): void {
        this.tagObjects[0].instance = this.childItems;
        this.containerContext.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(AccordionComponent.prototype, 'headerTemplate');
Template()(AccordionComponent.prototype, 'itemTemplate');

