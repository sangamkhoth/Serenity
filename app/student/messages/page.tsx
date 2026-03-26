'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

// Hardcoded IDs from our seed script to bypass actual auth flow
const STUDENT_ID = '11111111-1111-1111-1111-111111111111'
const PSYCHOLOGIST_ID = '22222222-2222-2222-2222-222222222222'
const THREAD_ID = '33333333-3333-3333-3333-333333333333'

export default function MessagesPage() {
    const [newMessage, setNewMessage] = useState('')
    const [messages, setMessages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('thread_id', THREAD_ID)
                .order('created_at', { ascending: true })

            if (data) {
                setMessages(data)
            }
            setLoading(false)
        }
        
        // Initial fetch
        fetchMessages()

        // Realtime subscription
        const channel = supabase.channel('realtime messages')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `thread_id=eq.${THREAD_ID}`,
            }, (payload) => {
                setMessages(current => [...current, payload.new])
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    const handleSend = async () => {
        if (!newMessage.trim()) return

        // Optimistic UI update could go here, but with realtime we can also just wait
        const content = newMessage.trim()
        setNewMessage('') // Clear input quickly

        await supabase.from('messages').insert({
            sender_id: STUDENT_ID,
            recipient_id: PSYCHOLOGIST_ID,
            thread_id: THREAD_ID,
            content: content
        })
    }

    return (
        <div style={{ maxWidth: '700px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 400, marginBottom: '8px' }}>
                    Messages 💬
                </h1>
                <p style={{ color: 'var(--color-soft-gray)', fontWeight: 300 }}>Your private thread with your care team.</p>
            </div>

            {/* Crisis disclaimer */}
            <div className="crisis-disclaimer" style={{ marginBottom: '20px' }}>
                <span>⚠️</span>
                <span>
                    This is not for emergencies. If you&apos;re in crisis, please call <strong>112</strong> or your university&apos;s crisis line immediately.
                </span>
            </div>

            {/* Mentor card */}
            <div className="card-flat" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-sage-light), var(--color-clay))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem',
                }}>👩‍⚕️</div>
                <div>
                    <p style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>Dr. Sarah Williams</p>
                    <p style={{ color: 'var(--color-soft-gray)', fontSize: 'var(--text-xs)', fontWeight: 300 }}>
                        Clinical Psychologist · Replies within 24 hours on weekdays
                    </p>
                </div>
                <span className="status-tag status-improving" style={{ marginLeft: 'auto' }}>Active</span>
            </div>

            {/* Messages */}
            <div style={{
                flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px',
                padding: '4px 0', marginBottom: '20px',
            }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-soft-gray)' }}>Loading messages...</div>
                ) : messages.map(msg => {
                    const isStudent = msg.sender_id === STUDENT_ID
                    return (
                        <div key={msg.id} style={{
                            display: 'flex', flexDirection: 'column',
                            alignItems: isStudent ? 'flex-end' : 'flex-start',
                        }}>
                            <div style={{
                                maxWidth: '75%',
                                padding: '14px 18px',
                                borderRadius: isStudent
                                    ? '16px 16px 4px 16px'
                                    : '16px 16px 16px 4px',
                                background: isStudent ? 'var(--color-sage)' : 'var(--color-cream-dark)',
                                border: isStudent ? 'none' : '1px solid var(--color-charcoal-6)',
                                color: isStudent ? 'white' : 'var(--color-charcoal)',
                                fontSize: 'var(--text-sm)',
                                lineHeight: 1.6,
                            }}>
                                {msg.content}
                            </div>
                            <p style={{
                                fontSize: '11px',
                                color: 'var(--color-soft-gray)',
                                marginTop: '4px',
                                fontWeight: 300,
                            }}>
                                {new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                {msg.is_read && isStudent && ' · Read ✓'}
                            </p>
                        </div>
                    )
                })}
                {!loading && messages.length === 0 && (
                     <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-soft-gray)' }}>No messages yet. Send a message to start the conversation!</div>
                )}
            </div>

            {/* Input */}
            <div style={{
                display: 'flex', gap: '12px', alignItems: 'flex-end',
                padding: '16px',
                background: 'var(--color-cream-dark)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-charcoal-6)',
            }}>
                <textarea
                    className="input"
                    style={{ flex: 1, minHeight: '48px', maxHeight: '120px', resize: 'none' }}
                    placeholder="Write a message… take your time."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                />
                <button
                    className="btn btn-primary"
                    onClick={handleSend}
                    disabled={!newMessage.trim()}
                    style={{ flexShrink: 0, opacity: newMessage.trim() ? 1 : 0.5 }}
                >
                    Send
                </button>
            </div>
        </div>
    )
}
