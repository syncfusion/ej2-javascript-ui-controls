import { Component, ElementRef, ViewContainerRef, ValueProvider, Renderer2, Injector, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef, ContentChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, FormBase, setValue } from '@syncfusion/ej2-angular-base';
import { Rating } from '@syncfusion/ej2-inputs';
import { Template } from '@syncfusion/ej2-angular-base';


export const inputs: string[] = ['allowReset','cssClass','disabled','emptyTemplate','enableAnimation','enablePersistence','enableRtl','enableSingleSelection','fullTemplate','itemsCount','labelPosition','labelTemplate','locale','min','precision','readOnly','showLabel','showTooltip','tooltipTemplate','value','visible'];
export const outputs: string[] = ['focus', 'blur', 'beforeItemRender','created','onItemHover','valueChanged','valueChange'];
export const twoWays: string[] = ['value'];

/**
 * Represents the EJ2 Angular Rating Component.
 * ```html
 * <input ejs-rating [value]='value' />
 * ```
 */
@Component({
    selector: '[ejs-rating]',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RatingComponent),
            multi: true
        }
    ],
    queries: {
        fullTemplate: new ContentChild('fullTemplate'),
        emptyTemplate: new ContentChild('emptyTemplate'),
        tooltipTemplate: new ContentChild('tooltipTemplate'),
        labelTemplate: new ContentChild('labelTemplate')
    }
})
@ComponentMixins([ComponentBase, FormBase])
export class RatingComponent extends Rating implements IComponentBase {
    public formCompContext : any;
    public formContext : any;
    public declare tagObjects: any;
	declare beforeItemRender: any;
	declare created: any;
	declare onItemHover: any;
	declare valueChanged: any;
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
Template()(RatingComponent.prototype, 'fullTemplate');
Template()(RatingComponent.prototype, 'emptyTemplate');
Template()(RatingComponent.prototype, 'tooltipTemplate');
Template()(RatingComponent.prototype, 'labelTemplate');

