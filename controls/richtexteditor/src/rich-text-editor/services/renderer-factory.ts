import { isNullOrUndefined, getEnumValue } from '@syncfusion/ej2-base';
import { IRenderer } from '../base/interface';
import { RenderType } from '../base/enum';


/**
 * RendererFactory
 * 
 * @hidden
 * @deprecated
 */
export class RendererFactory {

    public rendererMap: { [c: string]: IRenderer } = {};

    /**
     * addRenderer method
     *
     * @param {RenderType} name - specifies the render type
     * @param {IRenderer} type - specifies the renderer.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public addRenderer(name: RenderType, type: IRenderer): void {
        const rName: string = <string>getEnumValue(RenderType, <RenderType>name);

        if (isNullOrUndefined(this.rendererMap[rName])) {
            this.rendererMap[rName] = type;
        }
    }

    /**
     * getRenderer method
     *
     * @param {RenderType} name - specifies the render type
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getRenderer(name: RenderType): IRenderer {
        const rName: string = <string>getEnumValue(RenderType, <RenderType>name);

        if (isNullOrUndefined(this.rendererMap[rName])) {
            // eslint-disable-next-line
            throw `The renderer ${rName} is not found`;
        } else {
            return this.rendererMap[rName];
        }
    }
}