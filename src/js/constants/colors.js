import _ from 'lodash';

/**
 * Add your own color schemes here as nested arrays of hex color values.
 *
 * We recommend you replicate the structure of categorical, sequential and
 * diverging schemes, as used at http://colorbrewer2.org.
 *
 * If you want to change that structure, the reducer for setting the scheme
 * (SET_COLOR_SCHEME) is written to expect an array at categorical.default.
 * You'll also need to rewrite parseSchemes in the ColorScheme component to
 * match your custom structure.
 *
 * The ColorPicker component is styled to fit an array of 8 colors.
 *
 */
const defaultColorScheme = {
  categorical: {
    default: [
      '#329CEB',
      '#E34E36',
      '#FF8F24',
      '#FEC44F',
      '#52B033',
      '#8554BF',
      '#6DCCF2',
      '#C9C9C9',
    ],
  },
  sequential: {
    red: [
      '#f5c8c1',
      '#eea89e',
      '#e8887a',
      '#e26856',
      '#dc4730',
      '#c13621',
      '#9d2c1b',
      '#700f00',
    ],
    blue: [
      '#cfebff',
      '#a5dbff',
      '#7bc2f2',
      '#5cb5f2',
      '#359fe6',
      '#2487c9',
      '#0267ab',
      '#004a7a',
    ],
    green: [
      '#d9ebc3',
      '#bde388',
      '#a2cf63',
      '#7bc049',
      '#65a835',
      '#4e941b',
      '#327303',
      '#245400',
    ],
    warm: [
      '#ffe261',
      '#ffc226',
      '#ffa310',
      '#f57f00',
      '#e35000',
      '#cc3300',
      '#a31600',
      '#700f00',
    ],
    cool: [
      '#d4f2cb',
      '#ace6b1',
      '#8bd9b9',
      '#5ac9c1',
      '#2cb9c7',
      '#0c94c2',
      '#0275c2',
      '#004a7a',
    ],
  },
  diverging: {
    redBlue: [
      '#0078d1',
      '#299aee',
      '#5ab5fa',
      '#99d3ff',
      '#f7a699',
      '#f57864',
      '#e34e36',
      '#c42c14',
    ],
    redBlueMix: [
      '#0064c2',
      '#2985f2',
      '#7e94f7',
      '#aea4fc',
      '#d99ee8',
      '#de7cbf',
      '#ce5269',
      '#ba230b',
    ],
    redGreen: [
      '#c12e17',
      '#ea652b',
      '#fc9943',
      '#fcc857',
      '#bee16d',
      '#99cf51',
      '#6ebe34',
      '#539f1e',
    ],
    orangePurple: [
      '#b35806',
      '#e08214',
      '#fdb863',
      '#fee0b6',
      '#d8daeb',
      '#b2abd2',
      '#8073ac',
      '#542788',
    ],
  },
};

/*
Color schemes can be supplied in config object, but must have the minimum
properties: a default categorical, diverging and sequential schemes.
*/
const categoricalTest = _.hasIn(window.chartwerkConfig, 'color_schemes.categorical.default');
const divergingTest = _.hasIn(window.chartwerkConfig, 'color_schemes.diverging');
const sequentialTest = _.hasIn(window.chartwerkConfig, 'color_schemes.sequential');
const requiredSchemes = categoricalTest && divergingTest && sequentialTest;

export default requiredSchemes ? window.chartwerkConfig.color_schemes : defaultColorScheme;

export const black = '#2d3035'; // Used as default color for annotation text
export const white = '#ffffff';
