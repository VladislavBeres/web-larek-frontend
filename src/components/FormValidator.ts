import { ValidationRule } from "../types";


export class FormValidator {
  private rules: ValidationRule[] = [];

  addRule(validateFn: () => boolean, errorMessage: string) {
    this.rules.push({ validate: validateFn, errorMessage });
  }

  validate(): { valid: boolean; error?: string } {
    for (const rule of this.rules) {
      if (!rule.validate()) {
        return { valid: false, error: rule.errorMessage };
      }
    }
    return { valid: true };
  }
  

  clearRules() {
    this.rules = [];
  }
}