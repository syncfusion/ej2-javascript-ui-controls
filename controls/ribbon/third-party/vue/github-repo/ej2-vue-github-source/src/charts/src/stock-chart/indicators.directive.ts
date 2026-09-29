import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { StockChartIndicatorModel } from '@syncfusion/ej2-charts';

export let StockChartIndicatorsDirective =  vueDefineComponent({
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
            return 'e-stockchart-indicators';
        }
    }
});
export const StockChartIndicatorsPlugin = {
    name: 'e-stockchart-indicators',
    install(Vue: any) {
        Vue.component(StockChartIndicatorsPlugin.name, StockChartIndicatorsDirective);
    }
}


export let StockChartIndicatorDirective: DefineVueDirective<StockChartIndicatorModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-stockchart-indicator';
        }
    }
});
export const StockChartIndicatorPlugin = {
    name: 'e-stockchart-indicator',
    install(Vue: any) {
        Vue.component(StockChartIndicatorPlugin.name, StockChartIndicatorDirective);
    }
}