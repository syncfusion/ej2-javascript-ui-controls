/**
 * UMLActivityShapeDictionary defines the shape of the built-in uml activity shapes \
 *
 * @returns { string } UMLActivityShapeDictionary defines the shape of the built-in uml activity shapes .\
 * @param {string} shape - provide the shape value.
 *
 * @private
 */
export function getUMLActivityShape(shape: string): string {
    return umlActivityShapes[shape.toString()];
}

/* eslint-disable */
let umlActivityShapes: {} = {
    // Action,
    'Action': 'M 90 82.895 C 90 86.819 86.776 90 82.8 90 H 7.2 C 3.224 90 0 86.819 0 82.895' +
        ' V 7.105 C 0 3.181 3.224 0 7.2 0 h 75.6 C 86.776 0 90 3.181 90 7.105 V 82.895 Z',
    // Decision,
    'Decision': 'M10,19.707L0.293,10L10,0.293L19.707,10L10,19.707z',
    // MergeNode,
    'MergeNode': 'M10,19.707L0.293,10L10,0.293L19.707,10L10,19.707z',
    // InitialNode,
    'InitialNode': 'M10,19.5c-5.238,0-9.5-4.262-9.5-9.5S4.762,0.5,10,0.5s9.5,4.262,9.5,9.5S15.238,19.5,10,19.5z',
    // ForkNode,
    'ForkNode': 'm0.75,0.75l636.00002,0l0,290l-636.00002,0l0,-290z',
    // JoinNode,
    'JoinNode': 'm0.75,0.75l636.00002,0l0,290l-636.00002,0l0,-290z',
    // TimeEvent,
    'TimeEvent': 'M50.001,0.00286865 L25.001,25.0029 L0.000976562,0.00286865 L50.001,0.00286865 z' +
        ' M0.000976562,50.0029 L25.001,25.0029 L50.001,50.0029 L0.000976562,50.0029 z',
    // AcceptingEvent,
    'AcceptingEvent': 'M17.8336 32.164 L29.64 24 L17.32 16 L48.1664 16 L48.5 32 Z',
    // SendSignal,
    'SendSignal': 'M48.164 31.8336 L56 23.832 L47.836 16 L16.168 16 L16.1668 31.8336 Z',
    // ReceiveSignal,
    'ReceiveSignal': 'M48.1664 31.8336 L39.836 24 L47.836 16 L16.168 16 L16.168 31.836 Z',
    // StructuredNode,
    'StructuredNode': 'M0,0 L50,0 L50,50 L0,50 z',
    // Note,
    'Note': 'M20 12 L4 12 L4 22 L22 22 L22 14 L20 14 L20 12 L22 14 Z'
};
/* eslint-enable */
