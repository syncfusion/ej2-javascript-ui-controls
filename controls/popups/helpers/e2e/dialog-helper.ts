import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class DialogHelper extends TestHelper {
    
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
 * The method which returns Dialog control's root element.
 */
getDialog() {
    return this.selector('#' + this.id);
}

/**
 * The method which returns content container of the Dialog control.
 */
getContentElement() {
    return this.selector('#' + this.id + ' div.e-dlg-content');
}

/**
 * The method which returns header container of the Dialog control.
 */
getHeaderElement() {
    return this.selector('#' + this.id + ' div.e-dlg-header-content');
}

/**
 * The method which returns footer buttons of the Dialog control.
 */
getFooterButtons() {
    return this.selector('#' + this.id + ' div.e-footer-content .e-btn');
}

/**
 * The method which returns close icon's button of the Dialog control.
 */
getCloseButton() {
    return this.selector('#' + this.id + ' div.e-dlg-header-content .e-dlg-closeicon-btn');
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
 * The invoke method is used to access the public methods available in Dialog control.
 * @param fName - Specifies method name of the Dialog control. It must be string type.
 * @param args - Specifies arguments. This is optional.
 */
invoke(fName: string, args?: any[]) {
    this.invoke(fName, args);

}

}