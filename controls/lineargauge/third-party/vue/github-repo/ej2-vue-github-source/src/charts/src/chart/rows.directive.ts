import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { RowModel } from '@syncfusion/ej2-charts';

export let RowsDirective =  vueDefineComponent({
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
            return 'e-rows';
        }
    }
});
export const RowsPlugin = {
    name: 'e-rows',
    install(Vue: any) {
        Vue.component(RowsPlugin.name, RowsDirective);
    }
}


export let RowDirective: DefineVueDirective<RowModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-row';
        }
    }
});
export const RowPlugin = {
    name: 'e-row',
    install(Vue: any) {
        Vue.component(RowPlugin.name, RowDirective);
    }
}