import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { IndexesModel } from '@syncfusion/ej2-charts';

export let CircularChart3DSelectedDataIndexesDirective =  vueDefineComponent({
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
            return 'e-circularchart3d-selecteddataindexes';
        }
    }
});
export const CircularChart3DSelectedDataIndexesPlugin = {
    name: 'e-circularchart3d-selecteddataindexes',
    install(Vue: any) {
        Vue.component(CircularChart3DSelectedDataIndexesPlugin.name, CircularChart3DSelectedDataIndexesDirective);
    }
}


export let CircularChart3DSelectedDataIndexDirective: DefineVueDirective<IndexesModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-circularchart3d-selecteddataindex';
        }
    }
});
export const CircularChart3DSelectedDataIndexPlugin = {
    name: 'e-circularchart3d-selecteddataindex',
    install(Vue: any) {
        Vue.component(CircularChart3DSelectedDataIndexPlugin.name, CircularChart3DSelectedDataIndexDirective);
    }
}