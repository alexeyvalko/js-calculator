const autoScaleText = (parentWidth, childWidth, actualFontSize) => {
  const pW = parseInt(parentWidth, 10);
  const chW = parseInt(childWidth, 10);
  const percentage = 100 / (pW / chW);
  if (Math.round(percentage) >= 70 && actualFontSize > 16) {
    return actualFontSize - 2;
  }
  return actualFontSize;
};

export default autoScaleText;
