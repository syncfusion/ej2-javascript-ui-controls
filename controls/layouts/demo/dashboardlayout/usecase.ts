// import { DashboardLayout } from '../../src/dashboardlayout/dashboardlayout';
// var portlet = new DashboardLayout({
//     allowDragging: true,
//     allowPushing: true,
//     allowFloating: true,
//     cellSpacing: [5, 5],
//     columns: 12,    
//     rowHeight: 50,
//     panels: [{ "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, body: { content: generateTemplate('0') } },
//     { "sizeX": 2, "sizeY": 2, "row": 0, "col": 1, body: { content: generateTemplate('2') } },
//     { "sizeX": 1, "sizeY": 1, "row": 0, "col": 3, body: { content: generateTemplate('5') } },
//     { "sizeX": 1, "sizeY": 3, "row": 0, "col": 4, body: { content: generateTemplate('7') } },
//     { "sizeX": 3, "sizeY": 1, "row": 0, "col": 5, body: { content: generateTemplate('8') } },
//     { "sizeX": 1, "sizeY": 1, "row": 1, "col": 3, body: { content: generateTemplate('6') } },
//     { "sizeX": 1, "sizeY": 2, "row": 1, "col": 0, body: { content: generateTemplate('1') } },
//     { "sizeX": 2, "sizeY": 1, "row": 2, "col": 5, body: { content: generateTemplate('9') } },
//     { "sizeX": 1, "sizeY": 1, "row": 2, "col": 7, body: { content: generateTemplate('12') } },
//     { "sizeX": 1, "sizeY": 1, "row": 1, "col": 5, body: { content: generateTemplate('10') } },
//     { "sizeX": 2, "sizeY": 1, "row": 1, "col": 6, body: { content: generateTemplate('11') } },
//     { "sizeX": 1, "sizeY": 1, "row": 2, "col": 1, body: { content: generateTemplate('3') } },
//     { "sizeX": 2, "sizeY": 1, "row": 2, "col": 2, body: { content: generateTemplate('4') } },
//     ]
// });
// portlet.appendTo('#portlet_default');

// function generateTemplate(content: string): HTMLElement {
//     let ele: HTMLElement = document.createElement('DIV');
//     ele.classList.add('tempcontent');
//     document.getElementById('temp').appendChild(ele);
//     ele.innerHTML = content;
//     return ele;
// }

// document.getElementById('floating').onclick = function (e: any) {
//     var obj: any = (<any>document.getElementById('portlet_default')).ej2_instances[0];
//     if (obj.floating) {
//         obj.floating = false;
//         e.currentTarget.classList.remove('e-primary');
//     } else {
//         obj.floating = true;
//         e.currentTarget.classList.add('e-primary');
//     }
// }
// document.getElementById('pushing').onclick = function (e: any) {
//     var obj: any = (<any>document.getElementById('portlet_default')).ej2_instances[0];
//     if (obj.pushing) {
//         obj.pushing = false;
//         e.currentTarget.classList.remove('e-primary');
//     } else {
//         obj.pushing = true;
//         e.currentTarget.classList.add('e-primary');
//     }
// }
// document.getElementById('swap').onclick = function (e: any) {
//     var obj: any = (<any>document.getElementById('portlet_default')).ej2_instances[0];
//     if (obj.swapping) {
//         obj.swapping = false;
//         e.currentTarget.classList.remove('e-primary');
//     } else {
//         obj.swapping = true;
//         e.currentTarget.classList.add('e-primary');
//     }
// }
// document.getElementById('drag').onclick = function (e: any) {
//     var obj: any = (<any>document.getElementById('portlet_default')).ej2_instances[0];
//     if (obj.allowDragging) {
//         obj.allowDragging = false;
//         e.currentTarget.classList.remove('e-primary');
//     } else {
//         obj.allowDragging = true;
//         e.currentTarget.classList.add('e-primary');
//     }
// }