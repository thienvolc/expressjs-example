export const selectFieldsFromObject = (object, fields) =>
    Object.fromEntries(fields.map((field) => [field, object[field]]));
