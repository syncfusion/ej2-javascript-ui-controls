/**
 * Highlighted region map sample
 */
import { Maps, Marker, Zoom, MapsTooltip, ILoadEventArgs, MapsTheme, MapAjax } from '../src/index';

Maps.Inject(Marker, Zoom, MapsTooltip);
//tslint:disable:max-func-body-length
    let maps: Maps = new Maps({
        width:"1012px",
        height:"465px",
        centerPosition: {
            latitude: 35.65, longitude: -97.3
        },
        zoomSettings: {
            enable: false,
            zoomFactor: 1.75
        },
        layers: [
            {
                shapeData: new MapAjax('http://npmci.syncfusion.com/development/demos/src/maps/MapData/Oklahoma.json'),
                shapeSettings: {
                    fill: '#F5F5F5',
                    border: { color: '#EEDA97', width: 1 }
                },
                markerSettings: [
                    {
                        width: 20,
                        height: 20,
                        animationDuration: 0,
                        visible: true,
                        shape: 'Image',
                        imageUrl: 'images/ballon.png',
                        fill: '#000080',
                        border: {
                            color: 'transparent'
                        },
                        dataSource: [
                            {
                                latitude: 35.6379762, longitude: -97.4823761
                            }, {
                                latitude: 35.5676663, longitude: -97.5128031
                            }, {
                                latitude: 35.5412361, longitude: -97.601552
                            }, {
                                latitude: 35.5451471, longitude: -97.5661039
                            }, {
                                latitude: 35.5120376, longitude: -97.5918531
                            }, {
                                latitude: 35.5112516, longitude: -97.5843
                            }, {
                                latitude: 35.4737072, longitude: -97.5158072
                            }, {
                                latitude: 35.4575239, longitude: -97.6179457
                            }, {
                                latitude: 35.4362676, longitude: -97.5998354
                            }, {
                                latitude: 35.3954872, longitude: -97.5962305
                            }, {
                                latitude: 35.3492258, longitude: -97.5294113
                            },
                            {
                                latitude: 35.5260794, longitude: -98.7032318
                            },
                            {
                                latitude: 34.7827916, longitude: -98.3001709
                            },
                            {
                                latitude: 34.0793936, longkitude: -98.5583496
                            },
                            {
                                latitude: 36.1434199, longitude: -97.0690155
                            },
                            {
                                latitude: 36.0170318, longitude: -96.11063
                            },
                            {
                                latitude: 36.1608845, longitude: -96.0205078
                            },
                            {
                                latitude: 36.1323292, longitude: -95.9624863
                            },
                            {
                                latitude: 36.1317746, longitude: -95.9046364
                            },
                            {
                                latitude: 36.1604341, longitude: -95.8885002
                            },
                        ]
                    },
                    {
                        animationDuration: 0,
                        visible: true,
                        shape: 'Circle',
                        width: 130,
                        height: 130,
                        fill: 'rgba(70,130,180,0.3)',
                        dataSource: [
                            {
                                latitude: 35.5112516,
                                longitude: -97.5843,
                                text: '10/18 ATMs'
                            }
                        ],
                        border: {
                            color: 'transparent'
                        },
                        tooltipSettings: {
                            visible: true,
                            valuePath: 'text'
                        }
                    },
                    {
                        animationDuration: 0,
                        visible: true,
                        shape: 'Circle',
                        width: 100,
                        height: 100,
                        fill: 'rgba(70,130,180,0.3)',
                        dataSource: [
                            {
                                latitude: 36.0808845,
                                longitude: -96.0205078,
                                text: '5/18 ATMs'
                            }
                        ],
                        tooltipSettings: {
                            visible: true,
                            valuePath: 'text'
                        },
                        border: {
                            color: 'transparent'
                        }
                    },
                    {
                        visible: true,
                        template: '<div style="color: black;">{{:name}}</div>',
                        dataSource: [
                            {
                                longitude: -101.9450281, latitude: 35.2018863, name: 'Amarillo'
                            },
                            {
                                longitude: -98.0971969, latitude: 35.5514624, name: 'El Reno'
                            },
                            {
                                longitude: -97.8432238, latitude: 35.5150073, name: 'Yukon'
                            },
                            {
                                longitude: -97.2557752, latitude: 35.4933852, name: 'Harrah'
                            },
                            {
                                longitude: -97.1019391, latitude: 35.3620257, name: 'Shawnee'
                            },
                            {
                                longitude: -97.072877, latitude: 35.6853011, name: 'Wellston'
                            },
                            {
                                longitude: -96.2093353, latitude: 36.133417, name: 'Lotsee'
                            },
                            {
                                longitude: -96.3077788, latitude: 36.1879088, name: 'Sand Springs'
                            },
                            {
                                longitude: -98.7075369, latitude: 35.931371, name: 'Oakwood'
                            },
                            {
                                longitude: -98.0003367, latitude: 35.0403272, name: 'Chickasha'
                            },
                            {
                                longitude: -97.1836494, latitude: 36.4595554, name: 'Red Rock'
                            },
                            {
                                longitude: -96.7148021, latitude: 35.4859752, name: 'Prague'
                            },
                            {
                                longitude: -97.9339651, latitude: 36.1022835, name: 'Hennessey'
                            },
                            {
                                longitude: -96.2595621, latitude: 35.2453183, name: 'Wetumka'
                            },
                            {
                                longitude: -97.4499583, latitude: 35.0304344, name: 'Purcell'
                            },
                            {
                                longitude: -96.1059044, latitude: 35.605942, name: 'Okmulgee'
                            },
                            {
                                longitude: -97.9684792, latitude: 35.8439429, name: 'Kingfisher'
                            },
                            {
                                longitude: -95.7691956, latitude: 34.9332303, name: 'McAlester'
                            },
                            {
                                longitude: -96.1289978, latitude: 34.3853794, name: 'Atoka'
                            },
                            {
                                longitude: -97.1191406, latitude: 34.5042932, name: 'Davis'
                            },
                            {
                                longitude: -98.0310059, latitude: 37.1537496, name: 'Anthony'
                            },
                            {
                                longitude: -98.3564758, latitude: 36.7542898, name: 'Cherokee'
                            },
                            {
                                longitude: -95.3695679, latitude: 35.7476268, name: 'Muskogee'
                            },
                            {
                                longitude: -95.582428, latitude: 35.2871057, name: 'Eufaula'
                            },
                            {
                                longitude: -96.9412994, latitude: 36.0446575, name: 'Mehan'
                            },
                            {
                                longitude: -99.0925598, latitude: 35.0299964, name: 'Hobart'
                            },
                            {
                                longitude: -98.4924316, latitude: 33.9137338, name: 'Wichita Falls'
                            },
                            {
                                longitude: -98.9675903, latitude: 35.5154609, name: 'Clinton'
                            },
                            {
                                longitude: -98.923645, latitude: 36.1478557, name: 'Seiling'
                            },
                            {
                                longitude: -99.2985535, latitude: 36.1500735, name: 'Vici'
                            },
                            {
                                longitude: -95.3173828, latitude: 36.3084855, name: 'Pryor'
                            },
                            {
                                longitude: -96.7524719, latitude: 34.9596836, name: 'Konawa'
                            }
                        ]
                    }
                ]
            }
        ]
    });
    maps.appendTo('#container');