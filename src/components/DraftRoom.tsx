import React, { useState } from 'react';
import { Formation, Posture, TournamentCard } from '../models/types';

interface DraftRoomProps {
  initialCards: TournamentCard[];
  onReady: (team: any) => void; // Função que avisa o servidor que o jogador terminou
}

export default function DraftRoom({ initialCards, onReady }: DraftRoomProps) {
  const [formation, setFormation] = useState<Formation>('2-2');
  const [posture, setPosture] = useState<Posture>('BALANCED');
  const [cards, setCards] = useState<TournamentCard[]>(initialCards);
  const [usedRerolls, setUsedRerolls] = useState(0);

  // Exemplo de cálculo visual para o jogador ver as médias mudando ao vivo
  const averageOverall = cards.reduce((acc, c) => acc + c.overall, 0) / 5;

  const handleRerollTeam = () => {
    if (usedRerolls < 3) {
      // Aqui você chamaria o backend para buscar 5 novas cartas
      console.log("Buscando nova equipe..."); 
      setUsedRerolls(prev => prev + 1);
    }
  };

  const handleRerollTournament = () => {
    if (usedRerolls < 3) {
      // Aqui você chamaria o backend para mudar a versão das cartas atuais
      console.log("Mudando versões do torneio...");
      setUsedRerolls(prev => prev + 1);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen font-sans">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">Monte sua Equipa 5v5</h1>
      
      {/* Painel Tático */}
      <div className="grid grid-cols-2 gap-4 mb-8 bg-gray-800 p-4 rounded-lg">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Formação Tática</label>
          <select 
            className="w-full p-2 bg-gray-700 rounded text-white"
            value={formation} 
            onChange={(e) => setFormation(e.target.value as Formation)}
          >
            <option value="2-2">2-2 (Quadrado)</option>
            <option value="1-2-1">1-2-1 (Losango)</option>
            <option value="3-1">3-1 (Retranca)</option>
            <option value="2-1-1">2-1-1 (Pressão)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Postura de Jogo</label>
          <select 
            className="w-full p-2 bg-gray-700 rounded text-white"
            value={posture} 
            onChange={(e) => setPosture(e.target.value as Posture)}
          >
            <option value="DEFENSIVE">Defensiva (-Atk / +Def)</option>
            <option value="BALANCED">Equilibrada</option>
            <option value="POSITIVE">Positiva (+Atk / -Def)</option>
          </select>
        </div>
      </div>

      {/* Exibição das Cartas */}
      <div className="flex justify-between mb-8 gap-2">
        {cards.map((card, index) => (
          <div key={index} className="bg-gray-800 border-2 border-yellow-500 p-4 rounded text-center flex-1">
            <span className="block text-xl font-bold text-yellow-400">{card.position}</span>
            <span className="block font-semibold mt-2">{card.overall} OVR</span>
          </div>
        ))}
      </div>

      {/* Controles de Re-roll e Confirmação */}
      <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg">
        <div>
          <p className="text-sm text-gray-400 mb-2">Mudanças Restantes: {3 - usedRerolls}</p>
          <div className="flex gap-2">
            <button 
              onClick={handleRerollTeam} 
              disabled={usedRerolls >= 3}
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded disabled:opacity-50"
            >
              Mudar Equipa
            </button>
            <button 
              onClick={handleRerollTournament} 
              disabled={usedRerolls >= 3}
              className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded disabled:opacity-50"
            >
              Mudar Torneio
            </button>
          </div>
        </div>
        
        <button 
          onClick={() => onReady({ formation, posture, cards })}
          className="bg-green-600 hover:bg-green-500 px-8 py-4 rounded font-bold text-lg"
        >
          PRONTO PARA A COPA!
        </button>
      </div>
    </div>
  );
}