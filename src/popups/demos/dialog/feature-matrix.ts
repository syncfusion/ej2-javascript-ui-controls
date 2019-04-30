/**
 * Dialog
 */
import { Dialog } from '../../src/dialog/dialog';
import { createElement } from '@syncfusion/ej2-base'

let dialogObj: Dialog = new Dialog({
    header: 'Drag Me!!!',
    content: "This is a dialog with draggable support.",
    showCloseIcon: true,
    buttons: [{ buttonModel: { isPrimary: true, content: 'Yes' }, click: btnClick }, { buttonModel: { content: 'No' }, click: btnClick }],
    target: '#dialogTarget',
    visible: true,
    allowDragging: true,
    width: '300px',
    animationSettings: { effect: 'None' },
    open: dialogOpen,
    close: dialogClose,
    beforeClose : dialogBeforeClose,
    beforeOpen: dialogBeforeOpen,
    drag: dialogDrag,
    dragStart: dialogDragStart,
    dragStop: dialogDragStop,
    created: dialogCreated
});
dialogObj.appendTo('#dialog');

document.getElementById('openBtn').onclick = (): void => {
    dialogObj.show();
};
function btnClick() {
    dialogObj.hide();
}
function dialogOpen() {
  document.getElementById('openBtn').style.display = 'none';
    let element: Element = createElement('p', { innerHTML: 'open event triggered'});
    document.getElementById('eventargs').appendChild(element);
}

function dialogClose() {
  document.getElementById('openBtn').style.display = 'block';
  let element: Element = createElement('p', { innerHTML: 'close event triggered'});
  document.getElementById('eventargs').appendChild(element);
}

function dialogBeforeClose() {
  let element: Element = createElement('p', { innerHTML: 'before close event triggered'});
  document.getElementById('eventargs').appendChild(element);
}

function dialogBeforeOpen() {
  let element: Element = createElement('p', { innerHTML: 'before open event triggered'});
  document.getElementById('eventargs').appendChild(element);
}

function dialogDrag() {
  let element: Element = createElement('p', { innerHTML: 'drag event triggered'});
  document.getElementById('eventargs').appendChild(element);
}

function dialogDragStart() {
  let element: Element = createElement('p', { innerHTML: 'drag start event triggered'});
  document.getElementById('eventargs').appendChild(element);
}

function dialogDragStop() {
  let element: Element = createElement('p', { innerHTML: 'drag stop event triggered'});
  document.getElementById('eventargs').appendChild(element);
}

function dialogCreated() {
  let element: Element = createElement('p', { innerHTML: 'created event triggered'});
  document.getElementById('eventargs').appendChild(element);
}
document.getElementById('animation').onchange = (): void => {
  var animation = (<any>document.getElementById("animation")).value;
  dialogObj.animationSettings = { effect: animation, duration: 400 };
  dialogObj.dataBind();
  dialogObj.hide();
  setTimeout(() => {
  dialogObj.show();
  },500);
}

document.getElementById('position').onchange = (): void => {
  var position = (<any>document.getElementById('position')).value;
  dialogObj.position.X = position.split(" ")[0].toLowerCase();
  dialogObj.position.Y = position.split(" ")[1].toLowerCase();
  dialogObj.dataBind();
}


document.getElementById('okBtn').onclick = (): void => {
  dialogObj.position.X = parseInt((<HTMLInputElement>document.getElementById('Xnumber')).value);
  dialogObj.position.Y = parseInt((<HTMLInputElement>document.getElementById('Ynumber')).value);
};

document.getElementById('heightOk').onclick = (): void => {
  dialogObj.height = (<any>document.getElementById("height")).value;
  dialogObj.width = (<any>document.getElementById("width")).value;
  dialogObj.dataBind();
};

document.getElementById('btnOk').onclick = (): void => {
  let primaryEle: any = document.getElementById('primary');
  dialogObj.buttons = [{ buttonModel: { isPrimary: primaryEle.checked, content: (<any>document.getElementById('buttonText')).value }, click: btnClick }]
  dialogObj.dataBind();
};

document.getElementById('clear').onclick = (): void => {
    document.getElementById('eventargs').innerText = ''; 
}

document.getElementById('show').onclick = (): void => {
    dialogObj.show();
}

document.getElementById('hide').onclick = (): void => {
    dialogObj.hide();
}

document.getElementById('refresh').onclick = (): void => {
    dialogObj.refreshPosition();
}

document.getElementById('destroy').onclick = (): void => {
    dialogObj.destroy();
}

document.getElementById('drag').onclick = (): void => {
    if(dialogObj.allowDragging) {
        dialogObj.allowDragging = false;
        document.getElementById('drag').innerText = 'Enable dragging';
    } else {
        dialogObj.allowDragging = true;
        document.getElementById('drag').innerText = 'Disable dragging';
    }
}

document.getElementById('esc').onclick = (): void => {
    if(dialogObj.closeOnEscape) {
        dialogObj.closeOnEscape = false;
        document.getElementById('esc').innerText = 'Enable closeOnEsc';
    } else {
        dialogObj.closeOnEscape = true;
        document.getElementById('esc').innerText = 'Disable closeOnEsc';
    }
}

document.getElementById('rtl').onclick = (): void => {  
    if(dialogObj.enableRtl) {
      dialogObj.enableRtl = false;
      document.getElementById('rtl').innerText = 'Enable RTL';
    } else {
      dialogObj.enableRtl = true;
      document.getElementById('rtl').innerText = 'Disable RTL';
    }
  }

  document.getElementById('modal').onclick = (): void => {
    if(dialogObj.isModal) {
      dialogObj.isModal = false;
      document.getElementById('modal').innerText = 'Enable Modal';
    } else {
      dialogObj.isModal = true;
      document.getElementById('modal').innerText = 'Disable Modal';
    }
  }

  document.getElementById('closeicon').onclick = (): void => {
    if(dialogObj.showCloseIcon) {
      dialogObj.showCloseIcon = false;
      document.getElementById('closeicon').innerText = 'Show close icon';
    } else {
      dialogObj.showCloseIcon = true;
      document.getElementById('closeicon').innerText = 'Hide close icon';
    }
  }

  document.getElementById('visible').onclick = (): void => {
    if(dialogObj.visible) {
      dialogObj.visible = false;
      document.getElementById('visible').innerText = 'Dialog visible';
    } else {
      dialogObj.visible = true;
      document.getElementById('visible').innerText = 'Dialog hide';
    }
  }

  document.getElementById('height').onchange = (): void => {
    dialogObj.height = (<any>document.getElementById("height")).value;
    dialogObj.dataBind();
  }

  document.getElementById('width').onchange = (): void => {
    dialogObj.width = (<any>document.getElementById("width")).value;
    dialogObj.dataBind();
  }

  document.getElementById('zindex').onchange = (): void => {
    dialogObj.zIndex = parseInt((<any>document.getElementById("zindex")).value, 10);
    dialogObj.dataBind();
  }

  document.getElementById('buttonText').onchange = (): void => {
    let primaryEle: any = document.getElementById('primary');
    dialogObj.buttons = [{ buttonModel: { isPrimary: primaryEle.checked, content: (<any>document.getElementById('buttonText')).value }, click: btnClick }]
    dialogObj.dataBind();
  }

  document.getElementById('contentArea').onchange = (): void => {
    dialogObj.content = (<any>document.getElementById("contentArea")).value;
    dialogObj.dataBind();
  }

  document.getElementById('headerArea').onchange = (): void => {
    dialogObj.header = (<any>document.getElementById("headerArea")).value;
    dialogObj.dataBind();
  }

  document.getElementById('footerArea').onchange = (): void => {
    dialogObj.footerTemplate = (<any>document.getElementById("footerArea")).value;
    dialogObj.dataBind();
  }