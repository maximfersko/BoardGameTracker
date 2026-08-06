import { useEffect, useState } from "react";
import { Card, Button, Form, Modal, Badge, Row, Col } from "react-bootstrap";
import { useAuth } from "../lib/auth";
import { api } from "../lib/api";
import { formatDate, toDateInput } from "../lib/utils";
import Pagination from "../components/Pagination";
import { ErrorAlert, Loading } from "../components/Status";

const PAGE_SIZE = 10;

const emptyForm = {
  gameId: "",
  playedAt: new Date().toISOString().split("T")[0],
  players: [{ name: "", score: 0 }],
};

const Sessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<any>(null);

  const [form, setForm] = useState(emptyForm);

  const reload = (p: number) =>
    api
      .sessions(p, PAGE_SIZE)
      .then((r) => {
        setSessions(r.items);
        setTotalPages(r.totalPages);
      })
      .catch(() => {});

  useEffect(() => {
    setLoading(true);
    reload(page).finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    api.games("", 1, 100).then((r) => setGames(r.items)).catch(() => {});
  }, []);

  const handleAddPlayer = () => {
    setForm({ ...form, players: [...form.players, { name: "", score: 0 }] });
  };

  const handleUpdatePlayer = (index: number, field: string, value: any) => {
    const players = [...form.players];
    players[index] = { ...players[index], [field]: value };
    setForm({ ...form, players });
  };

  const handleRemovePlayer = (index: number) => {
    if (form.players.length > 1) {
      setForm({ ...form, players: form.players.filter((_, i) => i !== index) });
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEdit = (session: any) => {
    setEditingId(session.id);
    setForm({
      gameId: session.gameId,
      playedAt: toDateInput(session.playedAt),
      players: session.players.map((p: any) => ({ name: p.name, score: p.score })),
    });
    setSelected(null);
    setError("");
    setShowForm(true);
  };

  const handleDelete = async (session: any) => {
    if (!window.confirm("Удалить эту партию?")) return;
    try {
      await api.deleteSession(session.id);
      setSelected(null);
      if (sessions.length === 1 && page > 1) {
        const p = page - 1;
        setPage(p);
        reload(p);
      } else {
        reload(page);
      }
    } catch (err: any) {
      setError(err.message || "Не удалось удалить партию");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.gameId) {
      setError("Выберите игру");
      return;
    }
    const payload = {
      gameId: form.gameId,
      playedAt: new Date(form.playedAt),
      players: form.players.map((p) => ({ name: p.name, score: p.score })),
    };
    try {
      if (editingId) {
        await api.updateSession(editingId, payload);
        reload(page);
      } else {
        await api.createSession(payload);
        setPage(1);
        reload(1);
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
    } catch (err: any) {
      setError(err.message || "Не удалось сохранить партию");
    }
  };

  if (!user) return <p>Войдите в аккаунт для просмотра партий.</p>;
  if (loading) return <Loading />;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Мои партии</h1>
        <Button onClick={openCreate}>Добавить партию</Button>
      </div>

      <ErrorAlert message={error} />

      {sessions.length === 0 ? (
        <p className="text-muted">Пока нет записанных партий</p>
      ) : (
        <>
          <div className="d-flex flex-column gap-3">
            {sessions.map((session) => (
              <Card key={session.id}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-1">{session.game}</h5>
                      <div className="text-muted">
                        {formatDate(session.playedAt)} ·{" "}
                        {session.playersCount} игроков
                      </div>
                    </div>
                    <Button variant="outline-primary" size="sm" onClick={() => setSelected(session)}>
                      Подробнее
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}

      <Modal show={showForm} onHide={() => setShowForm(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingId ? "Изменить результат партии" : "Добавить результат партии"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {games.length === 0 ? (
            <p className="text-muted mb-0">Сначала добавьте игру, затем записывайте партии</p>
          ) : (
          <Form onSubmit={handleSave}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Игра</Form.Label>
                <Form.Select
                  value={form.gameId}
                  onChange={(e) => setForm({ ...form, gameId: e.target.value })}
                >
                  <option value="">Выберите игру</option>
                  {games.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.titleRu}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label>Дата игры</Form.Label>
                <Form.Control
                  type="date"
                  value={form.playedAt}
                  onChange={(e) => setForm({ ...form, playedAt: e.target.value })}
                />
              </Col>
            </Row>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <Form.Label className="mb-0">Игроки</Form.Label>
              <Button size="sm" variant="outline-primary" onClick={handleAddPlayer}>
                Добавить игрока
              </Button>
            </div>

            <div className="d-flex flex-column gap-2 mb-3">
              {form.players.map((player, index) => (
                <div key={index} className="d-flex gap-2 align-items-center">
                  <Form.Control
                    placeholder="Имя игрока"
                    value={player.name}
                    onChange={(e) => handleUpdatePlayer(index, "name", e.target.value)}
                  />
                  <Form.Control
                    type="number"
                    placeholder="Очки"
                    style={{ maxWidth: 120 }}
                    value={player.score}
                    onChange={(e) => handleUpdatePlayer(index, "score", parseInt(e.target.value) || 0)}
                  />
                  {form.players.length > 1 && (
                    <Button variant="outline-danger" onClick={() => handleRemovePlayer(index)}>
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button type="submit" variant="primary" className="w-100">
              {editingId ? "Сохранить изменения" : "Сохранить результат"}
            </Button>
          </Form>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={!!selected} onHide={() => setSelected(null)}>
        <Modal.Header closeButton>
          <Modal.Title>{selected?.game}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <>
              <p className="text-muted">
                Партия от {formatDate(selected.playedAt)}
              </p>
              <div className="d-flex flex-column gap-2">
                {selected.players
                  .slice()
                  .sort((a: any, b: any) => b.score - a.score)
                  .map((p: any, index: number) => (
                    <div
                      key={index}
                      className="d-flex justify-content-between align-items-center p-2 bg-light rounded"
                    >
                      <span>
                        <strong>#{index + 1}</strong> {p.name}{" "}
                        {!p.isRegistered && <Badge bg="secondary" className="ms-1">Гость</Badge>}
                        {p.isWinner && <Badge bg="success" className="ms-1">Победа</Badge>}
                      </span>
                      <span className="fw-bold">{p.score}</span>
                    </div>
                  ))}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={() => handleDelete(selected)}>
            Удалить
          </Button>
          <Button variant="outline-primary" onClick={() => openEdit(selected)}>
            Редактировать
          </Button>
          <Button variant="primary" onClick={() => setSelected(null)}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Sessions;
