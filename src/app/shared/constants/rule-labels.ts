export const RULE_LABELS: Record<string, { title: string; hint?: string }> = {
    PartsRule: {
        title: 'Integración por partes',
        hint: 'Se usa ∫u·dv = u·v − ∫v·du.'
    },
    USubstitutionRule: {
        title: 'Sustitución (cambio de variable)',
        hint: 'Se realiza u = g(x) para simplificar la integral.'
    },
    TrigIdentityRule: {
        title: 'Identidad trigonométrica',
        hint: 'Se reescribe usando identidades para facilitar la integración.'
    },
    RewriteRule: {
        title: 'Reescritura',
        hint: 'Se transforma el integrando a una forma integrable.'
    },
    ConstantTimesRule: {
        title: 'Constante por fuera',
        hint: 'Se extrae un factor constante: ∫c·f(x)dx = c∫f(x)dx.'
    },
    AddRule: {
        title: 'Linealidad (suma/resta)',
        hint: 'Se integra término a término.'
    },
    PowerRule: {
        title: 'Regla de la potencia',
        hint: '∫xⁿ dx = xⁿ⁺¹/(n+1) (n≠−1).'
    },
    DirectRule: {
        title: 'Caso directo',
        hint: 'La antiderivada es conocida de forma inmediata.'
    }
    // ...
};
