import * as React from 'react';
import { SymbolPalette, SymbolPaletteModel } from '@syncfusion/ej2-diagrams';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface SymbolPaletteTypecast {
    nodeTemplate?: string | Function | any;
}
/**
 * Represents react SymbolPalette Component
 * ```ts
 * <SymbolPaletteComponent></SymbolPaletteComponent>
 * ```
 */
export class SymbolPaletteComponent extends SymbolPalette {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<SymbolPaletteModel | DefaultHtmlAttributes| SymbolPaletteTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = true;
    public directivekeys: { [key: string]: Object } = {'palettes': 'palette'};
    private statelessTemplateProps: string[] = null;
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<SymbolPaletteModel | DefaultHtmlAttributes| SymbolPaletteTypecast>;
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

applyMixins(SymbolPaletteComponent, [ComponentBase, React.Component]);
