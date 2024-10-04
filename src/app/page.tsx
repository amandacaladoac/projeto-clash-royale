"use client";

import { useEffect, useState } from "react";
import ChartOverview from "@/components/chart";
import CardSec from "@/components/cardSec";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Combine,
  Percent,
  Diamond,
  Trophy,
  ChartNoAxesColumn,
} from "lucide-react";

// Definindo os tipos para os estados
interface CardStats {
  totalVitorias: number;
  totalDerrotas: number;
  porcentagemVitorias: number;
  porcentagemDerrotas: number;
}

interface DeckStats {
  vitorias: number;
  totalBatalhas: number;
  deck: string[];
  cartasRepetidas: string[];
}

interface DerrotasCombo {
  derrotas: number;
}

interface VitoriasEsqueleto {
  vitorias: number;
}

interface VitoriasDerrotas {
  _id: string[];
  vitorias: number;
  derrotas: number;
}

interface DesempenhoCarta {
  _id: string;
  total: number;
  vitórias: number;
}

export default function Home() {
  // Estado para a rota "porcentagem-cavaleiro"
  const [cardStats, setCardStats] = useState<CardStats | null>(null);

  // Estado para a rota "decks-com-cartas-repetidas"
  const [deckStats, setDeckStats] = useState<DeckStats[]>([]);

  // Estado para a rota "derrotas-combo-mago-cavaleiro"
  const [comboDerrotas, setComboDerrotas] = useState<DerrotasCombo | null>(
    null
  );

  // Estado para a rota "vitorias-com-esqueleto"
  const [vitoriasEsqueleto, setVitoriasEsqueleto] =
    useState<VitoriasEsqueleto | null>(null);

  // Estado para a rota "vitorias-derrotas"
  const [vitoriasDerrotas, setVitoriasDerrotas] = useState<VitoriasDerrotas[]>(
    []
  );

  // Estado para busca e desempenho
  const [nomeCarta, setNomeCarta] = useState("");
  const [desempenhoCarta, setDesempenhoCarta] = useState<
    DesempenhoCarta[] | null
  >(null);

  // useEffect para buscar dados da rota "porcentagem-cavaleiro"
  useEffect(() => {
    const fetchCardStats = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/porcentagem-cavaleiro"
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar dados");
        }
        const data: CardStats = await response.json();
        setCardStats(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCardStats();
  }, []);

  // useEffect para buscar dados da rota "decks-com-cartas-repetidas"
  useEffect(() => {
    const fetchDeckStats = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/decks-com-cartas-repetidas"
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar dados");
        }
        const data: DeckStats[] = await response.json();
        // Limitando o número de decks a 5
        setDeckStats(data.slice(0, 5));
      } catch (error) {
        console.error(error);
      }
    };

    fetchDeckStats();
  }, []);

  // useEffect para buscar dados da rota "derrotas-combo-mago-cavaleiro"
  useEffect(() => {
    const fetchComboDerrotas = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/derrotas-combo-mago-cavaleiro"
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar dados");
        }
        const data: DerrotasCombo = await response.json();
        setComboDerrotas(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchComboDerrotas();
  }, []);

  // useEffect para buscar dados da rota "vitorias-com-esqueleto"
  useEffect(() => {
    const fetchVitoriasEsqueleto = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/vitorias-com-esqueleto"
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar dados");
        }
        const data: VitoriasEsqueleto = await response.json();
        setVitoriasEsqueleto(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVitoriasEsqueleto();
  }, []);

  // useEffect para buscar dados da rota "vitorias-derrotas"
  useEffect(() => {
    const fetchVitoriasDerrotas = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/vitorias-derrotas"
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar dados");
        }
        const data: VitoriasDerrotas[] = await response.json();
        setVitoriasDerrotas(data.slice(0, 10));
      } catch (error) {
        console.error(error);
      }
    };

    fetchVitoriasDerrotas();
  }, []);

  const buscarDesempenhoCarta = async (carta: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/desempenho-carta/${carta}`
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar desempenho da carta");
      }
      const data: DesempenhoCarta[] = await response.json();
      setDesempenhoCarta(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNomeCarta(event.target.value);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    buscarDesempenhoCarta(nomeCarta);
  };

  return (
    <main className="sm:ml-14 p-4">
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center">
              <CardTitle className="text-lg ms:xl text-gray800 select-none">
                Vitórias x Derrotas
              </CardTitle>
              <Percent className="ml-auto w-4 h-5" />
            </div>

            <CardDescription>
              Porcentagem de vitórias e derrotas usando a carta Cavaleiro
              ocorridas em um intervalo de timesteps.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {cardStats ? (
              <>
                <p className="text-base sm:text-sm font-bold">{`Vitórias: ${cardStats.totalVitorias}`}</p>
                <p className="text-base sm:text-sm font-bold">{`Derrotas: ${cardStats.totalDerrotas}`}</p>
                <p className="text-base sm:text-sm font-bold">{`Porcentagem de Vitórias: ${cardStats.porcentagemVitorias.toFixed(
                  2
                )} %`}</p>
                <p className="text-base sm:text-sm font-bold">{`Porcentagem de Derrotas: ${cardStats.porcentagemDerrotas.toFixed(
                  2
                )} %`}</p>
              </>
            ) : (
              <p>Carregando...</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center">
              <CardTitle className="text-lg ms:xl text-gray800 select-none">
                Decks
              </CardTitle>
              <Diamond className="ml-auto w-4 h-5" />
            </div>

            <CardDescription>
              Decks que pelo menos 2 cartas se repetem e produziram mais de 2%
              de vitórias em um intervalo de timesteps.
            </CardDescription>
          </CardHeader>

          <div
            className="flex flex-col max-h-24 overflow-hidden overflow-y-scroll scroll-smooth"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#A0AEC0 transparent",
            }}
          >
            {deckStats.map((deck, index) => (
              <CardContent key={index}>
                <p className="text-base sm:text-sm font-bold">{`Vitórias: ${deck.vitorias}`}</p>
                <p className="text-base sm:text-sm font-bold">{`Total de Batalhas: ${deck.totalBatalhas}`}</p>
                <p className="text-base sm:text-sm font-bold">{`Deck: ${deck.deck.join(
                  ", "
                )}`}</p>
              </CardContent>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center ">
              <CardTitle className="text-lg ms:xl text-gray800 select-none">
                Derrotas
              </CardTitle>
              <Combine className="ml-auto w-4 h-5" />
            </div>

            <CardDescription>
              Calcule a quantidade de derrotas utilizando o combo de cartas Mago
              e Cavaleiro ocorridas em um intervalo de timesteps.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {comboDerrotas ? (
              <p className="text-base sm:text-sm font-bold">{`Derrotas: ${comboDerrotas.derrotas}`}</p>
            ) : (
              <p>Carregando...</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center ">
              <CardTitle className="text-lg ms:xl text-gray800 select-none">
                Vitórias
              </CardTitle>
              <Trophy className="ml-auto w-4 h-5" />
            </div>

            <CardDescription>
              Calcule a quantidade de vitórias envolvendo a carta Esqueleto nos
              casos em que o vencedor possui 1% menos troféus do que o perdedor,
              a partida durou menos de 2 minutos, e o perdedor derrubou ao menos
              duas torres do adversário.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {vitoriasEsqueleto ? (
              <p className="text-base sm:text-sm font-bold">{`Vitórias: ${vitoriasEsqueleto.vitorias}`}</p>
            ) : (
              <p>Carregando...</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="mt-4 flex flex-col md:flex-row gap-4">
        <CardSec />
        <ChartOverview />
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center">
              <CardTitle className="text-lg ms:xl text-gray800 select-none">
                Decks
              </CardTitle>
              <Diamond className="ml-auto w-4 h-5" />
            </div>

            <CardDescription>
              Listar Vitórias e Derrotas por Deck
            </CardDescription>
          </CardHeader>

          <div
            className="flex flex-col max-h-40 overflow-hidden overflow-y-scroll scroll-smooth"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#A0AEC0 transparent",
            }}
          >
            {vitoriasDerrotas.length > 0 ? (
              vitoriasDerrotas.map((item, index) => (
                <CardContent key={index}>
                  <p className="text-base sm:text-sm font-bold">{`Deck: ${item._id.join(
                    ", "
                  )}`}</p>
                  <p className="text-base sm:text-sm font-bold">{`Vitórias: ${item.vitorias}`}</p>
                  <p className="text-base sm:text-sm font-bold">{`Derrotas: ${item.derrotas}`}</p>
                </CardContent>
              ))
            ) : (
              <p>Carregando...</p>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center">
              <CardTitle className="text-lg ms:xl text-gray800 select-none">
                Desempenho
              </CardTitle>
              <ChartNoAxesColumn className="ml-auto w-4 h-5" />
            </div>

            <CardDescription>
              Analisar o Desempenho de uma Carta em Diferentes Decks
            </CardDescription>

            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={nomeCarta}
                onChange={handleInputChange}
                className="appearance-none block w-full text-sm bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                placeholder="Pesquisar carta"
              />
              <button type="submit" className="hidden">
                Buscar
              </button>
            </form>
          </CardHeader>

          <div
            className="flex flex-col max-h-40 overflow-hidden overflow-y-scroll scroll-smooth"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#A0AEC0 transparent",
            }}
          >
            <CardContent>
              {desempenhoCarta && desempenhoCarta.length > 0 ? (
                desempenhoCarta.map((carta, index) => (
                  <div key={index} className="mb-2">
                    <p className="text-base sm:text-sm font-bold">{`Resultado: ${carta._id}`}</p>
                    <p className="text-base sm:text-sm font-bold">{`Total: ${carta.total}`}</p>
                    {/* <p className="text-base sm:text-sm font-bold mb-1.5">{`Vitórias: ${carta.vitórias}`}</p> */}
                  </div>
                ))
              ) : (
                <p className="text-base sm:text-sm">
                  Busque o desempenho de uma carta.
                </p>
              )}
            </CardContent>
          </div>
        </Card>
      </section>
    </main>
  );
}
