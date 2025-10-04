// components/Employesview.jsx
import Uploadsection from "./Uploadsection";
import EmployDetails from "./EmployDetails";
import Summerybar from "./Summerybar";

const Employesview = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Summary Bar at top */}
      <Summerybar />

      {/* Upload Section */}
      <Uploadsection />

      {/* Employee Details / Form */}
      <EmployDetails />
    </div>
  );
};

export default Employesview;
