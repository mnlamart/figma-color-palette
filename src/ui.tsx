import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./ui.css";
import i18n from './i18n'
import { withTranslation } from "react-i18next";
import generateColorTints from "./generate-color-tint";

type Color = {
  label: string;
  name: string;
  baseHex: string;
  tints: string | null;
};

// i18n.changeLanguage('fr');

const defaultColors: Color[] = [
  { label: i18n.t('colors.red'), name: "red", baseHex: "#EB1212", tints: null },
  { label: i18n.t('colors.orange'), name: "orange", baseHex: "#F77807", tints: null },
  { label: i18n.t('colors.yellow'), name: "yellow", baseHex: "#EFC331", tints: null },
  { label: i18n.t('colors.green'), name: "green", baseHex: "#4DA23A", tints: null },
  { label: i18n.t('colors.blue'), name: "blue", baseHex: "#499DD2", tints: null },
  { label: i18n.t('colors.purple'), name: "purple", baseHex: "#A629CC", tints: null },
  { label: i18n.t('colors.pink'), name: "pink", baseHex: "#FF88F8", tints: null },
  { label: i18n.t('colors.grey'), name: "grey", baseHex: "#686868", tints: null },
];

function App() {
  const [colors, setColors] = React.useState<Color[]>(defaultColors);
  const isDev = process.env.NODE_ENV === "development";

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

  interface ColorTints {
    [shade: string]: string;
  }

  const generatePreview = (color: string): React.ReactElement[] => {
    const colorTints: ColorTints = generateColorTints(color);

    return Object.entries(colorTints).map(([shade, tintColor]: [string, string]) => {
      return (
        <div className="color-preview__wrapper" key={shade}>
          <div className="color-preview__label">
            {shade}
          </div>
          <div className="color-preview__display" style={{ backgroundColor: tintColor }}></div>
        </div>
      );
    });
  };

  return (
    <main>
      <header>
        <h2>{i18n.t('ui.choose_base_colors')}</h2>
      </header>

      <section>
        <div className="colors-grid">
          {colors.map((color, index) => (
            <div className="colors-grid__item" key={color.name}>
              <div className="color-input">
                <label>{color.label}</label>
                <input
                  type="color"
                  value={colors[index].baseHex}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                />
              </div>

              {generatePreview(colors[index].baseHex)}
            </div>
          ))}
        </div>
      </section>

      <footer>
        <button onClick={onCreate}>
          {i18n.t('ui.create_palette')}
        </button>

        {isDev ? (
          <button onClick={onLogs}>
            {i18n.t('ui.log')}
          </button>
        ) : null}

        <button onClick={onCancel}>{i18n.t('ui.cancel')}</button>
      </footer>
    </main>
  );
}

const rootElement = document.getElementById("root");
const TranslatedApp = withTranslation()(App);

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<TranslatedApp />);
}
