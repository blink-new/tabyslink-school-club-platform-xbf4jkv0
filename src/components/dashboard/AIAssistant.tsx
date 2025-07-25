import { Bot, MessageCircle, TrendingUp, GraduationCap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const assistants = [
  {
    id: 'clubs',
    name: 'Анализ клубов',
    description: 'Получите рекомендации по улучшению активности клуба',
    icon: TrendingUp,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    lastMessage: 'Ваш клуб робототехники показывает отличную динамику!',
    unread: 2
  },
  {
    id: 'university',
    name: 'Консультант по ВУЗам',
    description: 'Советы по поступлению и развитию портфолио',
    icon: GraduationCap,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    lastMessage: 'Рекомендую добавить лидерские позиции в портфолио',
    unread: 1
  }
]

export function AIAssistant() {
  return (
    <Card className="glass border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-tabys-primary" />
          ИИ-Ассистенты
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {assistants.map((assistant, index) => (
          <div 
            key={assistant.id}
            className="p-4 rounded-lg bg-white/50 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${assistant.bgColor} group-hover:scale-110 transition-transform`}>
                <assistant.icon className={`h-5 w-5 ${assistant.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900 group-hover:text-tabys-primary transition-colors">
                    {assistant.name}
                  </h4>
                  {assistant.unread > 0 && (
                    <div className="h-5 w-5 bg-tabys-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
                      {assistant.unread}
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {assistant.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MessageCircle className="h-3 w-3" />
                  <span className="truncate">{assistant.lastMessage}</span>
                </div>
              </div>
            </div>
            
            <Button 
              size="sm" 
              className="w-full mt-3 gradient-purple text-white hover:opacity-90"
            >
              Открыть чат
            </Button>
          </div>
        ))}

        <div className="p-4 rounded-lg bg-gradient-to-r from-tabys-light to-white border border-tabys-primary/20">
          <div className="text-center">
            <Bot className="h-8 w-8 text-tabys-primary mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">
              Новые возможности ИИ
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Персонализированные рекомендации на основе вашей активности
            </p>
            <Button size="sm" variant="outline" className="border-tabys-primary text-tabys-primary">
              Узнать больше
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}