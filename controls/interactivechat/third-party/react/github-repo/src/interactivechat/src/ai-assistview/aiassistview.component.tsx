import * as React from 'react';
import { AIAssistView, AIAssistViewModel } from '@syncfusion/ej2-interactive-chat';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface AIAssistViewTypecast {
    footerTemplate?: string | Function | any;
    promptItemTemplate?: string | Function | any;
    responseItemTemplate?: string | Function | any;
    promptSuggestionItemTemplate?: string | Function | any;
    itemTemplate?: string | Function | any;
    blockTemplate?: string | Function | any;
    bannerTemplate?: string | Function | any;
    responseAnimationTemplate?: string | Function | any;
}
/**
 * Represents the React AIAssistView Component
 * ```tsx
 * <AIAssistViewComponent></AIAssistViewComponent>
 * ```
 */
export class AIAssistViewComponent extends AIAssistView {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<AIAssistViewModel | DefaultHtmlAttributes| AIAssistViewTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = true;
    public directivekeys: { [key: string]: Object } = {'views': 'view', 'mentions': 'mention'};
    private statelessTemplateProps: string[] = null;
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<AIAssistViewModel | DefaultHtmlAttributes| AIAssistViewTypecast>;
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

applyMixins(AIAssistViewComponent, [ComponentBase, React.Component]);
