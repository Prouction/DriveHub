'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  if (!user) return <p>로그인이 필요합니다.</p>

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>내 프로필</h2>
      <p>이메일: {user.email}</p>
      <p>UUID: {user.id}</p>
    </div>
  )
}
