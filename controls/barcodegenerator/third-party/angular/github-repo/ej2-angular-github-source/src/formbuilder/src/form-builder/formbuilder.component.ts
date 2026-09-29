import { Component, ElementRef, ViewContainerRef, Renderer2, Injector, ChangeDetectionStrategy, QueryList, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, ComponentMixins, IComponentBase, applyMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { FormBuilder } from '@syncfusion/ej2-form-builder';

import { ToolboxItemSettingsDirective } from './toolboxitems.directive';

export const inputs: string[] = ['allowExport','enableHtmlSanitizer','enablePersistence','enablePreview','enableRtl','formTemplates','locale','mode','schema','toolboxCategories','toolboxItems'];
export const outputs: string[] = ['onFieldDragOver','onFieldDragStarted','onFieldDropped','onFieldPropertyChanged'];
export const twoWays: string[] = [];

/**
 * Represents the Angular Form Builder Component.
 * ```html
 * <ejs-form-builder></ejs-form-builder>
 * ```
 */
@Component({
    selector: '[ejs-form-builder], ejs-form-builder',
    inputs: inputs,
    outputs: outputs,
    template: `<ng-content ></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childToolboxItems: new ContentChild(ToolboxItemSettingsDirective)
    }
})
@ComponentMixins([ComponentBase])
export class FormBuilderComponent extends FormBuilder implements IComponentBase {
    public declare containerContext : any;
    public declare tagObjects: any;
	declare onFieldDragOver: any;
	declare onFieldDragStarted: any;
	declare onFieldDropped: any;
	public declare onFieldPropertyChanged: any;
    public declare childToolboxItems: QueryList<ToolboxItemSettingsDirective>;
    public tags: string[] = ['toolboxItems'];

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
        this.tagObjects[0].instance = this.childToolboxItems;
        this.containerContext.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}

