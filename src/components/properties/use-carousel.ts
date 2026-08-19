"use client"

import { useCallback, useState } from "react"

export function useCarousel(length: number) {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState<1 | -1>(1)

  const go = useCallback(
    (d: 1 | -1) => {
      setDir(d)
      setIndex((prev) => (prev + d + length) % length)
    },
    [length]
  )

  const jump = useCallback(
    (i: number) => {
      setDir(i > index ? 1 : -1)
      setIndex(i)
    },
    [index]
  )

  return { index, dir, go, setIndex: jump }
}