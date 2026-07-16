export interface StatsDescriptiveRequestDTO {
  dataset: number[];
  sample?: boolean;
}

export interface StatsDescriptiveResponseDTO {
  status: string;
  data: {
    count: number;
    central_tendency: {
      mean: number;
      median: number;
      mode: number[];
    };
    dispersion: {
      variance: number;
      standard_deviation: number;
      range: number;
    };
    position: {
      min: number;
      q1: number;
      q2: number;
      q3: number;
      max: number;
      iqr: number;
    };
    outliers: number[];
    chart_data: {
      histogram: {
        bins: number[];
        frequencies: number[];
      };
    };
  };
}

export interface StatsProbabilityRequestDTO {
  distribution: 'normal' | 't_student' | 'binomial' | 'poisson';
  parameters: {
    mu?: number;
    sigma?: number;
    df?: number;
    loc?: number;
    scale?: number;
    n?: number;
    p?: number;
    lambda?: number;
  };
  query_type: 'exact' | 'cumulative_less' | 'cumulative_greater' | 'between';
  query_value: number | number[];
}

export interface StatsProbabilityResponseDTO {
  status: string;
  distribution: string;
  calculation: {
    type: string;
    probability: number;
  };
  chart_data: {
    curve_points: { x: number; y: number }[];
    shaded_region?: {
      x_min: number;
      x_max: number;
    };
  };
}
