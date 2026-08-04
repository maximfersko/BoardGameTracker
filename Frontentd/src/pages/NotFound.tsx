import { Container } from "react-bootstrap";

const NotFound = () => (
  <Container className="text-center py-5">
    <h1 className="display-1">404</h1>
    <p className="fs-4">Страница не найдена</p>
    <a href="/" className="btn btn-primary">
      На главную
    </a>
  </Container>
);

export default NotFound;
