import { parseColor } from './color'

describe('Color Module', () => {
    it('should parse html color', ()=> {
        let color = parseColor("#ff0000");
        expect(color.red).toBe(1);
        expect(color.green).toBe(0);
        expect(color.blue).toBe(0);
        expect(color.alpha).toBe(1);

        let color = parseColor("#00ff0000");
        expect(color.red).toBe(0);
        expect(color.green).toBe(1);
        expect(color.blue).toBe(0);
        expect(color.alpha).toBe(0);


        let color = parseColor("#0000ff");
        expect(color.red).toBe(0);
        expect(color.green).toBe(0);
        expect(color.blue).toBe(1);
        expect(color.alpha).toBe(1);
    });
});
