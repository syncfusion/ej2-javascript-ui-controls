import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ColorMappingSettingsModel } from '@syncfusion/ej2-maps';

export let ColorMappingsDirective =  vueDefineComponent({
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
            return 'e-colorMappings';
        }
    }
});
export const ColorMappingsPlugin = {
    name: 'e-colorMappings',
    install(Vue: any) {
        Vue.component(ColorMappingsPlugin.name, ColorMappingsDirective);
    }
}

/**
 * Represents the directive to define the bubble color mapping in the maps.
 * ```vue
 * <ejs-maps>
 * <e-layers>
 * <e-layer>
 * <e-bubbleSettings>
 * <e-bubbleSetting>
 * </e-bubbleSetting>
 * </e-bubbleSettings>
 * </e-layer>
 * </e-layers>
 * </ejs-maps>
 * ```
 */
export let ColorMappingDirective: DefineVueDirective<ColorMappingSettingsModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-colorMapping';
        }
    }
});
export const ColorMappingPlugin = {
    name: 'e-colorMapping',
    install(Vue: any) {
        Vue.component(ColorMappingPlugin.name, ColorMappingDirective);
    }
}