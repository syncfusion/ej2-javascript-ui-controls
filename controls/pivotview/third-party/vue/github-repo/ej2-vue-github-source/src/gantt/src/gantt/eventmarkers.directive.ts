import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { EventMarkerModel } from '@syncfusion/ej2-gantt';

export let EventMarkersDirective =  vueDefineComponent({
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
            return 'e-event-markers';
        }
    }
});
export const EventMarkersPlugin = {
    name: 'e-event-markers',
    install(Vue: any) {
        Vue.component(EventMarkersPlugin.name, EventMarkersDirective);
    }
}

/**
 * `e-event-markers` directive represent a event marker collection in Gantt
 * It must be contained in a Gantt component(`ejs-gantt`). 
 * ```vue
 * <ejs-gantt :dataSource]='data' allowSelection='true' allowSorting='true'>
 *   <e-event-markers>
 *     <e-event-marker day='02/10/2018' label='Project Starts'/>
 *   </e-event-markers>
 * </ejs-gantt>
 * ```
 */
export let EventMarkerDirective: DefineVueDirective<EventMarkerModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-event-marker';
        }
    }
});
export const EventMarkerPlugin = {
    name: 'e-event-marker',
    install(Vue: any) {
        Vue.component(EventMarkerPlugin.name, EventMarkerDirective);
    }
}