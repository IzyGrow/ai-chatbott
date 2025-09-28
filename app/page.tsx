'use client'

import { useState } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

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
        const errorMessage: Message = { role: 'assistant', content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.' }
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
        <div className="p-4">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center mr-3">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <span className="font-semibold text-gray-800">AI Chatbot</span>
          </div>
          
          <button className="sidebar-item w-full text-left mb-4">
            <span className="mr-3">✏️</span>
            Yeni sohbet
          </button>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-2 px-4">Sohbetler</h3>
            <div className="space-y-1">
              <div className="sidebar-item active">
                <span className="mr-3">💬</span>
                Mevcut sohbet
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold">AI Chatbot</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <span>❓</span>
            </button>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">U</span>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="chat-container">
          {/* Chat Messages */}
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="welcome-container">
                <h1 className="welcome-title">Ne üzerinde çalışıyorsun?</h1>
                <p className="welcome-subtitle">Herhangi bir şey sor</p>
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
                placeholder="Herhangi bir şey sor"
                className="chat-input"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="send-button"
              >
                <span className="text-white text-sm">→</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              AI hata yapabilir. Önemli bilgileri kontrol edin.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
