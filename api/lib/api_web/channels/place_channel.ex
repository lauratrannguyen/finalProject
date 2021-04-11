# BASED ON NAT TUCK'S GITHUB, and other homeworks
defmodule ApiWeb.PlaceChannel do
  use ApiWeb, :channel

  alias Api.Places
  alias Api.Comments
  alias ApiWeb.CommentView

  @impl true
  def join("place:" <> place_id, _payload, socket) do
    user_id = socket.assigns.user_id
    if authorized?(user_id) do
      place = Places.get_place(place_id)
      socket = assign(socket, :user_id, user_id)
      socket = assign(socket, :place_id, place_id)

      comments_view = CommentView.render("index.json", comments: place.comments)

      {:ok, comments_view, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  @impl true
  def handle_in("userComment", %{"body" => body}, socket) do
    user_id = socket.assigns[:user_id]
    place_id = socket.assigns[:place_id]
    place = Places.get_place(place_id);

    comment_params = %{"body" => body, "place_id" => place_id, "user_id" => user_id}
    Comments.create_comment(comment_params)
    comments_view = CommentView.render("index.json", comments: place.comments)

    broadcast(socket, "userComment", comments_view)

    {:reply, {:ok, comments_view}, socket}
  end

  @impl true
  def handle_in("removeComment", _payload, socket) do
    place_id = socket.assigns[:place_id]
    place = Places.get_place(place_id);
    
    comments_view = CommentView.render("index.json", comments: place.comments)

    broadcast(socket, "removeComment", comments_view)

    {:reply, {:ok, comments_view}, socket}
  end

  def authorized?(user_id) do
    if user_id do
      true
    else
      false
    end
  end
end
