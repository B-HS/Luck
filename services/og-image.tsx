import satori from 'satori'
import { initWasm, Resvg } from '@resvg/resvg-wasm'
import { readFile } from 'fs/promises'
import { join } from 'path'

let wasmInitialized = false

const initResvg = async () => {
    if (wasmInitialized) return
    const basePath = process.env.VERCEL ? '/var/task' : process.cwd()
    const wasmPath = join(basePath, 'node_modules/@resvg/resvg-wasm/index_bg.wasm')
    const wasmBuffer = await readFile(wasmPath)
    await initWasm(wasmBuffer)
    wasmInitialized = true
}

const fontCache = new Map<string, ArrayBuffer>()

const loadFont = async (): Promise<ArrayBuffer | null> => {
    if (fontCache.has('noto-sans-kr')) return fontCache.get('noto-sans-kr')!
    const basePath = process.env.VERCEL ? '/var/task' : process.cwd()
    const fontPath = join(basePath, 'node_modules/@fontsource/noto-sans-kr/files/noto-sans-kr-korean-700-normal.woff')
    try {
        const buffer = await readFile(fontPath)
        const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
        fontCache.set('noto-sans-kr', arrayBuffer)
        return arrayBuffer
    } catch {
        return null
    }
}

const getBallHexColor = (num: number): { bg: string; text: string } => {
    if (num <= 10) return { bg: '#FACC15', text: '#713F12' }
    if (num <= 20) return { bg: '#3B82F6', text: '#FFFFFF' }
    if (num <= 30) return { bg: '#EF4444', text: '#FFFFFF' }
    if (num <= 40) return { bg: '#6B7280', text: '#FFFFFF' }
    return { bg: '#22C55E', text: '#FFFFFF' }
}

export type OgImageData = {
    episode: number
    numbers: number[]
    bonusNumber: number
    drawDate: string
}

const Ball = ({ num, size }: { num: number; size: number }) => {
    const color = getBallHexColor(num)
    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                backgroundColor: color.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
            }}
        >
            <span style={{ fontSize: size * 0.42, fontWeight: 700, color: color.text }}>{num}</span>
        </div>
    )
}

const OgTemplate = ({ episode, numbers, bonusNumber, drawDate }: OgImageData) => {
    const ballSize = 80
    const y = drawDate.slice(0, 4)
    const m = drawDate.slice(4, 6)
    const d = drawDate.slice(6, 8)

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #FAFAFA 0%, #F3F4F6 100%)',
                gap: '32px',
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: 44, fontWeight: 700, color: '#111827' }}>제 {episode}회 추첨결과</span>
                <span style={{ fontSize: 22, color: '#9CA3AF', fontWeight: 700 }}>로또 6/45</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {numbers.map((num, i) => (
                    <Ball key={i} num={num} size={ballSize} />
                ))}
                <span style={{ fontSize: 36, fontWeight: 700, color: '#D1D5DB', marginLeft: '4px', marginRight: '4px' }}>+</span>
                <Ball num={bonusNumber} size={ballSize} />
            </div>

            <span style={{ fontSize: 18, color: '#9CA3AF', fontWeight: 700 }}>{y}.{m}.{d} 추첨</span>
        </div>
    )
}

const imageCache = new Map<number, Buffer>()

export const generateOgImage = async (data: OgImageData): Promise<Buffer> => {
    const cached = imageCache.get(data.episode)
    if (cached) return cached

    await initResvg()
    const fontData = await loadFont()

    const fonts = fontData
        ? [
              {
                  name: 'Noto Sans KR',
                  data: fontData,
                  weight: 700 as const,
                  style: 'normal' as const,
              },
          ]
        : []

    const svg = await satori(OgTemplate(data), {
        width: 1200,
        height: 630,
        fonts,
    })

    const resvg = new Resvg(svg, {
        fitTo: { mode: 'width', value: 1200 },
    })

    const pngData = resvg.render()
    const buffer = Buffer.from(pngData.asPng())
    imageCache.set(data.episode, buffer)
    return buffer
}
