import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNextAction, advanceCourse } from '../features/userProgress/userProgressSlice';
import { NEXT_CLASS, NEXT_EXERCISE, ADVANCE_SECTION, SUBMIT_FINAL_LEVEL_PROJECT, ADVANCE_LEVEL, COURSE_COMPLETED } from '../utils/constants';
import SectionClass from '../components/section/Class';
import Exercise from '../components/section/Exercice';
import FinalWork from '../components/level/FinalWork';
import LoadingPage from '../pages/LoadingPage';
import { fetchUserProgress } from '../features/userProgress/userProgressSlice';

const SectionPage = () => {

  const navigate = useNavigate();
  const { sectionId } = useParams();
  const dispatch = useDispatch();
  const { progress, nextAction, loading } = useSelector((state) => state.userProgress || {});
  useEffect(() => {
    const fetchProgress = async () => {
      await dispatch(fetchUserProgress());
    };
    if (!progress) {
      fetchProgress();
    } else {
      dispatch(fetchNextAction(progress.course));
    }
  }, [dispatch, sectionId, progress]);
  

  const handleAdvance = () => {
    dispatch(fetchNextAction(progress.course))

  }

  const handleAdvanceSection = async () => {
    await dispatch(advanceCourse())
    handleAdvance()
  }

  return (
    <div>
      {loading && (
        <div className="loading">
          <LoadingPage />
        </div>
      )}
      <div>
        {nextAction?.message === NEXT_CLASS && (
          <SectionClass  advance={handleAdvance}/>
        )}
        {nextAction?.message === NEXT_EXERCISE && (
          <Exercise advance={handleAdvance}/>  
        )}
        {nextAction?.message === SUBMIT_FINAL_LEVEL_PROJECT && (
          <FinalWork 
          />
        )}
        {nextAction?.message === ADVANCE_SECTION && (
          <div>
            <h1>Section completed</h1>
            <button onClick={() => handleAdvanceSection()}>Advance Section</button>
          </div>
          )}
      </div>
    </div>
  );
};

export default SectionPage;
