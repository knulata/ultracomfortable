'use client'

import { useState } from 'react'
import { ThumbsUp, MessageCircle, CheckCircle, Store, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Question, Answer, useProductQAStore } from '@/stores/productQA'
import { useTranslation } from '@/stores/language'

interface QuestionCardProps {
  question: Question
  onAnswer?: () => void
}

function AnswerItem({ answer }: { answer: Answer }) {
  const { language } = useTranslation()
  const { markHelpful, hasVotedHelpful } = useProductQAStore()
  const hasVoted = hasVotedHelpful('answer', answer.id)

  const authorBadge = () => {
    switch (answer.authorType) {
      case 'seller':
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            <Store className="h-3 w-3" />
            {language === 'id' ? 'Penjual' : 'Seller'}
          </span>
        )
      case 'verified_buyer':
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
            <ShoppingBag className="h-3 w-3" />
            {language === 'id' ? 'Pembeli Terverifikasi' : 'Verified Buyer'}
          </span>
        )
      default:
        return null
    }
  }

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return language === 'id' ? 'Hari ini' : 'Today'
    if (diffDays === 1) return language === 'id' ? 'Kemarin' : 'Yesterday'
    if (diffDays < 7) return language === 'id' ? `${diffDays} hari lalu` : `${diffDays} days ago`
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return language === 'id' ? `${weeks} minggu lalu` : `${weeks} week${weeks > 1 ? 's' : ''} ago`
    }
    const months = Math.floor(diffDays / 30)
    return language === 'id' ? `${months} bulan lalu` : `${months} month${months > 1 ? 's' : ''} ago`
  }

  return (
    <div className="pl-4 border-l-2 border-muted">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-medium text-sm">{answer.authorName}</span>
        {authorBadge()}
        <span className="text-xs text-muted-foreground">{timeAgo(answer.createdAt)}</span>
      </div>

      <p className="text-sm text-foreground mb-2">{answer.content}</p>

      <button
        onClick={() => !hasVoted && markHelpful('answer', answer.id)}
        disabled={hasVoted}
        className={`flex items-center gap-1 text-xs transition-colors ${
          hasVoted
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <ThumbsUp className={`h-3.5 w-3.5 ${hasVoted ? 'fill-current' : ''}`} />
        <span>
          {answer.helpfulCount > 0
            ? `${answer.helpfulCount} ${language === 'id' ? 'terbantu' : 'helpful'}`
            : (language === 'id' ? 'Membantu' : 'Helpful')
          }
        </span>
      </button>
    </div>
  )
}

export function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const { language } = useTranslation()
  const { markHelpful, hasVotedHelpful } = useProductQAStore()
  const [showAllAnswers, setShowAllAnswers] = useState(false)
  const hasVoted = hasVotedHelpful('question', question.id)

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return language === 'id' ? 'Hari ini' : 'Today'
    if (diffDays === 1) return language === 'id' ? 'Kemarin' : 'Yesterday'
    if (diffDays < 7) return language === 'id' ? `${diffDays} hari lalu` : `${diffDays} days ago`
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return language === 'id' ? `${weeks} minggu lalu` : `${weeks} week${weeks > 1 ? 's' : ''} ago`
    }
    const months = Math.floor(diffDays / 30)
    return language === 'id' ? `${months} bulan lalu` : `${months} month${months > 1 ? 's' : ''} ago`
  }

  const visibleAnswers = showAllAnswers ? question.answers : question.answers.slice(0, 2)
  const hasMoreAnswers = question.answers.length > 2

  return (
    <div className="border rounded-lg p-4">
      {/* Question */}
      <div className="mb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">Q</span>
              <span className="text-sm text-muted-foreground">{question.authorName}</span>
              <span className="text-xs text-muted-foreground">• {timeAgo(question.createdAt)}</span>
            </div>
            <p className="font-medium">{question.content}</p>
          </div>

          {question.isAnswered && (
            <div className="flex items-center gap-1 text-green-600 text-xs">
              <CheckCircle className="h-4 w-4" />
              <span>{language === 'id' ? 'Terjawab' : 'Answered'}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 mt-3">
          <button
            onClick={() => !hasVoted && markHelpful('question', question.id)}
            disabled={hasVoted}
            className={`flex items-center gap-1 text-xs transition-colors ${
              hasVoted
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ThumbsUp className={`h-3.5 w-3.5 ${hasVoted ? 'fill-current' : ''}`} />
            <span>{question.helpfulCount}</span>
          </button>

          {onAnswer && (
            <button
              onClick={onAnswer}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{language === 'id' ? 'Jawab' : 'Answer'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Answers */}
      {question.answers.length > 0 && (
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded">A</span>
            <span className="text-sm text-muted-foreground">
              {question.answers.length} {language === 'id' ? 'jawaban' : question.answers.length === 1 ? 'answer' : 'answers'}
            </span>
          </div>

          <div className="space-y-4">
            {visibleAnswers.map((answer) => (
              <AnswerItem key={answer.id} answer={answer} />
            ))}
          </div>

          {hasMoreAnswers && (
            <button
              onClick={() => setShowAllAnswers(!showAllAnswers)}
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              {showAllAnswers ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  {language === 'id' ? 'Sembunyikan' : 'Show less'}
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  {language === 'id' ? `Lihat ${question.answers.length - 2} jawaban lainnya` : `Show ${question.answers.length - 2} more answers`}
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* No answers yet */}
      {question.answers.length === 0 && (
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground italic">
            {language === 'id' ? 'Belum ada jawaban. Jadilah yang pertama menjawab!' : 'No answers yet. Be the first to answer!'}
          </p>
        </div>
      )}
    </div>
  )
}
