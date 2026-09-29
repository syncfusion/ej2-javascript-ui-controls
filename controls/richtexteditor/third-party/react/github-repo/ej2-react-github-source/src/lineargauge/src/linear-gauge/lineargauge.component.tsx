import * as React from 'react';
import { LinearGauge, LinearGaugeModel } from '@syncfusion/ej2-lineargauge';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface LinearGaugeTypecast {
    tooltip?: any;
}
/**
 * Represents the React Linear Gauge Component. This tag is used to customize the properties of the linear gauge to visualize the data in linear scale.
 * ```
 * <LinearGaugeComponent></LinearGaugeComponent>
 * ```
 */
export class LinearGaugeComponent extends LinearGauge {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<LinearGaugeModel | DefaultHtmlAttributes| LinearGaugeTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = true;
    public directivekeys: { [key: string]: Object } = {'axes': {'axis': {'ranges': 'range', 'pointers': 'pointer'}}, 'annotations': 'annotation'};
    private statelessTemplateProps: string[] = null;
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<LinearGaugeModel | DefaultHtmlAttributes| LinearGaugeTypecast>;
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

applyMixins(LinearGaugeComponent, [ComponentBase, React.Component]);
