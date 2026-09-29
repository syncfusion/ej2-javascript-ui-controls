/**
 * SchemaMigration — a single version-to-version document transform.
 *
 * Migrations are pure functions. They MUST be idempotent: running
 * `migrate(doc)` twice produces the same output as running it once.
 */
import { DocumentRoot } from '../../model/editor-node';

export interface SchemaMigration {
    /** Source version this migration operates on. */
    fromVersion: number;
    /** Target version after this migration runs. */
    toVersion: number;
    /** Transform the document. Must be idempotent. */
    migrate(document: DocumentRoot): DocumentRoot;
}
