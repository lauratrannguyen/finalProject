defmodule Api.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :email, :text
    field :name, :text
    field :password_hash, :text

    has_many :places, Api.Places.Place
    has_many :comments, Api.Comments.Comment

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name, :email])
    |> hash_password(attrs["password"])
    |> validate_password(attrs["password"])
    |> validate_required([:name, :email, :password_hash])
    |> unique_constraint(:email)
  end

  # BASED ON NAT TUCK'S GITHUB
  # Get password
  def hash_password(changeset, password) do
    if password do
      change(changeset, Argon2.add_hash(password))
    else
      changeset
    end
  end

  def validate_password(changeset, password) do
    if String.length(password) < 6 do
      add_error(changeset, :password, "Password needs to be at least 6 characters")
    else
      changeset
    end
  end
  
end
