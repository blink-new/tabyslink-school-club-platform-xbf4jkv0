import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, Filter, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { blink } from '@/blink/client';
import { Event, Club } from '@/types';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Форма создания мероприятия
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    club_id: '',
    event_date: '',
    location: '',
    max_participants: '',
    is_online: false,
    meeting_link: ''
  });

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await blink.db.events.list({
        orderBy: { event_date: 'asc' }
      });
      setEvents(eventsData);
    } catch (error) {
      console.error('Ошибка загрузки мероприятий:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClubs = async () => {
    try {
      const clubsData = await blink.db.clubs.list({
        where: { is_active: "1" }
      });
      setClubs(clubsData);
    } catch (error) {
      console.error('Ошибка загрузки клубов:', error);
    }
  };

  const filterEvents = useCallback(() => {
    let filtered = events;

    // Фильтр по поиску
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Фильтр по статусу
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(event => event.status === selectedStatus);
    }

    setFilteredEvents(filtered);
  }, [events, searchQuery, selectedStatus]);

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user);
      if (state.user) {
        loadEvents();
        loadClubs();
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchQuery, selectedStatus, filterEvents]);

  const handleCreateEvent = async () => {
    if (!user || !newEvent.title || !newEvent.club_id || !newEvent.event_date) return;

    try {
      const eventId = `event_${Date.now()}`;
      await blink.db.events.create({
        id: eventId,
        title: newEvent.title,
        description: newEvent.description,
        club_id: newEvent.club_id,
        creator_id: user.id,
        event_date: newEvent.event_date,
        location: newEvent.location,
        max_participants: newEvent.max_participants ? parseInt(newEvent.max_participants) : null,
        current_participants: 0,
        is_online: newEvent.is_online,
        meeting_link: newEvent.meeting_link,
        status: 'upcoming'
      });

      setNewEvent({
        title: '',
        description: '',
        club_id: '',
        event_date: '',
        location: '',
        max_participants: '',
        is_online: false,
        meeting_link: ''
      });
      setIsCreateDialogOpen(false);
      loadEvents();
    } catch (error) {
      console.error('Ошибка создания мероприятия:', error);
    }
  };

  const handleRSVP = async (eventId: string, status: 'going' | 'maybe' | 'not_going') => {
    if (!user) return;

    try {
      // Проверяем существующий RSVP
      const existingRSVP = await blink.db.event_rsvp.list({
        where: { 
          AND: [
            { event_id: eventId },
            { user_id: user.id }
          ]
        }
      });

      if (existingRSVP.length > 0) {
        // Обновляем существующий RSVP
        await blink.db.event_rsvp.update(existingRSVP[0].id, { status });
      } else {
        // Создаем новый RSVP
        await blink.db.event_rsvp.create({
          id: `rsvp_${Date.now()}`,
          event_id: eventId,
          user_id: user.id,
          status
        });
      }

      // Обновляем счетчик участников если статус "going"
      const event = events.find(e => e.id === eventId);
      if (event && status === 'going') {
        const goingCount = await blink.db.event_rsvp.list({
          where: { 
            AND: [
              { event_id: eventId },
              { status: 'going' }
            ]
          }
        });
        
        await blink.db.events.update(eventId, {
          current_participants: goingCount.length
        });
      }

      loadEvents();
      alert(`RSVP обновлен: ${status === 'going' ? 'Иду' : status === 'maybe' ? 'Возможно' : 'Не иду'}`);
    } catch (error) {
      console.error('Ошибка RSVP:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      upcoming: { label: 'Предстоящее', color: 'bg-blue-100 text-blue-800' },
      ongoing: { label: 'Идет сейчас', color: 'bg-green-100 text-green-800' },
      completed: { label: 'Завершено', color: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'Отменено', color: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.upcoming;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Войдите в систему</h2>
          <p className="text-gray-600">Для просмотра мероприятий необходимо войти в систему</p>
          <Button onClick={() => blink.auth.login()} className="mt-4">
            Войти
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и создание мероприятия */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Мероприятия</h1>
          <p className="text-gray-600">Участвуйте в интересных событиях и создавайте свои</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Создать мероприятие
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Создать новое мероприятие</DialogTitle>
              <DialogDescription>
                Организуйте мероприятие для вашего клуба
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid gap-2">
                <Label htmlFor="title">Название мероприятия</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Введите название мероприятия"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="club">Клуб</Label>
                <Select value={newEvent.club_id} onValueChange={(value) => setNewEvent({ ...newEvent, club_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите клуб" />
                  </SelectTrigger>
                  <SelectContent>
                    {clubs.map((club) => (
                      <SelectItem key={club.id} value={club.id}>
                        {club.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="date">Дата и время</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={newEvent.event_date}
                  onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="online"
                  checked={newEvent.is_online}
                  onCheckedChange={(checked) => setNewEvent({ ...newEvent, is_online: checked })}
                />
                <Label htmlFor="online">Онлайн мероприятие</Label>
              </div>

              {newEvent.is_online ? (
                <div className="grid gap-2">
                  <Label htmlFor="meeting_link">Ссылка на встречу</Label>
                  <Input
                    id="meeting_link"
                    value={newEvent.meeting_link}
                    onChange={(e) => setNewEvent({ ...newEvent, meeting_link: e.target.value })}
                    placeholder="https://zoom.us/j/..."
                  />
                </div>
              ) : (
                <div className="grid gap-2">
                  <Label htmlFor="location">Место проведения</Label>
                  <Input
                    id="location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="Введите адрес или название места"
                  />
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="max_participants">Максимум участников (необязательно)</Label>
                <Input
                  id="max_participants"
                  type="number"
                  value={newEvent.max_participants}
                  onChange={(e) => setNewEvent({ ...newEvent, max_participants: e.target.value })}
                  placeholder="Оставьте пустым для неограниченного количества"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Расскажите о мероприятии"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleCreateEvent} disabled={!newEvent.title || !newEvent.club_id || !newEvent.event_date}>
                Создать мероприятие
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Поиск и фильтры */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Поиск мероприятий..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="upcoming">Предстоящие</SelectItem>
            <SelectItem value="ongoing">Идут сейчас</SelectItem>
            <SelectItem value="completed">Завершенные</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Список мероприятий */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Мероприятия не найдены</h3>
          <p className="text-gray-600">Попробуйте изменить параметры поиска или создайте новое мероприятие</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map((event) => {
            const club = clubs.find(c => c.id === event.club_id);
            return (
              <Card key={event.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {event.title}
                    </CardTitle>
                    {getStatusBadge(event.status)}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(event.event_date)}</span>
                    </div>
                    {club && (
                      <Badge variant="outline" className="text-xs">
                        {club.name}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {event.description && (
                    <CardDescription className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </CardDescription>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        {event.is_online ? (
                          <>
                            <Video className="w-4 h-4" />
                            <span>Онлайн</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-4 h-4" />
                            <span>{event.location || 'Место уточняется'}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>
                          {event.current_participants}
                          {event.max_participants && `/${event.max_participants}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {event.status === 'upcoming' && (
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleRSVP(event.id, 'going')}
                        className="flex-1 bg-primary hover:bg-primary/90"
                        size="sm"
                      >
                        Иду
                      </Button>
                      <Button 
                        onClick={() => handleRSVP(event.id, 'maybe')}
                        variant="outline"
                        className="flex-1"
                        size="sm"
                      >
                        Возможно
                      </Button>
                      <Button 
                        onClick={() => handleRSVP(event.id, 'not_going')}
                        variant="outline"
                        className="flex-1"
                        size="sm"
                      >
                        Не иду
                      </Button>
                    </div>
                  )}
                  
                  {event.is_online && event.meeting_link && event.status === 'ongoing' && (
                    <Button 
                      onClick={() => window.open(event.meeting_link, '_blank')}
                      className="w-full mt-2 bg-green-600 hover:bg-green-700"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Присоединиться к встрече
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}