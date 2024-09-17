// src/utils/colorUtils.js
const colorPalette = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#66FF66', '#FF6666', '#66B2FF', '#FFB266'
  ];
  
  export const getTypeColors = (types) => {
    const typeColors = {};
    types.forEach((type, index) => {
      typeColors[type] = colorPalette[index % colorPalette.length];
    });
    return typeColors;
  };
  