import { Component, ElementRef, ViewContainerRef, Renderer2, Injector, ChangeDetectionStrategy, QueryList, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, ComponentMixins, IComponentBase, applyMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { Message } from '@syncfusion/ej2-notifications';
import { Template } from '@syncfusion/ej2-angular-base';


export const inputs: string[] = ['content','cssClass','enablePersistence','enableRtl','locale','severity','showCloseIcon','showIcon','variant','visible'];
export const outputs: string[] = ['closed','created','destroyed'];
export const twoWays: string[] = [''];

/**
 * The Angular Message component displays messages with severity by differentiating icons and colors to denote the importance and context of the message to the end user.
 * ```html
 * <ejs-message id='msg' content='Editing is restricted' [showCloseIcon]='true'></ejs-message>
 * ```
 */
@Component({
    selector: 'ejs-message',
    inputs: inputs,
    outputs: outputs,
    template: `<ng-content ></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        content: new ContentChild('content')
    }
})
@ComponentMixins([ComponentBase])
export class MessageComponent extends Message implements IComponentBase {
    public declare containerContext : any;
    public declare tagObjects: any;
	declare closed: any;
	declare created: any;
	public declare destroyed: any;



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
        
        this.containerContext.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(MessageComponent.prototype, 'content');

