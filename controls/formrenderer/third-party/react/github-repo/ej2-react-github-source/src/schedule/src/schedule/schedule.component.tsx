import * as React from 'react';
import { Schedule, ScheduleModel } from '@syncfusion/ej2-schedule';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface ScheduleTypecast {
    dateHeaderTemplate?: string | Function | any;
    dateRangeTemplate?: string | Function | any;
    dayHeaderTemplate?: string | Function | any;
    cellTemplate?: string | Function | any;
    cellHeaderTemplate?: string | Function | any;
    eventSettings?: any;
    editorTemplate?: string | Function | any;
    editorHeaderTemplate?: string | Function | any;
    editorFooterTemplate?: string | Function | any;
    monthHeaderTemplate?: string | Function | any;
    timeScale?: any;
    resourceHeaderTemplate?: string | Function | any;
    headerIndentTemplate?: string | Function | any;
    quickInfoTemplates?: any;
    group?: any;
}
/**
 * `ScheduleComponent` represents the react Schedule.
 * ```ts
 * <ScheduleComponent/>
 * ```
 */
export class ScheduleComponent extends Schedule {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<ScheduleModel | DefaultHtmlAttributes| ScheduleTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = true;
    public directivekeys: { [key: string]: Object } = {'views': 'view', 'resources': 'resource', 'headerRows': 'headerRow', 'toolbarItems': 'toolbarItem'};
    private statelessTemplateProps: string[] = null;
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<ScheduleModel | DefaultHtmlAttributes| ScheduleTypecast>;
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

applyMixins(ScheduleComponent, [ComponentBase, React.Component]);
