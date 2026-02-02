import type { ReactNode } from 'react'

export type QuoteHighlightProps = {
  text: ReactNode
  variant?: 'hero' | 'card'
  accent?: string
}

const QuoteHighlight = ({ text, variant = 'hero', accent }: QuoteHighlightProps) => {
  const isHero = variant === 'hero'
  const baseAccent = accent ?? '#e1e6ef'
  const borderColor = isHero ? '#f5bfd8' : baseAccent
  const backgroundColor = isHero ? '#fdebf3' : `${baseAccent}33`
  const quoteColor = isHero ? '#ea91b6' : `${baseAccent}aa`

  return (
    <div
      className={`relative overflow-hidden ${isHero ? 'rounded-[28px] px-8 py-6 shadow-soft md:px-10 md:py-7' : 'rounded-3xl px-6 py-5 shadow-[0_14px_32px_-16px_rgba(0,0,0,0.2)]'}`}
      style={{
        border: `1px solid ${borderColor}`,
        background: backgroundColor,
      }}
    >
      <span
        aria-hidden="true"
        className={`absolute font-display ${isHero ? 'left-6 top-3 text-5xl md:left-8 md:text-6xl' : 'left-4 top-2 text-4xl'}`}
        style={{ color: quoteColor }}
      >
        “
      </span>
      <p
        className={`text-ink ${isHero ? 'pl-9 text-[1.05rem] leading-7 md:pl-12 md:text-xl md:leading-8' : 'pl-8 text-[0.9rem] leading-6 md:text-[1rem] md:leading-6'}`}
        style={{
          fontWeight: 500,
        }}
      >
        {text}
      </p>
      <span
        aria-hidden="true"
        className={`absolute font-display ${isHero ? 'bottom-2 right-6 text-4xl md:bottom-3 md:right-8 md:text-5xl' : 'bottom-1 right-5 text-3xl'}`}
        style={{ color: quoteColor }}
      >
        ”
      </span>
    </div>
  )
}

export default QuoteHighlight
