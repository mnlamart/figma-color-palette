export type AutoLayoutOptions = {
    name?: string;
    layoutMode?: "HORIZONTAL" | "VERTICAL";
    primaryAxisAlign?: FrameNode["primaryAxisAlignItems"];
    counterAxisAlign?: FrameNode["counterAxisAlignItems"];
    primaryAxisSizing?: FrameNode["primaryAxisSizingMode"];
    counterAxisSizing?: FrameNode["counterAxisSizingMode"];
    padding?: number;
    paddingPerSide?: Partial<Pick<FrameNode, "paddingTop" | "paddingRight" | "paddingBottom" | "paddingLeft">>; // Padding par côté
    itemSpacing?: FrameNode["itemSpacing"];
    width?: number;
    height?: number;
    position?: { x: number; y: number };
    backgroundColor?: RGB;
    cornerRadius?: number;
    children?: SceneNode[];
};

const createAutoLayoutFrame = (options: AutoLayoutOptions & { appendToFigma?: boolean }): FrameNode => {
    const frame = figma.createFrame();
  
    frame.name = options.name ?? "Auto Layout Frame";
  
    frame.layoutMode = options.layoutMode ?? "VERTICAL";
    frame.primaryAxisAlignItems = options.primaryAxisAlign ?? "MIN";
    frame.counterAxisAlignItems = options.counterAxisAlign ?? "CENTER";
    frame.primaryAxisSizingMode = options.primaryAxisSizing ?? "AUTO";
    frame.counterAxisSizingMode = options.counterAxisSizing ?? "AUTO";
    frame.itemSpacing = options.itemSpacing ?? 0;

    if (options.padding !== undefined) {
      frame.paddingTop = frame.paddingRight = frame.paddingBottom = frame.paddingLeft = options.padding;
    } else if (options.paddingPerSide) {
      Object.assign(frame, options.paddingPerSide);
    }
  
    if (options.primaryAxisSizing === "FIXED" && options.height) frame.resize(frame.width, options.height);
    if (options.counterAxisSizing === "FIXED" && options.width) frame.resize(options.width, frame.height);
  
    if (options.position) {
      frame.x = options.position.x;
      frame.y = options.position.y;
    }

    if (options.backgroundColor) {
        frame.fills = [{ type: "SOLID", color: options.backgroundColor }];
    } else {
        frame.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 0 }];
    }

    if (options.cornerRadius !== undefined) {
      frame.cornerRadius = options.cornerRadius;
    }
  
    if (options.children) {
      options.children.forEach((child) => frame.appendChild(child));
    }
  
    if (options.appendToFigma !== false) {
      figma.currentPage.appendChild(frame);
    }
  
    return frame;
};

export default createAutoLayoutFrame;