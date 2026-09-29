import * as nodeViews from '../../src/nodeviews/index';

describe('Nodeviews barrel', () => {
	it('exports ResizableNodeView', () => {
		expect(nodeViews.ResizableNodeView).toBeDefined();
	});
});
