import * as React from 'react';
import { Stepper, StepperModel } from '@syncfusion/ej2-navigations';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface StepperTypecast {
    template?: string | Function | any;
    tooltipTemplate?: string | Function | any;
}
/**
 * `StepperComponent` represents the react Stepper Component.
 * ```ts
 * <StepperComponent steps={stepItems} />
 * ```
 */
export class StepperComponent extends Stepper {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<StepperModel | DefaultHtmlAttributes| StepperTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = false;
    public directivekeys: { [key: string]: Object } = {'steps': 'step'};
    private statelessTemplateProps: string[] = null;
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<StepperModel | DefaultHtmlAttributes| StepperTypecast>;
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
            return React.createElement('nav', this.getDefaultAttributes(),[].concat(this.props.children,this.portals));
        }

    }
}

applyMixins(StepperComponent, [ComponentBase, React.Component]);
