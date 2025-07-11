type Ok<T> = { type: 'ok'; value: T }
type Err<E> = { type: 'error'; error: E }
type Result<T, E = Error> = Ok<T> | Err<E>
