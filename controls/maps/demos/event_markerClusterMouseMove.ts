import { Maps, Legend, Marker, MapsTooltip, ILoadEventArgs, MapsTheme, IMarkerClusterMoveEventArgs, MapAjax, Zoom, MarkerType } from '../src/index';
import { dafaultData } from './MapData/salesCountry';
import { world_Map } from './MapData/worldMap';
Maps.Inject(Legend, Marker, MapsTooltip, Zoom);
let count: number;
//tslint:disable:max-func-body-length
    let maps: Maps = new Maps({
        markerClusterMouseMove: (args :IMarkerClusterMoveEventArgs) =>{
            args.maps.titleSettings.text = "Marker Cluster Mouse move Event";
        },
        titleSettings: {
            text: 'Top 25 populated cities in the world',
            textStyle: {
                size: '16px'
            }
        },
        zoomSettings: {
            enable: true
        },
        layers: [
            {
                shapeData: world_Map,
                shapeSettings: {
                    fill: '#C1DFF5'
                },
                markerClusterSettings: {
                    allowClustering: true,
                    shape: 'Image',
                    height: 40, width: 40,
                    imageUrl: 'images/cluster.svg',
                },
                markerSettings: [
                    {
                        visible: true,
                        dataSource: [
                            {
                                latitude: 40.6971494,
                                longitude: -74.2598747,
                                city: "New York",
                                area: 8683,
                                Rank: 1
                            },
                            {
                                latitude: 35.4526439,
                                longitude: 139.4567198,
                                city: "Tokyo",
                                area: 6993,
                                Rank: 2
                            },
                            {
                                latitude: 41.8333925,
                                longitude: -88.0121569,
                                city: "Chicago",
                                area: 5498,
                                Rank: 3
                            },
                            {
                                latitude: 33.1147951,
                                longitude: -94.2114611,
                                city: "Atlanta",
                                area: 5083,
                                Rank: 4
                            },
                            {
                                latitude: 40.0024137,
                                longitude: -75.2581194,
                                city: "Philadelphia",
                                area: 4661,
                                Rank: 5
                            },
                            {
                                latitude: 42.3142647,
                                longitude: -71.11037,
                                city: "Boston",
                                area: 4497,
                                Rank: 6
                            },
                            {
                                latitude: 34.0201613,
                                longitude: -118.6919306,
                                city: "Los Angeles",
                                area: 4320,
                                Rank: 7
                            },
                            {
                                latitude: 32.8203525,
                                longitude: -97.0117413,
                                city: "Dallas",
                                area: 3644,
                                Rank: 8
                            },
                            {
                                latitude: 31.2590796,
                                longitude: -95.6476923,
                                city: "Houston",
                                area: 3355,
                                Rank: 9
                            },
                            {
                                latitude: 42.3526257,
                                longitude: -83.239291,
                                city: "Detroit",
                                area: 3267,
                                Rank: 10
                            },
                            {
                                latitude: 47.2510905,
                                longitude: -123.1255834,
                                city: "Washington",
                                area: 2996,
                                Rank: 11
                            },
                            {
                                latitude: 25.7823907,
                                longitude: -80.2994995,
                                city: "Miami",
                                area: 2891,
                                Rank: 12
                            },
                            {
                                latitude: 35.1468253,
                                longitude: 136.7862238,
                                city: "Nagoya",
                                area: 2875,
                                Rank: 13
                            },
                            {
                                latitude: 48.8588377,
                                longitude: 2.2770198,
                                city: "Paris",
                                area: 2723,
                                Rank: 14
                            },
                            {
                                latitude: 50.1781141,
                                longitude: 2.4939991,
                                city: "Essen",
                                area: 2642,
                                Rank: 15
                            },
                            {
                                latitude: 34.677518,
                                longitude: 135.3455988,
                                city: "Osaka",
                                area: 2564,
                                Rank: 16
                            },
                            {
                                latitude: 47.6129432,
                                longitude: -122.4821496,
                                city: "Seattle",
                                area: 2470,
                                Rank: 17
                            },
                            {
                                latitude: -26.1715046,
                                longitude: 27.9699835,
                                city: "Johannesburg",
                                area: 2396,
                                Rank: 18
                            },
                            {
                                latitude: 44.9706114,
                                longitude: -93.4015641,
                                city: "Minneapolis",
                                area: 2316,
                                Rank: 19
                            },
                            {
                                latitude: 19.3892246,
                                longitude: -70.1305136,
                                city: "San Juan",
                                area: 2309,
                                Rank: 20
                            },
                            {
                                latitude: -34.6157437,
                                longitude: -60.5733857,
                                city: "Buenos Aires",
                                area: 2266,
                                Rank: 21
                            },
                            {
                                latitude: 40.4313473,
                                longitude: -80.050541,
                                city: "Pittsburgh",
                                area: 2208,
                                Rank: 22
                            },
                            {
                                latitude: 55.580748,
                                longitude: 36.8251027,
                                city: "Moscow",
                                area: 2150,
                                Rank: 23
                            },
                            {
                                latitude: 38.6530169,
                                longitude: -90.3835487,
                                city: "St. Louis",
                                area: 2147,
                                Rank: 24
                            },
                            {
                                latitude: -37.9712368,
                                longitude: 144.4926562,
                                city: "Melbourne",
                                area: 2080,
                                Rank: 25
                            }                            
                        ],
                        shape: 'Image',
                        imageUrl: 'images/ballon.png',
                        height: 20,
                        width: 20,
                        tooltipSettings: {
                            visible: true,
                            valuePath: 'name'
                        },
                        animationDuration: 0
                    },
                ]
            },
        ],
    });
    maps.appendTo('#container');
