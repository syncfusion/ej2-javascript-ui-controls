import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { StockChartRowModel } from '@syncfusion/ej2-charts';

export let StockChartRowsDirective =  vueDefineComponent({
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
            return 'e-stockchart-rows';
        }
    }
});
export const StockChartRowsPlugin = {
    name: 'e-stockchart-rows',
    install(Vue: any) {
        Vue.component(StockChartRowsPlugin.name, StockChartRowsDirective);
    }
}


export let StockChartRowDirective: DefineVueDirective<StockChartRowModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-stockchart-row';
        }
    }
});
export const StockChartRowPlugin = {
    name: 'e-stockchart-row',
    install(Vue: any) {
        Vue.component(StockChartRowPlugin.name, StockChartRowDirective);
    }
}