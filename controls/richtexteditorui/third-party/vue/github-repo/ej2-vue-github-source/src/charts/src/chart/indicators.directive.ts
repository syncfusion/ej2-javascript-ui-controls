import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { TechnicalIndicatorModel } from '@syncfusion/ej2-charts';

export let IndicatorsDirective =  vueDefineComponent({
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
            return 'e-indicators';
        }
    }
});
export const IndicatorsPlugin = {
    name: 'e-indicators',
    install(Vue: any) {
        Vue.component(IndicatorsPlugin.name, IndicatorsDirective);
    }
}


export let IndicatorDirective: DefineVueDirective<TechnicalIndicatorModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-indicator';
        }
    }
});
export const IndicatorPlugin = {
    name: 'e-indicator',
    install(Vue: any) {
        Vue.component(IndicatorPlugin.name, IndicatorDirective);
    }
}