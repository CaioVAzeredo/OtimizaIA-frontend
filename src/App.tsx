import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface ConsumoDetalhe {
  agua_ml: number;
  energia_wh: number;
}

interface Consumo {
  antes: ConsumoDetalhe;
  depois: ConsumoDetalhe;
  economia: ConsumoDetalhe;
}

interface AnaliseOtimizacao {
  prompt_original: string;
  prompt_otimizado: string;
  partes_desnecessarias: string[];
  consumo: Consumo;
}

// NOTE: A API_URL deve ser a do seu backend FastAPI, ajustada para o ambiente
const API_URL = "http://127.0.0.1:8000/analise";

async function postAnaliseMensagemFixa(prompt: string): Promise<AnaliseOtimizacao | undefined> {
  const requestBody = {
    texto: `${prompt}`
  };

  try {
    // Implementação básica de backoff para retentar em caso de falha de rede/servidor
    let resp;
    const maxRetries = 3;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      resp = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (resp.ok) {
        break;
      }

      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // Atraso: 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    if (!resp || !resp.ok) {
      throw new Error(`HTTP ${resp?.status || 'Unknown'} - ${resp?.statusText || 'Server Error'}`);
    }

    const dados = (await resp.json()) as AnaliseOtimizacao;
    return dados;
  } catch (err) {
    console.error("Erro ao chamar API:", err);
    return undefined;
  }
}

const App: React.FC = () => {
  const [dados, setDados] = useState<AnaliseOtimizacao | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('Olá, tudo bem? Poderia me explicar detalhadamente o que é um átomo, por favor?'); // Exemplo inicial

  useEffect(() => {
    // Inicialização ou lógica de carregamento se necessário
  }, []);

  const analisarImpacto = async () => {
    if (prompt.trim() === '') {
      // Usando um modal/div customizado no lugar de alert()
      setError('Por favor, insira um prompt para análise.');
      return;
    }
    setLoading(true);
    setError(null);
    const resultado = await postAnaliseMensagemFixa(prompt);
    if (!resultado) {
      setError("Falha ao obter resposta do servidor. Verifique o console ou o status do backend.");
    } else if (resultado.partes_desnecessarias && resultado.partes_desnecessarias.length > 0) {
      // Ordena o array de partes desnecessárias para garantir que a renderização fique próxima da original
      const originalParts = resultado.partes_desnecessarias.map(p => p.trim());
      resultado.partes_desnecessarias = originalParts;
    }

    setDados(resultado);
    setLoading(false);
  }

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  }

  return (
    <Principal>
      <Titulo>Analisador de Sustentabilidade Digital 💧⚡</Titulo>
      <Paragrafo>
        Entenda e reduza o impacto ambiental dos seus prompts de IA. Cole seu texto abaixo para começar.
      </Paragrafo>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <TextArea
        placeholder="Cole seu prompt de IA aqui..."
        value={prompt}
        onChange={handlePromptChange}
        rows={6}
      />

      <ButtonComponent onClick={analisarImpacto} disabled={loading}>
        🔍 {loading ? 'Analisando impacto...' : 'Analisar impacto'}
      </ButtonComponent>


      {dados && (
        <ResultadosContainer>

          <Subtituloh3>Seu prompt otimizado</Subtituloh3>

          <OptimizedPromptBox hasRedundantParts={dados.partes_desnecessarias.length > 0}>
            <PromptTextoOtimizado>
              {/* Renderiza as partes desnecessárias com estilo vermelho e riscado */}
              {dados.partes_desnecessarias.length > 0 && (
                <ParteRemovida>
                  {dados.partes_desnecessarias.join(' ')}{' '}
                </ParteRemovida>
              )}
              {/* Renderiza o prompt otimizado */}
              {dados.prompt_otimizado}
            </PromptTextoOtimizado>
          </OptimizedPromptBox>

          <CardsContainer>

            {/* Água Gasta Antes */}
            <Card>
              <CardIcon color="#4BA3FF">💧</CardIcon>
              <CardTitulo color="#0D47A1">Água Gasta</CardTitulo>
              <CardValor>{dados.consumo.antes.agua_ml} ml</CardValor>
              <CardDesc>Antes da otimização</CardDesc>
            </Card>

            {/* Energia Gasta Antes */}
            <Card>
              <CardIcon color="#FFA726">⚡</CardIcon>
              <CardTitulo color="#E65100">Energia Gasta</CardTitulo>
              <CardValor>{dados.consumo.antes.energia_wh} Wh</CardValor>
              <CardDesc>Antes da otimização</CardDesc>
            </Card>

            {/* Após Otimização */}
            <Card>
              <CardIcon color="#26A845">✅</CardIcon>
              <CardTitulo color="#1B5E20">Após Otimização</CardTitulo>
              <CardValor>
                {dados.consumo.depois.agua_ml} ml | {dados.consumo.depois.energia_wh} Wh
              </CardValor>
              <CardDesc>Consumo otimizado</CardDesc>
            </Card>

            {/* Economia Total */}
            <Card>
              <CardIcon color="#1565C0">⬇️</CardIcon>
              <CardTitulo color="#1565C0">Economia Total</CardTitulo>
              <CardValor>
                {dados.consumo.economia.agua_ml} ml | {dados.consumo.economia.energia_wh} Wh
              </CardValor>
              <CardDesc>De recursos economizados</CardDesc>
            </Card>

          </CardsContainer>
        </ResultadosContainer>
      )}
    </Principal>
  );
};

// =================================
//         STYLED COMPONENTS
// =================================

const Principal = styled.main`
  background-color: #ffffff; /* Fundo branco para o container principal */
  border-radius: 12px; /* Aumentar o border-radius */
  padding: 40px; /* Padronizar padding */
  margin: 100px auto; /* Centralizar horizontalmente e adicionar margem superior/inferior */
  max-width: 900px; /* Definir uma largura máxima para o conteúdo */
  width: 90%; /* Tornar responsivo */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Sombra mais suave */
  font-family: 'Inter', sans-serif; /* Use uma fonte moderna */
`;

const Titulo = styled.h1`
  text-align: center;
  font-size: 32px; /* Ajustar tamanho */
  font-weight: 800; /* Mais negrito */
  margin-bottom: 5px;
  color: #1a1a1a;
`;

const Paragrafo = styled.p`
  text-align: center;
  font-size: 16px;
  color: #555;
  margin-bottom: 30px;
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #ef4444;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  text-align: center;
  font-weight: 500;
`;

const TextArea = styled.textarea`
  width: 100%; 
  height: 150px;
  display: block;
  margin: 0 auto;
  padding: 15px; 
  border: 1px solid #ddd; 
  border-radius: 8px;
  box-sizing: border-box; 
  resize: vertical; 
  font-size: 16px;
  color: #333;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.05); 
`;

const ButtonComponent = styled.button`
  background-color: #3886ff;
  border-radius: 8px; 
  border: none;
  color: #fff;
  font-weight: 600;
  padding: 12px 25px; 
  display: block;
  margin: 0 auto;
  margin-top: 25px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(56, 134, 255, 0.2); 
  
  transition: all 0.2s ease; 

  &:hover {
    background-color: #2f74e0; 
    box-shadow: 0 6px 8px rgba(56, 134, 255, 0.3);
  }

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const ResultadosContainer = styled.div`
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee; 
`;

// NOVO COMPONENTE DE ESTILO DINÂMICO
const OptimizedPromptBox = styled.div<{ hasRedundantParts: boolean }>`
  /* Cores baseadas na condição */
  background-color: ${(props) => (props.hasRedundantParts ? '#fffafa' : '#e6f7ff')}; 
  border-color: ${(props) => (props.hasRedundantParts ? '#f9e2e5' : '#b3d9ff')}; 
  
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin: 0;
  width: 100%;
  border-width: 1px;
  border-style: solid;
`;

const PromptTextoOtimizado = styled.p`
  margin: 0;
  white-space: pre-wrap;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
`;

const ParteRemovida = styled.span`
  color: #d9534f; /* Vermelho/Rosa forte para destaque */
  text-decoration: line-through; 
  margin-right: 5px;
`;

const CardsContainer = styled.div`
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(4, 1fr); 
  gap: 20px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px; 
  text-align: left; 
  box-shadow: 0 1px 4px rgba(0,0,0,0.08); 
  border: 1px solid #eee;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px); 
  }
`;

const Subtituloh3 = styled.h3`
  width: 100%;
  display: block;
  margin: 0;
  margin-top: 30px;
  margin-bottom: 15px;
  font-weight: 600;
  font-size: 24px; 
  text-align: left;
  color: #1a1a1a;
`;

const CardIcon = styled.div<{ color: string }>`
  font-size: 24px; 
  color: ${(props) => props.color};
  margin-bottom: 5px; 
`;

const CardTitulo = styled.h3<{ color?: string }>`
  font-size: 16px;
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 5px;
  color: ${(props) => props.color || '#333'}; 
`;

const CardValor = styled.h2`
  font-size: 22px; 
  font-weight: 700;
  margin-bottom: 5px;
  color: #1a1a1a;
`;

const CardDesc = styled.p`
  font-size: 14px;
  color: #888; 
  margin: 0;
`;
export default App;