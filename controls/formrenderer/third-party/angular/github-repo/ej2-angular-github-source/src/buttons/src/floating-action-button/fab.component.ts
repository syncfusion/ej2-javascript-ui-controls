import { Component, ElementRef, ViewContainerRef, Renderer2, Injector, ChangeDetectionStrategy, QueryList, ValueProvider } from '@angular/core';
import { ComponentBase, ComponentMixins, IComponentBase, applyMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { Fab } from '@syncfusion/ej2-buttons';



export const inputs: string[] = ['content','cssClass','disabled','enableHtmlSanitizer','enablePersistence','enableRepeat','enableRtl','iconCss','iconPosition','isPrimary','isToggle','locale','position','repeatDelay','repeatInterval','target','visible'];
export const outputs: string[] = ['clicked','created'];
export const twoWays: string[] = [];

/**
 * Represents the Angular Fab Component.
 * ```html
 * <button ejs-fab content='fab'></button>
 * ```
 */
@Component({
    selector: '[ejs-fab]',
    inputs: inputs,
    outputs: outputs,
    template: `<ng-content ></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
    }
})
@ComponentMixins([ComponentBase])
export class FabComponent extends Fab implements IComponentBase {
    public declare containerContext : any;
    public declare tagObjects: any;
	declare clicked: any;
	public declare created: any;



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

