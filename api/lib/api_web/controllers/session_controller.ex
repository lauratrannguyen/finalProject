# BASED ON NAT TUCK'S GITHUB, and other homeworks
defmodule ApiWeb.SessionController do
  use ApiWeb, :controller

  def create(conn, %{"email" => email, "password" => password}) do
    authenticated_user = Api.Users.authenticate(email, password)

    if authenticated_user do
      session = %{
        token: Phoenix.Token.sign(conn, "user_id", authenticated_user.id),
        name: authenticated_user.name,
        user_email: authenticated_user.email,
        id: authenticated_user.id,
      }

      conn 
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        :created,
        Jason.encode!(%{session: session})
      )
    else 
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        :unauthorized,
        Jason.encode!(%{error: "error"})
      )
    end
  end
end