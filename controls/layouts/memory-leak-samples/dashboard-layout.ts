import { DashboardLayout } from '../src/dashboard-layout/dashboard-layout';

document.getElementById('render').addEventListener('click', renderDashboard);
document.getElementById('destroy').addEventListener('click', destoryDashboard);

let layoutObj: DashboardLayout;

function renderDashboard(): void {
    layoutObj = new DashboardLayout({
        columns:10,
        allowDragging: true,
        showGridLines: true,
        allowFloating: true,
        allowResizing: true,
        enableRtl: true,
        enablePersistence: true,
        cellAspectRatio: 1.5,
        panels: [
            { "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content:"<div>1</div>" },
            { "sizeX": 3, "sizeY": 2, "row": 0, "col": 1, content:"<div>2</div>" },
            { "sizeX": 1, "sizeY": 3, "row": 0, "col": 4, content:"<div>3</div>" },
            { "sizeX": 1, "sizeY": 1, "row": 1, "col": 0, content:"<div>4</div>" },
            { "sizeX": 2, "sizeY": 1, "row": 2, "col": 0, content:"<div>5</div>" },
            { "sizeX": 1, "sizeY": 1, "row": 2, "col": 2, content:"<div>6</div>" },
            { "sizeX": 1, "sizeY": 1, "row": 2, "col": 3, content:"<div>7</div>" },
        ]
    });
    layoutObj.appendTo('#layouts');
}

function destoryDashboard(): void {
    if (layoutObj && !layoutObj.isDestroyed) {
        layoutObj.destroy();
        layoutObj = null;
    }
}