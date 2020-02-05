import { CircularGauge, Annotations, Legend, Alignment, GaugeShape, LegendPosition, ILoadedEventArgs, GaugeTheme  } from '../../src/index';
CircularGauge.Inject(Annotations, Legend);



    let circulargauge: CircularGauge = new CircularGauge({

        title: 'Measure of wind speed in Km/h',
        legendSettings: {
            visible: true,
            position: 'Bottom'
        },
        axes: [{
            lineStyle: { width: 2 },
            labelStyle: {
                position: 'Inside', useRangeColor: false,
                font: { size: '12px', color: '#424242', fontFamily: 'Roboto', fontStyle: 'Regular' }
            }, majorTicks: { height: 16, color: '#9E9E9E', interval: 20 }, minorTicks: { height: 8, interval: 10 },
            startAngle: 210, endAngle: 150, minimum: 0, maximum: 120, radius: '80%',
            ranges: [
                { start: 0, end: 5, color: '#ccffff', radius: '110%', legendText: 'Light air'},
                { start: 5, end: 11, color: '#99ffff', radius: '110%', legendText: 'Light breeze' },
                { start: 11, end: 19, color: '#99ff99', radius: '110%', legendText: 'Gentle breeze' },
                { start: 19, end: 28, color: '#79ff4d', radius: '110%', legendText: 'Moderate breeze' },
                { start: 28, end: 49, color: '#c6ff1a', radius: '110%', legendText: 'Strong breeze' },
                { start: 49, end: 74, color: '#e6ac00', radius: '110%', legendText: 'Gale' },
                { start: 74, end: 102, color: '#ff6600', radius: '110%', legendText: 'Storm' },
                { start: 102, end: 120, color: '#ff0000', radius: '110%', legendText: 'Hurricane force' },
            ],
            pointers: [{
                animation: { enable: false },
                value: 70, radius: '60%', color: '#757575', pointerWidth: 8,
                cap: { radius: 7, color: '#757575' }, needleTail: { length: '18%' }
            }]
        }]
    });
    circulargauge.appendTo('#legend-container');


    document.getElementById('enable').onchange = () => {
        let enableLegend: boolean = (<HTMLInputElement>document.getElementById('enable')).checked;
        circulargauge.legendSettings.visible = enableLegend;
        circulargauge.refresh();
    };
    document.getElementById('toggle').onchange = () => {
        let toggle: boolean = (<HTMLInputElement>document.getElementById('toggle')).checked;
        circulargauge.legendSettings.toggleVisibility = toggle;
    };
    document.getElementById('alignment').onchange = (e: Event) => {
        let alignment: string = (e.target as HTMLSelectElement).value;
        circulargauge.legendSettings.alignment = alignment as Alignment;
    };
    document.getElementById('shape').onchange = (e: Event) => {
        let shape: string = (e.target as HTMLSelectElement).value;
        circulargauge.legendSettings.shape = shape as GaugeShape;
    };
    document.getElementById('position').onchange = (e: Event) => {
        let position: string = (e.target as HTMLSelectElement).value;
        circulargauge.legendSettings.position = position as LegendPosition;
    
}