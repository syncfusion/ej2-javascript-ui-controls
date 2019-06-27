import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class RichTextEditorHelper extends TestHelper {
    
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
 * The method which returns RichTextEditor's root element.
 */
getElement() {
    return this.selector('#' + this.id );
}

/**
 * The method which returns RichTextEditor's Quick Toolbar element.
 */
getQuickToolbarElement() {
    return this.selector(".e-rte-quick-popup");
}

/**
 * The method which returns RichTextEditor's toolbar element.
 */
getToolbar() {
    return this.selector('#' + this.id + "_toolbar");
}

/**
 * The method which returns RichTextEditor's character count element.
 */
getCharCount() {
    return this.selector(".e-rte-character-count");
}

/**
 * The method which returns insert table popup element.
 */
getTableDialog() {
    return this.selector('#' + this.id+ "_tabledialog");
}

/**
 * The method which returns insert image popup element.
 */
getImageDialog() {
    return this.selector('#' + this.id+ "_defaultRTE_image");
}

/**
 * The method which returns insert link popup element.
 */
getLinkDialog() {
    return this.selector('#' + this.id+ "_rtelink");
}

/**
 * The method which returns font name tool popup element.
 */
getFontNamePopup() {
    return this.selector('#' + this.id+ "_toolbar_FontName-popup");
}

/**
 * The method which returns font size tool popup element.
 */
getFontSizePopup() {
    return this.selector('#' + this.id+ "_toolbar_FontSize-popup");
}

/**
 * The method which returns font color picker popup element.
 */
getFontColorPopup() {
    return this.selector('#' + this.id+ "toolbar_FontColor-popup");
}

/**
 * The method which returns background color picker popup element.
 */
getBackgroundColorPopup() {
    return this.selector('#' + this.id+ "toolbar_BackgroundColor-popup");
}

/**
 * The method which returns Format tools popup element.
 */
getFormatPopup() {
    return this.selector('#' + this.id+ "toolbar_Formats-popup");
}

/**
 * The method which returns alignment tool popup element.
 */
getAlignmentPopup() {
    return this.selector('#' + this.id+ "toolbar_Alignments-popup");
}

/**
 * The getContent method which returns the edit panel element.
 */
getContent(){
    return this.selector(".e-rte-content");
}

/**
 * The getModel method is used to return value for a property.
 * @param property - Specifies name of the property. It must be string type.
 */
getModel(property: string) {
    this.getModel(property);
}

/**
 * The setModel method is used to set value for the property. It will accepts two arguments.
 * @param property - Specifices name of the property which value is to be updated.
 * @param value - Specifies corresponding value to the property.
 */
setModel(property: string, value: any) {
    this.setModel(property, value);
}

/**
 * The invoke method is used to access the public methods available in RichTextEditor control.
 * @param fName - Specifies method name of the RichTextEditor control. It must be string type.
 * @param args - Specifies arguments. This is optional.
 */
invoke(fName: string, args?: any[]) {
    this.invoke(fName, args);

}

}