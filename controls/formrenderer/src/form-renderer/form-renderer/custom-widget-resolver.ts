import { FormNode } from './types/form-schema';
import { CustomWidgetSettingModel } from './form-renderer-model';

/**
 * @private
 */
export type CustomWidgetMatchKind = 'fieldName' | 'templateId' | 'type';

/**
 * @private
 */
export interface ResolvedCustomWidget {
    entry: CustomWidgetSettingModel;
    matchKind: CustomWidgetMatchKind;
}

/**
 * @private
 */
export function resolveCustomWidget(
    component: FormNode,
    settings: CustomWidgetSettingModel[] | undefined
): ResolvedCustomWidget | null {
    if (!settings || settings.length === 0) {
        return null;
    }

    const compName: string = component.name;
    if (typeof compName === 'string' && compName.length > 0) {
        for (const entry of settings) {
            const fn: string | undefined = entry.fieldName;
            if (typeof fn === 'string' && fn.length > 0 && fn === compName) {
                return { entry: entry, matchKind: 'fieldName' };
            }
        }
    }

    const compTemplateId: any = (component as any).templateId;
    if (typeof compTemplateId === 'string' && compTemplateId.length > 0) {
        for (const entry of settings) {
            const eid: string | undefined = entry.templateId;
            if (typeof eid === 'string' && eid.length > 0 && eid === compTemplateId) {
                return { entry: entry, matchKind: 'templateId' };
            }
        }
    }

    const compType: string = component.type;
    if (typeof compType === 'string' && compType.length > 0) {
        for (const entry of settings) {
            const et: string | undefined = entry.type;
            if (typeof et === 'string' && et.length > 0 && et === compType) {
                return { entry: entry, matchKind: 'type' };
            }
        }
    }

    return null;
}
