import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Mesaj bulunamadı' }, { status: 400 })
    }

    // PDF dosyalarından metinleri oku
    let pdfContext = ''
    try {
      const uploadsDir = join(process.cwd(), 'uploads')
      const files = await readdir(uploadsDir)
      const txtFiles = files.filter(file => file.endsWith('.txt'))
      
      for (const file of txtFiles) {
        const filepath = join(uploadsDir, file)
        const content = await readFile(filepath, 'utf8')
        pdfContext += content + '\n\n'
      }
    } catch (error) {
      console.log('PDF dosyaları okunamadı:', error)
    }

    // OpenAI'ye gönderilecek sistem mesajı
    const systemMessage = pdfContext 
      ? `Sen bir yardımcı AI asistanısın. Aşağıdaki PDF içeriklerini kullanarak kullanıcının sorularını yanıtla. Eğer soru PDF içeriğiyle ilgili değilse, bunu belirt ve genel bilgilerle yardımcı olmaya çalış.

PDF İçerikleri:
${pdfContext}

Kullanıcının sorusunu PDF içeriğine dayanarak yanıtla. Türkçe yanıt ver.`
      : 'Sen bir yardımcı AI asistanısın. Kullanıcının sorularını yanıtla. Türkçe yanıt ver.'

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content || 'Üzgünüm, yanıt oluşturamadım.'

    return NextResponse.json({ response })

  } catch (error) {
    console.error('Chat API hatası:', error)
    return NextResponse.json({ error: 'Chat API hatası' }, { status: 500 })
  }
}
