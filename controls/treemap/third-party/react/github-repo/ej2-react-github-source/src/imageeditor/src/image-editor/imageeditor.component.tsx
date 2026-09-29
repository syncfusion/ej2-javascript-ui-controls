import * as React from 'react';
import { ImageEditor, ImageEditorModel } from '@syncfusion/ej2-image-editor';
import { ComponentBase, applyMixins, DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';


export interface ImageEditorTypecast {
    toolbarTemplate?: string | Function | any;
}
/**
 * Represents the React ImageEditor Component
 * ```html
 * <ImageEditorComponent></ImageEditorComponent>
 * ```
 */
export class ImageEditorComponent extends ImageEditor {
    public state: Readonly<{ children?: React.ReactNode | React.ReactNode[] }> 
    & Readonly<ImageEditorModel | DefaultHtmlAttributes| ImageEditorTypecast>;
    public setState: any;
    private getDefaultAttributes: Function;
    public initRenderCalled: boolean = false;
    private checkInjectedModules: boolean = false;
    private statelessTemplateProps: string[] = null;
    private templateProps: string[] = null;
    private immediateRender: boolean = false;
    private isReactMock: boolean = true;
    public props: Readonly<{ children?: React.ReactNode | React.ReactNode[] }>
     & Readonly<ImageEditorModel | DefaultHtmlAttributes| ImageEditorTypecast>;
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

applyMixins(ImageEditorComponent, [ComponentBase, React.Component]);
