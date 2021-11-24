const subStringUtil = (string = '', displayLength: number): string => {
  if (!string) {
    return '';
  }
  if (string.length <= displayLength) {
    return string;
  }
  return `${string.substr(0, displayLength / 2)}...${string.substr(
    string.length - displayLength / 2,
  )}`;
};

export { subStringUtil };
