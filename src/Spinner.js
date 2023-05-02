import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";




function Spinner({load}) {
  let [loading, setLoading] = useState(load);
  let [color, setColor] = useState("#ffffff");
  const override = {
    display: "block",
    margin: "0 auto",
    border: "4px solid",
    borderColor: "orange",
  }

  return (
    <div className="sweet-loading">
      {/* <button onClick={() => setLoading(!loading)}>Toggle Loader</button> */}
      {/* <input value={color} onChange={(input) => setColor(input.target.value)} placeholder="Color of the loader" /> */}

      <ClipLoader
        color={color}
        loading={loading}
        cssOverride={override}
        size={100}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}

export default Spinner;
