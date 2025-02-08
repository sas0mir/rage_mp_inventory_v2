export const translateText = (...keys) => {
    let result = get(keys);

    if (!isString(result) && result.formatArgs) {
        result = format(result.text, ...result.formatArgs);
    }

    return isString(result) ? result : `Неизвестный ключ ${keys.join(".")}`;
};