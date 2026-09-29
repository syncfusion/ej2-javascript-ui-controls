import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Chart3DColumnModel } from '@syncfusion/ej2-charts';

export let Chart3DColumnsDirective =  vueDefineComponent({
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
            return 'e-chart3d-columns';
        }
    }
});
export const Chart3DColumnsPlugin = {
    name: 'e-chart3d-columns',
    install(Vue: any) {
        Vue.component(Chart3DColumnsPlugin.name, Chart3DColumnsDirective);
    }
}


export let Chart3DColumnDirective: DefineVueDirective<Chart3DColumnModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-chart3d-columns';
        }
    }
});
export const Chart3DColumnPlugin = {
    name: 'e-chart3d-columns',
    install(Vue: any) {
        Vue.component(Chart3DColumnPlugin.name, Chart3DColumnDirective);
    }
}