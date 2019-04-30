import {Popup} from '../../src/popup/popup';
import { Button } from '@syncfusion/ej2-buttons';
import {Animation} from '@syncfusion/ej2-base';

/**
 * position  popup sample
 */

let element: HTMLElement;
let targetX: HTMLElement;
let targetY: HTMLElement;
let targetContainer: HTMLElement;
let btn: Button;
let popup: Popup;
let animation: Animation = new Animation({ duration: 5000 });

function updateElements() {
    element = <HTMLElement>document.querySelector('#popup');
    targetContainer = <HTMLElement>document.querySelector('#target');
    targetY = <HTMLElement>document.querySelector('#show');
    targetX = <HTMLElement>document.querySelector('#hide');
    popup = new Popup(element, {offsetX: 0, offsetY: 0, relateTo: targetContainer, position: {X: 'center', Y: 'center'}});
    popup.show();
    targetY.addEventListener('click', showEvent);
    targetX.addEventListener('click', showEvent);

}
updateElements();


function showEvent() {
    if(this.id=='hide')
    {
        animation.setProperties({name:'FadeOut'});
        popup.hide(animation);
    }
    else{
        animation.setProperties({name:'FadeIn'});
        popup.show(animation);
    }
        
}