import createAutoLayoutFrame, { AutoLayoutOptions } from "./create-frames";

type CreateEllipsesOptions = {
  colors: string[];
  layoutOptions?: AutoLayoutOptions;
  ellipseSize?: { width: number; height: number };
  ellipseSpacing?: number;
};
  
const createEllipsesGroup = (options: CreateEllipsesOptions): FrameNode => {
  if (options.colors.length !== 7) {
    figma.notify("Veuillez fournir exactement 7 couleurs.");
    return figma.createFrame();
  }

  const group = createAutoLayoutFrame(options.layoutOptions ?? {
    name: "Base colors",
    layoutMode: "HORIZONTAL",
    primaryAxisAlign: "CENTER",
    counterAxisAlign: "CENTER",
    itemSpacing: options.ellipseSpacing ?? 20,
  });

  options.colors.forEach((color, index) => {
    const ellipse = figma.createEllipse();
    const size = options.ellipseSize ?? { width: 100, height: 100 };
    ellipse.resize(size.width, size.height);
    ellipse.fills = [{ type: "SOLID", color: figma.util.rgb(color) }];
    ellipse.x = index * (size.width + (options.ellipseSpacing ?? 20));
    group.appendChild(ellipse);
  });

  return group;
};
  
export default createEllipsesGroup;