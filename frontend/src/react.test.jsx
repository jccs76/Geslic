import { describe, expect, it } from "vitest";

const suma = (a,b) => {
    return a + b;
}

describe('Función Suma', () => {
    it('Suma debe ser una función', () => {
        expect(typeof suma).toBe('function');
    });

    it('Suma debe sumar correctamente dos números positivos', () => {
        expect(suma(3,4)).toBe(7);
    });
});
