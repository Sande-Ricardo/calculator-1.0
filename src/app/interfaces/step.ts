export interface Step {
    rule: string;
    integrand: string;
    constant?: string;
    base?: string;
    exp?: string;
    substeps?: Step[];
}
