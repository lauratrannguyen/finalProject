# BASED ON NAT TUCK'S GITHUB, and other homeworks
defmodule ApiWeb.PlaceController do
  use ApiWeb, :controller

  alias Api.Places
  alias Api.Places.Place

  action_fallback ApiWeb.FallbackController

  plug ApiWeb.Plugs.RequireAuth, "en" when action in [:create, :update, :delete]

  def place_owner?(conn, place) do
    curr_user_id = conn.assigns[:user].id
    owner_user_id = place.user_id
    curr_user_id == owner_user_id
  end

  def index(conn, _params) do
    places = Places.list_places()
    render(conn, "index.json", places: places)
  end

  def create(conn, %{"place" => place_params}) do
    user_id = conn.assigns[:user].id
    place_params = Map.put(place_params, "user_id", user_id)
    with {:ok, %Place{} = place} <- Places.create_place(place_params) do
      place = Places.get_place(place.id)
      IO.inspect place
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.place_path(conn, :show, place))
      |> render("show.json", place: place)
    end
  end

  def show(conn, %{"id" => id}) do
    place = Places.get_place!(id)
    render(conn, "show.json", place: place)
  end

  def update(conn, %{"id" => id, "place" => place_params}) do
    place = Places.get_place!(id)

    if place_owner?(conn, place) do
      with {:ok, %Place{} = place} <- Places.update_place(place, place_params) do
        render(conn, "show.json", place: place)
      end
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

  def delete(conn, %{"id" => id}) do
    place = Places.get_place!(id)

    if place_owner?(conn, place) do
      with {:ok, %Place{}} <- Places.delete_place(place) do
        send_resp(conn, :no_content, "")
      end
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
