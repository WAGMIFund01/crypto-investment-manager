interface ManagerAccessButtonProps {
  onClick: () => void;
}

export function ManagerAccessButton({ onClick }: ManagerAccessButtonProps) {
  return (
    <div className="absolute bottom-8 right-8">
      <button
        onClick={onClick}
        className="bg-[#00d4aa] hover:bg-[#00e6b8] text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#00d4aa]/25 transform hover:-translate-y-0.5"
        style={{
          background: 'linear-gradient(135deg, #00d4aa 0%, #00e6b8 100%)',
          boxShadow: '0 10px 25px rgba(0, 212, 170, 0.3)'
        }}
      >
        Manager Access
      </button>
    </div>
  );
}
