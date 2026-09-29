import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { StackedHeadersModel } from '@syncfusion/ej2-kanban';

export let StackedHeadersDirective =  vueDefineComponent({
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
            return 'e-stackedHeaders';
        }
    }
});
export const StackedHeadersPlugin = {
    name: 'e-stackedHeaders',
    install(Vue: any) {
        Vue.component(StackedHeadersPlugin.name, StackedHeadersDirective);
    }
}

/**
 * `e-stackedHeaders` directive represent a stacked header of the VueJS Kanban board. 
 * It must be contained in a Kanban component(`ejs-kanban`). 
 * ```vue
 * <ejs-kanban>
 *   <e-stackedHeaders>
 *    <e-stackedHeader keyField='Open' text='To Do'></e-stackedHeader>
 *    <e-stackedHeader keyField='Close' text='Completed'></e-stackedHeader>
 *   </e-stackedHeaders>
 * </ejs-kanban>
 * ```
 */
export let StackedHeaderDirective: DefineVueDirective<StackedHeadersModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-stackedHeader';
        }
    }
});
export const StackedHeaderPlugin = {
    name: 'e-stackedHeader',
    install(Vue: any) {
        Vue.component(StackedHeaderPlugin.name, StackedHeaderDirective);
    }
}