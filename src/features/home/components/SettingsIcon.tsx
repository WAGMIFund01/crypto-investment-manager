export function SettingsIcon() {
  return (
    <div className="absolute top-6 right-6 z-10">
      <div className="w-10 h-10 bg-[#2a2a2a] border border-[#444] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#3a3a3a] transition-all duration-300 shadow-lg">
        <div className="flex flex-col items-center space-y-1">
          <div className="w-3 h-0.5 bg-white rounded"></div>
          <div className="w-3 h-0.5 bg-white rounded relative">
            <div className="absolute -right-1 top-0 w-1 h-1 bg-white rounded-full"></div>
          </div>
          <div className="w-3 h-0.5 bg-white rounded"></div>
        </div>
      </div>
    </div>
  );
}
