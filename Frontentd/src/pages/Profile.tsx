
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Trophy, Users, Star, Package } from "lucide-react";

const Profile = () => {
  const { id } = useParams();
  const isCurrentUser = id === 'current';

  const user = {
    id: id,
    displayName: 'Александр Петров',
    email: 'alex@example.com',
    registeredAt: '2023-01-15',
    gamesCount: 45,
    sessionsCount: 123,
    followersCount: 28,
    followingCount: 32,
    friendsCount: 15,
    subscriptionStatus: isCurrentUser ? 'self' : 'friend'
  };

  const collections = [
    { id: '1', name: 'Моя коллекция', gamesCount: 25, isDefault: true },
    { id: '2', name: 'Играл', gamesCount: 48, isDefault: true },
    { id: '3', name: 'Хочу сыграть', gamesCount: 12, isDefault: true },
    { id: '4', name: 'Хочу купить', gamesCount: 8, isDefault: true },
    { id: '5', name: 'Любимые стратегии', gamesCount: 15, isDefault: false }
  ];

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

  const friends = [
    { id: '1', name: 'Мария Иванова', gamesCount: 67, status: 'friend' },
    { id: '2', name: 'Дмитрий Козлов', gamesCount: 23, status: 'friend' },
    { id: '3', name: 'Елена Смирнова', gamesCount: 34, status: 'friend' }
  ];

  const followers = [
    { id: '4', name: 'Иван Петров', gamesCount: 12, status: 'follower' },
    { id: '5', name: 'Анна Сидорова', gamesCount: 56, status: 'follower' }
  ];

  const following = [
    { id: '6', name: 'Павел Новиков', gamesCount: 78, status: 'following' },
    { id: '7', name: 'Ольга Васильева', gamesCount: 43, status: 'following' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl">АП</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{user.displayName}</h1>
                  {user.subscriptionStatus === 'friend' && (
                    <Badge variant="default">Друг</Badge>
                  )}
                </div>
                <p className="text-gray-600 mb-4">
                  На сайте с {new Date(user.registeredAt).toLocaleDateString('ru-RU')}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{user.gamesCount}</div>
                    <div className="text-sm text-gray-600">игр в коллекциях</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{user.sessionsCount}</div>
                    <div className="text-sm text-gray-600">партий сыграно</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{user.friendsCount}</div>
                    <div className="text-sm text-gray-600">друзей</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{user.followersCount}</div>
                    <div className="text-sm text-gray-600">подписчиков</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{user.followingCount}</div>
                    <div className="text-sm text-gray-600">подписок</div>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="collections" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="collections">Коллекции</TabsTrigger>
            <TabsTrigger value="sessions">Партии</TabsTrigger>
            <TabsTrigger value="friends">Друзья</TabsTrigger>
            <TabsTrigger value="activity">Активность</TabsTrigger>
          </TabsList>

          <TabsContent value="collections">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <Card key={collection.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">{collection.name}</CardTitle>
                      </div>
                      {collection.isDefault && (
                        <Badge variant="outline" className="text-xs">По умолчанию</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{collection.gamesCount}</div>
                      <div className="text-sm text-gray-600">игр в коллекции</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sessions">
            <div className="space-y-4">
              {recentSessions.map((session) => (
                <Card key={session.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Trophy className="h-8 w-8 text-yellow-500" />
                        <div>
                          <div className="font-semibold text-lg">{session.game}</div>
                          <div className="text-sm text-gray-600 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(session.playedAt).toLocaleDateString('ru-RU')}
                            <Users className="h-4 w-4 ml-2" />
                            {session.playersCount} игроков
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">{session.score} очков</div>
                        <Badge variant={session.isWinner ? "default" : "secondary"}>
                          {session.isWinner ? 'Победа' : 'Поражение'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="friends">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Друзья ({friends.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {friends.map((friend) => (
                    <Card key={friend.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{friend.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium">{friend.name}</div>
                            <div className="text-sm text-gray-600">{friend.gamesCount} игр</div>
                          </div>
                          <Badge variant="default">Друг</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Подписчики ({followers.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {followers.map((follower) => (
                    <Card key={follower.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{follower.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium">{follower.name}</div>
                            <div className="text-sm text-gray-600">{follower.gamesCount} игр</div>
                          </div>
                          <Badge variant="outline">Подписчик</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Подписки ({following.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {following.map((follow) => (
                    <Card key={follow.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{follow.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium">{follow.name}</div>
                            <div className="text-sm text-gray-600">{follow.gamesCount} игр</div>
                          </div>
                          <Badge variant="secondary">Подписка</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="font-medium">Добавлена игра "Азул" в коллекцию "Моя коллекция"</div>
                      <div className="text-sm text-gray-500">2 часа назад</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="font-medium">Сыграна партия в "Каркассон" - Победа!</div>
                      <div className="text-sm text-gray-500">3 дня назад</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="font-medium">Добавлен новый друг: Мария Иванова</div>
                      <div className="text-sm text-gray-500">5 дней назад</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
