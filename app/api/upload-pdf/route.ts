import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import pdf from 'pdf-parse'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('pdf') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'PDF dosyası bulunamadı' }, { status: 400 })
    }

    // PDF'i geçici olarak kaydet
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // PDF içeriğini oku
    const pdfData = await pdf(buffer)
    const text = pdfData.text

    // PDF metnini dosyaya kaydet (basit veritabanı yerine)
    const uploadsDir = join(process.cwd(), 'uploads')
    const filename = `pdf_${Date.now()}.txt`
    const filepath = join(uploadsDir, filename)
    
    // uploads klasörünü oluştur (yoksa)
    try {
      await writeFile(filepath, text, 'utf8')
    } catch (error) {
      // uploads klasörü yoksa oluştur
      const fs = require('fs')
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }
      await writeFile(filepath, text, 'utf8')
    }

    return NextResponse.json({ 
      message: 'PDF başarıyla yüklendi ve işlendi',
      filename: filename 
    })

  } catch (error) {
    console.error('PDF yükleme hatası:', error)
    return NextResponse.json({ error: 'PDF yükleme hatası' }, { status: 500 })
  }
}
