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

    // Fuar bilgileri
    const fuarBilgileri = `
A+A 2025
4-7 Kasım 2025 tarihlerinde Düsseldorf'ta gerçekleşecek olan, iş güvenliği ve sağlığı alanında dünyanın en büyük ve en önemli fuarıdır. Etkinlikte işyerinde güvenlik, sağlık ve verimlilik konularındaki yenilikler ile en son teknoloji ve çözümler sunulmaktadır. Fuar; kişisel koruyucu ekipmanlar (PPE), iş güvenliği, iş sağlığı, kurumsal iş kıyafetleri ve yangından korunma & afet yönetimi gibi çok çeşitli ürün ve çözümleri kapsar. Etkinlik aynı zamanda Uluslararası İş Güvenliği ve Sağlığı Kongresi'yle birlikte düzenlenir.

AGRITECHNICA 2025
Dünyanın önde gelen tarım teknolojileri fuarıdır. Alman DLG Markets tarafından düzenlenir. Katılımcılar; traktörler, tarım makineleri, dijital tarım çözümleri, tarım ekipmanları ve inovasyonlarını sergilerler. Fuar; ürün ve firma bulma, salon planı ve oturum programı ile profesyonellere, çiftçilere ve distribütörlere yönelik geniş kapsamlı bir platform sunar.

MEDICA 2025
Dünyanın en büyük tıp teknolojisi ve medikal ürün fuarı Düsseldorf'da gerçekleşir. Hastane ekipmanları, laboratuvar teknolojileri, teşhis cihazları, tıbbi malzemeler ve sağlık bilişimi alanındaki en yeni ürün ve teknolojiler sergilenir. Fuara paralel olarak COMPAMED bileşeni ile medikal üretim teknolojileri de yer alır. Katılımcılar, programlar ve salon planı ile fuara hazırlanmak için MyOrganizer ve Medica App gibi dijital araçlar sunulmaktadır.

BIG 5 GLOBAL 2025
Dubai'de 24-27 Kasım'da gerçekleşir. İnşaat sektörü için; yapı malzemeleri, iç-dış mekan ekipmanları, yazılım, proje yönetimi, dijital inşaat teknolojileri gibi birçok alt sektörü kapsar. Uluslararası firmalar ve uzmanlar bir araya gelerek inovasyonlarını tanıtır ve sektör ortaklıkları kurar.

Gulfood Manufacturing 2025
Gıda üretimi ve işleme endüstrisi için en büyük fuarlardan biridir. Dubai'de gerçekleşen bu fuarda gıda işleme makineleri, ambalaj, bileşenler ve lojistik alanında firmalar yer alır. Katılımcı listesi; Hindistan, Brezilya, İtalya, Çin, Fransa ve birçok ülkeden firmaları kapsar.

Avrasya Kapı Fuarı 2025
İstanbul TÜYAP'ta yapılan kapı, pencere, cam ve aksesuar sektörlerinin buluşma noktasıdır. Katılımcılar; iç mekan kapıları, çelik kapılar, otomatik kapı sistemleri, kapı aksesuarları, profil sistemleri, izolasyon ürünleri, üretim makineleri ve kimyasal ürünler ile sektöre yön veren yenilikleri sergiler. Türkiye başta olmak üzere çeşitli ülkelerden birçok firma fuarda yer alır.

R+T Turkey 2025
27-29 Kasım 2025'te İstanbul Fuar Merkezi'nde gerçekleşecek olan fuar, uluslararası güneşten koruma ve otomatik kapı sistemleri sektörünün en büyük buluşmalarından biridir. Fuar; tekstil, mekanik, mimari, otomasyon, gölgelendirme, tente, branda, pencere, kapı, alarm ve perde sistemleri, motorlar, profil, kimyasal malzemeler, üretim makineleri ve inovasyonları kapsar. Türkiye, Almanya, Çin, Romanya, Kore, İtalya ve Pakistan gibi ülkelerden çok sayıda katılımcı firma fuarda ürünlerini sergiler.

INTERMOT Cologne 2025
4-7 Aralık 2025 tarihlerinde Köln'de düzenlenen dünyanın lider motosiklet, scooter ve e-mobilite fuarıdır. En yeni motosiklet ve scooter modelleri, e-bisikletler, aksesuarlar, yedek parçalar, sürüş ekipmanları, inovasyonlar ve sektörel gelişmeler fuar kapsamında sergilenir. Sektörün önde gelen uluslararası firmalarıyla doğrudan temas, canlı şovlar ve lansmanlar öne çıkar.

Automechanika Dubai 2025
9-11 Aralık 2025'te Dubai World Trade Centre'da düzenlenir. Otomotiv endüstrisi için dünyanın önde gelen ticaret fuarlarından biridir. Yedek parça, bakım & onarım, otomobil aksesuarları, otomotiv teknolojileri, servis ekipmanları, oto elektronik ürünler ve yenilikçi çözümler sunulur. Uluslararası üreticiler, distribütörler ve servis sağlayıcıları buluşturur.

Plast Eurasia İstanbul 2025
3-6 Aralık 2025'te İstanbul TÜYAP'ta, plastik endüstrisinin en büyük ve kapsamlı fuarıdır. Plastik üretim makineleri, plastik hammadde ve kimyasalları, kalıp teknolojileri, plastik geri dönüşüm makineleri, otomasyon ve robotik sistemler, sektöre özel ekipmanlar fuarda yer alır. Türkiye ve dünyadan birçok katılımcı ile iş birliği ve ticaret fırsatları sunulmaktadır.
    `

    // Statik Excel verileri
    const excelBilgileri = `
    
Excel Dosyalarından Veriler:

Fuar Katılımcıları Listesi:
- A+A 2025: 2,200+ katılımcı firma
- MEDICA 2025: 5,000+ katılımcı firma  
- AGRITECHNICA 2025: 2,800+ katılımcı firma
- BIG 5 GLOBAL 2025: 3,000+ katılımcı firma

Fuar İstatistikleri:
- Toplam ziyaretçi sayısı: 1.2 milyon+
- Uluslararası katılımcı oranı: %65
- Yeni ürün lansmanları: 15,000+
- B2B görüşme sayısı: 50,000+

Sektörel Dağılım:
- İş güvenliği: %25
- Medikal: %20
- Tarım teknolojileri: %18
- İnşaat: %15
- Diğer: %22

Fuar Maliyetleri (Ortalama):
- Stand kiralama: €150-500/m²
- Katılım ücreti: €2,000-5,000
- Seyahat masrafları: €1,500-3,000
- Promosyon malzemeleri: €500-2,000`

    // Gemini'ye gönderilecek sistem mesajı
    const systemMessage = `Sen fuarlar hakkında uzman bir AI asistanısın. Kullanıcının sorularını kısa, net ve öz şekilde yanıtla. 

Fuar Bilgileri:
${fuarBilgileri}${excelBilgileri}

Kurallar:
- Merhaba gibi selamlaşmalarda sadece "Merhaba! Fuarlar hakkında size nasıl yardımcı olabilirim?" şeklinde yanıt ver
- Sorulara kısa ve net cevaplar ver (maksimum 2-3 paragraf)
- Fuar dışı sorularda "Fuarlar hakkında sorularınızı yanıtlayabilirim" de
- Fuar tarihleri, listeleri veya çoklu bilgi içeren sorularda madde madde (•) formatında yanıt ver
- Her maddeyi net ve düzenli şekilde yaz
- Excel dosyalarındaki verileri de kullanarak yanıt ver
- Türkçe yanıt ver`

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    
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
