import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { MultiLevelCategoriesModel } from '@syncfusion/ej2-charts';

export let CategoriesDirective =  vueDefineComponent({
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
            return 'e-categories';
        }
    }
});
export const CategoriesPlugin = {
    name: 'e-categories',
    install(Vue: any) {
        Vue.component(CategoriesPlugin.name, CategoriesDirective);
    }
}


export let CategoryDirective: DefineVueDirective<MultiLevelCategoriesModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-category';
        }
    }
});
export const CategoryPlugin = {
    name: 'e-category',
    install(Vue: any) {
        Vue.component(CategoryPlugin.name, CategoryDirective);
    }
}