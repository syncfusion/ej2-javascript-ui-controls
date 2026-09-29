import * as React from 'react';
import { Gantt, GanttModel } from '@syncfusion/ej2-gantt';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface GanttTypecast {
    parentTaskbarTemplate?: string | Function | any;
    toolbarTemplate?: string | Function | any;
    timelineTemplate?: string | Function | any;
    milestoneTemplate?: string | Function | any;
    baselineTemplate?: string | Function | any;
    taskbarTemplate?: string | Function | any;
    editTemplate?: string | Function | any;
    labelSettings?: any;
    tooltipSettings?: any;
    filter?: any;
    filterTemplate?: string | Function | any;
    emptyRecordTemplate?: string | Function | any;
}
/**
 * `GanttComponent` represents the react Gantt.
 * ```tsx
 * <GanttComponent dataSource={data} allowSelection={true} allowSorting={true}/>
 * ```
 */
export class GanttComponent extends Gantt {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<GanttModel | DefaultHtmlAttributes| GanttTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = true;
    public directivekeys: { [key: string]: Object } = {'columns': 'column', 'addDialogFields': 'addDialogField', 'editDialogFields': 'editDialogField', 'dayWorkingTimeCollection': 'dayWorkingTime', 'weekWorkingTimes': 'weekWorkingTime', 'holidays': 'holiday', 'eventMarkers': 'eventMarker'};
    private statelessTemplateProps: string[] = null;
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<GanttModel | DefaultHtmlAttributes| GanttTypecast>;
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

applyMixins(GanttComponent, [ComponentBase, React.Component]);
