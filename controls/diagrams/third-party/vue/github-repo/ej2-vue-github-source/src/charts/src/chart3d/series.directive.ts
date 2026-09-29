import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Chart3DSeriesModel } from '@syncfusion/ej2-charts';

export let Chart3DSeriesCollectionDirective =  vueDefineComponent({
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
            return 'e-chart3d-series-collection';
        }
    }
});
export const Chart3DSeriesCollectionPlugin = {
    name: 'e-chart3d-series-collection',
    install(Vue: any) {
        Vue.component(Chart3DSeriesCollectionPlugin.name, Chart3DSeriesCollectionDirective);
    }
}

/**
 * Represents Vuejs 3D Chart Component
 * ```
 * <ejs-chart3d>
 * <e-chart3d-series-collection>
 * <e-chart3d-series></e-chart3d-series>
 * </e-chart3d-series-collection>
 * </ejs-chart3d>
 * ```
 */
export let Chart3DSeriesDirective: DefineVueDirective<Chart3DSeriesModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-chart3d-series';
        }
    }
});
export const Chart3DSeriesPlugin = {
    name: 'e-chart3d-series',
    install(Vue: any) {
        Vue.component(Chart3DSeriesPlugin.name, Chart3DSeriesDirective);
    }
}