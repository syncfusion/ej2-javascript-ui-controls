import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { RibbonTabModel } from '@syncfusion/ej2-ribbon';

export let RibbonTabsDirective =  vueDefineComponent({
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
            return 'e-ribbon-tabs';
        }
    }
});
export const RibbonTabsPlugin = {
    name: 'e-ribbon-tabs',
    install(Vue: any) {
        Vue.component(RibbonTabsPlugin.name, RibbonTabsDirective);
    }
}


export let RibbonTabDirective: DefineVueDirective<RibbonTabModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-ribbon-tab';
        }
    }
});
export const RibbonTabPlugin = {
    name: 'e-ribbon-tab',
    install(Vue: any) {
        Vue.component(RibbonTabPlugin.name, RibbonTabDirective);
    }
}