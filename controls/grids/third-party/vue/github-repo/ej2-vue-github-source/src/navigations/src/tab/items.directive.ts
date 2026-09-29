import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { TabItemModel } from '@syncfusion/ej2-navigations';

export let TabItemsDirective =  vueDefineComponent({
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
            return 'e-tabitems';
        }
    }
});
export const TabItemsPlugin = {
    name: 'e-tabitems',
    install(Vue: any) {
        Vue.component(TabItemsPlugin.name, TabItemsDirective);
    }
}

/**
 * 'e-tabitem' directive represent a item of the Vue Tab 
 * It must be contained in a Tab component(`ejs-tab`). 
 * ```html
 * <ejs-tab>
 *  <e-tabitems>
 *   <e-tabitem :header='Header 1' :content='Content 1'></e-tabitem>
 *   <e-tabitem :header='Header 2' :content='Content 2'></e-tabitem>
 *  <e-tabitems> 
 * </ejs-tab>
 * ```
 */
export let TabItemDirective: DefineVueDirective<TabItemModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-tabitem';
        }
    }
});
export const TabItemPlugin = {
    name: 'e-tabitem',
    install(Vue: any) {
        Vue.component(TabItemPlugin.name, TabItemDirective);
    }
}