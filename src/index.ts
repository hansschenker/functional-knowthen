import hh from 'hyperscript-helpers';
import { h, diff, patch, VNode } from 'virtual-dom';
import createElement from 'virtual-dom/create-element';

const { div, button } = hh(h);

type State = {
    count: number;
}
const initialState:State = { count: 0 };

// rename of dispatch function
// DOM update is side effect
type Notification = (msg:CountEvent, state:State) => void;
type ViewChange = (notify:Notification, state:State) => VNode;
function viewChange(notify: Notification, state:State):VNode {
  return div([
    div({ className: 'mv2' }, `Count: ${state.count}`),
    button({ className: 'pv1 ph2 mr2', 
      onclick: () => notify({kind:'add'}, state) }, '+'),
    button({ className: 'pv1 ph2',
      onclick: () => notify({kind:'subtract'}, state) }, '-'),
  ]);
}


interface AddEvent { kind:'add' }
interface SubtractEvent { kind:'subtract' }
type CountEvent = AddEvent | SubtractEvent

// rename of update function -> state change is side effect
type StateChange = (evt:CountEvent, state:State) => State;
function stateChange(evt:CountEvent, state:State):State {
  switch (evt.kind) {
    case "add":
      return {...state, count: state.count + 1};
    case "subtract": 
    return {...state, count: state.count - 1};
    default:
      return state;
  }
}

// impure code below
// what is the Typescript type of viewChange?   
function app(initialState:State, stateChange:StateChange, viewChange:ViewChange, appNode:HTMLElement): void {
 
    // initial render of root node
  let state = initialState;
  let currentVNode = viewChange(notifyViewChange, state)  as VNode;
  let rootNode = createElement(currentVNode);
  appNode.appendChild(rootNode);
 
  // subsequent rendering
  function notifyViewChange(msg:CountEvent){
    // update model according to msg
    state = stateChange(msg, state);
    // update view according to model
    const updatedView = viewChange(notifyViewChange, state);
    // patch rootNode with diff between currentVNode and updatedView 
    const patches = diff(currentVNode, updatedView);
    rootNode = patch(rootNode, patches);
    currentVNode = updatedView;
  }
} 

const appNode = document.getElementById('app');

// handle side effects with app function (state update and DOM update)
app(initialState, stateChange, viewChange, appNode);
