
interface TabNavigationProps {
  activeTab: number;
  setActiveTab: (index: number) => void;
}

export default function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  const tabs = ['Expenses', 'Budget', 'Insights'];
  
  return (
    <div className="flex rounded-md overflow-hidden mb-6">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            activeTab === index ? 'tab-active' : 'tab-inactive'
          }`}
          onClick={() => setActiveTab(index)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
