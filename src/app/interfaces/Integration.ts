// src/app/shared/models/integration.dto.ts

/** Request al microservicio */
export interface IntegrationRequestDTO {
    expression: string;
    variable: string; // p.ej. "x"
}

/** Respuesta del microservicio Flask */
export interface IntegrationResponseDTO {
    expression: string; // expresión original (string plano)
    variable: string; // variable de integración
    result: string; // antiderivada en string plano (Sympy str)
    latex: string; // antiderivada en LaTeX (para MathJax)
    steps: StepNode | StepNode[] | []; // raíz del árbol (tu backend puede devolver dict o [])
}

/** Nodo del árbol de pasos devuelto por step_to_dict */
export interface StepNode {
    rule: string; // nombre de la clase/regla en Sympy (p.ej. "PartsRule", "USubstitutionRule", ...)
    integrand: string; // LaTeX del integrando (sin integral)
    variable: string; // "x", "t", etc.

    // Parámetros opcionales que tu step_to_dict puede incluir:
    constant?: string;
    other?: string;
    base?: string;
    exp?: string;

    // Estructura recursiva:
    substep?: StepNode;
    substeps?: StepNode[];
}

/** Árbol normalizado para trabajar siempre con arrays de hijos */
export interface StepNodeNormalized {
    rule: string;
    integrandLatex: string;
    variable: string;
    params: Record<string, string>; // clave → LaTeX (u, v, du, dv, base, exp, constant, other, etc.)
    children: StepNodeNormalized[];
}
