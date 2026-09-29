import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { MultiLevelLabelsModel } from '@syncfusion/ej2-charts';

export let MultiLevelLabelsDirective =  vueDefineComponent({
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
            return 'e-multilevellabels';
        }
    }
});
export const MultiLevelLabelsPlugin = {
    name: 'e-multilevellabels',
    install(Vue: any) {
        Vue.component(MultiLevelLabelsPlugin.name, MultiLevelLabelsDirective);
    }
}


export let MultiLevelLabelDirective: DefineVueDirective<MultiLevelLabelsModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-multilevellabel';
        }
    }
});
export const MultiLevelLabelPlugin = {
    name: 'e-multilevellabel',
    install(Vue: any) {
        Vue.component(MultiLevelLabelPlugin.name, MultiLevelLabelDirective);
    }
}