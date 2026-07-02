import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface LiveMatchProps {
  salaId: string;
  timeANome: string;
  timeBNome: string;
}

export default function LiveMatch({ salaId, timeANome, timeBNome }: LiveMatchProps) {
  const [placarA, setPlacarA] = useState(0);
  const [placarB, setPlacarB] = useState(0);
  const [minuto, setMinuto] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Conecta ao servidor Node.js (Backend)
    socketRef.current = io('http://localhost:3001'); // Coloque a URL do seu backend aqui

    // 2. Entra na sala Multiplayer
    socketRef.current.emit('entrar_sala_simulacao', { salaId });

    // 3. Escuta os "Ticks" da simulação (Enviados pelo Redis/Node a cada segundo)
    socketRef.current.on('tick_partida', (dadosTick) => {
      setMinuto(dadosTick.minuto);
      setPlacarA(dadosTick.placarA);
      setPlacarB(dadosTick.placarB);
      
      if (dadosTick.novoLog) {
        setLogs(prev => [...prev, dadosTick.novoLog]);
      }
    });

    // Limpa a conexão ao sair da tela
    return () => {
      socketRef.current?.disconnect();
    };
  }, [salaId]);

  // Auto-scroll para o final da caixa de texto quando um lance novo chega
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-mono p-4">
      {/* Placar estilo TV */}
      <div className="bg-black border-2 border-gray-700 rounded-lg p-6 flex justify-between items-center mb-6">
        <div className="text-4xl font-bold text-blue-400">{timeANome}</div>
        <div className="text-6xl font-black bg-gray-800 px-6 py-2 rounded">
          {placarA} - {placarB}
        </div>
        <div className="text-4xl font-bold text-red-400">{timeBNome}</div>
      </div>

      <div className="text-center text-yellow-500 font-bold text-2xl mb-4">
        {minuto}' MINUTOS
      </div>

      {/* Caixa de Comentários / Lances */}
      <div 
        ref={scrollRef}
        className="flex-1 bg-gray-950 border border-gray-800 rounded p-4 overflow-y-auto"
      >
        {logs.map((lance, index) => {
          // Destaca o gol com cor diferente
          const isGol = lance.includes("GOL");
          return (
            <div 
              key={index} 
              className={`mb-3 pb-2 border-b border-gray-800 ${isGol ? 'text-green-400 font-bold text-xl' : 'text-gray-300'}`}
            >
              {lance}
            </div>
          );
        })}
      </div>
    </div>
  );
}