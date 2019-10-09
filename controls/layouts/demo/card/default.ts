/**
 *  Card default Sample
 */
import { Touch, SwipeEventArgs, ScrollEventArgs, detach } from '@syncfusion/ej2-base';


let ele: HTMLElement = document.getElementById('multi_task');
let dir: String;
new Touch(ele, { swipe: touchSwipeHandler, scroll: touchScrollHandler });

function touchSwipeHandler(e: SwipeEventArgs): void {
    let ele: HTMLElement = <HTMLElement>e.originalEvent.target;
    if (!ele.classList.contains('e-card')) {
        return;
    }
    if (Math.abs(e.distanceX) >= 200) {
        detach(ele);
    }
    ele.style.removeProperty('left');
    multiTask();
}
function touchScrollHandler(e: ScrollEventArgs): void {
    let ele: HTMLElement = <HTMLElement>e.originalEvent.target;
    let leftVal: number = Math.abs(parseInt(ele.style.left, 10));
    if (!ele.classList.contains('e-card')) {
        return;
    }
    if (isNaN(leftVal) || dir !== e.scrollDirection) {
        leftVal = 0;
    }
    if (e.scrollDirection === 'Down') {
        let index: number = [].slice.call(ele.parentElement.children).indexOf(ele);
        let len: number = ele.parentElement.childElementCount;
        let el: HTMLElement;
        for (let i: number = index + 1; i < len; i++) {
            el = (<HTMLElement>ele.parentElement.children[i]);
            el.style.top = (parseInt(el.style.top) + e.distanceY) + "px";
        }
    } else {
        e.scrollDirection === 'Left' ? ele.style.left = - (leftVal + e.distanceX) + "px" : ele.style.left = (leftVal + e.distanceX) + "px";
    }
    dir = e.scrollDirection;
}
function multiTask() {
    let root: HTMLElement = document.getElementById("multi_task");
    let activeEle: HTMLElement = root.querySelector('.e-card-active');
    if (activeEle) {
        activeEle.classList.remove('e-card-active');
    }
    let multiTask_Ele: NodeList = document.querySelectorAll('#multi_task .e-card');
    let topRatio: number = 30;
    let len: number = multiTask_Ele.length;
    let temp: number = topRatio;
    for (let i = 0; i < len; i++) {
        (<HTMLElement>multiTask_Ele[i]).style.top = temp + 'px';
        temp += topRatio;
    }
    root.classList.add('e-multi-task');
}

document.getElementById('multiTaskBtn').onclick = () => {
    multiTask();
};
document.getElementById('multi_task').onclick = (e) => {
    let ele: HTMLElement = <HTMLElement>e.target;
    if (!ele.classList.contains('e-card')) {
        return;
    }
    ele.classList.add('e-card-active');
    destroyMultiTask();
};
document.getElementById('singleTaskBtn').onclick = (e: MouseEvent) => {
    destroyMultiTask();
};
document.getElementById('formFlipStructure').onclick = (e: MouseEvent): void => {
    formFlipStructure();
};
document.getElementById('flipStructure').onclick = (e: MouseEvent) => {
    let ele: HTMLElement = <HTMLElement>e.target;
    let parentElement: HTMLElement = <HTMLElement>e.currentTarget;
    let el: HTMLElement = parentElement.querySelector('card-out');
    if (el) {
     el.classList.remove('card-out'); }
    if (!ele.classList.contains('e-card')) {
        return; }
    ele.classList.add('card-out');
    parentElement.insertBefore (ele, parentElement.children[parentElement.childElementCount]);
    [].slice.call(parentElement.children).forEach((ele: HTMLElement) => {
     ele.removeAttribute('style');
    });
    formFlipStructure();

};

function formFlipStructure() {
    let fanStructute_card = document.querySelectorAll('#flipStructure .e-card');
    let len = fanStructute_card.length;
    let transformRatio = 8;
    let temp;
    let divide = (parseInt((len / 2).toString(), 10));
    temp = transformRatio;
    for (var i = divide - 1; i >= 0; i--) {
        (<HTMLElement>fanStructute_card[i]).style.transform = 'rotate(' + (temp) + 'deg)';
        temp += transformRatio;
    }
    transformRatio = 8;
    temp = transformRatio;
    for (var i = divide + 1; i < len; i++) {
        (<HTMLElement>fanStructute_card[i]).style.transform = 'rotate(' + (-temp) + 'deg)';
        temp += transformRatio;
    }
}
function destroyMultiTask() {
    let root: HTMLElement = document.getElementById("multi_task");
    root.classList.remove('e-multi-task');
    let multiTask_Ele: NodeList = document.querySelectorAll('#multi_task .e-card');
    let len: number = multiTask_Ele.length;
    for (let i = 0; i < len; i++) {
        (<HTMLElement>multiTask_Ele[i]).style.removeProperty('top');
    }
}