import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { LevelSettingsModel } from '@syncfusion/ej2-treemap';

export let LevelsDirective =  vueDefineComponent({
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
            return 'e-levels';
        }
    }
});
export const LevelsPlugin = {
    name: 'e-levels',
    install(Vue: any) {
        Vue.component(LevelsPlugin.name, LevelsDirective);
    }
}

/**
 * Represents the directive to configure and render level leaf items in the treemap.
 * ```
 * <ejs-treemap>
 * <e-levels>
 * <e-level></e-level>
 * </e-levels>
 * </ejs-treemap>
 * ```
 */
export let LevelDirective: DefineVueDirective<LevelSettingsModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-level';
        }
    }
});
export const LevelPlugin = {
    name: 'e-level',
    install(Vue: any) {
        Vue.component(LevelPlugin.name, LevelDirective);
    }
}