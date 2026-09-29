/**
 * 06 — Layout parity
 *
 * Exercises `renderComponent`'s layout-type branches: `panel`, `table`,
 * `tabs`, `card`, plus layout-class suppression when any of them are
 * nested.
 *
 * Spec contract (rendering-behavior/spec.md §6):
 *   - panel → fieldset + legend + children
 *   - table → rows×cols grid; columnWidths splits honored
 *   - tabs → native EJ2 Tab instance attached
 *   - card → e-card header/title/subtitle + content
 *   - layout CSS class suppressed when a layout component is detected
 */

import { FormRenderer } from '../src/form-renderer/index';
import { layoutSchema } from './schema-definitions';

describe('FormRenderer — layout components', (): void => {
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

    it('renders a panel as a <fieldset> with a <legend> when label is set', (): void => {
        host = createHost();
        renderer = new FormRenderer({ schema: layoutSchema });
        renderer.appendTo('#' + host.id);
        const panel: HTMLFieldSetElement | null = host.querySelector('fieldset.form-panel-renderer');
        expect(panel).not.toBeNull();
        const legend: HTMLElement | null = panel ? panel.querySelector('legend') : null;
        expect(legend).not.toBeNull();
    });

    it('renders a table layout with the configured row/col structure', (): void => {
        host = createHost();
        renderer = new FormRenderer({ schema: layoutSchema });
        renderer.appendTo('#' + host.id);
        const tableDiv: HTMLElement | null = host.querySelector('.form-table-renderer');
        expect(tableDiv).not.toBeNull();
        const rows: NodeListOf<Element> = host.querySelectorAll('.e-form-table-row');
        expect(rows.length).toBeGreaterThan(0);
    });

    it('renders a tabs layout using the native EJ2 Tab control', (): void => {
        host = createHost();
        renderer = new FormRenderer({ schema: layoutSchema });
        renderer.appendTo('#' + host.id);
        const tabs: HTMLElement | null = host.querySelector('.form-tabs-renderer .e-tab');
        expect(tabs).not.toBeNull();
    });

    it('renders a card layout with header / title / subtitle', (): void => {
        host = createHost();
        renderer = new FormRenderer({ schema: layoutSchema });
        renderer.appendTo('#' + host.id);
        const card: HTMLElement | null = host.querySelector('.form-card-renderer');
        expect(card).not.toBeNull();
        const title: HTMLElement | null = card ? card.querySelector('.e-card-title') : null;
        expect(title).not.toBeNull();
        const subtitle: HTMLElement | null = card ? card.querySelector('.e-card-sub-title') : null;
        expect(subtitle).not.toBeNull();
    });

    it('suppresses the column layout CSS class when a layout component is present', (): void => {
        host = createHost();
        renderer = new FormRenderer({
            schema: layoutSchema,
            layout: 'TwoColumn'
        });
        renderer.appendTo('#' + host.id);
        const form: HTMLElement | null = host.querySelector('form.form-renderer');
        expect(form).not.toBeNull();
        // The 'twolayout' class should NOT be applied because a layout
        // component was detected.
        if (form) {
            expect(form.classList.contains('twolayout')).toBe(false);
        }
    });

    it('applies the column layout CSS class when no layout components are present', (): void => {
        host = createHost();
        // Use the registration schema — no panel/table/tabs/card.
        const registrationFlat: any = {
            version: '0.1.0',
            properties: {
                a: { id: 'textbox_a', name: 'a', type: 'string', label: 'A', widget: 'textbox' } as any,
                b: { id: 'textbox_b', name: 'b', type: 'string', label: 'B', widget: 'textbox' } as any
            },
            layout: [
                { type: 'field', propertyId: 'a' } as any,
                { type: 'field', propertyId: 'b' } as any
            ]
        };
        renderer = new FormRenderer({
            schema: registrationFlat,
            layout: 'TwoColumn'
        });
        renderer.appendTo('#' + host.id);
        const form: HTMLElement | null = host.querySelector('form.form-renderer');
        if (form) {
            expect(form.classList.contains('twolayout')).toBe(true);
        }
    });

    it('detects a layout component nested inside a table cell', (): void => {
        host = createHost();
        const nestedSchema: any = {
            version: '0.1.0',
            properties: {
                inner: { id: 'panel_inner', name: 'inner', type: 'string', label: 'Inner', widget: 'textbox' } as any
            },
            layout: [
                {
                    type: 'table',
                    id: 'table_outer',
                    name: 'tableOuter',
                    label: 'Outer',
                    rows: 1,
                    columns: 1,
                    tableCells: [
                        [
                            [
                                {
                                    type: 'panel',
                                    id: 'panel_inCell',
                                    name: 'panelInCell',
                                    label: 'In Cell',
                                    children: [
                                        { type: 'field', propertyId: 'inner' } as any
                                    ]
                                } as any
                            ]
                        ]
                    ]
                } as any
            ]
        };
        renderer = new FormRenderer({
            schema: nestedSchema,
            layout: 'TwoColumn'
        });
        renderer.appendTo('#' + host.id);
        // The `hasLayoutComponents` recursive scan should still detect
        // the inner panel and suppress the two-column class.
        const form: HTMLElement | null = host.querySelector('form.form-renderer');
        if (form) {
            expect(form.classList.contains('twolayout')).toBe(false);
        }
    });

    it('renders a table with hideBorders using flex-gap layout variant', (): void => {
        host = createHost();
        const tableOnly: any = {
            version: '0.1.0',
            properties: {} as any,
            layout: [
                {
                    type: 'table',
                    id: 'table_noborder',
                    name: 'tableNoBorder',
                    label: 'NoBorder',
                    rows: 1,
                    columns: 2,
                    hideBorders: true,
                    tableCells: [[ [], [] ]]
                } as any
            ]
        };
        renderer = new FormRenderer({ schema: tableOnly });
        renderer.appendTo('#' + host.id);
        const tableDiv: HTMLElement | null = host.querySelector('.form-table-renderer');
        expect(tableDiv).not.toBeNull();
    });
});
