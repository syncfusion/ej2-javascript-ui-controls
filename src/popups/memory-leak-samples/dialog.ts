/**
 * DropDownTree Default Sample
 */
import { Dialog } from '../src/dialog/index';

 let dialogObj: Dialog;


 document.getElementById('render').addEventListener('click', renderTextBox);
 document.getElementById('destroy').addEventListener('click', destoryTextBox);
 
 
 function renderTextBox(): void {
  dialogObj = new Dialog({
      header: 'Delete Multiple Items',
      content: "Are you sure you want to permanently delete all of these items?",
      allowDragging:true,
      showCloseIcon:true,
      enableResize: true,
      target: document.body,
      height: 'auto',
      width: '300px',
  });
  dialogObj.appendTo('#dialog');
   
 }

    document.getElementById('dialogBtn').onclick = (): void => {
        dialogObj.show();
    };

   
function destoryTextBox(): void {
    if (dialogObj) {
        dialogObj.destroy();
        dialogObj = null;
    }
  
}
