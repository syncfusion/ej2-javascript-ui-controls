import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { StockChartAnnotationSettingsModel } from '@syncfusion/ej2-charts';

export let StockChartAnnotationsDirective =  vueDefineComponent({
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
            return 'e-stockchart-annotations';
        }
    }
});
export const StockChartAnnotationsPlugin = {
    name: 'e-stockchart-annotations',
    install(Vue: any) {
        Vue.component(StockChartAnnotationsPlugin.name, StockChartAnnotationsDirective);
    }
}

/**
 * `e-annotation` directive represent a annotation of the VueJS Chart. 
 * It must be contained in a Chart component(`ejs-chart`). 
 * ```
 * <ejs-stockchart> 
 *   <e-stockchart-annotations>
 *    <e-annotation content='ID' />
 *    <e-annotation content='ID' />
 *   </e-annotations>
 * </ejs-chart>
 * ```
 */
export let StockChartAnnotationDirective: DefineVueDirective<StockChartAnnotationSettingsModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-stockchart-annotation';
        }
    }
});
export const StockChartAnnotationPlugin = {
    name: 'e-stockchart-annotation',
    install(Vue: any) {
        Vue.component(StockChartAnnotationPlugin.name, StockChartAnnotationDirective);
    }
}