import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { EditDialogFieldSettingsModel } from '@syncfusion/ej2-gantt';

export let EditDialogFieldsDirective =  vueDefineComponent({
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
            return 'e-edit-dialog-fields';
        }
    }
});
export const EditDialogFieldsPlugin = {
    name: 'e-edit-dialog-fields',
    install(Vue: any) {
        Vue.component(EditDialogFieldsPlugin.name, EditDialogFieldsDirective);
    }
}

/**
 * `e-edit-dialog-fields` directive represent a add dialog fields in VueJS Gantt. 
 * It must be contained in a Gantt component(`ejs-gantt`). 
 * ```vue
 * <ejs-gantt :dataSource]='data' allowSelection='true' allowSorting='true'>
 *   <e-edit-dialog-fields>
 *     <e-edit-dialog-field type='General' headerText='General'/>
 *     <e-edit-dialog-field type='Dependency' headerText='Dependency'/>
 *   </e-edit-dialog-fields>
 * </ejs-gantt>
 * ```
 */
export let EditDialogFieldDirective: DefineVueDirective<EditDialogFieldSettingsModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-edit-dialog-field';
        }
    }
});
export const EditDialogFieldPlugin = {
    name: 'e-edit-dialog-field',
    install(Vue: any) {
        Vue.component(EditDialogFieldPlugin.name, EditDialogFieldDirective);
    }
}