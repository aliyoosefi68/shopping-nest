export function isBoolean(value: any) {
  return ["false", false, "true", true].includes(value);
}

export function toBoolean(value: any) {
  return [true, "true"].includes(value)
    ? true
    : [false, "false"].includes(value)
      ? false
      : value;
}

export const createSlug = (str: string) => {
  return str
    .replace(/[،ًًًٌٍُِ\.\+\-_)(*&^%$#@!~'";:?><«»`ء]+/g, "")
    ?.replace(/[\s]+/g, "-");
};
export const randomId = () => Math.random().toString(36).substring(2);
