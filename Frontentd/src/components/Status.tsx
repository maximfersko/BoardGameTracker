export const ErrorAlert = ({ message }: { message: string }) =>
  message ? <div className="alert alert-danger">{message}</div> : null;

export const Loading = () => <p>Загрузка...</p>;
