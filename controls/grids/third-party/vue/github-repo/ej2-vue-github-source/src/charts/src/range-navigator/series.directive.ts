import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { RangeNavigatorSeriesModel } from '@syncfusion/ej2-charts';

export let RangenavigatorSeriesCollectionDirective =  vueDefineComponent({
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
            return 'e-rangenavigator-series-collection';
        }
    }
});
export const RangenavigatorSeriesCollectionPlugin = {
    name: 'e-rangenavigator-series-collection',
    install(Vue: any) {
        Vue.component(RangenavigatorSeriesCollectionPlugin.name, RangenavigatorSeriesCollectionDirective);
    }
}


export let RangenavigatorSeriesDirective: DefineVueDirective<RangeNavigatorSeriesModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-rangenavigator-series';
        }
    }
});
export const RangenavigatorSeriesPlugin = {
    name: 'e-rangenavigator-series',
    install(Vue: any) {
        Vue.component(RangenavigatorSeriesPlugin.name, RangenavigatorSeriesDirective);
    }
}