import { Maps, PolygonSettingModel } from '../../index';
import { Coordinate, LayerSettings} from '../index';
import { PathOption, calculatePolygonPath, maintainSelection } from '../utils/helper';
/**
 * When injected, this module will be used to render polygon shapes over the Maps.
 */
export class Polygon {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    /* eslint-disable @typescript-eslint/no-empty-function */
    constructor(maps: Maps) {
    }
    /* eslint-enable @typescript-eslint/no-unused-vars */
    /* eslint-enable @typescript-eslint/no-empty-function */
    /**
     * To render polygon for maps.
     *
     * @param {Maps} maps - Specifies the layer instance to which the polygon is to be rendered.
     * @param {number} layerIndex -Specifies the index of current layer.
     * @param {number} factor - Specifies the current zoom factor of the Maps.
     * @returns {Element} - Returns the polygon element.
     * @private
     */
    public polygonRender(maps: Maps, layerIndex: number, factor: number): Element {
        const currentLayer: LayerSettings = <LayerSettings>maps.layersCollection[layerIndex as number];
        const polygonsSVGObject: Element = maps.renderer.createGroup({
            id: maps.element.id + '_LayerIndex_' + layerIndex + '_Polygons_Group'
        });
        currentLayer.polygonSettings.polygons.map((polygonSetting: PolygonSettingModel, polygonIndex: number) => {
            const polygonSVGObject: Element = maps.renderer.createGroup({
                id: maps.element.id + '_LayerIndex_' + layerIndex + '_Polygons_Group_' + polygonIndex
            });
            const polygonData: Coordinate[] = polygonSetting.points;
            const path: string = calculatePolygonPath(maps, factor, currentLayer, polygonData);
            const pathOptions: PathOption = new PathOption(
                maps.element.id + '_LayerIndex_' + layerIndex + '_PolygonIndex_' + polygonIndex,
                polygonSetting.fill, (polygonSetting.borderWidth / factor), polygonSetting.borderColor,
                polygonSetting.opacity, polygonSetting.borderOpacity, '', path);
            const polygonEle: Element = maps.renderer.drawPath(pathOptions) as SVGPathElement;
            maintainSelection(maps.selectedPolygonElementId, maps.polygonSelectionClass, polygonEle,
                              'PolygonselectionMapStyle');
            polygonSVGObject.appendChild(polygonEle);
            polygonsSVGObject.appendChild(polygonSVGObject);
        });
        return polygonsSVGObject;
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name
     */
    protected getModuleName(): string {
        return 'Polygon';
    }

    /**
     * To destroy the layers.
     *
     * @returns {void}
     * @private
     */
    //eslint-disable-next-line @typescript-eslint/no-empty-function
    public destroy(): void {
    }
}
