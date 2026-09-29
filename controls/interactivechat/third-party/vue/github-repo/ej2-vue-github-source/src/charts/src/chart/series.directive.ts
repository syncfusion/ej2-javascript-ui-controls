import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { SeriesModel } from '@syncfusion/ej2-charts';

export let SeriesCollectionDirective =  vueDefineComponent({
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
            return 'e-series-collection';
        }
    }
});
export const SeriesCollectionPlugin = {
    name: 'e-series-collection',
    install(Vue: any) {
        Vue.component(SeriesCollectionPlugin.name, SeriesCollectionDirective);
    }
}


export let SeriesDirective: DefineVueDirective<SeriesModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-series';
        }
    }
});
export const SeriesPlugin = {
    name: 'e-series',
    install(Vue: any) {
        Vue.component(SeriesPlugin.name, SeriesDirective);
    }
}