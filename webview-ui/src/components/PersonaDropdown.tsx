import { VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react";
import { Persona } from "../../../shared/types";

interface PersonaDropdownProps {
  label: string;
  personas: Persona[];
  selectedPersonaId: number;
  changeSelectedPersonaId: (id: number) => void;
}

/**
 * A dropdown to select a persona from the given list.
 */
export const PersonaDropdown: React.FC<PersonaDropdownProps> = ({
  label,
  personas,
  selectedPersonaId,
  changeSelectedPersonaId,
}) => {
  const handleOnPersonaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeSelectedPersonaId(parseInt(e.target.value));
  };

  return (
    <div className="dropdown-container">
      <label htmlFor="persona-dropdown">{label}</label>
      <VSCodeDropdown
        id="persona-dropdown"
        onInput={handleOnPersonaSelect}
        value={selectedPersonaId.toString()} // Sets initial value
      >
        {personas.map((persona) => (
          <VSCodeOption
            key={persona.id}
            selected={persona.id === selectedPersonaId}
            value={persona.id.toString()}
          >
            {persona.name}
          </VSCodeOption>
        ))}
      </VSCodeDropdown>
    </div>
  );
};