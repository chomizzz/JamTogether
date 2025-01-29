import ReactOnRails from 'react-on-rails';
import FirstComponent from "../components/FirstComponent";
import JoinRoom from "../components/JoinRoom";

// Export nécessaire pour le server-side rendering
export default { FirstComponent, JoinRoom };

ReactOnRails.register({
  FirstComponent, JoinRoom
});