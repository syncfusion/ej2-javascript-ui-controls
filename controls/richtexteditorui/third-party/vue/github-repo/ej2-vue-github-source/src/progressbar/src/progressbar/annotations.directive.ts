import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ProgressAnnotationSettingsModel } from '@syncfusion/ej2-progressbar';

export let ProgressBarAnnotationsDirective =  vueDefineComponent({
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
            return 'e-progressbar-annotations';
        }
    }
});
export const ProgressBarAnnotationsPlugin = {
    name: 'e-progressbar-annotations',
    install(Vue: any) {
        Vue.component(ProgressBarAnnotationsPlugin.name, ProgressBarAnnotationsDirective);
    }
}


export let ProgressBarAnnotationDirective: DefineVueDirective<ProgressAnnotationSettingsModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-progressbar-annotation';
        }
    }
});
export const ProgressBarAnnotationPlugin = {
    name: 'e-progressbar-annotation',
    install(Vue: any) {
        Vue.component(ProgressBarAnnotationPlugin.name, ProgressBarAnnotationDirective);
    }
}