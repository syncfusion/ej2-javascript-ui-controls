import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PointerModel } from '@syncfusion/ej2-circulargauge';

export let PointersDirective =  vueDefineComponent({
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
            return 'e-pointers';
        }
    }
});
export const PointersPlugin = {
    name: 'e-pointers',
    install(Vue: any) {
        Vue.component(PointersPlugin.name, PointersDirective);
    }
}

/**
 * Represents the directive to render and customize the pointers in an axis of circular gauge.
 * ```vue
 * <ejs-circulargauge>
 * <e-axes>
 * <e-axis>
 * <e-pointers><e-pointer></e-pointer></e-pointers>
 * </e-axis>
 * </e-axes>
 * </ejs-circulargauge>
 * ```
 */
export let PointerDirective: DefineVueDirective<PointerModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-pointer';
        }
    }
});
export const PointerPlugin = {
    name: 'e-pointer',
    install(Vue: any) {
        Vue.component(PointerPlugin.name, PointerDirective);
    }
}