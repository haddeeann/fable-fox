declare module 'page-flip' {
  export type PageFlipSettings = {
    width: number
    height: number
    size?: 'fixed' | 'stretch'
    minWidth?: number
    maxWidth?: number
    minHeight?: number
    maxHeight?: number
    showCover?: boolean
    usePortrait?: boolean
    autoSize?: boolean
    drawShadow?: boolean
    maxShadowOpacity?: number
    mobileScrollSupport?: boolean
    flippingTime?: number
  }

  export class PageFlip {
    constructor(element: HTMLElement, settings: PageFlipSettings)
    loadFromImages(images: string[]): void
    flipNext(): void
    flipPrev(): void
    destroy(): void
  }
}
