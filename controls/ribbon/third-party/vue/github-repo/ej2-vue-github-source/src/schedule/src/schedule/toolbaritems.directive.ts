import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ToolbarItemModel } from '@syncfusion/ej2-schedule';

export let ToolbarItemsDirective =  vueDefineComponent({
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
            return 'e-toolbaritems';
        }
    }
});
export const ToolbarItemsPlugin = {
    name: 'e-toolbaritems',
    install(Vue: any) {
        Vue.component(ToolbarItemsPlugin.name, ToolbarItemsDirective);
    }
}

/**
 * `e-toolbaritems` directive represent a custom toolbar items of the VueJS Schedule. 
 * It must be contained in a Schedule component(`ejs-schedule`). 
 * ```js
 * <ejs-schedule>
 *   <e-toolbaritems>
 *    <e-toolbaritem name='Today'></<e-toolbaritem>
 *    <e-toolbaritem name='DateRangeText'></e-toolbaritem>
 *    <e-toolbaritem prefixIcon='e-icons e-cut' text='Cut'></e-toolbaritem>
 *   <e-toolbaritems>
 * </ejs-schedule>
 * ```
 */
export let ToolbarItemDirective: DefineVueDirective<ToolbarItemModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-toolbaritem';
        }
    }
});
export const ToolbarItemPlugin = {
    name: 'e-toolbaritem',
    install(Vue: any) {
        Vue.component(ToolbarItemPlugin.name, ToolbarItemDirective);
    }
}