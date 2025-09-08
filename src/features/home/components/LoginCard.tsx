interface LoginCardProps {
  investorId: string;
  setInvestorId: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function LoginCard({ investorId, setInvestorId, isLoading, onSubmit }: LoginCardProps) {
  return (
    <div className="w-full max-w-xs">
      <div 
        className="bg-[#181a20] rounded-3xl p-8 shadow-2xl border border-[#333] backdrop-blur-sm"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        }}
      >
        <h2 className="text-xl font-bold text-white text-center mb-8">
          Investor Login
        </h2>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="investorId" className="block text-white text-sm font-semibold mb-3">
              Investor ID
            </label>
            <input
              type="text"
              id="investorId"
              value={investorId}
              onChange={(e) => setInvestorId(e.target.value)}
              placeholder="Enter your Investor ID"
              className="w-full px-4 py-3 bg-[#22252c] border border-[#444] rounded-xl text-white placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#00d4aa] focus:border-transparent transition-all duration-300"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !investorId.trim()}
            className="w-full bg-[#00d4aa] hover:bg-[#00e6b8] disabled:bg-[#666] disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#00d4aa]/25 transform hover:-translate-y-0.5"
            style={{
              background: isLoading || !investorId.trim() ? '#666' : 'linear-gradient(135deg, #00d4aa 0%, #00e6b8 100%)',
              boxShadow: isLoading || !investorId.trim() ? 'none' : '0 10px 25px rgba(0, 212, 170, 0.3)'
            }}
          >
            {isLoading ? 'Accessing...' : 'Access Portfolio'}
          </button>
        </form>
        
        <p className="text-center text-[#888] text-xs mt-6 leading-relaxed">
          Don&apos;t have your Investor ID? Contact your fund manager for access credentials.
        </p>
      </div>
    </div>
  );
}