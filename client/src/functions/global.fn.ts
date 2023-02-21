// function that convert hex to rgb
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const rgbToRgba = (rgb: { r: number; g: number; b: number }, opacity: number) => {
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
};

export const hexToRgba = (hex: string, opacity: number) => {
  return rgbToRgba(hexToRgb(hex), opacity);
};

export const checkDigit = (value: string) => /\d/.test(value);
export const checkLength = (value: string) => (value.length >= 8 && value.length <= 20 ? true : false);
export const checkLower = (value: string) => /[a-z]/.test(value);
export const checkUpper = (value: string) => /[A-Z]/.test(value);
export const checkSpecials = (value: string) => /[!@#$%^()&*_]/.test(value);
export const checkEmail = (value: string) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);

export const capitalize = (value: string) => {
  if (typeof value !== "string") return "";
  return value[0].toUpperCase() + value.slice(1);
};
