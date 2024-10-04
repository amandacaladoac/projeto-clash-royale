"use client";

import { useEffect, useState } from "react";
import { ChartColumn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer } from "../ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip } from "recharts";

interface Carta {
  _id: string;
  total: number;
}

export default function ChartOverview() {
  const [chartData, setChartData] = useState<Carta[]>([]);

  useEffect(() => {
    const fetchCartas = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/cartas-mais-utilizadas"
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar dados");
        }
        const data: Carta[] = await response.json();
        setChartData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCartas();
  }, []);

  const formattedData = chartData.map((carta) => ({
    nome: carta._id,
    total: carta.total,
  }));

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  return (
    <Card className="w-full md:w-1/2 md:max-2-[600px]">
      <CardHeader>
        <div className="flex items-center justify-center">
          <CardTitle className="text-lg s:text-xl text-gray-800">
            Cartas Mais Utilizadas nos Decks Vencedores
          </CardTitle>
          <ChartColumn className="ml-auto w-4 h-4" />
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart data={formattedData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="nome"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <Tooltip
              formatter={(value: number) => [`Total: ${value}`, "Total"]}
            />
            <Bar dataKey="total" fill="#2563eb" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
