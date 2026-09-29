import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { AggregateColumnModel } from '@syncfusion/ej2-grids';

export let AggregateColumnsDirective =  vueDefineComponent({
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
            return 'e-columns';
        }
    }
});
export const AggregateColumnsPlugin = {
    name: 'e-columns',
    install(Vue: any) {
        Vue.component(AggregateColumnsPlugin.name, AggregateColumnsDirective);
    }
}

/**
 * `e-aggregate->e-column` directive represent a aggregate column of the VueJS Grid. 
 * ```vue
 * <ejs-grid :dataSource='data' allowPaging='true' allowSorting='true'> 
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
 * </ejs-grid>
 * ```
 */
export let AggregateColumnDirective: DefineVueDirective<AggregateColumnModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-column';
        }
    }
});
export const AggregateColumnPlugin = {
    name: 'e-column',
    install(Vue: any) {
        Vue.component(AggregateColumnPlugin.name, AggregateColumnDirective);
    }
}