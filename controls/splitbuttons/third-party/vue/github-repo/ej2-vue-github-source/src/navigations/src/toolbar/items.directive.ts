import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ItemModel } from '@syncfusion/ej2-navigations';

export let ItemsDirective =  vueDefineComponent({
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
            return 'e-items';
        }
    }
});
export const ItemsPlugin = {
    name: 'e-items',
    install(Vue: any) {
        Vue.component(ItemsPlugin.name, ItemsDirective);
    }
}

/**
 * 'e-item' directive represent a item of Vue Toolbar 
 * It must be contained in a Toolbar component(`ejs-toolbar`). 
 * ```html
 * <ejs-toolbar> 
 *   <e-items>
 *    <e-item text='Cut'></e-item>
 *    <e-item text='Copy'></e-item>
 *   </e-items>
 * </ejs-toolbar>
 * ```
 */
export let ItemDirective: DefineVueDirective<ItemModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-item';
        }
    }
});
export const ItemPlugin = {
    name: 'e-item',
    install(Vue: any) {
        Vue.component(ItemPlugin.name, ItemDirective);
    }
}