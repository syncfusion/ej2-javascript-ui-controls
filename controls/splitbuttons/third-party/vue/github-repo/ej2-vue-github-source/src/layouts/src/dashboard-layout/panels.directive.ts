import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PanelModel } from '@syncfusion/ej2-layouts';

export let PanelsDirective =  vueDefineComponent({
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
            return 'e-panels';
        }
    }
});
export const PanelsPlugin = {
    name: 'e-panels',
    install(Vue: any) {
        Vue.component(PanelsPlugin.name, PanelsDirective);
    }
}

/**
 * 'e-panels' directive represent a presets of VueJS dashboardlayout component 
 * It must be contained in a dashboardlayout component(`ejs-dashboardlayout`). 
 * ```html
 * <ejs-dashboardlayout>
 *   <e-panels>
 *   <e-panel></e-panel>
 *   <e-panel></e-panel>
 *   </e-panels>
 * </ejs-dashboardlayout>
 * ```
 */
export let PanelDirective: DefineVueDirective<PanelModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-panel';
        }
    }
});
export const PanelPlugin = {
    name: 'e-panel',
    install(Vue: any) {
        Vue.component(PanelPlugin.name, PanelDirective);
    }
}