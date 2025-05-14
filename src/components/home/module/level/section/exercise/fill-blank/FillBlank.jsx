"use client";
import React, { useState, useEffect } from "react";

export const FillBlank = ({
  exercise,
  colors,
  setSelectedOption,
  selectedOption,
  locked,
}) => {
  // Initialize answers state properly
    const [answers, setAnswers] = useState([]);

  // Find all placeholder patterns (two or more underscores)
  const placeholderPattern = /_{2,}/g;
  const placeholders = exercise?.content?.match(placeholderPattern) || [];
  const placeholderCount = Math.max(placeholders.length, 1); // At least 1 placeholder

  // Update parent component with answers whenever they change
  useEffect(() => {
    // Only update if answers has changed and has valid values
    if (answers.length > 0) {
      setSelectedOption(answers);
    }
  }, [answers, setSelectedOption]);

  // Reset answers when exercise changes
  useEffect(() => {
    // Create a new array with the right number of slots
    const newPlaceholderCount = Math.max(
      (exercise?.content?.match(/_{2,}/g) || []).length,
      1
    );

    setAnswers(Array(newPlaceholderCount));
  }, [exercise?.content]);

  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[index] = value;
      return newAnswers;
    });
  };

  const renderContent = () => {
    if (!exercise?.content) return null;

    // Dividir el contenido por líneas primero
    const lines = exercise.content.split("\n");
    return (
      <>
        {lines.map((line, lineIdx) => {
          // Procesar cada línea por separado para los placeholders
          const parts = line.split(placeholderPattern);
          return (
            <div key={lineIdx} className="inline-flex flex-wrap my-0.5 items-center whitespace-pre-wrap w-full">
              {parts.map((part, index) => (
                <React.Fragment key={index}>
                  <span className="inline whitespace-pre-wrap">{part}</span>
                  {index < parts.length - 1 && (
                    <input
                      type="text"
                      disabled={locked}
                      className={`mx-1 appearance-none rounded-md px-2 py-1 border-2 min-w-[80px] max-w-[150px] inline-block ${locked ? "pointer-events-none opacity-50" : "border-[#E4E7EC]"}`}
                      value={answers[
                        // Calcular el índice global del input considerando líneas anteriores
                        lines.slice(0, lineIdx).reduce((acc, l) => acc + (l.match(placeholderPattern)?.length || 0), 0) + index
                      ]}
                      onChange={e => handleAnswerChange(
                        lines.slice(0, lineIdx).reduce((acc, l) => acc + (l.match(placeholderPattern)?.length || 0), 0) + index,
                        e.target.value
                      )}
                      placeholder=""
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className="border-[#F4F5F7] border-8 rounded-lg w-full max-w-5xl mx-auto">
      <div className="p-4 w-full border-b-2 border-[#E4E7EC]">
        <h2 className="font-semibold text-xl text-center font-sans">
          {exercise?.prompt}
        </h2>
      </div>
      <div className="w-full font-mono flex justify-center">
        <div className="inline-flex flex-wrap items-center justify-center w-fit whitespace-pre-wrap p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
