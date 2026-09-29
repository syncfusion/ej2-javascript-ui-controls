import * as React from 'react';
import { InlineAIAssist, InlineAIAssistModel } from '@syncfusion/ej2-interactive-chat';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface InlineAIAssistTypecast {
    editorTemplate?: string | Function | any;
    responseTemplate?: string | Function | any;
}
/**
 * Represents the React InlineAIAssist Component
 * ```tsx
 * <InlineAIAssistComponent></InlineAIAssistComponent>
 * ```
 */
export class InlineAIAssistComponent extends InlineAIAssist {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<InlineAIAssistModel | DefaultHtmlAttributes| InlineAIAssistTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = false;
    private statelessTemplateProps: string[] = null;
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<InlineAIAssistModel | DefaultHtmlAttributes| InlineAIAssistTypecast>;
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

applyMixins(InlineAIAssistComponent, [ComponentBase, React.Component]);
