import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { AccordionItemModel } from '@syncfusion/ej2-navigations';

export let AccordionItemsDirective =  vueDefineComponent({
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
            return 'e-accordionitems';
        }
    }
});
export const AccordionItemsPlugin = {
    name: 'e-accordionitems',
    install(Vue: any) {
        Vue.component(AccordionItemsPlugin.name, AccordionItemsDirective);
    }
}

/**
 * 'e-accordionitem' directive represent a item of Vue Accordion 
 * It must be contained in a Accordion component(`ejs-accordion`). 
 * ```html
 * <ejs-accordion> 
 *   <e-accordionitems>
 *    <e-accordionitem header='Header1'></e-accordionitem>
 *    <e-accordionitem header='Header2' content='Content2'></e-accordionitem>
 *   </e-accordionitems>
 * </ejs-accordion>
 * ```
 */
export let AccordionItemDirective: DefineVueDirective<AccordionItemModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-accordionitem';
        }
    }
});
export const AccordionItemPlugin = {
    name: 'e-accordionitem',
    install(Vue: any) {
        Vue.component(AccordionItemPlugin.name, AccordionItemDirective);
    }
}