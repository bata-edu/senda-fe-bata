import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingPage from "../../pages/LoadingPage";
import "../../styles/exercise.css";
import MultipleChoice from "../exercises/MultipleChoice";
import DragNDrop from "../exercises/DragNDrop/DragNDrop";
import { UnstyledButton } from "@mantine/core";

const Exercise = ({ advance, content }) => {
  const dispatch = useDispatch();
  const { currentProgress } = useSelector(
    (state) => state.userProgress || {}
  );
  const [loading, setLoading] = useState(true);
  const [exe, setExe] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [hasFetchedInitialData, setHasFetchedInitialData] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const selectedModule = localStorage.getItem("selectedModule");

  const courseColors = {
    "67190a2ecc62ee9e8f06c57b": {
      primary: "#D9B9F3",
      secondary: "#D9B9F3",
    },
    "67190a2ecc62ee9e8f06c57c": { // Changed ID
      primary: "#E0F47E",
      secondary: "#F6FCCB",
    },
    "67190a2ecc62ee9e8f06c57d": { // Changed ID
      primary: "#4558C8", 
      secondary: "#7B97DF" 
    },
    "67190a2ecc62ee9e8f06c57e": { // Changed ID
      primary: "#EE5E37", 
      secondary: "#F9C5AF" 
    },
  };

  useEffect(() => {
    // Fixed to check if currentProgress exists before accessing .course
    if (!hasFetchedInitialData && currentProgress?.course) {
      const fetchInfo = async () => {
        setHasFetchedInitialData(true);
      };
      fetchInfo();
    }
  }, [
    dispatch,
    currentProgress,
    content,
    hasFetchedInitialData,
  ]);
  useEffect(() => {
    if (content) {
      setExe(content);
      setLoading(false);
    }
  }, [content]);

  const checkExercise = async (option) => {
    if (content) {
        if (option === exe?.answer) {
          setSuccess(true);
        } else {
          setError(true);
          return;
        }
    }
  };


  const handleCopy = (event) => {
    event.preventDefault();
  };
  
  const handleClick = (option) => {
    if (!exe) return;
    if (success || error) {
      advance(option)
    } else {
      checkExercise(option)
    }
  };

  return (
    <div
      className="flex flex-col justify-between"
      onCopy={handleCopy}
    >
      {loading && (
        <div className="flex justify-content items-center">
          <LoadingPage />
        </div>
      )}
      {!loading && exe && (
        <div className="w-full">
          {exe.template === 1 ? (
            <DragNDrop
              locked={error || success}
              exercise={content}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              colors={courseColors[selectedModule] || courseColors["67190a2ecc62ee9e8f06c57b"]}
            />
          ) : (
            <MultipleChoice
              exercise={content}
              locked={error || success}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              colors={courseColors[selectedModule] || courseColors["67190a2ecc62ee9e8f06c57b"]}
            />
          )}
        </div>
      )}
      {!loading && (
        <div className="h-36">
          <hr className="border-t border-black w-full my-0" />
          <div
            className={`${
              error ? "bg-red-500" : success ? "bg-green-500" : ""
            } h-full`}
          >
            <div className="w-1/2 mx-auto flex justify-end h-full items-center">
              <UnstyledButton
                disabled={!exe}
                onClick={() => handleClick(selectedOption)}
                className="flex items-center border-[#E4E7EC] bg-[#F2F2F7] p-3 rounded-lg h-16"
              >
                <div>
                  <svg
                    width="19"
                    height="18"
                    viewBox="0 0 19 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.7695 17.0684C12.3037 17.0684 11.9961 16.752 11.9961 16.2949C11.9961 16.0664 12.0664 15.8994 12.207 15.7588L14.7383 13.2891L16.4082 11.8652L14.3428 11.9531H3.12793C1.08008 11.9531 0.227539 11.0127 0.227539 9.02637V3.83203C0.227539 1.78418 1.08008 0.931641 3.12793 0.931641H8.0498C8.5332 0.931641 8.84961 1.2832 8.84961 1.71387C8.84961 2.14453 8.5332 2.49609 8.0498 2.49609H3.12793C2.19629 2.49609 1.79199 2.90039 1.79199 3.83203V9.02637C1.79199 9.98438 2.19629 10.3887 3.12793 10.3887H14.3428L16.4082 10.4766L14.7383 9.05273L12.207 6.58301C12.0664 6.44238 11.9961 6.2666 11.9961 6.03809C11.9961 5.58984 12.3037 5.26465 12.7695 5.26465C12.9629 5.26465 13.1914 5.36133 13.3408 5.51074L18.5088 10.582C18.6846 10.749 18.7725 10.9512 18.7725 11.1709C18.7725 11.3818 18.6846 11.5928 18.5088 11.7598L13.3408 16.8311C13.1914 16.9805 12.9629 17.0684 12.7695 17.0684Z"
                      fill="black"
                    />
                  </svg>
                </div>
                <span className="ml-2 ">{error || success ? "Continuar" : "Confirmar"}</span>
              </UnstyledButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



export default Exercise; 