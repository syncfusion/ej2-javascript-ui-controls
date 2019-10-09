/**
 * Maps selction sample
 */
import { Maps, MapsTooltip, ISelectionEventArgs, Selection, Highlight, Legend, ILoadEventArgs, MapsTheme, MapAjax} from '../src/index';
import { electionData } from './MapData/ElectionData';
import { usa } from './MapData/USA';
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
            args.opacity = 0.5;
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
                shapeData: usa,
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
