"use client"

import { useState } from "react"

export function useCarousel(length: number) {
  const [index, setIndex] = useState(0)

  function go(dir: 1 | -1) {
    setIndex((prev) => (prev + dir + length) % length)
  }

  return { index, go, setIndex }
}