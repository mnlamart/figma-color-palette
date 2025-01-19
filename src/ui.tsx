import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./ui.css";

type Color = {
  label: string;
  name: string;
  baseHex: string;
  tints: string | null;
};

const defaultColors: Color[] = [
  { label: "Red", name: "red", baseHex: "#FF0000", tints: null },
  { label: "Orange", name: "orange", baseHex: "#FFA500", tints: null },
  { label: "Yellow", name: "yellow", baseHex: "#FFFF00", tints: null },
  { label: "Green", name: "green", baseHex: "#008000", tints: null },
  { label: "Blue", name: "blue", baseHex: "#0000FF", tints: null },
  { label: "Purple", name: "purple", baseHex: "#800080", tints: null },
  { label: "Grey", name: "grey", baseHex: "#808080", tints: null },
];

function App() {
  const [colors, setColors] = React.useState<Color[]>(defaultColors);

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], baseHex: value };
    setColors(newColors);
  };

  const onCreate = () => {
    parent.postMessage(
      { pluginMessage: { type: "create-shapes", colors } },
      "*"
    );
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  return (
    <main>
      <header>
        <h2>Choisissez vos couleurs de base:</h2>
      </header>

      <section>
        <div className="colors-grid">
          {colors.map((color, index) => (
            <div key={color.name}>
              <label>{color.label}</label>
              <input
                className="colors-grid-item"
                type="color"
                value={colors[index].baseHex}
                onChange={(e) => handleColorChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      <footer>
        <button onClick={onCreate}>
          Créer
        </button>

        <button onClick={onCancel}>Annuler</button>
      </footer>
    </main>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
}
