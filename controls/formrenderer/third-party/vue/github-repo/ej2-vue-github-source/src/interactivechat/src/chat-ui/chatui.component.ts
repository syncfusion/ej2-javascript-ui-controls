import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';

import { ChatUI, ChatUIModel } from '@syncfusion/ej2-interactive-chat';
import { MessagesDirective, MessageDirective, MessagesPlugin, MessagePlugin } from './messages.directive'


export const properties: string[] = ['isLazyUpdate', 'plugins', 'attachmentSettings', 'autoScrollToBottom', 'cssClass', 'emptyChatTemplate', 'enableAttachments', 'enableCompactMode', 'enablePersistence', 'enableRtl', 'footerTemplate', 'headerIconCss', 'headerText', 'headerToolbar', 'height', 'loadOnDemand', 'locale', 'mentionTriggerChar', 'mentionUsers', 'messageTemplate', 'messageToolbarSettings', 'messages', 'placeholder', 'showFooter', 'showHeader', 'showTimeBreak', 'showTimeStamp', 'suggestionTemplate', 'suggestions', 'timeBreakTemplate', 'timeStampFormat', 'typingUsers', 'typingUsersTemplate', 'user', 'width', 'attachmentRemoved', 'attachmentUploadFailure', 'attachmentUploadSuccess', 'beforeAttachmentUpload', 'created', 'mentionSelect', 'messageSend', 'userTyping'];
export const modelProps: string[] = [];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * Represents the Essential JS 2 VueJS ChatUI Component
 * ```vue
 * <ejs-chatui ></ejs-chatui>
 * ```
 */
export let ChatUIComponent: DefineVueComponent<ChatUIModel> =  vueDefineComponent({
    name: 'ChatUIComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new ChatUI({}) as any,
            propKeys: properties as string[],
            models: modelProps as string[],
            hasChildDirective: true as boolean,
            hasInjectedModules: false as boolean,
            tagMapper: {"e-messages":"e-message"} as { [key: string]: Object },
            tagNameMapper: {} as Object,
            isVue3: !isExecute as boolean,
            templateCollection: {} as any,
        }
    },
    created() {

        this.bindProperties();
        this.ej2Instances._setProperties = this.ej2Instances.setProperties;
        this.ej2Instances.setProperties = this.setProperties;
        this.ej2Instances.clearTemplate = this.clearTemplate;
        this.updated = this.updated;
    },
    render(createElement: any) {
        let h: any = !isExecute ? gh : createElement;
        let slots: any = null;
        if(!isNullOrUndefined((this as any).$slots.default)) {
            slots = !isExecute ? (this as any).$slots.default() : (this as any).$slots.default;
        }
        return h('div', slots);
    },
    methods: {
        clearTemplate(templateNames?: string[]): any {
            if (!templateNames){ templateNames = Object.keys(this.templateCollection || {}) }
            if (templateNames.length &&  this.templateCollection) {
                for (let tempName of templateNames){
                    let elementCollection: any = this.templateCollection[tempName];
                    if(elementCollection && elementCollection.length) {
                        for(let ele of elementCollection) {
                            this.destroyPortals(ele);
                        }
                        delete this.templateCollection[tempName];
                    }
                }
            }
        },
        setProperties(prop: any, muteOnChange: boolean): void {
            if(this.isVue3) { this.models = !this.models ? this.ej2Instances.referModels : this.models }
            if (this.ej2Instances && this.ej2Instances._setProperties) {
                this.ej2Instances._setProperties(prop, muteOnChange);
            }
            if (prop && this.models && this.models.length) {
                Object.keys(prop).map((key: string): void => {
                    this.models.map((model: string): void => {
                        if ((key === model) && !(/datasource/i.test(key))) {
                            if (this.isVue3) {
                                this.ej2Instances.vueInstance.$emit('update:' + key, prop[key]);
                            } else {
                                (this as any).$emit('update:' + key, prop[key]);
                                (this as any).$emit('modelchanged', prop[key]);
                            }
                        }
                    });
                });
            }
        },
        custom(): void {
            this.updated();
        },
        addMessage(message: string | Object): void {
            return this.ej2Instances.addMessage(message);
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        focus(): void {
            return this.ej2Instances.focus();
        },
        prependMessages(messages: string[] | Object[]): void {
            return this.ej2Instances.prependMessages(messages);
        },
        scrollToBottom(): void {
            return this.ej2Instances.scrollToBottom();
        },
        scrollToMessage(messageId: string): void {
            return this.ej2Instances.scrollToMessage(messageId);
        },
        updateMessage(message: Object, msgId: string): void {
            return this.ej2Instances.updateMessage(message, msgId);
        },
    }
});

export type ChatUIComponent = typeof ComponentBase & {
    ej2Instances: ChatUI;
    isVue3: boolean;
    isLazyUpdate: Boolean;
    plugins: any[];
    propKeys: string[];
    models: string[];
    hasChildDirective: boolean;
    tagMapper: {
        [key: string]: Object;
    };
    tagNameMapper: Object;
    setProperties(prop: any, muteOnChange: boolean): void;
    trigger(eventName: string, eventProp: {
        [key: string]: Object;
    }, successHandler?: Function): void;
    addMessage(message: string | Object): void;
    destroy(): void;
    focus(): void;
    prependMessages(messages: string[] | Object[]): void;
    scrollToBottom(): void;
    scrollToMessage(messageId: string): void;
    updateMessage(message: Object, msgId: string): void
};

export const ChatUIPlugin = {
    name: 'ejs-chatui',
    install(Vue: any) {
        Vue.component(ChatUIPlugin.name, ChatUIComponent);
        Vue.component(MessagePlugin.name, MessageDirective);
        Vue.component(MessagesPlugin.name, MessagesDirective);

    }
}