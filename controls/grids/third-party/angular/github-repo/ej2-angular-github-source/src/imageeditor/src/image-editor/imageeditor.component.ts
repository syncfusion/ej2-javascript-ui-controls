import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { ImageEditor } from '@syncfusion/ej2-image-editor';
import { Template } from '@syncfusion/ej2-angular-base';


export const inputs: string[] = ['allowUndoRedo','cssClass','disabled','enablePersistence','enableRtl','finetuneSettings','fontFamily','height','imageSmoothingEnabled','isReadOnly','locale','quickAccessToolbarTemplate','selectionSettings','showQuickAccessToolbar','theme','toolbar','toolbarTemplate','uploadSettings','width','zoomSettings'];
export const outputs: string[] = ['beforeSave','click','created','cropping','destroyed','editComplete','fileOpened','finetuneValueChanging','flipping','frameChange','imageFiltering','panning','quickAccessToolbarItemClick','quickAccessToolbarOpen','resizing','rotating','saved','selectionChanging','shapeChange','shapeChanging','toolbarCreated','toolbarItemClicked','toolbarUpdating','zooming'];
export const twoWays: string[] = [''];

/**
 * Represents the EJ2 Angular ImageEditor Component.
 * ```html
 * <ejs-imageeditor></ejs-imageeditor>
 * ```
 */
@Component({
    selector: 'ejs-imageeditor',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        toolbarTemplate: new ContentChild('toolbarTemplate')
    }
})
@ComponentMixins([ComponentBase])
export class ImageEditorComponent extends ImageEditor implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare beforeSave: any;
	declare click: any;
	declare created: any;
	declare cropping: any;
	declare destroyed: any;
	declare editComplete: any;
	declare fileOpened: any;
	declare finetuneValueChanging: any;
	declare flipping: any;
	declare frameChange: any;
	declare imageFiltering: any;
	declare panning: any;
	declare quickAccessToolbarItemClick: any;
	declare quickAccessToolbarOpen: any;
	declare resizing: any;
	declare rotating: any;
	declare saved: any;
	declare selectionChanging: any;
	declare shapeChange: any;
	declare shapeChanging: any;
	declare toolbarCreated: any;
	declare toolbarItemClicked: any;
	declare toolbarUpdating: any;
	public declare zooming: any;



    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];

        this.registerEvents(outputs);
        this.addTwoWay.call(this, twoWays);
        setValue('currentInstance', this, this.viewContainerRef);
        this.context  = new ComponentBase();
    }

    public ngOnInit() {
        this.context.ngOnInit(this);
    }

    public ngAfterViewInit(): void {
        this.context.ngAfterViewInit(this);
    }

    public ngOnDestroy(): void {
        this.context.ngOnDestroy(this);
    }

    public ngAfterContentChecked(): void {
        
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(ImageEditorComponent.prototype, 'toolbarTemplate');


