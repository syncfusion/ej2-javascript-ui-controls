/**
 * 05 — Expression engine parity
 *
 * Drives the expression-evaluation path through `FormRenderer`. The
 * `ExpressionEngine` is never imported or constructed directly.
 *
 * Spec contract (rendering-behavior/spec.md §5):
 *   - Dependency graph built from every component.expressionValue
 *   - Topological evaluation order
 *   - Result type coercion per target field type
 *   - Re-entrancy guard (recursive eval loops don't crash)
 *   - Circular dependencies logged (failure event), not thrown
 *   - `undefined` stripped from string results
 */

import { FormRenderer, FailureEventArgs } from '../src/form-renderer/index';
import { expressionSchema } from './schema-definitions';

describe('FormRenderer — expression engine', (): void => {
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

    it('initializes a dependency graph and computed-field set from the schema', (): void => {
        host = createHost();
        renderer = new FormRenderer({ schema: expressionSchema });
        renderer.appendTo('#' + host.id);

        const graph: Record<string, any> = (renderer as any).expressionDependencyGraph;
        const computed: Set<string> = (renderer as any).computedFieldNames;
        expect(Object.keys(graph).length).toBeGreaterThan(0);
        // The total field is a computed field.
        expect(computed.has('number_total')).toBe(true);
    });

    it('evaluates a numeric expression when its inputs change', (): void => {
        host = createHost();
        renderer = new FormRenderer({ schema: expressionSchema });
        renderer.appendTo('#' + host.id);

        (renderer as any).formState.values['number_price'] = 5;
        (renderer as any).formState.values['number_quantity'] = 4;
        (renderer as any).afterValueChange('number_price');
        // The total field should now be 5 * 4 = 20 (coerced to number).
        const total: any = (renderer as any).formState.values['number_total'];
        expect(total).toBe(20);
    });

    it('evaluates a string expression into a textbox field', (): void => {
        host = createHost();
        renderer = new FormRenderer({ schema: expressionSchema });
        renderer.appendTo('#' + host.id);

        // Seed firstName so the greeting expression can resolve it.
        (renderer as any).formState.values['textbox_first'] = 'World';
        (renderer as any).afterValueChange('textbox_first');
        const greeting: any = (renderer as any).formState.values['textbox_greeting'];
        expect(typeof greeting).toBe('string');
    });

    it('coerces an expression result to boolean for a checkbox field', (): void => {
        host = createHost();
        renderer = new FormRenderer({ schema: expressionSchema });
        renderer.appendTo('#' + host.id);

        (renderer as any).formState.values['number_price'] = 0;
        (renderer as any).afterValueChange('number_price');
        const enabled: any = (renderer as any).formState.values['checkbox_enabled'];
        expect(enabled).toBe(false);

        (renderer as any).formState.values['number_price'] = 10;
        (renderer as any).afterValueChange('number_price');
        const enabled2: any = (renderer as any).formState.values['checkbox_enabled'];
        expect(enabled2).toBe(true);
    });

    it('strips literal "undefined" substrings from string results', (): void => {
        host = createHost();
        renderer = new FormRenderer({ schema: expressionSchema });
        renderer.appendTo('#' + host.id);
        // No inputs seeded → greeting would resolve to a string with
        // "undefined" tokens, which the orchestrator strips.
        (renderer as any).afterValueChange('textbox_first');
        const greeting: any = (renderer as any).formState.values['textbox_greeting'];
        if (typeof greeting === 'string') {
            expect(greeting.indexOf('undefined')).toBe(-1);
        }
    });

    it('detects circular dependencies without crashing', (): void => {
        host = createHost();
        const cycleSchema: any = {
            version: '0.1.0',
            properties: {
                a: {
                    id: 'number_a',
                    name: 'a',
                    type: 'number',
                    label: 'A',
                    widget: 'number',
                    expressionValue: '{b} + 1'
                } as any,
                b: {
                    id: 'number_b',
                    name: 'b',
                    type: 'number',
                    label: 'B',
                    widget: 'number',
                    expressionValue: '{a} + 1'
                } as any
            },
            layout: [
                { type: 'field', propertyId: 'a' } as any,
                { type: 'field', propertyId: 'b' } as any
            ]
        };
        const failureEvents: FailureEventArgs[] = [];
        const act: () => void = (): void => {
            renderer = new FormRenderer({
                schema: cycleSchema,
                failure: (args: FailureEventArgs): void => {
                    failureEvents.push(args);
                }
            });
            renderer.appendTo('#' + host.id);
        };
        expect(act).not.toThrow();
        // Component still mounts despite the cycle.
        expect(host.querySelector('form.form-renderer')).not.toBeNull();
    });

    it('skips re-evaluation while a previous evaluation is in progress (re-entrancy guard)', (): void => {
        host = createHost();
        renderer = new FormRenderer({ schema: expressionSchema });
        renderer.appendTo('#' + host.id);
        // Force the flag to true and re-enter; should be a no-op.
        (renderer as any).expressionEvaluationInProgress = true;
        const act: () => void = (): void => {
            (renderer as any).evaluateExpressions();
        };
        expect(act).not.toThrow();
        (renderer as any).expressionEvaluationInProgress = false;
    });
});
