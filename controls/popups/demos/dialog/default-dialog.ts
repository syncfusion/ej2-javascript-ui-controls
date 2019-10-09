/**
 * Dialog
 */
import { Dialog } from '../../src/dialog/dialog';

let dialogObj: Dialog = new Dialog({
    header: 'Delete Multiple Items',
    content: "Are you sure you want to permanently delete all of these items?",
    // content: "Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?Are you sure you want to permanently delete all of these items?",
    showCloseIcon: true,
    buttons: [{ buttonModel: { isPrimary: true, content: 'Yes' }, click: btnClick }, { buttonModel: { content: 'No' }, click: btnClick }],
    target: '#target',
    height: 'auto',
    width: '300px',
    animationSettings: { effect: 'Zoom' }
});
dialogObj.appendTo('#dialog');
document.getElementById("switchTheme").addEventListener("change", switch_theme);

function switch_theme() {
    document.body.style.background = "none";
    let theme = ( document.getElementById("switchTheme") as HTMLInputElement).value;
    let filename: string; 
    if ( theme == 'Material') {
        filename = '../../styles/material.css';
    } else if (theme == 'Fabric') {
        filename = '../../styles/fabric.css';
    } else if (theme == 'Highcontrast') {
        filename = '../../styles/highcontrast.css';
        document.body.style.background = "black";
    } else {
        filename = '../../styles/bootstrap.css';
    };
    loadcssfile(filename);
}

function loadcssfile( filename: string ) {
    let fileref = document.createElement("link")
    fileref.setAttribute("rel", "stylesheet")
    fileref.setAttribute("type", "text/css")
    fileref.setAttribute("href", filename);
    (document.getElementsByTagName("head")[0]).querySelector('link').remove();
    document.getElementsByTagName("head")[0].appendChild(fileref)
}

document.getElementById('openBtn').onclick = (): void => {
    dialogObj.show();
};
function btnClick() {
    dialogObj.hide();
}