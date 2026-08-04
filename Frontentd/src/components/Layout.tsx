import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link ${isActive ? "active" : ""}`;

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={NavLink} to="/">
            BoardGameTracker
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/games" className={navLinkClass}>
                Игры
              </Nav.Link>
              <Nav.Link as={NavLink} to="/users" className={navLinkClass}>
                Пользователи
              </Nav.Link>
              <Nav.Link as={NavLink} to="/collections" className={navLinkClass}>
                Коллекции
              </Nav.Link>
              <Nav.Link as={NavLink} to="/sessions" className={navLinkClass}>
                Партии
              </Nav.Link>
            </Nav>
            <Nav>
              {user ? (
                <>
                  <Nav.Link as={NavLink} to={`/profile/${user.id}`} className={navLinkClass}>
                    {user.displayName}
                  </Nav.Link>
                  <Nav.Link onClick={handleLogout} className="nav-link">
                    Выйти
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link as={NavLink} to="/login" className={navLinkClass}>
                  Войти
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="pb-5">
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
