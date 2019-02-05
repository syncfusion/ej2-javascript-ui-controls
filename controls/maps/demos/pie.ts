import { Maps, Marker, ILoadEventArgs, MapsTheme, Legend, MapAjax } from '../src/index';

Maps.Inject(Marker, Legend);

/**
 * Dynamic Pie
 */
//tslint:disable:max-func-body-length
    let maps: Maps = new Maps({
        titleSettings: {
            text: 'Top 6 largest countries age group details',
            textStyle: {
                size: '16px'
            }
        },
        legendSettings: {
            visible: true,
            position: 'Bottom'
        },
        zoomSettings: {
            enable: false
        },
        layers: [
            {
                shapeData:new MapAjax('http://npmci.syncfusion.com/development/demos/src/maps/MapData/WorldMap.json'),
                shapeSettings: {
                    fill: '#E5E5E5',
                    colorMapping: [
                        {
                            from: 0, to: 4, color: '#634D6F', label: '0-14 years',
                        },
                        {
                            from: 5, to: 14, color: '#B34D6D', label: '15-24 years'
                        },
                        {
                            from: 15, to: 59, color: '#557C5C', label: '25-54 years'
                        },
                        {
                            from: 60, to: 100, color: '#5E55E2', label: '55-64 years'
                        }
                    ]
                },
                markerSettings: [
                    {
                        visible: true,
                        template: '<div id="marker"><img class="markerTemplate" src="images/pie_chart.svg"/></div>',
                        dataSource: [
                            { 'latitude': 61.938950426660604, 'longitude': 97.03125 },
                            { 'latitude': 57.70414723434193, 'longitude': -114.08203125 },
                            { 'latitude': 39.90973623453719, 'longitude': -103.0078125 },
                            { 'latitude': 35.746512259918504, 'longitude': 102.216796875 },
                            { 'latitude': -8.667918002363107, 'longitude': -52.55859375 },
                            { 'latitude': -23.725011735951796, 'longitude': 132.978515625}
                        ],
                        animationDuration: 0
                    }
                ]
            }
        ]
    });
    maps.appendTo('#container');
    