import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Row, Col, Badge, ListGroup, Tab, Nav, Button } from "react-bootstrap";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { getInitials, formatDate } from "../lib/utils";

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState<Record<string, any[]>>({});

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setLists({});
    api
      .user(id)
      .then(setUser)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const loadList = async (key: "friends" | "subscribers" | "following") => {
    if (lists[key] || !id) return;
    try {
      const data = await api[key](id);
      setLists((prev) => ({ ...prev, [key]: data }));
    } catch {}
  };

  const handleSubscribe = async () => {
    if (!id) return;
    try {
      await api.subscribe(id);
      api.user(id).then(setUser);
    } catch {}
  };

  const handleUnsubscribe = async () => {
    if (!id) return;
    try {
      await api.unsubscribe(id);
      api.user(id).then(setUser);
    } catch {}
  };

  if (loading) return <p>Загрузка...</p>;
  if (!user) return <p className="text-muted">Пользователь не найден</p>;

  const isSelf = currentUser && currentUser.id === user.id;

  return (
    <>
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex align-items-center gap-4">
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
              style={{ width: 96, height: 96, fontSize: 32 }}
            >
              {getInitials(user.displayName)}
            </div>
            <div className="flex-grow-1">
              <h2 className="mb-1">{user.displayName}</h2>
              <p className="text-muted mb-2">{user.email}</p>
              <p className="mb-0">
                На сайте с {formatDate(user.registeredAt)}
              </p>
            </div>
            {currentUser && !isSelf && (
              <div>
                {user.subscriptionStatus === "none" ? (
                  <Button variant="primary" onClick={handleSubscribe}>
                    Подписаться
                  </Button>
                ) : (
                  <Button variant="outline-secondary" onClick={handleUnsubscribe}>
                    {user.subscriptionStatus === "friend" ? "Вы друзья — отписаться" : "Отписаться"}
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      <Row className="mb-4">
        <Col md={3}>
          <div className="text-center">
            <div className="fs-3 fw-bold">{user.gamesCount}</div>
            <div className="text-muted">игр в коллекциях</div>
          </div>
        </Col>
        <Col md={3}>
          <div className="text-center">
            <div className="fs-3 fw-bold">{user.sessionsCount}</div>
            <div className="text-muted">партий сыграно</div>
          </div>
        </Col>
        <Col md={3}>
          <div className="text-center">
            <div className="fs-3 fw-bold">{user.followersCount}</div>
            <div className="text-muted">подписчиков</div>
          </div>
        </Col>
        <Col md={3}>
          <div className="text-center">
            <div className="fs-3 fw-bold">{user.followingCount}</div>
            <div className="text-muted">подписок</div>
          </div>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Header>Коллекции</Card.Header>
        {user.collections && user.collections.length > 0 ? (
          <ListGroup variant="flush">
            {user.collections.map((c: any) => (
              <ListGroup.Item key={c.id} className="d-flex justify-content-between align-items-center">
                <span>
                  {c.name}{" "}
                  {c.isDefault && <Badge bg="secondary" className="ms-1">По умолчанию</Badge>}
                </span>
                <span className="text-muted">{c.gamesCount} игр</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <Card.Body className="text-muted">Нет коллекций</Card.Body>
        )}
      </Card>

      <Card>
        <Card.Header>Друзья и подписки</Card.Header>
        <Tab.Container defaultActiveKey="friends">
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="friends" onClick={() => loadList("friends")}>Друзья</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="subscribers" onClick={() => loadList("subscribers")}>Подписчики</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="following" onClick={() => loadList("following")}>Подписки</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            {(["friends", "subscribers", "following"] as const).map((key) => {
              const label =
                key === "friends" ? "Друзья" : key === "subscribers" ? "Подписчики" : "Подписки";
              const items = lists[key];
              return (
                <Tab.Pane key={key} eventKey={key}>
                  <ListGroup variant="flush">
                    {items && items.length > 0 ? (
                      items.map((u) => (
                        <ListGroup.Item key={u.id} className="d-flex justify-content-between align-items-center">
                          <div>
                            <Link to={`/profile/${u.id}`} className="fw-bold text-decoration-none">
                              {u.displayName}
                            </Link>
                            {u.subscriptionStatus === "friend" && (
                              <Badge bg="success" className="ms-2">Друг</Badge>
                            )}
                          </div>
                          <span className="text-muted small">{u.followersCount} подписчиков</span>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <Card.Body className="text-muted">Пока нет</Card.Body>
                    )}
                  </ListGroup>
                </Tab.Pane>
              );
            })}
          </Tab.Content>
        </Tab.Container>
      </Card>
    </>
  );
};

export default Profile;
