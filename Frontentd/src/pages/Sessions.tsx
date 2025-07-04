
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Plus, Calendar, Users, Star, Crown, Target } from "lucide-react";

const Sessions = () => {
  const [sessions, setSessions] = useState([
    {
      id: '1',
      game: 'Каркассон',
      gameId: '1',
      playedAt: '2024-01-15',
      playersCount: 4,
      players: [
        { id: '1', name: 'Я', isRegistered: true, score: 85, isWinner: true, color: 'red' },
        { id: '2', name: 'Мария', isRegistered: true, score: 78, isWinner: false, color: 'blue' },
        { id: '3', name: 'Дмитрий', isRegistered: false, score: 65, isWinner: false, color: 'green' },
        { id: '4', name: 'Анна', isRegistered: false, score: 72, isWinner: false, color: 'yellow' }
      ]
    },
    {
      id: '2',
      game: 'Колонизаторы',
      gameId: '2',
      playedAt: '2024-01-12',
      playersCount: 3,
      players: [
        { id: '1', name: 'Я', isRegistered: true, score: 8, isWinner: false, color: 'red' },
        { id: '5', name: 'Павел', isRegistered: true, score: 12, isWinner: true, color: 'blue' },
        { id: '6', name: 'Олег', isRegistered: false, score: 10, isWinner: false, color: 'white' }
      ]
    }
  ]);

  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [newSession, setNewSession] = useState({
    gameId: '',
    playedAt: new Date().toISOString().split('T')[0],
    players: [
      { name: 'Я', isRegistered: true, score: 0, isWinner: false, color: 'red' }
    ]
  });

  const { toast } = useToast();

  const availableGames = [
    { id: '1', name: 'Каркассон' },
    { id: '2', name: 'Колонизаторы' },
    { id: '3', name: 'Азул' }
  ];

  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown'];

  const handleAddPlayer = () => {
    const newPlayer = {
      name: '',
      isRegistered: false,
      score: 0,
      isWinner: false,
      color: colors[newSession.players.length % colors.length]
    };
    setNewSession({
      ...newSession,
      players: [...newSession.players, newPlayer]
    });
  };

  const handleUpdatePlayer = (index: number, field: string, value: any) => {
    const updatedPlayers = [...newSession.players];
    updatedPlayers[index] = { ...updatedPlayers[index], [field]: value };
    setNewSession({ ...newSession, players: updatedPlayers });
  };

  const handleRemovePlayer = (index: number) => {
    if (newSession.players.length > 1) {
      const updatedPlayers = newSession.players.filter((_, i) => i !== index);
      setNewSession({ ...newSession, players: updatedPlayers });
    }
  };

  const handleSaveSession = () => {
    if (!newSession.gameId) {
      toast({
        title: "Ошибка",
        description: "Выберите игру",
        variant: "destructive"
      });
      return;
    }

    const game = availableGames.find(g => g.id === newSession.gameId);
    const sessionToSave = {
      id: Date.now().toString(),
      game: game?.name || '',
      gameId: newSession.gameId,
      playedAt: newSession.playedAt,
      playersCount: newSession.players.length,
      players: newSession.players.map((player, index) => ({
        ...player,
        id: index.toString()
      }))
    };

    setSessions([sessionToSave, ...sessions]);
    setIsAddSessionOpen(false);
    
    // Reset form
    setNewSession({
      gameId: '',
      playedAt: new Date().toISOString().split('T')[0],
      players: [
        { name: 'Я', isRegistered: true, score: 0, isWinner: false, color: 'red' }
      ]
    });

    toast({
      title: "Партия добавлена",
      description: `Результат партии в "${game?.name}" сохранен.`,
    });
  };

  const getColorBadge = (color: string) => {
    const colorMap = {
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      pink: 'bg-pink-500',
      brown: 'bg-amber-700',
      white: 'bg-gray-200 border border-gray-400'
    };
    
    return (
      <div className={`w-4 h-4 rounded-full ${colorMap[color] || 'bg-gray-500'}`}></div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Мои партии</h1>
            <p className="text-gray-600 mt-1">История игровых сессий и результаты</p>
          </div>
          
          <Dialog open={isAddSessionOpen} onOpenChange={setIsAddSessionOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Добавить партию
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Добавить результат партии</DialogTitle>
                <DialogDescription>
                  Заполните информацию о сыгранной партии
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="game">Игра</Label>
                    <Select value={newSession.gameId} onValueChange={(value) => setNewSession({...newSession, gameId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите игру" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableGames.map((game) => (
                          <SelectItem key={game.id} value={game.id}>
                            {game.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="playedAt">Дата игры</Label>
                    <Input
                      id="playedAt"
                      type="date"
                      value={newSession.playedAt}
                      onChange={(e) => setNewSession({...newSession, playedAt: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <Label>Игроки</Label>
                    <Button size="sm" variant="outline" onClick={handleAddPlayer}>
                      <Plus className="h-4 w-4 mr-1" />
                      Добавить игрока
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {newSession.players.map((player, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                        {getColorBadge(player.color)}
                        <Input
                          placeholder="Имя игрока"
                          value={player.name}
                          onChange={(e) => handleUpdatePlayer(index, 'name', e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          placeholder="Очки"
                          value={player.score}
                          onChange={(e) => handleUpdatePlayer(index, 'score', parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                        <Button
                          size="sm"
                          variant={player.isWinner ? "default" : "outline"}
                          onClick={() => handleUpdatePlayer(index, 'isWinner', !player.isWinner)}
                        >
                          <Crown className="h-4 w-4" />
                        </Button>
                        {newSession.players.length > 1 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemovePlayer(index)}
                            className="text-red-600"
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={handleSaveSession} className="w-full">
                  Сохранить результат
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {sessions.map((session) => (
            <Card key={session.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                    <div>
                      <CardTitle className="text-xl">{session.game}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(session.playedAt).toLocaleDateString('ru-RU')}
                        <Users className="h-4 w-4 ml-2" />
                        {session.playersCount} игроков
                      </CardDescription>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedSession(session)}
                  >
                    Подробнее
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-medium">Результаты:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {session.players.map((player, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          {getColorBadge(player.color)}
                          <span className="font-medium">{player.name}</span>
                          {!player.isRegistered && (
                            <Badge variant="outline" className="text-xs">Гость</Badge>
                          )}
                          {player.isWinner && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <span className="font-bold">{player.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sessions.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Пока нет записанных партий</h3>
            <p className="text-gray-600">Добавьте первую партию, чтобы начать вести статистику</p>
          </div>
        )}

        {/* Session Details Dialog */}
        {selectedSession && (
          <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  {selectedSession.game}
                </DialogTitle>
                <DialogDescription>
                  Партия от {new Date(selectedSession.playedAt).toLocaleDateString('ru-RU')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Дата:</strong> {new Date(selectedSession.playedAt).toLocaleDateString('ru-RU')}</div>
                  <div><strong>Игроков:</strong> {selectedSession.playersCount}</div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Результаты игроков:</h4>
                  <div className="space-y-2">
                    {selectedSession.players
                      .sort((a, b) => b.score - a.score)
                      .map((player, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="text-lg font-bold text-gray-500">#{index + 1}</div>
                            {getColorBadge(player.color)}
                            <div>
                              <div className="font-medium">{player.name}</div>
                              <div className="text-sm text-gray-600">
                                {player.isRegistered ? 'Зарегистрированный' : 'Гость'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold">{player.score}</span>
                            {player.isWinner && (
                              <Crown className="h-5 w-5 text-yellow-500" />
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
};

export default Sessions;
