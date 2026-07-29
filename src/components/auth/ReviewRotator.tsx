"use client"

import { useEffect, useRef, useState } from "react"

const reviews = [
  {
    quote:
      "The properties are breathtaking and the digital concierge service is flawlessly smooth.",
    name: "Sarah Jenkins",
    status: "Verified Guest",
    avatar: "https://i.pravatar.cc/64?img=47",
  },
  {
    quote:
      "Exquisite design and an effortless booking flow. HORIZON completely redefines luxury rentals.",
    name: "David K.",
    status: "Corporate Partner",
    avatar: "https://i.pravatar.cc/64?img=13",
  },
  {
    quote:
      "Unmatched residences and a concierge team that anticipates every need. Truly five-star.",
    name: "Micah Okoh",
    status: "CEO, Forge Labs",
    avatar:
      "https://pbs.twimg.com/profile_images/2011746068594323456/I8madg7A_400x400.jpg",
  },
]

function Star() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118l-3.367-2.448a1 1 0 00-1.176 0l-3.367 2.448c-.784.57-1.838-.196-1.539-1.118l1.286-3.957a1 1 0 00-.363-1.118L1.104 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.951-.69l1.285-3.957z" />
    </svg>
  )
}

export default function ReviewRotator() {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    const iv = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        if (!mounted.current) return
        setIdx((i) => (i + 1) % reviews.length)
        setVisible(true)
      }, 500)
    }, 5000)
    return () => {
      mounted.current = false
      clearInterval(iv)
    }
  }, [])

  const review = reviews[idx]

  return (
    <div className="border-t border-accent/10 pt-6 mt-6">
      <div
        className={
          "transition-opacity duration-500 " +
          (visible ? "opacity-100" : "opacity-0")
        }
      >
        <div className="text-amber-500 text-xs mb-2 flex gap-0.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} />
          ))}
        </div>
        <p className="font-body italic text-xs leading-relaxed text-text-meta mb-3">
          {review.quote}
        </p>
        <div className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={review.avatar}
            alt={review.name}
            className="w-6 h-6 rounded-full object-cover mr-2"
          />
          <div>
            <p className="font-body font-bold text-[9px] tracking-wider text-text-primary uppercase leading-tight">
              {review.name}
            </p>
            <p className="font-body font-bold text-[9px] tracking-wider text-text-primary/60 uppercase leading-tight">
              {review.status}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
