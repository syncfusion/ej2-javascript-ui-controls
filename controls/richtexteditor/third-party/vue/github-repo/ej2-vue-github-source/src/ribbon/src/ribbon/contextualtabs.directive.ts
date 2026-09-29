import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { RibbonContextualTabSettingsModel } from '@syncfusion/ej2-ribbon';

export let RibbonContextualTabsDirective =  vueDefineComponent({
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
            return 'e-ribbon-contextual-tabs';
        }
    }
});
export const RibbonContextualTabsPlugin = {
    name: 'e-ribbon-contextual-tabs',
    install(Vue: any) {
        Vue.component(RibbonContextualTabsPlugin.name, RibbonContextualTabsDirective);
    }
}

/**
 * `e-ribbon-contextual-tab` directive represent a contextual tab of the VueJS Ribbon. 
 * It must be contained in a Ribbon component(`ejs-ribbon`). 
 * ```
 * <ejs-ribbon>
 *   <e-ribbon-contextual-tabs>
 *    <e-ribbon-contextual-tab></e-ribbon-contextual-tab>
 *    <e-ribbon-contextual-tab></e-ribbon-contextual-tab>
 *   </e-ribbon-contextual-tabs>
 * </ejs-ribbon>
 * ```
 */
export let RibbonContextualTabDirective: DefineVueDirective<RibbonContextualTabSettingsModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-ribbon-contextual-tab';
        }
    }
});
export const RibbonContextualTabPlugin = {
    name: 'e-ribbon-contextual-tab',
    install(Vue: any) {
        Vue.component(RibbonContextualTabPlugin.name, RibbonContextualTabDirective);
    }
}