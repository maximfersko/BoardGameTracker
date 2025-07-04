
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, User, BookOpen, Users, Package, Trophy } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const unreadNotifications = 3;

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold text-gray-900">
              BoardGameTracker
            </Link>
          </div>
          
          <nav className="flex space-x-1">
            <Link to="/games">
              <Button 
                variant={isActive('/games') ? "default" : "ghost"} 
                size="sm"
                className="flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Игры
              </Button>
            </Link>
            
            <Link to="/users">
              <Button 
                variant={isActive('/users') ? "default" : "ghost"} 
                size="sm"
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Пользователи
              </Button>
            </Link>
            
            <Link to="/collections">
              <Button 
                variant={isActive('/collections') ? "default" : "ghost"} 
                size="sm"
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                Коллекции
              </Button>
            </Link>
            
            <Link to="/sessions">
              <Button 
                variant={isActive('/sessions') ? "default" : "ghost"} 
                size="sm"
                className="flex items-center gap-2"
              >
                <Trophy className="h-4 w-4" />
                Партии
              </Button>
            </Link>
            
            <Link to="/notifications">
              <Button 
                variant={isActive('/notifications') ? "default" : "ghost"} 
                size="sm"
                className="flex items-center gap-2 relative"
              >
                <Bell className="h-4 w-4" />
                Уведомления
                {unreadNotifications > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
            </Link>
            
            <Link to="/profile/current">
              <Button 
                variant={isActive('/profile/current') ? "default" : "ghost"} 
                size="sm"
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Профиль
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
