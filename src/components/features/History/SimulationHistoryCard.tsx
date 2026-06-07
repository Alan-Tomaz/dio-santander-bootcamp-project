import { Trash2, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { SimulationRecord } from '@/data/simulation'
import { calcMonthlySavings } from '@/utils/simulation'

interface SimulationHistoryCardProps {
  simulation: SimulationRecord
  onDelete: (id: string) => void
}

export function SimulationHistoryCard({
  simulation,
  onDelete,
}: SimulationHistoryCardProps) {
  const monthlySavings = calcMonthlySavings(simulation)
  const createdAt = new Date(simulation.createdAt || 0)
  const formattedDate = createdAt.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="bg-card rounded-2xl p-4 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] transition-shadow hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-foreground mb-1 text-lg font-semibold">
            {simulation.goalName}
          </h3>
          <p className="text-muted-foreground text-sm">{formattedDate}</p>
        </div>
        <button
          onClick={() => onDelete(simulation.id)}
          className="text-muted-foreground rounded-lg p-2 transition-colors hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30"
          title="Deletar simulação"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div>
          <p className="text-muted-foreground mb-1 text-xs tracking-widest uppercase">
            Meta
          </p>
          <p className="text-foreground text-sm font-semibold">
            {simulation.goalAmount}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1 text-xs tracking-widest uppercase">
            Prazo
          </p>
          <p className="text-foreground text-sm font-semibold">
            {simulation.goalDeadline} meses
          </p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1 text-xs tracking-widest uppercase">
            Economia/mês
          </p>
          <p className="text-primary text-sm font-semibold">
            R${' '}
            {monthlySavings.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      <Link
        to={`/resultado/${simulation.id}`}
        className="bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
      >
        Ver detalhes
        <ChevronRight size={16} />
      </Link>
    </div>
  )
}
