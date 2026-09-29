import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { NodeFixedUserHandleModel } from '@syncfusion/ej2-diagrams';

export let NodeFixedUserHandlesDirective =  vueDefineComponent({
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
            return 'e-node-fixeduserhandles';
        }
    }
});
export const NodeFixedUserHandlesPlugin = {
    name: 'e-node-fixeduserhandles',
    install(Vue: any) {
        Vue.component(NodeFixedUserHandlesPlugin.name, NodeFixedUserHandlesDirective);
    }
}

/**
 * `e-node` directive represent a annotation of the vue Diagram. 
 * It must be contained in a Diagram component(`ejs-diagram`). 
 * ```html
 * <ejs-diagram>
 * <e-nodes>
 * <e-node>
 * <e-node-fixeduserhandles>
 * <e-node-fixeduserhandle>
 * </e-node-fixeduserhandle>
 * </e-node-fixeduserhandles>
 * </e-node>
 * </e-nodes>
 * </ejs-diagram>
 * ```
 */
export let NodeFixedUserHandleDirective: DefineVueDirective<NodeFixedUserHandleModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-node-fixeduserhandle';
        }
    }
});
export const NodeFixedUserHandlePlugin = {
    name: 'e-node-fixeduserhandle',
    install(Vue: any) {
        Vue.component(NodeFixedUserHandlePlugin.name, NodeFixedUserHandleDirective);
    }
}