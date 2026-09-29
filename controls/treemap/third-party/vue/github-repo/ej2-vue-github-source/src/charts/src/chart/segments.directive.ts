import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ChartSegmentModel } from '@syncfusion/ej2-charts';

export let SegmentsDirective =  vueDefineComponent({
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
            return 'e-segments';
        }
    }
});
export const SegmentsPlugin = {
    name: 'e-segments',
    install(Vue: any) {
        Vue.component(SegmentsPlugin.name, SegmentsDirective);
    }
}


export let SegmentDirective: DefineVueDirective<ChartSegmentModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-segment';
        }
    }
});
export const SegmentPlugin = {
    name: 'e-segment',
    install(Vue: any) {
        Vue.component(SegmentPlugin.name, SegmentDirective);
    }
}