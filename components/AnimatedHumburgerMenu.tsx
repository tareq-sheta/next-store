import { FC } from "react";

interface AnimatedHamburgerProps {
  isOpen: boolean;
  onClick: () => void;
  reference?: React.Ref<HTMLButtonElement>;
}

export const AnimatedHamburger: FC<AnimatedHamburgerProps> = ({
  isOpen,
  onClick,
  reference,
}) => {
  return (
    <button
      className="lg:hidden p-1.5 sm:p-2 text-gray-700 hover:text-gray-900 focus:outline-none shrink-0"
      type="button"
      ref={reference}
      onClick={onClick}
      aria-label="Toggle menu"
      aria-expanded={isOpen}
    >
      <div className="w-5 h-5 sm:w-6 sm:h-6 flex flex-col justify-center items-center relative">
        {/* Top Line */}
        <span
          className={`absolute w-5 sm:w-6 h-0.5 bg-current transition-all duration-300 ease-out origin-center ${
            isOpen ? "rotate-45 translate-y-0" : "rotate-0 -translate-y-1.5"
          }`}
        />

        {/* Middle Line */}
        <span
          className={`absolute w-5 sm:w-6 h-0.5 bg-current transition-all duration-300 ease-out ${
            isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
          }`}
        />

        {/* Bottom Line */}
        <span
          className={`absolute w-5 sm:w-6 h-0.5 bg-current transition-all duration-300 ease-out origin-center ${
            isOpen ? "-rotate-45 translate-y-0" : "rotate-0 translate-y-1.5"
          }`}
        />
      </div>
    </button>
  );
};
