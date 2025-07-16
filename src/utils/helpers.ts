export const getRedirectUrl = () => {
  return (process.env.NODE_ENV==="production")
    ? `http://doro.study/api/auth`
    : `http://localhost:3000/api/auth`
}
