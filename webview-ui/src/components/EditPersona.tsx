import React, { useEffect, useState } from "react";
import {
  ModelProvider,
  PERSONA_DESCRIPTION_MAX_LENGTH,
  PERSONA_NAME_MAX_LENGTH,
  Persona,
  PersonaDraft,
  validatePersonaDraftProperties,
} from "../../../shared/types";
import {
  VSCodeButton,
  VSCodeTextField,
  VSCodeTextArea,
  VSCodeDropdown,
  VSCodeOption,
} from "@vscode/webview-ui-toolkit/react";

function getProviderModelUrl(provider: ModelProvider): string {
  switch (provider) {
    case ModelProvider.OpenAI:
      return "https://platform.openai.com/docs/models/";
    case ModelProvider.Google:
      return "https://developers.generativeai.google/models/language";
    default: {
      const _exhaustiveCheck: never = provider;
      return _exhaustiveCheck;
    }
  }
}

function getPlaceholderModelId(provider: ModelProvider): string {
  switch (provider) {
    case ModelProvider.OpenAI:
      return "gpt-3.5-turbo"; // Known valid value
    case ModelProvider.Google:
      return "chat-bison"; // Known valid value
    default: {
      const _exhaustiveCheck: never = provider;
      return _exhaustiveCheck;
    }
  }
}

export const EditPersona: React.FC<{
  persona: Persona | PersonaDraft;
  onSave: (persona: Persona | PersonaDraft) => void;
  onCancel: () => void;
}> = ({ persona: personaDraft, onSave, onCancel }) => {
  const [editedPersonaDraft, setEditedPersona] = useState(personaDraft);
  const [validationErrors, setValidationErrors] = useState<
    Map<keyof PersonaDraft, string>
  >(new Map());
  const [visitedFields, setVisitedFields] = useState<Set<keyof PersonaDraft>>(
    new Set(),
  );

  // On mount, invalidates the input, which will keep the save button disabled if needed until the user makes a change
  useEffect(() => {
    setValidationErrors(validatePersonaDraftProperties(editedPersonaDraft));
  }, []);

  useEffect(() => {
    setValidationErrors(validatePersonaDraftProperties(editedPersonaDraft));
  }, [editedPersonaDraft]);

  const handleStringChange = (e: InputEvent) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const propertyName = target.name as keyof PersonaDraft;
    setEditedPersona({
      ...editedPersonaDraft,
      [propertyName]: target.value,
    });
    setVisitedFields((prev) => new Set(prev.add(propertyName)));
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedPersona({
      ...editedPersonaDraft,
      modelProvider: e.target.value as ModelProvider,
    });
  };

  const handleSave = () => {
    if (validationErrors.size > 0) {
      return;
    }
    onSave(editedPersonaDraft);
  };

  return (
    <div className="persona-edit-container">
      <LabelledField
        id="name"
        name="Name"
        validationErrors={validationErrors}
        visitedFields={visitedFields}
      >
        <VSCodeTextField
          id="name"
          name="name"
          value={editedPersonaDraft.name}
          onInput={(e) => handleStringChange(e as InputEvent)}
          size={PERSONA_NAME_MAX_LENGTH}
          autofocus
        />
      </LabelledField>
      <LabelledField
        id="description"
        name="Description"
        validationErrors={validationErrors}
        visitedFields={visitedFields}
      >
        <VSCodeTextField
          id="description"
          name="description"
          value={editedPersonaDraft.description}
          onInput={(e) => handleStringChange(e as InputEvent)}
          size={PERSONA_DESCRIPTION_MAX_LENGTH}
        />
      </LabelledField>
      <LabelledField
        id="modelProvider"
        name="LLM Provider"
        validationErrors={validationErrors}
        visitedFields={visitedFields}
      >
        <VSCodeDropdown
          id="modelProvider"
          name="modelProvider"
          value={editedPersonaDraft.modelProvider}
          onInput={handleDropdownChange}
        >
          {Object.values(ModelProvider).map((modelProvider) => (
            <VSCodeOption key={modelProvider} value={modelProvider}>
              {modelProvider}
            </VSCodeOption>
          ))}
        </VSCodeDropdown>
      </LabelledField>
      <LabelledField
        id="modelId"
        name="Model"
        validationErrors={validationErrors}
        visitedFields={visitedFields}
      >
        <span>
          See compatible models for{" "}
          <a
            href={getProviderModelUrl(editedPersonaDraft.modelProvider)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {editedPersonaDraft.modelProvider}
          </a>
        </span>
        <VSCodeTextField
          id="modelId"
          name="modelId"
          value={editedPersonaDraft.modelId}
          placeholder={getPlaceholderModelId(editedPersonaDraft.modelProvider)}
          onInput={(e) => handleStringChange(e as InputEvent)}
        />
      </LabelledField>
      <LabelledField
        id="instructions"
        name="Prompt Instructions"
        validationErrors={validationErrors}
        visitedFields={visitedFields}
      >
        <span>
          Base contextual instructions to establish the persona's purpose and
          behavior. This is used towards the beginning of every request, so the
          value must fit within the context window and input token limits.
        </span>
        <VSCodeTextArea
          id="instructions"
          name="instructions"
          value={editedPersonaDraft.instructions}
          onInput={(e) => handleStringChange(e as InputEvent)}
          placeholder="You are a helpful coding assistant. Your purpose is to work with the user to fix their code. Always respond with..."
          rows={25}
          resize="vertical"
        />
      </LabelledField>
      <div className="persona-edit-confirm-button-container">
        <VSCodeButton appearance="secondary" onClick={onCancel}>
          Cancel
          <span slot="start" className="codicon codicon-close"></span>
        </VSCodeButton>
        <VSCodeButton
          appearance="primary"
          onClick={handleSave}
          disabled={validationErrors.size > 0}
        >
          Save
          <span slot="start" className="codicon codicon-save"></span>
        </VSCodeButton>
      </div>
    </div>
  );
};

interface LabelledFieldProps {
  id: keyof PersonaDraft;
  name: string;
  children: React.ReactNode;
  validationErrors: Map<keyof PersonaDraft, string>;
  visitedFields: Set<keyof PersonaDraft>;
}

const LabelledField: React.FC<LabelledFieldProps> = ({
  id,
  name,
  children,
  validationErrors,
  visitedFields,
}) => {
  return (
    <div className="persona-edit-field-container">
      <label htmlFor={id}>{name}</label>
      {children}
      {visitedFields.has(id) && validationErrors.get(id) && (
        <span className="persona-edit-validation-error-message">
          {validationErrors.get(id)}
        </span>
      )}
    </div>
  );
};

export default LabelledField;
