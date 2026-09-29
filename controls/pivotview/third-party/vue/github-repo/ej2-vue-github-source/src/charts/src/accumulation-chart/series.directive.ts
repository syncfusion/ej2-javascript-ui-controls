import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { AccumulationSeriesModel } from '@syncfusion/ej2-charts';

export let AccumulationSeriesCollectionDirective =  vueDefineComponent({
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
            return 'e-accumulation-series-collection';
        }
    }
});
export const AccumulationSeriesCollectionPlugin = {
    name: 'e-accumulation-series-collection',
    install(Vue: any) {
        Vue.component(AccumulationSeriesCollectionPlugin.name, AccumulationSeriesCollectionDirective);
    }
}


export let AccumulationSeriesDirective: DefineVueDirective<AccumulationSeriesModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-accumulation-series';
        }
    }
});
export const AccumulationSeriesPlugin = {
    name: 'e-accumulation-series',
    install(Vue: any) {
        Vue.component(AccumulationSeriesPlugin.name, AccumulationSeriesDirective);
    }
}