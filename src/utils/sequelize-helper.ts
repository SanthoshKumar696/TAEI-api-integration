export function buildNullObject(model: any, override: any = {}) {
    const attributes = Object.keys(model.rawAttributes);
    const obj: any = {};

    attributes.forEach(attr => {
        obj[attr] = null;
    });

    return { ...obj, ...override };
}