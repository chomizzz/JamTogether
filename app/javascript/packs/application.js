/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

// Uncomment to copy all static images under ./images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('./images', true)
// const imagePath = (name) => images(name, true)
import "@hotwired/turbo-rails"
import ReactOnRails from 'react-on-rails';
import FirstComponent from '../components/FirstComponent';
import JoinRoom from '../components/JoinRoom';
import Play from '../components/Play';
import Parameters from '../components/Parameters';
import PianoRoll from '../components/PianoRoll';
import Sheet from "../components/Sheet";
import Draggable from "../components/Draggable";
import Droppable from "../components/Droppable";
import "./remove_error";


ReactOnRails.register({ FirstComponent, JoinRoom, Play, Parameters, PianoRoll, Sheet, Draggable, Droppable });

