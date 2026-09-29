import * as React from 'react';
import { PivotView, PivotViewModel } from '@syncfusion/ej2-pivotview';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface PivotViewTypecast {
    cellTemplate?: string | Function | any;
    tooltipTemplate?: string | Function | any;
}
/**
 * `PivotViewComponent` represents the react Pivot Table.
 * ```
 * <PivotViewComponent></PivotViewComponent>
 * ```
 */
export class PivotViewComponent extends PivotView {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<PivotViewModel | DefaultHtmlAttributes| PivotViewTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = true;
    private statelessTemplateProps: string[] = null;
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<PivotViewModel | DefaultHtmlAttributes| PivotViewTypecast>;
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

applyMixins(PivotViewComponent, [ComponentBase, React.Component]);
