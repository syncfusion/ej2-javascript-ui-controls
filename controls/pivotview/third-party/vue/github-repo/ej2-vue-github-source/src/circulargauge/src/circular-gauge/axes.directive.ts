import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { AxisModel } from '@syncfusion/ej2-circulargauge';

export let AxesDirective =  vueDefineComponent({
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
            return 'e-axes';
        }
    }
});
export const AxesPlugin = {
    name: 'e-axes',
    install(Vue: any) {
        Vue.component(AxesPlugin.name, AxesDirective);
    }
}

/**
 * Represents the directive to render the axes in the Circular Gauge.
 * ```vue
 * <ejs-circulargauge>
 * <e-axes><e-axis></e-axis></e-axes>
 * </ejs-circulargauge>
 * ```
 */
export let AxisDirective: DefineVueDirective<AxisModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-axis';
        }
    }
});
export const AxisPlugin = {
    name: 'e-axis',
    install(Vue: any) {
        Vue.component(AxisPlugin.name, AxisDirective);
    }
}