# BASED ON NAT TUCK'S GITHUB, and other homeworks
defmodule ApiWeb.PlaceView do
  use ApiWeb, :view
  alias ApiWeb.PlaceView

  def render("index.json", %{places: places}) do
    %{data: render_many(places, PlaceView, "no_assoc_show.json")}
  end

  def render("show.json", %{place: place}) do
    %{data: render_one(place, PlaceView, "place.json")}
  end

  def render("no_assoc_show.json", %{place: place}) do
    %{data: render_one(place, PlaceView, "no_assoc.json")}
  end

  def render("place.json", %{place: place}) do
    comments_json = ApiWeb.CommentView.render("index.json", comments: place.comments)

    %{id: place.id,
      name: place.name,
      website: place.website,
      address: place.address,
      photo: place.photo,
      description: place.description,
      latitude: place.latitude,
      longitude: place.longitude,
      comments: comments_json,
      availability: place.availability}
  end

  def render("no_assoc.json", %{place: place}) do
    %{id: place.id,
      name: place.name,
      description: place.description,
      latitude: place.latitude,
      longitude: place.longitude}
  end
end
