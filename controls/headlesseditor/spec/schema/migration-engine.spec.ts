/**
 * MigrationEngine unit tests.
 */
import { MigrationEngine } from '../../src/schema/migration/migration-engine';
import { SchemaMigration } from '../../src/schema/migration/migration';
import { DocumentRoot } from '../../src/model/editor-node';

function makeV1Doc(): DocumentRoot {
    return {
        id: 'd1',
        type: 'document',
        attrs: {},
        children: [],
        marks: [],
        schemaVersion: 1
    };
}

describe('MigrationEngine', () => {
    it('starts at version 0 when no migrations are registered', () => {
        const engine = new MigrationEngine();
        expect(engine.getCurrentVersion()).toBe(0);
        expect(engine.getMigrations().length).toBe(0);
    });

    it('rejects a first migration with fromVersion !== 1', () => {
        const engine = new MigrationEngine();
        const bad: SchemaMigration = { fromVersion: 2, toVersion: 3, migrate: (d) => d };
        expect(() => engine.register(bad)).toThrowError(/first migration must have fromVersion=1/);
    });

    it('rejects out-of-order chain', () => {
        const engine = new MigrationEngine();
        engine.register({ fromVersion: 1, toVersion: 2, migrate: (d) => d });
        expect(() => engine.register({ fromVersion: 3, toVersion: 4, migrate: (d) => d }))
            .toThrowError(/migration chain broken/);
    });

    it('rejects fromVersion === toVersion', () => {
        const engine = new MigrationEngine();
        engine.register({ fromVersion: 1, toVersion: 2, migrate: (d) => d });
        expect(() => engine.register({ fromVersion: 2, toVersion: 2, migrate: (d) => d }))
            .toThrowError(/fromVersion and toVersion must differ/);
    });

    it('rejects toVersion not greater than last toVersion', () => {
        const engine = new MigrationEngine();
        engine.register({ fromVersion: 1, toVersion: 2, migrate: (d) => d });
        expect(() => engine.register({ fromVersion: 2, toVersion: 1, migrate: (d) => d }))
            .toThrowError(/toVersion must be greater/);
    });

    it('migrates a v1 document through a 1→2→3 chain in one call', () => {
        const engine = new MigrationEngine();
        engine.register({
            fromVersion: 1, toVersion: 2,
            migrate: (d) => ({ ...d, schemaVersion: 2, attrs: { ...d.attrs, v2: true } })
        });
        engine.register({
            fromVersion: 2, toVersion: 3,
            migrate: (d) => ({ ...d, schemaVersion: 3, attrs: { ...d.attrs, v3: true } })
        });

        const migrated = engine.migrate(makeV1Doc());
        expect(migrated.schemaVersion).toBe(3);
        expect((migrated.attrs as Record<string, unknown>).v2).toBe(true);
        expect((migrated.attrs as Record<string, unknown>).v3).toBe(true);
        expect(engine.getCurrentVersion()).toBe(3);
    });

    it('returns the document unchanged when already at current version', () => {
        const engine = new MigrationEngine();
        engine.register({ fromVersion: 1, toVersion: 2, migrate: (d) => d });
        const doc: DocumentRoot = { ...makeV1Doc(), schemaVersion: 2 };
        const out = engine.migrate(doc);
        expect(out).toBe(doc);
    });

    it('idempotency — running v1→v2 migration twice yields the same result', () => {
        const engine = new MigrationEngine();
        let calls = 0;
        engine.register({
            fromVersion: 1, toVersion: 2,
            migrate: (d) => { calls++; return { ...d, schemaVersion: 2, attrs: { migrated: true } }; }
        });

        const first = engine.migrate(makeV1Doc());
        // Second call: doc is now at v2, engine skips the migration
        const second = engine.migrate(first);
        expect(calls).toBe(1);
        expect(second).toBe(first);
    });

    it('throws on downgrade attempt', () => {
        const engine = new MigrationEngine();
        engine.register({ fromVersion: 1, toVersion: 2, migrate: (d) => d });
        const future: DocumentRoot = { ...makeV1Doc(), schemaVersion: 99 };
        expect(() => engine.migrate(future)).toThrowError(/greater than current version/);
    });

    it('skips a migration whose toVersion is at or below the current doc version', () => {
        const engine = new MigrationEngine();
        let calls12 = 0;
        let calls23 = 0;
        engine.register({
            fromVersion: 1, toVersion: 2,
            migrate: (d) => { calls12++; return { ...d, schemaVersion: 2 }; }
        });
        engine.register({
            fromVersion: 2, toVersion: 3,
            migrate: (d) => { calls23++; return { ...d, schemaVersion: 3 }; }
        });

        // Doc already at v3 — the early-return at the top should hit.
        const atV3: DocumentRoot = { ...makeV1Doc(), schemaVersion: 3 };
        const out = engine.migrate(atV3);
        expect(calls12).toBe(0);
        expect(calls23).toBe(0);
        expect(out).toBe(atV3);

        // Doc at v2 — 1→2 is skipped via the `>= toVersion` continue branch;
        // 2→3 runs and advances the doc.
        const atV2: DocumentRoot = { ...makeV1Doc(), schemaVersion: 2 };
        const out2 = engine.migrate(atV2);
        expect(calls12).toBe(0); // skipped via continue
        expect(calls23).toBe(1); // 2->3 ran
        expect(out2.schemaVersion).toBe(3);
    });
});
