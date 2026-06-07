import { useCallback, useState } from 'react'

import type { ChatMessage, SimulationChat } from '@/data/simulation'
import { askEducatorQuestion } from '@/services/aiService'

const CHAT_STORAGE_KEY = 'simulation-chats'

export const useChatConversation = (simulationId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const storage = localStorage.getItem(CHAT_STORAGE_KEY)

    if (!storage) {
      return []
    }

    const chats = JSON.parse(storage) as SimulationChat[]
    const chat = chats.find((c) => c.simulationId === simulationId)

    return chat?.messages || []
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const saveChat = useCallback(
    (newMessages: ChatMessage[]) => {
      const storage = localStorage.getItem(CHAT_STORAGE_KEY)
      const chats = storage ? (JSON.parse(storage) as SimulationChat[]) : []

      const chatIndex = chats.findIndex((c) => c.simulationId === simulationId)

      if (chatIndex >= 0) {
        chats[chatIndex] = {
          ...chats[chatIndex],
          messages: newMessages,
          updatedAt: Date.now(),
        }
      } else {
        chats.push({
          simulationId,
          messages: newMessages,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        })
      }

      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats))
    },
    [simulationId],
  )

  const addMessage = useCallback(
    async (question: string) => {
      if (!question.trim()) {
        return
      }

      setError(null)
      setIsLoading(true)

      try {
        const questionMessage: ChatMessage = {
          id: crypto.randomUUID(),
          type: 'question',
          content: question,
          timestamp: Date.now(),
        }

        const newMessages = [...messages, questionMessage]
        setMessages(newMessages)
        saveChat(newMessages)

        // Chamada para a API
        const answer = await askEducatorQuestion(question, simulationId)

        const answerMessage: ChatMessage = {
          id: crypto.randomUUID(),
          type: 'answer',
          content: answer,
          timestamp: Date.now(),
        }

        const updatedMessages = [...newMessages, answerMessage]
        setMessages(updatedMessages)
        saveChat(updatedMessages)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Erro ao obter resposta da IA. Tente novamente.',
        )
      } finally {
        setIsLoading(false)
      }
    },
    [messages, simulationId, saveChat],
  )

  const clearChat = useCallback(() => {
    const storage = localStorage.getItem(CHAT_STORAGE_KEY)

    if (!storage) {
      return
    }

    const chats = JSON.parse(storage) as SimulationChat[]
    const filtered = chats.filter((c) => c.simulationId !== simulationId)

    if (filtered.length === 0) {
      localStorage.removeItem(CHAT_STORAGE_KEY)
    } else {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(filtered))
    }

    setMessages([])
  }, [simulationId])

  return {
    messages,
    isLoading,
    error,
    addMessage,
    clearChat,
  }
}
