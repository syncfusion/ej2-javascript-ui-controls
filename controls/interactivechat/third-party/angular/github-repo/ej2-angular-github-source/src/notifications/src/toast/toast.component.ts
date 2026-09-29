import { Component, ElementRef, ViewContainerRef, Renderer2, Injector, ChangeDetectionStrategy, QueryList, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, ComponentMixins, IComponentBase, applyMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { Toast } from '@syncfusion/ej2-notifications';
import { Template } from '@syncfusion/ej2-angular-base';
import { ButtonModelPropsDirective } from './buttons.directive';

export const inputs: string[] = ['animation','buttons','content','cssClass','enableHtmlSanitizer','enablePersistence','enableRtl','extendedTimeout','height','icon','locale','newestOnTop','position','progressDirection','showCloseButton','showProgressBar','target','template','timeOut','title','width'];
export const outputs: string[] = ['beforeClose','beforeOpen','beforeSanitizeHtml','click','close','created','destroyed','open'];
export const twoWays: string[] = [''];

/**
 * Represents the Angular Toast Component
 * ```html
 * <ejs-toast></ejs-toast>
 * ```
 */
@Component({
    selector: 'ejs-toast',
    inputs: inputs,
    outputs: outputs,
    template: `<ng-content ></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childButtons: new ContentChild(ButtonModelPropsDirective),
        title: new ContentChild('title'),
        content: new ContentChild('content'),
        template: new ContentChild('template')
    }
})
@ComponentMixins([ComponentBase])
export class ToastComponent extends Toast implements IComponentBase {
    public declare containerContext : any;
    public declare tagObjects: any;
	declare beforeClose: any;
	declare beforeOpen: any;
	declare beforeSanitizeHtml: any;
	declare click: any;
	declare close: any;
	declare created: any;
	declare destroyed: any;
	public declare open: any;
    public declare childButtons: QueryList<ButtonModelPropsDirective>;
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
Template()(ToastComponent.prototype, 'title');
Template()(ToastComponent.prototype, 'content');
Template()(ToastComponent.prototype, 'template');

