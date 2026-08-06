import { useEffect, useState } from "react";
import { Row, Col, Card, Button, Badge, Form, Modal, ListGroup } from "react-bootstrap";
import { useAuth } from "../lib/auth";
import { api } from "../lib/api";
import { ErrorAlert, Loading } from "../components/Status";

const Collections = () => {
  const { user } = useAuth();
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<any>(null);

  const loadCollections = () => {
    api
      .collections()
      .then(setCollections)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await api.createCollection(name);
      setShowCreate(false);
      setName("");
      loadCollections();
    } catch (err: any) {
      setError(err.message || "Не удалось создать коллекцию");
    }
  };

  const handleRemoveGame = async (collectionId: string, gameId: string) => {
    try {
      await api.removeGameFromCollection(collectionId, gameId);
      loadCollections();
      setSelected(null);
    } catch (err: any) {
      setError(err.message || "Не удалось удалить игру из коллекции");
    }
  };

  if (!user) return <p>Войдите в аккаунт для просмотра коллекций.</p>;
  if (loading) return <Loading />;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Мои коллекции</h1>
        <Button onClick={() => setShowCreate(true)}>Создать коллекцию</Button>
      </div>

      <ErrorAlert message={error} />

      {collections.length === 0 ? (
        <p className="text-muted">Пока нет коллекций</p>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {collections.map((c) => (
            <Col key={c.id}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>
                    {c.name}{" "}
                    {c.isDefault && <Badge bg="secondary" className="ms-1">Стандартная</Badge>}
                  </Card.Title>
                  <div className="text-center my-3">
                    <div className="fs-2 fw-bold">{c.gamesCount}</div>
                    <div className="text-muted">игр в коллекции</div>
                  </div>
                  <Button variant="outline-primary" className="w-100" onClick={() => setSelected(c)}>
                    Просмотр
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showCreate} onHide={() => setShowCreate(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Создать новую коллекцию</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreate}>
            <Form.Group className="mb-3">
              <Form.Label>Название коллекции</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: Мои любимые игры"
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">
              Создать коллекцию
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={!!selected} onHide={() => setSelected(null)}>
        <Modal.Header closeButton>
          <Modal.Title>{selected?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && selected.games && selected.games.length > 0 ? (
            <ListGroup>
              {selected.games.map((g: any) => (
                <ListGroup.Item key={g.id} className="d-flex justify-content-between align-items-center">
                  <span>
                    {g.titleRu}{" "}
                    <span className="text-muted">
                      {g.titleEn} ({g.yearPublished})
                    </span>
                  </span>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleRemoveGame(selected.id, g.id)}
                  >
                    Убрать
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p className="text-muted mb-0">В этой коллекции пока нет игр</p>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Collections;
