import { useEffect, useState } from "react";
import { Row, Col, Card, Form, Button, Badge, Modal, Dropdown } from "react-bootstrap";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { usePaginatedList } from "../hooks/usePaginatedList";
import Pagination from "../components/Pagination";
import { ErrorAlert, Loading } from "../components/Status";

const PAGE_SIZE = 12;

const emptyGame = () => ({
  alias: "",
  titleRu: "",
  titleEn: "",
  minPlayers: 1,
  maxPlayers: 4,
  minAge: 6,
  minPlayTime: 15,
  maxPlayTime: 60,
  yearPublished: new Date().getFullYear(),
  imageUrl: "",
});

const Games = () => {
  const { user } = useAuth();
  const [collections, setCollections] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState("");
  const [newGame, setNewGame] = useState(emptyGame);

  const { items: games, totalPages, page, setPage, searchTerm, setSearchTerm, loading, reload } =
    usePaginatedList({
      fetcher: api.games,
      pageSize: PAGE_SIZE,
      onError: (message) => setError(message),
    });

  const loadCollections = () => {
    if (!user) return;
    api.collections().then(setCollections).catch(() => {});
  };

  useEffect(() => {
    if (user) loadCollections();
  }, [user]);

  const handleAddToCollection = async (gameId: string, collectionId: string) => {
    try {
      await api.addGameToCollection(collectionId, gameId);
      setError("");
      await reload();
      loadCollections();
    } catch (err: any) {
      setError(err.message || "Не удалось добавить в коллекцию");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await api.createGame(newGame);
      setShowCreate(false);
      setNewGame(emptyGame());
      if (page === 1) await reload();
      else setPage(1);
    } catch (err: any) {
      setError(err.message || "Не удалось добавить игру");
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Настольные игры</h1>
        <Button onClick={() => setShowCreate(true)}>Добавить игру</Button>
      </div>

      <ErrorAlert message={error} />

      <Form.Control
        className="mb-4"
        placeholder="Поиск по названию или алиасу..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {games.length === 0 ? (
        <p className="text-muted">Игры не найдены</p>
      ) : (
        <>
          <Row xs={1} md={2} lg={3} className="g-4">
            {games.map((game) => (
            <Col key={game.id}>
              <Card className="h-100">
                {game.imageUrl && (
                  <Card.Img variant="top" src={game.imageUrl} alt={game.titleRu} />
                )}
                <Card.Body>
                  <Card.Title>{game.titleRu}</Card.Title>
                  <Card.Text className="text-muted">
                    {game.titleEn} ({game.yearPublished})
                  </Card.Text>
                  <div>
                    <Badge bg="secondary" className="me-1">
                      {game.minPlayers}-{game.maxPlayers} игроков
                    </Badge>
                    <Badge bg="secondary" className="me-1">
                      {game.minAge}+
                    </Badge>
                    <Badge bg="secondary" className="me-1">
                      {game.minPlayTime}-{game.maxPlayTime} мин
                    </Badge>
                  </div>
                  {game.inCollections && game.inCollections.length > 0 && (
                    <div className="mt-3">
                      <span className="text-muted small">В коллекциях: </span>
                      {game.inCollections.map((c: any) => (
                        <Badge key={c.id} bg="info" className="me-1">
                          {c.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {user && (
                    <Dropdown className="mt-3">
                      <Dropdown.Toggle variant="outline-success" size="sm">
                        В коллекцию
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {collections
                          .filter((c) => !game.inCollections?.some((x: any) => x.id === c.id))
                          .map((c) => (
                            <Dropdown.Item
                              key={c.id}
                              onClick={() => handleAddToCollection(game.id, c.id)}
                            >
                              {c.name}
                            </Dropdown.Item>
                          ))}
                        {collections.every((c) => game.inCollections?.some((x: any) => x.id === c.id)) && (
                          <Dropdown.Item disabled>Игра уже во всех коллекциях</Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
          </Row>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}

      <Modal show={showCreate} onHide={() => setShowCreate(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Добавить новую игру</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreate}>
            <Form.Group className="mb-3">
              <Form.Label>Алиас (уникальный)</Form.Label>
              <Form.Control
                value={newGame.alias}
                onChange={(e) => setNewGame({ ...newGame, alias: e.target.value })}
                placeholder="carcassonne"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Название (рус)</Form.Label>
              <Form.Control
                value={newGame.titleRu}
                onChange={(e) => setNewGame({ ...newGame, titleRu: e.target.value })}
                placeholder="Каркассон"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Название (англ)</Form.Label>
              <Form.Control
                value={newGame.titleEn}
                onChange={(e) => setNewGame({ ...newGame, titleEn: e.target.value })}
                placeholder="Carcassonne"
                required
              />
            </Form.Group>
            <Row className="mb-3">
              <Col xs={6}>
                <Form.Label>Мин. игроков</Form.Label>
                <Form.Control
                  type="number"
                  value={newGame.minPlayers}
                  onChange={(e) => setNewGame({ ...newGame, minPlayers: parseInt(e.target.value) || 1 })}
                />
              </Col>
              <Col xs={6}>
                <Form.Label>Макс. игроков</Form.Label>
                <Form.Control
                  type="number"
                  value={newGame.maxPlayers}
                  onChange={(e) => setNewGame({ ...newGame, maxPlayers: parseInt(e.target.value) || 1 })}
                />
              </Col>
            </Row>
            <Button type="submit" variant="primary" className="w-100">
              Добавить игру
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Games;
