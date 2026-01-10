export const RULE_LABELS: Record<string, { title: string; hint?: string }> = {
    PartsRule: {
        title: 'Integration by parts',
        hint: '∫u·dv = u·v − ∫v·du.'
    },
    USubstitutionRule: {
        title: 'Substitution (variable change)',
        hint: 'u = g(x) to simplify.'
    },
    TrigIdentityRule: {
        title: 'Trigonomic identities',
        hint: 'Use trig identities to simplify the integrand.'
    },
    RewriteRule: {
        title: 'Rewriting the integrand',
        hint: 'Rewrite the integrand to a more convenient form.'
    },
    ConstantTimesRule: {
        title: 'Constant factor',
        hint: 'Pull out constant factors from the integral: ∫c·f(x)dx = c∫f(x)dx'
    },
    AddRule: {
        title: 'Sum rule',
        hint: '∫(f(x) + g(x))dx = ∫f(x)dx + ∫g(x)dx'
    },
    PowerRule: {
        title: 'Power rule',
        hint: '∫xⁿ dx = xⁿ⁺¹/(n+1) (n≠−1).'
    },
    DirectRule: {
        title: 'Direct case',
        hint: 'The antiderivative is known immediately.'
    }
    // ...
};
