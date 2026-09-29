import * as React from 'react';
import { TreeGrid, TreeGridModel } from '@syncfusion/ej2-treegrid';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface TreeGridTypecast {
    toolbarTemplate?: string | Function | any;
    pagerTemplate?: string | Function | any;
    rowTemplate?: string | Function | any;
    detailTemplate?: string | Function | any;
    editSettings?: any;
    emptyRecordTemplate?: string | Function | any;
    columnChooserSettings?: any;
}
/**
 * `TreeGridComponent` represents the react TreeGrid.
 * ```
 * <TreeGridComponent dataSource={data} allowPaging={true} allowSorting={true}/>
 * ```
 */
export class TreeGridComponent extends TreeGrid {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<TreeGridModel | DefaultHtmlAttributes| TreeGridTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = true;
    public directivekeys: { [key: string]: Object } = {'columns': {'column': {'stackedColumns': 'stackedColumn'}}, 'aggregates': {'aggregate': {'aggregateColumns': 'aggregateColumn'}}};
    private statelessTemplateProps: string[] = null;
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<TreeGridModel | DefaultHtmlAttributes| TreeGridTypecast>;
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

applyMixins(TreeGridComponent, [ComponentBase, React.Component]);
