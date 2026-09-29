/**
 * every source file under src/diagnostics
 */

import { DiagnosticsService } from '../../src/diagnostics/diagnostics-service';
import { DiagnosticsEntry } from '../../src/diagnostics/diagnostics-entry';

describe('DiagnosticsService', () => {
    let svc: DiagnosticsService;

    beforeEach(() => { svc = new DiagnosticsService(); });
    afterEach(() => { try { svc.dispose(); } catch { /* already disposed */ } });

    describe('basic logging', () => {
        it('records an info entry', () => {
            svc.info('hello');
            const entries = svc.getEntries();
            expect(entries.length).toBe(1);
            expect(entries[0].level).toBe('info');
            expect(entries[0].message).toBe('hello');
        });

        it('records warn, error and debug entries', () => {
            svc.warn('w');
            svc.error('e');
            svc.debug('d');
            const entries = svc.getEntries();
            expect(entries.map((x: DiagnosticsEntry) => x.level)).toEqual(['warn', 'error', 'debug']);
        });

        it('attaches metadata when provided', () => {
            svc.info('msg', { key: 'value' });
            expect(svc.getEntries()[0].metadata).toEqual({ key: 'value' });
        });

        it('omits metadata property when not provided', () => {
            svc.info('no meta');
            expect(svc.getEntries()[0].metadata).toBeUndefined();
        });

        it('records ISO 8601 timestamp', () => {
            svc.info('ts');
            const ts = svc.getEntries()[0].timestamp;
            expect(() => new Date(ts).toISOString()).not.toThrow();
            expect(ts).toMatch(/^\d{4}-\d{2}-\d{2}T/);
        });
    });

    describe('circular buffer (100-entry cap)', () => {
        it('evicts the oldest entry when buffer is full', () => {
            for (let i = 0; i < 101; i++) {
                svc.info(`msg-${i}`);
            }
            const entries = svc.getEntries();
            expect(entries.length).toBe(100);
            expect(entries[0].message).toBe('msg-1'); // msg-0 evicted
            expect(entries[99].message).toBe('msg-100');
        });

        it('returns entries in insertion order', () => {
            svc.info('first');
            svc.info('second');
            svc.info('third');
            const messages = svc.getEntries().map((e: DiagnosticsEntry) => e.message);
            expect(messages).toEqual(['first', 'second', 'third']);
        });
    });

    describe('dispose', () => {
        it('clears all entries after dispose', () => {
            svc.info('x');
            svc.dispose();
            expect(svc.getEntries().length).toBe(0);
        });

        it('no-ops on subsequent log calls after dispose', () => {
            svc.dispose();
            expect(() => svc.info('after')).not.toThrow();
            expect(svc.getEntries().length).toBe(0);
        });

        it('double-dispose is safe', () => {
            expect(() => { svc.dispose(); svc.dispose(); }).not.toThrow();
        });

        it('satisfies IErrorReporter (error() callable by EventBus)', () => {
            // Compile-time check via assignment; runtime confirms no-throw
            const reporter = svc;
            expect(() => reporter.error('test', { x: 1 })).not.toThrow();
        });
    });
});
