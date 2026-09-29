import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ConditionalFormatModel } from '@syncfusion/ej2-spreadsheet';

export let ConditionalFormatsDirective =  vueDefineComponent({
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
            return 'e-conditionalformats';
        }
    }
});
export const ConditionalFormatsPlugin = {
    name: 'e-conditionalformats',
    install(Vue: any) {
        Vue.component(ConditionalFormatsPlugin.name, ConditionalFormatsDirective);
    }
}

/**
 * `e-conditionalformat` directive represent a conditionalformat of the VueJS Spreadsheet.
 * It must be contained in a `e-sheet` directive.
 * ```html
 * <ejs-spreadsheet>
 *   <e-sheets>
 *    <e-sheet>
 *    <e-conditionalformats>
 *    <e-conditionalformat></e-conditionalformat>
 *    </e-conditionalformats>
 *    </e-sheet>
 *   </e-sheets>
 * </ejs-spreadsheet>
 * ```
 */
export let ConditionalFormatDirective: DefineVueDirective<ConditionalFormatModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-conditionalformat';
        }
    }
});
export const ConditionalFormatPlugin = {
    name: 'e-conditionalformat',
    install(Vue: any) {
        Vue.component(ConditionalFormatPlugin.name, ConditionalFormatDirective);
    }
}