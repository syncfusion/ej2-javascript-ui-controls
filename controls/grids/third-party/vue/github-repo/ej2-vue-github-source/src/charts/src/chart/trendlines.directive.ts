import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { TrendlineModel } from '@syncfusion/ej2-charts';

export let TrendlinesDirective =  vueDefineComponent({
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
export const TrendlinesPlugin = {
    name: 'e-trendlines',
    install(Vue: any) {
        Vue.component(TrendlinesPlugin.name, TrendlinesDirective);
    }
}


export let TrendlineDirective: DefineVueDirective<TrendlineModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-trendline';
        }
    }
});
export const TrendlinePlugin = {
    name: 'e-trendline',
    install(Vue: any) {
        Vue.component(TrendlinePlugin.name, TrendlineDirective);
    }
}