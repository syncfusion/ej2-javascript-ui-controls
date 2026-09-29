import { Component, ElementRef, ViewContainerRef, Renderer2, Injector, ChangeDetectionStrategy, QueryList, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, ComponentMixins, IComponentBase, applyMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { SpeedDial } from '@syncfusion/ej2-buttons';
import { Template } from '@syncfusion/ej2-angular-base';
import { SpeedDialItemsDirective } from './items.directive';

export const inputs: string[] = ['animation','closeIconCss','content','cssClass','direction','disabled','enablePersistence','enableRtl','iconPosition','isPrimary','itemTemplate','items','locale','modal','mode','openIconCss','opensOnHover','popupTemplate','position','radialSettings','target','visible'];
export const outputs: string[] = ['beforeClose','beforeItemRender','beforeOpen','clicked','created','onClose','onOpen','visibleChange'];
export const twoWays: string[] = ['visible'];

/**
 * Represents the Angular SpeedDial Component.
 * ```html
 * <button ejs-speeddial content='Edit'></button>
 * ```
 */
@Component({
    selector: '[ejs-speeddial]',
    inputs: inputs,
    outputs: outputs,
    template: `<ng-content ></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childItems: new ContentChild(SpeedDialItemsDirective),
        itemTemplate: new ContentChild('itemTemplate'),
        popupTemplate: new ContentChild('popupTemplate')
    }
})
@ComponentMixins([ComponentBase])
export class SpeedDialComponent extends SpeedDial implements IComponentBase {
    public declare containerContext : any;
    public declare tagObjects: any;
	declare beforeClose: any;
	declare beforeItemRender: any;
	declare beforeOpen: any;
	declare clicked: any;
	declare created: any;
	declare onClose: any;
	declare onOpen: any;
	public declare visibleChange: any;
    public declare childItems: QueryList<SpeedDialItemsDirective>;
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
Template()(SpeedDialComponent.prototype, 'itemTemplate');
Template()(SpeedDialComponent.prototype, 'popupTemplate');

