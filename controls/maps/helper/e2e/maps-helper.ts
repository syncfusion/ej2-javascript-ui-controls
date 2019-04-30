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
    // Get the maps container element.
    getMapsContainer() {
        return this.selector('#' + this.id);
    }
    // Get the maps title group element.
    getTitlegroupElement() {
        return this.selector('#' + this.id + '_Title_Group');
    }
    // Get the maps title element.
    getTitleElement() {
        return this.selector('#' + this.id + '_Map_title');
    }
    // Get the maps subtitle element.
    getSubTitleElement() {
        return this.selector('#' + this.id + '_Map_subtitle');
    }
    // Get the maps marker group element.
    getMarkerGroupElement() {
        return this.selector('#' + this.id + '_Markers_Group');
    }
    // Get the maps layer collection.
    getLayerCollectionElement() {
        return this.selector('#' + this.id + '_Layer_Collections');
    }
    // Get the maps layer index.
    getLayerIndexGroupElement() {
        return this.selector('#' + this.id + '_LayerIndex_0');
    }
    // Get the maps sublayer index. 
    getSubLayerGroupElement() {
        return this.selector('#' + this.id + '_LayerIndex_1');
    }
    // Get the maps secondary element.
    getSecondaryElement() {
        return this.selector('#' + this.id + '_Secondary_Element');
    }
    // Get the maps tooltip group element.
    getTooltipGroupElement() {
        return this.selector('#' + this.id + '_mapsTooltip_group');
    }
    // Get the maps legend group element.
    getLegendGroupElement() {
        return this.selector('#' + this.id + '_Legend_Group');
    }
    // Get the maps bubble group element.
    getbubbleGroupElement() {
        return this.selector('#' + this.id + '_LayerIndex_0_bubble_Group_0');
    }
    // Get the maps navigation group element.
    getnavigationLineGroupElement() {
        return this.selector('#' + this.id + '_LayerIndex_0_line_Group');
    }
    // Get the maps tile parent element.
    getTileElement() {
        return this.selector('#' + this.id + '_tile_parent');
    }
    // Get the maps annotation group element.
    getAnnotationElement() {
        return this.selector('#' + this.id + '_Annotations_Group');
    }
}
