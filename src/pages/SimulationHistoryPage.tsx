import { Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { SimulationHistoryCard } from '@/components/features/History/SimulationHistoryCard'
import { PageHero } from '@/components/shared/PageHero'
import { Button } from '@/components/shared/Button'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { useState } from 'react'

export function SimulationHistoryPage() {
  const { getAllSimulations, deleteSimulation } = useSimulationStorage()
  const allSimulations = getAllSimulations()
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set())

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta simulação?')) {
      deleteSimulation(id)
      setDeletedIds((prev) => new Set(prev).add(id))
    }
  }

  const visibleSimulations = allSimulations.filter(
    (sim) => !deletedIds.has(sim.id),
  )

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <PageHero
        title="Histórico de Simulações"
        subtitle="Acompanhe todas as suas simulações financeiras"
      />

      {visibleSimulations.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-12">
          <div className="mb-6 text-center">
            <p className="text-muted-foreground mb-4 text-lg">
              Você ainda não tem nenhuma simulação salva.
            </p>
            <p className="text-muted-foreground mb-6 text-sm">
              Crie uma nova simulação para começar a rastrear seu progresso
              financeiro.
            </p>
          </div>
          <Link to="/">
            <Button variant="primary">✨ Criar nova simulação</Button>
          </Link>
        </div>
      ) : (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">
                Total de simulações:{' '}
                <strong>{visibleSimulations.length}</strong>
              </p>
            </div>
            {visibleSimulations.length > 0 && (
              <button
                onClick={() => {
                  if (
                    confirm(
                      'Tem certeza que deseja deletar todas as simulações?',
                    )
                  ) {
                    visibleSimulations.forEach((sim) => {
                      deleteSimulation(sim.id)
                    })
                    setDeletedIds(
                      new Set(visibleSimulations.map((sim) => sim.id)),
                    )
                  }
                }}
                className="text-muted-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30"
              >
                <Trash2 size={16} />
                Limpar histórico
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visibleSimulations.map((simulation) => (
              <SimulationHistoryCard
                key={simulation.id}
                simulation={simulation}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
