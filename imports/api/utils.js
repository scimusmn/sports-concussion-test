/*
 *
 * Utility functions
 *
*/

/*
 *
 * camelToTitleCase
 * Convert came case string
 * into title case string
 * mySpecialString => My Special String
 *
*/
export function camelToTitleCase(camelCase) {
    if (camelCase == null || camelCase == '') {
      return camelCase;
    }

    camelCase = camelCase.trim();
    var newText = '';
    for (var i = 0; i < camelCase.length; i++) {
      if (/[A-Z]/.test(camelCase[i])
          && i != 0
          && /[a-z]/.test(camelCase[i - 1])) {
        newText += ' ';
      }

      if (i == 0 && /[a-z]/.test(camelCase[i]))
      {
        newText += camelCase[i].toUpperCase();
      } else {
        newText += camelCase[i];
      }
    }

    return newText;
  }
