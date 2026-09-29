import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { IndexesModel } from '@syncfusion/ej2-charts';

export let SelectedDataIndexesDirective =  vueDefineComponent({
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
            return 'e-selecteddataindexes';
        }
    }
});
export const SelectedDataIndexesPlugin = {
    name: 'e-selecteddataindexes',
    install(Vue: any) {
        Vue.component(SelectedDataIndexesPlugin.name, SelectedDataIndexesDirective);
    }
}


export let SelectedDataIndexDirective: DefineVueDirective<IndexesModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-selecteddataindex';
        }
    }
});
export const SelectedDataIndexPlugin = {
    name: 'e-selecteddataindex',
    install(Vue: any) {
        Vue.component(SelectedDataIndexPlugin.name, SelectedDataIndexDirective);
    }
}