import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { StepModel } from '@syncfusion/ej2-navigations';

export let StepsDirective =  vueDefineComponent({
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
            return 'e-steps';
        }
    }
});
export const StepsPlugin = {
    name: 'e-steps',
    install(Vue: any) {
        Vue.component(StepsPlugin.name, StepsDirective);
    }
}

/**
 * 'e-step' directive represents a step of the Vue Stepper 
 * It must be contained in a Stepper component(`ejs-stepper`). 
 * ```html
 * <ejs-stepper>
 *  <e-steps>
 *   <e-step :iconCss='e-icons e-folder' :text='Step 1' />
 *   <e-step :iconCss='e-icons e-folder' :text='Step 2' />
 *  </e-steps> 
 * </ejs-stepper>
 * ```
 */
export let StepDirective: DefineVueDirective<StepModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-step';
        }
    }
});
export const StepPlugin = {
    name: 'e-step',
    install(Vue: any) {
        Vue.component(StepPlugin.name, StepDirective);
    }
}