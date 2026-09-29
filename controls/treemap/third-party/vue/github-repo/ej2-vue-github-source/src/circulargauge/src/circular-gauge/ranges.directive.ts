import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { RangeModel } from '@syncfusion/ej2-circulargauge';

export let RangesDirective =  vueDefineComponent({
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
            return 'e-ranges';
        }
    }
});
export const RangesPlugin = {
    name: 'e-ranges',
    install(Vue: any) {
        Vue.component(RangesPlugin.name, RangesDirective);
    }
}

/**
 * Represents the directive to render and customize the ranges in an axis of circular gauge.
 * ```vue
 * <ejs-circulargauge>
 * <e-axes>
 * <e-axis>
 * <e-ranges><e-range></e-range></e-ranges>
 * </e-axis>
 * </e-axes>
 * </ejs-circulargauge>
 * ```
 */
export let RangeDirective: DefineVueDirective<RangeModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-range';
        }
    }
});
export const RangePlugin = {
    name: 'e-range',
    install(Vue: any) {
        Vue.component(RangePlugin.name, RangeDirective);
    }
}