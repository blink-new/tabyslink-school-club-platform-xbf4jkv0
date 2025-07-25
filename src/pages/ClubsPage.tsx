import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Filter, Users, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { blink } from '@/blink/client';
import { Club, CLUB_CATEGORIES } from '@/types';

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Форма создания клуба
  const [newClub, setNewClub] = useState({
    name: '',
    description: '',
    category: '',
    image_url: ''
  });

  const loadClubs = async () => {
    try {
      setLoading(true);
      const clubsData = await blink.db.clubs.list({
        where: { is_active: "1" },
        orderBy: { created_at: 'desc' }
      });
      setClubs(clubsData);
    } catch (error) {
      console.error('Ошибка загрузки клубов:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterClubs = useCallback(() => {
    let filtered = clubs;

    // Фильтр по поиску
    if (searchQuery) {
      filtered = filtered.filter(club =>
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Фильтр по категории
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(club =>
        club.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredClubs(filtered);
  }, [clubs, searchQuery, selectedCategory]);

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user);
      if (state.user) {
        loadClubs();
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    filterClubs();
  }, [clubs, searchQuery, selectedCategory, filterClubs]);

  const handleCreateClub = async () => {
    if (!user || !newClub.name || !newClub.category) return;

    try {
      const clubId = `club_${Date.now()}`;
      await blink.db.clubs.create({
        id: clubId,
        name: newClub.name,
        description: newClub.description,
        category: newClub.category,
        image_url: newClub.image_url || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
        creator_id: user.id,
        school_name: user.school_name || 'Школа №1',
        member_count: 1,
        rating: 0,
        is_active: true
      });

      // Добавляем создателя как администратора клуба
      await blink.db.club_members.create({
        id: `member_${Date.now()}`,
        club_id: clubId,
        user_id: user.id,
        role: 'admin'
      });

      setNewClub({ name: '', description: '', category: '', image_url: '' });
      setIsCreateDialogOpen(false);
      loadClubs();
    } catch (error) {
      console.error('Ошибка создания клуба:', error);
    }
  };

  const handleJoinClub = async (clubId: string) => {
    if (!user) return;

    try {
      // Проверяем, не состоит ли уже пользователь в клубе
      const existingMember = await blink.db.club_members.list({
        where: { 
          AND: [
            { club_id: clubId },
            { user_id: user.id }
          ]
        }
      });

      if (existingMember.length > 0) {
        alert('Вы уже состоите в этом клубе!');
        return;
      }

      await blink.db.club_members.create({
        id: `member_${Date.now()}`,
        club_id: clubId,
        user_id: user.id,
        role: 'member'
      });

      // Обновляем счетчик участников
      const club = clubs.find(c => c.id === clubId);
      if (club) {
        await blink.db.clubs.update(clubId, {
          member_count: club.member_count + 1
        });
      }

      loadClubs();
      alert('Вы успешно вступили в клуб!');
    } catch (error) {
      console.error('Ошибка вступления в клуб:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Войдите в систему</h2>
          <p className="text-gray-600">Для просмотра клубов необходимо войти в систему</p>
          <Button onClick={() => blink.auth.login()} className="mt-4">
            Войти
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и поиск */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Клубы</h1>
          <p className="text-gray-600">Найдите клуб по интересам и присоединяйтесь к сообществу</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Создать клуб
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Создать новый клуб</DialogTitle>
              <DialogDescription>
                Создайте клуб и пригласите единомышленников
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Название клуба</Label>
                <Input
                  id="name"
                  value={newClub.name}
                  onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
                  placeholder="Введите название клуба"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Категория</Label>
                <Select value={newClub.category} onValueChange={(value) => setNewClub({ ...newClub, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLUB_CATEGORIES.slice(1).map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={newClub.description}
                  onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
                  placeholder="Расскажите о вашем клубе"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">URL изображения (необязательно)</Label>
                <Input
                  id="image"
                  value={newClub.image_url}
                  onChange={(e) => setNewClub({ ...newClub, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleCreateClub} disabled={!newClub.name || !newClub.category}>
                Создать клуб
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Поиск и фильтры */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Поиск клубов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CLUB_CATEGORIES.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.icon} {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Список клубов */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : filteredClubs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Клубы не найдены</h3>
          <p className="text-gray-600">Попробуйте изменить параметры поиска или создайте новый клуб</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => (
            <Card key={club.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={club.image_url || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400'}
                  alt={club.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90 text-gray-700">
                    {club.category}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  {club.name}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 line-clamp-2">
                  {club.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{club.member_count}</span>
                    </div>
                    {club.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{club.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  {club.school_name && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" />
                      <span>{club.school_name}</span>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={() => handleJoinClub(club.id)}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Присоединиться
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}