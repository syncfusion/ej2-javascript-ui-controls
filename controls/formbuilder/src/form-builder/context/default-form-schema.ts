import { FormNode, FormSchema } from '@syncfusion/ej2-form-renderer';

/** @private */
export function defaultFormSchema(): any {
    const defaultSubmit: FormNode = {
        id: 'default-submit-button',
        type: 'button',
        name: 'defaultSubmit',
        label: 'Submit',
        buttonType: 'submit',
        _configured: true
    } as FormNode;

    return {
        version: '0.1.0',
        components: [defaultSubmit],
        settings: {
            name: 'Untitled Form'
        }
    };
}

/** @private */
export function isDefaultFormSchema(schema: FormSchema | null | undefined): boolean {
    if (!schema || !schema.components || schema.components.length === 0) {
        return true;
    }
    if (schema.components.length === 1) {
        const only: FormNode = schema.components[0];
        if (only && only.id && /^default-/.test(only.id)) {
            return true;
        }
        if (only && only.type === 'button' && only.buttonType === 'submit' &&
            (!only.id || /^default-/.test(only.id))) {
            return true;
        }
    }
    return false;
}
