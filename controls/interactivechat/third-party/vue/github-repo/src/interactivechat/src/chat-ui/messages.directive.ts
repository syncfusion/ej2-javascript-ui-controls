import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { MessageModel } from '@syncfusion/ej2-interactive-chat';

export let MessagesDirective =  vueDefineComponent({
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
            return 'e-messages';
        }
    }
});
export const MessagesPlugin = {
    name: 'e-messages',
    install(Vue: any) {
        Vue.component(MessagesPlugin.name, MessagesDirective);
    }
}

/**
 * Represents the Essential JS 2 VueJS ChatUI Component
 * ```vue
 * <ejs-chatui>
 *   <e-messages>
 *     <e-message>
 *     </e-message>
 *    </e-messages>
 * </ejs-chatui>
 * ```
 */
export let MessageDirective: DefineVueDirective<MessageModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-message';
        }
    }
});
export const MessagePlugin = {
    name: 'e-message',
    install(Vue: any) {
        Vue.component(MessagePlugin.name, MessageDirective);
    }
}