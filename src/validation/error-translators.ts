import { ErrorTranslators, ErrorTranslator } from "../models/controls";

export class ValidationErrorTranslators {
  private static translators: ErrorTranslators = {};

  static clearTranslators(): void {
    this.translators = {};
  }

  static registerTranslator(key: string, translator: ErrorTranslator): void {
    if (!key || !translator) {
      return;
    }
    this.translators[key] = translator;
  }

  static registerTranslators(translators: ErrorTranslators): void {
    if (!translators) {
      return;
    }
    this.translators = {
      ...this.translators,
      ...translators,
    };
  }

  static removeTranslator(key: string): void {
    if (!key) {
      return;
    }
    delete this.translators[key];
  }

  static translate(key: string, meta?: unknown): string | undefined {
    if (!key) {
      return undefined;
    }
    const translator = this.translators[key];
    if (!translator) {
      return undefined;
    }
    return translator(key, meta);
  }
}
