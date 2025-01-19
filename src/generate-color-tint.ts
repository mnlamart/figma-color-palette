import chroma from 'chroma-js';

const generateColorTints = (color: string): { [key: number]: string } => {
  const tints: { [key: number]: string } = {};

  const scale = chroma.scale([chroma(color).set('hsl.l', 0.9), color, chroma(color).set('hsl.l', 0.1)])
    .mode('lab')
    .colors(11);

  const tintKeys = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  tintKeys.forEach((value, index) => {
    tints[value] = scale[index];
  });

  return tints;
};

export default generateColorTints;
