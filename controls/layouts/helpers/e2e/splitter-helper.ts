import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class SplitterHelper extends TestHelper {
    
public id: string;
public wrapperFn: Function;
constructor(id:string, wrapperFn:Function) {
    super();
    this.id = id;
    if(wrapperFn!==undefined){
        this.wrapperFn = wrapperFn
    }
    return this;
}

/**
 * The method which returns Splitter's root element.
 */
getElement() {
    return this.selector('#' + this.id + ".e-splitter");
}

/**
 * The method which returns Splitter's all pane elements.
 */
getPaneElement() {
    let element: HTMLElement = this.selector('#' + this.id + ".e-splitter");
    let pane: any = [];
    return pane.filter.call(
        element.children, (ele: any) => pane.includes.call(ele.classList, 'e-pane')
    )
}

/**
 * The method which returns Splitter's separator (split-bar) elements.
 */
getSplitBar() {
    let element: HTMLElement = this.selector('#' + this.id + ".e-splitter");
    let split: any = [];
    return split.filter.call(
        element.children, (ele: any) => split.includes.call(ele.classList, 'e-split-bar')
    )
}

/**
 * The getModel method is used to return value of the property.
 * @param property - Specifies name of the property. It must be string type.
 */
getModel(property: string) {
    this.getModel(property);
}

/**
 * The setModel method is used to set value for the property. It will accepts two arguments.
 * @param property - Specifices name of the property which value is to be updated.
 * @param value - Specifies corresponding value of the property.
 */
setModel(property: string, value: any) {
    this.setModel(property, value);
}

/**
 * The invoke method is used to set value for the property. It will accepts two arguments.
 * @param property - Specifices name of the property which value is to be updated.
 * @param value - Specifies corresponding value of the property.
 */
invoke(fName: string, args?: any[]) {
    this.invoke(fName, args);

}

}