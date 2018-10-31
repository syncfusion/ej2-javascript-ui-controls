/**
 * Maps zooming sample
 */
import { Maps, Zoom, ILoadEventArgs, MapsTheme, MapAjax } from '../src/index';
import { randomcountriesData } from './MapData/salesCountry';

Maps.Inject(Zoom);

    let maps: Maps = new Maps({
    zoomSettings: {
        enable: true,
        toolbars: ['Zoom', 'ZoomIn', 'ZoomOut', 'Pan', 'Reset'],
        pinchZooming: true
    },
    layers: [
        {
            shapeData: new MapAjax('http://npmci.syncfusion.com/development/demos/src/maps/MapData/WorldMap.json'),
            shapePropertyPath: 'continent',
            shapeDataPath: 'continent',
            shapeSettings: {
            autofill: true,
            colorValuePath: 'color'
        },
        dataSource: randomcountriesData
    }
    ]
    });
    maps.appendTo('#mapszooming');
    document.getElementById('mousewheel').onchange = () => {
    let element: HTMLInputElement = <HTMLInputElement>(document.getElementById('mousewheel'));
    maps.zoomSettings.mouseWheelZoom = element.checked;
    maps.refresh();
};
    document.getElementById('pinch').onchange = () => {
    let element: HTMLInputElement = <HTMLInputElement>(document.getElementById('pinch'));
    maps.zoomSettings.pinchZooming = element.checked;
    maps.refresh();
};
    document.getElementById('zoom').onchange = () => {
    let element: HTMLInputElement = <HTMLInputElement>(document.getElementById('zoom'));
    maps.zoomSettings.enable = element.checked;
    maps.refresh();
};
    document.getElementById('doubletap').onchange = () => {
    let element: HTMLInputElement = <HTMLInputElement>(document.getElementById('doubletap'));
    maps.zoomSettings.doubleClickZoom = element.checked;
    maps.zoomSettings.zoomOnClick = (!element.checked);
    let ele1: HTMLInputElement = <HTMLInputElement> document.getElementById('singletap');
    if (element.checked) {
        ele1.disabled = true;
    }else {
        ele1.disabled = false;
    }
};
    document.getElementById('singletap').onchange = () => {
    let element: HTMLInputElement = <HTMLInputElement>(document.getElementById('singletap'));
    let ele1: HTMLInputElement = <HTMLInputElement> document.getElementById('doubletap');
    maps.zoomSettings.zoomOnClick = element.checked;
    maps.zoomSettings.doubleClickZoom = (!element.checked);
    if (element.checked) {
        ele1.disabled = true;
    }else {
        ele1.disabled = false;
    }
};