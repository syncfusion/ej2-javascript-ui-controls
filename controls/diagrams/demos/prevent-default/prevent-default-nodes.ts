
/**
 * FlowChart
 */

import {
    Diagram, NodeModel, TextStyleModel, BpmnShapeModel, BpmnDiagrams,
    PortVisibility, BpmnSubProcessModel, BpmnActivityModel, ShapeStyleModel, NodeConstraints, ConnectorModel, KeyModifiers, Keys, SnapConstraints
} from '../../src/diagram/index';

Diagram.Inject(BpmnDiagrams);

let nodes: NodeModel[] = [
    {
        id: 'NewIdea', width: 50, height: 50, offsetX: 400, offsetY: 60,
        shape: { type: 'Basic', shape: 'Rectangle' },
        annotations: [{
            id: 'label1', content: 'New idea identified', offset: { x: 0.5, y: 0.5 }
        }],
        ports: [
            {
                id: 'port1', shape: 'Square', style: { fill: 'blue'}, visibility: PortVisibility.Visible
            }
        ]
    }, {
        id: 'Meeting', width: 50, height: 50, offsetX: 400, offsetY: 125,
        shape: { type: 'Flow', shape: 'Process' },
        annotations: [{
            id: 'label2', content: 'Meeting with board', offset: { x: 0.5, y: 0.5 }
        }],
        ports: [
            {
                id: 'port1', shape: 'X', style: { fill: 'blue'}, visibility: PortVisibility.Visible
            }
        ]
    }, {
        id: 'BoardDecision', width: 50, height: 50, offsetX: 400, offsetY: 200,
        shape: { type: 'Text', content: 'abc' },
        annotations: [{
            id: 'label3', content: 'Board decides whether to proceed', offset: { x: 0.5, y: 0.5 },
            margin: { left: 25, right: 25 },
            style: { whiteSpace: 'PreserveAll' }
        }]
    }, {
        id: 'Project', width: 50, height: 50, offsetX: 400, offsetY: 280,
        shape: { type: 'Image', source: 'https://www.w3schools.com/images/w3schools_green.jpg' },
        annotations: [{
            id: 'label4', content: 'Find Project manager', offset: { x: 0.5, y: 0.5 },
        }]
    }, {
        id: 'End', width: 50, height: 50, offsetX: 400, offsetY: 350,
        shape: {
            type: 'Native',
            content:
            '<g xmlns="http://www.w3.org/2000/svg"><g transform="translate(1 1)"><g>' +
            '<path style="fill:#61443C;" d="M61.979,435.057c2.645-0.512,5.291-0.853,7.936-1.109c-2.01,1.33-4.472,1.791-6.827,1.28' +
            'C62.726,435.13,62.354,435.072,61.979,435.057z"/><path style="fill:#61443C;"' +
            'd="M502.469,502.471h-25.6c0.163-30.757-20.173-57.861-49.749-66.304c-5.784-1.581-11.753-2.385-17.749-2.389' +
            'c-2.425-0.028-4.849,0.114-7.253,0.427c1.831-7.63,2.747-15.45,2.731-23.296' +
            'c0.377-47.729-34.52-88.418-81.749-95.317c4.274-0.545,8.577-0.83,12.885-0.853c25.285,0.211,49.448,10.466,67.167,28.504' +
            'c17.719,18.039,27.539,42.382,27.297,67.666c0.017,7.846-0.9,15.666-2.731,23.296c2.405-0.312,4.829-0.455,7.253-0.427' +
            'C472.572,434.123,502.783,464.869,502.469,502.471z"/></g><path style="fill:#8B685A;"' +
            'd="M476.869,502.471H7.536c-0.191-32.558,22.574-60.747,54.443-67.413' +
            'c0.375,0.015,0.747,0.072,1.109,0.171c2.355,0.511,4.817,0.05,6.827-1.28c1.707-0.085,3.413-0.171,5.12-0.171' +
            'c4.59,0,9.166,0.486,13.653,1.451c2.324,0.559,4.775,0.147,6.787-1.141c2.013-1.288,3.414-3.341,3.879-5.685' +
            'c7.68-39.706,39.605-70.228,79.616-76.117c4.325-0.616,8.687-0.929,13.056-0.939c13.281-0.016,26.409,2.837,38.485,8.363' +
            'c3.917,1.823,7.708,3.904,11.349,6.229c2.039,1.304,4.527,1.705,6.872,1.106c2.345-0.598,4.337-2.142,5.502-4.264' +
            'c14.373-25.502,39.733-42.923,68.693-47.189h0.171c47.229,6.899,82.127,47.588,81.749,95.317' +
            'c0.017,7.846-0.9,15.666-2.731,23.296' +
            'c2.405-0.312,4.829-0.455,7.253-0.427c5.996,0.005,11.965,0.808,17.749,2.389C456.696,444.61,477.033,471.713,476.869,502.471' +
            'L476.869,502.471z"/><path style="fill:#66993E;" d="M502.469,7.537c0,0-6.997,264.96-192.512,252.245' +
            'c-20.217-1.549-40.166-5.59-59.392-12.032c-1.365-0.341-2.731-0.853-4.096-1.28c0,0-0.597-2.219-1.451-6.144' +
            'c-6.656-34.048-25.088-198.997,231.765-230.144C485.061,9.159,493.595,8.22,502.469,7.537z"/><path style="fill:#9ACA5C;"' +
            'd="M476.784,10.183c-1.28,26.197-16.213,238.165-166.827,249.6c-20.217-1.549-40.166-5.59-59.392-12.032' +
            'c-1.365-0.341-2.731-0.853-4.096-1.28c0,0-0.597-2.219-1.451-6.144C238.363,206.279,219.931,41.329,476.784,10.183z"/>' +
            '<path style="fill:#66993E;" d="M206.192,246.727c-0.768,3.925-1.365,6.144-1.365,6.144c-1.365,0.427-2.731,0.939-4.096,1.28' +
            'c-21.505,7.427-44.293,10.417-66.987,8.789C21.104,252.103,8.816,94.236,7.621,71.452c-0.085-1.792-0.085-2.731-0.085-2.731' +
            'C222.747,86.129,211.653,216.689,206.192,246.727z"/><path style="fill:#9ACA5C;" d="M180.336,246.727' +
            'c-0.768,3.925-1.365,6.144-1.365,6.144c-1.365,0.427-2.731,0.939-4.096,1.28c-13.351,4.412-27.142,7.359-41.131,8.789' +
            'C21.104,252.103,8.816,94.236,7.621,71.452C195.952,96.881,185.541,217.969,180.336,246.727z"/></g><g><path' +
            'd="M162.136,426.671c3.451-0.001,6.562-2.08,7.882-5.268s0.591-6.858-1.849-9.298l-8.533-8.533' +
            'c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533' +
            'C157.701,425.773,159.872,426.673,162.136,426.671L162.136,426.671z"/><path d="M292.636,398.57' +
            'c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012l-8.533-8.533' +
            'c-3.341-3.281-8.701-3.256-12.012,0.054s-3.335,8.671-0.054,12.012L292.636,398.57z"/><path' +
            'd="M296.169,454.771c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533' +
            'c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012L296.169,454.771z"/>' +
            '<path d="M386.503,475.37c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012l-8.533-8.533' +
            'c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012L386.503,475.37z"/><path d="M204.803,409.604' +
            'c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012' +
            'c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298' +
            'C198.241,407.524,201.352,409.603,204.803,409.604z"/><path d="M332.803,443.737c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533' +
            'c3.281-3.341,3.256-8.701-0.054-12.012c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298' +
            'C326.241,441.658,329.352,443.737,332.803,443.737z"/><path d="M341.336,366.937c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533' +
            'c3.281-3.341,3.256-8.701-0.054-12.012c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298' +
            'C334.774,364.858,337.885,366.937,341.336,366.937z"/><path' +
            'd="M164.636,454.771l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271' +
            'c0.785,2.965,3.1,5.28,6.065,6.065c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012' +
            'C173.337,451.515,167.977,451.49,164.636,454.771L164.636,454.771z"/><path d="M232.903,429.171l-8.533,8.533' +
            'c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533' +
            'c3.281-3.341,3.256-8.701-0.054-12.012C241.604,425.915,236.243,425.89,232.903,429.171L232.903,429.171z"/><path' +
            'd="M384.003,409.604c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012' +
            'c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298' +
            'C377.441,407.524,380.552,409.603,384.003,409.604z"/><path d="M70.77,463.304l-8.533,8.533' +
            'c-2.188,2.149-3.055,5.307-2.27,8.271s3.1,5.28,6.065,6.065c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533' +
            'c3.281-3.341,3.256-8.701-0.054-12.012C79.47,460.048,74.11,460.024,70.77,463.304L70.77,463.304z"/>' +
            '<path d="M121.97,446.238l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065' +
            'c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012' +
            'C130.67,442.981,125.31,442.957,121.97,446.238L121.97,446.238z"/><path d="M202.302,420.638c-1.6-1.601-3.77-2.5-6.033-2.5' +
            'c-2.263,0-4.433,0.899-6.033,2.5l-8.533,8.533c-2.178,2.151-3.037,5.304-2.251,8.262c0.786,2.958,3.097,5.269,6.055,6.055' +
            'c2.958,0.786,6.111-0.073,8.262-2.251l8.533-8.533c1.601-1.6,2.5-3.77,2.5-6.033' +
            'C204.802,424.408,203.903,422.237,202.302,420.638L202.302,420.638z"/><path d="M210.836,463.304' +
            'c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533' +
            'c2.149,2.188,5.307,3.055,8.271,2.27c2.965-0.785,5.28-3.1,6.065-6.065c0.785-2.965-0.082-6.122-2.27-8.271L210.836,463.304z"/>' +
            '<path d="M343.836,454.771l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065' +
            'c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012' +
            'C352.537,451.515,347.177,451.49,343.836,454.771L343.836,454.771z"/><path d="M429.17,483.904' +
            'c3.341,3.281,8.701,3.256,12.012-0.054s3.335-8.671,0.054-12.012l-8.533-8.533c-3.341-3.281-8.701-3.256-12.012,0.054' +
            'c-3.311,3.311-3.335,8.671-0.054,12.012L429.17,483.904z"/><path d="M341.336,401.071' +
            'c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012s-8.671-3.335-12.012-0.054l-8.533,8.533' +
            'c-2.44,2.441-3.169,6.11-1.849,9.298C334.774,398.991,337.885,401.07,341.336,401.071z"/><path d="M273.069,435.204' +
            'c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012s-8.671-3.335-12.012-0.054l-8.533,8.533' +
            'c-2.44,2.44-3.169,6.11-1.849,9.298C266.508,433.124,269.618,435.203,273.069,435.204z"/><path d="M253.318,258.138' +
            'c22.738,7.382,46.448,11.338,70.351,11.737c31.602,0.543,62.581-8.828,88.583-26.796c94.225-65.725,99.567-227.462,99.75-234.317' +
            'c0.059-2.421-0.91-4.754-2.667-6.421c-1.751-1.679-4.141-2.52-6.558-2.308C387.311,9.396,307.586,44.542,265.819,104.5' +
            'c-28.443,42.151-38.198,94.184-26.956,143.776c-3.411,8.366-6.04,17.03-7.852,25.881c-4.581-7.691-9.996-14.854-16.147-21.358' +
            'c8.023-38.158,0.241-77.939-21.57-110.261C160.753,95.829,98.828,68.458,9.228,61.196c-2.417-0.214-4.808,0.628-6.558,2.308' +
            'c-1.757,1.667-2.726,4-2.667,6.421c0.142,5.321,4.292,130.929,77.717,182.142c20.358,14.081,44.617,21.428,69.367,21.008' +
            'c18.624-0.309,37.097-3.388,54.814-9.138c11.69,12.508,20.523,27.407,25.889,43.665c0.149,15.133,2.158,30.19,5.982,44.832' +
            'c-12.842-5.666-26.723-8.595-40.759-8.6c-49.449,0.497-91.788,35.567-101.483,84.058c-5.094-1.093-10.29-1.641-15.5-1.638' +
            'c-42.295,0.38-76.303,34.921-76.025,77.217c-0.001,2.263,0.898,4.434,2.499,6.035c1.6,1.6,3.771,2.499,6.035,2.499h494.933' +
            'c2.263,0.001,4.434-0.898,6.035-2.499c1.6-1.6,2.499-3.771,2.499-6.035c0.249-41.103-31.914-75.112-72.967-77.154' +
            'c0.65-4.78,0.975-9.598,0.975-14.421c0.914-45.674-28.469-86.455-72.083-100.045c-43.615-13.59-90.962,3.282-116.154,41.391' +
            'C242.252,322.17,242.793,288.884,253.318,258.138L253.318,258.138z M87.519,238.092c-55.35-38.567-67.358-129.25-69.833-158.996' +
            'c78.8,7.921,133.092,32.454,161.458,72.992c15.333,22.503,22.859,49.414,21.423,76.606' +
            'c-23.253-35.362-77.83-105.726-162.473-140.577' +
            'c-2.82-1.165-6.048-0.736-8.466,1.125s-3.658,4.873-3.252,7.897c0.406,3.024,2.395,5.602,5.218,6.761' +
            'c89.261,36.751,144.772,117.776,161.392,144.874C150.795,260.908,115.29,257.451,87.519,238.092z' +
            'M279.969,114.046c37.6-53.788,109.708-86.113,214.408-96.138c-2.65,35.375-17.158,159.05-91.892,211.175' +
            'c-37.438,26.116-85.311,30.57-142.305,13.433c19.284-32.09,92.484-142.574,212.405-191.954c2.819-1.161,4.805-3.738,5.209-6.76' +
            'c0.404-3.022-0.835-6.031-3.25-7.892c-2.415-1.861-5.64-2.292-8.459-1.131C351.388,82.01,279.465,179.805,252.231,222.711' +
            'C248.573,184.367,258.381,145.945,279.969,114.046L279.969,114.046z M262.694,368.017c15.097-26.883,43.468-43.587,74.3-43.746' +
            'c47.906,0.521,86.353,39.717,85.95,87.625c-0.001,7.188-0.857,14.351-2.55,21.337c-0.67,2.763,0.08,5.677,1.999,7.774' +
            'c1.919,2.097,4.757,3.1,7.568,2.676c1.994-0.272,4.005-0.393,6.017-0.362c29.59,0.283,54.467,22.284,58.367,51.617H17.661' +
            'c3.899-29.333,28.777-51.334,58.367-51.617c4-0.004,7.989,0.416,11.9,1.254c4.622,0.985,9.447,0.098,13.417-2.467' +
            'c3.858-2.519,6.531-6.493,7.408-11.017c7.793-40.473,43.043-69.838,84.258-70.192c16.045-0.002,31.757,4.582,45.283,13.212' +
            'c4.01,2.561,8.897,3.358,13.512,2.205C256.422,375.165,260.36,372.163,262.694,368.017L262.694,368.017z"/>	</g></g>'
        },
        annotations: [{
            id: 'label5', content: 'Implement and Deliver', offset: { x: 0.5, y: 0.5 },
        }],
    }, {
        id: 'Decision', width: 250, height: 60, offsetX: 600, offsetY: 60,
        shape: { type: 'HTML', content: '<div> <input type="button" value="Select" id="Select-node" /> </div>' },
        annotations: [{
            id: 'label6', content: 'Decision Process for new software ideas', offset: { x: 0.5, y: 0.5 },
            style: { whiteSpace: 'PreserveAll' } as TextStyleModel
        }]
    }, {
        id: 'Reject', width: 50, height: 50, offsetX: 600, offsetY: 200,
        shape: { type: 'Path', data: 'M0,0 L100,100 L100,0 L0,100, L0,0 L100,0 L100,100 L0,100 Z' },
        annotations: [{
            id: 'label7', content: 'Reject and write report', offset: { x: 0.5, y: 0.5 },
        }],
        style: { gradient: {
            x1: 0, y1: 0, x2: 50, y2: 50, stops: [{ color: '#00555b', offset: 0 }, { color: '#37909A', offset: 90 }],
            type: 'Linear'
        } }
    }, {
        id: 'Resources', width: 50, height: 50, offsetX: 600, offsetY: 280,
        shape: {
            type: 'Bpmn', shape: 'DataObject',
            dataObject: { collection: false, type: 'Input' },
            annotations: [{ id: 'left', angle: 170, length: 150, text: 'Left', },
            { id: 'right', angle: 30, length: 150, text: 'Right', },
            { id: 'top', angle: 270, length: 150, text: 'Top' },
            { id: 'bottom', angle: 120, length: 150, text: 'Bottom' }
            ]
        } as BpmnShapeModel,
    }, {
        id: 'node11', width: 50, height: 50, offsetX: 600, offsetY: 150, isExpanded: false,
        collapseIcon: {
            height: 20, width: 20, shape: 'Template',
            content:
                '<g><path d="M90,43.841c0,24.213-19.779,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455L0,90l7.975-23.522' +
                'c-4.023-6.606-6.34-14.354-6.34-22.637C1.635,19.628,21.416,0,45.818,0C70.223,0,90,19.628,90,43.841z M45.818,6.982' +
                'c-20.484,0-37.146,16.535-37.146,36.859c0,8.065,2.629,15.534,7.076,21.61L11.107,79.14l14.275-4.537' +
                'c5.865,3.851,12.891,6.097,20.437,6.097c20.481,0,37.146-16.533,37.146-36.857S66.301,6.982,45.818,6.982z' +
                ' M68.129,53.938' +
                'c-0.273-0.447-0.994-0.717-2.076-1.254c-1.084-0.537-6.41-3.138-7.4-3.495c-0.993-0.358-1.717-0.538-2.438,0.537' +
                'c-0.721,1.076-2.797,3.495-3.43,4.212c-0.632,0.719-1.263,0.809-2.347,0.271c-1.082-0.537-4.571-1.673-8.708-5.333' +
                'c-3.219-2.848-5.393-6.364-6.025-7.441c-0.631-1.075-0.066-1.656,0.475-2.191c0.488-0.482,1.084-1.255,1.625-1.882' +
                'c0.543-0.628,0.723-1.075,1.082-1.793c0.363-0.717,0.182-1.344-0.09-1.883c-0.27-0.537-2.438-5.825-3.34-7.977' +
                'c-0.902-2.15-1.803-1.792-2.436-1.792c-0.631,0-1.354-0.09-2.076-0.09c-0.722,0-1.896,0.269-2.889,1.344' +
                'c-0.992,1.076-3.789,3.676-3.789,8.963c0,5.288,3.879,10.397,4.422,11.113c0.541,0.716,7.49,11.92,18.5,16.223' +
                'C58.2,65.771,58.2,64.336,60.186,64.156c1.984-0.179,6.406-2.599,7.312-5.107' +
                'C68.398,56.537,68.398,54.386,68.129,53.938z"></path></g>'
        }
    },  {
        id: 'node12', width: 50, height: 50, offsetX: 100, offsetY: 100,
        tooltip: {
            content: 'b',
            position: 'TopRight',
            relativeMode: 'Object'
        },
        constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
    }, {
        id: 'node13', width: 50, height: 50,
        constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
        offsetX: 100, offsetY: 200,
        shape: {
            type: 'Bpmn', shape: 'Activity', activity: {
                activity: 'SubProcess',
                subProcess: {
                    collapsed: false, type: 'Event',
                    processes: ['start', 'end', 'nod1', 'nod']
                } as BpmnSubProcessModel
            } as BpmnActivityModel,
        },
    }, {
        id: 'node14', width: 50, height: 50, offsetX: 100, offsetY: 250,
        shape: {
            type: 'Bpmn', shape: 'Event',
            event: { event: 'NonInterruptingStart', trigger: 'Multiple' }
        }
    }, {
        id: 'node15', width: 50, height: 50, offsetX: 100, offsetY: 350,
        shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'None' } } as BpmnShapeModel,
    }, {
        id: 'node16', width: 50, height: 50, offsetX: 500, offsetY: 250,
        style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5 } as ShapeStyleModel,
        shadow: { angle: 135 }, constraints: NodeConstraints.Default | NodeConstraints.Shadow,
        shape: {
            type: 'Bpmn', shape: 'DataObject',
            dataObject: { collection: false, type: 'Input' },
            annotations: [
                { id: 'annot1', angle: 30, length: 150, text: 'textAnnotation1' },
                { id: 'annot2', angle: 90, width: 50, height: 50, length: 150, text: 'textAnnotation2' },
                { id: 'annot3', angle: 180, width: 50, height: 50, length: 150, text: 'textAnnotation3' },
                { id: 'annot4', angle: 280, width: 50, height: 50, length: 150, text: 'textAnnotation4' }
            ]
        } as BpmnShapeModel,
    }, {
        id: 'node17', width: 50, height: 50, offsetX: 225, offsetY: 100,
        style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5 },
        shape: {
            type: 'Bpmn', shape: 'Activity', activity: {
                activity: 'SubProcess',
                subProcess: { collapsed: true, compensation: true }
            },
        }
    }, {
        id: 'node18', width: 50, height: 50, offsetX: 225, offsetY: 200,
        style: { strokeWidth: 5, strokeDashArray: '2 2' },
        shape: {
            type: 'Bpmn', shape: 'Activity', activity: {
                activity: 'Task', task: {
                    type: 'Manual', compensation: false,
                }
            },
        },
    }, {
        id: 'node19', width: 50, height: 50, offsetX: 225, offsetY: 300,
        style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, } as ShapeStyleModel,
        shape: {
            type: 'Bpmn', shape: 'Activity', activity: {
                activity: 'SubProcess',
                subProcess: { type: 'Transaction' }
            }
        }
    }
];

let connector1: ConnectorModel = {
    id: 'connector1', type: 'Straight', sourceID: 'NewIdea', targetID: 'Meeting',
    targetDecorator: {shape: 'Diamond'}
};
let connector2: ConnectorModel = {
    id: 'connector2', type: 'Orthogonal', sourceID: 'Meeting', targetID: 'BoardDecision',
    targetDecorator: {shape: 'DoubleArrow'}
};
let connector3: ConnectorModel = {
    id: 'connector3', type: 'Bezier', sourceID: 'BoardDecision', targetID: 'Project',
    sourceDecorator: {shape: 'IndentedArrow'}
};
let connector4: ConnectorModel = {
    id: 'connector4', type: 'Orthogonal', sourceID: 'Project', targetID: 'End',
    segments: [{direction: 'Top', type: 'Orthogonal', length: 50}, {direction: 'Left', type: 'Orthogonal', length: 50}],
};
let connector5: ConnectorModel = {
    id: 'connector5', type: 'Bezier', sourceID: 'BoardDecision', targetID: 'Reject',
    segments: [{direction: 'Bottom', type: 'Bezier', length: 50}],
};
let connector6: ConnectorModel = {
    id: 'connector6', type: 'Straight', sourceID: 'Project', targetID: 'Resources',
    segments: [{direction: 'Left', type: 'Straight', length: 50}],
};

let diagram: Diagram = new Diagram({
    width: 800, height: 400, nodes: nodes,
    connectors: [connector1, connector2, connector3, connector4, connector5, connector6],
    serializationSettings: { preventDefaults: true },
    pageSettings: {
        background: {
            color: 'red',
        },
        height: 500,
        margin: {bottom: 300, left: 100, top: 100, right: 200 },
        multiplePage: true,
        orientation: 'Portrait',
        showPageBreaks: true,
        width: 500
    },
    contextMenuSettings: {
        show: true,
        items: [{
            id: 'abc', text: 'copy'
        }]
    },
    commandManager: {
        commands: [
            {
                name: 'clone',
                canExecute: () => {
                    if (diagram.selectedItems.nodes.length > 0 || diagram.selectedItems.connectors.length > 0) {
                        return true;
                    }
                    return false;
                },

                execute: () => {
                    diagram.copy();
                    diagram.paste();
                },

                //Defines that the clone command has to be executed on the recognition of Shift+C key press.
                gesture: {
                    key: Keys.C,
                    keyModifiers: KeyModifiers.Shift
                }
            },
            {
                name: 'copy',
                canExecute: () => {
                    if (diagram.selectedItems.nodes.length > 0 || diagram.selectedItems.connectors.length > 0) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: 'undo',
                gesture: {
                    key: Keys.G,
                    keyModifiers: KeyModifiers.Alt
                }
            }

        ]
    },
    rulerSettings: {
        showRulers: true,
        horizontalRuler: {
            thickness: 30,
            tickAlignment: 'RightOrBottom',
            segmentWidth: 50,
            markerColor: 'blue',
        },
        verticalRuler: {
            thickness: 20,
            tickAlignment: 'LeftOrTop',
            segmentWidth: 50,
            markerColor: 'red',
        }
    },
    snapSettings: {
        constraints: SnapConstraints.ShowHorizontalLines,
        horizontalGridlines: {
            lineIntervals: [ 1.5, 8.5, 0.5, 9.5, 0.5, 9.5, 0.5, 9.5, 0.5, 9.5],
            snapIntervals: [25],
            lineColor: 'blue'
        },
        verticalGridlines: {
            lineIntervals: [ 1.5, 8.5, 0.5, 9.5, 0.5, 9.5, 0.5, 9.5, 0.5, 9.5],
            snapIntervals: [50],
            lineColor: 'green'
        },
        snapAngle: 90,
        snapObjectDistance: 50
    }
});

diagram.appendTo('#diagram');

let savedata: string;

document.getElementById('btnSave').onclick = () => {
    diagram.serializationSettings.preventDefaults = false;
    diagram.dataBind();
    savedata = diagram.saveDiagram();
    document.getElementById('save-length').innerHTML = 'Before OPtimization:\t' + savedata.length.toString();
    diagram.serializationSettings.preventDefaults = true;
    diagram.dataBind();
    savedata = diagram.saveDiagram();
    document.getElementById('prevent-length').innerHTML = 'After OPtimization:\t' + savedata.length.toString();
    localStorage.setItem((document.getElementById('savedreport') as HTMLInputElement).value, savedata);
};


document.getElementById('btnLoad').onclick = () => {
    savedata = localStorage.getItem((document.getElementById('drpdwn') as HTMLInputElement).value);
    diagram.loadDiagram(savedata);
};