import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { StockChartAxisModel } from '@syncfusion/ej2-charts';

export let StockChartAxesDirective =  vueDefineComponent({
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
            return 'e-stockchart-axes';
        }
    }
});
export const StockChartAxesPlugin = {
    name: 'e-stockchart-axes',
    install(Vue: any) {
        Vue.component(StockChartAxesPlugin.name, StockChartAxesDirective);
    }
}


export let StockChartAxisDirective: DefineVueDirective<StockChartAxisModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-stockchart-axis';
        }
    }
});
export const StockChartAxisPlugin = {
    name: 'e-stockchart-axis',
    install(Vue: any) {
        Vue.component(StockChartAxisPlugin.name, StockChartAxisDirective);
    }
}