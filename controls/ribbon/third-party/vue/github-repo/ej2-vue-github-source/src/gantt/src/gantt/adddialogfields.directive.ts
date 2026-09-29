import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { AddDialogFieldSettingsModel } from '@syncfusion/ej2-gantt';

export let AddDialogFieldsDirective =  vueDefineComponent({
    inject: { custom: { default: null } },
    render(createElement: any): void {
        if (!isExecute) {
            let h: any = !isExecute ? gh : createElement;
            let slots: any = null;
            if(!isNullOrUndefined((this as any).$slots.default)) {
                slots = !isExecute ? (this as any).$slots.default() : (this as any).$slots.default;
            }
            return h('div', { class: 'e-directive' }, slots);
        }
        return;
    },
    updated(): void {
        if (!isExecute && this.custom) { this.custom() }
    },
    methods: {
        getTag(): string {
            return 'e-add-dialog-fields';
        }
    }
});
export const AddDialogFieldsPlugin = {
    name: 'e-add-dialog-fields',
    install(Vue: any) {
        Vue.component(AddDialogFieldsPlugin.name, AddDialogFieldsDirective);
    }
}

/**
 * `e-add-dialog-fields` directive represent a add dialog fields in VueJS Gantt. 
 * It must be contained in a Gantt component(`ejs-gantt`). 
 * ```vue
 * <ejs-gantt :dataSource]='data' allowSelection='true' allowSorting='true'>
 *   <e-add-dialog-fields>
 *     <e-add-dialog-field type='General' headerText='General'/>
 *     <e-add-dialog-field type='Dependency' headerText='Dependency'/>
 *   </e-add-dialog-fields>
 * </ejs-gantt>
 * ```
 */
export let AddDialogFieldDirective: DefineVueDirective<AddDialogFieldSettingsModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-add-dialog-field';
        }
    }
});
export const AddDialogFieldPlugin = {
    name: 'e-add-dialog-field',
    install(Vue: any) {
        Vue.component(AddDialogFieldPlugin.name, AddDialogFieldDirective);
    }
}