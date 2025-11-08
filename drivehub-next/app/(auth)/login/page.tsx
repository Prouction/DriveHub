'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('로그인 실패: 이메일 또는 비밀번호를 확인하세요.')
      return
    }

    // ✅ 로그인 성공 시 닉네임 가져오기
    if (data.user) {
      const { data: userData } = await supabase
        .from('users')
        .select('nickname')
        .eq('id', data.user.id)
        .single()

      if (userData?.nickname) {
        localStorage.setItem('nickname', userData.nickname)
      }
    }

    router.push('/')
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
        onSubmit={handleLogin}
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
        <h2 style={{ textAlign: 'center' }}>로그인</h2>

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

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

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
          로그인
        </button>
      </form>
    </div>
  )
}
