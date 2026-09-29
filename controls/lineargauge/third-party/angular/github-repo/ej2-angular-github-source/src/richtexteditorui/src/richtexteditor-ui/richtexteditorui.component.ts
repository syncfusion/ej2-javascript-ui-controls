import { Component, ElementRef, ViewContainerRef, ValueProvider, Renderer2, Injector, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, FormBase, setValue } from '@syncfusion/ej2-angular-base';
import { RichTextEditorUI } from '@syncfusion/ej2-richtexteditor-ui';



export const inputs: string[] = ['backgroundColor','cssClass','enable','enableAutoSave','enableHtmlSanitizer','enablePersistence','enableRtl','fontColor','fontFamily','fontSize','format','height','htmlAttributes','imageSettings','interactionSettings','linkSettings','listSettings','locale','placeholder','quickToolbarSettings','readonly','saveInterval','slashCommandSettings','tableSettings','toolbarSettings','undoRedoSteps','undoRedoTimer','value','valueFormat','width'];
export const outputs: string[] = ['slashCommanditemSelect','actionBegin','actionComplete','beforeDialogClose','beforeDialogOpen','beforeFileDrop','beforeFileUpload','beforePopupClose','beforePopupOpen','blurred','change','created','destroyed','fileRemoving','fileSelected','fileUploadFailed','fileUploadSuccess','fileUploading','focused','itemClick','resize','resizeStop','resizing','updatedToolbarStatus','valueChange'];
export const twoWays: string[] = ['value'];

/**
 * `ejs-richtexteditor-ui` represents the Angular Rich Text Editor UI component.
 * ```html
 * <ejs-richtexteditor-ui></ejs-richtexteditor-ui>
 * ```
 */
@Component({
    selector: 'ejs-richtexteditor-ui',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RichTextEditorUIComponent),
            multi: true
        }
    ],
    queries: {
    }
})
@ComponentMixins([ComponentBase, FormBase])
export class RichTextEditorUIComponent extends RichTextEditorUI implements IComponentBase {
    public formCompContext : any;
    public formContext : any;
    public declare tagObjects: any;
	declare slashCommanditemSelect: any;
	declare actionBegin: any;
	declare actionComplete: any;
	declare beforeDialogClose: any;
	declare beforeDialogOpen: any;
	declare beforeFileDrop: any;
	declare beforeFileUpload: any;
	declare beforePopupClose: any;
	declare beforePopupOpen: any;
	declare blurred: any;
	declare change: any;
	declare created: any;
	declare destroyed: any;
	declare fileRemoving: any;
	declare fileSelected: any;
	declare fileUploadFailed: any;
	declare fileUploadSuccess: any;
	declare fileUploading: any;
	declare focused: any;
	declare itemClick: any;
	declare resize: any;
	declare resizeStop: any;
	declare resizing: any;
	declare updatedToolbarStatus: any;
	public declare valueChange: any;



    private skipFromEvent:boolean = true;
    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector, private cdr: ChangeDetectorRef) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('RichTextEditor-UISlashCommand');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }

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

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}

