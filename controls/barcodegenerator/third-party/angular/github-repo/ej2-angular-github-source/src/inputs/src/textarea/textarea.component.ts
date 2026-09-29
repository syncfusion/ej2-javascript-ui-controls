import { Component, ElementRef, ViewContainerRef, ValueProvider, Renderer2, Injector, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef, ContentChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, FormBase, setValue } from '@syncfusion/ej2-angular-base';
import { TextArea } from '@syncfusion/ej2-inputs';
import { Template } from '@syncfusion/ej2-angular-base';


export const inputs: string[] = ['adornmentFlow','adornmentOrientation','appendTemplate','cols','cssClass','enablePersistence','enableRtl','enabled','floatLabelType','htmlAttributes','locale','maxLength','placeholder','prependTemplate','readonly','resizeMode','rows','showClearButton','value','width'];
export const outputs: string[] = ['blur','change','created','destroyed','focus','input','valueChange'];
export const twoWays: string[] = ['value'];

/**
 * Represents the EJ2 Angular TextArea Component.
 * ```html
 * <ejs-textarea [value]='value'></ejs-textarea>
 * ```
 */
@Component({
    selector: 'ejs-textarea',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextAreaComponent),
            multi: true
        }
    ],
    queries: {
        prependTemplate: new ContentChild('prependTemplate'),
        appendTemplate: new ContentChild('appendTemplate')
    }
})
@ComponentMixins([ComponentBase, FormBase])
export class TextAreaComponent extends TextArea implements IComponentBase {
    public formCompContext : any;
    public formContext : any;
    public declare tagObjects: any;
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
Template()(TextAreaComponent.prototype, 'prependTemplate');
Template()(TextAreaComponent.prototype, 'appendTemplate');

