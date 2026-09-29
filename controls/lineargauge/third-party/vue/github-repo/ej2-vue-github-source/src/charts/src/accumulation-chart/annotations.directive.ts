import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { AccumulationAnnotationSettingsModel } from '@syncfusion/ej2-charts';

export let AccumulationAnnotationsDirective =  vueDefineComponent({
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
            return 'e-accumulation-annotations';
        }
    }
});
export const AccumulationAnnotationsPlugin = {
    name: 'e-accumulation-annotations',
    install(Vue: any) {
        Vue.component(AccumulationAnnotationsPlugin.name, AccumulationAnnotationsDirective);
    }
}


export let AccumulationAnnotationDirective: DefineVueDirective<AccumulationAnnotationSettingsModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-accumulation-annotation';
        }
    }
});
export const AccumulationAnnotationPlugin = {
    name: 'e-accumulation-annotation',
    install(Vue: any) {
        Vue.component(AccumulationAnnotationPlugin.name, AccumulationAnnotationDirective);
    }
}