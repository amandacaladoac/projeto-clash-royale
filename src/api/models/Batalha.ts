import mongoose, { Document, Schema } from "mongoose";

interface ICartasUtilizadas {
  jogador_vencedor: string[];
  jogador_perdedor: string[];
}

export interface IBatalha extends Document {
  _id: string;
  timestamp: Date;
  jogador_vencedor_id: number;
  jogador_perdedor_id: number;
  deck_vencedor: string[];
  deck_perdedor: string[];
  vencedor_trofeus: number;
  perdedor_trofeus: number;
  duracao_partida_segundos: number;
  perdedor_torres_destruidas: number;
  cartas_utilizadas: ICartasUtilizadas;
  jogador_vencedor: string[];
  jogador_perdedor: string[];
  resultado: {
    vencedor: boolean;
    perdedor: boolean;
  };
}

const BatalhaSchema: Schema = new Schema({
  _id: { type: String, required: true },
  timestamp: { type: Date, required: true },
  jogador_vencedor_id: { type: Number, required: true },
  jogador_perdedor_id: { type: Number, required: true },
  deck_vencedor: { type: [String], required: true },
  deck_perdedor: { type: [String], required: true },
  vencedor_trofeus: { type: Number, required: true },
  perdedor_trofeus: { type: Number, required: true },
  duracao_partida_segundos: { type: Number, required: true },
  perdedor_torres_destruidas: { type: Number, required: true },
  cartas_utilizadas: {
    jogador_vencedor: { type: [String], required: true },
    jogador_perdedor: { type: [String], required: true },
  },
  jogador_vencedor: { type: [String], required: false },
  jogador_perdedor: { type: [String], required: false },
  resultado: {
    vencedor: { type: Boolean, required: true },
    perdedor: { type: Boolean, required: true },
  },
});

export default mongoose.model<IBatalha>("Batalha", BatalhaSchema);
