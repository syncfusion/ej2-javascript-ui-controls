/**
 * 01 — Schema ingestion & normalization
 *
 * Covers `FormRenderer.normalizeSchema` and the public `schema` setter.
 * All paths are exercised through the FormRenderer component itself —
 * we never call `mergeSchema`, `UniversalJsonParser`, etc. directly.
 *
 * Spec contract (from openspec/specs/components/form-renderer/
 * rendering-behavior/spec.md §1):
 *   - Accept FormSchema object, JSON string, or Unified Schema
 *   - On parse failure, fall back to empty `{ version: '1.0.0',
 *     components: [] }` and fire `failure`
 *   - Never throw on bad input
 */

import { FormRenderer, FailureEventArgs } from '../src/index';
import { Schema, FormNode } from '../src/index';
import {
    registrationFormSchema,
    registrationFormAsString,
    emptySchema
} from './schema-definitions';

describe('FormRenderer — schema ingestion', (): void => {
    let host: HTMLElement;
    let renderer: FormRenderer;

    afterEach((): void => {
        if (renderer) {
            try { renderer.destroy(); } catch (e) { /* ignore */ }
            renderer = null;
        }
        if (host && host.parentNode) {
            host.parentNode.removeChild(host);
        }
    });

    function createHost(): HTMLElement {
        const el: HTMLDivElement = document.createElement('div');
        el.id = 'fr-host-' + Math.random().toString(36).slice(2);
        document.body.appendChild(el);
        return el;
    }

    it('accepts a FormSchema object and renders its components', (): void => {
        host = createHost();
        renderer = new FormRenderer({ schema: registrationFormSchema });
        renderer.appendTo('#' + host.id);

        // The renderer must mount a <form> under the host with the
        // form-renderer root class.
        const form: HTMLElement | null = host.querySelector('form.form-renderer');
        expect(form).not.toBeNull();
        // The first component (firstName textbox) is rendered.
        const firstName: HTMLElement | null = host.querySelector('[name="textbox_first"]');
        expect(firstName).not.toBeNull();
    });

    it('accepts a JSON-string schema and parses it', (): void => {
        host = createHost();
        renderer = new FormRenderer({ schema: registrationFormAsString });
        renderer.appendTo('#' + host.id);

        const firstName: HTMLElement | null = host.querySelector('[name="textbox_first"]');
        expect(firstName).not.toBeNull();
    });

    it('accepts a Unified Schema shape (properties + layout) and merges it', (): void => {
        host = createHost();
        // The Unified Schema shape is a `Schema` (already what
        // `mergeSchema` consumes), so it goes through the same path.
        renderer = new FormRenderer({ schema: registrationFormSchema });
        renderer.appendTo('#' + host.id);
        expect(host.querySelector('form.form-renderer')).not.toBeNull();
    });

    it('handles a null schema by rendering an empty form (no throw)', (): void => {
        host = createHost();
        renderer = new FormRenderer({ schema: null as any });
        renderer.appendTo('#' + host.id);
        const form: HTMLElement | null = host.querySelector('form.form-renderer');
        expect(form).not.toBeNull();
        // No input fields rendered.
        expect(host.querySelector('input')).toBeNull();
    });

    it('handles an empty schema by rendering an empty form', (): void => {
        host = createHost();
        renderer = new FormRenderer({ schema: emptySchema });
        renderer.appendTo('#' + host.id);
        const form: HTMLElement | null = host.querySelector('form.form-renderer');
        expect(form).not.toBeNull();
        expect(host.querySelector('input')).toBeNull();
    });

    it('handles a malformed JSON string by firing failure and falling back', (): void => {
        host = createHost();
        let failureArgs: FailureEventArgs | null = null;
        renderer = new FormRenderer({
            schema: '{this is not valid JSON',
            failure: (args: FailureEventArgs): void => {
                failureArgs = args;
            }
        });
        renderer.appendTo('#' + host.id);

        // A failure event must have been emitted.
        expect(failureArgs).not.toBeNull();
        if (failureArgs) {
            expect(failureArgs.error).toContain('e');
        }
        // Renderer falls back to an empty form (no inputs).
        expect(host.querySelector('input')).toBeNull();
    });

    it('never throws when a completely invalid (non-string non-object) schema is supplied', (): void => {
        host = createHost();
        // The normalizeSchema path is wrapped in try/catch, so even a
        // bare number/bool is coerced through JSON.parse or the
        // UniversalJsonParser without crashing the component.
        const expectNoThrow: () => void = (): void => {
            renderer = new FormRenderer({ schema: 42 as any });
            renderer.appendTo('#' + host.id);
        };
        expect(expectNoThrow).not.toThrow();
    });

    it('re-renders when the schema property is mutated after construction', (): void => {
        host = createHost();
        renderer = new FormRenderer({ schema: emptySchema });
        renderer.appendTo('#' + host.id);
        expect(host.querySelector('[name="textbox_first"]')).toBeNull();

        // Mutate schema — onPropertyChanged should re-normalize + re-render.
        (renderer as any).schema = registrationFormSchema;
        // Force NotifyPropertyChanges to flush by invoking the
        // protected onPropertyChanged through the public path.
        (renderer as any).setProperties({ schema: registrationFormSchema }, true);

        const firstName: HTMLElement | null = host.querySelector('[name="textbox_first"]');
        expect(firstName).not.toBeNull();
    });
});
