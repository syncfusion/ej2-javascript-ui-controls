
import { Sidebar } from '../../src/sidebar/index';

let defaultSidebar01: Sidebar = new Sidebar({
    width: "250px", showBackdrop: false,
    closeOnDocumentClick: false,
    type:'Over',
    mediaQuery: window.matchMedia('(min-width:700px) and (max-width:1000px)'),
});
defaultSidebar01.appendTo('#sidebar01');
let defaultSidebar02: Sidebar = new Sidebar({
    width: "250px", showBackdrop: false,
    closeOnDocumentClick: false,    
    type:'Over',
    mediaQuery: window.matchMedia('(min-width:700px) and (max-width:1000px)'),
});
defaultSidebar02.appendTo('#sidebar02');

document.getElementById('toggle01').onclick = function () {
    defaultSidebar01.toggle();
}
document.getElementById('toggle02').onclick = function () {
    defaultSidebar02.toggle();
}
