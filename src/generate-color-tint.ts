import chroma from 'chroma-js';

const generateColorTints = (color: string, tintKeys: number[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]): { [key: number]: string } => {
  const tints: { [key: number]: string } = {};

  // https://gka.github.io/chroma.js/#scale-colors
  const scale = chroma.scale([chroma(color).set('hsl.l', 1), color, chroma(color).set('hsl.l', 0)])
    .domain([0, 500, 1000])
    .mode('lab')

    tintKeys.forEach(value => {
      tints[value] = scale(value).hex();
    });

  return tints;
};

export default generateColorTints;
