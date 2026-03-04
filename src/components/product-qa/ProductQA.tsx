'use client'

import { useState, useEffect } from 'react'
import { HelpCircle, Search, Plus, X, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProductQAStore } from '@/stores/productQA'
import { useTranslation } from '@/stores/language'
import { QuestionCard } from './QuestionCard'
import { toast } from 'sonner'

interface ProductQAProps {
  productId: string
  productName: string
}

export function ProductQA({ productId, productName }: ProductQAProps) {
  const { language } = useTranslation()
  const {
    getQuestionsForProduct,
    getQuestionCount,
    getAnsweredCount,
    addQuestion,
    addAnswer,
  } = useProductQAStore()

  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAskForm, setShowAskForm] = useState(false)
  const [answeringQuestionId, setAnsweringQuestionId] = useState<string | null>(null)
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer, setNewAnswer] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const questions = mounted ? getQuestionsForProduct(productId) : []
  const questionCount = mounted ? getQuestionCount(productId) : 0
  const answeredCount = mounted ? getAnsweredCount(productId) : 0

  // Filter questions by search
  const filteredQuestions = questions.filter((q) =>
    q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.answers.some((a) => a.content.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const visibleQuestions = showAll ? filteredQuestions : filteredQuestions.slice(0, 3)

  const handleAskQuestion = () => {
    if (!newQuestion.trim()) {
      toast.error(language === 'id' ? 'Tulis pertanyaan Anda' : 'Please enter your question')
      return
    }
    if (!authorName.trim()) {
      toast.error(language === 'id' ? 'Masukkan nama Anda' : 'Please enter your name')
      return
    }

    addQuestion(productId, newQuestion.trim(), authorName.trim())
    setNewQuestion('')
    setShowAskForm(false)
    toast.success(language === 'id' ? 'Pertanyaan berhasil diajukan!' : 'Question submitted successfully!')
  }

  const handleSubmitAnswer = (questionId: string) => {
    if (!newAnswer.trim()) {
      toast.error(language === 'id' ? 'Tulis jawaban Anda' : 'Please enter your answer')
      return
    }
    if (!authorName.trim()) {
      toast.error(language === 'id' ? 'Masukkan nama Anda' : 'Please enter your name')
      return
    }

    addAnswer(questionId, newAnswer.trim(), authorName.trim(), 'customer')
    setNewAnswer('')
    setAnsweringQuestionId(null)
    toast.success(language === 'id' ? 'Jawaban berhasil dikirim!' : 'Answer submitted successfully!')
  }

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded animate-pulse w-48" />
        <div className="h-32 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <HelpCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">
              {language === 'id' ? 'Tanya Jawab Produk' : 'Product Q&A'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {questionCount} {language === 'id' ? 'pertanyaan' : 'questions'}
              {answeredCount > 0 && (
                <span className="text-green-600 ml-1">
                  ({answeredCount} {language === 'id' ? 'terjawab' : 'answered'})
                </span>
              )}
            </p>
          </div>
        </div>

        <Button onClick={() => setShowAskForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {language === 'id' ? 'Ajukan Pertanyaan' : 'Ask a Question'}
        </Button>
      </div>

      {/* Search */}
      {questions.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'id' ? 'Cari pertanyaan...' : 'Search questions...'}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}

      {/* Ask Question Form */}
      {showAskForm && (
        <div className="bg-muted/50 rounded-xl p-4 border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">
              {language === 'id' ? 'Ajukan Pertanyaan' : 'Ask a Question'}
            </h3>
            <button
              onClick={() => setShowAskForm(false)}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder={language === 'id' ? 'Nama Anda' : 'Your name'}
              className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder={language === 'id' ? `Apa yang ingin Anda ketahui tentang ${productName}?` : `What would you like to know about ${productName}?`}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAskForm(false)}>
                {language === 'id' ? 'Batal' : 'Cancel'}
              </Button>
              <Button onClick={handleAskQuestion}>
                <Send className="h-4 w-4 mr-2" />
                {language === 'id' ? 'Kirim' : 'Submit'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      {filteredQuestions.length > 0 ? (
        <div className="space-y-4">
          {visibleQuestions.map((question) => (
            <div key={question.id}>
              <QuestionCard
                question={question}
                onAnswer={() => setAnsweringQuestionId(question.id)}
              />

              {/* Answer Form */}
              {answeringQuestionId === question.id && (
                <div className="mt-4 ml-4 bg-muted/50 rounded-lg p-4 border">
                  <h4 className="font-medium mb-3">
                    {language === 'id' ? 'Jawab pertanyaan ini' : 'Answer this question'}
                  </h4>
                  <div className="space-y-3">
                    {!authorName && (
                      <input
                        type="text"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder={language === 'id' ? 'Nama Anda' : 'Your name'}
                        className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    )}
                    <textarea
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      placeholder={language === 'id' ? 'Tulis jawaban Anda...' : 'Write your answer...'}
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setAnsweringQuestionId(null)
                          setNewAnswer('')
                        }}
                      >
                        {language === 'id' ? 'Batal' : 'Cancel'}
                      </Button>
                      <Button size="sm" onClick={() => handleSubmitAnswer(question.id)}>
                        <Send className="h-4 w-4 mr-2" />
                        {language === 'id' ? 'Kirim Jawaban' : 'Submit Answer'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Show More */}
          {filteredQuestions.length > 3 && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll
                ? (language === 'id' ? 'Tampilkan Lebih Sedikit' : 'Show Less')
                : (language === 'id' ? `Lihat Semua ${filteredQuestions.length} Pertanyaan` : `View All ${filteredQuestions.length} Questions`)
              }
            </Button>
          )}
        </div>
      ) : questions.length > 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {language === 'id' ? 'Tidak ada pertanyaan yang cocok dengan pencarian Anda' : 'No questions match your search'}
          </p>
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-xl">
          <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">
            {language === 'id' ? 'Belum ada pertanyaan' : 'No questions yet'}
          </p>
          <p className="text-muted-foreground mb-4">
            {language === 'id' ? 'Jadilah yang pertama bertanya tentang produk ini' : 'Be the first to ask about this product'}
          </p>
          <Button onClick={() => setShowAskForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {language === 'id' ? 'Ajukan Pertanyaan' : 'Ask a Question'}
          </Button>
        </div>
      )}
    </div>
  )
}
