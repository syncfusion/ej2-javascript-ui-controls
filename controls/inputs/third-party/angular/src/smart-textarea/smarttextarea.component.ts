import { Component, ElementRef, ViewContainerRef, ValueProvider, Renderer2, Injector, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, FormBase, setValue } from '@syncfusion/ej2-angular-base';
import { SmartTextArea } from '@syncfusion/ej2-inputs';



export const inputs: string[] = ['UserPhrases','adornmentFlow','adornmentOrientation','aiSuggestionHandler','appendTemplate','cols','cssClass','enablePersistence','enableRtl','enabled','floatLabelType','htmlAttributes','locale','maxLength','placeholder','prependTemplate','readonly','resizeMode','rows','showClearButton','showSuggestionOnPopup','userRole','value','width'];
export const outputs: string[] = ['afterSuggestionInsert','beforeSuggestionInsert','blur','change','created','destroyed','focus','input','valueChange'];
export const twoWays: string[] = ['value'];

/**
 * Represents the Angular Smart TextArea Component.
 * ```html
 * <ejs-smarttextarea></ejs-smarttextarea>
 * ```
 */
@Component({
    selector: 'ejs-smarttextarea',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SmartTextAreaComponent),
            multi: true
        }
    ],
    queries: {
    }
})
@ComponentMixins([ComponentBase, FormBase])
export class SmartTextAreaComponent extends SmartTextArea implements IComponentBase {
    public formCompContext : any;
    public formContext : any;
    public declare tagObjects: any;
	declare afterSuggestionInsert: any;
	declare beforeSuggestionInsert: any;
	declare blur: any;
	declare change: any;
	declare created: any;
	declare destroyed: any;
	declare focus: any;
	declare input: any;
	public declare valueChange: any;



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

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}

