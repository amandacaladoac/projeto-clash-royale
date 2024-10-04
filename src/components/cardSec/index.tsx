"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Combine, Plus } from "lucide-react";

// Definindo a interface para os dados do combo
interface ComboData {
  _id: string[];
  vitorias: number;
  totalBatalhas: number;
  deck: string[];
  porcentagemVitorias: number;
}

export default function CardSec() {
  const [comboData, setComboData] = useState<ComboData[]>([]);

  useEffect(() => {
    const fetchComboData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/combos-dragao-mini-pekka-porcentagem"
        );
        if (!response.ok) {
          throw new Error("Erro na resposta da API");
        }
        const data: ComboData[] = await response.json();
        console.log(data);
        setComboData(data);
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
      }
    };

    fetchComboData();
  }, []);

  if (comboData.length === 0) {
    return <p>Carregando...</p>;
  }

  const firstCombo = comboData[0];

  return (
    <Card className="flex-1">
      <CardHeader className="gap-2">
        <div className="flex items-center justify-center">
          <CardTitle className="tex-lg s:text-xl text-gray-800">
            Combos de Cartas
          </CardTitle>
          <Combine className="ml-auto w-4 h-4" />
        </div>
        <CardDescription>
          Liste o combo de cartas Dragão e Mini P.E.K.K.A de tamanho 2 que
          produziram mais de 2% de vitórias ocorridas em um intervalo de
          timestamps.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <article className="flex items-center gap-4 border-b py-2">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 rounded-none">
              <AvatarImage src="/carta-padrao.png" />
            </Avatar>
            <div>
              <p className="text-sm sm:text-base font-semibold">
                {firstCombo.deck[0]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 rounded-none">
              <AvatarImage src="/carta-padrao.png" />
            </Avatar>
            <div>
              <p className="text-sm sm:text-base font-semibold">
                {firstCombo.deck[1]}
              </p>
            </div>
          </div>
        </article>

        <article className="flex flex-col gap-2 border-b py-2">
          <div className="flex items-center gap-2">
            <div>
              <p className="text-sm sm:text-base font-semibold">
                Vitórias: {firstCombo.vitorias}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div>
              <p className="text-sm sm:text-base font-semibold">
                Total de Batalhas: {firstCombo.totalBatalhas}{" "}
              </p>
            </div>
          </div>
        </article>
      </CardContent>
    </Card>
  );
}
