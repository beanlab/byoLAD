import { ModelProvider } from ".";

/**
 * The character/purpose/identity of the LLM in a conversation.
 */
export interface Persona {
  id: number;
  /**
   * The name of the persona.
   * Must be 30 characters or less.
   */
  name: string;
  /**
   * A brief description of the persona.
   * Must be 100 characters or less.
   */
  description: string;
  /**
   * Base contextual instructions to inform the LLM of its purpose/goal/role.
   * Included in the prompt for the model, so the value must fit within the context window and input token limits.
   * @example "You are a helpful coding assistant. Your purpose is to help the user fix their code."
   */
  instructions: string; // TODO: Max length?
  modelProvider: ModelProvider;
  /**
   * The ID of the model to use for this persona. Specific to the model provider.
   * e.g. "gpt-3.5-turbo"
   */
  modelId: string;
}

export type PersonaDraft = Omit<Persona, "id">;
export const PERSONA_NAME_MAX_LENGTH = 30;
export const PERSONA_DESCRIPTION_MAX_LENGTH = 100;
type ValidationRule = (value: string) => string | null;

export function validatePersonaDraftProperties(
  persona: PersonaDraft,
): Map<keyof PersonaDraft, string> {
  const errors = new Map<keyof PersonaDraft, string>();

  validateField(
    "name",
    "Name",
    persona.name,
    [isEmptyOrWhitespace, isGreaterThanMaxLength(PERSONA_NAME_MAX_LENGTH)],
    errors,
  );

  validateField(
    "description",
    "Description",
    persona.description,
    [
      isEmptyOrWhitespace,
      isGreaterThanMaxLength(PERSONA_DESCRIPTION_MAX_LENGTH),
    ],
    errors,
  );

  validateField(
    "instructions",
    "Prompt instructions",
    persona.instructions,
    [isEmptyOrWhitespace],
    errors,
  );

  validateField(
    "modelId",
    "Model",
    persona.modelId,
    [isEmptyOrWhitespace],
    errors,
  );
  console.log("errors", errors);

  return errors;
}

/**
 * Validates a property value and adds an error message to the errors map if invalid.
 * @param key Key of the property being validated.
 * @param displayName Display name of the property.
 * @param value Value to validate.
 * @param validationRules Rules to validate the value against.
 * @param errorsMap Map to add the error message to if the value is invalid.
 */
function validateField(
  key: keyof PersonaDraft,
  displayName: string,
  value: string,
  validationRules: ValidationRule[],
  errorsMap: Map<keyof PersonaDraft, string>,
) {
  console.log("key", key, "value", value, "displayName", displayName);
  for (const rule of validationRules) {
    console.log("rule", rule);
    const errorMessage = rule(value);
    console.log("errorMessage", errorMessage);
    if (errorMessage) {
      errorsMap.set(key, `${displayName} ${errorMessage}`);
      break;
    }
  }
}

const isEmptyOrWhitespace: ValidationRule = (value) => {
  console.log("value", value);
  return !value.trim() ? "cannot be empty or whitespace" : null;
};

const isGreaterThanMaxLength =
  (maxLength: number): ValidationRule =>
  (value) =>
    value.length > maxLength
      ? `cannot be longer than ${maxLength} characters`
      : null;
