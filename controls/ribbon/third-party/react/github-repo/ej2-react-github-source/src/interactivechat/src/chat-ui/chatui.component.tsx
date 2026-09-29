import * as React from 'react';
import { ChatUI, ChatUIModel } from '@syncfusion/ej2-interactive-chat';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface ChatUITypecast {
    suggestionTemplate?: string | Function | any;
    footerTemplate?: string | Function | any;
    emptyChatTemplate?: string | Function | any;
    messageTemplate?: string | Function | any;
    typingUsersTemplate?: string | Function | any;
    timeBreakTemplate?: string | Function | any;
    previewTemplate?: string | Function | any;
    attachmentTemplate?: string | Function | any;
}
/**
 * Represents the React ChatUI Component
 * ```tsx
 * <ChatUIComponent></ChatUIComponent>
 * ```
 */
export class ChatUIComponent extends ChatUI {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<ChatUIModel | DefaultHtmlAttributes| ChatUITypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = false;
    public directivekeys: { [key: string]: Object } = {'messages': 'message'};
    private statelessTemplateProps: string[] = null;
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<ChatUIModel | DefaultHtmlAttributes| ChatUITypecast>;
    public forceUpdate: (callBack?: () => any) => void;
    public context: Object;
    public portals: any = [];
    public isReactComponent: Object;
    public refs: {
        [key: string]: React.ReactInstance
    };
    constructor(props: any) {
        super(props);
    }

    public render(): any {
        this.isReactMock = false;
        if (((this.element && !this.initRenderCalled) || this.refreshing) && !(this as any).isReactForeceUpdate) {
            super.render();
            this.initRenderCalled = true;
        } else {
            return React.createElement('div', this.getDefaultAttributes(),[].concat(this.props.children,this.portals));
        }

    }
}

applyMixins(ChatUIComponent, [ComponentBase, React.Component]);
