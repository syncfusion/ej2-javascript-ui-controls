/**
 * Maps default sample
 */
import { Maps, Legend, Marker, MapsTooltip, ILoadEventArgs, MapsTheme, MapAjax, Zoom, MarkerType, TooltipGesture } from '../../src/index';
import { dafaultData } from '../MapData/salesCountry';
import { world_Map } from '../MapData/worldMap';

Maps.Inject(Legend, Marker, MapsTooltip, Zoom);
//tslint:disable:max-func-body-length
    let maps: Maps = new Maps({
        zoomSettings: {
            enable: true
        },
        layers: [
            {
                layerType: 'OSM',
                shapeSettings: {
                    fill: '#C1DFF5'
                },
                markerClusterSettings: {
                    allowClustering: true,
                    allowClusterExpand: true,
                    shape: 'Image',
                    height: 40, width: 40,
                    imageUrl: '../images/cluster.svg',
                },
                markerSettings: [
                    {
                        visible: true,
                        dataSource: [
                            { latitude: 43.6533855, longitude: -79.3729994, name: 'Toronto'},
                            { latitude: 43.6533855, longitude: -79.3729994, name: 'Toronto'},
                            { latitude: 43.6533855, longitude: -79.3729994, name: 'Toronto'},
                            { latitude: 43.6533855, longitude: -79.3729994, name: 'Toronto'},
                            { latitude: 43.6533855, longitude: -79.3729994, name: 'Toronto'},
                            { latitude: 43.6533855, longitude: -79.3729994, name: 'Toronto'},
                            { latitude: 43.6533855, longitude: -79.3729994, name: 'Toronto'},
                            { latitude: 43.6533855, longitude: -79.3729994, name: 'Toronto'},
                            { latitude: 43.6533855, longitude: -79.3729994, name: 'Toronto'},
                            { latitude: 43.6533855, longitude: -79.3729994, name: 'Toronto'},
                            { latitude: 43.6533855, longitude: -79.3729994, name: 'Toronto'},
                            { latitude: 43.6533855, longitude: -79.3729994, name: 'Toronto'},
                            { latitude: 43.6533855, longitude: -79.3729994, name: 'Toronto'},
                            { latitude: 43.6533855, longitude: -79.3729994, name: 'Toronto'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 1'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 2'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 3'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 4'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 5'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 6'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 7'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 8'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 9'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 10'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 11'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 12'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 13'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 14'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 15'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 16'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 17'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 18'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 19'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 20'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 21'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 22'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 23'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 24'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 25'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 26'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 27'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 28'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 29'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai 30'},
                        ],
                        shape: 'Image',
                        imageUrl: '../images/ballon.png',
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

    document.getElementById('shapes').onchange = () => {
        let value: string = (<HTMLInputElement>document.getElementById('shapes')).value;
        maps.layers[0].markerClusterSettings.shape= <MarkerType>value; 
        maps.refresh();
    };
    document.getElementById('tooltip').onchange = () => {
        let value: string = (<HTMLInputElement>document.getElementById('tooltip')).value;
        maps.tooltipDisplayMode = <TooltipGesture>value; 
        maps.refresh();
    };
