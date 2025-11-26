import React, { useEffect, useState } from "react";

// Interfaces (copiadas/compatíveis com o backend)
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

const API_URL = "http://127.0.0.1:8000/analise";

// Função que faz o POST com a mensagem fixa (por enquanto)
async function postAnaliseMensagemFixa(): Promise<AnaliseOtimizacao | undefined> {
  const requestBody = {
    texto: `Olá, tudo bem? Me explique detalhadamente o que é um átomo, por favor.`
  };

  try {
    const resp = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status} - ${resp.statusText}`);
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

  // Envia automaticamente ao montar
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      const resultado = await postAnaliseMensagemFixa();
      if (!resultado) {
        setError("Falha ao obter resposta do servidor.");
      } else {
        console.log(resultado)
      }


      setDados(resultado);
      setLoading(false);
    })();
  }, []);

  const handleEnviarNovamente = async () => {
    setLoading(true);
    setError(null);
    const resultado = await postAnaliseMensagemFixa();
    if (!resultado) setError("Falha ao obter resposta do servidor.");
    setDados(resultado);
    setLoading(false);
  };

  return (
    <></>
  );
};

export default App;
