'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'

type ScanResult = {
  text: string
  format: string
}

export default function ScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const readerRef = useRef<any>(null)

  const startScanner = useCallback(async () => {
    try {
      setError(null)
      setResult(null)
      setScanning(true)

      // Dynamic import to avoid SSR issues
      const { BrowserMultiFormatReader } = await import('@zxing/library')
      const reader = new BrowserMultiFormatReader()
      readerRef.current = reader

      const devices = await BrowserMultiFormatReader.listVideoInputDevices()
      if (!devices.length) throw new Error('Nenhuma câmera encontrada')

      // Prefer back camera
      const deviceId = devices.find((d) =>
        d.label.toLowerCase().includes('back') ||
        d.label.toLowerCase().includes('rear') ||
        d.label.toLowerCase().includes('traseira')
      )?.deviceId ?? devices[devices.length - 1].deviceId

      await reader.decodeFromVideoDevice(deviceId, videoRef.current!, (result, error) => {
        if (result) {
          setResult({ text: result.getText(), format: result.getBarcodeFormat().toString() })
          stopScanner()
        }
        if (error && error.message && !error.message.includes('No MultiFormat')) {
          console.warn(error)
        }
      })
    } catch (err: any) {
      setError(err.message ?? 'Erro ao acessar câmera')
      setScanning(false)
    }
  }, [])

  const stopScanner = useCallback(() => {
    readerRef.current?.reset()
    setScanning(false)
  }, [])

  useEffect(() => {
    return () => {
      readerRef.current?.reset()
    }
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-brand-700 text-white">
        <div className="mx-auto max-w-lg px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-blue-200 hover:text-white">← Início</Link>
          <h1 className="text-xl font-bold">📷 Scanner</h1>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 py-6 space-y-4">
        {/* Camera viewfinder */}
        <div className="relative rounded-xl overflow-hidden bg-black aspect-square">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />
          {!scanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="text-center text-white">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-sm">Toque em &quot;Iniciar&quot; para escanear</p>
              </div>
            </div>
          )}
          {scanning && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Scan line animation */}
              <div className="w-3/4 h-3/4 border-2 border-blue-400 rounded-lg">
                <div className="w-full h-0.5 bg-blue-400 animate-bounce mt-1/2" />
              </div>
            </div>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className="card border-green-200 bg-green-50">
            <p className="text-sm font-medium text-green-700">✅ Código detectado!</p>
            <p className="text-lg font-bold text-gray-900 mt-1 break-all">{result.text}</p>
            <p className="text-xs text-gray-500 mt-0.5">Formato: {result.format}</p>
            <div className="mt-3 flex gap-2">
              <Link
                href={`/estoque?search=${encodeURIComponent(result.text)}`}
                className="btn-primary text-xs py-1.5 px-3"
              >
                Ver no estoque
              </Link>
              <button
                onClick={() => { setResult(null); startScanner() }}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                Escanear outro
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            ❌ {error}
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3">
          {!scanning ? (
            <button onClick={startScanner} className="btn-primary flex-1">
              Iniciar Scanner
            </button>
          ) : (
            <button onClick={stopScanner} className="btn-secondary flex-1">
              Parar
            </button>
          )}
        </div>

        <p className="text-center text-xs text-gray-400">
          Suporta QR Code, Code128, EAN-13, EAN-8, Code39, DataMatrix e mais.
        </p>
      </div>
    </main>
  )
}
