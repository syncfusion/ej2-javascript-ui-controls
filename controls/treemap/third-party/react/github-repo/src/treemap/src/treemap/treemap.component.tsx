import * as React from 'react';
import { TreeMap, TreeMapModel } from '@syncfusion/ej2-treemap';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface TreeMapTypecast {
    tooltipSettings?: any;
    leafItemSettings?: any;
}
/**
 * Represents the React TreeMap component. It is used to visualize both hierarchical and flat data.
 * ```
 * <TreeMapComponent></TreeMapComponent>
 * ```
 */
export class TreeMapComponent extends TreeMap {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<TreeMapModel | DefaultHtmlAttributes| TreeMapTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = true;
    public directivekeys: { [key: string]: Object } = {'levels': {'level': {'colorMappings': 'colorMapping'}}};
    private statelessTemplateProps: string[] = null;
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<TreeMapModel | DefaultHtmlAttributes| TreeMapTypecast>;
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

applyMixins(TreeMapComponent, [ComponentBase, React.Component]);
