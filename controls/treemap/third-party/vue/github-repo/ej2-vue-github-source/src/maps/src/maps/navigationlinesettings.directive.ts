import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { NavigationLineSettingsModel } from '@syncfusion/ej2-maps';

export let NavigationLinesDirective =  vueDefineComponent({
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
            return 'e-navigationLineSettings';
        }
    }
});
export const NavigationLinesPlugin = {
    name: 'e-navigationLineSettings',
    install(Vue: any) {
        Vue.component(NavigationLinesPlugin.name, NavigationLinesDirective);
    }
}

/**
 * Represents the directive to define the navigation lines in the maps.
 * ```vue
 * <ejs-maps>
 * <e-layers>
 * <e-layer>
 * <e-navigationLineSettings>
 * <e-navigationLineSetting>
 * </e-navigationLineSetting>
 * </e-navigationLineSettings>
 * </e-layer>
 * </e-layers>
 * </ejs-maps>
 * ```
 */
export let NavigationLineDirective: DefineVueDirective<NavigationLineSettingsModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-navigationLineSetting';
        }
    }
});
export const NavigationLinePlugin = {
    name: 'e-navigationLineSetting',
    install(Vue: any) {
        Vue.component(NavigationLinePlugin.name, NavigationLineDirective);
    }
}