import { Component, ElementRef, ViewContainerRef, ValueProvider, Renderer2, Injector, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef, ContentChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, FormBase, setValue } from '@syncfusion/ej2-angular-base';
import { RichTextEditor } from '@syncfusion/ej2-richtexteditor';
import { Template } from '@syncfusion/ej2-angular-base';


export const inputs: string[] = ['aiAssistantSettings','autoSaveOnIdle','backgroundColor','bulletFormatList','codeBlockSettings','cssClass','editorMode','emojiPickerSettings','enableAutoUrl','enableClipboardCleanup','enableHtmlEncode','enableHtmlSanitizer','enableMarkdownAutoFormat','enablePersistence','enableResize','enableRtl','enableTabKey','enableWebMcp','enableXhtml','enabled','enterKey','exportPdf','exportWord','fileManagerSettings','floatingToolbarOffset','fontColor','fontFamily','fontSize','format','formatPainterSettings','formatter','height','htmlAttributes','iframeSettings','importWord','inlineMode','insertAudioSettings','insertImageSettings','insertVideoSettings','keyConfig','lineHeight','locale','maxLength','numberFormatList','pasteCleanupSettings','placeholder','quickToolbarSettings','readonly','saveInterval','shiftEnterKey','showCharCount','showTooltip','slashMenuSettings','tableSettings','toolbarSettings','undoRedoSteps','undoRedoTimer','value','valueTemplate','width'];
export const outputs: string[] = ['actionBegin','actionComplete','afterImageDelete','afterMediaDelete','afterPasteCleanup','aiAssistantPromptRequest','aiAssistantStopRespondingClick','aiAssistantToolbarClick','beforeClipboardWrite','beforeDialogClose','beforeDialogOpen','beforeFileUpload','beforeImageDrop','beforeImageUpload','beforeMediaDrop','beforePasteCleanup','beforePopupClose','beforePopupOpen','beforeQuickToolbarOpen','beforeSanitizeHtml','beforeWebMcpToolExecute','blur','change','created','destroyed','dialogClose','dialogOpen','documentExporting','fileRemoving','fileSelected','fileUploadFailed','fileUploadSuccess','fileUploading','focus','imageRemoving','imageSelected','imageUploadFailed','imageUploadSuccess','imageUploading','quickToolbarClose','quickToolbarOpen','resizeStart','resizeStop','resizing','selectionChanged','slashMenuItemSelect','toolbarClick','toolbarStatusUpdate','updatedToolbarStatus','wordImporting','valueChange'];
export const twoWays: string[] = ['value'];

/**
 * `ejs-richtexteditor` represents the Angular richtexteditor Component.
 * ```html
 * <ejs-richtexteditor></ejs-richtexteditor>
 * ```
 */
@Component({
    selector: 'ejs-richtexteditor',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RichTextEditorComponent),
            multi: true
        }
    ],
    queries: {
        valueTemplate: new ContentChild('valueTemplate'),
        aiAssistantSettings_bannerTemplate: new ContentChild('aiAssistantSettingsBannerTemplate')
    }
})
@ComponentMixins([ComponentBase, FormBase])
export class RichTextEditorComponent extends RichTextEditor implements IComponentBase {
    public formCompContext : any;
    public formContext : any;
    public declare tagObjects: any;
	declare actionBegin: any;
	declare actionComplete: any;
	declare afterImageDelete: any;
	declare afterMediaDelete: any;
	declare afterPasteCleanup: any;
	declare aiAssistantPromptRequest: any;
	declare aiAssistantStopRespondingClick: any;
	declare aiAssistantToolbarClick: any;
	declare beforeClipboardWrite: any;
	declare beforeDialogClose: any;
	declare beforeDialogOpen: any;
	declare beforeFileUpload: any;
	declare beforeImageDrop: any;
	declare beforeImageUpload: any;
	declare beforeMediaDrop: any;
	declare beforePasteCleanup: any;
	declare beforePopupClose: any;
	declare beforePopupOpen: any;
	declare beforeQuickToolbarOpen: any;
	declare beforeSanitizeHtml: any;
	declare beforeWebMcpToolExecute: any;
	declare blur: any;
	declare change: any;
	declare created: any;
	declare destroyed: any;
	declare dialogClose: any;
	declare dialogOpen: any;
	declare documentExporting: any;
	declare fileRemoving: any;
	declare fileSelected: any;
	declare fileUploadFailed: any;
	declare fileUploadSuccess: any;
	declare fileUploading: any;
	declare focus: any;
	declare imageRemoving: any;
	declare imageSelected: any;
	declare imageUploadFailed: any;
	declare imageUploadSuccess: any;
	declare imageUploading: any;
	declare quickToolbarClose: any;
	declare quickToolbarOpen: any;
	declare resizeStart: any;
	declare resizeStop: any;
	declare resizing: any;
	declare selectionChanged: any;
	declare slashMenuItemSelect: any;
	declare toolbarClick: any;
	declare toolbarStatusUpdate: any;
	declare updatedToolbarStatus: any;
	declare wordImporting: any;
	public declare valueChange: any;



    private skipFromEvent:boolean = true;
    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector, private cdr: ChangeDetectorRef) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('RichTextEditorToolbar');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('RichTextEditorLink');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('RichTextEditorImage');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('RichTextEditorImportExport');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('RichTextEditorAudio');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('RichTextEditorVideo');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('RichTextEditorCount');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('RichTextEditorQuickToolbar');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('RichTextEditorHtmlEditor');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('RichTextEditorMarkdownEditor');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('RichTextEditorTable');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('RichTextEditorPasteCleanup');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('RichTextEditorResize');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('RichTextEditorFileManager');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('RichTextEditorFormatPainter');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('RichTextEditorEmojiPicker');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('RichTextEditorSlashMenu');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('RichTextEditorCodeBlock');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('RichTextEditorClipBoardCleanup');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('RichTextEditorAutoFormat');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('RichTextEditorAIAssistant');
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
Template()(RichTextEditorComponent.prototype, 'valueTemplate');
Template()(RichTextEditorComponent.prototype, 'aiAssistantSettings_bannerTemplate');

