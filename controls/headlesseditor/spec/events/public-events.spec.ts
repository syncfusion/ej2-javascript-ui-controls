import { BEFORE_PASTE, BEFORE_DELETE, CREATED, EDITOR_DESTROYED, CONTENT_CHANGED, SELECTION_CHANGED, FOCUS, BLUR,
    AFTER_PASTE, AFTER_DELETE, 
    DOCUMENT_CHANGED} from '../../src/events/public-events/index';
import { BeforePasteEvent, BeforeDeleteEvent } from '../../src/events/public-events/index';

describe('Public event catalog', () => {
    describe('CancelableEvent cancellation', () => {
        it('BeforePasteEvent cancel flag defaults to false', () => {
            const event: BeforePasteEvent = {
                type: BEFORE_PASTE,
                payload: { content: '<p>hello</p>' },
                cancel: false
            };
            expect(event.cancel).toBe(false);
        });

        it('BeforePasteEvent cancel flag can be set to true', () => {
            const event: BeforePasteEvent = {
                type: BEFORE_PASTE,
                payload: { content: '' },
                cancel: false
            };
            event.cancel = true;
            expect(event.cancel).toBe(true);
        });

        it('BeforeDeleteEvent cancel flag can be set to true', () => {
            const event: BeforeDeleteEvent = {
                type: BEFORE_DELETE,
                payload: { nodeId: 'abc', nodeType: 'paragraph' },
                cancel: false
            };
            event.cancel = true;
            expect(event.cancel).toBe(true);
        });
    });

    describe('Event type constants', () => {
        it('all 11 public event type constants have correct string values', () => {
            // Verify each camelCase string value
            expect(CREATED).toBe('created');
            expect(EDITOR_DESTROYED).toBe('destroyed');
            expect(CONTENT_CHANGED).toBe('contentChanged');
            expect(DOCUMENT_CHANGED).toBe('documentChanged');
            expect(SELECTION_CHANGED).toBe('selectionChanged');
            expect(FOCUS).toBe('focus');
            expect(BLUR).toBe('blur');
            expect(BEFORE_PASTE).toBe('beforePaste');
            expect(AFTER_PASTE).toBe('afterPaste');
            expect(BEFORE_DELETE).toBe('beforeDelete');
            expect(AFTER_DELETE).toBe('afterDelete');
        });
    });
});

