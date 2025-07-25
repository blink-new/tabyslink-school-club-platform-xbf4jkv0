import { useState, useEffect, useCallback } from 'react'
import { Users, Calendar, Trophy, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { blink } from '@/blink/client'

export function StatsCards() {
  const [stats, setStats] = useState({
    clubs: 0,
    events: 0,
    achievements: 0,
    activity: 0
  })
  const [user, setUser] = useState<any>(null)

  const loadStats = useCallback(async () => {
    if (!user) return

    try {
      // Загружаем статистику пользователя
      const [clubMemberships, userEvents, userAchievements] = await Promise.all([
        blink.db.club_members.list({ where: { user_id: user.id } }),
        blink.db.event_rsvp.list({ where: { user_id: user.id, status: 'going' } }),
        blink.db.achievements.list({ where: { user_id: user.id } })
      ])

      setStats({
        clubs: clubMemberships.length,
        events: userEvents.length,
        achievements: userAchievements.length,
        activity: Math.min(100, Math.round((clubMemberships.length * 20 + userEvents.length * 5 + userAchievements.length * 10)))
      })
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error)
    }
  }, [user])

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (state.user) {
        loadStats()
      }
    })
    return unsubscribe
  }, [loadStats])

  const statsData = [
    {
      title: 'Мои клубы',
      value: stats.clubs.toString(),
      change: stats.clubs > 0 ? `${stats.clubs} активных` : 'Присоединитесь к клубам',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Мероприятия',
      value: stats.events.toString(),
      change: stats.events > 0 ? `${stats.events} предстоящих` : 'Зарегистрируйтесь на события',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Достижения',
      value: stats.achievements.toString(),
      change: stats.achievements > 0 ? `${stats.achievements} заработано` : 'Начните участвовать',
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Активность',
      value: `${stats.activity}%`,
      change: stats.activity > 50 ? 'Отличная активность!' : 'Увеличьте участие',
      icon: TrendingUp,
      color: 'text-tabys-primary',
      bgColor: 'bg-tabys-light'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <Card key={stat.title} className="glass border-0 hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}