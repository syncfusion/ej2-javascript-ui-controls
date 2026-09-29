import { ComplexBase } from '@syncfusion/ej2-react-base';
import { ButtonPropsModel } from '@syncfusion/ej2-popups';


/**
 * `ButtonDirective` represent a button of the react dialog. 
 * It must be contained in a Dialog component(`DialogComponent`). 
 * ```tsx
 * <DialogComponent showCloseIcon={true}> 
 *   <ButtonsDirective>
 *     <DialogbuttonDirective buttonModal={this.okButton}></DialogbuttonDirective>
 *     <DialogbuttonDirective buttonModal={this.cancelButton}></DialogbuttonDirective>
 *   <ButtonsDirective>
 * </DialogComponent>
 * ```
 */
export class DialogButtonDirective extends ComplexBase<ButtonPropsModel & { children?: React.ReactNode }, ButtonPropsModel> {
    public static moduleName: string = 'dialogButton';
}

export class ButtonsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'buttons';
    public static moduleName: string = 'buttons';
}
