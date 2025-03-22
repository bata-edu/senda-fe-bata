"use client"
import React, { useState, useEffect } from "react"

export const FillBlank = ({ exercise, colors, setSelectedOption, selectedOption, locked }) => {
  // State to track multiple answers
  const [answers, setAnswers] = useState(Array.isArray(selectedOption) ? selectedOption : [selectedOption || ""])
  
  // Find all placeholder patterns (two or more underscores)
  const placeholderPattern = /_{2,}/g
  const placeholders = exercise?.content?.match(placeholderPattern) || []
  const placeholderCount = placeholders.length
  
  useEffect(() => {
    // Update the parent component with the answers
    setSelectedOption(answers)
  }, [answers, setSelectedOption])
  
  const handleAnswerChange = (index, value) => {
    setAnswers(prev => {
      const newAnswers = [...prev]
      newAnswers[index] = value
      return newAnswers
    })
  }
  
  const renderContent = () => {
    if (!exercise?.content) return null
    
    if (placeholderCount === 0) {
      // Fallback for the original single placeholder case
      const contentParts = exercise.content.includes("______")
        ? exercise.content.split("______")
        : [exercise.content, ""]
      
      return (
        <div className="flex items-center w-full justify-center gap-2">
          <span>{contentParts[0]}</span>
          <input
            type="text"
            disabled={locked}
            className={`
              border-2 rounded-md px-3 py-1 max-w-[200px]
              ${locked ? "pointer-events-none opacity-50" : "border-[#E4E7EC]"}
            `}
            value={answers[0] || ""}
            onChange={(e) => handleAnswerChange(0, e.target.value)}
            placeholder="Tu respuesta"
          />
          <span>{contentParts[1]}</span>
        </div>
      )
    }
    
    // Split content by placeholder pattern
    const contentParts = exercise.content.split(placeholderPattern)
    
    return (
      <div className="flex flex-wrap items-center justify-center gap-2">
        {contentParts.map((part, index) => (
          <React.Fragment key={index}>
            <span>{part}</span>
            {index < contentParts.length - 1 && (
              <input
                type="text"
                disabled={locked}
                className={`
                  border-2 rounded-md px-3 py-1 max-w-[200px]
                  ${locked ? "pointer-events-none opacity-50" : "border-[#E4E7EC]"}
                `}
                value={answers[index] || ""}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder="Tu respuesta"
              />
            )}
          </React.Fragment>
        ))}
      </div>
    )
  }
  
  return (
    <div className="border-[#F4F5F7] border-8 rounded-lg w-full max-w-md mx-auto">
      <div className="p-4 border-b-[#F4F5F7] border-b-4 flex justify-center">
        <span className="text-lg font-medium font-sans">
          {exercise?.description || "Completa los espacios en blanco"}
        </span>
      </div>
      <div className="p-4 w-full">
        <h2 className="font-semibold text-xl text-center font-sans mb-6">
          {exercise?.prompt || "Completa la siguiente frase:"}
        </h2>
        <div className="flex flex-col items-center justify-center">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}