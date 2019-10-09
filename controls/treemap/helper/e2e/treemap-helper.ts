import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class TreeMapHelper extends TestHelper {
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
    // Get the treemap container id.
    getTreeMapContainer() {
        return this.selector('#' + this.id);
    }
    // Get the treemap title group element.
    getTitlegroupElement() {
        return this.selector('#' + this.id + 'Title_Group');
    }
    // Get the treemap Squarified layout id.
    getSquarifiedLayoutElement() {
        return this.selector('#' + this.id + '_TreeMap_Squarified_Layout');
    }
    // Get the treemap SliceAndDiceHorizontal layout id.
    getSliceAndDiceHorizontalLayoutElement() {
        return this.selector('#' + this.id + '_TreeMap_SliceAndDiceHorizontal_Layout');
    }
    // Get the treemap SliceAndDiceVertical layout id.
    getSliceAndDiceVerticaLayoutElement() {
        return this.selector('#' + this.id + '_TreeMap_SliceAndDiceVertical_Layout');
    }
    // Get the treemap SliceAndDiceAuto layout id.
    getSliceAndDiceAutoLayoutElement() {
        return this.selector('#' + this.id + '_TreeMap_SliceAndDiceAuto_Layout');
    }
    // Get the treemap Legend group.
    getLegendGroupElement() {
        return this.selector('#' + this.id + '_Legend_Group');
    }
    // Get the treemap Level group id.
    getLevelGroupElement() {
        return this.selector('#' + this.id + '_Level_Index_0_Item_Index_0_Group');
    }
    // Get the levels Text element.
    getLevelTextGroupElement() {
        return this.selector('#' + this.id + '_Level_Index_0_Item_Index_0_Text');
    }
    
}
