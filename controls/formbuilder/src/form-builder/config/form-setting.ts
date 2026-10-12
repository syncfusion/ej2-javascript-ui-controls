import { PropertyGroup } from '../types/component-properties';

/** @private */
const config: { groups: PropertyGroup[] } =
{
    "groups": [
        {
            "name": "Properties",
            "properties": [
                {
                    "key": "name",
                    "label": "title",
                    "type": "text",
                    "default": "Untitled Form"
                },
                {
                    "key": "width",
                    "label": "width",
                    "type": "text",
                    "default": "500px"
                }
            ]
        },
        {
            "name": "Layout",
            "properties": [
                {
                    "key": "hideLabel",
                    "label": "hideLabel",
                    "type": "switch",
                    "default": false,
                    "description": "hideLabelDescription"
                },
                {
                    "key": "size",
                    "label": "size",
                    "type": "dropdown",
                    "default": "Default",
                    "options": [
                        "default",
                        "small",
                        "bigger"
                    ],
                    "description": "sizeDescription"
                },
                {
                    "key": "floatLabelType",
                    "label": "floatLabelType",
                    "type": "dropdown",
                    "default": "Never",
                    "options": [
                        "never",
                        "always"
                    ],
                    "description": "floatLabelTypeDescription"
                }
            ]
        }
    ]
};
export default config;
