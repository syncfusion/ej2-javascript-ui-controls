/**
 * Default sample
 */
import { CircularGauge, Annotations, ILoadedEventArgs, GaugeTheme } from '../../src/index';
CircularGauge.Inject(Annotations);

let circulargauge1: CircularGauge = new CircularGauge({
    load: (args: ILoadedEventArgs) => {
        let selectedTheme: string = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Material';
        args.gauge.theme = <GaugeTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
    },
    width: '400px',
    height: '400px',
    axes: [{
        // annotations: [{
        //     angle: 6, radius: '80%', zIndex: '1',
        //     content: '<div id="annotation1"><img style="width:25px;height:25px;" src="./image1.svg" /></div>'
        // },{
        //     angle: 9, radius: '58%', zIndex: '1',
        //     content: '<div id="annotation2"><img style="width:25px;height:25px;" src="./image2.svg" /></div>'
        // },{
        //     angle: 12, radius: '36%', zIndex: '1',
        //     content: '<div id="annotation3"><img style="width:25px;height:25px;" src="./image3.svg" /></div>'
        // }],
        startAngle: 0, endAngle: 360,
        lineStyle: { width: 0 },
        labelStyle: {
            position: 'Inside', useRangeColor: true,
            font: { size: '0px', color: 'white', fontFamily: 'Roboto', fontStyle: 'Regular' }
        }, majorTicks: { height: 0, }, minorTicks: { height: 0 },
        minimum: 0, maximum: 100,
        ranges: [
            {
                start: 0, end: 100,
                radius: '90%',
                startWidth: 40, endWidth: 40,
                color: '#210003'
            },
            {
                start: 0, end: 100,
                radius: '68%',
                startWidth: 40, endWidth: 40,
                color: '#082100'
            },
            {
                start: 0, end: 100,
                radius: '46%',
                startWidth: 40, endWidth: 40,
                color: '#001b21'
            },
        ],
        pointers: [{
            roundedCornerRadius: 20,
            value: 85,
            type: 'RangeBar',
            radius: '90%',
            color: '#e30219',
            animation: { enable: false },
            pointerWidth: 40
        },
        {
            roundedCornerRadius: 20,
            value: 35,
            type: 'RangeBar',
            radius: '68%',
            color: '#3ede00',
            animation: { enable: false },
            pointerWidth: 40
        },
        {
            roundedCornerRadius: 20,
            value: 55,
            type: 'RangeBar',
            radius: '46%',
            color: '#18F8F6',
            animation: { enable: false },
            pointerWidth: 40
        },
        {
            value: 1.5,
            type: 'Marker', imageUrl: './image1.svg',
            markerShape: 'Image',
            markerHeight: 23, markerWidth: 23,
            radius: '80%',
            animation: { enable: false },
        },
        {
            value: 2,
            type: 'Marker', imageUrl: './image2.svg',
            markerShape: 'Image',
            markerHeight: 23, markerWidth: 23,
            radius: '58%',
            animation: { enable: false },
        },
        {
            value: 2.5,
            type: 'Marker', imageUrl: './image3.svg',
            markerShape: 'Image',
            markerHeight: 23, markerWidth: 23,
            radius: '36%',
            animation: { enable: false },
        }
    ]
    }]
});
circulargauge1.appendTo('#gauge1');

let circulargauge2: CircularGauge = new CircularGauge({        
    load: (args: ILoadedEventArgs) => {
        let selectedTheme: string = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Material';
        args.gauge.theme = <GaugeTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
    },
    height: '65px',
    width: '65px',
    axes: [{
        annotations: [{
            angle: 0, radius: '0%', zIndex: '1',
            content: '<div id="annotation4"><img style="width:20px;height:20px;" src="./image1.svg" /></div>'
        }],
        startAngle: 0, endAngle: 360,
        lineStyle: { width: 0 },
        labelStyle: {
            position: 'Inside', useRangeColor: true,
            font: { size: '0px', color: 'white', fontFamily: 'Roboto', fontStyle: 'Regular' }
        },
        majorTicks: { height: 0, }, minorTicks: { height: 0 },
        minimum: 0, maximum: 100,
        ranges: [{
            start: 0, end: 100,
            radius: '100%',
            startWidth: 8, endWidth: 8,
            color: '#210003',
        }],
        pointers: [{
            roundedCornerRadius: 5,
            value: 85,
            type: 'RangeBar',
            radius: '100%',
            color: '#e30219',
            animation: { enable: false },
            pointerWidth: 8
        }]
    }]
});
circulargauge2.appendTo('#gauge2');

let circulargauge3: CircularGauge = new CircularGauge({        
    load: (args: ILoadedEventArgs) => {
        let selectedTheme: string = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Material';
        args.gauge.theme = <GaugeTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
    },
    height: '65px',
    width: '65px',
    axes: [{
        annotations: [{
            angle: 0, radius: '0%', zIndex: '1',
            content: '<div id="annotation5"><img style="width:20px;height:20px;" src="./image2.svg" /></div>'
        }],
        startAngle: 0, endAngle: 360,
        lineStyle: { width: 0 },
        labelStyle: {
            position: 'Inside', useRangeColor: true,
            font: { size: '0px', color: 'white', fontFamily: 'Roboto', fontStyle: 'Regular' }
        },
        majorTicks: { height: 0, }, minorTicks: { height: 0 },
        minimum: 0, maximum: 100,
        ranges: [{
            start: 0, end: 100,
            radius: '100%',
            startWidth: 8, endWidth: 8,
            color: '#082100',
        }],
        pointers: [{
            roundedCornerRadius: 5,
            value: 35,
            type: 'RangeBar',
            radius: '100%',
            color: '#3ede00',
            animation: { enable: false },
            pointerWidth: 8
        }]
    }]
});
circulargauge3.appendTo('#gauge3');

let circulargauge4: CircularGauge = new CircularGauge({        
    load: (args: ILoadedEventArgs) => {
        let selectedTheme: string = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Material';
        args.gauge.theme = <GaugeTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
    },
    height: '65px',
    width: '65px',
    axes: [{
        annotations: [{
            angle: 0, radius: '0%', zIndex: '1',
            content: '<div id="annotation6"><img style="width:20px;height:20px;" src="./image3.svg" /></div>'
        }],
        startAngle: 0, endAngle: 360,
        lineStyle: { width: 0 },
        labelStyle: {
            position: 'Inside', useRangeColor: true,
            font: { size: '0px', color: 'white', fontFamily: 'Roboto', fontStyle: 'Regular' }
        },
        majorTicks: { height: 0, }, minorTicks: { height: 0 },
        minimum: 0, maximum: 100,
        ranges: [{
            start: 0, end: 100,
            radius: '100%',
            startWidth: 8, endWidth: 8,
            color: '#001b21',
        }],
        pointers: [{
            roundedCornerRadius: 5,
            value: 55,
            type: 'RangeBar',
            radius: '100%',
            color: '#00c0e0',
            animation: { enable: false },
            pointerWidth: 8
        }]
    }]
});
circulargauge4.appendTo('#gauge4');

