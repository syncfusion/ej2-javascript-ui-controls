import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { RangeColorSettingModel } from '@syncfusion/ej2-charts';

export let RangeColorSettingsDirective =  vueDefineComponent({
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
            return 'e-rangecolorsettings';
        }
    }
});
export const RangeColorSettingsPlugin = {
    name: 'e-rangecolorsettings',
    install(Vue: any) {
        Vue.component(RangeColorSettingsPlugin.name, RangeColorSettingsDirective);
    }
}


export let RangeColorSettingDirective: DefineVueDirective<RangeColorSettingModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-rangecolorsetting';
        }
    }
});
export const RangeColorSettingPlugin = {
    name: 'e-rangecolorsetting',
    install(Vue: any) {
        Vue.component(RangeColorSettingPlugin.name, RangeColorSettingDirective);
    }
}