export interface DerivativeRequestDTO {
    expression: string;
    variable: string; // p.ej. "x"
}

export interface DerivativeResponseDTO {
    derive:string;
    rule:string;
    step_result:string;
    substeps:SubstepsNode[];
}

export interface SubstepsNode {
    derive:string;
    rule:string;
    description?:string;
    step_result:string;
    substeps: SubstepsNode[] | [];
}