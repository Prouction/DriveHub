'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Navbar() {
  const [nickname, setNickname] = useState<string | null>(null)

  useEffect(() => {
    // ✅ localStorage에서 닉네임 불러오기
    const storedName = localStorage.getItem('nickname')
    if (storedName) setNickname(storedName)

    // ✅ 세션 변화 감지
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase
          .from('users')
          .select('nickname')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data?.nickname) {
              setNickname(data.nickname)
              localStorage.setItem('nickname', data.nickname)
            }
          })
      } else {
        setNickname(null)
        localStorage.removeItem('nickname')
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('nickname')
    setNickname(null)
    window.location.href = '/'
  }

  return (
    <nav
      style={{
        background: '#0b0b0b',
        color: '#fff',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #222',
      }}
    >
      {/* 왼쪽: 홈 로고 */}
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
        <Link href="/">DriveMate 🚗</Link>
      </div>

      {/* 오른쪽: 유저 상태 */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {nickname ? (
          <>
            <span style={{ opacity: 0.8 }}>{nickname}님 안녕하세요 👋</span>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: '1px solid #444',
                color: '#fff',
                borderRadius: '0.5rem',
                padding: '0.3rem 0.7rem',
                cursor: 'pointer',
              }}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link href="/login">로그인</Link>
            <Link href="/signup">회원가입</Link>
          </>
        )}
      </div>
    </nav>
  )
}
