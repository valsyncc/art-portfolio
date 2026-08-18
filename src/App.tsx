import { useState, useRef, useEffect, useCallback } from 'react'
import type { ReactElement } from 'react'

// ─── Placeholder artwork images ────────────────────────────────────────────
// Each of these is a stand-in PNG. Drop your own image in over the file at
// the same path (keep the same filename) and it'll show up everywhere that
// artwork appears — thumbnail grid, image viewer, etc. No code changes needed.
import imgChibiMint from './images/2D/chibi_mint_nomark.png'
import imgDokiBird from './images/2D/doki_2d.png'
import imgMadokaMagica from './images/2D/madoka.png'
import imgMisaDeathNote from './images/2D/misa.png'
import imgIronMouse from './images/2D/mouse.png'
import imgChess3D from './images/3D/1.jpg'
import imgTree3D from './images/3D/3.jpg'
import imgRoom3D from './images/3D/4.png'
import imgLantern3D from './images/3D/CRISOSTOMO_Session13_HandsOn1.jpg'
import imgDokiPixel from './images/Pixel/doki.png'
import imgMintPixel from './images/Pixel/mint.png'
import imgSailorMoonPixel from './images/Pixel/sailormoon.png'
import imgLotusGarden from './images/3D/2.png'
import imgRobot from './images/3D/robot.png'
import imgCosmo from './images/3D/Cosmo_Pose (1).png'
import imgClown from './images/3D/CRISOSTOMO_CHARACTER-TEXTURING (1).jpg'
import imgRamen from './images/3D/ramen_line.png'


// ─── Placeholder animation clips ───────────────────────────────────────────
// Each app now has its own animation placeholder, at its own path, so they
// can be replaced independently. Drop your own .mp4 in over the matching
// file (keep the same filename) and it'll show up in that app's Animation
// tab — thumbnails and the viewer both handle video automatically.

import vidPixelAnimation from './images/Pixel/mint_blink.mp4'
import vid3DAnimation from './images/3D/animation_placeholder.mp4'
import vid2DAnimation from './images/2D/animation_placeholder.mp4'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Win {
  id: string
  type: 'favorites' | 'pixelart' | '3dart' | '2dillustrations' | 'imageviewer'
  title: string
  x: number
  y: number
  w: number
  h: number
  z: number
  minimized: boolean
  data?: { src: string; title: string; year: string; media: 'image' | 'video' }
}

interface Artwork {
  id: string
  title: string
  year: string
  src: string
  category: string
  media: 'image' | 'video'
}


// ─── Artwork Data ─────────────────────────────────────────────────────────────
const ARTWORKS: Artwork[] = [
  { id: 'a1', title: 'Chibi Mint Maid', year: '2025', category: '2D Illustrations', src: imgChibiMint, media: 'image' },
  { id: 'a2', title: 'Doki Bird', year: '2025', category: '2D Illustrations', src: imgDokiBird, media: 'image' },
  { id: 'a3', title: 'Madoka Magica', year: '2024', category: '2D Illustrations', src: imgMadokaMagica, media: 'image' },
  { id: 'a4', title: 'Misa DeathNote', year: '2025', category: '2D Illustrations', src: imgMisaDeathNote, media: 'image' },
  { id: 'a5', title: 'Iron Mouse', year: '2025', category: '2D Illustrations', src: imgIronMouse, media: 'image' },
  { id: 'a6', title: 'Chess', year: '2024', category: '3D Art', src: imgChess3D, media: 'image' },
  { id: 'b1', title: 'Tree Level Design', year: '2024', category: '3D Art', src: imgTree3D, media: 'image' },
  { id: 'b2', title: 'Lighting Room Sample', year: '2024', category: '3D Art', src: imgRoom3D, media: 'image' },
  { id: 'b3', title: 'Lotus Garden', year: '2026', category: '3D Art', src: imgLotusGarden, media: 'image' },
  { id: 'b4', title: 'Robot', year: '2026', category: '3D Art', src: imgRobot, media: 'image' },
  { id: 'b5', title: 'Cosmo Girl', year: '2024', category: '3D Art', src: imgCosmo, media: 'image' },
  { id: 'b6', title: 'Clown Design', year: '2023', category: '3D Art', src: imgClown, media: 'image' },
  { id: 'b7', title: 'Stylized Ramen', year: '2024', category: '3D Art', src: imgRamen, media: 'image' },
  { id: 'b8', title: 'Lighting Lantern Sample', year: '2024', category: '3D Art', src: imgLantern3D, media: 'image' },
  { id: 'c1', title: 'DokiBird Pixel Art', year: '2025', category: 'Pixel Art', src: imgDokiPixel, media: 'image' },
  { id: 'c2', title: 'Mint Maid Pixel Art', year: '2025', category: 'Pixel Art', src: imgMintPixel, media: 'image' },
  { id: 'c3', title: 'Sailor Moon Chibi Pixel', year: '2024', category: 'Pixel Art', src: imgSailorMoonPixel, media: 'image' },
  { id: 'd1', title: 'Lotus Garden', year: '2026', category: 'Favorites', src: imgLotusGarden, media: 'image' },
  { id: 'd2', title: 'Mint Maid Pixel Art', year: '2024', category: 'Favorites', src: imgMintPixel, media: 'image' },
  { id: 'd3', title: 'Misa DeathNote', year: '2024', category: 'Favorites', src: imgMisaDeathNote, media: 'image' },
  { id: 'd4', title: 'Chibi Mint Maid', year: '2024', category: 'Favorites', src: imgChibiMint, media: 'image' },
]

// ─── Animation Data ────────────────────────────────────────────────────────
// Same shape as ARTWORKS but media: 'video'. Add as many per category as you
// like — they show up under that app's "Animation" section automatically.
// Favorites intentionally has no entries here — it has no Animation tab.

const ANIMATIONS: Artwork[] = [
   { id: 'v2', title: 'Pixel Animation', year: '2024', category: 'Pixel Art', src: vidPixelAnimation, media: 'video' },
   { id: 'v3', title: '3D Animation', year: '2024', category: '3D Art', src: vid3DAnimation, media: 'video' },
   { id: 'v4', title: '2D Animation', year: '2024', category: '2D Illustrations', src: vid2DAnimation, media: 'video' },
 ]

// ─── Desktop Pixel Art Icons ──────────────────────────────────────────────────
const PIX = { imageRendering: 'pixelated' as const }

// Shared "folder with framed picture" base icon, tinted per category, with a
// small badge in the corner that echoes the category's sidebar glyph.
function FolderIcon({
  size = 64,
  frameTop,
  frameMid,
  photoBg,
  photoBand,
  accentA,
  accentB,
  badge,
  badgeColor,
}: {
  size?: number
  frameTop: string
  frameMid: string
  photoBg: string
  photoBand: string
  accentA: string
  accentB: string
  badge: ReactElement
  badgeColor: string
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={PIX}>
      <rect x={1} y={2} width={14} height={11} fill="#a0b0c0" />
      <rect x={1} y={2} width={14} height={1} fill={frameTop} />
      <rect x={1} y={13} width={14} height={1} fill={frameMid} />
      <rect x={1} y={2} width={1} height={11} fill={frameTop} />
      <rect x={14} y={2} width={1} height={11} fill={frameMid} />
      <rect x={2} y={3} width={12} height={9} fill="#e0e8f0" />
      <rect x={3} y={4} width={10} height={7} fill={photoBg} />
      <rect x={3} y={8} width={10} height={3} fill={photoBand} />
      <rect x={5} y={5} width={4} height={4} fill={accentA} />
      <rect x={6} y={6} width={2} height={2} fill={accentB} />
      <rect x={5} y={14} width={6} height={2} fill="#8090a0" />
      <rect x={6} y={14} width={4} height={1} fill="#6070a0" />
      {/* badge */}
      <rect x={10} y={0} width={6} height={6} fill={badgeColor} opacity={0.001} />
      {badge}
    </svg>
  )
}

function IconFavorites({ size = 64 }: { size?: number }) {
  return (
    <FolderIcon
      size={size}
      frameTop="#d0a030" frameMid="#a07018"
      photoBg="#f0d090" photoBand="#e0a840"
      accentA="#fbbf24" accentB="#f97316"
      badgeColor="#fbbf24"
      badge={
        <g>
          <rect x={11} y={0} width={1} height={1} fill="#fbbf24" />
          <rect x={10} y={1} width={3} height={1} fill="#fbbf24" />
          <rect x={9} y={2} width={5} height={1} fill="#fbbf24" />
          <rect x={9} y={3} width={2} height={1} fill="#fbbf24" />
          <rect x={12} y={3} width={2} height={1} fill="#fbbf24" />
          <rect x={9} y={4} width={1} height={1} fill="#fbbf24" />
          <rect x={13} y={4} width={1} height={1} fill="#fbbf24" />
        </g>
      }
    />
  )
}

function IconPixelArt({ size = 64 }: { size?: number }) {
  return (
    <FolderIcon
      size={size}
      frameTop="#5070b0" frameMid="#305088"
      photoBg="#90b0d0" photoBand="#5a9a5a"
      accentA="#f97362" accentB="#c8443a"
      badgeColor="#60a5fa"
      badge={
        <g>
          <rect x={11.5} y={0} width={2} height={2} fill="#60a5fa" />
          <rect x={9.5} y={2} width={2} height={2} fill="#93c5fd" />
          <rect x={13.5} y={2} width={2} height={2} fill="#93c5fd" />
          <rect x={11.5} y={4} width={2} height={2} fill="#60a5fa" />
        </g>
      }
    />
  )
}

function Icon3DArt({ size = 64 }: { size?: number }) {
  return (
    <FolderIcon
      size={size}
      frameTop="#7050b0" frameMid="#503088"
      photoBg="#b0a0e0" photoBand="#8070c0"
      accentA="#a78bfa" accentB="#7c3aed"
      badgeColor="#a78bfa"
      badge={
        <g>
          <rect x={12} y={0.5} width={3} height={3} fill="#a78bfa" opacity={0.95} />
          <rect x={10.5} y={2} width={3} height={3} fill="#c4b5fd" opacity={0.95} />
        </g>
      }
    />
  )
}

function Icon2DIllustrations({ size = 64 }: { size?: number }) {
  return (
    <FolderIcon
      size={size}
      frameTop="#3a9a6a" frameMid="#227a4a"
      photoBg="#a8d8c0" photoBand="#5aa87a"
      accentA="#34d399" accentB="#059669"
      badgeColor="#34d399"
      badge={
        <g>
          <rect x={10} y={0.5} width={5} height={4} fill="#34d399" opacity={0.95} />
          <rect x={10} y={0.5} width={5} height={2} fill="#6ee7b7" opacity={0.95} />
        </g>
      }
    />
  )
}

// ─── Bevel helpers ─────────────────────────────────────────────────────────────
const bevelOut: React.CSSProperties = {
  border: '2px solid',
  borderColor: '#dce8f8 #4a5a72 #4a5a72 #dce8f8',
}
const bevelIn: React.CSSProperties = {
  border: '2px solid',
  borderColor: '#4a5a72 #dce8f8 #dce8f8 #4a5a72',
}

// ─── Draggable Window ─────────────────────────────────────────────────────────
interface WindowProps {
  win: Win
  onClose: (id: string) => void
  onFocus: (id: string) => void
  onMove: (id: string, x: number, y: number) => void
  children: React.ReactNode
  isTop: boolean
}

function DraggableWindow({ win, onClose, onFocus, onMove, children, isTop }: WindowProps) {
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null)

  const handleTitleDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    e.preventDefault()
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: win.x, origY: win.y }

    const move = (ev: PointerEvent) => {
      if (!dragRef.current) return
      const dx = ev.clientX - dragRef.current.startX
      const dy = ev.clientY - dragRef.current.startY
      onMove(win.id, dragRef.current.origX + dx, dragRef.current.origY + dy)
    }
    const up = () => {
      dragRef.current = null
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerup', up)
    }
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerup', up)
  }, [win.id, win.x, win.y, onMove])

  if (win.minimized) return null

  return (
    <div
      style={{
        position: 'absolute',
        left: win.x,
        top: win.y,
        width: win.w,
        height: win.h,
        zIndex: win.z,
        display: 'flex',
        flexDirection: 'column',
        background: '#c4cfe0',
        ...bevelOut,
        outline: 'none',
      }}
      onPointerDown={() => onFocus(win.id)}
    >
      {/* Title bar */}
      <div
        onPointerDown={handleTitleDown}
        style={{
          background: isTop
            ? 'linear-gradient(to right, #1b3a6b, #2a5090)'
            : 'linear-gradient(to right, #5a6a7e, #6a7a8e)',
          color: '#fff',
          padding: '5px 6px',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          cursor: 'move',
          userSelect: 'none',
          flexShrink: 0,
        }}
      >
        <span style={{ fontFamily: 'var(--pixel-font)', fontSize: 9, flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {win.title}
        </span>
        <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
          {['─','□','✕'].map((label, i) => (
            <button
              key={i}
              onClick={() => i === 2 && onClose(win.id)}
              style={{
                width: 18,
                height: 18,
                background: '#c4cfe0',
                border: '1px solid',
                borderColor: '#dce8f8 #4a5a72 #4a5a72 #dce8f8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                lineHeight: 1,
                color: '#0a0e1a',
                fontFamily: 'monospace',
                padding: 0,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {/* Menu bar */}
      {win.type !== 'imageviewer' && (
        <div style={{
          background: '#c4cfe0',
          borderBottom: '1px solid #4a5a72',
          padding: '2px 6px',
          display: 'flex',
          gap: 10,
          flexShrink: 0,
        }}>
          {['File','Edit','View','Help'].map(m => (
            <span key={m} style={{ fontFamily: 'var(--pixel-font)', fontSize: 7, color: '#0a0e1a', cursor: 'default', padding: '1px 3px' }}>{m}</span>
          ))}
        </div>
      )}
      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  )
}

// ─── Category App (Favorites / Pixel Art / 3D Art / 2D Illustrations) ────────
// Each desktop app is a dedicated file-browser window scoped to one category.
function CategoryApp({ category, onOpenImage }: { category: string; onOpenImage: (art: Artwork) => void }) {
  const hasAnimationTab = category !== 'Favorites'
  const [section, setSection] = useState<'library' | 'animation'>('library')
  const images = ARTWORKS.filter(a => a.category === category)
  const animations = ANIMATIONS.filter(a => a.category === category)
  const filtered = section === 'library' || !hasAnimationTab ? images : animations
  const icon: Record<string, string> = { 'Favorites': '★', 'Pixel Art': '◈', '3D Art': '◉', '2D Illustrations': '◐' }

  const navRowStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    padding: '8px 10px',
    background: active ? '#4878d0' : 'transparent',
    color: active ? '#fff' : '#1a2434',
    fontFamily: 'var(--pixel-font)',
    fontSize: 8,
    width: '100%',
    cursor: 'pointer',
    border: 'none',
    textAlign: 'left',
  })

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Left sidebar */}
      <div style={{
        width: 150,
        background: '#a8b8cc',
        borderRight: '2px solid #4a5a72',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflowY: 'auto',
      }}>
        <div style={{ padding: '6px 8px', fontFamily: 'var(--pixel-font)', fontSize: 8, color: '#2a3a50', borderBottom: '1px solid #8090a8' }}>
          LIBRARY
        </div>
        <button onClick={() => setSection('library')} style={navRowStyle(section === 'library')}>
          <span style={{ fontSize: 13 }}>{icon[category]}</span>
          {category}
        </button>
        {hasAnimationTab && (
          <>
            <div style={{ padding: '6px 8px', marginTop: 6, fontFamily: 'var(--pixel-font)', fontSize: 8, color: '#2a3a50', borderTop: '1px solid #8090a8', borderBottom: '1px solid #8090a8' }}>
              ANIMATION
            </div>
            <button onClick={() => setSection('animation')} style={navRowStyle(section === 'animation')}>
              <span style={{ fontSize: 13 }}>▶</span>
              Animation
            </button>
          </>
        )}
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Path bar */}
        <div style={{
          ...bevelIn,
          margin: 4,
          padding: '3px 8px',
          background: '#f0f4ff',
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          flexShrink: 0,
        }}>
          {['◁','▷','▲'].map((a,i) => (
            <button key={i} className="pixel-btn" style={{ fontSize: 10, padding: '0 5px', minWidth: 18 }}>{a}</button>
          ))}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--pixel-font)', fontSize: 8 }}>
            <span style={{ color: '#4878d0', cursor: 'pointer' }}>Home</span>
            <span>›</span>
            <span style={{ color: '#4878d0', cursor: 'pointer' }}>Portfolio</span>
            <span>›</span>
            <span>{category}</span>
            {hasAnimationTab && section === 'animation' && (<><span>›</span><span>Animation</span></>)}
          </div>
        </div>

        {/* Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
          {filtered.length === 0 ? (
            <div style={{ fontFamily: 'var(--pixel-font)', fontSize: 8, color: '#5a6a7e', padding: 16 }}>
              No animations here yet.
            </div>
          ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 14,
          }}>
            {filtered.map(art => (
              <div
                key={art.id}
                onClick={() => onOpenImage(art)}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 5,
                  padding: 6,
                  borderRadius: 0,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#bccadc')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{
                  width: 232,
                  height: 174,
                  ...bevelIn,
                  background: '#1a1a2e',
                  overflow: 'hidden',
                  flexShrink: 0,
                  position: 'relative',
                }}>
                  {art.media === 'video' ? (
                    <>
                      <video
                        src={art.src}
                        muted
                        playsInline
                        preload="metadata"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                      }}>
                        <div style={{
                          width: 34,
                          height: 34,
                          borderRadius: '50%',
                          background: 'rgba(10,14,26,0.55)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: 14,
                          paddingLeft: 3,
                        }}>
                          ▶
                        </div>
                      </div>
                    </>
                  ) : (
                    <img
                      src={art.src}
                      alt={art.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  )}
                </div>
                <span style={{ fontFamily: 'var(--pixel-font)', fontSize: 7, color: '#0a0e1a', textAlign: 'center', lineHeight: 1.4 }}>
                  {art.title}
                </span>
                <span style={{ fontFamily: 'var(--vt-font)', fontSize: 13, color: '#5a6a7e' }}>
                  {art.year}
                </span>
              </div>
            ))}
          </div>
          )}
        </div>

        {/* Status bar */}
        <div style={{
          borderTop: '1px solid #4a5a72',
          padding: '3px 8px',
          fontFamily: 'var(--pixel-font)',
          fontSize: 7,
          color: '#4a5a6e',
          flexShrink: 0,
          display: 'flex',
          gap: 14,
        }}>
          <span>{filtered.length} object{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Image Viewer App ─────────────────────────────────────────────────────────
// The window itself is resized (once, on load) to hug the natural aspect
// ratio of the loaded image, so a tall portrait image gets a tall window and
// a wide landscape image gets a wide one — instead of every image being
// forced into the same fixed box.
const IMG_CHROME_W = 40   // padding around the image inside the frame
const IMG_CHROME_H = 130  // titlebar + caption + padding reserved outside the frame

function ImageViewerApp({
  data,
  winId,
  onFitToImage,
}: {
  data: Win['data']
  winId: string
  onFitToImage: (id: string, w: number, h: number) => void
}) {
  const fittedRef = useRef(false)

  const fitTo = (naturalW: number, naturalH: number) => {
    if (fittedRef.current) return
    fittedRef.current = true
    const ratio = naturalW / naturalH || 4 / 3

    const maxW = Math.min(window.innerWidth - 120, 960)
    const maxH = Math.min(window.innerHeight - 160, 760)

    let w = Math.min(maxW, naturalW + IMG_CHROME_W)
    let h = w / ratio + IMG_CHROME_H
    if (h > maxH) {
      h = maxH
      w = (h - IMG_CHROME_H) * ratio + IMG_CHROME_W
    }
    w = Math.max(320, Math.round(w))
    h = Math.max(260, Math.round(h))
    onFitToImage(winId, w, h)
  }

  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    fitTo(img.naturalWidth, img.naturalHeight)
  }

  const handleVideoLoad = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget
    fitTo(video.videoWidth, video.videoHeight)
  }

  if (!data) return null

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#1a1a2e', padding: 20, overflow: 'hidden' }}>
      <div style={{ ...bevelOut, background: '#0a0a1a', maxWidth: '100%', maxHeight: 'calc(100% - 48px)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {data.media === 'video' ? (
          <video
            src={data.src}
            onLoadedMetadata={handleVideoLoad}
            autoPlay
            loop
            controls
            playsInline
            style={{ display: 'block', maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        ) : (
          <img
            src={data.src}
            alt={data.title}
            onLoad={handleImgLoad}
            style={{ display: 'block', maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        )}
      </div>
      <div style={{ marginTop: 14, fontFamily: 'var(--pixel-font)', fontSize: 9, color: '#90b0d0', textAlign: 'center' }}>
        {data.title} · {data.year}
      </div>
    </div>
  )
}

// ─── Desktop Icon ─────────────────────────────────────────────────────────────
function DesktopIcon({ label, Icon, onClick }: { label: string; Icon: React.FC<{ size?: number }>; onClick: () => void }) {
  const [hover, setHover] = useState(false)
  const [active, setActive] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false) }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '10px 12px',
        cursor: 'pointer',
        background: hover ? 'rgba(72, 120, 208, 0.3)' : 'transparent',
        border: hover ? '1px dashed rgba(72, 120, 208, 0.5)' : '1px solid transparent',
        width: 168,
        userSelect: 'none',
        transform: active ? 'scale(0.95)' : 'scale(1)',
      }}
    >
      <Icon size={128} />
      <span style={{
        fontFamily: 'var(--pixel-font)',
        fontSize: 8,
        color: '#fff',
        textAlign: 'center',
        lineHeight: 1.4,
        textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000',
      }}>
        {label}
      </span>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [windows, setWindows] = useState<Win[]>([])
  const [zTop, setZTop] = useState(100)
  const [time, setTime] = useState(new Date())
  const [taskbarWins, setTaskbarWins] = useState<string[]>([])

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const fmt = (n: number) => String(n).padStart(2, '0')
  const timeStr = `${fmt(time.getHours())}:${fmt(time.getMinutes())}:${fmt(time.getSeconds())}`
  const dateStr = `${time.getFullYear()}-${fmt(time.getMonth()+1)}-${fmt(time.getDate())}`

  const nextZ = useCallback(() => {
    setZTop(z => z + 1)
    return zTop + 1
  }, [zTop])

  const openWindow = (type: Win['type'], extra?: Partial<Win>) => {
    const id = `${type}-${Date.now()}`
    const z = zTop + 1
    setZTop(z)
    const defaults: Record<Win['type'], Partial<Win>> = {
      favorites: { title: 'Favorites — File Viewer', w: 780, h: 520, x: 60, y: 40 },
      pixelart: { title: 'Pixel Art — File Viewer', w: 780, h: 520, x: 100, y: 60 },
      '3dart': { title: '3D Art — File Viewer', w: 780, h: 520, x: 140, y: 80 },
      '2dillustrations': { title: '2D Illustrations — File Viewer', w: 780, h: 520, x: 180, y: 100 },
      imageviewer: { title: 'Image Viewer', w: 540, h: 440, x: 200, y: 120 },
    }
    const base = defaults[type]
    setWindows(prev => [
      ...prev,
      { id, type, title: base.title!, x: base.x!, y: base.y!, w: base.w!, h: base.h!, z, minimized: false, ...extra },
    ])
    setTaskbarWins(prev => [...prev, id])
  }

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id))
    setTaskbarWins(prev => prev.filter(i => i !== id))
  }

  const focusWindow = (id: string) => {
    const z = zTop + 1
    setZTop(z)
    setWindows(prev => prev.map(w => w.id === id ? { ...w, z } : w))
  }

  const moveWindow = (id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x: Math.max(0, x), y: Math.max(0, y) } : w))
  }

  // Called once by ImageViewerApp after its <img> loads, so the window can
  // snap to that image's real aspect ratio instead of a fixed box.
  const fitWindowToImage = (id: string, w: number, h: number) => {
    setWindows(prev => prev.map(win => win.id === id ? { ...win, w, h } : win))
  }

  const openImage = (art: Artwork) => {
    openWindow('imageviewer', {
      title: art.title,
      data: { src: art.src, title: art.title, year: art.year, media: art.media },
      x: 160 + Math.random() * 80,
      y: 100 + Math.random() * 80,
    })
  }

  const topZ = Math.max(...windows.map(w => w.z), 0)

  const desktopApps: { id: Win['type']; label: string; category: string; Icon: React.FC<{ size?: number }> }[] = [
    { id: 'favorites', label: 'Favorites', category: 'Favorites', Icon: IconFavorites },
    { id: 'pixelart', label: 'Pixel Art', category: 'Pixel Art', Icon: IconPixelArt },
    { id: '3dart', label: '3D Art', category: '3D Art', Icon: Icon3DArt },
    { id: '2dillustrations', label: '2D Illustrations', category: '2D Illustrations', Icon: Icon2DIllustrations },
  ]

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Taskbar */}
      <div style={{
        background: 'linear-gradient(to bottom, #4a5e78, #3a4a60)',
        borderBottom: '2px solid #2a3a50',
        padding: '0 14px',
        height: 42,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        zIndex: 9999,
      }}>
        <div style={{ fontFamily: 'var(--pixel-font)', fontSize: 11, color: '#fff' }}>
          <span>portfolio</span>
          <span style={{ fontSize: 8, color: '#a0c0e0', marginLeft: 7 }}>illustrator</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {windows.map(w => (
            <button
              key={w.id}
              onClick={() => focusWindow(w.id)}
              style={{
                fontFamily: 'var(--pixel-font)',
                fontSize: 6,
                padding: '3px 10px',
                background: w.z === topZ ? '#c4cfe0' : '#8898a8',
                border: '2px solid',
                borderColor: w.z === topZ ? '#dce8f8 #4a5a72 #4a5a72 #dce8f8' : '#6a7a8e #4a5a72 #4a5a72 #6a7a8e',
                color: w.z === topZ ? '#0a0e1a' : '#dce8f8',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                maxWidth: 120,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {w.title.split('—')[0].trim()}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--pixel-font)', fontSize: 8, color: '#a0c8e8' }}>{dateStr}</span>
          <span style={{ fontFamily: 'var(--pixel-font)', fontSize: 8, color: '#e0f0ff' }}>{timeStr}</span>
        </div>
      </div>

      {/* Desktop */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          backgroundImage: `
            radial-gradient(circle at center, rgba(100,130,170,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          backgroundColor: '#8b9bb4',
          overflow: 'hidden',
        }}
      >
        {/* Desktop icons */}
        <div style={{
          position: 'absolute',
          top: 16,
          left: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          zIndex: 1,
        }}>
          {desktopApps.map(app => (
            <DesktopIcon
              key={app.id}
              label={app.label}
              Icon={app.Icon}
              onClick={() => openWindow(app.id)}
            />
          ))}
        </div>

        {/* Windows */}
        {windows.map(win => (
          <DraggableWindow
            key={win.id}
            win={win}
            onClose={closeWindow}
            onFocus={focusWindow}
            onMove={moveWindow}
            isTop={win.z === topZ}
          >
            {win.type === 'favorites' && <CategoryApp category="Favorites" onOpenImage={openImage} />}
            {win.type === 'pixelart' && <CategoryApp category="Pixel Art" onOpenImage={openImage} />}
            {win.type === '3dart' && <CategoryApp category="3D Art" onOpenImage={openImage} />}
            {win.type === '2dillustrations' && <CategoryApp category="2D Illustrations" onOpenImage={openImage} />}
            {win.type === 'imageviewer' && <ImageViewerApp data={win.data} winId={win.id} onFitToImage={fitWindowToImage} />}
          </DraggableWindow>
        ))}

        {/* Welcome hint */}
        {windows.length === 0 && (
          <div style={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            fontFamily: 'var(--pixel-font)',
            fontSize: 8,
            color: 'rgba(255,255,255,0.4)',
            textAlign: 'right',
            lineHeight: 2,
            pointerEvents: 'none',
          }}>
            double-click icons<br />to open apps
          </div>
        )}
      </div>
    </div>
  )
}
