/**
 * facade.ts — Proxy-backed command facades
 *
 * No method definitions. All calls are routed dynamically at runtime via Proxy.
 * Adding new commands requires zero changes here.
 *
 * Exports:
 *   createCommandsFacade(manager) — routes property access to manager.execute()
 *   createCanFacade(manager)      — routes property access to manager.canExecute()
 *   createChainFacade(builder)    — routes property access to builder.execute(); .run()/.canRun() are terminal
 */
import { CommandManager } from './manager';
import { TypedCommandsFacade, TypedCanFacade, TypedChain } from './typed-surface';
import { ChainResult } from './types';

// ── ChainBuilder forward ref ──────────────────────────────────────────────────
/* Avoid a circular import: facade.ts → chain.ts → facade.ts
 * We type the builder structurally to break the cycle.
 */

export interface ChainBuilderLike {
    execute(name: string, payload?: unknown): ChainBuilderLike;
    run(): ChainResult;
    canRun(): boolean;
}

// ── createCommandsFacade ──────────────────────────────────────────────────────

/**
 * Returns a `TypedCommandsFacade` proxy.
 *
 * Accessing any property `p` returns a function that calls `manager.execute(p, payload)`.
 * The `run` and `canRun` properties are intentionally excluded (they belong to `TypedChain`).
 *
 * @param {CommandManager} manager - The manager that backs the dispatched commands.
 * @returns {TypedCommandsFacade} A proxy facade over the command manager.
 * @hidden
 */
export function createCommandsFacade(manager: CommandManager): TypedCommandsFacade {
    const handler: ProxyHandler<object> = {
        get(_target: object, prop: string | symbol): (payload?: unknown) => boolean {
            const name: string = String(prop);
            return function commandFacadeMethod(payload?: unknown): boolean {
                return manager.execute(name, payload);
            };
        }
    };
    return new Proxy(Object.create(null) as object, handler) as TypedCommandsFacade;
}

// ── createCanFacade ───────────────────────────────────────────────────────────

/**
 * Returns a `TypedCanFacade` proxy.
 *
 * Accessing any property `p` returns a function that calls `manager.canExecute(p, payload)`.
 * Never dispatches — safe to call at any time.
 *
 * @param {CommandManager} manager - The manager that backs the can-execute checks.
 * @returns {TypedCanFacade} A proxy facade over command availability checks.
 * @hidden
 */
export function createCanFacade(manager: CommandManager): TypedCanFacade {
    const handler: ProxyHandler<object> = {
        get(_target: object, prop: string | symbol): (payload?: unknown) => boolean {
            const name: string = String(prop);
            return function canFacadeMethod(payload?: unknown): boolean {
                return manager.canExecute(name, payload);
            };
        }
    };
    return new Proxy(Object.create(null) as object, handler) as TypedCanFacade;
}

// ── createChainFacade ─────────────────────────────────────────────────────────

/**
 * Returns a `TypedChain` proxy backed by a `ChainBuilderLike`.
 *
 * - Every property access that is NOT `run` or `canRun` returns a function that:
 *     1. calls `builder.execute(name, payload)` to queue the step, then
 *     2. returns `this` (the facade itself) for fluent chaining.
 * - `run` → returns `builder.run()` (a `ChainResult`)
 * - `canRun` → returns `builder.canRun()` (a `boolean`)
 *
 * @param {ChainBuilderLike} builder - The chain builder that queues and runs steps.
 * @returns {TypedChain} A proxy facade supporting fluent chained execution.
 * @hidden
 */
export function createChainFacade(builder: ChainBuilderLike): TypedChain {
    const facade: TypedChain = new Proxy(Object.create(null) as object, {
        get(_target: object, prop: string | symbol): unknown {
            const name: string = String(prop);

            if (name === 'run') {
                return function chainRun(): ChainResult {
                    return builder.run();
                };
            }

            if (name === 'canRun') {
                return function chainCanRun(): boolean {
                    return builder.canRun();
                };
            }

            return function chainStepMethod(payload?: unknown): TypedChain {
                builder.execute(name, payload);
                return facade;
            };
        }
    }) as TypedChain;

    return facade;
}
