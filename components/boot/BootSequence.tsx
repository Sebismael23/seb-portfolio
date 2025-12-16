'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { bootMessages } from '@/lib/data'

interface BootSequenceProps {
  onComplete: () => void
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  const runBootSequence = useCallback(async () => {
    let fullText = ''

    for (const message of bootMessages) {
      // Type each character
      for (const char of message) {
        fullText += char
        setDisplayedText(fullText)
        await new Promise((resolve) => setTimeout(resolve, 30))
      }
      // Add newline after each message
      fullText += '\n'
      setDisplayedText(fullText)
      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    // Wait a moment, then complete
    await new Promise((resolve) => setTimeout(resolve, 400))
    setIsComplete(true)
    
    // Transition out
    await new Promise((resolve) => setTimeout(resolve, 600))
    onComplete()
  }, [onComplete])

  useEffect(() => {
    runBootSequence()
  }, [runBootSequence])

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
        >
          <div className="font-mono text-sm md:text-base lg:text-lg max-w-2xl px-8">
            <pre className="text-green-400 whitespace-pre-wrap">
              {displayedText}
              <span className="terminal-cursor">█</span>
            </pre>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
