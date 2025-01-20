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
  { label: "Red", name: "red", baseHex: "#EB1212", tints: null },
  { label: "Orange", name: "orange", baseHex: "#F77807", tints: null },
  { label: "Yellow", name: "yellow", baseHex: "#EFC331", tints: null },
  { label: "Green", name: "green", baseHex: "#4DA23A", tints: null },
  { label: "Blue", name: "blue", baseHex: "#499DD2", tints: null },
  { label: "Purple", name: "purple", baseHex: "#BB5DD8", tints: null },
  { label: "Grey", name: "grey", baseHex: "#686868", tints: null },
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
      { pluginMessage: { type: "generate-color-palette", colors } },
      "*"
    );
  };

  const onLogs = () => {
    parent.postMessage({ pluginMessage: { type: "log" } }, "*");
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

        <button onClick={onLogs}>
          Logs
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
