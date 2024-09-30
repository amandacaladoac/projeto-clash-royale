import ChartOverview from "@/components/chart";
import CardSec from "@/components/cardSec";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Combine, Percent, Diamond, Trophy } from "lucide-react";

export default function Home() {
  return (
    <main className="sm:ml-14 p-4">
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center ">
              <CardTitle className="text-lg ms:xl text-gray800 select-none">
                Vitórias x Derrotas
              </CardTitle>
              <Percent className="ml-auto w-4 h-5" />
            </div>

            <CardDescription>
              Porcentagem de vitórias e derrotas usando X carta ocorridas em um
              intervalo de 10 minutos.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-base sm:text-lg font-bold">Lorem ipsum</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center ">
              <CardTitle className="text-lg ms:xl text-gray800 select-none">
                Decks
              </CardTitle>
              <Diamond className="ml-auto w-4 h-5" />
            </div>

            <CardDescription>
              Decks que produziram mais de 20% de vitórias em um intervalo de 10
              minutos.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-base sm:text-lg font-bold">Lorem ipsum</p>
          </CardContent>
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
              Quantidade de derrotas utilizando o combo de cartas X1 X2
              ocorridas em um intervalo de 10 minutos.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-base sm:text-lg font-bold">Lorem ipsum</p>
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
              Quantidade de vitórias envolvendo a carta X nos casos em que o
              vencedor possui Z% menos troféus do que o perdedor, a partida
              durou menos de 2 minutos, e o perdedor derrubou ao menos duas
              torres do adversário.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-base sm:text-lg font-bold">Lorem ipsum</p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-4 flex flex-col md:flex-row gap-4">
        <ChartOverview />
        <CardSec />
      </section>
    </main>
  );
}
