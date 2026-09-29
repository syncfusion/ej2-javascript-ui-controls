import * as React from 'react';
import { Diagram, DiagramModel } from '@syncfusion/ej2-diagrams';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface DiagramTypecast {
    annotationTemplate?: string | Function | any;
    nodeTemplate?: string | Function | any;
    fixedUserHandleTemplate?: string | Function | any;
    userHandleTemplate?: string | Function | any;
}
/**
 * Represents react Diagram Component
 * ```ts
 * <DiagramComponent></DiagramComponent>
 * ```
 */
export class DiagramComponent extends Diagram {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<DiagramModel | DefaultHtmlAttributes| DiagramTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = true;
    public directivekeys: { [key: string]: Object } = {'layers': 'layer', 'customCursors': 'customCursor', 'connectors': {'connector': {'connectorFixedUserHandles': 'connectorFixedUserHandle', 'connectorAnnotations': 'connectorAnnotation'}}, 'nodes': {'node': {'nodeFixedUserHandles': 'nodeFixedUserHandle', 'nodeAnnotations': 'nodeAnnotation', 'ports': 'port'}}};
    private statelessTemplateProps: string[] = null;
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<DiagramModel | DefaultHtmlAttributes| DiagramTypecast>;
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

applyMixins(DiagramComponent, [ComponentBase, React.Component]);
