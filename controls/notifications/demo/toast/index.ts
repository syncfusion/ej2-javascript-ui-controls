import { Toast, PositionX, PositionY, ButtonModelProps, ToastClickEventArgs } from '../../src/toast/toast';
import { ToastBeforeOpenArgs, ToastCloseArgs, ToastOpenArgs } from '../../src/toast/toast';
import { isNullOrUndefined as isNOU, Effect } from '@syncfusion/ej2-base';

let dynamciToastFlag: number = 0
let toast: Toast = new Toast(
  {
    title: 'Sample Toast Title',
    content: 'Notification Explorer',
    beforeOpen: toastBeforeOpenFn,
    open: toastOpenFn,
    close: toastCloseFn,
    position: {
      X: 'Right',
      Y: 'Top'
    },
  }
);
toast.appendTo('#flex-container');

let Title: string[] = ["News", null, "Amazon", "Sample Toast Title"]

let Content: string[] = [
  "What a Game!!!! The Cubs Outlashed the indians in extra innings to win this first World Series since 1908",
  "Welcome to my sample Website.How can i help you???",
  "The galaxy is coming home to you!! Star Wars: The Forces Awakens Blu-Ray has shipped and will arrive Mon, Sep 26",
  "Notification Explorer"
]

function toastClickFn(e: ToastClickEventArgs): void {
  e.cancel = true;
  e.clickToClose = true;
}

function toastBeforeOpenFn(e: ToastBeforeOpenArgs): void {
}

function toastOpenFn(e: ToastOpenArgs): void {
}

function toastCloseFn(e: ToastCloseArgs): void {
}


function btnClick(e: Event) {
  console.log((<HTMLButtonElement>e.target).textContent + ' button clicked');
}

function btnClick1(e: Event) {
  console.log((<HTMLButtonElement>e.target).textContent + ' button clicked');
}

document.getElementById('hideToast').onclick = (e: Event) => {
  toast.hide();
};

document.getElementById('template_con').onchange = (e: Event) => {
  if((<HTMLInputElement>e.target).checked) {
    document.body.classList.add('e-template');
    (<HTMLTextAreaElement>document.getElementById('toast_template')).value = '#templateEle'; }
}

document.getElementById('editable_con').onchange = (e: Event) => {
  if((<HTMLInputElement>e.target).checked) {
    document.body.classList.remove('e-template');
    (<HTMLTextAreaElement>document.getElementById('toast_template')).value = '';
  }
}

document.getElementById('btn_boot').onclick = (e : Event) => {
  document.getElementsByTagName('link')[0].href = '../../styles/bootstrap.css';
};
document.getElementById('btn_fabric').onclick = (e : Event) => {
  document.getElementsByTagName('link')[0].href = '../../styles/fabric.css';
};
document.getElementById('btn_hContract').onclick = (e : Event) => {
  document.getElementsByTagName('link')[0].href = '../../styles/highcontrast.css';
};
document.getElementById('btn_material').onclick = (e : Event) => {
  document.getElementsByTagName('link')[0].href = '../../styles/material.css';
};

document.getElementById('toastRTL').onchange = (e: Event) => {
  toast.enableRtl =  (<HTMLInputElement>e.target).checked;
};

document.getElementById('hideToastAll').onclick = (e: Event) => {
  toast.hide('All');
};

document.getElementById('timeOutUpdate').onclick = (e: Event) => {
  toast.timeOut = parseInt((<HTMLInputElement>document.getElementById('timeOut')).value);
  toast.extendedTimeout = parseInt((<HTMLInputElement>document.getElementById('extendedTimeOut')).value);
};

document.getElementById('showToast').onclick = (e: Event) => {
  let title: string = (<HTMLInputElement>document.getElementById('title')).value;
  let width: string = (<HTMLInputElement>document.getElementById('widthProp')).value;
  let height: string = (<HTMLInputElement>document.getElementById('heightProp')).value;
  let content: string = (<HTMLInputElement>document.getElementById('message')).value;
  let template: string = (<HTMLInputElement>document.getElementById('toast_template')).value;
  let timeOut: string = (<HTMLInputElement>document.getElementById('timeOut')).value;
  let extimeout: string = (<HTMLInputElement>document.getElementById('extendedTimeOut')).value;
  let btnCount: number = parseInt((<HTMLInputElement>document.getElementById('ActionBtn')).value);
  setWidthHeight (width, height);
  setButtons(btnCount, (<HTMLInputElement>document.getElementById('btnClickEvent')).checked);
  !isNOU(title) ? toast.title = title : toast.title = 'Sample Title';
  !isNOU(content) ? toast.content = content : toast.content = 'Sample Content';
  !isNOU(timeOut) ? toast.timeOut = parseInt(timeOut) : toast.timeOut = 5000;
  !isNOU(extimeout) ? toast.extendedTimeout = parseInt(extimeout) : toast.extendedTimeout = 5000;
  !isNOU(template) ? toast.template = template : toast.template = null;
  toast.newestOnTop = (<HTMLInputElement>document.getElementById('newestOnTop')).checked;
  toast.showProgressBar = (<HTMLInputElement>document.getElementById('progressBar')).checked;
  toast.showCloseButton = (<HTMLInputElement>document.getElementById('closeButton')).checked;
  let icon: boolean = (<HTMLInputElement>document.getElementById('toastIcon')).checked;
  toast.show( { icon: icon ? 'e-info': null });
  (<HTMLInputElement>document.getElementById('widthProp')).value = toast.width.toString();
  (<HTMLInputElement>document.getElementById('heightProp')).value = toast.height.toString();
};

function setWidthHeight (width: string, height: string) {
 if (!isNOU(width) && width !== '') {
   toast.width = width; }
  if (!isNOU(height) && height !== '') {
   toast.height = height; }
}

function setButtons(count: number, clickEvent: boolean): void {
  if (count > 0) {
    let button: any;
    for (let i: number = 0; i < count; i++) {
      button = {
        model: { content: 'btn' + i },
        click: clickEvent ? clickEventFun : null,
      }
      toast.buttons[i] = button;
    }
  } else {
    toast.buttons = [];
  }
}

document.getElementById('positionX').onchange = (e: Event) => {
  let target: string = (<HTMLInputElement>e.target).value;
  toast.position.X = target as PositionX;
};
document.getElementById('positionY').onchange = (e: Event) => {
  let target: string = (<HTMLInputElement>e.target).value;
  toast.position.Y = target as PositionY;
};

document.getElementById('ShowAnimation').onchange = (e: Event) => {
  let target: string = (<HTMLInputElement>e.target).value;
  toast.animation.show.effect = target as Effect
};

document.getElementById('HideAnimation').onchange = (e: Event) => {
  let target: string = (<HTMLInputElement>e.target).value;
  toast.animation.hide.effect = target as Effect
};

document.getElementById('toast_target').onchange = (e: Event) => {
  let target: string = (<HTMLInputElement>e.target).value;
  if (target.toLowerCase() === 'body') {
    toast.target = document.body;
  } else {
    toast.target = target;
  }
};

function clickEventFun(e: Event) {
  alert((<HTMLButtonElement>e.target).textContent + ' is Clicked!!');
}
