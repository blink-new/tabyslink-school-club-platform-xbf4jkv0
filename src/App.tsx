import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Dashboard } from '@/pages/Dashboard'
import ClubsPage from '@/pages/ClubsPage'
import EventsPage from '@/pages/EventsPage'
import AIAssistantPage from '@/pages/AIAssistantPage'
import { blink } from '@/blink/client'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'clubs':
        return <ClubsPage />
      case 'events':
        return <EventsPage />
      case 'ai-assistant':
        return <AIAssistantPage />
      case 'profile':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Профиль</h1>
            <p>Страница профиля в разработке</p>
          </div>
        )
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Настройки</h1>
            <p>Страница настроек в разработке</p>
          </div>
        )
      default:
        return <Dashboard />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-tabys-primary to-tabys-accent flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <div className="text-lg font-medium text-gray-900 mb-2">TabysLink</div>
          <div className="text-sm text-gray-600">Загрузка...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-tabys-primary to-tabys-accent flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Добро пожаловать в TabysLink
          </h1>
          <p className="text-gray-600 mb-6">
            Платформа для управления школьными клубами и внеклассной деятельностью
          </p>
          <button 
            onClick={() => blink.auth.login()}
            className="px-6 py-3 gradient-purple text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Войти в систему
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <main className="flex-1 lg:ml-64">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App