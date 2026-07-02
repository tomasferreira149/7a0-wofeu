import { PrismaClient } from '@prisma/client';

// O prisma é declarado aqui no topo uma única vez para o ficheiro todo usar
const prisma = new PrismaClient();

// PASSO 2: Função para criar o torneio e os primeiros jogos
export async function iniciarTorneio(torneioNome: string, amigosIds: string[]) {
  // 1. Cria o Torneio e o Chaveamento base no banco de dados
  const torneio = await prisma.torneio.create({
    data: {
      nome: torneioNome,
      chaveamento: {
        create: {} 
      }
    },
    include: { chaveamento: true }
  });

  // 2. Embaralha os amigos aleatoriamente
  const sorteio = amigosIds.sort(() => Math.random() - 0.5);
  
  // 3. Descobre a fase com base no número de jogadores (ex: 8 = Quartos)
  const faseInicial = sorteio.length === 8 ? "Quartos" : "Meias";

  // 4. Cria as partidas no banco de dados
  for (let i = 0; i < sorteio.length; i += 2) {
    await prisma.partida.create({
      data: {
        torneioId: torneio.id,
        chaveamentoId: torneio.chaveamento!.id,
        timeA_Id: sorteio[i],
        timeB_Id: sorteio[i + 1],
        fase: faseInicial,
      }
    });
  }
  
  console.log(`Torneio ${torneioNome} gerado com sucesso!`);
  return torneio;
}

// PASSO 3: Função para salvar o resultado final de um jogo simulado
export async function registrarFimDeJogo(partidaId: string, golsA: number, golsB: number, vencedorId: string) {
  // Atualiza a partida que acabou com os golos e o vencedor real
  await prisma.partida.update({
    where: { id: partidaId },
    data: { 
      golsTimeA: golsA, 
      golsTimeB: golsB, 
      vencedorId: vencedorId 
    }
  });

  console.log(`Jogo finalizado no banco! Partida: ${partidaId} - Vencedor: ${vencedorId}`);
}