// 1. Interface para a seção de detalhes de consumo (antes, depois, economia)
export interface ConsumoDetalhe {
    agua_ml: number;
    energia_wh: number;
}

// 2. Interface para agrupar os detalhes de consumo
export interface Consumo {
    antes: ConsumoDetalhe;
    depois: ConsumoDetalhe;
    economia: ConsumoDetalhe;
}

// 3. Interface principal que representa o payload completo da resposta
export interface AnaliseSustentabilidade {
    prompt_original: string;
    prompt_otimizado: string;
    partes_desnecessarias: string[]; // Um array de strings
    consumo: Consumo;
}

/*
Exemplo de uso:
const resultado: AnaliseSustentabilidade = { ... Seu JSON aqui ... };

// Acesso tipado:
console.log(resultado.consumo.economia.agua_ml);
*/