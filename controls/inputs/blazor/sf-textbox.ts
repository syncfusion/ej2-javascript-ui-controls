// tslint:disable
let TextBox: object = {
    focusIn(element: HTMLElement): void {
        element.focus();
    },
    focusOut(element: HTMLElement): void {
        element.blur();
    }
}
export default TextBox;