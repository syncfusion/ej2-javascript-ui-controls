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
    getTreeMapContainer() {
        return this.selector('#' + this.id);
    }
    getTitlegroupElement() {
        return this.selector('#' + this.id + 'Title_Group');
    }
    getSquarifiedLayoutElement() {
        return this.selector('#' + this.id + '_TreeMap_Squarified_Layout');
    }
    getSliceAndDiceHorizontalLayoutElement() {
        return this.selector('#' + this.id + '_TreeMap_SliceAndDiceHorizontal_Layout');
    }
    getSliceAndDiceVerticaLayoutElement() {
        return this.selector('#' + this.id + '_TreeMap_SliceAndDiceVertical_Layout');
    }
    getSliceAndDiceAutoLayoutElement() {
        return this.selector('#' + this.id + '_TreeMap_SliceAndDiceAuto_Layout');
    }
    getLegendGroupElement() {
        return this.selector('#' + this.id + '_Legend_Group');
    }
    getLevelGroupElement() {
        return this.selector('#' + this.id + '_Level_Index_0_Item_Index_0_Group');
    }
    getLevelTextGroupElement() {
        return this.selector('#' + this.id + '_Level_Index_0_Item_Index_0_Text');
    }
    
}
