import { Component, ElementRef, ViewContainerRef, Renderer2, Injector, ChangeDetectionStrategy, QueryList, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, ComponentMixins, IComponentBase, applyMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { Splitter } from '@syncfusion/ej2-layouts';

import { PanesDirective } from './panesettings.directive';

export const inputs: string[] = ['cssClass','enableHtmlSanitizer','enablePersistence','enableReversePanes','enableRtl','enabled','height','locale','orientation','paneSettings','separatorSize','width'];
export const outputs: string[] = ['beforeCollapse','beforeExpand','beforeSanitizeHtml','collapsed','created','expanded','resizeStart','resizeStop','resizing'];
export const twoWays: string[] = [''];

/**
 * Represents the Angular Splitter Component
 * ```html
 * <ejs-splitter></ejs-splitter>
 * ```
 */
@Component({
    selector: 'ejs-splitter',
    inputs: inputs,
    outputs: outputs,
    template: `<ng-content select='div'></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childPaneSettings: new ContentChild(PanesDirective)
    }
})
@ComponentMixins([ComponentBase])
export class SplitterComponent extends Splitter implements IComponentBase {
    public declare containerContext : any;
    public declare tagObjects: any;
	declare beforeCollapse: any;
	declare beforeExpand: any;
	declare beforeSanitizeHtml: any;
	declare collapsed: any;
	declare created: any;
	declare expanded: any;
	declare resizeStart: any;
	declare resizeStop: any;
	public declare resizing: any;
    public declare childPaneSettings: QueryList<PanesDirective>;
    public tags: string[] = ['paneSettings'];

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
        this.tagObjects[0].instance = this.childPaneSettings;
        this.containerContext.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}

