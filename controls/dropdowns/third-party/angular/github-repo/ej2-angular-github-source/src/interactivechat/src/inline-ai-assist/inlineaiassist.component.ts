import { Component, ElementRef, ViewContainerRef, Renderer2, Injector, ChangeDetectionStrategy, QueryList, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, ComponentMixins, IComponentBase, applyMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { InlineAIAssist } from '@syncfusion/ej2-interactive-chat';
import { Template } from '@syncfusion/ej2-angular-base';


export const inputs: string[] = ['commandSettings','cssClass','editorTemplate','enablePersistence','enableRtl','enableStreaming','inlineToolbarSettings','locale','placeholder','popupHeight','popupWidth','prompt','prompts','relateTo','responseMode','responseSettings','responseTemplate','speechToTextSettings','target','zIndex'];
export const outputs: string[] = ['close','created','open','promptRequest'];
export const twoWays: string[] = [''];

/**
 * Represents the Essential JS 2 Angular InlineAIAssist Component.
 * ```html
 * <ejs-inlineaiassist></ejs-inlineaiassist>
 * ```
 */
@Component({
    selector: 'ejs-inlineaiassist',
    inputs: inputs,
    outputs: outputs,
    template: `<ng-content ></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        editorTemplate: new ContentChild('editorTemplate'),
        responseTemplate: new ContentChild('responseTemplate')
    }
})
@ComponentMixins([ComponentBase])
export class InlineAIAssistComponent extends InlineAIAssist implements IComponentBase {
    public declare containerContext : any;
    public declare tagObjects: any;
	declare close: any;
	declare created: any;
	declare open: any;
	public declare promptRequest: any;

    public tags: string[] = [''];

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
Template()(InlineAIAssistComponent.prototype, 'editorTemplate');
Template()(InlineAIAssistComponent.prototype, 'responseTemplate');

