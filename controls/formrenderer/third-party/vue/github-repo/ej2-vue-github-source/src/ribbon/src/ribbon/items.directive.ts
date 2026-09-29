import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { RibbonItemModel } from '@syncfusion/ej2-ribbon';

export let RibbonItemsDirective =  vueDefineComponent({
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
            return 'e-ribbon-items';
        }
    }
});
export const RibbonItemsPlugin = {
    name: 'e-ribbon-items',
    install(Vue: any) {
        Vue.component(RibbonItemsPlugin.name, RibbonItemsDirective);
    }
}


export let RibbonItemDirective: DefineVueDirective<RibbonItemModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-ribbon-item';
        }
    }
});
export const RibbonItemPlugin = {
    name: 'e-ribbon-item',
    install(Vue: any) {
        Vue.component(RibbonItemPlugin.name, RibbonItemDirective);
    }
}