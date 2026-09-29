import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { SpeedDialItemModel } from '@syncfusion/ej2-buttons';

export let SpeedDialItemsDirective =  vueDefineComponent({
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
            return 'e-speeddial-items';
        }
    }
});
export const SpeedDialItemsPlugin = {
    name: 'e-speeddial-items',
    install(Vue: any) {
        Vue.component(SpeedDialItemsPlugin.name, SpeedDialItemsDirective);
    }
}

/**
 * 'e-speeddialitem' directive represent a item of Vue SpeedDial 
 * It must be contained in a SpeedDial component(`ejs-speeddial`). 
 * ```html
 * <ejs-speeddial> 
 *   <e-speeddialitems>
 *    <e-speeddialitem text='Cut'></e-speeddialitem>
 *    <e-speeddialitem text='Copy'></e-speeddialitem>
 *   </e-speeddialitems>
 * </ejs-speeddial>
 * ```
 */
export let SpeedDialItemDirective: DefineVueDirective<SpeedDialItemModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-speeddial-item';
        }
    }
});
export const SpeedDialItemPlugin = {
    name: 'e-speeddial-item',
    install(Vue: any) {
        Vue.component(SpeedDialItemPlugin.name, SpeedDialItemDirective);
    }
}