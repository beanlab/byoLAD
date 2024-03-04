import React, { useState } from "react";
import { ModelProvider, Persona, PersonaDraft } from "../../../shared/types";
import { STANDARD_PERSONAS } from "../../../shared/data/StandardPersonas";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { useAppContext } from "../utilities/AppContext";
import { EditPersona } from "./EditPersona";
import { useExtensionMessageContext } from "../utilities/ExtensionMessageContext";
import NavBar from "./NavBar";

export const PersonaSettings: React.FC = () => {
  const { personaList } = useAppContext();
  const { deletePersona, updatePersona } = useExtensionMessageContext();
  const [selectedPersona, setSelectedPersona] = useState<
    Persona | PersonaDraft | null
  >(null);
  const uneditablePersonaIds = STANDARD_PERSONAS.map((p) => p.id);

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
      {selectedPersona ? (
        <>
          <div className="page-header">
            <h2>Custom Persona</h2>
          </div>
          <EditPersona
            persona={selectedPersona}
            onSave={handleSavePersona}
            onCancel={() => setSelectedPersona(null)}
          />
        </>
      ) : (
        <>
          <NavBar />
          <div className="page-header">
            <h2>Personas</h2>
          </div>
          <VSCodeButton
            onClick={handleAddPersona}
            appearance="primary"
            title="Add"
            aria-label="Add"
            style={{ marginBottom: "1rem" }}
          >
            Add
            <span slot="start" className="codicon codicon-add"></span>
          </VSCodeButton>

          <div className="persona-cards">
            {personaList.map((p) => (
              <div key={p.modelId} className="persona-card">
                <div className="persona-card-header">
                  <h3>{p.name}</h3>
                  <div className="persona-card-button-group">
                    {!uneditablePersonaIds.includes(p.id) && (
                      <VSCodeButton
                        onClick={() => handleEditPersona(p)}
                        title="Edit"
                        aria-label="Edit"
                        appearance="icon"
                      >
                        <i className="codicon codicon-edit" />
                      </VSCodeButton>
                    )}
                    <VSCodeButton
                      onClick={() => handleDuplicatePersona(p)}
                      title="Duplicate"
                      aria-label="Duplicate"
                      appearance="icon"
                    >
                      <i className="codicon codicon-copy" />
                    </VSCodeButton>
                    {!uneditablePersonaIds.includes(p.id) && (
                      <VSCodeButton
                        onClick={() => handleDeletePersona(p)}
                        title="Delete"
                        aria-label="Delete"
                        appearance="icon"
                      >
                        <i className="codicon codicon-trash" />
                      </VSCodeButton>
                    )}
                  </div>
                </div>
                <p>{p.description}</p>
                <hr />
                <p>
                  {p.modelProvider}: {p.modelId}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
