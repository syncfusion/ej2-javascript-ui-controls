import * as React from 'react';
import { RangeNavigator, RangeNavigatorModel } from '@syncfusion/ej2-charts';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface RangeNavigatorTypecast {
    tooltip?: any;
}
/**
 * Represents react RangeNavigator Component
 * ```
 * <RangeNavigatorComponent></RangeNavigatorComponent>
 * ```
 */
export class RangeNavigatorComponent extends RangeNavigator {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<RangeNavigatorModel | DefaultHtmlAttributes| RangeNavigatorTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = true;
    public directivekeys: { [key: string]: Object } = {'rangenavigatorSeriesCollection': 'rangenavigatorSeries'};
    private statelessTemplateProps: string[] = null;
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<RangeNavigatorModel | DefaultHtmlAttributes| RangeNavigatorTypecast>;
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

applyMixins(RangeNavigatorComponent, [ComponentBase, React.Component]);
