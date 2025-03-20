"use client"
import React, { useState, useEffect } from "react"
import { useDragAndDrop } from "../../../../utils/hooks/useDragAndDrop"

const DragNDrop = ({ exercise, setSelectedOption, colors }) => {
  const [droppedAnswers, setDroppedAnswers] = useState({})
  const { isDragging, handleDragging } = useDragAndDrop()
  const isMultipleAnswers = exercise.isMultipleAnswers
  
  // Find all placeholder patterns (two or more underscores)
  const placeholderPattern = /_{2,}/g
  const placeholders = exercise.content.match(placeholderPattern) || []
  const placeholderCount = placeholders.length
  
  useEffect(() => {
    if (Object.keys(droppedAnswers).length > 0) {
      // Convert droppedAnswers object to array format for submission
      const answersArray = Object.values(droppedAnswers).filter(Boolean)
      setSelectedOption(answersArray)
    } else {
      setSelectedOption([])
    }
  }, [droppedAnswers, setSelectedOption])
  
  const handleDragStart = (e, option) => {
    e.dataTransfer.setData("text", option)
    handleDragging(true)
  }
  
  const handleDrop = (e, placeholderIndex) => {
    e.preventDefault()
    handleDragging(false)
    const option = e.dataTransfer.getData("text")
    
    setDroppedAnswers(prev => ({
      ...prev,
      [placeholderIndex]: option
    }))
  }
  
  const handleDragOver = (e) => e.preventDefault()
  
  const handleRemoveAnswer = (placeholderIndex) => {
    setDroppedAnswers(prev => {
      const newAnswers = { ...prev }
      delete newAnswers[placeholderIndex]
      return newAnswers
    })
  }
  
  const renderContent = () => {
    if (placeholderCount === 0) {
      // Fallback to single placeholder if no pattern found
      const parts = exercise.content.split("______")
      
      if (parts.length === 1) return <span>{exercise.content}</span>
      
      return (
        <>
          {parts[0]}
          <span className={`
            relative mx-1 px-2 py-1 rounded-md min-w-[60px] inline-block
            ${isDragging ? 'bg-[#4558C8]/10' : droppedAnswers[0] ? 'bg-[#F0F4FF]' : 'bg-gray-100'}
            ${droppedAnswers[0] ? 'border border-[#4558C8]' : ''}
          `}
          onDrop={(e) => handleDrop(e, 0)}
          onDragOver={handleDragOver}
          >
            {droppedAnswers[0] ? (
              <>
                {droppedAnswers[0]}
                <button 
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  onClick={() => handleRemoveAnswer(0)}
                >
                  ×
                </button>
              </>
            ) : '_____'}
          </span>
          {parts[1]}
        </>
      )
    }
    
    // Split content by placeholder pattern
    const contentParts = exercise.content.split(placeholderPattern)
    
    return (
      <>
        {contentParts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < contentParts.length - 1 && (
              <span
                className={`
                  relative mx-1 px-2 py-1 rounded-md min-w-[60px] inline-block
                  ${isDragging ? 'bg-[#4558C8]/10' : droppedAnswers[index] ? 'bg-[#F0F4FF]' : 'bg-gray-100'}
                  ${droppedAnswers[index] ? 'border border-[#4558C8]' : 'border border-gray-300'}
                `}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}
              >
                {droppedAnswers[index] ? (
                  <>
                    {droppedAnswers[index]}
                    <button 
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      onClick={() => handleRemoveAnswer(index)}
                    >
                      ×
                    </button>
                  </>
                ) : '_____'}
              </span>
            )}
          </React.Fragment>
        ))}
      </>
    )
  }
  
  // Get all dropped answers
  const usedOptions = Object.values(droppedAnswers).filter(Boolean)
  
  // Get options that haven't been dropped yet or all options if isMultipleAnswers is true
  const availableOptions = isMultipleAnswers 
    ? exercise?.options 
    : exercise?.options.filter(option => !usedOptions.includes(option))
  
  return (
    <div className="border-[#F4F5F7] border-8 rounded-lg w-full max-w-md mx-auto">
      <div className="p-4 border-b-[#F4F5F7] border-b-4 flex justify-center">
        <span className="text-lg font-medium font-sans">
          {isMultipleAnswers ? "Arrastra las respuestas correctas" : "Arrastra la respuesta correcta"}
        </span>
      </div>
      <div className="p-4 w-full">
        <div
          className={`
            p-6 min-h-[100px] flex items-center justify-center rounded-lg
            ${isDragging ? "border-2 border-dashed border-[#4558C8] bg-[#4558C8]/5" : "border-2 border-[#F4F5F7]"}
          `}
        >
          <h2 className="font-semibold text-xl text-center font-sans">
            {renderContent()}
          </h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <span className="mr-2">Opciones:</span>
          {availableOptions.map((option, index) => (
            <div
              key={index}
              className="px-3 py-1 bg-gray-100 rounded-md border border-gray-300 cursor-grab"
              draggable
              onDragStart={(e) => handleDragStart(e, option)}
              onDragEnd={() => handleDragging(false)}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DragNDrop