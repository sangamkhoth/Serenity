'use client'

import { useState, useEffect } from 'react'
import { mockReflectionQuestions } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase/client'

const moods = ['😔', '😕', '😐', '🙂', '😊']

// Hardcoded demo user ID
const STUDENT_ID = '11111111-1111-1111-1111-111111111111'

function getWeekStart() {
    const d = new Date()
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    const weekStart = new Date(d.setDate(diff))
    return weekStart.toISOString().split('T')[0]
}

export default function ReflectionPage() {
    const [currentQ, setCurrentQ] = useState(0)
    const [answers, setAnswers] = useState<Record<string, { mood?: number; text: string }>>({})
    const [submitted, setSubmitted] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const supabase = createClient()

    const question = mockReflectionQuestions[currentQ]
    const total = mockReflectionQuestions.length
    const current = answers[question?.id] || { text: '' }

    // Fetch existing reflection for the week
    useEffect(() => {
        const fetchExisting = async () => {
            const { data } = await supabase
                .from('reflections')
                .select('*')
                .eq('student_id', STUDENT_ID)
                .eq('week_start', getWeekStart())
                .single()
            
            if (data?.answers) {
                setAnswers(data.answers)
                setSubmitted(data.submitted)
            }
        }
        fetchExisting()
    }, [supabase])

    // Auto-save on answer change
    useEffect(() => {
        if (Object.keys(answers).length === 0) return

        setIsSaving(true)
        const timer = setTimeout(async () => {
            await supabase.from('reflections').upsert({
                student_id: STUDENT_ID,
                week_start: getWeekStart(),
                answers: answers,
                submitted: submitted, // keep current submitted state unless explicitly changed
                updated_at: new Date().toISOString()
            }, { onConflict: 'student_id, week_start' })
            setIsSaving(false)
        }, 800)

        return () => clearTimeout(timer)
    }, [answers, submitted, supabase])

    const handleFinalSubmit = async () => {
        setSubmitted(true)
        // Ensure final explicit save
        await supabase.from('reflections').upsert({
            student_id: STUDENT_ID,
            week_start: getWeekStart(),
            answers: answers,
            submitted: true,
            updated_at: new Date().toISOString()
        }, { onConflict: 'student_id, week_start' })
    }

    if (submitted) {
        return (
            <div style={{ maxWidth: '600px', textAlign: 'center', padding: '80px 24px 0' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '24px' }}>🌿</span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, marginBottom: '12px' }}>
                    You showed up for yourself today.
                </h2>
                <p style={{ color: 'var(--color-soft-gray)', fontWeight: 300, lineHeight: 1.7, marginBottom: '32px' }}>
                    Your reflection has been saved. Your care team will review it before your next session.
                    Thank you for taking this time — it matters.
                </p>
                <button className="btn btn-secondary" onClick={() => { setSubmitted(false); setCurrentQ(0); setAnswers({}) }}>
                    Start over
                </button>
            </div>
        )
    }

    return (
        <div style={{ maxWidth: '680px' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 400, marginBottom: '8px' }}>
                    Weekly reflection ✍️
                </h1>
                <p style={{ color: 'var(--color-soft-gray)', fontWeight: 300 }}>
                    Take your time. This is just for you.
                </p>
            </div>

            {/* Progress */}
            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-soft-gray)', fontWeight: 300 }}>
                        Question {currentQ + 1} of {total}
                    </span>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-sage-dark)' }}>
                        {Math.round(((currentQ) / total) * 100)}% complete
                    </span>
                </div>
                <div className="progress-track" style={{ height: '8px', background: 'var(--color-cream-dark)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div className="progress-fill" style={{ width: `${((currentQ) / total) * 100}%`, height: '100%', background: 'var(--color-sage-dark)', transition: 'width 0.3s ease' }} />
                </div>
            </div>

            {/* Question card */}
            <div className="card-flat animate-scale-in" style={{ marginBottom: '24px', padding: '32px', background: 'var(--color-cream)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-charcoal-6)' }}>
                <p style={{ fontSize: '11px', color: 'var(--color-soft-gray)', fontWeight: 300, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '12px' }}>
                    Question {currentQ + 1}
                </p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.25rem', marginBottom: '8px', lineHeight: 1.4 }}>
                    {question.question}
                </h3>
                <p style={{ color: 'var(--color-soft-gray)', fontSize: 'var(--text-sm)', fontStyle: 'italic', marginBottom: '24px', fontWeight: 300 }}>
                    {question.hint}
                </p>

                {/* Mood selector for first question */}
                {currentQ === 0 && (
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal)', marginBottom: '12px' }}>Select a mood:</p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {moods.map((emoji, idx) => (
                                <button
                                    key={idx}
                                    style={{
                                        fontSize: '1.5rem',
                                        padding: '8px',
                                        background: current.mood === idx ? 'var(--color-sage-15)' : 'transparent',
                                        border: `1px solid ${current.mood === idx ? 'var(--color-sage)' : 'var(--color-charcoal-6)'}`,
                                        borderRadius: 'var(--radius-md)',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => setAnswers({ ...answers, [question.id]: { ...current, mood: idx } })}
                                    aria-label={`Mood ${idx + 1}`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <textarea
                    className="input"
                    placeholder="Share your thoughts here… or just leave this blank. Either is okay."
                    value={current.text}
                    onChange={e => setAnswers({ ...answers, [question.id]: { ...current, text: e.target.value } })}
                    style={{ minHeight: '120px', width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-charcoal-15)', background: '#fff', resize: 'none' }}
                />
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                    disabled={currentQ === 0}
                    style={{ opacity: currentQ === 0 ? 0.4 : 1, padding: '8px 16px', background: 'transparent', border: 'none', cursor: currentQ === 0 ? 'not-allowed' : 'pointer' }}
                >
                    ← Back
                </button>

                <button
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--color-soft-gray)', fontSize: 'var(--text-xs)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    onClick={handleFinalSubmit}
                >
                    It&apos;s okay to skip today
                </button>

                {currentQ < total - 1 ? (
                    <button
                        className="btn btn-primary btn-sm"
                        style={{ padding: '8px 24px', background: 'var(--color-sage)', color: '#fff', border: 'none', borderRadius: '24px', cursor: 'pointer' }}
                        onClick={() => setCurrentQ(currentQ + 1)}
                    >
                        Next →
                    </button>
                ) : (
                    <button 
                        className="btn btn-primary btn-sm" 
                        style={{ padding: '8px 24px', background: 'var(--color-charcoal-dark)', color: '#fff', border: 'none', borderRadius: '24px', cursor: 'pointer' }}
                        onClick={handleFinalSubmit}
                    >
                        Submit reflection 🌿
                    </button>
                )}
            </div>

            {/* Auto-save notice */}
            <p style={{ textAlign: 'center', marginTop: '24px', fontSize: 'var(--text-xs)', color: isSaving ? 'var(--color-sage-dark)' : 'var(--color-soft-gray)', fontStyle: 'italic', transition: 'color 0.3s ease' }}>
                {isSaving ? 'Saving...' : 'Your answers are saved automatically as you write.'}
            </p>
        </div>
    )
}
