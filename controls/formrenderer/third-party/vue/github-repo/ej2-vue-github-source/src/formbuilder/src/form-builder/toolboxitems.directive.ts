import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ToolboxItemSettingModel } from '@syncfusion/ej2-form-builder';

export let ToolboxItemSettingsDirective =  vueDefineComponent({
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
            return 'e-toolboxitemsettings';
        }
    }
});
export const ToolboxItemSettingsPlugin = {
    name: 'e-toolboxitemsettings',
    install(Vue: any) {
        Vue.component(ToolboxItemSettingsPlugin.name, ToolboxItemSettingsDirective);
    }
}

/**
 * `e-toolboxItemSettings` directive represents a custom widget
 * configuration item of the Vue FormBuilder component.
 * It must be contained within the `e-custom-widget-settings`
 * collection of an `ejs-form-builder` component.
 * ```html
 * <ejs-form-builder>
 * <e-toolboxItemSettings>
 * <e-toolboxItemSetting></e-toolboxItemSetting>
 * </e-toolboxItemSettings>
 * </ejs-form-builder>
 * ```
 */
export let ToolboxItemSettingDirective: DefineVueDirective<ToolboxItemSettingModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-toolboxitemsetting';
        }
    }
});
export const ToolboxItemSettingPlugin = {
    name: 'e-toolboxitemsetting',
    install(Vue: any) {
        Vue.component(ToolboxItemSettingPlugin.name, ToolboxItemSettingDirective);
    }
}