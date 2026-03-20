import { Routes, Route } from "react-router-dom";
import ServiceDay from "./pages/ServiceDay";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ServiceDay />} />
      {/* <Route path="service-day" element={<ServiceDay />} />
      <Route path="service-day/:eventId" element={<EventDetailPage />} /> */}
    </Routes>
  );
}

export default App;
