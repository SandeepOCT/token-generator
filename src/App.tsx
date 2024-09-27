import "./App.css";
import Form from "./components/Form";
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <AppProvider>
      <h1>Token Generator</h1>
      <Form />
    </AppProvider>
  );
}

export default App;
