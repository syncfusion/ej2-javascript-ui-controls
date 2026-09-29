import { Component, ElementRef, ViewContainerRef, Renderer2, Injector, ChangeDetectionStrategy, QueryList, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, ComponentMixins, IComponentBase, applyMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { BlockEditor } from '@syncfusion/ej2-blockeditor';



export const inputs: string[] = ['backgroundColorSettings','blockActionMenuSettings','blocks','codeBlockSettings','collaborationSettings','commandMenuSettings','contextMenuSettings','cssClass','currentUserId','enableDragAndDrop','enableHtmlEncode','enableHtmlSanitizer','enablePersistence','enableRtl','fontColorSettings','height','imageBlockSettings','inlineToolbarSettings','keyConfig','labelSettings','locale','pasteCleanupSettings','readOnly','transformSettings','undoRedoStack','users','width'];
export const outputs: string[] = ['afterPasteCleanup','beforeFileUpload','beforePasteCleanup','blockChanged','blockDragStart','blockDragging','blockDropped','blur','created','fileUploadFailed','fileUploadSuccess','fileUploading','focus','selectionChanged','blocksChange'];
export const twoWays: string[] = ['blocks'];

/**
 * Represents the Essential JS 2 Angular BlockEditor Component.
 * ```html
 * <ejs-blockeditor></ejs-blockeditor>
 * ```
 */
@Component({
    selector: '[ejs-blockeditor], ejs-blockeditor',
    inputs: inputs,
    outputs: outputs,
    template: `<ng-content ></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
    }
})
@ComponentMixins([ComponentBase])
export class BlockEditorComponent extends BlockEditor implements IComponentBase {
    public declare containerContext : any;
    public declare tagObjects: any;
	declare afterPasteCleanup: any;
	declare beforeFileUpload: any;
	declare beforePasteCleanup: any;
	declare blockChanged: any;
	declare blockDragStart: any;
	declare blockDragging: any;
	declare blockDropped: any;
	declare blur: any;
	declare created: any;
	declare fileUploadFailed: any;
	declare fileUploadSuccess: any;
	declare fileUploading: any;
	declare focus: any;
	declare selectionChanged: any;
	public declare blocksChange: any;

    public tags: string[] = [''];

    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('BlockEditorCollaboration');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('BlockEditorVersionHistory');
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
        
        this.containerContext.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}

