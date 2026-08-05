function DifficultyButton({ difficulty, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
    w-full
    h-[72px]

    grid
    grid-cols-[42px_1fr_auto]
    items-center

    px-[10px]

    rounded-[10px]

    transition-all
    duration-150

    ${
      active
        ? "bg-[#E0E0E0]"
        : `
                bg-[#F9F9F9]
                hover:bg-[#E0E0E0]
                active:bg-[#CFCFCF]
            `
    }
`}
    >
      {/* Left Icon */}
      <img
        src={difficulty.icon}
        alt={difficulty.label}
        className="
                    w-[30px]
                    h-[30px]
                    object-contain
                "
      />

      {/* Text */}
      <span
        className="
                    ml-1
                    text-[14px]
                    text-black
                    font-poppins
                    text-left
                    whitespace-nowrap
                "
      >
        {difficulty.label}
      </span>

      {/* Stars */}
      <div className="flex items-center justify-end gap-[2px]">
        {Array.from({ length: difficulty.stars }).map((_, index) => (
          <img
            key={index}
            src={difficulty.starIcon}
            alt=""
            className="w-[14px] h-[14px]"
          />
        ))}
      </div>
    </button>
  );
}

export default DifficultyButton;
