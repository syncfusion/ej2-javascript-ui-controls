import * as React from 'react';
import { Chart, ChartModel } from '@syncfusion/ej2-charts';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface ChartTypecast {
    tooltip?: any;
    legendSettings?: any;
}
/**
 * Represents react Chart Component
 * ```
 * <ChartComponent></ChartComponent>
 * ```
 */
export class ChartComponent extends Chart {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<ChartModel | DefaultHtmlAttributes| ChartTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = true;
    public directivekeys: { [key: string]: Object } = {'seriesCollection': {'series': {'trendlines': 'trendline', 'segments': 'segment'}}, 'axes': {'axis': {'stripLines': 'stripLine', 'multiLevelLabels': {'multiLevelLabel': {'categories': 'category'}}}}, 'rows': 'row', 'columns': 'column', 'rangeColorSettings': 'rangeColorSetting', 'annotations': 'annotation', 'selectedDataIndexes': 'selectedDataIndex', 'indicators': 'indicator'};
    private statelessTemplateProps: string[] = null;
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<ChartModel | DefaultHtmlAttributes| ChartTypecast>;
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

applyMixins(ChartComponent, [ComponentBase, React.Component]);
