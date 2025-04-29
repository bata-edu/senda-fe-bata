"use client"
import React, { useState, useEffect } from "react"

export const FillBlank = ({ exercise, colors, setSelectedOption, selectedOption, locked }) => {
  // Initialize answers state properly
  const [answers, setAnswers] = useState(() => {
    // If selectedOption is an array and has values, use it
    if (Array.isArray(selectedOption) && selectedOption.length > 0) {
      return selectedOption
    }

    // Otherwise, create an empty array with the right number of slots
    const placeholderPattern = /_{2,}/g
    const placeholders = exercise?.content?.match(placeholderPattern) || []
    const placeholderCount = Math.max(placeholders.length, 1) // At least 1 placeholder

    return Array(placeholderCount).fill("")
  })

  // Find all placeholder patterns (two or more underscores)
  const placeholderPattern = /_{2,}/g
  const placeholders = exercise?.content?.match(placeholderPattern) || []
  const placeholderCount = Math.max(placeholders.length, 1) // At least 1 placeholder

  // Update parent component with answers whenever they change
  useEffect(() => {
    // Only update if answers has changed and has valid values
    if (answers.length > 0) {
      setSelectedOption(answers)
    }
  }, [answers, setSelectedOption])

  // Reset answers when exercise changes
  useEffect(() => {
    // Create a new array with the right number of slots
    const newPlaceholderCount = Math.max((exercise?.content?.match(/_{2,}/g) || []).length, 1)

    setAnswers(Array(newPlaceholderCount).fill(""))
  }, [exercise?.content])

  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => {
      const newAnswers = [...prev]
      newAnswers[index] = value
      return newAnswers
    })
  }

  const renderContent = () => {
    if (!exercise?.content) return null

    // Handle the case where there's no explicit placeholder but we still need an input
    if (placeholderCount === 0 || !exercise.content.match(placeholderPattern)) {
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
      <>
        {contentParts.map((part, index) => (
          <React.Fragment key={index}>
            {/* Display text content safely */}
            <span className="inline whitespace-pre-wrap">{part}</span>

            {/* Add input field after each part except the last one */}
            {index < contentParts.length - 1 && (
              <input
                type="text"
                disabled={locked}
                className={`
                  mx-1 appearance-none rounded-md px-2 py-1
                  border-2 min-w-[80px] max-w-[150px] inline-block
                  ${locked ? "pointer-events-none opacity-50" : "border-[#E4E7EC]"}
                `}
                value={answers[index] || ""}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder="..."
              />
            )}
          </React.Fragment>
        ))}
      </>
    )
  }

  return (
    <div className="border-[#F4F5F7] border-8 rounded-lg w-full max-w-5xl mx-auto">
      <div className="p-4 w-full border-b-2 border-[#E4E7EC]">
        <h2 className="font-semibold text-xl text-center font-sans">
          {exercise?.prompt}
        </h2>
      </div>
        <div className="flex p-4 flex-col items-center justify-center font-mono">{renderContent()}</div>
    </div>
  )
}

