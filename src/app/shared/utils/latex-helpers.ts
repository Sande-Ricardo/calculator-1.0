export function latexIntegral(integrandLatex: string, variable: string): string {
    return `\\( \\int ${integrandLatex}\\, d${variable} \\)`;
}

export function latexKeyValue(key: string, valLatex: string): string {
    // imprime tipo u = ..., dv = ..., etc.
    return `\\( ${key} = ${valLatex} \\)`;
}
