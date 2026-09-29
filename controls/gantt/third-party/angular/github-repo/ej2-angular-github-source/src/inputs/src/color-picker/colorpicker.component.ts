import { Component, ElementRef, ViewContainerRef, ValueProvider, Renderer2, Injector, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, FormBase, setValue } from '@syncfusion/ej2-angular-base';
import { ColorPicker } from '@syncfusion/ej2-inputs';



export const inputs: string[] = ['columns','createPopupOnClick','cssClass','disabled','enableOpacity','enablePersistence','enableRtl','inline','locale','mode','modeSwitcher','noColor','presetColors','showButtons','showRecentColors','value'];
export const outputs: string[] = ['focus', 'blur', 'beforeClose','beforeModeSwitch','beforeOpen','beforeTileRender','change','created','onModeSwitch','open','select','valueChange'];
export const twoWays: string[] = ['value'];

/**
 * Represents the EJ2 Angular ColorPicker Component.
 * ```html
 * <input ejs-colorpicker type='color'/>
 * ```
 */
@Component({
    selector: '[ejs-colorpicker]',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ColorPickerComponent),
            multi: true
        }
    ],
    queries: {
    }
})
@ComponentMixins([ComponentBase, FormBase])
export class ColorPickerComponent extends ColorPicker implements IComponentBase {
    public formCompContext : any;
    public formContext : any;
    public declare tagObjects: any;
	declare beforeClose: any;
	declare beforeModeSwitch: any;
	declare beforeOpen: any;
	declare beforeTileRender: any;
	declare change: any;
	declare created: any;
	declare onModeSwitch: any;
	declare open: any;
	declare select: any;
	public declare valueChange: any;



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
        
        this.formCompContext.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}

