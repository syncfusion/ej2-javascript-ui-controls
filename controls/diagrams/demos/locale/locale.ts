/**
 * Localization
 */
import { L10n, setCulture } from '@syncfusion/ej2-base';
import '../../node_modules/es6-promise/dist/es6-promise';


import {
    Diagram, DiagramContextMenu,
    ConnectorBridging, UndoRedo, DiagramBeforeMenuOpenEventArgs,
} from '../../src/diagram/index';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
Diagram.Inject(ConnectorBridging, DiagramContextMenu, UndoRedo);


setCulture('de');

L10n.load({
    'de-DE': {
        'diagram': {
            'Cut': 'Corte',
                'Copy': 'Copia',
                'Paste': 'Pasta',
                'Undo': 'Deshacer',
                'Redo': 'Rehacer',
                'SelectAll': 'Seleccionar todo',
                'Grouping': 'Agrupación',
                'Group': 'Grupo',
                'Ungroup': 'Desagrupar',
                'Order': 'Fin',
                'BringToFront': 'Traer a delante',
                'MoveForward': 'Movimiento adelante',
                'SendToBack': 'Enviar a espalda',
                'SendBackward': 'Enviar hacia atrás'
        },
    }
});


let diagram: Diagram = new Diagram({
    width: 500, height: 500,
    locale: 'de-DE',
    contextMenuSettings: {
        show: true, items: [{
            text: 'Cut', id: 'Cut', target: '.e-diagramcontent',
            iconCss: 'e-cut'
        }],
        showCustomMenuOnly: false,
    },
    contextMenuOpen: function (args: DiagramBeforeMenuOpenEventArgs) {
        for (let item of args.items) {
            if (item.text === 'cut') {
                if (!diagram.selectedItems.nodes.length && !diagram.selectedItems.connectors.length) {
                    args.hiddenItems.push(item.text);
                }
            }
        }
    },
    contextMenuClick: function (args: MenuEventArgs) {
        if (args.item.id === 'cut') {
            if ((diagram.selectedItems.nodes.length + diagram.selectedItems.connectors.length) > 0) {
                diagram.cut();
            }
        }
    },
});
diagram.appendTo('#diagram');