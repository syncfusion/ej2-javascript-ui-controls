import * as React from 'react';
import { StockChart, StockChartModel } from '@syncfusion/ej2-charts';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface StockChartTypecast {
    tooltip?: any;
    legendSettings?: any;
}
/**
 * Represents react Chart Component
 * ```
 * <StockChartComponent></StockChartComponent>
 * ```
 */
export class StockChartComponent extends StockChart {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<StockChartModel | DefaultHtmlAttributes| StockChartTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = true;
    public directivekeys: { [key: string]: Object } = {'stockChartSeriesCollection': {'stockChartSeries': {'stockChartTrendlines': 'stockChartTrendline'}}, 'stockChartAxes': 'stockChartAxis', 'stockChartRows': 'stockChartRow', 'stockChartAnnotations': 'stockChartAnnotation', 'stockChartSelectedDataIndexes': 'stockChartSelectedDataIndex', 'stockChartPeriods': 'stockChartPeriod', 'stockEvents': 'stockEvent', 'stockChartIndicators': 'stockChartIndicator'};
    private statelessTemplateProps: string[] = null;
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<StockChartModel | DefaultHtmlAttributes| StockChartTypecast>;
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

applyMixins(StockChartComponent, [ComponentBase, React.Component]);
