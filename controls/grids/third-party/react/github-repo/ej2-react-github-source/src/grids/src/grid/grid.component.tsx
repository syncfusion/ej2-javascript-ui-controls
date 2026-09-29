import * as React from 'react';
import { Grid, GridModel } from '@syncfusion/ej2-grids';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface GridTypecast {
    rowTemplate?: string | Function | any;
    emptyRecordTemplate?: string | Function | any;
    detailTemplate?: string | Function | any;
    toolbarTemplate?: string | Function | any;
    pagerTemplate?: string | Function | any;
    editSettings?: any;
    groupSettings?: any;
    columnChooserSettings?: any;
}
/**
 * `GridComponent` represents the react Grid.
 * ```tsx
 * <GridComponent dataSource={data} allowPaging={true} allowSorting={true}/>
 * ```
 */
export class GridComponent extends Grid {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<GridModel | DefaultHtmlAttributes| GridTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = true;
    public directivekeys: { [key: string]: Object } = {'columns': {'column': {'stackedColumns': 'stackedColumn'}}, 'aggregates': {'aggregate': {'aggregateColumns': 'aggregateColumn'}}};
    private statelessTemplateProps: string[] = null;
    private templateProps: string[] = ["template","headerTemplate","commandsTemplate","filter.itemTemplate","editTemplate","filterTemplate","columnChooserSettings.headerTemplate","columnChooserSettings.template","columnChooserSettings.footerTemplate"];
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<GridModel | DefaultHtmlAttributes| GridTypecast>;
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

applyMixins(GridComponent, [ComponentBase, React.Component]);
