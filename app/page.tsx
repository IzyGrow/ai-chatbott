'use client'

import { useState, useRef } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setPdfFile(file)
    } else {
      alert('Lütfen sadece PDF dosyası seçin.')
    }
  }

  const uploadPDF = async () => {
    if (!pdfFile) return

    const formData = new FormData()
    formData.append('pdf', pdfFile)

    try {
      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        alert('PDF başarıyla yüklendi!')
        setPdfFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        alert('PDF yükleme hatası!')
      }
    } catch (error) {
      alert('PDF yükleme hatası!')
    }
  }

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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold gradient-text mb-4">🤖 AI Chatbot</h1>
            <p className="text-xl text-white/90 font-medium">PDF'lerinizden öğrenen akıllı asistan</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {/* PDF Upload Section */}
        <div className="glass rounded-2xl p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">📄 PDF Yükle</h2>
            <p className="text-white/80">Dokümanlarınızı yükleyin, AI ile sohbet edin</p>
          </div>
          
          <div className="file-upload mb-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="pdf-upload"
            />
            <label 
              htmlFor="pdf-upload" 
              className="cursor-pointer block"
            >
              <div className="text-4xl mb-4">📁</div>
              <p className="text-lg font-semibold text-gray-700 mb-2">
                {pdfFile ? pdfFile.name : 'PDF dosyası seçin'}
              </p>
              <p className="text-sm text-gray-500">
                {pdfFile ? 'Dosya seçildi' : 'Dosya seçmek için tıklayın'}
              </p>
            </label>
          </div>
          
          <div className="text-center">
            <button
              onClick={uploadPDF}
              disabled={!pdfFile}
              className="modern-btn px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🚀 PDF Yükle
            </button>
          </div>
        </div>

        {/* Chat Section */}
        <div className="glass rounded-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">💬 Sohbet</h2>
            <p className="text-white/80">AI ile konuşmaya başlayın</p>
          </div>

          {/* Chat Messages */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 h-96 overflow-y-auto mb-6">
            {messages.length === 0 ? (
              <div className="text-center text-white/80 mt-20">
                <div className="text-6xl mb-4">👋</div>
                <p className="text-xl font-semibold mb-2">Merhaba! Size nasıl yardımcı olabilirim?</p>
                <p className="text-sm">Önce bir PDF yükleyin, sonra sorularınızı sorun.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={message.role === 'user' ? 'message-user' : 'message-assistant'}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="message-assistant">
                      <p className="text-sm loading-dots">Düşünüyor</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Mesajınızı yazın..."
              className="modern-input flex-1"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="modern-btn px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✈️ Gönder
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="glass text-center py-6">
        <p className="text-white/70">
          Powered by OpenAI • Made with ❤️
        </p>
      </footer>
    </div>
  )
}
