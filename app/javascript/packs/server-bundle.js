import ReactOnRails from 'react-on-rails';
import FirstComponent from "../components/FirstComponent";
import JoinRoom from "../components/JoinRoom";
import Play from "../components/Play";

// Export nécessaire pour le server-side rendering
export default { FirstComponent, JoinRoom, Play };

ReactOnRails.register({
  FirstComponent, JoinRoom, Play,
});