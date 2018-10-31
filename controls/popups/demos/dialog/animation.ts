import { Dialog, DialogEffect } from './../../src/dialog/dialog';
import { enableRipple } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
/**
 * Animation Dialog sample
 */
  //Render Button components
  let zoom: Button = new Button({ cssClass: 'e-outline', isPrimary: true });
  zoom.appendTo('#Zoom');

  let flipXDown: Button = new Button({ cssClass: 'e-outline', isPrimary: true });
  flipXDown.appendTo('#FlipXDown');

  let flipXUp: Button = new Button({ cssClass: 'e-outline', isPrimary: true });
  flipXUp.appendTo('#FlipXUp');

  let flipYLeft : Button = new Button({ cssClass: 'e-outline', isPrimary: true });
  flipYLeft.appendTo('#FlipYLeft');

  let flipYRight: Button = new Button({ cssClass: 'e-outline', isPrimary: true });
  flipYRight.appendTo('#FlipYRight');

  enableRipple(true);
  // Initialization of Dialog component
  let dialog: Dialog = new Dialog({
      // Enables the header
      header: 'Animation Dialog',
      // Enables the close icon button in header
      showCloseIcon: true,
      // Dialog content
      content: '<span>The dialog is configured with animation effect. It is opened or closed with "Zoom In or Out" animation.</span>',
      // The Dialog shows within the target element
      target: document.getElementById('target'),
      width: '285px',
      animationSettings: { effect: 'Zoom' },
      buttons: [{
        click: dlgButtonClick,
        buttonModel: { content: 'Hide', isPrimary: true }
    }],
  });
  // Render initialized Dialog
  dialog.appendTo('#dialog');

  function dlgButtonClick(): void {
      dialog.hide();
  }
  let list: NodeList  = document.getElementsByClassName('btn-animate');

  for (let i: number = 0 ; i < list.length; i++) {
      list[i].addEventListener('click', (e: any): void => {
          onAnimationChange(e);
      });
  }
  function onAnimationChange(e: any): void {
    let effects: DialogEffect = e.target.id;
    let txt: string = e.target.parentElement.innerText;
    txt = (txt === 'Zoom In/Out') ? 'Zoom In or Out' : txt;
    dialog.content = 'The dialog is configured with animation effect. It is opened or closed with "' + txt + '" animation.';
    dialog.animationSettings = { effect: effects, duration: 400 };
    dialog.show();
  }
