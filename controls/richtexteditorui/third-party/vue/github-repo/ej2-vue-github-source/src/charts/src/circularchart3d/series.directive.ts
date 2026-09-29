import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { CircularChart3DSeriesModel } from '@syncfusion/ej2-charts';

export let CircularChart3DSeriesCollectionDirective =  vueDefineComponent({
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
            return 'e-circularchart3d-series-collection';
        }
    }
});
export const CircularChart3DSeriesCollectionPlugin = {
    name: 'e-circularchart3d-series-collection',
    install(Vue: any) {
        Vue.component(CircularChart3DSeriesCollectionPlugin.name, CircularChart3DSeriesCollectionDirective);
    }
}


export let CircularChart3DSeriesDirective: DefineVueDirective<CircularChart3DSeriesModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-circularchart3d-series';
        }
    }
});
export const CircularChart3DSeriesPlugin = {
    name: 'e-circularchart3d-series',
    install(Vue: any) {
        Vue.component(CircularChart3DSeriesPlugin.name, CircularChart3DSeriesDirective);
    }
}