const CNPJ_SIZE = 14;

abstract class DocumentValidator {
  private static stripDoumentCharacters(document: string) {
    return document.replace(/[^\d]+/g, ''); // remove non numerics
  }

  private static isDocumentSizeValid(document: string) {
    return document.length === CNPJ_SIZE;
  }

  private static areAllDocumentCharactersEqual(document: string) {
    return /^(\d)\1+$/.test(document);
  }

  private static calcVerifierDigit(document: string, fromDigit: number) {
    let sum = 0;
    let weight = 2;

    for (let i = fromDigit; i >= 0; i--) {
      sum += parseInt(document.charAt(i)) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }

    const rest = sum % 11;
    let verifierDigit = rest < 2 ? 0 : 11 - rest;

    return verifierDigit;
  }

  private static isFirstVerifierDigitValid(document: string) {
    const verifierDigit = this.calcVerifierDigit(document, 11);
    console.log(document.charAt(12), verifierDigit);

    return parseInt(document.charAt(12)) === verifierDigit;
  }

  private static isSecondVerifierDigitValid(document: string) {
    const verifierDigit = this.calcVerifierDigit(document, 12);

    return parseInt(document.charAt(13)) === verifierDigit;
  }

  public static validateDocument(document: string) {
    const formatedDocument = this.stripDoumentCharacters(document);

    const isDocumentFormatationInvalid =
      !this.isDocumentSizeValid(formatedDocument) ||
      this.areAllDocumentCharactersEqual(formatedDocument);

    const areVerifierDigitsValid =
      !this.isFirstVerifierDigitValid(formatedDocument) ||
      !this.isSecondVerifierDigitValid(formatedDocument);

    if (isDocumentFormatationInvalid || areVerifierDigitsValid) {
      return false;
    }

    return true;
  }
}

export default DocumentValidator;
