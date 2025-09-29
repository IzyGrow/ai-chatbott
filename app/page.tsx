'use client'

import React, { useState } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatHistory {
  id: string
  title: string
  date: string
  messages: Message[]
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)

  const startNewChat = () => {
    setMessages([])
    setCurrentChatId(null)
    setInput('')
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    // Eğer yeni sohbet başlatılıyorsa, sohbet geçmişine ekle
    if (!currentChatId) {
      const newChatId = Date.now().toString()
      const newChat: ChatHistory = {
        id: newChatId,
        title: input.length > 30 ? input.substring(0, 30) + '...' : input,
        date: 'Şimdi',
        messages: newMessages
      }
      setChatHistory(prev => [newChat, ...prev])
      setCurrentChatId(newChatId)
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      })

      const data = await response.json()
      
      if (response.ok) {
        const assistantMessage: Message = { role: 'assistant', content: data.response }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        const errorMessage: Message = { 
          role: 'assistant', 
          content: `Hata: ${data.error || 'Bilinmeyen hata'}\n\nDetay: ${data.details || 'Detay bilgisi yok'}`
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      const errorMessage: Message = { role: 'assistant', content: 'Bağlantı hatası. Lütfen tekrar deneyin.' }
      setMessages(prev => [...prev, errorMessage])
    }

    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="p-6 h-full flex flex-col">
          <button 
            className="sidebar-item new-chat w-full text-left"
            onClick={startNewChat}
          >
            <span className="mr-3">+</span>
            Yeni Sohbet
          </button>
          
          <div className="border-t border-gray-200 pt-6 flex-1">
            <h3 className="text-sm font-semibold text-gray-500 mb-4 px-4">Sohbetler</h3>
            <div className="space-y-2">
              {chatHistory.length === 0 ? (
                <div className="px-4 text-sm text-gray-400">
                  Henüz sohbet geçmişi yok
                </div>
              ) : (
                chatHistory.map((chat) => (
                  <div 
                    key={chat.id} 
                    className={`sidebar-item ${currentChatId === chat.id ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentChatId(chat.id)
                      setMessages(chat.messages)
                    }}
                  >
                    <span className="mr-3">💬</span>
                    <span className="flex-1 truncate">{chat.title}</span>
                    <span className="ml-auto text-xs text-gray-400">{chat.date}</span>
                  </div>
                ))
              )}
            </div>
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-lg">🤖</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Fuar Karar Destek Sistemi</h1>
              <p className="text-sm text-gray-500">AI Asistanı</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <span>📤</span>
            </button>
            <span className="text-sm text-gray-500">Made</span>
            <span className="text-xs text-gray-400">by IzyGrow</span>
          </div>
        </div>

        {/* Chat Container */}
        <div className="chat-container">
          {/* Chat Messages */}
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="welcome-container">
                <div className="ai-icon">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="16" fill="#3b82f6"/>
                    <circle cx="12" cy="12" r="2" fill="#ef4444"/>
                    <circle cx="20" cy="12" r="2" fill="#ef4444"/>
                    <circle cx="12" cy="18" r="1.5" fill="#fbbf24"/>
                    <circle cx="20" cy="18" r="1.5" fill="#fbbf24"/>
                    <rect x="14" y="20" width="4" height="2" rx="1" fill="#6b7280"/>
                    <path d="M16 8 L16 6" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="16" cy="4" r="1" fill="#fbbf24"/>
                  </svg>
                </div>
                <h1 className="welcome-title">Fuar Karar Destek Sistemi</h1>
                <p className="welcome-subtitle">
                  Fuarlar hakkında sorularınızı sorun, Asistanınız size yanıt verir.
                </p>
                
                <div className="action-cards">
                  <div className="action-card" onClick={() => setInput("Fuarlar Hakkında Bilgi Ver")}>
                    <div className="action-card-icon">🛡️</div>
                    <div className="action-card-title">Fuar Bilgileri</div>
                    <div className="action-card-desc">Fuara Ait Sorularınızı Sorun</div>
                  </div>
                  
                  <div className="action-card" onClick={() => setInput("Fuar tarihleri ve konumu nedir?")}>
                    <div className="action-card-icon">📅</div>
                    <div className="action-card-title">Fuar Tarihleri ve Konum</div>
                    <div className="action-card-desc">Fuar Tarihleri ve Konumları Hakkında Sorularınızı Sorun</div>
                  </div>
                  
                  <div className="action-card" onClick={() => setInput("Fuar Programları Hakkında Bilgi Ver")}>
                    <div className="action-card-icon">🎓</div>
                    <div className="action-card-title">Fuar Programı</div>
                    <div className="action-card-desc">Fuar Programları Hakkında Sorularınızı Sorun</div>
                  </div>
                  
                  <div className="action-card" onClick={() => setInput("Katılımcılar Hakkında Bilgi Ver")}>
                    <div className="action-card-icon">🎪</div>
                    <div className="action-card-title">Katılımcılar</div>
                    <div className="action-card-desc">Katılımcılar Hakkında Sorularınızı Sorun</div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mb-4">
                  Yukarıdaki önerilerden birini seçin veya kendi sorunuzu yazın
                </p>
              </div>
            ) : (
              <div>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={message.role === 'user' ? 'message-user' : 'message-assistant'}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                ))}
                {isLoading && (
                  <div className="message-assistant">
                    <p className="loading-dots">Düşünüyor</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="input-container">
            <div className="input-wrapper">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Fuar stratejiniz hakkında bir soru sorun..."
                className="chat-input"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="send-button"
              >
                <span className="text-white text-lg">📎</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              AI asistanı yanlış bilgi verebilir. Önemli kararlar için doğrulama yapın.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
