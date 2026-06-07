import { useEffect, useRef, useState } from 'react'

import { Loader2, Send } from 'lucide-react'

import type { ChatMessage } from '@/data/simulation'

interface ChatInterfaceProps {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  onSendMessage: (message: string) => Promise<void>
}

export function ChatInterface({
  messages,
  isLoading,
  error,
  onSendMessage,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim() || isLoading) {
      return
    }

    await onSendMessage(inputValue)
    setInputValue('')
  }

  return (
    <div className="bg-card flex h-full flex-col rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]">
      <div className="mb-3 flex items-center gap-1.5">
        <span>💬</span>
        <span className="text-primary text-xs font-semibold tracking-widest uppercase">
          Dúvidas com o Educador Financeiro
        </span>
      </div>

      {/* Messages Container */}
      <div className="mb-4 flex-1 overflow-y-auto pr-2 lg:max-h-93 lg:[scrollbar-color:var(--border)_transparent]">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <p className="text-muted-foreground text-sm">
              Nenhuma pergunta realizada ainda. Faça uma pergunta para começar a
              conversar com o educador financeiro!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === 'question' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-2.5 lg:max-w-md ${
                    message.type === 'question'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted text-muted-foreground rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p
                    className={`mt-1 text-xs ${
                      message.type === 'question'
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground/70'
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-3 rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
          placeholder="Digite sua pergunta..."
          className="border-border bg-background text-foreground placeholder:text-muted-foreground flex-1 rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </button>
      </form>
    </div>
  )
}
