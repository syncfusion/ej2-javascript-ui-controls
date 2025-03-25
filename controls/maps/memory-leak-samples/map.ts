import { Maps, Legend, Marker, MapsTooltip, Zoom, Bubble, Annotations, Polygon, NavigationLine, DataLabel, Highlight, Selection } from '../src/index';
import { australia } from './australia';

Maps.Inject(Legend, Marker, MapsTooltip, Zoom, Annotations, Bubble, Polygon, DataLabel, NavigationLine, Highlight, Selection);
/* eslint-disable  */
let map: Maps;
document.getElementById('render').addEventListener('click', renderMap);
document.getElementById('destroy').addEventListener('click', destroyMap);

function renderMap(): void {
map = new Maps({
    description: 'Third Maps element',
    background:"#CCD1D1",
    mapsArea: {
        background: '#E3D7E7',
        border: {
            width: 2,
            color: 'green'
        } 
    },
    theme:'Material3',
    legendSettings: {
        title:{
           text: 'Population density'
        },
        visible: true,
        width: '150',
        height: '50'
    },
    layers: [{
        shapeData: australia,
        shapeDataPath: 'name',
        shapePropertyPath: 'STATE_NAME',
        polygonSettings: {
            polygons: [
                {
                    points: [
                        { longitude: 129.00576600596634, latitude: -26.02755055765826 },
                        { longitude: 128.93982816790293, latitude: -24.584556170035526 },
                        { longitude: 128.91413545449637, latitude: -22.7728744453607 },
                        { longitude: 128.99121359471798, latitude: -19.85314884899934 },
                        { longitude: 129.01690630812658, latitude: -16.952449715620304 },
                        { longitude: 128.96552088131148, latitude: -15.05086569525632 },
                        { longitude: 129.40229700924073, latitude: -15.026052909237961 },
                        { longitude: 129.60783871650102, latitude: -14.92677296005209 },
                        { longitude: 129.65922414331607, latitude: -14.155818956340795 },
                        { longitude: 129.91615127739345, latitude: -13.706955046516512 },
                        { longitude: 130.3015419785076, latitude: -13.357243246362742 },
                        { longitude: 130.4043128321378, latitude: -12.85677755586103 },
                        { longitude: 130.71262539303035, latitude: -12.556015952085588 },
                        { longitude: 131.43202136844343, latitude: -12.355312152006462 },
                        { longitude: 132.20280277067366, latitude: -12.28000836685726 },
                        { longitude: 132.66527161200946, latitude: -11.82773746902059 },
                        { longitude: 132.40834447793407, latitude: -11.601319507224645 },
                        { longitude: 132.02295377681992, latitude: -11.450271859299832 },
                        { longitude: 132.04864649022647, latitude: -11.223549392610323 },
                        { longitude: 132.51111533156416, latitude: -11.173142306890497 },
                        { longitude: 132.9221987460869, latitude: -11.55097931993052 },
                        { longitude: 134.00129270920763, latitude: -11.953444544570004 },
                        { longitude: 135.18315752595856, latitude: -12.079093257992085 },
                        { longitude: 135.6713190807028, latitude: -12.204683032399444 },
                        { longitude: 136.08240249522555, latitude:-12.405502642420672 },
                        { longitude: 136.46779319633964, latitude: -12.380408603571809 },
                        { longitude: 136.31363691589434, latitude: -12.079093257992085 },
                        { longitude: 136.77610575723213, latitude: -12.380408603571809 },
                        { longitude: 136.75041304382353, latitude: -12.931912027991544 },
                        { longitude: 135.77408993433505, latitude: -13.532163361089118 },
                        { longitude: 135.54285551366615, latitude: -14.678372966884055 },
                        { longitude: 135.9539389281868, latitude: -15.199681588278864 },
                        { longitude: 136.64764219019338, latitude: -15.719704738176986 },
                        { longitude: 138.06074142761315, latitude: -16.632687926648714 },
                        { longitude: 138.06074142761315, latitude: -19.70808856253474 },
                        { longitude: 138.0093560007981, latitude: -22.58322413379237 },
                        { longitude: 138.06074142761315, latitude: -26.09384599978965 },
                        { longitude: 134.12975627624627, latitude: -26.047688943465324 },
                        { longitude: 128.91413545449637, latitude: -26.047688943465324 },
                        { longitude: 128.91435941626952, latitude: -26.047709828771886 },
                        { longitude: 128.93983945087098, latitude: -26.001356062281232 }
                    ],
                    fill:'#980000'
                }
            ],
        },
        highlightSettings: {
            enable: true,
            fill: '#A3B0D0',
            border: { color: 'black', width: 2}
        },
        selectionSettings: {
            enable: true,
            fill: '#4C515B ',
            opacity: 1,
            border: { color: 'black', width: 2}
        },
        dataSource: [
            {
                'value': 53,
                'name': 'New South Wales',
                'population': 29863010,
                'density': 119
            },
            {
                'value': 117,
                'name': 'Victoria',
                'population': 3195000,
                'density': 111
            },
            {
                'value': 15,
                'name': 'Queensland',
                'population': 34895000,
                'density': 15
            },
            {
                'value': 15,
                'name': 'South Australia',
                'population': 18498000,
                'density': 15
            },
            {
                'value': 15,
                'name': 'Western Australia',
                'population': 40091359,
                'density': 14
            },
            {
                'value': 109,
                'name': 'Tasmania',
                'population': 3230100,
                'density': 108
            },
            {
                'value': 3,
                'name': 'Northern Territory',
                'population': 23839595,
                'density': 3.3
            },
            {
                'value': 102,
                'name': 'Australian Capital Territory',
                'population': 8372930,
                'density': 100
            },],
        shapeSettings: {
            colorValuePath: 'density',
            border: { color: 'black', width: 2},
            fill: '#E5E5E5',
            colorMapping: [
                {
                    from: 0.00001, to: 100, color: 'rgb(153,174,214)'
                },
                {
                    from: 100, to: 200, color: 'rgb(115,143,199)'
                },
                {
                    from: 200, to: 300, color: 'rgb(77,112,184)'
                },
                {
                    from: 300, to: 500, color: 'rgb(38,82,168)'
                },
                {
                    from: 500, to: 19000, color: 'rgb(0,51,153)'
                }
            ]
        }
    }]
});
map.appendTo('#mapsone');}


function destroyMap(): void {
    if (map && !map.isDestroyed) {
        map.destroy();
    }
}