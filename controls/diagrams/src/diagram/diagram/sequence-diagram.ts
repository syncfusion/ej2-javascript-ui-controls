/**
 * Represents the model to create a sequence diagram.
 */

import { Diagram } from '../diagram';
import { ConnectorConstraints, NodeConstraints} from '../enum/enum';
import { Rect } from '../primitives/rect';
import { Node } from '../objects/node';
import { Connector } from '../objects/connector';
import { ShapeAnnotationModel } from '../objects/annotation-model';
import { ShapeStyleModel, ShapeAnnotation, PathPortModel, PathPort, PathModel, PointPort, PointPortModel, StrokeStyleModel, randomId } from '../index';
import { ChildProperty, Collection, Property } from '@syncfusion/ej2-base';
import { PointModel } from '../../diagram/primitives/point-model';
import { UmlSequenceDiagramModel, UmlSequenceParticipantModel, UmlSequenceMessageModel, UmlSequenceFragmentModel, UmlSequenceFragmentConditionModel, UmlSequenceActivationBoxModel } from './sequence-diagram-model';

/**
 * Defines the types of messages used in UML sequence diagrams.
 * Each type determines the style and semantics of the message line.
 */
export enum UmlSequenceMessageType {
    /** A synchronous message, typically a method call that waits for a response. */
    Synchronous = 'Synchronous',

    /** An asynchronous message, such as an event or signal that does not wait for a response. */
    Asynchronous = 'Asynchronous',

    /** A reply message, representing the return from a synchronous call. */
    Reply = 'Reply',

    /** A create message, used to indicate the instantiation of a new participant. */
    Create = 'Create',

    /** A delete message, indicating the termination of a participant's lifeline. */
    Delete = 'Delete',

    /** A self-message, where the sender and receiver are the same participant. */
    Self = 'Self'
}
/**
 * Defines the types of fragments supported in a UML sequence diagram.
 */
export enum UmlSequenceFragmentType {
    /** Represents a conditional alternative (e.g., if/else branches). */
    Alternative = 'Alternative',

    /** Represents a loop fragment (e.g., for, while). */
    Loop = 'Loop',

    /** Represents an optional interaction (e.g., an optional message flow). */
    Optional = 'Optional'
}
enum MermaidConnectorType {
    Solid = 'Solid',
    Dashed = 'Dashed',
    SolidArrow = 'SolidArrow',
    DashedArrow = 'DashedArrow',
    Bidirectional = 'Bidirectional',
    DashedBidirectional = 'DashedBidirectional',
    OpenArrow = 'OpenArrow',
    DashedOpenArrow = 'DashedOpenArrow'
}
//#region UmlSequenceDiagram

/**
 * Represents an activation box (focus of control) in the UML sequence diagram.
 * Activation boxes indicate the duration a participant is actively processing messages.
 */
export class UmlSequenceActivationBox extends ChildProperty<UmlSequenceActivationBox> {

    /**
     * A unique identifier for the activation box.
     * @default undefined
     */
    @Property(undefined)
    public id: string | number;

    /**
     * The ID of the message that marks the start of the activation.
     * This must match the `id` of a message defined in the model.
     *
     * @default undefined
     */
    @Property(undefined)
    public startMessageID: string | number;

    /**
     * The ID of the message that marks the end of the activation.
     * This must match the `id` of a message defined in the model.
     *
     * @default undefined
     */
    @Property(undefined)
    public endMessageID: string | number;
}

/**
 * Represents a participant (lifeline) in the UML sequence diagram.
 * A participant can be an actor or object involved in message exchanges.
 */
export class UmlSequenceParticipant extends ChildProperty<UmlSequenceParticipant> {

    /**
     * @private
     * @default 100
     */
    public width: number = 100;
    /**
     * @private
     * @default 100
     */
    public height: number = 50;

    /**
     * A unique identifier for the participant.
     *
     * This ID is used to reference the participant in messages and other diagram elements.
     *
     * @default undefined
     */
    @Property(undefined)
    public id: string | number;

    /**
     * The display content of the participant (e.g., class name or actor label).
     *
     * @default ''
     */
    @Property('')
    public content: string;

    /**
     * Indicates whether the participant is an actor.
     *
     * If `true`, the participant is rendered using an actor (stick figure) symbol.
     * If `false`, the participant is rendered as a rectangle (object lifeline).
     *
     * @default false
     */
    @Property(false)
    public isActor: boolean;

    /**
     * Specifies whether to show a destruction marker (X) at the end of the participant's lifeline.
     *
     * When enabled, the participant is considered to be destroyed at the end of the sequence.
     *
     * @default false
     */
    @Property(false)
    public showDestructionMarker: boolean;

    /**
     * A list of activation boxes for this participant.
     *
     * Activation boxes represent the time periods during which a participant is active
     * (e.g., executing a method or processing a message).
     *
     * ```typescript
     * activationBoxes: [
     *     { id: 'act1', startMessageID: 'MSG1', endMessageID: 'MSG3' }
     * ]
     * ```
     *
     * @default []
     */
    @Collection<UmlSequenceActivationBoxModel>([], UmlSequenceActivationBox)
    public activationBoxes: UmlSequenceActivationBoxModel[];

}

/**
 * Represents a message (interaction) between two participants in a UML sequence diagram.
 * Messages define the communication flow, such as method calls or replies, between lifelines.
 */
export class UmlSequenceMessage extends ChildProperty<UmlSequenceMessage> {

    /**
     * A unique identifier for the message.
     *
     * @default undefined
     */
    @Property(undefined)
    public id: string | number;

    /**
     * The ID of the participant that sends the message.
     *
     * This should match the `id` of a participant defined in the model.
     *
     * @default undefined
     */
    @Property(undefined)
    public fromParticipantID: string | number;

    /**
     * The ID of the participant that receives the message.
     *
     * This should match the `id` of a participant defined in the model.
     *
     * @default undefined
     */
    @Property(undefined)
    public toParticipantID: string | number;

    /**
     * Defines the text content or label displayed for the message in the sequence diagram.
     * This typically represents a operation name, or descriptive response.
     *
     * @default ''
     */
    @Property('')
    public content: string;

    /**
     * Specifies the type of the message, such as synchronous, asynchronous, reply, etc.
     * Determines how the message line is styled and interpreted in the diagram.
     *
     * @default UmlSequenceMessageType.Synchronous
     */
    @Property('Synchronous')
    public type: UmlSequenceMessageType;
}


/**
 * Represents a single condition within a UML sequence fragment.
 * Each condition includes a description and references to the messages or sub-fragments it controls.
 */
export class UmlSequenceFragmentCondition extends ChildProperty<UmlSequenceFragmentCondition> {

    /**
     * The textual description of the condition (e.g., a Boolean expression or case label).
     *
     * @default ''
     */
    @Property('')
    public content: string;

    /**
     * The IDs of messages that are included under this condition.
     *
     * @default []
     */
    @Property([])
    public messageIds: (string | number)[];

    /**
     * The IDs of nested fragments that are included under this condition.
     *
     * @default undefined
     */
    @Property(undefined)
    public fragmentIds: string[];
}
/**
 * Represents a fragment in a UML sequence diagram.
 * Fragments define conditional or grouped interactions, such as alternatives or loops.
 */
export class UmlSequenceFragment extends ChildProperty<UmlSequenceFragment> {

    /**
     * A unique identifier for the fragment.
     *
     * @default undefined
     */
    @Property(undefined)
    public id: string | number;

    /**
     * Specifies the type of the fragment, such as 'Alternative', 'Loop', or 'Optional'.
     *
     * Determines how the fragment is interpreted and rendered in the diagram.
     *
     * @default UmlSequenceFragmentType.Optional
     */
    @Property('Optional')
    public type: UmlSequenceFragmentType;

    /**
     * Defines the conditions and corresponding message/fragment references associated with this fragment.
     *
     * Each condition can represent a branch or case in the fragment (e.g., if-else, loop iteration).
     *
     * ```typescript
     * conditions: [
     *   {
     *     content: 'Condition 1',
     *     messageIds: ['MSG1', 'MSG2'],
     *     fragmentIds: ['frag2']
     *   }
     * ]
     * ```
     *
     * @default []
     */
    @Collection<UmlSequenceFragmentConditionModel>([], UmlSequenceFragmentCondition)
    public conditions: UmlSequenceFragmentConditionModel[];
}
/**
 * Defines the model for the diagram.
 */
export class UmlSequenceDiagram extends ChildProperty<UmlSequenceDiagram> {

    //#region Fields
    /**
     * @private
     */
    public diagram: Diagram;
    /**
     * @private
     */
    public mermaidData: string;
    /**
     * @private
     */
    public isLoadedFromMermaid: boolean = false;
    /**
     * @private
     */
    public hideFootBox: boolean = true;
    /**
     * @private
     */
    public activationWidth: number = 20;
    /**
     * @private
     */
    public initialLifelineLength: number = 100;
    /**
     * @private
     */
    public messageSpacing: number = 50;
    /**
     * @private
     */
    public participantWidth: number = 100;
    /**
     * @private
     */
    public participantHeight: number = 50;
    /**
     * @private
     */
    public margin: number = 0;

    //#endregion

    //#region Properties

    /**
     * Defines the list of participants involved in the UML sequence diagram.
     * Each participant represents a lifeline, such as an actor or an object, that sends or receives messages.
     *
     * ```typescript
     * participants: [
     *     {
     *         id: 'User',
     *         content: 'User',
     *         width: 100,
     *         height: 50,
     *         showDestructionMarker: true,
     *         isActor: true,
     *         activationBoxes: [
     *             { id: 'act1', startMessageID: 'MSG1', endMessageID: 'MSG3' }
     *         ]
     *     },
     *     {
     *         id: 'Server',
     *         content: 'Server',
     *         width: 100,
     *         height: 50,
     *         showDestructionMarker: true,
     *         isActor: false,
     *         activationBoxes: [
     *             { id: 'act2', startMessageID: 'MSG1', endMessageID: 'MSG3' }
     *         ]
     *     }
     * ]
     * ```
     *
     * @aspDefaultValueIgnore
     * @default []
     */
    @Collection<UmlSequenceParticipantModel>([], UmlSequenceParticipant)
    public participants: UmlSequenceParticipantModel[];

    /**
     * Defines the list of messages exchanged between participants in the UML sequence diagram.
     * Messages represent interactions such as method calls or responses between lifelines.
     *
     * ```typescript
     * messages: [
     *     {
     *         id: 'MSG1',
     *         content: 'User sends request',
     *         fromParticipantID: 'User',
     *         toParticipantID: 'Server'
     *     },
     *     {
     *         id: 'MSG2',
     *         content: 'Processing',
     *         fromParticipantID: 'Server',
     *         toParticipantID: 'Server'
     *     },
     *     {
     *         id: 'MSG3',
     *         content: 'Server sends response',
     *         fromParticipantID: 'Server',
     *         toParticipantID: 'User'
     *     }
     * ]
     * ```
     *
     * @aspDefaultValueIgnore
     * @default []
     */
    @Collection<UmlSequenceMessageModel>([], UmlSequenceMessage)
    public messages: UmlSequenceMessageModel[];

    /**
     * Defines the interaction fragments in the UML sequence diagram.
     * Fragments are used to group messages under specific control structures such as loops, alternatives, or options.
     *
     * ```typescript
     * fragments: [
     *     {
     *         id: 'frag1',
     *         type: 'Optional',
     *         conditions: [
     *             {
     *                 content: 'Interactions',
     *                 messageIds: ['MSG1', 'MSG2', 'MSG3']
     *             }
     *         ]
     *     }
     * ]
     * ```
     *
     * @aspDefaultValueIgnore
     * @default []
     */
    @Collection<UmlSequenceFragmentModel>([], UmlSequenceFragment)
    public fragments: UmlSequenceFragmentModel[];

    /**
     * Defines the horizontal spacing between each participant (lifeline) in the UML sequence diagram.
     *
     * This spacing determines how far apart the participant boxes are placed,
     * which affects the overall layout and readability of the diagram.
     *
     * ```typescript
     * const model: UmlSequenceDiagramModel = {
     *     spaceBetweenParticipants: 120,
     *     participants: [ ... ],
     *     messages: [ ... ],
     *     fragments: [ ... ]
     * };
     * ```
     *
     * - A higher value increases the distance between participants.
     * - A lower value makes participants appear closer together.
     *
     * @default 100
     */
    @Property(100)
    public spaceBetweenParticipants: number;

    //#endregion
    private model: SequenceDiagramModel;
    /**
     *
     * @param {string} mermaidText - mermaid text
     * @param {Diagram} diagram - diagram
     * @returns {void}
     * @private
     */
    public parse(mermaidText: string, diagram: Diagram): void{
        this.diagram = diagram;

        this.diagram.clear();
        LifeLineRenderer.clearLifelines();
        MessageRenderer.clearMessages();

        const parser: MermaidUmlParser = new MermaidUmlParser(diagram);
        this.model = parser.parse(mermaidText);
        this.isLoadedFromMermaid = true;
    }
    /**
     * Positon nodes and Connect connectors to draw sequence diagram
     * based on internal model SequenceDiagramModel object obtained from mermaid data
     * @param {string} mermaidText - mermaid data
     * @param {Diagram} diagram - Diagram
     * @returns {void}
     * @private
     */
    public loadDiagramFromMermaid(mermaidText: string, diagram: Diagram): void {
        const sequenceDiagramRenderer: SequenceDiagramRenderer = new SequenceDiagramRenderer(diagram);
        sequenceDiagramRenderer.render(this.model, this);
        this.mermaidData = mermaidText;
    }
    /**
     * Generates mermaid data from the sequence diagram
     * @returns {string} - mermaid data
     * @private
     */
    public generateMermaidFromModel(): string{
        const mermaidGenerator: MermaidGenerator = new MermaidGenerator();
        const mermaidText: string = mermaidGenerator.generateMermaidText(this);
        return mermaidText;
    }
    /**
     * Updates the sequence diagram at runtime.
     * @param {Diagram} diagram - Diagram instance
     * @returns {void}
     * @private
     */
    public updateUmlSequenceDiagram(diagram: Diagram): void {
        if (!this.diagram) {
            this.diagram = diagram;
        }
        this.diagram.clear();
        LifeLineRenderer.clearLifelines();
        MessageRenderer.clearMessages();

        this.model = new SequenceDiagramModel(this.diagram);
        this.model.isLoadedFromMermaid = false;

        this.model.updateParticipants(this.participants);
        this.model.updateMessages(this.messages);
        this.model.updateActivations(this.participants);
        this.model.updateFragments(this.fragments);
    }
    /**
     * update activations and fragments after nodes & connector initialization
     * @returns {void}
     * @private
     */
    public render(): void {
        const sequenceDiagramRenderer: SequenceDiagramRenderer = new SequenceDiagramRenderer(this.diagram);
        sequenceDiagramRenderer.render(this.model, this);
        this.isLoadedFromMermaid = false;
    }
}

//#endregion

//#region SequenceDiagramModel
class SequenceDiagramModel {
    // Properties
    /**
     * @private
     */
    public participants: Map<string, Node>;
    /**
     * @private
     */
    public messages: Connector[];
    /**
     * @private
     */
    public activations: ActivationModel[];
    /**
     * @private
     */
    public fragments: FragmentModel[];
    /**
     * @private
     */
    public affectedParticipants: string[];
    /**
     * @private
     */
    public destroyedParticipants: string[];
    /**
     * @private
     */
    public destroyAtEndParticipants: string[];
    /**
     * @private
     */
    public maxParticipantWidth: number = 100;
    /**
     * @private
     */
    public maxParticipantHeight: number = 50;
    /**
     * @private
     */
    public isLoadedFromMermaid: boolean = false;
    private aliases: Map<string, string>;
    private diagram: Diagram;

    constructor(diagram?: Diagram) {
        this.diagram = diagram;
        UMLHelperClass.clearMessageMapping();

        this.participants = new Map<string, Node>();
        this.messages = [];
        this.activations = [];
        this.fragments = [];
        this.affectedParticipants = [];
        this.destroyedParticipants = [];
        this.destroyAtEndParticipants = [];
        this.aliases = new Map<string, string>();
    }

    // Helper Methods
    /**
     * @param {Node} participant - participant node
     * @returns {void}
     * @private
     */
    public addParticipant(participant: Node): void {
        // Add default color
        UMLHelperClass.updateNodeColor(participant, '#6495ED'); // cornflowerblue
        this.diagram.nodes.push(participant);
        this.participants.set(participant.id, participant);
        this.addLifeLine(participant);
    }
    /**
     * @param {Node} participant - participant node
     * @returns {void}
     * @private
     */
    public addLifeLine(participant: Node): void{
        const lifeline: Connector = new Connector(this.diagram, 'connectors', { id: `${participant.id}_Lifeline` });
        UMLHelperClass.updateConnectorStyles(lifeline, 'Dashed');
        this.diagram.connectors.push(lifeline);
        // set participant name as key and lifeline connector as its value
        LifeLineRenderer.lifelines.set(participant.id, lifeline);
    }
    /**
     * @param {Connector} message - message connector
     * @returns {void}
     * @private
     */
    public addMessage(message: Connector): void {
        this.diagram.connectors.push(message);
        this.messages.push(message);
    }
    /**
     * @param {ActivationModel} activation - ActivationModel
     * @returns {void}
     * @private
     */
    public addActivation(activation: ActivationModel): void {
        // Add default color
        UMLHelperClass.updateNodeColor(activation.node, '#6495ED'); // cornflowerblue
        this.diagram.nodes.push(activation.node);
        // Add to the list of activations
        this.activations.push(activation);
    }

    /**
     * @param {FragmentModel} fragment - FragmentModel
     * @returns {void}
     * @private
     */
    public addFragment(fragment: FragmentModel): void {
        if (fragment.node) {
            this.diagram.nodes.push(fragment.node);
        }
        this.fragments.push(fragment);
    }

    /**
     * @param {string} alias - alias
     * @param {string} name - name
     * @returns {void}
     * @private
     */
    public addAlias(alias: string, name: string): void {
        this.aliases.set(alias, name);
    }

    /**
     * @param {UmlSequenceParticipantModel} participants - Participant model collection
     * @returns {void}
     * @private
     */
    public updateParticipants(participants: UmlSequenceParticipantModel[]): void {
        this.participants.clear();

        let maxParticipantWidth: number = 0;
        let maxParticipantHeight: number = 0;

        for (const participant of participants as UmlSequenceParticipant[]) {
            if (!participant.id) {
                console.warn('[WARNING] :: Participant ID cannot be undefined.');
                continue;
            }
            const participantNode: Node = new Node(this.diagram, 'nodes', {
                id: participant.id.toString(),
                width: participant.width,
                height: participant.height,
                data: participant
            }, true);
            UMLHelperClass.updateNodeShape(participantNode, participant.isActor);
            UMLHelperClass.updateAnnotation(participantNode, participant.content, participant.isActor);

            if (participant.showDestructionMarker) {
                this.destroyAtEndParticipants.push(participant.id.toString());
            }

            this.addParticipant(participantNode);

            // Calculate max width and height
            if (participant.width > maxParticipantWidth) {
                maxParticipantWidth = participant.width;
            }

            if (participant.height > maxParticipantHeight) {
                maxParticipantHeight = participant.height;
            }
        }

        this.maxParticipantWidth = maxParticipantWidth;
        this.maxParticipantHeight = maxParticipantHeight;
    }

    /**
     * @param {UmlSequenceMessageModel[]} messages - Message model collection
     * @returns {void}
     * @private
     */
    public updateMessages(messages: UmlSequenceMessageModel[]): void {
        this.messages = [];
        this.affectedParticipants = [];

        for (const message of messages) {
            if (!message.id) {
                console.warn('[WARNING] :: Message ID cannot be undefined.');
                continue;
            }
            let sourceParticipant: Node = null;
            let targetParticipant: Node = null;

            if (message.type === UmlSequenceMessageType.Self) {
                // For self message, even if one of the participant id is null, then we can render based on the other participant's id
                sourceParticipant = this.getNodeFromId(message.fromParticipantID || message.toParticipantID);
                targetParticipant = sourceParticipant;
            }
            else {
                sourceParticipant = this.getNodeFromId(message.fromParticipantID);
                targetParticipant = this.getNodeFromId(message.toParticipantID);
            }

            if (!(sourceParticipant && targetParticipant)) {
                continue;
            }
            const connector: Connector = new Connector(this.diagram, 'connectors',
                                                       { id: message.id.toString() });

            UMLHelperClass.addOrUpdateParticipantDetails(connector, sourceParticipant.id,
                                                         targetParticipant.id, message.type, null);

            UMLHelperClass.updateConnectorStyles(connector, message.type.toString());
            UMLHelperClass.updateAnnotation(connector as Connector, message.content);

            if (message.type === UmlSequenceMessageType.Create) {
                UMLHelperClass.addOrUpdateParticipantDetails(connector, sourceParticipant.id,
                                                             targetParticipant.id, UmlSequenceMessageType.Create,
                                                             message.toParticipantID.toString());

                this.affectedParticipants.push(message.toParticipantID.toString());
            }
            else if (message.type === UmlSequenceMessageType.Delete) {
                UMLHelperClass.addOrUpdateParticipantDetails(connector, sourceParticipant.id,
                                                             targetParticipant.id, UmlSequenceMessageType.Delete,
                                                             message.toParticipantID.toString());

                if (this.affectedParticipants.indexOf(message.toParticipantID.toString()) === -1) {
                    this.affectedParticipants.push(message.toParticipantID.toString());
                }

                // storing for footbox rendering
                this.destroyedParticipants.push(message.toParticipantID.toString());
            }

            this.addMessage(connector);
        }
    }

    /**
     * @param {UmlSequenceParticipantModel[]} participants - Participant model collection
     * @returns {void}
     * @private
     */
    public updateActivations(participants: UmlSequenceParticipantModel[]): void {
        this.activations = [];
        for (const participant of participants) {
            if (participant.id && participant.activationBoxes && participant.activationBoxes.length > 0) {
                for (const activation of participant.activationBoxes) {
                    if (activation.startMessageID && activation.endMessageID) {
                        const node: Node = this.getNodeFromId(participant.id);
                        const activationID: string = activation.id ? activation.id.toString() : randomId();

                        const activationNode: Node = new Node(this.diagram, 'nodes', {
                            id: `${node.id}_Activation_${activationID}`,
                            minHeight: 10, minWidth: 10,
                            data: activation
                        });

                        UMLHelperClass.updateNodeShape(activationNode, false);

                        const activationConnector: Connector = this.getConnectorFromId(activation.startMessageID);
                        const deactivationConnector: Connector = this.getConnectorFromId(activation.endMessageID);

                        if (activationConnector && deactivationConnector) {
                            const activationDetails: SequenceMessageDetails = UMLHelperClass.getParticipantDetails(activationConnector);
                            const deactivationDetails: SequenceMessageDetails = UMLHelperClass.getParticipantDetails(deactivationConnector);

                            const activate: ConnectorDetails = new ConnectorDetails(activationConnector.id,
                                                                                    activationDetails.sourceParticipantName,
                                                                                    activationDetails.targetParticipantName,
                                                                                    UMLHelperClass.getAnnotation(activationConnector),
                                                                                    0);
                            const deactivate: ConnectorDetails = new ConnectorDetails(deactivationConnector.id,
                                                                                      deactivationDetails.sourceParticipantName,
                                                                                      deactivationDetails.targetParticipantName,
                                                                                      UMLHelperClass.getAnnotation(deactivationConnector),
                                                                                      0);
                            const activationModel: ActivationModel = new ActivationModel(activationNode, node.id,
                                                                                         activate,
                                                                                         deactivate,
                                                                                         0);
                            this.addActivation(activationModel);
                        }
                        else {
                            console.warn('[WARNING] :: Activation or deactivation connector details not found.');
                        }
                    }
                }
            }
        }
    }

    /**
     * @param {UmlSequenceFragmentModel[]} fragments - Fragment model collection
     * @returns {void}
     * @private
     */
    public updateFragments(fragments: UmlSequenceFragmentModel[]): void {
        this.fragments = [];
        for (const fragment of fragments) {
            if (!fragment.id) {
                console.warn('[WARNING] :: Fragment ID cannot be null.');
                continue;
            }
            const fragmentModel: FragmentModel = this.processFragment(fragment);
            // Remove fragments that are part of the current fragment's child fragments
            this.removeChildFragmentsFromCollection(fragmentModel);
            this.addFragment(fragmentModel);
        }
    }
    private removeChildFragmentsFromCollection(fragment: FragmentModel): void {
        for (const childFragment of fragment.childFragments) {
            const index: number = this.fragments.indexOf(childFragment);
            if (index !== -1) {
                this.fragments.splice(index, 1);
            }
            // Recursively remove nested child fragments
            this.removeChildFragmentsFromCollection(childFragment);
        }
    }
    private processFragment(fragment: UmlSequenceFragmentModel): FragmentModel {
        const fragmentModel: FragmentModel = new FragmentModel(fragment.id.toString(), fragment.type, [], [],
                                                               new Node(this.diagram, 'nodes', { id: fragment.id.toString() + '_Fragment',
                                                                   data: fragment, shape: {type: 'Path'},
                                                                   style: { fill: 'transparent', strokeColor: '#000000', strokeWidth: 1 } }),
                                                               0);

        for (const condition of fragment.conditions) {
            const conditionModel: ConditionModel = new ConditionModel(condition.content, [], [], new AlternativeBlockDetails());
            if (condition.fragmentIds) {
                for (const subFragment of condition.fragmentIds) {
                    const childFragmentModel: FragmentModel = this.fragments.find((item: FragmentModel) => item.id === subFragment);
                    if (childFragmentModel) {
                        conditionModel.nestedFragments.push(childFragmentModel);
                        fragmentModel.childFragments.push(childFragmentModel);
                    }
                    else {
                        console.warn('[WARNING] :: Please ensure that all child fragments are defined in the collection before their respective parent fragments.');
                    }
                }
            }

            this.processSequenceMessageIds(conditionModel, condition.messageIds);

            if (fragment.type === UmlSequenceFragmentType.Alternative) {
                this.populateConditionAltBlockDetails(conditionModel);
            }

            fragmentModel.conditions.push(conditionModel);
        }

        return fragmentModel;
    }

    private populateConditionAltBlockDetails(condition: ConditionModel): void {
        for (const connector of condition.connectors) {
            const exists: boolean = condition.altBlockDetails.connectors.some((existingConnector: ConnectorWithFragmentDetails) =>
                existingConnector.id === connector.id
            );

            if (!exists) {
                condition.altBlockDetails.connectors.push(new ConnectorWithFragmentDetails(connector.id, connector.source,
                                                                                           connector.target, connector.message, -1,
                                                                                           '', false, -1));
            }
        }

        for (const childFragment of condition.nestedFragments) {
            this.addChildFragmentConnectors(condition, childFragment);
        }
    }

    private addChildFragmentConnectors(condition: ConditionModel, childFragment: FragmentModel): void {
        for (const childCondition of childFragment.conditions) {
            for (const connector of childCondition.connectors) {
                const exists: boolean = condition.altBlockDetails.connectors.some((existingConnector: ConnectorWithFragmentDetails) =>
                    existingConnector.id === connector.id
                );

                if (!exists) {
                    condition.altBlockDetails.connectors.push(new ConnectorWithFragmentDetails(connector.id, connector.source,
                                                                                               connector.target, connector.message,
                                                                                               -1, childFragment.id.toString(), true, -1));
                }
            }

            for (const nestedChildFragment of childCondition.nestedFragments) {
                this.addChildFragmentConnectors(condition, nestedChildFragment);
            }
        }
    }

    private processSequenceMessageIds(conditionModel: ConditionModel, sequenceMessageIds: (string | number)[]): void {
        for (const id of sequenceMessageIds) {
            if (id !== undefined && id !== '') {
                this.processConnector(conditionModel, id);
            }
        }
    }

    private processConnector(conditionModel: ConditionModel, id: string | number): void {
        const connector: Connector = this.getConnectorFromId(id);
        if (connector) {
            const details: SequenceMessageDetails = UMLHelperClass.getParticipantDetails(connector);
            const connectorDetails: ConnectorDetails = new ConnectorDetails(
                connector.id.toString(),
                details.sourceParticipantName,
                details.targetParticipantName,
                UMLHelperClass.getAnnotation(connector as Connector),
                0
            );
            conditionModel.connectors.push(connectorDetails);
        }
    }

    private getNodeFromId(participantId: string | number): Node | null{
        let participantNode: Node;
        if (participantId) {
            if (this.participants.has(participantId.toString())) {
                participantNode = this.participants.get(participantId.toString());
            }
            else {
                console.warn('[WARNING] :: Participant \'' + participantId.toString() + '\' not found.');
            }
        }
        else {
            console.warn('[WARNING] :: ParticipantID is null.');
        }
        return participantNode;
    }

    private getConnectorFromId(messageId: string | number): Connector | null {
        const message: Connector = this.messages.find((connector: Connector) =>
            connector.id.toString() === messageId.toString()
        );
        if (!message) {
            console.warn('[WARNING] :: Message ID \'' + messageId.toString() + '\' is not found.');
        }
        return message;
    }
}
class UMLHelperClass {
    private static messageMapping: Map<Connector, SequenceMessageDetails> = new Map<Connector, SequenceMessageDetails>();

    /**
     * @param {Connector} connector - message connector
     * @param {string} sourceName - source participant id
     * @param {string} targetName - target participant id
     * @param {UmlSequenceMessageType} type - sequence message type
     * @param {string} affectedParticipants - id of participant created/destroyed by message
     * @returns {void}
     * @private
     */
    public static addOrUpdateParticipantDetails(connector: Connector, sourceName: string, targetName: string, type: UmlSequenceMessageType,
                                                affectedParticipants: string): void {
        const details: SequenceMessageDetails = new SequenceMessageDetails(sourceName, targetName, affectedParticipants, type);
        this.messageMapping.set(connector, details);
    }

    /**
     * @param {Connector} connector - message connectors
     * @returns {SequenceMessageDetails} - sequence message details
     * @private
     */
    public static getParticipantDetails(connector: Connector): SequenceMessageDetails {
        return this.messageMapping.get(connector);
    }

    /**
     * @returns {void}
     * @private
     */
    public static clearMessageMapping(): void {
        this.messageMapping.clear();
    }

    /**
     * @param {Node|Connector} ele - element to provide annotations
     * @param {string} value - annotation content
     * @param {boolean} isActor - is Actor or Participant
     * @returns {void}
     * @private
     */
    public static updateAnnotation(ele: Node | Connector, value: string, isActor?: boolean): void {
        const annoContent: string = value.trim();
        // Node
        if (ele instanceof Node) {
            ele.annotations = [{
                content: annoContent,
                horizontalAlignment: 'Center'
            }];
            if (isActor) {
                const actorAnnotation: ShapeAnnotationModel = ele.annotations[0];
                actorAnnotation.style.textWrapping = 'NoWrap';
                actorAnnotation.offset = { x: 0.5, y: 1 };
                actorAnnotation.margin = { left: 0, top: 6, right: 0, bottom: 0 };
            }
        }
        // Connector
        else {
            ele.annotations = [{
                content: annoContent,
                style: { textWrapping: 'NoWrap' },
                margin: { left: 0, top: -10, right: 0, bottom: 0 },
                rotationReference: 'Page'
            }];
        }
    }

    /**
     * @param {Node|Connector} ele - element to fetch annotation from.
     * @returns {string} - annotation content
     * @private
     */
    public static getAnnotation(ele: Node | Connector): string {
        return ele.annotations[0].content;
    }

    /**
     * @param {Node} node - node to update the shape.
     * @param {boolean} isActor - true if node is actor, false otherwise.
     * @returns {void}
     * @private
     */
    public static updateNodeShape(node: Node, isActor: boolean): void {
        if (isActor) {
            node.shape = { type: 'Path', data: actor };
        }
        else {
            node.shape = { type: 'Path', data: rectangle };
        }
    }

    /**
     * @param {Node} node - node to check whether its a actor shape.
     * @returns {boolean} whether node is actor shaped.
     * @private
     */
    public static isActor(node: Node): boolean {
        const shape: PathModel = node.shape as PathModel;
        if (shape.type === 'Path' && shape.data === actor) {
            return true;
        }
        return false;
    }

    /**
     * @param {Node} node - node to update the color.
     * @param {string} color - color to be filled with.
     * @returns {void}
     * @private
     */
    public static updateNodeColor(node: Node, color: string): void {
        node.style = {
            fill: color,
            strokeColor: '#000000',
            strokeWidth: 1
        };
    }

    /**
     * @param {Connector} connector - connector to update the styles.
     * @param {string} connectorType - connector type
     * @returns {void}
     * @private
     */
    public static updateConnectorStyles(connector: Connector, connectorType: string): void {
        connector.segments = [{ type: 'Straight' }];

        // Define decorator style
        const decoratorStyle: ShapeStyleModel = {
            fill: 'black',
            strokeColor: 'black',
            strokeWidth: 1
        };
        connector.sourceDecorator = { shape: 'None', style: decoratorStyle };
        connector.targetDecorator = { shape: 'None', style: decoratorStyle };

        // Define line styles
        const solidStyle: StrokeStyleModel = {
            strokeColor: 'black',
            strokeWidth: 1
        };

        const dashedStyle: StrokeStyleModel = {
            strokeColor: 'black',
            strokeWidth: 1,
            strokeDashArray: '5,5'
        };
        // Try to parse as MermaidConnectorType
        if (this.isMermaidConnectorType(connectorType)) {
            switch (connectorType) {
            case 'Solid':
                connector.style = solidStyle;
                break;
            case 'Dashed':
                connector.style = dashedStyle;
                break;
            case 'SolidArrow':
                connector.style = solidStyle;
                connector.targetDecorator.shape = 'Arrow';
                break;
            case 'DashedArrow':
                connector.style = dashedStyle;
                connector.targetDecorator.shape = 'Arrow';
                break;
            case 'Bidirectional':
                connector.style = solidStyle;
                connector.sourceDecorator.shape = 'Arrow';
                connector.targetDecorator.shape = 'Arrow';
                break;
            case 'DashedBidirectional':
                connector.style = dashedStyle;
                connector.sourceDecorator.shape = 'Arrow';
                connector.targetDecorator.shape = 'Arrow';
                break;
            case 'OpenArrow':
                connector.style = solidStyle;
                connector.targetDecorator.shape = 'OpenArrow';
                break;
            case 'DashedOpenArrow':
                connector.style = dashedStyle;
                connector.targetDecorator.shape = 'OpenArrow';
                break;
            }
        }
        // Try to parse as UmlSequenceMessageType
        else if (this.isUmlSequenceMessageType(connectorType)) {
            switch (connectorType) {
            case 'Synchronous':
                connector.style = solidStyle;
                connector.targetDecorator.shape = 'Arrow';
                break;

            case 'Asynchronous':
                connector.style = solidStyle;
                connector.targetDecorator.shape = 'OpenArrow';
                break;

            case 'Create':
                connector.style = solidStyle;
                connector.targetDecorator.shape = 'OpenArrow';
                break;

            case 'Delete':
                connector.style = solidStyle;
                connector.targetDecorator.shape = 'Arrow';
                break;

            case 'Reply':
                connector.style = dashedStyle;
                connector.targetDecorator.shape = 'OpenArrow';
                break;

            case 'Self':
                connector.type = 'Orthogonal';
                // creating custom segments
                connector.segments = [
                    {
                        type: 'Orthogonal',
                        length: 20, direction: 'Left'
                    },
                    {
                        type: 'Orthogonal',
                        length: 50, direction: 'Bottom'
                    },
                    {
                        type: 'Orthogonal',
                        length: 20, direction: 'Right'
                    }
                ];
                connector.style = solidStyle;
                connector.targetDecorator.shape = 'Arrow';
                break;
            }
        }
    }


    /**
     * @param {Node} node - node to remove connectable constraints
     * @returns {void}
     * @private
     */
    public static removeConnectableConstraintForNode(node: Node): void {
        if (node) {
            // Remove the Connectable constraint
            node.constraints = NodeConstraints.Default & ~(NodeConstraints.InConnect | NodeConstraints.OutConnect);
        }
    }


    private static isMermaidConnectorType(type: string): boolean {
        const mermaidTypes: string[] = [
            'Solid', 'Dashed', 'SolidArrow', 'DashedArrow',
            'Bidirectional', 'DashedBidirectional', 'OpenArrow', 'DashedOpenArrow'
        ];
        return mermaidTypes.indexOf(type) !== -1;
    }

    private static isUmlSequenceMessageType(type: string): boolean {
        const umlTypes: string[] = [
            'Synchronous', 'Asynchronous', 'Create', 'Delete', 'Reply', 'Self'
        ];
        return umlTypes.indexOf(type) !== -1;
    }
}


class ActivationModel {
    private _node: Node = null;
    /**
     * @private
     */
    public get node(): Node {
        return this._node;
    }
    /**
     * @param {Node} value - activation node
     * @private
     */
    public set node(value: Node) {
        this._node = value;
        this._node.annotations = null;
        UMLHelperClass.removeConnectableConstraintForNode(this._node);
    }

    /**
     * @private
     */
    public participantName: string;
    /**
     * @private
     */
    public depth: number;
    /**
     * @private
     */
    public activateConnectorDetails: ConnectorDetails;
    /**
     * @private
     */
    public deactivateConnectorDetails: ConnectorDetails;
    constructor(node: Node, participantName: string, activationConnectorDetails: ConnectorDetails,
                deactivateConnectorDetails: ConnectorDetails, depth?: number) {
        this.node = node;
        this.participantName = participantName;
        this.activateConnectorDetails = activationConnectorDetails;
        this.deactivateConnectorDetails = deactivateConnectorDetails;
        this.depth = depth;
    }
}
class ConnectorDetails {
    /**
     * @private
     */
    public id: string = '';
    /**
     * @private
     */
    public index: number = -1;
    /**
     * @private
     */
    public source: string = '';
    /**
     * @private
     */
    public target: string = '';
    /**
     * @private
     */
    public message: string = '';
    constructor(id: string, source: string, target: string, message: string, index: number) {
        this.id = id;
        this.index = index;
        this.source = source;
        this.target = target;
        this.message = message;
    }
}
class FragmentModel {
    private _node: Node;
    /**
     * @private
     */
    public get node(): Node {
        return this._node;
    }
    /**
     * @param {Node} value - node
     * @private
     */
    public set node(value: Node) {
        this._node = value;
        UMLHelperClass.removeConnectableConstraintForNode(this._node);
    }
    /**
     * @private
     */
    public id: string = '';
    /**
     * @private
     */
    public type: UmlSequenceFragmentType;
    /**
     * @private
     */
    public conditions: ConditionModel[] = [];
    /**
     * @private
     */
    public depth: number = 0;
    /**
     * @private
     */
    public index: number = 0;
    /**
     * @private
     */
    public childFragments: FragmentModel[] = [];
    /**
     * @private
     */
    public fragmentStartIndex: number;
    /**
     * @private
     */
    public fragmentEndIndex: number;

    constructor(id: string, type: UmlSequenceFragmentType, conditions: ConditionModel[], childFragments: FragmentModel[],
                node?: Node, index?: number, depth?: number) {
        this.id = id;
        this.type = type;
        this.conditions = conditions;
        this.childFragments = childFragments;
        this.node = node;
        this.index = index;
        this.depth = depth;
        this.fragmentStartIndex = -1;
        this.fragmentEndIndex = -1;
    }
}
class ConditionModel {
    /**
     * @private
     */
    public content: string = '';
    /**
     * @private
     */
    public connectors: ConnectorDetails[] = [];
    /**
     * @private
     */
    public altBlockDetails: AlternativeBlockDetails = new AlternativeBlockDetails();
    /**
     * @private
     */
    public nestedFragments: FragmentModel[] = [];
    /**
     * @private
     */
    public conditionStartIndex: number = -1;
    /**
     * @private
     */
    public conditionEndIndex: number = -1;

    constructor(content: string, nestedFragments: FragmentModel[], connectors: ConnectorDetails[],
                altBlockDetails: AlternativeBlockDetails) {
        this.content = content;
        this.nestedFragments = nestedFragments;
        this.connectors = connectors;
        this.altBlockDetails = altBlockDetails;
    }
}
class AlternativeBlockDetails {
    /**
     * @private
     */
    public connectors: ConnectorWithFragmentDetails[] = [];
}
class ConnectorWithFragmentDetails extends ConnectorDetails {
    /**
     * @private
     */
    public fragmentID: string = '';
    /**
     * @private
     */
    public inFragment: boolean = false;
    /**
     * @private
     */
    public fragmentIndex: number = -1;
    constructor(id: string, source: string, target: string, message: string, index: number, fragmentID?: string,
                inFragment?: boolean, fragmentIndex?: number) {
        super(id, source, target, message, index);
        this.fragmentID = fragmentID;
        this.inFragment = inFragment;
        this.fragmentIndex = fragmentIndex;
    }
}
class SequenceMessageDetails {
    /**
     * @private
     */
    public sourceParticipantName: string;
    /**
     * @private
     */
    public targetParticipantName: string;
    /**
     * @private
     */
    public affectedParticipantName: string;
    /**
     * @private
     */
    public messageType: UmlSequenceMessageType;

    constructor(sourceName: string, targetName: string, affectedParticipants: string, type: UmlSequenceMessageType) {
        this.sourceParticipantName = sourceName;
        this.targetParticipantName = targetName;
        this.affectedParticipantName = affectedParticipants;
        this.messageType = type;
    }
}
//#endregion

//#region Renderer
class SequenceDiagramRenderer {
    private readonly diagram: Diagram;

    constructor(diagram?: Diagram) {
        this.diagram = diagram;
    }
    /**
     *
     * @param {SequenceDiagramModel} model - orchestrates the model api for rendering the sequence diagram.
     * @param {UmlSequenceDiagram} settings - model api
     * @returns {void}
     * @private
     */
    public render(model: SequenceDiagramModel, settings: UmlSequenceDiagram): void {
        // Resetting message spacing to default, each time the diagram is rendered
        settings.messageSpacing = 50;

        ParticipantRenderer.render(this.diagram, model, settings);
        MessageRenderer.render(this.diagram, model, settings);
        for (let i: number = 0; i < this.diagram.nodes.length; i++) {
            const node: Node = this.diagram.nodes[parseInt(i.toString(), 10)] as Node;
            this.diagram.preventNodesUpdate = true;
            this.diagram.nodePropertyChange(node, {} as Node, {
                offsetX: node.offsetX, offsetY: node.offsetY, width: node.width, height: node.height,
                annotations: node.annotations, ports: node.ports
            } as Node, true);
            this.diagram.preventNodesUpdate = false;
        }
        for (let i: number = 0; i < this.diagram.connectors.length; i++) {
            const connector: Connector = this.diagram.connectors[parseInt(i.toString(), 10)] as Connector;
            this.diagram.preventConnectorsUpdate = true;
            this.diagram.connectorPropertyChange(connector, {} as Connector, {
                sourcePoint: connector.sourcePoint, targetPoint: connector.targetPoint,
                sourceID: connector.sourceID, targetID: connector.targetID,
                sourcePortID: connector.sourcePortID, targetPortID: connector.targetPortID,
                sourcePadding: connector.sourcePadding, targetPadding: connector.targetPadding,
                sourceDecorator: connector.sourceDecorator, targetDecorator: connector.targetDecorator,
                annotations: connector.annotations, ports: connector.ports, constraints: connector.constraints,
                segments: connector.segments
            } as Connector, true);
            this.diagram.preventConnectorsUpdate = false;
        }
        ActivationRenderer.render(this.diagram, model, settings);
        FragmentRenderer.render(this.diagram, model, settings);
    }
}

//#region ParticipantRenderer
class ParticipantRenderer {
    private static diagram: Diagram;
    private static model: SequenceDiagramModel;
    private static settings: UmlSequenceDiagram;

    /**
     * @param {Diagram} diagram - diagram
     * @param {SequenceDiagramModel} model - orchestrates the model api for rendering the sequence diagram.
     * @param {UmlSequenceDiagram} settings - model api
     * @returns {void}
     * @private
     */
    public static render(diagram: Diagram, model: SequenceDiagramModel, settings: UmlSequenceDiagram): void {
        this.diagram = diagram;
        this.model = model;
        this.settings = settings;

        const participants: Node[] = [];
        model.participants.forEach((participant: Node, id: string) => participants.push(participant));

        // Updating Size for all Participants
        this.updateParticipantsSize(participants);

        const margin: PointModel = this.getUpdatedMargin();

        let currentX: number = settings.margin + margin.x;

        for (let i: number = 0; i < participants.length; i++) {
            const participant: Node = participants[parseInt(i.toString(), 10)];

            // Updating Offset for Participant
            participant.offsetX = currentX;
            participant.offsetY = settings.margin + margin.y;

            // Getting next participant width for calculating horizontal spacing
            let nextParticipantWidth: number = 0;
            if (i < participants.length - 1) {
                const nextParticipant: Node = participants[i + 1];

                if (UMLHelperClass.isActor(nextParticipant) && model.isLoadedFromMermaid) {
                    this.resizeWithAspectRatio(nextParticipant, model.maxParticipantHeight);
                }

                nextParticipantWidth = nextParticipant.width > 0 ? nextParticipant.width : this.model.maxParticipantWidth;
            }

            // Updating the position for next participant based on horizontal spacing
            currentX += (participant.width / 2) + settings.spaceBetweenParticipants + (nextParticipantWidth / 2);

            // Render Lifeline for Participant
            LifeLineRenderer.render(diagram, model, participant, settings as UmlSequenceDiagram);
        }
    }

    private static updateParticipantsSize(participants: Node[]): void {
        for (const participant of participants) {
            if (UMLHelperClass.isActor(participant)) {
                // update annotation offset for actor
                const actorAnnotation: ShapeAnnotationModel = participant.annotations[0];
                actorAnnotation.style.textWrapping = 'NoWrap';
                actorAnnotation.offset = { x: 0.5, y: 1 };
                actorAnnotation.margin = { left: 0, top: 6, right: 0, bottom: 0 };

                if (this.model.isLoadedFromMermaid) {
                    this.resizeWithAspectRatio(participant, this.model.maxParticipantHeight);
                } else {
                    this.resizeWithAspectRatio(participant, 50);
                }
            }
            else {
                if (!(participant.width > 0)) {
                    participant.width = this.model.maxParticipantWidth;
                }
                if (!(participant.height > 0)) {
                    participant.height = this.model.maxParticipantHeight;
                }
            }
        }
    }

    private static resizeWithAspectRatio(participant: Node, targetWidth: number): void {
        const originalWidth: number = 60.0;  // Initial width
        const originalHeight: number = 90.0; // Initial height
        const aspectRatio: number = originalHeight / originalWidth;

        participant.width = targetWidth;
        participant.height = participant.width * aspectRatio;
    }

    private static getUpdatedMargin(): PointModel {
        let firstParticipantMaxHalfWidth: number = 0;
        let maxHalfHeight: number = 0;
        let isFirstParticipant: boolean = true;

        this.model.participants.forEach((participant: Node, id: string) => {
            const halfWidth: number = participant.width / 2;
            const halfHeight: number = participant.height / 2;

            // Capture the full width of the first participant
            if (isFirstParticipant) {
                firstParticipantMaxHalfWidth = participant.width / 2;
                isFirstParticipant = false;
            }

            if (halfHeight > maxHalfHeight) {
                maxHalfHeight = halfHeight;
            }
        });
        return { x: firstParticipantMaxHalfWidth, y: maxHalfHeight };
    }
}
//#endregion

//#region MessageRenderer
class MessageRenderer {
    private static diagram: Diagram;
    private static model: SequenceDiagramModel;
    private static settings: UmlSequenceDiagram;
    private static messageLayouts: MessageLayoutInfo[] = [];

    /**
     * @param {Diagram} diagram - diagram.
     * @param {SequenceDiagramModel} model - orchestrates the model api for rendering the sequence diagram.
     * @param {UmlSequenceDiagram} settings - model api
     * @returns {void}
     * @private
     */
    public static render(diagram: Diagram, model: SequenceDiagramModel, settings: UmlSequenceDiagram): void {
        this.diagram = diagram;
        this.model = model;
        this.settings = settings;

        // 1) Baseline pass: assign naive Y positions for each message
        this.messageLayouts = [];
        this.model.participants.forEach((participant: Node, id: string) => {
            if (participant.height > model.maxParticipantHeight) {
                model.maxParticipantHeight = participant.height;
            }
        });

        let currentY: number = settings.messageSpacing + model.maxParticipantHeight;

        this.adjustMessageSpacing(model, settings);

        for (let i: number = 0; i < model.messages.length; i++) {
            const message: Connector = model.messages[parseInt(i.toString(), 10)];
            currentY = this.storeLayoutInfo(currentY, message);
            currentY += settings.messageSpacing;
        }

        // 2) Multi-pass fragment layout: apply nested fragment spacing, alt conditions, etc.
        FragmentLayoutCalculator.adjustMessagePositionsForFragments(model, this.messageLayouts, settings.messageSpacing);

        // 3) Compute final lifeline length from the updated message positions
        const finalLifelineLength: number = this.calculateRequiredLifelineLength();

        // 4) Update each participant with this final lifeline length
        this.model.participants.forEach((participant: Node, id: string) => {
            LifeLineRenderer.updateLifelineLength(participant, finalLifelineLength);
        });

        // 5) Handle create/destroy offsets if needed
        this.updateCreateMessage();
        this.updateDestroyMessage();

        // 6) Render messages onto lifelines using their final Y positions
        this.renderMessagesOnLifeline();
    }

    private static adjustMessageSpacing(model: SequenceDiagramModel, settings: UmlSequenceDiagram): void {
        // Compute the base Y position for the first message
        let baseMessageSpacing: number = settings.messageSpacing;
        if (model.maxParticipantHeight > 100) {
            // Increase message spacing proportionally based on participant height
            baseMessageSpacing += (model.maxParticipantHeight - 100) * 0.5;
        }

        // Ensure message spacing does not go below the default value
        this.settings.messageSpacing = Math.max(baseMessageSpacing, settings.messageSpacing);
    }

    private static storeLayoutInfo(currentY: number, message: Connector): number {
        this.messageLayouts.push(new MessageLayoutInfo(message.id.toString(), currentY, message));

        if (this.isSelfMessage(message)) {
            currentY += this.settings.messageSpacing;
        }
        if (this.isCreateMessage(message)) {
            currentY += this.settings.messageSpacing / 2;
        }
        return currentY;
    }

    private static calculateRequiredLifelineLength(): number {
        // If there are no messages at all, return top + bottom padding.
        if (!this.messageLayouts || this.messageLayouts.length === 0) {
            return this.getTopAndBottomPadding();
        }

        // Find the maximum Y-position among all messages (after fragment layout).
        let maxY: number = 0;
        for (const layoutInfo of this.messageLayouts) {
            if (layoutInfo.yPosition > maxY) {
                maxY = layoutInfo.yPosition;
            }
        }

        // Add a bottom padding so the lifeline extends below the last message.
        const bottomPadding: number = this.settings.messageSpacing;
        return maxY + bottomPadding;
    }

    private static getTopAndBottomPadding(): number {
        return 2 * (this.settings.messageSpacing + this.model.maxParticipantHeight);
    }

    private static isSelfMessage(message: Connector): boolean {
        const details: SequenceMessageDetails = UMLHelperClass.getParticipantDetails(message);

        if (details) {
            return details.sourceParticipantName === details.targetParticipantName;
        } else {
            return false;
        }
    }

    private static isCreateMessage(message: Connector): boolean {
        const details: SequenceMessageDetails = UMLHelperClass.getParticipantDetails(message);
        return details && details.messageType === UmlSequenceMessageType.Create;
    }

    private static updateCreateMessage(): void {
        for (const message of this.model.messages) {
            const details: SequenceMessageDetails = UMLHelperClass.getParticipantDetails(message);
            if (details && details.messageType === UmlSequenceMessageType.Create) {
                let affectedNode: Node;
                if (details.affectedParticipantName && this.model.participants.has(details.affectedParticipantName)) {
                    affectedNode = this.model.participants.get(details.affectedParticipantName)!;
                    const layoutInfo: MessageLayoutInfo = this.messageLayouts.find((ml: MessageLayoutInfo) =>
                        ml.messageID === message.id.toString());
                    if (layoutInfo) {
                        affectedNode.offsetY = layoutInfo.yPosition;
                        LifeLineRenderer.updateLifelinePosition(affectedNode, layoutInfo.yPosition);
                    }
                }
            }
        }
    }

    private static updateDestroyMessage(): void {
        for (const message of this.model.messages) {
            const details: SequenceMessageDetails = UMLHelperClass.getParticipantDetails(message);
            if (details && details.messageType === UmlSequenceMessageType.Delete) {
                let affectedNode: Node;
                if (details.affectedParticipantName && this.model.participants.has(details.affectedParticipantName)) {
                    affectedNode = this.model.participants.get(details.affectedParticipantName)!;
                    const layoutInfo: MessageLayoutInfo = this.messageLayouts.find((ml: MessageLayoutInfo) =>
                        ml.messageID === message.id.toString());

                    if (layoutInfo) {
                        LifeLineRenderer.updateLifelineToDestroy(affectedNode, message, layoutInfo.yPosition);
                    }
                }
            }
        }
    }

    /**
     * @returns {void}
     * @private
     */
    public static renderMessagesOnLifeline(): void {
        LifeLineRenderer.clearPorts();
        for (const layout of this.messageLayouts) {
            const message: Connector = layout.connector;
            const details: SequenceMessageDetails = UMLHelperClass.getParticipantDetails(message);

            if (details) {
                const senderLifeline: Connector = this.getLifeline(this.model.participants, details.sourceParticipantName);
                const receiverLifeline: Connector = this.getLifeline(this.model.participants, details.targetParticipantName);

                if (this.isSelfMessage(message)) {
                    this.renderSelfMessage(senderLifeline, message, layout.yPosition);
                } else {
                    this.renderNormalMessage(senderLifeline, receiverLifeline, message, layout.yPosition);
                }
            }
        }
    }

    private static renderNormalMessage(sender: Connector, receiver: Connector, message: Connector, messageY: number): void {
        const senderPort: PathPortModel = this.createPort(sender, messageY);
        const receiverPort: PathPortModel = this.createPort(receiver, messageY);

        this.applyActivationPadding(senderPort, message, messageY, true);
        this.applyActivationPadding(receiverPort, message, messageY, false);

        this.assignPortOrPoint(message, senderPort, sender, messageY, true);
        this.assignPortOrPoint(message, receiverPort, receiver, messageY, false);
    }

    private static renderSelfMessage(lifeline: Connector, message: Connector, messageY: number): void {
        // Create ports at the current Y coordinate and one spacing below for self-messages.
        const firstPort: PathPortModel = this.createPort(lifeline, messageY);
        const secondPort: PathPortModel = this.createPort(lifeline, messageY + this.settings.messageSpacing);

        this.applyActivationPadding(firstPort, message, messageY, true);
        this.applyActivationPadding(secondPort, message, messageY + this.settings.messageSpacing, false);
        message.type = 'Orthogonal';
        message.segments = [
            { type: 'Orthogonal', length: 20, direction: 'Left' },
            { type: 'Orthogonal', length: 50, direction: 'Bottom' },
            { type: 'Orthogonal', length: 20, direction: 'Right' }
        ];
        this.assignPortOrPoint(message, firstPort, lifeline, messageY, true);
        this.assignPortOrPoint(message, secondPort, lifeline, messageY, false);
    }

    private static applyActivationPadding(port: PathPortModel, message: Connector, messageY: number, isFirstPort: boolean): void {
        const details: SequenceMessageDetails = UMLHelperClass.getParticipantDetails(message);
        if (details && this.model.activations) {
            const participantName: string = isFirstPort ? details.sourceParticipantName : details.targetParticipantName;
            if (this.isWithinActivation(participantName, messageY, message)) {
                if (isFirstPort) {
                    // connector source point considers the port height while providing padding
                    message.sourcePadding = this.settings.activationWidth / 2 - port.height / 2;
                }
                else {
                    // connector target point considers the port height while providing padding
                    message.targetPadding = this.settings.activationWidth / 2 - port.height / 2;
                }
            }
        }
    }

    private static isWithinActivation(participantName: string, messageY: number, message: Connector): boolean {
        // Get the index of the current message.
        const currentIndex: number = this.model.messages.findIndex((connector: Connector) =>
            connector.id.toString() === message.id.toString());
        if (currentIndex === -1) { return false; }

        for (const activation of this.model.activations) {
            if (activation.participantName === participantName &&
                activation.activateConnectorDetails &&
                activation.deactivateConnectorDetails) {
                // Find the start and end indices for this activation.
                const startIndex: number = this.model.messages.findIndex((con: Connector) =>
                    con.id.toString() === activation.activateConnectorDetails.id);
                const endIndex: number = this.model.messages.findIndex((con: Connector) =>
                    con.id.toString() === activation.deactivateConnectorDetails.id);

                if (startIndex !== -1 && endIndex !== -1) {
                    const details: SequenceMessageDetails =
                        UMLHelperClass.getParticipantDetails(this.model.messages[parseInt(startIndex.toString(), 10)]);
                    // if message is a self message, and if message is located at start, then don't apply port padding
                    if (details && details.sourceParticipantName === details.targetParticipantName && currentIndex === startIndex) {
                        return false;
                    }
                    if (currentIndex >= startIndex && currentIndex <= endIndex) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private static createPort(lifeline: Connector, yPosition: number): PathPortModel {
        const lifelineSourceY: number = this.getLifelineSourceY(lifeline);
        const lifelineLength: number = this.calculateLifelineLength(lifeline, lifelineSourceY);
        let lengthFraction: number = this.calculateLengthFraction(yPosition, lifelineSourceY, lifelineLength);
        lengthFraction = lengthFraction > 1 ? 1 : lengthFraction;
        const port: PathPort = new PathPort(this.diagram, 'ports', { id: randomId(), offset: lengthFraction });

        this.addPortToLifeline(lifeline, port);

        return port;
    }

    private static assignPortOrPoint(message: Connector, port: PathPortModel, lifeLine: Connector, y: number, isSource: boolean): void {
        const x: number = lifeLine.sourcePoint.x;
        // If port length is greater than 1, then assign the point.
        if (port.offset === 1) {
            if (isSource) {
                message.sourcePoint = { x: x, y: y };
            } else {
                message.targetPoint = { x: x, y: y };
            }
        } else {
            if (isSource) {
                message.sourceID = lifeLine.id;
                message.sourcePortID = port.id;
            } else {
                // If it's a create message, then connect to the participant directly instead of the port.
                const messageDetails: SequenceMessageDetails = UMLHelperClass.getParticipantDetails(message);

                const isCreateMessageForAffectedParticipant: boolean =
                    messageDetails && messageDetails.messageType === UmlSequenceMessageType.Create &&
                    messageDetails.affectedParticipantName &&
                    messageDetails.targetParticipantName === messageDetails.affectedParticipantName;

                if (isCreateMessageForAffectedParticipant) {
                    let affectedParticipantNode: Node;
                    if (this.model.participants.has(messageDetails.affectedParticipantName)) {
                        affectedParticipantNode = this.model.participants.get(messageDetails.affectedParticipantName)!;
                        message.targetID = affectedParticipantNode.id;
                        // set zero to prevent padding infulences the message target point
                        message.targetPadding = 0;
                    }
                }

                if (!message.targetID) {
                    message.targetID = lifeLine.id;
                    message.targetPortID = port.id;
                }
            }
        }
    }

    private static addPortToLifeline(lifeline: Connector, port: PathPortModel): void {
        this.diagram.addPorts(lifeline, [port]);
        this.diagram.protectPropertyChange(true);
    }

    private static getLifelineSourceY(lifeline: Connector): number {
        return lifeline.sourcePoint.y;
    }

    private static calculateLifelineLength(lifeline: Connector, lifelineSourceY: number): number {
        return lifeline.targetPoint.y - lifelineSourceY;
    }

    private static calculateLengthFraction(yPosition: number, lifelineSourceY: number, lifelineLength: number): number {
        return (yPosition - lifelineSourceY) / lifelineLength;
    }

    private static getLifeline(participants: Map<string, Node>, participantName: string): Connector | null {
        return LifeLineRenderer.lifelines.get(participantName);
    }

    /**
     * @returns {void}
     * @private
     */
    public static clearMessages(): void {
        this.messageLayouts = [];
    }
}

class MessageLayoutInfo {
    /**
     * @private
     */
    public messageID: string;
    /**
     * @private
     */
    public yPosition: number;
    /**
     * @private
     */
    public connector: Connector;

    constructor(messageID: string, yPosition: number, connector: Connector) {
        this.messageID = messageID;
        this.yPosition = yPosition;
        this.connector = connector;
    }
}
class FragmentLayoutCalculator {

    /**
     * @param {SequenceDiagramModel} model - orchestrates the model api for rendering the sequence diagram.
     * @param {MessageLayoutInfo} messageLayouts - message connector with y position details.
     * @param {number} headerSpacing - header spacing
     * @returns {void}
     * @private
     */
    public static adjustMessagePositionsForFragments(model: SequenceDiagramModel, messageLayouts: MessageLayoutInfo[],
                                                     headerSpacing: number): void {
        // 1) Precompute the message index range for each fragment
        for (const fragment of model.fragments) {
            this.computeFragmentMessageRange(fragment, model);
        }

        // 2) Flatten all fragments (including nested)
        const allFragments: FragmentModel[] = [];
        this.collectAllFragments(model.fragments, allFragments);

        // 3) Sort them by start index so we shift in ascending order
        allFragments.sort((f1: FragmentModel, f2: FragmentModel) => f1.fragmentStartIndex - f2.fragmentStartIndex);

        // Extra spacing parameters
        const openingSpaceFactor: number = 1.5; // Parent fragments get more space
        const closingSpaceFactor: number = 0.7; // Smaller gap after the fragment
        const altConditionFactor: number = 0.8; // Gap between alt condition blocks

        // 4) For each fragment in ascending order, shift messages
        for (const fragment of allFragments) {
            // Skip if fragment has no messages
            if (fragment.fragmentStartIndex < 0) { continue; }

            const isParent: boolean = fragment.childFragments && fragment.childFragments.length > 0;
            const fragmentOpeningSpace: number = isParent ? (headerSpacing * openingSpaceFactor) : headerSpacing;
            const fragmentClosingSpace: number = headerSpacing * closingSpaceFactor;

            // 4a) Shift from the fragment's start index (opening gap)
            this.shiftMessages(messageLayouts, fragment.fragmentStartIndex, fragmentOpeningSpace);

            // 4b) Shift from the fragment's end index + 1 (closing gap),
            // but only if endIndex is in range
            if (fragment.fragmentEndIndex >= 0 && fragment.fragmentEndIndex + 1 < messageLayouts.length) {
                this.shiftMessages(messageLayouts, fragment.fragmentEndIndex + 1, fragmentClosingSpace);
            }

            // 5) If it's an alt fragment, also handle alt condition spacing
            if (fragment.type === UmlSequenceFragmentType.Alternative) {
                // For each condition, compute conditionStartIndex & conditionEndIndex
                for (const cond of fragment.conditions) {
                    this.computeConditionMessageRange(cond, model);
                }

                // Sort conditions by their start index
                const sortedConditions: ConditionModel[] = fragment.conditions
                    .filter((condition: ConditionModel) => condition.conditionStartIndex >= 0)
                    .sort((a: ConditionModel, b: ConditionModel) => a.conditionStartIndex - b.conditionStartIndex);

                // For each condition after the first, add spacing so they don't overlap
                const altConditionSpacing: number = headerSpacing * altConditionFactor;
                for (let i: number = 1; i < sortedConditions.length; i++) {
                    const condStart: number = sortedConditions[parseInt(i.toString(), 10)].conditionStartIndex;
                    if (condStart >= 0 && condStart < messageLayouts.length) {
                        this.shiftMessages(messageLayouts, condStart, altConditionSpacing);
                    }
                }
            }
        }
    }

    private static collectAllFragments(source: FragmentModel[], result: FragmentModel[]): void {
        for (const frag of source) {
            result.push(frag);
            if (frag.childFragments && frag.childFragments.length > 0) {
                this.collectAllFragments(frag.childFragments, result);
            }
        }
    }

    private static computeFragmentMessageRange(fragment: FragmentModel, model: SequenceDiagramModel): void {
        let minIndex: number = Number.MAX_SAFE_INTEGER;
        let maxIndex: number = Number.MIN_SAFE_INTEGER;

        // 1) Gather this fragment’s own connectors
        for (const condition of fragment.conditions) {
            for (const connector of condition.connectors) {
                const idx: number = model.messages.findIndex((connector1: Connector) => connector1.id.toString() === connector.id);
                if (idx >= 0 && idx < minIndex) { minIndex = idx; }
                if (idx > maxIndex) { maxIndex = idx; }
            }
        }

        // 2) Recurse for each child fragment
        for (const child of fragment.childFragments) {
            this.computeFragmentMessageRange(child, model);

            // Incorporate child's start/end into the parent's range
            if (child.fragmentStartIndex >= 0) {
                if (child.fragmentStartIndex < minIndex) { minIndex = child.fragmentStartIndex; }
            }
            if (child.fragmentEndIndex > maxIndex) { maxIndex = child.fragmentEndIndex; }
        }

        // 3) If no connectors found, set to -1
        if (minIndex === Number.MAX_SAFE_INTEGER) { minIndex = -1; }
        if (maxIndex === Number.MIN_SAFE_INTEGER) { maxIndex = -1; }

        fragment.fragmentStartIndex = minIndex;
        fragment.fragmentEndIndex = maxIndex;
    }

    private static computeConditionMessageRange(condition: ConditionModel, model: SequenceDiagramModel): void {
        let minIndex: number = Number.MAX_SAFE_INTEGER;
        let maxIndex: number = Number.MIN_SAFE_INTEGER;

        for (const connector of condition.connectors) {
            const idx: number = model.messages.findIndex((connector1: Connector) => connector1.id.toString() === connector.id);
            if (idx < 0) { continue; }
            if (idx < minIndex) { minIndex = idx; }
            if (idx > maxIndex) { maxIndex = idx; }
        }

        if (minIndex === Number.MAX_SAFE_INTEGER) { minIndex = -1; }
        if (maxIndex === Number.MIN_SAFE_INTEGER) { maxIndex = -1; }

        condition.conditionStartIndex = minIndex;
        condition.conditionEndIndex = maxIndex;
    }

    private static shiftMessages(messageLayouts: MessageLayoutInfo[], startIndex: number, offset: number): void {
        if (offset === 0) { return; }
        for (let i: number = startIndex; i < messageLayouts.length; i++) {
            messageLayouts[parseInt(i.toString(), 10)].yPosition += offset;
        }
    }
}
//#endregion

//#region ActivationRenderer
class ActivationRenderer {
    // Fields
    private static diagram: Diagram;
    private static model: SequenceDiagramModel;
    private static settings: UmlSequenceDiagram;

    // Helper Methods
    /**
     * @param {Diagram} diagram - diagram instance
     * @param {SequenceDiagramModel} model - orchestrates the model api for rendering the sequence diagram.
     * @param {UmlSequenceDiagram} settings - model api
     * @returns {void}
     * @private
     */
    public static render(diagram: Diagram, model: SequenceDiagramModel, settings: UmlSequenceDiagram): void {
        this.diagram = diagram;
        this.model = model;
        this.settings = settings;

        for (const activation of model.activations) {
            this.renderActivation(activation);
        }
    }

    private static renderActivation(activation: ActivationModel): void {
        const matchingTopConnector: Connector = this.model.messages.find((connector: Connector) => {
            const details: SequenceMessageDetails = UMLHelperClass.getParticipantDetails(connector);
            return connector.id != null &&
                connector.id === activation.activateConnectorDetails.id.toString() &&
                details != null &&
                details.sourceParticipantName === activation.activateConnectorDetails.source &&
                details.targetParticipantName === activation.activateConnectorDetails.target &&
                UMLHelperClass.getAnnotation(connector) === activation.activateConnectorDetails.message;
        });

        const matchingBottomConnector: Connector = this.model.messages.find((connector: Connector) => {
            const details: SequenceMessageDetails = UMLHelperClass.getParticipantDetails(connector);
            return connector.id != null &&
                connector.id === activation.deactivateConnectorDetails.id.toString() &&
                details != null &&
                details.sourceParticipantName === activation.deactivateConnectorDetails.source &&
                details.targetParticipantName === activation.deactivateConnectorDetails.target &&
                UMLHelperClass.getAnnotation(connector) === activation.deactivateConnectorDetails.message;
        });

        const participant: Node = this.getParticipantByName(activation.participantName);

        // Update the activation node based on the connector's points
        const sourcePoint: PointModel = matchingTopConnector ?
            { x: matchingTopConnector.sourcePoint.x, y: matchingTopConnector.sourcePoint.y } : { x: 0, y: 0 };
        const targetPoint: PointModel = matchingBottomConnector ?
            { x: matchingBottomConnector.targetPoint.x, y: matchingBottomConnector.targetPoint.y } : { x: 0, y: 0 };

        activation.depth = this.calculateActivationDepth(activation, sourcePoint, targetPoint);

        const details: SequenceMessageDetails = UMLHelperClass.getParticipantDetails(matchingTopConnector);
        if (details) {
            // if message is self type then render activations from target point
            if (details.sourceParticipantName === details.targetParticipantName) {
                sourcePoint.y = matchingTopConnector.targetPoint.y;
            }
            else if (details.messageType === UmlSequenceMessageType.Create &&
                details.targetParticipantName === activation.participantName) {
                // if activation is rendered from a self message, then provide 5px gap from the participant
                sourcePoint.y += (participant.height / 2) + (UMLHelperClass.isActor(participant) ? 15 : 5);
            }
        }

        const activationNode: Node = activation.node;
        activationNode.offsetX = participant.offsetX + (activation.depth * (this.settings.activationWidth / 4));
        activationNode.offsetY = sourcePoint.y + (targetPoint.y - sourcePoint.y) / 2;
        activationNode.width = this.settings.activationWidth;
        activationNode.height = Math.abs(sourcePoint.y - targetPoint.y);
        activationNode.zIndex = -100 + activation.activateConnectorDetails.index;
        this.diagram.preventNodesUpdate = true;
        this.diagram.nodePropertyChange(activationNode, {} as Node, {
            offsetX: activationNode.offsetX, offsetY: activationNode.offsetY, width: activationNode.width, height: activationNode.height
        } as Node, true);
        this.diagram.preventNodesUpdate = false;
    }

    private static calculateActivationDepth(activation: ActivationModel, sourcePoint: PointModel, targetPoint: PointModel): number {
        const overlappingActivations: ActivationModel[] = this.model.activations
            .filter((a: ActivationModel) => a.participantName === activation.participantName &&
                a !== activation &&
                this.isOverlapping(activation, a))
            .sort((a: ActivationModel, b: ActivationModel) => a.activateConnectorDetails.index - b.activateConnectorDetails.index);

        let depth: number = 0;

        for (const act of overlappingActivations) {
            const actStart: number = this.getStartPoint(act);

            // Only adjust if this activation is below the overlapping activation
            if (sourcePoint.y > actStart) {
                depth++;
            }
        }

        return depth;
    }

    private static isOverlapping(current: ActivationModel, other: ActivationModel): boolean {
        const currentStart: number = this.getStartPoint(current);
        const currentEnd: number = this.getEndPoint(current);
        const otherStart: number = this.getStartPoint(other);
        const otherEnd: number = this.getEndPoint(other);

        // Check if there is any overlap in the vertical range
        return currentStart < otherEnd && otherStart < currentEnd;
    }

    private static getStartPoint(activation: ActivationModel): number {
        const message: Connector = this.model.messages
            .find((m: Connector) => m.id.toString() === activation.activateConnectorDetails.id.toString());
        return message ? message.sourcePoint.y : 0;
    }

    private static getEndPoint(activation: ActivationModel): number {
        const message: Connector = this.model.messages
            .find((m: Connector) => m.id.toString() === activation.deactivateConnectorDetails.id.toString());
        return message ? message.targetPoint.y : 0;
    }

    private static getParticipantByName(participantName: string): Node {
        if (this.model.participants.has(participantName)) {
            return this.model.participants.get(participantName);
        }
        return null;
    }
}
//#endregion

//#region FragmentRenderer
class FragmentRenderer {
    // Fields
    private static diagram: Diagram;
    private static model: SequenceDiagramModel;
    private static settings: UmlSequenceDiagram;

    // Helper Methods
    /**
     * @param {Diagram} diagram - diagram instance
     * @param {SequenceDiagramModel} model - orchestrates the model api for rendering the sequence diagram.
     * @param {UmlSequenceDiagram} settings - model api.
     * @returns {void}
     * @private
     */
    public static render(diagram: Diagram, model: SequenceDiagramModel, settings: UmlSequenceDiagram): void {
        this.diagram = diagram;
        this.model = model;
        this.settings = settings;

        for (const fragment of model.fragments) {
            this.renderFragment(fragment);
        }
    }

    private static renderFragment(fragment: FragmentModel): void {
        for (const childFragment of fragment.childFragments) {
            this.renderFragment(childFragment);
        }

        switch (fragment.type) {
        case UmlSequenceFragmentType.Optional:
        case UmlSequenceFragmentType.Loop:
            this.renderGeneralFragment(fragment);
            break;
        case UmlSequenceFragmentType.Alternative:
            this.renderAlternativeFragment(fragment);
            break;
        }
    }

    private static renderGeneralFragment(fragment: FragmentModel): void {
        for (const condition of fragment.conditions) {
            const boundary: Rect = this.calculateFragmentBoundary(condition, fragment);

            if (boundary && boundary.width !== 0 && boundary.height !== 0) {
                this.createFragmentNode(fragment, condition.content, boundary);
                const fragmentNode: Node = fragment.node;
                this.diagram.preventNodesUpdate = true;
                this.diagram.nodePropertyChange(fragmentNode, {shape: {type: 'Path'}} as Node, {shape: fragmentNode.shape} as Node, true);
                this.diagram.preventNodesUpdate = false;
            }
        }
    }

    private static renderAlternativeFragment(fragment: FragmentModel): void {
        const boundary: Rect = this.calculateAltFragmentBoundary(fragment);

        if (boundary && boundary.width !== 0 && boundary.height !== 0) {
            this.createFragmentNode(fragment, fragment.conditions[0].content, boundary);
            const fragmentNode: Node = fragment.node;
            this.updateAlternativeFragmentShape(fragment, fragmentNode);
            this.diagram.preventNodesUpdate = true;
            this.diagram.nodePropertyChange(fragmentNode, {shape: {type: 'Path'}} as Node, {shape: fragmentNode.shape} as Node, true);
            this.diagram.preventNodesUpdate = false;
        }
    }

    private static updateAlternativeFragmentShape(fragment: FragmentModel, fragmentNode: Node): void {
        const nodeUpdatedBoundary: Rect = fragmentNode.wrapper.bounds;
        let fragmentShape: string = this.getAlternateFragmentShape(nodeUpdatedBoundary);

        fragmentShape = this.appendConditionDottedLines(fragment, fragmentNode, nodeUpdatedBoundary, fragmentShape);
        fragmentNode.shape = { type: 'Path', data: fragmentShape };
    }

    private static getAlternateFragmentShape(nodeUpdatedBoundary: Rect): string {
        const rectWidth: number = nodeUpdatedBoundary.width;
        const rectHeight: number = nodeUpdatedBoundary.height;

        const taperWidth: number = 40;
        const taperHeight: number = 19.7;
        const midTaperHeight: number = taperHeight / 2;
        const taperControlOffset: number = taperWidth * 0.19;

        // 1) Main bounding rectangle
        const boundingRect: string =
            'M ' + nodeUpdatedBoundary.x + ' ' + nodeUpdatedBoundary.y + ' ' +
            'L ' + (nodeUpdatedBoundary.x + rectWidth) + ' ' + nodeUpdatedBoundary.y + ' ' +
            'L ' + (nodeUpdatedBoundary.x + rectWidth) + ' ' + (nodeUpdatedBoundary.y + rectHeight) + ' ' +
            'L ' + nodeUpdatedBoundary.x + ' ' + (nodeUpdatedBoundary.y + rectHeight) + ' Z';

        // 2) Taper rectangle at top-left
        const taperRectanglePath: string =
            'M ' + nodeUpdatedBoundary.x + ' ' + nodeUpdatedBoundary.y + ' ' +
            'H ' + (nodeUpdatedBoundary.x + taperWidth) + ' ' +
            'V ' + (nodeUpdatedBoundary.y + midTaperHeight + (taperHeight / 6)) + ' ' +
            'C ' + (nodeUpdatedBoundary.x + taperWidth - taperControlOffset) + ' ' + (nodeUpdatedBoundary.y + taperHeight) + ' ' +
            (nodeUpdatedBoundary.x + taperWidth) + ' ' + (nodeUpdatedBoundary.y + midTaperHeight + (taperHeight / 6)) + ' ' +
            (nodeUpdatedBoundary.x + taperWidth - taperControlOffset) + ' ' + (nodeUpdatedBoundary.y + taperHeight) + ' ' +
            'H ' + nodeUpdatedBoundary.x + ' Z';

        // Subpath #1: boundingRect (fill on)
        // Subpath #2: boundingRect again (fill off)
        // Subpath #3: taperRectanglePath (fill on for the taper region)
        return boundingRect + ' ' + boundingRect + ' ' + taperRectanglePath;
    }

    private static appendConditionDottedLines(fragment: FragmentModel, fragmentNode: Node, boundary: Rect, fragmentShape: string): string {
        for (let i: number = 0; i < fragment.conditions.length - 1; i++) {
            const firstCondition: ConditionModel = fragment.conditions[parseInt(i.toString(), 10)];
            const secondCondition: ConditionModel = fragment.conditions[i + 1];
            let centerY: number = this.calculateCenterYBetweenConditions(firstCondition, secondCondition);
            if (centerY === 0) {
                centerY = boundary.top + (boundary.height / (fragment.conditions.length + 1) * (i + 1));
            }
            fragmentShape += this.createDashedLinePath(fragmentNode, boundary, centerY);
            this.addAnnotationForAlternativeCondition(fragmentNode, centerY, boundary, secondCondition);
        }
        return fragmentShape;
    }

    private static createDashedLinePath(fragmentNode: Node, boundary: Rect, centerY: number): string {
        let dottedLinePath: string = 'M ' + boundary.x + ' ' + centerY + ' ';

        const dashLength: number = 5;
        const spaceBetweenDash: number = 5;

        // Calculate number of dots based on the total width
        const numberOfDots: number = Math.floor(boundary.width / (dashLength + spaceBetweenDash));

        for (let j: number = 0; j < numberOfDots; j++) {
            dottedLinePath += 'l ' + dashLength + ' 0 ';
            dottedLinePath += 'm ' + spaceBetweenDash + ' 0 ';
        }

        return dottedLinePath;
    }

    private static addAnnotationForAlternativeCondition(fragmentNode: Node, centerY: number, boundary: Rect,
                                                        condition: ConditionModel): void {
        const yPoint: number = this.calculateAnnotationYOffset(centerY, fragmentNode.height, boundary.y);

        const annotation: ShapeAnnotationModel = new ShapeAnnotation(fragmentNode, 'annotations', {
            content: '[' + condition.content + ']',
            offset: { x: 0, y: yPoint },
            horizontalAlignment: 'Left',
            margin: { left: 9, top: 15, right: 5, bottom: 5 },
            style: { bold: true }
        });

        this.diagram.addLabels(fragmentNode, [annotation]);
        this.diagram.protectPropertyChange(true);
    }

    private static calculateAnnotationYOffset(centerY: number, totalHeight: number, boundaryTop: number): number {
        const position: number = centerY - boundaryTop;
        const clampedPosition: number = Math.max(0, Math.min(position, totalHeight));

        return clampedPosition / totalHeight;
    }

    private static calculateFragmentBoundary(condition: ConditionModel, fragment: FragmentModel): Rect {
        let messageBoundary: Rect = undefined;
        if (condition.connectors && condition.connectors.length > 0) {
            const messages: Connector[] = this.getMessagesFromConnectorDetails(condition.connectors);
            messageBoundary = this.getBoundaryFromMessages(messages);
        }

        const childBoundary: Rect = this.calculateChildFragmentBoundary(fragment);
        const extraSpace: number = this.model.maxParticipantWidth / 4;

        if (!messageBoundary && !childBoundary) {
            return undefined;
        }

        if (!messageBoundary) {
            // Use child boundary with extra spacing
            const combined: Rect = new Rect(childBoundary.left - extraSpace, childBoundary.top - extraSpace,
                                            childBoundary.width + extraSpace * 2, childBoundary.height + extraSpace * 2);
            return this.adjustCombinedBoundary(combined, messageBoundary, childBoundary);
        }

        if (!childBoundary) {
            return messageBoundary;
        }

        return this.combineBoundaries(messageBoundary, childBoundary);
    }

    private static getBoundaryFromMessages(messages: Connector[]): Rect {
        // 1. Calculate min & max coordinates
        const minCoordinates: PointModel = this.getMinCoordinates(messages);
        const maxCoordinates: PointModel = this.getMaxCoordinates(messages);

        // 2. Check conditions
        const hasTargetNode: boolean = this.hasCreateMessage(messages);
        const hasSelfMessages: boolean = this.hasSelfMessage(messages);

        // 3. Compute base padding
        let paddingX: number = this.model.maxParticipantWidth / 4;
        if (hasTargetNode) {
            paddingX += this.model.maxParticipantWidth / 3;
        }
        if (hasSelfMessages) {
            // Extra horizontal space for self-message loops
            paddingX += this.model.maxParticipantWidth / 6;
        }
        const paddingY: number = this.settings.messageSpacing / 3;

        // 4. Initial boundary dimensions
        const offsetX: number = minCoordinates.x - paddingX;
        const offsetY: number = minCoordinates.y - paddingY;
        let width: number = (maxCoordinates.x - minCoordinates.x) + (2 * paddingX);
        let height: number = (maxCoordinates.y - minCoordinates.y) + (2 * paddingY);

        // 5. Expand boundary if message has a target node
        for (const msg of messages) {
            if (msg.targetID && this.diagram.getObject(msg.targetID) instanceof Node) {
                const targetNode: any = this.diagram.getObject(msg.targetID);
                if (targetNode && targetNode instanceof Node && targetNode.wrapper) {
                    const targetBounds: Rect = targetNode.wrapper.bounds;
                    const nodeRightEdge: number = targetBounds.x + targetBounds.width + paddingX;
                    const nodeBottomEdge: number = targetBounds.y + targetBounds.height + paddingY;

                    width = Math.max(width, nodeRightEdge - offsetX);
                    height = Math.max(height, nodeBottomEdge - offsetY);
                }
            }
        }

        // 6. If the last message is a 'delete', add extra space (25px) for the delete marker
        const lastMessage: Connector = messages[messages.length - 1];
        const lastMessageDetail: SequenceMessageDetails = UMLHelperClass.getParticipantDetails(lastMessage);
        if (lastMessageDetail && lastMessageDetail.messageType === UmlSequenceMessageType.Delete) {
            // We only need extra vertical space to display the 25×25 'X' marker at the end of the lifeline
            height += 25;
        }

        return new Rect(offsetX, offsetY, width, height);
    }

    private static hasSelfMessage(messages: Connector[]): boolean {
        for (const msg of messages) {
            const detail: SequenceMessageDetails = UMLHelperClass.getParticipantDetails(msg);
            if (detail && detail.sourceParticipantName === detail.targetParticipantName) {
                return true;
            }
        }
        return false;
    }

    private static hasCreateMessage(messages: Connector[]): boolean {
        for (const msg of messages) {
            if (msg.targetID && this.diagram.getObject(msg.targetID) instanceof Node) {
                return true;
            }
        }
        return false;
    }

    private static calculateChildFragmentBoundary(fragment: FragmentModel): Rect {
        if (!fragment.childFragments || fragment.childFragments.length === 0) {
            return undefined;
        }

        const childBoundaries: Rect[] = [];
        for (let i: number = 0; i < fragment.childFragments.length; i++) {
            const child: FragmentModel = fragment.childFragments[parseInt(i.toString(), 10)];
            const allConditions: ConnectorDetails[] = [];
            for (let j: number = 0; j < child.conditions.length; j++) {
                const connectors: ConnectorDetails[] = child.conditions[parseInt(j.toString(), 10)].connectors;
                for (let k: number = 0; k < connectors.length; k++) {
                    allConditions.push(connectors[parseInt(k.toString(), 10)]);
                }
            }
            const childMessages: Connector[] = this.getMessagesFromConnectorDetails(allConditions);
            const directChildBoundary: Rect = this.getBoundaryFromMessages(childMessages);
            const nestedChildBoundary: Rect = this.calculateChildFragmentBoundary(child);
            const combined: Rect = this.combineBoundaries(directChildBoundary, nestedChildBoundary);

            if (combined) {
                childBoundaries.push(combined);
            }
        }

        if (childBoundaries.length === 0) {
            return undefined;
        }

        const minLeft: number = Math.min.apply(null, childBoundaries.map(function (rect: Rect): number { return rect.left; }));
        const minTop: number = Math.min.apply(null, childBoundaries.map(function (rect: Rect): number { return rect.top; }));
        const maxRight: number = Math.max.apply(null, childBoundaries.map(function (rect: Rect): number { return rect.right; }));
        const maxBottom: number = Math.max.apply(null, childBoundaries.map(function (rect: Rect): number { return rect.bottom; }));

        return new Rect(minLeft, minTop, maxRight - minLeft, maxBottom - minTop);
    }

    private static combineBoundaries(messageBoundary: Rect, childBoundary: Rect): Rect {
        if (!childBoundary) {
            return messageBoundary;
        }

        const extraSpace: number = this.model.maxParticipantWidth / 4;

        const combined: Rect = new Rect(
            Math.min(messageBoundary.left, childBoundary.left) - extraSpace,
            Math.min(messageBoundary.top, childBoundary.top) - extraSpace,
            Math.max(messageBoundary.right, childBoundary.right) - Math.min(messageBoundary.left, childBoundary.left) + extraSpace * 2,
            Math.max(messageBoundary.bottom, childBoundary.bottom) - Math.min(messageBoundary.top, childBoundary.top) + extraSpace * 2
        );

        return this.adjustCombinedBoundary(combined, messageBoundary, childBoundary);
    }

    private static adjustCombinedBoundary(combined: Rect, messageBoundary: Rect, childBoundary: Rect): Rect {
        const margin: number = this.settings.messageSpacing / 2;
        // If parent's message boundary is missing but we have child boundaries,
        // apply an upward adjustment so that the parent's top is pushed further upward.
        if (!messageBoundary && childBoundary) {
            return new Rect(
                combined.left,
                combined.top - margin,
                combined.width,
                combined.height + margin
            );
        }
        // If both boundaries exist and the parent's top is below the child's top, adjust.
        if (messageBoundary && childBoundary && messageBoundary.top > childBoundary.top) {
            return new Rect(
                combined.left,
                combined.top - margin,
                combined.width,
                combined.height + margin
            );
        }
        return combined;
    }
    private static getMinCoordinates(messages: Connector[]): PointModel {
        let minX: number = Number.POSITIVE_INFINITY;
        let minY: number = Number.POSITIVE_INFINITY;
        for (let i: number = 0; i < messages.length; i++) {
            const connector: Connector = messages[parseInt(i.toString(), 10)];
            const x: number = Math.min(connector.sourcePoint.x, connector.targetPoint.x);
            const y: number = Math.min(connector.sourcePoint.y, connector.targetPoint.y);
            if (x < minX) { minX = x; }
            if (y < minY) { minY = y; }
        }
        return { x: minX, y: minY };
    }

    private static getMaxCoordinates(messages: Connector[]): PointModel {
        let maxX: number = Number.NEGATIVE_INFINITY;
        let maxY: number = Number.NEGATIVE_INFINITY;
        for (let i: number = 0; i < messages.length; i++) {
            const connector: Connector = messages[parseInt(i.toString(), 10)];
            const x: number = Math.max(connector.sourcePoint.x, connector.targetPoint.x);
            const y: number = Math.max(connector.sourcePoint.y, connector.targetPoint.y);
            if (x > maxX) { maxX = x; }
            if (y > maxY) { maxY = y; }
        }
        return { x: maxX, y: maxY };
    }

    private static calculateAltFragmentBoundary(fragment: FragmentModel): Rect {
        const connectors: ConnectorDetails[] =
            [].concat(...fragment.conditions.map(function (condition: ConditionModel): ConnectorDetails[] {
                return condition.connectors;
            }));
        let messageBoundary: Rect = undefined;

        if (connectors.length > 0) {
            const messages: Connector[] = this.getMessagesFromConnectorDetails(connectors);
            messageBoundary = this.getBoundaryFromMessages(messages);
        }

        const childBoundary: Rect = this.calculateChildFragmentBoundary(fragment);
        const extraSpace: number = this.model.maxParticipantWidth / 4;

        if (!messageBoundary && !childBoundary) {
            return undefined;
        }

        if (!messageBoundary) {
            const combined: Rect = new Rect(childBoundary.x - extraSpace, childBoundary.y - extraSpace,
                                            childBoundary.width + extraSpace * 2, childBoundary.height + extraSpace * 2);
            return this.adjustCombinedBoundary(combined, messageBoundary, childBoundary);
        }

        if (!childBoundary) {
            return messageBoundary;
        }

        return this.combineBoundaries(messageBoundary, childBoundary);
    }
    private static getMessagesFromConnectorDetails(connectors: ConnectorDetails[]): Connector[] {
        const result: Connector[] = [];
        for (let i: number = 0; i < connectors.length; i++) {
            const conDetails: ConnectorDetails = connectors[parseInt(i.toString(), 10)];
            // Filter model messages for each connector detail
            const filtered: Connector[] = [];
            for (let j: number = 0; j < this.model.messages.length; j++) {
                const connector: Connector = this.model.messages[parseInt(j.toString(), 10)];
                const details: SequenceMessageDetails = UMLHelperClass.getParticipantDetails(connector);
                if (connector.id != null && connector.id.toString() === conDetails.id.toString() &&
                    details != null &&
                    this.stringEquals(details.sourceParticipantName, conDetails.source) &&
                    this.stringEquals(details.targetParticipantName, conDetails.target) &&
                    this.stringEquals(UMLHelperClass.getAnnotation(connector), conDetails.message)) {
                    filtered.push(connector);
                }
            }
            // Flatten into result array
            Array.prototype.push.apply(result, filtered);
        }
        return result;
    }

    // Case-insensitive comparison utility
    private static stringEquals(a: string, b: string): boolean {
        return a.toString().toLowerCase() === b.toString().toLowerCase();
    }

    private static getMessageFromConnectorDetails(id: string, source: string, target: string, message: string): Connector {
        return this.model.messages.find((connector: Connector) => {
            const details: SequenceMessageDetails = UMLHelperClass.getParticipantDetails(connector);
            return connector.id != null &&
                connector.id.toString().toLowerCase() === id.toLowerCase() &&
                details != null &&
                details.sourceParticipantName.toLowerCase() === source.toLowerCase() &&
                details.targetParticipantName.toLowerCase() === target.toLowerCase() &&
                UMLHelperClass.getAnnotation(connector).toLowerCase() === message.toLowerCase();
        });
    }
    private static calculateCenterYBetweenConditions(firstCondition: ConditionModel, secondCondition: ConditionModel): number {
        let lastYFirstCondition: number = 0.0;
        let firstYSecondCondition: number = 0.0;

        if (firstCondition.altBlockDetails.connectors.length > 0) {
            const lastConnectorInFirstConditionDetail: ConnectorWithFragmentDetails =
                firstCondition.altBlockDetails.connectors[firstCondition.altBlockDetails.connectors.length - 1];
            if (lastConnectorInFirstConditionDetail.inFragment) {
                let firstFragmentNode: Node;
                if (lastConnectorInFirstConditionDetail.fragmentIndex !== -1) {
                    firstFragmentNode = this.diagram.getObject(lastConnectorInFirstConditionDetail.fragmentIndex.toString() + '_Fragment') as Node;
                }
                else {
                    firstFragmentNode = this.diagram.getObject(lastConnectorInFirstConditionDetail.fragmentID + '_Fragment') as Node;
                }
                lastYFirstCondition = firstFragmentNode.wrapper.bounds.bottomLeft.y;
            }
            else {
                const lastConnectorInFirstCondition: Connector = this.getMessageFromConnectorDetails(
                    lastConnectorInFirstConditionDetail.id,
                    lastConnectorInFirstConditionDetail.source,
                    lastConnectorInFirstConditionDetail.target,
                    lastConnectorInFirstConditionDetail.message
                );
                if (lastConnectorInFirstCondition) {
                    lastYFirstCondition = lastConnectorInFirstCondition.targetPoint.y;
                }
            }
        }

        if (secondCondition.altBlockDetails.connectors.length > 0) {
            const firstConnectorInSecondConditionDetail: ConnectorWithFragmentDetails = secondCondition.altBlockDetails.connectors[0];
            if (firstConnectorInSecondConditionDetail.inFragment) {
                let secondFragmentNode: Node;
                if (firstConnectorInSecondConditionDetail.fragmentIndex !== -1) {
                    secondFragmentNode = this.diagram.getObject(firstConnectorInSecondConditionDetail.fragmentIndex.toString() + '_Fragment') as Node;
                }
                else {
                    secondFragmentNode = this.diagram.getObject(firstConnectorInSecondConditionDetail.fragmentID + '_Fragment') as Node;
                }
                firstYSecondCondition = secondFragmentNode.wrapper.bounds.topLeft.y;
            }
            else {
                const firstConnectorInSecondCondition: Connector = this.getMessageFromConnectorDetails(
                    firstConnectorInSecondConditionDetail.id,
                    firstConnectorInSecondConditionDetail.source,
                    firstConnectorInSecondConditionDetail.target,
                    firstConnectorInSecondConditionDetail.message
                );
                if (firstConnectorInSecondCondition) {
                    firstYSecondCondition = firstConnectorInSecondCondition.targetPoint.y;
                }
            }
        }

        if (lastYFirstCondition !== 0.0 && firstYSecondCondition !== 0.0) {
            return lastYFirstCondition + (firstYSecondCondition - lastYFirstCondition) / 2;
        } else if (lastYFirstCondition === 0.0 && firstYSecondCondition !== 0.0) {
            return firstYSecondCondition - 20;
        } else if (firstYSecondCondition === 0.0 && lastYFirstCondition !== 0.0) {
            return lastYFirstCondition + 10;
        }

        return 0.0;
    }


    private static createFragmentNode(fragment: FragmentModel, label: string, boundary: Rect): void {
        const fragType: string = this.getFragmentType(fragment.type);
        const width: number = Math.max(boundary.width, this.model.maxParticipantWidth);
        const height: number = boundary.height + this.settings.messageSpacing;
        const id: string = fragment.index === 0 ? fragment.id.toString() : fragment.index.toString();
        const offsetX: number = boundary.x + (boundary.width / 2);
        const offsetY: number = (boundary.y + (boundary.height / 2)) - (this.settings.messageSpacing / 2);

        const annotations: ShapeAnnotationModel[] = [
            this.createAnnotation(fragType),
            this.createAnnotation(label ? '[' + label + ']' : '', 30)
        ];
        const fragmentNode: Node = fragment.node;
        if (fragmentNode) {
            fragmentNode.id = id + '_Fragment';
            this.diagram.addLabels(fragmentNode, annotations);
            this.diagram.protectPropertyChange(true);
            fragmentNode.width = width;
            fragmentNode.height = height;
            fragmentNode.offsetX = offsetX;
            fragmentNode.offsetY = offsetY;
            fragmentNode.shape = { type: 'Path', data: this.getGeneralFragmentShape(width, height) };
            this.diagram.preventNodesUpdate = true;
            this.diagram.nodePropertyChange(fragmentNode, {} as Node, {
                offsetX: fragmentNode.offsetX, offsetY: fragmentNode.offsetY, width: fragmentNode.width, height: fragmentNode.height,
                annotations: fragmentNode.annotations } as Node, true);
            this.diagram.preventNodesUpdate = false;
        } else {
            fragment.node =  new Node(this.diagram, 'nodes', {
                id: id + '_Fragment',
                annotations: annotations,
                width: width,
                height: height,
                offsetX: offsetX,
                offsetY: offsetY,
                shape: { type: 'Path', data: this.getGeneralFragmentShape(width, height) },
                style: { fill: 'transparent', strokeColor: '#000000', strokeWidth: 1 }
            });
            fragment.node = this.diagram.add(fragment.node) as Node;
        }
    }

    private static getGeneralFragmentShape(rectWidth: number, rectHeight: number): string {
        const taperWidth: number = 40;
        const taperHeight: number = 12;

        // 1) Main bounding rectangle path
        const boundingRect: string =
            'M 0,0 ' +
            'L ' + rectWidth + ',0 ' +
            'L ' + rectWidth + ',' + rectHeight + ' ' +
            'L 0,' + rectHeight + ' Z';

        // 2) Tapered rectangle path at the top-left
        const taperControlOffset: number = taperWidth * 0.2;
        const taperRect: string =
            'M 0,0 ' +
            'H ' + taperWidth + ' ' +
            'V ' + taperHeight + ' ' +
            'C ' + (taperWidth - taperControlOffset) + ' ' + (taperHeight + taperControlOffset) + ' ' +
            taperWidth + ' ' + taperHeight + ' ' +
            (taperWidth - taperControlOffset) + ' ' + (taperHeight + taperControlOffset) + ' ' +
            'H 0 Z';

        // Use EvenOdd toggling:
        // Subpath #1: boundingRect (fill on)
        // Subpath #2: boundingRect again (fill off)
        // Subpath #3: taperRect (fill on for just the taper area)
        return boundingRect + ' ' + boundingRect + ' ' + taperRect;
    }

    private static getFragmentType(type: UmlSequenceFragmentType): string {
        switch (type) {
        case UmlSequenceFragmentType.Alternative:
            return 'alt';
        case UmlSequenceFragmentType.Loop:
            return 'loop';
        case UmlSequenceFragmentType.Optional:
            return 'opt';
        default:
            throw new Error('Invalid fragment type');
        }
    }

    private static createAnnotation(content: string, topOffset: number = 9): ShapeAnnotationModel {
        return {
            content: content,
            offset: { x: 0, y: 0 },
            horizontalAlignment: 'Left',
            verticalAlignment: 'Top',
            margin: { left: 9, top: topOffset, right: 5, bottom: 5 },
            style: { bold: true }
        };
    }
}
//#endregion
//#region LifeLineRenderer
class LifeLineRenderer {
    // Fields
    /**
     * The string key represents the participant's name in the sequence diagram,
     * the value is a Connector object that represents the lifeline associated with that participant.
     * @private
     */
    public static lifelines: Map<string, Connector> = new Map<string, Connector>();
    private static diagram: Diagram;
    private static model: SequenceDiagramModel;
    private static settings: UmlSequenceDiagram;

    // Helper Methods
    /**
     * @param {Diagram} diagram - diagram instance
     * @param {SequenceDiagramModel} model - orchestrates the model api for rendering the sequence diagram.
     * @param {Node} participant - participant node
     * @param {UmlSequenceDiagram} settings - model api
     * @returns {void}
     * @private
     */
    public static render(diagram: Diagram, model: SequenceDiagramModel, participant: Node, settings: UmlSequenceDiagram): void {
        this.diagram = diagram;
        this.model = model;
        this.settings = settings;

        const startPoint: PointModel = { x: participant.offsetX, y: participant.offsetY + model.maxParticipantHeight };
        const endPoint: PointModel = { x: startPoint.x, y: startPoint.y + settings.initialLifelineLength };

        let targetNode: Node = null;
        if (!settings.hideFootBox &&
            model.destroyedParticipants.indexOf(participant.id.toString()) === -1 &&
            model.destroyAtEndParticipants.indexOf(participant.id.toString()) === -1) {
            targetNode = this.renderFootBoxNode(participant);
            targetNode.offsetX = endPoint.x;
            targetNode.offsetY = endPoint.y;
        }

        this.createCenterPort(participant);

        this.createLifelineConnector(participant, targetNode, endPoint);
    }

    private static createCenterPort(participant: Node): void {
        const centerPort: PointPort = new PointPort(this.diagram, 'ports', {
            id: `${participant.id}_center_port`,
            shape: null
        });
        this.diagram.addPorts(participant, [centerPort]);
        this.diagram.protectPropertyChange(true);
    }

    private static createLifelineConnector(sourceNode: Node, targetNode: Node, endPoint: PointModel): Connector {
        // fetch the life line connector using participant name
        const lifeline: Connector = this.lifelines.get(sourceNode.id);

        // Connect to footbox node's port if present
        if (targetNode && targetNode.ports && targetNode.ports.length > 0) {
            const port: PointPortModel = targetNode.ports[0];
            lifeline.targetPortID = port.id;
            lifeline.targetID = targetNode.id;
            const tarpadding: number = targetNode.height / 2;
            // compenstate port height to approximate to correct end point - bug to be resolved
            lifeline.targetPadding = -(tarpadding + port.height / 2);
            // Manually update the lifeLine target point with the expected value considering compensated padding value
            lifeline.targetPoint = { x: targetNode.offsetX, y: targetNode.offsetY - tarpadding };
        }
        // Otherwise, position lifeline endpoint
        else {
            lifeline.targetPoint = endPoint;
        }

        // Connect to source node's port
        if (sourceNode && sourceNode.ports && sourceNode.ports.length > 0) {
            const port: PointPortModel = sourceNode.ports[0];
            lifeline.sourcePortID = port.id;
            lifeline.sourceID = sourceNode.id;
            // add padding so that lifeline connectors have some gap from participants
            const srcpadding: number = (UMLHelperClass.isActor(sourceNode) ? (sourceNode.height / 2) + (sourceNode.height / 6) :
                sourceNode.height / 2) ;
            // compenstate port height to approximate to correct end point - bug to be resolved
            lifeline.sourcePadding = srcpadding - port.height / 2;
            // Manually update the lifeLine source point with the expected value considering compensated padding value
            lifeline.sourcePoint = { x: sourceNode.offsetX, y: sourceNode.offsetY + srcpadding };
        }

        lifeline.annotations = null;
        lifeline.sourceDecorator = { shape: 'None' };
        lifeline.targetDecorator = { shape: 'None' };
        lifeline.constraints = lifeline.constraints &
            ~(ConnectorConstraints.DragSourceEnd | ConnectorConstraints.Delete);
        return lifeline;
    }

    private static renderFootBoxNode(participant: Node): Node {
        const footBoxNode: Node = new Node(this.diagram, 'nodes', {
            id: `FootBox_${participant.id}`,
            width: participant.width,
            height: participant.height,
            shape: participant.shape,
            annotations: participant.annotations,
            style: participant.style,
            ports: [{ id: participant.id + '_center_port', shape: null }]
        });
        return this.diagram.add(footBoxNode) as Node;
    }

    /**
     * @param {Node} participant - participant node
     * @param {number} lifelineLength - length of lifeline
     * @returns {void}
     * @private
     */
    public static updateLifelineLength(participant: Node, lifelineLength: number): void {
        // fetch the life line connector using participant name
        const lifelineConnector: Connector = this.lifelines.get(participant.id);

        if (this.settings.hideFootBox) {
            lifelineConnector.targetPoint = {
                x: lifelineConnector.targetPoint.x,
                y: participant.offsetY + this.model.maxParticipantHeight + lifelineLength
            };

            if (this.model.destroyAtEndParticipants.indexOf(participant.id.toString()) !== -1 &&
                this.model.destroyedParticipants.indexOf(participant.id.toString()) === -1) {
                this.updateDestroyMark(lifelineConnector);
            }
        }
        else {
            const targetNodeId: string = lifelineConnector.targetID;
            const offsetY: number = participant.offsetY + this.model.maxParticipantHeight + lifelineLength;
            if (targetNodeId) {
                const targetNode: Node = this.diagram.nodes.find((node: Node) => node.id === targetNodeId) as Node;
                // if it is a footbox node
                targetNode.offsetY = offsetY;
            }
            // if not a footbox node, it would be a destroy node
            else {
                if (this.model.destroyAtEndParticipants.indexOf(participant.id.toString()) !== -1 &&
                    this.model.destroyedParticipants.indexOf(participant.id.toString()) === -1) {
                    lifelineConnector.targetPoint = { x: lifelineConnector.targetPoint.x, y: offsetY };
                    this.updateDestroyMark(lifelineConnector);
                }
            }
        }
    }

    /**
     * @param {Node} participant - participant node
     * @param {number} yPosition - yPosition of message
     * @returns {void}
     * @private
     */
    public static updateLifelinePosition(participant: Node, yPosition: number): void {
        // fetch the life line connector using participant name
        const lifelineConnector: Connector = this.lifelines.get(participant.id);

        // updating only the y offset position
        const padding: number = (UMLHelperClass.isActor(participant) ? (participant.height / 2) + (participant.height / 6) :
            participant.height / 2);
        lifelineConnector.sourcePoint = {
            x: lifelineConnector.sourcePoint.x, y: yPosition + padding
        };
    }

    /**
     * @param {Node} participant - participant node
     * @param {Connector} destroyMessage - destory message
     * @param {number} destroyYPosition - destroying y position
     * @returns {void}
     * @private
     */
    public static updateLifelineToDestroy(participant: Node, destroyMessage: Connector, destroyYPosition: number): void {
        // fetch the life line connector using participant name
        const lifelineConnector: Connector = this.lifelines.get(participant.id);

        // added 20px yOffset before destroying from connector message
        destroyYPosition += 20;
        lifelineConnector.targetPoint = {
            x: lifelineConnector.targetPoint.x,
            y: destroyYPosition
        };
        this.updateDestroyMark(lifelineConnector);
    }

    private static updateDestroyMark(lifeline: Connector): void {
        lifeline.targetDecorator = {
            shape: 'Custom',
            pathData: 'M 0,0 L 25,25 M 25,0 L 0,25',
            pivot: { x: 0.5, y: 0.5 },
            style: {
                fill: 'none',
                strokeColor: '#000000',
                strokeWidth: 1
            }
        };
    }

    /**
     * @returns {void}
     * @private
     */
    public static clearLifelines(): void {
        this.lifelines.clear();
    }

    /**
     * @returns {void}
     * @private
     */
    public static clearPorts(): void {
        this.lifelines.forEach((lifeline: Connector, id: string) => {
            lifeline.ports = [];
        });
    }
}
//#endregion
//#endregion


const actor: string = 'M4.5000001,12.548 L18.5,12.548 C20.709,12.548 22.5,14.335995 22.5,16.542004 L22.5,32.516996 19.5,32.516996 19.5,24.529997 17.5,24.529997 17.5,43.5 12.5,43.5 12.5,35.512999 C12.5,34.960997 12.052002,34.514006 11.5,34.514006 10.947998,34.514006 10.5,34.960997 10.5,35.512999 L10.5,43.5 5.4999996,43.5 5.4999996,24.529997 3.5000001,24.529997 3.5000001,32.516996 0.5,32.516996 0.5,16.542004 C0.50000012,14.335995 2.2910005,12.548 4.5000001,12.548 z M11.499001,0.5 C14.305002,0.5 16.580004,2.795001 16.580004,5.6260009 16.580004,8.4570012 14.305002,10.752001 11.499001,10.752002 8.6939994,10.752001 6.4189988,8.4570012 6.4189988,5.6260009 6.4189988,2.795001 8.6939994,0.5 11.499001,0.5 z';
const rectangle: string = 'M242,1078L231,1078L231,1067L242,1067z';


class MermaidUmlParser {
    private sequenceDiagramModel: SequenceDiagramModel;
    private lines: string[] = [];
    private activationCache: Map<string, ConnectorDetails[]> = new Map();
    private fragmentStack: FragmentModel[] = [];
    private currentCondition: ConditionModel | null = null;
    private diagram: Diagram;

    constructor(diagram?: Diagram) {
        this.diagram = diagram;
        this.sequenceDiagramModel = new SequenceDiagramModel(diagram);
        this.sequenceDiagramModel.isLoadedFromMermaid = true;
    }
    /**
     * parse memaidUmlSequenceData into an internal SequenceDiagramModel object model
     * @param {string} mermaidUmlCode - mermaid data
     * @returns {SequenceDiagramModel} - an internal model to render the sequence diagram
     * @private
     */
    public parse(mermaidUmlCode: string): SequenceDiagramModel {
        this.lines = mermaidUmlCode.split(/\r?\n/).filter((line: string) => line.trim().length > 0);
        for (let index: number = 1; index <= this.lines.length; index++) {
            const line: string = this.lines[index - 1];
            this.parseLine(line.trim(), index);
        }
        return this.sequenceDiagramModel;
    }

    private parseLine(line: string, index: number): void {
        /* eslint-disable security/detect-unsafe-regex */
        if (/^\s*(create|destroy)\b/i.test(line)) {
            this.parseCreateOrDestroyMessage(line, index);
        } else if (/^\s*(participant|actor)\b/i.test(line)) {
            this.parseParticipant(line);
        } else if (/\w+\s*(<<-{1,2}|-{1,2}>>?|<<-{1,2}>>?|-{1,2}\))\s*\w+/i.test(line)) {
            this.parseConnector(line, index);
        }
        else if (/^(?!\s*(alt|else if|else|opt|loop|end)\b)(?!\w+\s*--?\)\s*\w+\s*:)(?=.*(?:activate|deactivate)\b|.*[+-])/i.test(line)) {
            this.parseActivation(line, index);
        }
        else if (/^\s*(alt|else if|else|opt|loop|end)(?:\s+(.*))?/i.test(line)) {
            this.parseFragment(line, index);
        }
        /* eslint-enable security/detect-unsafe-regex */
    }

    private parseCreateOrDestroyMessage(line: string, index: number): void {
        // Determine if this is a create or destroy message
        const isCreate: boolean = /^\s*create\b/i.test(line);

        if (isCreate) {
            /* eslint-disable security/detect-unsafe-regex */
            const match: RegExpMatchArray = line.match(/create\s+(participant|actor)\s+(\w+)(?:\s+as\s+(.+))?/i);
            /* eslint-enable security/detect-unsafe-regex */

            if (!match) {
                console.warn('[WARNING] :: Invalid create syntax: \'' + line + '\'.');
                return;
            }
            const type: string = match[1];
            const alias: string = match[3] ? match[2] : null;
            const participantName: string = match[3] || match[2];
            const affectedParticipant: string = alias || participantName;

            this.createOrGetParticipant(participantName, alias, type.toLowerCase() === 'actor');

            let nextIndex: number = index;
            let nextLine: string | null = null;
            while (nextIndex < this.lines.length) {
                nextLine = this.lines[parseInt(nextIndex.toString(), 10)].trim();
                if (nextLine && !nextLine.startsWith('%%')) {
                    break;
                }
                nextIndex++;
            }

            if (nextIndex < this.lines.length && /\w+\s*(-\)|<<-{1,2}|-{1,2}>>?|<<-{1,2}>>?|\(-{1,2}\))\s*\w+\s*:\s*.+/.test(nextLine)) {
                const connectorMatch: RegExpMatchArray = nextLine.match(/(\w+)\s*(-\)|<<-{1,2}|-{1,2}>>?|<<-{1,2}>>?|\(-{1,2}\))\s*(\w+)\s*:\s*(.+)/);
                if (connectorMatch) {
                    const source: string = connectorMatch[1];
                    const arrow: string = connectorMatch[2];
                    const target: string = connectorMatch[3];
                    const message: string = connectorMatch[4];

                    if (source.toLowerCase() === affectedParticipant.toLowerCase() ||
                        target.toLowerCase() === affectedParticipant.toLowerCase()) {

                        const createConnector: Connector = new Connector(this.diagram, 'connectors', {
                            id: (nextIndex + 1).toString()
                        });

                        UMLHelperClass.addOrUpdateParticipantDetails(createConnector, source, target,
                                                                     UmlSequenceMessageType.Create, affectedParticipant);
                        UMLHelperClass.updateAnnotation(createConnector, message);
                        UMLHelperClass.updateConnectorStyles(createConnector, UmlSequenceMessageType.Create.toString());

                        this.sequenceDiagramModel.affectedParticipants.push(affectedParticipant);
                        this.sequenceDiagramModel.addMessage(createConnector);
                        this.registerConnectorInCondition(createConnector, nextIndex + 1);
                    }
                }
            }
        }
        else {
            const match: RegExpMatchArray = line.match(/destroy\s+(\w+)/i);
            if (!match) {
                console.warn('[WARNING] :: Invalid destroy syntax: \'' + line + '\'.');
                return;
            }
            const participantName: string = match[1];
            if (!this.sequenceDiagramModel.participants.has(participantName)) {
                console.warn('[WARNING] :: Participant \'' + participantName + '\' not found for destroy.');
                return;
            }
            let nextIndex: number = index;
            let nextLine: string | null = null;
            while (nextIndex < this.lines.length) {
                nextLine = this.lines[parseInt(nextIndex.toString(), 10)].trim();
                if (nextLine && !nextLine.startsWith('%%')) {
                    break;
                }
                nextIndex++;
            }

            if (nextIndex < this.lines.length && /\w+\s*(<<-{1,2}|-{1,2}>>?|\(-{1,2}\)|<<-{1,2}>>?)\s*\w+\s*:\s*.+/.test(nextLine)) {
                const connectorMatch: RegExpMatchArray = nextLine.match(/(\w+)\s*(<<-{1,2}|-{1,2}>>?|\(-{1,2}\)|<<-{1,2}>>?)\s*(\w+)\s*:\s*(.+)/);
                if (connectorMatch) {
                    const source: string = connectorMatch[1];
                    const arrow: string = connectorMatch[2];
                    const target: string = connectorMatch[3];
                    const message: string = connectorMatch[4];

                    if (source.toLowerCase() === participantName.toLowerCase() ||
                        target.toLowerCase() === participantName.toLowerCase()) {

                        const destroyConnector: Connector = new Connector(this.diagram, 'connectors', {
                            id: (nextIndex + 1).toString()
                        });

                        UMLHelperClass.addOrUpdateParticipantDetails(destroyConnector, source, target,
                                                                     UmlSequenceMessageType.Delete, participantName);
                        UMLHelperClass.updateAnnotation(destroyConnector, message);
                        UMLHelperClass.updateConnectorStyles(destroyConnector, UmlSequenceMessageType.Delete.toString());

                        if (this.sequenceDiagramModel.affectedParticipants.indexOf(participantName) === -1) {
                            this.sequenceDiagramModel.affectedParticipants.push(participantName);
                        }
                        this.sequenceDiagramModel.destroyedParticipants.push(participantName);
                        this.sequenceDiagramModel.addMessage(destroyConnector);
                        this.registerConnectorInCondition(destroyConnector, nextIndex + 1);
                    }
                }
            }
        }
    }
    private parseParticipant(line: string): void {
        // Regular expression to handle both cases: with and without alias
        /* eslint-disable security/detect-unsafe-regex */
        const participantRegex: RegExp = /^(participant|actor)\s+([A-Za-z0-9._/\-\s]+?)(?:\s+as\s+(.+))?$/i;
        const match: RegExpExecArray = participantRegex.exec(line);
        /* eslint-enable security/detect-unsafe-regex */
        if (!match) {
            console.warn('[WARNING] :: Invalid participant syntax: \'' + line + '\'.');
            return;
        }
        const type: string = match[1];
        const alias: string | null = match[3] ? match[2] : null;
        const name: string = match[3] ? match[3] : match[2];

        this.createOrGetParticipant(name, alias, type.toLowerCase() === 'actor');
    }

    private parseConnector(line: string, index: number): void {
        // Check if the message is already processed
        if (this.sequenceDiagramModel.messages.some((message: Connector) => message.id.toString() === index.toString())) {
            return;
        }

        line = this.removeActivationSymbols(line);
        const pattern: RegExp = /([\w/.\-_ ]+?)\s*(<<-{1,2}|-{1,2}>>?|\(-{1,2}\)|-{1,2}\)|<<-{1,2}>>?)\s*([\w/.\-_ ]+?)\s*:\s*(.+)/;
        const match: RegExpMatchArray = line.match(pattern);
        if (!match) {
            console.warn('[WARNING] :: Invalid connector syntax: \'' + line + '\'.');
            return;
        }
        const source: string = match[1];
        const arrow: string = match[2];
        const target: string = match[3];
        const message: string = match[4];

        // Dynamically create participants if not explicitly defined
        this.createOrGetParticipant(source);
        this.createOrGetParticipant(target);

        const connector: Connector = new Connector(this.diagram, 'connectors', { id: index.toString() });

        UMLHelperClass.addOrUpdateParticipantDetails(connector, source, target, UmlSequenceMessageType.Synchronous, null);
        UMLHelperClass.updateAnnotation(connector, message);
        UMLHelperClass.updateConnectorStyles(connector, this.getMermaidConnectorTypeFromArrow(arrow).toString());

        this.sequenceDiagramModel.addMessage(connector);
        this.registerConnectorInCondition(connector, index);
    }

    private parseActivation(line: string, index: number): void {
        let participant: string;
        let source: string;
        let target: string;
        let message: string;

        if (line.startsWith('activate') || line.startsWith('deactivate')) {
            const match: RegExpMatchArray = line.match(/(activate|deactivate)\s+(\w+)/i);
            if (!match) {
                console.warn('[WARNING] :: Invalid activation syntax: \'' + line + '\'.');
                return;
            }
            const command: string = match[1].toLowerCase();
            participant = match[2];

            this.createOrGetParticipant(participant);

            // Attempt to retrieve source, target, and message from the previous line
            if (index > 1) {
                let prevIndex: number = index - 2;
                while (prevIndex >= 0) {
                    const previousLine: string = this.lines[parseInt(prevIndex.toString(), 10)].trim();

                    // Skip empty lines or comments
                    if (!previousLine || previousLine.startsWith('%%')) {
                        prevIndex--;
                        continue;
                    }

                    const connectorMatch: RegExpMatchArray = previousLine.match(/(\w+)\s*(<<-{1,2}|-{1,2}>>?|\(-{1,2}\)|-{1,2}\)|<<-{1,2}>>?)\s*(\w+)\s*:\s*(.+)/);
                    if (connectorMatch) {
                        source = connectorMatch[1];
                        target = connectorMatch[3];
                        message = connectorMatch[4];
                        index = prevIndex + 2;
                        break;
                    }

                    prevIndex--;
                }
            }

            if (command === 'activate') {
                if (!this.activationCache.has(participant)) {
                    this.activationCache.set(participant, []);
                }
                this.activationCache.get(participant)!.push(new ConnectorDetails(
                    (index - 1).toString(),
                    source,
                    target,
                    message,
                    index
                ));
            }
            else {
                if (this.activationCache.has(participant) && this.activationCache.get(participant)!.length > 0) {
                    const activation: ConnectorDetails = this.activationCache.get(participant)!.pop();
                    const activationNode: Node = new Node(this.diagram, 'nodes', {
                        id: participant + '_Activation_' + randomId(),
                        minHeight: 10, minWidth: 10
                    });
                    UMLHelperClass.updateNodeShape(activationNode, false);

                    this.sequenceDiagramModel.addActivation(new ActivationModel(activationNode,
                                                                                participant, activation!,
                                                                                new ConnectorDetails(
                                                                                    (index - 1).toString(),
                                                                                    source,
                                                                                    target,
                                                                                    message,
                                                                                    index)
                    ));

                    if (this.activationCache.get(participant)!.length === 0) {
                        this.activationCache.delete(participant);
                    }
                }
            }
        }
        else {
            this.parseConnector(line, index);
            // Handle symbol-based activation syntax
            const match: RegExpMatchArray = line.match(/(\w+)\s*(-+>|->>|-->|-->|<<->>|<<-->>|-x|--x|-\)|--\)|-x|--)>\s*(\+|-)\s*(\w+)\s*:\s*(.+)/);
            if (!match) {
                console.warn('[WARNING] :: Invalid activation syntax: \'' + line + '\'.');
                return;
            }
            source = match[1];
            const symbol: string = match[3];
            target = match[4];
            message = match[5];
            participant = symbol === '+' ? target : source;

            this.createOrGetParticipant(source);
            this.createOrGetParticipant(participant);

            if (symbol === '+') {
                if (!this.activationCache.has(participant)) {
                    this.activationCache.set(participant, []);
                }
                this.activationCache.get(participant)!.push(new ConnectorDetails(
                    index.toString(),
                    source,
                    target,
                    message,
                    index
                ));
            }
            else if (symbol === '-') {
                if (this.activationCache.has(participant) && this.activationCache.get(participant)!.length > 0) {
                    const activation: ConnectorDetails = this.activationCache.get(participant)!.pop();
                    const activationNode: Node = new Node(this.diagram, 'nodes', {
                        id: participant + '_Activation_' + randomId(),
                        minHeight: 10, minWidth: 10
                    });
                    UMLHelperClass.updateNodeShape(activationNode, false);

                    this.sequenceDiagramModel.addActivation(new ActivationModel(activationNode,
                                                                                participant, activation!,
                                                                                new ConnectorDetails(
                                                                                    index.toString(),
                                                                                    source,
                                                                                    target,
                                                                                    message,
                                                                                    index)
                    ));

                    if (this.activationCache.get(participant)!.length === 0) {
                        this.activationCache.delete(participant);
                    }
                }
            }
        }
    }

    private parseFragment(line: string, index: number): void {
        /* eslint-disable security/detect-unsafe-regex */
        const match: RegExpMatchArray = line.match(/(alt|else|opt|loop|end)(?:\s+(.*))?/i);
        /* eslint-enable security/detect-unsafe-regex */
        const type: string = match[1].toLowerCase();
        const conditionContent: string | null = match[2] || null;

        if (type === 'end') {
            if (this.fragmentStack.length === 0) {
                console.warn('[WARNING] :: Unmatched \'end\' found.');
                return;
            }
            const completedFragment: FragmentModel = this.fragmentStack.pop()!;

            if (this.currentCondition !== null) {
                if (!completedFragment.conditions.some((c: ConditionModel) => c.content === this.currentCondition!.content)) {
                    completedFragment.conditions.push(this.currentCondition);
                }
                this.currentCondition = null;
            }

            completedFragment.conditions.forEach((condition: ConditionModel) => {
                this.populateConditionAltBlockDetails(condition, completedFragment);
            });

            if (this.fragmentStack.length > 0) {
                const parentFragment: FragmentModel = this.fragmentStack[this.fragmentStack.length - 1];
                parentFragment.childFragments.push(completedFragment);

                if (parentFragment.type === UmlSequenceFragmentType.Alternative && parentFragment.conditions.length > 0) {
                    parentFragment.conditions[parentFragment.conditions.length - 1].nestedFragments.push(completedFragment);
                }
            } else {
                this.sequenceDiagramModel.addFragment(completedFragment);
            }
        } else {
            let currentFragment: FragmentModel | null = null;

            if (this.fragmentStack.length > 0) {
                currentFragment = this.fragmentStack[this.fragmentStack.length - 1];
            }

            if (type === 'alt' || type === 'opt' || type === 'loop') {
                const newFragment: FragmentModel = new FragmentModel('', UmlSequenceFragmentType.Optional, [], [], null, index, this.fragmentStack.length);
                switch (type) {
                case 'alt':
                    newFragment.type = UmlSequenceFragmentType.Alternative;
                    break;
                case 'opt':
                    newFragment.type = UmlSequenceFragmentType.Optional;
                    break;
                case 'loop':
                    newFragment.type = UmlSequenceFragmentType.Loop;
                    break;
                }

                this.fragmentStack.push(newFragment);
                currentFragment = newFragment;
            }

            if (currentFragment && (type === 'alt' || type === 'opt' || type === 'loop' || type === 'else if' || type === 'else')) {
                const potentialCondition: ConditionModel = new ConditionModel(conditionContent, [], [], new AlternativeBlockDetails());

                if (!currentFragment.conditions.some((c: ConditionModel) => c.content === potentialCondition.content)) {
                    this.currentCondition = potentialCondition;
                    currentFragment.conditions.push(potentialCondition);
                } else {
                    this.currentCondition = currentFragment.conditions.find((c: ConditionModel) =>
                        c.content === potentialCondition.content) || null;
                }
            }
        }
    }
    private populateConditionAltBlockDetails(condition: ConditionModel, fragment: FragmentModel): void {
        // Only add connectors that belong to this specific condition
        for (const connector of condition.connectors) {
            condition.altBlockDetails.connectors.push(new ConnectorWithFragmentDetails(
                connector.id,
                connector.source,
                connector.target,
                connector.message,
                -1,
                '',
                false,
                -1
            ));
        }

        // Sort connectors by ID after adding them
        condition.altBlockDetails.connectors.sort((a: ConnectorWithFragmentDetails, b: ConnectorWithFragmentDetails) =>
            parseInt(a.id, 10) - parseInt(b.id, 10));

        // Only process child fragments that belong to this specific condition
        for (const childFragment of condition.nestedFragments) {
            this.addChildFragmentConnectors(condition, childFragment);
        }
    }

    private addChildFragmentConnectors(condition: ConditionModel, childFragment: FragmentModel): void {
        for (const childCondition of childFragment.conditions) {
            // Ensure the child condition belongs to the current condition's block
            if (condition.nestedFragments.indexOf(childFragment) !== -1) {
                for (const connector of childCondition.connectors) {
                    condition.altBlockDetails.connectors.push(new ConnectorWithFragmentDetails(
                        connector.id,
                        connector.source,
                        connector.target,
                        connector.message,
                        -1,
                        '',
                        true,
                        childFragment.index
                    ));
                }

                // Recursively process deeply nested fragments
                for (const nestedChildFragment of childFragment.childFragments) {
                    this.addChildFragmentConnectors(condition, nestedChildFragment);
                }
            }
        }

        // Sort connectors by ID after adding them from child fragments
        condition.altBlockDetails.connectors.sort((a: ConnectorWithFragmentDetails, b: ConnectorWithFragmentDetails) =>
            parseInt(a.id, 10) - parseInt(b.id, 10));
    }
    private registerConnectorInCondition(connector: Connector, index: number): void {
        const details: SequenceMessageDetails = UMLHelperClass.getParticipantDetails(connector);

        // Ensure connectors are added to the appropriate active condition
        if (this.currentCondition) {
            const conDetails: ConnectorDetails = new ConnectorDetails(
                index.toString(),
                details.sourceParticipantName,
                details.targetParticipantName,
                UMLHelperClass.getAnnotation(connector),
                index
            );

            this.currentCondition.connectors.push(conDetails);
        } else if (this.fragmentStack.length > 0) {
            // If no current condition, use the last condition in the top fragment stack
            const currentFragment: FragmentModel = this.fragmentStack[this.fragmentStack.length - 1];

            if (currentFragment.conditions.length > 0) {
                const lastCondition: ConditionModel = currentFragment.conditions[currentFragment.conditions.length - 1];
                const conDetails: ConnectorDetails = new ConnectorDetails(
                    index.toString(),
                    details.sourceParticipantName,
                    details.targetParticipantName,
                    UMLHelperClass.getAnnotation(connector),
                    index
                );

                lastCondition.connectors.push(conDetails);
            }
        }
    }
    private createOrGetParticipant(name: string, alias: string = '', isActor: boolean = false): void {
        if (!name || name.trim() === '') {
            console.warn('[WARNING] :: Participant name cannot be null or empty.');
            return;
        }
        if (!this.sequenceDiagramModel.participants.has(alias || name)) {
            const participant: Node = new Node(this.diagram, 'nodes', {
                id: alias || name
            });
            UMLHelperClass.updateNodeShape(participant, isActor);
            UMLHelperClass.updateAnnotation(participant, name, isActor);
            this.sequenceDiagramModel.addParticipant(participant);
            if (alias) {
                this.sequenceDiagramModel.addAlias(alias, name);
            }
        }
    }
    private getMermaidConnectorTypeFromArrow(arrow: string): MermaidConnectorType {
        switch (arrow) {
        case '->':
            return MermaidConnectorType.Solid;
        case '-->':
            return MermaidConnectorType.Dashed;
        case '->>':
            return MermaidConnectorType.SolidArrow;
        case '-->>':
            return MermaidConnectorType.DashedArrow;
        case '<<->>':
            return MermaidConnectorType.Bidirectional;
        case '<<-->>':
            return MermaidConnectorType.DashedBidirectional;
        case '-)':
            return MermaidConnectorType.OpenArrow;
        case '--)':
            return MermaidConnectorType.DashedOpenArrow;
        default:
            return MermaidConnectorType.SolidArrow;
        }
    }

    private removeActivationSymbols(line: string): string {
        // Regex to remove the + or - symbol and any optional spaces after ->>
        const pattern: RegExp = /(->>\s*)(\+|-)(\s*\w+)/g;
        return line.replace(pattern, (match: string, p1: any, p2: any, p3: any) => p1 + p3);
    }
}

class MermaidGenerator {
    /**
     * Generates mermaid text from diagram's model
     * @param {UmlSequenceDiagramModel} settings diagram's model
     * @returns {string} - Mermaid data
     * @private
     */
    public generateMermaidText(settings: UmlSequenceDiagramModel): string {
        let sb: string = 'sequenceDiagram\n';

        const dynamicParticipants: Set<string | number> = new Set(settings.messages
            .filter((message: UmlSequenceMessageModel) => {
                return message.type === UmlSequenceMessageType.Create;
            })
            .map((message: UmlSequenceMessageModel) => {
                return message.toParticipantID;
            }));
        // Add Participants
        for (const participant of settings.participants) {
            if (participant.id && !dynamicParticipants.has(participant.id)) {
                sb += '    ' + this.getParticipantContent(participant) + '\n';
            }
        }

        // Build activation lookup tables
        const activateLookup: Map<string, string[]> = this.buildActivationLookup(settings.participants, true);
        const deactivateLookup: Map<string, string[]> = this.buildActivationLookup(settings.participants, false);

        // This list tracks the current open fragment context (from outermost to innermost)
        const openContext: FragmentContext[] = [];

        // Iterate messages in order from the SequenceMessageCollection
        for (const message of settings.messages) {
            // Compute the fragment context chain for this message (outermost first)
            const newContext: FragmentContext[] = this.getContextChainForMessage(message.id, settings.fragments);

            // --- First: if openContext is deeper than newContext, close extra nested fragments ---
            while (openContext.length > newContext.length) {
                const level: number = openContext.length;
                const indent: string = Array(level * 4 + 1).join(' ');
                sb += indent + 'end\n';
                openContext.pop();
            }

            // --- Compare each level in the (equal-depth) open context and new context ---
            let common: number = 0;
            let k: number = 0;
            while (k < openContext.length && k < newContext.length) {
                if (openContext[parseInt(k.toString(), 10)].fragment.id.toString() !==
                    newContext[parseInt(k.toString(), 10)].fragment.id.toString()) {
                    break;
                }
                if (openContext[parseInt(k.toString(), 10)].condition.content !==
                    newContext[parseInt(k.toString(), 10)].condition.content) {
                    // Close all fragments nested inside this level.
                    while (openContext.length > k + 1) {
                        const indent: string = Array((openContext.length) * 4 + 1).join(' ');
                        sb += indent + 'end\n';
                        openContext.pop();
                    }
                    // Output the "else" header at the current level.
                    const indentLevel: string = Array((k + 1) * 4 + 1).join(' ');
                    sb += indentLevel + 'else ' + newContext[parseInt(k.toString(), 10)].condition.content + '\n';
                    openContext[parseInt(k.toString(), 10)] = newContext[parseInt(k.toString(), 10)];
                }
                k++;
            }
            common = k;

            // Close any fragments that are no longer active.
            for (let i: number = openContext.length - 1; i >= common; i--) {
                const indent: string = Array((i + 1) * 4 + 1).join(' ');
                sb += indent + 'end\n';
                openContext.pop();
            }

            // Open new fragments.
            for (let i: number = common; i < newContext.length; i++) {
                const indent: string = Array((openContext.length + 1) * 4 + 1).join(' ');
                sb += indent + this.getFragmentType(newContext[parseInt(i.toString(), 10)].fragment.type) + ' ' + newContext[parseInt(i.toString(), 10)].condition.content + '\n';
                openContext.push(newContext[parseInt(i.toString(), 10)]);
            }

            // Determine the indent for the current message.
            const messageIndent: string = Array((openContext.length + 1) * 4 + 1).join(' ');

            // --- Handle Create Participant ---
            if (message.toParticipantID && message.type === UmlSequenceMessageType.Create) {
                const created: UmlSequenceParticipantModel = settings.participants.find((participant: UmlSequenceParticipant) => {
                    return participant.id.toString() === message.toParticipantID.toString();
                });
                if (created) {
                    sb += messageIndent + 'create ' + this.getParticipantContent(created) + '\n';
                }
            }

            // --- Handle Destroy Participant ---
            if (message.toParticipantID && message.type === UmlSequenceMessageType.Delete) {
                const destroyed: UmlSequenceParticipantModel = settings.participants.find((participant: UmlSequenceParticipant) => {
                    return participant.id.toString() === message.toParticipantID.toString();
                });
                if (destroyed) {
                    sb += messageIndent + 'destroy ' + destroyed.id + '\n';
                }
            }

            // Append the message at an indent one level deeper than the open fragments.
            sb += messageIndent +
                this.getParticipantContentByID(settings, message.fromParticipantID) +
                this.getArrowType(message.type) +
                this.getParticipantContentByID(settings, message.toParticipantID) +
                ': ' + message.content + '\n';

            sb = this.handleActivationsAndDeactivations(sb, message, activateLookup, deactivateLookup, openContext.length + 1);
        }

        // Close any remaining open fragments.
        for (let i: number = openContext.length - 1; i >= 0; i--) {
            const indent: string = Array((i + 1) * 4 + 1).join(' ');
            sb += indent + 'end\n';
        }

        return sb;
    }

    private getContextChainForMessage(messageId: any, fragments: UmlSequenceFragmentModel[]): FragmentContext[] {
        const chain: FragmentContext[] = [];

        for (let i: number = 0; i < fragments.length; i++) {
            const fragment: UmlSequenceFragmentModel = fragments[parseInt(i.toString(), 10)];

            for (let j: number = 0; j < fragment.conditions.length; j++) {
                const condition: UmlSequenceFragmentConditionModel = fragment.conditions[parseInt(j.toString(), 10)];
                // Check if the parent's condition contains the message,
                const parentMatches: boolean = this.isMessageIdInCondition(condition, messageId);

                if (parentMatches) {
                    chain.push({
                        fragment: fragment,
                        condition: condition
                    });

                    return chain;
                }
            }
        }

        return chain;
    }

    private isMessageIdInCondition(condition: UmlSequenceFragmentConditionModel, messageId: any): boolean {
        for (let i: number = 0; i < condition.messageIds.length; i++) {
            const id: string | number = condition.messageIds[parseInt(i.toString(), 10)];

            if (id.toString() === messageId.toString()) {
                return true;
            }
        }
        return false;
    }

    private handleActivationsAndDeactivations(sb: string, message: UmlSequenceMessageModel, activateLookup: Map<string, string[]>,
                                              deactivateLookup: Map<string, string[]>, indentLevel: number = 1): string {
        const indent: string = ' '.repeat(indentLevel * 4);

        const activateParticipants: string[] = activateLookup.get(message.id.toString());
        if (activateParticipants) {
            activateParticipants.forEach((participant: string) => {
                sb += `${indent}activate ${participant}\n`;
            });
        }

        const deactivateParticipants: string[] = deactivateLookup.get(message.id.toString());
        if (deactivateParticipants) {
            deactivateParticipants.forEach((participant: string) => {
                sb += `${indent}deactivate ${participant}\n`;
            });
        }
        return sb;
    }
    private buildActivationLookup(participants: UmlSequenceParticipantModel[], isActivation: boolean): Map<string, string[]> {
        const lookup: Map<string, string[]> = new Map();
        participants.forEach((participant: UmlSequenceParticipantModel) => {
            participant.activationBoxes.forEach((activation: UmlSequenceActivationBox) => {
                const messageId: string = (isActivation ? activation.startMessageID : activation.endMessageID).toString();
                const participantName: string = participant.id.toString();

                if (!lookup.has(messageId)) {
                    lookup.set(messageId, []);
                }

                lookup.get(messageId).push(participantName);
            });
        });
        return lookup;
    }
    private getArrowType(type: UmlSequenceMessageType): string {
        switch (type) {
        case UmlSequenceMessageType.Synchronous:
        case UmlSequenceMessageType.Delete:
            return '->>';
        case UmlSequenceMessageType.Asynchronous:
        case UmlSequenceMessageType.Create:
            return '-->';
        case UmlSequenceMessageType.Reply:
            return '-->>';
        default:
            return '->>';
        }
    }

    private getFragmentType(type: UmlSequenceFragmentType): string {
        switch (type) {
        case UmlSequenceFragmentType.Alternative:
            return 'alt';
        case UmlSequenceFragmentType.Loop:
            return 'loop';
        case UmlSequenceFragmentType.Optional:
            return 'opt';
        default:
            throw new Error('Invalid fragment type');
        }
    }

    private getParticipantContent(participant: UmlSequenceParticipantModel): string {
        const type: string = participant.isActor ? 'actor' : 'participant';
        return `${type} ${participant.id} as ${participant.content}`;
    }

    private getParticipantContentByID(settings: UmlSequenceDiagramModel, id: string | number): string {
        const participant: UmlSequenceParticipantModel = settings.participants.find((participant: UmlSequenceParticipant) =>
            participant.id && participant.id.toString() === id.toString());
        return participant.id.toString();
    }

}

interface FragmentContext {
    fragment: UmlSequenceFragmentModel;
    condition: UmlSequenceFragmentConditionModel;
}

