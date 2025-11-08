'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // ✅ 1) 이메일 & 비밀번호로 Supabase 회원가입
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      return
    }

    // ✅ 2) 유저 테이블에 닉네임 저장
    if (data.user) {
      const { error: insertError } = await supabase.from('users').insert([
        {
          id: data.user.id,
          nickname,
        },
      ])

      if (insertError) {
        console.error('유저 데이터 저장 실패:', insertError.message)
        setError('회원정보 저장 중 오류가 발생했습니다.')
        return
      }
    }

    alert('회원가입이 완료되었습니다! 이메일 인증 후 로그인해주세요.')
    router.push('/login')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0b0b0b',
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <form
        onSubmit={handleSignup}
        style={{
          background: '#111',
          padding: '2rem',
          borderRadius: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '300px',
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)',
        }}
      >
        <h2 style={{ textAlign: 'center' }}>회원가입</h2>

        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
          style={{
            padding: '0.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #333',
            backgroundColor: '#222',
            color: '#fff',
          }}
        />

        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: '0.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #333',
            backgroundColor: '#222',
            color: '#fff',
          }}
        />

        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: '0.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #333',
            backgroundColor: '#222',
            color: '#fff',
          }}
        />

        {error && (
          <p style={{ color: 'red', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>
        )}

        <button
          type="submit"
          style={{
            backgroundColor: '#00c2ff',
            color: '#000',
            padding: '0.7rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          회원가입
        </button>
      </form>
    </div>
  )
}
