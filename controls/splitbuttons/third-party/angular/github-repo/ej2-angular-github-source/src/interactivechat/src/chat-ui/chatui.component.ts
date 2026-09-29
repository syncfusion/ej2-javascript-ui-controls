import { Component, ElementRef, ViewContainerRef, Renderer2, Injector, ChangeDetectionStrategy, QueryList, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, ComponentMixins, IComponentBase, applyMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { ChatUI } from '@syncfusion/ej2-interactive-chat';
import { Template } from '@syncfusion/ej2-angular-base';
import { MessagesDirective } from './messages.directive';

export const inputs: string[] = ['attachmentSettings','autoScrollToBottom','cssClass','emptyChatTemplate','enableAttachments','enableCompactMode','enablePersistence','enableRtl','footerTemplate','headerIconCss','headerText','headerToolbar','height','loadOnDemand','locale','mentionTriggerChar','mentionUsers','messageTemplate','messageToolbarSettings','messages','placeholder','showFooter','showHeader','showTimeBreak','showTimeStamp','suggestionTemplate','suggestions','timeBreakTemplate','timeStampFormat','typingUsers','typingUsersTemplate','user','width'];
export const outputs: string[] = ['attachmentRemoved','attachmentUploadFailure','attachmentUploadSuccess','beforeAttachmentUpload','created','mentionSelect','messageSend','userTyping'];
export const twoWays: string[] = [''];

/**
 * Represents the Essential JS 2 Angular ChatUI Component.
 * ```html
 * <ejs-chatui></ejs-chatui>
 * ```
 */
@Component({
    selector: '[ejs-chatui], ejs-chatui',
    inputs: inputs,
    outputs: outputs,
    template: `<ng-content ></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childMessages: new ContentChild(MessagesDirective),
        suggestionTemplate: new ContentChild('suggestionTemplate'),
        footerTemplate: new ContentChild('footerTemplate'),
        emptyChatTemplate: new ContentChild('emptyChatTemplate'),
        messageTemplate: new ContentChild('messageTemplate'),
        typingUsersTemplate: new ContentChild('typingUsersTemplate'),
        timeBreakTemplate: new ContentChild('timeBreakTemplate'),
        previewTemplate: new ContentChild('previewTemplate'),
        attachmentTemplate: new ContentChild('attachmentTemplate')
    }
})
@ComponentMixins([ComponentBase])
export class ChatUIComponent extends ChatUI implements IComponentBase {
    public declare containerContext : any;
    public declare tagObjects: any;
	declare attachmentRemoved: any;
	declare attachmentUploadFailure: any;
	declare attachmentUploadSuccess: any;
	declare beforeAttachmentUpload: any;
	declare created: any;
	declare mentionSelect: any;
	declare messageSend: any;
	public declare userTyping: any;
    public declare childMessages: QueryList<MessagesDirective>;
    public tags: string[] = ['messages'];

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
        this.tagObjects[0].instance = this.childMessages;
        this.containerContext.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(ChatUIComponent.prototype, 'suggestionTemplate');
Template()(ChatUIComponent.prototype, 'footerTemplate');
Template()(ChatUIComponent.prototype, 'emptyChatTemplate');
Template()(ChatUIComponent.prototype, 'messageTemplate');
Template()(ChatUIComponent.prototype, 'typingUsersTemplate');
Template()(ChatUIComponent.prototype, 'timeBreakTemplate');
Template()(ChatUIComponent.prototype, 'previewTemplate');
Template()(ChatUIComponent.prototype, 'attachmentTemplate');

