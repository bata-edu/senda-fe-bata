import React from "react";

import { DragAndDrop } from "./DragAndDrop";

export default function App() {
  return (
    <>
      <div className="justify-content-center text-center">
        <div xs={12}>
          <div>
            <div>
              <h2>React DnD Testing</h2>
            </div>
          </div>
        </div>
      </div>

      <DragAndDrop />
    </>
  );
}
