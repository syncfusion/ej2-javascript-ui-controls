import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { MarkerSettingsModel } from '@syncfusion/ej2-maps';

export let MarkersDirective =  vueDefineComponent({
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
            return 'e-markerSettings';
        }
    }
});
export const MarkersPlugin = {
    name: 'e-markerSettings',
    install(Vue: any) {
        Vue.component(MarkersPlugin.name, MarkersDirective);
    }
}

/**
 * Represents the directive to define the markers in the maps.
 * ```vue
 * <ejs-maps>
 * <e-layers>
 * <e-layer>
 * <e-markerSettings>
 * <e-markerSetting>
 * </e-markerSetting>
 * </e-markerSettings>
 * </e-layer>
 * </e-layers>
 * </ejs-maps>
 * ```
 */
export let MarkerDirective: DefineVueDirective<MarkerSettingsModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-markerSetting';
        }
    }
});
export const MarkerPlugin = {
    name: 'e-markerSetting',
    install(Vue: any) {
        Vue.component(MarkerPlugin.name, MarkerDirective);
    }
}