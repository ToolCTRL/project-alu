import { useState } from "react";
import Tabs from "./Tabs";

export default function PreviewTabsAsButtons() {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="w-full space-y-2">
      <Tabs
        asLinks={false}
        selectedTab={selectedTab}
        onSelected={(selected) => {
          setSelectedTab(selected);
        }}
        className="w-full sm:w-auto"
        tabs={[{ name: "Tab 1" }, { name: "Tab 2" }, { name: "Tab 3" }]}
      />
      <div className="border-border bg-secondary/90 border p-2">
        {(() => {
          if (selectedTab === 0) {
            return <div>Tab 1 Content...</div>;
          } else if (selectedTab === 1) {
            return <div>Tab 2 Content...</div>;
          } else {
            return <div>Tab 3 Content...</div>;
          }
        })()}
      </div>
    </div>
  );
}
