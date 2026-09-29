import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { AggregateRowModel } from '@syncfusion/ej2-treegrid';

export let AggregatesDirective =  vueDefineComponent({
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
            return 'e-aggregates';
        }
    }
});
export const AggregatesPlugin = {
    name: 'e-aggregates',
    install(Vue: any) {
        Vue.component(AggregatesPlugin.name, AggregatesDirective);
    }
}

/**
 * `e-aggregate` directive represent a aggregate row of the VueJS TreeGrid. 
 * It must be contained in a TreeGrid component(`ejs-treegrid`). 
 * ```html
 * <ejs-treegrid :dataSource]='data' allowPaging='true' allowSorting='true'>
 *   <e-columns>
 *     <e-column field='ID' width='100'/>
 *     <e-column field='name' headerText='Name' width='100'/>
 *   </e-columns>
 *   <e-aggregates>
 *     <e-aggregate>
 *       <e-columns>
 *         <e-column field='ID' type='Min'/>
 *       </e-columns>
 *      </e-aggregate>
 *    </e-aggregates>
 * </ejs-treegrid>
 * ```
 */
export let AggregateDirective: DefineVueDirective<AggregateRowModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-aggregate';
        }
    }
});
export const AggregatePlugin = {
    name: 'e-aggregate',
    install(Vue: any) {
        Vue.component(AggregatePlugin.name, AggregateDirective);
    }
}