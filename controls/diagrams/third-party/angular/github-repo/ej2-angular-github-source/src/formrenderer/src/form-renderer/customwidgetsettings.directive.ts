import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';
import { Template } from '@syncfusion/ej2-angular-base';


let input: string[] = ['fieldName', 'template', 'templateId', 'type'];
let outputs: string[] = [];
/**
 * `e-custom-widget-setting` directive represents a custom widget
 * configuration item of the Angular FormRenderer component.
 * It must be contained within the `e-custom-widget-settings`
 * collection of an `ejs-form-renderer` component.
 * ```html
 * <ejs-form-renderer>
 * <e-customwidgetsettings>
 * <e-customwidgetsetting></e-customwidgetsetting>
 * </e-customwidgetsettings>
 * </ejs-form-renderer>
 * ```
 */
@Directive({
    selector: 'e-customwidgetsettings>e-customwidgetsetting',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        template: new ContentChild('template')
    }
})
export class CustomWidgetSettingDirective extends ComplexBase<CustomWidgetSettingDirective> {
    public directivePropList: any;
	


    /** 
     * Specifies the type of the widget to which the template must be bound. The values will be FormComponentType.
     * @default ''
     */
    public declare type: any;
    /** 
     * Specifies the name of the field to which the template must be bound. When set, the template is rendered to the control with the matching name, irrespective of the type property value.
     * @default ''
     */
    public declare fieldName: any;
    /** 
     * Specifies an optional template identifier. When set, the template is rendered to the JSON object whose templateId matches this value, irrespective of the type.
     * @default ''
     */
    public declare templateId: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}
Template()(CustomWidgetSettingDirective.prototype, 'template');

/**
 * CustomWidgetSetting Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-formrenderer>e-customwidgetsettings',
    standalone: true,
    queries: {
        children: new ContentChildren(CustomWidgetSettingDirective)
    },
})
export class CustomWidgetSettingsDirective extends ArrayBase<CustomWidgetSettingsDirective> {
    constructor() {
        super('customwidgetsettings');
    }
}