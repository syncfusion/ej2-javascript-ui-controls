/**
 * registry.ts — CommandRegistry
 *
 * Owns registration and lookup. Nothing else.
 * Extensions do NOT receive a `CommandRegistry` reference directly —
 * they go through `ExtensionContext.registerCommand()` (Epic 8).
 */
import { Command, UnknownCommandError, DuplicateCommandError } from './types';

// ── CommandRegistration ───────────────────────────────────────────────────────

/**
 * CommandRegistration — a record stored for each registered command.
 */
export interface CommandRegistration {
    readonly command: Command<unknown>;
    readonly source: 'builtin' | 'extension';
    readonly extensionName?: string;
}

// ── CommandRegistry ───────────────────────────────────────────────────────────

/**
 * CommandRegistry — single registry for all commands.
 *
 * Responsibilities:
 *  - `register`       — store; throw `DuplicateCommandError` on collision
 *  - `get`            — retrieve; throw `UnknownCommandError` if absent
 *  - `has`            — safe existence check (no throw)
 *  - `getAll`         — return all registrations
 *  - `getByCategory`  — filter by `meta.category`
 *  - `getByExtension` — filter by `extensionName`
 */
export class CommandRegistry {
    private readonly registrations: Map<string, CommandRegistration> = new Map();

    /**
     * Register a command.
     *
     * @param {Command} command - The command to register.
     * @param {string} source - The origin of the command (`'builtin'` or `'extension'`).
     * @param {string} [extensionName] - The owning extension's name when `source` is `'extension'`.
     * @returns {void}
     * @hidden
     */
    public register(
        command: Command<unknown>,
        source: 'builtin' | 'extension',
        extensionName?: string
    ): void {
        if (this.registrations.has(command.name)) {
            throw new DuplicateCommandError(command.name);
        }
        const registration: CommandRegistration = { command, source, extensionName };
        this.registrations.set(command.name, registration);
    }

    /**
     * Retrieve a registration by command name.
     *
     * @param {string} name - The command name to look up.
     * @returns {CommandRegistration} The matching registration.
     * @hidden
     */
    public get(name: string): CommandRegistration {
        const registration: CommandRegistration | undefined = this.registrations.get(name);
        if (registration === undefined) {
            throw new UnknownCommandError(name);
        }
        return registration;
    }

    /**
     * Check whether a command with the given name is registered.
     * Never throws.
     *
     * @param {string} name - The command name to check.
     * @returns {boolean} True if the command is registered.
     * @hidden
     */
    public has(name: string): boolean {
        return this.registrations.has(name);
    }

    /**
     * Return all registered commands as an array.
     *
     * @returns {CommandRegistration[]} A snapshot of all registrations.
     * @hidden
     */
    public getAll(): CommandRegistration[] {
        return Array.from(this.registrations.values());
    }

    /**
     * Return only registrations whose `command.meta.category` matches the given
     * category string. Commands with no meta or no category are excluded.
     *
     * @param {string} category - The category string to match against `command.meta.category`.
     * @returns {CommandRegistration[]} Registrations whose category matches.
     * @hidden
     */
    public getByCategory(category: string): CommandRegistration[] {
        return this.getAll().filter(
            (reg: CommandRegistration) => reg.command.meta?.category === category
        );
    }

    /**
     * Return only registrations whose `extensionName` matches the given name.
     *
     * @param {string} extensionName - The extension name to filter by.
     * @returns {CommandRegistration[]} Registrations whose extensionName matches.
     * @hidden
     */
    public getByExtension(extensionName: string): CommandRegistration[] {
        return this.getAll().filter(
            (reg: CommandRegistration) => reg.extensionName === extensionName
        );
    }
}
