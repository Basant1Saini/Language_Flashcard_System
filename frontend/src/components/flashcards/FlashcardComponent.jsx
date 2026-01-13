import { useState } from 'react'
import { RotateCcw } from 'lucide-react'

const FlashcardComponent = ({ card, isFlipped, onFlip }) => {
  if (!card) return null

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div 
        className={`flashcard ${isFlipped ? 'flipped' : ''}`}
        onClick={onFlip}
      >
        <div className="flashcard-inner">
          {/* Front of card */}
          <div className="flashcard-front">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">
                {card.front.text}
              </h3>
              {card.front.pronunciation && (
                <p className="text-lg opacity-80 mb-2">
                  [{card.front.pronunciation}]
                </p>
              )}
              {card.hints && card.hints.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm opacity-70">Hint:</p>
                  <p className="text-sm opacity-90">{card.hints[0]}</p>
                </div>
              )}
            </div>
          </div>

          {/* Back of card */}
          <div className="flashcard-back">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">
                {card.back.text}
              </h3>
              {card.back.explanation && (
                <p className="text-lg opacity-90 mb-4">
                  {card.back.explanation}
                </p>
              )}
              {card.back.examples && card.back.examples.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm opacity-70 mb-2">Examples:</p>
                  {card.back.examples.slice(0, 2).map((example, index) => (
                    <p key={index} className="text-sm opacity-90 mb-1">
                      • {example}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click indicator */}
      {!isFlipped && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-70 flex items-center gap-1">
          <RotateCcw className="w-4 h-4" />
          Click to flip
        </div>
      )}
    </div>
  )
}

export default FlashcardComponent