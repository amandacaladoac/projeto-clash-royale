import { Avatar, AvatarImage } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Combine, Plus } from "lucide-react";

export default function CardSec() {
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
          Combos de cartas (carta 1, carta 2, carta n) de tamanho N que
          produziram mais de Y% de vitórias ocorridas em um intervalo de 20
          minutos.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <article className="flex items-center gap-4 border-b py-2">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 rounded-none">
              <AvatarImage src="/carta-padrao.png" />
            </Avatar>
            <div>
              <p className="text-sm sm:text-base font-semibold">Carta 1</p>
            </div>
          </div>

          <Plus className="w-4 h-4" />

          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 rounded-none">
              <AvatarImage src="/carta-padrao.png" />
            </Avatar>
            <div>
              <p className="text-sm sm:text-base font-semibold">Carta 2</p>
            </div>
          </div>
        </article>

        <article className="flex items-center gap-4 border-b py-2">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 rounded-none">
              <AvatarImage src="/carta-padrao.png" />
            </Avatar>
            <div>
              <p className="text-sm sm:text-base font-semibold">Carta 1</p>
            </div>
          </div>

          <Plus className="w-4 h-4" />

          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 rounded-none">
              <AvatarImage src="/carta-padrao.png" />
            </Avatar>
            <div>
              <p className="text-sm sm:text-base font-semibold">Carta 2</p>
            </div>
          </div>
        </article>

        <article className="flex items-center gap-4 border-b py-2">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 rounded-none">
              <AvatarImage src="/carta-padrao.png" />
            </Avatar>
            <div>
              <p className="text-sm sm:text-base font-semibold">Carta 1</p>
            </div>
          </div>

          <Plus className="w-4 h-4" />

          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 rounded-none">
              <AvatarImage src="/carta-padrao.png" />
            </Avatar>
            <div>
              <p className="text-sm sm:text-base font-semibold">Carta 2</p>
            </div>
          </div>
        </article>
      </CardContent>
    </Card>
  );
}
