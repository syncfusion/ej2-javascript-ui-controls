import { Component, ElementRef, ViewContainerRef, Renderer2, Injector, ChangeDetectionStrategy, QueryList, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, ComponentMixins, IComponentBase, applyMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { AIAssistView } from '@syncfusion/ej2-interactive-chat';
import { Template } from '@syncfusion/ej2-angular-base';
import { ViewsDirective } from './views.directive';

export const inputs: string[] = ['activeView','attachmentSettings','bannerTemplate','blockTemplate','cssClass','enableAttachments','enablePersistence','enableRtl','enableScrollToBottom','enableStreaming','footerTemplate','footerToolbarSettings','height','itemTemplate','locale','mentions','prompt','promptIconCss','promptItemTemplate','promptPlaceholder','promptSuggestionItemTemplate','promptSuggestions','promptSuggestionsHeader','promptToolbarSettings','prompts','responseAnimationTemplate','responseIconCss','responseItemTemplate','responseToolbarSettings','showClearButton','showHeader','speechToTextSettings','telemetrySettings','textToSpeechSettings','toolbarSettings','views','width'];
export const outputs: string[] = ['attachmentRemoved','attachmentRemoving','attachmentUploadFailure','attachmentUploadSuccess','beforeAttachmentUpload','created','editableContextClicked','mentionSelect','promptChanged','promptRequest','stopRespondingClick','promptChange'];
export const twoWays: string[] = ['prompt'];

/**
 * Represents the Essential JS 2 Angular AIAssistView Component.
 * ```html
 * <ejs-aiassistview></ejs-aiassistview>
 * ```
 */
@Component({
    selector: '[ejs-aiassistview], ejs-aiassistview',
    inputs: inputs,
    outputs: outputs,
    template: `<ng-content ></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childViews: new ContentChild(ViewsDirective),
        footerTemplate: new ContentChild('footerTemplate'),
        promptItemTemplate: new ContentChild('promptItemTemplate'),
        responseItemTemplate: new ContentChild('responseItemTemplate'),
        promptSuggestionItemTemplate: new ContentChild('promptSuggestionItemTemplate'),
        itemTemplate: new ContentChild('itemTemplate'),
        blockTemplate: new ContentChild('blockTemplate'),
        bannerTemplate: new ContentChild('bannerTemplate'),
        responseAnimationTemplate: new ContentChild('responseAnimationTemplate')
    }
})
@ComponentMixins([ComponentBase])
export class AIAssistViewComponent extends AIAssistView implements IComponentBase {
    public declare containerContext : any;
    public declare tagObjects: any;
	declare attachmentRemoved: any;
	declare attachmentRemoving: any;
	declare attachmentUploadFailure: any;
	declare attachmentUploadSuccess: any;
	declare beforeAttachmentUpload: any;
	declare created: any;
	declare editableContextClicked: any;
	declare mentionSelect: any;
	declare promptChanged: any;
	declare promptRequest: any;
	declare stopRespondingClick: any;
	public declare promptChange: any;
    public declare childViews: QueryList<ViewsDirective>;
    public tags: string[] = ['views'];

    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('Interactive-ChatAssistThinking');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }

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
        this.tagObjects[0].instance = this.childViews;
        this.containerContext.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(AIAssistViewComponent.prototype, 'footerTemplate');
Template()(AIAssistViewComponent.prototype, 'promptItemTemplate');
Template()(AIAssistViewComponent.prototype, 'responseItemTemplate');
Template()(AIAssistViewComponent.prototype, 'promptSuggestionItemTemplate');
Template()(AIAssistViewComponent.prototype, 'itemTemplate');
Template()(AIAssistViewComponent.prototype, 'blockTemplate');
Template()(AIAssistViewComponent.prototype, 'bannerTemplate');
Template()(AIAssistViewComponent.prototype, 'responseAnimationTemplate');

