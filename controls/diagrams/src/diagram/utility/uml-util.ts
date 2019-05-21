import { Diagram } from '../diagram';
import {
    NodeModel, UmlClassifierShapeModel, UmlClassModel,
    UmlEnumerationModel, UmlEnumerationMemberModel, UmlClassAttributeModel, UmlClassMethodModel
} from '../objects/node-model';
import { DiagramElement } from '../core/elements/diagram-element';
import { TextStyleModel } from '../core/appearance-model';
import { NodeConstraints, TextWrap, AnnotationConstraints } from '../enum/enum';
import { Node } from '../objects/node';
import { randomId } from './../utility/base-util';
import { IElement } from '../index';

/**
 * These utility methods help to process the data and to convert it to desired dimensions
 */
/** @private */
export function getULMClassifierShapes(content: DiagramElement, node: NodeModel, diagram: Diagram): DiagramElement {
    let classifier: UmlClassModel;
    let textWrap: TextWrap = 'NoWrap';
    if ((node.shape as UmlClassifierShapeModel).classifier === 'Class') {
        classifier = (node.shape as UmlClassifierShapeModel).classShape;
    } else if ((node.shape as UmlClassifierShapeModel).classifier === 'Enumeration') {
        classifier = (node.shape as UmlClassifierShapeModel).enumerationShape;
    } else if ((node.shape as UmlClassifierShapeModel).classifier === 'Interface') {
        classifier = (node.shape as UmlClassifierShapeModel).interfaceShape;
    }
    let attributeText: string = '';
    node.container = { type: 'Stack', orientation: 'Vertical' };
    node.constraints = (NodeConstraints.Default | NodeConstraints.HideThumbs) &
        ~(NodeConstraints.Rotate | NodeConstraints.Resize);
    node.style = {
        fill: node.style.fill, strokeColor: 'black',
        strokeWidth: 1.5
    };
    node.children = [];
    if (node.maxWidth) {
        textWrap = 'Wrap';
    }
    let newObj: Node = new Node(
        diagram, 'nodes', {
            id: node.id + '_umlClass_header',
            annotations: [
                {
                    id: 'name', content: classifier.name,
                    offset: { x: 0.5, y: 0.65 }, margin: { left: 10, right: 10 },
                    style: {
                        bold: true, fontSize: 14, color: (classifier.style as TextStyleModel).color, fill: classifier.style.fill,
                        textWrapping: textWrap
                    }
                }, {
                    content: '<<' + (node.shape as UmlClassifierShapeModel).classifier + '>>', margin: { left: 10, right: 10 },
                    id: 'class', style: {
                        fontSize: (classifier.style as TextStyleModel).fontSize,
                        color: (classifier.style as TextStyleModel).color, fill: classifier.style.fill,
                        textWrapping: textWrap
                    }, offset: { x: 0.5, y: 0.3 }, constraints: AnnotationConstraints.ReadOnly
                },
            ],
            constraints: (NodeConstraints.Default | NodeConstraints.HideThumbs) & ~
                (NodeConstraints.Rotate | NodeConstraints.Drag | NodeConstraints.Resize),
            verticalAlignment: 'Stretch',
            horizontalAlignment: 'Stretch',
            style: { fill: node.style.fill, strokeColor: '#ffffff00' }
        } as NodeModel,
        true);
    diagram.initObject(newObj);
    diagram.nodes.push(newObj);
    node.children.push(newObj.id);
    getClassNodes(node as Node, diagram, classifier, textWrap);
    getClassMembers(node as Node, diagram, classifier, textWrap);
    node.offsetX = node.offsetX;
    node.offsetY = node.offsetY;
    node.style.fill = node.style.fill;
    node.borderColor = node.borderColor;
    diagram.initObject(node as IElement);
    return content;
}

/** @private */
export function getClassNodes(node: Node, diagram: Diagram, classifier: UmlClassModel, textWrap: TextWrap): void {
    if ((node.shape as UmlClassifierShapeModel).classifier === 'Enumeration') {
        let member: UmlEnumerationMemberModel[] = (classifier as UmlEnumerationModel).members;
        if (member && member.length) {
            addSeparator(node, diagram);
            let memberText: string = '';
            for (let i: number = 0; i < member.length; i++) {
                let members: UmlEnumerationMemberModel = member[i];
                if (members.name !== '') {
                    memberText += members.name;
                }
                if (i !== member.length) {
                    let style: TextStyleModel = getStyle(node, members);
                    let temp: Node = new Node(
                        diagram, 'nodes', {
                            id: randomId() + '_umlMember',
                            annotations: [
                                {
                                    id: 'name', content: memberText, offset: { x: 0, y: 0.5 },
                                    style: {
                                        bold: true, fontSize: style.fontSize, color: style.color, fill: style.fill,
                                        textWrapping: textWrap
                                    },
                                    margin: { left: 14, right: 5 }, horizontalAlignment: 'Left'
                                }
                            ], verticalAlignment: 'Stretch', horizontalAlignment: 'Stretch',
                            style: { fill: node.style.fill, strokeColor: '#ffffff00', textWrapping: textWrap },
                            constraints: (NodeConstraints.Default | NodeConstraints.HideThumbs) & ~
                                (NodeConstraints.Rotate | NodeConstraints.Drag | NodeConstraints.Resize),
                              minHeight: 25
                        } as NodeModel,
                        true);
                    diagram.initObject(temp);
                    diagram.nodes.push(temp);
                    node.children.push(temp.id);
                    memberText = '';
                    if (members.isSeparator && (i !== member.length - 1)) {
                        addSeparator(node, diagram);
                    }
                }
            }
        }
    } else {
        let attributes: UmlClassAttributeModel[] = (classifier as UmlClassModel).attributes;
        if (attributes.length) {
            let attributeText: string = '';
            addSeparator(node, diagram);
            for (let i: number = 0; i < attributes.length; i++) {
                let text: string;
                let attribute: UmlClassAttributeModel = attributes[i];
                if (attribute.scope && (attribute).scope === 'Public') {
                    text = ' +';
                } else if (attribute.scope && attribute.scope === 'Private') {
                    text = '-';
                } else if (attribute.scope && attribute.scope === 'Protected') {
                    text = '#';
                } else {
                    text = '~';
                }
                if (attribute.name !== '') {
                    if (text) {
                        attributeText += text + ' ' + attribute.name + ' ' + ': ' + attribute.type;
                    }
                }
                if (i !== attributes.length) {
                    let style: TextStyleModel = getStyle(node, attribute);
                    let temp: NodeModel = new Node(
                        diagram, 'nodes', {
                            id: randomId() + '_umlProperty', style: { fill: node.style.fill, strokeColor: '#ffffff00' },
                            annotations: [
                                {
                                    id: 'name', content: attributeText, offset: { x: 0, y: 0.5 },
                                    style: {
                                        bold: true, fontSize: style.fontSize, color: style.color, fill: style.fill,
                                        textWrapping: textWrap
                                    },
                                    margin: { left: 14, right: 5 }, horizontalAlignment: 'Left'
                                }
                            ], verticalAlignment: 'Stretch', horizontalAlignment: 'Stretch',
                            constraints: (NodeConstraints.Default | NodeConstraints.HideThumbs) & ~
                                (NodeConstraints.Rotate | NodeConstraints.Drag | NodeConstraints.Resize),
                              minHeight: 25
                        } as NodeModel,
                        true);
                    diagram.initObject(temp as Node);
                    diagram.nodes.push(temp);
                    node.children.push(temp.id);
                    attributeText = '';
                    if (attribute.isSeparator && (i !== attributes.length - 1)) {
                        addSeparator(node, diagram);
                    }
                }
            }
        }
    }
}

/** @private */
export function getClassMembers(node: Node, diagram: Diagram, classifier: UmlClassModel, textWrap: TextWrap): void {
    if ((classifier as UmlClassModel).methods && (classifier as UmlClassModel).methods.length) {
        let methods: UmlClassMethodModel[] = (classifier as UmlClassModel).methods;
        addSeparator(node, diagram);
        let argumentText: string = '';
        let methodText: string = '';
        let text: string;
        for (let i: number = 0; i < methods.length; i++) {
            let method: UmlClassMethodModel = methods[i];
            if (method.scope && method.scope === 'Public') {
                text = ' +';
            } else if (method.scope && method.scope === 'Private') {
                text = '-';
            } else if (method.scope && method.scope === 'Protected') {
                text = '#';
            } else {
                text = '~';
            }
            if (method.parameters) {
                for (let j: number = 0; j < method.parameters.length; j++) {
                    if (method.parameters[j].type) {
                        argumentText += method.parameters[j].name + ':' + method.parameters[j].type;
                    } else {
                        argumentText += method.parameters[j].name;
                    }
                    if (j !== method.parameters.length - 1) {
                        argumentText += ',';
                    }
                }
            }
            if (method.name !== '') {
                if (text) {
                    methodText += text + ' ' + method.name + '(' + argumentText + ')' + ' ' + ':' + ' ' + method.type;
                }
            }
            if (i !== methods.length) {
                let style: TextStyleModel = getStyle(node, method);
                let temp: NodeModel = new Node(
                    diagram, 'nodes', {
                        id: randomId() + '_umlMethods', verticalAlignment: 'Stretch', horizontalAlignment: 'Stretch',
                        annotations: [
                            {
                                id: 'name', content: methodText, offset: { x: 0, y: 0.5 },
                                style: {
                                    bold: true, fontSize: style.fontSize, color: style.color, fill: style.fill,
                                    textWrapping: textWrap
                                },
                                margin: { left: 14, right: 5 }, horizontalAlignment: 'Left'
                            }
                        ],
                        style: { fill: node.style.fill, strokeColor: '#ffffff00' },   minHeight: 25,
                        constraints: (NodeConstraints.Default | NodeConstraints.HideThumbs) & ~
                            (NodeConstraints.Rotate | NodeConstraints.Drag | NodeConstraints.Resize)
                    } as NodeModel,
                    true);
                diagram.initObject(temp as Node);
                diagram.nodes.push(temp);
                node.children.push(temp.id);
                methodText = '';
                if (method.isSeparator && (i !== methods.length - 1)) {
                    addSeparator(node, diagram);
                }
            }
        }
    }
}

/** @private */
export function addSeparator(stack: Node, diagram: Diagram): void {
    let lineObject: Node = new Node(
        diagram, 'nodes', {
            id: randomId() + '_path', height: 1, constraints: NodeConstraints.Default & ~(NodeConstraints.Select),
            verticalAlignment: 'Stretch', horizontalAlignment: 'Stretch',
        } as NodeModel,
        true);
    diagram.initObject(lineObject);
    diagram.nodes.push(lineObject);
    stack.children.push(lineObject.id);
}

/** @private */
export function getStyle(stack: Node, node: UmlClassModel): TextStyleModel {
    let newStyle: TextStyleModel = {};
    let style: TextStyleModel = (node.style as TextStyleModel);
    newStyle.fill = (style.fill !== 'transparent') ? style.fill : stack.style.fill;
    newStyle.color = style.color;
    newStyle.fontSize = (style.fontSize !== 12) ? style.fontSize : (stack.style as TextStyleModel).fontSize;
    newStyle.strokeColor = (style.strokeColor !== 'black') ? style.strokeColor : stack.style.strokeColor;
    newStyle.strokeWidth = (style.strokeWidth !== 1) ? style.strokeWidth : stack.style.strokeWidth;
    return newStyle;
}