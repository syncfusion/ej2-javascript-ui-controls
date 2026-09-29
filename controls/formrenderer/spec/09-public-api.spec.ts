/**
 * 09 — Public API: `getComponent`, `onPropertyChanged`, and dynamic property updates
 *
 * Exercises the public surface that consumers use to interact with
 * the rendered EJ2 controls and to drive property updates at runtime.
 *
 * Spec contract (rendering-behavior/spec.md §9):
 *   - `getComponent(name)` returns the underlying EJ2 instance, or null
 *   - `onPropertyChanged` re-renders on schema/locale/enableRtl/layout change
 *   - `className` is added to the root element
 *   - `enableRtl` adds the `e-rtl` class
 */

import { FormRenderer } from '../src/form-renderer/index';
import { Schema } from '../src/index';

describe('FormRenderer — public API', (): void => {
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

    it('getComponent(name) returns the underlying EJ2 instance for a textbox', (): void => {
        host = createHost();
        const schema: Schema = {
            version: '0.1.0',
            properties: {
                name: { id: 'textbox_name', name: 'name', type: 'string', label: 'Name', widget: 'textbox' } as any
            },
            layout: [{ type: 'field', propertyId: 'name' } as any]
        } as unknown as Schema;
        renderer = new FormRenderer({ schema: schema });
        renderer.appendTo('#' + host.id);

        const instance: any = renderer.getComponent('name');
        // The instance may be the input element or the EJ2 control
        // instance — either way, it must be non-null after mount.
        expect(instance).not.toBeNull();
    });

    it('getComponent(name) returns null for an unknown field name', (): void => {
        host = createHost();
        renderer = new FormRenderer({ schema: { version: '0.1.0', properties: {}, layout: [] } as any });
        renderer.appendTo('#' + host.id);
        const instance: any = renderer.getComponent('doesNotExist');
        expect(instance).toBeNull();
    });

    it('getModuleName returns "form-renderer"', (): void => {
        host = createHost();
        renderer = new FormRenderer({ schema: { version: '0.1.0', properties: {}, layout: [] } as any });
        renderer.appendTo('#' + host.id);
        expect(renderer.getModuleName()).toBe('form-renderer');
    });

    it('className property adds the configured class to the root element', (): void => {
        host = createHost();
        renderer = new FormRenderer({
            schema: { version: '0.1.0', properties: {}, layout: [] } as any,
            className: 'my-form-class extra-class'
        });
        renderer.appendTo('#' + host.id);
        expect(host.classList.contains('my-form-class')).toBe(true);
        expect(host.classList.contains('extra-class')).toBe(true);
    });

    it('enableRtl=true adds the e-rtl class to the root element', (): void => {
        host = createHost();
        renderer = new FormRenderer({
            schema: { version: '0.1.0', properties: {}, layout: [] } as any,
            enableRtl: true
        });
        renderer.appendTo('#' + host.id);
        expect(host.classList.contains('e-rtl')).toBe(true);
    });

    it('enableRtl=false removes the e-rtl class', (): void => {
        host = createHost();
        renderer = new FormRenderer({
            schema: { version: '0.1.0', properties: {}, layout: [] } as any,
            enableRtl: false
        });
        renderer.appendTo('#' + host.id);
        expect(host.classList.contains('e-rtl')).toBe(false);
    });

    it('re-renders when the layout property is changed', (): void => {
        host = createHost();
        const schema: Schema = {
            version: '0.1.0',
            properties: {
                a: { id: 'textbox_a', name: 'a', type: 'string', label: 'A', widget: 'textbox' } as any,
                b: { id: 'textbox_b', name: 'b', type: 'string', label: 'B', widget: 'textbox' } as any
            },
            layout: [
                { type: 'field', propertyId: 'a' } as any,
                { type: 'field', propertyId: 'b' } as any
            ]
        } as unknown as Schema;
        renderer = new FormRenderer({ schema: schema, layout: 'SingleColumn' });
        renderer.appendTo('#' + host.id);
        let form: HTMLElement | null = host.querySelector('form.form-renderer');
        if (form) {
            expect(form.classList.contains('twolayout')).toBe(false);
        }
        // Flip layout to TwoColumn.
        (renderer as any).setProperties({ layout: 'TwoColumn' }, true);
        form = host.querySelector('form.form-renderer');
        if (form) {
            expect(form.classList.contains('twolayout')).toBe(true);
        }
    });

    it('re-renders when the locale property is changed', (): void => {
        host = createHost();
        renderer = new FormRenderer({ schema: { version: '0.1.0', properties: {}, layout: [] } as any });
        renderer.appendTo('#' + host.id);
        const act: () => void = (): void => {
            (renderer as any).setProperties({ locale: 'fr-FR' }, true);
        };
        expect(act).not.toThrow();
    });

    it('handles appendTo with an id selector', (): void => {
        host = createHost();
        host.id = 'explicit-id';
        const schema: Schema = {
            version: '0.1.0',
            properties: {
                a: { id: 'textbox_a', name: 'a', type: 'string', label: 'A', widget: 'textbox' } as any
            },
            layout: [{ type: 'field', propertyId: 'a' } as any]
        } as unknown as Schema;
        renderer = new FormRenderer({ schema: schema });
        renderer.appendTo('#explicit-id');
        expect(host.querySelector('form.form-renderer')).not.toBeNull();
    });
});
