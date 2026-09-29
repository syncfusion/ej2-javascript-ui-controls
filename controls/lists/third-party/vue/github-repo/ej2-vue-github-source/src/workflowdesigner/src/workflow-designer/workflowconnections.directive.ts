import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { WorkflowConnectionModel } from '@syncfusion/ej2-workflow-designer';

export let WorkflowConnectionsDirective =  vueDefineComponent({
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
            return 'e-workflow-connections';
        }
    }
});
export const WorkflowConnectionsPlugin = {
    name: 'e-workflow-connections',
    install(Vue: any) {
        Vue.component(WorkflowConnectionsPlugin.name, WorkflowConnectionsDirective);
    }
}

/**
 * `e-workflow-connections` directive represent a connections of the vue workflow designer. 
 * It must be contained in a Workflow Designer component(`ejs-workflow-designer`). 
 * ```html
 * <ejs-workflow-designer>
 * <e-workflow-connections>
 * <e-workflow-connection>
 * </e-workflow-connection>
 * </e-workflow-connections>
 * </ejs-workflow-designer>
 * ```
 */
export let WorkflowConnectionDirective: DefineVueDirective<WorkflowConnectionModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-workflow-connection';
        }
    }
});
export const WorkflowConnectionPlugin = {
    name: 'e-workflow-connection',
    install(Vue: any) {
        Vue.component(WorkflowConnectionPlugin.name, WorkflowConnectionDirective);
    }
}