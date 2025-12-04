// src/app/shared/utils/steps-normalizer.ts
import { StepNode, StepNodeNormalized } from '../../interfaces/Integration';

export function normalizeSteps(
    steps: StepNode | StepNode[] | []
): StepNodeNormalized[] {
    if (Array.isArray(steps)) {
        return steps.map((n) => normalizeNode(n));
    }
    if (steps && typeof steps === 'object') {
        return [normalizeNode(steps)];
    }
    return [];
}

function normalizeNode(node: StepNode): StepNodeNormalized {
    const params: Record<string, string> = {};

    // Toma todos los posibles campos paramétricos que tu backend exponga
    for (const k of ['constant', 'other', 'base', 'exp']) {
        const v = (node as any)[k];
        if (typeof v === 'string') params[k] = v;
    }

    // Si en el futuro agregas u, v, du, dv, u_var, u_func, etc. al backend,
    // bastará con añadir sus claves aquí para que se muestren.
    for (const k of [
        'u',
        'v',
        'du',
        'dv',
        'u_var',
        'u_func',
        'old',
        'new',
        'coeff',
    ]) {
        const v = (node as any)[k];
        if (typeof v === 'string') params[k] = v;
    }

    const children: StepNodeNormalized[] = [];
    if (node.substep) children.push(normalizeNode(node.substep));
    if (node.substeps?.length) children.push(...node.substeps.map(normalizeNode));

    return {
        rule: node.rule,
        integrandLatex: node.integrand,
        variable: node.variable,
        params,
        children,
    };
}
