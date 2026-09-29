import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { NodeModel } from '@syncfusion/ej2-diagrams';

export let NodesDirective =  vueDefineComponent({
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
            return 'e-nodes';
        }
    }
});
export const NodesPlugin = {
    name: 'e-nodes',
    install(Vue: any) {
        Vue.component(NodesPlugin.name, NodesDirective);
    }
}

/**
 * `e-node` directive represent a nodes of the vue diagram. 
 * It must be contained in a Diagram component(`ejs-diagram`). 
 * ```html
 * <ejs-diagram>
 * <e-nodes>
 * <e-node></e-node>
 * </e-nodes>
 * </ejs-diagram>
 * ```
 */
export let NodeDirective: DefineVueDirective<NodeModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-node';
        }
    }
});
export const NodePlugin = {
    name: 'e-node',
    install(Vue: any) {
        Vue.component(NodePlugin.name, NodeDirective);
    }
}