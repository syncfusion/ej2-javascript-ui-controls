import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { StockChartTrendlineModel } from '@syncfusion/ej2-charts';

export let StockChartTrendlinesDirective =  vueDefineComponent({
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
            return 'e-trendlines';
        }
    }
});
export const StockChartTrendlinesPlugin = {
    name: 'e-trendlines',
    install(Vue: any) {
        Vue.component(StockChartTrendlinesPlugin.name, StockChartTrendlinesDirective);
    }
}


export let StockChartTrendlineDirective: DefineVueDirective<StockChartTrendlineModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-trendline';
        }
    }
});
export const StockChartTrendlinePlugin = {
    name: 'e-trendline',
    install(Vue: any) {
        Vue.component(StockChartTrendlinePlugin.name, StockChartTrendlineDirective);
    }
}