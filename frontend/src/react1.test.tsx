import { describe, expect, it } from "vitest";

describe('use happy-dom in this test file', ()  :void  => {
    it ('should create a div element', () :void => {
        const element = document.createElement('div');
        expect(element).not.toBe(null);
    });
  });