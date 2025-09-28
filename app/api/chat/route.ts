import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key')

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Mesaj bulunamadı' }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy-key') {
      return NextResponse.json({ 
        error: 'Gemini API key eksik. Lütfen Vercel environment variables\'a GEMINI_API_KEY ekleyin.' 
      }, { status: 500 })
    }

    // A+A 2025 Fuarı bilgileri
    const aaFuarBilgileri = `
A+A 2025, 4-7 Kasım 2025 tarihlerinde Düsseldorf'ta gerçekleşecek olan, iş güvenliği ve sağlığı alanında dünyanın en büyük ve en önemli fuarıdır. Etkinlikte işyerinde güvenlik, sağlık ve verimlilik konularındaki yenilikler ile en son teknoloji ve çözümler sunulmaktadır. Fuar; kişisel koruyucu ekipmanlar (PPE), iş güvenliği, iş sağlığı, kurumsal iş kıyafetleri ve yangından korunma & afet yönetimi gibi çok çeşitli ürün ve çözümleri kapsar.

Etkinlik aynı zamanda Uluslararası İş Güvenliği ve Sağlığı Kongresi'yle birlikte düzenlenir ve önleyici iş sağlığı kültüründe, kişisel koruma ve işyeri tasarımından, iş sağlığı yönetimine kadar her alan ele alınır. Genç girişimciler, trendler, yenilikçi teknolojiler (ör. dijitalleşme, yapay zeka, robotik) ve sürdürülebilirlik gibi güncel başlıklar fuar kapsamında öne çıkmaktadır.

A+A; iş kıyafetlerinde global yeniliklerin sergilendiği, trendlerin ve sektör uzmanlarının yer aldığı, canlı gösterimler ve sunumlarla katılımcılara bilgi ve deneyim paylaşımı sağlayan bir program sunar. Ayrıca fuara giriş biletleri online olarak, indirimli fiyatlarla ve bekleme olmadan satın alınabilmektedir. Fuar hakkında daha fazla bilgiyi sosyal medya hesaplarından ve resmi websitesinden takip edebilirsiniz.

A+A 2025 fuarı ile ilgili ek öne çıkan başlıklar:

Ana tema inovasyon: Fuar, iş güvenliğini ve sağlığını artıran en yeni ürünler ve çözümler üzerine odaklanıyor. Yenilikçi teknoloji, yeni yaklaşımlar ve sektörü değiştiren uygulamalar fuarda tanıtılıyor.

Kapsamlı ürün kategorileri: Kişisel koruyucu donanım (PSA), iş güvenliği ve iş sağlığı, iş kıyafetleri, yangından korunma ve acil durum yönetimi, hibrit çalışma çözümleri gibi birçok farklı alan fuar kapsamında işleniyor.

Uluslararası Kongre ile birlikte: Paralel olarak Uluslararası İş Emniyeti ve Sağlığı Kongresi düzenleniyor. Bu kongre; işyeri tasarımı, iş sağlığı yönetimi, kişisel koruma ve bütünleşik kurumsal çözümler gibi konularda sektörün önde gelen uzmanlarını buluşturuyor.

Canlı gösterimler ve moda şovları: Özellikle en yeni iş kıyafeti trendlerinin gösterildiği moda etkinlikleri ve yangından korunma/acil durum yönetimi gösterimleri gerçekleşiyor.

Start-up bölgesi ve Exo Park: Genç girişimcilere özel alanlar ve fiziksel yükleri azaltan dış iskelet gibi inovatif ürünler fuarda tanıtılıyor.

Salon planı ve profesyonel danışma noktaları: Fuar alanı tematik bölgelere ayrılmış olup, interaktif salon planıyla katılımcılar aradıkları konuları ve firmaları rahatça bulabiliyor. Ayrıca iş sağlığı/güvenliği sorularınız için profesyonel merkezi hizmet veriyor.
    `

    // Gemini'ye gönderilecek sistem mesajı
    const systemMessage = `Sen A+A 2025 fuarı hakkında uzman bir AI asistanısın. Aşağıdaki fuar bilgilerini kullanarak kullanıcının sorularını yanıtla. Eğer soru fuar içeriğiyle ilgili değilse, bunu belirt ve genel bilgilerle yardımcı olmaya çalış.

A+A 2025 Fuarı Bilgileri:
${aaFuarBilgileri}

Kullanıcının sorusunu fuar bilgilerine dayanarak yanıtla. Türkçe yanıt ver ve fuar hakkında detaylı bilgi ver.`

    const model = genAI.getGenerativeModel({})
    
    const prompt = `${systemMessage}\n\nKullanıcı sorusu: ${message}`
    
    const result = await model.generateContent(prompt)
    const response = result.response.text() || 'Üzgünüm, yanıt oluşturamadım.'

    return NextResponse.json({ response })

  } catch (error) {
    console.error('Chat API hatası:', error)
    
    // Daha detaylı hata mesajı
    let errorMessage = 'Bilinmeyen bir hata oluştu'
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'Gemini API key geçersiz veya eksik'
      } else if (error.message.includes('quota')) {
        errorMessage = 'Gemini API quota aşıldı'
      } else if (error.message.includes('network')) {
        errorMessage = 'Ağ bağlantı hatası'
      } else {
        errorMessage = `Hata: ${error.message}`
      }
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 })
  }
}
