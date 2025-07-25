import { StatsCards } from '@/components/dashboard/StatsCards'
import { ClubCards } from '@/components/dashboard/ClubCards'
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents'
import { AIAssistant } from '@/components/dashboard/AIAssistant'

export function Dashboard() {
  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Добро пожаловать в TabysLink! 👋
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Управляйте своими клубами, участвуйте в мероприятиях и развивайте навыки 
            с помощью наших ИИ-ассистентов
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Clubs */}
          <div className="lg:col-span-2">
            <ClubCards />
          </div>

          {/* Right Column - Events & AI */}
          <div className="space-y-6">
            <UpcomingEvents />
            <AIAssistant />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Быстрые действия
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 text-sm font-medium text-gray-700 hover:text-tabys-primary">
              🔍 Найти новый клуб
            </button>
            <button className="px-6 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 text-sm font-medium text-gray-700 hover:text-tabys-primary">
              📅 Создать мероприятие
            </button>
            <button className="px-6 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 text-sm font-medium text-gray-700 hover:text-tabys-primary">
              🏆 Посмотреть достижения
            </button>
            <button className="px-6 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 text-sm font-medium text-gray-700 hover:text-tabys-primary">
              🤖 Спросить ИИ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}