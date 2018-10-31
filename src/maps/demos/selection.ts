/**
 * Maps selction sample
 */
import { Maps, MapsTooltip, ISelectionEventArgs, Selection, Highlight, Legend, ILoadEventArgs, MapsTheme, MapAjax} from '../src/index';
import { electionData } from './MapData/ElectionData';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

Maps.Inject(MapsTooltip, Selection, Highlight, Legend);
interface PopulationData {
    State?: string;
    Candidate?: string;
    Trump ?: string;
    Clinton ?: string;
}
//tslint:disable:max-func-body-length
    let maps: Maps = new Maps({
        itemSelection: (args: ISelectionEventArgs) => {
            if (args.shapeData !== isNullOrUndefined) {
                let matched: string = navigator.userAgent;
                let browser: string = matched.toLowerCase();
                let isIE11: boolean = !!navigator.userAgent.match(/Trident\/7\./);
                if (isIE11) {
                    browser = 'msie';
                }
                let object: object = args.data;
                let popup: HTMLElement = document.getElementById('closepopup');
                let closebutton: HTMLElement = document.getElementById('closebutton');
                let winner: HTMLElement = document.getElementById('winner');
                let state: HTMLElement = document.getElementById('state');
                let trumpvote: HTMLElement = document.getElementById('trumpvotes');
                let clintonvote: HTMLElement = document.getElementById('clintonvotes');
                popup.style.display = 'block';
                closebutton.style.display = 'block';
                closebutton.onclick = () => {
                    let popup: HTMLElement = document.getElementById('closepopup');
                    let closebutton: HTMLElement = document.getElementById('closebutton');
                    popup.style.display = 'none';
                    closebutton.style.display = 'none';
                };

                if (browser !== 'mozilla') {
                    state.innerText = (args.data as PopulationData).State;
                    winner.innerText = (args.data as PopulationData).Candidate;
                    trumpvote.innerText = (args.data as PopulationData).Trump + '%';
                    clintonvote.innerText = (args.data as PopulationData).Clinton + '%';
                }else {
                    state.textContent = (args.data as PopulationData).State;
                    winner.textContent = (args.data as PopulationData).Candidate;
                    trumpvote.textContent = (args.data as PopulationData).Trump + '%';
                    clintonvote.textContent = (args.data as PopulationData).Clinton + '%';
                }
            }
        },
        titleSettings: {
            text: 'USA Election Results - 2016',
            textStyle: {
                size: '16px'
            }
        },
        legendSettings: {
            visible: true,
            mode: 'Interactive',
            position: 'Top',
            width: '80%',
                textStyle: {
                    fontWeight: '400',
                    size: '14px'
                }
        },
        zoomSettings: {
            enable: false
        },
        layers: [
            {
                shapeData: new MapAjax('http://npmci.syncfusion.com/development/demos/src/maps/MapData/USA.json'),
                shapePropertyPath:  'name',
                shapeDataPath:  'State',
                dataSource : electionData,
                tooltipSettings: {
                    visible: true,
                    valuePath: 'State'
                },
                highlightSettings: {
                    enable: true,
                    fill: '#A3B0D0'
                },
                selectionSettings: {
                    enable: true,
                    fill: '#4C515B ',
                    opacity: 1
                },
                shapeSettings: {
                colorValuePath: 'Candidate',
                colorMapping: [
                {
                    value: 'Trump', color: '#D84444'
                },
                {
                    value: 'Clinton', color: '#316DB5'
                }
            ]
        }
    }
    ]
    });
    maps.appendTo('#container');
