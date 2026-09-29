import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { TimelineItemModel } from '@syncfusion/ej2-layouts';

export let ItemsDirective =  vueDefineComponent({
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
            return 'e-items';
        }
    }
});
export const ItemsPlugin = {
    name: 'e-items',
    install(Vue: any) {
        Vue.component(ItemsPlugin.name, ItemsDirective);
    }
}

/**
 * 'e-timelineItem' directive represents a item of the Vue Timeline 
 * It must be contained in a Timeline component(`ejs-timeline`). 
 * ```html
 * <ejs-timeline>
 *  <e-items>
 *   <e-item :dotCss='e-icons e-folder' :content='Item 1' />
 *   <e-item :dotCss='e-icons e-folder' :content='Item 2' />
 *  </e-items> 
 * </ejs-timeline>
 * ```
 */
export let ItemDirective: DefineVueDirective<TimelineItemModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-item';
        }
    }
});
export const ItemPlugin = {
    name: 'e-item',
    install(Vue: any) {
        Vue.component(ItemPlugin.name, ItemDirective);
    }
}