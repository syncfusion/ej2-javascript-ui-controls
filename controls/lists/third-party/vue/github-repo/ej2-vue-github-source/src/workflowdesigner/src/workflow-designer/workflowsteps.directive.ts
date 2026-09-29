import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { WorkflowStepModel } from '@syncfusion/ej2-workflow-designer';

export let WorkflowStepsDirective =  vueDefineComponent({
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
            return 'e-workflow-steps';
        }
    }
});
export const WorkflowStepsPlugin = {
    name: 'e-workflow-steps',
    install(Vue: any) {
        Vue.component(WorkflowStepsPlugin.name, WorkflowStepsDirective);
    }
}

/**
 * `e-workflow-steps` directive represent a steps of the vue workflow designer. 
 * It must be contained in a Workflow Designer component(`ejs-workflow-designer`). 
 * ```html
 * <ejs-workflow-designer>
 * <e-workflow-steps>
 * <e-workflow-step>
 * </e-workflow-step>
 * </e-workflow-steps>
 * </ejs-workflow-designer>
 * ```
 */
export let WorkflowStepDirective: DefineVueDirective<WorkflowStepModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-workflow-step';
        }
    }
});
export const WorkflowStepPlugin = {
    name: 'e-workflow-step',
    install(Vue: any) {
        Vue.component(WorkflowStepPlugin.name, WorkflowStepDirective);
    }
}