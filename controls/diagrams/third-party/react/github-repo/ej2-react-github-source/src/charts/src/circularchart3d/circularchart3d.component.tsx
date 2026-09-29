import * as React from 'react';
import { CircularChart3D, CircularChart3DModel } from '@syncfusion/ej2-charts';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface CircularChart3DTypecast {
    tooltip?: any;
}
/**
 * Represents react Circular 3D chart Component
 * ```
 * <CircularChart3DComponent></CircularChart3DComponent>
 * ```
 */
export class CircularChart3DComponent extends CircularChart3D {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<CircularChart3DModel | DefaultHtmlAttributes| CircularChart3DTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = true;
    public directivekeys: { [key: string]: Object } = {'circularChart3DSeriesCollection': 'circularChart3DSeries', 'circularChart3DSelectedDataIndexes': 'circularChart3DSelectedDataIndex'};
    private statelessTemplateProps: string[] = null;
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<CircularChart3DModel | DefaultHtmlAttributes| CircularChart3DTypecast>;
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

applyMixins(CircularChart3DComponent, [ComponentBase, React.Component]);
