
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Package, Plus, Trash2, Eye, Heart, ShoppingCart, Star } from "lucide-react";

const Collections = () => {
  const [collections, setCollections] = useState([
    { id: '1', name: 'Моя коллекция', gamesCount: 25, isDefault: true, icon: Package },
    { id: '2', name: 'Играл', gamesCount: 48, isDefault: true, icon: Eye },
    { id: '3', name: 'Хочу сыграть', gamesCount: 12, isDefault: true, icon: Heart },
    { id: '4', name: 'Хочу купить', gamesCount: 8, isDefault: true, icon: ShoppingCart },
    { id: '5', name: 'Продаю', gamesCount: 3, isDefault: true, icon: Package },
    { id: '6', name: 'Любимые стратегии', gamesCount: 15, isDefault: false, icon: Star },
    { id: '7', name: 'Семейные игры', gamesCount: 10, isDefault: false, icon: Package }
  ]);

  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const { toast } = useToast();

  const collectionGames = [
    {
      id: '1',
      titleRu: 'Каркассон',
      titleEn: 'Carcassonne',
      imageUrl: '/placeholder.svg',
      yearPublished: 2000,
      averageRating: 8.2,
      addedAt: '2024-01-10'
    },
    {
      id: '2',
      titleRu: 'Колонизаторы',
      titleEn: 'Catan',
      imageUrl: '/placeholder.svg',
      yearPublished: 1995,
      averageRating: 7.8,
      addedAt: '2024-01-05'
    }
  ];

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите название коллекции",
        variant: "destructive"
      });
      return;
    }

    const newCollection = {
      id: Date.now().toString(),
      name: newCollectionName,
      gamesCount: 0,
      isDefault: false,
      icon: Package
    };

    setCollections([...collections, newCollection]);
    setNewCollectionName('');
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Коллекция создана",
      description: `Коллекция "${newCollectionName}" успешно создана.`,
    });
  };

  const handleDeleteCollection = (collectionId: string) => {
    const collection = collections.find(c => c.id === collectionId);
    if (collection?.isDefault) {
      toast({
        title: "Ошибка",
        description: "Нельзя удалить стандартную коллекцию",
        variant: "destructive"
      });
      return;
    }

    setCollections(collections.filter(c => c.id !== collectionId));
    toast({
      title: "Коллекция удалена",
      description: `Коллекция "${collection?.name}" удалена.`,
    });
  };

  const handleViewCollection = (collection) => {
    setSelectedCollection(collection);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Мои коллекции</h1>
            <p className="text-gray-600 mt-1">Управление коллекциями игр</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Создать коллекцию
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Создать новую коллекцию</DialogTitle>
                <DialogDescription>
                  Введите название для новой коллекции игр
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="collectionName">Название коллекции</Label>
                  <Input
                    id="collectionName"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="Например: Мои любимые игры"
                  />
                </div>
                <Button onClick={handleCreateCollection} className="w-full">
                  Создать коллекцию
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {collections.map((collection) => {
            const IconComponent = collection.icon;
            return (
              <Card key={collection.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">{collection.name}</CardTitle>
                    </div>
                    {collection.isDefault && (
                      <Badge variant="outline" className="text-xs">Стандартная</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{collection.gamesCount}</div>
                      <div className="text-sm text-gray-600">игр в коллекции</div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleViewCollection(collection)}
                      >
                        Просмотр
                      </Button>
                      {!collection.isDefault && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeleteCollection(collection.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Collection Details Dialog */}
        {selectedCollection && (
          <Dialog open={!!selectedCollection} onOpenChange={() => setSelectedCollection(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <selectedCollection.icon className="h-5 w-5" />
                  {selectedCollection.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedCollection.gamesCount} игр в коллекции
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {collectionGames.map((game) => (
                  <Card key={game.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex gap-4">
                        <img 
                          src={game.imageUrl} 
                          alt={game.titleRu}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{game.titleRu}</div>
                          <div className="text-sm text-gray-600">{game.titleEn} ({game.yearPublished})</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-sm">{game.averageRating}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              Добавлено {new Date(game.addedAt).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {collectionGames.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  В этой коллекции пока нет игр
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
};

export default Collections;
