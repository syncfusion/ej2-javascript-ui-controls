import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PresetsModel } from '@syncfusion/ej2-calendars';

export let PresetsDirective =  vueDefineComponent({
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
            return 'e-presets';
        }
    }
});
export const PresetsPlugin = {
    name: 'e-presets',
    install(Vue: any) {
        Vue.component(PresetsPlugin.name, PresetsDirective);
    }
}

/**
 * 'e-presets' directive represent a presets of VueJS daterangepicker 
 * It must be contained in a daterangepicker component(`ej-daterangepicker`). 
 * ```html
 * <ejs-daterangepicker id='range'> 
 *   <e-presets>
 *   <e-preset label='Last Week' v-bind:start='startValue' v-bind:end='endValue'></e-preset>
 *   <e-preset label='Last Month' v-bind:start='startValue' v-bind:end='endValue'></e-preset>
 *   </e-presets>
 * </ejs-daterangepicker>
 * ```
 */
export let PresetDirective: DefineVueDirective<PresetsModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-preset';
        }
    }
});
export const PresetPlugin = {
    name: 'e-preset',
    install(Vue: any) {
        Vue.component(PresetPlugin.name, PresetDirective);
    }
}