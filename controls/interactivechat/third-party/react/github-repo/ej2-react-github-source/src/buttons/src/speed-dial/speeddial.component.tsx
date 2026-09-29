import * as React from 'react';
import { SpeedDial, SpeedDialModel } from '@syncfusion/ej2-buttons';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface SpeedDialTypecast {
    itemTemplate?: string | Function | any;
    popupTemplate?: string | Function | any;
}
/**
 * `SpeedDialComponent` represents the react SpeedDial Component.
 * ```ts
 * <SpeedDialComponent content='Edit'></SpeedDialComponent>
 * ```
 */
export class SpeedDialComponent extends SpeedDial {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<SpeedDialModel | DefaultHtmlAttributes| SpeedDialTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = false;
    public directivekeys: { [key: string]: Object } = {'speedDialItems': 'speedDialItem'};
    private statelessTemplateProps: string[] = null;
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<SpeedDialModel | DefaultHtmlAttributes| SpeedDialTypecast>;
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
            return React.createElement('button', this.getDefaultAttributes(),[].concat(this.props.children,this.portals));
        }

    }
}

applyMixins(SpeedDialComponent, [ComponentBase, React.Component]);
