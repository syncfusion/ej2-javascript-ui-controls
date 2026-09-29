/**
 * MigrationEngine — applies a chain of SchemaMigrations to a DocumentRoot.
 *
 * Rules enforced:
 *  - Migrations form a chain: 1→2, 2→3, etc. Registering a migration whose
 *    `fromVersion` does not equal the last registered `toVersion` throws.
 *  - Running `migrate()` on a document whose schemaVersion already matches
 *    `getCurrentVersion()` returns the document unchanged (no copy).
 *  - Running `migrate()` on a document with `schemaVersion > currentVersion`
 *    throws — that is a downgrade, which is not supported.
 */
import { DocumentRoot } from '../../model/editor-node';
import { SchemaMigration } from './migration';

export class MigrationEngine {
    private readonly _migrations: SchemaMigration[] = [];

    /**
     * Register a migration. Throws on out-of-order or duplicate registration.
     *
     * @param {SchemaMigration} migration - The migration to add to the chain.
     * @returns {void}
     */
    public register(migration: SchemaMigration): void {
        if (this._migrations.length === 0) {
            if (migration.fromVersion !== 1) {
                throw new Error(
                    `MigrationEngine: first migration must have fromVersion=1, got ${migration.fromVersion}.`
                );
            }
        } else {
            const last: SchemaMigration = this._migrations[this._migrations.length - 1];
            if (migration.fromVersion !== last.toVersion) {
                throw new Error(
                    `MigrationEngine: migration chain broken — expected fromVersion=${last.toVersion}, got ${migration.fromVersion}.`
                );
            }
            if (migration.fromVersion === migration.toVersion) {
                throw new Error(
                    `MigrationEngine: migration fromVersion and toVersion must differ (got ${migration.fromVersion}).`
                );
            }
            if (migration.toVersion <= last.toVersion) {
                throw new Error(
                    `MigrationEngine: migration toVersion must be greater than the last registered toVersion (${last.toVersion}), got ${migration.toVersion}.`
                );
            }
        }
        this._migrations.push(migration);
    }

    /**
     * Apply the chain of migrations until the document's schemaVersion matches
     * the current version. Returns the (possibly transformed) document.
     *
     * @param {DocumentRoot} document - The document to migrate.
     * @returns {DocumentRoot} The migrated document, or the original if already current.
     */
    public migrate(document: DocumentRoot): DocumentRoot {
        const target: number = this.getCurrentVersion();
        if (document.schemaVersion === target) {
            return document;
        }
        if (document.schemaVersion > target) {
            throw new Error(
                `MigrationEngine: document schemaVersion (${document.schemaVersion}) is greater than current version (${target}); downgrades are not supported.`
            );
        }

        let current: DocumentRoot = document;
        for (const migration of this._migrations) {
            if (current.schemaVersion < migration.fromVersion) {
                continue; // not yet at this migration's fromVersion
            }
            if (current.schemaVersion >= migration.toVersion) {
                continue; // already past this migration
            }
            current = migration.migrate(current);
        }
        return current;
    }

    /**
     * The latest version the engine knows how to migrate to.
     * Returns 0 if no migrations are registered.
     *
     * @returns {number} The highest registered `toVersion`, or 0.
     */
    public getCurrentVersion(): number {
        if (this._migrations.length === 0) {
            return 0;
        }
        return this._migrations[this._migrations.length - 1].toVersion;
    }

    /**
     * Read-only view of the registered migrations (for testing / inspection).
     *
     * @returns {Array<SchemaMigration>} The registered migrations in registration order.
     */
    public getMigrations(): readonly SchemaMigration[] {
        return this._migrations;
    }
}
