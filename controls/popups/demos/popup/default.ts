import {Popup} from '../../src/popup/popup';

let element:HTMLElement, target:HTMLElement, targetContainer:HTMLElement,popup:Popup;
function updateElements() {
    element=getElements('#popup')[0];
    target=getElements('#target')[0];
    popup =new Popup(element,{offsetX: 0, offsetY:200, relateTo:target, position:{X:'left',Y:'bottom'}});
    popup.show();
        target.addEventListener('click', function () {
        if(popup.element.classList.contains("e-popup-close")) {
            popup.show();
            target.innerText = 'Hide Popup';
        }else {
            popup.hide();
            target.innerText = 'Show Popup';
        }
    });
}

updateElements();

    function getElements(args:string):Array<HTMLElement>{
    let nodes=document.body.querySelectorAll(args),TempElements=[];
    for(let index=0;index<nodes.length;index++){
        TempElements.push(<HTMLElement>nodes.item(index));
    }
    return TempElements;
}