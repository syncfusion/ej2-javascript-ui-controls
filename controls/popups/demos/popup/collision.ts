import { flip} from '../../src/common/collision';
import {Popup} from '../../src/popup/popup';
import { AnimationModel } from '@syncfusion/ej2-base';

let popup:Popup = new Popup(<HTMLElement>getElem("#popup"), {offsetX: 0, offsetY: 0, relateTo: <HTMLElement>getElem("#targetElement"), position: {X: 'left', Y: 'top'}});

let viewportTarget = <HTMLElement>document.querySelector('#viewport1');

 document.onreadystatechange = () => {
    document.getElementById("apply").addEventListener("click",function(e){
        var elem:HTMLElement=<HTMLElement>getElem("#targetElement");
        elem.style.top = (<HTMLInputElement>getElem("#tposY")).value+"px";
        elem.style.left = (<HTMLInputElement>getElem("#tposX")).value+"px";
    });
    document.getElementById("set").addEventListener("click",function(e){
        var elem:HTMLElement=<HTMLElement>getElem("#popup");
        elem.style.height=(<HTMLInputElement>getElem("#poph")).value;
        elem.style.width=(<HTMLInputElement>getElem("#popw")).value;
        popup.setProperties(
            {offsetX:parseInt((<HTMLInputElement>getElem("#offx")).value),
            offsetY:parseInt((<HTMLInputElement>getElem("#offy")).value),
            position:{X: (<HTMLInputElement>getElem("#locx")).value, Y: (<HTMLInputElement>getElem("#locy")).value}
        })
        popup.refresh();    
        if((<HTMLSelectElement>viewportTarget).value=="Container"){
            flip(<HTMLElement>elem,
             <HTMLElement>getElem("#targetElement"), 
            parseInt((<HTMLInputElement>getElem("#offx")).value), 
            parseInt((<HTMLInputElement>getElem("#offy")).value),
             (<HTMLInputElement>getElem("#locx")).value,
             (<HTMLInputElement>getElem("#locy")).value,
             (<HTMLInputElement>getElem("#viewport")));
        }
        else{
            popup.show();
        }

        
            });
    document.getElementById("set_height").addEventListener("click",function(e){
        var elem:HTMLElement=<HTMLElement>getElem("#popup");
        elem.style.height=(<HTMLInputElement>getElem("#poph")).value+"px";
        elem.style.width=(<HTMLInputElement>getElem("#popw")).value+"px";
            });
 }
    
    


 function appendTarget(styleContent: string) {
    var elem: HTMLDivElement = document.createElement("div");
    elem.innerHTML = '<div id="targetElement" style="height: 30px;width: 100px;border-color: green;' + styleContent + ';border-style: solid;border-width: 1px;padding: 30px;">Am a target</div>'
    document.body.appendChild(elem.firstChild);
}
function getPop(popupContent: string) {
    var elem: HTMLDivElement = document.createElement("div"), elemP: Node;
    elem.innerHTML = "<div class='popup' style='position: absolute;height: 25px;width: 75px;border-color: #1b98a0;border-style: solid;border-width: 1px;padding: 30px;'></div>";
    (<HTMLElement>elem.firstChild).innerText = popupContent;
    elemP = elem.firstChild
    document.body.appendChild(elemP);
    return elemP;
}
function getElem(selector: string): Element {
    return document.querySelector(selector);
}