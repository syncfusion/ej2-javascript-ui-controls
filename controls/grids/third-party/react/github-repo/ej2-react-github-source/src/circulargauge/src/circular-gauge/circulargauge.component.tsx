import * as React from 'react';
import { CircularGauge, CircularGaugeModel } from '@syncfusion/ej2-circulargauge';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface CircularGaugeTypecast {
    tooltip?: any;
}
/**
 * Represents the React Circular Gauge component. This tag is used to customize the properties of the circular gauge to visualize the data in circular scale.
 * ```tsx
 * <CircularGaugeComponent></CircularGaugeComponent>
 * ```
 */
export class CircularGaugeComponent extends CircularGauge {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<CircularGaugeModel | DefaultHtmlAttributes| CircularGaugeTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = true;
    public directivekeys: { [key: string]: Object } = {'axes': {'axis': {'annotations': 'annotation', 'ranges': 'range', 'pointers': 'pointer'}}};
    private statelessTemplateProps: string[] = null;
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<CircularGaugeModel | DefaultHtmlAttributes| CircularGaugeTypecast>;
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

applyMixins(CircularGaugeComponent, [ComponentBase, React.Component]);
