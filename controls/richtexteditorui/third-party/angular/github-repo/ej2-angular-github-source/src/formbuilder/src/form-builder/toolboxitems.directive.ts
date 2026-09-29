import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';
import { Template } from '@syncfusion/ej2-angular-base';


let input: string[] = ['template', 'templateId', 'type'];
let outputs: string[] = [];
/**
 * `e-toolboxItemSettings` directive represents a custom widget
 * configuration item of the Angular FormBuilder component.
 * It must be contained within the `e-toolboxItemSettings`
 * collection of an `ejs-form-builder` component.
 * ```html
 * <ejs-form-builder>
 * <e-toolboxItemSettings>
 * <e-toolboxItemSetting></e-toolboxItemSetting>
 * </e-toolboxItemSettings>
 * </ejs-form-builder>
 * ```
 */
@Directive({
    selector: 'e-toolboxitemsettings>e-toolboxitemsetting',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        template: new ContentChild('template')
    }
})
export class ToolboxItemSettingDirective extends ComplexBase<ToolboxItemSettingDirective> {
    public directivePropList: any;
	


    /** 
     * Specifies the Form Builder component type that this toolbox entry customizes.
     * @default ''
     */
    public declare type: any;
    /** 
     * Specifies a stable identifier that is persisted in the field schema, 
     * allowing a downstream Form Renderer to resolve the matching custom-template 
     * implementation when the schema is re-imported.
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
Template()(ToolboxItemSettingDirective.prototype, 'template');

/**
 * ToolboxItemSetting Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-formbuilder>e-toolboxitemsettings',
    standalone: true,
    queries: {
        children: new ContentChildren(ToolboxItemSettingDirective)
    },
})
export class ToolboxItemSettingsDirective extends ArrayBase<ToolboxItemSettingsDirective> {
    constructor() {
        super('toolboxitems');
    }
}