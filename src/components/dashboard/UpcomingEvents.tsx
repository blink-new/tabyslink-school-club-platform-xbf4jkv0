import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const events = [
  {
    id: 1,
    title: 'Соревнования по робототехнике',
    club: 'Клуб Робототехники',
    date: '28 января',
    time: '15:00',
    location: 'Кабинет 205',
    attendees: 12,
    maxAttendees: 20,
    status: 'confirmed'
  },
  {
    id: 2,
    title: 'Дебаты: ИИ в образовании',
    club: 'Дебатный клуб',
    date: '30 января',
    time: '16:30',
    location: 'Актовый зал',
    attendees: 8,
    maxAttendees: 15,
    status: 'pending'
  },
  {
    id: 3,
    title: 'Экологическая акция',
    club: 'Экологический клуб',
    date: '1 февраля',
    time: '14:00',
    location: 'Школьный двор',
    attendees: 25,
    maxAttendees: 30,
    status: 'confirmed'
  }
]

export function UpcomingEvents() {
  return (
    <Card className="glass border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-tabys-primary" />
          Предстоящие мероприятия
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event, index) => (
          <div 
            key={event.id}
            className="p-4 rounded-lg bg-white/50 border border-gray-100 hover:shadow-md transition-all duration-200 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  {event.title}
                </h4>
                <p className="text-sm text-tabys-primary">
                  {event.club}
                </p>
              </div>
              <Badge 
                variant={event.status === 'confirmed' ? 'default' : 'secondary'}
                className={event.status === 'confirmed' ? 'bg-green-500' : ''}
              >
                {event.status === 'confirmed' ? 'Подтверждено' : 'Ожидание'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{event.date}, {event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{event.attendees}/{event.maxAttendees} участников</span>
              </div>
              
              <div className="flex gap-2">
                {event.status === 'pending' && (
                  <Button size="sm" variant="outline" className="text-xs">
                    Подтвердить
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="text-xs text-tabys-primary">
                  Подробнее
                </Button>
              </div>
            </div>

            {/* Progress bar for attendance */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-tabys-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full mt-4">
          Посмотреть все мероприятия
        </Button>
      </CardContent>
    </Card>
  )
}