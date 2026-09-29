import * as React from 'react';
import { Ribbon, RibbonModel } from '@syncfusion/ej2-ribbon';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface RibbonTypecast {
    helpPaneTemplate?: string | Function | any;
}
/**
 * Represents the React Ribbon Component
 * ```ts
 * <RibbonComponent></RibbonComponent>
 * ```
 */
export class RibbonComponent extends Ribbon {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<RibbonModel | DefaultHtmlAttributes| RibbonTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = true;
    public directivekeys: { [key: string]: Object } = {'ribbonTabs': {'ribbonTab': {'ribbonGroups': {'ribbonGroup': {'ribbonCollections': {'ribbonCollection': {'ribbonItems': 'ribbonItem'}}}}}}, 'ribbonContextualTabs': {'ribbonContextualTab': {'ribbonTabs': {'ribbonTab': {'ribbonGroups': {'ribbonGroup': {'ribbonCollections': {'ribbonCollection': {'ribbonItems': 'ribbonItem'}}}}}}}}};
    private statelessTemplateProps: string[] = null;
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<RibbonModel | DefaultHtmlAttributes| RibbonTypecast>;
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

applyMixins(RibbonComponent, [ComponentBase, React.Component]);
