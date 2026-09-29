/**
 * Schema definition helpers for FormRenderer coverage tests.
 *
 * Every helper below returns a strongly-typed `Schema` (the render-time
 * shape consumed by `FormRenderer` in `src/form-renderer/form-renderer.ts`)
 * so the test bodies in this folder can `new FormRenderer({ schema: ... })`
 * and exercise the component end-to-end without ever touching
 * `ConditionalRuleEngine`, `ExpressionEngine`, `MinMaxRuleEngine`,
 * `CustomValidationEngine`, `UniversalJsonParser`, or any other helper
 * class directly. Coverage is attained solely through the
 * `FormRenderer` public surface.
 *
 * Keeping the schemas here (rather than inlined in each spec) lets us
 * reuse the same shape across multiple behavioural assertions without
 * duplicating hundreds of lines of JSON-like object literals.
 */

import { Schema, FormNode } from '../src/index';

/** Build a single field schema with a single component of the given type. */
export function singleFieldSchema(type: FormNode['type'], overrides: Partial<FormNode> = {}): Schema {
    const id: string = `${type}_id`;
    const name: string = `${type}_name`;
    const node: FormNode = {
        id,
        type,
        name,
        label: `Test ${type}`,
        ...overrides
    } as FormNode;
    return {
        version: '0.1.0',
        properties: {
            [id]: {
                id,
                name,
                type: 'string',
                label: node.label,
                widget: type
            } as any
        },
        layout: [
            { type: 'field', propertyId: id } as any
        ]
    } as unknown as Schema;
}

/** Registration-style contact form used as the basis for several scenarios. */
export const registrationFormSchema: Schema = {
    version: '0.1.0',
    properties: {
        firstName: {
            id: 'textbox_first',
            name: 'firstName',
            type: 'string',
            label: 'First Name',
            widget: 'textbox',
            textboxType: 'text',
            required: true
        } as any,
        lastName: {
            id: 'textbox_last',
            name: 'lastName',
            type: 'string',
            label: 'Last Name',
            widget: 'textbox',
            textboxType: 'text',
            required: true
        } as any,
        email: {
            id: 'textbox_email',
            name: 'email',
            type: 'string',
            label: 'Email',
            widget: 'textbox',
            textboxType: 'email',
            required: true
        } as any,
        website: {
            id: 'textbox_website',
            name: 'website',
            type: 'string',
            label: 'Website',
            widget: 'textbox',
            textboxType: 'url'
        } as any,
        password: {
            id: 'textbox_password',
            name: 'password',
            type: 'string',
            label: 'Password',
            widget: 'textbox',
            textboxType: 'password',
            minLength: 6,
            maxLength: 20
        } as any,
        age: {
            id: 'number_age',
            name: 'age',
            type: 'number',
            label: 'Age',
            widget: 'number',
            min: 18,
            max: 99
        } as any,
        agree: {
            id: 'checkbox_agree',
            name: 'agree',
            type: 'boolean',
            label: 'I agree to the terms',
            widget: 'checkbox'
        } as any,
        country: {
            id: 'dropdown_country',
            name: 'country',
            type: 'string',
            label: 'Country',
            widget: 'dropdown',
            options: ['USA', 'UK', 'India', 'Germany']
        } as any,
        subscribe: {
            id: 'switch_subscribe',
            name: 'subscribe',
            type: 'boolean',
            label: 'Subscribe to newsletter',
            widget: 'switch'
        } as any,
        submit: {
            id: 'button_submit',
            name: 'submit',
            type: 'button',
            label: 'Submit',
            widget: 'button',
            buttonType: 'submit'
        } as any
    },
    layout: [
        { type: 'field', propertyId: 'firstName' } as any,
        { type: 'field', propertyId: 'lastName' } as any,
        { type: 'field', propertyId: 'email' } as any,
        { type: 'field', propertyId: 'website' } as any,
        { type: 'field', propertyId: 'password' } as any,
        { type: 'field', propertyId: 'age' } as any,
        { type: 'field', propertyId: 'agree' } as any,
        { type: 'field', propertyId: 'country' } as any,
        { type: 'field', propertyId: 'subscribe' } as any,
        { type: 'field', propertyId: 'submit' } as any
    ]
} as unknown as Schema;

/** A minimal schema that produces an empty form (covers the empty-components path). */
export const emptySchema: Schema = {
    version: '1.0.0',
    properties: {},
    layout: []
} as unknown as Schema;

/**
 * A schema with a JSON-string form of itself; used to drive the
 * "string schema" code path inside `normalizeSchema`.
 */
export const registrationFormAsString: string = JSON.stringify(registrationFormSchema);

/**
 * Schema with conditional visibility + required + setValueWhen.
 * Used to exercise the `ConditionalRuleEngine` paths indirectly via
 * the FormRenderer orchestrator.
 */
export const conditionalSchema: Schema = {
    version: '0.1.0',
    properties: {
        hasAccount: {
            id: 'checkbox_hasAccount',
            name: 'hasAccount',
            type: 'boolean',
            label: 'I already have an account',
            widget: 'checkbox'
        } as any,
        username: {
            id: 'textbox_username',
            name: 'username',
            type: 'string',
            label: 'Username',
            widget: 'textbox',
            conditions: {
                visibleWhen: {
                    field: 'hasAccount',
                    operator: 'equal',
                    value: true
                } as any,
                requiredWhen: {
                    field: 'hasAccount',
                    operator: 'equal',
                    value: true
                } as any
            }
        } as any,
        tier: {
            id: 'dropdown_tier',
            name: 'tier',
            type: 'string',
            label: 'Tier',
            widget: 'dropdown',
            options: ['Bronze', 'Silver', 'Gold'],
            conditions: {
                setValueWhen: {
                    condition: {
                        field: 'username',
                        operator: 'equal',
                        value: 'admin'
                    } as any,
                    value: 'Gold'
                } as any
            }
        } as any,
        notes: {
            id: 'textbox_notes',
            name: 'notes',
            type: 'string',
            label: 'Notes',
            widget: 'textbox',
            conditions: {
                hideWhen: {
                    field: 'hasAccount',
                    operator: 'equal',
                    value: false
                } as any
            }
        } as any,
        bonus: {
            id: 'textbox_bonus',
            name: 'bonus',
            type: 'string',
            label: 'Bonus',
            widget: 'textbox',
            conditions: {
                readOnlyWhen: {
                    field: 'hasAccount',
                    operator: 'equal',
                    value: true
                } as any
            }
        } as any,
        locked: {
            id: 'textbox_locked',
            name: 'locked',
            type: 'string',
            label: 'Locked',
            widget: 'textbox',
            conditions: {
                disabledWhen: {
                    field: 'hasAccount',
                    operator: 'equal',
                    value: true
                } as any
            }
        } as any
    },
    layout: [
        { type: 'field', propertyId: 'hasAccount' } as any,
        { type: 'field', propertyId: 'username' } as any,
        { type: 'field', propertyId: 'tier' } as any,
        { type: 'field', propertyId: 'notes' } as any,
        { type: 'field', propertyId: 'bonus' } as any,
        { type: 'field', propertyId: 'locked' } as any
    ]
} as unknown as Schema;

/** A schema with `expressionValue` set on a field (drives the expression engine). */
export const expressionSchema: Schema = {
    version: '0.1.0',
    properties: {
        price: {
            id: 'number_price',
            name: 'price',
            type: 'number',
            label: 'Price',
            widget: 'number'
        } as any,
        quantity: {
            id: 'number_quantity',
            name: 'quantity',
            type: 'number',
            label: 'Quantity',
            widget: 'number'
        } as any,
        total: {
            id: 'number_total',
            name: 'total',
            type: 'number',
            label: 'Total',
            widget: 'number',
            expressionValue: '{price} * {quantity}'
        } as any,
        greeting: {
            id: 'textbox_greeting',
            name: 'greeting',
            type: 'string',
            label: 'Greeting',
            widget: 'textbox',
            expressionValue: '"Hello " + {firstName}'
        } as any,
        enabled: {
            id: 'checkbox_enabled',
            name: 'enabled',
            type: 'boolean',
            label: 'Enabled',
            widget: 'checkbox',
            expressionValue: '{price} > 0'
        } as any
    },
    layout: [
        { type: 'field', propertyId: 'price' } as any,
        { type: 'field', propertyId: 'quantity' } as any,
        { type: 'field', propertyId: 'total' } as any,
        { type: 'field', propertyId: 'greeting' } as any,
        { type: 'field', propertyId: 'enabled' } as any
    ]
} as unknown as Schema;

/** Layout-heavy schema (panel, table, tabs, card). */
export const layoutSchema: Schema = {
    version: '0.1.0',
    properties: {
        title: {
            id: 'textbox_title',
            name: 'title',
            type: 'string',
            label: 'Title',
            widget: 'textbox'
        } as any,
        body: {
            id: 'textbox_body',
            name: 'body',
            type: 'string',
            label: 'Body',
            widget: 'textarea'
        } as any,
        email: {
            id: 'textbox_email_layout',
            name: 'email',
            type: 'string',
            label: 'Email',
            widget: 'textbox'
        } as any,
        password: {
            id: 'textbox_password_layout',
            name: 'password',
            type: 'string',
            label: 'Password',
            widget: 'textbox',
            textboxType: 'password'
        } as any,
        cardTitle: {
            id: 'card_main',
            name: 'cardMain',
            type: 'string',
            label: 'Card',
            widget: 'textbox'
        } as any
    },
    layout: [
        {
            type: 'panel',
            id: 'panel_personal',
            name: 'panelPersonal',
            label: 'Personal Info',
            children: [
                { type: 'field', propertyId: 'title' } as any,
                { type: 'field', propertyId: 'body' } as any
            ]
        } as any,
        {
            type: 'panel',
            id: 'panel_account',
            name: 'panelAccount',
            label: 'Account',
            children: [
                {
                    type: 'table',
                    id: 'table_login',
                    name: 'tableLogin',
                    label: 'Login',
                    rows: 1,
                    columns: 2,
                    tableCells: [
                        [
                            [{ type: 'field', propertyId: 'email' } as any],
                            [{ type: 'field', propertyId: 'password' } as any]
                        ]
                    ]
                } as any
            ]
        } as any,
        {
            type: 'tabs',
            id: 'tabs_main',
            name: 'tabsMain',
            label: 'Sections',
            tabItems: [
                {
                    header: 'Tab 1',
                    content: [
                        { type: 'field', propertyId: 'cardTitle' } as any
                    ]
                }
            ]
        } as any,
        {
            type: 'card',
            id: 'card_summary',
            name: 'cardSummary',
            label: 'Summary',
            cardTitle: 'Summary',
            cardSubtitle: 'Quick overview',
            children: [
                { type: 'field', propertyId: 'title' } as any
            ]
        } as any
    ]
} as unknown as Schema;

/** Schema with custom (rule-based) validation. */
export const customValidationSchema: Schema = {
    version: '0.1.0',
    properties: {
        confirm: {
            id: 'textbox_confirm',
            name: 'confirm',
            type: 'string',
            label: 'Confirm',
            widget: 'textbox',
            customValidation: [
                {
                    expression: '{confirm} === "yes" ? true : "Type yes to confirm"'
                } as any
            ]
        } as any,
        even: {
            id: 'number_even',
            name: 'even',
            type: 'number',
            label: 'Even Number',
            widget: 'number',
            customValidation: [
                {
                    expression: '{even} % 2 === 0 ? true : "Must be even"'
                } as any
            ]
        } as any
    },
    layout: [
        { type: 'field', propertyId: 'confirm' } as any,
        { type: 'field', propertyId: 'even' } as any
    ]
} as unknown as Schema;
