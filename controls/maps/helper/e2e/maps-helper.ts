import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class MapsHelper extends TestHelper {
    public id: string;
    public wrapperFn: Function;
    constructor(id: string, wrapperFn: Function) {
        super();
        this.id = id;
        if (wrapperFn !== undefined) {
            this.wrapperFn = wrapperFn
        }
        return this;
    }
    getMapsContainer() {
        return this.selector('#' + this.id);
    }
    getTitlegroupElement() {
        return this.selector('#' + this.id + '_Title_Group');
    }
    getTitleElement() {
        return this.selector('#' + this.id + '_Map_title');
    }
    getSubTitleElement() {
        return this.selector('#' + this.id + '_Map_subtitle');
    }
    getMarkerGroupElement() {
        return this.selector('#' + this.id + '_Markers_Group');
    }
    getLayerCollectionElement() {
        return this.selector('#' + this.id + '_Layer_Collections');
    }
    getLayerIndexGroupElement() {
        return this.selector('#' + this.id + '_LayerIndex_0');
    }
    getSubLayerGroupElement() {
        return this.selector('#' + this.id + '_LayerIndex_1');
    }
    getSecondaryElement() {
        return this.selector('#' + this.id + '_Secondary_Element');
    }
    getTooltipGroupElement() {
        return this.selector('#' + this.id + '_mapsTooltip_group');
    }
    getLegendGroupElement() {
        return this.selector('#' + this.id + '_Legend_Group');
    }
    getbubbleGroupElement() {
        return this.selector('#' + this.id + '_LayerIndex_0_bubble_Group_0');
    }
    getnavigationLineGroupElement() {
        return this.selector('#' + this.id + '_LayerIndex_0_line_Group');
    }
    getTileElement() {
        return this.selector('#' + this.id + '_tile_parent');
    }
    getAnnotationElement() {
        return this.selector('#' + this.id + '_Annotations_Group');
    }
}
