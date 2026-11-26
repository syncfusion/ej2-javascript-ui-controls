import { WorkflowStepCollectionSettingsModel } from '../models/workflow-node-collection-settings-model';
import { WorkflowCustomStepDefinitionModel, WorkflowCustomFieldDefinitionModel } from '../models/workflow-custom-step-model';
import { WorkflowNodeCatalog, WorkflowNodeCatalogEntry } from './node-catalog';

const CATEGORY_SETTING: { [category: string]: string } = {
    Triggers: 'triggers',
    Actions: 'actions',
    Flow: 'flow',
    Human: 'human',
    AI: 'ai',
    Output: 'output'
};

/** Step property names a custom field must not use. */
const RESERVED_KEYS: string[] = ['__proto__', 'constructor', 'prototype'];

/**
 * Resolves which palette entries `stepCollectionSettings` enables and the custom step definitions it supplies.
 *
 * @private
 */
export class CustomStepResolver {
    /**
     * Returns the built-in entries and the custom entries enabled by the settings, in palette order.
     *
     * @param {WorkflowStepCollectionSettingsModel} settings The step collection settings.
     * @returns {WorkflowNodeCatalogEntry[]} The enabled entries.
     */
    public static getEntries(settings?: WorkflowStepCollectionSettingsModel): WorkflowNodeCatalogEntry[] {
        const builtIn: WorkflowNodeCatalogEntry[] = WorkflowNodeCatalog.getEntries()
            .filter((entry: WorkflowNodeCatalogEntry): boolean => entry.category !== 'Custom');
        const result: WorkflowNodeCatalogEntry[] = [];
        Object.keys(CATEGORY_SETTING).forEach((category: string): void => {
            const inCategory: WorkflowNodeCatalogEntry[] = builtIn
                .filter((entry: WorkflowNodeCatalogEntry): boolean => entry.category === category);
            const configured: unknown = settings
                ? (settings as unknown as { [key: string]: unknown })[CATEGORY_SETTING[`${category}`]] : undefined;
            if (!Array.isArray(configured)) {
                result.push(...inCategory);
                return;
            }
            const seen: string[] = [];
            (configured as unknown[]).forEach((value: unknown): void => {
                const entry: WorkflowNodeCatalogEntry | undefined = inCategory
                    .filter((candidate: WorkflowNodeCatalogEntry): boolean => candidate.stepType === value)[0];
                if (entry && seen.indexOf(entry.stepType) === -1) {
                    seen.push(entry.stepType);
                    result.push(entry);
                }
            });
        });
        CustomStepResolver.getDefinitions(settings).forEach((definition: WorkflowCustomStepDefinitionModel): void => {
            result.push({
                stepType: 'Custom',
                label: definition.name || definition.id,
                category: 'Custom',
                icon: definition.iconCss || 'e-border-custom',
                isTrigger: false,
                customStepId: definition.id,
                description: definition.description || undefined
            });
        });
        return result;
    }

    /**
     * Returns the usable custom definitions: those with an id and a name, with duplicate ids dropped
     * (the first wins).
     *
     * @param {WorkflowStepCollectionSettingsModel} settings The step collection settings.
     * @returns {WorkflowCustomStepDefinitionModel[]} The definitions.
     */
    public static getDefinitions(settings?: WorkflowStepCollectionSettingsModel): WorkflowCustomStepDefinitionModel[] {
        const list: WorkflowCustomStepDefinitionModel[] = settings && Array.isArray(settings.custom) ? settings.custom : [];
        const seen: string[] = [];
        return list.filter((definition: WorkflowCustomStepDefinitionModel): boolean => {
            if (!definition || typeof definition.id !== 'string' || !definition.id || seen.indexOf(definition.id) !== -1) {
                return false;
            }
            seen.push(definition.id);
            return true;
        });
    }

    /**
     * Finds a definition by id.
     *
     * @param {WorkflowStepCollectionSettingsModel} settings The step collection settings.
     * @param {string} id The custom step id.
     * @returns {WorkflowCustomStepDefinitionModel | undefined} The definition, if configured.
     */
    public static find(
        settings: WorkflowStepCollectionSettingsModel | undefined,
        id: string | undefined
    ): WorkflowCustomStepDefinitionModel | undefined {
        return id ? CustomStepResolver.getDefinitions(settings).filter(
            (definition: WorkflowCustomStepDefinitionModel): boolean => definition.id === id)[0] : undefined;
    }

    /**
     * Returns the fields of a definition with reserved and duplicate keys removed.
     *
     * @param {WorkflowCustomStepDefinitionModel} definition The definition.
     * @returns {WorkflowCustomFieldDefinitionModel[]} The usable fields.
     */
    public static getFields(definition: WorkflowCustomStepDefinitionModel): WorkflowCustomFieldDefinitionModel[] {
        const seen: string[] = [];
        return (Array.isArray(definition.fields) ? definition.fields : []).filter(
            (field: WorkflowCustomFieldDefinitionModel): boolean => {
                if (!field || !field.key || RESERVED_KEYS.indexOf(field.key) !== -1 || seen.indexOf(field.key) !== -1) {
                    return false;
                }
                seen.push(field.key);
                return true;
            });
    }

    /**
     * Resolves the field values of a step: values already on the step win, then the
     * field's `defaultValue`. Only `undefined` counts as missing, so `0`, `false`, `''` and `[]` are kept.
     * Defaults are deep-copied; keys not defined by any field are preserved.
     *
     * @param {WorkflowCustomStepDefinitionModel} definition The definition.
     * @param {Record<string, unknown>} existing The values already on the step.
     * @returns {Record<string, unknown>} The resolved values.
     */
    public static resolveValues(
        definition: WorkflowCustomStepDefinitionModel,
        existing?: Record<string, unknown>
    ): Record<string, unknown> {
        const result: Record<string, unknown> = {};
        const source: Record<string, unknown> = existing || {};
        Object.keys(source).forEach((key: string): void => {
            result[`${key}`] = CustomStepResolver.clone(source[`${key}`]);
        });
        CustomStepResolver.getFields(definition).forEach((field: WorkflowCustomFieldDefinitionModel): void => {
            if (result[field.key] === undefined && field.defaultValue !== undefined && field.defaultValue !== null) {
                result[field.key] = CustomStepResolver.clone(field.defaultValue);
            }
        });
        return result;
    }

    /**
     * Deep-copies a JSON-safe value.
     *
     * @param {unknown} value The value.
     * @returns {unknown} The copy.
     */
    public static clone(value: unknown): unknown {
        return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
    }
}
