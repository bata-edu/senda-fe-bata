"use client"

import { useState, useEffect } from "react"
import DragNDrop from "./drag-drop/DragNDrop"
import { FillBlank } from "./fill-blank/FillBlank"
import MultipleChoice from "./multiple-choice/MultipleChoice"

const getTemplate = (templateNum) => {
  switch (templateNum) {
    case 1:
      return "dragAndDrop"
    case 2:
      return "multipleChoice"
    case 3:
      return "fillBlank"
    default:
      return "multipleChoice"
  }
}

const Exercise = ({ content, advance }) => {
  const [selectedOption, setSelectedOption] = useState(content?.ismultiple_answers ? [] : "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)
  const [feedbackState, setFeedbackState] = useState(null) // null, "incomplete", "correct", or "incorrect"
  const colors = { primary: "#4558C8" }

  // Reset state when content changes
  useEffect(() => {
    if (!content) return
    setSelectedOption([])
    setIsAnswered(false)
    setFeedbackState(null)
    setIsSubmitting(false)
  }, [content])

  
  const validateCompleteness = () => {
    // For multiple answers (arrays)
    if (Array.isArray(selectedOption)) {
      // For drag and drop with multiple placeholders or multiple choice with multiple answers
      const expectedAnswerCount = content.ismultiple_answers
        ? content.answers?.length
        : (content.content?.match(/_{2,}/g) || []).length || 1

      return selectedOption.length >= expectedAnswerCount
    }

    // For text input or single selection
    return selectedOption !== ""
  }

  const checkCorrectness = () => {
    const answers = content.answers || []
    if (selectedOption.length !== answers.length) return false;
    return selectedOption.every((option, index) => option === answers[index])
  }

  const handleSubmit = () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    if (isAnswered && ["correct", "incorrect"].includes(feedbackState)) {
      advance(selectedOption);
      return;
    }

    if (!validateCompleteness()) {
      setFeedbackState("incomplete")
      setIsSubmitting(false)
      return
    }

    const is_correct = checkCorrectness()
    setFeedbackState(is_correct ? "correct" : "incorrect")
    setIsAnswered(true)
    setIsSubmitting(false)
  }

  const renderFeedback = () => {
    if (!feedbackState || feedbackState === "incomplete") return null

    return (
      <div
        className={`
        mt-4 p-3 rounded-lg text-center
        ${feedbackState === "correct" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
      `}
      >
        {feedbackState === "correct" ? "¡Correcto!" : "Incorrecto..."}
      </div>
    )
  }

  const renderExerciseType = (type) => {
    switch (type) {
      case "fillBlank":
        return (
          <FillBlank
            exercise={content}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            locked={isAnswered}
            colors={colors}
          />
        )
      case "dragAndDrop":
        return <DragNDrop exercise={content} setSelectedOption={setSelectedOption} colors={colors} />
      case "multipleChoice":
      default:
        return (
          <MultipleChoice
            exercise={content}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            locked={isAnswered}
            colors={colors}
          />
        )
    }
  }

  const exerciseType = getTemplate(content.template)

  const getButtonLabel = () => {
    if (isSubmitting) return "Verificando..."
    if (feedbackState === "incomplete") return "Incompleto"
    if (isAnswered) return "Continuar"
    return "Comprobar"
  }

  return (
    <div className="space-y-6">
      <p className="max-w-5xl mx-auto text-center">{content?.description}</p>
      {renderExerciseType(exerciseType)}

      {feedbackState === "incomplete" && (
        <div className="text-center text-amber-600">Por favor, completa todos los campos antes de continuar.</div>
      )}

      {renderFeedback()}

      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`
            w-full max-w-md py-2 rounded-lg text-white
            ${
              isSubmitting
                ? "bg-gray-400"
              : feedbackState === "incomplete"
                ? "bg-amber-500"
              : feedbackState === "correct"
                ? "bg-green-600"
              : feedbackState === "incorrect"
                ? "bg-red-600"
              : !selectedOption || (Array.isArray(selectedOption) && selectedOption.length === 0)
                ? "bg-gray-400"
                : "bg-[#4558C8]"
            }
          `}
        >
          {getButtonLabel()}
        </button>
      </div>
    </div>
  )
}

export default Exercise

