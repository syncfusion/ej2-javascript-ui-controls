import { Component, ElementRef, ViewContainerRef, Renderer2, Injector, ChangeDetectionStrategy, QueryList, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, ComponentMixins, IComponentBase, applyMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { FormRenderer } from '@syncfusion/ej2-form-renderer';

import { CustomWidgetSettingsDirective } from './customwidgetsettings.directive';

export const inputs: string[] = ['className','customWidgetSettings','dataModel','enableHtmlSanitizer','enablePersistence','enableRtl','layout','locale','schema'];
export const outputs: string[] = ['buttonClick','change','created','failure','submit','dataModelChange'];
export const twoWays: string[] = ['dataModel'];

/**
 * Represents the Angular FormRenderer Component.
 * ```html
 * <ejs-form-renderer></ejs-form-renderer>
 * ```
 */
@Component({
    selector: '[ejs-form-renderer], ejs-form-renderer',
    inputs: inputs,
    outputs: outputs,
    template: `<ng-content ></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childCustomWidgetSettings: new ContentChild(CustomWidgetSettingsDirective)
    }
})
@ComponentMixins([ComponentBase])
export class FormRendererComponent extends FormRenderer implements IComponentBase {
    public declare containerContext : any;
    public declare tagObjects: any;
	declare buttonClick: any;
	declare change: any;
	declare created: any;
	declare failure: any;
	declare submit: any;
	public declare dataModelChange: any;
    public declare childCustomWidgetSettings: QueryList<CustomWidgetSettingsDirective>;
    public tags: string[] = ['customWidgetSettings'];

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
        this.tagObjects[0].instance = this.childCustomWidgetSettings;
        this.containerContext.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}

