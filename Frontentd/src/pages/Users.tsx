import { Row, Col, Card, Form, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { usePaginatedList } from "../hooks/usePaginatedList";
import { getInitials, formatDate } from "../lib/utils";
import Pagination from "../components/Pagination";
import { Loading } from "../components/Status";

const PAGE_SIZE = 12;

const Users = () => {
  const { user: currentUser } = useAuth();
  const { items: users, totalPages, page, setPage, searchTerm, setSearchTerm, loading, reload } =
    usePaginatedList({ fetcher: api.users, pageSize: PAGE_SIZE });

  const handleToggleSubscription = async (id: string) => {
    const subscription = users.find((u) => u.id === id);
    try {
      if (subscription?.subscriptionStatus === "none") await api.subscribe(id);
      else await api.unsubscribe(id);
      await reload();
    } catch {}
  };

  if (loading) return <Loading />;

  return (
    <>
      <h1 className="mb-4">Сообщество игроков</h1>

      <Form.Control
        className="mb-4"
        placeholder="Поиск пользователей..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {users.length === 0 ? (
        <p className="text-muted">Пользователи не найдены</p>
      ) : (
        <>
        <Row xs={1} md={2} lg={3} className="g-4">
          {users.map((user) => (
            <Col key={user.id}>
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: 48, height: 48 }}>
                      {getInitials(user.displayName)}
                    </div>
                    <div>
                      <Card.Title className="mb-0">{user.displayName}</Card.Title>
                      <div className="text-muted">
                        На сайте с {formatDate(user.registeredAt)}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-around text-center mb-3">
                    <div>
                      <div className="fw-bold">{user.gamesCount}</div>
                      <div className="text-muted small">игр</div>
                    </div>
                    <div>
                      <div className="fw-bold">{user.sessionsCount}</div>
                      <div className="text-muted small">партий</div>
                    </div>
                    <div>
                      <div className="fw-bold">{user.followersCount}</div>
                      <div className="text-muted small">подписчиков</div>
                    </div>
                  </div>
                  {user.subscriptionStatus !== "none" && (
                    <div className="text-center mb-3">
                      {user.subscriptionStatus === "friend" && <Badge bg="success">Друг</Badge>}
                      {user.subscriptionStatus === "following" && (
                        <Badge bg="secondary">Подписка</Badge>
                      )}
                    </div>
                  )}
                  {currentUser && currentUser.id !== user.id && (
                    <div className="mb-3">
                      {user.subscriptionStatus === "none" ? (
                        <Button
                          variant="primary"
                          className="w-100"
                          onClick={() => handleToggleSubscription(user.id)}
                        >
                          Подписаться
                        </Button>
                      ) : (
                        <Button
                          variant="outline-secondary"
                          className="w-100"
                          onClick={() => handleToggleSubscription(user.id)}
                        >
                          Отписаться
                        </Button>
                      )}
                    </div>
                  )}
                  <Link to={`/profile/${user.id}`} className="btn btn-outline-primary w-100">
                    Профиль
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </>
  );
};

export default Users;
