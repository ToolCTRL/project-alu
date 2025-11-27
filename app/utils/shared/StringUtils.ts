const toCamelCase = (value: string) => {
  return value
    .replaceAll(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replaceAll(/\s+/g, "")
    .replaceAll(/[^a-z0-9]/gi, "");
};
const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default {
  toCamelCase,
  capitalize,
};
