import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { RangeColorModel } from '@syncfusion/ej2-progressbar';

export let RangeColorsDirective =  vueDefineComponent({
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
            return 'e-rangecolors';
        }
    }
});
export const RangeColorsPlugin = {
    name: 'e-rangecolors',
    install(Vue: any) {
        Vue.component(RangeColorsPlugin.name, RangeColorsDirective);
    }
}


export let RangeColorDirective: DefineVueDirective<RangeColorModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-rangecolor';
        }
    }
});
export const RangeColorPlugin = {
    name: 'e-rangecolor',
    install(Vue: any) {
        Vue.component(RangeColorPlugin.name, RangeColorDirective);
    }
}