import mongoose, { Document, Schema } from "mongoose";

// Interface TypeScript para o documento de Jogador
export interface IJogador extends Document {
  id: number;
  nome: string;
  nivel: number;
  tropas: string[];
  vitoria: number;
  derrota: number;
  trofeus: number;
}

// Schema do jogador no Mongoose
const JogadorSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  nome: { type: String, required: true },
  nivel: { type: Number, required: true },
  tropas: { type: [String], required: true },
  vitoria: { type: Number, required: true },
  derrota: { type: Number, required: true },
  trofeus: { type: Number, required: true },
});

export default mongoose.model<IJogador>("Jogador", JogadorSchema);
