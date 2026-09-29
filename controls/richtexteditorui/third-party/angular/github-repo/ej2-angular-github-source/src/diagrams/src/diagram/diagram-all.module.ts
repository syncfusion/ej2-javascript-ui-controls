import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerDirective, LayersDirective } from './layers.directive';
import { CustomCursorDirective, CustomCursorsDirective } from './customcursor.directive';
import { ConnectorFixedUserHandleDirective, ConnectorFixedUserHandlesDirective } from './connector-fixeduserhandle.directive';
import { ConnectorAnnotationDirective, ConnectorAnnotationsDirective } from './connector-annotation.directive';
import { ConnectorDirective, ConnectorsDirective } from './connectors.directive';
import { NodeFixedUserHandleDirective, NodeFixedUserHandlesDirective } from './node-fixeduserhandle.directive';
import { NodeAnnotationDirective, NodeAnnotationsDirective } from './node-annotation.directive';
import { PortDirective, PortsDirective } from './ports.directive';
import { NodeDirective, NodesDirective } from './nodes.directive';
import { DiagramComponent } from './diagram.component';
import { DiagramModule } from './diagram.module';
import {HierarchicalTree, MindMap, RadialTree, ComplexHierarchicalTree, DataBinding, Snapping, PrintAndExport, BpmnDiagrams, SymmetricLayout, ConnectorBridging, UndoRedo, DiagramCollaboration, LayoutAnimation, DiagramContextMenu, LineRouting, AvoidLineOverlapping, ConnectorEditing, LineDistribution, Ej1Serialization, FlowchartLayout, ImportAndExportVisio} from '@syncfusion/ej2-diagrams'


export const HierarchicalTreeService: ValueProvider = { provide: 'DiagramsHierarchicalTree', useValue: HierarchicalTree};
export const MindMapService: ValueProvider = { provide: 'DiagramsMindMap', useValue: MindMap};
export const RadialTreeService: ValueProvider = { provide: 'DiagramsRadialTree', useValue: RadialTree};
export const ComplexHierarchicalTreeService: ValueProvider = { provide: 'DiagramsComplexHierarchicalTree', useValue: ComplexHierarchicalTree};
export const DataBindingService: ValueProvider = { provide: 'DiagramsDataBinding', useValue: DataBinding};
export const SnappingService: ValueProvider = { provide: 'DiagramsSnapping', useValue: Snapping};
export const PrintAndExportService: ValueProvider = { provide: 'DiagramsPrintAndExport', useValue: PrintAndExport};
export const BpmnDiagramsService: ValueProvider = { provide: 'DiagramsBpmnDiagrams', useValue: BpmnDiagrams};
export const SymmetricLayoutService: ValueProvider = { provide: 'DiagramsSymmetricLayout', useValue: SymmetricLayout};
export const ConnectorBridgingService: ValueProvider = { provide: 'DiagramsConnectorBridging', useValue: ConnectorBridging};
export const UndoRedoService: ValueProvider = { provide: 'DiagramsUndoRedo', useValue: UndoRedo};
export const DiagramCollaborationService: ValueProvider = { provide: 'DiagramsDiagramCollaboration', useValue: DiagramCollaboration};
export const LayoutAnimationService: ValueProvider = { provide: 'DiagramsLayoutAnimation', useValue: LayoutAnimation};
export const DiagramContextMenuService: ValueProvider = { provide: 'DiagramsDiagramContextMenu', useValue: DiagramContextMenu};
export const LineRoutingService: ValueProvider = { provide: 'DiagramsLineRouting', useValue: LineRouting};
export const AvoidLineOverlappingService: ValueProvider = { provide: 'DiagramsAvoidLineOverlapping', useValue: AvoidLineOverlapping};
export const ConnectorEditingService: ValueProvider = { provide: 'DiagramsConnectorEditing', useValue: ConnectorEditing};
export const LineDistributionService: ValueProvider = { provide: 'DiagramsLineDistribution', useValue: LineDistribution};
export const Ej1SerializationService: ValueProvider = { provide: 'DiagramsEj1Serialization', useValue: Ej1Serialization};
export const FlowchartLayoutService: ValueProvider = { provide: 'DiagramsFlowchartLayout', useValue: FlowchartLayout};
export const ImportAndExportVisioService: ValueProvider = { provide: 'DiagramsImportAndExportVisio', useValue: ImportAndExportVisio};

/**
 * NgModule definition for the Diagram component with providers.
 */
@NgModule({
    imports: [CommonModule, DiagramModule],
    exports: [
        DiagramModule
    ],
    providers:[
        HierarchicalTreeService,
        MindMapService,
        RadialTreeService,
        ComplexHierarchicalTreeService,
        DataBindingService,
        SnappingService,
        PrintAndExportService,
        BpmnDiagramsService,
        SymmetricLayoutService,
        ConnectorBridgingService,
        UndoRedoService,
        DiagramCollaborationService,
        LayoutAnimationService,
        DiagramContextMenuService,
        LineRoutingService,
        AvoidLineOverlappingService,
        ConnectorEditingService,
        LineDistributionService,
        Ej1SerializationService,
        FlowchartLayoutService,
        ImportAndExportVisioService
    ]
})
export class DiagramAllModule { }