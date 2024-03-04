import React, { useState } from "react";
import { ModelProvider, Persona, PersonaDraft } from "../../../shared/types";
import {
  VSCodeButton,
  VSCodeDataGrid,
  VSCodeDataGridCell,
  VSCodeDataGridRow,
} from "@vscode/webview-ui-toolkit/react";
import { useAppContext } from "../utilities/AppContext";
import { EditPersona } from "./EditPersona";
import { useExtensionMessageContext } from "../utilities/ExtensionMessageContext";

export const PersonaSettings: React.FC = () => {
  const { personaList } = useAppContext();
  const { deletePersona, updatePersona } = useExtensionMessageContext();
  const [selectedPersona, setSelectedPersona] = useState<
    Persona | PersonaDraft | null
  >(null);

  const handleAddPersona = () => {
    setSelectedPersona({
      name: "",
      description: "",
      modelProvider: ModelProvider.OpenAI, // TODO: Default? Leave null?
      modelId: "",
      instructions: "",
    } as PersonaDraft);
  };

  const handleEditPersona = (persona: Persona) => {
    setSelectedPersona(persona as PersonaDraft);
  };

  const handleDeletePersona = (persona: Persona) => {
    deletePersona(persona.id);
  };

  const handleSavePersona = (persona: Persona | PersonaDraft) => {
    updatePersona(persona);
    setSelectedPersona(null);
  };

  const handleDuplicatePersona = (persona: Persona) => {
    const duplicate: PersonaDraft = {
      name: `${persona.name} (copy)`,
      description: persona.description,
      instructions: persona.instructions,
      modelProvider: persona.modelProvider,
      modelId: persona.modelId,
    };
    updatePersona(duplicate);
  };

  return (
    <div>
      <h1>Personas</h1>
      {selectedPersona ? (
        <EditPersona
          persona={selectedPersona}
          onSave={handleSavePersona}
          onCancel={() => setSelectedPersona(null)}
        />
      ) : (
        <>
          <VSCodeButton
            onClick={handleAddPersona}
            appearance="primary"
            title="Add"
            aria-label="Add"
          >
            Add
            <span slot="start" className="codicon codicon-add"></span>
          </VSCodeButton>
          <VSCodeDataGrid generate-header="none" aria-label="Custom Personas">
            <VSCodeDataGridRow row-type="sticky-header">
              <VSCodeDataGridCell cell-type="columnheader" grid-column="1">
                Name
              </VSCodeDataGridCell>
              <VSCodeDataGridCell cell-type="columnheader" grid-column="2">
                Provider
              </VSCodeDataGridCell>
              <VSCodeDataGridCell cell-type="columnheader" grid-column="3">
                Model
              </VSCodeDataGridCell>
              <VSCodeDataGridCell cell-type="columnheader" grid-column="4" />
            </VSCodeDataGridRow>
            {personaList.map((persona) => (
              <VSCodeDataGridRow key={persona.modelId}>
                <VSCodeDataGridCell gridColumn="1">
                  {persona.name}
                </VSCodeDataGridCell>
                <VSCodeDataGridCell gridColumn="2">
                  {persona.modelProvider}
                </VSCodeDataGridCell>
                <VSCodeDataGridCell gridColumn="3">
                  {persona.modelId}
                </VSCodeDataGridCell>
                <VSCodeDataGridCell gridColumn="4">
                  <div style={{ display: "flex" }}>
                    <VSCodeButton
                      onClick={() => handleEditPersona(persona)}
                      title="Edit"
                      aria-label="Edit"
                      appearance="icon"
                    >
                      <i className="codicon codicon-edit" />
                    </VSCodeButton>
                    <VSCodeButton
                      onClick={() => handleDuplicatePersona(persona)}
                      title="Duplicate"
                      aria-label="Duplicate"
                      appearance="icon"
                    >
                      <i className="codicon codicon-copy" />
                    </VSCodeButton>
                    <VSCodeButton
                      onClick={() => handleDeletePersona(persona)}
                      title="Delete"
                      aria-label="Delete"
                      appearance="icon"
                    >
                      <i className="codicon codicon-trash" />
                    </VSCodeButton>
                  </div>
                </VSCodeDataGridCell>
              </VSCodeDataGridRow>
            ))}
          </VSCodeDataGrid>
        </>
      )}
    </div>
  );
};
