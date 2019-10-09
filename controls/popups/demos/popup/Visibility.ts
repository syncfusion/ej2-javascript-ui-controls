import {Popup} from '../../src/popup/popup';
import { Button } from '@syncfusion/ej2-buttons';
/**
 * position  popup sample
 */

let element: HTMLElement;
let targetX: HTMLElement;
let targetY: HTMLElement;
let targetContainer: HTMLElement;
let btn: Button;
let popup: Popup;

function updateElements() {
    element = <HTMLElement>document.querySelector('#popup');
    targetContainer = <HTMLElement>document.querySelector('#target');
    targetY = <HTMLElement>document.querySelector('#show');
    targetX = <HTMLElement>document.querySelector('#hide');
    popup = new Popup(element, {offsetX: 0, offsetY: 0, relateTo: targetContainer, position: {X: 'center', Y: 'center'},open:function(){
            console.log("Popup Opened.");
        },
        close:function(){
            console.log("Popup Closed.")
        }});
    popup.show();
    targetY.addEventListener('click', showEvent);
    targetX.addEventListener('click', showEvent);

}
updateElements();


function showEvent() {
    if(this.id=='hide')
        popup.hide();
    else
        popup.show();
}