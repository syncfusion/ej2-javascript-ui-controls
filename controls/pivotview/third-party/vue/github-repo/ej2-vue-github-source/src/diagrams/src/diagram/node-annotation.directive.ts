import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ShapeAnnotationModel } from '@syncfusion/ej2-diagrams';

export let NodeAnnotationsDirective =  vueDefineComponent({
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
            return 'e-node-annotations';
        }
    }
});
export const NodeAnnotationsPlugin = {
    name: 'e-node-annotations',
    install(Vue: any) {
        Vue.component(NodeAnnotationsPlugin.name, NodeAnnotationsDirective);
    }
}

/**
 * `e-node` directive represent a annotation of the vue Diagram. 
 * It must be contained in a Diagram component(`ejs-diagram`). 
 * ```html
 * <ejs-diagram>
 * <e-nodes>
 * <e-node>
 * <e-node-annotations>
 * <e-node-annotation>
 * </e-node-annotation>
 * </e-node-annotations>
 * </e-node>
 * </e-nodes>
 * </ejs-diagram>
 * ```
 */
export let NodeAnnotationDirective: DefineVueDirective<ShapeAnnotationModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-node-annotation';
        }
    }
});
export const NodeAnnotationPlugin = {
    name: 'e-node-annotation',
    install(Vue: any) {
        Vue.component(NodeAnnotationPlugin.name, NodeAnnotationDirective);
    }
}