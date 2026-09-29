import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { CustomWidgetSettingModel } from '@syncfusion/ej2-form-renderer';

export let CustomWidgetSettingsDirective =  vueDefineComponent({
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
            return 'e-customwidgetsettings';
        }
    }
});
export const CustomWidgetSettingsPlugin = {
    name: 'e-customwidgetsettings',
    install(Vue: any) {
        Vue.component(CustomWidgetSettingsPlugin.name, CustomWidgetSettingsDirective);
    }
}

/**
 * `e-custom-widget-setting` directive represents a custom widget
 * configuration item of the Vue FormRenderer component.
 * It must be contained within the `e-custom-widget-settings`
 * collection of an `ejs-form-renderer` component.
 * ```html
 * <ejs-form-renderer>
 * <e-customwidgetsettings>
 * <e-customwidgetsetting></e-customwidgetsetting>
 * </e-customwidgetsettings>
 * </ejs-form-renderer>
 * ```
 */
export let CustomWidgetSettingDirective: DefineVueDirective<CustomWidgetSettingModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-customwidgetsetting';
        }
    }
});
export const CustomWidgetSettingPlugin = {
    name: 'e-customwidgetsetting',
    install(Vue: any) {
        Vue.component(CustomWidgetSettingPlugin.name, CustomWidgetSettingDirective);
    }
}