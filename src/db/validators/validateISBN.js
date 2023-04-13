/**
 * Validates a string representing an ISBN for books.
 *
 * This implementation cleans the input string by removing all non-numeric 
 * characters except 'X' at the end. It then checks the length of the cleaned 
 * string to ensure that it is either 10 or 13 characters long.
 * 
 * For 10-digit ISBNs, it calculates the checksum by multiplying each digit by 
 * its weight (10 for the first digit, 9 for the second digit, etc.) and summing 
 * the results. If the last character is 'X', it is treated as a value of 10. 
 * The function then returns true if the sum is divisible by 11.
 *
 * For 13-digit ISBNs, it calculates the checksum by multiplying each digit by 
 * its weight (1 for the first digit, 3 for the second digit, 1 for the third digit, 
 * etc.) and summing the results. The function then returns true if the check digit 
 * (the last digit) is equal to 10 minus the sum modulo 10.
 * 
 * @param {string} isbn - The string to validate.
 * @returns {boolean} - Returns true if the string is a valid ISBN, and false otherwise.
 */
module.exports = function validateISBN(isbn)
{
    if (isbn == null) return false;

    // Remove all non-numeric characters except 'X' at the end.
    const cleanedISBN = isbn.replace(/[^\dX]/gi, '');
  
    // Check the length of the cleaned string.
    if (cleanedISBN.length !== 10 && cleanedISBN.length !== 13) {
      return false;
    }
  
    // For 10-digit ISBNs, calculate the checksum.
    if (cleanedISBN.length === 10) {
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanedISBN.charAt(i)) * (10 - i);
      }
      const lastChar = cleanedISBN.charAt(9);
      if (lastChar === 'X') {
        sum += 10;
      } else {
        sum += parseInt(lastChar);
      }
      return sum % 11 === 0;
    }
  
    // For 13-digit ISBNs, calculate the checksum.
    if (cleanedISBN.length === 13) {
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        sum += parseInt(cleanedISBN.charAt(i)) * (i % 2 === 0 ? 1 : 3);
      }
      const checkDigit = (10 - (sum % 10)) % 10;
      return checkDigit === parseInt(cleanedISBN.charAt(12));
    }
  
    return false;
};