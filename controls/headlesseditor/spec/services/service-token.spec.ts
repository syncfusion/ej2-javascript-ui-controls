/**
 * service-token.spec.ts
 *
 * Unit tests for the ServiceToken factory and the tokenName() helper.
 */
import { createToken, tokenName, ServiceToken } from '../../src/services/service-token';

describe('createToken', () => {
    it('produces a unique symbol per call', () => {
        const t1 = createToken<unknown>('SameName');
        const t2 = createToken<unknown>('SameName');
        expect(typeof t1).toBe('symbol');
        expect(t1).not.toBe(t2);
    });

    it('returns a symbol branded with the requested type', () => {
        interface IFoo { foo(): void; }
        const t = createToken<IFoo>('Foo');
        // Type-level: the brand allows `ServiceToken<IFoo>` without a cast
        const typed: ServiceToken<IFoo> = t;
        expect(typed).toBe(t);
    });
});

describe('tokenName', () => {
    it('returns the name passed to createToken', () => {
        const t = createToken<unknown>('EventBus');
        expect(tokenName(t)).toBe('EventBus');
    });

    it("returns 'unknown' when the symbol has no description", () => {
        // `Symbol()` without a description has `description === undefined`.
        // Cast through any so the compiler doesn't reject the brand cast.
        const bare: ServiceToken<unknown> = Symbol() as ServiceToken<unknown>;
        expect(tokenName(bare)).toBe('unknown');
    });
});
