import createEllipsesGroup from "./create-ellipses";
import createAutoLayoutFrame from "./create-frames";
import generateColorTints from "./generate-color-tint";
import './ui.css';

figma.showUI(__html__, { themeColors: true, width: 700, height: 700 });

figma.ui.onmessage = async (msg: { type: string, colors: { name: string, baseHex: string, label: string }[] }) => {
  if (msg.type === 'cancel') {
    figma.closePlugin();
  }

  if (msg.type === 'log') {
    const selection = figma.currentPage.selection;

    if (selection.length === 0) {
      console.log("Aucun élément sélectionné.");
      return;
    }

    selection.forEach((node) => {
      if ('fills' in node) {
        const fills = (node as SceneNode & { fills: Paint[] }).fills;
        console.log(`Élément: ${node.name}`);
        console.log(fills);
      } else {
        console.log(`L'élément ${node.name} n'a pas de style de remplissage valide.`);
      }
    });
  }

  if (msg.type === 'generate-color-palette') {
    // Create new variable collection.
    const colorCollection = figma.variables.createVariableCollection('Primitives');
    const primitiveModeId = colorCollection.modes[0].modeId

    // Create base colors ellipses
    const baseColors = createEllipsesGroup({
      colors: msg.colors.map(color => color.baseHex),
      layoutOptions: {
        name: "Base colors",
        layoutMode: "HORIZONTAL",
        primaryAxisAlign: "CENTER",
        counterAxisAlign: "CENTER",
        itemSpacing: 30,
      },
      ellipseSize: { width: 120, height: 120 },
      ellipseSpacing: 15,
    });

    const colorFrames: FrameNode[] = [];

    await figma.loadFontAsync({ family: "Inter", style: "Regular" });

    // For each color, generate tints and variables
    msg.colors.forEach((color) => {
      const colorTints = generateColorTints(color.baseHex);

      const tintFrames = Object.entries(colorTints).map(([shade, tintColor]) => {
        const tintRGB = figma.util.rgb(tintColor);

        // Créer une variable pour chaque teinte
        const variableName = `${color.label} / ${shade}`;
        const colorVariable = figma.variables.createVariable(
          variableName,
          colorCollection,
          'COLOR',
        );

        colorVariable.setValueForMode(primitiveModeId, tintRGB)

        const square = figma.createRectangle();
        square.name = variableName;

        // Use variable to fill squares.
        square.fills = [
          {
            "type": "SOLID",
            "visible": true,
            "opacity": 1,
            "blendMode": "NORMAL",
            "color": tintRGB,
            "boundVariables": {
                "color": {
                    "type": "VARIABLE_ALIAS",
                    "id": colorVariable.id,
                }
            }
        }]

        square.resize(100, 100);

        const tintValue = figma.createText();
        tintValue.characters = shade;
        tintValue.textAlignHorizontal = "CENTER";
        tintValue.textAlignVertical = "CENTER";

        return createAutoLayoutFrame({
          name: variableName,
          layoutMode: "VERTICAL",
          primaryAxisAlign: "CENTER",
          counterAxisAlign: "CENTER",
          itemSpacing: 16,
          backgroundColor: { r: 1, g: 1, b: 1 },
          children: [square, tintValue],
          appendToFigma: false,
        });
      });

      const tintGroup = createAutoLayoutFrame({
        name: `${color.label} Tints`,
        layoutMode: "HORIZONTAL",
        primaryAxisAlign: "CENTER",
        counterAxisAlign: "CENTER",
        itemSpacing: 16,
        children: [...tintFrames],
        appendToFigma: false,
      });

      const colorName = figma.createText();
      colorName.characters = color.label;
      colorName.textAlignHorizontal = "CENTER";
      colorName.textAlignVertical = "CENTER";
      colorName.fontSize = 24;

      colorFrames.push(createAutoLayoutFrame({
        name: color.label,
        layoutMode: "VERTICAL",
        primaryAxisAlign: "MIN",
        counterAxisAlign: "MIN",
        paddingPerSide: { paddingTop: 32, paddingRight: 24, paddingBottom: 32, paddingLeft: 24 },
        itemSpacing: 32,
        backgroundColor: { r: 1, g: 1, b: 1 },
        cornerRadius: 12,
        position: { x: 0, y: 0 },
        children: [colorName, tintGroup],
        appendToFigma: false,
      }));
    });

    // Create main frame.
    createAutoLayoutFrame({
      name: "Colors",
      layoutMode: "VERTICAL",
      primaryAxisAlign: "CENTER",
      counterAxisAlign: "CENTER",
      paddingPerSide: { paddingTop: 32, paddingRight: 24, paddingBottom: 32, paddingLeft: 24 },
      itemSpacing: 32,
      backgroundColor: { r: 0.843, g: 0.843, b: 0.843 },
      position: { x: 0, y: 0 },
      children: [baseColors, ...colorFrames],
    });

    figma.closePlugin();
  }
};
