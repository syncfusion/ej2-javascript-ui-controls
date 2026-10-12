import { PropertyDefinition } from '../model/base';

/** @private */
export interface PropertyGroup {
    name?: string;
    properties: PropertyDefinition[];
}

/** @private */
export interface ComponentDefinition {
    type?: string;
    displayName?: string;
    category?: string;
    groups: PropertyGroup[];
}

/** @private */
export interface WidgetConfig {
    [key: string]: ComponentDefinition;
}

/** @private */
export interface PropertyValues {
    [key: string]: any;
}
