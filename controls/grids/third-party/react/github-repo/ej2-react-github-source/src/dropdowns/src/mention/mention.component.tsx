import * as React from 'react';
import { Mention, MentionModel } from '@syncfusion/ej2-dropdowns';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface MentionTypecast {
    displayTemplate?: string | Function | any;
    itemTemplate?: string | Function | any;
    spinnerTemplate?: string | Function | any;
}
/**
 * The Mention component contains a list of predefined values, from which the user can choose a single value.
 * ```
 * <MentionComponent dataSource={data}/>
 * ```
 */
export class MentionComponent extends Mention {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<MentionModel | DefaultHtmlAttributes| MentionTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = false;
    private statelessTemplateProps: string[] = ["itemTemplate"];
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<MentionModel | DefaultHtmlAttributes| MentionTypecast>;
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

applyMixins(MentionComponent, [ComponentBase, React.Component]);
