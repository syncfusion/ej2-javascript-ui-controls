/**
 * Maps datalabel sample
 */
import { Maps, MapsTooltip, DataLabel,Highlight, Legend, ILoadEventArgs, MapsTheme, SmartLabelMode, IntersectAction, MapAjax } from '../../src/index';
import { usa } from '../MapData/USA';
Maps.Inject(MapsTooltip, DataLabel, Highlight, Legend);
    let maps: Maps = new Maps({
         titleSettings: {
            text: 'Spring Precipitation Averages of US States',
            textStyle: {
                size: '16px'
            }
        },
        zoomSettings: {
          enable: true
        },
        legendSettings: {
            visible: true,
            position: 'Bottom',
            height: '10',
            width: '80%',
            mode: 'Interactive',
            titleStyle: {
                size: '18px'
            },
            title: {
                text: 'Inches'
            },
        },
        layers: [
            {
                dataSource : [
				    {"State" : "Alabama","inches": 5.37, "value": "High" },
                    {"State" : "Alaska", "inches":1.15, "value": "Low" },
                    {"State" : "Arizona", "inches":0.77, "value": "Low" },
                    {"State" : "Arkansas", "inches":4.99, "value": "High" },
                    {"State" : "California", "inches":1.93, "value": "Low" },
                    {"State" : "Colorado", "inches":1.56, "value": "Low" },
                    {"State" : "Connecticut", "inches":4.35, "value": "Moderate" },
                    {"State" : "Delaware", "inches":4.01, "value": "High" },
                    {"State" : "Florida", "inches":3.63, "value": "Moderate" },
                    {"State" : "Georgia", "inches":4.16, "value": "High" },
                    {"State" : "Hawaii", "inches":5.94, "value": "High" },
                    {"State" : "Idaho", "inches":1.75, "value": "Low" },
                    {"State" : "Illinois", "inches":3.79, "value": "Moderate" },
                    {"State" : "Indiana", "inches":3.94, "value": "Moderate" },
                    {"State" : "Iowa", "inches":3.25, "value": "Moderate" },
                    {"State" : "Kansas", "inches":3.00, "value": "Moderate" },
                    {"State" : "Kentucky", "inches":4.61, "value": "High" },
                    {"State" : "Louisiana", "inches":5.22, "value": "High" },
                    {"State" : "Maine", "inches":3.49, "value": "Moderate" },
                    {"State" : "Maryland", "inches":3.93, "value": "Moderate" },
                    {"State" : "Massachusetts", "inches":4.06, "value": "High" },
                    {"State" : "Michigan", "inches":2.62, "value": "Moderate" },
                    {"State" : "Minnesota", "inches":2.19, "value": "Moderate" },
                    {"State" : "Mississippi", "inches":5.77, "value": "High" },
                    {"State" : "Missouri", "inches":4.12, "value": "High" },
                    {"State" : "Montana","inches":1.51, "value": "Low" },
                    {"State" : "Nebraska","inches":2.60, "value": "Moderate" },
                    {"State" : "Nevada","inches":0.96, "value": "Low" },
                    {"State" : "New Hampshire","inches":3.54, "value": "Moderate" },
                    {"State" : "New Jersey","inches":4.13, "value": "High" },
                    {"State" : "New Mexico","inches":0.82, "value": "Low" },
                    {"State" : "New York","inches":3.41, "value": "Moderate" },
                    {"State" : "North Carolina","inches":4.14, "value": "High" },
                    {"State" : "North Dakota","inches":1.50, "value": "Low" },
                    {"State" : "Ohio","inches":3.53, "value": "Moderate" },
                    {"State" : "Oklahoma","inches":3.84, "value": "Moderate" },
                    {"State" : "Oregon","inches":2.33, "value": "Moderate" },
                    {"State" : "Pennsylvania","inches":3.67, "value": "Moderate" },
                    {"State" : "Rhode Island","inches":4.23, "value": "High" },
                    {"State" : "South Carolina","inches":3.83, "value": "Moderate" },
                    {"State" : "South Dakota","inches":2.17, "value": "Moderate" },
                    {"State" : "Tennessee","inches":5.15, "value": "High" },
                    {"State" : "Texas","inches":2.50, "value": "Moderate" },
                    {"State" : "Utah","inches":1.16, "value": "Low" },
                    {"State" : "Vermont","inches":3.40, "value": "Moderate" },
                    {"State" : "Virginia","inches":3.91, "value": "Moderate" },
                    {"State" : "Washington","inches":2.90, "value": "Moderate" },
                    {"State" : "West Virginia","inches":4.06, "value": "High" },
                    {"State" : "Wisconsin","inches":2.73, "value": "Moderate" },
                    {"State" : "Wyoming","inches":1.42, "value": "Low" }
                ],
                shapeDataPath: 'State',
                shapeData: usa,
                shapePropertyPath: 'name',
                shapeSettings: {
                    colorValuePath: 'inches',
                    fill: '#E5E5E5',
                    border: {
                        color: 'black',
                        width: 0.2
                    },
                    colorMapping: [
                        {
                            from: 0.1, to: 1, color: '#DEEBAE', label: ''
                        },
                        {
                            from: 1, to: 2, color: '#A4D6AD', label: ''
                        },
                        {
                            from: 2, to: 3, color: '#37AFAB', label: ''
                        },
                        {
                            from: 3, to: 4, color: '#547C84', label: ''
                        },
                        {
                            from: 4, to: 5, color: '#CEBF93', label: ''
                        },
                        {
                            from: 5, to: 6, color: '#a69d70', label: ''
                        }
                    ],
                },
                highlightSettings: {
                  enable: true
                },
                tooltipSettings: {
                    visible: true,
                    valuePath: 'State',
                    template: '#template'
                },
            }
        ]
    });
    maps.appendTo('#datalabel');

    document.getElementById('intersectaction').addEventListener('change', changeintersectaction);
    function changeintersectaction(): void {
        let type:any=(document.getElementById('intersectaction') as HTMLSelectElement).value;
        maps.layers[0].dataLabelSettings.intersectionAction = type;
        maps.refresh();
}
    document.getElementById('smartlabelmode').addEventListener('change', changelabelmode);
    function changelabelmode(): void {
        let type:any=(document.getElementById('smartlabelmode') as HTMLSelectElement).value;
        maps.layers[0].dataLabelSettings.smartLabelMode = type;
        maps.refresh();
}
    document.getElementById('select').onchange = () => {
        let element: HTMLInputElement = <HTMLInputElement>(document.getElementById('select'));
        maps.layers[0].dataLabelSettings.visible = element.checked;
        maps.refresh();
    };