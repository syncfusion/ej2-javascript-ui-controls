import { Component, ElementRef, ViewContainerRef, ValueProvider, Renderer2, Injector, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef, ContentChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, FormBase, setValue } from '@syncfusion/ej2-angular-base';
import { Uploader } from '@syncfusion/ej2-inputs';
import { Template } from '@syncfusion/ej2-angular-base';
import { FilesDirective } from './files.directive';

export const inputs: string[] = ['allowedExtensions','asyncSettings','autoUpload','buttons','cssClass','directoryUpload','dropArea','dropEffect','enableHtmlSanitizer','enablePersistence','enableRtl','enabled','files','htmlAttributes','locale','maxFileSize','minFileSize','multiple','sequentialUpload','showFileList','template'];
export const outputs: string[] = ['focus', 'blur', 'actionComplete','beforeRemove','beforeUpload','canceling','change','chunkFailure','chunkSuccess','chunkUploading','clearing','created','failure','fileListRendering','pausing','progress','removing','rendering','resuming','selected','success','uploading'];
export const twoWays: string[] = [];

/**
 * Represents the EJ2 Angular Uploader Component.
 * ```html
 * <ejs-uploader></ejs-uploader>
 * ```
 */
@Component({
    selector: 'ejs-uploader',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UploaderComponent),
            multi: true
        }
    ],
    queries: {
        childFiles: new ContentChild(FilesDirective),
        template: new ContentChild('template')
    }
})
@ComponentMixins([ComponentBase, FormBase])
export class UploaderComponent extends Uploader implements IComponentBase {
    public formCompContext : any;
    public formContext : any;
    public declare tagObjects: any;
	declare actionComplete: any;
	declare beforeRemove: any;
	declare beforeUpload: any;
	declare canceling: any;
	declare change: any;
	declare chunkFailure: any;
	declare chunkSuccess: any;
	declare chunkUploading: any;
	declare clearing: any;
	declare created: any;
	declare failure: any;
	declare fileListRendering: any;
	declare pausing: any;
	declare progress: any;
	declare removing: any;
	declare rendering: any;
	declare resuming: any;
	declare selected: any;
	declare success: any;
	public declare uploading: any;
    public declare childFiles: any;
    public tags: string[] = ['files'];

    public declare focus: any;
    public declare blur: any;
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
        this.tagObjects[0].instance = this.childFiles;
        this.formCompContext.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(UploaderComponent.prototype, 'template');

