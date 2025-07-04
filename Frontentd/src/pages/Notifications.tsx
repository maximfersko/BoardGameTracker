
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Bell, UserPlus, UserCheck, Trophy, Package, X } from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'subscription',
      message: 'Мария Иванова подписалась на вас',
      isRead: false,
      createdAt: '2024-01-15T10:30:00Z',
      relatedUserId: '2',
      relatedUserName: 'Мария Иванова',
      link: '/profile/2'
    },
    {
      id: '2',
      type: 'game_session',
      message: 'Дмитрий Козлов пригласил вас в партию "Каркассон"',
      isRead: false,
      createdAt: '2024-01-14T15:20:00Z',
      relatedUserId: '3',
      relatedUserName: 'Дмитрий Козлов',
      link: '/sessions'
    },
    {
      id: '3',
      type: 'friend_request',
      message: 'Анна Петрова хочет добавить вас в друзья',
      isRead: true,
      createdAt: '2024-01-13T09:15:00Z',
      relatedUserId: '4',
      relatedUserName: 'Анна Петрова',
      link: '/profile/4'
    },
    {
      id: '4',
      type: 'collection',
      message: 'Павел Новиков добавил игру "Азул" в коллекцию',
      isRead: true,
      createdAt: '2024-01-12T14:45:00Z',
      relatedUserId: '5',
      relatedUserName: 'Павел Новиков',
      link: '/collections'
    }
  ]);

  const { toast } = useToast();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'subscription':
        return <UserPlus className="h-5 w-5 text-blue-600" />;
      case 'friend_request':
        return <UserCheck className="h-5 w-5 text-green-600" />;
      case 'game_session':
        return <Trophy className="h-5 w-5 text-yellow-600" />;
      case 'collection':
        return <Package className="h-5 w-5 text-purple-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    toast({
      title: "Все уведомления отмечены как прочитанные",
      description: "Все уведомления помечены как прочитанные.",
    });
  };

  const handleSubscribeBack = (userId: string, userName: string) => {
    setNotifications(notifications.filter(n =>
      !(n.type === 'subscription' && n.relatedUserId === userId)
    ));
    
    toast({
      title: "Подписка оформлена",
      description: `Вы подписались на ${userName}. Теперь вы друзья!`,
    });
  };

  const handleAcceptFriendRequest = (userId: string, userName: string) => {
    // Remove the friend request notification
    setNotifications(notifications.filter(n => 
      !(n.type === 'friend_request' && n.relatedUserId === userId)
    ));
    
    toast({
      title: "Заявка принята",
      description: `${userName} добавлен в друзья.`,
    });
  };

  const handleRemoveNotification = (notificationId: string) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Только что';
    if (diffInHours < 24) return `${diffInHours} ч. назад`;
    if (diffInHours < 48) return 'Вчера';
    return date.toLocaleDateString('ru-RU');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Уведомления</h1>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0 ? `${unreadCount} непрочитанных уведомлений` : 'Все уведомления прочитаны'}
            </p>
          </div>
          
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              Отметить все как прочитанные
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`hover:shadow-md transition-shadow ${
                !notification.isRead ? 'border-blue-200 bg-blue-50' : ''
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!notification.isRead && (
                          <Badge variant="default" className="text-xs">
                            Новое
                          </Badge>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveNotification(notification.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {notification.type === 'subscription' && !notification.isRead && (
                      <div className="mt-3 flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSubscribeBack(notification.relatedUserId, notification.relatedUserName)}
                        >
                          Подписаться взамен
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Отметить как прочитанное
                        </Button>
                      </div>
                    )}
                    
                    {notification.type === 'friend_request' && !notification.isRead && (
                      <div className="mt-3 flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAcceptFriendRequest(notification.relatedUserId, notification.relatedUserName)}
                        >
                          Принять в друзья
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Отклонить
                        </Button>
                      </div>
                    )}
                    
                    {!notification.isRead && !['subscription', 'friend_request'].includes(notification.type) && (
                      <div className="mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Отметить как прочитанное
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Нет уведомлений</h3>
            <p className="text-gray-600">Здесь будут отображаться ваши уведомления</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Notifications;
