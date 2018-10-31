import { Sidebar } from '../../src/sidebar/index';

let slideObj: Sidebar = new Sidebar({
  width: "250px", close: onClose,
  position: "Left",
  dockSize:"100px",
  type: 'Push',
  enableDock: false, created: onCreate,
  open: onOpen, change: onChange

});

slideObj.appendTo('#sidebar');
slideObj.show();
function onChange(e: any): any {
  this.enableDock = true
}
function onClose(e: any): any {
  (<HTMLElement>document.querySelector('.normal')).style.display = "none";
  (<HTMLElement>document.querySelector('.dock')).style.display = "block";
};


function onOpen(e: any) {
  (<HTMLElement>document.querySelector('.normal')).style.display = "block";
  (<HTMLElement>document.querySelector('.dock')).style.display = "none";

}
function onCreate(e: any): any {
  (<HTMLElement>document.querySelector('.normal')).style.display = "block";
  (<HTMLElement>document.querySelector('.dock')).style.display = "none";

  (<HTMLElement>document.querySelector('.show')).onclick = function () {
    slideObj.show();
  };
  (<HTMLElement>document.querySelector('.hide')).onclick = function () {
    slideObj.hide();
  };

}
