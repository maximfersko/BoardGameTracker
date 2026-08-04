import { useEffect, useState } from "react";
import { Row, Col, Card, ListGroup } from "react-bootstrap";
import { useAuth } from "../lib/auth";
import { api } from "../lib/api";
import { formatDate } from "../lib/utils";

const Index = () => {
  const { user } = useAuth();
  const [gamesCount, setGamesCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);

  useEffect(() => {
    api.games("", 1, 1).then((r) => setGamesCount(r.totalCount)).catch(() => {});
    api.users("", 1, 1).then((r) => setUsersCount(r.totalCount)).catch(() => {});
    if (!user) return;
    api.sessions(1, 5).then((r) => setRecentSessions(r.items)).catch(() => {});
  }, [user]);

  return (
    <>
      <h1 className="mb-4">Добро пожаловать в BoardGameTracker</h1>
      {user ? (
        <Card className="mb-4">
          <Card.Body>
            <h4 className="mb-1">{user.displayName}</h4>
            <p className="text-muted mb-0">{user.email}</p>
          </Card.Body>
        </Card>
      ) : (
        <Card className="mb-4">
          <Card.Body>
            <p className="mb-0">
              Войдите в аккаунт, чтобы добавлять игры, вести коллекции и записывать партии.
            </p>
          </Card.Body>
        </Card>
      )}

      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Платформа</Card.Title>
              <Row className="text-center">
                <Col>
                  <div className="fs-3 fw-bold">{gamesCount}</div>
                  <div className="text-muted">настольных игр</div>
                </Col>
                <Col>
                  <div className="fs-3 fw-bold">{usersCount}</div>
                  <div className="text-muted">игроков</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Последние партии</Card.Title>
              {recentSessions.length === 0 ? (
                <p className="text-muted mb-0">Пока нет записанных партий</p>
              ) : (
                <ListGroup variant="flush">
                  {recentSessions.map((s) => (
                    <ListGroup.Item key={s.id} className="d-flex justify-content-between">
                      <span>{s.game}</span>
                      <span className="text-muted">
                        {formatDate(s.playedAt)}
                      </span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Index;
