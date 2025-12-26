import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'

gsap.registerPlugin(TextPlugin)

const TerminalScreen = () => {
  const textRef = useRef()
  const fullText = `Hi there,\nI'm Tanish Jagtap\nEmail | Website | GitHub\nuser:~$ `
  
  useEffect(() => {
    // Typing animation
    gsap.to(textRef.current, {
      duration: 3,
      text: fullText,
      ease: "none",
      delay: 0.5,
    })
  }, [])

  return (
    <div className="terminal-container">
      <div className="scanlines"></div>
      <pre ref={textRef} style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
      </pre>
      <span className="cursor" />
    </div>
  )
}

export default TerminalScreen
