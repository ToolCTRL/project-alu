import { Outlet } from "react-router";

export default function WorkflowEngineView() {
  return (
    <div className="relative z-0 flex-1 overflow-hidden pb-10 text-white">
      <div className="relative mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
}
