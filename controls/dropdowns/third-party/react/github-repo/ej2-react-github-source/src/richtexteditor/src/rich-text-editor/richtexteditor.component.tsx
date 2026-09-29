import * as React from 'react';
import { RichTextEditor, RichTextEditorModel } from '@syncfusion/ej2-richtexteditor';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface RichTextEditorTypecast {
    valueTemplate?: string | Function | any;
    aiAssistantSettings?: any;
}
/**
 * `RichTextEditor` represents the react RichTextEditor.
 * ```ts
 * <RichTextEditor/>
 * ```
 */
export class RichTextEditorComponent extends RichTextEditor {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<RichTextEditorModel | DefaultHtmlAttributes| RichTextEditorTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = true;
    private statelessTemplateProps: string[] = ["valueTemplate"];
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<RichTextEditorModel | DefaultHtmlAttributes| RichTextEditorTypecast>;
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

applyMixins(RichTextEditorComponent, [ComponentBase, React.Component]);
