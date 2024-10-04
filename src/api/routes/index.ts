// import { Types } from "mongoose";
import express, { Request, Response } from "express";
import Batalha from "../models/Batalha";

const router = express.Router();

// Rota para todos os detalhes das batalhas
router.get("/detalhes-batalhas", async (req: Request, res: Response) => {
  try {
    const batalhasDetalhadas = await Batalha.aggregate([
      {
        $lookup: {
          from: "jogadores",
          localField: "jogador_vencedor_id",
          foreignField: "id",
          as: "jogadorVencedorDetalhes",
        },
      },
      {
        $lookup: {
          from: "jogadores",
          localField: "jogador_perdedor_id",
          foreignField: "id",
          as: "jogadorPerdedorDetalhes",
        },
      },
      {
        $project: {
          _id: 1,
          timestamp: 1,
          jogador_vencedor_id: 1,
          jogador_perdedor_id: 1,
          jogadorVencedorDetalhes: {
            $arrayElemAt: ["$jogadorVencedorDetalhes", 0],
          },
          jogadorPerdedorDetalhes: {
            $arrayElemAt: ["$jogadorPerdedorDetalhes", 0],
          },
          deck_vencedor: 1,
          deck_perdedor: 1,
          vencedor_trofeus: 1,
          perdedor_trofeus: 1,
          duracao_partida_segundos: 1,
          perdedor_torres_destruidas: 1,
          cartas_utilizadas: 1,
          resultado: 1,
        },
      },
    ]);

    res.json(batalhasDetalhadas);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    } else {
      res.status(500).send("Ocorreu um erro ");
    }
  }
});

// Rota para a porcentagem da carta Cavaleiro
router.get("/porcentagem-cavaleiro", async (req: Request, res: Response) => {
  const startDate = "2024-10-01T00:00:00Z";
  const endDate = "2024-10-03T00:00:00Z";

  try {
    const resultados = await Batalha.aggregate([
      {
        $match: {
          timestamp: {
            $gte: startDate,
            $lt: endDate,
          },
          $or: [
            { "cartas_utilizadas.jogador_vencedor": "Cavaleiro" },
            { "cartas_utilizadas.jogador_perdedor": "Cavaleiro" },
          ],
        },
      },
      {
        $project: {
          vitoria: {
            $cond: [
              { $in: ["Cavaleiro", "$cartas_utilizadas.jogador_vencedor"] },
              1,
              0,
            ],
          },
          derrota: {
            $cond: [
              { $in: ["Cavaleiro", "$cartas_utilizadas.jogador_perdedor"] },
              1,
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalVitorias: { $sum: "$vitoria" },
          totalDerrotas: { $sum: "$derrota" },
          totalBatalhas: { $sum: 1 },
        },
      },
      {
        $project: {
          totalBatalhas: 1,
          totalVitorias: 1,
          totalDerrotas: 1,
          porcentagemVitorias: {
            $multiply: [{ $divide: ["$totalVitorias", "$totalBatalhas"] }, 100],
          },
          porcentagemDerrotas: {
            $multiply: [{ $divide: ["$totalDerrotas", "$totalBatalhas"] }, 100],
          },
        },
      },
    ]);

    if (resultados.length > 0) {
      res.json(resultados[0]);
    } else {
      res.json({
        totalBatalhas: 0,
        totalVitorias: 0,
        totalDerrotas: 0,
        porcentagemVitorias: 0,
        porcentagemDerrotas: 0,
      });
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    } else {
      res.status(500).send("Ocorreu um erro ");
    }
  }
});

// Rota para listar decks que têm pelo menos 2 cartas se repetindo e produziram mais de 2% de vitórias
router.get(
  "/decks-com-cartas-repetidas",
  async (req: Request, res: Response) => {
    const startDate = new Date("2024-10-01T00:00:00Z");
    const endDate = new Date("2024-10-03T00:00:00Z");

    try {
      const resultados = await Batalha.aggregate([
        {
          $match: {
            timestamp: {
              $gte: startDate,
              $lt: endDate,
            },
          },
        },
        {
          $group: {
            _id: "$deck_vencedor",
            vitorias: {
              $sum: {
                $cond: [{ $eq: ["$resultado.vencedor", true] }, 1, 0],
              },
            },
            totalBatalhas: { $sum: 1 },
          },
        },
        {
          $project: {
            deck: "$_id",
            vitorias: 1,
            totalBatalhas: 1,
            porcentagemVitorias: {
              $multiply: [{ $divide: ["$vitorias", "$totalBatalhas"] }, 100],
            },
          },
        },
        {
          $match: {
            porcentagemVitorias: { $gt: 2 },
          },
        },
        {
          $addFields: {
            cartasRepetidas: {
              $filter: {
                input: "$deck",
                as: "carta",
                cond: {
                  $gt: [
                    {
                      $size: {
                        $filter: {
                          input: "$deck",
                          as: "cartaInterna",
                          cond: { $eq: ["$$cartaInterna", "$$carta"] },
                        },
                      },
                    },
                    1,
                  ],
                },
              },
            },
          },
        },
        {
          $match: {
            $expr: {
              $gte: [{ $size: "$cartasRepetidas" }, 1],
            },
          },
        },
      ]);

      console.log("Resultados da agregação:", resultados);

      res.json(resultados);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Erro ao obter resultados:", err.message);
        res.status(500).send(err.message);
      } else {
        console.error("Erro desconhecido:", err);
        res.status(500).send("Ocorreu um erro");
      }
    }
  }
);

// Rota para calcular a quantidade de derrotas usando o combo de cartas "Mago" e "Cavaleiro"
router.get(
  "/derrotas-combo-mago-cavaleiro",
  async (req: Request, res: Response) => {
    const startDate = new Date("2024-10-01T00:00:00Z");
    const endDate = new Date("2024-10-03T00:00:00Z");

    try {
      const resultados = await Batalha.aggregate([
        {
          $match: {
            timestamp: {
              $gte: startDate,
              $lt: endDate,
            },
          },
        },
        {
          $match: {
            deck_perdedor: { $all: ["Gigante", "Bárbaro"] },
          },
        },
        {
          $group: {
            _id: null,
            derrotas: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            derrotas: 1,
          },
        },
      ]);

      res.json(resultados.length > 0 ? resultados[0] : { derrotas: 0 });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(err.message);
      } else {
        res.status(500).send("Ocorreu um erro");
      }
    }
  }
);

// Rota para calcular a quantidade de vitórias envolvendo a carta "Esqueleto" onde o vencedor possui 1% menos troféus que o perdedor, a partida durou 120 segundos ou menos, e o perdedor derrubou ao menos 2 torres.
router.get("/vitorias-com-esqueleto", async (req: Request, res: Response) => {
  try {
    const resultados = await Batalha.aggregate([
      {
        $match: {
          deck_vencedor: "Esqueleto",
        },
      },
      {
        $match: {
          $expr: {
            $eq: [
              "$vencedor_trofeus",
              { $multiply: ["$perdedor_trofeus", 0.99] },
            ],
          },
        },
      },
      {
        $match: {
          duracao_partida_segundos: { $lte: 120 },
        },
      },
      {
        $match: {
          perdedor_torres_destruidas: { $gte: 2 },
        },
      },
      {
        $group: {
          _id: null,
          vitorias: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          vitorias: 1,
        },
      },
    ]);

    res.json(resultados.length > 0 ? resultados[0] : { vitorias: 0 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    } else {
      res.status(500).send("Ocorreu um erro");
    }
  }
});

// Rota para listar o combo de cartas "Dragão" e "Mini P.E.K.K.A" de tamanho 2 que produziram mais de 2% de vitórias
router.get(
  "/combos-dragao-mini-pekka-porcentagem",
  async (req: Request, res: Response) => {
    const startDate = new Date("2024-10-01T00:00:00Z");
    const endDate = new Date("2024-10-03T00:00:00Z");

    try {
      const resultados = await Batalha.aggregate([
        {
          $match: {
            timestamp: {
              $gte: startDate,
              $lt: endDate,
            },
          },
        },
        {
          $group: {
            _id: "$deck_vencedor",
            vitorias: {
              $sum: { $cond: [{ $eq: ["$resultado.vencedor", true] }, 1, 0] },
            },
            totalBatalhas: { $sum: 1 },
          },
        },
        {
          $project: {
            deck: "$_id",
            vitorias: 1,
            totalBatalhas: 1,
            porcentagemVitorias: {
              $multiply: [{ $divide: ["$vitorias", "$totalBatalhas"] }, 100],
            },
          },
        },
        {
          $match: {
            porcentagemVitorias: { $gt: 2 },
            deck: { $size: 2, $all: ["Dragão", "Mini P.E.K.K.A"] },
          },
        },
      ]);

      res.json(resultados);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(err.message);
      } else {
        res.status(500).send("Ocorreu um erro");
      }
    }
  }
);

// Rota para listar as cartas mais utilizadas nos decks vencedores
router.get("/cartas-mais-utilizadas", async (req: Request, res: Response) => {
  const startDate = new Date("2024-10-01T00:00:00Z");
  const endDate = new Date("2024-10-03T00:00:00Z");

  try {
    const resultados = await Batalha.aggregate([
      {
        $match: {
          timestamp: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $unwind: "$deck_vencedor",
      },
      {
        $group: {
          _id: "$deck_vencedor",
          total: { $sum: 1 },
        },
      },
      {
        $sort: { total: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.json(resultados);
  } catch (err) {
    console.error("Erro ao obter cartas mais utilizadas:", err);
    res.status(500).send("Erro ao obter cartas mais utilizadas");
  }
});

// Rota para listar vitórias e derrotas por deck
router.get("/vitorias-derrotas", async (req: Request, res: Response) => {
  const startDate = new Date("2024-10-01T00:00:00Z");
  const endDate = new Date("2024-10-03T00:00:00Z");

  try {
    const resultados = await Batalha.aggregate([
      {
        $match: {
          timestamp: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$deck_vencedor",
          vitorias: {
            $sum: { $cond: [{ $eq: ["$resultado.vencedor", true] }, 1, 0] },
          },
          derrotas: {
            $sum: { $cond: [{ $eq: ["$resultado.vencedor", false] }, 1, 0] },
          },
        },
      },
    ]);

    res.json(resultados);
  } catch (err) {
    console.error("Erro ao obter vitórias e derrotas por deck:", err);
    res.status(500).send("Erro ao obter vitórias e derrotas por deck");
  }
});

// Rota para analisar o desempenho de uma carta em diferentes decks
router.get(
  "/desempenho-carta/:nomeCarta",
  async (req: Request, res: Response) => {
    const nomeCarta = req.params.nomeCarta;

    try {
      const resultados = await Batalha.aggregate([
        {
          $match: {
            $or: [{ deck_vencedor: nomeCarta }, { deck_perdedor: nomeCarta }],
          },
        },
        {
          $group: {
            _id: {
              $cond: [
                { $in: [nomeCarta, "$deck_vencedor"] },
                "vencedor",
                "perdedor",
              ],
            },
            total: { $sum: 1 },
            vitórias: {
              $sum: { $cond: [{ $eq: ["$resultado.vencedor", true] }, 1, 0] },
            },
          },
        },
        {
          $project: {
            _id: 1,
            total: 1,
            vitórias: 1,
            taxa_vitoria: {
              $multiply: [{ $divide: ["$vitórias", "$total"] }, 100],
            },
          },
        },
      ]);

      res.json(resultados);
    } catch (err) {
      console.error(`Erro ao obter desempenho da carta ${nomeCarta}:`, err);
      res.status(500).send("Erro ao obter desempenho da carta");
    }
  }
);

export default router;
