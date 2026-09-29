import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ViewsModel } from '@syncfusion/ej2-schedule';

export let ViewsDirective =  vueDefineComponent({
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
            return 'e-views';
        }
    }
});
export const ViewsPlugin = {
    name: 'e-views',
    install(Vue: any) {
        Vue.component(ViewsPlugin.name, ViewsDirective);
    }
}

/**
 * `e-views` directive represent a view of the VueJS Schedule. 
 * It must be contained in a Schedule component(`ejs-schedule`). 
 * ```js
 * <ejs-schedule>
 *   <e-views>
 *    <e-view option='day' dateFormat='dd MMM'></e-view>
 *    <e-view option='week'></e-view>
 *   </e-views>
 * </ejs-schedule>
 * ```
 */
export let ViewDirective: DefineVueDirective<ViewsModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-view';
        }
    }
});
export const ViewPlugin = {
    name: 'e-view',
    install(Vue: any) {
        Vue.component(ViewPlugin.name, ViewDirective);
    }
}