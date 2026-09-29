import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { WeekWorkingTimeModel } from '@syncfusion/ej2-gantt';

export let WeekWorkingTimesDirective =  vueDefineComponent({
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
            return 'e-week-working-times';
        }
    }
});
export const WeekWorkingTimesPlugin = {
    name: 'e-week-working-times',
    install(Vue: any) {
        Vue.component(WeekWorkingTimesPlugin.name, WeekWorkingTimesDirective);
    }
}

/**
 * `e-week-working-time-collection` directive represent a working time ranges in a day. 
 * It must be contained in a Gantt component(`ejs-gantt`). 
 * ```vue
 * <ejs-gantt :dataSource]='data' allowSelection='true' allowSorting='true'>
 *   <e-week-working-time-collection>
 *     <e-week-working-time dayOfWeek='Monday' from='8' to='12'/>
 *     <e-week-working-time dayOfWeek='Monday' from='13' to='17'/>
 *   </e-week-working-time-collection>
 * </ejs-gantt>
 * ```
 */
export let WeekWorkingTimeDirective: DefineVueDirective<WeekWorkingTimeModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-week-working-time';
        }
    }
});
export const WeekWorkingTimePlugin = {
    name: 'e-week-working-time',
    install(Vue: any) {
        Vue.component(WeekWorkingTimePlugin.name, WeekWorkingTimeDirective);
    }
}