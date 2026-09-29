import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ToolbarItemModel } from '@syncfusion/ej2-filemanager';

export let ToolbarItemsDirective =  vueDefineComponent({
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
            return 'e-toolbaritems';
        }
    }
});
export const ToolbarItemsPlugin = {
    name: 'e-toolbaritems',
    install(Vue: any) {
        Vue.component(ToolbarItemsPlugin.name, ToolbarItemsDirective);
    }
}


export let ToolbarItemDirective: DefineVueDirective<ToolbarItemModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-toolbaritem';
        }
    }
});
export const ToolbarItemPlugin = {
    name: 'e-toolbaritem',
    install(Vue: any) {
        Vue.component(ToolbarItemPlugin.name, ToolbarItemDirective);
    }
}