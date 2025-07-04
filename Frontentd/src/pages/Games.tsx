import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Search, Users, Plus, Eye, Heart, ShoppingCart, Package, Star } from "lucide-react";

const mockGames = [
  {
    id: '1',
    alias: 'carcassonne',
    titleRu: 'Каркассон',
    titleEn: 'Carcassonne',
    imageUrl: '/placeholder.svg',
    minPlayers: 2,
    maxPlayers: 5,
    minAge: 7,
    minPlayTime: 35,
    maxPlayTime: 45,
    yearPublished: 2000,
    averageRating: 8.2,
    inCollections: ['Моя коллекция', 'Играл'],
    userRating: 9
  },
  {
    id: '2',
    alias: 'catan',
    titleRu: 'Колонизаторы',
    titleEn: 'Catan',
    imageUrl: '/placeholder.svg',
    minPlayers: 3,
    maxPlayers: 4,
    minAge: 10,
    minPlayTime: 60,
    maxPlayTime: 120,
    yearPublished: 1995,
    averageRating: 7.8,
    inCollections: ['Хочу сыграть'],
    userRating: null
  },
  {
    id: '3',
    alias: 'azul',
    titleRu: 'Азул',
    titleEn: 'Azul',
    imageUrl: '/placeholder.svg',
    minPlayers: 2,
    maxPlayers: 4,
    minAge: 8,
    minPlayTime: 30,
    maxPlayTime: 45,
    yearPublished: 2017,
    averageRating: 8.5,
    inCollections: [],
    userRating: null
  }
];

const defaultCollections = [
  { id: 'my-collection', name: 'Моя коллекция', icon: Package },
  { id: 'played', name: 'Играл', icon: Eye },
  { id: 'want-to-play', name: 'Хочу сыграть', icon: Heart },
  { id: 'want-to-buy', name: 'Хочу купить', icon: ShoppingCart },
  { id: 'selling', name: 'Продаю', icon: Package }
];

const Games = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGames, setFilteredGames] = useState(mockGames);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [currentGameForCollection, setCurrentGameForCollection] = useState(null);
  const [newGame, setNewGame] = useState({
    alias: '',
    titleRu: '',
    titleEn: '',
    minPlayers: 1,
    maxPlayers: 10,
    minAge: 1,
    minPlayTime: 15,
    maxPlayTime: 120,
    yearPublished: new Date().getFullYear(),
    imageUrl: ''
  });
  const [userRating, setUserRating] = useState(0);
  
  const { toast } = useToast();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = mockGames.filter(game => 
      game.titleRu.toLowerCase().includes(value.toLowerCase()) ||
      game.titleEn.toLowerCase().includes(value.toLowerCase()) ||
      game.alias.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredGames(filtered);
  };

  const handleAddGame = () => {
    console.log('Добавление новой игры:', newGame);
    toast({
      title: "Игра добавлена",
      description: `Игра "${newGame.titleRu}" успешно добавлена в базу.`,
    });
    setIsAddGameOpen(false);
    setNewGame({
      alias: '',
      titleRu: '',
      titleEn: '',
      minPlayers: 1,
      maxPlayers: 10,
      minAge: 1,
      minPlayTime: 15,
      maxPlayTime: 120,
      yearPublished: new Date().getFullYear(),
      imageUrl: ''
    });
  };

  const handleAddToCollection = (gameId: string, collectionName: string) => {
    console.log(`Добавление игры ${gameId} в коллекцию ${collectionName}`);
    toast({
      title: "Добавлено в коллекцию",
      description: `Игра добавлена в коллекцию "${collectionName}".`,
    });
    setIsCollectionDialogOpen(false);
  };

  const handleRateGame = (gameId: string, rating: number) => {
    console.log(`Оценка игры ${gameId}: ${rating}`);
    toast({
      title: "Оценка сохранена",
      description: `Вы оценили игру на ${rating} баллов.`,
    });
    setIsRatingDialogOpen(false);
  };

  const openCollectionDialog = (game) => {
    setCurrentGameForCollection(game);
    setIsCollectionDialogOpen(true);
  };

  const openRatingDialog = (game) => {
    setCurrentGameForCollection(game);
    setUserRating(game.userRating || 0);
    setIsRatingDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-semibold text-gray-900">
                  BoardGameTracker
                </Link>
              </div>
              <nav className="flex space-x-4">
                <Link to="/games" className="text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Игры
                </Link>
                <Link to="/users" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Пользователи
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Настольные игры</h1>
            <p className="text-gray-600 mt-1">База игр и управление коллекциями</p>
          </div>
          
          <Dialog open={isAddGameOpen} onOpenChange={setIsAddGameOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Добавить игру
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Добавить новую игру</DialogTitle>
                <DialogDescription>
                  Заполните информацию о настольной игре
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="alias">Алиас (уникальный)</Label>
                  <Input
                    id="alias"
                    value={newGame.alias}
                    onChange={(e) => setNewGame({...newGame, alias: e.target.value})}
                    placeholder="carcassonne"
                  />
                </div>
                <div>
                  <Label htmlFor="titleRu">Название (рус)</Label>
                  <Input
                    id="titleRu"
                    value={newGame.titleRu}
                    onChange={(e) => setNewGame({...newGame, titleRu: e.target.value})}
                    placeholder="Каркассон"
                  />
                </div>
                <div>
                  <Label htmlFor="titleEn">Название (англ)</Label>
                  <Input
                    id="titleEn"
                    value={newGame.titleEn}
                    onChange={(e) => setNewGame({...newGame, titleEn: e.target.value})}
                    placeholder="Carcassonne"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minPlayers">Мин. игроков</Label>
                    <Input
                      id="minPlayers"
                      type="number"
                      value={newGame.minPlayers}
                      onChange={(e) => setNewGame({...newGame, minPlayers: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxPlayers">Макс. игроков</Label>
                    <Input
                      id="maxPlayers"
                      type="number"
                      value={newGame.maxPlayers}
                      onChange={(e) => setNewGame({...newGame, maxPlayers: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <Button onClick={handleAddGame} className="w-full">
                  Добавить игру
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Поиск игр по названию или алиасу..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <Card key={game.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <img 
                  src={game.imageUrl} 
                  alt={game.titleRu}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
                <CardTitle className="text-lg">{game.titleRu}</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  {game.titleEn} ({game.yearPublished})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    {game.minPlayers === game.maxPlayers 
                      ? `${game.minPlayers} игрока` 
                      : `${game.minPlayers}-${game.maxPlayers} игроков`
                    }
                  </div>
                  <div className="text-sm text-gray-600">
                    Время: {game.minPlayTime}-{game.maxPlayTime} мин
                  </div>
                  <div className="text-sm text-gray-600">
                    Возраст: {game.minAge}+
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    {game.averageRating.toFixed(1)}
                    {game.userRating && (
                      <span className="ml-2 text-blue-600">
                        (Ваша: {game.userRating})
                      </span>
                    )}
                  </div>
                </div>

                {game.inCollections.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {game.inCollections.map((collection) => (
                      <Badge 
                        key={collection} 
                        variant="secondary" 
                        className="text-xs cursor-pointer hover:bg-gray-200"
                        onClick={() => {
                          toast({
                            title: "Переход в коллекцию",
                            description: `Открываем коллекцию "${collection}".`,
                          });
                        }}
                      >
                        {collection}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex flex-col space-y-2">
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => openCollectionDialog(game)}
                    >
                      В коллекцию
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => openRatingDialog(game)}
                    >
                      <Star className="h-3 w-3 mr-1" />
                      Оценить
                    </Button>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setSelectedGame(game)}
                  >
                    Подробнее
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Игры не найдены</h3>
            <p className="text-gray-600">Попробуйте изменить поисковый запрос</p>
          </div>
        )}

        <Dialog open={isCollectionDialogOpen} onOpenChange={setIsCollectionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить в коллекцию</DialogTitle>
              <DialogDescription>
                Выберите коллекцию для игры "{currentGameForCollection?.titleRu}"
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-2">
              {defaultCollections.map((collection) => {
                const IconComponent = collection.icon;
                return (
                  <Button
                    key={collection.id}
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAddToCollection(currentGameForCollection?.id, collection.name)}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {collection.name}
                  </Button>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Оценить игру</DialogTitle>
              <DialogDescription>
                Оцените игру "{currentGameForCollection?.titleRu}" от 1 до 10
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                  <Button
                    key={rating}
                    variant={userRating >= rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUserRating(rating)}
                    className="w-8 h-8 p-0"
                  >
                    {rating}
                  </Button>
                ))}
              </div>
              <Button 
                onClick={() => handleRateGame(currentGameForCollection?.id, userRating)}
                className="w-full"
                disabled={userRating === 0}
              >
                Сохранить оценку
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {selectedGame && (
          <Dialog open={!!selectedGame} onOpenChange={() => setSelectedGame(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{selectedGame.titleRu}</DialogTitle>
                <DialogDescription>{selectedGame.titleEn}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <img 
                  src={selectedGame.imageUrl} 
                  alt={selectedGame.titleRu}
                  className="w-full h-64 object-cover rounded-md"
                />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Алиас:</strong> {selectedGame.alias}</div>
                  <div><strong>Игроки:</strong> {selectedGame.minPlayers}-{selectedGame.maxPlayers}</div>
                  <div><strong>Возраст:</strong> {selectedGame.minAge}+</div>
                  <div><strong>Время:</strong> {selectedGame.minPlayTime}-{selectedGame.maxPlayTime} мин</div>
                  <div><strong>Год:</strong> {selectedGame.yearPublished}</div>
                  <div><strong>Рейтинг:</strong> {selectedGame.averageRating.toFixed(1)}/10</div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
};

export default Games;
