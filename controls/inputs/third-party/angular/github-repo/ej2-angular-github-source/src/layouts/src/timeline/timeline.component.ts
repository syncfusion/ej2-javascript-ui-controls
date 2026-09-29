import { Component, ElementRef, ViewContainerRef, Renderer2, Injector, ChangeDetectionStrategy, QueryList, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, ComponentMixins, IComponentBase, applyMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { Timeline } from '@syncfusion/ej2-layouts';
import { Template } from '@syncfusion/ej2-angular-base';
import { ItemsDirective } from './items.directive';

export const inputs: string[] = ['align','cssClass','enablePersistence','enableRtl','items','locale','orientation','reverse','template'];
export const outputs: string[] = ['beforeItemRender','created'];
export const twoWays: string[] = [];

/**
 * Represents the EJ2 Angular Timeline Component.
 * ```html
 * <div ejs-timeline [items]='timelineItems'></div>
 * ```
 */
@Component({
    selector: 'ejs-timeline',
    inputs: inputs,
    outputs: outputs,
    template: `<ng-content select='div'></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childItems: new ContentChild(ItemsDirective),
        template: new ContentChild('template'),
        content: new ContentChild('content'),
        oppositeContent: new ContentChild('oppositeContent')
    }
})
@ComponentMixins([ComponentBase])
export class TimelineComponent extends Timeline implements IComponentBase {
    public declare containerContext : any;
    public declare tagObjects: any;
	declare beforeItemRender: any;
	public declare created: any;
    public declare childItems: QueryList<ItemsDirective>;
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
Template()(TimelineComponent.prototype, 'template');
Template()(TimelineComponent.prototype, 'content');
Template()(TimelineComponent.prototype, 'oppositeContent');

