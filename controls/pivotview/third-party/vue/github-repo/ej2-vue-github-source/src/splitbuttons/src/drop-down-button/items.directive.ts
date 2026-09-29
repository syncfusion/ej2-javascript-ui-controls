import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ItemModel } from '@syncfusion/ej2-splitbuttons';

export let DropDownButtonItemsDirective =  vueDefineComponent({
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
            return 'e-dropdownbuttonitems';
        }
    }
});
export const DropDownButtonItemsPlugin = {
    name: 'e-dropdownbuttonitems',
    install(Vue: any) {
        Vue.component(DropDownButtonItemsPlugin.name, DropDownButtonItemsDirective);
    }
}


export let DropDownButtonItemDirective: DefineVueDirective<ItemModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-dropdownbuttonitem';
        }
    }
});
export const DropDownButtonItemPlugin = {
    name: 'e-dropdownbuttonitem',
    install(Vue: any) {
        Vue.component(DropDownButtonItemPlugin.name, DropDownButtonItemDirective);
    }
}