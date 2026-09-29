import * as React from 'react';
import { Toast, ToastModel } from '@syncfusion/ej2-notifications';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface ToastTypecast {
    title?: string | Function | any;
    content?: string | Function | any;
    template?: string | Function | any;
}
/**
 * Represents the React Toast Component
 * ```html
 * <Toast></Toast>
 * ```
 */
export class ToastComponent extends Toast {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<ToastModel | DefaultHtmlAttributes| ToastTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = false;
    public directivekeys: { [key: string]: Object } = {'buttonModelProps': 'buttonModelProp'};
    private statelessTemplateProps: string[] = ["content"];
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<ToastModel | DefaultHtmlAttributes| ToastTypecast>;
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

applyMixins(ToastComponent, [ComponentBase, React.Component]);
