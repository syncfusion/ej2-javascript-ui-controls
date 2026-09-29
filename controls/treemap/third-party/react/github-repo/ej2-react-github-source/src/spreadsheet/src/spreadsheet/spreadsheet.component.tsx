import * as React from 'react';
import { Spreadsheet, SpreadsheetModel } from '@syncfusion/ej2-spreadsheet';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface SpreadsheetTypecast {
    template?: string | Function | any;
}
/**
 * `SpreadsheetComponent` represents the react Spreadsheet.
 * ```ts
 * <SpreadsheetComponent />
 * ```
 */
export class SpreadsheetComponent extends Spreadsheet {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<SpreadsheetModel | DefaultHtmlAttributes| SpreadsheetTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = true;
    public directivekeys: { [key: string]: Object } = {'sheets': {'sheet': {'rows': {'row': {'cells': {'cell': {'images': 'image', 'charts': 'chart', 'richTexts': 'richText'}}}}, 'columns': 'column', 'ranges': 'range', 'conditionalFormats': 'conditionalFormat'}}, 'definedNames': 'definedName'};
    private statelessTemplateProps: string[] = null;
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<SpreadsheetModel | DefaultHtmlAttributes| SpreadsheetTypecast>;
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

applyMixins(SpreadsheetComponent, [ComponentBase, React.Component]);
