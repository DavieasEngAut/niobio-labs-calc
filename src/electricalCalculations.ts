/**
 * electricalCalculations.ts
 * Módulo para cálculos elétricos de baixa tensão.
 */

// ==========================================
// Definição de Tipos e Constantes
// ==========================================

// Constantes Físicas e Comerciais
const RHO_COPPER = 0.0172; // Resistividade do Cobre (Ω.mm²/m) a 20°C
const MIN_GAUGE_POWER = 1.5; // Bitola mínima de segurança para força (mm²)

// Lista de bitolas comerciais padrão (NBR)
const STANDARD_GAUGES_MM2 = [
  1.5, 2.5, 4.0, 6.0, 10.0, 16.0, 25.0, 35.0, 50.0, 70.0, 95.0,
];

// Interface de Entrada (o que a função recebe)
export interface CalculationInput {
  voltage: number; // Tensão nominal (V) - ex: 127 ou 220
  current: number; // Corrente de projeto (A) - ex: 32
  distance: number; // Distância EM UM SENTIDO (m) - ex: 45
  allowedDropPercentage: number; // Queda máxima permitida (%) - ex: 4 (para 4%)
}

// Interface de Saída (o que a função devolve para a tela)
export interface CalculationResult {
  suggestedGauge: number; // A bitola comercial a ser usada (mm²)
  calculatedMinSection: string; // O valor exato calculado antes de arredondar (para debug)
  actualDropVolts: string; // A queda de tensão real em Volts com a bitola sugerida
  actualDropPercentage: string; // A queda de tensão real em %
  isFeasible: boolean; // Se foi possível encontrar uma bitola na lista padrão
}


// ==========================================
// Função Principal de Cálculo
// ==========================================

export function calculateWireGauge(input: CalculationInput): CalculationResult {
  // Desestruturando os inputs para facilitar a leitura
  const { voltage, current, distance, allowedDropPercentage } = input;

  // --- PASSO 1: Validar inputs básicos para evitar divisão por zero ---
  if (voltage <= 0 || allowedDropPercentage <= 0 || current <= 0 || distance <= 0) {
     // Retorna um resultado zerado/inválido se os dados forem ruins
     return {
         suggestedGauge: 0,
         calculatedMinSection: "0",
         actualDropVolts: "0",
         actualDropPercentage: "0",
         isFeasible: false
     };
  }

  // --- PASSO 2: Calcular a queda de tensão máxima permitida em Volts ---
  // Ex: 4% de 220V = 8.8V
  const maxAllowedDropV = voltage * (allowedDropPercentage / 100);

  // --- PASSO 3: Aplicar a fórmula para achar a seção mínima exata ---
  // Fórmula: S = (2 * ρ * L * I) / ΔV_max
  // O fator '2' considera a ida e volta da corrente.
  let exactSectionNeeded = (2 * RHO_COPPER * distance * current) / maxAllowedDropV;

  // Forçar o mínimo de segurança (norma geralmente pede min 1.5mm² para força)
  if (exactSectionNeeded < MIN_GAUGE_POWER) {
      exactSectionNeeded = MIN_GAUGE_POWER;
  }

  // --- PASSO 4: Encontrar a bitola comercial (Arredondar para cima) ---
  // Procura na lista a primeira bitola que seja maior ou igual à necessária.
  let suggestedGauge = STANDARD_GAUGES_MM2.find(gauge => gauge >= exactSectionNeeded);
  let isFeasible = true;

  // Se não achou (ex: precisava de 120mm²), pega a maior disponível e marca alerta
  if (!suggestedGauge) {
      suggestedGauge = STANDARD_GAUGES_MM2[STANDARD_GAUGES_MM2.length - 1];
      isFeasible = false; // Indica que o cálculo estourou o limite padrão
  }


  // --- PASSO 5: Recalcular a queda REAL com a bitola escolhida ---
  // Agora fazemos o caminho inverso para mostrar ao usuário os dados reais.
  // ΔV_real = (2 * ρ * L * I) / S_comercial
  const actualDropV = (2 * RHO_COPPER * distance * current) / suggestedGauge;
  const actualDropPrc = (actualDropV / voltage) * 100;


  // --- PASSO 6: Retornar o objeto formatado ---
  return {
    suggestedGauge: suggestedGauge,
    // Formatamos para 2 casas decimais e retornamos como string para fácil exibição na UI
    calculatedMinSection: exactSectionNeeded.toFixed(2),
    actualDropVolts: actualDropV.toFixed(2),
    actualDropPercentage: actualDropPrc.toFixed(2),
    isFeasible: isFeasible
  };
}