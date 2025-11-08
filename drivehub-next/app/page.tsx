'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function HomePage() {
  const [nickname, setNickname] = useState<string | null>(null)

  useEffect(() => {
    const storedName = localStorage.getItem('nickname')
    if (storedName) {
      setNickname(storedName)
      return
    }

    // 세션에서 닉네임 가져오기
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('nickname')
          .eq('id', session.user.id)
          .single()

        if (userData?.nickname) {
          setNickname(userData.nickname)
          localStorage.setItem('nickname', userData.nickname)
        }
      }
    }

    fetchUser()
  }, [])

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1.5rem',
        color: '#fff',
        backgroundColor: '#0b0b0b',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
        {nickname ? `${nickname}님, 환영합니다 🚗` : 'DriveMate에 오신 걸 환영합니다 🚗'}
      </h1>

      <p style={{ opacity: 0.8 }}>
        {nickname
          ? '드라이브를 함께할 준비가 되었어요!'
          : '지금 로그인하고 당신만의 드라이브 파트너를 만나보세요.'}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          width: '80%',
          marginTop: '2rem',
        }}
      >
        <FeatureCard
          title="커뮤니티"
          desc="다른 드라이버들과 이야기를 나눠보세요."
          emoji="💬"
        />
        <FeatureCard
          title="드라이브 기록"
          desc="나의 드라이브 일지를 작성하고 공유하세요."
          emoji="📖"
        />
        <FeatureCard
          title="내 차량 관리"
          desc="차량 정보와 정비 일정을 관리하세요."
          emoji="🚘"
        />
        <FeatureCard
          title="드라이브 코스 추천"
          desc="날씨와 취향에 맞는 드라이브 코스를 추천받으세요."
          emoji="🗺️"
        />
      </div>
    </div>
  )
}

function FeatureCard({
  title,
  desc,
  emoji,
}: {
  title: string
  desc: string
  emoji: string
}) {
  return (
    <div
      style={{
        background: '#111',
        border: '1px solid #222',
        borderRadius: '1rem',
        padding: '1.5rem',
        textAlign: 'center',
        boxShadow: '0 0 10px rgba(0, 255, 255, 0.1)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)')
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.transform = 'translateY(0px)')
      }
    >
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{emoji}</div>
      <h3 style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>{title}</h3>
      <p style={{ opacity: 0.7 }}>{desc}</p>
    </div>
  )
}
