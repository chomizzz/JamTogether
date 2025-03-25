import ReactOnRails from 'react-on-rails';
import FirstComponent from "../components/FirstComponent";
import JoinRoom from "../components/JoinRoom";
import Play from "../components/Play";
import Parameters from '../components/Parameters';
import PianoRoll from '../components/PianoRoll';
import Sheet from '../components/Sheet';
import Draggable from "../components/Draggable";
import Droppable from "../components/Droppable";
import DraggableResizable from '../components/DraggableResizable';
// Export nécessaire pour le server-side rendering
export default { FirstComponent, JoinRoom, Play, Parameters, Sheet, Draggable, Droppable, DraggableResizable };

ReactOnRails.register({
  FirstComponent, JoinRoom, Play, Parameters, PianoRoll, Sheet, Draggable, Droppable, DraggableResizable
});
