import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Chart3DRowModel } from '@syncfusion/ej2-charts';

export let Chart3DRowsDirective =  vueDefineComponent({
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
            return 'e-chart3d-rows';
        }
    }
});
export const Chart3DRowsPlugin = {
    name: 'e-chart3d-rows',
    install(Vue: any) {
        Vue.component(Chart3DRowsPlugin.name, Chart3DRowsDirective);
    }
}


export let Chart3DRowDirective: DefineVueDirective<Chart3DRowModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-chart3d-row';
        }
    }
});
export const Chart3DRowPlugin = {
    name: 'e-chart3d-row',
    install(Vue: any) {
        Vue.component(Chart3DRowPlugin.name, Chart3DRowDirective);
    }
}