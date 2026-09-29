import * as publicEvents from '../../src/events/public-events/index';

describe('Public events barrel', () => {
	it('exports all public events and file upload helpers', () => {
		expect(publicEvents.CREATED).toBeDefined();
		expect(publicEvents.EDITOR_DESTROYED).toBeDefined();
		expect(publicEvents.CONTENT_CHANGED).toBeDefined();
		expect(publicEvents.SELECTION_CHANGED).toBeDefined();
		expect(publicEvents.DOCUMENT_CHANGED).toBeDefined();
		expect(publicEvents.FOCUS).toBeDefined();
		expect(publicEvents.BLUR).toBeDefined();
		expect(publicEvents.BEFORE_PASTE).toBeDefined();
		expect(publicEvents.AFTER_PASTE).toBeDefined();
		expect(publicEvents.BEFORE_DELETE).toBeDefined();
		expect(publicEvents.AFTER_DELETE).toBeDefined();
		expect(publicEvents.BEFORE_FILE_UPLOAD).toBeDefined();
		expect(publicEvents.FILE_RECEIVED).toBeDefined();
		expect(publicEvents.FileUploadEventType).toBeDefined();
		expect(publicEvents.createBeforeFileUploadEvent).toBeDefined();
		expect(publicEvents.createFileReceivedEvent).toBeDefined();
	});
});
