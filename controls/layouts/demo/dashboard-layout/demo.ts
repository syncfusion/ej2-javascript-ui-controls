import { DashboardLayout } from '../../src/dashboard-layout/dashboard-layout';
let portlet: DashboardLayout = new DashboardLayout({    
    cellSpacing: [7, 7],
    allowDragging: true,
    panels: [],
    columns:6,    
   
});
portlet.appendTo('#portlet_default');
let headerCount: number = 1;
document.getElementById('add').addEventListener('click', function (args) {

    let rowValue = parseInt((<HTMLInputElement>document.getElementById('row')).value);
    let colValue = parseInt((<HTMLInputElement>document.getElementById('column')).value);
    let sizeX = parseInt((<HTMLInputElement>document.getElementById('sizeX')).value);
    let sizeY = parseInt((<HTMLInputElement>document.getElementById('sizeY')).value);
    let headerText: string = 'Header' + headerCount.toString();
    let panelModelValue = {
        row: rowValue,
        col: colValue,
        sizeX: sizeX,
        sizeY: sizeY,       
    }
    portlet.addPanel(panelModelValue);
    headerCount = headerCount + 1;
});

document.getElementById('RemoveAll').addEventListener('click', function (args) {
    portlet.removeAll();
});


document.getElementById('resize').addEventListener('click', function (args) {
    let id: string = (<HTMLInputElement>document.getElementById('resizeId')).value;
    let sizeX: number = parseInt((<HTMLInputElement>document.getElementById('resizeX')).value, 10);
    let sizeY: number = parseInt((<HTMLInputElement>document.getElementById('resizeY')).value, 10);
    portlet.resizePanel(id, sizeX, sizeY);
});

document.getElementById('move').addEventListener('click', function (args) {
    let id: string = (<HTMLInputElement>document.getElementById('moveID')).value;
    let sizeX: number = parseInt((<HTMLInputElement>document.getElementById('moveX')).value, 10);
    let sizeY: number = parseInt((<HTMLInputElement>document.getElementById('moveY')).value, 10);
    portlet.movePanel(id, sizeX, sizeY);
});