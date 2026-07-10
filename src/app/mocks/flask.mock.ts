import { DerivativeResponseDTO } from "../interfaces/Derivation"
import { IntegrationResponseDTO } from "../interfaces/Integration"
import { EquationResponseDTO } from "../interfaces/Equation"

export const EquationResponseMock: EquationResponseDTO = {
  status: "success",
  original_expression: "x^2 + 5x + 6 = 0",
  final_result: [
    "x_1 = -2",
    "x_2 = -3"
  ],
  steps: [
    {
      order: 1,
      description: "Identify coefficients for the quadratic equation",
      math_state: "a = 1, \\quad b = 5, \\quad c = 6"
    },
    {
      order: 2,
      description: "Factor the expression into two binomials: (x + p)(x + q) = 0 where p*q = c and p+q = b",
      math_state: "(x + 2)(x + 3) = 0"
    },
    {
      order: 3,
      description: "Set each factor to zero to find the roots",
      math_state: "x + 2 = 0 \\implies x_1 = -2 \\\\ x + 3 = 0 \\implies x_2 = -3"
    }
  ]
};


export const IntegrationResponseMock:IntegrationResponseDTO = {
    "expression": "5*x**(3*2)*3 + e**3*x",
    "latex": "\\frac{e^{3} x^{2}}{2} + \\frac{15 x^{7}}{7}",
    "result": "e**3*x**2/2 + 15*x**7/7",
    "variable": "x",
    "steps": {
        "integrand": "e^{3} x + 15 x^{6}",
        "rule": "AddRule",
        "substeps": [
            {
                "constant": "e^{3}",
                "integrand": "e^{3} x",
                "other": "x",
                "rule": "ConstantTimesRule",
                "substep": {
                    "base": "x",
                    "exp": "1",
                    "integrand": "x",
                    "rule": "PowerRule",
                    "variable": "x"
                },
                "variable": "x"
            },
            {
                "constant": "15",
                "integrand": "15 x^{6}",
                "other": "x^{6}",
                "rule": "ConstantTimesRule",
                "substep": {
                    "base": "x",
                    "exp": "6",
                    "integrand": "x^{6}",
                    "rule": "PowerRule",
                    "variable": "x"
                },
                "variable": "x"
            }
        ],
        "variable": "x"
    }
}

export const DerivationResponseMock:DerivativeResponseDTO = {
    "derive": "\\frac{d}{dx} (15 x^{6} + x e^{4} + e^{3 x})",
    "rule": "Sum Rule",
    "step_result": "x^{5}",
    "substeps": [
        {
            "derive": "\\frac{d}{dx} (15 x^{6})",
            "description": "f'g + fg' where f=15 & g=x^{6}",
            "rule": "Product Rule",
            "step_result": "90 x^{5}",
            "substeps": [
                {
                    "derive": "\\frac{d}{dx} (15)",
                    "rule": "Constant Rule",
                    "step_result": "0",
                    "substeps": []
                },
                {
                    "derive": "\\frac{d}{dx} (x^{6})",
                    "rule": "Power Rule",
                    "step_result": "6 x^{5}",
                    "substeps": []
                }
            ]
        },
        {
            "derive": "\\frac{d}{dx} (x e^{4})",
            "description": "f'g + fg' where f=x & g=e^{4}",
            "rule": "Product Rule",
            "step_result": "e^{4}",
            "substeps": [
                {
                    "derive": "\\frac{d}{dx} (x)",
                    "rule": "Derivative of the identity variable",
                    "step_result": "1",
                    "substeps": []
                },
                {
                    "derive": "\\frac{d}{dx} (e^{4})",
                    "rule": "Constant Rule",
                    "step_result": "0",
                    "substeps": []
                }
            ]
        },
        {
            "derive": "\\frac{d}{dx} (e^{3 x})",
            "rule": "Derivative of elementary function (exp)",
            "step_result": "3 e^{3 x}",
            "substeps": []
        }
    ]
}