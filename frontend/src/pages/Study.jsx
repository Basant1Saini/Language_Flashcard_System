import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeft, RotateCcw, CheckCircle, XCircle } from 'lucide-react'
import { fetchFlashcards, reviewFlashcard, startStudySession, nextCard, endStudySession } from '../context/slices/flashcardSlice'
import FlashcardComponent from '../components/flashcards/FlashcardComponent'
import StudyProgress from '../components/flashcards/StudyProgress'

const Study = () => {
  const { deckId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { flashcards, studySession, loading } = useSelector(state => state.flashcards)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    if (deckId) {
      dispatch(fetchFlashcards({ deckId, params: { dueOnly: true } }))
    }
  }, [dispatch, deckId])

  useEffect(() => {
    if (flashcards.length > 0 && !studySession.isActive) {
      dispatch(startStudySession(flashcards))
    }
  }, [flashcards, studySession.isActive, dispatch])

  const currentCard = studySession.cards[studySession.currentIndex]
  const isLastCard = studySession.currentIndex === studySession.cards.length - 1

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    if (!isFlipped) {
      setShowResult(true)
    }
  }

  const handleAnswer = async (quality, wasCorrect) => {
    if (!currentCard) return

    const reviewData = {
      quality,
      wasCorrect,
      responseTime: 5000 // Could track actual time
    }

    await dispatch(reviewFlashcard({ id: currentCard._id, reviewData }))

    if (isLastCard) {
      dispatch(endStudySession())
      navigate('/dashboard')
    } else {
      dispatch(nextCard())
      setIsFlipped(false)
      setShowResult(false)
    }
  }

  const handleEndSession = () => {
    dispatch(endStudySession())
    navigate('/dashboard')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!studySession.isActive || studySession.cards.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-success-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Great job!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          No cards are due for review right now.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-primary"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleEndSession}
          className="btn btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          End Session
        </button>
        <StudyProgress
          current={studySession.currentIndex + 1}
          total={studySession.cards.length}
        />
      </div>

      {/* Flashcard */}
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <FlashcardComponent
            card={currentCard}
            isFlipped={isFlipped}
            onFlip={handleFlip}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center">
        {!isFlipped ? (
          <button
            onClick={handleFlip}
            className="btn btn-primary flex items-center gap-2 px-8 py-3"
          >
            <RotateCcw className="w-4 h-4" />
            Show Answer
          </button>
        ) : showResult ? (
          <div className="flex gap-4">
            <button
              onClick={() => handleAnswer(0, false)}
              className="btn btn-error flex items-center gap-2 px-6 py-3"
            >
              <XCircle className="w-4 h-4" />
              Again
            </button>
            <button
              onClick={() => handleAnswer(2, false)}
              className="btn btn-warning flex items-center gap-2 px-6 py-3"
            >
              Hard
            </button>
            <button
              onClick={() => handleAnswer(3, true)}
              className="btn btn-success flex items-center gap-2 px-6 py-3"
            >
              <CheckCircle className="w-4 h-4" />
              Good
            </button>
            <button
              onClick={() => handleAnswer(5, true)}
              className="btn btn-primary flex items-center gap-2 px-6 py-3"
            >
              Easy
            </button>
          </div>
        ) : null}
      </div>

      {/* Card Info */}
      {currentCard && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Card {studySession.currentIndex + 1} of {studySession.cards.length}
        </div>
      )}
    </div>
  )
}

export default Study