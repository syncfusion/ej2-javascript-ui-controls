import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { SankeyNodeModel } from '@syncfusion/ej2-charts';

export let SankeyNodesCollectionDirective =  vueDefineComponent({
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
            return 'e-sankey-nodes';
        }
    }
});
export const SankeyNodesCollectionPlugin = {
    name: 'e-sankey-nodes',
    install(Vue: any) {
        Vue.component(SankeyNodesCollectionPlugin.name, SankeyNodesCollectionDirective);
    }
}

/**
 * `SankeyNodeDirective` directive represent a node of the vue Sankey. 
 * It must be contained in a Sankey component(`SankeyComponent`). 
 * ```
 * <ejs-sankey>
 * <e-sankey-nodes>
 * <e-sankey-node></e-sankey-node>
 * </e-sankey-nodes>
 * </ejs-sankey>
 * ```
 */
export let SankeyNodeDirective: DefineVueDirective<SankeyNodeModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-sankey-node';
        }
    }
});
export const SankeyNodePlugin = {
    name: 'e-sankey-node',
    install(Vue: any) {
        Vue.component(SankeyNodePlugin.name, SankeyNodeDirective);
    }
}