class SpotifyController < ApplicationController
  def index
    if SpotifyUser.exists?
      @users = SpotifyUser.all
    else
      @users = nil
    end
  end

  def refresh
    directory_path = Rails.root.join("lib", "data", "spotify")

    @folders = Dir.entries(directory_path).select do |entry|
      next false if entry == "." || entry == ".."

      unless SpotifyUser.exists?(name: entry)
        new_user = SpotifyUser.new(name: entry)
        new_user.save
        new_user_path = Rails.root.join("lib", "data", "spotify", entry)

        @files = Dir.entries(new_user_path).select do |files_entry|
          if files_entry =~ /\AStreaming_History_Audio_/
            file_path = File.join(new_user_path, files_entry)
            data_file = JSON.parse(File.read(file_path))
            data_file.each do |music|
              new_music_data = SpotifyDatum.new(spotify_user_id: new_user.id, **music)
              new_music_data.save
            end
          end
        end
      end
    end
    redirect_to spotify_index_path
  end

  def show
    @user = SpotifyUser.find(params[:id])
    @top1_artist = SpotifyDatum.where(user_id: @user.id).group(:platform)
            .order("COUNT(name) DESC")
            .limit(1)
            .count
  end
end
