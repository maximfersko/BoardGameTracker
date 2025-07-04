
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, User, UserPlus, UserCheck } from "lucide-react";
import { Link } from 'react-router-dom';

const mockUsers = [
  {
    id: '1',
    displayName: 'Александр Петров',
    email: 'alex@example.com',
    registeredAt: '2023-01-15',
    gamesCount: 45,
    sessionsCount: 123,
    followersCount: 28,
    followingCount: 32,
    subscriptionStatus: 'none',
    isOnline: true
  },
  {
    id: '2',
    displayName: 'Мария Иванова',
    email: 'maria@example.com',
    registeredAt: '2023-03-20',
    gamesCount: 67,
    sessionsCount: 89,
    followersCount: 45,
    followingCount: 23,
    subscriptionStatus: 'friend',
    isOnline: false
  },
  {
    id: '3',
    displayName: 'Дмитрий Козлов',
    email: 'dmitry@example.com',
    registeredAt: '2023-05-10',
    gamesCount: 23,
    sessionsCount: 56,
    followersCount: 12,
    followingCount: 18,
    subscriptionStatus: 'following',
    isOnline: true
  }
];

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const { toast } = useToast();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = mockUsers.filter(user => 
      user.displayName.toLowerCase().includes(value.toLowerCase()) ||
      user.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleSubscribe = (userId: string, currentStatus: string) => {
    const user = filteredUsers.find(u => u.id === userId);
    let newStatus = currentStatus;
    let message = '';

    switch (currentStatus) {
      case 'none':
        newStatus = 'following';
        message = `Вы подписались на ${user?.displayName}`;
        break;
      case 'following':
        newStatus = 'none';
        message = `Вы отписались от ${user?.displayName}`;
        break;
      case 'follower':
        newStatus = 'friend';
        message = `Теперь вы друзья с ${user?.displayName}`;
        break;
      case 'friend':
        newStatus = 'follower';
        message = `Вы отписались от ${user?.displayName}`;
        break;
    }

    setFilteredUsers(users => 
      users.map(user => 
        user.id === userId 
          ? { ...user, subscriptionStatus: newStatus }
          : user
      )
    );

    toast({
      title: "Статус обновлен",
      description: message,
    });
  };

  const getSubscriptionButton = (user) => {
    switch (user.subscriptionStatus) {
      case 'none':
        return (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleSubscribe(user.id, user.subscriptionStatus)}
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Подписаться
          </Button>
        );
      case 'following':
        return (
          <Button 
            size="sm" 
            variant="secondary"
            onClick={() => handleSubscribe(user.id, user.subscriptionStatus)}
          >
            <UserCheck className="h-4 w-4 mr-1" />
            Отписаться
          </Button>
        );
      case 'follower':
        return (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleSubscribe(user.id, user.subscriptionStatus)}
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Подписаться взамен
          </Button>
        );
      case 'friend':
        return (
          <Button 
            size="sm" 
            variant="default"
            onClick={() => handleSubscribe(user.id, user.subscriptionStatus)}
          >
            <UserCheck className="h-4 w-4 mr-1" />
            Отписаться
          </Button>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'friend':
        return <Badge variant="default">Друг</Badge>;
      case 'following':
        return <Badge variant="secondary">Подписка</Badge>;
      case 'follower':
        return <Badge variant="outline">Подписчик</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Сообщество игроков</h1>
          <p className="text-gray-600 mt-1">Найдите друзей и единомышленников</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Поиск пользователей..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="" />
                      <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                    </Avatar>
                    {user.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{user.displayName}</CardTitle>
                    <CardDescription className="text-sm">
                      На сайте с {new Date(user.registeredAt).toLocaleDateString('ru-RU')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">{user.gamesCount}</div>
                    <div className="text-xs text-gray-600">игр в коллекциях</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">{user.sessionsCount}</div>
                    <div className="text-xs text-gray-600">партий сыграно</div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4 mb-4 text-sm text-gray-600">
                  <span>{user.followersCount} подписчиков</span>
                  <span>{user.followingCount} подписок</span>
                </div>

                <div className="flex justify-center mb-4">
                  {getStatusBadge(user.subscriptionStatus)}
                </div>

                <div className="flex space-x-2">
                  {getSubscriptionButton(user)}
                  <Link to={`/profile/${user.id}`}>
                    <Button size="sm" variant="outline" className="flex-1">
                      <User className="h-4 w-4 mr-1" />
                      Профиль
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Пользователи не найдены</h3>
            <p className="text-gray-600">Попробуйте изменить поисковый запрос</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Users;
