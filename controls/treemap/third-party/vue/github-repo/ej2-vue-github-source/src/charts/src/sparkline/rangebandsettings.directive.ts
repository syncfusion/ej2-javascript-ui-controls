import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { RangeBandSettingsModel } from '@syncfusion/ej2-charts';

export let RangeBandSettingsDirective =  vueDefineComponent({
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
            return 'e-rangeBandSettings';
        }
    }
});
export const RangeBandSettingsPlugin = {
    name: 'e-rangeBandSettings',
    install(Vue: any) {
        Vue.component(RangeBandSettingsPlugin.name, RangeBandSettingsDirective);
    }
}


export let RangeBandSettingDirective: DefineVueDirective<RangeBandSettingsModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-rangeBandSetting';
        }
    }
});
export const RangeBandSettingPlugin = {
    name: 'e-rangeBandSetting',
    install(Vue: any) {
        Vue.component(RangeBandSettingPlugin.name, RangeBandSettingDirective);
    }
}