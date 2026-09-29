import * as React from 'react';
import { Chart3D, Chart3DModel } from '@syncfusion/ej2-charts';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface Chart3DTypecast {
    tooltip?: any;
}
/**
 * Represents react 3D Chart Component
 * ```
 * <Chart3DComponent></Chart3DComponent>
 * ```
 */
export class Chart3DComponent extends Chart3D {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<Chart3DModel | DefaultHtmlAttributes| Chart3DTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = true;
    public directivekeys: { [key: string]: Object } = {'chart3DSeriesCollection': 'chart3DSeries', 'chart3DAxes': 'chart3DAxis', 'chart3DRows': 'chart3DRow', 'chart3DColumns': 'chart3DColumn', 'chart3DSelectedDataIndexes': 'chart3DSelectedDataIndex'};
    private statelessTemplateProps: string[] = null;
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<Chart3DModel | DefaultHtmlAttributes| Chart3DTypecast>;
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

applyMixins(Chart3DComponent, [ComponentBase, React.Component]);
