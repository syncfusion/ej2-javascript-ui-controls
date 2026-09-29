import * as React from 'react';
import { Timeline, TimelineModel } from '@syncfusion/ej2-layouts';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface TimelineTypecast {
    template?: string | Function | any;
    content?: string | Function | any;
    oppositeContent?: string | Function | any;
}
/**
 * `TimelineComponent` represents the react Timeline Component.
 * ```ts
 * <TimelineComponent items={timelineItems} />
 * ```
 */
export class TimelineComponent extends Timeline {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<TimelineModel | DefaultHtmlAttributes| TimelineTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = false;
    public directivekeys: { [key: string]: Object } = {'items': 'item'};
    private statelessTemplateProps: string[] = null;
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<TimelineModel | DefaultHtmlAttributes| TimelineTypecast>;
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

applyMixins(TimelineComponent, [ComponentBase, React.Component]);
