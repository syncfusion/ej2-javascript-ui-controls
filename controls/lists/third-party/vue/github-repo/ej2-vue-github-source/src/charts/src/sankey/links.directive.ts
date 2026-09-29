import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { SankeyLinkModel } from '@syncfusion/ej2-charts';

export let SankeyLinksCollectionDirective =  vueDefineComponent({
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
            return 'e-sankey-links';
        }
    }
});
export const SankeyLinksCollectionPlugin = {
    name: 'e-sankey-links',
    install(Vue: any) {
        Vue.component(SankeyLinksCollectionPlugin.name, SankeyLinksCollectionDirective);
    }
}

/**
 * `SankeyLinkDirective` directive represent a link of the vue Sankey. 
 * It must be contained in a Sankey component(`SankeyComponent`). 
 * ```
 * <ejs-sankey>
 * <e-sankey-links>
 * <e-sankey-link></e-sankey-link>
 * </e-sankey-links>
 * </ejs-sankey>
 * ```
 */
export let SankeyLinkDirective: DefineVueDirective<SankeyLinkModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-sankey-link';
        }
    }
});
export const SankeyLinkPlugin = {
    name: 'e-sankey-link',
    install(Vue: any) {
        Vue.component(SankeyLinkPlugin.name, SankeyLinkDirective);
    }
}