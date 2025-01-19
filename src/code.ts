import createEllipsesGroup from "./create-ellipses";
import createAutoLayoutFrame from "./create-frames";
import generateColorTints from "./generate-color-tint";
import hexToRGB from "./hex-to-rgb";
import './ui.css';

figma.showUI(__html__, { themeColors: true, width: 700, height: 700 });

figma.ui.onmessage = async (msg: { type: string, colors: { name: string, baseHex: string, label: string }[] }) => {
  console.log(msg.colors);

  if (msg.type === 'create-shapes') {
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

    console.log('msg.colors', msg.colors);

    const colorFrames: FrameNode[] = [];

    await figma.loadFontAsync({ family: "Inter", style: "Regular" });

    // For each colors generate tints.
    msg.colors.forEach((color) => {
      const colorTints = generateColorTints(color.baseHex);

      const tintFrames = Object.entries(colorTints).map(([shade, tintColor]) => {
        const square = figma.createRectangle();
        square.fills = [{ type: 'SOLID', color: hexToRGB(tintColor) }];
        square.resize(100, 100);

        const tintValue = figma.createText();
        tintValue.characters = shade;
        tintValue.textAlignHorizontal = "CENTER";
        tintValue.textAlignVertical = "CENTER";

        return createAutoLayoutFrame({
          name: `${color.name} / ${shade}`,
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
        name: `${color.name} Tints`,
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
      colorName.fills = [{
        type: 'SOLID',
        color: { r: 0.506, g: 0.506, b: 0.506 } // Couleur #818181
      }];

      colorFrames.push(createAutoLayoutFrame({
        name: color.label,
        layoutMode: "VERTICAL",  // Changer en VERTICAL pour inclure le texte et les teintes dans un sens vertical
        primaryAxisAlign: "MIN",
        counterAxisAlign: "MIN",
        paddingPerSide: { paddingTop: 32, paddingRight: 24, paddingBottom: 32, paddingLeft: 24 },
        itemSpacing: 32,
        backgroundColor: { r: 1, g: 1, b: 1 },
        cornerRadius: 12, // Border-radius de 12
        position: { x: 0, y: 0 },
        children: [colorName, tintGroup], // Ajouter le texte du nom de la couleur et le groupe des teintes
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
  }

  figma.closePlugin();
};
