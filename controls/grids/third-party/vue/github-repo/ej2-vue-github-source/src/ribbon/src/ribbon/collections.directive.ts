import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { RibbonCollectionModel } from '@syncfusion/ej2-ribbon';

export let RibbonCollectionsDirective =  vueDefineComponent({
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
            return 'e-ribbon-collections';
        }
    }
});
export const RibbonCollectionsPlugin = {
    name: 'e-ribbon-collections',
    install(Vue: any) {
        Vue.component(RibbonCollectionsPlugin.name, RibbonCollectionsDirective);
    }
}


export let RibbonCollectionDirective: DefineVueDirective<RibbonCollectionModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-ribbon-collection';
        }
    }
});
export const RibbonCollectionPlugin = {
    name: 'e-ribbon-collection',
    install(Vue: any) {
        Vue.component(RibbonCollectionPlugin.name, RibbonCollectionDirective);
    }
}