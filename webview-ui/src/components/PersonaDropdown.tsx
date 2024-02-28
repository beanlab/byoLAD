import { VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react";
import { Persona } from "../../../shared/types";

interface PersonaDropdownProps {
  personas: Persona[];
  selectedPersonaId: number;
  changeSelectedPersonaId: (id: number) => void;
}

/**
 * A dropdown to select a persona from the given list.
 */
export const PersonaDropdown: React.FC<PersonaDropdownProps> = ({
  personas,
  selectedPersonaId,
  changeSelectedPersonaId,
}) => {
  const handleOnPersonaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeSelectedPersonaId(parseInt(e.target.value));
  };

  return (
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
  );
};
