'use client'

import { useState } from 'react'

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
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    {
      id: '1',
      title: 'A+A 2025 Ürün Kategorileri',
      date: 'Bugün',
      messages: []
    },
    {
      id: '2', 
      title: 'Fuar Tarihleri ve Konum',
      date: 'Dün',
      messages: []
    },
    {
      id: '3',
      title: 'Kongre Programı Detayları',
      date: '2 gün önce',
      messages: []
    },
    {
      id: '4',
      title: 'Etkinlik ve Gösterimler',
      date: '3 gün önce',
      messages: []
    },
    {
      id: '5',
      title: 'Bilet ve Katılım Bilgileri',
      date: '1 hafta önce',
      messages: []
    }
  ])

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
        <div className="p-6">
          <button className="sidebar-item new-chat w-full text-left">
            <span className="mr-3">+</span>
            Yeni Sohbet
          </button>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-4 px-4">Sohbetler</h3>
            <div className="space-y-2">
              {chatHistory.map((chat, index) => (
                <div 
                  key={chat.id} 
                  className={`sidebar-item ${index === 0 ? 'active' : ''}`}
                >
                  <span className="mr-3">💬</span>
                  <span className="flex-1 truncate">{chat.title}</span>
                  <span className="ml-auto text-xs text-gray-400">{chat.date}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-auto pt-6">
            <div className="flex items-center px-4 text-sm text-gray-500">
              <span className="mr-2">⚙️</span>
              Ayarlar
            </div>
            <div className="px-4 mt-2 text-xs text-gray-400">
              Powered by izygrow
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
              <h1 className="text-xl font-bold text-gray-800">A+A 2025 AI Asistanı</h1>
              <p className="text-sm text-gray-500">Fuar Karar Destek Sistemi</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <span>📤</span>
            </button>
            <span className="text-sm text-gray-500">Paylaş</span>
            <span className="text-xs text-gray-400">by izygrow</span>
          </div>
        </div>

        {/* Chat Container */}
        <div className="chat-container">
          {/* Chat Messages */}
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="welcome-container">
                <div className="ai-icon">🤖</div>
                <h1 className="welcome-title">A+A 2025 fuarı hakkında bilgi alın</h1>
                <p className="welcome-subtitle">
                  İş güvenliği ve sağlığı alanındaki en büyük fuar hakkında detaylı bilgi edinin. Ürün kategorileri, etkinlikler ve katılım detayları için AI asistanınızla konuşun.
                </p>
                
                <div className="action-cards">
                  <div className="action-card" onClick={() => setInput("A+A 2025 fuarında hangi ürün kategorileri var?")}>
                    <div className="action-card-icon">🛡️</div>
                    <div className="action-card-title">Ürün Kategorileri</div>
                    <div className="action-card-desc">A+A 2025'te sergilenen ürün ve çözümleri keşfet</div>
                  </div>
                  
                  <div className="action-card" onClick={() => setInput("Fuar tarihleri ve konumu nedir?")}>
                    <div className="action-card-icon">📅</div>
                    <div className="action-card-title">Fuar Bilgileri</div>
                    <div className="action-card-desc">A+A 2025 tarihleri, konum ve katılım detayları</div>
                  </div>
                  
                  <div className="action-card" onClick={() => setInput("Kongre programı hakkında bilgi ver")}>
                    <div className="action-card-icon">🎓</div>
                    <div className="action-card-title">Kongre Programı</div>
                    <div className="action-card-desc">Uluslararası İş Güvenliği ve Sağlığı Kongresi</div>
                  </div>
                  
                  <div className="action-card" onClick={() => setInput("Fuar etkinlikleri neler?")}>
                    <div className="action-card-icon">🎪</div>
                    <div className="action-card-title">Etkinlikler</div>
                    <div className="action-card-desc">Canlı gösterimler, moda şovları ve özel etkinlikler</div>
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
