import { UnsupportedContentError } from '../../core/errors/docx-error';

export function assertNever(value: never, what: string): never {
    throw new UnsupportedContentError(`Unhandled ${what}: ${JSON.stringify(value)}`);
}
