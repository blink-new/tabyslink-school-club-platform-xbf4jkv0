import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, GraduationCap, BarChart3, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { blink } from '@/blink/client';
import { AIChat, AIMessage } from '@/types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistantPage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('club_analysis');
  
  // Состояние для чата анализа клубов
  const [clubMessages, setClubMessages] = useState<ChatMessage[]>([]);
  const [clubInput, setClubInput] = useState('');
  const [clubLoading, setClubLoading] = useState(false);
  
  // Состояние для чата консультанта по ВУЗам
  const [uniMessages, setUniMessages] = useState<ChatMessage[]>([]);
  const [uniInput, setUniInput] = useState('');
  const [uniLoading, setUniLoading] = useState(false);
  
  const clubScrollRef = useRef<HTMLDivElement>(null);
  const uniScrollRef = useRef<HTMLDivElement>(null);

  const loadChatHistory = async () => {
    try {
      // Загружаем историю чатов (упрощенная версия)
      // В реальном приложении здесь была бы загрузка из базы данных
      
      // Добавляем приветственные сообщения
      setClubMessages([
        {
          id: 'welcome_club',
          role: 'assistant',
          content: '👋 Привет! Я ИИ-ассистент для анализа клубов. Я помогу вам оптимизировать деятельность вашего клуба, проанализировать активность участников и дать рекомендации по улучшению. О каком клубе вы хотели бы поговорить?',
          timestamp: new Date()
        }
      ]);

      setUniMessages([
        {
          id: 'welcome_uni',
          role: 'assistant',
          content: '🎓 Здравствуйте! Я консультант по поступлению в университеты. Помогу вам понять, как внеклассная деятельность влияет на поступление, какие клубы выбрать для вашей специальности и как создать сильное портфолио. Расскажите о ваших академических интересах и планах!',
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error('Ошибка загрузки истории чатов:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user);
      if (state.user) {
        loadChatHistory();
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Автоскролл для чата анализа клубов
    if (clubScrollRef.current) {
      clubScrollRef.current.scrollTop = clubScrollRef.current.scrollHeight;
    }
  }, [clubMessages]);

  useEffect(() => {
    // Автоскролл для чата консультанта по ВУЗам
    if (uniScrollRef.current) {
      uniScrollRef.current.scrollTop = uniScrollRef.current.scrollHeight;
    }
  }, [uniMessages]);

  const sendMessage = async (type: 'club_analysis' | 'university_consultant', message: string) => {
    if (!user || !message.trim()) return;

    const isClubChat = type === 'club_analysis';
    const setMessages = isClubChat ? setClubMessages : setUniMessages;
    const setLoading = isClubChat ? setClubLoading : setUniLoading;
    const setInput = isClubChat ? setClubInput : setUniInput;

    // Добавляем сообщение пользователя
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Создаем системный промпт в зависимости от типа ассистента
      const systemPrompt = type === 'club_analysis' 
        ? `Вы — специализированный ассистент для анализа школьных клубов на платформе TabysLink. Ваша задача — помочь ученикам и организаторам оптимизировать деятельность клубов.

Основные функции:
- Анализ клуба (активность, структура, организация, эффективность коммуникации)
- Выявление сильных сторон (вовлеченность, регулярность мероприятий, качество контента)
- Рекомендации для улучшения (конкретные шаги для роста активности, новые форматы мероприятий, улучшение коммуникации, стратегии привлечения участников)

Стиль общения: дружелюбный и мотивирующий тон, конкретные actionable советы, примеры успешных практик, поддержка и поощрение инициатив.`
        : `Вы — эксперт по поступлению в университеты, специализирующийся на том, как внеклассная деятельность влияет на успех при поступлении.

Основные функции:
- Анализ профиля ученика (портфолио внеклассных активностей, соответствие интересов и специальности, выявление пробелов)
- Советы по развитию (рекомендации по выбору клубов, создание сильного портфолио, стратегии получения лидерских позиций)
- Топовые советы (как выделиться среди абитуриентов, важность качества vs количества, документирование достижений)

Специализированные знания: требования казахстанских и международных ВУЗов, тенденции в приемных комиссиях, ценность различных видов внеклассной деятельности.

Стиль общения: профессиональный, но доступный, персонализированные рекомендации, примеры успешных кейсов, мотивация к долгосрочному планированию.`;

      // Используем ИИ для генерации ответа
      const response = await blink.ai.generateText({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        model: 'gpt-4o-mini',
        maxTokens: 500
      });

      // Добавляем ответ ассистента
      const assistantMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: response.text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Сохраняем в базу данных (упрощенная версия)
      try {
        const chatId = `chat_${type}_${user.id}`;
        
        // Сохраняем сообщения пользователя и ассистента
        await blink.db.ai_messages.create({
          id: `msg_${Date.now()}_user`,
          chat_id: chatId,
          role: 'user',
          content: message
        });

        await blink.db.ai_messages.create({
          id: `msg_${Date.now()}_assistant`,
          chat_id: chatId,
          role: 'assistant',
          content: response.text
        });
      } catch (dbError) {
        console.error('Ошибка сохранения в БД:', dbError);
      }

    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      
      // Добавляем сообщение об ошибке
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'Извините, произошла ошибка при обработке вашего сообщения. Попробуйте еще раз.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const quickReplies = {
    club_analysis: [
      'Как увеличить активность участников?',
      'Анализ эффективности нашего клуба',
      'Идеи для новых мероприятий',
      'Как привлечь новых участников?'
    ],
    university_consultant: [
      'Какие клубы лучше для IT-специальности?',
      'Как создать сильное портфолио?',
      'Требования казахстанских ВУЗов',
      'Лидерские позиции в клубах'
    ]
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Войдите в систему</h2>
          <p className="text-gray-600">Для использования ИИ-ассистентов необходимо войти в систему</p>
          <Button onClick={() => blink.auth.login()} className="mt-4">
            Войти
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">ИИ-Ассистенты</h1>
        <p className="text-gray-600">Получите персональные рекомендации от наших специализированных ботов</p>
      </div>

      {/* Карточки ассистентов */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="border-0 bg-gradient-to-br from-purple-50 to-blue-50 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Анализ Клубов</CardTitle>
                <CardDescription>Оптимизация деятельности клубов</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Помогает анализировать активность клуба, выявлять сильные стороны и давать рекомендации по улучшению.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Анализ активности</Badge>
              <Badge variant="secondary">Рекомендации</Badge>
              <Badge variant="secondary">Стратегии роста</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600/10 rounded-lg">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Консультант по ВУЗам</CardTitle>
                <CardDescription>Поступление в университеты</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Консультирует по влиянию внеклассной деятельности на поступление и помогает создать сильное портфолио.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Портфолио</Badge>
              <Badge variant="secondary">Требования ВУЗов</Badge>
              <Badge variant="secondary">Карьерные советы</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Чат интерфейс */}
      <Card className="border-0 bg-white/70 backdrop-blur-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="club_analysis" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Анализ Клубов
            </TabsTrigger>
            <TabsTrigger value="university_consultant" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Консультант по ВУЗам
            </TabsTrigger>
          </TabsList>

          <TabsContent value="club_analysis" className="mt-0">
            <div className="flex flex-col h-[600px]">
              {/* Сообщения */}
              <ScrollArea className="flex-1 p-4" ref={clubScrollRef}>
                <div className="space-y-4">
                  {clubMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      
                      <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                        <div
                          className={`p-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 px-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>

                      {message.role === 'user' && (
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center order-2">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {clubLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Быстрые ответы */}
              <div className="p-4 border-t">
                <div className="flex flex-wrap gap-2 mb-3">
                  {quickReplies.club_analysis.map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => sendMessage('club_analysis', reply)}
                      disabled={clubLoading}
                      className="text-xs"
                    >
                      {reply}
                    </Button>
                  ))}
                </div>

                {/* Поле ввода */}
                <div className="flex gap-2">
                  <Input
                    value={clubInput}
                    onChange={(e) => setClubInput(e.target.value)}
                    placeholder="Задайте вопрос об анализе клубов..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage('club_analysis', clubInput);
                      }
                    }}
                    disabled={clubLoading}
                  />
                  <Button
                    onClick={() => sendMessage('club_analysis', clubInput)}
                    disabled={clubLoading || !clubInput.trim()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="university_consultant" className="mt-0">
            <div className="flex flex-col h-[600px]">
              {/* Сообщения */}
              <ScrollArea className="flex-1 p-4" ref={uniScrollRef}>
                <div className="space-y-4">
                  {uniMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex-shrink-0 w-8 h-8 bg-green-600/10 rounded-full flex items-center justify-center">
                          <GraduationCap className="w-4 h-4 text-green-600" />
                        </div>
                      )}
                      
                      <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                        <div
                          className={`p-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 px-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>

                      {message.role === 'user' && (
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center order-2">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {uniLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-600/10 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Быстрые ответы */}
              <div className="p-4 border-t">
                <div className="flex flex-wrap gap-2 mb-3">
                  {quickReplies.university_consultant.map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => sendMessage('university_consultant', reply)}
                      disabled={uniLoading}
                      className="text-xs"
                    >
                      {reply}
                    </Button>
                  ))}
                </div>

                {/* Поле ввода */}
                <div className="flex gap-2">
                  <Input
                    value={uniInput}
                    onChange={(e) => setUniInput(e.target.value)}
                    placeholder="Задайте вопрос о поступлении в ВУЗы..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage('university_consultant', uniInput);
                      }
                    }}
                    disabled={uniLoading}
                  />
                  <Button
                    onClick={() => sendMessage('university_consultant', uniInput)}
                    disabled={uniLoading || !uniInput.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}