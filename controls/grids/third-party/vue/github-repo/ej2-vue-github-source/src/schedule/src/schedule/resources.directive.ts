import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ResourcesModel } from '@syncfusion/ej2-schedule';

export let ResourcesDirective =  vueDefineComponent({
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
            return 'e-resources';
        }
    }
});
export const ResourcesPlugin = {
    name: 'e-resources',
    install(Vue: any) {
        Vue.component(ResourcesPlugin.name, ResourcesDirective);
    }
}

/**
 * `e-resources` directive represent a resources of the VueJS Schedule. 
 * It must be contained in a Schedule component(`ejs-schedule`). 
 * ```js
 * <ejs-schedule>
 *   <e-resources>
 *    <e-resource field='RoomId' name='Rooms'></e-resource>
 *    <e-resource field='OwnerId' name='Owners'></e-resource>
 *   </e-resources>
 * </ejs-schedule>
 * ```
 */
export let ResourceDirective: DefineVueDirective<ResourcesModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-resource';
        }
    }
});
export const ResourcePlugin = {
    name: 'e-resource',
    install(Vue: any) {
        Vue.component(ResourcePlugin.name, ResourceDirective);
    }
}