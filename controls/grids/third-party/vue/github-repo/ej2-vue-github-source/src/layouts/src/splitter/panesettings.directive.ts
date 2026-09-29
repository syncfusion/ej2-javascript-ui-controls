import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PanePropertiesModel } from '@syncfusion/ej2-layouts';

export let PanesDirective =  vueDefineComponent({
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
            return 'e-panes';
        }
    }
});
export const PanesPlugin = {
    name: 'e-panes',
    install(Vue: any) {
        Vue.component(PanesPlugin.name, PanesDirective);
    }
}

/**
 * 'e-pane' directive represent a pane of Vue Splitter 
 * It must be contained in a Splitter component(`ejs-splitter`). 
 * ```html
 * <ejs-splitter id='splitter'> 
 *   <e-panes>
 *    <e-pane size='150px'></e-pane>
 *    <e-pane size='150px'></e-pane>
 *   </e-panes>
 * </ejs-splitter>
 * ```
 */
export let PaneDirective: DefineVueDirective<PanePropertiesModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-pane';
        }
    }
});
export const PanePlugin = {
    name: 'e-pane',
    install(Vue: any) {
        Vue.component(PanePlugin.name, PaneDirective);
    }
}