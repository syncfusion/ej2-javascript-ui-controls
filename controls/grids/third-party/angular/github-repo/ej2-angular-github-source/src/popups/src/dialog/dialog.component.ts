import { Component, ElementRef, ViewContainerRef, Renderer2, Injector, ChangeDetectionStrategy, QueryList, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, ComponentMixins, IComponentBase, applyMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { Template } from '@syncfusion/ej2-angular-base';
import { ButtonsDirective } from './buttons.directive';

export const inputs: string[] = ['allowDragging','animationSettings','buttons','closeOnEscape','content','cssClass','enableHtmlSanitizer','enablePersistence','enableResize','enableRtl','footerTemplate','header','height','isModal','locale','minHeight','position','resizeHandles','showCloseIcon','target','visible','width','zIndex'];
export const outputs: string[] = ['beforeClose','beforeOpen','beforeSanitizeHtml','close','created','destroyed','drag','dragStart','dragStop','open','overlayClick','resizeStart','resizeStop','resizing','visibleChange'];
export const twoWays: string[] = ['visible'];

/**
 * Represents the Angular Dialog Component
 * ```html
 * <ejs-dialog></ejs-dialog>
 * ```
 */
@Component({
    selector: 'ejs-dialog',
    inputs: inputs,
    outputs: outputs,
    template: `<ng-content ></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childButtons: new ContentChild(ButtonsDirective),
        footerTemplate: new ContentChild('footerTemplate'),
        header: new ContentChild('header'),
        content: new ContentChild('content')
    }
})
@ComponentMixins([ComponentBase])
export class DialogComponent extends Dialog implements IComponentBase {
    public declare containerContext : any;
    public declare tagObjects: any;
	declare beforeClose: any;
	declare beforeOpen: any;
	declare beforeSanitizeHtml: any;
	declare close: any;
	declare created: any;
	declare destroyed: any;
	declare drag: any;
	declare dragStart: any;
	declare dragStop: any;
	declare open: any;
	declare overlayClick: any;
	declare resizeStart: any;
	declare resizeStop: any;
	declare resizing: any;
	public declare visibleChange: any;
    public declare childButtons: QueryList<ButtonsDirective>;
    public tags: string[] = ['buttons'];

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
        this.tagObjects[0].instance = this.childButtons;
        this.containerContext.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(DialogComponent.prototype, 'footerTemplate');
Template()(DialogComponent.prototype, 'header');
Template()(DialogComponent.prototype, 'content');

