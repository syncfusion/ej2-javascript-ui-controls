import { Component, ElementRef, ViewContainerRef, Renderer2, Injector, ChangeDetectionStrategy, QueryList, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, ComponentMixins, IComponentBase, applyMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { Mention } from '@syncfusion/ej2-dropdowns';
import { Template } from '@syncfusion/ej2-angular-base';


export const inputs: string[] = ['allowSpaces','cssClass','dataSource','debounceDelay','displayTemplate','fields','filterType','highlight','ignoreCase','itemTemplate','locale','mentionChar','minLength','noRecordsTemplate','popupHeight','popupWidth','query','requireLeadingSpace','showMentionChar','sortOrder','spinnerTemplate','suffixText','suggestionCount','target'];
export const outputs: string[] = ['actionBegin','actionComplete','actionFailure','beforeOpen','change','closed','created','destroyed','filtering','opened','select'];
export const twoWays: string[] = [''];

/**
*The Mention component contains a list of predefined values, from which the user can choose a single value.
*```html
*<ejs-mention></ejs-mention>
*```
*/
@Component({
    selector: 'ejs-mention',
    inputs: inputs,
    outputs: outputs,
    template: `<ng-content ></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        displayTemplate: new ContentChild('displayTemplate'),
        itemTemplate: new ContentChild('itemTemplate'),
        spinnerTemplate: new ContentChild('spinnerTemplate'),
        noRecordsTemplate: new ContentChild('noRecordsTemplate')
    }
})
@ComponentMixins([ComponentBase])
export class MentionComponent extends Mention implements IComponentBase {
    public declare containerContext : any;
    public declare tagObjects: any;
	declare actionBegin: any;
	declare actionComplete: any;
	declare actionFailure: any;
	declare beforeOpen: any;
	declare change: any;
	declare closed: any;
	declare created: any;
	declare destroyed: any;
	declare filtering: any;
	declare opened: any;
	public declare select: any;



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
Template()(MentionComponent.prototype, 'displayTemplate');
Template()(MentionComponent.prototype, 'itemTemplate');
Template()(MentionComponent.prototype, 'spinnerTemplate');
Template('No records found')(MentionComponent.prototype, 'noRecordsTemplate');

