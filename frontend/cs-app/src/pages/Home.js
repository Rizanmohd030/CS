import React from 'react'; // Add this import
import DisplayBoard from "../components/DisplayBoard/Displayboard.js";

function Home() {
  return (
    <DisplayBoard title="Construction Site Dashboard">
      <div className="home-content">
        <h1>Construction Site Management</h1>
        <p>Welcome to the smart construction AI system.</p>
        
        {/* Add your dashboard components here */}
        <div className="dashboard-widgets">
          {/* Example widgets - replace with your actual components */}
          <div className="widget">Project Timeline</div>
          <div className="widget">Safety Alerts</div>
          <div className="widget">Resource Allocation</div>
        </div>
      </div>
    </DisplayBoard>
  );
}

export default Home;