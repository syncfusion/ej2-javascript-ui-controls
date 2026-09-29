import * as React from 'react';
import { MultiColumnComboBox, MultiColumnComboBoxModel } from '@syncfusion/ej2-multicolumn-combobox';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface MultiColumnComboBoxTypecast {
    footerTemplate?: string | Function | any;
    itemTemplate?: string | Function | any;
    groupTemplate?: string | Function | any;
}
/**
 * Represents the React MultiColumnComboBox Component
 * ```tsx
 * <MultiColumnComboBoxComponent dataSource={data}></MultiColumnComboBoxComponent>
 * ```
 */
export class MultiColumnComboBoxComponent extends MultiColumnComboBox {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<MultiColumnComboBoxModel | DefaultHtmlAttributes| MultiColumnComboBoxTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = true;
    public directivekeys: { [key: string]: Object } = {'columns': 'column'};
    private statelessTemplateProps: string[] = null;
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<MultiColumnComboBoxModel | DefaultHtmlAttributes| MultiColumnComboBoxTypecast>;
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
            return React.createElement((React as any).Fragment, null,[].concat(React.createElement("input", this.getDefaultAttributes()),this.portals));
        }

    }
}

applyMixins(MultiColumnComboBoxComponent, [ComponentBase, React.Component]);
