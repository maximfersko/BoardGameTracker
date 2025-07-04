
import React from 'react';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from 'react-router-dom';
import { Users, BookOpen, Trophy, Star, Calendar, Package } from "lucide-react";

const Index = () => {
  const currentUser = {
    id: 'current',
    displayName: 'Александр Петров',
    email: 'alex@example.com',
    registeredAt: '2023-01-15',
    gamesCount: 45,
    sessionsCount: 123,
    followersCount: 28,
    followingCount: 32,
    friendsCount: 15
  };

  const recentSessions = [
    {
      id: '1',
      game: 'Каркассон',
      playedAt: '2024-01-15',
      playersCount: 4,
      score: 85,
      isWinner: true
    },
    {
      id: '2', 
      game: 'Колонизаторы',
      playedAt: '2024-01-12',
      playersCount: 3,
      score: 12,
      isWinner: false
    }
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'game_added',
      message: 'Добавлена игра "Азул" в коллекцию',
      timestamp: '2 часа назад'
    },
    {
      id: '2',
      type: 'session_played',
      message: 'Сыграна партия в "Каркассон"',
      timestamp: '3 дня назад'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-lg">АП</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{currentUser.displayName}</CardTitle>
                    <CardDescription>
                      На сайте с {new Date(currentUser.registeredAt).toLocaleDateString('ru-RU')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{currentUser.gamesCount}</div>
                    <div className="text-sm text-gray-600">игр в коллекциях</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{currentUser.sessionsCount}</div>
                    <div className="text-sm text-gray-600">партий сыграно</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{currentUser.friendsCount}</div>
                    <div className="text-sm text-gray-600">друзей</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{currentUser.followersCount}</div>
                    <div className="text-sm text-gray-600">подписчиков</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/sessions" className="block">
                  <Button className="w-full" variant="outline">
                    <Trophy className="h-4 w-4 mr-2" />
                    Добавить партию
                  </Button>
                </Link>
                <Link to="/games" className="block">
                  <Button className="w-full" variant="outline">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Найти игру
                  </Button>
                </Link>
                <Link to="/users" className="block">
                  <Button className="w-full" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Найти игроков
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Последние партии
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{session.game}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(session.playedAt).toLocaleDateString('ru-RU')}
                        <Users className="h-3 w-3 ml-2" />
                        {session.playersCount} игроков
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{session.score} очков</div>
                      <Badge variant={session.isWinner ? "default" : "secondary"}>
                        {session.isWinner ? 'Победа' : 'Поражение'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/sessions">
                <Button variant="outline" className="w-full mt-4">
                  Посмотреть все партии
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Активность</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm">{activity.message}</div>
                      <div className="text-xs text-gray-500">{activity.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Статистика платформы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1,247</div>
                <div className="text-sm text-gray-600">Настольных игр</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">892</div>
                <div className="text-sm text-gray-600">Активных игроков</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">3,456</div>
                <div className="text-sm text-gray-600">Записанных партий</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">8.5</div>
                <div className="text-sm text-gray-600">Средняя оценка игр</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
