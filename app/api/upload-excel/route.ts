import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 })
    }

    const excelData: any[] = []

    for (const file of files) {
      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        continue // Sadece Excel dosyalarını işle
      }

      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'buffer' })
      
      // Her sheet'i işle
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        
        // İlk satırı header olarak kullan
        if (jsonData.length > 0) {
          const headers = jsonData[0] as string[]
          const rows = jsonData.slice(1) as any[][]
          
          const processedData = rows.map(row => {
            const obj: any = {}
            headers.forEach((header, index) => {
              obj[header] = row[index] || ''
            })
            return obj
          })

          excelData.push({
            fileName: file.name,
            sheetName: sheetName,
            data: processedData
          })
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      data: excelData,
      message: `${files.length} Excel dosyası başarıyla yüklendi`
    })

  } catch (error) {
    console.error('Excel yükleme hatası:', error)
    return NextResponse.json({ 
      error: 'Excel dosyaları yüklenirken hata oluştu',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 })
  }
}
