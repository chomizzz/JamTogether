class AddTsToSpotifyDatum < ActiveRecord::Migration[8.0]
  def change
    add_column :spotify_data, :ts, :datetime
  end
end
