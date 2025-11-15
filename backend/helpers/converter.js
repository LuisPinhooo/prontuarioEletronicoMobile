/**
 * Converte snake_case para camelCase
 */
function toCamelCase(str) {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
  }
  
  /**
   * Converte objeto snake_case para camelCase
   */
  function convertRowToCamelCase(row) {
    const converted = {};
    
    for (const key in row) {
      const camelKey = toCamelCase(key);
      
      // Se for exame_ids, converter para array
      if (key === 'exame_ids') {
        converted[camelKey] = JSON.parse(row[key]);
      } else {
        converted[camelKey] = row[key];
      }
    }
    
    return converted;
  }
  
  /**
   * Converte array de objetos snake_case para camelCase
   */
  function convertRowsToCamelCase(rows) {
    return rows.map(row => convertRowToCamelCase(row));
  }
  
  module.exports = {
    toCamelCase,
    convertRowToCamelCase,
    convertRowsToCamelCase
  };