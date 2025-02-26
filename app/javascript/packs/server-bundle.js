import ReactOnRails from 'react-on-rails';
import FirstComponent from "../components/FirstComponent";
import JoinRoom from "../components/JoinRoom";
import Play from "../components/Play";
import Parameters from '../components/Parameters';
import PianoRoll from '../components/PianoRoll';
import Sheet from '../components/Sheet';
// Export nécessaire pour le server-side rendering
export default { FirstComponent, JoinRoom, Play, Parameters, Sheet };

ReactOnRails.register({
  FirstComponent, JoinRoom, Play, Parameters, PianoRoll, Sheet
});
