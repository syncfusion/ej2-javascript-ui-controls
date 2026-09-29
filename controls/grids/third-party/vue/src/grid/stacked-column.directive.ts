import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { StackedColumnModel } from '@syncfusion/ej2-grids';

export let StackedColumnsDirective =  vueDefineComponent({
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
            return 'e-stacked-columns';
        }
    }
});
export const StackedColumnsPlugin = {
    name: 'e-stacked-columns',
    install(Vue: any) {
        Vue.component(StackedColumnsPlugin.name, StackedColumnsDirective);
    }
}


export let StackedColumnDirective: DefineVueDirective<StackedColumnModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-stacked-column';
        }
    }
});
export const StackedColumnPlugin = {
    name: 'e-stacked-column',
    install(Vue: any) {
        Vue.component(StackedColumnPlugin.name, StackedColumnDirective);
    }
}