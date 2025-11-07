import MinusIcon from "../icons/MInusIcon";
import PlusIcon from "../icons/PlusIcon";

export default function Counter({ count, onDecrease, onIncrease }) {
  return (
    <div className="counter-container mb-3">
      <button
        className="counter-button text-white fs-5 p-1"
        onClick={onDecrease}
        aria-label="Decrease"
        disabled={count <= 1} // Prevent going below 1
      >
        <MinusIcon />
      </button>

      <span className="counter-display">{count}</span>

      <button
        className="counter-button text-white fs-5 p-1"
        onClick={onIncrease}
        aria-label="Increase"
      >
        <PlusIcon />
      </button>
    </div>
  );
}
