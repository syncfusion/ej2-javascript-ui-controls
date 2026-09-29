import { Component, ElementRef, ViewContainerRef, ValueProvider, Renderer2, Injector, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef, ContentChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, FormBase, setValue } from '@syncfusion/ej2-angular-base';
import { MarkdownEditor } from '@syncfusion/ej2-markdowneditor';
import { Template } from '@syncfusion/ej2-angular-base';


export const inputs: string[] = ['autoSaveOnIdle','cssClass','enableAutoUrl','enablePersistence','enableResize','enableRtl','enabled','format','formatter','height','htmlAttributes','insertImageSettings','keyConfig','locale','maxLength','placeholder','readonly','saveInterval','showCharCount','showTooltip','toolbarSettings','undoRedoSteps','undoRedoTimer','value','valueTemplate','width'];
export const outputs: string[] = ['actionBegin','actionComplete','beforeDialogClose','beforeDialogOpen','beforeImageUpload','blur','change','created','destroyed','dialogClose','dialogOpen','focus','imageRemoving','imageSelected','imageUploadFailed','imageUploadSuccess','imageUploading','resizeStart','resizeStop','resizing','toolbarClick','updatedToolbarStatus','valueChange'];
export const twoWays: string[] = ['value'];

/**
 * `ejs-markdowneditor` represents the Angular markdowneditor Component.
 * ```html
 * <ejs-markdowneditor></ejs-markdowneditor>
 * ```
 */
@Component({
    selector: 'ejs-markdowneditor',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MarkdownEditorComponent),
            multi: true
        }
    ],
    queries: {

    }
})
@ComponentMixins([ComponentBase, FormBase])
export class MarkdownEditorComponent extends MarkdownEditor implements IComponentBase {
    public formCompContext : any;
    public formContext : any;
    public tagObjects: any;
	actionBegin: any;
	actionComplete: any;
	beforeDialogClose: any;
	beforeDialogOpen: any;
	beforeImageUpload: any;
	blur: any;
	change: any;
	created: any;
	destroyed: any;
	dialogClose: any;
	dialogOpen: any;
	focus: any;
	imageRemoving: any;
	imageSelected: any;
	imageUploadFailed: any;
	imageUploadSuccess: any;
	imageUploading: any;
	resizeStart: any;
	resizeStop: any;
	resizing: any;
	toolbarClick: any;
	updatedToolbarStatus: any;
	public valueChange: any;


    /** 
     * Accepts a template design and assigns it as the content of the Rich Text Editor. 
     * The built-in template engine provides options to compile a template string into an executable function. 
     * For example, it supports expression evaluation similar to ES6 template string literals.
     * 
     * {% codeBlock src='rich-text-editor/value-template/index.md' %}{% endcodeBlock %}
     *     
     * @default null
     * @asptype string
     */
    @ContentChild('valueTemplate')
    @Template()
    public valueTemplate: any;

    private skipFromEvent:boolean = true;
    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector, private cdr: ChangeDetectorRef) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];

        this.registerEvents(outputs);
        this.addTwoWay.call(this, twoWays);
        setValue('currentInstance', this, this.viewContainerRef);
        this.formContext  = new FormBase();
        this.formCompContext  = new ComponentBase();
    }

    public registerOnChange(registerFunction: (_: any) => void): void {
    }

    public registerOnTouched(registerFunction: () => void): void {
    }

    public writeValue(value: any): void {
    }
    
    public setDisabledState(disabled: boolean): void {
    }

    public ngOnInit() {
        this.formCompContext.ngOnInit(this);
    }

    public ngAfterViewInit(): void {
        this.formContext.ngAfterViewInit(this);
    }

    public ngOnDestroy(): void {
        this.formCompContext.ngOnDestroy(this);
    }

    public ngAfterContentChecked(): void {
        
        this.formCompContext.ngAfterContentChecked(this);
    }

    public registerEvents: (eventList: string[]) => void;
    public addTwoWay: (propList: string[]) => void;
}

