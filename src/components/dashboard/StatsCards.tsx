import { Users, Calendar, Trophy, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const stats = [
  {
    title: 'Мои клубы',
    value: '5',
    change: '+2 за месяц',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Мероприятия',
    value: '12',
    change: '+4 на неделе',
    icon: Calendar,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    title: 'Достижения',
    value: '8',
    change: '+1 новое',
    icon: Trophy,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    title: 'Активность',
    value: '94%',
    change: '+12% за месяц',
    icon: TrendingUp,
    color: 'text-tabys-primary',
    bgColor: 'bg-tabys-light'
  }
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
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