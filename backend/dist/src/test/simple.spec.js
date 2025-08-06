describe('Simple Test Suite', () => {
    it('should pass basic test', () => {
        expect(1 + 1).toBe(2);
    });
    it('should validate string operations', () => {
        const testString = 'Tejo Beauty';
        expect(testString).toContain('Beauty');
        expect(testString.length).toBe(11);
    });
    it('should validate array operations', () => {
        const products = ['nail polish', 'gel base', 'cuticle oil'];
        expect(products).toHaveLength(3);
        expect(products).toContain('nail polish');
    });
    it('should validate object operations', () => {
        const product = {
            id: '1',
            name: 'Professional Nail Polish',
            price: 25.99,
            category: 'Polish'
        };
        expect(product.name).toBe('Professional Nail Polish');
        expect(product.price).toBeGreaterThan(20);
        expect(product).toHaveProperty('category');
    });
});
//# sourceMappingURL=simple.spec.js.map