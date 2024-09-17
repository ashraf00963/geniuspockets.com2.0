// src/utils/formatUtils.js

/**
 * Format a date to the German date format (dd.mm.yyyy).
 * @param {string | Date} date - The date to format.
 * @returns {string} - The formatted date string.
 */
export const formatDateToGerman = (date) => {
    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  
  /**
   * Format a number to the German format (e.g., 1.000,00).
   * @param {number} number - The number to format.
   * @returns {string} - The formatted number string.
   */
  export const formatNumberToGerman = (number) => {
    return number.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  