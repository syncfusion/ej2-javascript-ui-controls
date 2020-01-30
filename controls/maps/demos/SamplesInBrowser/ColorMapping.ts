import { Maps, Legend, Marker, MapsTooltip, IMouseEventArgs, Zoom,
    NavigationLine, MarkerSettingsModel, MarkerSettings, MarkerType } from '../../src/index';
import { usa } from '../MapData/USA';
import { colorMap } from '../MapData/color-mapping';
import { EmitType } from '@syncfusion/ej2-base';
Maps.Inject(Legend, Marker, MapsTooltip,  NavigationLine, Zoom);
//tslint:disable:max-func-body-length
    let maps: Maps = new Maps({
        titleSettings: {
            text: 'Spring Precipitation Averages of US States',
            textStyle: {
                size: '16px'
            }
        },
        zoomSettings: {
            enable: false
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
                dataSource : colorMap,
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
                            from: 0.1, to: 1, color: '#DEEBAE', label: '0 - 1'
                        },
                        {
                            from: 1, to: 2, color: '#A4D6AD', label: '1 - 2'
                        },
                        {
                            from: 2, to: 3, color: '#37AFAB', label: '2 - 3'
                        },
                        {
                            from: 3, to: 4, color: '#547C84', label: '3 - 4'
                        },
                        {
                            from: 4, to: 5, color: '#CEBF93', label: '4 - 5'
                        },
                        {
                            from: 5, to: 6, color: '#a69d70', label: '5 - 6'
                        }
                    ],
                },
                tooltipSettings: {
                    visible: true,
                    valuePath: 'State',
                    template: '#template'
                },
            }
        ]
    });
    maps.appendTo('#container');
    let highlightCheckBox: HTMLInputElement = <HTMLInputElement>(document.getElementById('opacity'));
    document.getElementById('colorMapping').onchange = () => {
        let element: string = (<HTMLInputElement>document.getElementById('colorMapping')).value;
        if (element === 'RangeColorMapping') {
            document.getElementById('text1').style.display = 'none';
            document.getElementById('input1').style.display = 'none';
            document.getElementById('text2').style.display = 'none';
            document.getElementById('input2').style.display = 'none';
            document.getElementById('text3').style.display = 'none';
            document.getElementById('input3').style.display = 'none';
            maps.layers[0].shapeSettings.colorValuePath = 'inches';
            maps.layers[0].shapeSettings.colorMapping[0].from = 0.1;
            maps.layers[0].shapeSettings.colorMapping[0].to = 1;
            maps.layers[0].shapeSettings.colorMapping[0].color = '#DEEBAE';
            maps.layers[0].shapeSettings.colorMapping[0].label = '0 - 1';
            maps.layers[0].shapeSettings.colorMapping[0].value = null;
            maps.layers[0].shapeSettings.colorMapping[1].from = 1;
            maps.layers[0].shapeSettings.colorMapping[1].to = 2;
            maps.layers[0].shapeSettings.colorMapping[1].color = '#A4D6AD';
            maps.layers[0].shapeSettings.colorMapping[1].label = '1 - 2';
            maps.layers[0].shapeSettings.colorMapping[1].value = null;
            maps.layers[0].shapeSettings.colorMapping[2].from = 2;
            maps.layers[0].shapeSettings.colorMapping[2].to = 3;
            maps.layers[0].shapeSettings.colorMapping[2].color = '#37AFAB';
            maps.layers[0].shapeSettings.colorMapping[2].label = '2 - 3';
            maps.layers[0].shapeSettings.colorMapping[2].value = null;
            maps.layers[0].shapeSettings.colorMapping[3].from = 3;
            maps.layers[0].shapeSettings.colorMapping[3].to = 4;
            maps.layers[0].shapeSettings.colorMapping[3].color = '#547C84';
            maps.layers[0].shapeSettings.colorMapping[3].label = '3 - 4';
            maps.layers[0].shapeSettings.colorMapping[3].value = null;
            maps.layers[0].shapeSettings.colorMapping[4].from = 4;
            maps.layers[0].shapeSettings.colorMapping[4].to = 5;
            maps.layers[0].shapeSettings.colorMapping[4].color = '#CEBF93';
            maps.layers[0].shapeSettings.colorMapping[4].label = '4 - 5';
            maps.layers[0].shapeSettings.colorMapping[4].value = null;
            maps.layers[0].shapeSettings.colorMapping[5].from = 5;
            maps.layers[0].shapeSettings.colorMapping[5].to = 6;
            maps.layers[0].shapeSettings.colorMapping[5].color = '#a69d70';
            maps.layers[0].shapeSettings.colorMapping[5].label = '5 - 6';
            maps.layers[0].shapeSettings.colorMapping[5].value = null;
            maps.legendSettings.title.text = 'Inches';
            maps.refresh();
        } else if (element === 'EqualColorMapping') {
            document.getElementById('text1').style.display = 'none';
            document.getElementById('input1').style.display = 'none';
            document.getElementById('text2').style.display = 'none';
            document.getElementById('input2').style.display = 'none';
            document.getElementById('text3').style.display = 'none';
            document.getElementById('input3').style.display = 'none';
            maps.layers[0].shapeSettings.colorValuePath = 'value';
            maps.layers[0].shapeSettings.colorMapping[0].from = null;
            maps.layers[0].shapeSettings.colorMapping[0].to = null;
            maps.layers[0].shapeSettings.colorMapping[0].color = '#DEEBAE';
            maps.layers[0].shapeSettings.colorMapping[0].label = null;
            maps.layers[0].shapeSettings.colorMapping[0].value = 'Low';
            maps.layers[0].shapeSettings.colorMapping[1].from = null;
            maps.layers[0].shapeSettings.colorMapping[1].to = null;
            maps.layers[0].shapeSettings.colorMapping[1].value = 'Moderate';
            maps.layers[0].shapeSettings.colorMapping[1].color = '#A4D6AD';
            maps.layers[0].shapeSettings.colorMapping[1].label = null;
            maps.layers[0].shapeSettings.colorMapping[5].label = null;
            maps.layers[0].shapeSettings.colorMapping[2].to = null;
            maps.layers[0].shapeSettings.colorMapping[2].from = null;
            maps.layers[0].shapeSettings.colorMapping[2].color = '#37AFAB';
            maps.layers[0].shapeSettings.colorMapping[2].value = 'High';
            maps.layers[0].shapeSettings.colorMapping[2].label = null;
            maps.layers[0].shapeSettings.colorMapping[3].to = null;
            maps.layers[0].shapeSettings.colorMapping[5].color = null;
            maps.layers[0].shapeSettings.colorMapping[3].color = null;
            maps.layers[0].shapeSettings.colorMapping[3].from = null;
            maps.layers[0].shapeSettings.colorMapping[4].value = null;
            maps.layers[0].shapeSettings.colorMapping[5].from = null;
            maps.layers[0].shapeSettings.colorMapping[3].label = null;
            maps.layers[0].shapeSettings.colorMapping[4].from = null;
            maps.layers[0].shapeSettings.colorMapping[4].to = null;
            maps.layers[0].shapeSettings.colorMapping[3].value = null;
            maps.layers[0].shapeSettings.colorMapping[4].color = null;
            maps.layers[0].shapeSettings.colorMapping[4].label = null;
            maps.layers[0].shapeSettings.colorMapping[5].to = null;
            maps.layers[0].shapeSettings.colorMapping[5].value = null;
            maps.legendSettings.title.text = 'Category';
            maps.refresh();
        }
        if (element === 'DesaturationColorMapping') {
            document.getElementById('text1').style.display = 'block';
            document.getElementById('input1').style.display = 'block';
            let minOpacity: HTMLInputElement = document.getElementById('minopacity') as HTMLInputElement;
            let maxOpacity: HTMLInputElement = document.getElementById('maxopacity') as HTMLInputElement;                        
            if (highlightCheckBox.checked) {
                document.getElementById('text2').style.display = 'block';
                document.getElementById('input2').style.display = 'block';
                document.getElementById('text3').style.display = 'block';
                document.getElementById('input3').style.display = 'block';
                maps.layers[0].shapeSettings.colorMapping[0].minOpacity = parseFloat(minOpacity.value);
                maps.layers[0].shapeSettings.colorMapping[0].maxOpacity = parseFloat(maxOpacity.value);
            } else {
                maps.layers[0].shapeSettings.colorMapping[0].minOpacity = null;
                maps.layers[0].shapeSettings.colorMapping[0].maxOpacity = null;
            }
            maps.layers[0].shapeSettings.colorValuePath = 'inches';
            maps.layers[0].shapeSettings.colorMapping[0].from = 0.1;
            maps.layers[0].shapeSettings.colorMapping[0].to = 6;
            maps.layers[0].shapeSettings.colorMapping[0].color = ['#F0D6AD', '#19547B'];
            maps.layers[0].shapeSettings.colorMapping[0].value = null;
            maps.layers[0].shapeSettings.colorMapping[0].label = '0 - 6';
            maps.layers[0].shapeSettings.colorMapping[1].from = null;
            maps.layers[0].shapeSettings.colorMapping[1].to = null;
            maps.layers[0].shapeSettings.colorMapping[1].color = null;
            maps.layers[0].shapeSettings.colorMapping[1].value = null;
            maps.layers[0].shapeSettings.colorMapping[1].label = null;
            maps.layers[0].shapeSettings.colorMapping[2].from = null;
            maps.layers[0].shapeSettings.colorMapping[2].to = null;
            maps.layers[0].shapeSettings.colorMapping[2].color = null;
            maps.layers[0].shapeSettings.colorMapping[2].value = null;
            maps.layers[0].shapeSettings.colorMapping[2].label = null;
            maps.layers[0].shapeSettings.colorMapping[3].from = null;
            maps.layers[0].shapeSettings.colorMapping[3].to = null;
            maps.layers[0].shapeSettings.colorMapping[3].color = null;
            maps.layers[0].shapeSettings.colorMapping[3].label = null;
            maps.layers[0].shapeSettings.colorMapping[3].value = null;
            maps.layers[0].shapeSettings.colorMapping[4].from = null;
            maps.layers[0].shapeSettings.colorMapping[4].to = null;
            maps.layers[0].shapeSettings.colorMapping[4].color = null;
            maps.layers[0].shapeSettings.colorMapping[4].label = null;
            maps.layers[0].shapeSettings.colorMapping[4].value = null;
            maps.layers[0].shapeSettings.colorMapping[5].from = null;
            maps.layers[0].shapeSettings.colorMapping[5].to = null;
            maps.layers[0].shapeSettings.colorMapping[5].color = null;
            maps.layers[0].shapeSettings.colorMapping[5].label = null;
            maps.layers[0].shapeSettings.colorMapping[5].value = null;
            maps.legendSettings.title.text = 'Inches';
            maps.refresh();
        }
    }
    document.getElementById('minopacity').onpointermove = document.getElementById('minopacity').ontouchmove =
    document.getElementById('minopacity').onchange = () => {
        if (highlightCheckBox.checked && !highlightCheckBox.disabled) {
            let slider: HTMLInputElement = document.getElementById('minopacity') as HTMLInputElement;
            let minOpacity: number = parseFloat(slider.value);
            maps.layers[0].shapeSettings.colorMapping[0].minOpacity = minOpacity;
            maps.layers[0].shapeSettings.colorMapping[1].minOpacity = minOpacity;
            maps.refresh();
        }
    };
    document.getElementById('maxopacity').onpointermove = document.getElementById('maxopacity').ontouchmove =
    document.getElementById('maxopacity').onchange = () => {
        if (highlightCheckBox.checked && !highlightCheckBox.disabled) {
            let slider: HTMLInputElement = document.getElementById('maxopacity') as HTMLInputElement;
            let maxOpacity: number = parseFloat(slider.value);
            maps.layers[0].shapeSettings.colorMapping[0].maxOpacity = maxOpacity;
            maps.layers[0].shapeSettings.colorMapping[1].maxOpacity = maxOpacity;
            maps.refresh();
        }
    };
    document.getElementById('opacity').onchange = () => {
        let minOpacity: HTMLInputElement = document.getElementById('minopacity') as HTMLInputElement;
        let maxOpacity: HTMLInputElement = document.getElementById('maxopacity') as HTMLInputElement;
        let e: HTMLInputElement = <HTMLInputElement>document.getElementById('opacity');
        if (e.checked) {
            document.getElementById('text2').style.display = 'block';
            document.getElementById('input2').style.display = 'block';
            document.getElementById('text3').style.display = 'block';
            document.getElementById('input3').style.display = 'block';
            maps.layers[0].shapeSettings.colorMapping[0].minOpacity = parseFloat(minOpacity.value);
            maps.layers[0].shapeSettings.colorMapping[0].maxOpacity = parseFloat(maxOpacity.value);
            maps.layers[0].shapeSettings.colorMapping[1].minOpacity = parseFloat(minOpacity.value);
            maps.layers[0].shapeSettings.colorMapping[1].maxOpacity = parseFloat(maxOpacity.value);
            minOpacity.disabled = false;
            maxOpacity.disabled = false;
        } else {
            document.getElementById('text2').style.display = 'none';
            document.getElementById('input2').style.display = 'none';
            document.getElementById('text3').style.display = 'none';
            document.getElementById('input3').style.display = 'none';
            maps.layers[0].shapeSettings.colorMapping[0].minOpacity = null;
            maps.layers[0].shapeSettings.colorMapping[0].maxOpacity = null;
            maps.layers[0].shapeSettings.colorMapping[1].minOpacity = null;
            maps.layers[0].shapeSettings.colorMapping[1].maxOpacity = null;
            minOpacity.disabled = true;
            maxOpacity.disabled = true;
        }
        maps.refresh();
    };
   