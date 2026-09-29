import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ConnectorModel } from '@syncfusion/ej2-diagrams';

export let ConnectorsDirective =  vueDefineComponent({
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
            return 'e-connectors';
        }
    }
});
export const ConnectorsPlugin = {
    name: 'e-connectors',
    install(Vue: any) {
        Vue.component(ConnectorsPlugin.name, ConnectorsDirective);
    }
}

/**
 * `e-connectors` directive represent a connectors of the vue diagram. 
 * It must be contained in a Diagram component(`ejs-diagram`). 
 * ```html
 * <ejs-diagram>
 * <e-connectors>
 * <e-connector></e-connector>
 * </e-connectors>
 * </ejs-diagram>
 * ```
 */
export let ConnectorDirective: DefineVueDirective<ConnectorModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-connector';
        }
    }
});
export const ConnectorPlugin = {
    name: 'e-connector',
    install(Vue: any) {
        Vue.component(ConnectorPlugin.name, ConnectorDirective);
    }
}