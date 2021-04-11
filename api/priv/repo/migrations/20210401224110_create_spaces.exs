defmodule Api.Repo.Migrations.CreatePlaces do
  use Ecto.Migration

  def change do
    create table(:places) do
      add :latitude, :float, null: false
      add :longitude, :float, null: false
      add :name, :string, null: false
      add :website, :string, default: "", null: false
      add :address, :string, null: false
      add :photo, :text, default: "", null: false
      add :description, :text, null: false
      add :user_id, references(:users, on_delete: :nothing), null: false
      add :availability, {:array, :string}, null: false

      timestamps()
    end

    create index(:places, [:user_id])
  end
  
end
