import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { StockEventsSettingsModel } from '@syncfusion/ej2-charts';

export let StockEventsDirective =  vueDefineComponent({
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
            return 'e-stockchart-stockevents';
        }
    }
});
export const StockEventsPlugin = {
    name: 'e-stockchart-stockevents',
    install(Vue: any) {
        Vue.component(StockEventsPlugin.name, StockEventsDirective);
    }
}


export let StockEventDirective: DefineVueDirective<StockEventsSettingsModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-stockchart-stockevent';
        }
    }
});
export const StockEventPlugin = {
    name: 'e-stockchart-stockevent',
    install(Vue: any) {
        Vue.component(StockEventPlugin.name, StockEventDirective);
    }
}