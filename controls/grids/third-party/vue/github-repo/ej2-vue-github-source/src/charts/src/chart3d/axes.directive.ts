import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Chart3DAxisModel } from '@syncfusion/ej2-charts';

export let Chart3DAxesDirective =  vueDefineComponent({
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
            return 'e-chart3daxes';
        }
    }
});
export const Chart3DAxesPlugin = {
    name: 'e-chart3daxes',
    install(Vue: any) {
        Vue.component(Chart3DAxesPlugin.name, Chart3DAxesDirective);
    }
}


export let Chart3DAxisDirective: DefineVueDirective<Chart3DAxisModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-chart3daxis';
        }
    }
});
export const Chart3DAxisPlugin = {
    name: 'e-chart3daxis',
    install(Vue: any) {
        Vue.component(Chart3DAxisPlugin.name, Chart3DAxisDirective);
    }
}