import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { DefineNameModel } from '@syncfusion/ej2-spreadsheet';

export let DefinedNamesDirective =  vueDefineComponent({
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
            return 'e-definednames';
        }
    }
});
export const DefinedNamesPlugin = {
    name: 'e-definednames',
    install(Vue: any) {
        Vue.component(DefinedNamesPlugin.name, DefinedNamesDirective);
    }
}

/**
 * `e-definedname` directive represent a defined name of the VueJS Spreadsheet.
 * It must be contained in a Spreadsheet component(`ejs-spreadsheet`).
 * ```html
 * <ejs-spreadsheet>
 *   <e-definednames>
 *    <e-definedname></e-definedname>
 *    <e-definedname></e-definedname>
 *   </e-definednames>
 * </ejs-spreadsheet>
 * ```
 */
export let DefinedNameDirective: DefineVueDirective<DefineNameModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-definedname';
        }
    }
});
export const DefinedNamePlugin = {
    name: 'e-definedname',
    install(Vue: any) {
        Vue.component(DefinedNamePlugin.name, DefinedNameDirective);
    }
}