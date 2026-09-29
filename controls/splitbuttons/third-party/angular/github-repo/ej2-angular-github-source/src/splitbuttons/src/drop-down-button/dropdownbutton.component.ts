import { Component, ElementRef, ViewContainerRef, Renderer2, Injector, ChangeDetectionStrategy, QueryList, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, ComponentMixins, IComponentBase, applyMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';

import { DropDownButtonItemsDirective } from './items.directive';

export const inputs: string[] = ['animationSettings','closeActionEvents','content','createPopupOnClick','cssClass','disabled','enableHtmlSanitizer','enablePersistence','enableRtl','iconCss','iconPosition','itemTemplate','items','locale','popupWidth','target'];
export const outputs: string[] = ['beforeClose','beforeItemRender','beforeOpen','close','created','open','select'];
export const twoWays: string[] = [];

/**
 * Represents the Angular DropDownButton Component.
 * ```html
 * <button ejs-dropdownbutton>DropDownButton</button>
 * ```
 */
@Component({
    selector: '[ejs-dropdownbutton]',
    inputs: inputs,
    outputs: outputs,
    template: `<ng-content ></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childItems: new ContentChild(DropDownButtonItemsDirective)
    }
})
@ComponentMixins([ComponentBase])
export class DropDownButtonComponent extends DropDownButton implements IComponentBase {
    public declare containerContext : any;
    public declare tagObjects: any;
	declare beforeClose: any;
	declare beforeItemRender: any;
	declare beforeOpen: any;
	declare close: any;
	declare created: any;
	declare open: any;
	public declare select: any;
    public declare childItems: QueryList<DropDownButtonItemsDirective>;
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

