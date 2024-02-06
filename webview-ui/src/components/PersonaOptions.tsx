import { useState, useContext } from 'react';
import { Persona } from '../../../src/Chat/PersonaManager';
import { ExtensionMessenger } from '../utilities/ExtensionMessenger';
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { VsCodeThemeContext } from '../utilities/VsCodeThemeContext';

interface PersonaOptionsProps {
 changeActivePersona: (persona: Persona) => void;
}

export const PersonaOptions: React.FC<PersonaOptionsProps> = ({ changeActivePersona }) => {

    const extensionMessenger = new ExtensionMessenger();
    const [showPersonaList, setShowPersonaList] = useState<boolean>(false)
    const vsCodeTheme = useContext(VsCodeThemeContext);
    const personaList = extensionMessenger.getPersonaList();
    const [selectedPersona, setSelectedPersona] = useState<Persona>(extensionMessenger.getActivePersona())

    const handleSelectPersona: React.ChangeEventHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPersonaName = e.target.value
        const newSelectedPersona = personaOptions.find(persona => persona.name === selectedPersonaName) || selectedPersona;
        setSelectedPersona(newSelectedPersona)
        changeActivePersona(newSelectedPersona)
        personaManager.activePersona = newSelectedPersona;
    }
  

    const renderPersonaList = () => (
        <div className="persona-list">
           <h3>Persona Options</h3>
           <ul>
             {personaOptions.map((persona) => (
               <li key={persona.name} onClick={() => handleSelectPersona({ target: { value: persona.name } } as React.ChangeEvent<HTMLSelectElement>)}>
                 {persona.name}
               </li>
             ))}
           </ul>
        </div>
       )
       

 return (
    <div className="persona-options-container" style={{ position: 'absolute', bottom: 0, width: '100%', padding: '10px', background: vsCodeTheme }}>
      <label>
        Select Persona:
        <select onChange={handleSelectPersona}>
          {personaOptions.map((persona) => (
            <option key={persona.name} value={persona.name}>
              {persona.name}
            </option>
          ))}
        </select>
      </label>
      <VSCodeButton
        appearance="icon"
        aria-label="Show Persona List"
        title="Show Persona List"
        onClick={() => setShowPersonaList(true)}
      >
        <i className="codicon codicon-settings-gear" />
      </VSCodeButton>

      {showPersonaList && renderPersonaList()}
    </div>
 )
}
