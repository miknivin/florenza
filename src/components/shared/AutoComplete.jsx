"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

export default function Autocomplete({
  id,
  label,
  options,
  value,
  onChange,
  disabled,
  placeholder,
  autoComplete,
  error,
  isFloating = false,
  getOptionLabel = (option) => option.name || "",
  getOptionValue = (option) => option.name || "",
}) {
  const [inputValue, setInputValue] = useState(value || "");
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const filteredOptions = useMemo(() => {
    if (!inputValue) {
      return options;
    }
    return options.filter((option) =>
      getOptionLabel(option).toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, options, getOptionLabel]);

  // Determine dropdown position
  useEffect(() => {
    if (isOpen && dropdownRef.current && inputRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const dropdownHeight = dropdownRef.current.offsetHeight;
      const spaceBelow = windowHeight - inputRect.bottom;
      const spaceAbove = inputRect.top;

      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
  }, [isOpen, filteredOptions]);

  const handleOptionSelect = useCallback(
    (option) => {
      const optionValue = getOptionValue(option);
      setInputValue(getOptionLabel(option)); // Set input to the option's label
      onChange(optionValue);
      setIsOpen(false);
    },
    [onChange, getOptionValue, getOptionLabel]
  );

  const handleInputChange = useCallback(
    (e) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      setIsOpen(!!newValue);

      const exactMatch = options.find(
        (option) =>
          getOptionLabel(option).toLowerCase() === newValue.toLowerCase()
      );
      if (exactMatch) {
        handleOptionSelect(exactMatch);
      }
    },
    [options, getOptionLabel, handleOptionSelect]
  );

  const handleInputFocus = useCallback(() => {
    setIsOpen(!!inputValue || options.length > 0); // Open dropdown on focus
  }, [inputValue, options]);

  const renderInput = () => (
    <>
      <input
        id={id}
        type="text"
        className="form-control"
        placeholder={isFloating ? label : placeholder} // Use label as placeholder for floating
        autoComplete={autoComplete}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        disabled={disabled}
        ref={inputRef}
      />
      {label && (
        <label htmlFor={id} className={`form-label`}>
          {label}
        </label>
      )}
    </>
  );

  return (
    <div
      className={`woocomerce__checkout-rformfield ${
        isFloating ? "form-floating" : ""
      }`}
      style={{ position: "relative" }}
    >
      {isFloating ? (
        <>{renderInput()}</>
      ) : (
        <>
          {label && (
            <label
              htmlFor={id}
              className={`form-label ${!label ? "py-2" : ""}`}
            >
              {label}
            </label>
          )}
          <input
            id={id}
            type="text"
            className="form-control"
            placeholder={placeholder}
            autoComplete={autoComplete}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            disabled={disabled}
            ref={inputRef}
          />
        </>
      )}
      {isOpen && filteredOptions.length > 0 && (
        <ul
          ref={dropdownRef}
          className="dropdown-menu show"
          style={{
            position: "absolute",
            zIndex: 1000,
            width: "100%",
            maxHeight: "200px",
            overflowY: "auto",
            borderColor: "#dee2e6",
            backgroundColor: "rgb(235 235 235)",
            color: "#212529",
            top: dropdownPosition === "bottom" ? "100%" : "auto",
            bottom: dropdownPosition === "top" ? "100%" : "auto",
          }}
        >
          {filteredOptions.map((option) => (
            <li
              key={getOptionValue(option)}
              className="dropdown-item"
              onClick={() => handleOptionSelect(option)}
              style={{
                cursor: "pointer",
                backgroundColor:
                  getOptionValue(option) === value ? "#f8f9fa" : "transparent",
                color: "#212529",
              }}
            >
              {getOptionLabel(option)}
            </li>
          ))}
        </ul>
      )}
      {error && (
        <span className="warning_text text-danger" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
