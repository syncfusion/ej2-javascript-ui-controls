import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { BubbleSettingsModel } from '@syncfusion/ej2-maps';

export let BubblesDirective =  vueDefineComponent({
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
            return 'e-bubbleSettings';
        }
    }
});
export const BubblesPlugin = {
    name: 'e-bubbleSettings',
    install(Vue: any) {
        Vue.component(BubblesPlugin.name, BubblesDirective);
    }
}

/**
 * Represents the directive to define the bubbles in the maps.
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
export let BubbleDirective: DefineVueDirective<BubbleSettingsModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-bubbleSetting';
        }
    }
});
export const BubblePlugin = {
    name: 'e-bubbleSetting',
    install(Vue: any) {
        Vue.component(BubblePlugin.name, BubbleDirective);
    }
}