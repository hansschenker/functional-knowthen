import h from "hyperscript";
import hh from "hyperscript-helpers";
import { diff, patch } from "virtual-dom";

const { div, h1, p, ul, button, li, a, form, input } = hh(h);

type State = { count: number };
const initialState: State = { count: 0 };



type NotifyChange = (msg: string) => void;
type ViewChange = (notifyChange:NotifyChange,state: State) => any;

function viewChange(notifyChange:any, state: State = initialState)  {
  return div([
    div({ className: "mv2" }, `Count: ${state.count}`),
    button(
      { className: "pv1 ph2 mr2", onclick: () => notifyChange("plus"),  },
      "plus"
    ),
    button(
      { className: "pv1 ph2", onclick: () => notifyChange("minus"),  },
      "minus"
    ),
  ]);
};

// udpate function
type StateChange = (change: string, state: State) => State;
function stateChange(change: string, state: State): State {
  switch (change) {
    case "plus":
      return { ...state, count: state.count + 1 };
    case "sub":
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}

let appNode = document.getElementById("app")!;

// initial render
const app = (
  state: State,
  stateChange: StateChange,
  viewChange: ViewChange,
  node: any
) => {
  let currentState = state;
  let currentView = viewChange(notifyChange,state);
  node.appendChild(currentView);

  // dispatch function causing re-render
  function notifyChange(msg: string)  {
    state = stateChange(msg, state);
    const updatedView = viewChange(notifyChange, state);
    const patches = diff(currentView, updatedView);
    appNode = patch(appNode, patches);
    currentView = updatedView;
  }
};


app(initialState, stateChange, viewChange, appNode);

//rootNode.appendChild(view(initialModel));
