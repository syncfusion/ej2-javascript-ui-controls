/**
 * 13 — Custom widget rendering integration tests
 *
 * End-to-end Karma + Jasmine scenarios that exercise the
 * `FormRenderer.customWidgetSetting` property -> resolver -> template
 * rendering pipeline through the real FormRenderer public API.
 *
 * Covers task 4.2 (re-render on property change) and task 5.1
 * (six integration scenarios: type-tier render, templateId-over-type,
 * fieldName-over-templateId-mismatch, no-match fallback, malformed
 * template fallback + failure event, getComponent returns host).
 */

import { FormRenderer } from '../src/index';
import { Schema, FormNode, CustomWidgetSettingModel } from '../src/index';
import { singleFieldSchema } from './schema-definitions';

describe('FormRenderer — customWidgetSettings end-to-end', (): void => {
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

    it('Scenario A: custom template renders for a textbox by type', (): void => {
        host = createHost();
        const schema: Schema = singleFieldSchema('textbox', {
            id: 'tb1',
            name: 'tb1',
            label: 'CustomBox'
        });
        const settings: CustomWidgetSettingModel[] = [{
            type: 'textbox',
            template: '<span class="cw-marker">${component.label}</span>'
        }];
        renderer = new FormRenderer({ schema: schema, customWidgetSettings: settings });
        renderer.appendTo('#' + host.id);
        const marker: HTMLElement | null = host.querySelector('.cw-marker');
        expect(marker).not.toBeNull();
        expect(marker!.textContent).toContain('CustomBox');
    });

    it('Scenario B: templateId tier overrides type tier', (): void => {
        host = createHost();
        const schema: Schema = singleFieldSchema('textbox', {
            id: 'tb2',
            name: 'tb2',
            label: 'Tb'
        });
        // Stash templateId on the component via the schema property map;
        // FormNode carries the FieldProperties index signature so the
        // templateId propagates through normalizeSchema.
        (schema.properties['tb2'] as any).templateId = 't-b';
        const settings: CustomWidgetSettingModel[] = [
            { type: 'textbox', template: '<span class="type-marker"></span>' },
            { templateId: 't-b', template: '<span class="tplid-marker"></span>' }
        ];
        renderer = new FormRenderer({ schema: schema, customWidgetSettings: settings });
        renderer.appendTo('#' + host.id);
        expect(host.querySelector('.tplid-marker')).not.toBeNull();
        expect(host.querySelector('.type-marker')).toBeNull();
    });

    it('Scenario C: fieldName tier overrides templateId mismatch', (): void => {
        host = createHost();
        const schema: Schema = singleFieldSchema('textbox', {
            id: 'tb3',
            name: 'f1',
            label: 'Tb'
        });
        (schema.properties['tb3'] as any).templateId = 't-y';
        const settings: CustomWidgetSettingModel[] = [{
            fieldName: 'f1',
            templateId: 't-x',
            template: '<span class="fn-marker"></span>'
        }];
        renderer = new FormRenderer({ schema: schema, customWidgetSettings: settings });
        renderer.appendTo('#' + host.id);
        expect(host.querySelector('.fn-marker')).not.toBeNull();
    });

    it('Scenario D: no match falls back to default render', (): void => {
        host = createHost();
        const schema: Schema = singleFieldSchema('textbox', {
            id: 'tb4',
            name: 'tb4',
            label: 'Default'
        });
        // Empty array — no entry matches.
        renderer = new FormRenderer({ schema: schema, customWidgetSettings: [] });
        renderer.appendTo('#' + host.id);
        // Default textbox rendering mounts an EJ2 input wrapper.
        expect(host.querySelector('input.e-control, .e-control-wrapper, .e-input-group')).not.toBeNull();
    });

    it('Scenario E: malformed template falls back to default render and fires failure', (): void => {
        host = createHost();
        const schema: Schema = singleFieldSchema('textbox', {
            id: 'tb5',
            name: 'tb5',
            label: 'Malformed'
        });
        let failures: any[] = [];
        // Pass a template that will cause compile() to throw — we use an
        // object that compile() cannot handle. The renderer's
        // getTemplateFunction already has a try/catch fallback so to
        // reliably trigger the failure-event branch we use a Function
        // that throws when invoked.
        const throwingTemplate: any = function (): any { throw new Error('boom'); };
        const settings: CustomWidgetSettingModel[] = [{
            type: 'textbox',
            template: throwingTemplate
        }];
        renderer = new FormRenderer({
            schema: schema,
            customWidgetSettings: settings,
            failure: (args: any): void => { failures.push(args); }
        });
        renderer.appendTo('#' + host.id);
        // Default render path must have run (no blank field).
        expect(host.querySelector('input.e-control, .e-control-wrapper, .e-input-group')).not.toBeNull();
        // Failure event fired at least once during render.
        expect(failures.length).toBeGreaterThan(0);
    });

    it('Scenario F: getComponent(name) returns a non-null handle for custom-widget field', (): void => {
        host = createHost();
        const schema: Schema = singleFieldSchema('textbox', {
            id: 'tb6',
            name: 'tb6',
            label: 'Tb'
        });
        const settings: CustomWidgetSettingModel[] = [{
            type: 'textbox',
            template: '<span class="cw-marker"></span>'
        }];
        renderer = new FormRenderer({ schema: schema, customWidgetSettings: settings });
        renderer.appendTo('#' + host.id);
        // Wait for the async created-firing is unnecessary because the
        // resolver registers the ref synchronously inside renderField.
        const handle: object | null = renderer.getComponent('tb6');
        expect(handle).not.toBeNull();
    });

    it('Scenario G: swaping customWidgetSettings at runtime re-renders with the new template', (done: DoneFn): void => {
        host = createHost();
        const schema: Schema = singleFieldSchema('textbox', {
            id: 'tb7',
            name: 'tb7',
            label: 'Swap'
        });
        const firstSettings: CustomWidgetSettingModel[] = [{
            type: 'textbox',
            template: '<span class="cw-first"></span>'
        }];
        renderer = new FormRenderer({ schema: schema, customWidgetSettings: firstSettings });
        renderer.appendTo('#' + host.id);
        expect(host.querySelector('.cw-first')).not.toBeNull();
        // Swap to a different template and trigger re-render via the
        // EJ2 dataBind flow (onPropertyChanged is fired by the property
        // decorator machinery when the property is reassigned + bound).
        renderer.customWidgetSettings = [{
            type: 'textbox',
            template: '<span class="cw-second"></span>'
        }];
        // Allow the EJ2 NotifyPropertyChanges flow + render cycle to settle.
        setTimeout((): void => {
            try {
                expect(host.querySelector('.cw-second')).not.toBeNull();
                expect(host.querySelector('.cw-first')).toBeNull();
                done();
            } catch (e) {
                done.fail(e);
            }
        }, 50);
    });

    it('Scenario H: plain HTML string template (no ${} interpolation) renders for a textarea', (): void => {
        // Regression for the demo scenario where `template` is a plain
        // string like '<textarea></textarea>'. EJ2's compile() returns a
        // function that, for a string template, produces a NodeList
        // (parsed via a throwaway <div>.innerHTML). The integration in
        // renderField must flatten that NodeList into individual nodes
        // and append each — otherwise `Array.isArray(NodeList)` is false
        // and the whole NodeList was dropped as a single skipped entry,
        // leaving the field-input empty.
        host = createHost();
        const schema: Schema = singleFieldSchema('textarea', {
            id: 'ta1',
            name: 'ta1',
            label: 'My Area'
        });
        const settings: CustomWidgetSettingModel[] = [{
            type: 'textarea',
            template: '<textarea class="cw-textarea"></textarea>'
        }];
        renderer = new FormRenderer({ schema: schema, customWidgetSettings: settings });
        renderer.appendTo('#' + host.id);
        const ta: HTMLTextAreaElement | null = host.querySelector('textarea.cw-textarea');
        expect(ta).not.toBeNull();
        // The default EJ2 textarea target (the renderer-owned <textarea>
        // created by renderField before the resolver runs) must NOT be
        // present — the custom-widget branch removes it before appending
        // the template output. Exactly one <textarea> should exist.
        const allTextareas: NodeListOf<HTMLTextAreaElement> = host.querySelectorAll('textarea');
        expect(allTextareas.length).toBe(1);
        expect(allTextareas[0]).toBe(ta);
    });
});
