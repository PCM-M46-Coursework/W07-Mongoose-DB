const validateISBN = require("../validateISBN");

describe("validateISBN Tests", () => {

    test.each([
        "978-3-16-148410-0",
        "185723569X",
        "9781857235692"
    ])("should be a valid ISBN.", (isbn) => {
        const actual = validateISBN(isbn);
        expect(actual).toBe(true);
    });

    test.each([
        undefined,
        null,
        "",
        "978-3-16-148410-1",
        "185723569Y",
        "9781857235691"
    ])("should not be a valid ISBN.", (isbn) => {
        const actual = validateISBN(isbn);
        expect(actual).toBe(false);
    });

});