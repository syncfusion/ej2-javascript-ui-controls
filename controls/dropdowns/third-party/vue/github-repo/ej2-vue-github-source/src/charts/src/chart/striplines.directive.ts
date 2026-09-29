import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { StripLineSettingsModel } from '@syncfusion/ej2-charts';

export let StripLinesDirective =  vueDefineComponent({
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
            return 'e-striplines';
        }
    }
});
export const StripLinesPlugin = {
    name: 'e-striplines',
    install(Vue: any) {
        Vue.component(StripLinesPlugin.name, StripLinesDirective);
    }
}


export let StripLineDirective: DefineVueDirective<StripLineSettingsModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-stripline';
        }
    }
});
export const StripLinePlugin = {
    name: 'e-stripline',
    install(Vue: any) {
        Vue.component(StripLinePlugin.name, StripLineDirective);
    }
}