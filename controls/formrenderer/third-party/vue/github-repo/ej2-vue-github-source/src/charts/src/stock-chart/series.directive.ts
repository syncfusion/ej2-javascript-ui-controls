import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { StockSeriesModel } from '@syncfusion/ej2-charts';

export let StockChartSeriesCollectionDirective =  vueDefineComponent({
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
            return 'e-stockchart-series-collection';
        }
    }
});
export const StockChartSeriesCollectionPlugin = {
    name: 'e-stockchart-series-collection',
    install(Vue: any) {
        Vue.component(StockChartSeriesCollectionPlugin.name, StockChartSeriesCollectionDirective);
    }
}


export let StockChartSeriesDirective: DefineVueDirective<StockSeriesModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-stockchart-series';
        }
    }
});
export const StockChartSeriesPlugin = {
    name: 'e-stockchart-series',
    install(Vue: any) {
        Vue.component(StockChartSeriesPlugin.name, StockChartSeriesDirective);
    }
}