import { useState } from 'react'
import { 
  Home, 
  Users, 
  Calendar, 
  Bot, 
  User, 
  CreditCard, 
  Settings,
  ChevronRight,
  Trophy,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  activeTab?: string
  onTabChange?: (tab: string) => void
}

const menuItems = [
  {
    title: 'Главная',
    icon: Home,
    id: 'dashboard'
  },
  {
    title: 'Клубы',
    icon: Users,
    id: 'clubs',
    badge: '12'
  },
  {
    title: 'Мероприятия',
    icon: Calendar,
    id: 'events',
    badge: '5'
  },
  {
    title: 'ИИ-Ассистент',
    icon: Bot,
    id: 'ai-assistant'
  },
  {
    title: 'Достижения',
    icon: Trophy,
    id: 'achievements'
  },
  {
    title: 'Аналитика',
    icon: BarChart3,
    id: 'analytics'
  }
]

const bottomItems = [
  {
    title: 'Профиль',
    icon: User,
    id: 'profile'
  },
  {
    title: 'Подписки',
    icon: CreditCard,
    id: 'subscription'
  },
  {
    title: 'Настройки',
    icon: Settings,
    id: 'settings'
  }
]

export function Sidebar({ isOpen, onClose, activeTab = 'dashboard', onTabChange }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const handleItemClick = (id: string) => {
    if (onTabChange) {
      onTabChange(id)
    }
    onClose()
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 transform bg-white border-r transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Main Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <div key={item.title}>
                <Button
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10",
                    activeTab === item.id && "bg-tabys-light text-tabys-primary border border-tabys-primary/20"
                  )}
                  onClick={() => handleItemClick(item.id)}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </div>
            ))}
          </nav>

          {/* Bottom Navigation */}
          <div className="p-4 border-t space-y-2">
            {bottomItems.map((item) => (
              <Button
                key={item.title}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  activeTab === item.id && "bg-tabys-light text-tabys-primary border border-tabys-primary/20"
                )}
                onClick={() => handleItemClick(item.id)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Button>
            ))}
          </div>

          {/* Upgrade Banner */}
          <div className="p-4 border-t">
            <div className="glass-purple rounded-lg p-4 text-center">
              <div className="text-sm font-medium text-tabys-primary mb-2">
                Премиум план
              </div>
              <div className="text-xs text-gray-600 mb-3">
                Получите доступ ко всем функциям ИИ
              </div>
              <Button size="sm" className="w-full gradient-purple text-white">
                Обновить
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}