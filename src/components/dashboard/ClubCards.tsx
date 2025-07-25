import { Users, Calendar, Star, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const clubs = [
  {
    id: 1,
    name: 'Клуб Робототехники',
    description: 'Изучаем программирование и создаем роботов',
    members: 24,
    nextEvent: '2024-01-28',
    category: 'Технологии',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop',
    isJoined: true
  },
  {
    id: 2,
    name: 'Дебатный клуб',
    description: 'Развиваем навыки публичных выступлений',
    members: 18,
    nextEvent: '2024-01-30',
    category: 'Образование',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop',
    isJoined: true
  },
  {
    id: 3,
    name: 'Экологический клуб',
    description: 'Защищаем природу и изучаем экологию',
    members: 32,
    nextEvent: '2024-02-01',
    category: 'Экология',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop',
    isJoined: false
  }
]

export function ClubCards() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Мои клубы</h2>
        <Button variant="ghost" className="text-tabys-primary hover:text-tabys-accent">
          Все клубы
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club, index) => (
          <Card 
            key={club.id} 
            className="glass border-0 hover:shadow-xl transition-all duration-300 group animate-slide-up overflow-hidden"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="relative">
              <img 
                src={club.image} 
                alt={club.name}
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3">
                <Badge 
                  variant={club.isJoined ? "default" : "secondary"}
                  className={club.isJoined ? "bg-green-500" : ""}
                >
                  {club.isJoined ? 'Участник' : 'Доступен'}
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-tabys-primary transition-colors">
                    {club.name}
                  </h3>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {club.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{club.rating}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {club.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{club.members} участников</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>28 янв</span>
                </div>
              </div>

              <Button 
                className={`w-full ${
                  club.isJoined 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'gradient-purple text-white hover:opacity-90'
                }`}
                variant={club.isJoined ? "secondary" : "default"}
              >
                {club.isJoined ? 'Открыть клуб' : 'Присоединиться'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}