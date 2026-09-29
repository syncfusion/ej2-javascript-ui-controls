import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { HeaderRowsModel } from '@syncfusion/ej2-schedule';

export let HeaderRowsDirective =  vueDefineComponent({
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
            return 'e-header-rows';
        }
    }
});
export const HeaderRowsPlugin = {
    name: 'e-header-rows',
    install(Vue: any) {
        Vue.component(HeaderRowsPlugin.name, HeaderRowsDirective);
    }
}

/**
 * `e-header-rows` directive represent a header rows of the VueJS Schedule. 
 * It must be contained in a Schedule component(`ejs-schedule`). 
 * ```js
 * <ejs-schedule>
 *   <e-header-rows>
 *    <e-header-row option='Week'></e-header-row>
 *    <e-header-row option='Date'></e-header-row>
 *   </e-header-rows>
 * </ejs-schedule>
 * ```
 */
export let HeaderRowDirective: DefineVueDirective<HeaderRowsModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-header-row';
        }
    }
});
export const HeaderRowPlugin = {
    name: 'e-header-row',
    install(Vue: any) {
        Vue.component(HeaderRowPlugin.name, HeaderRowDirective);
    }
}