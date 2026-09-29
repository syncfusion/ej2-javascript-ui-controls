import { Component, ElementRef, ViewContainerRef, Renderer2, Injector, ChangeDetectionStrategy, QueryList, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, ComponentMixins, IComponentBase, applyMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { Tab } from '@syncfusion/ej2-navigations';

import { TabItemsDirective } from './items.directive';

export const inputs: string[] = ['allowDragAndDrop','animation','clearTemplates','cssClass','dragArea','enableHtmlSanitizer','enablePersistence','enableRtl','headerPlacement','height','heightAdjustMode','items','loadOn','locale','overflowMode','reorderActiveTab','scrollStep','selectedItem','showCloseButton','swipeMode','width'];
export const outputs: string[] = ['added','adding','created','destroyed','dragged','dragging','onDragStart','removed','removing','selected','selecting'];
export const twoWays: string[] = [''];

/**
 * Represents the Angular Tab Component.
 * ```html
 * <ejs-tab></ejs-tab>
 * ```
 */
@Component({
    selector: 'ejs-tab',
    inputs: inputs,
    outputs: outputs,
    template: `<ng-content select='div'></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childItems: new ContentChild(TabItemsDirective)
    }
})
@ComponentMixins([ComponentBase])
export class TabComponent extends Tab implements IComponentBase {
    public declare containerContext : any;
    public declare tagObjects: any;
	declare added: any;
	declare adding: any;
	declare created: any;
	declare destroyed: any;
	declare dragged: any;
	declare dragging: any;
	declare onDragStart: any;
	declare removed: any;
	declare removing: any;
	declare selected: any;
	public declare selecting: any;
    public declare childItems: QueryList<TabItemsDirective>;
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

