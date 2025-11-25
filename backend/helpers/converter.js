/**
 * Converte strings de snake_case para camelCase
 * Exemplo: "data_nascimento" → "dataNascimento"
 */
function toCamelCase(str) {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
  }
  
  /**
   * Converte um objeto com chaves em snake_case para camelCase
   * Exemplo: {data_nascimento: "1990-01-01"} → {dataNascimento: "1990-01-01"}
   */
  function convertRowToCamelCase(row) {
    const converted = {};
    
    for (const key in row) {
      const camelKey = toCamelCase(key);
      
      // Converter "exame_ids" de string JSON para array
      if (key === 'exame_ids') {
        converted[camelKey] = JSON.parse(row[key]);
      } else {
        converted[camelKey] = row[key];
      }
    }
    
    return converted;
  }
  
  /**
   * Converte array de objetos com snake_case para camelCase
   * Aplica convertRowToCamelCase em cada objeto do array
   */
  function convertRowsToCamelCase(rows) {
    return rows.map(row => convertRowToCamelCase(row));
  }
  
  module.exports = {
    toCamelCase,
    convertRowToCamelCase,
    convertRowsToCamelCase
  };